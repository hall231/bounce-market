import React from 'react'
import styled from 'styled-components'

const BrandsItemStyled = styled.div`
    width: 262px;
    height: 228px;
    box-sizing: border-box;
    margin-right: 17px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    &:nth-child(4n){
        margin-right: 0px;
    }

    img{
        width: 262px;
        height: 180px;
    }


    .info_box{
        padding-left: 16px;
        display: flex;
        align-items: center;
        height: 48px;
        margin-top: -5px;

        span{
            font-weight: 600;
            color: rgba(0,0,0,1);
        }

    }
    
`

export default function BrandsItem({ src, name }) {
    return (
        <BrandsItemStyled>
            <img src={src} alt="" />
            <div className='info_box'>
                <span>{name}</span>
            </div>
        </BrandsItemStyled>
    )
}
