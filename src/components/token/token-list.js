import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import TokenContract from "src/eth/scripts/token";

export const TokenList = ({ tokenDatas }) => {
  console.log("tokenDatas", tokenDatas);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  useEffect(() => {
    (async () => {})();
  }, [tokenDatas]);
  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = tokenDatas.map((token) => token.id);
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === tokenDatas.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < tokenDatas.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>symbol</TableCell>
                <TableCell>Total Supply</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>On Sale</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokenDatas.length
                ? tokenDatas.slice(0, limit).map((token) => (
                    <TableRow
                      hover
                      key={token.id}
                      selected={selectedCustomerIds.indexOf(token.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedCustomerIds.indexOf(token.id) !== -1}
                          onChange={(event) => handleSelectOne(event, token.id)}
                          value="true"
                        />
                      </TableCell>
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
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {token.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {token.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {token.totalSupply}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {token.tokenOwner}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {token.sellerContract.includes("0x00") ? "NO" : "YES"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                : "Loading"}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={tokenDatas.length}
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
  tokenDatas: PropTypes.array.isRequired,
};
