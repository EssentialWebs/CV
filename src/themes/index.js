import { extendTheme } from "@chakra-ui/react";
import "@fontsource/mali";

const theme = extendTheme({
  colors: {
    brand: {
      grey1: "rgb(84,85,87)",      
      sodarkblue2: "rgb(1,58,85)",
      darkblue3: "rgb(27,65,84)",
      blue4: "rgb(2,147,212)",
      lightBlue5: "rgb(126,217,244)",
      green6 :"rgb(31,181,154)"      
    },
  },
  fonts: {
    
    heading: "mali",
    Link: "mali",
    body: "Poppins",
  },
  styles: {
    global: {
      // body: {
      //   marginTop: '100px',
      // },
    },
  },
});

export default theme;
