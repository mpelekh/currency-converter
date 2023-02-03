import React, {FC, PropsWithChildren, useEffect, useState} from "react";
import {ConversionRatesService, ConversionRate} from "services/conversionRatesService"

export const ConversionRatesContext = React.createContext<{ error: string | null, rates: ConversionRate[] }>({
	error: null,
	rates: []
});

export const ConversionRatesProvider: FC<PropsWithChildren> = (props) => {
	const [rates, setRates] = useState<ConversionRate[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const intervalRef: { intervalId: ReturnType<typeof setInterval> | null } = {intervalId: null}
		const updateRates = async () => {
			const rateData = await ConversionRatesService.getConversionRates("USD", "BRL");
			setRates([rateData])
		}
		const handleError = (error: Error) => {
			setError(`Something went wrong. Please contact the administrator: ${error.message}.`);
		}

		updateRates().then(() => {
			intervalRef.intervalId = setInterval(async () => {
				let rateData: ConversionRate;

				try {
					rateData = await ConversionRatesService.getConversionRates("USD", "BRL");
				} catch (error) {
					debugger
					handleError(error as Error);
					clearInterval(intervalRef.intervalId!)
					return;
				}

				setRates(rates => {
					const newRates = [rateData, ...rates];

					if (newRates.length > 24) {
						newRates.length = 24;
					}

					return newRates
				})

			}, 10000);
		}).catch(handleError)

		return () => {
			intervalRef.intervalId && clearInterval(intervalRef.intervalId);
		}
	}, [])

	return (
		<ConversionRatesContext.Provider value={{
			error,
			rates
		}}>
			{props.children}
		</ConversionRatesContext.Provider>
	)
}
