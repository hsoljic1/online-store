import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState, useEffect } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'


export const TableContainer = styled(FlexCol)`
    width: 100%;

    tr, td, th {
        vertical-align: middle;
        text-align: center;
    }
`

export const Note = styled(FlexCol)`
    font-size: 10px;
    color: #000;
`

export const Odobreno = styled(FlexCol)`
    margin: auto;
    font-size: 16px;
    color: #063;
    margin-bottom: 0.5rem;
`

const StyledTh = styled.th`
    vertical-align: middle;

    &:hover {
      cursor: pointer;
    }
`

export const TH = ({ children, sort, setSort, notSortable, ...rest }) => {
  const [hover, setHover] = useState(false)
  const hoverStyle = hover ? {
    visibility: "visible",
    width: "16px"
  } : {
    width: "16px"
  }
  if(notSortable) {
    return (
      <th {...rest}>{children}</th>
    )
  }
  return (
    <StyledTh
      {...rest}
      onClick={() => {
        setSort((sort + 2) % 3 - 1)
      }}
      onMouseOver={() => {
        setHover(true)
      }}
      onMouseOut={() => {
        setHover(false)
      }}
    >
      {children}
      <FaArrowDown 
        style={
          sort == 0 ? {
            visibility: "hidden",
            transition: "transform 0.3s",
            fontSize: "12px",
            color: "#b7b7d9",
            ...hoverStyle,
          } : (
            sort == -1 ? {
              transform: "rotate(180deg)",
              transition: "transform 0.3s",
              ...hoverStyle,
            } : {
              transition: "transform 0.3s",
              ...hoverStyle,
            }
          )
        }
      />
    </StyledTh>
  )
}