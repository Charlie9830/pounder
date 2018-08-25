import Path from 'path';
import fsJetpack from 'fs-jetpack';
import { getUserUid } from '../../../handball-libs/libs/pounder-firebase';
import { USERS, TASKS, TASKLISTS, PROJECTS, PROJECTLAYOUTS, REMOTE_IDS, REMOTES, MEMBERS } from '../../../handball-libs/libs/pounder-firebase/paths';
import Electron from 'electron';
import sanitize from 'sanitize-filename';
let remote = Electron.remote;


export const BACKUP_VALIDATION_KEY = "validation key";

export function getCurrentBackupDirectory() {
    // Sanitize UserID to be used as a file directory.
    var sanitizedUserId = sanitize(getUserUid());
    sanitizedUserId = sanitizedUserId === "" ? "UnknownUser" : sanitizedUserId;

    return Path.join(remote.app.getPath('documents'), "/Handball", "/Backups", `/${sanitizedUserId}`);
}

export function backupFirebaseAsync(getFirestore, remoteIds) {
    return new Promise((resolve, reject) => {
        pullDownDatabase(getFirestore, remoteIds).then( data => {
            var packagedData = packageUpData(data);
            writeDatabaseToFileAsync(JSON.stringify(packagedData), getCurrentBackupDirectory()).then((isoDateSaved) => {
                resolve(isoDateSaved);
            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        })
    })
}

function pullDownDatabase(getFirestore, remoteIds) {
    return new Promise((resolve, reject) => {
        var requests = [];
        var localProjectData = {};
        var remoteProjects = [];

        requests.push(pullDownLocalProjectData(getFirestore).then( data => {
            localProjectData = data;
        }));

        requests.push(pullDownRemoteProjects(getFirestore, remoteIds).then( data => {
            remoteProjects = data;
        }))

        Promise.all(requests).then( () => {
            resolve({ localProjectData: localProjectData, remoteProjects: remoteProjects });
        }).catch(error => {
            reject(error);
        })
    })
}

function pullDownRemoteProjects(getFirestore, remoteIds) {
    return new Promise((resolve, reject) => {
        // Pull Data down from Firestore.
        var requests = [];
        var remoteProjects = [];
        
        remoteIds.forEach(id => {
            requests.push(getRemoteProject(getFirestore, id).then( project => {
                remoteProjects.push(project);
            }).catch(error => {
                reject(error)
            }))
        })
        

        Promise.all(requests).then(() => {
            resolve(remoteProjects);
        }).catch(error => {
            reject(error);
        })
    })
}

function getRemoteProject(getFirestore, projectId) {
    return new Promise((resolve, reject) => {
        var requests = [];
        var project = {};
        var projectLayouts = [];
        var taskLists = [];
        var tasks = [];
        var members = [];

        var initialRef = getFirestore().collection(REMOTES).doc(projectId);

        // Project
        requests.push(initialRef.get().then(snapshot => {
            if (snapshot.exists) {
                project = snapshot.data();
            }
        }))

        // ProjectLayouts
        requests.push(initialRef.collection(PROJECTLAYOUTS).get().then(snapshot => {
            snapshot.forEach(doc => {
                projectLayouts.push(doc.data());
            })
        }))

        // Task Lists.
        requests.push(initialRef.collection(TASKLISTS).get().then(snapshot => {
            snapshot.forEach(doc => {
                taskLists.push(doc.data());
            })
        }))

        // Tasks
        requests.push(initialRef.collection(TASKS).get().then(snapshot => {
            snapshot.forEach(doc => {
                tasks.push(doc.data());
            })
        }))

        // Members
        requests.push(initialRef.collection(MEMBERS).get().then(snapshot => {
            snapshot.forEach(doc => {
                members.push(doc.data());
            })
        }))

        Promise.all(requests).then(() => {
            var preCombinated = {
                projectLayouts: projectLayouts,
                taskLists: taskLists,
                tasks: tasks,
                members: members,
            }
            var combined = {...project, ...preCombinated};
            resolve(combined);
        }).catch(error => {
            reject(error);
        })
    })
}


function pullDownLocalProjectData(getFirestore) {
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


export async function readBackupFileAsync(filePath) {
    try {
        var data = await fsJetpack.readAsync(filePath, 'json');
    }
    
    catch (error) {
        throw error;
    }

    return data;
}

export async function restoreProjectsAsync(getFirestore, localProjectIds, remoteProjectIds, localData, currentLocalProjectIds) {
    var requests = [];
    var remoteBatch = getFirestore().batch();
    var localBatches = [];
    var localProjectIdsNeedingCleanup = [];

    // Remote Projects
    remoteProjectIds.forEach(id => {
        // Extract the project from the Local backup.
        var remoteProject = localData.remoteProjects.find(project => {
            return project.uid === id;
        });

        if (remoteProject !== undefined) {
            var topLevelData = {
                isRemote: true,
                projectName: remoteProject.projectName,
                uid: remoteProject.uid,
            }
            
            var initialRef = getFirestore().collection(REMOTES).doc(id);
            remoteBatch.set(initialRef, topLevelData);

            // Project Layouts.
            remoteProject.projectLayouts.forEach(item => {
                remoteBatch.set(initialRef.collection(PROJECTLAYOUTS).doc(item.uid), item);
            })

            // TaskLists
            remoteProject.taskLists.forEach(item => {
                remoteBatch.set(initialRef.collection(TASKLISTS).doc(item.uid), item);
            })

            // Tasks
            remoteProject.tasks.forEach(item => {
                remoteBatch.set(initialRef.collection(TASKS).doc(item.uid), item);
            })

            // Members
            remoteProject.members.forEach(item => {
                remoteBatch.set(initialRef.collection(MEMBERS).doc(item.userId), item);
            })

            // Set the users remoteId just in case.
            var remoteIdRef = getFirestore().collection(USERS).doc(getUserUid()).collection(REMOTE_IDS).doc(id);
            remoteBatch.set(remoteIdRef, { projectId: id });

            // Set the other contributors remoteId collections just in case.
            if (remoteProject.members !== undefined) {
                remoteProject.members.forEach(item => {
                    if (item.status === 'added') {
                        var otherUserRemoteIdRef = getFirestore().collection(USERS).doc(item.userId).collection(REMOTE_IDS).doc(id);
                        remoteBatch.set(otherUserRemoteIdRef, { projectId: id });
                    }
                })
            }

            
            if (currentLocalProjectIds.includes(id)) {
                // Project has been migrated back to Local. Which means it exists in both Local and Remote locations.
                // Mark it for deletion later as it is an Async operation, and doing that inside this foreach loop will
                // convolute things.
                localProjectIdsNeedingCleanup.push(id);
            }
        }
    })

    // Local Projects.
    // Iterate through localProjectIds, build Project Replacement Batches.
    localProjectIds.forEach(id => {
        requests.push(buildLocalProjectReplacementBatchesAsync(getFirestore, id, localData).then(batchWrapper => {
            localBatches.push(batchWrapper.deleteBatch);
            localBatches.push(batchWrapper.setBatch);
        }));
    })

    // Local Projects Cleanup.
    // Whilst building the remoteProject batch, a project with the same ID was found in local. Delete it here instead of
    // trying to perform an async operation inside the remoteProjectIds.foreach() loop and convoluting it.
    var cleanupRequests = [];
    var cleanupBatches = [];
    cleanupRequests = localProjectIdsNeedingCleanup.map(id => {
        return buildLocalProjectDeleteBatchAsync(getFirestore, id).then( batch => {
            cleanupBatches.push(batch);
        })
    })

    var concatedRequests = [...requests, ...cleanupRequests];

    await Promise.all(concatedRequests);
    var outgoingRequests = [];
    // Remote Batch.
    outgoingRequests.push(remoteBatch.commit());

    // Cleanup Batch.
    cleanupBatches.forEach(batch => {
        outgoingRequests.push(batch.commit());
    })

    // Local Batch.
    localBatches.forEach(batch => {
        outgoingRequests.push(batch.commit());
    })

    var result = await Promise.all(outgoingRequests);
    return result;
}

async function buildLocalProjectReplacementBatchesAsync(getFirestore, projectId, localData) {
    // Build Delete Requests.
    var deleteBatch = await buildLocalProjectDeleteBatchAsync(getFirestore, projectId);
    var setBatch = buildLocalProjectSetBatch(getFirestore, projectId, localData);

    return { deleteBatch: deleteBatch, setBatch: setBatch };
}


function buildLocalProjectSetBatch(getFirestore, projectId, localData) {
    // Build Set Requests.
    var batch = getFirestore().batch();

    // Project.
    var project = localData.localProjectData.projects.find(item => {
        return item.uid === projectId;
    })

    var projectRef = getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTS).doc(project.uid);
    batch.set(projectRef, Object.assign({}, project));

    // ProjectLayouts
    var projectLayouts = localData.localProjectData.projectLayouts.filter(item => {
        return item.project === projectId;
    })

    projectLayouts.forEach(layout => {
        var ref = getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTLAYOUTS).doc(layout.uid);
        batch.set(ref, Object.assign({}, layout));
    })

    // TaskLists.
    var taskLists = localData.localProjectData.taskLists.filter(item => {
        return item.project === projectId;
    })

    taskLists.forEach(taskList => {
        var ref = getFirestore().collection(USERS).doc(getUserUid()).collection(TASKLISTS).doc(taskList.uid);
        batch.set(ref, Object.assign({}, taskList));
    })

    // Tasks
    var tasks = localData.localProjectData.tasks.filter(item => {
        return item.project === projectId;
    })

    tasks.forEach(task => {
        var ref = getFirestore().collection(USERS).doc(getUserUid()).collection(TASKS).doc(task.uid);
        batch.set(ref, Object.assign({}, task));
    })

    return batch;
}

async function buildLocalProjectDeleteBatchAsync(getFirestore, projectId) {
    var batch = getFirestore().batch();
    var refs = await pullDownProjectRelatedItemRefs(getFirestore, projectId);
    // Project.
    batch.delete(refs.projectRef);

    // Project Layouts.
    refs.projectLayoutRefs.forEach(ref => {
        batch.delete(ref);
    })

    // TaskLists.
    refs.taskListRefs.forEach(ref => {
        batch.delete(ref);
    })

    // Tasks.
    refs.taskRefs.forEach(ref => {
        batch.delete(ref);
    })

    return batch;
}

function pullDownProjectRelatedItemRefs(getFirestore, projectId) {
    return new Promise((resolve, reject) => {
        var requests = [];
        var projectLayoutRefs = [];
        var taskListRefs = [];
        var taskRefs = [];

        // Project Layouts.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTLAYOUTS)
        .where('project', '==', projectId).get().then(snapshot => {
            snapshot.forEach(doc => {
                projectLayoutRefs.push(doc.ref);
            })
        }))

        // TaskLists.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(TASKLISTS)
        .where('project', '==', projectId).get().then(snapshot => {
            snapshot.forEach(doc => {
                taskListRefs.push(doc.ref);
            })
        }))

        // Tasks.
        requests.push(getFirestore().collection(USERS).doc(getUserUid()).collection(TASKS)
        .where('project', '==', projectId).get().then(snapshot => {
            snapshot.forEach(doc => {
                taskRefs.push(doc.ref);
            })
        }))

        Promise.all(requests).then(() => {
            var projectRef = getFirestore().collection(USERS).doc(getUserUid()).collection(PROJECTS).doc(projectId);
            var combined = {
                projectRef: projectRef,
                projectLayoutRefs: projectLayoutRefs,
                taskListRefs: taskListRefs,
                taskRefs: taskRefs,
            }

            resolve(combined);
        }).catch(error => {
            reject(error);
        })
    })
}


function packageUpData(data) {
    var date = new Date().toISOString();
    return {
        userId: getUserUid(),
        validationKey: BACKUP_VALIDATION_KEY,
        createdAt: date,
        localProjectData: data.localProjectData,
        remoteProjects: data.remoteProjects,
    }
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
                var isoDateSaved = currentDate.toISOString();
                resolve(isoDateSaved);
            }).catch(error => {
                reject(error);
            })
        }

        else {
            reject("Something went wrong. There was no data to write to File.");
        }
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