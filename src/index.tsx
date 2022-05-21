import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './pages/App';
import CssBaseline from '@mui/material/CssBaseline';
import AuthProvier from './providers/AuthProvider';
import LanguageProvider from './providers/LanguageProvider';
import RTLProvider from './providers/RTLProvider';
import ThemeProvider from './providers/ThemeProvider';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <AuthProvier>
      <ThemeProvider>
        <RTLProvider>
          <LanguageProvider>
            <App />
            <CssBaseline />
          </LanguageProvider>
        </RTLProvider>
      </ThemeProvider>
    </AuthProvier>
  </>
);
