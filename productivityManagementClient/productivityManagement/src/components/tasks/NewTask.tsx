import { IonButton, IonDatetime, IonIcon, IonInput, IonSelect, IonSelectOption } from "@ionic/react";
import { TaskStatus } from "../../models/TaskProps";
import { add } from 'ionicons/icons';
import { useEffect, useState } from "react";
import { NewTaskProps } from "../../models/NewTaskProps";

export interface NewTaskPropsComponent{
    onEdit?: (newTask: NewTaskProps) => void
    onSave: (newTask: NewTaskProps) => void
}

const NewTask: React.FC<NewTaskPropsComponent> = ({ onEdit, onSave }) => {
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [time, setTime] = useState<string>(new Date().toISOString().slice(11, 19));
    const [taskText, setTaskText] = useState<string>('');
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.New);

    useEffect(() => handleOnEdit(), [date]);

    const handleOnEdit = () => {
        const updatedNewTask: NewTaskProps = {
            taskText: taskText, 
            taskStatus: taskStatus, 
            taskDeadline: `${date}T${time}.000Z`
        };

        onEdit?.(updatedNewTask);
    }

    const handleOnSave = () => {
        const newTask: NewTaskProps = {
            taskText: taskText, 
            taskStatus: taskStatus, 
            taskDeadline: `${date}T${time}.000Z`
        }

        onSave(newTask);
        setTaskText('');
        setTaskStatus(TaskStatus.New);
    }

    const handleDateTimeChange = (e: any) => {
        const updatedValue = e.detail.value;
        const [updatedDate, updatedTime] = updatedValue.split('T');

        setDate(updatedDate);
        setTime(updatedTime);
    }

    return (
        <>
        <IonDatetime
            title="Select Date and Time"
            value={date + 'T' + time}
            onIonChange={handleDateTimeChange}>
        </IonDatetime>
        <br></br>
        <IonInput 
            placeholder="Write task"
            value={taskText}
            onIonInput={e => setTaskText(e.detail.value || '')}>
        </IonInput>
        <IonSelect 
            value={taskStatus} 
            onIonChange={e=> setTaskStatus(e.detail.value)}
        >
            <IonSelectOption value="New">New</IonSelectOption>
            <IonSelectOption value="In progress">In progress</IonSelectOption>
            <IonSelectOption value="Done">Done</IonSelectOption>
        </IonSelect>
        <br></br>
        <IonButton 
            color="tertiary" 
            size="small" 
            shape="round" 
            disabled={!taskText.trim()}
            onClick={handleOnSave}
        >
            <IonIcon 
                icon={add} 
                slot="start">
            </IonIcon>
            Add task
        </IonButton>
    </>
    )
  };
  
  export default NewTask;