import React, { useState, useEffect } from 'react'
import Filter from '../../components/filter'
import request from '../../request'
import { FlexRow, FlexCol, NaslovPage, Spinner } from '../../globals'
import { Button, Badge, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import Select from 'react-select'
import { StepButton, IconContainer, Steps, Content, Divider, Poruka } from './style'
import { FaAngleRight } from 'react-icons/fa'
import Artikli from './orders-steps/artikli'
import Data, { schema } from './orders-steps/data'
import Confirm from './orders-steps/confirm'
import { Link } from 'react-router-dom'


const Page = () => {

  const [step, setStep] = useState(0)
  const [finished, setFinished] = useState(false)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [tooltip, setTooltip] = useState("")

  useEffect(() => {
    request.get('/products')
    .then(({ data }) => {
      console.log(data)
      setData(data)
    })
    .finally(() => setLoading(false))
  }, [])

  const naprijed = async () => {
    if(step == 0) {
      const artikli = JSON.parse(localStorage.order).artikli
      if(!artikli.some(x => x.kolicina > 0)) {
        setTooltip("Morate dodati bar jedan artikal")
        return
      }
    }
    if(step == 1) {
      const order = JSON.parse(localStorage.order)
      delete order.artikli
      const isValid = await schema.isValid(order)
      console.log("isValid", isValid)
      if(!isValid) {
        console.log(handleDataSubmit)
        try {
          handleDataSubmit(e => e.preventDefault())()
        }
        catch {}
        setTooltip("Morate unijeti validne podatke")
        return
      }
    }
    setStep(step + 1)
  }

  useEffect(() => setTooltip(""), [step])
  useEffect(() => {
    if(tooltip) {
      setTimeout(() => setTooltip(""), 5000)
    }
  }, [tooltip])

  const [handleDataSubmit, setHandleDataSubmit] = useState(() => 1)

  if(finished) {
    return (
      <FlexCol width={1} alignItems="center">
        <Poruka>
          Narudžba je zaprimljena. Ukoliko ste ispravno unijeli email, na njega će vam doći 
          potvrda da je narudžba zaprimljena.
        </Poruka>
        <Link to="/">
          <Button color="primary" style={{ marginTop: "0.75rem" }}> Nazad na početnu stranicu </Button>
        </Link>
      </FlexCol>
    )
  }

  if(loading) {
    return (
      <Spinner />
    )
  }

  
  return (
    <div className="c-app c-default-layout">
      <FlexCol width={1}>
        <Steps width={1}>
          <StepButton 
            active={step == 0}
            //onClick={() => setStep(0)}
          >
            <Badge 
              color={step == 0 ? "danger" : "primary"}
              style={{ marginRight: "0.25rem", fontSize: "12px" }}
            >
              1.
            </Badge>
            Pregled korpe
          </StepButton>
          <IconContainer> <FaAngleRight /> </IconContainer>
          <StepButton 
            active={step == 1}
            //onClick={() => setStep(1)}
          >
            <Badge 
              color={step == 1 ? "danger" : "primary"}
              style={{ marginRight: "0.25rem", fontSize: "12px" }}
            >
              2.
            </Badge>
            Unos podataka
          </StepButton>
          <IconContainer > <FaAngleRight /> </IconContainer>
          <StepButton 
            active={step == 2}
            //onClick={() => setStep(2)}
          >
            <Badge 
              color={step == 2 ? "danger" : "primary"}
              style={{ marginRight: "0.25rem", fontSize: "12px" }}
            >
              3.
            </Badge>
            Potvrda narudžbe
          </StepButton>
        </Steps>
        <FlexRow mb="1.5rem" mt={[0, 0, "-0.75rem"]} width={1}>
          <FlexCol>
            <Button color="primary" disabled={step == 0} onClick={() => setStep(step - 1)}> Nazad </Button>
          </FlexCol>
          <FlexCol ml="auto">
            <Button color="primary" disabled={step == 2} onClick={naprijed} id="naprijed_button"> Naprijed </Button>
            <Popover placement="left" isOpen={!!tooltip} target="naprijed_button" toggle={() => false}>
              <PopoverHeader> Greška </PopoverHeader>
              <PopoverBody> {tooltip} </PopoverBody>
            </Popover>
          </FlexCol>
        </FlexRow>
        <div style={{ position: "relative", width: "100%" }}>
          <Divider />
        </div>
        <Content>
          {
            step == 0 ? <Artikli data={data} /> : (
              step == 1 ? <Data setHandleDataSubmit={setHandleDataSubmit} /> : (
                <Confirm endOrder={() => setFinished(true)} data={data} />
              )
            )
          }
        </Content>
      </FlexCol>
    </div>
  )
}

export default Page
