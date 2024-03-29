import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import { useContext, useState } from 'react';
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
import { addFounders, updateFounder } from '../../firebase/Firestore/FoundersCollection';
import deletePhoto from '../../firebase/Storage/deletePhoto';
import uploadPhotoAndGetUrl from '../../firebase/Storage/uploadPhotoAndGetUrl';

const AddBlogs = () => {
    const { t } = useTranslation();
    const Theme = useContext(ThemeContext);
    const Auth = useContext(AuthContext);
    const [_, setLocation] = useLocation();

    // Fields
    const [language, setLanguage] = useState("");
    const [RichContent, setRichContent] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [photo, setPhoto] = useState<File[]>([]);
    const [errors, setErrors] = useState<any>();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [submitting, setSubmitting] = useState(false);

    const onFoundersSubmit = async (e: any) => {
        e.preventDefault();
        const title = e.target.elements.title.value;
        const excerpt = e.target.elements.excerpt.value;
        // const category = e.target.elements.category.value;

        if (!title) {
            setErrors({ ...errors, title: true });
            return;
        };

        if (!excerpt) {
            setErrors({ ...errors, excerpt: true });
            return;
        };

        if (!RichContent) {
            setSnackBarValue({ message: t('AddFounderPage.feedbackFounderRichContentRequired'), severity: "error" }, 5000);
            return;
        };

        if (!language) {
            setErrors({ ...errors, language: true });
            return;
        };

        if (!photo.length) {
            setSnackBarValue({ message: t('AddFounderPage.feedbackFounderPhotoRequired'), severity: "error" }, 5000);
            return;
        }
        if (!Auth?.user?.uid) {
            setSnackBarValue({ message: t('AddFounderPage.feedbackFounderAuthRequired'), severity: "error" }, 5000);
            return;
        }
        try {
            setSubmitting(true);
            const doc = await addFounders({
                title,
                language,
                excerpt,
                RichContent,
                userId: Auth?.user?.uid,
                // photoURL,
                date: date ? date : serverTimestamp()
            });
            const photoURL = await uploadPhotoAndGetUrl(doc.id, "founders", photo[0]);
            await updateFounder(doc.id, { photoURL });
            setSnackBarValue({ message: t('AddFounderPage.feedbackFounderAdded'), severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/founders');
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || t('AddFounderPage.feedbackFounderAddedError'), severity: "error" }, 3000);
            console.dir(error);
            setSubmitting(false);
            if (!(error.message === "Title Name is Used Already")) {
                await deletePhoto(title, "Founders");
            }
        }
    }

    const modules = {
        toolbar: [
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote", "code", "link"],
            [{ 'background': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"] }],
            [{ 'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"] }],
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
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('AddFounderPage.addUserButton')}</Typography>
            <form onSubmit={onFoundersSubmit}>
                <FormControl fullWidth>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('addBlogsPage.basicInfo')}</Typography>
                        <TextField error={errors?.title} required name="title" margin='normal' fullWidth label={t('addBlogsPage.title')} variant="outlined" />
                        <TextField error={errors?.excerpt} required name="excerpt" margin='normal' fullWidth label={t('addPageCommons.excerpt')} variant="outlined" />
                        <Typography marginTop={5} marginBottom={2} variant='h6' component={'p'}>{t('AddFounderPage.content')}</Typography>
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
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('addBlogsPage.image')}</Typography>
                        <Typography variant='subtitle1' sx={{ opacity: 0.75 }}
                            fontWeight={500} component={'p'}>{t('addBlogsPage.imageDescription')}</Typography>
                        <ImageDropZone dispacther={setPhoto} />
                    </Paper>
                    <Paper elevation={4} sx={{ p: 4, marginTop: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('addBlogsPage.languages')}</Typography>

                        <Autocomplete
                            disablePortal
                            fullWidth
                            onChange={(_, value) => {
                                setLanguage(value!.value);
                            }}
                            getOptionLabel={(option) => option.title}
                            options={[{ title: t('navbar.languageMenu-arabic'), value: "ar" }, { title: t('navbar.languageMenu-english'), value: "en" }, { title: t('navbar.languageMenu-french'), value: "fr" }]}
                            renderInput={(params) => <TextField error={errors?.language} margin='dense' {...params} label={t('addBlogsPage.languages')} />}
                        />
                    </Paper>

                    <Paper elevation={4} sx={{ p: 4, marginY: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('addBlogsPage.date')}</Typography>
                        {/* <FormGroup sx={{
                            mb: 1
                        }}>
                            <FormControlLabel control={<Switch onChange={(e) => setIsAutoDate(e.target.checked)} name='autoDate' defaultChecked />} label={t('addBlogsPage.autoSelect')} />
                        </FormGroup> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                value={date}
                                onChange={setDate}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Paper>
                    <Button disabled={submitting} type='submit' sx={{
                        mb: 3
                    }} variant='contained'>{t('AddFounderPage.submit')}</Button>
                </FormControl>
            </form>
        </Box>
    );
};

export default AddBlogs;