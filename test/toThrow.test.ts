import { it, describe } from "node:test"
import { expect } from "../src/rexpect.js"

describe("toThrow", () => {
  it("throws if given function does not throw", () => {
    const fn = () => {}

    let hasThrown = false
    try {
      expect(fn).toThrow()
    } catch (error) {
      hasThrown = true
    }

    if (!hasThrown) {
      throw new Error("It should have thrown an exception")
    }
  })

  it("does not throw if given function does throws", () => {
    const fn = () => {
      throw new Error("fail")
    }

    expect(fn).toThrow()
  })
})
