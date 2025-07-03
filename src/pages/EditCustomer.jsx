import { AddEdit } from '../../components/customers/AddEdit';
import { customerService } from '../../services';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function EditCustomerWrapper() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        customerService.getById(id).then(setCustomer);
    }, [id]);

    if (!customer) return <div>Carregando...</div>;
    return <AddEdit customer={customer} />;
} 