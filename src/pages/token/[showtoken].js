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
import TokenContract from "src/eth/scripts/token";
import SellTokenContract from "src/eth/scripts/sellToken";
import tokenFactory from "src/eth/scripts/tokenFactory";
import { TokenCard } from "src/components/token/token-card";
import web3 from "src/eth/scripts/web3";
import SellTokenBuild from "src/eth/build/SellToken";
function ShowToken(props) {
  const router = useRouter();
  console.log("router", router);

  const { token, tokenSummary } = props;
  const [tokenAsWei, setTokenAsWei] = useState("0");
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSellToken, setLoadingSellToken] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState({ btnIdx: -1 });
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
    setTokenAsWei(web3.utils.toWei(`${event.target.value ? event.target.value : "0"}`, "ether"));
  };
  const onDeploySellTokenContractSubmit = async (e) => {
    e.preventDefault();
    setLoadingSellToken(true);
    let tokenContractAddr = router.query.showtoken;
    let tokenPrize = web3.utils.toWei(`${values.tokenPrize}`, "ether");
    console.log("val", tokenPrize);
    try {
      let sellToken = await new web3.eth.Contract(SellTokenBuild.abi)
        .deploy({
          data: SellTokenBuild.bytecode,
          arguments: [tokenContractAddr, tokenPrize],
        })
        .send({ gas: 1_000_000, from: accounts[0] });
      console.log("deployed", sellToken.options.address);

      setLoadingSellToken(false);
    } catch (error) {
      console.log("err", error);
      setLoadingSellToken(false);
      setOpenModal(false);
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
          {props.tokenSummary.sellerContract.includes("0x00") ? (
            <Button
              onClick={() => setOpenModal(!openModal)}
              type="submit"
              color="primary"
              variant="contained"
              disabled={!props.tokenSummary.sellerContract.includes("0x00")}
            >
              Sell Token
            </Button>
          ) : (
            <Button color="success" variant="outlined">
              On Sale
            </Button>
          )}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <form onSubmit={onDeploySellTokenContractSubmit}>
                <Card>
                  <CardHeader subheader="Token Prize (Eth)" title="Sell Token" />
                  <Divider />
                  <CardContent>
                    <TextField
                      label="Token Prize"
                      margin="normal"
                      name="tokenPrize"
                      defaultValue={0}
                      onChange={handleChange}
                      value={values.tokenPrize}
                      type="number"
                      variant="outlined"
                    />
                  </CardContent>
                  <Typography sx={{ mb: 2 }}>{tokenAsWei} Wei</Typography>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      p: 2,
                    }}
                  >
                    <Button
                      disabled={loadingSellToken}
                      type="submit"
                      color="primary"
                      variant="contained"
                    >
                      {loadingSellToken ? <CircularProgress color="secondary" /> : "Create"}
                    </Button>
                  </Box>
                </Card>
              </form>
            </Box>
          </Modal>
        </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12}>
          <TokenCard tokenSummary={tokenSummary} token={token} accounts={accounts} />
        </Grid>
        {props.tokenSummary.sellerContract.includes("0x00") ? null : (
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            {/* <TokenCard token={tokenSummary} /> */}
          </Grid>
        )}
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
ShowToken.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

ShowToken.getInitialProps = async (ctx) => {
  // console.log("ctx", ctx, ctx.query);

  const token = TokenContract(ctx.query.showtoken);
  const summaryToken = await token.methods.getSummary().call();
  const tokenSummary = {
    name: summaryToken[0],
    symbol: summaryToken[1],
    standart: summaryToken[2],
    totalSupply: summaryToken[3],
    tokenOwner: summaryToken[4],
    sellerContract: summaryToken[5],
  };

  // let sellerContractData;
  // if (!summaryToken[5].includes("0x00")) {
  //   const sellToken = SellTokenContract(summaryToken[5]);
  //   const summarySellToken = await sellToken.methods.getSummary().call();
  //   sellerContractData = {
  //     tokenPrice: summarySellToken[0],
  //     tokensSold: summarySellToken[1],
  //     admin: summarySellToken[2],
  //   };
  // }

  console.log("tokenSummary", tokenSummary);
  return { token, tokenSummary };
};
export default ShowToken;
