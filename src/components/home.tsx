import React from 'react'

const home = () => {
	return (
		<div className="text-white flex flex-col justify-center items-center mt-20 ">
			<div className="flex flex-col justify-center items-center font-cirka leading-relaxed tracking-widest">
				<div className="text-6xl font-bold">Share your offers</div>
				<div className="text-6xl font-bold">with the world</div>
			</div>
			<div className="mt-6 text-xl font-text font-light text-[#D2D2D2]">
				Generate your offer post to share with the world
			</div>
			<div className="mt-11">
				<input
					className="w-[28.75rem] h-[3.75rem] border-[0.4px] border-x-sky-50 bg-black placeholder:text-center uppercase text-center focus:placeholder-transparent font-text font-bold focus:outline-none text-xs tracking-widest placeholder:tracking-widest text-[#8A8A8A]"
					type="text"
					placeholder="Enter your pool id here"
				/>
			</div>
			<div className="mt-9 overflow-hidden">
				<button
					className="w-[14.313rem] h-[3rem] bg-[#FFEB34] border-b-8 border-[#CDB900] text-black"
					style={{
						clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
					}}>
					Generate Post --
				</button>
			</div>
		</div>
	)
}

export default home
