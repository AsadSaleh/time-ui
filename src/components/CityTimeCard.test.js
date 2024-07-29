import React from "react";
import { render, screen } from "@testing-library/react";
import CityTimeCard from "./CityTimeCard";

test("renders City Time Card", () => {
  render(
    <CityTimeCard label="Some Label for Example" location="Asia/Singapore" />
  );
  const linkElement = screen.getByText(/Some Label for Example/i);
  expect(linkElement).toBeInTheDocument();
});
