'use client'

import { useEffect, useRef } from 'react'

export function MagicDustEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{ x: number; y: number; life: number; vx: number; vy: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = particlesRef.current
    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Create new particles
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          life: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
        })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY }

        // Create new particles
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: touch.clientX + (Math.random() - 0.5) * 10,
            y: touch.clientY + (Math.random() - 0.5) * 10,
            life: 1,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
          })
        }
      }
    }

    const animate = () => {
      // Clear with transparency to create trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity
        p.life -= 0.02

        const opacity = Math.max(0, p.life)

        // Draw sparkle
        ctx.save()
        ctx.globalAlpha = opacity
        ctx.fillStyle = '#ffd700'

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3)
        gradient.addColorStop(0, '#ffd700')
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6)

        // Inner sparkle
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2)

        ctx.restore()

        if (p.life <= 0) {
          particles.splice(i, 1)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('resize', handleResize)

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 40 }}
    />
  )
}
