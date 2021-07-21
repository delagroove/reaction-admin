/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NavigationItemCard from "./NavigationItemCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    maxWidth: 380,
    [theme.breakpoints.up("xs")]: {
      maxWidth: "100%"
    }
  },
  header: {
    padding: theme.spacing(2),
    textAlign: "right",
    flex: 0
  },
  list: {
    flex: 1,
    overflowY: "auto",
    height: "100%"
  },
  listContent: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

const NavigationItemList = (props) => {
  const classes = useStyles();
  const {
    onClickAddNavigationItem,
    navigationItems,
    onClickUpdateNavigationItem
  } = props;

  const renderNavigationItems = () => {
    if (navigationItems) {
      return navigationItems.map((navigationItem) => {
        const row = { node: { navigationItem } };
        return (
          <NavigationItemCard
            row={row}
            key={navigationItem._id}
            onClickUpdateNavigationItem={onClickUpdateNavigationItem}
          />
        );
      });
    }
    return null;
  };

  return (
    <DndProvider backend={HTML5Backend} >
      <div className={classes.root}>
        <div className={classes.header}>
          <Button color="primary" variant="outlined" onClick={onClickAddNavigationItem}>{i18next.t("admin.navigation.addItem")}</Button>
        </div>
        <div className={classes.list}>
          <div className={classes.listContent}>
            {renderNavigationItems()}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

NavigationItemList.propTypes = {
  navigationItems: PropTypes.array,
  onClickAddNavigationItem: PropTypes.func,
  onClickUpdateNavigationItem: PropTypes.func
};


export default NavigationItemList;
