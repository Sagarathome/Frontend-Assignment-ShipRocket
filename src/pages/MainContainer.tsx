import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import FileList from '../components/FileList/FIleList'

function MainContainer() {
  return (
    <div className='h-100 d-flex' >
        <Sidebar/>
        <FileList/>
    </div>
  )
}

export default MainContainer