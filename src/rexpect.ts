import { AssertionError } from "node:assert"

type Expector = (
  actual?: any,
) => (expected?: any) => (stackStartFn: any) => void

type Expectors<T extends string> = Record<T, Expector>

function createExpect<T extends string>(expectors: Expectors<T>) {
  return function (actual: unknown) {
    // @ts-ignore
    const toThrow = expectors.toThrow(actual)

    return {
      toThrow: toThrow(toThrow),
    }
  }
}

export const expect = createExpect({
  toThrow:
    (actual: () => unknown) =>
    (stackStartFn) =>
    (expected?: ErrorConstructor | string) => {
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
            stackStartFn,
          })
        }

        if (expected) {
          if (typeof expected === "function") {
            if (!(errorThrown instanceof expected)) {
              throw new Error(
                `expected error to be instance of ${expected.name}`,
              )
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
    },
})
