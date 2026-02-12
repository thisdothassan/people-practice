import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import { getOrders, getOrder } from "../api/orders";
import type { Order } from "../api/types";

function OrdersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getOrders()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load orders",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setSelectedOrder(null);
      return;
    }
    const numId = Number(id);
    if (Number.isNaN(numId)) return;
    getOrder(numId)
      .then(setSelectedOrder)
      .catch(() => setSelectedOrder(null));
  }, [id]);

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Orders</h1>
      <DataTable<Order>
        columns={[
          { key: "id", label: "ID" },
          {
            key: "customer_id",
            label: "Customer ID",
            render: (o) => o.customer_id ?? o.customer?.id ?? "-",
          },
          {
            key: "location_id",
            label: "Location ID",
            render: (o) => o.location_id ?? o.location?.id ?? "-",
          },
          { key: "status", label: "Status", render: (o) => o.status ?? "-" },
          {
            key: "total",
            label: "Total",
            render: (o) => (o.total != null ? String(o.total) : "-"),
          },
        ]}
        data={orders}
        keyExtractor={(o) => o.id}
        loading={loading}
        emptyMessage="No orders to display"
        onRowClick={(o) => navigate(`/orders/${o.id}`)}
      />
      {selectedOrder && (
        <div className="mt-6 rounded border border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-2 font-medium">Order {selectedOrder.id} details</h2>
          <pre className="overflow-auto text-sm text-gray-700">
            {JSON.stringify(selectedOrder, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
