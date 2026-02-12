import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { PrivateRoute } from "./PrivateRoute";

function ProtectedContent() {
  return <div>Protected content</div>;
}

function LoginPage() {
  return <div>Login page</div>;
}

function renderWithRouter(initialRoute = "/protected") {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedContent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("PrivateRoute", () => {
  it("redirects unauthenticated users to login", async () => {
    localStorage.clear();
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText("Login page")).toBeInTheDocument();
    });
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
