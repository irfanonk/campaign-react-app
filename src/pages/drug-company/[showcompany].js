import { useRouter } from "next/router";
import { DashboardLayout } from "src/components/dashboard-layout";
import { Box, Container, Grid, Alert, Card, CardContent, Typography } from "@mui/material";
import drugAuthenticity from "../../eth/scripts/drugAuthenticity";
import { useEffect, useState } from "react";
import { AddNewDrug } from "src/components/drug-authenticity/add-new-drug";
import { DrugList } from "src/components/drug-authenticity/drug-list";

function ShowCompany(props) {
  // console.log("props", props);
  const router = useRouter();
  const companyAddress = router.query.showcompany;
  const companyName = router.query.companyname;
  const [accounts, setAccounts] = useState([]);
  const [drugList, setDrugList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [event, setEvent] = useState("");

  useEffect(() => {
    //  campaign.events
    //   .NewContribution({})
    //   .on("data", newContributionEvent)
    //   .on("error", (error) => console.log("evnt err", error));
    (async () => {
      const currentAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccounts(currentAccounts);

      const drugList = await drugAuthenticity.methods.getDrugs(companyAddress).call();
      setDrugList(drugList);
      console.log("drug", drugList);
    })();

    return () => {};
  }, [router]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <Card sx={{ height: "100%" }} {...props}>
              <CardContent>
                <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="h5">
                      Company Name: {companyName}
                    </Typography>
                    <Typography color="textPrimary" variant="body1">
                      Company Address: {companyAddress}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <DrugList drugs={drugList} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

ShowCompany.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

ShowCompany.getInitialProps = async (ctx) => {
  return {};
};
export default ShowCompany;
