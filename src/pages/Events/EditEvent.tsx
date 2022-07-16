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
import { getSingleEvent, updateEvent } from '../../firebase/Firestore/EventsCollection';
import deletePhoto from '../../firebase/Storage/deletePhoto';
import uploadPhotoAndGetUrl from '../../firebase/Storage/uploadPhotoAndGetUrl';

const EditEvents = ({ params }: any) => {
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
    const [excerpt, setExcerpt] = useState<string>("");

    // const [category, setCategory] = useState<string>("");

    const [errors, setErrors] = useState<any>();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [submitting, setSubmitting] = useState(false);
    const onEventsSubmit = async (e: any) => {
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
            photoURL = await uploadPhotoAndGetUrl(params?.id, "events", photo[0]);
        }

        try {
            setSubmitting(true);
            await updateEvent(params?.id, photoURL ? {
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
            setSnackBarValue({ message: "Updated Events successfully", severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/events');
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || 'Error in Editing a new Events', severity: "error" }, 3000);
            console.dir(error)
            setSubmitting(false);
            await deletePhoto(title, "Events");
        }
    }

    useEffect(() => {
        if (!params?.id) {
            setLocation('/events');
            return;
        }

        getSingleEvent(params.id)
            .then((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setTitle(data.title);
                    setExcerpt(data.excerpt);
                    // setCategory(data.category);
                    setRichContent(data.RichContent);
                    setIsAutoDate(false);
                    setDate(data.date);
                    setPhotoURL(data.photoURL);
                    // setNewsObject(doc.data());
                } else {
                    setLocation('/events');
                }
            })

    }, [])

    const modules = {
        toolbar: [
            [{ size: [] }],
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
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('EventPages.editEvent')}</Typography>
            <form onSubmit={onEventsSubmit}>
                <FormControl fullWidth>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('Generics.basicInfo')}</Typography>
                        <TextField onChange={({ target: { value } }) => setTitle(value)} value={title} error={errors?.title} required name="title" margin='normal' fullWidth label={t('Generics.title')} variant="outlined" />
                        <TextField onChange={({ target: { value } }) => setExcerpt(value)} value={excerpt} error={errors?.excerpt} required name="excerpt" margin='normal' fullWidth label={t('Generics.excerpt')} variant="outlined" />
                        <Typography marginTop={5} marginBottom={2} variant='h6' component={'p'}>{t('Generics.content')}</Typography>
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
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('Generics.image')}</Typography>
                        <Typography variant='subtitle1' sx={{ opacity: 0.75 }}
                            fontWeight={500} component={'p'}>{t('Generics.imageDescription')}</Typography>
                        {photoURL ? <ImageDropZone preview={photoURL} dispacther={setPhoto} /> : undefined}
                    </Paper>
                    {/* <Paper elevation={4} sx={{ p: 4, marginTop: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('Generics.category')}</Typography>
                        <Autocomplete
                            disablePortal
                            fullWidth
                            value={category}
                            onChange={(_, value) => setCategory(value || "")}
                            options={["Event", "News"]}
                            renderInput={(params) => <TextField value={category} error={errors?.category} required name='category' margin='dense' {...params} label='Category' />}
                        />

                    </Paper> */}

                    <Paper elevation={4} sx={{ p: 4, marginY: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('Generics.date')}</Typography>
                        {/* <FormGroup sx={{
                            mb: 1
                        }}>
                            <FormControlLabel control={<Switch onChange={(e) => setIsAutoDate(e.target.checked)} name='autoDate' value={isAutoDate} />} label={t('Generics.autoSelect')} />
                        </FormGroup> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                // disabled={isAutoDate}
                                value={date}
                                onChange={setDate}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Paper>
                    <Button disabled={submitting} type='submit' sx={{
                        mb: 3
                    }} variant='contained'>{t('Generics.submit')}</Button>
                </FormControl>
            </form>
        </Box>
    )
};

export default EditEvents;