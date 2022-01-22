import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";

export const TokenList = ({ tokens }) => {
  console.log("tokens", tokens);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = tokens.map((token) => token.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>TotalSupply</TableCell>
                <TableCell>On Sale</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens?.slice(0, limit).map((token) => (
                <TableRow
                  hover
                  key={token.id}
                  selected={selectedCustomerIds.indexOf(token.id) !== -1}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        <Link
                          href={{
                            pathname: "/token/[showtoken]",
                            query: { showtoken: token.address },
                          }}
                          passHref
                        >
                          {token.address}
                        </Link>
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{token.name} </TableCell>
                  <TableCell>{token.symbol} </TableCell>
                  <TableCell>{token.tokenOwner} </TableCell>
                  <TableCell>{token.totalSupply} </TableCell>
                  <TableCell>
                    {parseInt(token.sellerContract, 16) == 0 ? (
                      <Button color="warning" variant="outlined">
                        No
                      </Button>
                    ) : (
                      <Button color="success" variant="outlined">
                        Yes
                      </Button>
                    )}{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={tokens?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

TokenList.propTypes = {
  tokens: PropTypes.array.isRequired,
};
