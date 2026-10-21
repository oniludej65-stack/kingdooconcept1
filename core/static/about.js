document.addEventListener("DOMContentLoaded", () => {
    const copy = document.querySelector(".about-copy");
    const portrait = document.querySelector(".about-photo");
    const sessionKey = "kingdoo-about-copy-typed";

    if (!copy || !portrait) return;

    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation?.type === "reload") {
        sessionStorage.removeItem(sessionKey);
    }

    if (sessionStorage.getItem(sessionKey)) return;

    const elements = Array.from(copy.children).filter((element) =>
        element.matches("h1, p")
    );
    const shouldReduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    let started = false;

    const startTyping = () => {
        if (started) return;
        started = true;
        sessionStorage.setItem(sessionKey, "true");

        if (shouldReduceMotion) return;

        const textBlocks = elements.map((element) => {
            const text = element.textContent;
            const accessibleText = document.createElement("span");
            const visualText = document.createElement("span");

            accessibleText.className = "visually-hidden";
            accessibleText.textContent = text;
            visualText.setAttribute("aria-hidden", "true");

            element.style.minHeight = `${element.getBoundingClientRect().height}px`;
            element.replaceChildren(accessibleText, visualText);

            return { element, text, visualText };
        });

        let blockIndex = 0;
        let characterIndex = 0;

        const typeNextCharacter = () => {
            const block = textBlocks[blockIndex];

            if (!block) return;

            block.element.classList.add("is-typing");
            characterIndex += 1;
            block.visualText.textContent = block.text.slice(0, characterIndex);

            if (characterIndex >= block.text.length) {
                block.element.classList.remove("is-typing");
                blockIndex += 1;
                characterIndex = 0;
                window.setTimeout(typeNextCharacter, 220);
                return;
            }

            window.setTimeout(typeNextCharacter, 12);
        };

        typeNextCharacter();
    };

    if (portrait.complete) {
        startTyping();
    } else {
        portrait.addEventListener("load", startTyping, { once: true });
        portrait.addEventListener("error", startTyping, { once: true });
    }
});
