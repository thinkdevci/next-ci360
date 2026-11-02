"use client"

import { useState, useEffect, useCallback } from 'react'

interface UseSpeechOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const {
    lang = 'fr-FR',
    rate = 0.9,
    pitch = 1.0,
    volume = 1.0
  } = options

  // Charger les voix disponibles
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      
      // Certains navigateurs chargent les voix de manière asynchrone
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  // Trouver une voix française
  const getFrenchVoice = useCallback(() => {
    return voices.find(voice => voice.lang.includes('fr')) || null
  }, [voices])

  // Faire parler l'assistante
  const speak = useCallback((text: string) => {
    if (!isEnabled || !('speechSynthesis' in window)) return

    // Arrêter toute parole en cours
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    const frenchVoice = getFrenchVoice()
    if (frenchVoice) {
      utterance.voice = frenchVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }, [isEnabled, lang, rate, pitch, volume, getFrenchVoice])

  // Arrêter la parole
  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Basculer l'activation
  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev)
    if (isSpeaking) {
      stop()
    }
  }, [isSpeaking, stop])

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    isEnabled,
    voices,
    getFrenchVoice,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
  }
} 