import React, { useState, useEffect } from 'react'
import request from 'src/pc2go/request'
import { FlexCol, FlexRow, NaslovPage, addNotification, Spinner } from 'src/pc2go/globals'
import label from '../../labels'
import ImageUploader from 'react-images-upload'
import { Table, FormGroup, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner as RSpinner, FormFeedback } from 'reactstrap'
import { ImageUploaderContainer, TableContainer, ErrorFeedback } from './style'
import { Pitanje } from '../product-page'
import KomentariModal from '../../components/komentari-modal'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'
import placeholders from '../../placeholders'

const schema = yup.object().shape({
  //sifra: yup.string().required("Polje je obavezno"),
  proizvodjac: yup.string().required("Polje proizvođač je obavezno"),
  model: yup.string().required("Polje model je obavezno"),
  procesor: yup.string().required("Polje procesor je obavezno"),
  graficka: yup.string().required("Polje grafička karta je obavezno"),
  memorija: yup.number().typeError("Polje memorija je obavezno").required("Polje je obavezno")
    .min(1, "Vrijednost mora biti pozitivna"),
  tipMemorije: yup.string().required("Polje tip memorije je obavezno"),
  velicinaDiska: yup.number().typeError("Polje veličina diska je obavezno").required("Polje je obavezno")
    .min(1, "Vrijednost mora biti pozitivna"),
  tipDiska: yup.string().required("Polje tip diska je obavezno"),
  portovi: yup.string().required("Polje portovi je obavezno"),
  velicinaEkrana: yup.string().required("Polje veličina ekrana je obavezno"),
  os: yup.string().required("Polje operativni sistem je obavezno"),
  cijena: yup.number().typeError("Polje cijena je obavezno").required("Polje je obavezno").min(1, "Vrijednost mora biti pozitivna"),
  popust: yup.number().typeError("Polje popust je obavezno").required("Polje je obavezno").min(0, "Vrijednost mora biti veća ili jednaka od 0")
  .lessThan(yup.ref('cijena'), 'Popust mora biti manji od cijene'),
  rezolucijaEkrana: yup.string().required("Polje rezolucija ekrana je obavezno"),
  garancija: yup.number().typeError("Polje garancija je obavezno").required("Polje je obavezno").min(1, "Vrijednost mora biti pozitivna"),
  opis: yup.string().required("Polje opis je obavezno")
});

const numericFields = ['memorija', 'velicinaDiska', 'velicinaEkrana', 'cijena', 'popust', 'garancija']
const textareaFields = ['opis']
const selectFields = ['tipDiska', 'rezolucijaEkrana']

const inputType = key => {
  if(numericFields.includes(key)) {
    return 'number'
  }
  if(textareaFields.includes(key)) {
    return 'textarea'
  }
  if(selectFields.includes(key)) {
    return 'select'
  }
  return 'text'
}

const options = {
  tipDiska: [
    'HDD', 'SSD', 'SSD+HDD'
  ],
  rezolucijaEkrana: [
    'HD',
    'FULL HD'
  ]
}

function dataURLtoFile(dataurl, filename) {
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      filename='slika.'+mime.split('/')[1]
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

const FrontPage = ({ match: { params: { id } } }) => {
  const [pictures, setPictures] = useState([])
  const [form, setForm] = useState({
    tipDiska: "HDD",
    rezolucijaEkrana: "HD"
  })
  const [data, setData] = useState({})
  const [defaultPictures, setDefaultPictures] = useState([])
  const [oldImages, setOldImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [imgError, setImgError] = useState("")

  const { register, handleSubmit, errors, reset, formState } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  })

  const loadAll = () => {
    request.get(`/products/${id}`)
      .then(({ data }) => {
        setData(data)
        setForm(data)
        reset(data)
        setDefaultPictures(data.slike.map(slika => `${process.env.REACT_APP_API}/products/image/${slika.id}`))
        setOldImages(data.slike)
      })
      .catch(() => history.push('/404'))
    loadKomentari()
  }

  useEffect(() => {
    if(id) {
      loadAll()
    }
    else {
      setLoading(false)
    }
  }, [])
  console.log("slike" , oldImages)

  const onChange = e => {
    console.log(e.target.name, e.target.value)
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setPictures(pictureDataURLs.filter(u => u[0] == 'd').map(u => dataURLtoFile(u)))
    setOldImages(oldImages.filter(i => pictureDataURLs.some(u => 
      u.includes(process.env.REACT_APP_API) && i.id == parseInt(u.split("/").reverse().join()))
    ))
  }

  useEffect(() => console.log("pictures", pictures), [pictures])
  useEffect(() => console.log("oldImages", oldImages), [oldImages])

  const saveFiles = async (id) => {
    if(oldImages.length == 0 && pictures.length == 0) {
      throw "treba slika jedna"
    }
    const formData = new FormData();
    pictures.forEach(file => {
      formData.append("images", file);
    });
    formData.append('id', id || data.id)
    console.log("OOOO", oldImages, data.slike)
    formData.append('removedImages', JSON.stringify((data?.slike || []).filter(s => !oldImages.some(s1 => s1.id == s.id))))

    await request.post("/products/files",formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

  const history = useHistory()
  const save = async () => {
    if(oldImages.length == 0 && pictures.length == 0) {
      return
    }
    setEditing(true)
    try {
      const { data } = await request.post('/products', {
        ...form,
        sifra: Math.floor((Math.random() * 1e10)),
        cijenaSaPopustom: form.cijena - form.popust
      })
      console.log("data", data)
      await saveFiles(data.id)
      addNotification("Uspješno ste kreirali novi artikal")
      history.push(`/product/${data.id}`)
    }
    catch (error) {
      console.log(error)
    }
    setEditing(false)
  }

  const update = async () => {
    setEditing(true)
    try {
      const { data } = await request.put(`/products/${id}`, {
        ...form,
        cijenaSaPopustom: form.cijena - form.popust
      })
      await saveFiles()
      addNotification("Uspješno ste uredili artikal")
    }
    catch (error) {
      console.log(error)
    }
    setEditing(false)
  }

  const containerDrop = (e) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("drop da bit")
  }

  const [modal, setModal] = useState(false)
  const toggleDelete = () => {
    setModal(!modal)
  }

  const deleteItem = async () => {
    try {
      await request.delete(`/products/${id}`)
      addNotification("Uspješno ste obrisali artikal")
      toggleDelete()
      history.push('/')
    }
    catch(error) {
      console.log(error)
    }
  }

  
  const [baboId, setBaboId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [komentari, setKomentari] = useState([])
  const loadKomentari = () => {
    request.get(`/questions/${id}`)
      .then(({ data }) => {
        setKomentari(data)
        setLoading(false)
      })
  }

  const [modalPonisti, setModalPonisti] = useState(false)

  const ponistiPromjene = () => {
    addNotification("Poništili ste sve nespremljene promjene")
    loadAll()
    setModalPonisti(false)
  }

  if(loading) {
    return (
      <Spinner />
    )
  }


  console.log("id", id)
  return (
    <FlexCol width={1}>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(id ? update : save)}>
        <FlexRow width={1}>
          <NaslovPage mx={[0, 0, 0]} width={[1, 1, "fit-content"]}> 
            {!id ? "Novi artikal" : "Uređivanje artikla" } 
          </NaslovPage>
          <FlexRow ml="auto" pl="1rem" justifyContent='center'>
            <Button color="primary" type="submit" disabled={editing}> 
              Sačuvaj artikal 
              { 
                editing && (
                  <RSpinner size="sm" style={{ marginLeft: "0.5rem" }}/> 
                )
              }
            </Button>
            {id && <Button color="primary" type="button" onClick={() => setModalPonisti(true)} style={{ marginLeft: "0.5rem" }}> Poništi nespremljene promjene </Button>}
            {id && <Button color="danger" type="button" onClick={toggleDelete} style={{ marginLeft: "0.5rem" }}> Obriši artikal </Button>}
          </FlexRow>
        </FlexRow>
        {
          id && (
            <FlexRow width={1} mb="1.5rem" mt="0.5rem">
              <Link to={`/user-product/${id}`}>
                <a style={{ textDecoration: 'underline' }}> Pogledaj pitanja i recenzije </a>
              </Link>
            </FlexRow>
          )
        }
        <FlexRow width={1} flexWrap='wrap'>
          <TableContainer minWidth="45%" width={[1, 1, "45%"]}>
            <Table>
              <tbody>
                {
                  Object.keys(label)
                    .filter(key => label[key])
                    .filter(key => key != "cijenaSaPopustom" && key != "sifra")
                    .map(key => (
                      <tr>
                        <td>{label[key]} *</td>
                        <td>
                          <FlexCol>
                            <FormGroup style={{ width: "100%" }}>
                              <Input 
                                name={key} 
                                placeholder={placeholders[key]}
                                onChange={onChange} 
                                innerRef={register} 
                                invalid={errors[key]?.message}
                                type={inputType(key)}
                                rows="6"
                                min={0}
                                step="any"
                              >
                                {options[key]?.map(x => (
                                  <option value={x}> {x} </option>
                                ))}
                              </Input>
                            </FormGroup>  
                            <ErrorFeedback> {errors[key]?.message} </ErrorFeedback>
                          </FlexCol>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </Table>
          </TableContainer>
          <FlexCol width={[1, 1, 'calc(100% - 45%)']}>
            <ImageUploaderContainer 
              onDrop={containerDrop}
            >
              <ImageUploader
                withIcon={true}
                buttonText='Odaberi slike *'
                onChange={onDrop}
                imgExtension={['.jpg', '.jpeg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                withPreview
                defaultImages={defaultPictures}
                label="Maksimalna veličina datoteke je 5MB. Dozvoljeni tipovi slika su .jpg, .gif i .png"
                fileSizeError=" veličina datoteke je prevelika"
                fileTypeError=" nije podržana ekstenzija"
              />
              <ErrorFeedback> {oldImages.length == 0 && pictures.length == 0 && formState.submitCount ? "Morate odabrati barem jednu sliku" : null} </ErrorFeedback>
            </ImageUploaderContainer>
            {/*
            <FlexCol pr="2rem" pl="1rem" ml="1rem" width={1} style={{ borderLeft: "1px solid #ccc" }} display={id ? 'visible' : 'none'}>
              <FlexRow width={1} mt="0.875rem" mb="0.5rem">
                <FlexCol>
                  <NaslovPage> Pitanja za artikal</NaslovPage>
                </FlexCol>
              </FlexRow>
              <FlexCol width={1}>
                {
                  komentari.map(komentar => (
                    <>
                      <Pitanje
                        komentar={komentar}
                        pitanje
                        baboId={komentar.id}
                        setBaboId={setBaboId}
                        setIsModalOpen={setIsModalOpen}
                      />
                      {
                        komentar.odgovori.map(odgovor => (
                          <Pitanje
                            komentar={odgovor}
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
            </FlexCol>
            */}
          </FlexCol>
        </FlexRow>
        <Modal isOpen={modal} toggle={() => toggleDelete(null)}>
          <ModalHeader toggle={() => toggleDelete(null)}> Brisanje artikla </ModalHeader>
          <ModalBody>
            Da li ste sigurni da zelite obrisati {form.proizvodjac + " " + form.model}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteItem}> Obriši </Button>
            <Button color="secondary" onClick={() => toggleDelete(null)}> Odustani </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modalPonisti} toggle={() => setModalPonisti(false)}>
          <ModalHeader toggle={() => setModalPonisti(false)}> Poništite promjene </ModalHeader>
          <ModalBody>
            Da li ste sigurni da zelite poništiti nespremljene promjene?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ponistiPromjene}> Poništi promjene </Button>
            <Button color="secondary" onClick={() => setModalPonisti(false)}> Odustani </Button>
          </ModalFooter>
        </Modal>
      </form>
    </FlexCol>
  )
}

export default FrontPage
