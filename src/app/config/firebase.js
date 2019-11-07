import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC4rfNWwqWSdS4-cJqxKdFkUo7J7vDwlCU",
  authDomain: "revent-f959a.firebaseapp.com",
  databaseURL: "https://revent-f959a.firebaseio.com",
  projectId: "revent-f959a",
  storageBucket: "revent-f959a.appspot.com",
  messagingSenderId: "585439083826",
  appId: "1:585439083826:web:591d644f7a9e1bdfc52b2b"
};

firebase.initializeApp(firebaseConfig)
firebase.firestore()

export default firebase