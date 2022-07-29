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
      year: "1923",
      month: "6",
      day: "19",
      title: "Elite Cloak",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image:
        "https://bafybeiaxmgtzusnsiqtnz6rgugjbc3xv3p7e57mw6jxo5yjyyvwgcbybmu.ipfs.dweb.link/sword-and-shield.jpg",
      imageName: "sword-and-shield.jpg",
      gamerAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
      gameCode: "1jn6235kl61cblfr",
    },
    {
      id: 1,
      year: "1434",
      month: "10",
      day: "12",
      title: "Death of the Iguana",
      description: "It is a great weapon for any warrior.",
      price: "$150",
      image:
        "https://bafybeih3qrusp7n2na6pkfm23jtjejlavrid3u2karhyjrnlasamj62fly.ipfs.dweb.link/shield.jpg",
      imageName: "shield.jpg",
      gamerAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
      gameCode: "1jn6235kl61cblfr",
    },
    {
      id: 2,
      year: "1681",
      month: "6",
      day: "8",
      title: "Key of the Dark Forest",
      description: "It is a great weapon for any warrior.",
      price: "$150",
      image:
        "https://bafybeidy2u4p6mymspekldvdubk5nem2exjbl2bkdd5eozcqmqvlpayauq.ipfs.dweb.link/key.jpg",
      imageName: "key.jpg",
      gamerAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
      gameCode: "1jn6235kl61cblfs",
    },
    {
      id: 3,
      year: "1234",
      month: "3",
      day: "4",
      title: "Quiver",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image:
        "https://bafybeidow7p4foc4dqiyx2zruqavmu3womhurln7zlc4utwddtwngchz74.ipfs.dweb.link/warrior.jpg",
      imageName: "warrior.jpg",
      gamerAddress: "0xef86EfEA8498bc43A611c68b41C09D9e8Ca2C44B",
      gameCode: "1jn6235kl61cblfs",
    },
    {
      id: 4,
      year: "1230",
      month: "3",
      day: "5",
      title: "Slayer Warrior",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image:
        "https://bafybeih4qdw4k3vacx5osefsldg7lqizvbxxofypev5hvxytqldrzyz7eq.ipfs.dweb.link/slayer-warrior.png",
      imageName: "slayer-warrior.png",
      gamerAddress: "0x053526b3BB25147Be27F3Cf1e3ddCd5EbfAc023F",
      gameCode: "1jn6235kl61cblfr",
    },
    {
      id: 5,
      year: "1530",
      month: "3",
      day: "5",
      title: "Warrior Full Costume",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image:
        "https://bafybeiaxgswwkwr45d56bzj6ayffihgnbwgas7f7accp3euelmwkdrmimi.ipfs.dweb.link/warrior-full-costume.webp",
      imageName: "warrior-full-costume.webp",
      gamerAddress: "0x053526b3BB25147Be27F3Cf1e3ddCd5EbfAc023F",
      gameCode: "1jn6235kl61cblfr",
    },
    {
      id: 6,
      year: "1940",
      month: "3",
      day: "5",
      title: "Long Sword ",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image:
        "https://bafybeic5zyurnf2enevwicqjtd6sursmw2tk777dfhv5jxqqxcrvcdnrxq.ipfs.dweb.link/long-sword.jpeg",
      imageName: "long-sword.jpeg",
      gamerAddress: "0x053526b3BB25147Be27F3Cf1e3ddCd5EbfAc023F",
      gameCode: "1jn6235kl61cblfs",
    },
    {
      id: 7,
      year: "1923",
      month: "6",
      day: "11",
      title: "Long Sword Artic",
      description:
        "Sword of the Divine is a powerful sword that can be used to defeat any enemy. It is a great weapon for any warrior.",
      price: "$100",
      image:
        "https://bafybeic5zyurnf2enevwicqjtd6sursmw2tk777dfhv5jxqqxcrvcdnrxq.ipfs.dweb.link/long-sword.jpeg",
      imageName: "long-sword.jpeg",
      gamerAddress: "0x053526b3BB25147Be27F3Cf1e3ddCd5EbfAc023F",
      gameCode: "1jn6235kl61cblfs",
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
      <Box>
        <>
          <NextLink href="/" passHref>
            <Button component="a" startIcon={<ArrowBackIcon fontSize="small" />}>
              Dashboard
            </Button>
          </NextLink>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",

              p: 1,
              m: 1,
              borderRadius: 1,
            }}
          >
            {requests.map((request) => (
              <Box
                key={request.id}
                margin={2}
                sx={{
                  width: 500,
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
        </>
      </Box>
    </>
  );
};

export default WalletRequests;
