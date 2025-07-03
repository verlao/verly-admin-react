import { fetchWrapper } from '../helpers';

export class BaseService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getAll() {
        return fetchWrapper.get(this.baseUrl);
    }

    getById(id) {
        return fetchWrapper.get(`${this.baseUrl}/${id}`);
    }

    create(params) {
        return fetchWrapper.post(this.baseUrl, params);
    }

    update(id, params) {
        return fetchWrapper.put(`${this.baseUrl}/${id}`, params);
    }

    delete(id) {
        return fetchWrapper.delete(`${this.baseUrl}/${id}`);
    }
} 