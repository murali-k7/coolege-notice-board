/* =====================================================
   COLLEGE DIGITAL NOTICE BOARD
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   DEFAULT NOTICES
===================================================== */

const defaultNotices = [

    {
        id: 1,

        title: "Internal Assessment - II Examination",

        description:
            "The Internal Assessment II examination will be conducted from 15 October 2026. Students are requested to check the examination timetable and report to the examination hall on time.",

        category: "Examination",

        date: "2026-10-08",

        expiry: "2026-10-20",

        priority: "Important",

        department: "All Departments"
    },


    {
        id: 2,

        title: "Campus Placement Drive",

        description:
            "A campus placement drive will be conducted for final-year students. Eligible students are requested to register before the last date.",

        category: "Placement",

        date: "2026-10-07",

        expiry: "2026-10-18",

        priority: "Important",

        department: "Information Technology"
    },


    {
        id: 3,

        title: "Technical Symposium 2026",

        description:
            "The annual technical symposium will be conducted in the college auditorium. Students can participate in paper presentations, coding competitions and technical events.",

        category: "Events",

        date: "2026-10-06",

        expiry: "2026-10-25",

        priority: "Normal",

        department: "All Departments"
    },


    {
        id: 4,

        title: "Semester Academic Schedule",

        description:
            "Students are informed about the academic schedule for the current semester. Please follow the timetable and attend classes regularly.",

        category: "Academic",

        date: "2026-10-05",

        expiry: "2026-12-31",

        priority: "Normal",

        department: "All Departments"
    },


    {
        id: 5,

        title: "College Holiday Announcement",

        description:
            "The college will remain closed on the upcoming public holiday. Regular classes will resume on the next working day.",

        category: "Holiday",

        date: "2026-10-04",

        expiry: "2026-10-15",

        priority: "Normal",

        department: "All Departments"
    },


    {
        id: 6,

        title: "Semester Fee Payment Notice",

        description:
            "Students who have not completed their semester fee payment are requested to complete the payment within the specified deadline.",

        category: "Fees",

        date: "2026-10-03",

        expiry: "2026-10-20",

        priority: "Important",

        department: "All Departments"
    }

];


/* =====================================================
   LOCAL STORAGE
===================================================== */

function getNotices() {

    const saved =
        localStorage.getItem("collegeNotices");

    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Invalid notice data",
                error
            );

        }

    }


    localStorage.setItem(
        "collegeNotices",
        JSON.stringify(defaultNotices)
    );


    return defaultNotices;
}


function saveNotices(notices) {

    localStorage.setItem(
        "collegeNotices",
        JSON.stringify(notices)
    );

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "No date";
    }


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   CREATE NOTICE CARD
===================================================== */

function createNoticeCard(notice) {

    const priorityClass =
        notice.priority === "Important"
            ? "priority-badge"
            : "";


    return `

        <article class="notice-card">

            <div class="notice-top">

                <span class="badge">
                    ${escapeHTML(notice.category)}
                </span>

                ${
                    notice.priority === "Important"
                    ?
                    `
                    <span class="badge priority-badge">
                        IMPORTANT
                    </span>
                    `
                    :
                    ""
                }

            </div>


            <span class="notice-date">
                ${formatDate(notice.date)}
            </span>


            <h3>
                ${escapeHTML(notice.title)}
            </h3>


            <p>
                ${escapeHTML(notice.description)}
            </p>


            <div class="notice-footer">

                <span class="notice-department">
                    ${escapeHTML(notice.department)}
                </span>

                <span
                    class="notice-link"
                    onclick="openNotice(${notice.id})"
                >
                    View Details →
                </span>

            </div>

        </article>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (!value) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   DISPLAY NOTICES
===================================================== */

function displayNotices(
    containerId,
    search = "",
    category = "all"
) {

    const container =
        document.getElementById(containerId);


    if (!container) {
        return;
    }


    let notices = getNotices();


    const searchText =
        search.toLowerCase().trim();


    notices = notices.filter(notice => {

        const matchesSearch =

            notice.title
                .toLowerCase()
                .includes(searchText)

            ||

            notice.description
                .toLowerCase()
                .includes(searchText)

            ||

            notice.category
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =

            category === "all"

            ||

            notice.category === category;


        return (
            matchesSearch &&
            matchesCategory
        );

    });


    notices.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    if (notices.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Notices Found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        notices
            .map(createNoticeCard)
            .join("");

}


/* =====================================================
   HOME PAGE
===================================================== */

function initializeHomePage() {

    const container =
        document.getElementById(
            "noticeContainer"
        );


    if (!container) {
        return;
    }


    displayNotices(
        "noticeContainer"
    );


    updateHomeStatistics();


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                displayNotices(
                    "noticeContainer",
                    searchInput.value,
                    categoryFilter.value
                );

            }
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                displayNotices(
                    "noticeContainer",
                    searchInput.value,
                    categoryFilter.value
                );

            }
        );

    }


    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                function () {

                    const category =
                        card.dataset.category;


                    if (categoryFilter) {

                        categoryFilter.value =
                            category;

                    }


                    displayNotices(
                        "noticeContainer",
                        "",
                        category
                    );


                    document
                        .getElementById("notices")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });

}


/* =====================================================
   HOME STATISTICS
===================================================== */

function updateHomeStatistics() {

    const notices =
        getNotices();


    const total =
        document.getElementById(
            "totalNotices"
        );


    const important =
        document.getElementById(
            "importantNotices"
        );


    const recent =
        document.getElementById(
            "todayNotices"
        );


    if (total) {

        total.textContent =
            notices.length;

    }


    if (important) {

        important.textContent =
            notices.filter(
                notice =>
                    notice.priority === "Important"
            ).length;

    }


    if (recent) {

        recent.textContent =
            notices.filter(
                notice => {

                    const noticeDate =
                        new Date(notice.date);

                    const today =
                        new Date();

                    const difference =
                        Math.abs(
                            today - noticeDate
                        );

                    const days =
                        difference /
                        (1000 * 60 * 60 * 24);


                    return days <= 7;

                }
            ).length;

    }

}


/* =====================================================
   ALL NOTICE PAGE
===================================================== */

function initializeNoticePage() {

    const container =
        document.getElementById(
            "allNoticeContainer"
        );


    if (!container) {
        return;
    }


    displayNotices(
        "allNoticeContainer"
    );


    const search =
        document.getElementById(
            "allSearchInput"
        );


    const category =
        document.getElementById(
            "allCategoryFilter"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                displayNotices(
                    "allNoticeContainer",
                    search.value,
                    category.value
                );

            }
        );

    }


    if (category) {

        category.addEventListener(
            "change",
            function () {

                displayNotices(
                    "allNoticeContainer",
                    search.value,
                    category.value
                );

            }
        );

    }

}


/* =====================================================
   OPEN NOTICE
===================================================== */

function openNotice(id) {

    const notices =
        getNotices();


    const notice =
        notices.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!notice) {
        return;
    }


    localStorage.setItem(
        "selectedNotice",
        JSON.stringify(notice)
    );


    window.location.href =
        "notice.html?view=" + notice.id;

}


/* =====================================================
   NOTICE DETAIL FROM URL
===================================================== */

function showNoticeDetailIfRequested() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("view");


    if (!id) {
        return;
    }


    const notices =
        getNotices();


    const notice =
        notices.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!notice) {
        return;
    }


    const container =
        document.getElementById(
            "allNoticeContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <article class="notice-card">

            <div class="notice-top">

                <span class="badge">
                    ${escapeHTML(notice.category)}
                </span>

                ${
                    notice.priority === "Important"
                    ?
                    `
                    <span class="badge priority-badge">
                        IMPORTANT
                    </span>
                    `
                    :
                    ""
                }

            </div>


            <span class="notice-date">

                Published:
                ${formatDate(notice.date)}

            </span>


            <h3>
                ${escapeHTML(notice.title)}
            </h3>


            <p style="
                -webkit-line-clamp: unset;
                margin-top: 10px;
                white-space: pre-line;
            ">

                ${escapeHTML(notice.description)}

            </p>


            <div class="notice-footer">

                <span class="notice-department">

                    Department:
                    ${escapeHTML(notice.department)}

                </span>

                <span class="notice-department">

                    Expiry:
                    ${formatDate(notice.expiry)}

                </span>

            </div>

        </article>

    `;

}


/* =====================================================
   LOGIN
===================================================== */

function initializeLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );


    if (!form) {
        return;
    }


    const toggle =
        document.getElementById(
            "togglePassword"
        );


    const password =
        document.getElementById(
            "password"
        );


    if (toggle) {

        toggle.addEventListener(
            "click",
            function () {

                if (
                    password.type ===
                    "password"
                ) {

                    password.type =
                        "text";

                    toggle.textContent =
                        "🙈";

                } else {

                    password.type =
                        "password";

                    toggle.textContent =
                        "👁";

                }

            }
        );

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const passwordValue =
                password.value;


            const error =
                document.getElementById(
                    "loginError"
                );


            /*
                FRONTEND DEMO LOGIN

                Username: admin
                Password: admin123
            */


            if (
                username === "admin" &&
                passwordValue === "admin123"
            ) {

                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                window.location.href =
                    "admin.html";

            } else {

                error.textContent =
                    "Invalid username or password.";

            }

        }
    );

}


/* =====================================================
   ADMIN AUTHENTICATION
===================================================== */

function checkAdminLogin() {

    const adminPage =
        document.querySelector(
            ".admin-page"
        );


    if (!adminPage) {
        return;
    }


    const loggedIn =
        localStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn !== "true") {

        window.location.href =
            "login.html";

    }

}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function initializeAdminPage() {

    const table =
        document.getElementById(
            "adminNoticeTable"
        );


    if (!table) {
        return;
    }


    renderAdminTable();


    updateAdminStatistics();


    const modal =
        document.getElementById(
            "noticeModal"
        );


    const openBtn =
        document.getElementById(
            "openNoticeModal"
        );


    const closeBtn =
        document.getElementById(
            "closeNoticeModal"
        );


    const cancelBtn =
        document.getElementById(
            "cancelNotice"
        );


    if (openBtn) {

        openBtn.addEventListener(
            "click",
            function () {

                openAddNoticeModal();

            }
        );

    }


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeNoticeModal
        );

    }


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeNoticeModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeNoticeModal();

                }

            }
        );

    }


    const form =
        document.getElementById(
            "noticeForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            saveNoticeFromForm
        );

    }


    const search =
        document.getElementById(
            "adminSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                renderAdminTable(
                    search.value
                );

            }
        );

    }


    const logout =
        document.getElementById(
            "logoutBtn"
        );


    if (logout) {

        logout.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "adminLoggedIn"
                );


                window.location.href =
                    "login.html";

            }
        );

    }

}


/* =====================================================
   ADMIN TABLE
===================================================== */

function renderAdminTable(searchText = "") {

    const table =
        document.getElementById(
            "adminNoticeTable"
        );


    if (!table) {
        return;
    }


    let notices =
        getNotices();


    const search =
        searchText
            .toLowerCase()
            .trim();


    if (search) {

        notices =
            notices.filter(
                notice =>

                    notice.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    notice.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    notice.description
                        .toLowerCase()
                        .includes(search)
            );

    }


    notices.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    if (notices.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >
                    No notices found.
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML =
        notices.map(notice => `

            <tr>

                <td>

                    <div class="table-title">

                        ${escapeHTML(
                            notice.title
                        )}

                    </div>

                    <div class="table-description">

                        ${escapeHTML(
                            notice.department
                        )}

                    </div>

                </td>


                <td>

                    <span class="badge">

                        ${escapeHTML(
                            notice.category
                        )}

                    </span>

                </td>


                <td>
                    ${formatDate(notice.date)}
                </td>


                <td>

                    ${
                        notice.priority ===
                        "Important"

                        ?

                        `
                        <span class="
                            badge
                            priority-badge
                        ">
                            Important
                        </span>
                        `

                        :

                        `
                        <span class="badge">
                            Normal
                        </span>
                        `
                    }

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editNotice(${notice.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteNotice(${notice.id})"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");

}


/* =====================================================
   ADMIN STATISTICS
===================================================== */

function updateAdminStatistics() {

    const notices =
        getNotices();


    const total =
        document.getElementById(
            "adminTotal"
        );


    const important =
        document.getElementById(
            "adminImportant"
        );


    const exam =
        document.getElementById(
            "adminExam"
        );


    const placement =
        document.getElementById(
            "adminPlacement"
        );


    if (total) {

        total.textContent =
            notices.length;

    }


    if (important) {

        important.textContent =
            notices.filter(
                notice =>
                    notice.priority ===
                    "Important"
            ).length;

    }


    if (exam) {

        exam.textContent =
            notices.filter(
                notice =>
                    notice.category ===
                    "Examination"
            ).length;

    }


    if (placement) {

        placement.textContent =
            notices.filter(
                notice =>
                    notice.category ===
                    "Placement"
            ).length;

    }

}


/* =====================================================
   OPEN ADD NOTICE MODAL
===================================================== */

function openAddNoticeModal() {

    const modal =
        document.getElementById(
            "noticeModal"
        );


    const form =
        document.getElementById(
            "noticeForm"
        );


    if (!modal || !form) {
        return;
    }


    form.reset();


    document.getElementById(
        "noticeId"
    ).value = "";


    document.getElementById(
        "noticeDate"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add New Notice";


    modal.classList.add("show");

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeNoticeModal() {

    const modal =
        document.getElementById(
            "noticeModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   SAVE NOTICE
===================================================== */

function saveNoticeFromForm(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "noticeId"
        ).value;


    const title =
        document.getElementById(
            "noticeTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "noticeDescription"
        ).value.trim();


    const category =
        document.getElementById(
            "noticeCategory"
        ).value;


    const date =
        document.getElementById(
            "noticeDate"
        ).value;


    const expiry =
        document.getElementById(
            "noticeExpiry"
        ).value;


    const priority =
        document.getElementById(
            "noticePriority"
        ).value;


    const department =
        document.getElementById(
            "noticeDepartment"
        ).value;


    let notices =
        getNotices();


    if (id) {

        const index =
            notices.findIndex(
                notice =>
                    Number(notice.id) ===
                    Number(id)
            );


        if (index !== -1) {

            notices[index] = {

                ...notices[index],

                title,

                description,

                category,

                date,

                expiry,

                priority,

                department

            };

        }

        showToast(
            "Notice updated successfully."
        );

    } else {

        const newNotice = {

            id: Date.now(),

            title,

            description,

            category,

            date,

            expiry,

            priority,

            department

        };


        notices.push(newNotice);


        showToast(
            "Notice added successfully."
        );

    }


    saveNotices(notices);


    renderAdminTable();


    updateAdminStatistics();


    closeNoticeModal();

}


/* =====================================================
   EDIT NOTICE
===================================================== */

function editNotice(id) {

    const notices =
        getNotices();


    const notice =
        notices.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!notice) {
        return;
    }


    document.getElementById(
        "noticeId"
    ).value =
        notice.id;


    document.getElementById(
        "noticeTitle"
    ).value =
        notice.title;


    document.getElementById(
        "noticeDescription"
    ).value =
        notice.description;


    document.getElementById(
        "noticeCategory"
    ).value =
        notice.category;


    document.getElementById(
        "noticeDate"
    ).value =
        notice.date;


    document.getElementById(
        "noticeExpiry"
    ).value =
        notice.expiry || "";


    document.getElementById(
        "noticePriority"
    ).value =
        notice.priority;


    document.getElementById(
        "noticeDepartment"
    ).value =
        notice.department;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Notice";


    document
        .getElementById(
            "noticeModal"
        )
        .classList.add("show");

}


/* =====================================================
   DELETE NOTICE
===================================================== */

function deleteNotice(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this notice?"
        );


    if (!confirmed) {
        return;
    }


    let notices =
        getNotices();


    notices =
        notices.filter(
            notice =>
                Number(notice.id) !==
                Number(id)
        );


    saveNotices(notices);


    renderAdminTable();


    updateAdminStatistics();


    showToast(
        "Notice deleted successfully."
    );

}


/* =====================================================
   TOAST MESSAGE
===================================================== */

function showToast(message) {

    const existing =
        document.querySelector(
            ".toast"
        );


    if (existing) {
        existing.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        3000
    );

}


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
            Home page
        */

        initializeHomePage();


        /*
            All notices page
        */

        initializeNoticePage();


        /*
            Notice detail
        */

        showNoticeDetailIfRequested();


        /*
            Login page
        */

        initializeLogin();


        /*
            Admin authentication
        */

        checkAdminLogin();


        /*
            Admin dashboard
        */

        initializeAdminPage();

    }
);