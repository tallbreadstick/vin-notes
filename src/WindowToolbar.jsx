import MinButton from "./assets/minimize.svg";
import MaxButton from "./assets/maximize.svg";
import UnmaxButton from "./assets/unmaximize.svg";
import CloseButton from "./assets/close.svg";
import { createSignal, onMount } from "solid-js";
import { getCurrentWindow } from "@tauri-apps/api/window";

function WindowToolbar() {

    const [isMaximized, setMaximized] = createSignal(false);

    getCurrentWindow().onResized(async () => {
        setMaximized(await getCurrentWindow().isMaximized());
    });

    function toggleMinMax() {
        console.log(isMaximized());
        if (isMaximized()) {
            getCurrentWindow().unmaximize();
        } else {
            getCurrentWindow().maximize();
        }
    }

    onMount(() => {
        getCurrentWindow().isMaximized()
        .then(ok => {
            setMaximized(ok);
        })
        .catch(err => {
            console.error(err);
        })
    });

    return (
        <div data-tauri-drag-region id="window-toolbar">
            <label>VinNotes™</label>
            <div class="window-button" onClick={getCurrentWindow().minimize}>
                <img src={MinButton} height="15px" />
            </div>
            <div class="window-button" onClick={toggleMinMax}>
                <img src={isMaximized() ? UnmaxButton : MaxButton} height="15px" />
            </div>
            <div class="window-button" onClick={getCurrentWindow().close}>
                <img src={CloseButton} height="15px" />
            </div>
        </div>
    );
}

export default WindowToolbar;