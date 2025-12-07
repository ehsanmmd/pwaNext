"use client";

import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";

interface StorageInfo {
  quota: number;
  usage: number;
  persistent: boolean;
}

interface IndexedDBItem {
  id: number;
  name: string;
  value: string;
  timestamp: Date;
}

export default function StoragePage() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [items, setItems] = useState<IndexedDBItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open("pwa-demo-db", 1);

    request.onerror = () => {
      console.error("Failed to open IndexedDB");
    };

    request.onsuccess = () => {
      const database = request.result;
      setDb(database);
      loadItems(database);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains("items")) {
        database.createObjectStore("items", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    // Get storage quota
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        setStorageInfo({
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
          persistent: false,
        });
      });

      // Check if persistent storage
      if ("persist" in navigator.storage) {
        navigator.storage.persisted().then((persistent) => {
          setStorageInfo((prev) => (prev ? { ...prev, persistent } : null));
        });
      }
    }

    return () => {
      db?.close();
    };
  }, []);

  const loadItems = (database: IDBDatabase) => {
    const transaction = database.transaction(["items"], "readonly");
    const store = transaction.objectStore("items");
    const request = store.getAll();

    request.onsuccess = () => {
      setItems(request.result);
    };
  };

  const addItem = () => {
    if (!db || !newItemName.trim()) return;

    const transaction = db.transaction(["items"], "readwrite");
    const store = transaction.objectStore("items");

    const item = {
      name: newItemName,
      value: newItemValue,
      timestamp: new Date(),
    };

    const request = store.add(item);
    request.onsuccess = () => {
      loadItems(db);
      setNewItemName("");
      setNewItemValue("");
    };
  };

  const deleteItem = (id: number) => {
    if (!db) return;

    const transaction = db.transaction(["items"], "readwrite");
    const store = transaction.objectStore("items");
    store.delete(id);

    transaction.oncomplete = () => {
      loadItems(db);
    };
  };

  const clearAll = () => {
    if (!db) return;

    const transaction = db.transaction(["items"], "readwrite");
    const store = transaction.objectStore("items");
    store.clear();

    transaction.oncomplete = () => {
      loadItems(db);
    };
  };

  const requestPersistentStorage = async () => {
    if ("storage" in navigator && "persist" in navigator.storage) {
      const granted = await navigator.storage.persist();
      setStorageInfo((prev) =>
        prev ? { ...prev, persistent: granted } : null
      );
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">IndexedDB Storage</span>
            </h1>
            <p className="text-cyber-text-muted max-w-2xl mx-auto">
              Store structured data in the browser with IndexedDB. Perfect for
              offline-first applications that need to persist complex data.
            </p>
          </div>

          {/* Storage Quota */}
          {storageInfo && (
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
              <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
                <span>💾</span> Storage Quota
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-cyber-surface rounded-lg">
                  <div className="text-sm text-cyber-text-muted">Used</div>
                  <div className="font-['Orbitron'] font-bold text-cyber-purple">
                    {formatBytes(storageInfo.usage)}
                  </div>
                </div>

                <div className="p-4 bg-cyber-surface rounded-lg">
                  <div className="text-sm text-cyber-text-muted">Available</div>
                  <div className="font-['Orbitron'] font-bold text-cyber-cyan">
                    {formatBytes(storageInfo.quota)}
                  </div>
                </div>

                <div className="p-4 bg-cyber-surface rounded-lg">
                  <div className="text-sm text-cyber-text-muted">
                    Persistent
                  </div>
                  <div
                    className={`font-['Orbitron'] font-bold ${
                      storageInfo.persistent
                        ? "text-cyber-green"
                        : "text-cyber-orange"
                    }`}
                  >
                    {storageInfo.persistent ? "Yes ✓" : "No"}
                  </div>
                </div>
              </div>

              {/* Usage bar */}
              <div className="mb-4">
                <div className="h-2 bg-cyber-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-cyber-purple to-cyber-pink transition-all"
                    style={{
                      width: `${
                        (storageInfo.usage / storageInfo.quota) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {((storageInfo.usage / storageInfo.quota) * 100).toFixed(2)}%
                  used
                </div>
              </div>

              {!storageInfo.persistent && (
                <button
                  onClick={requestPersistentStorage}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface"
                >
                  Request Persistent Storage
                </button>
              )}
            </div>
          )}

          {/* IndexedDB Demo */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span>📊</span> IndexedDB Demo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name..."
                className="px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple"
              />
              <input
                type="text"
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                placeholder="Item value..."
                className="px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple"
              />
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={addItem}
                disabled={!newItemName.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                Add Item
              </button>
              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Items List */}
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-cyber-surface rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-cyber-purple">
                        {item.name}
                      </div>
                      <div className="text-sm text-cyber-text-muted">
                        {item.value}
                      </div>
                      <div className="text-xs text-slate-600">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                No items stored. Add some data above!
              </div>
            )}
          </div>

          {/* Storage APIs Comparison */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              📚 Storage APIs Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cyber-border">
                    <th className="text-left p-3 text-cyber-text-muted">
                      Feature
                    </th>
                    <th className="text-left p-3 text-cyber-purple">
                      IndexedDB
                    </th>
                    <th className="text-left p-3 text-cyber-pink">
                      LocalStorage
                    </th>
                    <th className="text-left p-3 text-cyber-cyan">Cache API</th>
                  </tr>
                </thead>
                <tbody className="text-cyber-text-muted">
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3">Data Type</td>
                    <td className="p-3">Any (JS objects)</td>
                    <td className="p-3">Strings only</td>
                    <td className="p-3">Request/Response</td>
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3">Capacity</td>
                    <td className="p-3">~50% of disk</td>
                    <td className="p-3">~5MB</td>
                    <td className="p-3">~50% of disk</td>
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3">Async</td>
                    <td className="p-3">✓ Yes</td>
                    <td className="p-3">✗ No</td>
                    <td className="p-3">✓ Yes</td>
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3">Indexing</td>
                    <td className="p-3">✓ Yes</td>
                    <td className="p-3">✗ No</td>
                    <td className="p-3">✗ No</td>
                  </tr>
                  <tr>
                    <td className="p-3">Use Case</td>
                    <td className="p-3">Complex data</td>
                    <td className="p-3">Settings</td>
                    <td className="p-3">HTTP caching</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Example */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              📝 IndexedDB Code Example
            </h2>

            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
              <code>{`// Open/create database
const request = indexedDB.open('my-database', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // Create object store with auto-increment id
  const store = db.createObjectStore('items', { 
    keyPath: 'id', 
    autoIncrement: true 
  });
  
  // Create indexes for queries
  store.createIndex('name', 'name', { unique: false });
  store.createIndex('date', 'createdAt', { unique: false });
};

// Add item
function addItem(db, item) {
  const tx = db.transaction(['items'], 'readwrite');
  const store = tx.objectStore('items');
  store.add(item);
}

// Get all items
function getAllItems(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['items'], 'readonly');
    const store = tx.objectStore('items');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Query by index
function getByName(db, name) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['items'], 'readonly');
    const store = tx.objectStore('items');
    const index = store.index('name');
    const request = index.getAll(name);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}`}</code>
            </pre>
          </div>

          {/* Tips */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-r from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              💡 Best Practices
            </h2>
            <ul className="space-y-3 text-sm text-cyber-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">▸</span>
                <span>
                  Use <strong>idb</strong> library for a promise-based API
                  that&apos;s easier to use.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-pink">▸</span>
                <span>
                  Create indexes for fields you&apos;ll query frequently.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">▸</span>
                <span>
                  Request persistent storage to prevent data from being evicted.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-green">▸</span>
                <span>
                  Handle database versioning carefully during upgrades.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-orange">▸</span>
                <span>
                  Always handle errors - IndexedDB operations can fail.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
