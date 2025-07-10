import { useState, useEffect } from 'react';
import { Link } from '../../components';
import { useNavigate } from 'react-router-dom';
import { customerService, userService } from '../../services';

export default function Customers() {
    const [customers, setCustomers] = useState(null)
    const navigate = useNavigate();
    
    useEffect(() => {
        userService.checkAuthOnLoad && userService.checkAuthOnLoad();
        if (!userService.isAuthenticated) {
            navigate('/', { replace: true });
            if (
                window.location.hostname === 'localhost' &&
                window.location.pathname === '/verly-admin-react'
            ) {
                window.location.replace('/verly-admin-react/');
            }
            return;
        }
        customerService.getAll().then(x => setCustomers(x))
    }, [navigate]);

    if (!userService.isAuthenticated) {
        return null;
    }

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Clientes</h1>
            <div className="d-flex justify-content-end mb-3">
                <Link href="/customers/add" className="btn btn-success">
                    + Adicionar Cliente
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th>Telefones</th>
                            <th>Endereço</th>
                            <th className="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers && customers.map(user =>
                            <tr key={user.id}>
                                <td className="py-3">{user.name}</td>
                                <td className="py-3">{user.phone.one} {user.phone.two && `| ${user.phone.two}`}</td>
                                <td className="py-3">{user.address.logradouro}, {user.address.bairro}, {user.address.number}. {user.address.reference}</td>
                                <td className="text-end py-3">
                                    <Link href={`/customers/edit/${user.id}`} className="btn btn-primary btn-sm" title="Editar">
                                        <i className="bi bi-pencil"></i> Editar
                                    </Link>
                                </td>
                            </tr>
                        )}
                        {!customers &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="spinner-border spinner-border-lg align-center"></div>
                                </td>
                            </tr>
                        }
                        {customers && !customers.length &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="p-2">Nenhum cliente encontrado</div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
} 