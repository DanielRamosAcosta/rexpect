import { AssertionError } from "node:assert"

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

function toEntries<T extends object>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}

type StackStartFn = (fn: () => void) => void

type Expectation<Expected> = (
  actual: unknown,
) => (stackStartFn: StackStartFn) => (expected: Expected) => void

function createExpect<
  Obj extends {
    [K in keyof Obj]: Expectation<Parameters<ReturnType<ReturnType<Obj[K]>>>[0]>
  },
>(
  expectations: Obj,
): (actual: unknown) => {
  [K in keyof Obj]: ReturnType<ReturnType<Obj[K]>>
} {
  return function (actual: any) {
    const expectationEntries = toEntries(expectations)

    const entries = expectationEntries
      .map(([key, value]) => [key, value(actual)] as const)
      .map(([key, fn]) => [key, fn(fn)] as const)

    return Object.fromEntries(entries) as any
  }
}

const toThrow: Expectation<ErrorConstructor | string> =
  (actual) => (stackStartFn) => (expected) => {
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

export const expect = createExpect({
  toThrow,
})
