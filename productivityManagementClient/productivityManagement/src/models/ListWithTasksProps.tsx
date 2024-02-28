import { ListProps } from "./ListProps";
import { TaskProps } from "./TaskProps";

export interface ListWithTasksProps {
    list: ListProps;
    tasks: TaskProps[];
}