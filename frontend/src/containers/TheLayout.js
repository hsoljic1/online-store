import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'
import ReactNotification from 'react-notifications-component'


const TheLayout = () => {
  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
      </div>
      <ReactNotification />
    </div>
  )
}

export default TheLayout
