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
    const cleanCep = cep.replace(/[^0-9]/g, '');
    if(cleanCep.length === 8){
        return fetchWrapper.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
            .then(response => {
                if (response.erro) {
                    throw new Error('CEP não encontrado');
                }
                return response;
            })
            .catch(error => {
                console.error('Erro na busca do CEP:', error);
                throw error;
            });
    }
    return Promise.reject(new Error('CEP deve ter 8 dígitos'));
}