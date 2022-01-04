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

  return (
    <form onSubmit={(e) => props.onSubmit(e, values)}>
      <Card>
        <CardHeader subheader="Enter Campaign Details" title={props.title} />
        <Divider />
        <CardContent>
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
            fullWidth
            label="Descrption"
            margin="normal"
            name="description"
            onChange={handleChange}
            value={values.description}
            type="text"
            variant="outlined"
          />
          <TextField
            label="Min Contribution (Wei)"
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
            {props.loading ? <CircularProgress color="secondary" /> : "Create"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};
