import { getDateTime, userTimeZone } from '../utils/Dates'
import React, { useEffect, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import { formatUnits, id } from 'ethers/lib/utils'
import { TwitterShareButton } from 'react-share'
import { PayoffProfile } from './payOffProfile'
import ERC20 from '../abi/ERC20ABI.json'
import Web3 from 'web3'

const PayoffChart = ({
	pool,
	isLong,
	decimal,
	collateralTokenSymbol,
	maxYieldTaker,
}) => {
	const {
		floor,
		cap,
		inflection,
		gradient,
		referenceAsset,
		expiryTime,
		takerCollateralAmount,
	} = pool

	return (
		<div className="text-center font-text">
			<div className="text-[#3BFFAD] font-text text-xl text-left">
				Payoff Profile
			</div>
			<div className="text-center font-text">
				<div className="w-[300px] h-[300px] text-center ml-10 mt-10">
					<PayoffProfile
						floor={Number(formatUnits(floor))}
						cap={Number(formatUnits(cap))}
						inflection={Number(formatUnits(inflection))}
						gradient={Number(formatUnits(gradient, decimal))} // TODO add decimals here (not relevant for floor, cap, inflection)
						hasError={false}
						referenceAsset={referenceAsset}
						collateralToken={collateralTokenSymbol}
						longDirection={isLong}
						showMultiple={true}
						maxYieldTaker={maxYieldTaker}
						offerDirection={isLong ? 'Long' : 'Short'}
					/>
				</div>
				<div className="text-[#FF8744] text-base">
					<div className="">{referenceAsset}</div>
					<div className="text-xs text-[#8A8A8A] uppercase ">{`AT ${
						getDateTime(expiryTime) + ' ' + userTimeZone()
					}`}</div>
				</div>
			</div>
		</div>
	)
}

const PoolOffer = ({ pool }: { pool: any }) => {
	const [maxYieldTaker, setMaxYieldTaker] = useState(0)
	const [decimal, setDecimal] = useState(18)
	const [collateralTokenSymbol, SetCollateralTokenSymbol] = useState('')
	const [isCopyButtonClick, setIsCopyButtonClick] = useState(false)
	const isLong = !pool.makerIsLong

	const web3 = new Web3(Web3.givenProvider)

	const {
		referenceAsset,
		expiryTime,
		offerExpiry,
		gradient,
		takerCollateralAmount,
		makerCollateralAmount,
		floor,
		cap,
		inflection,
	} = {
		...pool,
		takerCollateralAmount: Number(formatUnits(pool.takerCollateralAmount)),
		makerCollateralAmount: Number(formatUnits(pool.makerCollateralAmount)),
		floor: Number(formatUnits(pool.floor)),
		cap: Number(formatUnits(pool.cap)),
		inflection: Number(formatUnits(pool.inflection)),
		gradient: parseFloat(formatUnits(pool.gradient, decimal)), // TODO add decimals here (not relevant for floor, cap, inflection),
		referenceAsset: pool.referenceAsset,
		expiryTime: pool.expiryTime,
		offerExpiry: pool.offerExpiry,
	}

	// TODO it collateral token doesn't need to have 18 decimals. Query the number of decimals and replace 18 in here
	const maxYield =
		(Number(formatUnits(pool.takerCollateralAmount, decimal)) +
			Number(formatUnits(pool.makerCollateralAmount, decimal))) /
		Number(formatUnits(pool.takerCollateralAmount, decimal))

	useEffect(() => {
		// TODO Use decimals correctly
		setMaxYieldTaker(
			(Number(formatUnits(pool.takerCollateralAmount, decimal)) +
				Number(formatUnits(pool.makerCollateralAmount, decimal))) /
				Number(formatUnits(pool.takerCollateralAmount, decimal))
		)
	}, [pool])

	const OfferExpiryTime = `${getDateTime(offerExpiry) + ' ' + userTimeZone()}`
	const PoolExpiryTime = `${
		getDateTime(pool.expiryTime) + ' ' + userTimeZone()
	}`

	useEffect(() => {
		const token = new web3.eth.Contract(ERC20 as any, pool.collateralToken)

		token.methods
			.symbol()
			.call()
			.then((symbol) => {
				SetCollateralTokenSymbol(symbol)
			})

		token.methods
			.decimals()
			.call()
			.then((decimals: number) => {
				setDecimal(decimals)
			})
			.catch((err) => {
				console.error(err)
			})
	}, [pool.collateralToken])

	return (
		<div className="mt-6 mb-10">
			<div
				className="border-8 border-[#D9D9D9] w-[1000px] min-h-[580px]  bg-[#000000] relative pointer-events-none px-10"
				id="my-node">
				<div className="flex gap-6">
					{/* Left side */}
					<div>
						<div className="absolute top-0 left-0 pointer-events-none">
							<img src={'./bg-pattern.svg'} alt="pattern-wave" />
						</div>
						<div className="pt-6  text-white flex justify-between items-center">
							<div className=" text-4xl font-bold font-body">
								<div>Twitter Bets</div>
								<div>
									<img src="./title-underline.svg" alt="design" />
								</div>
							</div>
						</div>

						<div className="pt-4 font-text">
							<div className="flex items-center">
								<div className="mr-2">
									<img src="./Tokens.svg" alt="tokens" />
								</div>
								<div className="">
									<div className="text-3xl">{referenceAsset}</div>
									<div className="text-xs text-[#8A8A8A] uppercase mt-0 font-text">{`AT ${
										getDateTime(expiryTime) + ' ' + userTimeZone()
									}`}</div>
								</div>
							</div>
						</div>

						<div className="relative group overflow-hidden w-fit mt-4">
							<div className="bg-[#FFCB45] py-2 px-3 flex items-center justify-end text-black font-text text-xs animate-shine">
								<div className="h-1 w-1 bg-[#EE4D37] rounded-full mr-2"></div>
								<div className="font-bold mr-1 ">Offer available until</div>
								<div className="font-text">
									{getDateTime(offerExpiry) + ' ' + userTimeZone()}
								</div>
							</div>
							<div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 animate-shine" />
						</div>

						<div className="flex mt-4 items-center">
							<div className="flex items-center mr-4">
								<div className="mr-2">
									<img src="./USDT-Coin.svg" alt="coin" />
								</div>
								<div className="font-text">
									<div className="text-xl text-[#3BFFAD]">
										Maximum available
									</div>
									<div className="font-medium text-2xl">
										{formatUnits(pool.takerCollateralAmount, decimal)}
										{/**TODO Use decimals here */}
									</div>
								</div>
							</div>
							<div className="flex items-center">
								<div className="mr-2">
									<img src="./shine-color-icons.svg" alt="max" />
								</div>
								<div className="font-text">
									<div className="text-xl text-[#1AD3FF]"> Max yield</div>
									<div className="font-medium text-2xl">
										{maxYield.toFixed(2)}x
									</div>
								</div>
							</div>
						</div>

						<div className="mt-6 flex flex-col gap-3 w-[520px]">
							<div className="border-[0.4px] border-[#8A8A8A] flex text-xs px-4 py-2 items-center gap-1 font-text">
								<div className="mr-3">
									<img src="./up-arrow.svg" alt="up" />
								</div>
								<div className="text-[#76FFC6]">
									<strong>
										<span style={{ color: '#3393E0' }}>
											{maxYieldTaker.toFixed(2) + 'x'}
										</span>
									</strong>
								</div>
								{isLong ? (
									/** Taker is long */
									<div>
										if {referenceAsset} is {inflection < cap ? 'at or ' : ''}{' '}
										above {cap} on {PoolExpiryTime}
									</div>
								) : (
									/** Taker is short */
									<div>
										if {referenceAsset} is {floor < inflection ? 'at or ' : ''}{' '}
										below {floor} on {PoolExpiryTime}
									</div>
								)}
							</div>
							<div className="border-[0.4px] border-[#8A8A8A] flex text-xs px-4 py-2 items-center gap-1 font-text">
								<div className="mr-3">
									<img src="./equal-arrow.svg" alt="up" />
								</div>
								<div className="text-[#89A5E3]">
									{isLong ? (
										/** Taker is long */
										<strong>
											<span style={{ color: '#3393E0' }}>
												{(gradient * maxYieldTaker).toFixed(2) + 'x'}
											</span>
										</strong>
									) : (
										/** Taker is short */
										<strong>
											<span style={{ color: '#3393E0' }}>
												{((1 - gradient) * maxYieldTaker).toFixed(2) + 'x'}
											</span>
										</strong>
									)}
								</div>
								<div>
									{' '}
									if BTC/USDT is at {inflection} on {PoolExpiryTime}
								</div>
							</div>

							<div className="border-[0.4px] border-[#8A8A8A] flex text-xs px-4 py-2 items-center gap-1 font-text">
								<div className="mr-3">
									<img src="./down-arrow.svg" alt="up" />
								</div>
								<div className="text-[#F47564]">
									<strong>
										<span style={{ color: '#3393E0' }}>0.00x</span>
									</strong>
								</div>
								<div>
									{isLong ? (
										/** Taker is long */
										<div>
											if {referenceAsset} is{' '}
											{floor < inflection ? 'at or ' : ''} below {floor} on{' '}
											{PoolExpiryTime}
										</div>
									) : (
										/** Taker is short */
										<div>
											if {referenceAsset} is {inflection < cap ? 'at or ' : ''}{' '}
											above {cap} on {PoolExpiryTime}
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="text-[10px] text-[#8A8A8A] font-text mt-1">
							Note: A max yield of {maxYieldTaker.toFixed(2) + 'x'} means that
							putting in 100 {collateralTokenSymbol} will return a maximum of{' '}
							{(maxYieldTaker * 100).toFixed(0)} {collateralTokenSymbol} (net
							gain {((maxYieldTaker - 1) * 100).toFixed(0)}{' '}
							{collateralTokenSymbol})
						</div>
						{/** TODO replace USDT with actual collateral token symbol */}

						{/* data provider */}
						<div className="flex gap-2 items-center justify-center  text-xs font-text bg-[#FFFFFF] border-[0.4px] border-[#0D0D0D] w-fit h-[33px] mt-6 px-2">
							<div className="text-black font-medium">Data Provider:</div>
							<div className="text-black text-xs">{pool.dataSourceName}</div>
						</div>
					</div>

					{/* right side */}
					<div className="flex flex-col w-full pt-6">
						{/* <div className="text-base opacity-70 text-right">{`#${id}`}</div> */}
						<PayoffChart
							pool={pool}
							isLong={isLong}
							decimal={decimal}
							collateralTokenSymbol={collateralTokenSymbol}
							maxYieldTaker={maxYieldTaker}
						/>
						<div className="mt-8">
							<div className="font-text flex items-center justify-end gap-3">
								<div>
									<img src="./favicon.svg" alt="diva" width={50} height={34} />
								</div>
								<div>
									<div className="text-[#1AD3FF] text-xs">Powered by</div>
									<div className="text-[#F4F6F8]">DIVA Protocol</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-6 opacity-70">
					{/* horizontal line  */}
					<div className="border-[0.4px] border-[#8A8A8A] w-full"></div>
					<div className="font-text text-[#8A8A8A] text-[10px] mt-1">
						Risk Disclaimer: Website and the information contained herein is not
						intended to be a source of advice or credit analysis with respect to
						the material presented, and the information and/or documents
						contained in this website do not constitute investment advice.
					</div>
				</div>
			</div>
			<div className="mt-2 flex gap-2">
				<button
					onClick={() => {
						htmlToImage
							.toJpeg(document.getElementById('my-node'), { quality: 0.95 })
							.then(function (dataUrl) {
								var link = document.createElement('a')
								link.download = `${123}-pool.jpeg`
								link.href = dataUrl
								link.click()
							})
					}}
					className="flex items-center justify-center gap-2 text-[#8A8A8A] border-[1px] border-[#8A8A8A] px-3 py-1 font-text">
					<div>
						<img src="./download-vector.svg" alt="download" />
					</div>
					<div>Download</div>
				</button>
				<button
					onClick={() => {
						//
						setIsCopyButtonClick(true)
						navigator.clipboard.writeText(
							`https://divaviz.com/${pool.offerHash}`
						)
						setTimeout(() => {
							setIsCopyButtonClick(false)
						}, 2000)
					}}
					className="flex items-center justify-center gap-2 text-[#8A8A8A] border-[1px] border-[#8A8A8A] px-3 py-1 font-text min-w-[118px]">
					{isCopyButtonClick ? (
						<div>Copied</div>
					) : (
						<>
							<div>
								<img src="./copy-vector.svg" alt="copy" />
							</div>
							<div>Copy Link</div>
						</>
					)}
				</button>

				<TwitterShareButton
					url={`https://divaviz.com/${pool.offerHash}`}
					title={'Sharing the Twitter bets'}>
					<div className="flex items-center justify-center gap-2 text-[#8A8A8A] border-[1px] border-[#8A8A8A] px-3 py-1 font-text">
						<div>
							<img src="./twitter-logo.svg" alt="twitter" />
						</div>
						<div>Share on Twitter</div>
					</div>
				</TwitterShareButton>
			</div>
		</div>
	)
}

export default PoolOffer
