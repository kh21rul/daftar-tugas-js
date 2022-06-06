const works = [];
const RENDER_EVENT = "render-works";

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addWorks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addWorks() {
    const judulTugas = document.getElementById("title").value;
    const mataKuliah = document.getElementById("mataKuliah").value;
    const deadline = document.getElementById("deadline").value;

    const generatedID = generateId();
    const workObject = generateWorkObject(generatedID, judulTugas, mataKuliah, deadline, false);
    works.push(workObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Tugas baru berhasil tersimpan");
}

function generateId() {
    return +new Date();
}


function generateWorkObject(id, judul, mataKuliah, deadline, isCompleted) {
    return {
        id,
        judul,
        mataKuliah,
        deadline,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {

    const uncompletedWork = document.getElementById("works");
    uncompletedWork.innerHTML = "";

    const completedWorkList = document.getElementById("completed-works");
    completedWorkList.innerHTML = "";

    for (workItem of works) {
        const lisworkElement = makeWork(workItem);

        if (workItem.isCompleted == false)
            uncompletedWork.append(lisworkElement);
        else
            completedWorkList.append(lisworkElement);
    }
});

function makeWork(workObject) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = workObject.judul;

    const textMataKuliah = document.createElement("p");
    textMataKuliah.innerText = workObject.mataKuliah;

    const textDeadline = document.createElement("p");
    textDeadline.innerText = workObject.deadline;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textMataKuliah, textDeadline);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `work-${workObject.id}`);

    if (workObject.isCompleted) {

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(workObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(workObject.id);
        });

        container.append(undoButton, trashButton);
    } else {


        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(workObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(workObject.id);
        });

        container.append(checkButton, trashButton);
    }
    return container;
}

function addTaskToCompleted(workId) {

    const workTarget = findWork(workId);
    if (workTarget == null) return;

    workTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findWork(workId) {
    for (workItem of works) {
        if (workItem.id === workId) {
            return workItem
        }
    }
    return null
}

function removeTaskFromCompleted(workId) {
    const workTarget = findWorkIndex(workId);
    if (workTarget === -1) return;
    works.splice(workTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Tugas berhasil dihapus");
}


function undoTaskFromCompleted(workId) {


    const workTarget = findWork(workId);
    if (workTarget == null) return;


    workTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findWorkIndex(workId) {
    for (index in works) {
        if (works[index].id === workId) {
            return index
        }
    }
    return -1
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(works);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-work";
const STORAGE_KEY = "DAFWORK_APPS";

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (listwork of data) {
            works.push(listwork);
        }
    }


    document.dispatchEvent(new Event(RENDER_EVENT));
}