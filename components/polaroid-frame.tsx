'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState, memo } from 'react'

interface PolaroidFrameProps {
  index: number
  caption: string
  imageSrc?: string
}

function PolaroidFrameComponent({ index, caption, imageSrc }: PolaroidFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'center center'],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0])
  const rotateY = useTransform(scrollYProgress, [0, 1], [45 * (index % 2 === 0 ? -1 : 1), 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.8, 1])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  // Placeholder image if none provided
  const bgStyle = imageSrc
    ? { backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: 'rgba(212, 165, 116, 0.1)', backgroundImage: `linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(244, 214, 214, 0.1))` }

  return (
    <motion.div
      ref={ref}
      className="h-screen flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          opacity,
          perspective: 1000,
        }}
        className="w-full max-w-md aspect-square bg-white rounded-lg shadow-2xl overflow-hidden border-8 border-white"
      >
        <div className="w-full h-3/4 relative overflow-hidden">
          <motion.div
            style={bgStyle}
            className="w-full h-full"
            animate={isInView ? { scale: 1 } : { scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Glow effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary pointer-events-none"
            animate={isInView ? { opacity: [0, 0.3, 0] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="w-full h-1/4 bg-white p-4 flex flex-col justify-center">
          <p className="font-serif text-sm text-foreground text-center leading-relaxed">
            {caption}
          </p>
          <div className="mt-2 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-primary"
                animate={isInView ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Index number */}
      <motion.div
        className="absolute left-4 md:left-8 text-primary font-serif text-6xl md:text-8xl font-light opacity-10"
        animate={isInView ? { opacity: 0.2 } : { opacity: 0.05 }}
        transition={{ duration: 0.6 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>
    </motion.div>
  )
}

export const PolaroidFrame = memo(PolaroidFrameComponent)
