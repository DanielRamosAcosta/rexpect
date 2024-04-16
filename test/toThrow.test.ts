import { it, describe } from "node:test"
import { expect } from "../src/rexpect.js"
import assert, { AssertionError } from "node:assert"

describe("toThrow", () => {
  it("throws if given function does not throw", () => {
    const fn = () => {}

    expect(() => expect(fn).toThrow()).toThrow()
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

  it("does not show the full stacktrace", () => {
    const fn = () => {}

    let error = null as any as AssertionError
    try {
      expect(fn).toThrow()
    } catch (e) {
      error = e as any as AssertionError
    }

    const expectedStack = `AssertionError [ERR_ASSERTION]: expected [Function fn] to throw an error
    at TestContext.<anonymous> (file:///Users/danielramos/Documents/repos/mines/rexpect/test/toThrow.test.ts:48:24)
    at Test.runInAsyncScope (node:async_hooks:206:9)
    at Test.run (node:internal/test_runner/test:639:25)
    at Suite.processPendingSubtests (node:internal/test_runner/test:382:18)
    at Test.postRun (node:internal/test_runner/test:730:19)
    at Test.run (node:internal/test_runner/test:688:12)
    at async Suite.processPendingSubtests (node:internal/test_runner/test:382:7)`
    assert.equal(error.stack, expectedStack)
  })
})
