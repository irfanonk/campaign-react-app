import PropTypes from "prop-types";
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Link from "next/link";
export const TokenCard = ({ token, ...rest }) => (
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
          {token.symbol}
        </Typography>
      </Box>
      <Typography align="center" color="textPrimary" gutterBottom variant="h5">
        {token.name}
      </Typography>
      <Typography align="center" color="textPrimary" variant="body1">
        {token.standart}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider />
    Sellers
    {token.sellerContract.includes("0x00") ? (
      <Typography align="center" color="crimson" gutterBottom variant="h5">
        Not Selling Yet
      </Typography>
    ) : (
      <Link
        href={{
          pathname: "/sellercontract/[showsellercontract]",
          query: { showsellercontract: token.sellerContract },
        }}
        passHref
      >
        <Typography align="center" color="crimson" gutterBottom variant="h5">
          {token.sellerContract}
        </Typography>
      </Link>
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
            {token.tokenOwner} Owner
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
            {token.totalSupply} Supply
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Card>
);

TokenCard.propTypes = {
  token: PropTypes.object.isRequired,
};
