import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/customer/customer-list-results";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";
import { AddNewCompany } from "src/components/drug-authenticity/add-new-company";
import { useState, useEffect } from "react";
import drugAuthenticity from "../eth/scripts/drugAuthenticity";
import web3 from "src/eth/scripts/web3";
import TokenContract from "src/eth/scripts/token";
import { CompanyList } from "src/components/drug-authenticity/company-list";
import { AddNewDrug } from "src/components/drug-authenticity/add-new-drug";

const DrugAuthenticity = (props) => {
  // console.log("props", props);
  const [loading, setLoading] = useState(false);
  const [loadingAddNewDrug, setLoadingAddNewDrug] = useState(false);
  const [drugCompanies, setDrugCompanies] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      // console.log("drg", drugAuthenticity.methods);
      const currentAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const drugCompanyAddresses = await drugAuthenticity.methods.getCompanies().call();
      setAccounts(currentAccounts);
      let companies = [];
      drugCompanyAddresses.forEach(async (address, i) => {
        let companyName = await drugAuthenticity.methods.companies(address).call();
        companies = [...companies, { id: i, address: address, name: companyName }];
        // console.log("companies", companies);
        setDrugCompanies(companies);
      });

      // console.log("acc", currentAccounts);
    })();

    return () => {};
  }, []);

  function showMessage(message) {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 30000);
  }
  const onAddNewDrugSubmit = async (e, values) => {
    e.preventDefault();
    // console.log("values", values);
    const { drugCode, name, producedBy } = values;
    setLoadingAddNewDrug(true);
    try {
      await drugAuthenticity.methods
        .addDrug(drugCode, name, producedBy)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          showMessage("successful");

          setLoadingAddNewDrug(false);
        });
    } catch (error) {
      console.log("new drug err", error);
      showMessage(error.message);

      setLoadingAddNewDrug(false);
    }
  };
  const onAddNewCompanySubmit = async (e, values) => {
    e.preventDefault();
    setLoading(true);

    const { name, address } = values;
    try {
      await drugAuthenticity.methods
        .setCompany(address, name)
        .send({
          from: accounts[0],
        })
        .then(async (tx) => {
          showMessage("successful");
          let companies = [
            ...drugCompanies,
            { id: drugCompanies.length + 1, address: address, name: name },
          ];
          setDrugCompanies(companies);
          setLoading(false);
        });
    } catch (error) {
      console.log("new camp err", error);
      howMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Drug Authenticity</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
            <CompanyList companies={drugCompanies} />
          </Box>
          <Box sx={{ mt: 3 }}>
            {" "}
            <AddNewCompany onSubmit={onAddNewCompanySubmit} loading={loading} />
          </Box>
          <Box sx={{ mt: 3 }}>
            {" "}
            <AddNewDrug
              onSubmit={onAddNewDrugSubmit}
              loading={loadingAddNewDrug}
              title="Add New Drug"
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};
DrugAuthenticity.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
DrugAuthenticity.getInitialProps = async (ctx) => {
  // console.log("initial");

  return {};
};

export default DrugAuthenticity;
