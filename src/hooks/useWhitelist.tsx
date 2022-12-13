import request, { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const queryWhitelist = gql`
	{
		dataProviders {
			id
			name
			dataFeeds {
				id
				referenceAssetUnified
				active
			}
		}
		dataFeeds {
			id
			referenceAsset
			referenceAssetUnified
			active
			dataProvider {
				id
			}
		}
		collateralTokens {
			id
			name
			decimals
			symbol
		}
	}
`
export type DataProvider = {
	dataFeeds: { id: string; referenceAssetUnified: string; active: boolean }[]
	id: string
	name: string
}

export type DataFeed = {
	dataProvider: {
		id: string
	}
	id: string
	referenceAsset: string
	referenceAssetUnified: string
	active: boolean
}

export type WhitelistCollateralToken = {
	id: string
	name: string
	symbol: string
	decimals: number
}

export type WhitelistQueryResponse = {
	dataProviders: DataProvider[]
	dataFeeds: DataFeed[]
	collateralTokens: WhitelistCollateralToken[]
}

export function useWhitelist() {
	const whitelistQuery = useQuery<WhitelistQueryResponse>(
		`whitelist-${5}`,
		() =>
			request(
				'https://api.thegraph.com/subgraphs/name/divaprotocol/diva-whitelist-goerli',
				queryWhitelist
			)
	)

	const dataFeeds = whitelistQuery.data?.dataFeeds
	const dataProviders = whitelistQuery.data?.dataProviders
	const collateralTokens = whitelistQuery.data?.collateralTokens

	const referenceAssets = (dataFeeds || [])
		.filter((v) => v.active)
		.map((v) => {
			return v.referenceAssetUnified
		})
		.filter((value, index, self) => self.indexOf(value) === index)

	const getProvidersByAsset = (referenceAssetUnified: string) =>
		dataProviders?.filter((p) =>
			p.dataFeeds.some((f) => f.referenceAssetUnified === referenceAssetUnified)
		)
	return {
		dataFeeds,
		dataProviders,
		collateralTokens,
		referenceAssets,
		getProvidersByAsset,
	}
}
