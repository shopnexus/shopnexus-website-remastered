import React, { useCallback, useRef } from 'react'
import * as Tippy from 'tippy.js'

import { defaultOptions } from './core'

export const useGroupTippy = (
  options: Partial<Tippy.CreateSingletonProps> = {}
) => {
  const [tippyInstances, setTippyInstances] = React.useState<Tippy.Instance[]>(
    []
  )
  const singleton = useRef<Tippy.CreateSingletonInstance>(null)

  const addTippy = useCallback((tippyInstance: Tippy.Instance) => {
    setTippyInstances((tippyInstances) => [...tippyInstances, tippyInstance])
    return () => {
      setTippyInstances((tippyInstances) =>
        tippyInstances.filter((instance) => instance !== tippyInstance)
      )
      tippyInstance.hide()
      tippyInstance.destroy()
    }
  }, [])

  React.useEffect(() => {
    if (tippyInstances && tippyInstances.length > 0) {
      const localSingleton = Tippy.createSingleton(tippyInstances, {
        ...defaultOptions,
        ...options,
        theme: 'tooltip-theme',
        placement: 'right',
        moveTransition: 'transform 0.2s ease-out',
        overrides: ['placement', 'theme'],
      })

      singleton.current = localSingleton
      return () => {
        localSingleton.destroy()
      }
    }
  }, [options, tippyInstances])

  return { addTippy }
}
