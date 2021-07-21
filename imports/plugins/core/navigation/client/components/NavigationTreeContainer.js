import React from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import PencilIcon from "mdi-material-ui/Pencil";
import CloseIcon from "mdi-material-ui/Close";
// import { SortableTreeWithoutDndContext as SortableTree, removeNodeAtPath } from "react-sortable-tree";
import SortableTree, { removeNodeAtPath } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { useUI } from "../context/UIContext";
import SortableTheme from "./SortableTheme";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`
  },
  alert: {
    marginRight: "2em",
    marginLeft: "2em"
  }
}));

const NavigationTreeContainer = (props) => {
  const { onClickUpdateNavigationItem, onSetSortableNavigationTree, sortableNavigationTree } = props;

  const classes = useStyles();
  const { error, message, typeMessage } = useUI();
  const getNodeKey = ({ treeIndex }) => treeIndex;

  const generateNodeProps = ({ node, path }) => ({
    buttons: [
      <IconButton
        onClick={() => {
          onClickUpdateNavigationItem(node.navigationItem, {
            getNodeKey,
            node,
            path,
            treeData: sortableNavigationTree
          });
        }}
      >
        <PencilIcon />
      </IconButton>,
      <ConfirmDialog
        buttoncomponent={IconButton}
        openbuttoncomponent={<CloseIcon />}
        title={i18next.t("admin.navigation.removeItem")}
        onConfirm={() => {
          const newSortableNavigationTree = removeNodeAtPath({
            treeData: sortableNavigationTree,
            path,
            getNodeKey
          });
          onSetSortableNavigationTree(newSortableNavigationTree);
        }}
      >
        {({ openDialog }) => (
          <IconButton onClick={openDialog}>
            <CloseIcon />
          </IconButton>
        )}
      </ConfirmDialog>
    ]
  });

  return (
    <div className={classes.wrapper}>
      {error && (
        <Alert className={classes.alert} size="small" severity={typeMessage}>
          {message}
        </Alert>
      )}
      <SortableTree
            reactVirtualizedListProps={{
              style: {
                paddingTop: "50px",
                boxSizing: "border-box"
              },
              containerStyle: {
                position: "relative",
                overflow: "visible"
              }
            }}
            isVirtualized={false}
            generateNodeProps={generateNodeProps}
            treeData={sortableNavigationTree}
            maxDepth={10}
            onChange={onSetSortableNavigationTree}
            theme={SortableTheme}
            dndType={"CARD"}
          />

    </div>
  );
};

NavigationTreeContainer.propTypes = {
  onClickUpdateNavigationItem: PropTypes.func,
  onSetSortableNavigationTree: PropTypes.func,
  sortableNavigationTree: PropTypes.arrayOf(PropTypes.object)
};

export default React.memo(NavigationTreeContainer);
