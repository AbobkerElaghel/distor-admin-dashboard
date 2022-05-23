import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import transitionAllSX from "../helpers/transitionAllSX";
import { useTranslation } from 'react-i18next';

interface FileDropZoneI {
    dispacther?: (argo: any) => void;
    preview?: string;
    clearFile?: any;
    size?: "small" | "normal";
};

const FileDropZone = ({ dispacther = () => { }, clearFile = () => { }, size = "normal" }: FileDropZoneI) => {
    const [file, setFile] = useState<File[]>([]);
    const { t } = useTranslation();

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "application/pdf": ['.pdf'],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 10000000,
        onDrop: acceptedFiles => {
            const file = acceptedFiles.splice(0, 1);
            setFile(file);
            console.log(file);
            dispacther(file);
        }
    });



    return (
        <>
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
                            }} src={file.length ? "/fileSelected.svg" : "/fileNotSelected.svg"} alt="dragdrop icon" />
                            <Box margin={"auto"} marginX={5}>
                                <Typography variant='h6' component={'p'}>{file.length ? file[0].name : t('FileDropZone.title')}</Typography>
                                {size === 'normal' ? <Typography variant='subtitle1' component={'p'}>{file.length ? (file[0].size / 1000 / 1000).toPrecision(3) : t('ImageDropZone.description')} MB</Typography> : undefined}
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
            {
                file.length ? <>
                    <Button variant="contained" color="primary" onClick={() => { setFile([]); dispacther([]); clearFile() }}>{t('ImageDropZone.clear')}</Button>
                </> : undefined
            }
        </>
    )
}

export default FileDropZone;