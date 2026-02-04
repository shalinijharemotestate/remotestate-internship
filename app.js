
const tableBody = document.querySelector("tbody");
const addBtn = document.querySelector(".navAdd");
const searchInput = document.querySelector(".search-box input");

const STORAGE_KEY = "neptuneDocs";

function getDocs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function setDocs(docs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}


function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createRow(doc) {
  let badgeClass = "blue";
  let btnText = "Sign now";
  let subHTML = "";

  if (doc.status === "Pending") {
    badgeClass = "grey";
    btnText = "Preview";
    subHTML = `
      <div class="sub">
        Waiting for <b id="subwait">${doc.people}</b>
      </div>`;
  }

  if (doc.status === "Completed") {
    badgeClass = "green";
    btnText = "Download PDF";
  }

  return `
    <tr data-id="${doc.id}">
      <td><input type="checkbox"></td>
      <td class="doc-title">${doc.name}</td>
      <td>
        <span class="badge ${badgeClass}">${doc.status}</span>
        ${subHTML}
      </td>
      <td class="date">${doc.date}<br>${doc.time}</td>
      <td><button class="btn">${btnText}</button></td>
      <td class="dots">⋮</td>
    </tr>
  `;
}


function loadDocuments(query = "") {
  const docs = getDocs();
  tableBody.innerHTML = "";

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:#94a3b8">
          No documents found
        </td>
      </tr>`;
    return;
  }

  filtered.forEach(doc => {
    tableBody.insertAdjacentHTML("beforeend", createRow(doc));
  });
}

function addDocument() {
  const name = prompt("Enter document name:");
  if (!name) return;

  const status = prompt(
    "Enter status:\nNeeds Signing / Pending / Completed",
    "Needs Signing"
  );
  if (!status) return;

  let people = "";
  if (status === "Pending") {
    people = prompt("How many people are involved?", "1");
    if (!people) return;
  }

  const date = prompt("Enter date (MM/DD/YYYY):");
  if (!date) return;

  const docs = getDocs();

  docs.push({
    id: crypto.randomUUID(),
    name: name.trim(),
    status,
    people,
    date,
    time: getTime(),
  });

  setDocs(docs);
  loadDocuments(searchInput.value);
}

function deleteDoc(id) {
  const docs = getDocs().filter(d => d.id !== id);
  setDocs(docs);
  loadDocuments(searchInput.value);
}


addBtn.addEventListener("click", addDocument);

searchInput.addEventListener("input", e => {
  loadDocuments(e.target.value);
});

tableBody.addEventListener("click", e => {
  const row = e.target.closest("tr");
  if (!row) return;

  const id = row.dataset.id;

  if (e.target.classList.contains("dots")) {
    const action = prompt("Type: edit or delete");

    if (action === "delete") {
      deleteDoc(id);
    }
  }
});


loadDocuments();
