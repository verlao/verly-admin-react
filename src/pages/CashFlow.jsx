import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService, userService } from '../../services'
import { cashFlowService } from '../../services/cash-flow.service';
import CurrencyInput from 'react-currency-input-field';
import Select from 'react-select'
import { Modal, Button } from 'react-bootstrap';

export default CashFlow;

function CashFlow() {
    const [cashFlowData, setCashFlowData] = useState(null);
    const [form, setForm] = useState({
        cash: '',
        description: '',
        orderId: '',
        type: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        variant: 'success'
    });
    const navigate = useNavigate();
    const user = userService?.userValue
    const isLoggedIn = user && user.accessToken

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

        cashFlowService.getAll().then(x => {
            if (x) {
                setCashFlowData(x);
            } else {
                setCashFlowData({ cashList: [] });
            }
        });
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null;
    }

    const showFeedbackModal = (title, message, variant = 'success') => {
        setModalConfig({ title, message, variant });
        setShowModal(true);
    };

    async function handleAddButtonClick() {
        if (!form.cash || !form.description) {
            showFeedbackModal('Atenção', 'Por favor, preencha o valor e a descrição.', 'warning');
            return;
        }
        try {
            const userPerson = user?.name || '';
            const data = {
                ...form,
                type: 'ENTRADA',
                cash: parseFloat(form.cash),
                person: userPerson
            };
            await cashFlowService.create(data);
            showFeedbackModal('Sucesso', 'Entrada adicionada com sucesso!');
            setForm({ cash: '', description: '', orderId: '', type: '' });
            const updatedCashFlow = await cashFlowService.getAll();
            setCashFlowData(updatedCashFlow);
        } catch (error) {
            showFeedbackModal('Erro', 'Erro ao adicionar entrada.', 'danger');
        }
    };

    async function handleRemoveButtonClick() {
        if (!form.cash || !form.description) {
            showFeedbackModal('Atenção', 'Por favor, preencha o valor e a descrição.', 'warning');
            return;
        }
        try {
            const userPerson = user?.name || '';
            const data = {
                ...form,
                type: 'SAIDA',
                cash: -Math.abs(parseFloat(form.cash)),
                person: userPerson
            };
            await cashFlowService.create(data);
            showFeedbackModal('Sucesso', 'Saída adicionada com sucesso!');
            setForm({ cash: '', description: '', orderId: '', type: '' });
            const updatedCashFlow = await cashFlowService.getAll();
            setCashFlowData(updatedCashFlow);
        } catch (error) {
            showFeedbackModal('Erro', 'Erro ao adicionar saída.', 'danger');
        }
    };

    function handleChangeCashInput(name, value) {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const years = [
        { value: 2023 },
        { value: 2024 },
        { value: 2025 },
        { value: 2026 },
        { value: 2027 },
        { value: 2028 },]

    const months = [
        {value:"1", label:"Janeiro",
    }]

    return (
        <div className="container py-4">
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className={`bg-${modalConfig.variant} text-white`}>
                    <Modal.Title>{modalConfig.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">{modalConfig.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={modalConfig.variant} onClick={() => setShowModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-primary mb-3">Caixa</h1>
                <p className="lead text-muted mb-4">Visualize e gerencie suas entradas e saídas</p>
            </div>

            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-primary mb-3 text-center">Nova Transação</h5>
                            <div className="row g-3 align-items-end">
                                <div className="col-12 col-sm-6">
                                    <label htmlFor="cashValue" className="form-label visually-hidden">Valor</label>
                                    <CurrencyInput
                                        id="cashValue"
                                        name="cash"
                                        placeholder='R$ 0.00'
                                        decimalsLimit={2}
                                        prefix='R$ '
                                        className="form-control form-control-lg"
                                        value={form.cash}
                                        onValueChange={(value) => handleChangeCashInput('cash', value)}
                                    />
                                </div>
                                <div className="col-12 col-sm-6">
                                    <label htmlFor="description" className="form-label visually-hidden">Descrição</label>
                                    <input
                                        id="description"
                                        name="description"
                                        placeholder='Descrição'
                                        className='form-control form-control-lg'
                                        value={form.description}
                                        onChange={(e) => handleChangeCashInput(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-sm-6">
                                    <label htmlFor="order" className="form-label visually-hidden">Pedido</label>
                                    <input
                                        id="order"
                                        name="orderId"
                                        type="number"
                                        min="0"
                                        placeholder='Identificação do Pedido'
                                        className='form-control form-control-lg'
                                        value={form.orderId}
                                        onChange={(e) => handleChangeCashInput(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className="col-12 d-flex justify-content-evenly mt-4">
                                    <button onClick={handleAddButtonClick} className="btn btn-success btn-lg px-4 rounded-pill shadow-sm flex-grow-1 me-2">
                                        <i className="bi bi-plus-circle me-2"></i> Entrada
                                    </button>
                                    <button onClick={handleRemoveButtonClick} className="btn btn-danger btn-lg px-4 rounded-pill shadow-sm flex-grow-1 ms-2">
                                        <i className="bi bi-dash-circle me-2"></i> Saída
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mb-5">
                <div className="col-12 col-lg-10">
                    <h2 className="display-6 fw-bold text-center text-primary mb-4">Resumo do Caixa</h2>
                    {cashFlowData && cashFlowData.year ? (
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded shadow-sm">
                                            <span className="text-muted">Ano:</span>
                                            <strong className="text-primary">{cashFlowData.year}</strong>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded shadow-sm">
                                            <span className="text-muted">Mês:</span>
                                            <strong className="text-primary">{cashFlowData.month}</strong>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded shadow-sm">
                                            <span className="text-muted">Saldo:</span>
                                            <strong className="text-primary">R$ {cashFlowData.balance}</strong>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded shadow-sm">
                                            <span className="text-muted">Lucro:</span>
                                            <strong className="text-success">R$ {cashFlowData.profit}</strong>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded shadow-sm">
                                            <span className="text-muted">Valor de Venda:</span>
                                            <strong className="text-info">R$ {cashFlowData.saleValue}</strong>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded shadow-sm">
                                            <span className="text-muted">Custo:</span>
                                            <strong className="text-danger">R$ {cashFlowData.cost}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* ...restante da tabela de lançamentos... */}
        </div>
    );
} 