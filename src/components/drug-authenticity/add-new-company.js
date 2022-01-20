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

export const AddNewCompany = (props) => {
  // console.log("pors", props);
  const [values, setValues] = useState({});

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form onSubmit={(e) => props.onSubmit(e, values)}>
      <Card>
        <CardHeader subheader="Fill company information" title="Add new company" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Company Name"
            margin="normal"
            name="name"
            onChange={handleChange}
            value={values.name}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Owner Address"
            margin="normal"
            name="address"
            onChange={handleChange}
            value={values.address}
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
            {props.loading ? <CircularProgress color="secondary" /> : "Add"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};
