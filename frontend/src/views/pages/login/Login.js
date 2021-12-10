import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { FormFeedback } from 'reactstrap'
import CIcon from '@coreui/icons-react'
import { Redirect } from 'react-router-dom'

const Login = () => {
  const [form, setForm] = useState({})
  const [logined, setLogined] = useState(false)
  const [error, setError] = useState('')
  const onChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const login = (e) => {
    console.log(form)
    if(form.username == 'admin' && form.password == 'password') {
      localStorage.setItem('admin', 'true')
      setLogined(true)
      setError('')
    }
    else {
      setError('Provjerite pristupne podatke')
      e.preventDefault()
    }
  }

  if(logined) {
    return (
      <Redirect to="/" />
    )
  } 

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={login}>
                    <h1>Prijava</h1>
                    <p className="text-muted">Prijavite se na vaš račun</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="username" type="text" placeholder="Username" autoComplete="username" onChange={onChange} invalid={error}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="password" type="password" placeholder="Lozinka" autoComplete="current-password" onChange={onChange} invalid={error}/>
                      <FormFeedback>{error}</FormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                        >
                          Prijava
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <img src="/logo.png" height="40" />
                    <h2>pc2go</h2>
                    <p>Admin panel za pc2go trgovinu</p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
