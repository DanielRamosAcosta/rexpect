import { AssertionError } from "node:assert"

export function expect(actual: unknown) {
  const toThrow = function (expected?: unknown) {
    if (typeof actual === "function") {
      let errorThrown = null as any as Error
      try {
        actual()
      } catch (error) {
        errorThrown = error as any as Error
      }

      if (!errorThrown) {
        throw new AssertionError({
          message: `expected [Function ${actual.name}] to throw an error`,
          stackStartFn: toThrow,
        })
      }

      if (expected) {
        if (typeof expected === "function") {
          if (!(errorThrown instanceof expected)) {
            throw new Error(`expected error to be instance of ${expected.name}`)
          }
        }
        if (typeof expected === "string") {
          if (errorThrown.message !== expected) {
            throw new Error(
              `expected [Function ${actual.name}] to throw error including '${expected}' but got '${errorThrown.message}'`,
            )
          }
        }
      }
    }
  }
  return {
    toThrow: toThrow,
  }
}
