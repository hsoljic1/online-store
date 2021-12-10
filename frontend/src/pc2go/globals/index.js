import styled, { css } from 'styled-components'
import { color, layout, compose, space, flexbox } from 'styled-system'
import { store } from 'react-notifications-component';
import { Spinner as Spin } from 'reactstrap' 

export const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;    
`

const InputCss = css`
    height: 35px;
    margin-bottom: 0.65rem;
    width: 100%;
    font-size: 16px;
    padding-left: 4px;
    ${({error}) => error && `border: 1px solid #e32426;`}
`

export const Input = styled.input`
    ${InputCss};
`

export const Textarea = styled.textarea`
    ${InputCss};
    height: 105px;
`

export const Label = styled.label`
    margin-bottom: 0.4rem;
`

export const FlexCol = styled.div` 
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;

    ${compose(color, layout, space, flexbox)}
`

export const FlexRow = styled.div`
    display: flex;
    flex-direction: row;

    ${compose(color, layout, space, flexbox)}
`

export const Button = styled.button`
    font-size: 14px;
    background: #2c3a59;
    color: #fff;
    padding: 0.5rem 1.25rem;
    box-shadow: none;
    border: 0;
    margin: 0 0.5rem;
    width: fit-content
`

export const Error = styled.div`
    color: #e32426;
    font-size: 12px;
    margin-top: -5px;
    margin-bottom: 5px;
`

export const SelectContainer = styled.div`
    width: 100%;
    margin-bottom: 5px;
`

export const NaslovPage = styled.h2`
    font-weight: 400;
    line-height: 1.2;
    color: ##3c4b64;
    font.size: 2rem;
    min-width: 200px;
    ${compose(space, color, layout)};
`

export const addNotification = (message, type = "success", duration = 4000) => {
    console.log(message)
    store.addNotification({
        title: "",
        message: message,
        type: type,
        insert: "top",
        container: "top-center",
        dismiss: {
          duration: duration,
          onScreen: true
        }
    })
}

export const Spinner = () => {
    return (
        <FlexCol width={1} alignItems='center' mt="3rem">
            <Spin type="grow" size="lg" />
        </FlexCol>
    )
}