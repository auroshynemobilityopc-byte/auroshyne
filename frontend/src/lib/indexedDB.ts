import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = "carwash-offline-db";
const DB_VERSION = 2;

interface OfflineDB extends DBSchema {
    bookings: {
        key: string;
        value: {
            key: string;
            data: any;
            lastSyncedAt: number;
        };
    };
    customers: {
        key: string;
        value: {
            key: string;
            data: any;
            lastSyncedAt: number;
        };
    };
    services: {
        key: string;
        value: {
            key: string;
            data: any;
            lastSyncedAt: number;
        };
    };
    stats: {
        key: string;
        value: {
            key: string;
            data: any;
            lastSyncedAt: number;
        };
    };
    addons: {
        key: string;
        value: {
            key: string;
            data: any;
            lastSyncedAt: number;
        };
    };
    technicians: {
        key: string;
        value: {
            key: string;
            data: any;
            lastSyncedAt: number;
        };
    };
    "app-state": {
        key: string;
        value: {
            key: string;
            lastSyncedAt: number;
        };
    };
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('bookings')) {
                    db.createObjectStore('bookings', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('customers')) {
                    db.createObjectStore('customers', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('services')) {
                    db.createObjectStore('services', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('stats')) {
                    db.createObjectStore('stats', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('app-state')) {
                    db.createObjectStore('app-state', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('addons')) {
                    db.createObjectStore('addons', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('technicians')) {
                    db.createObjectStore('technicians', { keyPath: 'key' });
                }
            },
        });
    }
    return dbPromise;
};

export type StoreName = 'bookings' | 'customers' | 'services' | 'stats' | 'addons' | 'technicians' | 'app-state';

export const saveToIndexedDB = async (storeName: StoreName, key: string, data: any) => {
    const db = await initDB();
    await db.put(storeName, {
        key,
        data,
        lastSyncedAt: Date.now()
    });
};

export const getFromIndexedDB = async (storeName: StoreName, key: string) => {
    const db = await initDB();
    const result = await db.get(storeName, key);
    return result || null;
};
