import { Box, Typography, Button } from "@mui/material";
import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import transitionAllSX from "../helpers/transitionAllSX";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../providers/ThemeProvider";

interface ImagePreviewComponentType {
    dispacther?: (argo: any) => void;
    preview?: string;
    clearImage?: any;
    size?: "small" | "normal";
};

const ImageDropZone = ({ dispacther = () => { }, preview, clearImage = () => { }, size = "normal" }: ImagePreviewComponentType) => {
    const [image, setImage] = useState<any>([]);
    const [ineerPreview, setPreview] = useState(preview || '');
    const Theme = useContext(ThemeContext);
    const { t } = useTranslation();
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/*": ['.png', '.gif', '.jpeg', '.jpg', '.webp'],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 5000000,
        onDrop: acceptedFiles => {
            const image = acceptedFiles.map(upFile => Object.assign(upFile, {
                preview: URL.createObjectURL(upFile)
            })).splice(0, 1);
            setImage(image);
            dispacther(image);
        }
    });

    return (
        <>
            {ineerPreview || image.length ? <Box>
                <Box>
                    <img style={{
                        width: "100%"
                    }} src={ineerPreview ? `${ineerPreview}` : image[0].preview} alt="preview" />
                </Box>
            </Box> :
                <Box sx={{
                    ...transitionAllSX,
                    border: 1,
                    cursor: "pointer",
                    borderStyle: "dashed",
                    ":hover": {
                        opacity: 0.7
                    }
                }} display={'flex'} width={'100%'} height={'100%'} marginY={size === 'normal' ? 3 : 1} padding={size === 'normal' ? 3 : 2} borderRadius={3}  {...getRootProps()}>
                    <Box margin={'auto'}>
                        <input {...getInputProps()} />
                        {
                            <Box sx={{
                                cursor: "pointer",
                            }} width={"100%"} display={"flex"}>
                                <img width={size === 'small' ? 75 : 150} style={{
                                    margin: "auto"
                                }} src={Theme?.isDarkMode ? "/addImageDark.svg" : "/addImageWhite.svg"} alt="dragdrop icon" />
                                <Box margin={"auto"} marginX={5}>
                                    <Typography variant='h6' component={'p'}>{t('ImageDropZone.title')}</Typography>
                                    {size === 'normal' ? <Typography variant='subtitle1' component={'p'}>{t('ImageDropZone.description')}</Typography> : undefined}
                                </Box>
                            </Box>
                        }
                    </Box>
                </Box>
            }
            {
                image.length || ineerPreview ? <>
                    <Button variant="contained" color="primary" onClick={() => { setImage([]); setPreview(''); dispacther([]); clearImage() }}>{t('ImageDropZone.clear')}</Button>
                </> : undefined
            }
        </>
    )
}

export default ImageDropZone;