import React, { useState, useEffect } from 'react'
import { FlexRow, FlexCol } from '../../globals'
import request from '../../request'
import { IMG, Naslov, CardContainer, CollapseIcon, Span } from './style'
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range'
import { Button, Form, FormGroup, Label, Input, Collapse } from 'reactstrap';
import { FaCaretDown } from 'react-icons/fa'
import { useWindowSize } from '../../hooks'

const Checkbox = ({ group, label, filterLabel, onChange }) => {
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

const searchByFields = ['sifra', 'model', 'proizvodjac', 'procesor', 'graficka', 'memorija', 'velicinaDiska', 'cijena', 'cijenaSaPopustom']

const Filter = ({ data, setFilteredData, filter }) => {
  const [mm, setMm] = useState({})
  const [cijena, setCijenaValue] = useState({ min: 0, max: 0 })
  const [velicinaDiska, setVelicinaDiska] = useState({ min: 0, max: 0 })
  const [memorija, setMemorija] = useState({ min: 0, max: 0 })
  const [form, setForm] = useState({})
  const [collapse, setCollapse] = useState(true)

  const admin = localStorage.admin == "true"

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

  useEffect(() => {
    (async () => {
      const { data } = await request.get(`/products/min-max`)
      setMm(data)
      setCijenaValue({ min: data.minCijena, max: data.maxCijena })
      setVelicinaDiska({ min: data.minVelicinaDiska, max: data.maxVelicinaDiska })
      setMemorija({ min: data.minMemorija, max: data.maxMemorija })
    })()
  }, [])

  useEffect(() => {
    setFilteredData(data.filter(l => {
      let _ok = xInY(filter, `${l['proizvodjac']} ${l['model']}~${admin ? l['sifra'] : ''}`) //!!searchByFields.find(key => xInY(filter, l[key]))
      for(const group of ['procesor', 'graficka', 'proizvodjac', 'tipDiska']) {
        const checked = form[group] || {}
        let ok = Object.keys(checked).findIndex(x => checked[x]) < 0
       
        for(const key of Object.keys(checked)) {
          if(checked[key]) {
            
            if(key) {
              ok = ok || xInY(key, l[group])
            }
            else {
              if(group == 'procesor') {
                ok = ok || !(xInY('Intel', l[group]) || xInY('AMD', l[group]))
              }
              else {
                const y = l[group]
                ok = ok || !(xInY('Lenovo', y) || xInY('Dell', y) || xInY('Apple', y) || xInY('HP', y) || xInY('Asus', y) || xInY('Acer', y))
              }
            }
          }
        }
        _ok = _ok && ok
      }
      _ok = _ok && (cijena.min <= l.cijenaSaPopustom && l.cijenaSaPopustom <= cijena.max)
      _ok = _ok && (velicinaDiska.min <= l.velicinaDiska && l.velicinaDiska <= velicinaDiska.max)
      _ok = _ok && (memorija.min <= l.memorija && l.memorija <= memorija.max)
      return _ok
    }))
  }, [data, filter, cijena, velicinaDiska, memorija, form])

  const windowSize = useWindowSize()

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
      <Collapse toggler="#toggler" isOpen={collapse || windowSize.width > 831}>
        <FlexCol>
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
          <Label>Procesor</Label>
          <FlexRow mb="0.75rem" flexWrap="wrap">
            <Checkbox label="Intel" group="procesor" onChange={checkboxChange}/>
            <Checkbox label="AMD" group="procesor" onChange={checkboxChange}/>
          </FlexRow>
          <Label>Grafička kartica</Label>
          <FlexRow mb="0.75rem" flexWrap="wrap">
            <Checkbox label="Nvidia" group="graficka" onChange={checkboxChange}/>
            <Checkbox label="AMD" group="graficka" onChange={checkboxChange}/>
            <Checkbox label="Intel" group="graficka" onChange={checkboxChange}/>
          </FlexRow>
          <Label>Proizvođač</Label>
          <FlexRow mb="0.75rem" flexWrap="wrap">
            <Checkbox label="Dell" group="proizvodjac" onChange={checkboxChange}/>
            <Checkbox label="Lenovo" group="proizvodjac" onChange={checkboxChange}/>
            <Checkbox label="Apple" group="proizvodjac" onChange={checkboxChange}/>
            <Checkbox label="HP" group="proizvodjac" onChange={checkboxChange}/>
            <Checkbox label="Asus" group="proizvodjac" onChange={checkboxChange}/>
            <Checkbox label="Acer" group="proizvodjac" onChange={checkboxChange}/>
            <Checkbox label="Ostalo" group="proizvodjac" onChange={checkboxChange} filterLabel=""/>
          </FlexRow>
          <Label>Tip diska</Label>
          <FlexRow mb="0.75rem" flexWrap="wrap">
            <Checkbox label="SSD" group="tipDiska" onChange={checkboxChange}/>
            <Checkbox label="HDD" group="tipDiska" onChange={checkboxChange}/>
            <Checkbox label="SSD+HDD" group="tipDiska" onChange={checkboxChange}/>
          </FlexRow>
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
          <FlexCol my="1rem" width={1} px="0.75rem">
            <InputRange
              maxValue={mm.maxMemorija}
              minValue={mm.minMemorija}
              value={memorija}
              onChange={value => setMemorija(value)} 
            />
          </FlexCol>
          <br/>
        </FlexCol>
      </Collapse>
    </CardContainer>
  )
}

export default Filter
