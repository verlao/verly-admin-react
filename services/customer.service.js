import { apiUrl } from '../config';
import { fetchWrapper } from '../helpers';

export const customerService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAddressByCep
};

const baseUrl = `${apiUrl}/customers`;

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

function getAddressByCep(cep){
    if(cep.replace("_","").length == 8){
        return fetchWrapper.get(`https://viacep.com.br/ws/${cep}/json/`)    
    }
    return {}
}