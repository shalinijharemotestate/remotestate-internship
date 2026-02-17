document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector(".navAdd");
    const dialog = document.getElementById("addDocument");
    const tbody = document.querySelector("tbody");
    const nameInput = document.getElementById("addName");
    const statusInput = document.getElementById("addStatus");
    const dateInput = document.getElementById("newDate");
    const timeInput = document.getElementById("newTime");
    const peopleInput = document.getElementById("addPeople");
    const addBtnForm = document.getElementById("addDocumentbutton");
    const cancelBtn = document.getElementById("cancelBtn");
    let editRow = null;
    function actionBtn(status) {
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
    addBtnForm.addEventListener("click", (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const status = statusInput.value;
        const date = formatDate(dateInput.value, timeInput.value);
        const people = peopleInput.value || "—";
        if (!name)
            return;
        if (editRow) {
            editRow.querySelector(".doc-title").innerText = name;
            editRow.querySelector(".badge").className = `badge ${statusClass(status)}`;
            editRow.querySelector(".badge").innerText = status;
            editRow.querySelector(".date").innerText = date;
            editRow = null;
        }
        else {
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
    tbody.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("edit")) {
            e.preventDefault();
            const row = target.closest("tr");
            editRow = row;
            nameInput.value = row.querySelector(".doc-title").innerText;
            statusInput.value = row.querySelector(".badge").innerText;
            autoDateTime();
            dialog.showModal();
        }
        if (target.classList.contains("delete")) {
            e.preventDefault();
            target.closest("tr").remove();
        }
    });
    function autoDateTime() {
        const now = new Date();
        dateInput.value = now.toISOString().split("T")[0];
        timeInput.value = now.toTimeString().slice(0, 5);
    }
    function formatDate(date, time) {
        if (!date)
            return "";
        const d = new Date(`${date}T${time || "00:00"}`);
        return d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    function statusClass(status) {
        if (status === "Needs Signing")
            return "blue";
        if (status === "Pending")
            return "grey";
        return "green";
    }
    function resetForm() {
        nameInput.value = "";
        statusInput.selectedIndex = 0;
        peopleInput.value = "";
        editRow = null;
    }
});
