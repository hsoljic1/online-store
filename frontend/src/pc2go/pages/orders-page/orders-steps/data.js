import React, { useState, useEffect } from 'react'
import Filter from '../../../components/filter'
import request from '../../../request'
import { FlexRow, FlexCol, NaslovPage } from '../../../globals'
import { Input, Label, FormGroup, FormFeedback } from 'reactstrap';
import Select from 'react-select'
import { StepButton, IconContainer, Steps, Content } from './style'
import { FaAngleRight } from 'react-icons/fa'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export const schema = yup.object().shape({
  ime: yup.string().required("Polje ime je obavezno"),
  prezime: yup.string().required("Polje prezime je obavezno"),
  email: yup.string().required("Polje email je obavezno").email("Morate unijeti validan email"),
  broj_telefona: yup.string().required("Polje broj telefona je obavezno"),
  adresa: yup.string().required("Polje adresa je obavezno"),
});

const Page = ({ setHandleDataSubmit }) => {
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit'
  })

  const [form, setForm] = useState({})

  const onChange = e => {
    console.log(form)
    const { name, value } = e.target
    const order = JSON.parse(localStorage.getItem('order'))
    order[name] = value
    localStorage.setItem('order', JSON.stringify(order)) 
    setForm({
      ...form,
      [name]: value
    })
  }

  useEffect(() => {
    setHandleDataSubmit(handleSubmit)
    const order = JSON.parse(localStorage.order)
    setForm(order)
    reset(order)
  }, [])

  const onMove = (e) => {
    e.preventDefault()
  }

  return (
    <FlexCol width={1} alignItems='center'>
      <form onSubmit={handleSubmit(onMove)} style={{ minWidth: "350px" }} id="data_order_form">
        <FormGroup>
          <Label>Ime *</Label>
          <Input 
            name="ime" 
            onChange={onChange} 
            innerRef={register} 
            invalid={errors.ime?.message}
            placeholder="Ime"
          />
          <FormFeedback invalid>{errors.ime?.message}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label>Prezime *</Label>
          <Input 
            name="prezime" 
            onChange={onChange} 
            innerRef={register} 
            invalid={errors.prezime?.message}
            placeholder="Prezime"
          />
          <FormFeedback invalid>{errors.prezime?.message}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label>Email *</Label>
          <Input 
            name="email" 
            onChange={onChange} 
            innerRef={register} 
            invalid={errors.email?.message}
            placeholder="Email"
          />
          <FormFeedback invalid>{errors.email?.message}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label>Broj telefona *</Label>
          <Input 
            name="broj_telefona" 
            onChange={onChange} 
            innerRef={register} 
            invalid={errors.broj_telefona?.message}
            placeholder="Broj telefona"
          />
          <FormFeedback invalid>{errors.broj_telefona?.message}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label>Adresa *</Label>
          <Input 
            name="adresa" 
            onChange={onChange} 
            innerRef={register} 
            invalid={errors.adresa?.message}
            placeholder="Adresa"
          />
          <FormFeedback invalid>{errors.adresa?.message}</FormFeedback>
        </FormGroup>
      </form>
    </FlexCol>
  )
}

export default Page
