import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useContext } from 'react'
import { AuthContext } from '../providers/AuthProvider';
import { useLocation } from "wouter";
import useSnackBar from '../hooks/SnackBarHook'
import { useTranslation } from 'react-i18next'

function LogInPage() {

    const Auth = useContext(AuthContext)!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setLocation] = useLocation();
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();

    const { t } = useTranslation();

    const Submit = (e: any) => {
        e.preventDefault();
        const email: string = e.target.elements.Email.value;
        const password: string = e.target.elements.Password.value;
        Auth.signIn(email, password)
            .then(() => {
                if (Auth.user) {
                    setLocation("/");
                }
            })
            .catch((error) => {
                setSnackBarValue({ severity: 'error', message: "Error: " + error.code }, 3000);
            });
    }

    return (
        <>
            <SnackBarComponent />
            <Paper sx={{
                width: { sm: '550px' },
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                paddingX: 5,
                paddingY: 3
            }}>
                <img alt='logo' style={{
                    margin: "auto"
                }} src='/logo.svg'
                    width={75} />

                <Typography variant='h4' marginY={1} component={'h1'} textAlign={'center'}>{t('signInPage.logIn')}</Typography>
                <Typography sx={{
                    opacity: 0.5
                }} variant='subtitle2' marginY={1} component={'sub'} textAlign={'center'}>{t('signInPage.logInDescription')}</Typography>

                <form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                    onSubmit={Submit}>
                    <TextField type={'email'} name="Email" margin='dense' label={t('signInPage.email')} />
                    <TextField type={'password'} name="Password" margin='dense' label={t('signInPage.password')} />
                    <Button
                        type="submit"
                        sx={{
                            marginTop: 1
                        }} variant='contained'>Send</Button>
                </form>
            </Paper>
        </>
    )
}

export default LogInPage