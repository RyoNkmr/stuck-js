export const noop = (): void => {}

export const stableSort = <T>(
  array: readonly T[],
  compareFunction: (one: T, theOther: T) => number
): T[] =>
  array
    .map((item, index): { item: T; index: number } => ({ item, index }))
    .sort(
      (before, after): number => {
        const result = compareFunction(before.item, after.item)
        return result !== 0 ? result : before.index - after.index
      }
    )
    .map(({ item }): T => item)
