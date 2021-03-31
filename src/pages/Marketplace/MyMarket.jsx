import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router'
import Search from '../component/Other/Search'
import { CardItem } from './CardItem'
import { PullRadioBox } from '@components/UI-kit'

import nav_audio from '@assets/images/icon/nav_audio.svg'
import nav_game from '@assets/images/icon/nav_game.svg'
import nav_image from '@assets/images/icon/nav_image.svg'
import nav_other from '@assets/images/icon/nav_other.svg'
import nav_video from '@assets/images/icon/nav_video.svg'
import icon_arts from '@assets/images/icon/image.svg'
import icon_comics from '@assets/images/icon/comics.svg'
import icon_sport from '@assets/images/icon/sport.svg'

import useAxios from '@/utils/useAxios'
import { Controller } from '@/utils/controller'
import { useLazyQuery } from '@apollo/client'
import { QueryMyTradePools } from '@/utils/apollo'
import { useActiveWeb3React } from '@/web3'
import { SkeletonNFTCards } from '../component/Skeleton/NFTCard'
import { AUCTION_TYPE, NFT_CATEGORY } from '@/utils/const'

const MarketplaceStyled = styled.div`
    width: 1100px;
    margin: 0 auto;
    margin-bottom: 30px;

    .nav_wrapper{
      
        width: 1100px;
        margin: 0 auto;
        margin-top: 50px;
        display: flex;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(0,0,0,.1);

        li{
            padding: 7px 20px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            user-select: none;
            opacity: .4;
            img{
                margin-right: 7.15px;
            }

            &.active{
                background-color: rgba(0,0,0,.1);
                opacity: 1;
            }
        }
    }

    .filterBox{
        margin-top: 32px;
        /* margin-bottom: 50px; */
        display: flex;
        justify-content: space-between;
    }

    .list_wrapper{
        width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;

        li{
            margin-top: 32px;
            margin-right: 17px;

            &:nth-child(4n){
                margin-right: 0;
            }
        }

        &.Video{
            li{
                margin-top: 32px;
                margin-right: 18px;

                &:nth-child(2n){
                    margin-right: 0;
                }
            }
        }
    }
`

const nav_list = [{
  name: 'Images',
  icon: nav_image,
  route: 'Images'
}, {
  name: 'Video',
  icon: nav_video,
  route: 'Video'
}, {
  name: 'Audios',
  icon: nav_audio,
  route: 'Audio'
}, {
  name: 'Game',
  icon: nav_game,
  route: 'Games'
}, {
  name: 'Others',
  icon: nav_other,
  route: 'Others'
}]

export default function MyMarket() {
  let { type } = useParams()
  const history = useHistory()
  const { active, account } = useActiveWeb3React()
  
  const { sign_Axios } = useAxios();
  const [tokenList, setTokenList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [channel, setChannel] = useState(
    type === NFT_CATEGORY.Sports ? NFT_CATEGORY.Sports :
      type === NFT_CATEGORY.ComicBooks ? NFT_CATEGORY.ComicBooks :
        NFT_CATEGORY.FineArts);


  const [loading, setLoading] = useState(true)

  const [length, setLength] = useState(4);

  type = 'Image'

  const handleTradeData = (tradeData) => {

    const tradePools = tradeData.tradePools.map(item => {
      return {
        ...item,
        poolType: AUCTION_TYPE.FixedSwap
      }
    });
    
    const tradeAuctions = tradeData.tradeAuctions.map(item => {
      return {
        ...item,
        price: item.lastestBidAmount !== '0' ? item.lastestBidAmount : item.amountMin1,
        poolType: AUCTION_TYPE.EnglishAuction
      }
    });

    const ids_list = tradePools.concat(tradeAuctions).map(item => item.tokenId);
    setLength(ids_list.length);
    const pools = tradePools.concat(tradeAuctions)
    sign_Axios.post(Controller.items.getitemsbyfilter, {
      ids: ids_list,
      category: '',
      channel: ''
    })
      .then(res => {
        if (res.status === 200 && res.data.code === 1) {
          const res_data = res.data.data
          const list = pools.map((item, index) => {
            const poolInfo = res_data.find(res => item.tokenId === res.id);
            return {
              ...poolInfo,
              poolType: item.poolType,
              poolId: item.poolId,
              price: item.price,
              token1:item.token1,
              createTime: item.createTime
            }
          })
          const result = list.sort((a, b) => b.createTime - a.createTime)
          setTokenList(result);
          setFilterList(result);
          setLoading(false)
        }
      })
  }

  const [getMyTradeNFT, { data: traddata }] = useLazyQuery(QueryMyTradePools,
    {
      variables: { user: String(account).toLowerCase() },
      fetchPolicy: "network-only",
      onCompleted: () => {
        handleTradeData(traddata || [])
      },

    })

  useEffect(() => {
    if (!active) return
    getMyTradeNFT();
  }, [active, getMyTradeNFT])

  const handleChange = (filterSearch) => {
    const list = tokenList.filter(item => item.itemname.toLowerCase().indexOf(filterSearch) > -1
      || item.owneraddress.toLowerCase().indexOf(filterSearch) > -1);
    setFilterList(list);
  }

  const renderListByType = (type) => {
    switch (type) {
      case 'Image':
        return <ul className={`list_wrapper ${type}`}>
          {filterList.map((item, index) => {
            return <li key={index}>
              <CardItem
                cover={item.fileurl}
                name={item.itemname}
                cardId={item.poolId}
                nftId={item.id}
                price={item.price}
                token1={item.token1}
                poolType={item.poolType}
              />
            </li>
          })}
        </ul>

      default:
        return <ul className={`list_wrapper ${type}`}>
          {filterList.map((item, index) => {
            return <li key={index}>
              <CardItem
                cover={item.fileurl}
                name={item.itemname}
                cardId={item.id}
                price={item.price}
                token1={item.token1}
                poolType={item.poolType}
              />
            </li>
          })}
        </ul>
    }
  }



  return (
    <MarketplaceStyled>
      {false && <ul className="nav_wrapper">
        {nav_list.map((item) => {
          return <li key={item.name} className={type === item.route ? 'active' : ''} onClick={() => {
            history.push(`/Marketplace/${item.route}`)
          }}>
            <img src={item.icon} alt="" />
            <p>{item.name}</p>
          </li>
        })}
      </ul>}
      <ul className="nav_wrapper">
        {'Fine Arts、Sports、Comic Books'.split('、').map(e => ({ name: e })).map((item) => {
          return <li key={item.name} className={channel === item.name ? 'active' : ''} onClick={() => {
            setChannel(item.name)
          }}>
            <p className="flex flex-center-y"><img src={
              item.name === NFT_CATEGORY.FineArts ? icon_arts :
                item.name === NFT_CATEGORY.Sports ? icon_sport :
                  item.name === NFT_CATEGORY.ComicBooks ? icon_comics :
                    ''
            } alt="" />{item.name}</p>
          </li>
        })}
      </ul>

      <div className="filterBox">
        <Search placeholder={'Search Items and Accounts'} onChange={handleChange} />

        <PullRadioBox prefix={'Gategory:'} width={'205px'} options={[{ value: 'Image' }]} defaultValue='Image' onChange={(item) => {
          // console.log(item)
        }} />

        <PullRadioBox prefix={'Currency:'} width={'205px'} options={[{ value: 'ETH' }]} defaultValue='ETH' onChange={(item) => {
          // console.log(item)
        }} />

        <PullRadioBox prefix={'Sort by:'} width={'204px'} options={[{ value: 'New' }, { value: 'Popular' }]} defaultValue='New' onChange={(item) => {
          // console.log(item)
        }} />
      </div>

      {loading && <SkeletonNFTCards n={length} ></SkeletonNFTCards>}
      {renderListByType(type)}

      {/* <PagingControls /> */}
    </MarketplaceStyled>
  )
}

