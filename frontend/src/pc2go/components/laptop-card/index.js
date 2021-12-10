import React, { lazy } from 'react'
import { FlexRow, FlexCol } from '../../globals'
import { IMG, Naslov, CardContainer, Specs, DetailsContainer, Cijena, Ocjena, Strikethrough } from './style'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings'

const LaptopCard = ({ data }) => {
  const admin = localStorage.admin == "true"
  return (
    <CardContainer>
      <Link to={`/product/${data.id}`} style={{ width: "100%" }}>
        <IMG 
          src={
            data.slike.length ?
            `${process.env.REACT_APP_API}/products/image/${data.slike[0]?.id}` :
            "https://www.lenovo.com/medias/lenovo-thinkpad-e495-hero.png?context=bWFzdGVyfHJvb3R8MjMxMDY2fGltYWdlL3BuZ3xoMTAvaGYwLzk5NzQ4NjE4NTY3OTgucG5nfDMwYmVjZDMzZjc5OGY4ZTBkZTU2YWZhNDUyNDZlNTVhYzQ4YWE0ZDFjNzAzMmI0YzMzMmUwNjgyNjRlMjQwNTg" 
          }
          alt="slika laptopa"
        />
        <DetailsContainer>
          <Naslov>{data.proizvodjac + " " + data.model}</Naslov>
          {admin && `Šifra: ${data.sifra}`}
          <Specs>{data.procesor} / {data.graficka} / {data.memorija + ' GB'} / {data.velicinaDiska + ' GB ' + data.tipDiska} </Specs>
          <Ocjena>
            <StarRatings
              rating={data.ocjena}
              starRatedColor="#f1b317"
              numberOfStars={5}
              starDimension="14px"
              starSpacing="3px"
            />
          </Ocjena>
          <Cijena> 
            {data.cijenaSaPopustom} {' KM'}
            {data.cijenaSaPopustom < data.cijena && <Strikethrough> {data.cijena} {' KM'}  </Strikethrough>}
          </Cijena>
        </DetailsContainer>
      </Link>
    </CardContainer>
  )
}

export default LaptopCard
