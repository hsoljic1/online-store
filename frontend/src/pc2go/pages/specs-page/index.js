import React, { useState } from 'react'
import LaptopCard from '../../components/laptop-card'
import Filter from '../../components/filter'
import request from '../../request'
import { FlexRow, FlexCol, NaslovPage, Spinner } from '../../globals'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Select from 'react-select'
import { SearchInput } from './style'
import { FaSearch } from 'react-icons/fa'
import FilterSpecs from '../../components/filter-specs'

const Page = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false) 

  const onSearch = async (params) => {
    setLoading(true)
    try {
      const { data } = await request.post(`/products/similar`, params)
      console.log(data)
      setData(data)
    }
    catch(exc) {
      console.log(exc)
    }
    setLoading(false)
  }
  
  return (
    <div className="c-app c-default-layout">
      <FlexCol width={1} mt="-1rem">
        <FlexRow width={1} flexWrap='wrap'>
          <NaslovPage mx={[0, 0, 0]} mb="1rem" width={[1, 1, "fit-content"]}> Odabir specifikacija </NaslovPage>
        </FlexRow>
        <FlexRow width={1} flexWrap='wrap' alignItems="start">
          <FlexCol width={[1, 1, 1, 0.4, 0.3]} my="1rem" >
            <FilterSpecs onSearch={onSearch} />
          </FlexCol>
          <FlexCol width={[1, 1, 1, 0.6, 0.7]} pl={[0, 0, 0, "0.75rem", "1rem"]} pb={["1rem"]}>
            {
              loading ? (
                <Spinner />
              ) : (
                <FlexRow flexWrap='wrap' alignItems='stretch'>
                  {data.map(laptop => {
                    return (
                      <FlexCol width={[1, 1, 1 / 2, 1 / 2, 1 / 3]} p={[0, 0, "0.75rem", "1rem"]} pb={["1rem", "0.5rem", "1rem"]} pt={0}>
                        <LaptopCard data={laptop} />
                      </FlexCol>
                    )
                  })}
                </FlexRow>
              )
            }
          </FlexCol>
        </FlexRow>
      </FlexCol>
    </div>
  )
}

export default Page
