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
} from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Link from "next/link";
import React, { useState } from "react";

export const TokenCard = ({ token, tokenSummary, accounts, ...rest }) => {
  console.log("token", token);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    transferAmount: "0",
  });
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const onTransferSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await token.methods.transfer(tokenSummary.sellerContract, values.transferAmount).send({
      from: accounts[0],
    });
    setLoading(false);
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      {...rest}
    >
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
              query: { showsellercontract: tokenSummary.sellerContract },
            }}
            passHref
          >
            <Typography align="center" color="crimson" gutterBottom variant="h5">
              {tokenSummary.sellerContract}
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
              disabled={loading}
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
              {tokenSummary.tokenSummaryOwner} Owner
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
