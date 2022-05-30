import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import transitionAllSX from '../../helpers/transitionAllSX';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Link } from 'wouter';
import AddIcon from '@mui/icons-material/Add';
import AddFileCategoryModal from './Modals/AddFileCategoryModal';
import { useTranslation } from 'react-i18next';
import { deleteFile, getFiles } from '../../firebase/Firestore/FileCollection';
import { FileI } from '../../interfaces/FileI';

const Files = () => {
    const { Modal, handleOpen } = AddFileCategoryModal();
    const [refresh, setRefresh] = useState<boolean>(false);
    const { t } = useTranslation();

    const onDeleteFile = (id: string, category: string, title: string) => {
        if (window) {
            if (!window.confirm('Are you Sure?')) {
                return;
            }
        } else {
            return;
        }
        deleteFile(id, category, title)
            .then(() => {
                setRefresh(!refresh);
            })
            .catch()
    }

    const RenderFiles = () => {
        const result = [];
        let i = 0;
        if (!files) {
            return;
        }

        for (const key in files) {
            if (files[key] && Array.isArray(files[key]) && files[key].length) {
                result.push(
                        <Typography component={"h1"} variant={"h3"}>
                            {key}
                        </Typography>
                );
                result.push(
                    <Grid container marginY={2} columnGap={1}>
                        {files[key].map((file: FileI) => (
                            <Grid sx={{
                                opacity: 1,
                                ...transitionAllSX,
                                ":hover": { opacity: 0.9 },
                                bgcolor: "secondary.main",
                                color: "text.primary"
                            }} borderRadius={6} marginY={1} padding={1.5} display={'flex'} item xl={2.93} md={5.9} xs={12} component="div">
                                <Box display={'flex'} width={"100%"} justifyContent={'space-between'}>
                                    <Box display={'flex'}>
                                        <InsertDriveFileIcon sx={{
                                            marginY: "auto",
                                            fontSize: 50,
                                            marginRight: 1.5
                                        }} />
                                        <Box>
                                            <Typography component={"h6"} variant={"h6"}>
                                                {file.title}
                                            </Typography>
                                            <Typography component={"div"} variant={"subtitle1"}>
                                                {(file.date as Date).toDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => onDeleteFile(file.id!, file.category, file.title)} aria-label="delete" size="large">
                                        <DeleteIcon color="error" fontSize='large' />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )
            }
            i++;
        }
        return result;
    }

    const [files, setFiles] = useState<any>({});
    useEffect(() => {
        const result: any = {};
        getFiles()
            .then(data => {
                const docsData = data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id }; });
                docsData.forEach((item: any) => {
                    if (result[item.category]) {
                        result[item.category].push(item);
                    } else {
                        result[item.category] = [item];
                    }
                })
                setFiles(result);

            })
    }, [refresh])

    return (
        <Box>
            <Modal />
            <Box display={'flex'} marginBottom={3} justifyContent="space-between">
                        <Box>
                            <Link to='/files/new'>
                                <Button color='primary' startIcon={<AddIcon />} variant='contained'>{t('FilesPage.addButton')}</Button>
                            </Link>
                            <Button onClick={() => {
                                handleOpen();
                            }} sx={{
                                marginLeft: 2
                            }} color='primary' startIcon={<AddIcon />} variant='contained'>{t('FilesPage.addNewCategory')}</Button>
                        </Box>
                    </Box>
            {RenderFiles()}


        </Box>
    )
}

export default Files;