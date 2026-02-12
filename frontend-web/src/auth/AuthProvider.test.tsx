import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./useAuth";

function TestConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : "none"}</span>
      <button
        type="button"
        onClick={() =>
          login(
            { id: 1, email: "test@example.com", role: "customer" },
            "token123",
          )
        }
      >
        Login
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no user", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("login updates user and token", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </BrowserRouter>,
    );
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Login" }));
    });
    expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
    expect(localStorage.getItem("people-practice-auth")).toBeTruthy();
  });

  it("logout clears user and storage", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </BrowserRouter>,
    );
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Login" }));
    });
    expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Logout" }));
    });
    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(localStorage.getItem("people-practice-auth")).toBeNull();
  });
});
