import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { canAccessManagers } from "../auth/rbac";
import { DataTable } from "../components/DataTable";
import { getManagers, createManager } from "../api/managers";
import type { Manager } from "../api/types";

const STATIC_LOCATIONS = [
  {
    id: 1,
    name: "United States",
  },
  {
    id: 2,
    name: "United Kingdom",
  },
  {
    id: 3,
    name: "Germany",
  },
  {
    id: 4,
    name: "Japan",
  },
] as const;

const STATIC_PRODUCTS = [
  { id: 1, name: "Product A" },
  { id: 2, name: "Product B" },
  { id: 3, name: "Product C" },
] as const;

type ManagerType = "super" | "location" | "product";

function ManagersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<ManagerType>("super");
  const [locationIds, setLocationIds] = useState<number[]>([]);
  const [productIds, setProductIds] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!canAccessManagers(user)) {
      navigate("/orders");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!canAccessManagers(user)) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getManagers()
      .then((managers) => {
        if (!cancelled) setData(managers);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load managers",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!password) {
      setFormError("Password is required");
      return;
    }
    setFormLoading(true);
    try {
      const m = await createManager({
        email,
        password,
        type,
        location_ids: type === "location" ? locationIds : undefined,
        product_ids: type === "product" ? productIds : undefined,
      });
      setData((prev) => [...prev, m]);
      setEmail("");
      setPassword("");
      setType("super");
      setLocationIds([]);
      setProductIds([]);
      setShowForm(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create manager",
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (!canAccessManagers(user)) {
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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Managers</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add manager"}
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded border border-gray-200 bg-gray-50 p-4"
        >
          {formError && (
            <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ManagerType)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="super">Super admin</option>
                <option value="location">Location admin</option>
                <option value="product">Product admin</option>
              </select>
            </div>
            <div className="space-y-3">
              {type === "location" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Locations
                  </label>
                  <select
                    multiple
                    value={locationIds.map(String)}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions).map(
                        (opt) => Number(opt.value),
                      );
                      setLocationIds(values);
                    }}
                    className="h-24 w-full rounded border border-gray-300 px-3 py-2"
                  >
                    {STATIC_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {type === "product" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Products
                  </label>
                  <select
                    multiple
                    value={productIds.map(String)}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions).map(
                        (opt) => Number(opt.value),
                      );
                      setProductIds(values);
                    }}
                    className="h-24 w-full rounded border border-gray-300 px-3 py-2"
                  >
                    {STATIC_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {formLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}
      <DataTable<Manager>
        columns={[
          { key: "id", label: "ID" },
          { key: "email", label: "Email" },
          { key: "type", label: "Type", render: (m) => m.type ?? "-" },
          {
            key: "scopes",
            label: "Scopes",
            render: (m) =>
              Array.isArray(m.scopes) ? m.scopes.join(", ") : "-",
          },
        ]}
        data={data}
        keyExtractor={(m) => m.id}
        loading={loading}
        emptyMessage="No managers to display"
      />
    </div>
  );
}

export default ManagersPage;
