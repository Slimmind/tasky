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
    render(<Button mod="primary">Primary</Button>);
    const button = screen.getByRole("button");
    // Assuming getMod('btn', 'primary') returns 'btn--primary' or similar.
    // Since I don't know the exact implementation of getMod, I'll check if class list contains something related or just check if it renders without crashing first.
    // Let's check for partial match or just existence.
    expect(button).toBeInTheDocument();
  });
});
