import React from "react";
import { makeStyles, Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import queryString from "query-string";

const { rootUrl } = Meteor.settings.public;

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    color: "#7800FF",
    fontFamily: "'Source Sans Pro', 'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
    fontSize: 30,
    fontWeight: 400,
    marginBottom: 40,
    textAlign: "center"
  },
  generalText: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 40,
    textAlign: "center"
  },
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1040,
    padding: 0
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
  }
}));


/**
 * @summary OAuthError React component
 * @param {Object} props Component props
 * @return {React.Node} Rendered component instance
 */
function OAuthError() {
  const classes = useStyles();
  const location = useLocation();
  const { message } = queryString.parse(location.search);

  return (
    <div className={classes.container}>
      <div className={classes.pageTitle}>Error</div>
      <div className={classes.generalText}>{message || "Session error, try again"}</div>
      <Button variant="outlined" color="primary" href={rootUrl} className={classes.colorPrimary}>
        Restart session
      </Button>
    </div>
  );
}

export default OAuthError;
