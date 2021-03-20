import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import radio_select from './assets/radio_select.svg'
import radio_no_select from './assets/radio_no_select.svg'

const RadioStyled = styled.div`
    .title{
        font-weight: 700;
        font-size: 13px;
        color: rgba(0,0,0,.6);
        margin-bottom: 8px;
        margin-top: ${({ marginTop }) => { return marginTop || '24px' }};
    }

    .select_box{
        display: flex;
        height: 48px;
        align-items: center;
        &>li{
            display: flex;
            margin-right: 30px;

            &:last-child{
                margin-right: 0px;
            }

            img{
                margin-right: 16px;
                cursor: pointer;

            }
        }
    }
`

export default function Radio({
    title,
    options = [],
    defaultValue,
    onValChange
}) {
    const [curSelect, setCurSelect] = useState(options && options[0])

    useEffect(() => {
        onValChange && onValChange(curSelect)
        // eslint-disable-next-line
    }, [curSelect])

    useEffect(() => {
        const arr = options.filter(item => {
            return item.name === defaultValue || item.value === defaultValue
        })

        if (arr.length !== 0) {
            setCurSelect(arr[0])
        }
        // eslint-disable-next-line
    }, [])

    return (
        <RadioStyled>
            {title && <p className={`title`}>{title}</p>}
            <ul className="select_box">
                {options.map(item => {
                    return <li key={item.name}>
                        <img onClick={() => {
                            setCurSelect(item)
                        }} src={curSelect.name === item.name ? radio_select : radio_no_select} alt="" />
                        <p>{item.name}</p>
                    </li>
                })}
            </ul>
        </RadioStyled>
    )
}
