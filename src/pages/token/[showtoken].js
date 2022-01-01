import { useRouter } from "next/router";
import { DashboardLayout } from "src/components/dashboard-layout";
import { Box, Container, Grid, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import TokenContract from "src/eth/scripts/token";

function ShowToken(props) {
  const router = useRouter();
  const { name, symbol, standart, totalSupply, tokenowner } = props.tokenData;
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNewReq, setLoadingNewReq] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState({ btnIdx: -1 });

  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const currentAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccounts(currentAccounts);
    })();
    return () => {};
  }, router.pathname);
  function showMessage(message) {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 10000);
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      {message ? (
        <Alert style={{ position: "fixed", zIndex: "10", width: "100%" }}>{message} </Alert>
      ) : null}
      <Container maxWidth={false}>{name}</Container>
    </Box>
  );
}

ShowToken.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

ShowToken.getInitialProps = async (ctx) => {
  // console.log("ctx", ctx, ctx.query);

  const token = TokenContract(ctx.query.showtoken);
  const summary = await token.methods.getSummary().call();
  const tokenData = {
    name: summary[0],
    symbol: summary[1],
    standart: summary[2],
    totalSupply: summary[3],
    tokenOwner: summary[4],
  };
  console.log("tokenData", tokenData);
  return { tokenData };
};
export default ShowToken;
