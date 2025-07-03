import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services';

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    type: '',
    color: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await productService.create(form);
      navigate('/products');
    } catch (err) {
      setError('Erro ao adicionar produto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Adicionar Produto</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <input name="type" value={form.type} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Cor</label>
          <input name="color" value={form.color} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Preço</label>
          <input name="price" value={form.price} onChange={handleChange} className="form-control" type="number" min="0" step="0.01" required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
} 