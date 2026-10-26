"use strict";

// --- 1. HAMBURGERMENY FÖR MOBILVY ---
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Fäll ut eller dölj menyn vid klick
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// --- 2. ÖPPETTIDER BASERAT PÅ VECKODAG ---
let now = new Date();
let dayToday = now.getDay();
let timeDisplay = document.getElementById("todays-hours");

// Kolla så att texten för öppettider finns på sidan innan den ändras
if (timeDisplay !== null) {
  // Sätt helgtider om det är söndag (0) eller lördag (6)
  if (dayToday === 0 || dayToday === 6) {
    timeDisplay.textContent = "12-20";
  } else {
    timeDisplay.textContent = "11-20";
  }
}

// --- 3. FORMULÄR FÖR EVENTFÖRFRÅGAN ---
const form = document.querySelector("#event-form");

if (form !== null) {
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const phoneInput = document.querySelector("#tel");
  const dateInput = document.querySelector("#date");
  const peopleInput = document.querySelector("#people");
  const messageInput = document.querySelector("#message");

  const nameError = document.querySelector("#name-error");
  const emailError = document.querySelector("#email-error");
  const phoneError = document.querySelector("#tel-error");
  const dateError = document.querySelector("#date-error");
  const peopleError = document.querySelector("#people-error");
  const messageError = document.querySelector("#message-error");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    // Töm eventuella gamla felmeddelanden
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    dateError.textContent = "";
    peopleError.textContent = "";
    messageError.textContent = "";

    // Kolla om något fält saknar text
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Du måste ange ett namn.";
      isValid = false;
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

    // Visa bekräftelse och töm formuläret om allt är korrekt ifyllt
    if (isValid === true) {
      alert("Tack för din förfrågan! Vi hörs snart.");
      form.reset();
    }
  });
}

// --- 4. HÄMTA MENY FRÅN JSON-FIL ---
const menuContainer = document.querySelector("#menu-container");

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
        // Plocka ut de maträtter som tillhör aktuell kategori
        let categoryItems = menuData.filter(function (item) {
          return item.kategori === categoryName;
        });
        // Visar informationsrutan först när menyinläsningen är klar.
        document.body.classList.add("menu-loaded");

        // Om kategorin har maträtter, bygg ihop dem
        if (categoryItems.length > 0) {
          let section = document.createElement("section");
          section.className = "menu-category";
          section.id = categoryName
            .toLowerCase()
            .replace(/ & /g, "-")
            .replace(/ /g, "-");

          // Lägg till extra info för vissa matkategorier
          let categorySubtext = "";
          if (categoryName === "BURGARE") {
            categorySubtext =
              "Menypris inkl. pommes & dryck. <br> Endast burgare: 110 kr, extra kött: 35 kr";
          } else if (categoryName === "PIZZA") {
            categorySubtext = "Pizzasallad ingår.";
          } else if (categoryName === "TALLRIKAR & RULLAR") {
            categorySubtext = "Exklusive dryck.";
          }

          let subtextHTML = "";
          if (categorySubtext !== "") {
            subtextHTML = `<p class="category-info"><em>${categorySubtext}</em></p>`;
          }

          // Lägg in rubrik och linje i kategorin
          section.innerHTML = `
            <h2>${categoryName}</h2>
            <div class="orange-line"></div>
            ${subtextHTML}
            <div class="menu-list"></div>
          `;

          let menuList = section.querySelector(".menu-list");

          // Lägg till namn, pris och beskrivning för varje maträtt
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

          // Placera hela den färdiga kategorin på skärmen
          menuContainer.appendChild(section);
        }
      });
    })
    .catch(function (error) {
      console.log("Kunde inte hämta menyn: ", error);
      menuContainer.innerHTML =
        "<p>Kunde inte ladda menyn just nu. Försök ladda om sidan.</p>";
      // Visar informationsrutan först när menyinläsningen är klar.
      document.body.classList.add("menu-loaded");
    });
}

// --- 5. MENYNAVIGERING MED KNAPPAR ---
const categoryButtons = document.querySelectorAll(".menu-nav button");

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    let buttonText = button.textContent;
    let sectionId = buttonText
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/ /g, "-");

    let targetSection = document.getElementById(sectionId);

    // Scrolla ner till rätt kategori
    if (targetSection !== null) {
      targetSection.scrollIntoView({ behavior: "smooth" });

      // Markera den klickade knappen som aktiv (orange)
      categoryButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    }
  });
});

// --- 6. SCROLLPILAR FÖR KATEGORIKNAPPAR ---
const menuNavElement = document.querySelector(".menu-nav");
const scrollArrows = document.querySelectorAll(".scroll-arrow");

// Kolla så att pilarna finns innan klick-funktionerna läggs till
if (menuNavElement !== null && scrollArrows.length === 2) {
  const leftArrow = scrollArrows[0];
  const rightArrow = scrollArrows[1];

  leftArrow.addEventListener("click", function () {
    menuNavElement.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  });

  rightArrow.addEventListener("click", function () {
    menuNavElement.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  });
}
