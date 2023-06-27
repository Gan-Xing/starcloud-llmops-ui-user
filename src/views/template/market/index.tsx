import { Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem, Paper, InputBase, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { Outlet } from 'react-router-dom';

import { useState, useEffect } from 'react';

import ScrollMenus from './ScrollMenu';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
interface MarketList {
    name: string;
    tags: string[];
    createTime: number;
    viewCount: number;
}
function TemplateMarket() {
    const { total, templateList, setNewTemplate } = marketStore();
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: ''
    });
    const sortList = [
        { text: t('market.new'), key: 'gmt_create' },
        { text: t('market.popular'), key: 'like' },
        { text: t('market.recommend'), key: 'step' }
    ];
    useEffect(() => {
        if (queryParams.sort) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams.sort]);
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    const handleSearch = () => {
        let newList = templateList.filter((item: MarketList) => {
            let nameMatch = true;
            if (queryParams.name) {
                nameMatch = item.name.toLowerCase().includes(queryParams.name.toLowerCase());
            }
            return nameMatch;
        });
        if (queryParams.sort && queryParams.sort === 'like') {
            newList.sort((a: MarketList, b: MarketList) => {
                return b.viewCount - a.viewCount;
            });
        }
        if (queryParams.sort && queryParams.sort === 'step') {
            const fristList = newList.filter((item: MarketList) => item.tags.includes('recommend'));
            const lastList = newList.filter((item: MarketList) => !item.tags.includes('recommend'));
            newList = [...fristList, ...lastList];
        }
        if (queryParams.sort && queryParams.sort === 'gmt_create') {
            newList.sort((a: MarketList, b: MarketList) => {
                return (b.createTime = a.createTime);
            });
        }
        setNewTemplate(newList);
    };
    return (
        <Box maxWidth="1200px" margin="0 auto">
            <Typography variant="h1" mt={3} textAlign="center">
                {t('market.title')}
            </Typography>
            <Typography variant="h4" my={2} textAlign="center">
                {t('market.subLeft')} {total} + {t('market.subright')}
            </Typography>
            <Paper
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 600,
                    margin: '0 auto',
                    background: '#f8fafc',
                    height: 50
                }}
            >
                <SearchIcon />
                <InputBase
                    sx={{ ml: 1, flex: 1, p: 1 }}
                    name="name"
                    inputProps={{ 'aria-label': 'search google maps' }}
                    value={queryParams.name}
                    onChange={handleChange}
                />
                <Button size="small" color="primary" sx={{ borderRadius: '5px' }} onClick={handleSearch}>
                    {t('market.search')}
                </Button>
            </Paper>
            <Grid container spacing={2} my={2}>
                <Grid item xs={12} md={10}>
                    <ScrollMenus />
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="sort">{t('market.sortby')}</InputLabel>
                        <Select id="sort" onChange={handleChange} name="sort" value={queryParams.sort} label={t('market.sortby')}>
                            {sortList.map((el: any) => (
                                <MenuItem key={el.key} value={el.key}>
                                    {el.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Outlet />
        </Box>
    );
}
export default TemplateMarket;
