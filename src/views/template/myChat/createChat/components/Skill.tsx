import { InboxOutlined } from '@ant-design/icons';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Link,
    MenuItem,
    Modal,
    Select,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { Popover, Upload, UploadProps } from 'antd';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import React, { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import { TabsProps } from 'types';
import MainCard from 'ui-component/cards/MainCard';
import { IChatInfo } from '../index';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getAppList, getSkillList, getSysList, skillCreate } from 'api/chat';
import Template from '../../components/template';
import { useLocation, useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const QAModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const theme = useTheme();
    const [valueLabel, setValueLabel] = useState('checked');
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { Dragger } = Upload;

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
            } else if (status === 'error') {
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="添加问答"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <>
                        <Tabs
                            value={value}
                            variant="scrollable"
                            onChange={handleChange}
                            sx={{
                                mb: 3,
                                '& a': {
                                    minHeight: 'auto',
                                    minWidth: 10,
                                    py: 1.5,
                                    px: 1,
                                    mr: 2.2,
                                    color: theme.palette.grey[600],
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                '& a.Mui-selected': {
                                    color: theme.palette.primary.main
                                },
                                '& a > svg': {
                                    mb: '0px !important',
                                    mr: 1.1
                                }
                            }}
                        >
                            <Tab component={Link} label="批量上传" {...a11yProps(0)} />
                            <Tab component={Link} label="输入问答" {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <div className="text-sm text-[#9da3af]">
                                <a className="text-[#673ab7]">点击此处下载模板</a> 完成填写后再上传，问题总数不超过条10000条
                            </div>
                            <div className="mt-3">
                                <Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined rev={undefined} />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                                        files.
                                    </p>
                                </Dragger>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <TextField label={'问题'} fullWidth />
                            <TextField label={'回答'} className={'mt-3'} fullWidth multiline minRows={6} />
                        </TabPanel>
                    </>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const ApiModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const [selectType, setSelectType] = useState(1);

    const formik = useFormik({
        initialValues: {
            name: '',
            des: '',
            tips: '',
            type: ''
        },
        validationSchema: yup.object({
            name: yup.string().required('标题是必填的'),
            des: yup.string().max(150000, '文本过长、请减少到150000字以内').required('内容是必填的')
        }),
        onSubmit: (values) => {}
    });

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="编辑技能"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label={'技能名称'}
                                    fullWidth
                                    id="name"
                                    name="name"
                                    color="secondary"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label={'技能描述'}
                                    fullWidth
                                    id="des"
                                    name="des"
                                    color="secondary"
                                    value={formik.values.des}
                                    onChange={formik.handleChange}
                                    error={formik.touched.des && Boolean(formik.errors.des)}
                                    helperText={formik.touched.des && formik.errors.des}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label={'提示文案'}
                                    fullWidth
                                    id="tips"
                                    name="tips"
                                    color="secondary"
                                    value={formik.values.tips}
                                    onChange={formik.handleChange}
                                    error={formik.touched.tips && Boolean(formik.errors.tips)}
                                    helperText={formik.touched.tips && formik.errors.tips}
                                />
                            </Grid>
                        </Grid>
                        <FormControl fullWidth sx={{ mt: 4 }}>
                            <InputLabel color="secondary" id="type">
                                技能类型
                            </InputLabel>
                            <Select
                                labelId="type"
                                name="type"
                                color="secondary"
                                value={''}
                                onChange={formik.handleChange}
                                label={'技能类型'}
                            >
                                <MenuItem key={1} value={1}>
                                    系统
                                </MenuItem>
                                <MenuItem key={2} value={2}>
                                    应用
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const ApiListModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const appId = searchParams.get('appId');

    const [list, setList] = useState<any[]>([]);
    const [selectType, setSelectType] = useState(1);

    useEffect(() => {
        (async () => {
            const sysList = await getSysList();
            const myAppList = await getAppList();
            const data = sysList?.map((item: any) => ({
                name: item.name,
                description: item.desc,
                images: item.icon,
                code: item.code,
                type: item.type
            }));
            setList([...data, ...myAppList.list]);
        })();
    }, []);

    const filterList = React.useMemo(() => {
        if (list.length) {
            if (selectType === 1) {
                return list;
            }
            if (selectType === 2) {
                return list.filter((item) => item.type === 'system');
            }
            if (selectType === 3) {
                return list.filter((item) => item.type === 'MYSELF');
            }
        }
    }, [selectType, list]);

    const handleCreate = async (item: any) => {
        let data: any = {};
        data.appConfigId = appId;
        data.type = item.type === 'system' ? 5 : 3;
        data.disabled = true;
        if (data.type === 5) {
            data.systemHandlerSkillDTO = {
                name: item.name,
                desc: item.description,
                code: item.code
            };
        }
        if (data.type === 3) {
            data.appWorkflowSkillDTO = {
                name: item.name,
                desc: item.description,
                defaultPromptDesc: '',
                skillAppUid: item.uid
            };
        }

        await skillCreate(data);
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '750px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="编辑技能"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Stack direction="row" spacing={1} className="mb-3">
                        <Chip
                            label="全部"
                            color={selectType === 1 ? 'secondary' : 'default'}
                            variant="filled"
                            className="w-[80px] cursor-pointer"
                            onClick={() => setSelectType(1)}
                        />
                        <Chip
                            label="系统"
                            color={selectType === 2 ? 'secondary' : 'default'}
                            variant="filled"
                            className="w-[80px] cursor-pointer"
                            onClick={() => setSelectType(2)}
                        />
                        <Chip
                            label="我的应用"
                            color={selectType === 3 ? 'secondary' : 'default'}
                            variant="filled"
                            className="w-[80px] cursor-pointer"
                            onClick={() => setSelectType(3)}
                        />
                    </Stack>
                    <div className="grid gap-4 grid-cols-3 h-[400px] overflow-y-auto">
                        {filterList?.map((item: any, index: number) => (
                            <Box key={index} className="w-full relative">
                                <Template data={item} handleDetail={() => null} />
                                <Button
                                    size={'small'}
                                    color="secondary"
                                    className="absolute bottom-2 right-2"
                                    onClick={() => handleCreate(item)}
                                >
                                    添加
                                </Button>
                            </Box>
                        ))}
                    </div>
                </CardContent>
                <Divider />
                {/* <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions> */}
            </MainCard>
        </Modal>
    );
};

export const Skill = ({ chatBotInfo, setChatBotInfo }: { chatBotInfo: IChatInfo; setChatBotInfo: (chatInfo: IChatInfo) => void }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId');

    const [qaVisible, setQaVisible] = useState(false);
    const [apiVisible, setApiVisible] = useState(false);

    const [isValid, setIsValid] = useState(true);
    const [websiteCount, setWebsiteCount] = useState(0);
    const [apiListVisible, setApiListVisible] = useState(false);

    const [apiList, setApiList] = useState<any[]>([]);

    useEffect(() => {
        getSkillList(appId || '').then((res) => {
            const mergedArray = [...res['3'], ...res['5']];
            setApiList(mergedArray);
        });
    }, []);
    console.log(apiList, 'apiList');

    useEffect(() => {
        if (chatBotInfo.searchInWeb) {
            const websites = chatBotInfo.searchInWeb
                .trim()
                .split('\n')
                .map((item) => item.trim());
            // 简单验证每个网站地址
            const isValidInput =
                websites.every((website) => /^(https?:\/\/)?([\w.-]+\.[a-z]{2,6})(:[0-9]{1,5})?([/\w.-]*)*\/?$/.test(website)) &&
                websites.length < 11;
            setIsValid(isValidInput);
            // 设置网站地址的数量
            setWebsiteCount(websites.length);
        }
    }, [chatBotInfo.searchInWeb]);

    return (
        <div>
            <div>
                <div className="mt-5">
                    <div>
                        <div className="flex items-start flex-col ">
                            <div className="flex items-center">
                                <span
                                    className={
                                        "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                    }
                                >
                                    从网络搜索中学习
                                </span>
                                <Tooltip
                                    title={
                                        <div>
                                            能够从互联网上收集实时信息，你可以问机器人最新的信息。如：
                                            <p>今天杭州天气怎么样？</p>
                                            <p>帮我搜下今天苹果的新闻。</p>
                                            <p>帮我搜索下关于亚运会的照片。</p>
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className={'text-#697586'}>{chatBotInfo.enableSearchInWeb ? '启用' : '不启用'}</span>
                                <Switch
                                    checked={chatBotInfo.enableSearchInWeb}
                                    onChange={() =>
                                        setChatBotInfo({
                                            ...chatBotInfo,
                                            enableSearchInWeb: !chatBotInfo.enableSearchInWeb
                                        })
                                    }
                                    color="secondary"
                                />
                            </div>
                        </div>
                        {/* <div className="text-sm text-[#9da3af] ml-3">能够从互联网上收集实时信息，你可以问机器人最新最近的信息。 </div> */}
                    </div>
                    {/* {chatBotInfo.enableSearchInWeb && (
                    <>
                        <TextField
                            label={'设置网络搜索范围'}
                            className={'mt-3'}
                            fullWidth
                            error={!isValid}
                            onChange={(e) => {
                                setChatBotInfo({
                                    ...chatBotInfo,
                                    searchInWeb: e.target.value
                                });
                            }}
                            multiline
                            value={chatBotInfo.searchInWeb}
                            minRows={3}
                            size="small"
                        />
                        <div className="flex justify-between">
                            {!isValid ? (
                                <div className="text-[#f44336] mt-1">
                                    {websiteCount <= 10 ? '请输入正确的网络搜索范围' : '网址不能超过10个'}
                                </div>
                            ) : (
                                <div className="mt-1">您可以通过下面的输入框指定具体的搜索网页范围，每行一个URL，例如mofaai.com.cn</div>
                            )}
                            <div className="text-right text-stone-600 mr-1 mt-1">{websiteCount || 0}/10个</div>
                        </div>
                    </>
                )} */}
                </div>
            </div>
            <div>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black mt-5"
                    }
                >
                    学习工作流程
                </span>
                <div className="text-sm text-[#9da3af] ml-3">
                    让你的机器人可直接执行定制的AI应用，实现更复杂和深度的内容创作和工作内容。
                </div>
                <div className={'mt-3'}>
                    <MainCard>
                        <Grid
                            container
                            direction="row"
                            spacing={gridSpacing}
                            className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                        >
                            <Popover
                                content={
                                    <div className="flex justify-start items-center flex-col">
                                        <div className="text-sm text-center w-[330px]">
                                            <div>功能正在封闭测试中。</div>
                                            <div>可联系我们产品顾问进一步了解，</div>
                                            <div>并获得提前免费使用的权利。</div>
                                        </div>
                                        <img className="w-40" src={workWechatPay} alt="" />
                                    </div>
                                }
                                trigger="hover"
                            >
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                    <path
                                        d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                        fill="#515151"
                                        p-id="6181"
                                    ></path>
                                </svg>
                            </Popover>
                            <div className="text-base">即将推出</div>
                        </Grid>
                    </MainCard>
                </div>
            </div>
            <div>
                <div>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                        }
                    >
                        学习API
                    </span>
                    <div className="text-sm text-[#9da3af] ml-3">
                        让你的机器人可以实时查询信息和操作其他API数据的能力，让你的机器人帮助你完成更多真实的工作。
                    </div>
                    <div className={'mt-3'}>
                        <MainCard>
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                            >
                                <div>
                                    <Button variant="contained" type="button" color="secondary" onClick={() => setApiListVisible(true)}>
                                        添加技能
                                    </Button>
                                </div>
                            </Grid>
                        </MainCard>
                    </div>
                </div>
            </div>

            <QAModal open={qaVisible} handleClose={() => setQaVisible(false)} />
            <ApiModal open={apiVisible} handleClose={() => setApiVisible(false)} />
            {apiListVisible && <ApiListModal open={apiListVisible} handleClose={() => setApiListVisible(false)} />}
        </div>
    );
};
