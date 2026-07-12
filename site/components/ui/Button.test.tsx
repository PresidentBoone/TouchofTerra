import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { Button } from "./Button";

it("renders a native button with its label", () => {
  render(<Button>Donate</Button>);
  expect(screen.getByRole("button", { name: "Donate" })).toBeInTheDocument();
});

it("renders as a link when href is provided", () => {
  render(<Button href="/donate">Donate</Button>);
  expect(screen.getByRole("link", { name: "Donate" })).toHaveAttribute(
    "href",
    "/donate",
  );
});
