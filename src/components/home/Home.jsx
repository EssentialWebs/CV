import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 import Navbar from "../navBar/Navbar";
 
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";

const Home = () => {
    
  return (
    <>
      {/* {!currentUser ? (
       navigate("/Login")
      ) : ( */}
      <Box id="Home" bg={useColorModeValue("brand.lightBlue5", "brand.sodarkblue2")}>
        <Navbar />
        
      </Box>
      {/* )} */}
    </>
  );
};

export default Home;
