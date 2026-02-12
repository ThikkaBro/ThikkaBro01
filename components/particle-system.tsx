'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  type: 'petal' | 'star' | 'heart'
  size: number
  opacity: number
}

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []

    // Initialize particles (reduce on mobile)
    const initParticles = () => {
      particles.length = 0
      const particleCount = window.innerWidth < 768 ? 15 : 30
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle())
      }
    }

    const createParticle = (): Particle => {
      const types: Array<'petal' | 'star' | 'heart'> = ['petal', 'star', 'heart']
      const type = types[Math.floor(Math.random() * types.length)]

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.3 + 0.1,
        life: 1,
        type,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
      }
    }

    const drawPetal = (x: number, y: number, size: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = '#f4d6d6'
      ctx.beginPath()
      ctx.ellipse(x, y, size * 1.5, size, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawStar = (x: number, y: number, size: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = '#ffd700'
      const points = 5
      const outerRadius = size
      const innerRadius = size * 0.4

      ctx.beginPath()
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / points - Math.PI / 2
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = '#d4a574'
      
      const s = size
      ctx.beginPath()
      ctx.moveTo(x, y + s)
      ctx.bezierCurveTo(
        x - s * 2, y + s * 0.5,
        x - s * 2.5, y - s * 0.5,
        x - s * 1.25, y - s * 1.25
      )
      ctx.bezierCurveTo(
        x - s * 0.5, y - s * 2,
        x + s * 0.5, y - s * 2,
        x, y - s * 0.75
      )
      ctx.bezierCurveTo(
        x - s * 0.5, y - s * 2,
        x + s * 0.5, y - s * 2,
        x + s * 1.25, y - s * 1.25
      )
      ctx.bezierCurveTo(
        x + s * 2.5, y - s * 0.5,
        x + s * 2, y + s * 0.5,
        x, y + s
      )
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(11, 1, 10, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y -= p.vy
        p.life -= 0.002
        p.opacity = p.life * 0.7

        if (p.type === 'petal') {
          drawPetal(p.x, p.y, p.size, p.opacity)
        } else if (p.type === 'star') {
          drawStar(p.x, p.y, p.size, p.opacity)
        } else {
          drawHeart(p.x, p.y, p.size, p.opacity)
        }

        if (p.life <= 0 || p.y < -20) {
          particles[i] = createParticle()
        }
      }

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    initParticles()
    animate()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
