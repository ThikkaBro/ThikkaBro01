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
  const masterGainRef = useRef<GainNode | null>(null)

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null
    }

    if (!audioContextRef.current) {
      const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Context) {
        return null
      }

      const context = new Context()
      const master = context.createGain()
      master.gain.value = 0.22
      master.connect(context.destination)

      audioContextRef.current = context
      masterGainRef.current = master
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {
        // no-op: browser may still require an additional user gesture
      })
    }

    return audioContextRef.current
  }, [])

  const unlockSound = useCallback(() => {
    const ctx = getAudioContext()
    const master = masterGainRef.current
    if (!ctx || !master) {
      return
    }

    const clickOsc = ctx.createOscillator()
    const clickGain = ctx.createGain()
    const now = ctx.currentTime

    clickOsc.type = 'sine'
    clickOsc.frequency.setValueAtTime(440, now)
    clickGain.gain.setValueAtTime(0.0001, now)
    clickGain.gain.linearRampToValueAtTime(0.00015, now + 0.01)
    clickGain.gain.linearRampToValueAtTime(0.0001, now + 0.03)

    clickOsc.connect(clickGain)
    clickGain.connect(master)
    clickOsc.start(now)
    clickOsc.stop(now + 0.03)
  }, [getAudioContext])

  const playToneSequence = useCallback(
    (tones: Tone[]) => {
      const ctx = getAudioContext()
      const master = masterGainRef.current
      if (!ctx || !master) {
        return
      }

      const now = ctx.currentTime

      tones.forEach((tone) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const startTime = now + (tone.delay ?? 0)
        const endTime = startTime + tone.duration
        const volume = tone.gain ?? 0.24

        oscillator.type = tone.type ?? 'sine'
        oscillator.frequency.setValueAtTime(tone.frequency, startTime)

        gainNode.gain.setValueAtTime(0.0001, startTime)
        gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.015)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

        oscillator.connect(gainNode)
        gainNode.connect(master)

        oscillator.start(startTime)
        oscillator.stop(endTime)
      })
    },
    [getAudioContext],
  )

  const playHover = useCallback(() => {
    playToneSequence([{ frequency: 690, duration: 0.11, type: 'triangle', gain: 0.12 }])
  }, [playToneSequence])

  const playYes = useCallback(() => {
    playToneSequence([
      { frequency: 523.25, duration: 0.14, type: 'triangle', gain: 0.15 },
      { frequency: 659.25, duration: 0.16, delay: 0.1, type: 'triangle', gain: 0.15 },
      { frequency: 783.99, duration: 0.2, delay: 0.2, type: 'sine', gain: 0.18 },
    ])
  }, [playToneSequence])

  const playNo = useCallback(() => {
    playToneSequence([
      { frequency: 330, duration: 0.15, type: 'square', gain: 0.12 },
      { frequency: 246.94, duration: 0.2, delay: 0.1, type: 'sawtooth', gain: 0.12 },
    ])
  }, [playToneSequence])

  const playFinale = useCallback(() => {
    playToneSequence([
      { frequency: 392, duration: 0.2, type: 'triangle', gain: 0.16 },
      { frequency: 523.25, duration: 0.22, delay: 0.12, type: 'triangle', gain: 0.16 },
      { frequency: 659.25, duration: 0.24, delay: 0.24, type: 'triangle', gain: 0.17 },
      { frequency: 783.99, duration: 0.32, delay: 0.38, type: 'sine', gain: 0.2 },
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
    unlockSound,
    playHover,
    playYes,
    playNo,
    playFinale,
  }
}
