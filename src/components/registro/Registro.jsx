import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  getAdditionalUserInfo,
  updateProfile,
  getAuth,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Center,
  Image,
  Checkbox,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
 import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Swal from "sweetalert2";

const Register = () => {
  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    });
  }, []);
  const navigate = useNavigate();

  // const dispatch = useDispatch();

  // const [passwordError, setPasswordError] = useState();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { name, lastName, email, password } = formData;

  // validaciones
  const [nameValidate, setNameValidate] = useState(false);
  const [lastNameValidate, setlastNameValidate] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);
  const [passwordValidate, setPasswordValidate] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const requeridoName = (e) => {
    let expresion = /^[A-Za-z0-9\s]+$/g;

    if (
      name.length > 2 &&
      name != null &&
      name != "" &&
      name.trim() != null &&
      expresion.test(name)
    ) {
      setNameValidate(false);
    } else {
      setNameValidate(true);
    }
  };

  const requeridoLastName = (e) => {
    let expresion = /^[A-Za-z0-9\s]+$/g;

    if (
      lastName != null &&
      lastName != "" &&
      lastName.trim() != null &&
      expresion.test(lastName)
    ) {
      setlastNameValidate(false);
    } else {
      setlastNameValidate(true);
    }
  };

  const requeridoEmail = (e) => {
    let expresion = /\w+@\w+\.[a-z]/;

    if (
      email != "" &&
      email != null &&
      email.trim() != null &&
      expresion.test(email)
    ) {
      setEmailValidate(false);
    } else {
      setEmailValidate(true);
    }
  };

  const requeridoPassword = (e) => {
    if (password != "" && password != null && password.trim() != null) {
      setPasswordValidate(false);
    } else {
      setPasswordValidate(true);
    }
  };

  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (password1 !== password2) {
    //   setPasswordError("The passwords must be equals");
    // } else {
    if (
      nameValidate == false &&
      name != null &&
      name != "" &&
      lastNameValidate == false &&
      lastName != null &&
      lastName != "" &&
      emailValidate == false &&
      email != "" &&
      email != null &&
      passwordValidate == false &&
      password != "" &&
      password != null
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          updateProfile(auth.currentUser, {
            displayName: name + " " + lastName,
          }).catch((error) => {
            // An error occurred
            // ...
          });
          let data = {
            id: res.user.uid,
            displayName: name + " " + lastName,
            email,
            phoneNumber: "",
            photoURL:
              "https://img.favpng.com/0/15/12/computer-icons-avatar-male-user-profile-png-favpng-ycgruUsQBHhtGyGKfw7fWCtgN.jpg",
            isAdmin: false,
          };
          setDoc(doc(db, "user", res.user.uid), data);
          Swal.fire({
            icon: "success",
            title: "Felicitaciones...",
            text: "Cuenta creada exitosamente!",
          });
          navigate("/Ingreso");
        })
        .catch((error) => {
          console.log(error);
          if (error.message == "Firebase: Error (auth/email-already-in-use).") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Este correo ya existe !",
            });
          } else if (
            error.message ==
            "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "La contraseña tiene que tener más de 6 caracteres!",
            });
          } else if (error.message == "Firebase: Error (auth/invalid-email).") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ingresa datos por favor.",
            });
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar todos los datos!",
      });
    }
  };

  const socialRegisterGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((res) => {
        const verifyUser = getAdditionalUserInfo(res);

        if (verifyUser?.isNewUser) {
          //delete user if the user is new
          Swal.fire({
            icon: "success",
            title: "Felicitaciones...",
            text: "Cuenta creada exitosamente! Ahora ingresá",
          });
          let data = {
            id: res?.user?.uid,
            displayName: res?.user?.displayName,
            email: res?.user?.email,
            photoURL: res?.user?.photoURL,
            phoneNumber: res?.user?.phoneNumber,
            isAdmin: false,
          };
          setDoc(doc(db, "user", res.user.uid), data);
          navigate("/Ingreso");
        }
        //redirect to home page
        else {
          Swal.fire({
            icon: "info",
            title: "Tu cuenta ya existe",
            text: "Solo tienes que ingresar",
          });
        }
      })
      .then(() => {
        navigate("/Ingreso");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const socialRegisterFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((res) => {
        const verifyUser = getAdditionalUserInfo(res);

        if (verifyUser?.isNewUser) {
          //delete user if the user is new
          Swal.fire({
            icon: "success",
            title: "Felicitaciones...",
            text: "Cuenta creada exitosamente! Ahora ingresá",
          });
          console.log("USuario registrado Facebook", res);
          let data = {
            id: res?.user?.uid,
            displayName: res?.user?.displayName,
            email: res?.user?.email,
            photoURL: res?.user?.photoURL,
            phoneNumber: res?.user?.phoneNumber,
            isAdmin: false,
          };
          setDoc(doc(db, "user", res.user.uid), data);
          navigate("/Ingreso");
        }
        //redirect to home page
        else {
          Swal.fire({
            icon: "info",
            title: "Tu cuenta ya existe",
            text: "Solo tienes que ingresar",
          });
        }
      })
      .then(() => {
        navigate("/Ingreso");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
       <Box w="100%" h="4em"></Box>
      <Stack
        minH={"100vh"}
        direction={{ base: "column", md: "row" }}
        bg={useColorModeValue("brand.lightBlue5", "brand.sodarkblue2")}
      >
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            rounded="10"
            boxShadow="dark-lg"
            p={5}
            bgGradient={useColorModeValue(
              "linear(to-t, brand.green6, brand.lightBlue5)",
              "linear(to-t, brand.darkblue3, brand.blue4)"
            )}
          >
            <Heading size="2xl" color={useColorModeValue("", "#000000")}>
              Regístrate
            </Heading>
            <Link
              color={"blue.500"}
              onClick={() => {
                navigate("/Ingreso");
              }}
              fontWeight={"bold"}
              color={useColorModeValue("brand.blue4", "brand.green6")}
            >
              Ya tienes cuenta? Ingresa
            </Link>
            <Stack spacing={4}>
              <form onSubmit={handleSubmit}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isInvalid={nameValidate}>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        border="2px solid "
                        borderColor={useColorModeValue(
                          "brand.darkblue3",
                          "brand.green6"
                        )}
                        type="text"
                        onChange={handleChange("name")}
                        value={name}
                        onBlur={requeridoName}
                      />
                      {!nameValidate ? (
                        <div>
                          <br></br>
                        </div>
                      ) : (
                        <FormErrorMessage>Ingrese su nombre.</FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isInvalid={lastNameValidate}>
                      <FormLabel>Apellido</FormLabel>
                      <Input
                        border="2px solid "
                        borderColor={useColorModeValue(
                          "brand.darkblue3",
                          "brand.green6"
                        )}
                        type="text"
                        onChange={handleChange("lastName")}
                        value={lastName}
                        onBlur={requeridoLastName}
                      />
                      {!lastNameValidate ? (
                        <div>
                          <br></br>
                        </div>
                      ) : (
                        <FormErrorMessage>Ingrese apellido. </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isInvalid={emailValidate}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    border="2px solid "
                    borderColor={useColorModeValue(
                      "brand.darkblue3",
                      "brand.green6"
                    )}
                    type="email"
                    onChange={handleChange("email")}
                    value={email}
                    onBlur={requeridoEmail}
                  />
                  {!emailValidate ? (
                    <div>
                      <br></br>
                    </div>
                  ) : (
                    <FormErrorMessage>
                      Ingrese su email por favor.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl id="password" isInvalid={passwordValidate}>
                  <FormLabel>Contraseña</FormLabel>
                  <InputGroup>
                    <Input
                      border="2px solid "
                      borderColor={useColorModeValue(
                        "brand.darkblue3",
                        "brand.green6"
                      )}
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange("password")}
                      value={password}
                      onBlur={requeridoPassword}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                        border="2px solid "
                        bg="brand.blue4"
                        borderColor={useColorModeValue(
                          "brand.darkblue3",
                          "brand.green6"
                        )}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {!passwordValidate ? (
                    <div>
                      <br></br>
                    </div>
                  ) : (
                    <FormErrorMessage>
                      {" "}
                      Ingrese su contraseña por favor.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    variant={"solid"}
                    colorScheme="blue"
                    bgGradient="linear(to-b, brand.lightBlue5, brand.blue4, brand.darkblue3)"
                    color="black"
                  >
                    Registrar
                  </Button>
                </Stack>
              </form>
            </Stack>
            <Center p={8}>
              <Stack spacing={2} align={"center"} maxW={"md"} w={"full"}>
                <Heading fontSize={"2xl"} textAlign={"center"} p={2}>
                  Registro directo
                </Heading>
                <Button
                  borderColor={useColorModeValue("purple.600", "#000000")}
                  isFullWidth
                  leftIcon={<FcGoogle />}
                  onClick={socialRegisterGoogle}
                >
                  <Center>
                    <Text>Registrate con Google</Text>
                  </Center>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={"facebook"}
                  leftIcon={<FaFacebook />}
                  onClick={socialRegisterFacebook}
                >
                  <Center>
                    <Text>Registrate con Facebook</Text>
                  </Center>
                </Button>
              </Stack>
            </Center>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://wallpaperset.com/w/full/5/8/c/119900.jpg"
            }
          />
        </Flex>
      </Stack>
    </>
  );
};
export default Register;
