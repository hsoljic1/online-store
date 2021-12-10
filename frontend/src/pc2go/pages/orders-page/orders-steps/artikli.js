import React, { useState, useEffect } from 'react'
import { FlexRow, FlexCol, NaslovPage, addNotification } from '../../../globals'
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select'
import { Name, Value } from './style'
import { FaAngleRight } from 'react-icons/fa'
import OrderButton from '../../../components/order-button'
import request from 'src/pc2go/request'

const Page = ({ data }) => {

  useEffect(() => {
    if(!localStorage.getItem('order')) {
      localStorage.setItem('order', JSON.stringify({
        ime: '',
        prezime: '',
        email: '',
        broj_telefona: '',
        adresa: '',
        artikli: []
      }))
    }
    const order = JSON.parse(localStorage.order)
    order.artikli = order.artikli.filter(x => x.kolicina)
    localStorage.setItem('order', JSON.stringify(order))
  }, [])

  useEffect(() => updateAll(), [data])

  const [artikli, setArtikli] = useState([])
  const updateAll = () => {
    setArtikli(JSON.parse(localStorage.order).artikli?.map(a => {
      console.log("mappiram", a)
      const laptop = data.find(x => x.id == a.id)
      if(!laptop) {
        return {}
      }
      return {
        naziv: laptop.proizvodjac + " " + laptop.model,
        ukupno: parseFloat(laptop.cijenaSaPopustom) * parseFloat(a.kolicina),
        id: a.id
      }
    }))
  }

  const deleteById = id => {
    const order = JSON.parse(localStorage.order)
    order.artikli.splice(order.artikli.indexOf(x => x.id == id), 1)
    localStorage.setItem('order', JSON.stringify(order))
    addNotification("Uspješno ste obrisali artikal")
    toggleModal()
    updateAll()
  }

  const [modalId, setModalId] = useState(null) 
  const toggleModal = (id) => {
    setModalId(id)
  }
  return (
    <FlexCol px={[0, 0, "6rem"]} width={1}>
      {
        artikli.length ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Artikal</th>
                  <th>Količina</th>
                  <th>Ukupna cijena</th>
                  <th>Obriši</th>
                </tr>
              </thead>
              <tbody>
                {
                  artikli.map(({ naziv, id, ukupno }) => (
                    <tr>
                      <td>{naziv}</td>
                      <td>
                        <OrderButton id={id} update={updateAll} minValue={1} />
                      </td>
                      <td>
                        {ukupno} KM
                      </td>
                      <td>
                        <Button 
                          onClick={() => {
                            toggleModal(id)
                          }} 
                          color="danger"
                        > 
                          Obriši 
                        </Button>
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
          </>
        ) : (
          <FlexRow width={1} justifyContent="center">
            Nema artikala u korpi. Artikal možete dodati u korpu odlaskom na stranicu tog artikla.
          </FlexRow>
        )
      }
      <Modal isOpen={!!modalId} toggle={() => toggleModal(null)}>
        <ModalHeader toggle={() => toggleModal(null)}> Brisanje </ModalHeader>
        <ModalBody> Da li ste sigurni da želite obrisati artikal {artikli.find(x => x.id == modalId)?.naziv}? </ModalBody>
        <ModalFooter> 
          <Button color="danger" onClick={() => deleteById(modalId)}> Obriši </Button>
          <Button color="secondary" onClick={() => toggleModal(null)}> Odustani </Button>
        </ModalFooter>
      </Modal>
    </FlexCol>
  )
}

export default Page
