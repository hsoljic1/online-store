import React, { useState, useEffect } from 'react'
import { FlexRow, FlexCol, addNotification } from '../../globals'
import { IMG, Naslov, CardContainer, CollapseIcon, Span } from './style'
import 'react-input-range/lib/css/index.css'
import request from '../../request'
import { Button, Form, FormGroup, Label, Input, Collapse, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback } from 'reactstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object().shape({
  postavio: yup.string().required("Polje ime je obavezno"),
  tekst: yup.string().required("Polje pitanje je obavezno"),
});

const tekstSchema = yup.object().shape({
  tekst: yup.string().required("Polje tekst je obavezno"),
});


const KomentarModal = ({ artikalId, baboId, isOpen, setIsOpen, loadData }) => {
  const admin = localStorage.admin

  const [form, setForm] = useState({
    postavio: admin ? 'pc2go' : (localStorage.getItem('postavioKomentar') || '')
  })
  const onChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(admin ? tekstSchema : schema),
    defaultValues: {
      postavio: admin ? 'pc2go' : (localStorage.getItem('postavioKomentar') || '')
    }
  })

  useEffect(() => {
    localStorage.setItem('postavioKomentar', form.postavio || '')
    reset(form)
  }, [form])


  const sacuvajKomentar = () => {
    console.log("sacuvavam")
    request.post('/questions', {
      tekst: form.tekst, 
      babo_id: baboId, 
      postavio: form.postavio, 
      artikal_id: artikalId
    }).then(res => {
      loadData()
      ponisti()
      addNotification("Uspješno ste dodali pitanje")
    })
  } 

  const ponisti = () => {
    setIsOpen(false)
    setForm({
      postavio: admin ? 'pc2go' : (localStorage.getItem('postavioKomentar') || '')
    })
    console.log(".a.fd.s")
  }

  return (
    <form onSubmit={handleSubmit(sacuvajKomentar)}>
      <Modal isOpen={isOpen} toggle={ponisti}>
        <ModalHeader toggle={ponisti}>Dodajte pitanje</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Ime *</Label>
            <Input 
              name="postavio" 
              onChange={onChange} 
              innerRef={register} 
              ref={register}
              invalid={errors.postavio?.message}
              disabled={admin}
              placeholder="Vaše ime"
            />
            <FormFeedback invalid>{errors.postavio?.message}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Pitanje *</Label>
            <Input 
              name="tekst" 
              type="textarea" 
              onChange={onChange} 
              innerRef={register} 
              invalid={errors.tekst?.message}
              rows="4"
              placeholder="Npr. Za koliko dana možete isporučiti laptop?"
            />
            <FormFeedback invalid>{errors.tekst?.message}</FormFeedback>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit(sacuvajKomentar)}>Sačuvaj</Button>
          <Button color="secondary" type="button" onClick={ponisti}>Odustani</Button>
        </ModalFooter>
      </Modal>
    </form>
  )
}

export default KomentarModal
