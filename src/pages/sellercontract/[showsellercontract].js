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

  // const { admin, tokenPrice, tokensSold } = props.sellerContractData;
  // const { sellToken } = props;

  const [sellToken, setSellToken] = useState(null);
  const [sellerContractData, setSellerContractData] = useState({});
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [values, setValues] = useState({});
  useEffect(() => {
    (async () => {
      const currentAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccounts(currentAccounts);
      let address = router.query.showsellercontract;
      getContractData(address);
      setTimeout(() => {}, 400);
    })();
    return () => {};
  }, [router.pathname]);

  async function getContractData(address) {
    const sellToken = SellTokenContract(address);
    setSellToken(sellToken);
    const summary = await sellToken.methods.getSummary().call();
    const sellerContractData = {
      tokenPrice: summary[0],
      tokensSold: summary[1],
      admin: summary[2],
    };
    setSellerContractData(sellerContractData);
  }
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

  const onBuySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("val", values.buyAmount);
    try {
      await sellToken.methods.buyTokens(values.buyAmount).send({
        from: accounts[0],
      });
      let address = router.query.showsellercontract;
      getContractData(address);
      showMessage("success");
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      showMessage(error.message);
      setLoading(false);
    }
  };

  const onEndSubmit = async (e) => {
    e.preventDefault();
    console.log("end");
    try {
      await sellToken.methods.endSale().send({
        from: accounts[0],
      });
    } catch (error) {
      console.log("error", error);
    }
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
          <Card {...props}>
            <CardContent>
              <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
                <Grid item>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Admin:{sellerContractData.admin}
                  </Typography>
                  <Typography color="textPrimary" variant="h4">
                    Price:{" "}
                    {sellerContractData.tokenPrice
                      ? web3.utils.fromWei(`${sellerContractData.tokenPrice}`, "ether")
                      : ""}{" "}
                    eth
                  </Typography>
                </Grid>
                <Grid item>Sold: {sellerContractData.tokensSold}</Grid>
              </Grid>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  pt: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mr: 1,
                  }}
                ></Typography>
                <Typography color="textSecondary" variant="caption"></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12}>
          <Card>
            <CardContent>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Token Amount"
                  name="buyAmount"
                  onChange={handleChange}
                  value={values.buyAmount}
                  type="number"
                  variant="outlined"
                />
                <Button
                  disabled={loading}
                  type="submit"
                  onClick={onBuySubmit}
                  color="primary"
                  variant="contained"
                >
                  {loading ? <CircularProgress color="secondary" /> : "Buy"}
                </Button>
              </Box>
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <Button
                  disabled={loading}
                  type="submit"
                  onClick={onEndSubmit}
                  color="error"
                  variant="contained"
                >
                  {loading ? <CircularProgress color="secondary" /> : "End Sale"}
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
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
  return {};
};
export default ShowSellerContract;
