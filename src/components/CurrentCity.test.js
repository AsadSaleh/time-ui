import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./CurrentCity";

test("renders Current City", () => {
  render(<App />);
  const linkElement = screen.getByText(/Jakarta/i);
  expect(linkElement).toBeInTheDocument();
});
