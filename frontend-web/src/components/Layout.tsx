import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  canAccessCustomers,
  canAccessManagers,
  canAccessLocations,
  isScopedAdmin,
} from "../auth/rbac";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const showCustomers = canAccessCustomers(user);
  const showManagers = canAccessManagers(user);
  const showLocations = canAccessLocations(user);
  const showFilteredBadge = isScopedAdmin(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
    }`;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-gray-200 bg-gray-50 p-4">
        <nav className="space-y-1">
          {showCustomers && (
            <NavLink to="/customers" className={navLinkClass}>
              Customers
            </NavLink>
          )}
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
          {showManagers && (
            <NavLink to="/managers" className={navLinkClass}>
              Managers
            </NavLink>
          )}
          {showLocations && (
            <NavLink to="/locations" className={navLinkClass}>
              Locations
            </NavLink>
          )}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <span className="rounded bg-gray-200 px-2 py-0.5 text-sm text-gray-700">
              {user?.role}
              {user?.type ? ` / ${user.type}` : ""}
            </span>
            {showFilteredBadge && (
              <span className="text-xs text-amber-600">(filtered)</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
