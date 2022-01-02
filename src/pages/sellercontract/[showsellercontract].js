import { useRouter } from "next/router";
import { DashboardLayout } from "src/components/dashboard-layout";
import {
  Box,
  Container,
  Grid,
  Alert,
  Button,
  Modal,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import SellTokenContract from "src/eth/scripts/sellToken";
import web3 from "src/eth/scripts/web3";
function ShowSellerContract(props) {
  const router = useRouter();
  console.log("router", router);
  const { admin, tokenPrice, tokensSold } = props.sellerContractData;
  const { sellerData } = props;
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [values, setValues] = useState({});
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

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

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
      <Container maxWidth={false}>
        <Grid item lg={12} sm={12} xl={12} xs={12}>
          {admin},{tokenPrice},{tokensSold}
        </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12}></Grid>
      </Container>
    </Box>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
ShowSellerContract.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

ShowSellerContract.getInitialProps = async (ctx) => {
  // console.log("ctx", ctx, ctx.query);

  const sellToken = SellTokenContract(ctx.query.showsellercontract);
  const summary = await sellToken.methods.getSummary().call();
  const sellerContractData = {
    tokenPrice: summary[0],
    tokensSold: summary[1],
    admin: summary[2],
  };
  console.log("sellerData", sellerContractData);
  return { sellerContractData };
};
export default ShowSellerContract;
