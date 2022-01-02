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

export const CreateNewToken = (props) => {
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
        <CardHeader subheader="Fill token information" title="Create New Token" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Token Name"
            margin="normal"
            name="name"
            onChange={handleChange}
            value={values.name}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Token Symbol"
            margin="normal"
            name="symbol"
            onChange={handleChange}
            value={values.symbol}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Token Standart"
            margin="normal"
            name="standart"
            onChange={handleChange}
            value={values.standart}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Initial Supply"
            margin="normal"
            name="initialSupply"
            onChange={handleChange}
            value={values.initialSupply}
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
            {props.loading ? <CircularProgress color="secondary" /> : "Create"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};
