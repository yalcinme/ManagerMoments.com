"use client"

import { useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

interface UseParallaxOptions {
  intensity?: number
  enableMouse?: boolean
  enableScroll?: boolean
  springConfig?: {
    stiffness: number
    damping: number
    mass?: number
  }
}

export function useParallax({
  intensity = 0.5,
  enableMouse = true,
  enableScroll = true,
  springConfig = { stiffness: 150, damping: 25, mass: 0.5 },
}: UseParallaxOptions = {}) {
  const [isClient, setIsClient] = useState(false)

  // Motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const scrollY = useMotionValue(0)

  // Spring animations
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)
  const scrollYSpring = useSpring(scrollY, springConfig)

  // Transform values
  const parallaxX = useTransform(mouseXSpring, [-1, 1], [-20 * intensity, 20 * intensity])
  const parallaxY = useTransform(
    [mouseYSpring, scrollYSpring],
    ([mouse, scroll]) => mouse * 10 * intensity + scroll * 0.3 * intensity,
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !enableMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      const normalizedX = (e.clientX - centerX) / centerX
      const normalizedY = (e.clientY - centerY) / centerY

      mouseX.set(Math.max(-1, Math.min(1, normalizedX)))
      mouseY.set(Math.max(-1, Math.min(1, normalizedY)))
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient, enableMouse, mouseX, mouseY])

  useEffect(() => {
    if (!isClient || !enableScroll) return

    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      scrollY.set(scrollProgress * 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient, enableScroll, scrollY])

  return {
    parallaxX,
    parallaxY,
    mouseX: mouseXSpring,
    mouseY: mouseYSpring,
    scrollY: scrollYSpring,
    isClient,
  }
}
