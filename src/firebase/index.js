import Firebase from 'firebase';
require('firebase/firestore');

// Production DB
// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyC73TEUhmgaV2h4Ml3hF4VAYnm9oUCapFM",
//     authDomain: "pounder-production.firebaseapp.com",
//     databaseURL: "https://pounder-production.firebaseio.com",
//     projectId: "pounder-production",
//     storageBucket: "",
//     messagingSenderId: "759706234917"
// };
// Firebase.initializeApp(config);

// Development Database.
var config = {
    apiKey: "AIzaSyBjzZE8FZ0lBvUIj52R_10eHm70aKsT0Hw",
    authDomain: "halo-todo.firebaseapp.com",
    databaseURL: "https://halo-todo.firebaseio.com",
    projectId: "halo-todo",
    storageBucket: "halo-todo.appspot.com",
    messagingSenderId: "801359392837"
};
Firebase.initializeApp(config);

let Firestore = Firebase.firestore();
Firestore.enablePersistence();

export function getFirestore() {
    return Firestore;
}

// Firestore Collection Paths.
export const TASKS = "tasks";
export const TASKLISTS = "taskLists";
export const PROJECTS = "projects";
export const PROJECTLAYOUTS = "projectLayouts";