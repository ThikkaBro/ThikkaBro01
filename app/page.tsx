'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EntrancePortal } from '@/components/entrance-portal'
import { ParticleSystem } from '@/components/particle-system'
import { MagicDustEffect } from '@/components/magic-dust-effect'
import { ScrollStory } from '@/components/scroll-story'
import { ProposalCard } from '@/components/proposal-card'
import { GrandFinale } from '@/components/grand-finale'

type PageState = 'entrance' | 'story' | 'proposal' | 'finale'

export default function Page() {
  const [pageState, setPageState] = useState<PageState>('entrance')

  const handleEnter = () => {
    console.log("[v0] handleEnter called, changing state to story")
    setPageState('story')
  }

  const handleStoryComplete = () => {
    setPageState('proposal')
  }

  const handleProposalYes = () => {
    setPageState('finale')
  }

  return (
    <main className="relative w-full min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Particle system background */}
      <ParticleSystem />

      {/* Magic dust effect */}
      <MagicDustEffect />

      <AnimatePresence mode="wait">
        {pageState === 'entrance' && (
          <EntrancePortal key="entrance" onEnter={handleEnter} />
        )}
      </AnimatePresence>

      {pageState === 'story' && (
        <div key="story" className="relative z-10">
          <ScrollStory onScrollComplete={handleStoryComplete} />
        </div>
      )}

      {pageState === 'proposal' && (
        <div key="proposal" className="relative z-10">
          <ProposalCard onYes={handleProposalYes} />
        </div>
      )}

      {/* Grand finale overlay */}
      <GrandFinale isActive={pageState === 'finale'} />
    </main>
  )
}
