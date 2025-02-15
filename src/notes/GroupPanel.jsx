import AddButton from "./../assets/add.svg";
import BackButton from "./../assets/prev-page.svg";
import { createStore } from "solid-js/store";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { render } from "solid-js/web";
import { createGroup, deleteGroup, fetchGroups, regex, hasGroup } from "./../scripts/groups";
import Prompt from "../menus/Prompt";
import { spawnContext } from "../menus/ContextMenu";
import Confirm from "../menus/Confirm";
import Selection from "../menus/Selection";
import { createNote, deleteNote, fetchNotes, hasNote } from "../scripts/notes";
import { tryOpenNote } from "./NotesPanel";

export const [groups, setGroups] = createStore([]);
export const [notes, setNotes] = createStore([]);

export const [prompting, setPrompting] = createSignal(false);
export const [currentGroup, setGroup] = createSignal("");

async function validateGroupName(e) {
    if (regex.test(e.target.value) && !(await hasGroup(e.target.value))) {
        e.target.classList.remove("invalid");
    } else {
        e.target.classList.add("invalid");
    }
}

async function validateNoteName(e) {
    if (regex.test(e.target.value) && !(await hasNote(e.target.value))) {
        e.target.classList.remove("invalid");
    } else {
        e.target.classList.add("invalid");
    }
}

export function openGroupPrompt() {
    if (!prompting()) {
        setPrompting(true);
        render(() => (
            <Prompt
                title="Group Name"
                type="text"
                placeholder="Enter a name..."
                button="Create"
                onClick={createGroup}
                onClose={closePrompt}
                onInput={validateGroupName} />
        ), document.getElementById("dashboard"));
    }
}

export function openNotePrompt() {
    if (!prompting()) {
        setPrompting(true);
        render(() => (
            <Selection
                title="Create New Item"
                placeholder="Enter a name..."
                button="Create"
                options={["Note", "Todo"]}
                onClick={createNote}
                onClose={closePrompt}
                onInput={validateNoteName} />
        ), document.getElementById("dashboard"));
    }
}

function closePrompt() {
    setPrompting(false);
}

export function tryDeleteGroup(group) {
    if (!prompting()) {
        setPrompting(true);
        render(() => (
            <Confirm
                title={`Delete Group "${group}"?`}
                onClose={closePrompt}
                onConfirm={() => deleteGroup(group)} />
        ), document.getElementById("dashboard"));
    }
}

export function tryDeleteNote(note) {
    if (!prompting()) {
        setPrompting(true);
        render(() => (
            <Confirm
                title={`Delete Note "${note}"?`}
                onClose={closePrompt}
                onConfirm={() => deleteNote(note)} />
        ), document.getElementById("dashboard"));
    }
}

async function openGroup(e) {
    const label = e.target.querySelector("label");
    setGroup(label.textContent);
    setNotes([]);
    setNotes(await fetchNotes());
}

function exitGroup() {
    setGroup("");
}

function GroupPanel() {

    function openGroupContext(e) {
        const label = e.target.querySelector("label");
        spawnContext(e, (
            <>
                <label>Rename Group</label>
                <label onClick={() => tryDeleteGroup(label.textContent)}>Delete Group</label>
            </>
        ));
    }

    function openNoteContext(e) {
        const label = e.target.querySelector("label");
        spawnContext(e, (
            <>
                <label>Rename Note</label>
                <label onClick={() => tryDeleteNote(label.textContent)}>Delete Note</label>
            </>
        ));
    }

    function focus(e) {
        e.target.focus();
    }

    function handleGroupFocusKeys(e) {
        const groupElems = [...document.querySelectorAll(".group")];
        const index = parseInt(e.target.dataset.index);
        switch (e.key) {
            case 'ArrowUp':
                if (index - 1 >= 0) {
                    groupElems[index - 1].focus();
                }
                break;
            case 'ArrowDown':
                if (index + 1 < groupElems.length) {
                    groupElems[index + 1].focus();
                }
                break;
            case 'Escape':
                document.activeElement.blur();
                break;
            case 'Enter':
                openGroup(e);
                break;
        }
    }

    function handleNoteFocusKeys(e) {
        const noteElems = [...document.querySelectorAll(".note")];
        const index = parseInt(e.target.dataset.index);
        switch (e.key) {
            case 'ArrowUp':
                if (index - 1 >= 0) {
                    noteElems[index - 1].focus();
                }
                break;
            case 'ArrowDown':
                if (index + 1 < noteElems.length) {
                    noteElems[index + 1].focus();
                }
                break;
            case 'Escape':
                document.activeElement.blur();
                break;
            case 'Enter':
                // todo!
                tryOpenNote(e);
                break;
        }
    }

    onMount(async () => {
        setGroups(await fetchGroups());
    });

    return (
        <div id="group-panel">
            <Switch>
                <Match when={currentGroup() === ""}>
                    <div class="groups-header">
                        <label>Groups</label>
                        <div class="add-group" onClick={openGroupPrompt}>
                            <img src={AddButton} width="20px" />
                        </div>
                    </div>
                    <div class="groups-body">
                        <For each={groups}>
                            {(item, index) => (
                                <div
                                    class="group"
                                    tabIndex="-1"
                                    data-index={index()}
                                    onClick={focus}
                                    onDblClick={openGroup}
                                    onKeyDown={handleGroupFocusKeys}
                                    onContextMenu={openGroupContext}>
                                    <label>{item}</label>
                                </div>
                            )}
                        </For>
                    </div>
                </Match>
                <Match when={!currentGroup() !== ""}>
                    <div class="notes-header">
                        <div class="exit-group" onClick={exitGroup}>
                            <img src={BackButton} width="20px" />
                        </div>
                        <label>{currentGroup()}</label>
                        <div class="add-note" onClick={openNotePrompt}>
                            <img src={AddButton} width="20px" />
                        </div>
                    </div>
                    <div class="notes-body">
                        <For each={notes}>
                            {(item, index) => (
                                <div
                                    class="note"
                                    tabIndex="-1"
                                    data-index={index()}
                                    onClick={focus}
                                    onDblClick={tryOpenNote}
                                    onKeyDown={handleNoteFocusKeys}
                                    onContextMenu={openNoteContext}>
                                    <label>{item}</label>
                                </div>
                            )}
                        </For>
                    </div>
                </Match>
            </Switch>

        </div>
    )
}

export default GroupPanel;