# Currency Conversion Rates

This is a TypeScript / React application that is connected to [Currency Converter API](https://rapidapi.com/natkapral/api/currency-converter5). 

It shows the currency conversion rates only for one currency pair. The currency pair can be configured via the environment variables in application build time.

It prints the last 24 conversion rate values on the page. First, only one value is shown for the recent hour and then a new value is added each hour until 24 items. Then the oldest one is removed and the new one is added.

## Configuration

The application can be configured by updating the `.env` or `.env.local` files for production or local environment respectively. Do not forget to provide the API key for [Currency Converter API](https://rapidapi.com/natkapral/api/currency-converter5).

```sh
REACT_APP_CURRENCY_CONVERTER_API_KEY="put api key here"
REACT_APP_CONVERT_CURRENCY_FROM="USD"
REACT_APP_CONVERT_CURRENCY_TO="BRL"
```

## Launch the application

To launch the application locally clone the repository and run the following:

```sh
npm install
npm start
```

<hr/>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
