// license.js
import { db } from "./firebase/firebaseConfig.js"; 
import { doc, setDoc } from "firebase/firestore";

document.getElementById("licenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const licenseKey = document.getElementById("licenseKey").value;
  const errorMessage = document.getElementById("errorMessage");

  try {
    // Appel à l'API Gumroad pour vérifier la licence
    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: "plhouh", // ID du produit mis à jour
        license_key: licenseKey
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      // La licence est valide, on enregistre l'utilisateur dans Firebase
      const userRef = doc(db, "users", data.purchase.email);
      await setDoc(userRef, { license: licenseKey, email: data.purchase.email }, { merge: true });

      // Enregistre la clé localement et redirige vers la page d'accueil
      localStorage.setItem("licenseKey", licenseKey);
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Clé invalide. Vérifiez votre clé Gumroad.";
    }
  } catch (error) {
    console.error("Erreur de vérification :", error);
    errorMessage.textContent = "Une erreur est survenue. Réessayez.";
  }
});
