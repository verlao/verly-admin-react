import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '../helpers';
import { apiUrl } from '../config';

const userSubject = new BehaviorSubject(
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
);

export const userService = {
    user: userSubject.asObservable(),
    get userValue () {
        return userSubject.value },
    get isAuthenticated() {
        const user = this.userValue;
        if (!user) return false;
        
        if (user.expiresAt) {
            return new Date(user.expiresAt) > new Date();
        }
        return true;
    },
    login,
    logout,
    checkAuthOnLoad
};

function login(username, password) {
    if (!username || !password) {
        return Promise.reject('Username and password are required');
    }

    const url = `${apiUrl}/login-v2`;
    console.log('Login API URL:', url);

    return fetchWrapper.post(url, {username, password})
        .then(user => {
            if (!user || !user.accessToken) {
                throw new Error('Invalid user data received');
            }
            
            // Add expiration time if not provided by the server
            if (!user.expiresAt) {
                user.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
            }
            
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        })
        .catch(error => {
            console.error('Login failed:', error);
            throw error;
        });
}

function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    userSubject.next(null);
    window.location.href = '/account/login';
}

function checkAuthOnLoad() {
    if (!userService.isAuthenticated) {
        userService.logout();
    }
}
