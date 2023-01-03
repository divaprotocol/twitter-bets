import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import * as d3 from 'd3'

export function PayoffProfile(props) {
	const ref = useRef()
	const {
		floor,
		cap,
		inflection: strike,
		gradient,
		hasError,
		longDirection,
		collateralToken,
		referenceAsset,
		maxYieldTaker,
		showMultiple,
	} = props

	const padding = cap * 0.1
	const start = Math.max(floor - padding, 0)

	const maxPayoutLong = 1
	const maxPayoutShort = 1
	const tickValues = [0, 1 - gradient, 0.5, gradient, 1]

	const getShortenedRefAsset = (referenceAsset) => {
		if (referenceAsset != null && referenceAsset.length >= 10) {
			const begining = referenceAsset.slice(0, 10)

			return `${begining}...`
		} else return referenceAsset
	}
	const refenAsst = getShortenedRefAsset(referenceAsset)
	const short = [
		{
			x: start,
			y: maxPayoutShort,
		},
		{
			x: floor,
			y: maxPayoutShort,
		},
		{
			x: strike,
			y: 1 - gradient,
		},
		{
			x: cap,
			y: 0,
		},
		{
			x: cap + padding,
			y: 0,
		},
	]
	const long = [
		{
			x: start,
			y: 0,
		},
		{
			x: floor,
			y: 0,
		},
		{
			x: strike,
			y: gradient,
		},
		{
			x: cap,
			y: maxPayoutLong,
		},
		{
			x: cap + padding,
			y: maxPayoutLong,
		},
	]
	const longdata = long.map(({ x, y }) => ({
		x: parseFloat(x),
		y: parseFloat(y),
	}))
	const [chartWidth, setWidth] = useState(300)
	const [axisLabel, setAxisLabel] = useState('')
	const domainMin = d3.min(longdata, function (d) {
		return d.x
	})

	const domainMax = d3.max(longdata, function (d) {
		return d.x
	})
	const f = d3.format('.2f')

	useLayoutEffect(() => {
		const callback = () => {
			const rect = ref.current?.getBoundingClientRect()
			setWidth(rect?.width || 0)
		}
		window.addEventListener('resize', callback)
		callback()
		return () => {
			window.removeEventListener('resize', callback)
		}
	}, [ref.current])

	const chartHeight = 300

	const margin = { top: 10, right: 10, bottom: 30, left: 10 },
		width = chartWidth - margin.left - margin.right,
		height = chartHeight - margin.top - margin.bottom

	useEffect(() => {
		if (collateralToken != undefined) {
			setAxisLabel(collateralToken)
		}
	}, [props.collateralToken])

	const lineSeriesStyle = { strokeWidth: '3px' }

	if (hasError) lineSeriesStyle.stroke = 'red'

	const intitalChart = () => {
		const svg = d3.select(ref.current)
		svg
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('overflow', 'visible')
	}
	useEffect(() => {
		intitalChart()
	}, [])
	const draw = () => {
		const svg = d3.select(ref.current)
		svg.selectAll('*').remove()
		svg.selectAll('rect').data(longdata)
		const x = d3
			.scaleLinear()
			.domain([domainMin, domainMax])
			.range([width * 0.1, width * 0.98])
		svg
			.append('g')
			.attr('class', 'xAxisG')
			.attr('transform', 'translate(0,' + height + ')')
			.call(
				d3.axisBottom(x).ticks(3).tickSize(0).tickValues([floor, cap, strike])
			)
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('.tick text').attr('dy', 10))

		const y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(longdata, function (d) {
					return d.y
				}),
			])
			.range([height, 10])
		svg
			.append('g')
			.attr('class', 'yAxisG')
			.attr('transform', `translate(0)`)
			.call(
				d3
					.axisRight(y)
					.tickSize(width + 2)
					.tickValues(tickValues)
					.ticks(4)
					.tickFormat(function (d) {
						return showMultiple ? f(d * maxYieldTaker) + ' x' : f(d)
					})
			)
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('.tick:not(:first-of-type) line')
					.attr('stroke-opacity', 0.5)
					.style('stroke', '#3393E0')
			)
			.call((g) =>
				g
					.selectAll('.tick text')
					.each(function (d, i) {
						const color = {
							0: '#76FFC6',
							1: '#89A5E3',
							2: '#F47564',
						}
						d3.select(this).style('fill', color[i])
					})
					.attr('x', -20)
					.attr('dy', 4)
			)
			.attr('font-size', 12)
			.attr('font-family', 'Gilroy')

		const longLine = d3
			.line()
			.x(function (d) {
				return x(d.x)
			})
			.y(function (d) {
				return y(d.y)
			})
		svg
			.append('path')
			.data([longdata])
			.attr('d', longLine)
			.style('fill', 'none')
			.style('stroke', '#3BFFAD')
			.style('opacity', function () {
				if (longDirection == true || longDirection == undefined) {
					return 1
				} else {
					return 0
				}
			})
			.style('stroke-width', '3px')
			.attr('class', 'line')
		const shortLine = d3
			.line()
			.x(function (d) {
				return x(d.x)
			})
			.y(function (d) {
				return y(d.y)
			})
		svg
			.append('path')
			.data([short])
			.attr('d', shortLine)
			.style('fill', 'none')
			.style('stroke', '#3BFFAD')
			.style('opacity', function () {
				if (longDirection == true) {
					return 0
				} else {
					return 1
				}
			})
			.style('stroke-width', '3px')
			.attr('class', 'line')

		svg
			.append('rect')
			.attr('x', width - 25)
			.attr('y', height + 20)
			.attr('width', 25)
			.attr('height', 3)
			.style('fill', '#90CAF9')
			.style('opacity', function () {
				if (longDirection == true) {
					return 0
				} else {
					return 1
				}
			})

		svg
			.append('rect')
			.attr('x', width - 80)
			.attr('y', height + 20)
			.attr('width', 25)
			.attr('height', 3)
			.style('fill', '#1976D2')
			.style('opacity', function () {
				if (longDirection == true || longDirection == undefined) {
					return 1
				} else {
					return 0
				}
			})
	}
	useEffect(() => {
		draw()
	}, [props, long, cap, strike, floor, collateralToken, longDirection])

	return (
		<div>
			<svg ref={ref}></svg>
		</div>
	)
}
