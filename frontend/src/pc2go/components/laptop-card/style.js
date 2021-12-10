import styled from 'styled-components'
import { FlexCol, FlexRow } from '../../globals'

export const IMG = styled.img`
    width: 100%;
    border-bottom: 1px solid #ddd;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    height: 220px;
    @media(max-width: 832px) {
        height: 260px;
    }
    object-fit: cover;
`

export const Naslov = styled(FlexCol)`
    color: #3c4b64;
    font-size: 22px;
    margin-bottom: 0.25rem;
`

export const Specs = styled(FlexCol)`
    font-size: 13px;
    color: #5F7f8E;
`

export const CardContainer = styled(FlexCol)`
    background: #FFF;
    border: 1px solid #aFcfdE;
    width: 100%;
    height: 100%;
    border-radius: 0.25rem;
    padding-bottom: 30px;
    position: relative;
`

export const DetailsContainer = styled(FlexCol)`
    padding: 0.5rem 0.5rem;
`

export const Cijena = styled(FlexRow)`
    color: #3c4b64;
    font-size: 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.5rem;
    padding-bottom: 0.25rem;
    font-weight: 600;
`

export const Ocjena = styled(FlexCol)`
    position: absolute;
    bottom: 0;
    left: 0;
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
`

export const Strikethrough = styled.span`
    text-decoration: line-through;
    margin-left: 0.25rem;
    font-size: 14px
`