import { describe, it, expect } from "vitest";
import { estimationToMinutes } from "./estimation-to-minutes";

describe("estimationToMinutes", () => {
  it("returns 0 for an empty or invalid string", () => {
    expect(estimationToMinutes("")).toBe(0);
    expect(estimationToMinutes("abc")).toBe(0);
  });

  it("converts every unit", () => {
    expect(estimationToMinutes("1w")).toBe(5 * 8 * 60);
    expect(estimationToMinutes("1d")).toBe(8 * 60);
    expect(estimationToMinutes("2h")).toBe(120);
    expect(estimationToMinutes("90m")).toBe(90);
  });

  it("sums units separated by spaces", () => {
    expect(estimationToMinutes("1w 2d 3h 4m")).toBe(2400 + 960 + 180 + 4);
  });

  it("does not drop units written without spaces", () => {
    expect(estimationToMinutes("1w2d")).toBe(2400 + 960);
  });
});
