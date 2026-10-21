document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector(".page-transition");
    if (!page) return;

    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation?.type === "reload") {
        sessionStorage.removeItem("kingdoo-about-copy-typed");
    }

    const currentUrl = new URL(window.location.href);
    const shouldRevealPage =
        currentUrl.searchParams.get("_page_transition") === "rise" ||
        window.location.pathname === "/";

    if (shouldRevealPage) {
        currentUrl.searchParams.delete("_page_transition");
        window.history.replaceState(
            window.history.state,
            "",
            `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
        );

        document.body.classList.add("page-transition-entering");
        page.classList.add("page-entering");

        const finishPageEntry = (event) => {
            if (event.target !== page || event.animationName !== "pageRiseIn") return;
            page.classList.remove("page-entering");
            document.body.classList.remove("page-transition-entering");
            page.removeEventListener("animationend", finishPageEntry);
        };
        page.addEventListener("animationend", finishPageEntry);
    }

    const revealTargets = document.querySelectorAll(
        ".intro-grid, .stats-row, .services-heading, .service-row, " +
        ".collections .featured-head, .collection-card, " +
        ".featured .featured-head, .photo-card, .promise-photo, " +
        ".promise-copy, .booking > *"
    );

    revealTargets.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

        revealTargets.forEach((element) => revealObserver.observe(element));
    } else {
        revealTargets.forEach((element) => element.classList.add("is-visible"));
    }

    const links = document.querySelectorAll("a[href]");
    let leaving = false;

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                link.target === "_blank" || link.hasAttribute("download")
            ) return;

            const href = link.getAttribute("href");
            if (!href || href === "#" || href.startsWith("#")) return;

            if (
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("//")
            ) {
                return;
            }

            if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

            const destination = new URL(href, window.location.href);
            if (destination.origin !== window.location.origin) return;

            if (destination.href === window.location.href || leaving) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            leaving = true;

            const destinationUrl = new URL(destination.href);

            destinationUrl.searchParams.set("_page_transition", "rise");

            let navigated = false;
            const navigate = () => {
                if (navigated) return;
                navigated = true;
                window.location.assign(destinationUrl.href);
            };

            const completeNavigation = (animationEvent) => {
                if (
                    animationEvent.target === page &&
                    animationEvent.animationName === "pageFadeOut"
                ) {
                    page.removeEventListener(
                        "animationend",
                        completeNavigation
                    );
                    window.clearTimeout(fallbackNavigation);
                    navigate();
                }
            };

            page.addEventListener("animationend", completeNavigation);
            document.body.classList.add("page-transition-leaving");
            page.classList.remove("page-entering");
            page.classList.add("page-leaving");

            const fallbackNavigation = window.setTimeout(navigate, 650);
        });
    });
});
