/**
 * Customer App — Isolated IndexedDB
 * Completely separate from the admin IndexedDB ("carwash-offline-db").
 * Stores: bookings history, profile, saved data (addresses + vehicles).
 */

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'carwash-customer-db';
const DB_VERSION = 1;

interface CustomerOfflineDB extends DBSchema {
    /** Booking history rows for the logged-in customer */
    'customer-bookings': {
        key: string;
        value: {
            key: string;
            data: any;
            savedAt: number;
        };
    };
    /** Profile data for the logged-in customer */
    'customer-profile': {
        key: string;
        value: {
            key: string;
            data: any;
            savedAt: number;
        };
    };
    /** Saved addresses + vehicles (from /users/me/saved) */
    'customer-saved': {
        key: string;
        value: {
            key: string;
            data: any;
            savedAt: number;
        };
    };
    /** Public catalogue — services list */
    'customer-services': {
        key: string;
        value: {
            key: string;
            data: any;
            savedAt: number;
        };
    };
    /** Public catalogue — addons list */
    'customer-addons': {
        key: string;
        value: {
            key: string;
            data: any;
            savedAt: number;
        };
    };
}

export type CustomerStoreName =
    | 'customer-bookings'
    | 'customer-profile'
    | 'customer-saved'
    | 'customer-services'
    | 'customer-addons';

let dbPromise: Promise<IDBPDatabase<CustomerOfflineDB>> | null = null;

const initCustomerDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<CustomerOfflineDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                const stores: CustomerStoreName[] = [
                    'customer-bookings',
                    'customer-profile',
                    'customer-saved',
                    'customer-services',
                    'customer-addons',
                ];
                for (const store of stores) {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath: 'key' });
                    }
                }
            },
        });
    }
    return dbPromise;
};

/** Persist data to the customer offline cache */
export const saveCustomerData = async (
    store: CustomerStoreName,
    key: string,
    data: any
): Promise<void> => {
    try {
        const db = await initCustomerDB();
        await db.put(store, { key, data, savedAt: Date.now() });
    } catch (err) {
        console.warn('[CustomerIDB] Failed to save:', store, key, err);
    }
};

/** Retrieve cached data. Returns null when not found. */
export const getCustomerData = async (
    store: CustomerStoreName,
    key: string
): Promise<{ data: any; savedAt: number } | null> => {
    try {
        const db = await initCustomerDB();
        const record = await db.get(store, key);
        return record ? { data: record.data, savedAt: record.savedAt } : null;
    } catch (err) {
        console.warn('[CustomerIDB] Failed to get:', store, key, err);
        return null;
    }
};

/** Clear all offline data for this customer (e.g. on logout) */
export const clearAllCustomerData = async (): Promise<void> => {
    try {
        const db = await initCustomerDB();
        const stores: CustomerStoreName[] = [
            'customer-bookings',
            'customer-profile',
            'customer-saved',
            'customer-services',
            'customer-addons',
        ];
        await Promise.all(stores.map((s) => db.clear(s)));
    } catch (err) {
        console.warn('[CustomerIDB] Failed to clear all data:', err);
    }
};
