import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import transitionAllSX from '../../helpers/transitionAllSX';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'wouter';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { deleteNews, getNews } from '../../firebase/Firestore/NewsCollection';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../providers/AuthProvider';

const News = () => {
    const { t } = useTranslation();
    const [News, setNews] = useState<any[]>([]);
    const [_, setLocation] = useLocation();
    const Auth = useContext(AuthContext);

    useEffect(() => {
        getNews()
            .then((data) => {
                setNews(data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id } }));
            })
    }, [])

    return (
        <>
            {/* START - Search bar */}
            <Stack justifyContent={"space-between"} sx={{ p: '2px 4px', }} direction={"row"}>

                <Link to='/news/new'>
                    <Button color='primary' startIcon={<AddIcon />} variant='contained'>{t("newsPage.addButton")}</Button>
                </Link>
            </Stack>
            {/* END - Search bar */}

            {/* Start Main News Section */}
            <Grid container columnGap={1}>
                {News.slice(0, 3).map((NewsItem, index) => {
                    if (index === 0) {
                        return (
                            <Grid key={index} onClick={() => {
                                setLocation(`/news/edit/${NewsItem.id}`)
                            }} item md={5.9} xs={12} component="div" sx={{
                                backgroundImage: `url('${NewsItem.photoURL}')`,
                                height: "400px",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                opacity: 0.75,
                                borderRadius: 6,
                                padding: 2.5,
                                ...transitionAllSX,
                                ":hover": { opacity: 1 },
                                marginY: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}>
                                <Box display={"flex"} justifyContent={"space-between"}>
                                    <Avatar src={Auth?.user?.photoURL as string | undefined}>{Auth?.user?.displayName ? Auth?.user?.displayName[0] : 'A'}</Avatar>
                                    {/* onClick={() => onDeleteFile(file.id!, file.category, file.title)} */}
                                    <IconButton onClick={() => {
                                        if (window.window.confirm(t('Generics.areyousure'))) {
                                            deleteNews(NewsItem.id);
                                        }
                                    }} aria-label="delete" size="large">
                                        <DeleteIcon color="error" fontSize='large' />
                                    </IconButton>
                                </Box>
                                <Box marginBottom={5}>
                                    <Typography color="rgba(255, 255, 255, 0.7)" component="div">{NewsItem.date.toLocaleString('en')}</Typography>
                                    <Typography color="white" fontSize="1.5rem" component="h1">{NewsItem.title}</Typography>
                                </Box>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid key={index} onClick={() => {
                                setLocation(`/news/edit/${NewsItem.id}`)
                            }} item xl={2.93} md={5.9} xs={12} component="div" sx={{
                                backgroundImage: `url('${NewsItem.photoURL}')`,
                                height: "400px",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                opacity: 0.75,
                                borderRadius: 6,
                                marginY: 3,
                                ...transitionAllSX,
                                ":hover": { opacity: 1 },
                                padding: 2.5,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}>
                                <Box display={"flex"} justifyContent={"space-between"}>
                                    <Avatar src={Auth?.user?.photoURL as string | undefined}>{Auth?.user?.displayName ? Auth?.user?.displayName[0] : 'A'}</Avatar>

                                    {/* onClick={() => onDeleteFile(file.id!, file.category, file.title)} */}
                                    <IconButton onClick={() => {
                                        deleteNews(NewsItem.id);
                                    }} aria-label="delete" size="large">
                                        <DeleteIcon color="error" fontSize='large' />
                                    </IconButton>
                                </Box>
                                <Box marginBottom={5}>
                                    <Typography color="rgba(255, 255, 255, 0.7)" component="div">{NewsItem.date.toLocaleString('en')}</Typography>
                                    <Typography color="white" fontSize="1.2rem" component="h1">{NewsItem.title}</Typography>
                                </Box>
                            </Grid>
                        )
                    }
                })}
                {News.slice(3).map((NewsItem, index) => {
                    return (
                        <Grid key={index} onClick={() => {
                            setLocation(`/news/edit/${NewsItem.id}`)
                        }} item xl={2.93} md={5.9} xs={12} component="div" sx={{
                            backgroundImage: `url('${NewsItem.photoURL}')`,
                            height: "400px",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            opacity: 0.75,
                            borderRadius: 6,
                            marginY: 3,
                            ...transitionAllSX,
                            ":hover": { opacity: 1 },
                            padding: 2.5,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Avatar src={Auth?.user?.photoURL as string | undefined}>{Auth?.user?.displayName ? Auth?.user?.displayName[0] : 'A'}</Avatar>

                                {/* onClick={() => onDeleteFile(file.id!, file.category, file.title)} */}
                                <IconButton onClick={() => {
                                    deleteNews(NewsItem.id);
                                }} aria-label="delete" size="large">
                                    <DeleteIcon color="error" fontSize='large' />
                                </IconButton>
                            </Box>
                            <Box marginBottom={5}>
                                <Typography color="rgba(255, 255, 255, 0.7)" component="div">{NewsItem.date.toLocaleString('en')}</Typography>
                                <Typography color="white" fontSize="1.2rem" component="h1">{NewsItem.title}</Typography>
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default News;