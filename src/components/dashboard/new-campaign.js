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

export const NewCampaign = (props) => {
  const [values, setValues] = useState({
    minContribution: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("minContribution", values.minContribution);
  };
  return (
    <form onSubmit={(e) => props.onSubmit(e, values.minContribution)}>
      <Card>
        <CardHeader subheader="Enter Min Contribution (wei)" title={props.title} />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Min Contribution"
            margin="normal"
            name="minContribution"
            onChange={handleChange}
            value={values.minContribution}
            type="number"
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
