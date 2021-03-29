
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/winless/bouncenft',
    //uri: 'https://api.thegraph.com/subgraphs/id/QmZi2uuo9jYTuBNnHyig2Gf8TK2BEErKbvrWA8kfYN8bfg',
    //uri: 'https://api.thegraph.com/subgraphs/name/winless/bouncenft2',
    cache: new InMemoryCache(),
})

export const QueryTradePools = gql`
  query {
    tradePools {
      tokenId
      poolId
      price
    }
    tradeAuctions {
      tokenId
      poolId
      lastestBidAmount
      amountMin1
    }
  }
`

export const QueryItesms = gql`
  query {
    bounce721Items {
      tokenId
    }
    bounce1155Items {
      tokenId
    }
  }
`

export const QueryBrands = gql`
  query {
    bounce721Brands {
      id
    }
    bounce1155Brands {
      id
    }
  }
`

export const  QueryMyNFT = gql`
  query nftItems($user: String!) {
    nft721Items(where: {user: $user}) {
      tokenId
    }
    nft1155Items(where: {user: $user}) {
      tokenId
    }
  }
`

export const QueryOwnerBrandItems = gql`
  query nftItems($owner: String!) {
    bounce721Brands(where: {owner: $owner}) {
      tokenList {
        tokenId
      } 
    }
    bounce1155Brands(where: {owner: $owner}) {
      tokenList {
        tokenId
      }
    }
  }
`

export const QueryBrandTradeItems = gql`
  query brandTradeItems($tokenList: [Int!]!) {
    tradePools(where: {tokenId_in: $tokenList}) {
      tokenId
      poolId
      price
    }
    tradeAuctions(where: {tokenId_in: $tokenList}) {
      tokenId
      poolId
    }
  }
`

export const QueryBrand721 = gql`
  query {
    bounce721Brands {
      id
      owner
      nft
      tokenCnt
      tokenList {
        tokenId
      }
    }
  }
`

export const QueryActivity = gql`
  query queryActivitiesByUser($user: Bytes!) {
    poolCreates(where: {sender: $user}) {
      poolId
      timestamp
    }
    poolSwaps(where: {sender: $user}) {
      poolId
      timestamp
    }
    poolCancels(where: {sender: $user}) {
      poolId
      timestamp
    }
    auctionCreates(where: {sender: $user}) {
      poolId
      timestamp
    }
    auctionBids(where: {sender: $user}) {
      poolId
      timestamp
    }
    auctionClaims(where: {sender: $user}) {
      poolId
      timestamp
    }
  }
`