// -------------------- TAB SWITCHING --------------------
const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.target;
    panels.forEach(panel => panel.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// -------------------- ENTER TAB --------------------
const grandPointsEl = document.getElementById("grand-points");
const grandTimeEl = document.getElementById("grand-time");
const categories = document.querySelectorAll(".category[data-cat]");

// Savings elements
const savingsAdd = document.getElementById("savings-add");
const savingsAddPts = document.getElementById("savings-add-pts");
const savingsOverspend = document.getElementById("savings-overspend-entry");
const savingsOverspendPts = document.getElementById("savings-overspend-pts");
let totalSavings = 0;

// --- ACTIVITY LIVE CALC ---
categories.forEach(cat => {
  const rows = cat.querySelectorAll("tbody tr");
  rows.forEach(row => {
    const minutesInput = row.querySelector(".minutes");
    const livePtsEl = row.querySelector(".live-pts");
    const rate = parseFloat(row.dataset.rate);

    minutesInput.addEventListener("input", () => {
      const mins = parseFloat(minutesInput.value) || 0;
      const pts = Math.round((rate * mins) / 60);
      livePtsEl.textContent = pts;

      updateCategoryTotals(cat);
      updateGrandTotals();
    });
  });
});

function updateCategoryTotals(cat) {
  let totalPts = 0;
  let totalMins = 0;
  const rows = cat.querySelectorAll("tbody tr");
  rows.forEach(row => {
    totalPts += parseInt(row.querySelector(".live-pts").textContent) || 0;
    totalMins += parseFloat(row.querySelector(".minutes").value) || 0;
  });

  cat.querySelector(".cat-points").textContent = totalPts;
  cat.querySelector(".cat-time").textContent = totalMins + "m";
}

// --- SAVINGS LIVE CALC ---
function updateSavingsLive() {
  let addVal = parseFloat(savingsAdd.value) || 0;
  let addPts = addVal * 0.25;
  savingsAddPts.textContent = Math.round(addPts);

  let overspendVal = parseFloat(savingsOverspend.value) || 0;
  let overspendPts = overspendVal * 0.5;
  savingsOverspendPts.textContent = Math.round(overspendPts);

  updateGrandTotals();
}

savingsAdd.addEventListener("input", updateSavingsLive);
savingsOverspend.addEventListener("input", updateSavingsLive);

// --- GRAND TOTALS ---
function updateGrandTotals() {
  let totalPts = 0;
  let totalTime = 0;

  categories.forEach(cat => {
    totalPts += parseInt(cat.querySelector(".cat-points").textContent) || 0;
    let mins = parseFloat(cat.querySelector(".cat-time").textContent) || 0;
    totalTime += mins;
  });

  // Savings
  let addPts = parseFloat(savingsAdd.value) || 0;
  addPts = addPts * 0.25;
  if (addPts >= 80) totalPts += Math.round(addPts);

  let overspendPts = parseFloat(savingsOverspend.value) || 0;
  overspendPts = overspendPts * 0.5;
  totalPts -= Math.round(overspendPts);

  grandPointsEl.textContent = totalPts;
  grandTimeEl.textContent = totalTime + "m";
}

// --- RESET CONTROLS ---
document.getElementById("reset-user").addEventListener("click", () => {
  const selectedUser = document.querySelector("input[name=user]:checked").value;
  categories.forEach(cat => {
    const rows = cat.querySelectorAll("tbody tr");
    rows.forEach(row => {
      row.querySelector(".minutes").value = "";
      row.querySelector(".live-pts").textContent = "0";
      updateCategoryTotals(cat);
    });
  });
  savingsAdd.value = "";
  savingsOverspend.value = "";
  updateSavingsLive();
});

document.getElementById("reset-all").addEventListener("click", () => {
  categories.forEach(cat => {
    const rows = cat.querySelectorAll("tbody tr");
    rows.forEach(row => {
      row.querySelector(".minutes").value = "";
      row.querySelector(".live-pts").textContent = "0";
      updateCategoryTotals(cat);
    });
  });
  savingsAdd.value = "";
  savingsOverspend.value = "";
  updateSavingsLive();
});

// -------------------- PROGRESS TAB --------------------
function updateProgressBars() {
  const activePts = parseInt(document.querySelector('[data-cat="Active"] .cat-points').textContent) || 0;
  const readingPts = parseInt(document.querySelector('[data-cat="Reading"] .cat-points').textContent) || 0;
  const artsPts = parseInt(document.querySelector('[data-cat="Arts"] .cat-points').textContent) || 0;
  const homeworkPts = parseInt(document.querySelector('[data-cat="Homework"] .cat-points').textContent) || 0;
  const savingsVal = parseFloat(savingsAdd.value) || 0;
  const savingsPts = savingsVal * 0.25;

  const totalGoal = parseFloat(document.getElementById("total-goal")?.value) || 100;

  document.getElementById("bar-active").style.width = `${Math.min((activePts / (totalGoal / 4)) * 100, 100)}%`;
  document.getElementById("progress-active-val").textContent = activePts + " pts";

  document.getElementById("bar-reading").style.width = `${Math.min((readingPts / (totalGoal / 4)) * 100, 100)}%`;
  document.getElementById("progress-reading-val").textContent = readingPts + " pts";

  document.getElementById("bar-arts").style.width = `${Math.min((artsPts / (totalGoal / 4)) * 100, 100)}%`;
  document.getElementById("progress-arts-val").textContent = artsPts + " pts";

  document.getElementById("bar-homework").style.width = `${Math.min((homeworkPts / (totalGoal / 4)) * 100, 100)}%`;
  document.getElementById("progress-homework-val").textContent = homeworkPts + " pts";

  document.getElementById("bar-savings").style.width = `${Math.min((savingsPts / totalGoal) * 100, 100)}%`;
  document.getElementById("progress-savings-val").textContent = Math.round(savingsPts);
}

// Update progress bars whenever totals change
["input", "change"].forEach(evt => {
  categories.forEach(cat => {
    const rows = cat.querySelectorAll("tbody tr");
    rows.forEach(row => row.querySelector(".minutes").addEventListener(evt, updateProgressBars));
  });
  savingsAdd.addEventListener(evt, updateProgressBars);
  savingsOverspend.addEventListener(evt, updateProgressBars);
});

// Initial call
updateProgressBars();

// -------------------- FINAL GOALS TAB --------------------
const finalPointsBars = document.querySelectorAll(".final-bar");
function updateFinalBars() {
  const totalPts = parseInt(grandPointsEl.textContent) || 0;
  const totalSavingsVal = parseFloat(savingsAdd.value) || 0;
  const totalSavingsPts = totalSavingsVal * 0.25;

  // example: each bar has 10 sections out of 6000
  document.querySelectorAll(".final-bar.points").forEach(bar => {
    bar.style.width = `${Math.min((totalPts / 6000) * 100, 100)}%`;
  });

  document.querySelectorAll(".final-bar.savings").forEach(bar => {
    bar.style.width = `${Math.min((totalSavingsPts / 6000) * 100, 100)}%`;
  });
}
setInterval(updateFinalBars, 500);
