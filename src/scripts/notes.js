import { invoke } from "@tauri-apps/api/core";
import { currentGroup, notes, setNotes } from "../notes/GroupPanel";
import { closeNote, openNote } from "./view";

export async function fetchNotes() {
    let notes;
    await invoke("fetch_notes", {
        groupName: currentGroup()
    })
    .then(ok => {
        notes = JSON.parse(ok);
    })
    .catch(err => {
        console.error(err);
    });
    return notes;
}

export async function hasNote(noteName) {
    let exists;
    await invoke("has_note", {
        groupName: currentGroup(),
        noteName: noteName
    })
    .then(ok => {
        exists = ok;
    })
    .catch(err => {
        console.error(err);
    });
    return exists;
}

export async function createNote(noteName) {
    await invoke("create_note", {
        groupName: currentGroup(),
        noteName: noteName
    })
    .then(ok => {
        setNotes([...notes, noteName]);
    })
    .catch(err => {
        console.error(err);
    });
}

export async function deleteNote(noteName) {
    await invoke("delete_note", {
        groupName: currentGroup(),
        noteName: noteName
    })
    .then(ok => {
        setNotes(notes.filter(note => note !== noteName));
        if (openNote(noteName)) {
            closeNote(noteName);
        }
    })
    .catch(err => {
        console.error(err);
    });
}