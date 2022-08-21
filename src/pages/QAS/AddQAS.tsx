import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useContext, useState } from 'react';
import "react-quill/dist/quill.snow.css";
import { ThemeContext } from '../../providers/ThemeProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useSnackBar from '../../hooks/SnackBarHook';
import { useLocation } from 'wouter';
import { serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../providers/AuthProvider';
import { addQAs } from '../../firebase/Firestore/QAsCollection';

const AddQAs = () => {
    const { t } = useTranslation();
    const Theme = useContext(ThemeContext);
    const Auth = useContext(AuthContext);
    const [_, setLocation] = useLocation();

    // Fields
    const [language, setLanguage] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [errors, setErrors] = useState<any>();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [submitting, setSubmitting] = useState(false);

    const onQAsSubmit = async (e: any) => {
        e.preventDefault();
        const q = e.target.elements.q.value;
        const a = e.target.elements.a.value;
        // const category = e.target.elements.category.value;

        if (!q) {
            setErrors({ ...errors, q: true });
            return;
        };

        if (!a) {
            setErrors({ ...errors, a: true });
            return;
        };


        if (!language) {
            setErrors({ ...errors, language: true });
            return;
        };


        if (!Auth?.user?.uid) {
            setSnackBarValue({ message: t('Generics.feedbackAuthRequired'), severity: "error" }, 5000);
            return;
        }
        try {
            setSubmitting(true);
            await addQAs({
                q,
                language,
                a,
                userId: Auth?.user?.uid,
                date: isAutoDate ? serverTimestamp() : date
            });
            setSnackBarValue({ message: t('Generics.feedbackAdded'), severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/qas');
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || t('Generics.feedbackAddedError'), severity: "error" }, 3000);
            console.dir(error);
            setSubmitting(false);
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
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('Generics.addQ')}</Typography>
            <form onSubmit={onQAsSubmit}>
                <FormControl fullWidth>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('Generics.basicInfo')}</Typography>
                        <TextField error={errors?.q} required name="q" margin='normal' fullWidth label={t('Generics.q')} variant="outlined" />
                        <TextField multiline rows={4} error={errors?.a} required name="a" margin='normal' fullWidth label={t('Generics.a')} variant="outlined" />

                    </Paper>


                    <Paper elevation={4} sx={{ p: 4, marginTop: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('Generics.languages')}</Typography>

                        <Autocomplete
                            disablePortal
                            fullWidth
                            onChange={(_, value) => {
                                setLanguage(value!.value);
                            }}
                            getOptionLabel={(option) => option.q}
                            options={[{ q: t('navbar.languageMenu-arabic'), value: "ar" }, { q: t('navbar.languageMenu-english'), value: "en" }, { q: t('navbar.languageMenu-french'), value: "fr" }]}
                            renderInput={(params) => <TextField error={errors?.language} margin='dense' {...params} label={t('Generics.languages')} />}
                        />
                    </Paper>

                    <Paper elevation={4} sx={{ p: 4, marginY: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('Generics.date')}</Typography>
                        <FormGroup sx={{
                            mb: 1
                        }}>
                            <FormControlLabel control={<Switch onChange={(e) => setIsAutoDate(e.target.checked)} name='autoDate' defaultChecked />} label={t('Generics.autoSelect')} />
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
                    }} variant='contained'>{t('Generics.submit')}</Button>
                </FormControl>
            </form>
        </Box>
    );
};

export default AddQAs;