import { Avatar, Box, Card, CardContent, Grid, Typography, Divider } from "@mui/material";
import { Lock as LockIcon } from "../../icons/lock";
import { Download as DownloadIcon } from "../../icons/download";

export const CampaignCard = ({ campaign, ...rest }) => (
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
        <Avatar
          alt="campaign"
          src={`/static/images/products/product_${campaign.id + 1}.png`}
          variant="square"
        />
      </Box>
      <Typography align="center" color="textPrimary" gutterBottom variant="h5">
        {campaign.name}
      </Typography>
      <Typography align="center" color="textPrimary" variant="body1">
        {campaign.description}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
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
          <LockIcon color="action" />
          <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
            {campaign.balance}wei Contributed
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
            {campaign.minimunContribution}wei Minimun Contribution
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Card>
);
