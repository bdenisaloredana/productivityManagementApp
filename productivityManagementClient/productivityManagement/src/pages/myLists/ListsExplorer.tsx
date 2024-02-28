import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { ListsContext } from '../../core/providers/ListsProvider';
import List from '../../components/lists/List';
import NewList from '../../components/lists/NewList';
import { ListProps } from '../../models/ListProps';
import { AuthContext } from '../../core/providers/AuthProvider';
import "./ListsExplorer.css"
import "../App.css"

const ListsExplorer: React.FC<RouteComponentProps> = ({ history }) => {
  const { lists, fetching, fetchingError, savingError, deletingError, createList, deleteList } = useContext(ListsContext);
  const { userId } = useContext(AuthContext);  
  const [expandAddList, setExpandAddList] = useState<boolean>(false);

  const handleSaveNewList = (newListName: string) => {
    const newList: ListProps = {
      listName: newListName,
      userId: userId
    };
    
    createList?.(newList);
    setExpandAddList(false);
  }

  const handleDeleteList = (listId?: string) => {
    if(listId === undefined){
      return;
    }

    const toDelListIndex = lists?.findIndex(list => list._id === listId);
    if(lists === undefined || toDelListIndex === undefined || toDelListIndex === -1){
      return;
    }

    deleteList?.(listId);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton/>
          </IonButtons>
          <IonTitle>My lists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching lists"/>
        {
          expandAddList === false && (
            <div className='ion-padding'>
              <IonButton 
                shape='round'
                color="tertiary" 
                onClick={e => setExpandAddList(true)}
              >
                  <IonIcon 
                    icon={add} 
                    slot='start'>
                  </IonIcon>
                Add list
              </IonButton>
            </div>
            )
        }
        {
          expandAddList === true && (
            <NewList onSave={handleSaveNewList}/>
          )
        }
        {
          savingError && (
            <div className="error-text">Failed to save the new list. Try again!</div>
          )
        }
        {
          lists && (
            <IonList className='lists-container'>
              {
                lists.map(({ _id, listName, userId }) =>
                  <List 
                    key={_id} 
                    _id={_id} 
                    userId={userId} 
                    listName={listName} 
                    onClick={id => history.push(`/list/${id}`)}
                    onDelete={handleDeleteList}>
                  </List>
                )
              }
            </IonList>
          )
        }
        {
          deletingError && (
            <div className="error-text">Failed to delete the list. Try again!</div>
          )
        }
        {
          fetchingError && (
            <div className="error-text">Failed to fetch lists. Try again!</div>
          )
        }
      </IonContent>
    </IonPage>
  );
};

export default ListsExplorer;