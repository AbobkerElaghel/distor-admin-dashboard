import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
type Color = 'success' | 'info' | 'warning' | 'error';

interface SnackBarType { isOpen?: boolean; message: string; severity: Color };
const SnackBarTypeDefaultValue = { isOpen: false, message: "", severity: 'warning' as Color };

const useSnackBar = () => {
    const [errorSnackBar, setErrorSnackBar] = useState<SnackBarType>(SnackBarTypeDefaultValue);
    const setSnackBarValue = (options: SnackBarType, timeout: number = 3000) => {
        setErrorSnackBar({ isOpen: true, message: options.message || "Error Occurred", severity: options.severity });
        setTimeout(() => { setErrorSnackBar(SnackBarTypeDefaultValue) }, timeout);
    };
    return {
        SnackBarComponent: () => (<Snackbar anchorOrigin={{ horizontal: "center", vertical: "bottom" }} open={errorSnackBar.isOpen}>
            <Alert severity={errorSnackBar.severity}>
                {errorSnackBar.message}
            </Alert>
        </Snackbar>),
        setSnackBarValue
    };
};
export default useSnackBar;