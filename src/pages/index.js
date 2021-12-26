import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { LatestProducts } from "../components/dashboard/latest-products";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import { NewCampaign } from "src/components/dashboard/new-campaign";
import factory from "../eth/scripts/factory";
import React, { useState, useEffect, Fragment } from "react";
import web3 from "src/eth/scripts/web3";
import { useRouter } from "next/router";
import Link from "next/link";
function Dashboard(props) {
  // console.log("props", props);
  const router = useRouter();
  // console.log("loc", props, router);
  const [accounts, setAccounts] = useState(null);
  const [deployedCampaigns, setDeployedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      const deployedCampaigns = await factory.methods.getDeployedCampaign().call();
      setAccounts(accounts);
      setDeployedCampaign(deployedCampaigns);
    })();
  }, [router.pathname]);

  const onSubmit = async (e, minContribution) => {
    e.preventDefault();
    // console.log("min", minContribution);
    setLoading(true);
    let newCampaignAdd;
    try {
      newCampaignAdd = await factory.methods
        .createCampaign(minContribution)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          setDeployedCampaign(await factory.methods.getDeployedCampaign().call());
          setLoading(false);
        });
    } catch (error) {
      console.log("new camp err", error);
      setLoading(false);
    }
  };
  console.log(accounts, deployedCampaigns);
  return (
    <>
      <Head>
        <title>Dashboard </title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <NewCampaign title="Create New Campaign" onSubmit={onSubmit} loading={loading} />
            </Grid>
            {deployedCampaigns?.map((campaign, i) => {
              return (
                <React.Fragment key={i}>
                  <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <Link
                      href={{
                        pathname: "/[showcampaign]",
                        query: { showcampaign: campaign },
                      }}
                      passHref
                    >
                      <Budget campaign={campaign} i={i + 1} />
                    </Link>
                  </Grid>
                </React.Fragment>
              );
            })}

            {/* <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TasksProgress />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalProfit sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrafficByDevice sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={12} md={12} xl={9} xs={12}>
              <LatestOrders />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
