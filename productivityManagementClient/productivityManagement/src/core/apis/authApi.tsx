import axios from 'axios';
import { config, withLogs } from '..';

const authUrl = `http://localhost:3000/api/auth`;

export interface AuthProps {
    userId: string;
    token: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    return withLogs(axios.post(`${authUrl}/login`, { username, password }, config), 'login')
}

export const registerApi: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    return withLogs(axios.post(`${authUrl}/register`, { username, password }, config), 'register')
}