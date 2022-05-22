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

const Files = () => {
    const { Modal, handleOpen } = AddFileCategoryModal();
    const { t } = useTranslation();


    return (
        <Box>
            <Modal />
            <Box display={'flex'} justifyContent="space-between">
                <Typography component={"h1"} variant={"h3"}>
                    Title of files
                </Typography>

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
            <Grid container marginY={2} columnGap={1}>
                {[1, 1, 1, 1, 1].map(() => (
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
                                        Title of files
                                    </Typography>
                                    <Typography component={"div"} variant={"subtitle1"}>
                                        {new Date().toDateString()}
                                    </Typography>

                                </Box>
                            </Box>
                            <IconButton aria-label="delete" size="large">
                                <DeleteIcon color="error" fontSize='large' />
                            </IconButton>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Typography component={"h1"} variant={"h3"}>
                Title of files
            </Typography>
            <Grid container marginY={2} columnGap={1}>
                {[1, 1, 1].map(() => (
                    <Grid sx={{
                        opacity: 1,
                        ...transitionAllSX,
                        ":hover": { opacity: 0.9 },
                        bgcolor: "secondary.main",
                        color: "text.primary"
                    }} borderRadius={6} marginY={1} padding={1.5} display={'flex'} item xl={2.93} md={5.9} xs={12} component="div">
                        <InsertDriveFileIcon sx={{
                            marginY: "auto",
                            fontSize: 50,
                            marginRight: 1.5
                        }} />
                        <Box>
                            <Typography component={"h6"} variant={"h6"}>
                                Title of files
                            </Typography>
                            <Typography component={"div"} variant={"subtitle1"}>
                                {new Date().toDateString()}
                            </Typography>
                        </Box>

                    </Grid>
                ))}
            </Grid>

            <Typography component={"h1"} variant={"h3"}>
                Title of files
            </Typography>
            <Grid container marginY={2} columnGap={1}>
                {[1, 1].map(() => (
                    <Grid sx={{
                        opacity: 1,
                        ...transitionAllSX,
                        ":hover": { opacity: 0.9 },
                        bgcolor: "secondary.main",
                        color: "text.primary"
                    }} borderRadius={6} marginY={1} padding={1.5} display={'flex'} item xl={2.93} md={5.9} xs={12} component="div">
                        <InsertDriveFileIcon sx={{
                            marginY: "auto",
                            fontSize: 50,
                            marginRight: 1.5
                        }} />
                        <Box>
                            <Typography component={"h6"} variant={"h6"}>
                                Title of files
                            </Typography>
                            <Typography component={"div"} variant={"subtitle1"}>
                                {new Date().toDateString()}
                            </Typography>

                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default Files;