import React from 'react'
import styled from 'styled-components';

export const StyledFooter = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-radius: 0px 0px 4px 4px;
    background-color: #f0f0f0;

    input {
        width: 100%;
        background: white;
        border: 1px solid #ccc;
        outline: none;
        height: 40px;
        border-radius: 20px;
        color: #333;
        padding: 0 15px;
        font-size: 16px;
    }

    button {
        position: absolute;
        right: 20px;
        background: #007bff;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }

        &:active {
            background-color: #004085;
        }

        &:focus {
            outline: none;
        }
    }
`;
