import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import AllOutOutlinedIcon from "@mui/icons-material/AllOutOutlined";
import { TotalCustomers } from "./total-customers";

export const Budget = (props) => (
  <Card sx={{ height: "100%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            Campaign Address: <br /> {props.campaign}
          </Typography>
          <Typography color="textPrimary" variant="h4"></Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            {props.i}
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <AllOutOutlinedIcon color="error" />
        <Typography color="textSecondary" variant="caption"></Typography>
      </Box>
    </CardContent>
  </Card>
);
