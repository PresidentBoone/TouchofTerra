import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { RevealOnScroll } from "./RevealOnScroll";

it("always renders its children (motion never hides content)", () => {
  render(
    <RevealOnScroll>
      <p>hello terra</p>
    </RevealOnScroll>,
  );
  expect(screen.getByText("hello terra")).toBeInTheDocument();
});
