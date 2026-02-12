'use client'

import { useCallback, useEffect, useRef } from 'react'

type Tone = {
  frequency: number
  duration: number
  delay?: number
  type?: OscillatorType
  gain?: number
}

export function useUiSounds() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null
    }

    if (!audioContextRef.current) {
      const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Context) {
        return null
      }
      audioContextRef.current = new Context()
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {
        // no-op: browser may still require an additional user gesture
      })
    }

    return audioContextRef.current
  }, [])

  const playToneSequence = useCallback(
    (tones: Tone[]) => {
      const ctx = getAudioContext()
      if (!ctx) {
        return
      }

      const now = ctx.currentTime

      tones.forEach((tone) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const startTime = now + (tone.delay ?? 0)
        const endTime = startTime + tone.duration
        const volume = tone.gain ?? 0.08

        oscillator.type = tone.type ?? 'sine'
        oscillator.frequency.setValueAtTime(tone.frequency, startTime)

        gainNode.gain.setValueAtTime(0.0001, startTime)
        gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.start(startTime)
        oscillator.stop(endTime)
      })
    },
    [getAudioContext],
  )

  const playHover = useCallback(() => {
    playToneSequence([{ frequency: 620, duration: 0.09, type: 'triangle', gain: 0.05 }])
  }, [playToneSequence])

  const playYes = useCallback(() => {
    playToneSequence([
      { frequency: 523.25, duration: 0.1, type: 'triangle', gain: 0.08 },
      { frequency: 659.25, duration: 0.14, delay: 0.08, type: 'triangle', gain: 0.08 },
      { frequency: 783.99, duration: 0.18, delay: 0.16, type: 'sine', gain: 0.09 },
    ])
  }, [playToneSequence])

  const playNo = useCallback(() => {
    playToneSequence([
      { frequency: 320, duration: 0.12, type: 'sawtooth', gain: 0.04 },
      { frequency: 260, duration: 0.16, delay: 0.08, type: 'sawtooth', gain: 0.04 },
    ])
  }, [playToneSequence])

  const playFinale = useCallback(() => {
    playToneSequence([
      { frequency: 392, duration: 0.18, type: 'triangle', gain: 0.08 },
      { frequency: 523.25, duration: 0.2, delay: 0.1, type: 'triangle', gain: 0.08 },
      { frequency: 659.25, duration: 0.22, delay: 0.2, type: 'triangle', gain: 0.08 },
      { frequency: 783.99, duration: 0.3, delay: 0.34, type: 'sine', gain: 0.09 },
    ])
  }, [playToneSequence])

  useEffect(() => {
    return () => {
      audioContextRef.current?.close().catch(() => {
        // no-op
      })
    }
  }, [])

  return {
    playHover,
    playYes,
    playNo,
    playFinale,
  }
}
