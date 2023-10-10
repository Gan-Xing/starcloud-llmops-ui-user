import { Button, Card, CardHeader, Divider, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { KeyWord } from './components/Keyword';
import { Content } from './components/Content';

const ListingBuilder = () => {
    return (
        <Card className="h-full">
            <CardHeader
                sx={{ padding: 2 }}
                title={
                    <div>
                        <span>中国</span>
                    </div>
                }
                action={
                    <div>
                        <Button startIcon={<SaveIcon />} color="secondary" size="small" variant="contained">
                            保存草稿
                        </Button>
                        <IconButton></IconButton>
                    </div>
                }
            />
            <Divider />
            <div className="flex bg-[#f4f6f8] h-full">
                <div className="w-[400px] h-full">
                    <KeyWord />
                </div>
                <div className="flex-1 h-full ml-2">
                    <Content />
                </div>
            </div>
        </Card>
    );
};

export default ListingBuilder;
