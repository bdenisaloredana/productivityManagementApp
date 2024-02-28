import { IonButton, IonIcon, IonInput } from "@ionic/react";
import { add } from "ionicons/icons";
import { useState } from "react"
import "../../pages/App.css"

interface NewListPropsComponent {
    onSave: (newListName: string) => void
}

const NewList: React.FC<NewListPropsComponent> = ({ onSave }) => {
    const [listName, setListName] = useState<string>('');

    const handleSave = () => {
        onSave(listName);
    }

    return (
        <div className="custom-div">
            <IonInput 
                placeholder="Enter list name"
                value={listName} 
                onIonInput={e => setListName(e.detail.value || '')}>
            </IonInput>
            <br></br>
            <IonButton 
                shape="round" 
                color="tertiary" 
                disabled={!listName.trim()}
                onClick={handleSave}
            >
                <IonIcon icon={add}/>
            </IonButton>
        </div>
    )
}

export default NewList;