import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import Navigation from './components/Navigation'
import Overview from './components/Overview'
import TheConcept from './components/TheConcept'
import TheHub from './components/TheHub'
import Models3D from './components/Models3D'
import TheMinds from './components/TheMinds'
import ChatSupport from './components/ChatSupport'
import HistoryPage from './components/HistoryPage'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showHistoryPage, setShowHistoryPage] = useState(false)
  
  const overviewRef = useRef(null)
  const conceptRef = useRef(null)
  const hubRef = useRef(null)
  const modelsRef = useRef(null)
  const mindsRef = useRef(null)

  const scrollToSection = (sectionId) => {
    const refs = {
      overview: overviewRef,
      concept: conceptRef,
      hub: hubRef,
      models: modelsRef,
      minds: mindsRef
    }
    
    const ref = refs[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setActiveTab(sectionId)
  }

  // Intersection Observer to update active tab on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.dataset.section)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = [overviewRef, conceptRef, hubRef, modelsRef, mindsRef]
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  return (
    <div className="app">
      {showHistoryPage ? (
        <HistoryPage onBack={() => setShowHistoryPage(false)} />
      ) : (
        <>
          <Hero onExplore={() => scrollToSection('overview')} />
          <Navigation activeTab={activeTab} onTabChange={scrollToSection} />
          
          <main>
            <section ref={overviewRef} data-section="overview" className="section">
              <Overview />
            </section>

            <section ref={conceptRef} data-section="concept" className="section">
              <TheConcept onShowHistory={() => setShowHistoryPage(true)} />
            </section>

            <section ref={hubRef} data-section="hub" className="section">
              <TheHub />
            </section>

            <section ref={modelsRef} data-section="models" className="section">
              <Models3D />
            </section>

            <section ref={mindsRef} data-section="minds" className="section">
              <TheMinds />
            </section>
          </main>

          <ChatSupport />
        </>
      )}
    </div>
  )
}

export default App
