import styled, { css } from 'styled-components'
import { FlexCol, FlexRow } from '../../globals'
import { useState } from 'react'

export const StepButton = styled.div`
    background: #FFF;
    outline: none;
    border: 1px solid #cdcdcd;
    padding: 0 1.5rem;
    ${({ active }) => active && `background-color: #3c4b64; color: #FFF;`};
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        //opacity: 0.7;
        cursor: unset;
    }
`

export const IconContainer = styled(FlexCol)`
    height: 100%;
    justify-content: center;
    font-size: 20px;
    margin: 0 1rem;
`

export const Steps = styled(FlexRow)`
    min-height: 40px;
    width: 100%;
    justify-content: center;
    margin-bottom: 1rem;
`

export const Content = styled(FlexCol)`
    width: 100%;
    tr, td, th {
        text-align: center;
        vertical-align: middle;
    }
    padding-top: 1rem;
`

export const Divider = styled.div`
    border-top: 1px solid #6c7b94;
    width: calc(100% + 4.5rem);
    position: absolute;
    left: -2rem;
`

export const Poruka = styled(FlexCol)`
    max-width: 500px;
    margin: auto;
    color: #149414;
    font-size: 1rem;
    padding-top: 2rem;
`