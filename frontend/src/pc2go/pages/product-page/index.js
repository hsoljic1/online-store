import React, { useState, useEffect } from 'react'
import { FlexRow, FlexCol, addNotification, Spinner } from '../../globals'
import request from '../../request'
import { IMG, GalleryWrapper, Cijena, Strikethrough, PitanjeContainer, Wrapper, Username, Datetime, KomentarTekst, OdgovorButtonContainer, Sekcija, NaslovArtikal, StarsContainer } from './style'
import Gallery from 'react-image-gallery'
import { useWindowSize } from '../../hooks'
import { Naslov } from '../../components/laptop-card/style'
import { Button, Table, TabContent, TabPane, Nav, NavItem, NavLink, UncontrolledTooltip, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import classnames from 'classnames';
import moment from 'moment'
import KomentariModal from '../../components/komentari-modal'
import RecenzijeModal from '../../components/recenzije-modal'
import OrderButton from '../../components/order-button'

import StarRatings from 'react-star-ratings'
import label from '../../labels'
import { Link } from 'react-router-dom'

export const Pitanje = ({ komentar, pitanje, baboId, setBaboId, setIsModalOpen, loadData, ...rest }) => {
  const admin = localStorage.admin == "true"
  const [modal, setModal] = useState(false)

  const obrisi = async () => {
    await request.delete(`/questions/${komentar.id}`)
    loadData()
    addNotification("Uspješno ste obrisali pitanje")
    setModal(false)
  }

  return (
    <FlexCol width={1} pl={pitanje ? 0 : '2.5rem'}>
      <PitanjeContainer {...rest}>
        <FlexRow>
          <FlexCol pr="1rem">
            <Username>{komentar.postavio}</Username>
            <Datetime>{moment(komentar.vrijeme).format('DD.MM.YYYY HH:mm')}</Datetime>
          </FlexCol>
          <KomentarTekst>
            {komentar.tekst}
          </KomentarTekst>
        </FlexRow>
        <OdgovorButtonContainer>
          {
            pitanje &&
            <Button onClick={() => {
                setBaboId(baboId)
                setIsModalOpen(true)
              }}
              color="primary"
            >
              Odgovori
            </Button>
          }
          {
            admin && (
              <Button
                onClick={() => setModal(true)}
                color="danger"
                style={{ marginLeft: "0.5rem" }}
              >
                Obriši
              </Button>
            )
          }
        </OdgovorButtonContainer>
      </PitanjeContainer>
      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}> Brisanje pitanja </ModalHeader>
        <ModalBody> Da li ste sigurni da želite obrisati komentar {komentar.tekst}?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={obrisi}> Obriši </Button>
          <Button color="secondary" onClick={() => setModal(false)}> Odustani </Button>
        </ModalFooter>
      </Modal>
    </FlexCol>
  )
}

const Page = ({ match: { params: { id } } }) => {
  const [data, setData] = useState({
    proizvodjac: "",
    model: "",
    cijena: ""
  })
  const [komentari, setKomentari] = useState([])
  const [recenzije, setRecenzije] = useState([])
  const [vise, setVise] = useState(true)
  const [activeTab, toggle] = useState('1')
  const [baboId, setBaboId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalRecenzijeOpen, setIsModalRecenzijeOpen] = useState(false)
  const [postavioRecenziju, setPostavioRecenziju] = useState(localStorage.getItem('recenzirao' + id))
  const [loading, setLoading] = useState(true)

  const loadKomentari = () => {
    request.get(`/questions/${id}`)
      .then(({ data }) => setKomentari(data))
  }

  const loadRecenzije = () => {
    request.get(`/questions/review/${id}`)
      .then(({ data }) => setRecenzije(data))
    setPostavioRecenziju(localStorage.getItem('recenzirao' + id))
  }

  useEffect(() => {
    loadKomentari()
    loadRecenzije()
    request.get(`/products/${id}`)
      .then(({ data }) => setData(data))
      .finally(() => {
        setTimeout(() => setLoading(false), 200)
      })
  }, [])

  useEffect(() => {
    console.log("rece", recenzije)
    request.get(`/products/${id}`)
      .then(({ data }) => setData(data))
  }, [recenzije])

  const windowSize = useWindowSize()

  const admin = localStorage.admin == 'true'

  const [modalBrisi, setModalBrisi] = useState(false)

  const obrisiRecenziju = async () => {
    await request.delete(`/questions/review/${modalBrisi}`)
    loadRecenzije()
    addNotification("Uspješno ste obrisali recenziju")
    setModalBrisi(false)
  }

  if(loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="c-app c-default-layout">
      <Wrapper width={1} mb="1rem">
        <FlexRow width={1} flexWrap='wrap'>
          {
            data?.slike?.length && (
              <GalleryWrapper width={[1, 1, 0.6]} order={[2, 2, 1]}>
                <Gallery
                  items={data.slike.map((item) => ({
                    original: `${process.env.REACT_APP_API}/products/image/${item?.id}`,
                    thumbnail: `${process.env.REACT_APP_API}/products/image/${item?.id}`
                  }))}
                  thumbnailPosition={windowSize.width > 832 ? 'right' : 'bottom'}
                  renderFullscreenButton={() => false}
                />
              </GalleryWrapper>
            )
          }
          <FlexCol width={[1, 1, 0.4]} order={[1, 1, 2]} px="0.5rem" alignItems="center">
            <NaslovArtikal>{data.proizvodjac + " " + data.model}</NaslovArtikal>
            <Cijena>
              {data.cijenaSaPopustom + " KM"}
              {data.cijenaSaPopustom < data.cijena && <Strikethrough> {data.cijena + " KM"} </Strikethrough>}
            </Cijena>
            <FlexRow my="0.75rem">
              <StarRatings
                rating={data.ocjena}
                starRatedColor="#f1b317"
                numberOfStars={5}
                starDimension="25px"
                starSpacing="7px"
              />
              <FlexCol justifyContent="center" ml="0.75rem">
                <Badge color="primary"> {data?.ocjena?.toFixed(2)} </Badge>
              </FlexCol>
            </FlexRow>
            { admin || <OrderButton id={id} /> }
          </FlexCol>
        </FlexRow>
        <FlexCol width={2 / 3} mt="0.5rem">
          <FlexRow width={1}>
            <FlexCol>
              <Sekcija>Specifikacije</Sekcija>
            </FlexCol>
            <FlexCol ml="auto">
              <Link to={`/compare?id=${data.id}`}>
                { admin || <Button color="primary"> Uporedi </Button> }
              </Link>
            </FlexCol>
          </FlexRow>
          <Table striped size="sm">
            <tbody>
              {
                Object.keys(label)
                  .filter(key => label[key])
                  .slice(0, vise ? 9 : 100000)
                  .map(key => (
                    <tr>
                      <td>{label[key]}</td>
                      <td>{data[key]}</td>
                    </tr>
                  ))
              }
            </tbody>
          </Table>
          <FlexCol mt="-1rem" mb="1rem" ml="-1rem">
            <Button color="link" onClick={() => setVise(!vise)} size="lg">
              {vise ? 'Više' : 'Manje'}...
          </Button>
          </FlexCol>
        </FlexCol>
        <Sekcija>Pitanja i Recenzije</Sekcija>
        <FlexCol mb="1rem" width={1}>
          <Nav tabs>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>
                Pitanja
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>
                Recenzije
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <FlexRow width={1} mt="0.875rem" mb="0.5rem">
                <FlexCol>
                  <Naslov>Pitanja</Naslov>
                </FlexCol>
                <FlexCol ml="auto">
                  {
                    admin ||
                    <Button onClick={() => {
                        setIsModalOpen(true)
                        setBaboId(null)
                      }}
                      color="primary"
                    >
                      Postavite pitanje
                    </Button>
                  }
                </FlexCol>
              </FlexRow>
              <FlexCol>
                {
                  komentari.length ? null : (
                    <div>Nema pitanja za ovaj artikal</div>
                  )
                }
                {
                  komentari.map(komentar => (
                    <>
                      <Pitanje
                        komentar={komentar}
                        pitanje
                        baboId={komentar.id}
                        setBaboId={setBaboId}
                        setIsModalOpen={setIsModalOpen}
                        loadData={loadKomentari}
                      />
                      {
                        komentar.odgovori.map(odgovor => (
                          <Pitanje
                            komentar={odgovor}
                            loadData={loadKomentari}
                          />
                        ))
                      }
                    </>
                  ))
                }
              </FlexCol>
              <KomentariModal
                artikalId={id}
                baboId={baboId}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                loadData={loadKomentari}
              />
            </TabPane>
            <TabPane tabId="2">
              <FlexRow width={1} mt="0.875rem" mb="0.5rem">
                <FlexCol>
                  <Naslov>Recenzije</Naslov>
                </FlexCol>
                <FlexCol ml="auto">
                  {
                    admin ||
                    <>
                      <Button 
                        onClick={() => postavioRecenziju || setIsModalRecenzijeOpen(true)} 
                        color="primary" 
                        id="buttonrec" 
                        style={postavioRecenziju ? { opacity: 0.75 } : {} }
                      >
                        Dodajte recenziju
                      </Button>
                      {
                        postavioRecenziju &&
                        <UncontrolledTooltip placement="left" target="buttonrec">
                          Postavili ste recenziju za ovaj artikal
                        </UncontrolledTooltip>
                      } 
                    </>
                  }
                </FlexCol>
              </FlexRow>
              <FlexCol>
                {
                  recenzije.length ? null : (
                    <div>Nema recenzija za ovaj artikal</div>
                  )
                }
                {
                  recenzije.map(({ tekst, postavio, vrijeme, ocjena, id }) => (
                    <PitanjeContainer flexWrap='wrap'>
                      <FlexCol mt="-0.5rem" width={1}>
                        <FlexRow width={1}>
                          <FlexCol>
                            <Username>{postavio}</Username>
                            <Datetime>{moment(vrijeme).format('DD.MM.YYYY HH:mm')}</Datetime>
                          </FlexCol>
                          <FlexRow ml="auto" mr="-1rem">
                            <StarsContainer>
                              <StarRatings
                                rating={ocjena}
                                starRatedColor="#f1b317"
                                //changeRating={this.changeRating}
                                numberOfStars={5}
                                starDimension="20px"
                                starSpacing="5px"
                              />
                            </StarsContainer>
                          </FlexRow>
                        </FlexRow>
                      </FlexCol>
                      <FlexCol mt="0.5rem">
                        {tekst}
                      </FlexCol>
                      <OdgovorButtonContainer>
                        {
                          admin && (
                            <Button
                              onClick={() => setModalBrisi(id)}
                              color="danger"
                              style={{ marginLeft: "0.5rem" }}
                            >
                              Obriši
                            </Button>
                          )
                        }
                      </OdgovorButtonContainer>
                    </PitanjeContainer>
                  ))
                }
              </FlexCol>
              <RecenzijeModal
                artikalId={id}
                isOpen={isModalRecenzijeOpen}
                setIsOpen={setIsModalRecenzijeOpen}
                loadData={loadRecenzije}
              />
            </TabPane>
          </TabContent>
        </FlexCol>
      </Wrapper>
      <Modal isOpen={modalBrisi} toggle={() => setModalBrisi(false)}>
        <ModalHeader toggle={() => setModalBrisi(false)}> Brisanje pitanja </ModalHeader>
        <ModalBody> Da li ste sigurni da želite obrisati komentar {recenzije.find(x => x.id == modalBrisi)?.tekst}?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={obrisiRecenziju}> Obriši </Button>
          <Button color="secondary" onClick={() => setModalBrisi(false)}> Odustani </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Page
