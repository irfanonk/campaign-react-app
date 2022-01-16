import React, { useState } from "react";
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
    name: "",
    description: "",
    minContribution: "",
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
          {props.title == "Create New Campaign" ? (
            <React.Fragment>
              <TextField
                label="Name"
                margin="normal"
                name="name"
                onChange={handleChange}
                value={values.name}
                type="text"
                variant="outlined"
              />
              <TextField
                label="Description"
                margin="normal"
                name="description"
                onChange={handleChange}
                value={values.description}
                type="text"
                variant="outlined"
              />
            </React.Fragment>
          ) : null}

          <TextField
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
