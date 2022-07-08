import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./CurrentCity";

test("renders Current City", () => {
  render(<App />);
  const linkElement = screen.getByText(/Jakarta/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders the gmt info", () => {
  render(<App />);
  const linkElement = screen.getByText(/Timezone: GMT\+7/i);
  expect(linkElement).toBeInTheDocument();
});
