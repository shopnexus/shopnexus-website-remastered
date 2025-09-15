import 'tippy.js/animations/shift-toward-subtle.css'

import tippy, { type CreateSingletonProps } from 'tippy.js'

export const defaultOptions: Partial<CreateSingletonProps> = {
  animation: 'shift-toward-subtle',
  theme: 'tooltip-theme',
  arrow: true,
  duration: 200,
}

export const createTippy = (
  el: HTMLElement,
  options: Partial<CreateSingletonProps> = {}
) => {
  const instance = tippy(el, {
    ...defaultOptions,
    ...options,
  })

  return instance
}
