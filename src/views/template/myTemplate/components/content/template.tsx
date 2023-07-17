import { Card, CardContent, Box, Typography, Tooltip, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import marketStore from 'store/market';
import './textnoWarp.scss';

function Template({ data, handleDetail }: any) {
    const { categoryList } = marketStore();
    const theme = useTheme();
    return (
        <Card
            sx={{
                aspectRatio: '186 / 235',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Box sx={{ aspectRatio: '186 / 80', overflow: 'hidden' }}>
                <img
                    onClick={() => handleDetail(data)}
                    alt="图片"
                    className="headImg cursor"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    src={data.images && data.images[0]}
                />
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    py: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Tooltip disableInteractive title={data.name}>
                    <Typography
                        onClick={() => handleDetail(data)}
                        className="textnoWarp active cursor"
                        gutterBottom
                        variant="h3"
                        sx={{ fontSize: '1rem' }}
                        component="div"
                        my={1}
                    >
                        {data.name}
                    </Typography>
                </Tooltip>
                <Tooltip disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.75rem' }}
                        onClick={() => handleDetail(data)}
                        className="cursor desc"
                        variant="body2"
                        component="div"
                        lineHeight={1.2}
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <Box position="absolute" left="16px" bottom="5px">
                {data.categories &&
                    data.categories.map((item: string) => (
                        <Link color="secondary" href="#" key={item} mr={1} fontSize=".75rem">
                            #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                        </Link>
                    ))}
            </Box>
        </Card>
    );
}

export default Template;
