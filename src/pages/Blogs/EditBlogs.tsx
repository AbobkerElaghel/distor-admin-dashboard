import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
// import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import { useContext, useEffect, useState } from 'react';
import "react-quill/dist/quill.snow.css";
import { ThemeContext } from '../../providers/ThemeProvider';
import ImageDropZone from '../../components/ImageDropZone';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useSnackBar from '../../hooks/SnackBarHook';
import { useLocation } from 'wouter';
import { serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../providers/AuthProvider';
import { getSingleBlog, updateBlog } from '../../firebase/Firestore/BlogsCollection';
import deletePhoto from '../../firebase/Storage/deletePhoto';
import uploadPhotoAndGetUrl from '../../firebase/Storage/uploadPhotoAndGetUrl';

const EditBlogs = ({ params }: any) => {
    const { t } = useTranslation();
    const Theme = useContext(ThemeContext);
    const Auth = useContext(AuthContext);
    const [_, setLocation] = useLocation();

    // Fields

    const [RichContent, setRichContent] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [photo, setPhoto] = useState<File[]>([]);
    const [photoURL, setPhotoURL] = useState<string>("");
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");
    // const [category, setCategory] = useState<string>("");

    const [errors, setErrors] = useState<any>();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [submitting, setSubmitting] = useState(false);
    const onBlogsSubmit = async (e: any) => {
        e.preventDefault();

        if (!title) {
            setErrors({ ...errors, title: true });
            return;
        };

        if (!RichContent) {
            setSnackBarValue({ message: "Content is required", severity: "error" }, 5000);
            return;
        };

        // if (!category) {
        //     setErrors({ ...errors, category: true });
        //     return;
        // };


        if (!Auth?.user?.uid) {
            setSnackBarValue({ message: "Make sure you are signed in", severity: "error" }, 5000);
            return;
        }

        let photoURL = undefined;

        if (photo && photo.length) {
            photoURL = await uploadPhotoAndGetUrl(title, "Blogs", photo[0]);
        }

        try {
            setSubmitting(true);
            await updateBlog(params?.id, photoURL ? {
                title,
                // category,
                RichContent,
                userId: Auth?.user?.uid,
                photoURL,
                date: isAutoDate ? serverTimestamp() : date
            } : {
                title,
                // category,
                RichContent,
                userId: Auth?.user?.uid,
                date: isAutoDate ? serverTimestamp() : date
            });
            setSnackBarValue({ message: "Updated Blogs successfully", severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/blogs');
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || 'Error in Editing a new Blogs', severity: "error" }, 3000);
            console.dir(error)
            setSubmitting(false);
            await deletePhoto(title, "Blogs");
        }
    }

    useEffect(() => {
        if (!params?.id) {
            setLocation('/blogs');
            return;
        }

        getSingleBlog(params.id)
            .then((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setTitle(data.title);
                    // setCategory(data.category);
                    setRichContent(data.RichContent);
                    setIsAutoDate(false);
                    setDate(data.date);
                    setPhotoURL(data.photoURL);
                    // setNewsObject(doc.data());
                } else {
                    setLocation('/blogs');
                }
            })

    }, [])

    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" }
            ],
            ["clean"],
            [{ 'direction': 'rtl' }]
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    return (
        <Box sx={{
            width: { lg: "70%" },
            margin: "auto",
        }}>
            <SnackBarComponent />
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('editBlogsPage.editBlog')}</Typography>
            <form onSubmit={onBlogsSubmit}>
                <FormControl fullWidth>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('editBlogsPage.basicInfo')}</Typography>
                        <TextField onChange={({ target: { value } }) => setTitle(value)} value={title} error={errors?.title} required name="title" margin='normal' fullWidth label={t('editBlogsPage.title')} variant="outlined" />
                        <Typography marginTop={5} marginBottom={2} variant='h6' component={'p'}>{t('editBlogsPage.content')}</Typography>
                        <Box sx={{
                            border: "1px sold rgb(45, 55, 72)",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            height: "400px",
                            ".ql-snow.ql-toolbar": {
                                borderBottomColor: "5px sold rgb(45, 55, 72)",
                            },
                            ".ql-container.ql-snow ": {
                                border: "1px sold rgb(45, 55, 72)",
                                overflow: "hidden",
                                borderEndEndRadius: "10px",
                                borderEndStartRadius: "10px"
                            },
                            ".ql-toolbar .ql-stroke": {
                                fill: "none",
                                stroke: Theme?.isDarkMode ? "#fff" : "#0",
                            },
                            ".ql-toolbar .ql-fill": {
                                fill: Theme?.isDarkMode ? "#fff" : "#0",
                                stroke: "none",

                            },
                            ".ql-toolbar .ql-picker": {
                                color: "#909090"
                            }
                        }}>
                            <ReactQuill
                                placeholder="Type here"
                                value={RichContent}
                                onChange={setRichContent}
                                modules={modules}
                            />
                        </Box>
                    </Paper>

                    <Paper elevation={4} sx={{ p: 4, marginTop: 2 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('editBlogsPage.image')}</Typography>
                        <Typography variant='subtitle1' sx={{ opacity: 0.75 }}
                            fontWeight={500} component={'p'}>{t('editBlogsPage.imageDescription')}</Typography>
                        {photoURL ? <ImageDropZone preview={photoURL} dispacther={setPhoto} /> : undefined}
                    </Paper>
                    {/* <Paper elevation={4} sx={{ p: 4, marginTop: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('editBlogsPage.category')}</Typography>
                        <Autocomplete
                            disablePortal
                            fullWidth
                            value={category}
                            onChange={(_, value) => setCategory(value || "")}
                            options={["Blog", "News"]}
                            renderInput={(params) => <TextField value={category} error={errors?.category} required name='category' margin='dense' {...params} label='Category' />}
                        />

                    </Paper> */}

                    <Paper elevation={4} sx={{ p: 4, marginY: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('editBlogsPage.date')}</Typography>
                        <FormGroup sx={{
                            mb: 1
                        }}>
                            <FormControlLabel control={<Switch onChange={(e) => setIsAutoDate(e.target.checked)} name='autoDate' value={isAutoDate} />} label={t('editBlogsPage.autoSelect')} />
                        </FormGroup>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                disabled={isAutoDate}
                                value={date}
                                onChange={setDate}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Paper>
                    <Button disabled={submitting} type='submit' sx={{
                        mb: 3
                    }} variant='contained'>{t('editBlogsPage.submit')}</Button>
                </FormControl>
            </form>
        </Box>
    )
};

export default EditBlogs;