import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAdditionalUserInfo,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
 import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";

import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  Box,
  Center,
  Text,
  FormErrorMessage,
  useColorModeValue,
} from "@chakra-ui/react";
 import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
   const [idLogedUser, setIdLogedUser] = useState("");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const { email, password } = formData;
  const navigate = useNavigate();

  const socialLogInGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((res) => {
        const verifyUser = getAdditionalUserInfo(res);
        var loggedInUser = res.user;

        if (verifyUser?.isNewUser) {
          //delete user if the user is new

          deleteUser(loggedInUser);
          Swal.fire({
            title: "Tu usuario no existe ¿Deseas registrarte?",
            showCancelButton: true,
            confirmButtonText: "Regístrate",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              navigate("/Registro");
              Swal.fire("Ahora puedes crear tu cuenta", "", "info");
            }
          });
        }
        //redirect to home page
        else {
          // window.location = "/";
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user

              const uid = user.uid;
              localStorage.setItem("currentUser", JSON.stringify(uid));

              Swal.fire({
                title: `Bienvenido <br> ${user?.displayName}`,
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
              });
              // ...
            } else {
              // User is signed out
              // ...
            }
          });
        }
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {});
  };

  const socialLogInFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((res) => {
        const verifyUser = getAdditionalUserInfo(res);

        var loggedInUser = res.user;

        if (verifyUser?.isNewUser) {
          //delete user if the user is new

          deleteUser(loggedInUser);
          Swal.fire({
            title: "Tu usuario no existe ¿Deseas registrarte?",
            showCancelButton: true,
            confirmButtonText: "Regístrate",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              navigate("/Registro");
              Swal.fire("Ahora puedes crear tu cuenta", "", "info");
            }
          });
        } else {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              localStorage.setItem("currentUser", JSON.stringify(uid));
              Swal.fire({
                title: `Bienvenido <br> ${user?.displayName}`,
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
              });
              // ...
            } else {
              // User is signed out
              // ...
            }
          });
        }
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {});
  };

  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  // const setUserStorage = async (userId) => {
  //   console.log("setUserStorageuser", userId);

  //   try {
  //     console.log("setUserStorageuser", userId);

  //     // const userId = auth.currentUser.uid;
  //     const docRef = doc(db, "user", userId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       console.log("dataaaa", docSnap.data());
  //     } else {
  //       console.log("dataaaa no existe");
  //     }
  //   } catch (error) {
  //     console.log("no labura");
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      emailValidate == false &&
      email != null &&
      email != "" &&
      password != null &&
      password != "" &&
      passwordValidate == false
    ) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              localStorage.setItem("currentUser", JSON.stringify(user?.uid));
              Swal.fire({
                title: `Bienvenido <br> ${user?.displayName}`,
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
              });
              // ...
            } else {
              // User is signed out
              // ...
            }
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.message == "Firebase: Error (auth/user-not-found).") {
            Swal.fire({
              title: "Tu usuario no existe ¿Deseas registrarte?",
              showCancelButton: true,
              confirmButtonText: "Regístrate",
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                navigate("/Registro");
                Swal.fire("Ahora puedes crear tu cuenta", "", "info");
              }
            });
          } else if (err.message == "Firebase: Error (auth/wrong-password).") {
            Swal.fire("Verifica tu correo o contraseña", "", "warning");
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

  const [emailValidate, setEmailValidate] = useState(false);
  const [passwordValidate, setPasswordValidate] = useState(false);
  const requeridoPassword = (e) => {
    if (
      password.length > 6 &&
      password != null &&
      password != "" &&
      password.trim() != null
    ) {
      setPasswordValidate(false);
    } else {
      setPasswordValidate(true);
    }
  };

  const requeridoEmail = (e) => {
    let expresion = /\w+@\w+\.[a-z]/;

    if (
      email.length > 2 &&
      email != null &&
      email != "" &&
      email.trim() != null &&
      expresion.test(email)
    ) {
      setEmailValidate(false);
    } else {
      setEmailValidate(true);
    }
  };

  const updatePassword = () => {
    Swal.fire({
      title: "Recuperar contraseña   Ingresa tu correo",
      input: "email",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      console.log(resultado);
      if (resultado.isConfirmed == false) {
        Swal.fire(`Cancelaste la recuperación`);
      } else if (resultado.value) {
        let email = resultado.value;
        sendPasswordResetEmail(auth, email);
        Swal.fire(`En unos momentos recibirás un correo. Muchas gracias`);
      }
    });
  };

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
              Ingresa
            </Heading>
            <Link
              onClick={() => {
                navigate("/Registro");
              }}
              fontWeight={"bold"}
              color={useColorModeValue("brand.blue4", "brand.green6")}
            >
              No tienes cuenta? Regístrate
            </Link>
            <form onSubmit={handleSubmit}>
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
                  <div></div>
                ) : (
                  <FormErrorMessage>
                    Ingrese su email por favor.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl id="password" isInvalid={passwordValidate}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  border="2px solid "
                  borderColor={useColorModeValue(
                    "brand.darkblue3",
                    "brand.green6"
                  )}
                  type="password"
                  onChange={handleChange("password")}
                  value={password}
                  onBlur={requeridoPassword}
                />
                {!passwordValidate ? (
                  <div></div>
                ) : (
                  <FormErrorMessage>
                    {" "}
                    Su contraseña debe tener más de 6 caracteres
                  </FormErrorMessage>
                )}
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  {/* <Checkbox>Recordarme?</Checkbox> */}
                  <Link
                    mt={3}
                    color={useColorModeValue("brand.blue4", "brand.green6")}
                    onClick={updatePassword}
                    fontWeight={"bold"}
                  >
                    Olvidate tu contraseña?
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  variant={"solid"}
                  colorScheme="blue"
                  bgGradient="linear(to-b, brand.lightBlue5, brand.blue4, brand.darkblue3)"
                  color="black"
                >
                  Ingresar
                </Button>
              </Stack>
            </form>
            <Center p={8}>
              <Stack spacing={2} align={"center"} maxW={"md"} w={"full"}>
                <Heading fontSize={"2xl"} textAlign={"center"} p={2}>
                  Ingreso directo
                </Heading>
                <Button
                  leftIcon={<FcGoogle />}
                  onClick={socialLogInGoogle}
                  borderColor={useColorModeValue("purple.600", "#000000")}
                  isFullWidth
                >
                  <Center>
                    <Text>
                      {` `} Ingreso con Google {` `}
                    </Text>
                  </Center>
                </Button>
                <Button
                  colorScheme={"facebook"}
                  leftIcon={<FaFacebook />}
                  onClick={socialLogInFacebook}
                  isFullWidth
                >
                  <Center>
                    <Text>Ingreso con Facebook</Text>
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
              "https://img3.wallspic.com/crops/2/3/9/7/3/137932/137932-patada-la_ciudad_de_manchester_f_c-3840x2160.jpg"
            }
          />
        </Flex>
      </Stack>
    </>
  );
};

export default Login;
