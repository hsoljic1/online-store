import React, { useState, useEffect } from 'react'
import LaptopCard from '../../components/laptop-card'
import Filter from '../../components/filter'
import request from '../../request'
import { FlexRow, FlexCol, NaslovPage, Spinner } from '../../globals'
import { InputGroup, InputGroupAddon, InputGroupText, Input, Table } from 'reactstrap';
import Select from 'react-select'
import { SelectContainer } from './style'
import labels from '../../labels'
import qs from 'qs'

const compareFns = {
  sifra: () => false,
  proizvodjac: () => false,
  model: () => false,
  procesor: (a, b) => {
    if(a.toLowerCase().includes('intel') && !b.toLowerCase().includes('intel')) {
      return true
    }
    return false
  },
  graficka: (a, b) => {
    if(a.toLowerCase().includes('intel') && !b.toLowerCase().includes('intel')) {
      return true
    }
    return false
  },
  memorija: (a, b) => {
    return +a > +b
  },
  tipMemorije: (a, b) => {
    return a > b
  },
  velicinaDiska: (a, b) => {
    return +a > +b
  },
  tipDiska: (a, b) => {
    return a > b
  },
  velicinaEkrana: (a, b) => {
    return parseInt(a) > parseInt(b)
  },
  portovi: (a, b) => {
    return a.length > b.length
  },
  os: () => false,
  cijena: (a, b) => {
    return +a < +b
  },
  popust: (a, b) => {
    return +a > +b
  },
  cijenaSaPopustom: (a, b) => {
    return +a < +b
  },
  rezolucijaEkrana: (a, b) => {
    if(a == "FULL HD" && b == "HD") {
      return true
    }
    //return parseInt(a) > parseInt(b)
  },
  garancija: (a, b) => {
    return +a > +b
  },
  opis: () => false
}

const compareStyles = (artikal1, artikal2, label) => {
  console.log(artikal1, artikal2, label)
  const a1label = artikal1?.[label] || '', a2label = artikal2?.[label] || ''
  console.log(a1label, a2label, a1label < a2label, a1label > a2label)
  if(!artikal1 || !artikal2) {
    return {
      backgroundColor: "#d9d9d9",
      color: "#000"
    }
  }
  else if(compareFns[label](a1label, a2label)) {
    return {
      backgroundColor: "#7dd17f",
      color: "#000"
    }
  }
  else if(compareFns[label](a2label, a1label)) {
    return {
      backgroundColor: "#d9d9d9",
      color: "#000"
    }
  }
  else {
    return {
      backgroundColor: "#d9d9d9",
      color: "#000"
    }
  }
}

const Artikal = ({ artikal1, artikal2, showLabel }) => {
  let label = labels
  delete label.sifra
  if(!artikal1) {
    return null
  }
  return (
    <Table size="sm">
      <tbody>
        {
          Object.keys(label)
            .filter(key => key != "cijena" && key != "popust")
            .map(lbl => (
              <tr 
                style={{
                  ...compareStyles(artikal1, artikal2, lbl),
                  height: lbl == 'portovi' && (artikal1?.[lbl]?.length > 40 || artikal2?.[lbl]?.length > 40) ? "60px" : undefined
                }}
              >
                <td style={{ width: "175px" }}>{label[lbl]}</td>
                <td>{artikal1[lbl]}</td>
              </tr>
            ))
        }
      </tbody>
    </Table>
    )
}

const Page = (props) => {
  const [data, setData] = useState([])
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [artikal1, setArtikal1] = useState(null)
  const [artikal2, setArtikal2] = useState(null) 
  const id = qs.parse(props.location.search, { ignoreQueryPrefix: true }).id
  console.log(id, "id")
  const loadData = async (params) => {
    try {
      const { data } = await request.get(`/products`, params)
      setArtikal1(data.find(l => l.id == id))
      setData(data)
      setOptions(data.map(({ id, model, proizvodjac }) => ({
        label: proizvodjac + " " + model,
        value: id
      })))
    }
    catch(exc) {
      console.log(exc)
    }
    setLoading(false)
  }

  console.log(artikal1)
  useEffect(() => {
    loadData()
  }, [])

  const filterOption = ({ value, label }, inputValue) => {
    return label.toLowerCase().includes(inputValue?.toLowerCase())
  }
  
  if(loading) {
    return <Spinner />
  }

  return (
    <div className="c-app c-default-layout">
      <FlexCol width={1} mt="-1rem">
        <FlexRow width={1} flexWrap='wrap'>
          <NaslovPage mx={[0, 0, 0]} mb="1rem" width={[1, 1, "fit-content"]}> Poređenje artikala </NaslovPage>
        </FlexRow>
        <FlexRow width={1} flexWrap='wrap'>
          <FlexCol width={[1, 1, 1 / 2]}>
            <SelectContainer>
              <Select 
                options={options}
                placeholder="Artikal 1"
                onChange={option => setArtikal1(data.find(l => l.id == option.value))}
                value={options.find(x => x.value == artikal1?.id)}
                key={options}
                filterOption={filterOption}
              />
            </SelectContainer>
            <Artikal
              artikal1={artikal1}
              artikal2={artikal2}
              showLabel
            />
          </FlexCol>
          <FlexCol width={[1, 1, 1 / 2]}>
            <SelectContainer>
              <Select 
                options={options}
                placeholder="Artikal 2"
                onChange={option => setArtikal2(data.find(l => l.id == option.value))}
                filterOption={filterOption}
              />
            </SelectContainer>
            <Artikal
              artikal1={artikal2}
              artikal2={artikal1}
            />
          </FlexCol>
        </FlexRow>
      </FlexCol>
    </div>
  )
}

export default Page
