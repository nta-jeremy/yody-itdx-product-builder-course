import * as React from "react"

const MOBILE_BREAKPOINT = 768

/** useIsMobile — viewport < 768px hook (shadcn/ui open-code).
 *  Returns false during SSR and initial hydration to avoid mismatch,
 *  then resolves to the real value after mount. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}