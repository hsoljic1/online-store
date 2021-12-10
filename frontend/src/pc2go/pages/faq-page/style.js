import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState } from 'react'

export const StyledButton = styled.button`
    width: 100%;
    background-color: #F7f7f7;
    color: #3c4b64;
    margin-top: 0.75rem;
    text-align: left;
    padding: 0.25rem 0.5rem;
    outline: none;
    border: 1px solid black;
    font-size: 18px;
    outline: none;
    border: 1px solid #d9dcdf;
    border-radius: 0;

    &:focus {
        outline: none;
    }
`

export const IconContainer = styled(FlexCol)`
    justify-content: center;
`

export const OdgovorContainer = styled(FlexCol)`
    width: 100%;
    padding: 0.75rem 0.5rem 0.75rem 1.75rem;
    background-color: #e9ecef;
    border: 1px solid #d9dcdf;
    border-top: none;
    font-size: 16px;
`