// Imports
import { functionModule as epicDepartment } from "./scripts/epic-department.js";

// Variables
let fetchDataButton;
let dataDisplayElement;

// Functions
function fetchData() {
    let data = epicDepartment.checkBadgesByGameName(417781436, "Dream Game");
    dataDisplayElement.value = data;
    console.log(data);
}

function onDOMContentLoaded() {
    fetchDataButton = document.getElementById("fetch-data");
    dataDisplayElement = document.getElementById("data-display");

    fetchDataButton.addEventListener("click", fetchData);
}

// Calling / connecting functions
window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
