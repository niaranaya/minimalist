/* =====================================================
   ADMIN
===================================================== */


let currentUser = null;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initLogin();

        initLogout();

        initGuestForm();

        initExport();

        await checkSession();

    }
);



/* =====================================================
   SESSION
===================================================== */

async function checkSession() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        data.session
    ) {

        currentUser =
            data.session.user;

        showDashboard();

        loadDashboard();

    } else {

        showLogin();

    }

}



/* =====================================================
   LOGIN
===================================================== */

function initLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value;


            const password =
                document.getElementById(
                    "password"
                ).value;


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({
                        email,
                        password
                    });


            if (error) {

                alert(
                    "Email atau password salah."
                );

                return;

            }


            currentUser =
                data.user;


            showDashboard();

            loadDashboard();

        }
    );

}



/* =====================================================
   LOGOUT
===================================================== */

function initLogout() {

    document
        .getElementById(
            "logoutButton"
        )
        .addEventListener(
            "click",
            async () => {

                await supabaseClient
                    .auth
                    .signOut();


                showLogin();

            }
        );

}



/* =====================================================
   UI
===================================================== */

function showLogin() {

    document
        .getElementById(
            "loginScreen"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "dashboard"
        )
        .classList.add(
            "hidden"
        );

}


function showDashboard() {

    document
        .getElementById(
            "loginScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "dashboard"
        )
        .classList.remove(
            "hidden"
        );

}



/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

    await loadGuests();

    await loadRSVP();

    await loadWishes();

}



/* =====================================================
   GUESTS
===================================================== */

function initGuestForm() {

    const form =
        document.getElementById(
            "guestForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const input =
                document.getElementById(
                    "guestNameInput"
                );


            const name =
                input.value.trim();


            if (!name) {

                return;

            }


            const slug =
                createSlug(name);


            const {
                error
            } =
                await supabaseClient
                    .from("guests")
                    .insert({
                        name,
                        slug
                    });


            if (error) {

                console.error(
                    error
                );

                alert(
                    "Tamu gagal ditambahkan. Mungkin slug sudah digunakan."
                );

                return;

            }


            input.value =
                "";


            loadGuests();

        }
    );

}


async function loadGuests() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("guests")
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            error
        );

        return;

    }


    const container =
        document.getElementById(
            "guestList"
        );


    container.innerHTML =
        "";


    data.forEach(
        guest => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "guest-item";


            const link =
                `${window.location.origin}/index.html?to=${guest.slug}`;


            item.innerHTML = `

                <div class="guest-info">

                    <strong>
                        ${escapeHTML(guest.name)}
                    </strong>

                    <div class="guest-link">
                        ${link}
                    </div>

                </div>

                <div class="guest-actions">

                    <button
                        onclick="copyGuestLink('${link}')"
                    >
                        COPY LINK
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteGuest('${guest.id}')"
                    >
                        HAPUS
                    </button>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}



/* =====================================================
   CREATE SLUG
===================================================== */

function createSlug(
    name
) {

    return name
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )
        .replace(
            /\s+/g,
            "-"
        )
        .replace(
            /-+/g,
            "-"
        );

}



/* =====================================================
   COPY LINK
===================================================== */

window.copyGuestLink =
    async function (
        link
    ) {

        await navigator
            .clipboard
            .writeText(
                link
            );


        alert(
            "Link berhasil disalin."
        );

    };



/* =====================================================
   DELETE GUEST
===================================================== */

window.deleteGuest =
    async function (
        id
    ) {

        const confirmDelete =
            confirm(
                "Hapus tamu ini?"
            );


        if (!confirmDelete) {

            return;

        }


        const {
            error
        } =
            await supabaseClient
                .from("guests")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                error
            );

            return;

        }


        loadGuests();

    };



/* =====================================================
   RSVP
===================================================== */

async function loadRSVP() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("rsvps")
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            error
        );

        return;

    }


    document.getElementById(
        "totalRsvp"
    ).textContent =
        data.length;


    document.getElementById(
        "totalHadir"
    ).textContent =
        data.filter(
            item =>
                item.attendance ===
                "Hadir"
        ).length;


    document.getElementById(
        "totalPax"
    ).textContent =
        data.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.pax || 0
                ),
            0
        );


    const table =
        document.getElementById(
            "rsvpTable"
        );


    table.innerHTML =
        "";


    data.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(item.guest_name)}
                </td>

                <td>
                    ${escapeHTML(item.attendance)}
                </td>

                <td>
                    ${item.pax}
                </td>

                <td>
                    ${escapeHTML(item.message || "-")}
                </td>

                <td>
                    ${formatDate(item.created_at)}
                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}



/* =====================================================
   WISHES
===================================================== */

async function loadWishes() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("wishes")
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            error
        );

        return;

    }


    document.getElementById(
        "totalWishes"
    ).textContent =
        data.length;


    const list =
        document.getElementById(
            "adminWishList"
        );


    list.innerHTML =
        "";


    data.forEach(
        wish => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "admin-wish";


            item.innerHTML = `

                <strong>
                    ${escapeHTML(wish.guest_name)}
                </strong>

                <p>
                    ${escapeHTML(wish.message)}
                </p>

            `;


            list.appendChild(
                item
            );

        }
    );

}



/* =====================================================
   EXPORT CSV
===================================================== */

function initExport() {

    document
        .getElementById(
            "exportButton"
        )
        .addEventListener(
            "click",
            exportCSV
        );

}


async function exportCSV() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("rsvps")
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        alert(
            "Gagal export."
        );

        return;

    }


    let csv =
        "Nama,Kehadiran,Pax,Pesan,Waktu\n";


    data.forEach(
        item => {

            csv +=
                `"${item.guest_name}",` +
                `"${item.attendance}",` +
                `"${item.pax}",` +
                `"${item.message || ""}",` +
                `"${item.created_at}"\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "rsvp.csv";


    link.click();


    URL.revokeObjectURL(
        url
    );

}



/* =====================================================
   HELPERS
===================================================== */

function formatDate(
    date
) {

    return new Date(
        date
    ).toLocaleString(
        "id-ID"
    );

}


function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}