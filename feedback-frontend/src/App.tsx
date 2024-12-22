import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './components/AppRouter';
import { Toaster } from './components/ui/toaster';

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRouter />
                <Toaster />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;