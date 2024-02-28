export enum TaskStatus{
    New = "New", 
    InProggres = "In progress", 
    Done = "Done"
}

export interface TaskProps {
    _id?: string;
    taskText: string;
    deadline: string;
    status: TaskStatus;
    userId: string;
    listId?: string;
}