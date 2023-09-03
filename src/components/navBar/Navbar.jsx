import { useEffect, ReactNode, useState } from "react";
import { Link } from "react-scroll";
import Swal from "sweetalert2";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
  Text,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
 import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";

const Links = ["Home", "Live", "Nosotros", "Servicios", "Contacto"];

const NavLink = ({ children, href }: { children: ReactNode, href: string }) => (
  <Link
    duration={500}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("purple.800", "gray.700"),
    }}
    href={href}
  >
    {children}
  </Link>
);

export default function Navbar() {
  let location = useLocation();

  const navigate = useNavigate();
  const [dataUser, setdataUser] = useState({});
  const { colorMode, toggleColorMode } = useColorMode();
  const [isAdmin, setIsAdmin] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
   const currentUserlocalStorage = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const signOutAccount = () => {
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: "warning",
          title: "Cerraste tu sesión",
        });
        navigate("/Ingreso");

        localStorage.removeItem("currentUser");

        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setdataUser(user);
        var idUsuario = user.uid;

        var fetchData = async () => {
          try {
            const docRef = doc(db, "user", idUsuario);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setIsAdmin(docSnap.data().isAdmin);
            } else {
              // docSnap.data() will be undefined in this case
            }
          } catch (err) {
            console.error(err);
          }
        };
        fetchData();
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    // const currentUserlocalStorage = JSON.parse(
    //   localStorage.getItem("currentUser")
    // );
    // var users = collection(db, "user");
    // var q = query(users, where("id", "==", currentUserlocalStorage));

    // const fetchData = async () => {
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     // dispatch(
    //     //   setCurrentUser(
    //     //     doc._document.data.value.mapValue.fields.i
    //     //   )
    //     // );
    //     setdataUser(doc._document.data.value.mapValue?.fields);
    //   });
    // };
    // fetchData();
    var adminData = async () => {
      try {
        const docRef = doc(db, "user", currentUserlocalStorage);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().isAdmin);
        } else {
          // docSnap.data() will be undefined in this case
        }
      } catch (err) {
        console.error(err);
      }
    };
    adminData();
  }, []);

  return (
    <>
      <Box
        bgGradient={[
          "linear(to-b,  brand.blue4, brand.darkblue3)",
          "linear(to-b,  brand.blue4, brand.darkblue3)",
          "linear(to-b, brand.blue4, brand.darkblue3)",
        ]}
        // bg={useColorModeValue("brand.blue4", "brand.brand.grey1")}
        position="fixed"
        zIndex="sticky"
        w="100%"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <img
              style={{ width: "12em" }}
              src="/logo111.png"
              alt="Logo Agencia Volcán"
            />
          </Box>{" "}
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            _hover={{
              textDecoration: "none",
              bg: useColorModeValue("brand.blue4", "brand.blue4"),
            }}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            // bg={useColorModeValue("brand.lightBlue5", "brand.lightBlue5")}
            bgGradient="linear(to-b, brand.lightBlue5, brand.blue4, brand.darkblue3)"
            color="black"
          />
          <Flex>
            <HStack
              as={"nav"}
              spacing={20}
              display={{ base: "none", md: "flex" }}
              alignItems={"center"}
              mx={28}
            >
              {Links.map((link) => (
                <Link
                  style={{ cursor: "pointer" }}
                  key={link}
                  to={link}
                  smooth={true}
                  offset={-50}
                  duration={1200}
                >
                  <Text
                    color="black"
                    px={2}
                    py={1}
                    rounded={"md"}
                    _hover={{
                      textDecoration: "none",
                      bg: "brand.blue4",
                      bgGradient:
                        "linear(to-b, brand.lightBlue5, brand.blue4, brand.darkblue3)",
                    }}
                  >
                    {link}
                  </Text>
                </Link>
              ))}
            </HStack>
            <Button
              onClick={toggleColorMode}
              mx={5}
              // bg={useColorModeValue("brand.lightBlue5", "brand.lightBlue5")}
              bgGradient="linear(to-b, brand.lightBlue5, brand.blue4, brand.darkblue3)"
              _hover={{
                textDecoration: "none",
                bg: useColorModeValue("brand.blue4", "brand.blue4"),
              }}
              color="black"
            >
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            {currentUserlocalStorage ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  {dataUser ? (
                    <Avatar
                      mx={5}
                      size={"sm"}
                      src={dataUser?.photoURL}
                    ></Avatar>
                  ) : (
                    <Avatar
                      mx={5}
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    ></Avatar>
                  )}
                </MenuButton>

                <MenuList
                  alignItems={"center"}
                  mx={1}
                  bgGradient={[
                    "linear(to-b,  brand.blue4, brand.darkblue3)",
                    "linear(to-b,  brand.blue4, brand.darkblue3)",
                    "linear(to-b, brand.blue4, brand.darkblue3)",
                  ]}
                >
                  <br />
                  <Center>
                    <Avatar size={"2xl"} src={dataUser?.photoURL} />
                  </Center>
                  <br />
                  <Center>
                    {dataUser?.displayName}

                    {/* <p>{dataUser.displayNam}</p> */}
                  </Center>
                  <br />
                  <MenuDivider />
                  {isAdmin ? (
                    <MenuItem
                      onClick={() => {
                        navigate("/Administracion");
                      }}
                      bgGradient={[
                        "linear(to-r,  brand.blue4, brand.darkblue3)",
                        "linear(to-r,  brand.blue4, brand.darkblue3)",
                        "linear(to-r, brand.blue4, brand.darkblue3)",
                      ]}
                      _hover={{
                        textDecoration: "none",
                        bg: "brand.blue4",
                      }}
                    >
                      Admin Panel
                    </MenuItem>
                  ) : (
                    <div></div>
                  )}

                  <MenuItem
                    onClick={() => {
                      navigate("/Perfil");
                    }}
                    bgGradient={[
                      "linear(to-r,  brand.blue4, brand.darkblue3)",
                      "linear(to-r,  brand.blue4, brand.darkblue3)",
                      "linear(to-r, brand.blue4, brand.darkblue3)",
                    ]}
                    _hover={{
                      textDecoration: "none",
                      bg: "brand.blue4",
                    }}
                  >
                    Tú cuenta
                  </MenuItem>
                  <MenuItem
                    onClick={signOutAccount}
                    bgGradient={[
                      "linear(to-r,  brand.blue4, brand.darkblue3)",
                      "linear(to-r,  brand.blue4, brand.darkblue3)",
                      "linear(to-r, brand.blue4, brand.darkblue3)",
                    ]}
                    _hover={{
                      textDecoration: "none",
                      bg: "brand.blue4",
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack alignItems={"center"} mx={5}>
                <Link
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: "brand.blue4",
                  }}
                >
                  <Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/Ingreso");
                    }}
                    color="black"
                     py={1}
                    rounded={"md"}
                    textDecoration="none"
                    _hover={{
                      textDecoration: "none",
                      bg: "brand.blue4",
                      bgGradient:
                        "linear(to-b, brand.lightBlue5, brand.blue4, brand.darkblue3)",
                    }}
                  >
                    Ingresar
                  </Text>
                </Link>
              </HStack>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Flex>
            {/* <Flex width="100%" bg="purple.200" _dark={{ bg: "gray.800" }}> */}

            <Box m={3} display={{ md: "none" }}>
              {/* <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <Link style={{ cursor: "pointer" }} key={link} to={link} smooth={true} offset={-50} duration={1200}>
                <Text color='White' >
                  {link}
                </Text>
              ))}
            </Stack> */}

              <HStack>
                <Stack
                  as={"nav"}
                  spacing={1}
                  // display={{ base: 'none', md: 'flex' }}
                >
                  {Links.map((link) => (
                    <Link
                      style={{ cursor: "pointer" }}
                      onClick={isOpen ? onClose : onOpen}
                      key={link}
                      to={link}
                      smooth={true}
                      offset={-50}
                      duration={1200}
                    >
                      <Text color="black">{link}</Text>
                      {/* {colorMode === "light" ? (
                        <Text color="brand.darkblue3">{link}</Text>
                      ) : (
                        <Text color="brand.darkblue3">{link}</Text>
                      )} */}
                    </Link>
                  ))}
                </Stack>
              </HStack>
            </Box>
          </Flex>
        ) : null}
      </Box>
    </>
  );
}
