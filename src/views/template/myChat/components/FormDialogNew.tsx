// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import { getChatTemplate } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Template from './template';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function FormDialogNew({
    open,
    setOpen,
    handleOk,
    setValue,
    value
}: {
    open: boolean;
    value: string | '';
    setOpen: (open: boolean) => void;
    handleOk: (uid: string) => void;
    setValue: (value: string) => void;
}) {
    const [checked, setChecked] = useState(false);
    const [recommendList, setRecommends] = useState([]);
    const [uid, setUid] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getChatTemplate({ model: 'CHAT' }).then((res) => {
            setRecommends(res);
        });
    }, []);

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={t('chat.createRobot')}
                content={false}
                className="sm:w-[800px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing} className="w-full flex justify-center pt-[24px] ml-0">
                        <div className={'w-full'}>
                            <TextField
                                error={checked && !value}
                                autoFocus
                                size="small"
                                id="name"
                                label={t('chat.name')}
                                placeholder={t('chat.typeName')}
                                fullWidth
                                helperText={checked && !value && t('chat.createRobotRequire')}
                                onChange={(e) => {
                                    setChecked(true);
                                    setValue(e.target.value);
                                }}
                            />
                        </div>
                        <div className="pt-[16px] w-full text-base">选择模版</div>
                        <div className="w-full mt-[8px] grid grid-cols-4 gap-4">
                            {recommendList.map((item: any, index) => (
                                <Box
                                    key={index}
                                    style={{ width: '203.33px' }}
                                    className={
                                        `hover:border-[1px] hover:border-solid hover:border-[#673ab7] rounded-[8px]` +
                                        (uid === item?.uid ? ' border-[1px] border-solid border-[#673ab7]' : '')
                                    }
                                    onClick={() => setUid(item?.uid)}
                                >
                                    <Template data={item} />
                                </Box>
                            ))}
                        </div>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" onClick={() => handleOk(uid)}>
                            创建
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
}
