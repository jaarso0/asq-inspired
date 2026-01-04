import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, fetchCloudData, saveCloudData, createDebouncedSync } from '../services/syncService';
import { useStore } from '../store/useStore';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'human-3.0-auth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [syncEnabled, setSyncEnabled] = useState(false);
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'synced', 'error'
    const [isLoading, setIsLoading] = useState(true);
    const [showLocalDataPrompt, setShowLocalDataPrompt] = useState(false);
    const [hasLocalData, setHasLocalData] = useState(false);

    // Check for existing auth on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
            try {
                const { user: savedUser, token: savedToken } = JSON.parse(savedAuth);
                setUser(savedUser);
                setToken(savedToken);
                setSyncEnabled(true);
            } catch (e) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }

        // Check if there's local data
        const localData = localStorage.getItem('human-3.0-storage');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                // Check if there's meaningful data (not just defaults)
                const hasHabits = parsed.state?.domains &&
                    Object.values(parsed.state.domains).some(d => d.habits?.length > 0);
                const hasNotes = parsed.state?.calendarNotes &&
                    Object.keys(parsed.state.calendarNotes).length > 0;
                const hasTodos = parsed.state?.dailyTodos &&
                    Object.keys(parsed.state.dailyTodos).length > 0;

                setHasLocalData(hasHabits || hasNotes || hasTodos);
            } catch (e) {
                setHasLocalData(false);
            }
        }

        setIsLoading(false);
    }, []);

    // Save auth to localStorage when it changes
    useEffect(() => {
        if (user && token) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
        }
    }, [user, token]);

    // Register function
    const register = useCallback(async (email, password) => {
        const result = await registerUser(email, password);
        setUser(result.user);
        setToken(result.token);
        setSyncEnabled(true);

        // Check if user has local data to backup
        if (hasLocalData) {
            setShowLocalDataPrompt(true);
        }

        return result;
    }, [hasLocalData]);

    // Login function
    const login = useCallback(async (email, password) => {
        const result = await loginUser(email, password);
        setUser(result.user);
        setToken(result.token);
        setSyncEnabled(true);

        // Check if user has local data to backup
        if (hasLocalData) {
            setShowLocalDataPrompt(true);
        }

        return result;
    }, [hasLocalData]);

    // Logout function
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setSyncEnabled(false);
        setSyncStatus('idle');
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }, []);

    // Backup local data to cloud
    const backupLocalData = useCallback(async () => {
        if (!token) return;

        setSyncStatus('syncing');
        try {
            const localData = localStorage.getItem('human-3.0-storage');
            if (localData) {
                const parsed = JSON.parse(localData);
                await saveCloudData(token, parsed.state);
                setSyncStatus('synced');
            }
            setShowLocalDataPrompt(false);
        } catch (error) {
            console.error('Backup error:', error);
            setSyncStatus('error');
            throw error;
        }
    }, [token]);

    // Skip backup prompt
    const skipBackup = useCallback(() => {
        setShowLocalDataPrompt(false);
    }, []);

    // Fetch cloud data and load into store
    const loadCloudData = useCallback(async () => {
        if (!token) return null;

        try {
            const result = await fetchCloudData(token);
            return result.data;
        } catch (error) {
            console.error('Load cloud data error:', error);
            return null;
        }
    }, [token]);

    // Manual sync trigger
    const syncNow = useCallback(async () => {
        if (!token) return;

        setSyncStatus('syncing');
        try {
            const localData = localStorage.getItem('human-3.0-storage');
            if (localData) {
                const parsed = JSON.parse(localData);
                await saveCloudData(token, parsed.state);
            }
            setSyncStatus('synced');
        } catch (error) {
            console.error('Sync error:', error);
            setSyncStatus('error');
        }
    }, [token]);

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        syncEnabled,
        syncStatus,
        setSyncStatus,
        isLoading,
        showLocalDataPrompt,
        hasLocalData,
        register,
        login,
        logout,
        backupLocalData,
        skipBackup,
        loadCloudData,
        syncNow
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
