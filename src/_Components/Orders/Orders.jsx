import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get('/orders');
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-[70vh]">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border p-6 rounded bg-white shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                <span className={`px-3 py-1 rounded font-bold text-white ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-orange-500'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.productName || 'Product'}</span>
                      <span className="font-medium">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t text-right">
                <p className="text-xl font-bold">Total: ${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
