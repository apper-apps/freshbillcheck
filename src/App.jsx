import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { ThemeProvider } from "@/contexts/ThemeContext"
import Header from "@/components/organisms/Header"
import Footer from "@/components/organisms/Footer"
import BillCheckerPage from "@/pages/BillCheckerPage"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <Header />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<BillCheckerPage />} />
            </Routes>
          </main>
          
          <Footer />
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 9999 }}
          />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App