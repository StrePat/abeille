// script.js
import "./firebase/firebaseConfig.js";
import { db } from "./firebase/firebaseConfig.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Vérification de la licence pour restreindre l'accès aux pages protégées
document.addEventListener("DOMContentLoaded", () => {
  const licenseKey = localStorage.getItem("licenseKey");
  // Si l'utilisateur n'est pas sur la page de licence et n'a pas de licence, redirige vers license.html
  if (!licenseKey && !window.location.href.includes("license.html")) {
    window.location.href = "license.html";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  // Si le formulaire de tâches n'existe pas sur cette page, on arrête ici
  const taskForm = document.getElementById("taskForm");
  if (!taskForm) return;

  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskList = document.getElementById("taskList");
  const tasksCollection = collection(db, "tasks");

  // Fonction pour charger les tâches depuis Firestore
  async function loadTasks() {
    taskList.innerHTML = "";
    const querySnapshot = await getDocs(tasksCollection);
    querySnapshot.forEach((taskDoc) => {
      const task = taskDoc.data();
      renderTask(taskDoc.id, task.text, task.completed, task.dueDate);
    });
  }

  // Fonction pour afficher une tâche dans la liste
  function renderTask(id, text, completed, dueDate) {
    const li = document.createElement("li");
    li.dataset.id = id;

    // Checkbox pour marquer la tâche comme complétée
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "tasks", id), { completed: checkbox.checked });
      loadTasks();
    });
    li.appendChild(checkbox);

    // Affichage du texte de la tâche
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    if (completed) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.color = "#777";
    }
    li.appendChild(textSpan);

    // Affichage de la date de la tâche
    const dateSpan = document.createElement("span");
    dateSpan.textContent = ` - Date: ${dueDate}`;
    li.appendChild(dateSpan);

    // Bouton pour modifier la tâche
    const editButton = document.createElement("button");
    editButton.textContent = "Modifier";
    editButton.addEventListener("click", async () => {
      const newText = prompt("Modifier la tâche :", text);
      if (newText && newText.trim() !== "") {
        await updateDoc(doc(db, "tasks", id), { text: newText.trim() });
        loadTasks();
      }
    });
    li.appendChild(editButton);

    // Bouton pour supprimer la tâche
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener("click", async () => {
      await deleteDoc(doc(db, "tasks", id));
      loadTasks();
    });
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  }

  // Gestion de l'ajout d'une nouvelle tâche via le formulaire
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const dueDate = taskDate.value; // Format attendu: YYYY-MM-DD
    if (text !== "" && dueDate !== "") {
      const newTask = await addDoc(tasksCollection, { text, completed: false, dueDate });
      renderTask(newTask.id, text, false, dueDate);
      taskInput.value = "";
      taskDate.value = "";
    }
  });

  loadTasks();
});
