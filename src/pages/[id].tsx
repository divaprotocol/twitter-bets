import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PoolOffer from '../components/poolOffer'
import { useWhitelist } from '../hooks/useWhitelist'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PoolDetails = () => {
	const router = useRouter()
	const [poolData, setPoolData] = useState(null)
	const [isPoolLoading, setIsPoolLoading] = useState(false)
	const dataSource = useWhitelist()
	const [dataSourceName, setDataSourceName] = useState('')
	const { id } = router.query

	useEffect(() => {
		if (id) {
			setIsPoolLoading(true)
			axios(
				'https://eip712api.xyz/diva/offer/v1/' + 'create_contingent_pool/' + id
			)
				.then((data) => {
					setPoolData(data.data)
					setIsPoolLoading(false)
				})
				.catch((err) => {
					console.error(err)
					setIsPoolLoading(false)
				})
		}
	}, [id])

	useEffect(() => {
		if (poolData?.dataProvider) {
			const dataName = dataSource?.dataProviders?.find(
				(dataName: { id: string }) => dataName?.id == poolData?.dataProvider
			)
			if (dataName?.name != null) {
				setDataSourceName(dataName?.name)
			} else {
				setDataSourceName(poolData?.dataProvider)
			}
		}
	}, [dataSource.dataProviders, poolData?.dataProvider])

	return (
		<div className="text-white mt-16 pb-0">
			<button
				onClick={() => {
					router.push('/')
				}}>
				<div className="flex items-center px-16 text-[#8A8A8A] text-base font-text">
					<div className="mr-2">
						<img src="./nav-arrow.svg" alt="arrow" width={32} />
					</div>
					<div>Back to Home</div>
				</div>
			</button>
			<div className="flex flex-col items-center justify-center bg-black">
				<h1 className="text-6xl font-bold font-cirka tracking-wider">
					Your offer post is here!
				</h1>
				<div className="text-xl font-text text-[#D2D2D2] mt-6 font-light">
					You can now share this across the world to get your offer filled
				</div>
				{isPoolLoading || !poolData ? (
					<div className="mt-6">
						<Skeleton
							width={861.51}
							height={500}
							baseColor="#202020"
							highlightColor="#444"
						/>
					</div>
				) : (
					<PoolOffer pool={{ ...poolData, dataSourceName: dataSourceName }} />
				)}
			</div>
		</div>
	)
}

export default PoolDetails
