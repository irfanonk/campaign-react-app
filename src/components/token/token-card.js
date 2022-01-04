import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import TokenContract from "src/eth/scripts/token";
import { useRouter } from "next/router";
export const TokenCard = (props) => {
  const router = useRouter();
  const { tokenSummary, accounts } = props;
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerBalance, setOwnerBalance] = useState(0);
  const [sellerBalance, setSellerBalance] = useState(0);

  const [values, setValues] = useState({
    transferAmount: "0",
  });

  useEffect(() => {
    (async () => {
      const token = TokenContract(router.query.showtoken);
      setToken(token);
      setOwnerBalance(await token.methods.balanceOf(tokenSummary.tokenOwner).call());
      if (!tokenSummary.sellerContract.includes("0X00")) {
        setSellerBalance(await token.methods.balanceOf(tokenSummary.sellerContract).call());
      }
    })();
  }, [tokenSummary]);
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  function showMessage(message) {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 10000);
  }

  const onTransferSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await token.methods.transfer(tokenSummary.sellerContract, values.transferAmount).send({
        from: accounts[0],
      });
      setOwnerBalance(await token.methods.balanceOf(tokenSummary.tokenOwner).call());
      setSellerBalance(await token.methods.balanceOf(tokenSummary.sellerContract).call());
      showMessage("success");
      setLoading(false);
    } catch (error) {
      showMessage(error.message);
    }
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {message ? (
        <Alert style={{ position: "fixed", zIndex: "10", width: "100%" }}>{message} </Alert>
      ) : null}
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        >
          <Typography align="center" color="textPrimary" gutterBottom variant="h5">
            {tokenSummary.symbol}
          </Typography>
        </Box>
        <Typography align="center" color="textPrimary" gutterBottom variant="h5">
          {tokenSummary.name}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {tokenSummary.standart}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      Sellers
      {tokenSummary.sellerContract.includes("0x00") ? (
        <Typography align="center" color="crimson" gutterBottom variant="h5">
          Not Selling Yet
        </Typography>
      ) : (
        <React.Fragment>
          <Link
            href={{
              pathname: "/sellercontract/[showsellercontract]",
              query: {
                showsellercontract: tokenSummary.sellerContract,
                totalSupply: tokenSummary.totalSupply,
                onSale: sellerBalance,
              },
            }}
            passHref
          >
            <Typography align="center" color="crimson" gutterBottom variant="h5">
              {tokenSummary.sellerContract}
              <br />
              {sellerBalance}
            </Typography>
          </Link>
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
              name="transferAmount"
              onChange={handleChange}
              value={values.transferAmount}
              type="number"
              variant="outlined"
            />
            <Button
              disabled={loading || !token}
              type="submit"
              onClick={onTransferSubmit}
              color="primary"
              variant="contained"
            >
              {loading ? <CircularProgress color="secondary" /> : "Transfer"}
            </Button>
          </Box>
        </React.Fragment>
      )}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <ClockIcon color="action" />
            <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body1">
              Owner: {tokenSummary.tokenOwner}
              <br></br>
              Balance: {ownerBalance}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Inventory2OutlinedIcon color="action" />
            <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
              {tokenSummary.totalSupply} Supply
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

TokenCard.propTypes = {
  tokenSummary: PropTypes.object.isRequired,
};
