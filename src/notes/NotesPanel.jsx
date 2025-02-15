import CloseButton from "./../assets/close.svg";
import { createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { closeNote, noteOpen, openNote, viewNote } from "../scripts/view";

export const [noteViews, setNoteViews] = createStore([]);
export const [activeNote, setActiveNote] = createSignal(-1);

export function tryOpenNote(e) {
    const label = e.target.querySelector("label");
    openNote(label.textContent);
}

export function tryCloseNote(index) {
    const active = activeNote();
    closeNote(noteViews[index].title, noteViews[index].group);
    if (index < active) {
        setActiveNote(active - 1);
        setTimeout(() => viewNote(active - 1), 0);
    }
}

function NotesPanel() {

    function handleViewKeydown(e) {
        const view = document.querySelector(".note-view");
        if (e.key === "Escape") {
            view.blur();
        }
        if (e.key == "Tab") {
            e.preventDefault();
            const start = view.selectionStart;
            const end = view.selectionEnd;
            view.value = view.value.substring(0, start) + "\t" + view.value.substring(end);
            view.selectionStart = start + 1;
            view.selectionEnd = start + 1;
        }
    }

    return (
        <div id="notes-panel">
            <div class="note-tabs">
                <For each={noteViews}>
                    {(item, index) => (
                        <div
                            class="note-tab"
                            tabIndex="-1"
                            data-index={index()}
                            onClick={() => viewNote(index())}>
                            <label>{item.title}</label>
                            <div class="note-tab-close" onClick={() => tryCloseNote(index())}>
                                <img src={CloseButton} width="15px" />
                            </div>
                        </div>
                    )}
                </For>
            </div>
            <Show when={activeNote() !== -1}>
                <textarea class="note-view" onKeyDown={handleViewKeydown} />
            </Show>
        </div>
    );
}

export default NotesPanel;