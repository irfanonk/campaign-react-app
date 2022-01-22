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
      const deployedTokensAddresses = await tokenFactory.methods.getDeployedToken().call();
      let tokens = [];
      deployedTokensAddresses.forEach(async (address, i) => {
        let token = TokenContract(address);
        let summaryToken = await token.methods.getSummary().call();
        let tokenSummary = {
          address: address,
          name: summaryToken[0],
          symbol: summaryToken[1],
          standart: summaryToken[2],
          totalSupply: summaryToken[3],
          tokenOwner: summaryToken[4],
          sellerContract: summaryToken[5],
        };
        tokens.push(tokenSummary);
        if (deployedTokensAddresses.length == tokens.length) {
          console.log("completed");
          setDeployedTokens(tokens);
          console.log("deployed", tokens, deployedTokens);
        }
      });

      setAccounts(currentAccounts);
    })();

    return () => {};
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
          let deployedTokensAddresses = await tokenFactory.methods.getDeployedToken().call();
          let newTokenData = {
            address: deployedTokensAddresses[deployedTokensAddresses.length - 1],
            name: name,
            symbol: symbol,
            standart: standart,
            totalSupply: initialSupply,
            tokenOwner: accounts[0],
            sellerContract: "0x00000000000000",
          };
          setDeployedTokens([...deployedTokens, newTokenData]);
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
