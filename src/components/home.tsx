import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

const home = () => {
	const [isButtonClicking, setIsButtonClicking] = React.useState<boolean>(false)
	const [inputPoolId, setInputPoolId] = React.useState<string>('')
	const [error, setError] = React.useState<string>('')
	const inputElRef = useRef(null)
	const router = useRouter()
	const [isLong, setIsLong] = useState(true)

	useEffect(() => {
		inputElRef.current.focus()
	}, [])

	const handleClick = () => {
		if (inputPoolId.length > 0) {
			router.push({
				pathname: `/${inputPoolId}`,
			})
		} else {
			setError('Please enter a pool hash')
			inputElRef.current.focus()

			// clear error message after 5 seconds
			setTimeout(() => {
				setError('')
			}, 3000)
		}
	}

	return (
		<div className="text-white flex flex-col justify-center items-center mt-20">
			<div className="flex flex-col justify-center items-center font-cirka leading-relaxed tracking-widest">
				<div className="text-6xl font-bold mb-3">Share your offers</div>
				<div className="text-6xl font-bold flex">
					with the
					<div className="flex ml-3 relative">
						<div>world</div>
						<div className="top-[1.55rem] right-[4.4rem] absolute pointer-events-none">
							<img src="./o-vector.svg" alt="o" width={34} />
						</div>
						<div className="absolute right-[-1.15rem] top-[-0.5rem]">
							<img src="./star-vector.svg" alt="star" />
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 text-xl font-text font-light text-[#D2D2D2] relative">
				<div className="absolute bottom-[-0.6rem] left-[-1rem]">
					<img src="./star-vector.svg" alt="star" width={25} />
				</div>
				Generate your offer post to share with the world
			</div>
			<div className="mt-11">
				<input
					className={`w-[28.75rem] h-[3.75rem] border-[0.4px] ${
						error ? 'border-red-400' : 'border-x-sky-50'
					}  bg-black placeholder:text-center uppercase text-center focus:placeholder-transparent font-text font-bold focus:outline-none text-xs tracking-widest placeholder:tracking-widest text-[#8A8A8A]`}
					type="text"
					placeholder="ENTER YOUR OFFER HASH HERE"
					value={inputPoolId}
					onChange={(e) => setInputPoolId(e.target.value)}
					ref={inputElRef}
				/>
			</div>
			{/* commented for future use */}
			{/* <div className="mt-2">
				<div className="border-2 border-[#8A8A8A] flex gap-2 p-1 uppercase font-text text-xs">
					<div
						className={`${
							isLong
								? 'bg-[#8A8A8A] text-black font-bold'
								: 'bg-black text-[#8A8A8A]'
						} cursor-pointer px-1 py-1`}
						onClick={() => setIsLong(true)}>
						Long
					</div>
					<div
						className={`${
							!isLong
								? 'bg-[#8A8A8A] text-black font-bold'
								: 'bg-black text-[#8A8A8A]'
						} cursor-pointer px-1 py-1`}
						onClick={() => setIsLong(false)}>
						Short
					</div>
				</div>
			</div> */}
			<div className="mt-2 h-3">
				{error && (
					<div className="text-xs text-red-400 font-text font-bold">
						{error}
					</div>
				)}
			</div>
			<div
				className="mt-9 overflow-hidden cursor-pointer "
				onMouseDown={() => setIsButtonClicking(true)}
				onMouseUp={() => setIsButtonClicking(false)}
				style={{
					transform: isButtonClicking ? 'scale(0.95)' : 'scale(1)',
				}}
				onClick={handleClick}>
				<img src="./post-btn.svg" />
			</div>
		</div>
	)
}

export default home
