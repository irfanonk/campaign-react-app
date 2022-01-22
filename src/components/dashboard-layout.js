import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      console.log("eth");
      console.log(ethereum);
      let chainId = ethereum.chainId;
      let chainName =
        chainId == "0x1"
          ? "Mainnet"
          : chainId == "0x3"
          ? "Ropsten"
          : chainId == "0x4"
          ? "Rinkeby"
          : "Other";
      let isMetamask = ethereum.isMetamask;
      let address = ethereum.selectedAddress;

      // console.log(chainId, isMetamask, address);
      ethereum.on("accountsChanged", (accounts) => {
        window.location.reload();
      });

      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });

      setAccountData({ chainName, isMetamask, address });
      console.log("account data", accountData);
    }
  }, []);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar accountData={accountData} onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
