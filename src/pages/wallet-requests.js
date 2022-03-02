import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RequestCard } from "src/components/wallet-requests/request-card";
import ky from "ky";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const WalletRequests = () => {
  const router = useRouter();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ["websocket"],
    };
    const socket = io.connect("http://localhost:9000");
    setSocket(socket);

    socket.on("connect", function () {
      console.log(" connected!", socket.id);
    });
    socket.on("disconnect", function () {
      console.log(" disconnected!", socket.id);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receive_claim_request", (data) => {
        console.log("receive_claim", data);
      });
    }
  }, [socket]);

  const requests = [
    {
      id: 0,
      year: "1990",
      month: "3",
      day: "4",
      title: "Holy Grail ",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image: "/static/images/request-items/sword-and-shield.jpg",
      toAddress: "0x053526b3BB25147Be27F3Cf1e3ddCd5EbfAc023F",
    },
    {
      id: 1,
      year: "1476",
      month: "10",
      day: "10",
      title: "Magic Wand",
      description: "It is a great weapon for any warrior.",
      price: "$150",
      image: "/static/images/request-items/shield.jpg",
      toAddress: "0x053526b3BB25147Be27F3Cf1e3ddCd5EbfAc023F",
    },
    {
      id: 2,
      year: "1801",
      month: "6",
      day: "8",
      title: "Key of the Dark Forest",
      description: "It is a great weapon for any warrior.",
      price: "$150",
      image: "/static/images/request-items/key.jpg",
      toAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
    },
    {
      id: 3,
      year: "1240",
      month: "3",
      day: "4",
      title: "Quiver",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image: "/static/images/request-items/warrior.jpg",
      toAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
    },
    {
      id: 4,
      year: "1444",
      month: "9",
      day: "9",
      title: "Brother Warrior",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image: "/static/images/request-items/warrior.jpg",
      toAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
    },
  ];

  const onClaimClick = async (request) => {
    // console.log("req", request);
    // const { id, title, description, price, image } = request;
    // const json = await ky
    //   .post("http://localhost:8080/api/requests", { json: { title, description } })
    //   .json();
    // console.log("json", json);
    await socket.emit("create_claim_request", request);
  };

  return (
    <>
      <Head>
        <title>Requests </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container>
          <NextLink href="/" passHref>
            <Button component="a" startIcon={<ArrowBackIcon fontSize="small" />}>
              Dashboard
            </Button>
          </NextLink>
          <Box display={"flex"}>
            {requests.map((request) => (
              <Box
                key={request.id}
                margin={2}
                sx={{
                  width: 300,
                  "&:hover": {
                    backgroundColor: "primary.main",
                    opacity: [1, 0.8, 1],
                  },
                }}
              >
                <RequestCard onClaimClick={onClaimClick} key={request.id} request={request} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default WalletRequests;
