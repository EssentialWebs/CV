import React, { Suspense } from "react";
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
 import { ChakraBaseProvider } from '@chakra-ui/react'
import theme from './themes'

ReactDOM.render(
  <ChakraBaseProvider theme={theme}>
    <Suspense fallback={"Conectando la app"}>
         <BrowserRouter>
          <App />
        </BrowserRouter>
     </Suspense>
  </ChakraBaseProvider>,
  document.getElementById('root')
);