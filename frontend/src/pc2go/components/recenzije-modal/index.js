import React, { useState, useEffect } from 'react'
import { FlexRow, FlexCol, addNotification } from '../../globals'
import { IMG, Naslov, CardContainer, CollapseIcon, Span } from './style'
import 'react-input-range/lib/css/index.css'
import request from '../../request'
import { Button, Form, FormGroup, Label, Input, Collapse, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback } from 'reactstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import StarRating from 'react-star-ratings'

const schema = yup.object().shape({
  postavio: yup.string().required("Polje ime je obavezno"),
  //ocjena: yup.number().required("Polje ocjena je obavezno"),
  tekst: yup.string().required("Polje tekst je obavezno"),
});

const DEFAULT_OCJENA = 0
const KomentarModal = ({ artikalId, baboId, isOpen, setIsOpen, loadData }) => {
  console.log(baboId)
  const [form, setForm] = useState({})
  const [ocjena, setOcjena] = useState(DEFAULT_OCJENA)
  const [errorStar, setErrorStar] = useState("")

  const onChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(schema)
  })

  const sacuvajKomentar = () => {
    console.log("sacuvavam")
    if(!ocjena) {
      setErrorStar("Polje ocjena je obavezno")
      return
    }
    request.post('/questions/review', {
      tekst: form.tekst, 
      postavio: form.postavio, 
      artikal_id: artikalId,
      ocjena: ocjena
    }).then(res => {
      localStorage.setItem('recenzirao' + artikalId, 'true')
      loadData()
      ponisti()
      addNotification("Uspješno ste dodali recenziju")
    })
  } 

  const ponisti = () => {
    setIsOpen(false)
    setForm({})
    setOcjena(DEFAULT_OCJENA)
  }

  return (
    <form onSubmit={handleSubmit(sacuvajKomentar)}>
      <Modal isOpen={isOpen} toggle={ponisti}>
        <ModalHeader toggle={ponisti}>Dodajte recenziju</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Ime *</Label>
            <Input 
              name="postavio" 
              onChange={onChange} 
              innerRef={register} 
              invalid={errors.postavio?.message}
              placeholder="Vaše ime"
            />
            <FormFeedback invalid>{errors.postavio?.message}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Ocjena *</Label>
            <FlexCol>
              <StarRating 
                rating={ocjena}
                starRatedColor="#f1b317"
                changeRating={value => setOcjena(value)}
                numberOfStars={5}
                starDimension="35px"
                starSpacing="10px"
              />
              <div className="invalid-feedback" style={{ display: formState.submitCount && !ocjena ? 'block' : 'none' }}>{"Polje ocjena je obavezno"}</div>
            </FlexCol>
          </FormGroup>
          <FormGroup>
            <Label>Recenzija *</Label>
            <Input 
              name="tekst" 
              type="textarea" 
              onChange={onChange} 
              innerRef={register} 
              invalid={errors.tekst?.message}
              rows="8"
              placeholder="Tekst recenzije"
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
