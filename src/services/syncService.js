const API_BASE = '/.netlify/functions';

/**
 * Sync service for cloud backup
 * Handles all API communication with Netlify Functions
 */

/**
 * Register a new user
 */
export async function registerUser(email, password) {
    const response = await fetch(`${API_BASE}/auth-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }

    return data;
}

/**
 * Login user
 */
export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE}/auth-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }

    return data;
}

/**
 * Fetch user data from cloud
 */
export async function fetchCloudData(token) {
    const response = await fetch(`${API_BASE}/sync-get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
    }

    return data;
}

/**
 * Save user data to cloud
 */
export async function saveCloudData(token, appData) {
    const response = await fetch(`${API_BASE}/sync-save`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: appData })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to save data');
    }

    return data;
}

/**
 * Debounce utility for auto-sync
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create a debounced sync function
 * Waits 500ms after last change before syncing
 */
export function createDebouncedSync(token, onSyncStart, onSyncComplete, onSyncError) {
    return debounce(async (appData) => {
        if (!token) return;

        onSyncStart?.();

        try {
            await saveCloudData(token, appData);
            onSyncComplete?.();
        } catch (error) {
            console.error('Sync error:', error);
            onSyncError?.(error);
        }
    }, 500); // 500ms debounce
}
