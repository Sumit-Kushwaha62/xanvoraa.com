import { useEffect, useState } from 'react'

export default function useDeferredVideo(delay = 1500) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData
    if (reducedMotion || saveData) return undefined

    let timer
    const scheduleVideo = () => {
      timer = window.setTimeout(() => setShouldLoad(true), delay)
    }

    if (document.readyState === 'complete') {
      scheduleVideo()
    } else {
      window.addEventListener('load', scheduleVideo, { once: true })
    }

    return () => {
      window.removeEventListener('load', scheduleVideo)
      window.clearTimeout(timer)
    }
  }, [delay])

  return shouldLoad
}
