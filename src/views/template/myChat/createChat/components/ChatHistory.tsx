import React from 'react';

// material-ui
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Card, CardContent, Divider, Grid, Theme, Tooltip, Typography } from '@mui/material';

// project imports
import dayjs from 'dayjs';
import { gridSpacing } from 'store/constant';
import { LoadingDot } from 'ui-component/LoadingDot';
import { IHistory } from './Chat';

import User from 'assets/images/users/user-round.svg';
import copy from 'clipboard-copy';
import { t } from 'hooks/web/useI18n';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ChatMarkdown from 'ui-component/Markdown';
import { LoadingSpin } from 'ui-component/LoadingSpin';
import { WebPageInfo } from '../../../../../ui-component/webPageInfo/index';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Popover, Tag } from 'antd';
import { isMobile } from 'react-device-detect';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

interface ChartHistoryProps {
    data: IHistory[];
    theme: Theme;
}

const ChatHistory = ({ data, theme }: ChartHistoryProps) => {
    const [currentChat, setCurrentChat] = React.useState('');

    return (
        <Grid item xs={12} className="p-[12px]">
            <Grid container spacing={gridSpacing}>
                {data.map((history, index) => (
                    <React.Fragment key={index}>
                        {history.message && (
                            <Grid item xs={12} className="mt-3">
                                <Grid
                                    container
                                    spacing={gridSpacing}
                                    style={{ marginLeft: 0, width: '100%' }}
                                    onMouseEnter={() => setCurrentChat(`${index}-message`)}
                                    onMouseLeave={() => setCurrentChat('')}
                                >
                                    <div className="w-full flex">
                                        <div className="w-full">
                                            <Grid item xs={12}>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        align="right"
                                                        variant="subtitle2"
                                                        color={theme.palette.mode === 'dark' ? 'dark.900' : ''}
                                                        className="h-[19px]"
                                                    >
                                                        {currentChat === `${index}-message` &&
                                                            dayjs(history.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Typography>
                                                </Grid>
                                                <Card
                                                    sx={{
                                                        display: 'inline-block',
                                                        float: 'right',
                                                        bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.primary.light
                                                    }}
                                                >
                                                    <CardContent sx={{ width: 'fit-content', ml: 'auto' }} className="p-[12px] !pb-[12px]">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
                                                                <div className="text-sm whitespace-pre-line text-[#364152]">
                                                                    {history.message}
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </div>
                                        <img className="w-[35px] h-[35px] rounded-xl ml-1" src={User} alt="" />
                                    </div>
                                </Grid>
                            </Grid>
                        )}
                        {/* 欢迎语 */}
                        {history.isStatement ? (
                            history.answer && (
                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid
                                            item
                                            xs={12}
                                            className="flex"
                                            onMouseEnter={() => setCurrentChat(`${index}-answer`)}
                                            onMouseLeave={() => setCurrentChat('')}
                                        >
                                            <div className="flex flex-col w-full">
                                                <Card
                                                    sx={{
                                                        display: 'inline-block'
                                                    }}
                                                    className="bg-[#f2f3f5]"
                                                >
                                                    <CardContent className="p-[12px] !pb-[12px]">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
                                                                {history.answer ? (
                                                                    <div className="text-sm whitespace-pre-line text-[#364152]">
                                                                        {history.answer}
                                                                    </div>
                                                                ) : (
                                                                    <LoadingDot />
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        ) : (
                            <Grid item xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid
                                        item
                                        xs={12}
                                        className="flex"
                                        onMouseEnter={() => setCurrentChat(`${index}-answer`)}
                                        onMouseLeave={() => setCurrentChat('')}
                                    >
                                        <div className="w-[35px] h-[35px] flex justify-center items-center  mr-2">
                                            <img className="w-[35px] h-[35px] rounded-xl" src={history.robotAvatar} alt="" />
                                        </div>
                                        <div className="max-w-full overflow-x-auto">
                                            <Grid item xs={12} className="flex items-center">
                                                <Typography align="left" variant="subtitle2" className="h-[19px]">
                                                    {history.robotName}
                                                </Typography>
                                                <Typography align="left" variant="subtitle2" className="ml-1">
                                                    {currentChat === `${index}-answer` &&
                                                        dayjs(history.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                </Typography>
                                            </Grid>
                                            <div className="flex flex-col">
                                                <Card
                                                    sx={{
                                                        display: 'inline-block',
                                                        width: 'fit-content'
                                                    }}
                                                    className="bg-[#f2f3f5]"
                                                >
                                                    <CardContent className="p-[12px] !pb-[12px]">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
                                                                {/* 思考中 */}
                                                                {/* {history.process && ( */}
                                                                {false && (
                                                                    <div className="flex flex-col bg-[#e3f2fd] p-[8px] rounded-md">
                                                                        <div className="items-center px-[4px] py-[8px] bg-[#e3f2fd] w-[110px] inline-flex justify-center rounded-md cursor-pointer">
                                                                            <LoadingSpin />
                                                                            <span className="ml-1">正在生成</span>
                                                                            <ExpandLessIcon className="w-[18px] h-[18px]" />
                                                                            {/* <ExpandMoreIcon /> */}
                                                                        </div>
                                                                        <div>
                                                                            <div>抓取百度内容</div>
                                                                            <WebPageInfo
                                                                                tips={'为你搜索新闻'}
                                                                                urlList={[
                                                                                    {
                                                                                        title: '百度一下，你就知道',
                                                                                        logo: 'http://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
                                                                                        des: '百度一下，你就知道'
                                                                                    },
                                                                                    {
                                                                                        title: '百度一下，你就知道',
                                                                                        logo: 'http://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
                                                                                        des: '百度一下，你就知道'
                                                                                    },
                                                                                    {
                                                                                        title: '百度一下，你就知道',
                                                                                        logo: 'http://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
                                                                                        des: '百度一下，你就知道'
                                                                                    }
                                                                                ]}
                                                                            />
                                                                        </div>
                                                                        {/* <div>
                                                                            {history.process.showType === 'url' && (
                                                                                <div>
                                                                                    <div>{history.process.tips}</div>
                                                                                    <WebPageInfo url={history.process.url} />
                                                                                </div>
                                                                            )}
                                                                        </div> */}
                                                                    </div>
                                                                )}
                                                                {history?.process?.showType === 'docs' && history?.answer && (
                                                                    <div>
                                                                        <div
                                                                            className={`text-sm whitespace-pre-line  ${
                                                                                history.status === 'ERROR' ? 'text-[red]' : 'text-[#364152]'
                                                                            }`}
                                                                        >
                                                                            <ChatMarkdown textContent={history?.answer} />
                                                                        </div>
                                                                        <div className="py-1">
                                                                            <Divider />
                                                                        </div>
                                                                        <div className="flex items-center mt-1">
                                                                            <div className="text-xs" style={{ flex: '0 0 37px' }}>
                                                                                来源：
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-1 flex: 1">
                                                                                {history?.process?.data?.map((item: any, index: number) => (
                                                                                    <Popover
                                                                                        key={index}
                                                                                        content={
                                                                                            <div className=" max-w-[325px]">
                                                                                                <span>{item?.desc}</span>
                                                                                                {isMobile && (
                                                                                                    <div>
                                                                                                        <a target="_blank" href={item.url}>
                                                                                                            点击查看
                                                                                                        </a>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        }
                                                                                        trigger={isMobile ? 'click' : 'hover'}
                                                                                        title={item.name}
                                                                                    >
                                                                                        <Tag
                                                                                            color="#673ab7"
                                                                                            className="cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis w-full !text-[12px]"
                                                                                            onClick={() =>
                                                                                                !isMobile && window.open(item?.url)
                                                                                            }
                                                                                        >
                                                                                            {item?.name}
                                                                                        </Tag>
                                                                                    </Popover>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {/* 文本回答 */}
                                                                {history.answer && !history?.process ? (
                                                                    <div
                                                                        className={`text-sm whitespace-pre-line  ${
                                                                            history.status === 'ERROR' ? 'text-[red]' : 'text-[#364152]'
                                                                        }`}
                                                                    >
                                                                        <ChatMarkdown textContent={history.answer} />
                                                                    </div>
                                                                ) : (
                                                                    <LoadingDot />
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                {/* 正在生成的没有 */}
                                                {!history.isNew && (
                                                    <div className=" leading-5 mt-2 inline-block transition-opacity text-[#B5BED0]">
                                                        <Tooltip title={'复制'}>
                                                            <ContentCopyIcon
                                                                className="text-[16px] cursor-pointer"
                                                                onClick={() => {
                                                                    copy(history.answer || '');
                                                                    dispatch(
                                                                        openSnackbar({
                                                                            open: true,
                                                                            message: t('market.copySuccess'),
                                                                            variant: 'alert',
                                                                            alert: {
                                                                                color: 'success'
                                                                            },
                                                                            close: false
                                                                        })
                                                                    );
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                {/* 正在执行的才有 */}
                                                {history.isNew &&
                                                    (history.answer ? (
                                                        <div className="text-[13px] leading-5 mt-2 inline-block transition-opacity text-[#B5BED0]">
                                                            正在回答中...
                                                        </div>
                                                    ) : (
                                                        <div className="text-[13px] leading-5 mt-2  inline-block transition-opacity text-[#B5BED0]">
                                                            正在思考中...
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </React.Fragment>
                ))}
            </Grid>
        </Grid>
    );
};

export default ChatHistory;
