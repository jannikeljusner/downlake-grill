"use strict";

let now = new Date();
let dayToday = now.getDay();
let timeDisplay = document.getElementById("todays-hours");

if (dayToday === 0 || dayToday === 6) {
  timeDisplay.textContent = "12-20";
} else {
  timeDisplay.textContent = "11-20";
}
