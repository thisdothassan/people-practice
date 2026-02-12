import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import { getCustomers } from "../api/customers";
import type { Customer } from "../api/types";
import { useAuth } from "../auth/useAuth";
import { canAccessCustomers } from "../auth/rbac";

function CustomersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canAccessCustomers(user)) {
      navigate("/orders");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!canAccessCustomers(user)) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCustomers()
      .then((customers) => {
        if (!cancelled) setData(customers);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load customers",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!canAccessCustomers(user)) {
    return null;
  }

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Customers</h1>
      <DataTable<Customer>
        columns={[
          { key: "id", label: "ID" },
          { key: "email", label: "Email" },
          {
            key: "location_id",
            label: "Location ID",
            render: (c) => c.location_id ?? "-",
          },
        ]}
        data={data}
        keyExtractor={(c) => c.id}
        loading={loading}
        emptyMessage="No customers to display"
      />
    </div>
  );
}

export default CustomersPage;
