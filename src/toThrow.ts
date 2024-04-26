import { AssertionError } from "node:assert"
import { Expectation } from "./Expectation.js"

type Class<T> = new (...args: any) => T

export const toThrow: Expectation<Class<unknown> | string | undefined> =
  (actual) => (stackStartFn) => (expected) => {
    if (typeof actual === "function") {
      let errorThrown = null as unknown
      try {
        actual()
      } catch (error) {
        errorThrown = error
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
          if (errorThrown instanceof Error) {
            if (errorThrown.message !== expected) {
              throw new Error(
                `expected [Function ${actual.name}] to throw error including '${expected}' but got '${errorThrown.message}'`,
              )
            }
          }
        }
      }
    }
  }
