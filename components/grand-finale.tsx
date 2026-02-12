'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GrandFinaleProps {
  isActive: boolean
}

export function GrandFinale({ isActive }: GrandFinaleProps) {
  const [showContent, setShowContent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isActive) {
      // White flash effect
      const flashTimer = setTimeout(() => {
        setShowContent(true)
        setShowConfetti(true)
      }, 400)

      return () => clearTimeout(flashTimer)
    }

    setShowContent(false)
    setShowConfetti(false)
  }, [isActive])

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* White flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main content */}
      {showContent && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background to-background bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated heart */}
          <motion.div
            className="text-7xl sm:text-8xl md:text-9xl mb-8"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ❤️
          </motion.div>

          {/* Main message */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-foreground text-balance">
              I LOVE YOU
            </h1>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-primary">
              FOREVER, THENUMI
            </h2>
          </motion.div>

          {/* Supporting text */}
          <motion.p
            className="mt-12 text-center text-muted-foreground max-w-md px-4 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            You are my greatest treasure, my deepest love, and my forever companion.
          </motion.p>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 left-10 text-3xl"
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.div>

          <motion.div
            className="absolute top-20 right-10 text-3xl"
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            ✨
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-10 text-3xl"
            animate={{
              y: [0, 30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💕
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-10 text-3xl"
            animate={{
              y: [0, 30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            💕
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

function Confetti() {
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: [
              '#ffd700',
              '#d4a574',
              '#f4d6d6',
              '#ffffff',
            ][Math.floor(Math.random() * 4)],
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [1, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}
