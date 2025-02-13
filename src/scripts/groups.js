import { invoke } from "@tauri-apps/api/core";
import { groups, setGroups } from "../notes/GroupPanel";

export const groupRegex = /^(?!^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$)[^<>:"/\\|?*\r\n]+[^<>:"/\\|?*.\r\n]$/;

export async function fetchGroups() {
    let groups;
    await invoke("fetch_groups")
    .then(ok => {
        groups = JSON.parse(ok);
    })
    .catch(err => {
        console.error(err);
    });
    return groups;
}

export async function hasGroup(groupName) {
    let exists;
    await invoke("has_group", {
        groupName: groupName
    })
    .then(ok => {
        exists = ok;
    })
    .catch(err => {
        console.error(err);
    });
    return exists;
}

export async function createGroup(groupName) {
    if (groupRegex.test(groupName)) {
        await invoke("create_group", {
            groupName: groupName
        })
        .then(ok => {
            setGroups([...groups, groupName])
        })
        .catch(err => {
            console.error(err);
        });
    }
}

export async function deleteGroup(groupName) {
    await invoke("delete_group", {
        groupName: groupName
    })
    .then(ok => {
        setGroups(groups.filter(group => group !== groupName));
    })
    .catch(err => {
        console.error(err);
    })
}