import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button element by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn");
  });

  it("renders an anchor element when href is provided", () => {
    render(<Button href="/test">Link</Button>);
    const link = screen.getByRole("link", { name: /link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("btn");
  });

  it("applies modifier classes", () => {
    render(<Button mod="primary wide">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn", "btn--primary", "btn--wide");
  });

  it("does not leak 'undefined' into the class list", () => {
    render(<Button>Plain</Button>);
    expect(screen.getByRole("button").className).toBe("btn");
  });
});
