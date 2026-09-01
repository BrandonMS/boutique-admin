import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import '../styles/Orders.css';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (order, newStatus) => {
    let trackingUrl;
    if (newStatus === 'shipped') {
      trackingUrl = window.prompt('Enter the shipment tracking URL:', order.tracking_url || '');
      if (!trackingUrl) return;
    }

    try {
      await orderService.updateOrderStatus(order.id, newStatus, trackingUrl);
      loadOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  return (
    <div className="orders-page">
      <h1>Orders</h1>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>${order.total_amount}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="shipped">Shipped</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {order.tracking_url && (
                      <a href={order.tracking_url} target="_blank" rel="noreferrer">
                        Tracking Number
                      </a>
                    )}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <a href={`/orders/${order.id}`} className="btn btn-small">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
