import { Box, Grid, Pagination, TextField, Typography, Button } from '@mui/material';

import Template from './components/content/template';
import MyselfTemplate from './components/content/mySelfTemplate';

import { recommends, appPage } from 'api/template/index';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { useContext } from 'react';
import { Item } from 'types/template';
import { t } from 'hooks/web/useI18n';
//左右切换的按钮
const LeftArrow = () => {
    const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
    return (
        <Box position="absolute" top="0" bottom="0" margin="auto" zIndex="9999" lineHeight="350px">
            {!isFirstItemVisible ? (
                <Button
                    sx={{ borderRadius: '50%', left: '10px', padding: 1, minWidth: 'auto' }}
                    variant="outlined"
                    onClick={() => scrollPrev()}
                >
                    <KeyboardArrowLeftIcon />
                </Button>
            ) : (
                ''
            )}
        </Box>
    );
};
const RightArrow = () => {
    const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
    return (
        <Box position="absolute" top="0" bottom="0" right="10px" margin="auto" zIndex="9999" lineHeight="350px">
            {!isLastItemVisible ? (
                <Button sx={{ borderRadius: '50%', padding: 1, minWidth: 'auto' }} variant="outlined" onClick={() => scrollNext()}>
                    <KeyboardArrowRightIcon />
                </Button>
            ) : (
                ''
            )}
        </Box>
    );
};

function MyTemplate() {
    //路由跳转
    const navigate = useNavigate();
    const [recommendList, setRecommends] = useState([]);
    const [appList, setAppList] = useState([]);
    const [newAppList, setNewApp] = useState([]);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const [total, setTotal] = useState(0);
    useEffect(() => {
        recommends().then((res) => {
            setRecommends(res);
        });
        appPage({ pageNo: 1, pageSize: 1000 }).then((res) => {
            setAppList(res.list);
            setNewApp(res.list.slice(0, pageQuery.pageSize));
            setTotal(res.page.total);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const paginationChange = (event: any, value: number) => {
        setPageQuery({
            ...pageQuery,
            pageNo: value
        });
        setNewApp(appList.slice((value - 1) * pageQuery.pageSize, (value - 1) * pageQuery.pageSize + pageQuery.pageSize));
    };
    //弹窗
    const handleDetail = (data: { recommend: string }) => {
        navigate('/createApp?recommend=' + data.recommend);
    };
    return (
        <Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.name" label={t('apply.name')} InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.topics" label={t('apply.category')} InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.tags" label={t('apply.tag')} InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
            </Grid>
            <Box display="flex" alignItems="end" mt={2} mb={1}>
                <Typography variant="h3">{t('apply.recommend')}</Typography>
            </Box>
            <Box sx={{ position: 'relative' }}>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                    {recommendList.map((item: Item, index) => (
                        <Box key={index} style={{ marginLeft: index === 0 ? 0 : '16px', width: '203.33px' }}>
                            <Template data={item} handleDetail={handleDetail} />
                        </Box>
                    ))}
                </ScrollMenu>
            </Box>
            {total > 0 && (
                <Box>
                    <Typography variant="h3" mt={2} mb={1}>
                        {t('apply.self')}
                    </Typography>
                    <MyselfTemplate appList={newAppList} />
                    <Box my={2}>
                        <Pagination page={pageQuery.pageNo} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default MyTemplate;
