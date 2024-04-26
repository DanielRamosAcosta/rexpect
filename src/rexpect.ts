import { createExpect } from "./createExpect.js"
import { toThrow } from "./toThrow.js"

export const expect = createExpect({ toThrow })
