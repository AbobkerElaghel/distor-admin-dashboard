import { Box, Typography, Stack, TextField, Autocomplete, Button, Paper } from '@mui/material';
import { useState } from 'react';
import ImageDropZone from '../../components/ImageDropZone';
import { adminAddUser } from '../../firebase/functions';
import { uploadPhotoAndGetUrl, deletePhoto } from '../../firebase/storage';
import useSnackBar from '../../hooks/SnackBarHook';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

const AddUser = () => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [photo, setPhoto] = useState<File[]>([]);
    const [isNotMatchPassword, setIsNotMatchPassword] = useState(false);
    const [errors, setErrors] = useState<any>();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [submitting, setSubmitting] = useState(false);
    const [_, setLocation] = useLocation();
    const { t } = useTranslation();

    const onSubmit = async (e: any) => {
        e.preventDefault();
        const displayName = e.target.elements.displayName.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        if (password !== confirmPassword) {
            setIsNotMatchPassword(true);
            return;
        };

        if (!selectedRoles.length) {
            setErrors({ ...errors, roles: true });
            return;
        };

        if (!email) {
            setErrors({ ...errors, email: true });
            return;
        };

        if (!displayName) {
            setErrors({ ...errors, displayName: true });
            return;
        };

        if (!password) {
            setErrors({ ...errors, password: true });
            return;
        };

        const roles: { [role: string]: boolean } = {};
        selectedRoles.forEach((value) => {
            roles[value] = true;
        });

        let photoURL = null;
        try {
            setSubmitting(true);
            if (photo && photo.length && photo[0]) {
                photoURL = await uploadPhotoAndGetUrl(email, 'Users', photo[0]);
            }
            await adminAddUser({ displayName, email, password, photoURL, roles });
            setSnackBarValue({ message: t('addUsersPage.feedbackUserAdded'), severity: "success" }, 2000);
            setTimeout(() => {
                setLocation('/users');
            }, 2100)
        } catch (error: any) {
            await deletePhoto(email, "Users");
            setSnackBarValue({ message: error.message || t('addUsersPage.feedbackUserAddedError'), severity: "error" }, 3000);
            console.dir(error)
            setSubmitting(false);
        }
    };
    return (
        <Box sx={{
            width: { lg: "70%" },
            margin: "auto",
        }}>
            <SnackBarComponent />
            <Typography marginTop={7} marginBottom={3} fontWeight={500} variant='h3' component={"h3"}>{t('addUsersPage.addNewUsertitle')}</Typography>
            <Paper elevation={4} sx={{ p: 4 }}>

                <form onSubmit={onSubmit} style={{
                    display: 'flex',
                    flexDirection: "column"
                }}>
                    <Stack spacing={2} direction={'column'}>
                        <TextField error={errors?.displayName} name="displayName" required label={t('addUsersPage.name')} />
                        <TextField error={errors?.email} name="email" type={'email'} required label={t('addUsersPage.email')} />
                        {/* <TextField error={errors?.phoneNumber} name="phoneNumber" type={'number'} required label="Phone Number" /> */}
                        <Autocomplete
                            multiple
                            onChange={(_, value) => {
                                setSelectedRoles(value);
                            }}
                            aria-required={true}
                            options={["admin", "editor", "reader"]}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField
                                    error={errors?.roles}
                                    helperText={errors?.roles ? t('addUsersPage.feedbackUserRolesRequired') : undefined}
                                    name='roles'
                                    {...params}
                                    label={t('addUsersPage.roles')}
                                />
                            )}
                        />

                        <ImageDropZone dispacther={setPhoto} size='small' />
                        <TextField helperText={isNotMatchPassword ? t('addUsersPage.feedbackUserPasswordMatch') : undefined} error={isNotMatchPassword} name='password' type={'password'} required label={t('addUsersPage.password')} />
                        <TextField helperText={isNotMatchPassword ? t('addUsersPage.feedbackUserPasswordMatch') : undefined} error={isNotMatchPassword} name='confirmPassword' type={'password'} required label={t('addUsersPage.confirmPassword')} />

                        {/* <Button variant='contained' onClick={handleClose} color='error'>Cancel</Button> */}
                        <Button disabled={submitting} type='submit' variant='contained' color='primary'>{t('addUsersPage.submit')}</Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}

export default AddUser;