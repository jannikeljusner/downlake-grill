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

// --- 3. HÄMTA MENYN MED FETCH ---
const menuContainer = document.querySelector("#menu-container");

// Körs BARA om kunden är på meny-sidan
if (menuContainer !== null) {
  menuContainer.innerHTML = "";
  const categories = [
    "BURGARE",
    "PIZZA",
    "TALLRIKAR & RULLAR",
    "SIDES & DIPP",
    "DRYCK & GLASS",
  ];

  fetch("js/menu.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (menuData) {
      categories.forEach(function (categoryName) {
        let categoryItems = menuData.filter(function (item) {
          return item.kategori === categoryName;
        });

        if (categoryItems.length > 0) {
          let section = document.createElement("section");
          section.className = "menu-category";
          section.id = categoryName
            .toLowerCase()
            .replace(/ & /g, "-")
            .replace(/ /g, "-");

          // --- FIX FÖR UNDERTEXTERNA ---
          let categorySubtext = "";

          if (categoryName === "BURGARE") {
            categorySubtext =
              "Menypris inkl. pommes & dryck. <br> Endast burgare: 110 kr, extra kött: 35 kr";
          } else if (categoryName === "PIZZA") {
            categorySubtext = "Pizzasallad ingår.";
          } else if (categoryName === "TALLRIKAR & RULLAR") {
            categorySubtext = "Exklusive dryck.";
          }

          // Skapa en <p>-tagg bara om det faktiskt finns en text
          let subtextHTML = "";
          if (categorySubtext !== "") {
            subtextHTML = `<p class="category-info"><em>${categorySubtext}</em></p>`;
          }

          // Bygg rubriken, strecket och undertexten
          section.innerHTML = `
            <h2>${categoryName}</h2>
            <div class="orange-line"></div>
            ${subtextHTML}
            <div class="menu-list"></div>
          `;

          let menuList = section.querySelector(".menu-list");

          // Bygg maträtterna
          categoryItems.forEach(function (item) {
            let article = document.createElement("article");
            article.className = "menu-item";
            let priceText = item.pris > 0 ? item.pris + ":-" : "";

            article.innerHTML = `
              <div class="item-header">
                <h3>${item.namn.toUpperCase()}</h3>
                <span class="price">${priceText}</span>
              </div>
              <p class="ingredients">${item.beskrivning}</p>
            `;

            menuList.appendChild(article);
          });

          menuContainer.appendChild(section);
        }
      });
    })
    .catch(function (error) {
      console.log("Kunde inte hämta menyn: ", error);
      menuContainer.innerHTML =
        "<p>Kunde inte ladda menyn just nu. Försök ladda om sidan.</p>";
    });
}
// --- 4. MENYNAVIGERING (Scrolla till rätt kategori) ---

// 1. Hämta alla knappar som ligger inuti .menu-nav
const categoryButtons = document.querySelectorAll(".menu-nav button");

// 2. Gå igenom varje knapp och lägg till en klick-lyssnare
categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // a. Ta reda på vad som står på knappen vi precis klickade på (t.ex. "PIZZA")
    let buttonText = button.textContent;

    // b. Omvandla texten till exakt samma ID som vi gav sektionen tidigare
    // "TALLRIKAR & RULLAR" blir "tallrikar---rullar"
    let sectionId = buttonText
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/ /g, "-");

    // c. Leta upp sektionen på sidan
    let targetSection = document.getElementById(sectionId);

    // d. Om vi hittar sektionen, scrolla dit mjukt!
    if (targetSection !== null) {
      targetSection.scrollIntoView({ behavior: "smooth" });

      // Frivilligt extra-piff: Flytta "active"-klassen till den knapp du klickade på
      // Först tar vi bort klassen från ALLA knappar...
      categoryButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      // ...och sen lägger vi till den på knappen du precis klickade på
      button.classList.add("active");
    }
  });
});
