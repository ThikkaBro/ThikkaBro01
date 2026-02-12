'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EntrancePortal } from '@/components/entrance-portal'
import { ParticleSystem } from '@/components/particle-system'
import { MagicDustEffect } from '@/components/magic-dust-effect'
import { ScrollStory } from '@/components/scroll-story'
import { ProposalCard } from '@/components/proposal-card'
import { GrandFinale } from '@/components/grand-finale'

type PageState = 'entrance' | 'story' | 'proposal' | 'finale-yes' | 'finale-no'

export default function Page() {
  const [pageState, setPageState] = useState<PageState>('entrance')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'story') setPageState('story')
    if (hash === 'proposal') setPageState('proposal')
    if (hash === 'yes') setPageState('finale-yes')
    if (hash === 'no') setPageState('finale-no')
  }, [])

  const handleEnter = () => {
    setPageState('story')
  }

  const handleStoryComplete = () => {
    setPageState('proposal')
  }

  const handleProposalYes = () => {
    setPageState('finale-yes')
  }

  const handleProposalNo = () => {
    setPageState('finale-no')
  }

  return (
    <main className="relative w-full min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleSystem />
      <MagicDustEffect />

      <AnimatePresence mode="wait">
        {pageState === 'entrance' && <EntrancePortal key="entrance" onEnter={handleEnter} />}
      </AnimatePresence>

      {pageState === 'story' && (
        <div key="story" className="relative z-10">
          <ScrollStory onScrollComplete={handleStoryComplete} />
        </div>
      )}

      {pageState === 'proposal' && (
        <div key="proposal" className="relative z-10">
          <ProposalCard onYes={handleProposalYes} onNo={handleProposalNo} />
        </div>
      )}

      <GrandFinale
        isActive={pageState === 'finale-yes' || pageState === 'finale-no'}
        outcome={pageState === 'finale-yes' ? 'yes' : 'no'}
      />
    </main>
  )
}
