// ===== STATE =====
const state = {
  users: {
    Austin: { Active: {}, Reading: {}, Arts: {}, Homework: {}, savings: { current: 0, overspend: 0 } },
    Emma: { Active: {}, Reading: {}, Arts: {}, Homework: {}, savings: { current: 0, overspend: 0 } }
  }
};

// ===== HELPERS =====
function parseNum(str){ return parseFloat(str)||0; }
function getSelectedUser(){ return document.querySelector('input[name="user"]:checked').value; }
function updateAllDisplays(){ updateCategoryTotals(); updateGrandTotals(); updateSavingsPoints(); }

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// ===== CATEGORY TABLES =====
document.querySelectorAll('.activity-table').forEach(table => {
  table.querySelectorAll('.minutes').forEach(input => {
    input.addEventListener('input', () => {
      const tr = input.closest('tr');
      const rate = parseNum(tr.dataset.rate);
      const mins = parseNum(input.value);
      const pts = rate*(mins/60);
      tr.querySelector('.live-pts').textContent = Math.round(pts);
      updateAllDisplays();
    });
  });
  table.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => {
      const tr = btn.closest('tr');
      const user = getSelectedUser();
      const cat = tr.closest('.category').dataset.cat;
      const act = tr.dataset.act;
      const mins = parseNum(tr.querySelector('.minutes').value);
      const rate = parseNum(tr.dataset.rate);
      const pts = rate*(mins/60);
      state.users[user][cat][act] = (state.users[user][cat][act]||0)+pts;
      tr.querySelector('.minutes').value = "";
      tr.querySelector('.live-pts').textContent = "0";
      updateAllDisplays();
    });
  });
});

// ===== CATEGORY / GRAND TOTALS =====
function updateCategoryTotals(){
  const user = getSelectedUser();
  document.querySelectorAll('.category').forEach(catEl=>{
    const cat = catEl.dataset.cat;
    if(cat==="Savings") return;
    const sumPts = Object.values(state.users[user][cat]).reduce((a,b)=>a+b,0);
    const sumTime = Object.values(state.users[user][cat]).reduce((a,b)=>a+b/parseNum(catEl.querySelector('tr[data-act]')?.dataset.rate||1)*60,0);
    catEl.querySelector('.cat-points').textContent = Math.round(sumPts);
    catEl.querySelector('.cat-time').textContent = Math.round(sumTime)+"m";
  });
}
function userTotals(user){
  let totalPoints=0,totalTime=0;
  ["Active","Reading","Arts","Homework"].forEach(cat=>{
    totalPoints+=Object.values(state.users[user][cat]).reduce((a,b)=>a+b,0);
  });
  return { totalPoints, totalTime };
}
function updateGrandTotals(){
  const user = getSelectedUser();
  const ut = userTotals(user);
  document.getElementById("grand-points").textContent = Math.round(ut.totalPoints);
  document.getElementById("grand-time").textContent = Math.round(ut.totalTime)+"m";
}

// ===== SAVINGS =====
function updateSavingsPoints(){
  const user = getSelectedUser();
  const addInput = parseNum(document.getElementById("savings-add").value);
  const overspendInput = parseNum(document.getElementById("savings-overspend-entry").value);
  let addPoints = addInput*0.25;
  let overspendPoints = overspendInput*0.5;
  let pointsToAdd = addPoints>=80?addPoints:0;
  document.getElementById("savings-add-pts").textContent = Math.round(addPoints);
  document.getElementById("savings-overspend-pts").textContent = Math.round(overspendPoints);
  const ut = userTotals(user);
  document.getElementById("grand-points").textContent = Math.round(ut.totalPoints + pointsToAdd - overspendPoints);
}
document.getElementById("savings-add").addEventListener("input", updateSavingsPoints);
document.getElementById("savings-overspend-entry").addEventListener("input", updateSavingsPoints);
document.getElementById("commit-savings").addEventListener("click", ()=>{
  const user = getSelectedUser();
  const addInput = parseNum(document.getElementById("savings-add").value);
  const overspendInput = parseNum(document.getElementById("savings-overspend-entry").value);
  let addPoints = addInput*0.25;
  let overspendPoints = overspendInput*0.5;
  if(addPoints>=80){
    state.users[user].savings.current += addInput;
  }
  state.users[user].savings.overspend += overspendInput;
  document.getElementById("savings-current").value = state.users[user].savings.current;
  document.getElementById("savings-add").value="";
  document.getElementById("savings-overspend-entry").value="";
  updateAllDisplays();
});

// ===== RESET BUTTONS =====
document.getElementById("reset-user").addEventListener("click", ()=>{
  const user = getSelectedUser();
  state.users[user] = { Active: {}, Reading: {}, Arts: {}, Homework: {}, savings: {current:0, overspend:0}};
  updateAllDisplays();
});
document.getElementById("reset-all").addEventListener("click", ()=>{
  Object.keys(state.users).forEach(u=>{
    state.users[u] = { Active: {}, Reading: {}, Arts: {}, Homework: {}, savings: {current:0, overspend:0}};
  });
  updateAllDisplays();
});

// INITIAL UPDATE
updateAllDisplays();
