'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface EntrancePortalProps {
  onEnter: () => void
}

export function EntrancePortal({ onEnter }: EntrancePortalProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.8,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.15, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.6,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5,
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
      variants={containerVariants}
      initial="hidden"
      animate={isReady ? 'visible' : 'hidden'}
      exit="exit"
      onClick={(e) => {
        // Prevent event bubbling
        e.stopPropagation()
      }}
    >
      {/* Background gradient subtle effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 pointer-events-auto">
        {/* Letter icon */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate={isReady ? 'visible' : 'hidden'}
          className="relative"
        >
          <motion.div
            animate="pulse"
            variants={pulseVariants}
            className="w-32 h-32 flex items-center justify-center"
          >
            <svg
              className="w-32 h-32 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate={isReady ? 'visible' : 'hidden'}
          className="text-center"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2">
            Forever
          </h1>
          <p className="text-accent text-lg sm:text-xl md:text-2xl font-light">Thenumi</p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate={isReady ? 'visible' : 'hidden'}
          className="text-muted-foreground text-center max-w-md mb-4"
        >
          A magical Valentine's story just for you
        </motion.p>

        {/* CTA Button */}
        <button
          onClick={() => {
            console.log("[v0] Button clicked - entering story")
            onEnter()
          }}
          onMouseDown={() => console.log("[v0] Mouse down on button")}
          type="button"
          className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer z-50 pointer-events-auto"
        >
          <span className="flex items-center gap-2">
            Enter the Story
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-accent opacity-20 text-4xl animate-float">
        ✨
      </div>
      <div className="absolute bottom-10 right-10 text-accent opacity-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>
        ✨
      </div>
    </motion.div>
  )
}
