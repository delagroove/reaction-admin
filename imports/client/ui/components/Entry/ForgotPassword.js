import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

import getAccountsHandler from "../../../../../lib/accountsServer";

const useStyles = makeStyles((theme) => ({
  root: {
    "display": "flex",
    "flexDirection": "column",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  switchEntryMode: {
    textAlign: "center",
    textDecoration: "underline",
    cursor: "pointer",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  error: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: red[500],
    fontSize: "1.1em",
    textAlign: "center"
  },
  sendButton: {
    marginTop: theme.spacing(4)
  }
}));


export default function ForgotPassword(props) {
  const { openModal } = props;
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { passwordClient } = getAccountsHandler();

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleOpenLogIn = () => {
    openModal("login");
  };
  const handleForgotPassword = async () => {
    try {
      await passwordClient.requestPasswordReset(email);
      setSuccess("Check your inbox for password reset email");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <form className={classes.root} noValidate>
      <h1>Forgot password</h1>
      <FormControl>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input id="email" aria-describedby="email" onChange={handleChangeEmail} value={email}
          type="email"
        />
      </FormControl>
      <Button onClick={handleForgotPassword} color="primary" variant="contained" className={classes.sendButton}>Send link to reset password</Button>
      {!!error && <div className={classes.error}>{error}</div>}
      {!!success && <div className={classes.success}>{success}</div>}
      <div className={classes.switchEntryMode} onClick={handleOpenLogIn}>Go to Log In</div>
    </form>
  );
}