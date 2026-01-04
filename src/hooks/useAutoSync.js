import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import { createDebouncedSync } from '../services/syncService';

/**
 * Custom hook that enables auto-sync when user is authenticated
 * Subscribes to Zustand store changes and syncs to cloud after 500ms debounce
 */
export function useAutoSync() {
    const { token, syncEnabled, setSyncStatus, isAuthenticated } = useAuth();
    const debouncedSyncRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated || !syncEnabled || !token) {
            return;
        }

        // Create debounced sync function
        debouncedSyncRef.current = createDebouncedSync(
            token,
            () => setSyncStatus('syncing'),
            () => setSyncStatus('synced'),
            () => setSyncStatus('error')
        );

        // Subscribe to store changes
        const unsubscribe = useStore.subscribe((state) => {
            // Extract only the data we want to sync (exclude UI state like theme)
            const dataToSync = {
                domains: state.domains,
                focusDomains: state.focusDomains,
                weeklyIntegrations: state.weeklyIntegrations,
                cycleStartDate: state.cycleStartDate,
                calendarNotes: state.calendarNotes,
                dailyTodos: state.dailyTodos
            };

            // Trigger debounced sync
            if (debouncedSyncRef.current) {
                debouncedSyncRef.current(dataToSync);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [isAuthenticated, syncEnabled, token, setSyncStatus]);
}
