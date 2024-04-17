import assert, { AssertionError } from "node:assert"

function toThrowPrivate(actual: any, expected: any, root: any) {
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
        stackStartFn: root,
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

export function expect(actual: unknown) {
  const toThrow = (expected?: any) => toThrowPrivate(actual, expected, toThrow)
  return {
    toThrow,
  }
}

function createExtended<
  T extends Record<string, (actual: any, expected: any) => void>,
>(otherFns: T) {
  const foo = Object.entries(otherFns).map(([key, value]) => {
    return [key, curry(value)]
  })

  return (actual: any) => {
    const extended = foo.map(([key, value]) => {
      return [key, value(actual)]
    })

    const bar = Object.fromEntries(extended)

    return {
      ...bar,
      ...expect(actual),
    }
  }
}

type CurriedFunction<T> = T extends (...args: infer Args) => infer Return
  ? Args extends [infer First, ...infer Rest]
    ? (arg: First) => CurriedFunction<(...rest: Rest) => Return>
    : T
  : never;

type Curried<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? CurriedFunction<T[K]>
    : never;
};

function curry2<T extends Record<string, (...args: any[]) => any>>(obj: T): Curried<T> {
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const func = obj[key];
      result[key] = curryFunc(func);
    }
  }
  return result as Curried<T>;
}

function expandWithHello<T>(obj: T): (actual: any) => T & {
  toThrow: (param?: any) => void
} {
  return (actual: any) => ({
    ...obj,
    toThrow(expected?: any) {
      toThrowPrivate(actual, expected, this.toThrow)
    },
  })
}

// Usage
const expanded = expandWithHello({
  toBe: (actual: any, expected: any) => assert.equal(actual, expected),
})

expanded(1).toBe(1, 1)
expanded(1).toThrow()

function curry<T, U, V>(
  fn: (arg1: T, arg2: U) => V,
): (arg1: T) => (arg2: U) => V {
  return function (arg1: T) {
    return function (arg2: U) {
      return fn(arg1, arg2)
    }
  }
}

const extended = createExtended({
  toBe: (actual: any, expected: any) => {},
})

extended(1).toThrow()
extended(1)

/*

expect.extend((actual: any) => {
  return {
    toBe(expected: unknown) {
      assert.equal(actual, expected)
    },
  }
})
*/
