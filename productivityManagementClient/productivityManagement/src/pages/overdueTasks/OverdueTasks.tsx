import { IonButtons, IonContent, IonHeader, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { TaskStatus, TaskProps } from "../../models/TaskProps";
import { TasksContext } from "../../core/providers/TasksProvider";
import Task from "../../components/tasks/Task";
import "../App.css"


const OverdueTasks: React.FC = () => {
    const { tasks, saveTask, deleteTask } = useContext(TasksContext);
    const [overdueTasks, setOverdueTasks] = useState<TaskProps[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const filteredTasks = tasks?.filter(task => new Date(task.deadline) < currentDate && task.status !== TaskStatus.Done)
        .sort((task1, task2) => new Date(task1.deadline).getTime() - new Date(task2.deadline).getTime()) || [];

        setOverdueTasks(filteredTasks);
    }, [tasks]);

    const handleEditTask = (task: TaskProps) => {
        const editedTaskIndex = overdueTasks?.findIndex(t => t._id === task._id);

        if(overdueTasks === undefined || editedTaskIndex === undefined || editedTaskIndex === -1){
            return;
        }

        saveTask?.(task);
        const updatedOverdueTasks = [...overdueTasks];
        updatedOverdueTasks[editedTaskIndex] = task;
        setOverdueTasks(updatedOverdueTasks);
    }

    const handleDeleteTask = (id?: string) => {
        if(id === undefined){
            return;
        }

        const taskToDelIndex = overdueTasks?.findIndex(task => task._id === id);
        if(overdueTasks === undefined || taskToDelIndex === undefined || taskToDelIndex === -1){
            return;
        }
        
        deleteTask?.(id);
        const updatedOverdueTasks = [...overdueTasks];
        updatedOverdueTasks.splice(taskToDelIndex, 1);
        setOverdueTasks(updatedOverdueTasks);
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton/>
            </IonButtons>
            <IonTitle>Overdue tasks</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <br></br>
          <div>
            {
                overdueTasks && (
                    <IonList>
                        {
                            overdueTasks.map(({_id, taskText, deadline, status, userId, listId}) =>
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
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default OverdueTasks;