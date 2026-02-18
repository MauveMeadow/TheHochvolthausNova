import { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import Navigation from './components/Navigation'
import Overview from './components/Overview'
import TheConcept from './components/TheConcept'
import TheHub from './components/TheHub'
import Models3D from './components/Models3D'
import TheExchange from './components/TheExchange'
import ChatSupport from './components/ChatSupport'
import HistoryPage from './components/HistoryPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Contact from './components/Contact'
import AnalysisViewer from './components/AnalysisViewer'
import FormaAnalysisIntegration from './components/FormaAnalysisIntegration'
import LocationMap from './components/LocationMap'
import BuildingTimeline from './components/BuildingTimeline'
import GetInvolved from './components/GetInvolved'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showHistoryPage, setShowHistoryPage] = useState(false)
  
  const overviewRef = useRef(null)
  const conceptRef = useRef(null)
  const hubRef = useRef(null)
  const modelsRef = useRef(null)
  const exchangeRef = useRef(null)

  const scrollToSection = (sectionId) => {
    const refs = {
      overview: overviewRef,
      concept: conceptRef,
      hub: hubRef,
      models: modelsRef,
      exchange: exchangeRef
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

    const sections = [overviewRef, conceptRef, hubRef, modelsRef, exchangeRef]
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
    <BrowserRouter basename="/TheHochvolthausNova">
      <div className="app">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/location-map" element={<LocationMap />} />
          <Route path="/building-timeline" element={<BuildingTimeline />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/analysis" element={<AnalysisViewer />} />
          <Route path="/forma-analysis" element={<FormaAnalysisIntegration />} />
          <Route path="/" element={
            showHistoryPage ? (
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

                  <section ref={exchangeRef} data-section="exchange" className="section">
                    <TheExchange />
                  </section>
                </main>

                <ChatSupport />
              </>
            )
          } />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
