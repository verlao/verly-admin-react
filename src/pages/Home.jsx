import { userService } from '../../services'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { leadService } from '../../services/lead.service';

export default Home;

function Home() {
    const [leads, setLeads] = useState(null)
    const navigate = useNavigate()
    const isLoggedIn = userService?.isAuthenticated

    useEffect(() => {
        userService.checkAuthOnLoad();
        if (!isLoggedIn) {
            navigate('/account/login');
            return;
        }

        leadService.getAll()
            .then(x => setLeads(x))
            .catch(error => {
                setLeads([]); // Garante que o spinner suma em caso de erro
                // O logout já redireciona, mas pode mostrar um aviso se quiser
                console.error('Erro ao buscar leads:', error);
            });
    }, [isLoggedIn, navigate]);

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Leads</h1>
            <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Bairro</th>
                            <th>Data</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads && leads?.map?.(lead =>
                            <tr key={lead.id}>
                                <td className="py-3">{lead.name}</td>
                                <td className="py-3">{lead.phone}</td>
                                <td className="py-3">{lead.neighborhood}</td>
                                <td className="py-3">{lead.createdDate}</td>
                                <td className="py-3">{lead.email}</td>
                            </tr>
                        )}
                        {!leads &&
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <div className="spinner-border spinner-border-lg align-center"></div>
                                </td>
                            </tr>
                        }
                        {leads && !leads.length &&
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <div className="p-2">Nenhum lead encontrado.</div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
} 