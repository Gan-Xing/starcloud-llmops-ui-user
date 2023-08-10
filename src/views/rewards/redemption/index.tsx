import { Grid, Typography } from '@mui/material';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import BottomCards from './BottomCards';
import Header from './Header';
import MiddleCards from './MiddleCards';
import Record from './Record';
const Redemption = () => {
    const [openRecord, setOpenRecord] = useState(false); // 新增的状态
    const handleOpenRecord = () => setOpenRecord(true); // 新增的打开函数
    const handleCloseRecord = () => setOpenRecord(false); // 新增的关闭函数
    return (
        <Grid>
            <Header />
            <Typography variant="h3" textAlign="center" sx={{ my: 3 }}>
                {t('redemption.obtain')}
            </Typography>
            <Typography
                variant="h5"
                textAlign="right"
                sx={{ cursor: 'pointer', color: '#7e7e7e', my: 3, mr: 2 }}
                onClick={handleOpenRecord}
            >
                {'查看权益记录 >'}
            </Typography>
            {openRecord && <Record open={openRecord} handleClose={handleCloseRecord} />}
            <MiddleCards />
            <BottomCards />
        </Grid>
    );
};

export default Redemption;
