import React from 'react'
import Header from './Header'

const Layout = ({ children }) => {
	return (
		<div className="bg-black h-screen relative">
			<div className="absolute top-0 left-0 pointer-events-none">
				<img src={'./bg-pattern.svg'} alt="pattern-wave" />
			</div>
			<Header />
			{children}
			<div className="absolute -right-56 -bottom-1/2 pointer-events-none">
				<img src={'./globe.svg'} alt="globe-vector" />
			</div>
		</div>
	)
}

export default Layout
