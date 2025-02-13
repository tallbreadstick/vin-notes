import GroupPanel, { openGroupPrompt } from "./notes/GroupPanel";
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
