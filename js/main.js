"use strict";

// --- ÖPPETTIDER UTIFRÅN DAG --

let now = new Date();
let dayToday = now.getDay();
let timeDisplay = document.getElementById("todays-hours");

if (dayToday === 0 || dayToday === 6) {
  timeDisplay.textContent = "12-20";
} else {
  timeDisplay.textContent = "11-20";
}

// --FORMULÄRVALIDERING (Inline-fel) ---
const form = document.querySelector("#event-form");

if (form !== null) {
  // Hämta inmatningsfälten
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const phoneInput = document.querySelector("#tel");
  const dateInput = document.querySelector("#date");
  const peopleInput = document.querySelector("#people");
  const messageInput = document.querySelector("#message");

  // Hämta platserna där felen ska visas
  const nameError = document.querySelector("#name-error");
  const emailError = document.querySelector("#email-error");
  const phoneError = document.querySelector("#tel-error");
  const dateError = document.querySelector("#date-error");
  const peopleError = document.querySelector("#people-error");
  const messageError = document.querySelector("#message-error");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Förutsätter att allt är rätt från början
    let isValid = true;

    // Nollställ alla gamla felmeddelanden varje gång man klickar "Skicka"
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    dateError.textContent = "";
    peopleError.textContent = "";
    messageError.textContent = "";

    // Kolla varje fält separat
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Du måste ange ett namn.";
      isValid = false; // Något var fel, formuläret är inte längre godkänt
    }

    if (emailInput.value.trim() === "") {
      emailError.textContent = "Du måste ange en e-postadress.";
      isValid = false;
    }

    if (phoneInput.value.trim() === "") {
      phoneError.textContent = "Du måste ange ett telefonnummer.";
      isValid = false;
    }

    if (dateInput.value.trim() === "") {
      dateError.textContent = "Du måste välja datum och tid.";
      isValid = false;
    }

    if (peopleInput.value.trim() === "") {
      peopleError.textContent = "Du måste ange antal personer.";
      isValid = false;
    }

    if (messageInput.value.trim() === "") {
      messageError.textContent = "Du måste skriva en förfrågan.";
      isValid = false;
    }

    // Om isValid fortfarande är true (inga rutor var tomma)
    if (isValid === true) {
      alert("Tack för din förfrågan! Vi hörs snart.");
      form.reset(); // Tömmer formuläret
    }
  });
}
