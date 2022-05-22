import { useContext, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useSnackBar from '../../hooks/SnackBarHook';
import { useLocation } from 'wouter';
import { serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../providers/AuthProvider';
import FileDropZone from '../../components/FileDropZone';
import { getFileCategories } from '../../firebase/Firestore/FileCategoryCollection';
import { addFile } from '../../firebase/Firestore/FileCollection';
import uploadFileAndGetUrl from '../../firebase/Storage/uploadFileAndGetUrl';
import deletePhoto from '../../firebase/Storage/deletePhoto';

const AddFile = () => {
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();

    // Form Field
    const [language, setLanguage] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [category, setCategory] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<any>();


    const Auth = useContext(AuthContext);
    const [_, setLocation] = useLocation();
    const { t } = useTranslation();
    const [file, setFile] = useState<File[]>([]);

    const [fileCategories, setFileCategories] = useState<any[]>([]);

    useEffect(() => {
        getFileCategories()
            .then((data) => {
                setFileCategories(data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id }; }));
            })
    }, [])

    const onFileSubmit = async (e: any) => {
        e.preventDefault();
        const title = e.target.elements.title.value;

        if (!title) {
            setErrors({ ...errors, title: true });
            return;
        };

        if (!category) {
            setErrors({ ...errors, category: true });
            return;
        };

        if (!file || !file.length) {
            setSnackBarValue({ message: t('addFilePage.feedbackFileFileRequired'), severity: "error" }, 5000);
            return;
        };


        if (!language) {
            setErrors({ ...errors, language: true });
            return;
        };

        if (!Auth?.user?.uid) {
            setSnackBarValue({ message: t('addFilePage.feedbackFileAuthRequired'), severity: "error" }, 5000);
            return;
        }

        try {
            setSubmitting(true);
            const fileURL = await uploadFileAndGetUrl(title, category, file[0]);
            await addFile({
                title,
                date: serverTimestamp(),
                category,
                fileURL,
                lang: language,
                userId: Auth?.user?.uid,
            });

            setSnackBarValue({ message: t('addFilePage.feedbackFileAdded'), severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/files');
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || t('addFilePage.feedbackFileAddedError'), severity: "error" }, 3000);
            console.dir(error);
            setSubmitting(false);
            if (!(error.message === "Title Name is Used Already")) {
                await deletePhoto(title, category);
            }
        }
    };

    return (
        <Box sx={{
            width: { lg: "70%" },
            margin: "auto",
        }}>
            <SnackBarComponent />
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('addFilePage.createNewFile')}</Typography>
            <form onSubmit={onFileSubmit}>
                <FormControl fullWidth>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('addFilePage.basicInfo')}</Typography>
                        <TextField error={errors?.title} required name="title" margin='normal' fullWidth label={t('addFilePage.title')} variant="outlined" />
                        <Typography marginY={2} variant='h5' fontWeight={500} component={'h5'}>{t('addFilePage.languages')}</Typography>

                        <Autocomplete
                            disablePortal
                            fullWidth
                            onChange={(_, value) => {
                                setLanguage(value!.value);
                            }}
                            getOptionLabel={(option) => option.title}
                            options={[{ title: t('navbar.languageMenu-arabic'), value: "ar" }, { title: t('navbar.languageMenu-english'), value: "en" }, { title: t('navbar.languageMenu-french'), value: "fr" }]}
                            renderInput={(params) => <TextField error={errors?.language} margin='dense' {...params} label={t('addFilePage.languages')} />}
                        />

                        <Typography marginY={2} variant='h5' fontWeight={500} component={'h5'}>{t('addFilePage.category')}</Typography>
                        <Autocomplete
                            disablePortal
                            fullWidth
                            onChange={(_, value) => {
                                setCategory(value!.title);
                            }}
                            loading={!fileCategories.length}
                            getOptionLabel={(option) => option.title}
                            options={fileCategories}
                            renderInput={(params) => <TextField error={errors?.category} margin='dense' {...params} label={t('addFilePage.category')} />}
                        />
                    </Paper>

                    <Paper elevation={4} sx={{ p: 4, marginY: 2 }}>
                        <Typography variant='h5' fontWeight={500} component={'h5'}>{t('addFilePage.file')}</Typography>
                        <Typography variant='subtitle1' sx={{ opacity: 0.75 }}
                            fontWeight={500} component={'p'}>{t('addFilePage.fileDescription')}</Typography>
                        <FileDropZone dispacther={setFile} />
                    </Paper>
                    <Button disabled={submitting} type='submit' sx={{
                        mb: 3
                    }} variant='contained'>{t('addFilePage.submit')}</Button>
                </FormControl>
            </form>
        </Box>
    )
}

export default AddFile