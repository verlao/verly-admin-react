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
                porta1FolhaMDO: '', porta2FolhasMDO: '', porta4FolhasMDO: '',
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

    // Função para atualizar um campo de custo inline
    async function handleInlineEdit(field, value) {
      try {
        setProductsCost(prev => {
          if (!prev || prev.length === 0) return prev;
          // Converte para número se o campo for numérico
          const numericFields = [
            'incolor', 'fume', 'verde',
            'ganhoPorta2Folhas', 'ganhoPorta4Folhas', 'ganhoPorta1Folha',
            'ganhoBox2Folhas', 'ganhoBox4Folhas', 'ganhoBox1Folha',
            'ganhoJanela2Folhas', 'ganhoJanela4Folhas', 'ganhoJanela1Folha',
            'box1FolhaMDO', 'box2FolhasMDO', 'box4FolhasMDO',
            'janela1FolhaMDO', 'janela2FolhasMDO', 'janela4FolhasMDO',
            'porta1FolhaMDO', 'porta2FolhasMDO', 'porta4FolhasMDO'
          ];
          const newValue = numericFields.includes(field) ? Number(value) : value;
          const updated = { ...prev[0], [field]: newValue };
          console.log('Payload enviado para update:', updated);
          productCostService.update(updated)
            .then(() => {})
            .catch((err) => {
              alert('Erro ao salvar alteração: ' + (err?.message || err));
            });
          return [updated];
        });
      } catch (err) {
        alert('Erro ao salvar alteração!');
      }
    }

    // Função para renderizar célula editável
    function EditableCell({ cost, field, mask, isPercent, isMoney }) {
      const [editing, setEditing] = useState(false);
      const [inputValue, setInputValue] = useState(cost[field] ?? '');
      const inputRef = React.useRef();

      useEffect(() => {
        setInputValue(cost[field] ?? '');
      }, [cost[field]]);

      function handleBlur() {
        setEditing(false);
        if (inputValue !== cost[field]) {
          handleInlineEdit(field, inputValue);
        }
      }

      function handleKeyDown(e) {
        if (e.key === 'Enter') {
          inputRef.current.blur();
        }
      }

      if (editing) {
        return (
          <input
            ref={inputRef}
            type="number"
            step="0.01"
            min="0"
            className="form-control form-control-sm"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{ width: 90 }}
            autoFocus
          />
        );
      }
      let display = inputValue;
      if (isMoney && inputValue !== '' && inputValue !== null && inputValue !== undefined) display = `R$ ${inputValue}`;
      if (isPercent && inputValue !== '' && inputValue !== null && inputValue !== undefined) display = `${inputValue}%`;
      return (
        <span onClick={() => setEditing(true)} style={{ cursor: 'pointer', display: 'inline-block', minWidth: 60 }}>
          {display}
        </span>
      );
    }

    const filteredProducts = products?.filter(product => {
        return (
            product.type === productType &&
            product.color === productColor
        );
    });

    return (
        <div className="container py-4" style={{ marginTop: 64 }}>
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-primary mb-3">Custos</h1>
                {/* Remova o Modal de edição e o botão "Editar Custos" */}
            </div>

            {/* Tabela de custos agrupada por categoria */}
            {productsCost && productsCost.length > 0 && (
              <>
                {/* Vidros */}
                <div className="mb-4">
                  <h5 className="fw-bold">Vidros</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Incolor (R$/m²)</th>
                        <th>Fumê (R$/m²)</th>
                        <th>Verde (R$/m²)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="incolor" isMoney /></td>
                          <td><EditableCell cost={cost} field="fume" isMoney /></td>
                          <td><EditableCell cost={cost} field="verde" isMoney /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Ganho Porta */}
                <div className="mb-4">
                  <h5 className="fw-bold">Ganho Porta</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>1 Folha (%)</th>
                        <th>2 Folhas (%)</th>
                        <th>4 Folhas (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="ganhoPorta1Folha" isPercent /></td>
                          <td><EditableCell cost={cost} field="ganhoPorta2Folhas" isPercent /></td>
                          <td><EditableCell cost={cost} field="ganhoPorta4Folhas" isPercent /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Ganho Box */}
                <div className="mb-4">
                  <h5 className="fw-bold">Ganho Box</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>1 Folha (%)</th>
                        <th>2 Folhas (%)</th>
                        <th>4 Folhas (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="ganhoBox1Folha" isPercent /></td>
                          <td><EditableCell cost={cost} field="ganhoBox2Folhas" isPercent /></td>
                          <td><EditableCell cost={cost} field="ganhoBox4Folhas" isPercent /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Ganho Janela */}
                <div className="mb-4">
                  <h5 className="fw-bold">Ganho Janela</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>1 Folha (%)</th>
                        <th>2 Folhas (%)</th>
                        <th>4 Folhas (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="ganhoJanela1Folha" isPercent /></td>
                          <td><EditableCell cost={cost} field="ganhoJanela2Folhas" isPercent /></td>
                          <td><EditableCell cost={cost} field="ganhoJanela4Folhas" isPercent /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* MDO Box */}
                <div className="mb-4">
                  <h5 className="fw-bold">MDO Box</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>1 Folha (R$)</th>
                        <th>2 Folhas (R$)</th>
                        <th>4 Folhas (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="box1FolhaMDO" isMoney /></td>
                          <td><EditableCell cost={cost} field="box2FolhasMDO" isMoney /></td>
                          <td><EditableCell cost={cost} field="box4FolhasMDO" isMoney /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* MDO Janela */}
                <div className="mb-4">
                  <h5 className="fw-bold">MDO Janela</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>1 Folha (R$)</th>
                        <th>2 Folhas (R$)</th>
                        <th>4 Folhas (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="janela1FolhaMDO" isMoney /></td>
                          <td><EditableCell cost={cost} field="janela2FolhasMDO" isMoney /></td>
                          <td><EditableCell cost={cost} field="janela4FolhasMDO" isMoney /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* MDO Porta */}
                <div className="mb-4">
                  <h5 className="fw-bold">MDO Porta</h5>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>1 Folha (R$)</th>
                        <th>2 Folhas (R$)</th>
                        <th>4 Folhas (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsCost.map(cost => (
                        <tr key={cost.id}>
                          <td><EditableCell cost={cost} field="porta1FolhaMDO" isMoney /></td>
                          <td><EditableCell cost={cost} field="porta2FolhasMDO" isMoney /></td>
                          <td><EditableCell cost={cost} field="porta4FolhasMDO" isMoney /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ...restante da página, como tabela de produtos filtrados... */}
        </div>
    );
} 