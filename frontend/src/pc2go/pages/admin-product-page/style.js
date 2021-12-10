import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState } from 'react'

export const ImageUploaderContainer = styled(FlexCol)`
    width: 100%;
    padding-left: 2rem;

    .deleteImage {
        background: #312fdb !important;
        width: 20px !important;
        height: 20px !important;
        font-size: 14px !important;
        line-height: 20px !important;
        font-family: 'Helvetica' !important;
    }

    .chooseFileButton {
        background: #3c4b64 !important;
        border-radius: 0.25rem !important;
    }
`

export const TableContainer = styled(FlexCol)`
    min-width: 370px;
    tr, td {
        vertical-align: middle;
    }
`

export const ErrorFeedback = styled.div`
    color: #dc3545;
    font-size: 12px;
    margin-top: -0.75rem;
`