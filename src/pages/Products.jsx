import React, { useState, useEffect } from 'react'
import { Link } from '../../components'
import Select from 'react-select'
import { customerService, userService, productService } from '../../services'
import { productCostService } from '../../services/product-cost.service'
import {Popover,OverlayTrigger,Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export default Products;

function Products() {
    const [products, setProducts] = useState([]);
    const [productsCost, setProductsCost] = useState({});
    const [productType, setProductType] = useState({});
    const [productColor, setProductColor] = useState({});
    const [loading, setLoading] = useState(true);
    const user = userService?.userValue
    const isLoggedIn = user?.accessToken
    const navigate = useNavigate();

    if (!isLoggedIn) {
        return null;
    }

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
        setLoading(true);
        productService.getAll().then(x => setProducts(x)).finally(() => setLoading(false));
        setProductType(productTypeOptions[0].value);
        setProductColor(productColorOptions[0].value);
    }, [isLoggedIn, navigate]);

    function handleProductTypeChange(e) {
        setProductType(e.value);
    };

    function handleProductColor(e) {
        setProductColor(e.value)
    };

    return (
        <div>
            <h1>Produtos</h1>
            <Select className='d-inline-flex p-2' options={productTypeOptions} defaultValue={productTypeOptions[0].value} placeholder={"Tipo"} onChange={handleProductTypeChange} />
            <Select className='d-inline-flex p-2' options={productColorOptions} defaultValue={productTypeOptions[0].value} placeholder={"Cor"} onChange={handleProductColor} />
            <div className="table-responsive-xl">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                        <div className="spinner-border spinner-border-lg align-center"></div>
                    </div>
                ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th>Folhas</th>
                            <th>Largura</th>
                            <th>Altura</th>
                            <th>Cor</th>
                            <th>Medida</th>
                            <th>Custo</th>
                            <th>Preço À Vista</th>
                            <th>Lucro</th>
                            <th>Kit</th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.filter(product => 
                                (productType ? product.type === productType : true) &&
                                (productColor ? product.color === productColor : true)
                            )?.map(product => 
                                <tr key={product.key}>
                                    <td>{product.category}</td>
                                    <td>{product.type}</td>
                                    <td>{product.sheets}</td>
                                    <td>{product.width + 'cm'}</td>
                                    <td>{product.height + 'cm'}</td>
                                    <td>{product.color}</td>
                                    <td>{product.measure + 'm²'}</td>
                                    <td>{'R$ ' + product.cost}</td>
                                    <OverlayTrigger
                                        container={this}
                                        trigger={["hover", "focus"]}
                                        placement="right"
                                        overlay={
                                        <Popover id="popover-installments" title="Parcelamento">
                                            <Popover.Body>
                                            {product.installments && product.installments.length > 0 ? (
                                                <ul className="list-group list-group-flush">
                                                {product.installments.map((installment, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-1 px-2">
                                                        <span>{index + 1}x:</span>
                                                        <strong>R$ {installment}</strong>
                                                    </li>
                                                ))}
                                                </ul>
                                            ) : (
                                                <p className="text-center mb-0 text-muted">Nenhum parcelamento disponível</p>
                                            )}
                                            </Popover.Body>
                                        </Popover>
                                        }
                                    >
                                    <td>{'R$ ' + product.price}</td>
                                    </OverlayTrigger>
                                    <td>{'R$ ' + product.profit}</td>
                                    <td>{product.kit}</td>
                                </tr>
                            )}
                        {!products &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="spinner-border spinner-border-lg align-center"></div>
                                </td>
                            </tr>
                        }
                        {products && !products.length &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="p-2">Nenhum produto encontrado</div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
} 