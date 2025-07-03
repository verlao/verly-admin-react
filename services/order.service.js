import { apiUrl } from '../config.js';
import { BaseService } from './base.service';

const baseUrl = `${apiUrl}/order`;
const orderService = new BaseService(baseUrl);

export { orderService }; 