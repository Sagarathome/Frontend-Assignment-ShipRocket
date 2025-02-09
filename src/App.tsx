import React from 'react'
import './App.css'
import MainContainer from './pages/MainContainer'
import { BrowserRouter,Route,Routes } from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <MainContainer />}>
      <Route path='/:id' element={ <MainContainer />}/>
      </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
