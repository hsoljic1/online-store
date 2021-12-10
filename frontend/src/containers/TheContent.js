import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import {userRoutes, adminRoutes} from '../routes'

import styled from 'styled-components'
import { BiHelpCircle } from 'react-icons/bi'
import { UncontrolledTooltip } from 'reactstrap'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)


const HelpContainer = styled.div`
  position: absolute;
  top: -0.125rem;
  right: 0.125rem;
  font-size: 22px;
  
`


const help = {
  "Početna stranica": `
    Na ovoj stranici možete pregledati listu artikala te ih pretraživati i sortirati po cijeni.
    Sa desne strane se nalaze filteri gdje možete suziti izbor artikala. Također, možete filtrirati po nazivu uređaja
    pomoću polja za pretragu u gornjem desnom dijelu.
  `,
  "Odabir specifikacija": `
    Odabir specifikacija može pomoći ukoliko želite
    dobiti uređaj koji najbolje odgovara odabranim filterima, a ne striktno pretraživati po tim filterima.
    Kao rezultat će se vratiti uređaji koji imaju poklapanje sa najvećim brojem filtera.
  `,
  "Poređenje artikala": `
    Odabirom dva artikla dobija se lista njihovih specifikacija. Zelenom bojom je označen artikal koji je 
    bolji po toj specifikaciji. Padajuće liste možete "pretraživati" kucanjem u polje za pretragu.
  `,
  "Pregled korpe": `
    Na ovoj stranici možete upravljati narudžbom kao i podnijeti narudžbu.
    Klikom na naprijed prelazite na sljedeći korak. 
    Na prvom koraku vam je dostupan pregled artikala dodanih u korpu. Klikom na - ili +, smanjujete ili povećavate
    broj tih artikala u korpi. Artikal možete obrisati klikom na dugme obriši pokraj tog artikla.
    Na drugom koraku trebate unijeti vaše lične podatke, molimo vas da unesete tačne podatke kako
    ne bi imali problema prilikom narudžbe.
    Na zadnjem koraku vam je dostupan pregled odabranih artikala, uneseni podaci kao i ukupan iznos za naplatu.
  `,
  "Česta pitanja": `
    Na ovoj stranici možete pregledati neka od najčešće postavljenih pitanja. 
    Klikom na pitanje otvara se naš odgovor na njega.
  `,
  "Pregled artikala ": `
    Na ovoj stranici možete pregledati listu artikala te ih pretraživati i sortirati po cijeni.
    Artikle možete filtrirati po nazivu ili šifri uređaja
    pomoću polja za pretragu u gornjem desnom dijelu.
  `,
  "Novi artikal ": `
    Na ovoj stranici možete dodati novi artikal. Sa lijeve strane se nalaze polja za unos osnovnih podataka
    o artiklu, dok se sa desne strane nalazi polje za upload slika. Sva polja, kao i polje za slike su obavezna polja.
    Klikom na dugme "Sačuvaj artikal" u gornjem desnom uglu, ako ste korektno unijeli sva polja, artikal će se sačuvati te će vam se prikazati
    poruka da ste uspješno sačuvali artikal. Nakon toga ćete biti prebačeni na stranicu za uređivanje tog artikla.
  `,
  "Uređivanje artikla ": `
    Na ovoj stranici možete urediti postojeći artikal. Sa lijeve strane se nalaze polja za unos osnovnih podataka
    o artiklu, dok se sa desne strane nalazi polje za upload slika. Sva polja, kao i polje za slike su obavezna polja.
    Klikom na dugme "Sačuvaj artikal" u gornjem desnom uglu, ako ste korektno unijeli sva polja, sačuvati će se promjene te će vam se prikazati
    poruka da ste uspješno uredili artikal. Pored tog dugmeta nalazi se dugme "Poništi nespremljene promjene" pomoću kojeg možete poništiti promjene za koje
    niste već kliknuli na dugme "Sačuvaj artikal". Pored njega je dugme za brisanje ovog artikla. Nakon potvrde brisanja bit ćete preusmjereni na početnu stranicu.
    Ispod naslova nalazi se link "Pogledaj komentare i recenzije" koji otvara korisnički prikaz artikla na kojem možete administrirati pitanja i recenzije.
  `,
  "Pregled artikla ": `
    Na ovoj stranici se vide osnovni podaci o artiklu na način na koji će biti prikazani korisniku. Pored korisničkih funkcionalnosti, na ovoj
    stranici možete brisati pitanja i recenzije.
  `,
  "Pregled narudžbi ": `
    Na ovoj stranici možete vidjeti listu narudžbi. Za svaku narudžbu je prikazan njen id, ime naručioca, vrijeme narudžbe te njen status.
    Narudžbe možete pretraživati pomoću polja u gornjem desnom uglu.
    Narudžbe su na početku sortirane po vremenu u opadajućem redoslijedu, međutim sortiranje možete promijeniti jednostavnim klikom na naziv kolone u tabeli.
    Klikom na dugme "Detalji" za neku narudžbu prikazuju se detaljniji podaci o naručiocu i o samoj narudžbi. Na tom prikazu možete promijeniti status narudžbe.
  `,
  "Pregled zadnjih komentara ": `
    Na ovoj stranici se nalazi prikaz zadnjih 20 pitanja ili recenzija koji su ostavljeni na bilo koji artikal. Klikom na dugme "Idi na artikal" odlazite
    na stranicu artikla na kojoj možete vidjeti i administrirati pitanja.
  `,
  "Česta pitanja ": `
    Na ovoj stranici možete dodavati, uređivati i brisati pitanja koja će se prikazivati na korisničkoj stranici.
  `
}

const Help = ({ name }) => (
  <HelpContainer>
   { 
    help[name] && (
      <>
        <BiHelpCircle id="helpIcon" />
        <UncontrolledTooltip placement="left" target="helpIcon">
          {help[name]}
        </UncontrolledTooltip>
      </>
    )
    }
  </HelpContainer>
)

const TheContent = () => {
  const routes = localStorage.admin == 'true' ? adminRoutes : userRoutes
  return (
    <main className="c-main" style={{ position: "relative" }}>
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <Help name={route.name}/>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to="/404" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
