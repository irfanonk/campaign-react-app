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
  // console.log("props", props);
  const router = useRouter();
  const campaignAddress = router.query.showcampaign;
  const { accounts, requests, campaign, campaignData } = props;
  // const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNewReq, setLoadingNewReq] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState({ btnIdx: -1 });

  const [message, setMessage] = useState("");
  const [event, setEvent] = useState("");

  useEffect(() => {
    //  campaign.events
    //   .NewContribution({})
    //   .on("data", newContributionEvent)
    //   .on("error", (error) => console.log("evnt err", error));

    let emitter = campaign.events
      .allEvents({})
      .on("data", allEvents)
      .on("error", (error) => console.log("evnt err", error));

    return () => {
      window.removeEventListener(emitter);
    };
  }, [router]);

  function allEvents(e) {
    console.log("all", e, e.returnValues.length);
    let eventName = e.event + " created";
    let eventBody = JSON.stringify(e.returnValues);
    setEvent(eventName + " " + eventBody);
    setTimeout(() => {
      setEvent("");
    }, 30000);
  }
  function newContributionEvent(e) {
    console.log("e", e);
    const { _approver, _amount } = e.returnValues;
    let event = _amount + " wei contributed to campaign by " + _approver;
    setEvent(event);
    setTimeout(() => {
      setEvent("");
    }, 30000);
  }
  function showMessage(message) {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 30000);
  }
  const onContributionSubmit = async (e, values) => {
    e.preventDefault();
    // console.log("min", minContribution);
    const { minContribution } = values;
    setLoading(true);
    try {
      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: minContribution,
        })
        .then(async (tx) => {
          const summary = await campaign.methods.getSummary().call();
          // console.log("camp", summary);
          props.campaignData.balance = summary[3];
          props.campaignData.approversCount = summary[5];
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
          props.campaignData.requestsCount = summary[4];

          const allReqs = await Promise.all(
            Array(+summary[4])
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
      {event ? (
        <Alert
          color="warning"
          style={{ position: "fixed", top: "30%", zIndex: "10", width: "100%" }}
        >
          {event}{" "}
        </Alert>
      ) : null}
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <CampaignInfo
              title={campaignData.manager}
              a={campaignData.name}
              b={campaignData.description}
            />
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
            <ContrCampaign onSubmit={onContributionSubmit} loading={loading} title="Contribute" />
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
  // console.log("ac", accounts, campaign.methods);

  const summary = await campaign.methods.getSummary().call();
  // console.log("summ", summary);
  const requests = await Promise.all(
    Array(+summary[4])
      .fill()
      .map((elm, index) => {
        // console.log("i", index, campaign.methods);
        return campaign.methods.requests(index).call();
      })
  );
  const campaignData = {
    name: summary[0],
    description: summary[1],
    minimunContribution: summary[2],
    balance: summary[3],
    requestsCount: summary[4],
    approversCount: summary[5],
    manager: summary[6],
  };
  return { accounts, campaignData, requests, campaign };
};
export default ShowCampaign;
