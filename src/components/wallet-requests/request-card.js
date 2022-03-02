import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  CardMedia,
  Button,
} from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import { Download as DownloadIcon } from "../../icons/download";

export const RequestCard = ({ onClaimClick, request, ...rest }) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
    {...rest}
  >
    <CardMedia component="img" height="250" image={request.image} alt="green iguana" />
    <CardContent>
      <Typography align="center" color="textPrimary" gutterBottom variant="h5">
        {request.title}
      </Typography>
      <Typography align="center" color="textPrimary" variant="body1">
        {request.description}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }}></Box>
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
          <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
            <Button onClick={() => onClaimClick(request)}>Claim</Button>
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <DownloadIcon color="action" />
          <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
            {request.id}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Card>
);

RequestCard.propTypes = {
  request: PropTypes.object.isRequired,
};
