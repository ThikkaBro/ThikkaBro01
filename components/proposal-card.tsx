'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useUiSounds } from '@/hooks/use-ui-sounds'

interface ProposalCardProps {
  onYes: () => void
  onNo: () => void
}

export function ProposalCard({ onYes, onNo }: ProposalCardProps) {
  const [selectionMessage, setSelectionMessage] = useState('Choose from your heart ✨')
  const { playHover, playYes, playNo } = useUiSounds()

  const handleYes = () => {
    setSelectionMessage('Perfect choice. Let\'s celebrate 💖')
    playYes()
    onYes()
  }

  const handleNo = () => {
    setSelectionMessage('Thank you for being honest. Your answer is respected 🤍')
    playNo()
    onNo()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-screen px-4 py-8 bg-background"
    >
      <motion.div
        className="relative w-full max-w-xl p-8 sm:p-10 rounded-3xl bg-card/90 border border-border shadow-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative z-10 text-center space-y-7">
          <motion.div
            className="flex justify-center text-6xl"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            💍
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Will you be mine?</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Forever and always, my love.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <motion.button
              onClick={handleYes}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Yes, forever
            </motion.button>

            <motion.button
              onClick={handleNo}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              No
            </motion.button>
          </div>

          <motion.p
            key={selectionMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground"
          >
            {selectionMessage}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}
