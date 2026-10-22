import { MotionConfig } from 'motion/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { QuestionsAdminPage } from './pages/QuestionsAdminPage'
import { WelcomePage } from './pages/WelcomePage'

export default function App() {
  return (
    // "user" tones animations down to simple fades when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          {/* Experimental standalone intro, outside the normal page shell (no nav or footer). */}
          <Route path="welcome" element={<WelcomePage />} />
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
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
