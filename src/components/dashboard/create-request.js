import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";

export const CreateRequest = (props) => {
  // console.log("pors", props);
  const [values, setValues] = useState({
    description: "",
    amountToSpend: 0,
    recipient: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form onSubmit={(e) => props.onSubmit(e, values)}>
      <Card>
        <CardHeader subheader="Enter Min Contribution (wei)" title={props.title} />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            name="description"
            onChange={handleChange}
            value={values.description}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Amount to Spend"
            margin="normal"
            name="amountToSpend"
            onChange={handleChange}
            value={values.amountToSpend}
            type="number"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Recipient"
            margin="normal"
            name="recipient"
            onChange={handleChange}
            value={values.recipient}
            type="text"
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button disabled={props.loading} type="submit" color="primary" variant="contained">
            {props.loading ? <CircularProgress color="secondary" /> : "Send"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};
