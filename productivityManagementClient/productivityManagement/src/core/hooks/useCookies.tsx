import Cookies from 'js-cookie'
import { useCallback } from 'react';

type SetAuthDataFn = (token: string, userId: string) => void;
type GetAuthDataFn = () => {token: string | undefined, userId: string | undefined}
type RemoveAuthDataFn = () => void

export const useCookies = ()  => { 
    function setAuthData(token: string, userId: string){
        Cookies.set('token', token, {
            expires: 3
        });
        Cookies.set('userId', userId, {
            expires: 3
        });
    }

    function getAuthData() {
        const token = Cookies.get('token');
        const userId = Cookies.get('userId');

        return { token: token, userId: userId };
    }

    function removeAuthData() {
        Cookies.remove('token');
        Cookies.remove('userId');
    }

    const getCookieAuthData = useCallback<GetAuthDataFn>(getAuthData, []);
    const setCookieAuthData = useCallback<SetAuthDataFn>(setAuthData, []);
    const removeCookieAuthData = useCallback<RemoveAuthDataFn>(removeAuthData, []);

    return { setCookieAuthData, getCookieAuthData, removeCookieAuthData };
}