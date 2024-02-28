import { RouteComponentProps } from "react-router";
import { TaskProps } from "../../models/TaskProps";
import { ListWithTasksProps } from "../../models/ListWithTasksProps";
import { useContext, useEffect, useRef, useState } from "react";
import { IonButton, IonContent, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import Task from "../../components/tasks/Task";
import { ListWithTasksContext } from "../../core/providers/ListWithTasksProvider";
import NewTask from "../../components/tasks/NewTask";
import { add } from "ionicons/icons";
import { AuthContext } from "../../core/providers/AuthProvider";
import { NewTaskProps } from "../../models/NewTaskProps";
import { TasksContext } from "../../core/providers/TasksProvider";

interface ListContentEditProps extends RouteComponentProps <{
    id: string;
}> {}

const ListContent: React.FC<ListContentEditProps> = ({ match })  => {
    const { userId } = useContext(AuthContext);
    const { listsWithTasks, fetching, fetchingError, updatingError, fetchListWithTasks } = useContext(ListWithTasksContext);
    const { saveTask, deleteTask } = useContext(TasksContext);
    const [listWithTasks, setListWithTasks] = useState<ListWithTasksProps>();
    const [expandAddTask, setExpandAddTask] = useState<boolean>(false);
    const isFetchCalledRef = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        const currentListId = match.params.id;
        if(isFetchCalledRef.current[currentListId]){
            return;
        }

        const listIndex = listsWithTasks?.findIndex(listWithTasks => listWithTasks.list._id === currentListId);
        if(listIndex !== undefined && listIndex !== -1){
            return;
        }

        fetchListWithTasks?.(currentListId);
        isFetchCalledRef.current[currentListId] = true;
    }, [match.params.id]);

    useEffect(() => {
        const currentListId = match.params.id;
        const contextListWithTasks = listsWithTasks?.find(taskList => taskList.list._id === currentListId);
        setListWithTasks(contextListWithTasks);
    }, [listsWithTasks]);

    const handleEditTask = (task: TaskProps) => {
        const taskIndex = listWithTasks?.tasks.findIndex(t => t._id === task._id);
        if(listWithTasks === undefined || taskIndex === undefined || taskIndex === -1){
            return;
        }

        saveTask?.(task);
        const newTasks = [...listWithTasks.tasks];
        newTasks[taskIndex] = task;
        const newListWithTasks: ListWithTasksProps = {...listWithTasks, tasks: newTasks};
        setListWithTasks(newListWithTasks);
    }

    const handleDeleteTask = (id?: string) => {
        if(id === undefined){
            return;
        }
        
        const taskToDelIndex = listWithTasks?.tasks.findIndex(task => task._id === id);
        if(listWithTasks === undefined || taskToDelIndex === undefined || taskToDelIndex === -1){
            return;
        }
        
        deleteTask?.(id);
        const newTasks = [...listWithTasks.tasks];
        newTasks.splice(taskToDelIndex, 1);
        const newListWithTasks: ListWithTasksProps = {...listWithTasks, tasks: newTasks};
        setListWithTasks(newListWithTasks);
    }

    const handleSaveNewTask = (newTask: NewTaskProps) => {
        const currentListId = match.params.id;
        const taskToSave: TaskProps = {
            userId: userId,
            taskText: newTask.taskText,
            status: newTask.taskStatus,
            deadline: newTask.taskDeadline,
            listId: currentListId
        };

        saveTask?.(taskToSave);
        setExpandAddTask(false);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{listWithTasks?.list.listName}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching}/>
                {
                    expandAddTask === false && (
                        <IonButton 
                            shape="round" 
                            color="tertiary" 
                            onClick={e => setExpandAddTask(true)}
                        >
                            <IonIcon 
                                icon={add} 
                                slot="start"> 
                            </IonIcon>
                            Add task
                        </IonButton>
                    )
                }
                {
                    expandAddTask === true && (
                        <NewTask onSave={handleSaveNewTask}/>
                    )
                }
                {
                    updatingError && (
                        <div className="error-text">Failed to update the list. Try again!</div>
                    )
                }
                {
                    fetchingError && (
                        <div className="error-text">Failed to get the tasks associated with this list. Try again!</div>
                    )
                }
                {
                    listWithTasks && (
                        <IonList>
                            {
                                listWithTasks.tasks.map(({_id, taskText, deadline, status, userId, listId}) =>
                                <Task 
                                    key={_id}
                                    _id={_id} 
                                    taskText={taskText} 
                                    deadline={deadline}
                                    status={status} 
                                    userId={userId} 
                                    listId={listId} 
                                    onEdit={handleEditTask} 
                                    onDelete={handleDeleteTask}>
                                </Task> 
                                )
                            }
                        </IonList>
                    )
                }
            </IonContent>
        </IonPage>
    )
}

export default ListContent;