import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState } from 'react'

export const IMG = styled.img`
    width: 100%;
    border-bottom: 1px solid #ddd;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
`

export const Naslov = styled(FlexCol)`
    color: #05171f;
    font-size: 24px;
`

export const Specs = styled(FlexCol)`
    font-size: 14px;
    color: #5F7f8E;
`

export const CardContainer = styled(FlexCol)`
    background: #FFF;
    border: 1px solid #aFcfdE;
    height: 100%;
    border-radius: 0.25rem;
    width: 100%;
    padding: 0.25rem 0.5rem;

    .input-range__label-container {
      color: #01200f;
      font-family: 'Verdana';
    }

    .collapse, .show, .collapsing {
      width: 100%;
    }
`

export const DetailsContainer = styled(FlexCol)`
    padding: 0.5rem 0.5rem;
`

export const Span = styled.div`
    padding-left: 2rem;
`

export const CollapseIcon = styled(FlexCol)`
    @media(min-width: 831px) {
        display: none;
    }
`

export const InputContainer = styled(FlexCol)`
    width: 50%;
    margin-bottom: 0.5rem;
    padding-right: 0.75rem;

    @media(max-width: 832px) {
        width: 100%;
        padding: 0;
    }
`