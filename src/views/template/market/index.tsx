import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { RightOutlined } from '@ant-design/icons';
import { Box, Typography, IconButton, Grid, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
import ScrollMenus from './ScrollMenu';
import { useTheme } from '@mui/material/styles';
import { listGroupByCategory, categories, categoryTree } from 'api/template';
import Template from 'views/template/myTemplate/components/content/template';

import _ from 'lodash-es';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
interface MarketList {
    name: string;
    tags: string[];
    createTime: number;
    viewCount: number;
    categories: any;
}
interface Page {
    pageNo: number;
    pageSize: number;
}
function TemplateMarket() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { total, templateList, newtemplateList, sorllList, setNewTemplate, setSorllList } = marketStore();
    const [page, setPage] = useState<Page>({ pageNo: 1, pageSize: 30 });
    //应用列表
    const [appList, setAppList] = useState<any[]>([]);
    const [newList, setNewList] = useState<any[]>([]);
    //类别选中
    const [menuList, setMenuList] = useState<{ name: string; icon: string }[]>([]);
    const [active, setActive] = useState<number | string>(0);
    //类别树
    const [cateTree, setCateTree] = useState<any[]>([]);
    useEffect(() => {
        //列表
        listGroupByCategory({ isHot: true }).then((res) => {
            setAppList(res);
            const newData = _.cloneDeep(res);
            newData.forEach((item: any) => {
                item.appList = item.appList.splice(0, 6);
            });
            setNewList(newData);
        });
        //类别
        categories().then((res) => {
            setMenuList(res);
        });
        //类别树
        categoryTree().then((res) => {
            setCateTree(res);
        });
    }, []);
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: '',
        category: 'ALL'
    });
    useEffect(() => {
        if (queryParams.category !== 'ALL') {
            const newData = cateTree.filter((item) => {
                return item.code === queryParams.category;
            })[0].children;
            const newList = appList.filter((item) => item.code === queryParams.category)[0]?.appList;
            newData.forEach((item: any) => {
                item.appList = [];
                item.appList.push(...(newList ? newList.filter((el: any) => item.code === el.category) : []));
            });
            setNewList(newData);
        } else {
            const newData = _.cloneDeep(appList);
            newData.forEach((item: any) => {
                item.appList = item.appList.splice(0, 6);
            });
            setNewList(newData);
        }
    }, [queryParams]);
    //title筛选
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    //当用户更改了筛选触发的逻辑
    const handleSearch = () => {
        let newList = templateList.filter((item: MarketList) => {
            let nameMatch = true;
            if (queryParams.name) {
                nameMatch = item.name?.toLowerCase().includes(queryParams.name.toLowerCase());
            }
            let categoryMatch = true;
            if (queryParams.category) {
                if (queryParams.category === 'ALL') {
                    categoryMatch = true;
                } else {
                    categoryMatch = item.categories?.includes(queryParams.category);
                }
            }
            return nameMatch && categoryMatch;
        });
        if (queryParams.sort && queryParams.sort === 'like') {
            newList.sort((a: MarketList, b: MarketList) => {
                return b.viewCount - a.viewCount;
            });
        }
        if (queryParams.sort && queryParams.sort === 'step') {
            const fristList = newList.filter((item: MarketList) => item.tags?.includes('recommend'));
            const lastList = newList.filter((item: MarketList) => !item.tags?.includes('recommend'));
            newList = [...fristList, ...lastList];
        }
        if (queryParams.sort && queryParams.sort === 'gmt_create') {
            newList.sort((a: MarketList, b: MarketList) => {
                return (b.createTime = a.createTime);
            });
        }
        setPage({
            ...page,
            pageNo: 1
        });
        setNewTemplate(newList);
        setSorllList(newList.slice(0, page.pageSize));
    };
    //切换category
    const changeCategory = (item: any, index: number) => {
        if (active === index) {
            setActive(0);
            setQueryParams({
                ...queryParams,
                category: 'ALL'
            });
        } else {
            setActive(index);
            setQueryParams({
                ...queryParams,
                category: item.code
            });
        }
    };
    const handleDetail = (data: { uid: string }) => {
        navigate(`/appMarketDetail/${data.uid}`);
    };
    const LeftArrow = () => {
        const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
        return (
            <>
                {!isFirstItemVisible ? (
                    <Box sx={{ width: '40px' }}>
                        <IconButton onClick={() => scrollPrev()}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                    </Box>
                ) : (
                    ''
                )}
            </>
        );
    };
    const RightArrow = () => {
        const { isFirstItemVisible, scrollNext } = useContext(VisibilityContext);
        return (
            <Box sx={{ width: '40px' }}>
                {!isFirstItemVisible ? (
                    <IconButton onClick={() => scrollNext()}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                ) : (
                    ''
                )}
            </Box>
        );
    };
    const focus = {
        textAlign: 'center',
        padding: '0px 15px',
        borderRadius: 15,
        cursor: 'pointer',
        fontSize: '12px',
        border: '1px solid transparent',
        paddingTop: '5px',
        marginBottom: 2
    };
    const focuos = {
        textAlign: 'center',
        padding: '0px 15px',
        borderRadius: 15,
        cursor: 'pointer',
        paddingTop: '5px',
        color: theme.palette.secondary[800],
        fontWeight: 600,
        fontSize: '12px',
        marginBottom: 2
    };

    return (
        // <Box
        //     sx={{
        //         position: 'relative',
        //         '&::after': {
        //             content: '" "',
        //             position: 'absolute',
        //             top: '0',
        //             right: '0px',
        //             width: '5px',
        //             height: maxHeight + 'px',
        //             backgroundColor: theme.palette.mode === 'dark' ? '#1a223f' : 'rgb(244, 246, 248)',
        //             pointerEvents: 'none'
        //         }
        //     }}
        // >
        <Box
            maxWidth="1300px"
            margin="0 auto"
            height="calc(100vh - 128px)"
            overflow="hidden"
            sx={{
                scrollbarGutter: 'stable',
                '&:hover': {
                    overflow: 'scroll'
                }
            }}
        >
            <Box className="flex mb-[8px] flex-wrap items-end gap-3">
                <Typography variant="h2" lineHeight={1}>
                    {t('market.title')}
                </Typography>
                <TextField
                    size="small"
                    id="filled-start-adornment"
                    sx={{ width: '300px' }}
                    placeholder={t('market.place')}
                    name="name"
                    value={queryParams.name}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                {menuList?.map((item, index) => (
                    <Box
                        onClick={() => {
                            changeCategory(item, index);
                        }}
                        sx={active === index ? focuos : focus}
                        key={index}
                    >
                        <img style={{ width: '25px' }} src={require('../../../assets/images/category/' + item.icon + '.svg')} alt="Icon" />
                        <Box sx={{ whiteSpace: 'nowrap', fontSize: '14px' }}>{item.name}</Box>
                    </Box>
                ))}
            </ScrollMenu>

            {newList.map((item, index) => (
                <div key={index}>
                    {item.appList.length > 0 && (
                        <div className="flex justify-between items-center my-[24px]">
                            <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                                {queryParams.category === 'ALL' && (
                                    <img height="20px" src={require('../../../assets/images/category/' + item.icon + '.svg')} alt="" />
                                )}
                                <span>{item.name}</span>
                            </div>
                            {queryParams.category === 'ALL' && (
                                <div onClick={() => changeCategory(item, index)} className="text-[#673ab7] cursor-pointer">
                                    更多模板
                                    <RightOutlined rev={undefined} />
                                </div>
                            )}
                        </div>
                    )}
                    <Grid
                        container
                        display="flex"
                        flexWrap={queryParams.category === 'ALL' ? 'nowrap' : 'wrap'}
                        overflow="hidden"
                        spacing={2}
                    >
                        {item.appList.map((item: any, index: number) =>
                            queryParams.category === 'ALL' && index < 6 ? (
                                <Grid flexShrink={0} lg={2} md={3} sm={6} xs={6} key={item.uid + index} item>
                                    <Template handleDetail={handleDetail} data={item} />
                                </Grid>
                            ) : queryParams.category !== 'ALL' ? (
                                <Grid flexShrink={0} lg={2} md={3} sm={6} xs={6} key={item.uid + index} item>
                                    <Template handleDetail={handleDetail} data={item} />
                                </Grid>
                            ) : (
                                ''
                            )
                        )}
                    </Grid>
                </div>
            ))}
        </Box>
        // </Box>
    );
}
export default TemplateMarket;
