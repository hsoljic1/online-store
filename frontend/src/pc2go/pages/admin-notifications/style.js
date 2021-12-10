import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState } from 'react'


export const TableContainer = styled(FlexCol)`
    width: 100%;

    tr, td, th {
        vertical-align: middle;
        text-align: center;
    }
`