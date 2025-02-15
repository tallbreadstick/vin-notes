import { createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { noteOpen, openNote } from "../scripts/view";

export const [noteViews, setNoteViews] = createStore([]);
export const [activeNote, setActiveNote] = createSignal(-1);

export function tryOpenNote(e) {
    const label = e.target.querySelector("label");
    openNote(label.textContent);
}

function NotesPanel() {

    onMount(() => {

    });

    onCleanup(() => {

    });

    return (
        <div id="notes-panel">
            <div class="note-tabs">
                <For each={noteViews}>
                    {(item, index) => (
                        <div
                            class="note-tab"
                            tabIndex="-1"
                            data-index={index()}>
                            <label>{item.title}</label>
                        </div>
                    )}
                </For>
            </div>
            <Show when={activeNote() !== -1}>
                <textarea class="note-view" />
            </Show>
        </div>
    );
}

export default NotesPanel;