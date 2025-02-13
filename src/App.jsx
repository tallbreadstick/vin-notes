import GroupPanel, { currentGroup, openGroupPrompt, openNotePrompt, setGroup, tryDeleteGroup, tryDeleteNote } from "./notes/GroupPanel";
import WindowToolbar from "./WindowToolbar";
import "./dashboard.css";
import "./menus.css";
import Prompt from "./menus/Prompt";
import { onCleanup, onMount } from "solid-js";

function App() {

    function handleKeyEvents(e) {
        switch (e.key.toLowerCase()) {
            case 'g':
                if (e.ctrlKey) {
                    openGroupPrompt();
                    e.preventDefaults();
                }
                break;
            case 'n':
                if (e.ctrlKey && currentGroup() !== "") {
                    openNotePrompt();
                    e.preventDefaults();
                }
                break;
            case 'delete':
                const focused = document.activeElement;
                if (focused.classList.contains("group")) {
                    tryDeleteGroup(focused.querySelector("label").textContent);
                }
                if (focused.classList.contains("note")) {
                    tryDeleteNote(focused.querySelector("label").textContent);
                }
                break;
            case 'enter':
                if (currentGroup() === "") {
                    document.querySelector(".group").focus();
                } else {
                    document.querySelector(".note").focus();
                }
                break;
            case 'backspace':
                if (e.ctrlKey) {
                    setGroup("");
                }
                break;
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeyEvents);
    });

    onCleanup(() => {
        window.removeEventListener("keydown", handleKeyEvents);
    })

    return (
        <main id="app">
            <WindowToolbar />
            <div id="dashboard">
                <GroupPanel />
            </div>
        </main>
    );
}

export default App;
