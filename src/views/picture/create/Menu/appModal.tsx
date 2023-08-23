import {
    CardContent,
    IconButton,
    Modal,
    Divider,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Button,
    Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, useRef } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { t } from 'hooks/web/useI18n';
import { executeMarket } from 'api/template/fetch';
import { listMarketAppOption, marketDeatail } from 'api/template';
import Perform from 'views/template/carryOut/perform';
import _ from 'lodash-es';
interface Details {
    name?: string;
    description?: string;
    categories?: string[];
    scenes?: string[];
    tags?: string[];
    example?: string;
    viewCount?: string;
    likeCount?: string;
    installCount?: string;
    uid?: string;
    version?: number;
    installStatus?: any;
    workflowConfig: { steps: any[] };
}
interface Execute {
    index: number;
    stepId: string;
    steps: any;
}
const AppModal = ({
    open,
    tags,
    title,
    value,
    setOpen,
    emits
}: {
    open: boolean;
    tags: string[];
    title: string;
    value: string | undefined;
    setOpen: (data: boolean) => void;
    emits: (data: any) => void;
}) => {
    useEffect(() => {
        if (open && tags.length > 0) {
            const fn = async () => {
                const res = await listMarketAppOption({ tags });
                setAppList(res);
            };
            fn();
        }
    }, [open, tags]);
    const [appValue, setAppValue] = useState('');
    const [appList, setAppList] = useState<any[]>([]);
    const [detail, setDetail] = useState<Details>({
        workflowConfig: {
            steps: []
        }
    });
    const detailRef: any = useRef(null);
    const [loadings, setLoadings] = useState<any[]>([]);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (appList.length > 0) {
            setAppValue(appList[0].value);
            getDetail(appList[0].value);
        }
    }, [appList]);
    //点击获取执行详情
    const getDetail = async (data: string) => {
        const res = await marketDeatail({ uid: data });
        detailRef.current = _.cloneDeep(res);
        const newValue = _.cloneDeep(res);
        newValue.workflowConfig.steps[newValue.workflowConfig.steps.length - 1].variable.variables.forEach((item: any) => {
            if (item.defaultValue && !item.value) {
                item.value = item.defaultValue;
            }
            if (item.field === 'CONTENT') {
                item.value = value;
            }
        });
        console.log(newValue.workflowConfig.steps[0].variable.variables);

        detailRef.current = newValue;
        setDetail(newValue);
    };
    //更改answer
    const changeanswer = ({ value, index }: any) => {
        const newValue = _.cloneDeep(detail);
        if (newValue.workflowConfig) {
            newValue.workflowConfig.steps[index].flowStep.response.answer = value;
        }
        detailRef.current = newValue;
        setDetail(newValue);
    };
    //设置执行的步骤的模型
    const exeChange = ({ e, steps, i }: any) => {
        const newValue = _.cloneDeep(detail);
        if (newValue.workflowConfig) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        }
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    //设置执行步骤的参数
    const promptChange = async ({ e, steps, i, flag = false }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        if (flag) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        } else {
            newValue.workflowConfig.steps[steps].flowStep.variable.variables[i].value = e.value;
        }
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    //是否全部执行
    let isAllExecute = false;
    //绘话id
    let conversationUid: undefined | string = undefined;
    //执行
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        const newValue = [...loadings];
        newValue[index] = true;
        if (!isAllExecute) {
            setLoadings(newValue);
        } else {
            const value: any[] = [];
            for (let i = index; i < detail.workflowConfig.steps.length; i++) {
                value[i] = true;
            }
            setLoadings(value);
        }
        const fetchData = async () => {
            let resp: any = await executeMarket({
                appUid: detail.uid,
                stepId: stepId,
                appReqVO: detailRef.current,
                scene: 'OPTIMIZE_PROMPT',
                conversationUid
            });

            const contentData = _.cloneDeep(detailRef.current);
            contentData.workflowConfig.steps[index].flowStep.response.answer = '';
            detailRef.current = _.cloneDeep(contentData);
            setDetail(contentData);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (textDecoder.decode(value).includes('2008002007')) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: t('market.error'),
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    return;
                }
                if (done) {
                    if (
                        isAllExecute &&
                        index < detail.workflowConfig.steps.length - 1 &&
                        detail.workflowConfig.steps[index + 1].flowStep.response.style !== 'BUTTON'
                    ) {
                        changeData({
                            index: index + 1,
                            stepId: detail.workflowConfig.steps[index + 1].field,
                            steps: detail.workflowConfig.steps[index + 1]
                        });
                    }
                    break;
                }
                const newValue1 = [...loadings];
                newValue1[index] = false;
                setLoadings(newValue1);
                let str = textDecoder.decode(value);
                const lines = str.split('\n');
                lines.forEach((message, i: number) => {
                    if (i === 0 && joins) {
                        message = joins + message;
                        joins = undefined;
                    }
                    if (i === lines.length - 1) {
                        if (message && message.indexOf('}') === -1) {
                            joins = message;
                            return;
                        }
                    }
                    let bufferObj;
                    if (message?.startsWith('data:')) {
                        bufferObj = message.substring(5) && JSON.parse(message.substring(5));
                    }
                    if (bufferObj?.code === 200) {
                        if (!conversationUid && index === 0 && isAllExecute) {
                            conversationUid = bufferObj.conversationUid;
                        }
                        const contentData1 = _.cloneDeep(contentData);
                        contentData.workflowConfig.steps[index].flowStep.response.answer =
                            contentData.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        contentData1.workflowConfig.steps[index].flowStep.response.answer =
                            contentData.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        detailRef.current = _.cloneDeep(contentData1);
                        setDetail(contentData1);
                    } else if (bufferObj && bufferObj.code !== 200) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.warning'),
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        );
                    }
                });
                outerJoins = joins;
            }
        };
        fetchData();
    };
    return (
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <MainCard
                sx={{ width: { md: '800px', xs: '90%' } }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    overflowY: 'auto',
                    maxHeight: '80%'
                }}
                title={title}
                content={false}
                secondary={
                    <IconButton
                        onClick={() => {
                            setOpen(false);
                        }}
                        size="large"
                        aria-label="close modal"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '0 16px !important' }}>
                    <FormControl color="secondary" fullWidth sx={{ my: 2 }}>
                        <InputLabel id="appList">优化选择</InputLabel>
                        <Select
                            color="secondary"
                            labelId="appList"
                            name="appValue"
                            value={appValue}
                            label="优化选择"
                            onChange={(e) => {
                                setAppValue(e.target.value);
                                getDetail(e.target.value);
                            }}
                        >
                            {appList.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Perform
                        config={_.cloneDeep(detailRef.current?.workflowConfig)}
                        changeSon={changeData}
                        changeanswer={changeanswer}
                        loadings={loadings}
                        variableChange={exeChange}
                        promptChange={promptChange}
                        isallExecute={(flag: boolean) => {
                            isAllExecute = flag;
                        }}
                        source="myApp"
                    />
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end" alignItems="center">
                        {error && (
                            <Typography color="error" mr={1}>
                                (无AI结果，无法插入)
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                if (
                                    !detailRef.current.workflowConfig.steps[detailRef.current.workflowConfig.steps.length - 1]?.flowStep
                                        .response.answer
                                ) {
                                    setError(true);
                                } else {
                                    emits(
                                        detailRef.current.workflowConfig.steps[detailRef.current.workflowConfig.steps.length - 1]?.flowStep
                                            .response.answer
                                    );
                                }
                            }}
                        >
                            确认
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
export default AppModal;
