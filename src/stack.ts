import type { Sticky } from './sticky'

/**
 * 生きている sticky と、そのうち積み上げに参加しているものを保持する。
 *
 * position: sticky そのものはブラウザが処理するので、ここでやることは
 * 「各要素が固定される top を、上に積まれる要素の高さから決める」ことだけ。
 * スクロール中の追従はブラウザ任せなので scroll ハンドラも rAF も持たない。
 */
const registry: Sticky[] = []
const stack: Sticky[] = []

/** DOM 上で先に現れる方を先頭にする */
const byDocumentOrder = (one: Sticky, theOther: Sticky): number =>
  one.element.compareDocumentPosition(theOther.element) &
  Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1

/** すでに stuck-js の管理下にある要素。二重登録を避けるために使う */
export const registeredElements = (): readonly HTMLElement[] =>
  registry.map(sticky => sticky.element)

export const stacked = (): readonly Sticky[] => stack

export const recalculate = (): void => {
  // 高さをまとめて読んでから top をまとめて書く。交互にやると
  // 書き込みがレイアウトを無効化し、次の読み取りで再計算が走ってしまう
  const heights = stack.map(
    sticky => sticky.element.getBoundingClientRect().height
  )
  let ceiling = 0
  stack.forEach((sticky, index): void => {
    const offsetTop = sticky.options.marginTop + ceiling
    sticky.offsetTop = offsetTop
    ceiling = offsetTop + heights[index]
  })
}

export const register = (sticky: Sticky): void => {
  if (!registry.includes(sticky)) {
    registry.push(sticky)
  }
}

export const join = (...stickies: Sticky[]): void => {
  const added = stickies.filter(sticky => !stack.includes(sticky))
  if (added.length === 0) {
    return
  }
  stack.push(...added)
  stack.sort(byDocumentOrder)
  recalculate()
}

export const unregister = (...stickies: Sticky[]): void => {
  const keptInRegistry = registry.filter(sticky => !stickies.includes(sticky))
  registry.length = 0
  registry.push(...keptInRegistry)

  const keptInStack = stack.filter(sticky => !stickies.includes(sticky))
  if (keptInStack.length === stack.length) {
    return
  }
  stack.length = 0
  stack.push(...keptInStack)
  recalculate()
}

/** 登録されているものをすべて破棄して初期状態に戻す */
export const destroyAll = (): void => {
  for (const sticky of [...registry]) {
    sticky.destroy()
  }
  registry.length = 0
  stack.length = 0
}
