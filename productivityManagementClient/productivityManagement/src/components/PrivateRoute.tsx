import { Component, useContext } from "react";
import { AuthContext, AuthState } from "../core/providers/AuthProvider";
import { Redirect, Route } from "react-router";

export interface PrivateRouteProps {
    component: any;
    path: string;
    exact?:boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useContext<AuthState>(AuthContext);

    return (
        <Route {...rest} render={props => {
            if(isAuthenticated){
                return <Component {...props}></Component>
            }
            else return <Redirect to={{ pathname: '/login' }}></Redirect>
        }}/>
    )
}