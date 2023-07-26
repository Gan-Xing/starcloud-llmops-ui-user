import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Switch,
    TextField
} from '@mui/material';
import { Upload, UploadFile, UploadProps } from 'antd';
import React, { useState } from 'react';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShortcutRecord from './ShortcutRecord';
import MainCard from '../../../../../../ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from '../../../../../../store/constant';

const uploadButton = (
    <div>
        <PlusOutlined rev={undefined} />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

const VoiceModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const [valueLabel, setValueLabel] = useState('checked');
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
                title="选择声音"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing}>
                        <div className={'w-full px-[24px] '}>
                            <div className={'w-full  pt-[24px]'}>
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    value={valueLabel}
                                    onChange={(e) => setValueLabel(e.target.value)}
                                    name="row-radio-buttons-group"
                                >
                                    <div className={'grid grid-cols-2 gap-4 w-full'}>
                                        <FormControlLabel value="checked" control={<Radio />} label="Checked" />
                                        <FormControlLabel value="unchecked" control={<Radio />} label="Unchecked" />
                                    </div>
                                </RadioGroup>
                            </div>
                            <Divider className={'py-[15px]'} />
                            <div className={'flex items-center justify-between mt-5'}>
                                <div className={'flex-[0 0 150px]'}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel id="age-select">Style</InputLabel>
                                        <Select size={'small'} id="columnId" name="columnId" label={'style'} className={'w-[150px]'}>
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className={'flex-1 flex items-center justify-center'}>
                                    <div className={'w-4/5 flex items-center justify-center'}>
                                        <span className={'text-sm mr-2'}>Pitch</span>
                                        <Slider defaultValue={40} valueLabelDisplay="auto" min={15} max={60} />
                                    </div>
                                </div>

                                <div className={'flex-1 flex items-center justify-center'}>
                                    <div className={'w-4/5 flex items-center justify-center'}>
                                        <span className={'text-sm mr-2'}>Speed</span>
                                        <Slider className={'w-4/5'} defaultValue={40} valueLabelDisplay="auto" min={15} max={60} />{' '}
                                    </div>
                                </div>
                                <div className={'flex-[0 0 150px]'}>
                                    <Button startIcon={<PlayCircleOutlineIcon />} variant={'contained'} color={'secondary'} size={'small'}>
                                        林志玲
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const ShortcutModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const [type, setType] = useState('0');
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
                title="添加快捷方式"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <div className={'w-full p-[24px] '}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="age-select">类型</InputLabel>
                        <Select id="columnId" name="columnId" label={'style'} fullWidth onChange={(e: any) => setType(e.target.value)}>
                            <MenuItem value="0">
                                <em>文本内容</em>
                            </MenuItem>
                            <MenuItem value="1">
                                <em>执行AI流程</em>
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <TextField className={'mt-2'} fullWidth label={'关键字'} />
                    {type === '0' ? (
                        <TextField
                            className={'mt-2'}
                            fullWidth
                            multiline={true}
                            maxRows={3}
                            minRows={3}
                            aria-valuemax={200}
                            label={'回复内容'}
                        />
                    ) : (
                        <FormControl sx={{ width: '100%' }} className={'mt-2'}>
                            <InputLabel id="age-select">选择应用</InputLabel>
                            <Select id="columnId" name="columnId" label={'style'} fullWidth onChange={(e: any) => setType(e.target.value)}>
                                <MenuItem value="0">
                                    <em>文本内容</em>
                                </MenuItem>
                                <MenuItem value="1">
                                    <em>执行AI流程</em>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </div>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

/**
 * 形象设计
 * @constructor
 */
export const FashionStyling = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [guideList, setGuideList] = useState(['', '']);
    const [visibleVoice, setVisibleVoice] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const [shortcutOpen, setShortcutOpen] = useState(false);

    const closeVoiceModal = () => {
        setVoiceOpen(false);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);
    return (
        <div className={'flex '}>
            <div className={'w-8/12'}>
                <div>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                        }
                    >
                        基本信息
                    </span>
                    <div className={'mt-5 w-1/3'}>
                        <TextField label={'名称'} className={'mt-1'} fullWidth size={'small'} />
                    </div>
                    <div className={'mt-5'}>
                        <span className={'text-base'}>头像</span>
                        <div className={'mt-1'}>
                            <Upload
                                maxCount={1}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleChange}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                        </div>
                    </div>
                    <div className={'mt-5'}>
                        <TextField
                            className={'mt-1'}
                            size={'small'}
                            fullWidth
                            multiline={true}
                            maxRows={3}
                            minRows={3}
                            aria-valuemax={200}
                            label={'简介'}
                        />
                    </div>
                    <div className={'mt-5'}>
                        <div>
                            <span className={'text-base'}>声音</span>
                            <Switch color={'secondary'} checked={visibleVoice} onChange={(e) => setVisibleVoice(e.target.checked)} />
                        </div>
                        <div className={'text-[#697586]'}>Enable voices to hear your Genius speak.</div>
                        {visibleVoice && (
                            <div className={'mt-3'}>
                                <Button
                                    variant={'contained'}
                                    startIcon={<GraphicEqIcon />}
                                    color={'secondary'}
                                    size={'small'}
                                    onClick={() => setVoiceOpen(true)}
                                >
                                    选择声音
                                </Button>
                                <Button
                                    className={'ml-3'}
                                    startIcon={<PlayCircleOutlineIcon />}
                                    variant={'contained'}
                                    color={'secondary'}
                                    size={'small'}
                                >
                                    林志玲
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={'mt-5'}>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                        }
                    >
                        对话元素
                    </span>
                    <div className={'mt-5'}>
                        <TextField
                            className={'mt-1'}
                            size={'small'}
                            fullWidth
                            multiline={true}
                            maxRows={3}
                            minRows={3}
                            aria-valuemax={200}
                            label={'欢迎语'}
                        />
                        <div className={'mt-5'}>
                            <span className={'text-base'}>设置常见问题引导用户如何使用</span>
                            {guideList.map((item, index) => (
                                <div className={'flex items-center mt-3 w-1/2'} key={index}>
                                    <TextField
                                        label={'欢迎语'}
                                        className={'mt-1'}
                                        size={'small'}
                                        fullWidth
                                        placeholder={'输入常见问题来指导用户'}
                                    />
                                    {index + 1 === guideList.length && guideList.length < 5 && (
                                        <Button
                                            className={'min-w-[40px] h-[40px] ml-3'}
                                            startIcon={<AddIcon />}
                                            variant={'outlined'}
                                            color={'secondary'}
                                            size={'small'}
                                            sx={{
                                                '& .MuiButton-startIcon': {
                                                    marginRight: 0
                                                }
                                            }}
                                            onClick={() => setGuideList([...guideList, ''])}
                                        />
                                    )}
                                    {guideList.length !== 1 && (
                                        <Button
                                            className={'min-w-[40px] h-[40px] ml-2'}
                                            startIcon={<RemoveIcon />}
                                            variant={'outlined'}
                                            color={'secondary'}
                                            size={'small'}
                                            sx={{
                                                '& .MuiButton-startIcon': {
                                                    marginRight: 0
                                                }
                                            }}
                                            onClick={() => {
                                                guideList.splice(index, 1);
                                                setGuideList([...guideList]);
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'mt-5'}>
                        <span className={'text-base'}>快捷方式</span>
                        <div className={'mt-3'}>
                            <Button
                                variant={'contained'}
                                startIcon={<AddIcon />}
                                color={'secondary'}
                                size={'small'}
                                onClick={() => setShortcutOpen(true)}
                            >
                                添加快捷方式
                            </Button>
                            <ShortcutRecord />
                        </div>
                    </div>
                </div>
            </div>
            <div className={'w-4/12'}></div>
            <VoiceModal open={voiceOpen} handleClose={closeVoiceModal} />
            <ShortcutModal open={shortcutOpen} handleClose={() => setShortcutOpen(false)} />
        </div>
    );
};
