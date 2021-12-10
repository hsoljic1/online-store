import React, { useState, useEffect } from 'react'
import request from 'src/pc2go/request'
import { FlexCol, FlexRow, NaslovPage, addNotification, Spinner } from 'src/pc2go/globals'
import label from '../../labels'
import ImageUploader from 'react-images-upload'
import { Table, FormGroup, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, Badge, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import moment from 'moment'
import { TableContainer, Note, Odobreno, TH } from './style'
import { useWindowSize } from '../../hooks'
import { FaSearch } from 'react-icons/fa'
import { Name, Value } from '../orders-page/orders-steps/style'
import { SearchInput } from '../front-page/style'
import { BsBoxArrowInDown } from 'react-icons/bs'
import { FaSpinner } from 'react-icons/fa'
import { HiOutlineClipboardCheck } from 'react-icons/hi'

const odobrenaNaziv = ['Zaprimljena', 'U obradi', 'Isporučeno']
const odobrenaColor = ['primary', 'primary', 'primary']

const OdobrenaColor = id => {
  if(id == 0) {
    return <BsBoxArrowInDown />
  }
  else if(id == 1) {
    return <FaSpinner />
  }
  else {
    return <HiOutlineClipboardCheck />
  }
}

const visible = (x, y) => {
  return x == y ? {
    display: 'none'
  } : {
    display: 'initial'
  }
}

const FrontPage = ({ match: { params: { id } } }) => {
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const windowSize = useWindowSize()

  const [modalId, setModalId] = useState(null)
  const toggleModal = (id) => {
    setModalId(id)
  }

  useEffect(() => {
    request.get('/orders')
    .then(({ data }) => {
      setData(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => console.log(data), [data])

  const [filter, setFilter] = useState("")

  const [sort, setSort] = useState(0)
  const [sortColumn, setSortColumn] = useState("")

  const fnSort = naziv => s => {
    setSort(s)
    setSortColumn(naziv)
  }

  if(loading) {
    return (
      <Spinner />
    )
  }

  const odobri = async (modalId, setTo) => {
    try {
      const id = modalId
      await request.put(`/orders/${id}`, {
        odobrena: setTo
      })
      addNotification(`Uspješno ste promijenili status narudžbe '${id}'`)
      data.find(x => x.id == id).odobrena = setTo
      setData(data)
      toggleModal()
    }
    catch(error) {
      console.log(error)
    }
  }

  console.log(modalId)
  const order = data.find(({ id }) => id == modalId)

  return (
    <TableContainer width={1}>
      <FlexRow mb="0.75rem" width={1}>
        <NaslovPage> Pregled narudžbi </NaslovPage>
        <SearchInput width={["100%", "100%", "250px"]} ml="auto" mr="0.5rem">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText> <FaSearch /> </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="Pretraži" onChange={e => setFilter(e.target.value?.toLowerCase()) }/>
          </InputGroup>
        </SearchInput>
      </FlexRow>
      <Table size="sm" striped>
        <thead>
          <tr>
            <TH sort={sortColumn == "id" ? sort : 0} setSort={fnSort("id")}> Id </TH>
            <TH sort={sortColumn == "narucilac" ? sort : 0} setSort={fnSort("narucilac")}> Naručilac </TH>
            { windowSize.width < 832 || <TH sort={sortColumn == "datetime" ? sort : 0} setSort={fnSort("datetime")}> Vrijeme </TH> }
            <TH sort={sortColumn == "status" ? sort : 0} setSort={fnSort("status")}> Odobrena narudžba </TH>
            <TH sort={0} notSortable> </TH>
          </tr>
        </thead>
        <tbody>
          {
            data.map(({ ime, prezime, id, vrijeme, odobrena }) => ({
              ime, prezime, id, vrijeme, odobrena,
              narucilac: ime + " " + prezime,
              datetime: moment(vrijeme).format('DD.MM.YYYY. HH:mm'),
              status: odobrenaNaziv[odobrena]
            })).filter(({ ime, prezime, id, vrijeme, odobrena, datetime, status }) => {
              return (
                ime.toLowerCase().includes(filter) ||
                prezime.toLowerCase().includes(filter) ||
                datetime.includes(filter) ||
                status.toLowerCase().includes(filter) ||
                ("" + id).includes(filter)
              ) 
            }).sort((a, b) => {
              if(sortColumn) {
                let x = a[sortColumn], y = b[sortColumn]
                if(typeof a[sortColumn] == 'string') {
                  x = a[sortColumn].toLowerCase()
                  y = b[sortColumn].toLowerCase()
                }
                if(x == y) {
                  return 0
                }
                else if(x < y) {
                  return sort
                }
                else {
                  return -sort
                }
              }
              else {
                return 0
              }
            }).map(({ ime, prezime, id, vrijeme, odobrena, datetime, status }) => (
              <tr>
                <td>{id}</td>
                <td>{ime + " " + prezime}</td>
                { windowSize.width < 832 || <td>{datetime}</td> }
                <td>
                   {status} {OdobrenaColor(odobrena)}
                </td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => toggleModal(id)}
                    size="sm"
                  >
                    Detalji
                  </Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      <Modal isOpen={modalId} toggle={() => toggleModal(null)}>
        <ModalHeader toggle={() => toggleModal(null)}> Narudžba {1} </ModalHeader>
        <ModalBody>
          <FlexCol width={1}>
            <FlexRow width={1} alignItems='flex-end'>
              <FlexCol width={1}>
                <FlexRow>
                  <Name>Ime: </Name>
                  <Value>{order?.ime}</Value>
                </FlexRow>
                <FlexRow>
                  <Name>Prezime: </Name>
                  <Value>{order?.prezime}</Value>
                </FlexRow>
                <FlexRow>
                  <Name>Email: </Name>
                  <Value>{order?.email}</Value>
                </FlexRow>
                <FlexRow>
                  <Name>Broj telefona: </Name>
                  <Value>{order?.broj_telefona}</Value>
                </FlexRow>
                <FlexRow>
                  <Name>Adresa: </Name>
                  <Value>{order?.adresa}</Value>
                </FlexRow>
              </FlexCol>
            </FlexRow>
            <FlexCol width={1} alignItems='center' mt="1rem">
              <Table dark>
                <thead>
                  <tr>
                    <th>Artikal</th>
                    <th>Količina</th>
                    <th>Ukupna cijena</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    order?.artikli.map(({ proizvodjac, model, cijena, kolicina }) => (
                      <tr>
                        <td>{proizvodjac + " " + model}</td>
                        <td>
                          {kolicina}
                        </td>
                        <td>
                          {kolicina * cijena} KM
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <FlexRow mr="auto">
                <Name style={{ width: "4.25rem" }}> Ukupno: </Name>
                <Value> {order?.artikli.map(a => a.kolicina * a.cijena).reduce((a, b) => a + b, 0)} KM </Value>
              </FlexRow>
            </FlexCol>
          </FlexCol>
        </ModalBody>
        <ModalFooter>
          Promijeni status:
          <ButtonGroup>
            <Button disabled={data.find(x => x.id == modalId)?.odobrena == 0} outline={!(data.find(x => x.id == modalId)?.odobrena == 0)} onClick={() => odobri(modalId, 0)} color={odobrenaColor[0]}> {odobrenaNaziv[0]} {OdobrenaColor(0)} </Button>
            <Button disabled={data.find(x => x.id == modalId)?.odobrena == 1} outline={!(data.find(x => x.id == modalId)?.odobrena == 1)} onClick={() => odobri(modalId, 1)} color={odobrenaColor[1]}> {odobrenaNaziv[1]} {OdobrenaColor(1)} </Button>
            <Button disabled={data.find(x => x.id == modalId)?.odobrena == 2} outline={!(data.find(x => x.id == modalId)?.odobrena == 2)} onClick={() => odobri(modalId, 2)} color={odobrenaColor[2]}> {odobrenaNaziv[2]} {OdobrenaColor(2)} </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </TableContainer>
  )
}

export default FrontPage
