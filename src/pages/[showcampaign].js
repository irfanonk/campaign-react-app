import { useRouter } from "next/router";
import { DashboardLayout } from "src/components/dashboard-layout";
import { Box, Container, Grid, Alert } from "@mui/material";
import { CampaignInfo } from "src/components/dashboard/campaign-info";
import Campaign from "src/eth/scripts/campaign";
import { useEffect, useState } from "react";
import { NewCampaign as ContrCampaign } from "src/components/dashboard/new-campaign";
import web3 from "src/eth/scripts/web3";
import { CreateRequest } from "src/components/dashboard/create-request";
import { DisplayRequests } from "src/components/dashboard/display-requests";

function ShowCampaign(props) {
  console.log("props", props);
  const router = useRouter();
  const campaignAddress = router.query.showcampaign;
  const { accounts, requests, campaign, campaignData } = props;
  // const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNewReq, setLoadingNewReq] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState({ btnIdx: -1 });

  // const [requests, setRequests] = useState(null);
  const [message, setMessage] = useState("");
  // const [campaign, setCampaign] = useState();
  // const [campaignData, setCampaignData] = useState({
  //   minimunContribution: 0,
  //   balance: 0,
  //   requestsCount: 0,
  //   approversCount: 0,
  //   manager: "",
  // });

  // useEffect(() => {
  //   (async () => {
  //     // const accounts = await web3.eth.getAccounts();
  //     const { summary } = props;

  //     setCampaignData({
  //       minimunContribution: summary[0],
  //       balance: summary[1],
  //       requestsCount: summary[2],
  //       approversCount: summary[3],
  //       manager: summary[4],
  //     });

  //   })();
  // }, []);

  function showMessage(message) {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 10000);
  }
  const onContrSubmit = async (e, contribution) => {
    e.preventDefault();
    // console.log("min", minContribution);
    setLoading(true);
    try {
      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: contribution,
        })
        .then(async (tx) => {
          const summary = await campaign.methods.getSummary().call();
          // console.log("camp", summary);
          props.campaignData.balance = summary[1];
          props.campaignData.approversCount = summary[3];
          showMessage("success");
          setLoading(false);
        });
    } catch (error) {
      showMessage(error.message);
      setLoading(false);
    }
  };
  const onNewRequestSubmit = async (e, values) => {
    e.preventDefault();
    // console.log("values", values);
    const { description, amountToSpend, recipient } = values;
    setLoadingNewReq(true);
    try {
      await campaign.methods
        .createRequest(description, +amountToSpend, recipient)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          const summary = await campaign.methods.getSummary().call();
          props.campaignData.requestsCount = summary[2];

          const allReqs = await Promise.all(
            Array(+summary[2])
              .fill()
              .map((elm, index) => {
                // console.log("i", index, campaign.methods);
                return campaign.methods.requests(index).call();
              })
          );
          props.requests = allReqs;
          showMessage("successful");

          setLoadingNewReq(false);
        });
    } catch (error) {
      showMessage(error.message);

      setLoadingNewReq(false);
    }
  };
  const onApproveClick = async (btnIdx) => {
    console.log("btnIdx", btnIdx);
    console.log("req", requests[btnIdx]);
    setLoadingApprove({ btnIdx: btnIdx });
    try {
      await campaign.methods
        .approveRequest(btnIdx)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          showMessage("success");
          requests[btnIdx] = await campaign.methods.requests(btnIdx).call();
          setLoadingApprove({ btnIdx: -1 });
        });
    } catch (error) {
      showMessage(error.message);
      setLoadingApprove({ btnIdx: -1 });
    }
  };
  const onFinalizeClick = async (btnIdx) => {
    setLoadingApprove({ btnIdx: btnIdx });
    try {
      await campaign.methods
        .finilazeRequest(btnIdx)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          showMessage("success");
          requests[btnIdx] = await campaign.methods.requests(btnIdx).call();
          setLoadingApprove({ btnIdx: -1 });
        });
    } catch (error) {
      showMessage(error.message);
      setLoadingApprove({ btnIdx: -1 });
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
        <Grid container spacing={1}>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <CampaignInfo title="Manager" a={campaignData.manager} />
          </Grid>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <CreateRequest
              onSubmit={onNewRequestSubmit}
              loading={loadingNewReq}
              title="Create New Request"
            />
          </Grid>

          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <CampaignInfo title="Balance" a={campaignData.balance} />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <CampaignInfo title="Min Contribution" a={campaignData.minimunContribution} />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <CampaignInfo title="Total Approvers" a={campaignData.approversCount} />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <CampaignInfo title="Total Request" a={campaignData.requestsCount} />
          </Grid>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <ContrCampaign onSubmit={onContrSubmit} loading={loading} title="Contribute" />
          </Grid>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <DisplayRequests
              onApproveClick={onApproveClick}
              onFinalizeClick={onFinalizeClick}
              requests={requests}
              approversCount={campaignData.approversCount}
              loading={loadingApprove}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

ShowCampaign.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

ShowCampaign.getInitialProps = async (ctx) => {
  // console.log("ctx", ctx, ctx.query);
  const accounts = await web3.eth.getAccounts();
  const campaign = Campaign(ctx.query.showcampaign);
  const summary = await campaign.methods.getSummary().call();
  // console.log("summary", summary);
  const requests = await Promise.all(
    Array(+summary[2])
      .fill()
      .map((elm, index) => {
        // console.log("i", index, campaign.methods);
        return campaign.methods.requests(index).call();
      })
  );
  const campaignData = {
    minimunContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
  return { accounts, campaignData, requests, campaign };
};
export default ShowCampaign;
