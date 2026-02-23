/**
 * IndexedDB Debugger Utility
 * Use this to inspect and debug IndexedDB data in the browser console
 * 
 * Example usage in browser console:
 * import { inspectIndexedDB, clearIndexedDB, getAllStores } from '@/lib/indexedDBDebugger'
 * 
 * await inspectIndexedDB()  // View all data
 * await getAllStores()      // Get all store names and content
 * await clearIndexedDB()    // Clear all data
 */

import { initDB } from './indexedDB';
import type { StoreName } from './indexedDB';

/** Inspect all IndexedDB data */
export const inspectIndexedDB = async () => {
    try {
        const db = await initDB();
        const storeNames = Array.from(db.objectStoreNames);
        console.log('📊 IndexedDB Stores:', storeNames);

        const allData: Record<string, any[]> = {};

        for (const storeName of storeNames) {
            const allKeys = await db.getAllKeys(storeName as StoreName);
            const storeData = [];

            for (const key of allKeys) {
                const data = await db.get(storeName as StoreName, key as string);
                storeData.push(data);
            }

            allData[storeName] = storeData;
            console.log(`\n📁 Store: ${storeName} (${storeData.length} items)`);
            console.table(storeData);
        }

        return allData;
    } catch (error) {
        console.error('❌ Error inspecting IndexedDB:', error);
    }
};

/** Get all data from a specific store */
export const getStoreData = async (storeName: StoreName) => {
    try {
        const db = await initDB();
        const allKeys = await db.getAllKeys(storeName);
        const data = [];

        for (const key of allKeys) {
            const item = await db.get(storeName, key as string);
            data.push(item);
        }

        console.log(`📁 Store "${storeName}":`, data);
        return data;
    } catch (error) {
        console.error(`❌ Error getting data from store "${storeName}":`, error);
    }
};

/** Get specific item from a store */
export const getIndexedDBItem = async (storeName: StoreName, key: string) => {
    try {
        const db = await initDB();
        const data = await db.get(storeName, key);
        console.log(`\n🔍 Item "${key}" from store "${storeName}":`, data);
        return data;
    } catch (error) {
        console.error(`❌ Error getting item:`, error);
    }
};

/** Save test data to IndexedDB */
export const saveTestData = async () => {
    try {
        const db = await initDB();

        // Test bookmark data
        const testBooking = {
            _id: '123',
            bookingId: 'BK-2024-001',
            status: 'COMPLETED',
            vehicles: [{ number: 'DL-01-AB-1234', serviceId: 'svc-1' }],
            totalPrice: 499,
            createdAt: new Date().toISOString()
        };

        const testProfile = {
            _id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            addresses: [{ house: 'A-101', street: 'Main St' }],
            vehicles: [{ number: 'DL-01-AB-1234', type: 'car' }]
        };

        await db.put('bookings', {
            key: 'all-bookings',
            data: { data: [testBooking], success: true },
            lastSyncedAt: Date.now()
        });

        await db.put('customers', {
            key: 'current-profile',
            data: testProfile,
            lastSyncedAt: Date.now()
        });

        console.log('✅ Test data saved to IndexedDB');
        await inspectIndexedDB();
    } catch (error) {
        console.error('❌ Error saving test data:', error);
    }
};

/** Clear all data from a specific store */
export const clearStore = async (storeName: StoreName) => {
    try {
        const db = await initDB();
        const allKeys = await db.getAllKeys(storeName);

        for (const key of allKeys) {
            await db.delete(storeName, key as string);
        }

        console.log(`✅ Cleared store "${storeName}" (${allKeys.length} items deleted)`);
    } catch (error) {
        console.error(`❌ Error clearing store "${storeName}":`, error);
    }
};

/** Clear all IndexedDB data */
export const clearIndexedDB = async () => {
    try {
        const db = await initDB();
        const storeNames = Array.from(db.objectStoreNames);

        for (const storeName of storeNames) {
            const allKeys = await db.getAllKeys(storeName as StoreName);
            for (const key of allKeys) {
                await db.delete(storeName as StoreName, key as string);
            }
        }

        console.log('✅ All IndexedDB data cleared');
    } catch (error) {
        console.error('❌ Error clearing IndexedDB:', error);
    }
};

/** Get stats about IndexedDB */
export const getIndexedDBStats = async () => {
    try {
        const db = await initDB();
        const storeNames = Array.from(db.objectStoreNames);
        const stats: Record<string, { count: number; lastSync?: number }> = {};

        for (const storeName of storeNames) {
            const allKeys = await db.getAllKeys(storeName as StoreName);
            let lastSync = 0;

            if (allKeys.length > 0) {
                const firstItem = await db.get(storeName as StoreName, allKeys[0] as string);
                lastSync = firstItem?.lastSyncedAt || 0;
            }

            stats[storeName] = {
                count: allKeys.length,
                lastSync: lastSync !== 0 ? lastSync : undefined
            };
        }

        console.table(stats);
        return stats;
    } catch (error) {
        console.error('❌ Error getting IndexedDB stats:', error);
    }
};

// Expose globally for debugging in browser console
if (typeof window !== 'undefined') {
    (window as any).__indexedDBDebugger = {
        inspect: inspectIndexedDB,
        getStore: getStoreData,
        getItem: getIndexedDBItem,
        saveTest: saveTestData,
        clearStore: clearStore,
        clearAll: clearIndexedDB,
        stats: getIndexedDBStats,
    };
    console.log('🛠️ IndexedDB Debugger exposed as window.__indexedDBDebugger');
}
