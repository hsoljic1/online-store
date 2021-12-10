import React, { useState, useEffect } from 'react'
import { FlexRow, FlexCol } from '../../globals'
import { Container, Koliko } from './style'
import { Button, ButtonGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FaShoppingBasket, FaPlus, FaMinus } from 'react-icons/fa'

const OrderButton = ({ id, update, minValue }) => {
  const [order, setOrder] = useState(
    localStorage.order ? 
    JSON.parse(localStorage.order) : {
      ime: '',
      prezime: '',
      email: '',
      broj_telefona: '',
      adresa: '',
      artikli: []
    }
  )
  const [kolicina, setKolicina] = useState(order.artikli.find(x => x.id == id)?.kolicina || 0)
  useEffect(() => {
    if(!localStorage.order) {
      localStorage.setItem('order', JSON.stringify({
        ime: '',
        prezime: '',
        email: '',
        broj_telefona: '',
        adresa: '',
        artikli: []
      }))
    }
    const { artikli } = order
    const artikal = artikli.find(x => x.id == id)
    if(artikal) {
      artikal.kolicina = +kolicina
    }
    else {
      artikli.push({
        id: id,
        kolicina: +kolicina
      })
    }
    const newOrder = JSON.parse(localStorage.order)
    artikli.forEach(a => {
      if(a.id != id) {
        const artikal = newOrder.artikli.find(x => x.id == a.id)
        if(artikal === undefined) {
          a.kolicina = -1
        }
        else {
          a.kolicina = artikal.kolicina
        }
      }
    })
    const noviArtikli = artikli.filter(x => x.kolicina !== -1 && x.id)
    console.log(artikli, localStorage.order)
    setOrder({
      ...order,
      artikli: noviArtikli
    })
  }, [kolicina])

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order))
    update && update()
  }, [order])

  useEffect(() => {
    setKolicina(order.artikli.find(x => x.id == id)?.kolicina)
  }, [order])

  return (
    <Container>
      <ButtonGroup outline>
        <Button onClick={() => setKolicina(Math.max(minValue || 0, kolicina - 1))}>
          <FlexRow>
            <FaMinus />
          </FlexRow>
        </Button>
        <Button 
          color="link" 
          style={{
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          <FlexRow alignItems='center' minWidth="40px" style={{ fontSize: "16px" }}>
            <FaShoppingBasket style={{ marginRight: "5px" }} /> 
            {order?.artikli?.find(x => x.id == id)?.kolicina || 0}
          </FlexRow>
        </Button>
        <Button onClick={() => setKolicina(kolicina + 1)}>
          <FlexRow>
            <FaPlus />
          </FlexRow>
        </Button>
      </ButtonGroup>
    </Container>
  )
}

export default OrderButton
