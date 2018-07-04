import Path from 'path';
import fsJetpack from 'fs-jetpack';
import { getUserUid, USERS, TASKS, TASKLISTS, PROJECTS, PROJECTLAYOUTS, } from 'pounder-firebase';
import Electron from 'electron';

let remote = Electron.remote;
const BACKUP_DIRECTORY = Path.join(remote.app.getPath('documents'), "/Pounder", "/Backups");

export function backupFirebaseAsync(getFirestore) {
    return new Promise((resolve, reject) => {
        pullDownDatabase(getFirestore).then(data => {
            writeDatabaseToFileAsync(JSON.stringify(data), BACKUP_DIRECTORY).then((message) => {
                resolve(message);
            });
        }).catch(error => {
            reject(error);
        })
    })
}

export function restoreFirebaseAsync(getFirestore, importPath) {
    return new Promise((resolve, reject) => {
        backupFirebaseAsync(getFirestore).then((message) => {
            nukeFirestore(getFirestore).then(() => {
                importDatabaseFromFileAsync(getFirestore, importPath).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error)
                })
            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        })
    })
}


function readFileAsync(importPath) {
    return new Promise((resolve, reject) => {
        fsJetpack.readAsync(importPath, 'json').then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    })
}

function importDatabaseFromFileAsync(getFirestore, importPath) {
    return new Promise((resolve, reject) => {
        readFileAsync(importPath).then(data => {
            var batch = getFirestore().batch();

            // Projects.
            var projects = Object.values(data.projects);
            projects.forEach(item => {
                let ref = getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTS).doc(item.uid);
                batch.set(ref, item);
            })

            // Project Layouts.
            var projectLayouts = Object.values(data.projectLayouts);
            projectLayouts.forEach(item => {
                let ref = getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTLAYOUTS).doc(item.uid);
                batch.set(ref, item);
            })

            // Task lists.
            var taskLists = Object.values(data.taskLists);
            taskLists.forEach(item => {
                let ref = getFirestore().collection(USERS).doc(getUserUid()).collection(TASKLISTS).doc(item.uid);
                batch.set(ref, item);
            })

            // Tasks
            var tasks = Object.values(data.tasks);
            tasks.forEach(item => {
                if (item.uid != undefined) {
                    let ref = getFirestore().collection(USERS).doc(getUserUid()).collection(TASKS).doc(item.uid);
                    batch.set(ref, item);
                }
            })

            batch.commit().then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            })
        })
    })
}


function pullDownDatabase(getFirestore) {
    return new Promise((resolve, reject) => {
        // Pull Data down from Firestore.
        var requests = [];
        var projects = [];
        var projectLayouts = [];
        var taskLists = [];
        var tasks = [];

        // Projects.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTS).get().then(snapshot => {
            snapshot.forEach(doc => {
                projects.push(doc.data());
            })
        }))

        // Project Layouts.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTLAYOUTS).get().then(snapshot => {
            snapshot.forEach(doc => {
                projectLayouts.push(doc.data());
            })
        }))

        // TaskLists.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(TASKLISTS).get().then(snapshot => {
            snapshot.forEach(doc => {
                taskLists.push(doc.data());
            })
        }))

        // Tasks.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(TASKS).get().then(snapshot => {
            snapshot.forEach(doc => {
                tasks.push(doc.data());
            })
        }))

        Promise.all(requests).then(() => {
            // Combine Together.
            var combined = {
                projects: projects,
                projectLayouts: projectLayouts,
                taskLists: taskLists,
                tasks: tasks
            }

            resolve(combined);
        }).catch(error => {
            reject(error);
        })
    })
}


function writeDatabaseToFileAsync(json, directoryPath) {
    return new Promise((resolve, reject) => {
        if (json.length > 0) {
            // Write to Backup File.

            var currentDate = new Date();
            var normalizedDate = getNormalizedDate(currentDate);
            var filePath = Path.join(directoryPath, "/", "backup " + normalizedDate + ".json");

            // Create File.
            fsJetpack.file(filePath, { mode: '700' });

            // Write to File.
            fsJetpack.writeAsync(filePath, json, { atomic: true }).then(() => {
                var message = "Last backup created at " +
                    currentDate.getHours() + ":" +
                    currentDate.getMinutes() + ":" +
                    currentDate.getSeconds() + " in " +
                    directoryPath;

                resolve(message);
            }).catch(error => {
                reject(error);
            })
        }

        else {
            reject("Something went wrong. There was no data to write to File.");
        }
    })
}

function nukeFirestore(getFirestore) {
    return new Promise((resolve, reject) => {
        pullDownDatabase(getFirestore).then(data => {
            var { projects, projectLayouts, taskLists, tasks} = data;

            // Build a list of References.
            var refs = [];

            // Projects.
            projects.forEach(project => {
                refs.push(getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTS).doc(project.uid));
            })

            // Project Layouts.
            projectLayouts.forEach(projectLayout => {
                refs.push(getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTLAYOUTS).doc(projectLayout.uid));
            })

            // TaskLists.
            taskLists.forEach(taskList => {
                refs.push(getFirestore().collection(USERS).doc(getUserUid()).collection(TASKLISTS).doc(taskList.uid));
            })

            // Tasks.
            tasks.forEach(task => {
                refs.push(getFirestore().collection(USERS).doc(getUserUid()).collection(TASKS).doc(task.uid));
            })

            

            // Build Delete Batch.
            var batch = getFirestore().batch();
            refs.forEach(ref => {
                batch.delete(ref);
            })

            // Execute Batch.
            batch.commit().then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            });
        })
    })
}

function getNormalizedDate(date) {
    var array = [];
    array.push(
        date.getFullYear(),
        (date.getMonth() + 1),
        date.getDate(),
        " ",
        date.getSeconds(),
        date.getMinutes(),
        date.getHours(),
    )

    var normalizedArray = array.map(n => {
        if (n === " ") {
            return n;
        }

        else {
            return n < 10 ? '0' + n : '' + n;
        }
    });

    return normalizedArray.join("");
}