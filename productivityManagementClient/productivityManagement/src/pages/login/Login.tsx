import React, { useCallback, useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../../core/providers/AuthProvider";
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "../App.css"

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
    const [ state, setState ] = useState<LoginState>({});
    const { username, password } = state;

    const handleLogin = useCallback(() =>{
        login?.(username, password);
    }, [username, password]);

    const handleGoToRegister = useCallback(() => {
        history.push('/register');
    }, [])

    useEffect(() => {
        if(isAuthenticated){
            history.push('/');
        }
    }, [isAuthenticated]);

    const handleUsernameChange = useCallback((e: any) => setState(
        {...state,
            username: e.detail.value || ''
        }
    ), [state]);

    const handlePasswordChange = useCallback((e: any) => setState(
        {
            ...state,
            password: e.detail.value || ''
        }
    ), [state]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Login
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput 
                    placeholder="Username"
                    value={username} 
                    onIonChange={handleUsernameChange}>
                </IonInput>
                <IonInput 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onIonChange={handlePasswordChange}>
                </IonInput>
                <IonLoading isOpen={isAuthenticating}/>
                {
                    authenticationError && (
                        <div className="error-text"> Failed to authenticate!</div>
                    )
                }
                <IonButton onClick={handleLogin}>Login</IonButton>
                <IonButton onClick={handleGoToRegister}>Register</IonButton>
            </IonContent>
        </IonPage>
    )

} 