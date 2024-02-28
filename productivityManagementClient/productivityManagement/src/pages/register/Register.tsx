import React, { useCallback, useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../../core/providers/AuthProvider";
import { IonButton, IonContent, IonHeader, IonInput, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "../App.css"

interface RegisterState {
    username?: string;
    password?: string;
    confirmedPassword?: string;
}

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
    const { isRegistered, isRegistering, register, registrationError } = useContext(AuthContext);
    const [ state, setState ] = useState<RegisterState>({});
    const { username, password, confirmedPassword } = state;
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const handleRegister = useCallback(() =>{
        if(confirmedPassword !== password){
            setErrorMessage('Passwords must match!');
            return;
        }

        if(username?.trim() && password?.trim()){
            register?.(username.trim(), password.trim());
        } else {
            setErrorMessage("Username and password must not be empty!");
        }
    }, [username, password, confirmedPassword]);

    useEffect(() => {
        if(isRegistered){
            history.push('/');
        }
    }, [isRegistered]);

    const handleUsernameChange = (e: any) => setState(
        {
            ...state,
            username: e.detail.value || ''
        }
    );

    const handlePasswordChange = (e: any) => setState(
        {
            ...state,
            password: e.detail.value || ''
        }
    );

    const handleConfirmedPasswordChange = (e: any) => setState(
        {
            ...state,
            confirmedPassword: e.detail.value || ''
        }
    );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Register
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
                <IonInput
                    type="password"
                    placeholder="Confirm password"
                    value={confirmedPassword}
                    onIonChange={handleConfirmedPasswordChange}>
                </IonInput>
                <IonLoading isOpen={isRegistering}/>
                {
                    registrationError && (
                        <div className="error-text">Failed to register. Try again!</div>
                    )
                }
                {
                    errorMessage && (
                        <div className="error-text">
                            {
                                errorMessage
                            }
                        </div>
                    )
                }
                <IonButton onClick={handleRegister}>Register</IonButton>
            </IonContent>
        </IonPage>
    )

} 