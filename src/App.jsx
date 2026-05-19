import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './_Components/Navbar/Navbar'
import HomePage from './_Components/HomePage/Home'
import Footer from './_Components/Footer/Footer'
import Login from './_Components/(auth)/login/login.jsx'
import Signup from './_Components/(auth)/signup/signup.jsx'
import Products from './_Components/Products/Products'

function App() {
  return (
    <div className='container flex flex-col min-h-screen'>
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App