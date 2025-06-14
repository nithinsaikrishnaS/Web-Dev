"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface MobileDetectorProps {
  mobileComponent: React.ComponentType<any>
  desktopComponent: React.ComponentType<any>
  componentProps?: any
}

export function MobileDetector({
  mobileComponent: MobileComponent,
  desktopComponent: DesktopComponent,
  componentProps = {},
}: MobileDetectorProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return isMobile ? <MobileComponent {...componentProps} /> : <DesktopComponent {...componentProps} />
}
