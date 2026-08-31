import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useLocation, BrowserRouter, Routes, Route, Link } from 'react-dom'
import Welcome from "./welcome/Welcome.tsx"


function App() {



  return (
    <>
      <Welcome />
    </>
  )
}

export default App
