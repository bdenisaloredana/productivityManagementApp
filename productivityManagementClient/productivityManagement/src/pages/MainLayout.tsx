import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";
import PropTypes from 'prop-types';
import { alarmOutline, home, listCircleOutline, logOut } from "ionicons/icons";
import { useCookies } from "../core/hooks/useCookies";
import { withRouter } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../core";

interface MainLayoutProps{
    children: PropTypes.ReactNodeLike
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { removeCookieAuthData } = useCookies();
    const { clearAuthData } = useContext(AuthContext);

    const handleLogout = () => {
      removeCookieAuthData();
      clearAuthData?.();
    }

    return (
      <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonMenuToggle auto-hide="false">
              <IonItem routerLink="/home">
                <IonIcon icon={home} slot="start" />
                <IonLabel>Home</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle auto-hide="false">
              <IonItem routerLink="/my-lists">
                <IonIcon icon={listCircleOutline} slot="start" />
                <IonLabel>My lists</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle auto-hide="false">
              <IonItem routerLink="/overdue-tasks">
                <IonIcon icon={alarmOutline} slot="start" />
                <IonLabel>Overdue tasks</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle auto-hide="false">
              <IonButton 
                routerLink="/login" 
                onClick={handleLogout}
                expand="full"
              >
                <IonIcon 
                  icon={logOut} 
                  slot="start">
                </IonIcon>
                Logout
              </IonButton>
            </IonMenuToggle>
        </IonContent>
      </IonMenu>
      <IonContent id="main-content">
        {children}
      </IonContent>
    </>
  );
  };
  
  export default MainLayout;
  