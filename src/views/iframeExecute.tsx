import Perform from './template/carryOut/perform';
import { Card, Box, Chip, Divider, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import { executeApp } from 'api/template/fetch';
import { getApp } from 'api/template/index';

import _ from 'lodash-es';
import { t } from 'hooks/web/useI18n';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
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
const IframeExecute = () => {
    const [detail, setDetail] = useState<Details>({
        workflowConfig: {
            steps: []
        }
    });
    const detailRef: any = useRef(null);
    const [loadings, setLoadings] = useState<any[]>([]);
    //类别列表
    const [categoryList, setCategoryList] = useState<any[]>([]);
    useEffect(() => {
        getList();
    }, []);
    const getList = () => {
        getApp({ uid: 'bda74700793b4a0faddc5df215ed1027' }).then((res: any) => {
            detailRef.current = _.cloneDeep(res);
            setDetail(res);
        });
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
            let resp: any = await executeApp({
                appUid: 'bda74700793b4a0faddc5df215ed1027',
                stepId: stepId,
                appReqVO: detailRef.current,
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
        <Card elevation={2} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccessAlarm sx={{ fontSize: '70px' }} />
                    <Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                {detail?.name}
                            </Typography>
                        </Box>
                        <Box>
                            {detail?.categories?.map((item: any) => (
                                <span key={item}>#{categoryList?.find((el: { code: string }) => el.code === item)?.name}</span>
                            ))}
                            {detail?.tags?.map((el: any) => (
                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                {detail?.description}
            </Typography>
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
        </Card>
    );
};
export default IframeExecute;
