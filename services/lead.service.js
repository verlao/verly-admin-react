import { apiUrl } from '../config';
import { fetchWrapper } from '../helpers';

export const leadService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

const baseUrl = `${apiUrl}/leads`;

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
