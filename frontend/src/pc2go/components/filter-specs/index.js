import React, { useState, useEffect, useRef } from 'react'
import { FlexRow, FlexCol } from '../../globals'
import { IMG, Naslov, CardContainer, CollapseIcon, Span, InputContainer } from './style'
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range'
import { Button, Form, FormGroup, Label, Input, Collapse } from 'reactstrap';
import { FaCaretDown } from 'react-icons/fa'
import request from '../../request'

export const Checkbox = ({ group, label, filterLabel, onChange }) => {
  return (
    <Span>
      <Label check> 
        <Input 
          type="checkbox" 
          onChange={(e) => onChange(group, typeof (filterLabel) == 'undefined' ? label : filterLabel, e.target.checked)}
        /> 
        {' '} {label} 
      </Label>
    </Span>
  )
}

const xInY = (x, y) => {
  return y.toString().toLowerCase().includes(x.toLowerCase().toString())
}

const Filter = ({ onSearch, setLoading }) => {
  const [cijena, setCijenaValue] = useState({ min: 0, max: 2000 })
  const [velicinaDiska, setVelicinaDiska] = useState({ min: 0, max: 2048 })
  const [memorija, setMemorija] = useState({ min: 0, max: 64 })
  const [form, setForm] = useState({})
  const [collapse, setCollapse] = useState(true)
  
  const checkboxChange = (group, label, value) => {
    const groupChecked = form[group] ? {
      ...form[group],
      [label]: value
    } : {
      [label]: value
    }
    setForm({
      ...form,
      [group]: groupChecked
    })
  }

  const [mm, setMm] = useState({})
  useEffect(() => {
    (async () => {
      const { data } = await request.get(`/products/min-max`)
      setMm(data)
      setCijenaValue({ min: data.minCijena, max: data.maxCijena })
      setVelicinaDiska({ min: data.minVelicinaDiska, max: data.maxVelicinaDiska })
      setMemorija({ min: data.minMemorija, max: data.maxMemorija })
    })()
  }, [])

  const onChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

 
  return (
    <CardContainer>
      <FlexRow width={1}>
        <Naslov>Filteri</Naslov>
        <CollapseIcon ml="auto">
          <Button color="link" id="toggler" onClick={() => setCollapse(!collapse)}>
            <FaCaretDown />
          </Button>
        </CollapseIcon>
      </FlexRow>
      <Collapse toggler="#toggler" isOpen={collapse}>
        <FlexRow flexWrap='wrap'>
          <Label>Cijena (KM)</Label>
          <FlexCol my="1rem" width={1} px="0.75rem">
            <InputRange
              maxValue={mm.maxCijena}
              minValue={mm.minCijena}
              value={cijena}
              onChange={value => setCijenaValue(value)} 
            />
          </FlexCol>
          <br/>
          <InputContainer>
            <Label>Proizvođač</Label>
            <Input name="proizvodjac" onChange={onChange} placeholder="Npr. Lenovo" />
          </InputContainer>
          <InputContainer>
            <Label>Model</Label>
            <Input name="model" onChange={onChange} placeholder="Npr. Thinkpad E495" />
          </InputContainer>
          <InputContainer>
            <Label>Procesor</Label>
            <Input name="procesor" onChange={onChange} placeholder="Npr. Intel i5 3520m" />
          </InputContainer>
          <InputContainer>
            <Label>Grafička kartica</Label>
            <Input name="graficka" onChange={onChange} placeholder="Npr. AMD Vega 8" />
          </InputContainer>
          <InputContainer>
            <Label>Tip memorije</Label>
            <Input name="tipMemorije" onChange={onChange} placeholder="Npr. DDR4" />
          </InputContainer>
          <InputContainer>
            <Label>Tip diska</Label>
            <Input name="tipDiska" onChange={onChange} placeholder="Tip diska" type="select">
              <option value="">Bilo koji tip</option>
              <option value="HDD">HDD</option>
              <option value="SSD">SDD</option>
              <option value="SSD+HDD">SSD+HDD</option>
            </Input>
          </InputContainer>
          <br/>
          <Label>Veličina diska (GB)</Label>
          <FlexCol my="1rem" width={1} px="0.75rem">
            <InputRange
              maxValue={mm.maxVelicinaDiska}
              minValue={mm.minVelicinaDiska}
              value={velicinaDiska}
              onChange={value => setVelicinaDiska(value)} 
            />
          </FlexCol>
          <br/>
          <Label>Memorija (GB)</Label>
          <FlexCol my="1.5rem" width={1} px="0.75rem">
            <InputRange
              maxValue={mm.maxMemorija}
              minValue={mm.minMemorija}
              value={memorija}
              onChange={value => setMemorija(value)} 
            />
          </FlexCol>
          <br/>
          <FlexCol width={1} alignItems='flex-end' mt="0.75rem">
            <Button
              color="primary"
              onClick={
                () => {
                  onSearch({
                    ...form,
                    cijenaSaPopustom: cijena,
                    velicinaDiska,
                    memorija
                  })
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })
                }
              }
            >
              Pronađi uređaje
            </Button>
          </FlexCol>
        </FlexRow>
      </Collapse>
    </CardContainer>
  )
}

export default Filter
