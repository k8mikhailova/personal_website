import { MotionConfig } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { QuestionsAdminPage } from './pages/QuestionsAdminPage'
import { WelcomePage } from './pages/WelcomePage'

/**
 * The site's front door: the Welcome intro. Old links to homepage sections
 * (e.g. /#experience, shared before the homepage moved) go on to /home#experience.
 */
function Entry() {
  const { hash } = useLocation()
  return hash ? <Navigate to={`/home${hash}`} replace /> : <WelcomePage />
}

export default function App() {
  return (
    // "user" tones animations down to simple fades when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          {/* The Welcome intro is the entry point, outside the normal page shell (no nav or footer). */}
          <Route index element={<Entry />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="admin/questions" element={<QuestionsAdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
