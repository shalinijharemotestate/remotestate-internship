type DocStatus = "Needs Signing" | "Pending" | "Completed";
interface Document {
  name: string;
  status: DocStatus;
  date: string;
  people: string;
}

function isDocStatus(value: string): value is DocStatus {
  return ["Needs Signing", "Pending", "Completed"].includes(value);
}

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector<HTMLButtonElement>(".navAdd")!;
  const dialog = document.querySelector<HTMLDialogElement>("#addDocument")!;
  const tbody = document.querySelector<HTMLTableSectionElement>("tbody")!;
  const nameInput = document.querySelector<HTMLInputElement>("#addName")!;
  const statusInput = document.querySelector<HTMLSelectElement>("#addStatus")!;
  const dateInput = document.querySelector<HTMLInputElement>("#newDate")!;
  const timeInput = document.querySelector<HTMLInputElement>("#newTime")!;
  const peopleInput = document.querySelector<HTMLInputElement>("#addPeople")!;
  const addBtnForm = document.querySelector<HTMLButtonElement>("#addDocumentbutton")!;
  const cancelBtn = document.querySelector<HTMLButtonElement>("#cancelBtn")!;

  let editRow: HTMLTableRowElement | null = null;

  function actionBtn(status: DocStatus): string {
    if (status === "Needs Signing") {
      return `<button class="btn">Sign Now</button>`;
    }
    if (status === "Pending") {
      return `<button class="btn">Preview</button>`;
    }
    return `<button class="btn">Download PDF</button>`;
  }

  function statusClass(status: DocStatus): string {
    if (status === "Needs Signing") return "blue";
    if (status === "Pending") return "grey";
    return "green";
  }

  function autoDateTime(): void {
    const now = new Date();dateInput.value = now.toISOString().split("T")[0] ?? "";
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

  function resetForm(): void {
    nameInput.value = "";
    statusInput.selectedIndex = 0;
    peopleInput.value = "";
    editRow = null;
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
    const statusValue = statusInput.value;
    const date = formatDate(dateInput.value, timeInput.value);
    const people = peopleInput.value || "—";

    if (!name) return;
    if (!isDocStatus(statusValue)) return;

    const status: DocStatus = statusValue;

    if (editRow) {
      editRow.querySelector<HTMLElement>(".doc-title")!.innerText = name;
      editRow.querySelector<HTMLElement>(".badge")!.className = `badge ${statusClass(status)}`;
      editRow.querySelector<HTMLElement>(".badge")!.innerText = status;
      editRow.querySelector<HTMLElement>(".date")!.innerText = date;
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
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains("edit")) {
      e.preventDefault();

      const row = target.closest<HTMLTableRowElement>("tr")!;
      editRow = row;

      nameInput.value = row.querySelector<HTMLElement>(".doc-title")!.innerText;
      statusInput.value = row.querySelector<HTMLElement>(".badge")!.innerText;

      autoDateTime();
      dialog.showModal();
    }

    if (target.classList.contains("delete")) {
      e.preventDefault();
      target.closest<HTMLTableRowElement>("tr")!.remove();
    }
  });

});