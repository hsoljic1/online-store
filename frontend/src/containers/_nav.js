import React from 'react'
import CIcon from '@coreui/icons-react'
import { FaTable, FaShoppingBasket, FaBell, FaLaptopMedical } from 'react-icons/fa'
import { VscQuestion } from 'react-icons/vsc'
import { BiSidebar } from 'react-icons/bi'

export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Početna stranica',
    to: '/',
    icon: <CIcon name="cil-home" customClasses="c-sidebar-nav-icon" />
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Odabir specifikacija',
    to: '/specs',
    icon: <FaTable style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "16px" }}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Poređenje artikala',
    to: '/compare',
    icon: <BiSidebar style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>
  },
  {
    myId: "PK",
    _tag: 'CSidebarNavItem',
    name: 'Pregled korpe',
    to: '/orders',
    icon: <FaShoppingBasket style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>,
    
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Česta pitanja',
    to: '/faq',
    icon: <VscQuestion style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>
  },
]

export const adminNavigation = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Pregled artikala',
    to: '/',
    icon: <CIcon name="cil-home" customClasses="c-sidebar-nav-icon" />
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Novi artikal',
    to: '/add-product',
    icon: <FaLaptopMedical style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pregled narudžbi',
    to: '/orders',
    icon: <FaShoppingBasket style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Posljednja pitanja i recenzije',
    to: '/notifications',
    icon: <FaBell style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Česta pitanja',
    to: '/faq',
    icon: <VscQuestion style={{ margin: "0 1.125rem 0 0.25rem", fontSize: "18px" }}/>
  },
]

