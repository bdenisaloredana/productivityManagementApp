import { IonButtons, IonContent, IonHeader, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { TaskProps } from "../../models/TaskProps";
import { AuthContext } from "../../core/providers/AuthProvider";
import { TasksContext } from "../../core/providers/TasksProvider";
import Task from "../../components/tasks/Task";
import "../App.css"
import NewTask from "../../components/tasks/NewTask";
import { NewTaskProps } from "../../models/NewTaskProps";

const Home: React.FC = () => {
    const { userId } = useContext(AuthContext);
    const { tasks, savingError, saveTask, deleteTask } = useContext(TasksContext);
    const [tasksForChosenDate, setTasksForChosenDate] = useState<TaskProps[]>([]);
    const [newTask, setNewTask] = useState<NewTaskProps>();

    useEffect(() => {
        if(newTask === undefined){
            return;
        }

        const chosenDate = newTask.taskDeadline.slice(0, 10);
        const filteredTasks = tasks?.filter(task => task.deadline.slice(0,10) === chosenDate) || [];
        setTasksForChosenDate(filteredTasks);
    }, [tasks, newTask]);

    const handleEditTask = (task: TaskProps) => {
        const editedTaskIndex = tasksForChosenDate?.findIndex(t => t._id === task._id);
        if(tasksForChosenDate === undefined || editedTaskIndex === undefined || editedTaskIndex === -1){
            return;
        }
         
        saveTask?.(task);
        const newTasksForChosenDate = [...tasksForChosenDate];
        newTasksForChosenDate[editedTaskIndex] = task;
        setTasksForChosenDate(newTasksForChosenDate);
    }

    const handleDeleteTask = (id?: string) => {
        if(id === undefined){
            return;
        }
        
        const taskToDelIndex = tasksForChosenDate?.findIndex(task => task._id === id);
        if(tasksForChosenDate === undefined || taskToDelIndex === undefined || taskToDelIndex === -1){
            return;
        }
        
        deleteTask?.(id);
        const newTasksForChosenDate = [...tasksForChosenDate];
        newTasksForChosenDate.splice(taskToDelIndex, 1);
        setTasksForChosenDate(newTasksForChosenDate);
    }

    const handleEditNewTask = (updatedNewTask: NewTaskProps) => {
        setNewTask(updatedNewTask);
    }

    const handleSaveNewTask = (newTask: NewTaskProps) => {
        const taskToSave: TaskProps = {
            deadline: newTask.taskDeadline, 
            taskText: newTask.taskText, 
            status: newTask.taskStatus, 
            userId: userId
        }

        saveTask?.(taskToSave);
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            <div className="custom-div">
                <br></br>
                <IonLabel className="custom-ion-label">Create a new task</IonLabel>
                <br></br>
                <br></br>
                <NewTask 
                    onEdit={handleEditNewTask} 
                    onSave={handleSaveNewTask}>
                </NewTask>
                {
                    savingError && (
                        <div className="error-text">Failed to save the new task. Try again!</div>
                    )
                }
          </div>
          <br></br>
          <div>
            <IonLabel className="custom-ion-label">Tasks</IonLabel>
            {
                tasksForChosenDate && (
                    <IonList>
                        {
                            tasksForChosenDate.map(({_id, taskText, deadline, status, userId, listId}) =>
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
  
  export default Home;
  