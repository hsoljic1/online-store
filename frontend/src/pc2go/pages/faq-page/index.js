import React, { useState, useEffect } from 'react'
import LaptopCard from '../../components/laptop-card'
import Filter from '../../components/filter'
import request from '../../request'
import { FlexRow, FlexCol, NaslovPage, addNotification } from '../../globals'
import { Collapse, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup, FormFeedback } from 'reactstrap';
import Select from 'react-select'
import { StyledButton, IconContainer, OdgovorContainer } from './style'
import { FaCaretRight } from 'react-icons/fa'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useHistory } from "react-router-dom";

const schema = yup.object().shape({
  pitanje: yup.string().required("Polje pitanje je obavezno"),
  odgovor: yup.string().required("Polje odgovor je obavezno")
})


const FrontPage = () => {

  const [collapseOpen, setCollapseOpen] = useState({})

  const [form, setForm] = useState({})
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  })
  const onChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const admin = localStorage.admin == 'true'
  const displayAdmin = admin ? 'visible' : 'none'

  const [data, setData] = useState([])
  const loadData = () => {
    request.get('/questions/faq')
    .then(({ data }) => setData(data))
    .catch(error => {})
  }
  useEffect(() => {
    loadData()
  }, [])

  const [modalAdd, setModalAdd] = useState(false)
  const toggleAdd = () => {
    setModalAdd(!modalAdd)
    setModalEdit(null)
    setForm({})
    reset({})
  }

  const [modalEdit, setModalEdit] = useState(false)
  const toggleEdit = (id) => {
    if(id) {
      const item = data.find(x => x.id == id)
      setModalAdd(null)
      reset(item)
      setForm(item)
      setModalEdit(item)
    }
    else {
      setModalEdit(null)
    }
  }

  const [modalDelete, setModalDelete] = useState(false)
  const toggleDelete = (id) => {
    const item = data.find(x => x.id == id)
    setModalDelete(item)
  }

  const addNew = async () => {
    try {
      if(modalEdit?.id) {
        await request.put(`/questions/faq/${modalEdit?.id}`, form)
        loadData()
        addNotification("Uspješno ste uredili pitanje")
        toggleEdit()
      }
      else {
        await request.post('/questions/faq', form)
        loadData()
        addNotification("Uspješno ste dodali novo pitanje")
        toggleAdd()
      }
    }
    catch(error) {
      console.log(error)
    }
  }

  const deleteItem = async () => {
    try {
      await request.delete(`/questions/faq/${modalDelete?.id}`)
      loadData()
      addNotification("Uspješno ste obrisali pitanje")
      toggleDelete()
    }
    catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="c-app c-default-layout">
      <FlexCol width={1}>
        <FlexRow width={1}>
          <NaslovPage mb="0.5rem">Česta pitanja</NaslovPage>
          <FlexCol ml="auto" display={displayAdmin}>
            <Button color="primary" onClick={toggleAdd}> Novo pitanje </Button>
          </FlexCol>
        </FlexRow>
        <FlexCol width={1}>
          {
            data.map(({ id, pitanje, odgovor }) => (
              <FlexCol width={1}>
                <StyledButton onClick={() => setCollapseOpen({ 
                  ...collapseOpen,
                  [id]: !collapseOpen[id]
                })}>
                  <FlexRow>
                    <IconContainer>
                      <FaCaretRight />
                    </IconContainer>
                    <FlexCol width={1}>
                      {pitanje}
                    </FlexCol>
                    <FlexRow display={displayAdmin} alignItems='start'>
                      <FlexRow>
                        <Button size="sm" color="primary" onClick={(e) => { e.stopPropagation(); toggleEdit(id) }} style={{ marginRight: "0.5rem" }}> Uredi </Button>
                        <Button size="sm" color="danger" onClick={(e) => { e.stopPropagation(); toggleDelete(id) }}> Obriši </Button> 
                      </FlexRow>
                    </FlexRow>
                  </FlexRow>
                </StyledButton>
                <Collapse isOpen={collapseOpen[id]} style={{ width: "100%" }}>
                  <OdgovorContainer>
                    {odgovor}
                  </OdgovorContainer>
                </Collapse>
              </FlexCol>
            ))
          }
        </FlexCol>
      </FlexCol>
      <Modal isOpen={modalAdd || modalEdit} toggle={modalEdit ? toggleEdit : toggleAdd}>
        <form onSubmit={handleSubmit(addNew)}>
          <ModalHeader toggle={modalEdit ? toggleEdit : toggleAdd}> 
            {modalEdit ? 'Uređivanje' : 'Dodavanje'} pitanja </ModalHeader>
          <ModalBody>
          <FormGroup>
              <Label>Pitanje *</Label>
              <Input 
                name="pitanje" 
                placeholder="Pitanje"
                onChange={onChange} 
                innerRef={register} 
                ref={register}
                invalid={errors.pitanje?.message}
              />
              <FormFeedback invalid>{errors.pitanje?.message}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Odgovor *</Label>
              <Input 
                name="odgovor" 
                placeholder="Odgovor"
                type="textarea" 
                onChange={onChange} 
                innerRef={register} 
                invalid={errors.odgovor?.message}
                rows="4"
              />
              <FormFeedback invalid>{errors.odgovor?.message}</FormFeedback>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit"> Sačuvaj </Button>
            <Button color="secondary" onClick={modalEdit ? toggleEdit : toggleAdd}> Odustani </Button>
          </ModalFooter>
        </form>
      </Modal>
      <Modal isOpen={modalDelete} toggle={() => toggleDelete(null)}>
        <ModalHeader toggle={() => toggleDelete(null)}> Brisanje pitanja </ModalHeader>
        <ModalBody>
          Da li ste sigurni da želite obrisati pitanje '{modalDelete?.pitanje}'?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" type="submit" onClick={deleteItem}> Obriši </Button>
          <Button color="secondary" onClick={() => toggleDelete(null)}> Odustani </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default FrontPage
