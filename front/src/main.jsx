import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Sidebar />
    <App />
  </StrictMode>,
)