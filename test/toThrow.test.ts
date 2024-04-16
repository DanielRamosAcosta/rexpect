import { it, describe } from "node:test"
import { expect } from "../src/rexpect.js"
import assert, { AssertionError } from "node:assert"

describe("toThrow", () => {
  it("throws if given function does not throw", () => {
    const fn = () => {}

    assert.throws(() => {
      expect(fn).toThrow()
    })
  })

  it("does not throw if given function does throws", () => {
    const fn = () => {
      throw new Error("fail")
    }

    expect(fn).toThrow()
  })

  it("throws an assertion error", () => {
    const fn = () => {}

    let error = null
    try {
      expect(fn).toThrow()
    } catch (e) {
      error = e
    }

    assert(error instanceof AssertionError)
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
})
