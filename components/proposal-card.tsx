'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useUiSounds } from '@/hooks/use-ui-sounds'

interface ProposalCardProps {
  onYes: () => void
  onNo: () => void
}

type QuizChoice = {
  label: string
  correct?: boolean
}

type QuizQuestion = {
  prompt: string
  choices: QuizChoice[]
}

const quizQuestions: QuizQuestion[] = [
  {
    prompt: 'Mini Love Quiz 1: What feels like home to me?',
    choices: [
      { label: 'Anywhere with your smile', correct: true },
      { label: 'A fancy palace' },
      { label: 'An empty island' },
    ],
  },
  {
    prompt: 'Mini Love Quiz 2: What do I choose, every single day?',
    choices: [
      { label: 'You, always', correct: true },
      { label: 'Luck only' },
      { label: 'Nothing at all' },
    ],
  },
  {
    prompt: 'Final Question: Will you be my Valentine? 💘',
    choices: [
      { label: 'Yes, I will 💖', correct: true },
      { label: 'Still thinking 🤍' },
    ],
  },
]

export function ProposalCard({ onYes, onNo }: ProposalCardProps) {
  const [selectionMessage, setSelectionMessage] = useState('Tap anywhere once to activate sound, then enjoy the quiz ✨')
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const { unlockSound, playHover, playYes, playNo } = useUiSounds()

  const current = quizQuestions[step]
  const isFinalStep = step === quizQuestions.length - 1

  const handleChoice = (choice: QuizChoice) => {
    unlockSound()

    if (choice.correct) {
      playYes()
      setScore((prev) => prev + 1)
      setSelectionMessage('Aww, that made my heart smile 💞')
    } else {
      playNo()
      setSelectionMessage('Still cute… but my heart knows the answer 😌')
    }

    if (!isFinalStep) {
      setTimeout(() => {
        setStep((prev) => prev + 1)
      }, 350)
      return
    }

    if (choice.correct) {
      setTimeout(onYes, 350)
    } else {
      setTimeout(onNo, 350)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-screen px-4 py-8 bg-background"
      onPointerDown={unlockSound}
    >
      <motion.div
        className="relative w-full max-w-2xl p-8 sm:p-10 rounded-3xl bg-card/90 border border-border shadow-2xl"
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
            💌
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Will you be my Valentine?</h2>
            <p className="text-muted-foreground text-base sm:text-lg">First, a small romantic quiz just for us.</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4 sm:p-5 text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Question {step + 1} / {quizQuestions.length}</p>
            <p className="font-medium text-foreground text-lg mb-4">{current.prompt}</p>

            <div className="grid grid-cols-1 gap-3">
              {current.choices.map((choice) => (
                <motion.button
                  key={choice.label}
                  onClick={() => handleChoice(choice)}
                  onMouseEnter={playHover}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left px-4 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors duration-200"
                >
                  {choice.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm px-1">
            <p className="text-muted-foreground">Love quiz score: <span className="font-semibold text-foreground">{score}</span></p>
            <p className="text-muted-foreground">Sound: active after first tap 🔊</p>
          </div>

          <motion.p
            key={`${selectionMessage}-${step}`}
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
