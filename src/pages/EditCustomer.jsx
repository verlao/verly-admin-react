import { AddEdit } from '../../components/customers/AddEdit';
import { customerService, userService } from '../../services';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function EditCustomerWrapper() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Garante que o usuário está carregado do localStorage
        userService.checkAuthOnLoad && userService.checkAuthOnLoad();

        if (!userService.isAuthenticated) {
            navigate('/', { replace: true });
            return;
        }

        async function loadCustomer() {
            try {
                setLoading(true);
                const customerData = await customerService.getById(id);
                setCustomer(customerData);
            } catch (err) {
                console.error('Erro ao carregar cliente:', err);
                setError('Erro ao carregar dados do cliente');
            } finally {
                setLoading(false);
            }
        }

        loadCustomer();
    }, [id, navigate]);

    if (!userService.isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="container py-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border spinner-border-lg" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger text-center">
                    {error}
                    <br />
                    <button 
                        className="btn btn-outline-danger mt-2" 
                        onClick={() => navigate('/customers')}
                    >
                        Voltar para Clientes
                    </button>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="container py-4">
                <div className="alert alert-warning text-center">
                    Cliente não encontrado
                    <br />
                    <button 
                        className="btn btn-outline-warning mt-2" 
                        onClick={() => navigate('/customers')}
                    >
                        Voltar para Clientes
                    </button>
                </div>
            </div>
        );
    }

    return <AddEdit customer={customer} />;
} 