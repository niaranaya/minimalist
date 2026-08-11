/* =====================================================
   MAIN WEDDING JAVASCRIPT
===================================================== */

let musicStarted = false;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        createFallingFlowers();

        loadGuestName();

        initOpening();

        initMusic();

        initCountdown();

        initAnimations();

        initRSVP();

        initWishes();

        loadWishes();

    }
);



/* =====================================================
   FALLING FLOWERS
===================================================== */

function createFallingFlowers() {

    const container =
        document.getElementById(
            "fallingFlowers"
        );


    const symbols = [
        "❀",
        "✿",
        "❁",
        "✾",
        "❋",
        "✽"
    ];


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const flower =
            document.createElement(
                "div"
            );


        flower.className =
            "falling-flower";


        flower.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        flower.style.left =
            Math.random() * 100 + "%";


        flower.style.fontSize =
            Math.random() * 18 + 10 + "px";


        flower.style.animationDuration =
            Math.random() * 8 + 8 + "s";


        flower.style.animationDelay =
            Math.random() * 10 + "s";


        container.appendChild(
            flower
        );

    }

}



/* =====================================================
   GUEST NAME
===================================================== */

async function loadGuestName() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const slug =
        params.get("to");


    const guestElement =
        document.getElementById(
            "guestName"
        );


    if (
        !slug ||
        !guestElement
    ) {

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("guests")
            .select("name")
            .eq("slug", slug)
            .maybeSingle();


    if (
        error ||
        !data
    ) {

        console.log(
            "Guest tidak ditemukan."
        );

        return;

    }


    guestElement.textContent =
        data.name;


    const rsvpName =
        document.getElementById(
            "rsvpName"
        );


    const wishName =
        document.getElementById(
            "wishName"
        );


    if (rsvpName) {

        rsvpName.value =
            data.name;

    }


    if (wishName) {

        wishName.value =
            data.name;

    }

}



/* =====================================================
   OPENING
===================================================== */

function initOpening() {

    const button =
        document.getElementById(
            "openInvitation"
        );


    const opening =
        document.getElementById(
            "openingScreen"
        );


    const main =
        document.getElementById(
            "mainContent"
        );


    if (
        !button ||
        !opening ||
        !main
    ) {

        return;

    }


    document.body.style.overflow =
        "hidden";


    button.addEventListener(
        "click",
        async () => {

            opening.classList.add(
                "hide"
            );


            main.classList.add(
                "show"
            );


            document.body.style.overflow =
                "auto";


            startMusic();

        }
    );

}



/* =====================================================
   MUSIC
===================================================== */

function initMusic() {

    const music =
        document.getElementById(
            "weddingMusic"
        );


    const button =
        document.getElementById(
            "musicButton"
        );


    if (
        !music ||
        !button
    ) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            if (
                music.paused
            ) {

                music.play()
                    .then(
                        () => {

                            musicStarted =
                                true;

                            button.classList.add(
                                "playing"
                            );

                        }
                    );

            } else {

                music.pause();

                button.classList.remove(
                    "playing"
                );

            }

        }
    );

}


function startMusic() {

    const music =
        document.getElementById(
            "weddingMusic"
        );


    const button =
        document.getElementById(
            "musicButton"
        );


    if (
        !music ||
        musicStarted
    ) {

        return;

    }


    music.play()
        .then(
            () => {

                musicStarted =
                    true;

                button.classList.add(
                    "playing"
                );

            }
        )
        .catch(
            () => {

                console.log(
                    "Autoplay blocked."
                );

            }
        );

}



/* =====================================================
   COUNTDOWN
===================================================== */

function initCountdown() {

    const weddingDate =
        new Date(
            "December 12, 2026 09:00:00"
        ).getTime();


    function update() {

        const now =
            new Date().getTime();


        const distance =
            weddingDate - now;


        if (
            distance <= 0
        ) {

            return;

        }


        const days =
            Math.floor(
                distance /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        const hours =
            Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                ) /
                (
                    1000 *
                    60 *
                    60
                )
            );


        const minutes =
            Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60 *
                        60
                    )
                ) /
                (
                    1000 *
                    60
                )
            );


        const seconds =
            Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60
                    )
                ) /
                1000
            );


        document.getElementById(
            "days"
        ).textContent =
            String(days).padStart(
                2,
                "0"
            );


        document.getElementById(
            "hours"
        ).textContent =
            String(hours).padStart(
                2,
                "0"
            );


        document.getElementById(
            "minutes"
        ).textContent =
            String(minutes).padStart(
                2,
                "0"
            );


        document.getElementById(
            "seconds"
        ).textContent =
            String(seconds).padStart(
                2,
                "0"
            );

    }


    update();


    setInterval(
        update,
        1000
    );

}



/* =====================================================
   SLIDE ANIMATION
===================================================== */

function initAnimations() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: .2
            }
        );


    slides.forEach(
        slide => {

            observer.observe(
                slide
            );

        }
    );

}



/* =====================================================
   RSVP
===================================================== */

function initRSVP() {

    const form =
        document.getElementById(
            "rsvpForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "rsvpName"
                ).value.trim();


            const attendance =
                document.getElementById(
                    "attendance"
                ).value;


            const pax =
                Number(
                    document.getElementById(
                        "pax"
                    ).value
                );


            const message =
                document.getElementById(
                    "rsvpMessage"
                ).value.trim();


            const {
                error
            } =
                await supabaseClient
                    .from("rsvps")
                    .insert({
                        guest_name:
                            name,

                        attendance:
                            attendance,

                        pax:
                            pax,

                        message:
                            message
                    });


            if (error) {

                console.error(
                    error
                );

                alert(
                    "RSVP gagal dikirim."
                );

                return;

            }


            alert(
                "Terima kasih. Konfirmasi kehadiran berhasil dikirim."
            );


            form.reset();

        }
    );

}



/* =====================================================
   WISHES
===================================================== */

function initWishes() {

    const form =
        document.getElementById(
            "wishForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "wishName"
                ).value.trim();


            const message =
                document.getElementById(
                    "wishMessage"
                ).value.trim();


            if (
                !name ||
                !message
            ) {

                return;

            }


            const {
                error
            } =
                await supabaseClient
                    .from("wishes")
                    .insert({
                        guest_name:
                            name,

                        message:
                            message
                    });


            if (error) {

                console.error(
                    error
                );

                alert(
                    "Ucapan gagal dikirim."
                );

                return;

            }


            form.reset();


            loadWishes();

        }
    );

}



/* =====================================================
   LOAD WISHES
===================================================== */

async function loadWishes() {

    const list =
        document.getElementById(
            "wishList"
        );


    if (!list) {

        return;

    }


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


    list.innerHTML =
        "";


    data.forEach(
        wish => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "wish-item";


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                wish.guest_name;


            const message =
                document.createElement(
                    "p"
                );


            message.textContent =
                wish.message;


            item.appendChild(
                name
            );


            item.appendChild(
                message
            );


            list.appendChild(
                item
            );

        }
    );

}