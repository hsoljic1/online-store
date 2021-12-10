import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
// routes config
import {userRoutes, adminRoutes} from '../routes'
import { Link } from 'react-router-dom'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { 
  TheHeaderDropdown
}  from './index'

import styled from 'styled-components'
import { Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'

const Div = styled.div`
  font-size: 14px;
  margin-right: 0.75rem;
`

const Icon = styled.span`
  font-size: 18px;
  padding: 0rem 0.75rem;
  color: #2C3A59;
`

const TheHeader = () => {
  const routes = localStorage.admin == 'true' ? adminRoutes : userRoutes
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  useEffect(() => {
    if(!localStorage.order) {
      localStorage.setItem('order', JSON.stringify({
        ime: '',
        prezime: '',
        email: '',
        broj_telefona: '',
        adresa: '',
        artikli: []
      }))
    }
  }, [])

  const history = useHistory()

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="ml-auto d-lg-none" to="/">
        <img src="/logo-removebg-preview.png" height="50px"/>
      </CHeaderBrand>

      <CHeaderNav className="px-3 ml-auto">
        {
          localStorage.admin != 'true' ? (
            <Link to="/login">
              <Icon>
                <FaUser />
              </Icon>
              Prijava
            </Link>
          ) : (
            <>
              <Div>
                admin
              </Div>
              <Button 
                onClick={() => {
                  localStorage.setItem('admin', '')
                  localStorage.setItem('postavioKomentar', '')
                  history.push('/')
                  window.location.reload()
                }}
                outline
                color="primary"
              >
                <FaSignOutAlt /> Odjava
              </Button>
            </>
          )
        }
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
