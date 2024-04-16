import assert, { AssertionError } from "node:assert"

export function expect(actual: unknown) {
  let toThrow = function () {
    if (typeof actual === "function") {
      let hasThrown = false
      try {
        actual()
      } catch (error) {
        hasThrown = true
      }

      if (!hasThrown) {
        throw new AssertionError({
          message: `expected [Function fn] to throw an error`,
          stackStartFn: toThrow,
        })
      }
    }
  }
  return {
    toThrow: toThrow,
  }
}
