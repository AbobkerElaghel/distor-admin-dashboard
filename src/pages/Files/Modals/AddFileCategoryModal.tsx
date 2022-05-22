import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { addFileCategory } from '../../../firebase/Firestore/FileCategoryCollection';
import { AuthContext } from '../../../providers/AuthProvider';
import useSnackBar from '../../../hooks/SnackBarHook';
import { serverTimestamp } from 'firebase/firestore';

const AddFileCategoryModal = () => {

    const [isOpen, setIsOpen] = useState(false);
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();

    const { t } = useTranslation();
    const [language, setLanguage] = useState("");
    const [errors, setErrors] = useState<any>();
    const [submitting, setSubmitting] = useState(false);
    const Auth = useContext(AuthContext);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const title = e.target.elements.title.value;
        if (!title) {
            setErrors({ ...errors, title: true });
            return;
        };
        if (!language) {
            setErrors({ ...errors, language: true });
            return;
        };

        if (!Auth?.user?.uid) {
            setSnackBarValue({ message: t('AddFileCategory.feedbackFileCategoryAuthRequired'), severity: "error" }, 5000);
            return;
        }
        try {
            setSubmitting(true);
            await addFileCategory({
                title,
                lang: language,
                userId: Auth?.user?.uid,
                date: serverTimestamp()
            });
            setSnackBarValue({ message: t('AddFileCategory.feedbackFileCategoryAdded'), severity: "success" }, 2000);
            setTimeout(() => {
                setSubmitting(false);
                setIsOpen(false);
            }, 2100)
        } catch (error: any) {
            setSnackBarValue({ message: error.message || t('AddFileCategory.feedbackFileCategoryAddedError'), severity: "error" }, 3000);
            console.dir(error);
            setSubmitting(false);
        }
    };
    const handleClose = () => {
        setIsOpen(false);
    };
    const handleOpen = () => {
        setIsOpen(true);
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        color: "text.primary",
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return {
        Modal: () => (<Modal
            open={isOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={onSubmit}>
                <SnackBarComponent />
                <Box sx={style}>
                    <Typography marginBottom={3} id="modal-modal-title" variant="h6" component="h2">
                        {t('AddFileCategory.modalTitle')}
                    </Typography>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        onChange={(_, value) => {
                            if (value) {
                                setLanguage(value!.value);
                            }
                        }}
                        getOptionLabel={(option) => option.title}
                        options={[{ title: t('navbar.languageMenu-arabic'), value: "ar" }, { title: t('navbar.languageMenu-english'), value: "en" }, { title: t('navbar.languageMenu-french'), value: "fr" }]}
                        renderInput={(params) => <TextField name="lang" error={errors?.language} margin='dense' {...params} label={t('addFilePage.languages')} />}
                    />
                    <TextField margin='dense' name="title" error={errors?.title} fullWidth label={t('AddFileCategory.name')} />
                    <Button disabled={submitting} type='submit' fullWidth sx={{ marginY: 1 }} color='info' variant='contained'>{t('AddFileCategory.submit')}</Button>
                    <Button onClick={handleClose} fullWidth sx={{ marginY: 1 }} color='error' variant='contained'>{t('AddFileCategory.cancel')}</Button>
                </Box>
            </form>
        </Modal>), handleOpen
    };
}

export default AddFileCategoryModal;