import { AssertionError } from "node:assert"

export function expect(actual: unknown) {
  return {
    toThrow() {
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
          })
        }
      }
    },
  }
}
