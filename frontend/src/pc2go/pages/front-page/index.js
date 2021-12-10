import React, { useState, useEffect } from 'react'
import LaptopCard from '../../components/laptop-card'
import Filter from '../../components/filter'
import request from '../../request'
import { FlexRow, FlexCol, NaslovPage, Spinner } from '../../globals'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Select from 'react-select'
import { SearchInput, PaginationContainer } from './style'
import { FaSearch } from 'react-icons/fa'
import ReactPaginate from 'react-paginate';

const FrontPage = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [sortBy, setSortBy] = useState({})
  const [filter, setFilter] = useState("")
  const [loading, setLoading] = useState(true)
  
  const [page, setPage] = useState(0)
  const pageSize = 6, totalItems = filteredData.length
  useEffect(() => setPage(0), [filteredData])
  useEffect(() => window.scrollTo({
    top: 0,
    behavior: 'smooth'
  }), [page])

  useEffect(() => {
    request.get('/products')
    .then(({ data }) => {
      console.log(data)
      setData(data)
      setFilteredData(data)
    })
    .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setData([...data].sort((a, b) => {
      if(a[sortBy.by] < b[sortBy.by]) {
        return sortBy.dir
      }
      else if(a[sortBy.by] > b[sortBy.by]) {
        return -sortBy.dir
      }
      else {
        return 0
      }
    }))
    console.log(data)
  }, [sortBy])

  const admin = localStorage.admin == 'true'

  if(loading) {
    return (
      <Spinner />
    )
  }  

  console.log(page * pageSize, (page + 1) * pageSize + 1)

  return (
    <div className="c-app c-default-layout">
      <FlexCol width={1} mt="-1rem">
        <FlexRow width={1} flexWrap='wrap' >
          <NaslovPage mx={[0, 0, "1rem"]} width={[1, 1, "fit-content"]}>Pregled artikala</NaslovPage>
          <FlexRow ml={["0rem", "0rem", "auto"]} width="500px">
            <SearchInput width="100%" mr="0.5rem">
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText> <FaSearch /> </InputGroupText>
                </InputGroupAddon>
                <Input placeholder={admin ? "Pretraži po nazivu ili šifri" : "Pretraži po nazivu"} onChange={e => setFilter(e.target.value) }/>
              </InputGroup>
            </SearchInput>
            <div style={{ width: "100%" }}>
              <Select 
                options={[
                  { label: "Sortiraj po cijeni (rastuće)", value: { by: "cijenaSaPopustom", dir: -1 }},
                  { label: "Sortiraj po cijeni (opadajuće)", value: { by: "cijenaSaPopustom", dir: 1 }},
                ]}
                onChange={({ value }) => setSortBy(value)}
                placeholder="Sortiraj po"
              />
            </div>
          </FlexRow>
        </FlexRow>
        <FlexRow width={1} flexWrap='wrap' alignItems='start'>
          <FlexCol width={[1, 1, admin ? 1 : 2 / 3]} order={[2, 2, 1]}>
            <FlexRow flexWrap='wrap' alignItems='stretch' width={1}>
              {
                filteredData.length == 0 ? (
                  <FlexRow style={{ textAlign: "center" }} width={1}>Nema artikala sa odabranim filterima</FlexRow>
                ) : null
              }
              {filteredData.slice(page * pageSize, (page + 1) * pageSize).map(laptop => {
                return (
                  <FlexCol width={[1, 1 / 2, 1 / 2, admin ? 1 / 3 : 1 / 2, 1 / 3]} p={[0, "0.5rem", "0.75rem"]} py={["1rem", "0.5rem", "1rem"]}>
                    <LaptopCard data={laptop} />
                  </FlexCol>
                )
              })}
            </FlexRow>
            <PaginationContainer width={1}>
              <ReactPaginate 
                previousLabel={'prethodna'}
                nextLabel={'sljedeća'}
                breakLabel={'...'}
                breakClassName={''}
                pageCount={Math.floor((totalItems - 1) / pageSize) + 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(x) => setPage(x.selected)}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </PaginationContainer>
          </FlexCol>
          <FlexCol width={[1, 1, 1 / 3]} order={[1, 1, 2]} pl={[0, "0.75rem", "1rem"]} py={["1rem"]} display={admin ? 'none' : 'visible'}>
            <Filter data={data} setFilteredData={setFilteredData} filter={filter} />
          </FlexCol>
        </FlexRow>
      </FlexCol>
    </div>
  )
}

export default FrontPage
