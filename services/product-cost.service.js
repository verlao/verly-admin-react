import { apiUrl } from '../config';
import { fetchWrapper } from '../helpers';

export const productCostService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

const baseUrl = `${apiUrl}/product-costs`;

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(params) {
    return fetchWrapper.put(baseUrl, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}