import React from 'react';
import Table from 'components/Table'
import {ConversionRate} from "services/conversionRatesService";

interface Props {
	rates: ConversionRate[]
}

const ConversionRatesTable = (props: Props) => {
	const columns = [
		{
			key: 'currencyPair' as const,
			title: 'Currency Pair'
		},
		{
			key: 'rate' as const,
			title: 'Rate'
		},
		{
			key: 'time' as const,
			title: 'Time'
		},
	]

	const items = props.rates.map((rate) => ({
		id: rate.id,
		currencyPair: `${rate.from}/${rate.to}`,
		rate: rate.rate,
		time: rate.time,
	}))

	debugger

	return (
		<Table items={items} columns={columns}/>
	);
}

export default React.memo(ConversionRatesTable);