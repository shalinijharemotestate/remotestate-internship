type DocStatus = "Needs Signing" | "Pending" | "Completed";

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector(".navAdd") as HTMLButtonElement;
  const dialog = document.getElementById("addDocument") as HTMLDialogElement;
  const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
  const nameInput = document.getElementById("addName") as HTMLInputElement;
  const statusInput = document.getElementById("addStatus") as HTMLSelectElement;
  const dateInput = document.getElementById("newDate") as HTMLInputElement;
  const timeInput = document.getElementById("newTime") as HTMLInputElement;
  const peopleInput = document.getElementById("addPeople") as HTMLInputElement;
  const addBtnForm = document.getElementById("addDocumentbutton") as HTMLButtonElement;
  const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement;

  let editRow: HTMLTableRowElement | null = null;

  function actionBtn(status: DocStatus): string {
    if (status === "Needs Signing")
      return `<button class="btn" onclick="alert('Opening signature flow...')">Sign Now</button>`;
    if (status === "Pending")
      return `<button class="btn" onclick="alert('Opening preview...')">Preview</button>`;
    return `<button class="btn" onclick="alert('Downloading PDF...')">Download PDF</button>`;
  }

  addBtn.addEventListener("click", () => {
    autoDateTime();
    dialog.showModal();
  });

  cancelBtn.addEventListener("click", () => {
    resetForm();
    dialog.close();
  });

  addBtnForm.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const status = statusInput.value as DocStatus;
    const date = formatDate(dateInput.value, timeInput.value);
    const people = peopleInput.value || "—";

    if (!name) return;

    if (editRow) {
      (editRow.querySelector(".doc-title") as HTMLElement).innerText = name;
      (editRow.querySelector(".badge") as HTMLElement).className = `badge ${statusClass(status)}`;
      (editRow.querySelector(".badge") as HTMLElement).innerText = status;
      (editRow.querySelector(".date") as HTMLElement).innerText = date;
      editRow = null;
    } else {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td class="doc-title">${name}</td>
        <td>
          <span class="badge ${statusClass(status)}">${status}</span>
        </td>
        <td class="date">${date}</td>
        <td>${actionBtn(status)}</td>
        <td class="dots">⋮
          <div class="dropdown-box">
            <a href="#" class="edit">Edit</a>
            <a href="#" class="delete">Delete</a>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    }

    resetForm();
    dialog.close();
  });

  tbody.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("edit")) {
      e.preventDefault();

      const row = target.closest("tr") as HTMLTableRowElement;
      editRow = row;

      nameInput.value = (row.querySelector(".doc-title") as HTMLElement).innerText;
      statusInput.value = (row.querySelector(".badge") as HTMLElement).innerText;

      autoDateTime();
      dialog.showModal();
    }

    if (target.classList.contains("delete")) {
      e.preventDefault();
      (target.closest("tr") as HTMLTableRowElement).remove();
    }
  });

  function autoDateTime(): void {
    const now = new Date();
    dateInput.value = now.toISOString().split("T")[0];
    timeInput.value = now.toTimeString().slice(0, 5);
  }

  function formatDate(date: string, time: string): string {
    if (!date) return "";

    const d = new Date(`${date}T${time || "00:00"}`);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function statusClass(status: DocStatus): string {
    if (status === "Needs Signing") return "blue";
    if (status === "Pending") return "grey";
    return "green";
  }

  function resetForm(): void {
    nameInput.value = "";
    statusInput.selectedIndex = 0;
    peopleInput.value = "";
    editRow = null;
  }

});