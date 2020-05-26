import { LOGIN, LOGOUT } from './types';
import { SERVER_IP } from '../../private'

const finishLogin = (email, token) => {
    return {
        type: LOGIN,
        payload: {
            email,
            token,
        }
    }
}

export const loginUser = (email, password) => async (dispatch) => {
    try {
        const response = await fetch(`${SERVER_IP}/api/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const body = await response.json();
        if (body.success) {
            const result = dispatch(finishLogin(body.email, body.token));
            return result;
        }

    } catch (err) {
        console.error('An error occurred while trying to log you in', err.toString());
    }
}

export const logoutUser = () => {
    return {
        type: LOGOUT,
        payload: null,
    }
}
