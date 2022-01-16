import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";

export const DisplayRequests = (props) => (
  // console.log("prps", props),
  <Card {...props}>
    <CardHeader title="Latest requests" />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    Value
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>Approval Count</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approve</TableCell>
              <TableCell>Finalize Request</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.requests.map((request, idx) => (
              <TableRow hover key={idx}>
                <TableCell>{request.description}</TableCell>
                <TableCell>{request.value}</TableCell>
                <TableCell>
                  {request.approvalCount}/{props.approversCount}
                </TableCell>
                <TableCell>{request.recipient}</TableCell>
                <TableCell>
                  <SeverityPill color={request.completed ? "success" : "warning"}>
                    {request.completed ? "Completed" : "Pending"}
                  </SeverityPill>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => props.onApproveClick(idx)}
                    disabled={request.completed || props.loading.btnIdx != -1}
                  >
                    {props.loading.btnIdx == idx ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => props.onFinalizeClick(idx)}
                    disabled={request.completed || props.loading.btnIdx != -1}
                  >
                    {props.loading.btnIdx == idx ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      "Finalize"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
  </Card>
);
