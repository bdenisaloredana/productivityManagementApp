import { TaskStatus } from "./TaskProps";

export interface NewTaskProps {
    taskText: string;
    taskStatus: TaskStatus;
    taskDeadline: string;
}