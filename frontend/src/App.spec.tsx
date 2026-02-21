import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import App from "./pages/App";

describe("App routing", () => {
  it("renderiza layout de chat por padrão", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(getByText("RoKa Zap")).toBeDefined();
  });
});

