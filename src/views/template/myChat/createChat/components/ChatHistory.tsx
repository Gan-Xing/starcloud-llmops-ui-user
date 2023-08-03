import React from 'react';

// material-ui
import { Card, CardContent, Grid, Theme, Typography } from '@mui/material';

// project imports
import dayjs from 'dayjs';
import { gridSpacing } from 'store/constant';
import { LoadingDot } from 'ui-component/LoadingDot';
import { IHistory } from './Chat';

import User from 'assets/images/users/user-round.svg';
// ==============================|| CHAT MESSAGE HISTORY ||============================== //

interface ChartHistoryProps {
    data: IHistory[];
    theme: Theme;
}

const ChatHistory = ({ data, theme }: ChartHistoryProps) => (
    <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
            {data.map((history, index) => (
                <React.Fragment key={index}>
                    <Grid item xs={12} className="mt-3">
                        <Grid container spacing={gridSpacing}>
                            <div className="w-full flex">
                                <div className="w-full">
                                    <Grid item xs={12}>
                                        <Grid item xs={12}>
                                            <Typography
                                                align="right"
                                                variant="subtitle2"
                                                color={theme.palette.mode === 'dark' ? 'dark.900' : ''}
                                            >
                                                {dayjs(history.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                            </Typography>
                                        </Grid>
                                        <Card
                                            sx={{
                                                display: 'inline-block',
                                                float: 'right',
                                                bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.primary.light
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, pb: '16px !important', width: 'fit-content', ml: 'auto' }}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? 'dark.900' : ''}>
                                                            {history.message}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </div>
                                <img className="w-[50px] h-[50px] rounded-xl ml-2" src={User} alt="" />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={7} className="flex">
                                <img className="w-[50px] h-[50px] rounded-xl mr-2" src={history.robotAvatar} alt="" />
                                <div>
                                    <Grid item xs={12} className="flex items-center">
                                        <Typography align="left" variant="subtitle2">
                                            {history.robotName}
                                        </Typography>
                                        <Typography align="left" variant="subtitle2" className="ml-2">
                                            {dayjs(history.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                        </Typography>
                                    </Grid>
                                    <div className="flex flex-col">
                                        <Card
                                            sx={{
                                                display: 'inline-block',
                                                background:
                                                    theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.secondary.light
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        {history.answer ? (
                                                            <Typography variant="body2">{history.answer}</Typography>
                                                        ) : (
                                                            <LoadingDot />
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
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
                </React.Fragment>
            ))}
        </Grid>
    </Grid>
);

export default ChatHistory;
