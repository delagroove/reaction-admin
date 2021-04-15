import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";

import getAccountsHandler from "../../../../../lib/accountsServer";
import hashPassword from '../../../../../lib/utils/hashPassword';


const useStyles = makeStyles((theme) => ({
  root: {
    "display": "flex",
    "flexDirection": "column",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  forgotPassword: {
    textDecoration: "underline",
    fontStyle: "italic",
    cursor: "pointer",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
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
  }
}));


export default function Login(props) {
  const { closeModal, openModal, refetch } = props;
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { passwordClient } = getAccountsHandler();

  const handleForgotPasswordClick = () => {
    openModal("forgot-password");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleOpenSignUp = () => {
    openModal("signup");
  };

  const registerUser = async () => {
    try {
      await passwordClient.login({
        user: {
          email
        },
        password: hashPassword(password)
      });
      await refetch();
      closeModal();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <form className={classes.root} noValidate>
      <h1>Sign in to your account</h1>
      <FormControl>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input id="email" aria-describedby="email-address" onChange={handleEmailChange} value={email}
          type="email"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input id="password" aria-describedby="password" onChange={handlePasswordChange} value={password}
          type="password"
        />
      </FormControl>
      <div className={classes.forgotPassword} onClick={handleForgotPasswordClick}>Forgot Password?</div>
      <Button onClick={registerUser} color="primary" variant="contained">Sign In</Button>
      {!!error && <div className={classes.error}>{error}</div>}
      <div className={classes.switchEntryMode} onClick={handleOpenSignUp}>Don't have an account? Sign Up</div>
    </form>
  );
}
