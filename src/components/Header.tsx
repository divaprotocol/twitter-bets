import React from 'react'
import Head from 'next/head'

const Header = () => {
	return (
		<>
			<Head>
				<title>Twitter Bets | Diva Protocol</title>
				<meta name="description" content="Twitter Bets" />
				<link rel="icon" href="/public/favicon.svg" />
			</Head>
			<div className="pt-10 px-16 text-white flex justify-between items-center">
				<div className=" text-4xl font-bold font-body">
					<div>Twitter Bets</div>
					<div>
						<img src="./title-underline.svg" alt="design" />
					</div>
				</div>
				<div className="text-base cursor-pointer opacity-70">
					<a href="#">FAQ</a>
				</div>
			</div>
		</>
	)
}

export default Header
