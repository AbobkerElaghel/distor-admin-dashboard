import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import transitionAllSX from '../../helpers/transitionAllSX';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'wouter';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { deleteBlog, getBlogs } from '../../firebase/Firestore/BlogsCollection';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../providers/AuthProvider';

const Blogs = () => {
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [_, setLocation] = useLocation();

    useEffect(() => {
        getBlogs()
            .then((data) => {
                setBlogs(data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id } }));
            })
    }, [])

    return (
        <>
            {/* START - Search bar */}
            <Stack justifyContent={"space-between"} sx={{ p: '2px 4px', }} direction={"row"}>
                {/* <Paper
                    component="form"
                    sx={{ display: 'flex', alignItems: 'center', width: { md: '300px' } }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={t("blogsPage.searchBar")}
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper> */}
                <Link to='/blogs/new'>
                    <Button color='primary' startIcon={<AddIcon />} variant='contained'>{t("blogsPage.addButton")}</Button>
                </Link>
            </Stack>
            {/* END - Search bar */}

            {/* Start Main News Section */}
            <Grid container columnGap={1}>
                {blogs.slice(0, 3).map((blogsItem, index) => {
                    if (index === 0) {
                        return (
                            <Grid key={index} onClick={() => {
                                setLocation(`/blogs/edit/${blogsItem.id}`)
                            }} item md={5.9} xs={12} component="div" sx={{
                                backgroundImage: `url('${blogsItem.photoURL}')`,
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
                                        // eslint-disable-next-line no-restricted-globals
                                        if (window.confirm(t('Generics.areyousure'))) {
                                            deleteBlog(blogsItem.id, blogsItem.title);
                                        }
                                    }} aria-label="delete" size="large">
                                        <DeleteIcon color="error" fontSize='large' />
                                    </IconButton>
                                </Box>

                                <Box marginBottom={5}>
                                    <Typography color="rgba(255, 255, 255, 0.7)" component="div">{blogsItem.date.toLocaleString('en')}</Typography>
                                    <Typography color="white" fontSize="1.5rem" component="h1">{blogsItem.title}</Typography>
                                </Box>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid key={index} onClick={() => {
                                setLocation(`/blogs/edit/${blogsItem.id}`)
                            }} item xl={2.93} md={5.9} xs={12} component="div" sx={{
                                backgroundImage: `url('${blogsItem.photoURL}')`,
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
                                        deleteBlog(blogsItem.id, blogsItem.title);
                                    }} aria-label="delete" size="large">
                                        <DeleteIcon color="error" fontSize='large' />
                                    </IconButton>
                                </Box>
                                <Box marginBottom={5}>
                                    <Typography color="rgba(255, 255, 255, 0.7)" component="div">{blogsItem.date.toLocaleString('en')}</Typography>
                                    <Typography color="white" fontSize="1.2rem" component="h1">{blogsItem.title}</Typography>
                                </Box>
                            </Grid>
                        )
                    }
                })}
                {blogs.slice(3).map((blogsItem, index) => {
                    return (
                        <Grid key={index} onClick={() => {
                            setLocation(`/blogs/edit/${blogsItem.id}`)
                        }} item xl={2.93} md={5.9} xs={12} component="div" sx={{
                            backgroundImage: `url('${blogsItem.photoURL}')`,
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
                                    deleteBlog(blogsItem.id, blogsItem.title);
                                }} aria-label="delete" size="large">
                                    <DeleteIcon color="error" fontSize='large' />
                                </IconButton>
                            </Box>
                            <Box marginBottom={5}>
                                <Typography color="rgba(255, 255, 255, 0.7)" component="div">{blogsItem.date.toLocaleString('en')}</Typography>
                                <Typography color="white" fontSize="1.2rem" component="h1">{blogsItem.title}</Typography>
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default Blogs;