import { IonButton, IonDatetime, IonDatetimeButton, IonIcon, IonInput, IonItem, IonModal, IonSelect, IonSelectOption } from "@ionic/react";
import { TaskStatus, TaskProps } from "../../models/TaskProps";
import {closeOutline} from 'ionicons/icons';
import { useState } from "react";
import "./Task.css"

interface TaskPropsExt extends TaskProps {
    onEdit: (task: TaskProps) => void
    onDelete: (id?: string) => void
}

const Task: React.FC<TaskPropsExt> = ({ _id, taskText, deadline, status, listId, userId, onEdit, onDelete }) => {
    const [textProp, setTextProp] = useState<string>(taskText || '');
    const [deadlineProp, setDeadlineProp] = useState<string>(deadline || new Date().toISOString());
    const [statusProp, setStatusProp] = useState<TaskStatus>(status || TaskStatus.New);
    const [prevText, setPrevText] = useState<string>(taskText || '');
    const [prevDeadline, setPrevDeadline] = useState<string>(deadline || new Date().toISOString());
    const [prevStatus, setPrevStatus] = useState<TaskStatus>(status || TaskStatus.New);

    const handleOnEdit = () => {
        if(textProp === ''){
            setTextProp(taskText);
            return;
        }

        if (textProp !== prevText || deadlineProp !== prevDeadline || statusProp !== prevStatus) {
            const updatedTask: TaskProps = {
                _id: _id,
                taskText: textProp,
                deadline: deadlineProp,
                status: statusProp,
                userId: userId,
                listId: listId
            };

            onEdit(updatedTask);
            setPrevText(textProp);
            setPrevDeadline(deadlineProp);
            setPrevStatus(statusProp);
        }
    };

    const handleOnDelete = () => {
        onDelete(_id);
    };

    const handleDeadlineChange = (e: any) => {
        setDeadlineProp(e.detail.value);
    }

    return (
            <IonItem 
                className={statusProp === TaskStatus.Done ? "faded-item" : ""}
                onChange={handleOnEdit}
            >
                    <IonInput
                        className={statusProp === TaskStatus.Done ? "crossed-out" : ""}
                        value={textProp} 
                        onIonInput={e => setTextProp(e.detail.value?.trim() || '')}
                        onBlur={handleOnEdit}>
                    </IonInput>
                    <IonDatetimeButton datetime={`datetime-${_id}`}></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime 
                            value={deadlineProp} 
                            showDefaultButtons={true}
                            onIonChange={handleDeadlineChange}
                            onIonBlur={handleOnEdit}
                            id={`datetime-${_id}`}>
                        </IonDatetime>
                    </IonModal>
                    <IonSelect
                        className="ion-padding"
                        value={statusProp}
                        onIonChange={e => setStatusProp(e.detail.value)}
                        onIonDismiss={handleOnEdit}
                    >
                        <IonSelectOption value="New">New</IonSelectOption>
                        <IonSelectOption value="In progress">In progress</IonSelectOption>
                        <IonSelectOption value="Done">Done</IonSelectOption>
                    </IonSelect>
                    <IonButton 
                        color="tertiary" 
                        onClick={handleOnDelete}
                    >
                        <IonIcon icon={closeOutline}/>
                    </IonButton>
            </IonItem>
    )
  };
  
  export default Task;