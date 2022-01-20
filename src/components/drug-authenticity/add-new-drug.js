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

export const AddNewDrug = (props) => {
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
        <CardHeader subheader="Enter Information" title={props.title} />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Drug Code"
            margin="normal"
            name="drugCode"
            onChange={handleChange}
            value={values.drugCode}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
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
            label="Produced By"
            margin="normal"
            name="producedBy"
            onChange={handleChange}
            value={values.producedBy}
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
