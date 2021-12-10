import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation, { adminNavigation } from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  const [nav, setNav] = useState(navigation)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <img src="/logo-removebg-preview.png" height="50px"/>
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={localStorage.admin == 'true' ? adminNavigation : nav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      {/*<CSidebarMinimizer className="c-d-md-down-none"/>*/}
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
