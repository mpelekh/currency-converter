import React, { useContext } from "react";
import { ConversionRatesContext } from "providers/ConversionRatesProvider";
import Container from "react-bootstrap/Container";
import ConversionRatesTable from "components/ConversionRatesTable";
import ErrorModal from "components/ErrorModal";
import "App.css";

const App = () => {
  const { error, convertCurrencyFrom, convertCurrencyTo, rates } = useContext(
    ConversionRatesContext
  );

  return (
    <Container className="p-3">
      <h1 className="header">{`${convertCurrencyFrom} / ${convertCurrencyTo} Currency Conversion Rates`}</h1>
      <ConversionRatesTable rates={rates} />
      {error && <ErrorModal message={error} />}
    </Container>
  );
};

export default App;
