import { describe, expect, test } from "vitest";

import { createHistory } from "../../src/lib/history";

describe("createHistory", () => {
  test("starts empty", () => {
    const history = createHistory();

    expect(history.current).toBeUndefined();
    expect(history.canGoBack).toBe(false);
    expect(history.canGoForward).toBe(false);
    expect(history.position).toEqual({ index: 0, total: 0 });
  });

  test("records the pushed seeds", () => {
    const history = createHistory();

    history.push(1);
    history.push(2);

    expect(history.current).toBe(2);
    expect(history.position).toEqual({ index: 2, total: 2 });
    expect(history.canGoBack).toBe(true);
    expect(history.canGoForward).toBe(false);
  });

  test("goes back and forth", () => {
    const history = createHistory();

    history.push(1);
    history.push(2);
    history.push(3);

    expect(history.back()).toBe(2);
    expect(history.back()).toBe(1);
    expect(history.canGoBack).toBe(false);
    expect(history.back()).toBe(1);

    expect(history.forward()).toBe(2);
    expect(history.forward()).toBe(3);
    expect(history.canGoForward).toBe(false);
    expect(history.forward()).toBe(3);
  });

  test("drops the entries after the current one when pushing", () => {
    const history = createHistory();

    history.push(1);
    history.push(2);
    history.push(3);
    history.back();
    history.back();
    history.push(9);

    expect(history.position).toEqual({ index: 2, total: 2 });
    expect(history.canGoForward).toBe(false);
    expect(history.back()).toBe(1);
  });

  test("ignores the seed that is already current", () => {
    const history = createHistory();

    history.push(4);
    history.push(4);

    expect(history.position).toEqual({ index: 1, total: 1 });
  });

  test("keeps only the most recent entries", () => {
    const history = createHistory(3);

    for (const seed of [1, 2, 3, 4, 5]) history.push(seed);

    expect(history.position).toEqual({ index: 3, total: 3 });
    expect(history.back()).toBe(4);
    expect(history.back()).toBe(3);
    expect(history.canGoBack).toBe(false);
  });
});
