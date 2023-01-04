import React from 'react'
import Head from 'next/head'

const Header = () => {
	return (
		<>
			<Head>
				<title>DIVA ViZ | Diva Protocol</title>
				<meta name="description" content="DIVA Viz" />
				<link rel="icon" href="./favicon.svg" />
			</Head>
			<div className="pt-10 px-16 text-white flex justify-between items-center">
				<div className=" text-4xl font-bold font-body">
					<div>
						<img src="./DIVA-Viz-logo.svg" alt="logo" />
					</div>
				</div>
				<div className="text-base cursor-pointer opacity-70">
					<a href="https://docs.divaprotocol.io/">FAQ</a>
				</div>
			</div>
		</>
	)
}

export default Header
