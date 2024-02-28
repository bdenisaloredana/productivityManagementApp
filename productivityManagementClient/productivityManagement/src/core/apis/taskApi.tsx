import axios from "axios";
import { authConfig, withLogs } from "..";
import { TaskProps } from "../../models/TaskProps";

const taskUrl = `http://localhost:3000/api/task`;

export const getTasksForUserApi: (token: string) => Promise<TaskProps[]> = (token) => {
    return withLogs(axios.get(taskUrl, authConfig(token)), "getTasksForUserApi");
}

export const deteteTaskApi: (taskId: string, token: string) => Promise<void> = (taskId, token) => {
    return withLogs(axios.delete(`${taskUrl}/${taskId}`, authConfig(token)), "deleteTaskApi");
}

export const createTaskApi: (task: TaskProps, token: string) => Promise<TaskProps> = (task, token) => {
    return withLogs(axios.post(taskUrl, task, authConfig(token)), "createTaskApi");
}

export const updateTaskApi: (task: TaskProps, token: string) => Promise<TaskProps> = (task, token) => {
    return withLogs(axios.put(`${taskUrl}/${task._id}`, task, authConfig(token)), "updateTaskApi");
}