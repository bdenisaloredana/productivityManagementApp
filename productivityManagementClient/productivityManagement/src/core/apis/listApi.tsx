import axios from "axios";
import { authConfig, withLogs } from "..";
import { ListProps } from "../../models/ListProps";
import { ListWithTasksProps } from "../../models/ListWithTasksProps";

const listUrl = `http://localhost:3000/api/list`;

export const getListsForUserApi: (token: string) => Promise<ListProps[]> = (token) => {
    return withLogs(axios.get(listUrl, authConfig(token)), "getListsForUserApi");
}

export const createListApi: (list: ListProps, token: string) => Promise<ListProps> = (list, token) => {
    return withLogs(axios.post(listUrl, list, authConfig(token)), "createListApi");
}

export const getListWithTasksApi: (token: string, listId?: string) => Promise<ListWithTasksProps> = (token, listId) => {
    return withLogs(axios.get(`${listUrl}/tasks/${listId}`, authConfig(token)), "getListWithTasksApi");
}

export const deleteListApi: (listId: string, token: string) => Promise<void> = (listId, token) => {
    return withLogs(axios.delete(`${listUrl}/${listId}`, authConfig(token)), "deleteListApi");
}