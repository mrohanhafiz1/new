 
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       1. LOADING ANIMATION
    ============================== */

    const loader = document.getElementById("loader");

    document.body.classList.add("loading");

    function hideLoader() {
        if (!loader) {
            document.body.classList.remove("loading");
            return;
        }

        loader.classList.add("hide");
        document.body.classList.remove("loading");

        // Loader ko animation ke baad page se hata do
        window.setTimeout(function () {
            if (loader && loader.classList.contains("hide")) {
                loader.style.display = "none";
            }
        }, 600);
    }

    // Page load ho chuka ho to loader foran hide karo
    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, { once: true });
    }

    // Safety fallback: kisi resource ke late load hone par
    // loader hamesha ke liye screen par nahi rahega.
    window.setTimeout(hideLoader, 2500);


    /* ==============================
       2. CUSTOM MOUSE ANIMATION
    ============================== */

    const cursorDot = document.getElementById("cursorDot");
    const cursorOutline = document.getElementById("cursorOutline");

    const desktopPointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    if (cursorDot && cursorOutline && desktopPointer.matches) {

        let mouseX = -100;
        let mouseY = -100;
        let outlineX = -100;
        let outlineY = -100;
        let cursorFrame = null;
        let cursorVisible = false;

        cursorDot.style.opacity = "0";
        cursorOutline.style.opacity = "0";

        function animateCursor() {
            // Smooth trailing animation
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;

            cursorDot.style.left = mouseX + "px";
            cursorDot.style.top = mouseY + "px";

            cursorOutline.style.left = outlineX + "px";
            cursorOutline.style.top = outlineY + "px";

            cursorFrame = window.requestAnimationFrame(animateCursor);
        }

        document.addEventListener("mousemove", function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;

            if (!cursorVisible) {
                cursorVisible = true;

                cursorDot.style.opacity = "1";
                cursorOutline.style.opacity = "1";

                outlineX = mouseX;
                outlineY = mouseY;

                if (cursorFrame === null) {
                    cursorFrame = window.requestAnimationFrame(animateCursor);
                }
            }
        });

        document.addEventListener("mouseleave", function () {
            cursorDot.style.opacity = "0";
            cursorOutline.style.opacity = "0";
            cursorVisible = false;
        });

        document.addEventListener("mouseenter", function () {
            if (cursorVisible) {
                cursorDot.style.opacity = "1";
                cursorOutline.style.opacity = "1";
            }
        });

        // Hover effect for clickable elements
        const interactiveElements = document.querySelectorAll(
            "a, button, input, textarea, .skill-card, .review-card"
        );

        interactiveElements.forEach(function (element) {

            element.addEventListener("mouseenter", function () {
                cursorOutline.classList.add("cursor-hover");
            });

            element.addEventListener("mouseleave", function () {
                cursorOutline.classList.remove("cursor-hover");
            });

        });

    }


    /* ==============================
       3. MOBILE NAVIGATION
    ============================== */

    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    function closeMenu() {
        if (!menuBtn || !navbar) return;

        navbar.classList.remove("active");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuBtn && navbar) {

        menuBtn.addEventListener("click", function () {

            const isOpen = navbar.classList.toggle("active");

            menuBtn.textContent = isOpen ? "✕" : "☰";
            menuBtn.setAttribute("aria-expanded", String(isOpen));
            menuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

        });

        // Click on a navigation link to close mobile menu
        const navLinks = navbar.querySelectorAll("a");

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu();
            });
        });

        // Close menu when clicking outside it
        document.addEventListener("click", function (event) {

            if (
                navbar.classList.contains("active") &&
                !navbar.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMenu();
            }

        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Reset mobile menu when returning to desktop width
        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });

    }


    /* ==============================
       4. HEADER SCROLL EFFECT
    ============================== */

    const header = document.getElementById("header");

    function handleHeaderScroll() {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleHeaderScroll, {
        passive: true
    });

    handleHeaderScroll();


    /* ==============================
       5. ACTIVE NAVIGATION LINK
    ============================== */

    const sections = document.querySelectorAll("main section[id]");
    const mainNavLinks = document.querySelectorAll(
        '.navbar a[href^="#"]'
    );

    function updateActiveLink() {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                currentSection = section.id;
            }

        });

        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5
        ) {
            currentSection = "contact";
        }

        mainNavLinks.forEach(function (link) {

            const linkTarget = link.getAttribute("href");

            if (linkTarget === "#" + currentSection) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

        });

    }

    window.addEventListener("scroll", updateActiveLink, {
        passive: true
    });

    window.addEventListener("resize", updateActiveLink);

    updateActiveLink();


    /* ==============================
       6. CONTACT FORM VALIDATION
    ============================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            // HTML required fields aur email validation bhi check karo
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                contactForm.reportValidity();
                return;
            }

            const nameInput = contactForm.querySelector(
                '[name="name"]'
            );

            const phoneInput = contactForm.querySelector(
                '[name="phone"]'
            );

            const emailInput = contactForm.querySelector(
                '[name="email"]'
            );

            const messageInput = contactForm.querySelector(
                '[name="message"]'
            );

            const name = nameInput ? nameInput.value.trim() : "";
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const message = messageInput
                ? messageInput.value.trim()
                : "";

            if (!name || !phone || !email || !message) {
                event.preventDefault();
                alert("Please fill in all fields.");
                return;
            }

            // Native form submission Web3Forms ko handle karega.
            // Yahan preventDefault nahi karna, warna form submit nahi hoga.

        });

    }


    /* ==============================
       7. AUTOMATIC FOOTER YEAR
    ============================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ==============================
       8. IMAGE FALLBACK
    ============================== */

    const images = document.querySelectorAll("img");

    images.forEach(function (img) {

        img.addEventListener("error", function () {

            // Missing image ki wajah se JavaScript crash nahi hogi.
            img.classList.add("image-not-loaded");

        });

    });

});
