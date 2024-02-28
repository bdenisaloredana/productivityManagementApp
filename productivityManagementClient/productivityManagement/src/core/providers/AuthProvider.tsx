import React, { useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { login as loginApi, registerApi } from '../apis/authApi';
import { useCookies } from "../hooks/useCookies";

type LoginFn = (username?: string, password?: string) => void;
type RegisterFn = (username?: string, password?: string) => void;
type ClearAuthDataFn = () => void;

export interface AuthState {
    isRegistering: boolean;
    isRegistered: boolean;
    registrationError?: Error | null;
    register?: RegisterFn;
    authenticationError?: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    pendingAuthentication: boolean;
    login?: LoginFn;
    username?: string; 
    password?: string;
    token: string;
    userId: string;
    clearAuthData?: ClearAuthDataFn;
}

const initialState: AuthState = {
    isRegistering: false,
    isRegistered: false,
    isAuthenticated: false,
    isAuthenticating: false,
    pendingAuthentication: false,
    token: '',
    userId: ''
};


export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike
}

export const AuthProvider : React.FC<AuthProviderProps> = ( { children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { getCookieAuthData, setCookieAuthData } = useCookies();
    const { isRegistering, isRegistered, registrationError, isAuthenticated, isAuthenticating, 
        pendingAuthentication, authenticationError, token, userId } = state; 

    const login = useCallback<LoginFn>(loginCallBack, []);
    const register = useCallback<RegisterFn>(registerCallback, []);
    const clearAuthData = useCallback<ClearAuthDataFn>(clearAuthDataCallback, []);
    useEffect(checkCookieAuthData, []);
    useEffect(registrationEffect, [isRegistering]);
    useEffect(authenticationEffect, [pendingAuthentication]);
    const value = { isRegistering, isRegistered, registrationError, register, isAuthenticated, isAuthenticating, 
        pendingAuthentication, authenticationError, login, token, userId, clearAuthData };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function clearAuthDataCallback() {
        setState({
            ...state,
            token: '',
            userId: '',
            isAuthenticated: false
        })
    }

    function loginCallBack(username?: string, password?: string) {
        setState({
            ...state,
            pendingAuthentication: true,
            username: username,
            password: password
        });
    }

    function registerCallback(username?: string, password?: string) {
        setState({
            ...state,
            isRegistering: true,
            username: username,
            password: password
        })
    }

    function checkCookieAuthData() {
        const {token, userId} = getCookieAuthData();
        if(token && userId) {
            setState({
                ...state,
                isAuthenticated: true, 
                pendingAuthentication: false,
                isAuthenticating: false,
                token: token,
                userId: userId
            });
        }
    }

    function authenticationEffect() {
        let canceled = false;
        authenticate();

        return () => {
            canceled = true;
        }


        async function authenticate() {
            if(!pendingAuthentication){
                return;
            }

            try{
                const { username, password } = state;
                const { userId, token } = await loginApi(username, password);

                if(canceled){
                    return;
                }
                
                setCookieAuthData(token, userId);
                setState({
                    ...state,
                    isAuthenticated: true, 
                    pendingAuthentication: false,
                    isAuthenticating: false,
                    token: token,
                    userId: userId
                });

            }catch(error){
                if(canceled){
                    return;
                }

                setState({
                    ...state,
                     isAuthenticated: false, 
                     pendingAuthentication: false, 
                     isAuthenticating: false, 
                     authenticationError: error as Error 
                    });
                }
            }
        }

        function registrationEffect() {
            let canceled = false;
            register();

            return () => {
                canceled = true;
            }

            async function register() {
                if(!isRegistering){
                    return;
                }

                try{
                    const { username, password } = state;
                    const { userId, token } = await registerApi(username, password);

                    if(canceled){
                        return;
                    }
                    
                    setCookieAuthData(token, userId);
                    setState({
                        ...state,
                        isRegistered: true, 
                        isRegistering: false,
                        isAuthenticated: true,
                        token: token,
                        userId: userId
                    });

                }catch(error){
                    if(canceled){
                        return;
                    }

                    setState({
                        ...state,
                        isRegistered: false, 
                        isRegistering: false, 
                        registrationError: error as Error 
                    });
                }
            }
        }
    }