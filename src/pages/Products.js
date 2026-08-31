import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import '../styles/Products.css';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  quantityAvailable: '',
};

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFromClover = async () => {
    setSyncStatus('Syncing...');
    try {
      const response = await productService.syncFromClover();
      setSyncStatus(`Synced ${response.data.count} products`);
      loadProducts();
    } catch (err) {
      setSyncStatus('Sync failed');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      category: product.category || '',
      imageUrl: product.image_url || '',
      quantityAvailable: product.quantity_available ?? '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError('Product name is required');
      return;
    }
    const priceValue = parseFloat(form.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setFormError('Please enter a valid price');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: priceValue,
      category: form.category.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      quantityAvailable: form.quantityAvailable === '' ? 0 : parseInt(form.quantityAvailable, 10),
    };

    setSaving(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      closeModal();
      loadProducts();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await productService.deleteProduct(product.id);
      loadProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products</h1>
        <div className="products-header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Product
          </button>
          <button className="btn btn-secondary" onClick={handleSyncFromClover}>
            Sync from Clover
          </button>
        </div>
      </div>

      {syncStatus && <p className="sync-status">{syncStatus}</p>}
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No products yet. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.quantity_available}</td>
                    <td>
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="product-thumb" />
                      )}
                    </td>
                    <td>
                      <button className="btn btn-small btn-secondary" onClick={() => openEditModal(product)}>
                        Edit
                      </button>
                      <button className="btn btn-small btn-danger" onClick={() => handleDelete(product)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>

            {formError && <p className="error-message">{formError}</p>}

            <form onSubmit={handleSubmit}>
              <label>
                Name *
                <input type="text" name="name" value={form.name} onChange={handleFormChange} required />
              </label>

              <label>
                Description
                <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} />
              </label>

              <div className="form-row">
                <label>
                  Price *
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                <label>
                  Quantity Available
                  <input
                    type="number"
                    name="quantityAvailable"
                    min="0"
                    value={form.quantityAvailable}
                    onChange={handleFormChange}
                  />
                </label>
              </div>

              <label>
                Category
                <input type="text" name="category" value={form.category} onChange={handleFormChange} />
              </label>

              <label>
                Image URL
                <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleFormChange} />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
