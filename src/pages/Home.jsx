import { userService } from '../../services'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { leadService } from '../../services/lead.service';

export default Home;

function Home() {
    const [leads, setLeads] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        userService.checkAuthOnLoad && userService.checkAuthOnLoad();
        if (!userService.isAuthenticated) {
            navigate(`${import.meta.env.BASE_URL}account/login`);
            return;
        }

        leadService.getAll()
            .then(x => setLeads(x))
            .catch(error => {
                setLeads([]); // Garante que o spinner suma em caso de erro
                // O logout já redireciona, mas pode mostrar um aviso se quiser
                console.error('Erro ao buscar leads:', error);
            });
    }, [navigate]);

    if (!userService.isAuthenticated) {
        return null;
    }

    return (
        <div className="container py-4" style={{ marginTop: 64 }}>
            <h1 className="mb-4 text-center">Leads</h1>
            <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th style={{ minWidth: 160 }}>Telefone</th>
                            <th style={{ minWidth: 140 }}>Bairro</th>
                            <th style={{ minWidth: 140 }}>Data</th>
                            <th>Email</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads && leads?.map?.(lead =>
                            <tr key={lead.id}>
                                <td className="py-3">{lead.name}</td>
                                <td className="py-3" style={{ minWidth: 160 }}>{
                                  lead.phone
                                    ? (
                                        <a
                                          href={`https://web.whatsapp.com/send?phone=55${lead.phone.replace(/\D/g, '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ textDecoration: 'none', color: '#25D366', fontWeight: 500 }}
                                        >
                                          {lead.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3')}
                                        </a>
                                      )
                                    : ''
                                }</td>
                                <td className="py-3" style={{ minWidth: 140 }}>{lead.neighborhood}</td>
                                <td className="py-3" style={{ minWidth: 140 }}>{lead.createdDate}</td>
                                <td className="py-3">{lead.email}</td>
                                <td className="py-3">{lead.description}</td>
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