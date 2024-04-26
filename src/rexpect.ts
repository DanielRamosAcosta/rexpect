import { AssertionError } from "node:assert"

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

function toEntries<T extends object>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}

type Expectation = (
  actual: any,
) => (stackStartFn: any) => (expected?: any) => void

type ExpectObject<Obj> = Record<keyof Obj, (expected?: any) => void>

function createExpect<Obj>(
  expectations: Record<keyof Obj, Expectation>,
): (actual: any) => ExpectObject<Obj> {
  return function (actual: any) {
    const expectationEntries = toEntries(expectations)

    const entries = expectationEntries
      .map(([key, value]) => [key, value(actual)] as const)
      .map(([key, fn]) => [key, fn(fn)] as const)

    return Object.fromEntries(entries) as ExpectObject<Obj>
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

expect(2).toThrow(3)
