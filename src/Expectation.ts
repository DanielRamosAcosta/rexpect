import { StackStartFn } from "./StackStartFn.js"

export type Expectation<Expected> = (
  actual: unknown,
) => (stackStartFn: StackStartFn) => (expected?: Expected) => void
