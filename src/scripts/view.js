import { invoke } from "@tauri-apps/api/core";
import { currentGroup } from "../notes/GroupPanel";
import { activeNote, noteViews, setActiveNote, setNoteViews } from "../notes/NotesPanel";

export async function openNote(noteName) {
    await invoke("open_note", {
        groupName: currentGroup(),
        noteName: noteName
    })
    .then(ok => {
        if (!noteOpen(noteName, currentGroup())) {
            setNoteViews([...noteViews, { title: noteName, group: currentGroup(), saved: true, content: ok }]);
            viewNote(noteViews.length - 1);
        } else {
            viewNote(noteViews.findIndex(note => note.title === noteName && note.group === currentGroup()));
        }
        const view = document.querySelector(".note-view");
        view.focus();
    })
    .catch(err => {
        console.error(err);
    });
}

export function noteOpen(noteName, groupName) {
    return noteViews.some(note => note.title === noteName && note.group === groupName);
}

export function viewNote(index) {
    if (index >= 0 && index < noteViews.length) {
        setActiveNote(index);
        const view = document.querySelector(".note-view");
        view.value = noteViews[index].content;
        const views = [...document.querySelectorAll(".note-tab")];
        views.forEach((item, i) => {
            if (index === i) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }
}

export function closeNote(noteName, groupName) {
    setNoteViews(noteViews.filter(note => !(note.title === noteName && note.group === groupName)));
    setTimeout(() => {
        if (noteViews.length === 0) {
            setActiveNote(-1);
        }
    }, 0);
}

export async function saveNote() {
    if (activeNote() !== -1) {
        const view = document.querySelector(".note-view");
        const noteView = noteViews[activeNote()];
        setNoteViews(activeNote(), "content", view.value);
        await invoke("save_note", {
            groupName: noteView.group,
            noteName: noteView.title,
            contents: noteView.content
        })
        .then(ok => {
            // toast: note saved succesfully!
            console.log("note saved!");
        })
        .catch(err => {
            console.error(err);
        });
    }
}