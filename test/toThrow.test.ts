import { it, describe } from "node:test"
import { expect } from "../src/rexpect.js"
import assert, { AssertionError } from "node:assert"

describe("toThrow", () => {
  describe("without arguments", () => {
    it("throws if given function does not throw", () => {
      const fn = () => {}

      const failingFn = () => expect(fn).toThrow()

      expect(failingFn).toThrow()
    })

    it("does not throw if given function does throws", () => {
      const fn = () => {
        throw new Error("fail")
      }

      expect(fn).toThrow()
    })

    it("throws an assertion error", () => {
      const fn = () => {}

      const failingFn = () => expect(fn).toThrow()

      expect(failingFn).toThrow(AssertionError)
    })

    it("displays a meaningful message", () => {
      const fn = () => {}

      const failingFn = () => expect(fn).toThrow()

      expect(failingFn).toThrow("expected [Function fn] to throw an error")
    })

    it("displays function name", () => {
      function hello() {}

      const failingFn = () => expect(hello).toThrow()

      expect(failingFn).toThrow("expected [Function hello] to throw an error")
    })

    it("does not show the full stacktrace", () => {
      const fn = () => {}

      let error = null as any as AssertionError
      try {
        expect(fn).toThrow()
      } catch (e) {
        error = e as any as AssertionError
      }

      assert(
        !error.stack?.includes("rexpect/src"),
        "stacktrace should not include rexpect/src",
      )
    })
  })

  describe("passing an error class", () => {
    it("fails if the instance of the error is not the same", () => {
      const fn = () => {
        throw new Error("fail")
      }

      const failingFn = () => expect(fn).toThrow(AssertionError)

      expect(failingFn).toThrow()
    })

    it("does not fail if error is the same", () => {
      const fn = () => {
        throw new Error("fail")
      }

      expect(fn).toThrow(Error)
    })

    it("prints the name of the expected error", () => {
      const fn = () => {
        throw new Error("fail")
      }

      const failingFn = () => expect(fn).toThrow(SyntaxError)

      expect(failingFn).toThrow("expected error to be instance of SyntaxError")
    })
  })

  describe("passing a string", () => {
    it("fails if given message is not the same", () => {
      const fn = () => {
        throw new Error("hello")
      }

      const failingFn = () => expect(fn).toThrow("world")

      expect(failingFn).toThrow()
    })

    it("does not fail if message is the same", () => {
      const fn = () => {
        throw new Error("hello")
      }

      expect(fn).toThrow("hello")
    })

    it("prints the right message in the test", () => {
      const fn = () => {
        throw new Error("error message")
      }

      const failingFn = () => expect(fn).toThrow("expected message")

      expect(failingFn).toThrow(
        "expected [Function fn] to throw error including 'expected message' but got 'error message'",
      )
    })
  })
})
