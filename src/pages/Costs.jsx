import React, { useState, useEffect } from 'react'
import { Link } from '../../components'
import Select from 'react-select'
import { customerService, userService, productService } from '../../services'
import { productCostService } from '../../services/product-cost.service'
import {Popover,OverlayTrigger,Button, Modal} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const productTypeOptions = [
    { value: 'BOX', label: 'Box' },
    { value: 'JANELA', label: 'Janela' },
    { value: 'PORTA', label: 'Porta' },
]

const productColorOptions = [
    { value: 'INCOLOR', label: 'Incolor' },
    { value: 'VERDE', label: 'Verde' },
    { value: 'FUME', label: 'Fumê' }
]

export default Costs;

function Costs() {
    const [products, setProducts] = useState(null);
    const [productsCost, setProductsCost] = useState(null);
    const [productType, setProductType] = useState(productTypeOptions[0].value);
    const [productColor, setProductColor] = useState(productColorOptions[0].value);
    const [showModal, setShowModal] = useState(false);
    const user = userService?.userValue
    const navigate = useNavigate();

    useEffect(() => {
        userService.checkAuthOnLoad && userService.checkAuthOnLoad();
        if (!userService.isAuthenticated)
            return;
        productService.getAll().then(x => setProducts(x));
        productCostService.getAll().then(y => setProductsCost(y))
        setProductType(productTypeOptions[0].value);
        setProductColor(productColorOptions[0].value);
    }, []);

    if (!userService.isAuthenticated) {
        return null;
    }

    // --- Novo formulário para TemperedGlassCostEntity ---
    const [form, setForm] = useState({
        incolor: '',
        fume: '',
        verde: '',
        ganhoPorta2Folhas: '',
        ganhoPorta4Folhas: '',
        ganhoPorta1Folha: '',
        ganhoBox2Folhas: '',
        ganhoBox4Folhas: '',
        ganhoBox1Folha: '',
        ganhoJanela2Folhas: '',
        ganhoJanela4Folhas: '',
        ganhoJanela1Folha: '',
        box1FolhaMDO: '',
        box2FolhasMDO: '',
        box4FolhasMDO: '',
        janela1FolhaMDO: '',
        janela2FolhasMDO: '',
        janela4FolhasMDO: '',
        porta1FolhaMDO: '',
        porta2FolhasMDO: '',
        porta3FolhasMDO: '',
        porta4FolhasMDO: '',
    });

    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
            await productCostService.create(form);
            alert('Custo salvo com sucesso!');
            setShowModal(false);
            // Atualiza a listagem após salvar
            const updated = await productCostService.getAll();
            setProductsCost(updated);
            setForm({
                incolor: '', fume: '', verde: '',
                ganhoPorta2Folhas: '', ganhoPorta4Folhas: '', ganhoPorta1Folha: '',
                ganhoBox2Folhas: '', ganhoBox4Folhas: '', ganhoBox1Folha: '',
                ganhoJanela2Folhas: '', ganhoJanela4Folhas: '', ganhoJanela1Folha: '',
                box1FolhaMDO: '', box2FolhasMDO: '', box4FolhasMDO: '',
                janela1FolhaMDO: '', janela2FolhasMDO: '', janela4FolhasMDO: '',
                porta1FolhaMDO: '', porta2FolhasMDO: '', porta3FolhasMDO: '', porta4FolhasMDO: '',
            });
        } catch (err) {
            alert('Erro ao salvar custo!');
        }
    }

    function handleProductColor(e) {
        setProductColor(e.value)
    };

    // Função para lidar com a mudança nos inputs do formulário de custos
    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const filteredProducts = products?.filter(product => {
        return (
            product.type === productType &&
            product.color === productColor
        );
    });

    return (
        <div className="container py-4">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-primary mb-3">Custos</h1>
                <Button 
                    variant="primary" 
                    size="lg"
                    className="px-4 py-2 rounded-pill shadow-sm"
                    onClick={() => {
                        setShowModal(true);
                        if (productsCost && productsCost.length > 0) {
                            setForm(productsCost[0]);
                        }
                    }}
                >
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Custos
                </Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Custos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleFormSubmit}>
                        <div className="row g-3">
                            <div className="col-12 mb-2"><strong>Vidros</strong></div>
                            <div className="col-12 mb-3">
                                <label>Incolor (R$/m²)</label>
                                <div className="input-group">
                                    <input type="number" name="incolor" className="form-control" value={form.incolor} onChange={handleFormChange} />
                                    <span className="input-group-text">R$</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>Fumê (R$/m²)</label>
                                <div className="input-group">
                                    <input type="number" name="fume" className="form-control" value={form.fume} onChange={handleFormChange} />
                                    <span className="input-group-text">R$</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>Verde (R$/m²)</label>
                                <div className="input-group">
                                    <input type="number" name="verde" className="form-control" value={form.verde} onChange={handleFormChange} />
                                    <span className="input-group-text">R$</span>
                                </div>
                            </div>
                            <div className="col-12 mt-4 mb-2"><strong>Ganho Porta</strong></div>
                            <div className="col-12 mb-3">
                                <label>1 Folha</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoPorta1Folha" className="form-control" value={form.ganhoPorta1Folha} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>2 Folhas</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoPorta2Folhas" className="form-control" value={form.ganhoPorta2Folhas} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>4 Folhas</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoPorta4Folhas" className="form-control" value={form.ganhoPorta4Folhas} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mt-4 mb-2"><strong>Ganho Box</strong></div>
                            <div className="col-12 mb-3">
                                <label>1 Folha</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoBox1Folha" className="form-control" value={form.ganhoBox1Folha} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>2 Folhas</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoBox2Folhas" className="form-control" value={form.ganhoBox2Folhas} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>4 Folhas</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoBox4Folhas" className="form-control" value={form.ganhoBox4Folhas} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mt-4 mb-2"><strong>Ganho Janela</strong></div>
                            <div className="col-12 mb-3">
                                <label>1 Folha</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoJanela1Folha" className="form-control" value={form.ganhoJanela1Folha} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>2 Folhas</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoJanela2Folhas" className="form-control" value={form.ganhoJanela2Folhas} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>4 Folhas</label>
                                <div className="input-group">
                                    <input type="number" name="ganhoJanela4Folhas" className="form-control" value={form.ganhoJanela4Folhas} onChange={handleFormChange} />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-12 mt-4 mb-2"><strong>MDO Box</strong></div>
                            <div className="col-12 mb-3">
                                <label>1 Folha</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="box1FolhaMDO" className="form-control" value={form.box1FolhaMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>2 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="box2FolhasMDO" className="form-control" value={form.box2FolhasMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>4 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="box4FolhasMDO" className="form-control" value={form.box4FolhasMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mt-4 mb-2"><strong>MDO Janela</strong></div>
                            <div className="col-12 mb-3">
                                <label>1 Folha</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="janela1FolhaMDO" className="form-control" value={form.janela1FolhaMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>2 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="janela2FolhaMDO" className="form-control" value={form.janela2FolhaMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>4 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="janela4FolhasMDO" className="form-control" value={form.janela4FolhasMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mt-4 mb-2"><strong>MDO Porta</strong></div>
                            <div className="col-12 mb-3">
                                <label>1 Folha</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="porta1FolhaMDO" className="form-control" value={form.porta1FolhaMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>2 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="porta2FolhasMDO" className="form-control" value={form.porta2FolhasMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>3 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="porta3FolhasMDO" className="form-control" value={form.porta3FolhasMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label>4 Folhas</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input type="number" name="porta4FolhasMDO" className="form-control" value={form.porta4FolhasMDO} onChange={handleFormChange} step="0.01" min="0" />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="success" type="submit">Salvar</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* ...restante da página, como tabela de produtos filtrados... */}
        </div>
    );
} 