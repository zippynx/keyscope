const elements = {
    welcomeScreen: document.getElementById("welcomeScreen"),
    inspectorContent: document.getElementById("inspectorContent"),
    keycap: document.getElementById("keycap"),
    mainKeyDisplay: document.getElementById("mainKeyDisplay"),
    keyCategory: document.getElementById("keyCategory"),

    eventKey: document.getElementById("eventKey"),
    eventCode: document.getElementById("eventCode"),
    eventWhich: document.getElementById("eventWhich"),
    eventKeyCode: document.getElementById("eventKeyCode"),

    ctrlState: document.getElementById("ctrlState"),
    shiftState: document.getElementById("shiftState"),
    altState: document.getElementById("altState"),
    metaState: document.getElementById("metaState"),
    capsState: document.getElementById("capsState"),

    historyContainer: document.getElementById("historyContainer"),

    copyKey: document.getElementById("copyKey"),
    copyCode: document.getElementById("copyCode"),

    themeToggle: document.getElementById("themeToggle")
};

const state = {
    initialized: false,
    history: [],
    maxHistory: 9,
    theme: localStorage.getItem("keyscope-theme") || "dark"
};

function initializeApp() {
    applyTheme(state.theme);
    initializeThemeToggle();
    initializeClipboardActions();
}

function initializeThemeToggle() {
    if (!elements.themeToggle) return;

    elements.themeToggle.addEventListener("click", () => {
        const nextTheme =
            document.documentElement.dataset.theme === "light"
                ? "dark"
                : "light";

        applyTheme(nextTheme);
    });
}

function applyTheme(theme) {
    state.theme = theme;

    if (theme === "light") {
        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );
    } else {
        document.documentElement.removeAttribute(
            "data-theme"
        );
    }

    localStorage.setItem(
        "keyscope-theme",
        theme
    );
}

function initializeClipboardActions() {
    if (elements.copyKey) {
        elements.copyKey.addEventListener("click", () => {
            copyToClipboard(
                elements.eventKey.textContent,
                elements.copyKey
            );
        });
    }

    if (elements.copyCode) {
        elements.copyCode.addEventListener("click", () => {
            copyToClipboard(
                elements.eventCode.textContent,
                elements.copyCode
            );
        });
    }
}

function revealInspector() {
    if (state.initialized) return;

    state.initialized = true;

    elements.welcomeScreen.classList.add(
        "fade-out"
    );

    setTimeout(() => {
        elements.welcomeScreen.classList.add(
            "hidden"
        );

        elements.inspectorContent.classList.remove(
            "hidden"
        );

        elements.inspectorContent.classList.add(
            "fade-in"
        );
    }, 350);
}

function normalizeKey(key) {
    if (key === " ") return "Space";

    if (key === "Enter") return "↵ Enter";

    if (key === "ArrowUp") return "↑";

    if (key === "ArrowDown") return "↓";

    if (key === "ArrowLeft") return "←";

    if (key === "ArrowRight") return "→";

    if (key === "Escape") return "Esc";

    if (key === "Backspace") return "⌫";

    if (key === "Delete") return "Del";

    if (key === "Tab") return "⇥ Tab";

    return key;
}

function isModifierKey(key) {
    return [
        "Control",
        "Shift",
        "Alt",
        "Meta",
        "CapsLock"
    ].includes(key);
}

function classifyKey(event) {
    const key = event.key;

    if (
        [
            "Control",
            "Shift",
            "Alt",
            "Meta",
            "CapsLock"
        ].includes(key)
    ) {
        return "Modifier";
    }

    if (
        key.startsWith("F") &&
        /^F\d+$/.test(key)
    ) {
        return "Function";
    }

    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
            "PageUp",
            "PageDown"
        ].includes(key)
    ) {
        return "Navigation";
    }

    if (
        [
            "Escape",
            "Enter",
            "Tab",
            "Backspace",
            "Delete",
            "Insert",
            "ContextMenu"
        ].includes(key)
    ) {
        return "Special";
    }

    return "Printable";
}

function updateCategoryBadge(category) {
    elements.keyCategory.textContent =
        category;

    elements.keyCategory.className =
        "category-badge";

    elements.keyCategory.classList.add(
        category.toLowerCase()
    );
}

function animateKeycap() {
    elements.keycap.classList.remove(
        "pressed"
    );

    requestAnimationFrame(() => {
        elements.keycap.classList.add(
            "pressed"
        );

        setTimeout(() => {
            elements.keycap.classList.remove(
                "pressed"
            );
        }, 120);
    });
}

function safeValue(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    return String(value);
}

initializeApp();

function handleKeyDown(event) {
    revealInspector();

    updateKeyDisplay(event);
    updateEventCards(event);
    updateModifiers(event);
    updateHistory(event);

    animateKeycap();
}

function handleKeyUp(event) {
    updateModifierStates({
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
        caps: event.getModifierState("CapsLock")
    });
}

function updateKeyDisplay(event) {
    const displayKey = normalizeKey(event.key);

    elements.mainKeyDisplay.textContent =
        displayKey;

    const category =
        classifyKey(event);

    updateCategoryBadge(category);
}

function updateEventCards(event) {
    elements.eventKey.textContent =
        safeValue(
            normalizeKey(event.key)
        );

    elements.eventCode.textContent =
        safeValue(event.code);

    elements.eventWhich.textContent =
        safeValue(event.which);

    elements.eventKeyCode.textContent =
        safeValue(event.keyCode);
}

function updateModifiers(event) {
    updateModifierStates({
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
        caps: event.getModifierState("CapsLock")
    });
}

function updateModifierStates(modifiers) {
    toggleModifier(
        elements.ctrlState,
        modifiers.ctrl
    );

    toggleModifier(
        elements.shiftState,
        modifiers.shift
    );

    toggleModifier(
        elements.altState,
        modifiers.alt
    );

    toggleModifier(
        elements.metaState,
        modifiers.meta
    );

    toggleModifier(
        elements.capsState,
        modifiers.caps
    );
}

function toggleModifier(
    element,
    active
) {
    if (!element) return;

    element.classList.toggle(
        "active",
        Boolean(active)
    );
}

function updateHistory(event) {
    if (
        event.key === "Escape"
    ) {
        clearHistory();
        return;
    }

    if (
        isModifierKey(event.key)
    ) {
        return;
    }

    const value =
        normalizeKey(event.key);

    state.history = [
        value,
        ...state.history.filter(
            item => item !== value
        )
    ];

    if (
        state.history.length >
        state.maxHistory
    ) {
        state.history =
            state.history.slice(
                0,
                state.maxHistory
            );
    }

    renderHistory();
}

function renderHistory() {
    if (
        !elements.historyContainer
    ) {
        return;
    }

    elements.historyContainer.innerHTML =
        "";

    state.history.forEach(
        (key, index) => {
            const chip =
                document.createElement(
                    "div"
                );

            chip.className =
                "history-chip";

            if (index === 0) {
                chip.classList.add(
                    "newest"
                );
            }

            chip.textContent = key;

            elements.historyContainer.appendChild(
                chip
            );
        }
    );
}

function clearHistory() {
    state.history = [];

    if (
        elements.historyContainer
    ) {
        elements.historyContainer.innerHTML =
            "";
    }
}

async function copyToClipboard(
    value,
    button
) {
    if (
        !value ||
        value === "—"
    ) {
        return;
    }

    const originalText =
        button.textContent;

    try {
        await navigator.clipboard.writeText(
            value
        );

        button.textContent =
            "Copied";

        button.classList.add(
            "copied"
        );

        setTimeout(() => {
            button.textContent =
                originalText;

            button.classList.remove(
                "copied"
            );
        }, 1000);
    } catch {
        button.textContent =
            "Failed";

        setTimeout(() => {
            button.textContent =
                originalText;
        }, 1000);
    }
}

window.addEventListener(
    "keydown",
    handleKeyDown
);

window.addEventListener(
    "keyup",
    handleKeyUp
);

window.addEventListener(
    "blur",
    () => {
        updateModifierStates({
            ctrl: false,
            shift: false,
            alt: false,
            meta: false,
            caps: false
        });
    }
);

document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.hidden
        ) {
            updateModifierStates({
                ctrl: false,
                shift: false,
                alt: false,
                meta: false,
                caps: false
            });
        }
    }
);

renderHistory();

updateModifierStates({
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    caps: false
});

elements.eventKey.textContent =
    "—";

elements.eventCode.textContent =
    "—";

elements.eventWhich.textContent =
    "—";

elements.eventKeyCode.textContent =
    "—";

elements.mainKeyDisplay.textContent =
    "⌨";

updateCategoryBadge(
    "Printable"
);

if (
    !("clipboard" in navigator)
) {
    if (elements.copyKey) {
        elements.copyKey.disabled =
            true;
    }

    if (elements.copyCode) {
        elements.copyCode.disabled =
            true;
    }
}

window.KeyScope = {
    state,
    classifyKey,
    normalizeKey,
    clearHistory,
    renderHistory,
    updateModifiers,
    updateEventCards,
    updateKeyDisplay
};