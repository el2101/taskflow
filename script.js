// ===============================
// DATA TUGAS
// ===============================

let tasks = [];


// ===============================
// MODAL
// ===============================

function openModal() {
    document.getElementById("taskModal").classList.add("show");
}

function closeModal() {
    document.getElementById("taskModal").classList.remove("show");
    document.getElementById("taskForm").reset();
}


// ===============================
// TAMBAH TUGAS
// ===============================

document.getElementById("taskForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("taskName").value;
    const subject = document.getElementById("subject").value;
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    const newTask = {
        id: Date.now(),
        name: name,
        subject: subject,
        deadline: deadline,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    closeModal();
    renderTasks();

});


// ===============================
// HITUNG SISA HARI
// ===============================

function getDaysLeft(deadline) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const target = new Date(deadline);

    target.setHours(0, 0, 0, 0);

    const difference = target - today;

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


// ===============================
// TENTUKAN STATUS
// ===============================

function getStatus(task) {

    if (task.completed) {
        return {
            text: "Selesai",
            className: "done"
        };
    }

    const days = getDaysLeft(task.deadline);

    if (days <= 1) {
        return {
            text: "Mendesak",
            className: "urgent"
        };
    }

    if (days <= 3) {
        return {
            text: "Segera",
            className: "soon"
        };
    }

    return {
        text: "Aman",
        className: "safe"
    };
}


// ===============================
// FORMAT TANGGAL
// ===============================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// ===============================
// TAMPILKAN TUGAS
// ===============================

function renderTasks() {

    const taskList = document.getElementById("taskList");

    const filter = document.getElementById("filter").value;

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (filter === "active") {
            return !task.completed;
        }

        if (filter === "done") {
            return task.completed;
        }

        if (filter === "urgent") {
            return getStatus(task).className === "urgent";
        }

        return true;

    });


    // Urutkan berdasarkan deadline
    filteredTasks.sort(
        (a, b) =>
        new Date(a.deadline) -
        new Date(b.deadline)
    );


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div style="
                text-align:center;
                padding:40px;
                color:#999;
            ">
                Belum ada tugas.
            </div>
        `;

        updateStatistics();
        return;
    }


    filteredTasks.forEach(task => {

        const status = getStatus(task);
        const daysLeft = getDaysLeft(task.deadline);

        let timeText;

        if (task.completed) {
            timeText = "Selesai";
        } else if (daysLeft < 0) {
            timeText = "Terlambat";
        } else if (daysLeft === 0) {
            timeText = "Hari ini";
        } else if (daysLeft === 1) {
            timeText = "1 hari lagi";
        } else {
            timeText = `${daysLeft} hari lagi`;
        }


        const card = document.createElement("div");

        card.className =
            `task-card ${task.completed ? "completed" : ""}`;


        card.innerHTML = `

            <input
                type="checkbox"
                class="task-check"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-info">

                <h3>${task.name}</h3>

                <p>
                    ${task.subject}
                    • Prioritas ${getPriorityText(task.priority)}
                </p>

            </div>

            <div class="task-deadline">

                <strong>
                    ${timeText}
                </strong>

                <span class="badge ${status.className}">
                    ${status.text}
                </span>

                <p style="
                    font-size:11px;
                    color:#999;
                    margin-top:5px;
                ">
                    ${formatDate(task.deadline)}
                </p>

            </div>

        `;


        taskList.appendChild(card);

    });


    updateStatistics();

}


// ===============================
// PRIORITAS
// ===============================

function getPriorityText(priority) {

    if (priority === "high") {
        return "Tinggi";
    }

    if (priority === "medium") {
        return "Sedang";
    }

    return "Rendah";

}


// ===============================
// SELESAIKAN TUGAS
// ===============================

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (task) {
        task.completed = !task.completed;
    }

    renderTasks();

}


// ===============================
// STATISTIK
// ===============================

function updateStatistics() {

    const total = tasks.length;

    const urgent = tasks.filter(task =>
        !task.completed &&
        getStatus(task).className === "urgent"
    ).length;

    const soon = tasks.filter(task =>
        !task.completed &&
        getStatus(task).className === "soon"
    ).length;

    const completed = tasks.filter(
        task => task.completed
    ).length;


    document.getElementById("totalTasks").textContent = total;
    document.getElementById("urgentTasks").textContent = urgent;
    document.getElementById("soonTasks").textContent = soon;
    document.getElementById("completedTasks").textContent = completed;

}


// ===============================
// DATA CONTOH
// ===============================

tasks = [
    {
        id: 1,
        name: "Makalah Biologi",
        subject: "Biologi",
        deadline: "2026-09-30",
        priority: "high",
        completed: false
    },

    {
        id: 2,
        name: "Latihan Soal Fisika",
        subject: "Fisika",
        deadline: "2026-10-02",
        priority: "medium",
        completed: false
    },

    {
        id: 3,
        name: "Rangkuman Sejarah",
        subject: "Sejarah",
        deadline: "2026-10-07",
        priority: "low",
        completed: false
    }
];


// Jalankan saat halaman dibuka
renderTasks();
