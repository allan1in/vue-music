// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// https://firebase.google.com/docs/auth/web/start?hl=zh-cn#add-initialize-sdk
import { getAuth } from 'firebase/auth'
// https://firebase.google.com/docs/firestore/quickstart?hl=zh-cn#initialize
import { collection, getFirestore } from 'firebase/firestore'
// https://firebase.google.com/docs/storage/web/start?authuser=0#web
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC6JD-xC8MIHgZw4pS9e3-YGDkbEG5NQHc',
  authDomain: 'music-back-end.firebaseapp.com',
  projectId: 'music-back-end',
  storageBucket: 'music-back-end.appspot.com',
  messagingSenderId: '530097646086',
  appId: '1:530097646086:web:8c855b980e9ebacad1b187'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

// Table names
const usersDocument = 'users'
const songsDocument = 'songs'
const commentsDocument = 'comments'

// Collections
const songsCollection = collection(db, songsDocument)
const commentsCollection = collection(db, commentsDocument)

export {
  auth,
  db,
  storage,
  usersDocument,
  songsDocument,
  commentsDocument,
  songsCollection,
  commentsCollection
}
