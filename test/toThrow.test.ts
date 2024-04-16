import { it, describe } from "node:test"
import { expect } from "../src/rexpect.js"
import assert, { AssertionError } from "node:assert"

describe("toThrow", () => {
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

    let error = null as any as AssertionError
    try {
      expect(fn).toThrow()
    } catch (e) {
      error = e as any as AssertionError
    }

    assert.equal(error.message, "expected [Function fn] to throw an error")
  })

  it("displays function name", () => {
    function hello() {}

    let error = null as any as AssertionError
    try {
      expect(hello).toThrow()
    } catch (e) {
      error = e as any as AssertionError
    }

    assert.equal(error.message, "expected [Function hello] to throw an error")
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

  it("fails if the instance of the error is not the same", () => {
    const fn = () => {
      throw new Error("fail")
    }

    let error = null as any as AssertionError
    try {
      expect(fn).toThrow(AssertionError)
    } catch (e) {
      error = e as any as AssertionError
    }

    assert.equal(
      error.message,
      "expected error to be instance of AssertionError",
    )
  })

  it("prints the name of the expected error", () => {
    const fn = () => {
      throw new Error("fail")
    }

    let error = null as any as SyntaxError
    try {
      expect(fn).toThrow(SyntaxError)
    } catch (e) {
      error = e as any as SyntaxError
    }

    assert.equal(error.message, "expected error to be instance of SyntaxError")
  })

  it("does not fail if error is the same", () => {
    const fn = () => {
      throw new Error("fail")
    }

    expect(fn).toThrow(Error)
  })
})
