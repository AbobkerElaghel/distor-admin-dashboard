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
import { useContext, useEffect, useState } from 'react';
import "react-quill/dist/quill.snow.css";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useSnackBar from '../../hooks/SnackBarHook';
import { useLocation } from 'wouter';
import { serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../providers/AuthProvider';
import { getSingleQA, updateQA } from '../../firebase/Firestore/QAsCollection';

const EditQAs = ({ params }: any) => {
    const { t } = useTranslation();
    const Auth = useContext(AuthContext);
    const [_, setLocation] = useLocation();
    const [date, setDate] = useState<Date | null>(new Date());
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [q, setTitle] = useState<string>("");
    const [a, setExcerpt] = useState<string>("");
    const [errors, setErrors] = useState<any>();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [submitting, setSubmitting] = useState(false);
    const onQAsSubmit = async (e: any) => {
        e.preventDefault();

        if (!q) {
            setErrors({ ...errors, q: true });
            return;
        };

        if (!Auth?.user?.uid) {
            setSnackBarValue({ message: "Make sure you are signed in", severity: "error" }, 5000);
            return;
        }

        try {
            setSubmitting(true);
            await updateQA(params?.id, {
                q,
                a,
                userId: Auth?.user?.uid,
                date: isAutoDate ? serverTimestamp() : date
            });
            setSnackBarValue({ message: "Updated QAs successfully", severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/qas');
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || 'Error in Editing a new QAs', severity: "error" }, 3000);
            console.dir(error)
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (!params?.id) {
            setLocation('/qas');
            return;
        }

        getSingleQA(params.id)
            .then((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setTitle(data.q);
                    setExcerpt(data.a);
                    // setCategory(data.category);
                    setIsAutoDate(false);
                    setDate(data.date);
                    // setNewsObject(doc.data());
                } else {
                    setLocation('/qas');
                }
            })

    }, [])

    return (
        <Box sx={{
            width: { lg: "70%" },
            margin: "auto",
        }}>
            <SnackBarComponent />
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('Generics.edit')}</Typography>
            <form onSubmit={onQAsSubmit}>
                <FormControl fullWidth>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('Generics.basicInfo')}</Typography>
                        <TextField onChange={({ target: { value } }) => setTitle(value)} value={q} error={errors?.q} required name="q" margin='normal' fullWidth label={t('Generics.q')} variant="outlined" />
                        <TextField rows={4} multiline onChange={({ target: { value } }) => setExcerpt(value)} value={a} error={errors?.a} required name="a" margin='normal' fullWidth label={t('Generics.a')} variant="outlined" />


                    </Paper>

                    <Paper elevation={4} sx={{ p: 4, marginY: 2 }}>
                        <Typography marginBottom={2} variant='h5' fontWeight={500} component={'h5'}>{t('Generics.date')}</Typography>
                        <FormGroup sx={{
                            mb: 1
                        }}>
                            <FormControlLabel control={<Switch onChange={(e) => setIsAutoDate(e.target.checked)} name='autoDate' value={isAutoDate} />} label={t('Generics.autoSelect')} />
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
    )
};

export default EditQAs;