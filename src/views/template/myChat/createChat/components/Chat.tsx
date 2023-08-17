import CleaningServicesSharpIcon from '@mui/icons-material/CleaningServicesSharp';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import PendingIcon from '@mui/icons-material/Pending';
import SendIcon from '@mui/icons-material/Send';
import {
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getChat, getChatHistory, messageSSE } from '../../../../../api/chat';
import { t } from '../../../../../hooks/web/useI18n';
import { dispatch } from '../../../../../store';
import { openSnackbar } from '../../../../../store/slices/snackbar';
import { IChatInfo } from '../index';
import ChatHistory from './ChatHistory';
import { getShareChatHistory, shareMessageSSE } from 'api/chat/share';
import jsCookie from 'js-cookie';

export type IHistory = Partial<{
    uid: string;
    appConversationUid: string;
    appUid: string;
    appMode: string;
    appConfig: string;
    appStep: string;
    status: string;
    errorCode: string;
    errorMsg: string;
    variables: string;
    message: string;
    messageTokens: number;
    messageUnitPrice: number;
    process: any;
    answer: any;
    answerTokens: number;
    answerUnitPrice: number;
    elapsed: number;
    totalPrice: number;
    currency: string;
    fromScene: string;
    endUser: string;
    id: string;
    createTime: number;
    robotName: string;
    robotAvatar: string;
    isNew: boolean;
    isStatement?: boolean;
}>;

export type IConversation = {
    uid: string;
    appUid: string;
    appName: string;
    appMode: string;
    appConfig: string;
    status: string;
    fromScene: string;
    endUser: string;
    id: string;
    createTime: number;
};
export const Chat = ({ chatBotInfo, mode, mediumUid }: { chatBotInfo: IChatInfo; mode?: 'iframe' | 'test'; mediumUid?: string }) => {
    const theme = useTheme();
    const scrollRef: any = React.useRef();
    const contentRef: any = useRef(null);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId') as string;

    const [isListening, setIsListening] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [conversationUid, setConversationUid] = React.useState('');
    const [data, setData] = React.useState<IHistory[]>([]);
    const [time, setTime] = React.useState(1);
    const [isFirst, setIsFirst] = React.useState(true);
    const [isFetch, setIsFetch] = useState(false);

    const dataRef: any = useRef(data);
    const timeOutRef: any = useRef(null);

    // 创建语音识别对象
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();

    // 设置语言为中文
    recognition.lang = navigator.language;

    // 语音识别结果事件处理函数
    recognition.onresult = (event: any) => {
        const result = event.results[event.resultIndex][0].transcript;
        setMessage(`${message}${result}`);
    };

    // 开始语音识别
    const startListening = () => {
        timeOutRef.current = setInterval(() => {
            setTime((time) => time + 1);
        }, 1000);
        setIsListening(true);
        recognition.start();
    };

    // 停止语音识别
    const stopListening = () => {
        timeOutRef.current && clearInterval(timeOutRef.current);
        setTime(1);
        setIsListening(false);
        recognition.stop();
    };

    useEffect(() => {
        return () => {
            timeOutRef.current && clearInterval(timeOutRef.current);
        };
    }, []);

    // mode 为test代码
    // 获取会话
    React.useEffect(() => {
        if (mode === 'test') {
            (async () => {
                const res: IConversation[] = await getChat({ scene: 'CHAT_TEST', appUid: appId });
                if (res && res.length) {
                    setConversationUid(res[0].uid);
                }
            })();
        }
    }, [mode]);

    // 获取历史记录, 只加载一次
    React.useEffect(() => {
        if (mode === 'test' && conversationUid && isFirst) {
            (async () => {
                const res: any = await getChatHistory({ conversationUid, pageNo: 1, pageSize: 10000 });
                const list = res.list.map((v: any) => ({ ...v, robotName: chatBotInfo.name, robotAvatar: chatBotInfo.avatar }));
                const result = [
                    ...list,
                    {
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar,
                        answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                        isStatement: true
                    }
                ];
                dataRef.current = result;
                setData(result);
                setIsFirst(false);
            })();
        }
    }, [conversationUid, chatBotInfo, mode]);

    // 更新历史记录
    React.useEffect(() => {
        if (mode === 'test' && !isFirst) {
            const list: any = dataRef.current.map((v: any) => ({ ...v, robotName: chatBotInfo.name, robotAvatar: chatBotInfo.avatar }));
            dataRef.current = list;
            setData(list);
        }
    }, [chatBotInfo.avatar, chatBotInfo.name, chatBotInfo.statement, mode]);

    // 更新欢迎语
    React.useEffect(() => {
        if (mode === 'test' && !isFirst) {
            const copyData = [...dataRef.current];
            const index = copyData.findIndex((v) => v.isStatement);
            if (chatBotInfo.enableStatement) {
                copyData[index].answer = chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement);
            } else {
                copyData[index].answer = '';
            }
            dataRef.current = copyData;
            setData(copyData);
        }
    }, [chatBotInfo.statement, chatBotInfo.enableStatement, mode]);

    // mode为iframe代码
    // iframe 模式下获取历史记录
    React.useEffect(() => {
        if (mode === 'iframe') {
            (async () => {
                const res = await getShareChatHistory({ pageNo: 1, pageSize: 10000, conversationUid: jsCookie.get('conversationUid') });
                const list = res.list?.map((v: any) => ({ ...v, robotName: chatBotInfo.name, robotAvatar: chatBotInfo.avatar })) || [];
                const result = [
                    ...list,
                    {
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar,
                        answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                        isStatement: true
                    }
                ];
                dataRef.current = result;
                setData(result);
            })();
        }
    }, [mode, chatBotInfo]);

    React.useEffect(() => {
        // 清理语音识别对象
        return () => {
            recognition.stop();
            recognition.onresult = null;
        };
    }, []);

    function convertTextWithLinks(text: string): JSX.Element {
        const hashtagRegex = /#([^#]+)#/g;

        const parts: (JSX.Element | string)[] = [];
        let lastIndex = 0;

        let match;
        while ((match = hashtagRegex.exec(text)) !== null) {
            parts.push(text.slice(lastIndex, match.index));
            const hashtagContent = match[1];
            parts.push(
                <a
                    key={match.index}
                    className="text-[#7C5CFC] cursor-pointer"
                    onClick={() => {
                        doFetch(hashtagContent);
                    }}
                >
                    {hashtagContent}
                </a>
            );
            lastIndex = hashtagRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return <>{parts}</>;
    }

    React.useEffect(() => {
        if (isFetch && scrollRef?.current) {
            const scrollContainer = scrollRef.current;
            const contentElement = contentRef.current;
            scrollContainer.scrollTop = contentElement.scrollHeight;
        }
    });

    const handleKeyDown = async (event: any) => {
        // 按下 Shift + Enter 换行
        if (event.shiftKey && event.keyCode === 13) {
            event.preventDefault();
            setMessage(message + '\n');
        } else if (!event.shiftKey && event.keyCode === 13) {
            event.preventDefault();
            // 单独按回车键提交表单
            await handleOnSend();
        }
    };

    const doFetch = async (message: string) => {
        setMessage('');
        const newMessage: IHistory = {
            robotName: chatBotInfo.name,
            robotAvatar: chatBotInfo.avatar,
            message,
            createTime: new Date().getTime(),
            answer: '',
            isNew: true
        };
        const newData = [...dataRef.current, newMessage];
        dataRef.current = newData;
        setData(newData);

        setIsFetch(true);
        try {
            let resp: any;
            if (mode === 'iframe') {
                resp = await shareMessageSSE({
                    scene: 'SHARE_WEB',
                    query: message,
                    mediumUid,
                    conversationUid: jsCookie.get('conversationUid')
                });
            }
            if (mode === 'test') {
                resp = await messageSSE({
                    appUid: appId,
                    scene: 'CHAT_TEST',
                    conversationUid,
                    query: message
                });
            }

            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (done) {
                    const copyData = [...dataRef.current];
                    copyData[dataRef.current.length - 1].isNew = false;
                    dataRef.current = copyData;
                    setData(copyData);
                    setIsFetch(false);
                    break;
                }
                let str = textDecoder.decode(value);
                const lines = str.split('\n');
                lines.forEach((messages, i: number) => {
                    if (i === 0 && joins) {
                        messages = joins + messages;
                        joins = undefined;
                    }
                    if (i === lines.length - 1) {
                        if (messages && messages.indexOf('}') === -1) {
                            joins = messages;
                            return;
                        }
                    }
                    let bufferObj;
                    if (messages?.startsWith('data:')) {
                        bufferObj = messages.substring(5) && JSON.parse(messages.substring(5));
                    }
                    if (bufferObj?.code === 200) {
                        jsCookie.set('conversationUid', bufferObj.conversationUid);
                        setConversationUid(bufferObj.conversationUid);
                        // 处理流程
                        if (bufferObj.type === 'i') {
                            const copyData = [...dataRef.current];
                            copyData[copyData.length - 1].process = bufferObj.content;
                            dataRef.current = copyData;
                            setData(copyData);
                        }
                        if (bufferObj.type === 'm') {
                            // 处理结论
                            const copyData = [...dataRef.current];
                            copyData[copyData.length - 1].answer = copyData[dataRef.current.length - 1].answer + bufferObj.content;
                            copyData[copyData.length - 1].isNew = true;
                            dataRef.current = copyData;
                            setData(copyData);
                        }
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
        } catch (e: any) {
            const copyData = [...dataRef.current]; // 使用dataRef.current代替data
            if (e.message === 'Request timeout') {
                copyData[copyData.length - 1].answer = '机器人超时，请重试';
            } else {
                copyData[copyData.length - 1].answer = '机器人异常，请重试';
            }
            copyData[copyData.length - 1].status = 'ERROR';
            dataRef.current = copyData;
            setData(copyData);
            setIsFetch(false);
            copyData[copyData.length - 1].isNew = false;
        } finally {
            setIsFetch(false);
        }
    };

    // handle new message form
    const handleOnSend = async () => {
        if (!message.trim()) {
            return;
        }
        doFetch(message);
    };

    const handleClean = () => {
        setAnchorEl(null);
        setData([]);
        dataRef.current = [];
        setConversationUid('');
        jsCookie.remove('conversationUid');
    };

    const [anchorEl, setAnchorEl] = React.useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const handleClickSort = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseSort = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <div className={'flex justify-center items-center py-[8px]'}>
                <div className="w-[28px] h-[28px] flex justify-center items-center">
                    <img className="w-[28px] h-[28px] rounded-md object-fill" src={chatBotInfo.avatar} alt="" />
                </div>
                <span className={'text-lg font-medium ml-2'}>{chatBotInfo.name}</span>
            </div>
            <Divider variant={'fullWidth'} />
            <div className={'max-w-[768px] m-auto'}>
                <div
                    style={{
                        width: '100%',
                        height: mode === 'iframe' ? 'calc(100vh - 180px)' : 'calc(100vh - 298px)',
                        overflowX: 'hidden'
                    }}
                    ref={scrollRef}
                >
                    <div ref={contentRef}>
                        {chatBotInfo.enableIntroduction && (
                            <Card className="bg-[#f2f3f5] mx-[24px] mt-[12px] p-[16px] flex">
                                <div className="flex w-[56px] h-[56px] justify-center items-center">
                                    <img className="w-[56px] h-[56px] rounded-xl object-fill" src={chatBotInfo.avatar} alt="" />
                                </div>
                                <div className="flex flex-col ml-3">
                                    <span className={'text-lg font-medium h-[28px]'}>{chatBotInfo.name}</span>
                                    <Typography align="left" variant="subtitle2" color={'#000'}>
                                        {chatBotInfo.introduction}
                                    </Typography>
                                </div>
                            </Card>
                        )}
                        <CardContent>
                            <ChatHistory theme={theme} data={data} />
                        </CardContent>
                    </div>
                </div>
                <Grid container spacing={1} alignItems="center" className="px-[24px] pb-[24px]">
                    <Grid item>
                        <Grid item>
                            <IconButton onClick={handleClickSort} size="large" aria-label="chat user details change">
                                <MoreHorizTwoToneIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleCloseSort}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                <MenuItem onClick={handleClean}>
                                    <CleaningServicesSharpIcon className="text-base" />
                                    <span className="text-base ml-3">清除</span>
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm zeroMinWidth>
                        <OutlinedInput
                            id="message-send"
                            fullWidth
                            multiline
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="请输入(Shift+Enter换行)"
                            className="!pt-0"
                            onKeyDown={handleKeyDown}
                            minRows={1}
                            maxRows={3}
                            endAdornment={
                                <>
                                    <InputAdornment position="end">
                                        {!isListening ? (
                                            <Tooltip arrow placement="top" title={'语音输入'}>
                                                <IconButton
                                                    disableRipple
                                                    color={'default'}
                                                    onClick={startListening}
                                                    aria-label="voice"
                                                    className="p-0"
                                                >
                                                    <KeyboardVoiceIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip placement="top" arrow title={'停止语音输入'}>
                                                <div
                                                    onClick={stopListening}
                                                    className="w-[30px] h-[30px] rounded-full border-2 border-[#727374] border-solid flex justify-center items-center cursor-pointer"
                                                >
                                                    <div className="w-[16px] h-[16px] rounded-sm bg-[red] text-white flex justify-center items-center text-xs">
                                                        {time}
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </InputAdornment>
                                    <InputAdornment position="end" className="relative">
                                        {isFetch ? (
                                            <Tooltip placement="top" arrow title={'请求中'}>
                                                <IconButton
                                                    disableRipple
                                                    color={message ? 'secondary' : 'default'}
                                                    aria-label="send message"
                                                >
                                                    <PendingIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip placement="top" arrow title={'发送'}>
                                                <IconButton
                                                    disableRipple
                                                    color={message ? 'secondary' : 'default'}
                                                    onClick={handleOnSend}
                                                    aria-label="send message"
                                                >
                                                    <SendIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </InputAdornment>
                                </>
                            }
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'weight' }}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};
