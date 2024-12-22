import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {auth.loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    Loading...
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};