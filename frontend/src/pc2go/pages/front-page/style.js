import styled from 'styled-components'
import { FlexCol } from '../../globals'
import { useState } from 'react'

export const SearchInput = styled(FlexCol)`
    .input-group {
        height: 38px;
    }
    input {
        height: 38px;
    }
`

export const PaginationContainer = styled(FlexCol)`
    width: 100%;
    align-items: center;

    .pagination li {
        background: #fff;
        border: 1px solid #bbb;
        height: 2rem;
    }

    .pagination a {
        padding: 0.375rem 0.875rem 0.375rem;
        position: relative;
        top: 4px;
    }

    .pagination .active {
        background: #3c4b64;
        color: #fff;
    }

    .pagination .disabled {
        color: #555;
        background: #f0f0f0;
    }

    .pagination a:focus {
        outline: none;
    }
`