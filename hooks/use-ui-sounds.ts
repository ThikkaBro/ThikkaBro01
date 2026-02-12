'use client'

import { useCallback } from 'react'

type Tone = {
  frequency: number
  duration: number
  delay?: number
  type?: OscillatorType
  gain?: number
}

type SharedAudio = {
  context: AudioContext
  master: GainNode
}

let sharedAudio: SharedAudio | null = null

function getSharedAudio(): SharedAudio | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (!sharedAudio) {
    const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Context) {
      return null
    }

    const context = new Context()
    const master = context.createGain()
    master.gain.value = 0.35
    master.connect(context.destination)

    sharedAudio = { context, master }
  }

  if (sharedAudio.context.state === 'suspended') {
    sharedAudio.context.resume().catch(() => {
      // no-op: can still require additional user gesture
    })
  }

  return sharedAudio
}

export function useUiSounds() {
  const unlockSound = useCallback(() => {
    const audio = getSharedAudio()
    if (!audio) {
      return
    }

    const { context, master } = audio
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(620, now)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

    oscillator.connect(gain)
    gain.connect(master)
    oscillator.start(now)
    oscillator.stop(now + 0.05)
  }, [])

  const playToneSequence = useCallback((tones: Tone[]) => {
    const audio = getSharedAudio()
    if (!audio) {
      return
    }

    const { context, master } = audio
    const now = context.currentTime

    tones.forEach((tone) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const startTime = now + (tone.delay ?? 0)
      const endTime = startTime + tone.duration

      oscillator.type = tone.type ?? 'sine'
      oscillator.frequency.setValueAtTime(tone.frequency, startTime)

      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.exponentialRampToValueAtTime(tone.gain ?? 0.2, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime)

      oscillator.connect(gain)
      gain.connect(master)

      oscillator.start(startTime)
      oscillator.stop(endTime)
    })
  }, [])

  const playHover = useCallback(() => {
    playToneSequence([{ frequency: 720, duration: 0.12, type: 'triangle', gain: 0.16 }])
  }, [playToneSequence])

  const playYes = useCallback(() => {
    playToneSequence([
      { frequency: 523.25, duration: 0.14, type: 'triangle', gain: 0.2 },
      { frequency: 659.25, duration: 0.16, delay: 0.1, type: 'triangle', gain: 0.2 },
      { frequency: 783.99, duration: 0.24, delay: 0.2, type: 'sine', gain: 0.24 },
    ])
  }, [playToneSequence])

  const playNo = useCallback(() => {
    playToneSequence([
      { frequency: 349.23, duration: 0.14, type: 'square', gain: 0.18 },
      { frequency: 261.63, duration: 0.2, delay: 0.1, type: 'sawtooth', gain: 0.18 },
    ])
  }, [playToneSequence])

  const playFinale = useCallback(() => {
    playToneSequence([
      { frequency: 392, duration: 0.2, type: 'triangle', gain: 0.2 },
      { frequency: 523.25, duration: 0.22, delay: 0.12, type: 'triangle', gain: 0.22 },
      { frequency: 659.25, duration: 0.24, delay: 0.24, type: 'triangle', gain: 0.24 },
      { frequency: 783.99, duration: 0.36, delay: 0.38, type: 'sine', gain: 0.28 },
    ])
  }, [playToneSequence])

  return { unlockSound, playHover, playYes, playNo, playFinale }
}
