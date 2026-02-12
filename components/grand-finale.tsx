'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useUiSounds } from '@/hooks/use-ui-sounds'

interface GrandFinaleProps {
  isActive: boolean
  outcome: 'yes' | 'no'
}

export function GrandFinale({ isActive, outcome }: GrandFinaleProps) {
  const [showContent, setShowContent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { playFinale } = useUiSounds()

  useEffect(() => {
    if (isActive) {
      playFinale()
      const flashTimer = setTimeout(() => {
        setShowContent(true)
        setShowConfetti(outcome === 'yes')
      }, 400)

      return () => clearTimeout(flashTimer)
    }

    setShowContent(false)
    setShowConfetti(false)
  }, [isActive, outcome, playFinale])

  const isYes = outcome === 'yes'

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {showConfetti && <Confetti />}

      {showContent && (
        <motion.div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-background ${
            isYes ? 'bg-gradient-to-b from-background to-background' : 'bg-gradient-to-b from-background via-background to-muted/40'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-7xl sm:text-8xl md:text-9xl mb-8"
            animate={{
              scale: [1, 1.15, 1],
              rotate: isYes ? [0, 5, -5, 0] : [0, 2, -2, 0],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isYes ? '❤️' : '🤍'}
          </motion.div>

          <motion.div
            className="text-center space-y-4 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-foreground text-balance">
              {isYes ? 'I LOVE YOU' : 'THANK YOU'}
            </h1>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-primary">
              {isYes ? 'FOREVER, THENUMI' : 'FOR YOUR HONEST ANSWER'}
            </h2>
          </motion.div>

          <motion.p
            className="mt-10 text-center text-muted-foreground max-w-xl px-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {isYes
              ? 'You are my greatest treasure, my deepest love, and my forever companion.'
              : 'No matter what, I appreciate your kindness and the moment we shared.'}
          </motion.p>
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
            backgroundColor: ['#ffd700', '#d4a574', '#f4d6d6', '#ffffff'][Math.floor(Math.random() * 4)],
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
