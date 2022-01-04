import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/customer/customer-list-results";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";
import { CreateNewToken } from "src/components/token/create-new-token";
import { useState, useEffect } from "react";
import tokenFactory from "../eth/scripts/tokenFactory";
import web3 from "src/eth/scripts/web3";
import TokenContract from "src/eth/scripts/token";
import { TokenList } from "src/components/token/token-list";

const Token = (props) => {
  // console.log("props", props);
  const [loading, setLoading] = useState(false);
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [tokenDatas, setTokenDatas] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        let datas = [];
        const currentAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const deployedTokens = await tokenFactory.methods.getDeployedToken().call();

        setAccounts(currentAccounts);
        setDeployedTokens(deployedTokens);

        for (let idx = 0; idx < deployedTokens.length; idx++) {
          const tokenC = TokenContract(deployedTokens[idx]);
          const summaryToken = await tokenC.methods.getSummary().call();
          const tokenSummary = {
            id: idx,
            address: deployedTokens[idx],
            name: summaryToken[0],
            symbol: summaryToken[1],
            standart: summaryToken[2],
            totalSupply: summaryToken[3],
            tokenOwner: summaryToken[4],
            sellerContract: summaryToken[5],
          };
          datas.push(tokenSummary);
          setTokenDatas(datas);
        }
        console.log("datas", datas, typeof datas);
        console.log("datas", datas, datas.length, typeof datas);
      } catch (error) {
        console.log("err", error);
      }
    })();
  }, []);
  const onSubmit = async (e, values) => {
    e.preventDefault();
    setLoading(true);

    const { name, symbol, standart, initialSupply } = values;

    try {
      await tokenFactory.methods
        .createToken(name, symbol, standart, initialSupply)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          const deployedTokens = await tokenFactory.methods.getDeployedToken().call();
          setDeployedTokens(deployedTokens);
          setLoading(false);
        });
    } catch (error) {
      console.log("new camp err", error);
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Token</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
            <TokenList tokenDatas={tokenDatas} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <CreateNewToken onSubmit={onSubmit} loading={loading} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Token.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
Token.getInitialProps = async (ctx) => {
  return {};
};

export default Token;
