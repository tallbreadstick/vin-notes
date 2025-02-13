import AddButton from "./../assets/add.svg";
import BackButton from "./../assets/prev-page.svg";
import { createStore } from "solid-js/store";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { render } from "solid-js/web";
import { createGroup, deleteGroup, fetchGroups, groupRegex, hasGroup } from "./../scripts/groups";
import Prompt from "../menus/Prompt";
import { spawnContext } from "../menus/ContextMenu";
import Confirm from "../menus/Confirm";
import Selection from "../menus/Selection";

export const [groups, setGroups] = createStore([]);
export const [notes, setNotes] = createStore([]);

export const [prompting, setPrompting] = createSignal(false);
export const [currentGroup, setGroup] = createSignal("");

async function validateName(e) {
    if (groupRegex.test(e.target.value) && !(await hasGroup(e.target.value))) {
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
                onInput={validateName} />
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
                onClick
                onClose={closePrompt} />
        ), document.getElementById("dashboard"));
    }
}

function closePrompt() {
    setPrompting(false);
}

function tryDelete(group) {
    if (!prompting()) {
        setPrompting(true);
        render(() => (
            <Confirm
                title={`Delete "${group}"?`}
                onClose={closePrompt}
                onConfirm={() => deleteGroup(group)} />
        ), document.getElementById("dashboard"));
    }
}

function openGroup(e) {
    const label = e.target.querySelector("label");
    setGroup(label.textContent);
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
                <label onClick={() => tryDelete(label.textContent)}>Delete Group</label>
            </>
        ));
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
                                <div onClick={openGroup} class="group" onContextMenu={openGroupContext}>
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
                                <div class="note">
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