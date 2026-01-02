// app.js – PostYourTrade IndexedDB Full Helpers

const DB_NAME = 'pytDB';
const DB_VERSION = 1;
const STORES = { USERS: 'users', POSTS: 'posts' };

let db;

// Open (or create) IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        db.createObjectStore(STORES.USERS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.POSTS)) {
        const store = db.createObjectStore(STORES.POSTS, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Generic helpers
async function getAll(store) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addItem(store, item) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const request = tx.objectStore(store).add(item);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putItem(store, item) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const request = tx.objectStore(store).put(item);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getByKey(store, key) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// User helpers
async function getUserByUsername(username) {
  const users = await getAll(STORES.USERS);
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

async function getUserByEmail(email) {
  const users = await getAll(STORES.USERS);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

async function getCurrentUser() {
  const id = localStorage.getItem('currentUserId');
  if (!id) return null;
  return await getByKey(STORES.USERS, Number(id));
}

// Export for pages
window.openDB = openDB;
window.getAll = getAll;
window.addItem = addItem;
window.putItem = putItem;
window.getByKey = getByKey;
window.getUserByUsername = getUserByUsername;
window.getUserByEmail = getUserByEmail;
window.getCurrentUser = getCurrentUser;
window.STORES = STORES;
