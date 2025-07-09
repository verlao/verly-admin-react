import { useState, useEffect } from 'react';
import { Link } from '../../components';
import { useNavigate } from 'react-router-dom';
import { customerService, userService } from '../../services';

export default function Customers() {
    const [customers, setCustomers] = useState(null)
    const user = userService?.userValue
    const isLoggedIn = user && user.accessToken
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isLoggedIn) {
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
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null;
    }

    function deleteUser(id) {
        if (!window.confirm('Você realmente quer excluir esse cliente?')) return;
        setCustomers(customers.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        customerService.delete(id).then(() => {
            setCustomers(customers => customers.filter(x => x.id !== id));
        });
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
                                    <Link href={`/customers/edit/${user.id}`} className="btn btn-primary btn-sm me-2" title="Editar">
                                        <i className="bi bi-pencil"></i> Editar
                                    </Link>
                                    <button onClick={() => deleteUser(user.id)} className="btn btn-danger btn-sm" title="Deletar" disabled={user.isDeleting}>
                                        {user.isDeleting
                                            ? <span className="spinner-border spinner-border-sm"></span>
                                            : <><i className="bi bi-trash"></i> Excluir</>}
                                    </button>
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