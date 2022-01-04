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
  useEffect(() => {
    (async () => {
      const currentAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const deployedTokens = await tokenFactory.methods.getDeployedToken().call();
      setAccounts(currentAccounts);
      setDeployedTokens(deployedTokens);
      console.log("acc", currentAccounts, deployedTokens);
      console.log("mthds", tokenFactory.methods);
    })();

    return () => {};
  }, []);
  const onSubmit = async (e, values) => {
    e.preventDefault();
    setLoading(true);
    console.log("acc", accounts);

    const { name, symbol, standart, initialSupply } = values;
    console.log("vales", name, symbol, standart, initialSupply);
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
            <TokenList tokens={deployedTokens} />
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
  console.log("initial");

  return {};
};

export default Token;
