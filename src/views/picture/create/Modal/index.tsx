// material-ui
import { Grid, IconButton, Modal } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { IImageListTypeChildImages } from '../index';

export default function PicModal({
    open,
    setOpen,
    currentIndex,
    setCurrentIndex,
    currentImageList
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentIndex: number;
    setCurrentIndex: (currentIndex: number) => void;
    currentImageList: IImageListTypeChildImages[];
}) {
    // getModalStyle is not a pure function, we roll the style only on the first render

    const handleClose = () => {
        setOpen(false);
    };

    const handlePrev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex(currentIndex - 1);
    };

    const btnDisable = React.useMemo(() => {
        const obj = { preDis: false, nextDis: false };
        if (currentIndex === 0) {
            obj.preDis = true;
        }
        if (currentIndex === currentImageList.length - 1) {
            obj.nextDis = true;
        }
        return obj;
    }, [currentIndex, currentImageList.length]);

    const handleNext = () => {
        const length = currentImageList.length - 1;
        if (currentIndex === length) {
            return;
        }
        setCurrentIndex(currentIndex + 1);
    };

    return (
        <Grid container justifyContent="flex-end">
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        width: '90%',
                        height: '90%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    title="图片预览"
                    content={false}
                    secondary={
                        <IconButton onClick={handleClose} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <div className="w-full bg-[#f4f6f8] h-[90%]">
                        <div className="h-full grid grid-cols-3 gap-1 p-4">
                            <div className="h-full sm:col-span-2 group relative bg-white xs:col-span-3 flex justify-center">
                                <img
                                    className="w-full grow basis-0  duration-100 opacity-100 rounded"
                                    src={currentImageList?.[currentIndex]?.url}
                                    alt={currentImageList?.[currentIndex]?.uuid}
                                />
                                <button
                                    className={`${
                                        btnDisable.preDis ? 'bg-black/20 cursor-not-allowed' : 'bg-black/50 cursor-pointer'
                                    } flex-none w-10 h-10 flex justify-center items-center rounded-md  border-none absolute left-0 top-[48%]`}
                                    onClick={() => handlePrev()}
                                    disabled={btnDisable.preDis}
                                >
                                    <LeftOutlined rev={undefined} style={{ color: '#fff' }} />
                                </button>
                                <button
                                    className={`${
                                        btnDisable.nextDis ? 'bg-black/20 cursor-not-allowed' : 'bg-black/50 cursor-pointer'
                                    } flex-none w-10 h-10 flex justify-center items-center rounded-md border-none absolute right-0 top-[48%]`}
                                    onClick={() => handleNext()}
                                >
                                    <RightOutlined rev={undefined} style={{ color: '#fff' }} />
                                </button>
                            </div>
                            <div className="h-full sm:col-span-1 p-4 bg-white xs:col-span-3">
                                <div className="flex flex-col mt-3">
                                    <span className="text-base">prompt:</span>
                                    <span>Vibrant street fair with colorful stalls and bustling crowds, lively, busy, high detail</span>
                                </div>
                                <div className="flex flex-col  mt-3">
                                    <span className="text-base">Model:</span>
                                    <span>sdfs</span>
                                </div>
                                <div className="flex flex-col  mt-3">
                                    <span className="text-base">Size:</span>
                                    <span>512 × 512</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainCard>
            </Modal>
        </Grid>
    );
}
