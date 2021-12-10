import React, { useState, useEffect } from 'react'
import Filter from '../../../components/filter'
import request from '../../../request'
import { FlexRow, FlexCol, NaslovPage } from '../../../globals'
import { Table, Button } from 'reactstrap';
import Select from 'react-select'
import { Name, Value } from './style'
import { FaAngleRight } from 'react-icons/fa'

const Page = ({ endOrder, data }) => {
  const [order, setOrder] = useState(JSON.parse(localStorage.order))

  useEffect(() => {
    
  }, [])

  useEffect(() => updateAll(), [data])

  const [artikli, setArtikli] = useState([])
  const updateAll = () => {
    setArtikli(JSON.parse(localStorage.order).artikli?.map(a => {
      console.log("mappiram", a)
      const laptop = data.find(x => x.id == a.id)
      console.log("a", a, "laptop", laptop, data)
      if(!laptop) {
        return {}
      }
      return {
        naziv: laptop.proizvodjac + " " + laptop.model,
        ukupno: parseFloat(laptop.cijenaSaPopustom) * parseFloat(a.kolicina),
        id: a.id,
        kolicina: a.kolicina
      }
    }))
  }

  const save = async () => {
    try {
      const { data } = await request.post(`/orders`, JSON.parse(localStorage.order))
      console.log(data)
      localStorage.setItem('order', '')
      endOrder()
    }
    catch(exc) {
      console.log(exc)
    }
  }

  console.log(artikli)

  return (
    <FlexCol width={1}>
      <FlexRow width={1} alignItems='flex-end'>
        <FlexCol width={1}>
          <FlexRow>
            <Name>Ime: </Name>
            <Value>{order.ime}</Value>
          </FlexRow>
          <FlexRow>
            <Name>Prezime: </Name>
            <Value>{order.prezime}</Value>
          </FlexRow>
          <FlexRow>
            <Name>Email: </Name>
            <Value>{order.email}</Value>
          </FlexRow>
          <FlexRow>
            <Name>Broj telefona: </Name>
            <Value>{order.broj_telefona}</Value>
          </FlexRow>
          <FlexRow>
            <Name>Adresa: </Name>
            <Value>{order.adresa}</Value>
          </FlexRow>
        </FlexCol>
        <FlexCol ml="auto">
          <Button 
            color="primary" 
            style={{ whiteSpace: "nowrap" }}
            onClick={save}
          > 
            Potvrdi narudžbu 
          </Button>
        </FlexCol>
      </FlexRow>
      <FlexCol width={1} alignItems='center' mt="1rem">
        <Table>
          <thead>
            <tr>
              <th>Artikal</th>
              <th>Količina</th>
              <th>Ukupna cijena</th>
            </tr>
          </thead>
          <tbody>
            {
              artikli.map(({ naziv, kolicina, ukupno }) => (
                <tr>
                  <td>{naziv}</td>
                  <td>
                    {kolicina}
                  </td>
                  <td>
                    {ukupno} KM
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        <FlexRow mr="auto">
          <Name style={{ width: "4.25rem" }}> Ukupno: </Name>
          <Value> {artikli.reduce((a, b) => (a?.ukupno ?? a) + (b?.ukupno ?? b), 0)} KM </Value>
        </FlexRow>
      </FlexCol>
    </FlexCol>
  )
}

export default Page
