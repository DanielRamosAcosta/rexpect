import { Expectation } from "./Expectation.js"
import { toEntries } from "./utils/toEntries.js"

export function createExpect<
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
