'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ProposalCardProps {
  onYes: () => void
}

export function ProposalCard({ onYes }: ProposalCardProps) {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [noHovered, setNoHovered] = useState(false)

  const handleNoHover = () => {
    if (!noHovered) {
      setNoHovered(true)
      const randomX = Math.random() * 200 - 100
      const randomY = Math.random() * 200 - 100
      setNoButtonPos({ x: randomX, y: randomY })
    }
  }

  const handleNoLeave = () => {
    setNoHovered(false)
    setNoButtonPos({ x: 0, y: 0 })
  }

  const handleNoTouch = () => {
    const randomX = Math.random() * 200 - 100
    const randomY = Math.random() * 200 - 100
    setNoButtonPos({ x: randomX, y: randomY })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center justify-center min-h-screen px-4 py-8 bg-background"
    >
      <motion.div
        className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 bg-primary opacity-10 rounded-full blur-2xl"
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-40 h-40 bg-accent opacity-10 rounded-full blur-2xl"
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Icon */}
          <motion.div
            className="flex justify-center text-6xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💍
          </motion.div>

          {/* Question */}
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Will you be mine?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Forever and always, my love
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center items-center relative h-16 mt-8">
            {/* Yes Button */}
            <motion.button
              onClick={onYes}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow duration-300 relative z-20"
            >
              Yes, Forever!
            </motion.button>

            {/* No Button - Teleporting */}
            <motion.button
              animate={{
                x: noButtonPos.x,
                y: noButtonPos.y,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
              }}
              onMouseEnter={handleNoHover}
              onMouseLeave={handleNoLeave}
              onTouchStart={handleNoTouch}
              className="absolute px-8 py-3 bg-muted text-muted-foreground rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer z-10"
            >
              No
            </motion.button>
          </div>

          {/* Fun text */}
          <motion.p
            className="text-sm text-muted-foreground italic"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            (The "No" button is shy)
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}
