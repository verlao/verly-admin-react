import { userService } from '../services'

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

// Status codes that indicate authentication issues
const AUTH_ERROR_CODES = [401, 403];

async function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

async function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

async function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}

async function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function authHeader(url) {
    const user = userService?.userValue;
    const isLoggedIn = userService?.isAuthenticated;
    
    if (isLoggedIn) {
        return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
}

async function handleResponse(response) {
    // Try to parse the response as JSON
    const text = await response.text();
    let data;
    
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        // If response is not JSON, create an error object
        const error = new Error('Resposta inválida do servidor');
        error.status = response.status;
        throw error;
    }

    // Só faz logout em 401 ou 403
    if (response.status === 401 || response.status === 403) {
        userService.logout();
        const error = new Error(data?.message || 'Sessão expirada ou inválida');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    // Outros erros não deslogam o usuário
    if (!response.ok) {
        const error = new Error(data?.message || response.statusText || 'Erro na requisição');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}