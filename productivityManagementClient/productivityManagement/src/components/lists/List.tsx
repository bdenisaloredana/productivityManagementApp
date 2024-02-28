import { IonButton, IonCard, IonCardContent, IonIcon, IonLabel } from "@ionic/react";
import { ListProps } from "../../models/ListProps";
import "./List.css"
import { trashOutline } from "ionicons/icons";

interface ListPropsExt extends ListProps {
    onClick: (id?: string) => void
    onDelete: (id?: string) => void
}

const List: React.FC<ListPropsExt> = ({ _id, listName, onClick, onDelete }) => {
    const handleOnClick = () => onClick(_id);
    const handleOnDelete = (e: any) => {
        e.stopPropagation();
        onDelete(_id);
    }

    return (
        <IonCard 
            className="list-card" 
            onClick={handleOnClick}
        >
            <IonCardContent className="list-card-content">
                <IonLabel className="list-name-label">{listName}</IonLabel>
                <br></br>
                <IonButton 
                    onClick={handleOnDelete} 
                    size="small" 
                    color="tertiary"
                >
                    <IonIcon icon={trashOutline}/>
                </IonButton>
            </IonCardContent>
        </IonCard>
    )
}

export default List;