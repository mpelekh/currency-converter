import React from "react";
import { ConversionRate } from "services/conversionRatesService";
import Table from "components/Table";

interface Props {
  rates: ConversionRate[];
}

const ConversionRatesTable = ({ rates }: Props) => {
  const columns = [
    {
      key: "currencyPair" as const,
      title: "Currency Pair",
    },
    {
      key: "rate" as const,
      title: "Rate",
    },
    {
      key: "time" as const,
      title: "Time",
    },
  ];

  const items = rates.map((rate) => ({
    id: rate.id,
    currencyPair: `${rate.from}/${rate.to}`,
    rate: rate.rate,
    time: rate.time,
  }));

  return <Table items={items} columns={columns} />;
};

export default React.memo(ConversionRatesTable);
