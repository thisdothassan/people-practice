import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { canAccessLocations, isSuperAdmin } from "../auth/rbac";
import { DataTable } from "../components/DataTable";
import { getLocations, createLocation } from "../api/locations";
import type { Location } from "../api/types";

function LocationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!canAccessLocations(user)) {
      navigate("/orders");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!canAccessLocations(user)) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLocations()
      .then((locations) => {
        if (!cancelled) setData(locations);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load locations",
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
    setFormLoading(true);
    try {
      const loc = await createLocation({ name, code, country });
      setData((prev) => [...prev, loc]);
      setName("");
      setCode("");
      setCountry("");
      setShowForm(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create location",
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (!canAccessLocations(user)) {
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
        <h1 className="text-lg font-semibold">Locations</h1>
        {isSuperAdmin(user) && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add location"}
          </button>
        )}
      </div>
      {showForm && isSuperAdmin(user) && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded border border-gray-200 bg-gray-50 p-4"
        >
          {formError && (
            <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">
              {formError}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="rounded border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
              required
              className="rounded border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              required
              className="rounded border border-gray-300 px-3 py-2"
            />
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
      <DataTable<Location>
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name", render: (l) => l.name ?? "-" },
          { key: "code", label: "Code", render: (l) => l.code ?? "-" },
          { key: "country", label: "Country", render: (l) => l.country ?? "-" },
        ]}
        data={data}
        keyExtractor={(l) => l.id}
        loading={loading}
        emptyMessage="No locations to display"
      />
    </div>
  );
}

export default LocationsPage;
