'use client'

import { motion } from 'framer-motion'
import { PolaroidFrame } from './polaroid-frame'

interface ScrollStoryProps {
  onScrollComplete: () => void
}

const storyFrames = [
  {
    caption: 'From the moment you entered my life, everything changed.',
    color: 'from-rose-500 to-pink-300',
  },
  {
    caption: 'Every day with you feels like a beautiful dream.',
    color: 'from-pink-400 to-red-300',
  },
  {
    caption: 'Your smile brightens even my darkest days.',
    color: 'from-red-400 to-rose-400',
  },
  {
    caption: 'In your eyes, I found my home.',
    color: 'from-rose-300 to-pink-200',
  },
  {
    caption: 'With you, I want to face all the tomorrows.',
    color: 'from-pink-300 to-red-200',
  },
  {
    caption: 'You are my forever, Thenumi.',
    color: 'from-rose-200 to-pink-100',
  },
]

export function ScrollStory({ onScrollComplete }: ScrollStoryProps) {
  const handleLastFrameScroll = () => {
    // Give user time to see the last frame, then trigger finale
    setTimeout(onScrollComplete, 1000)
  }

  return (
    <div className="relative w-full bg-background">
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="h-screen flex items-center justify-center px-4"
      >
        <div className="text-center">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4">
            Our Story
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Scroll down to relive our beautiful moments
          </p>
        </div>
      </motion.div>

      {/* Polaroid frames */}
      {storyFrames.map((frame, index) => (
        <div key={index} onScroll={index === storyFrames.length - 1 ? handleLastFrameScroll : undefined}>
          <PolaroidFrame
            index={index}
            caption={frame.caption}
            imageSrc={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cdefs%3E%3ClinearGradient id='grad${index}' x1='0%' y1='0%' x2='100%' y2='100%'%3E%3Cstop offset='0%' style='stop-color:hsl(${350 + index * 5} 85% 75%);stop-opacity:0.3' /%3E%3Cstop offset='100%' style='stop-color:hsl(${28 + index * 3} 65% 55%);stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23grad${index})'/%3E%3C/svg%3E`}
          />
        </div>
      ))}

      {/* Transition to finale hint */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ❤️
          </motion.div>
          <p className="font-serif text-2xl text-accent">
            One more scroll...
          </p>
        </div>
      </motion.div>
    </div>
  )
}
