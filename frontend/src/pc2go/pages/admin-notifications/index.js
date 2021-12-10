import React, { useState, useEffect } from 'react'
import request from 'src/pc2go/request'
import { FlexCol, FlexRow, NaslovPage, addNotification, Spinner } from 'src/pc2go/globals'
import label from '../../labels'
import ImageUploader from 'react-images-upload'
import { Table, FormGroup, Input, Button } from 'reactstrap'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { TableContainer } from './style'
import { useWindowSize } from '../../hooks'

const MAX_LENGTH = 30
const FrontPage = ({ match: { params: { id } } }) => {
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const windowSize = useWindowSize()

  useEffect(() => {
    request.get('/questions/notifications')
    .then(({ data }) => {
      setData(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => console.log(data), [data])

  if(loading) {
    return (
      <Spinner />
    )
  }

  return (
    <FlexCol width={1}>
      <FlexRow mb="0.75rem">
        <NaslovPage> Pregled zadnjih pitanja i recenzija </NaslovPage>
      </FlexRow>
      <TableContainer width={1}>
        <Table size="sm" striped>
          <thead>
            <tr>
              <th> Postavio </th>
              <th> Vrijeme </th>
              {windowSize.width < 832 || <th>Tekst</th>}
              <th> Vrsta </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(({ tekst, postavio, id, artikal_id, vrijeme, vrsta }) => (
                <tr>
                  <td>{postavio}</td>
                  <td>{moment(vrijeme).format('DD.MM.YYYY. HH:mm')}</td>
                  {windowSize.width < 832 || <td> {tekst.length < MAX_LENGTH ? tekst : tekst.substr(0, MAX_LENGTH - 3) + "..."} </td>}
                  <td> {vrsta} </td>
                  <td>
                    <Link to={`/user-product/${artikal_id}`}>
                      <Button
                        color="primary"
                        size="sm"
                      >
                        Idi na artikal
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </TableContainer>
    </FlexCol>
  )
}

export default FrontPage
