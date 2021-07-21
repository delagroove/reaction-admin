import React, { useState } from "react";
import i18next from "i18next";
import { makeStyles, Dialog, DialogContent, CircularProgress } from "@material-ui/core";
import Button from "@reactioncommerce/catalyst/Button";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar";
import ContentViewPrimaryDetailLayout from "/imports/client/ui/layouts/ContentViewPrimaryDetailLayout";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import useNavigationItems from "../hooks/useNavigationItems";
import useCreateNavigationItem from "../hooks/useCreateNavigationItem";
import useUpdateNavigationItem from "../hooks/useUpdateNavigationItem";
import useUpdateNavigationTree from "../hooks/useUpdateNavigationTree";
import useNavigationTree from "../hooks/useNavigationTree";
import withNavigationUIStore from "../hocs/withNavigationUIStore";
import { useUI } from "../context/UIContext";
import NavigationItemList from "./NavigationItemList";
import NavigationTreeContainer from "./NavigationTreeContainer";
import NavigationItemForm from "./NavigationItemForm";


const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(4)
  }
}));

const NavigationDashboard = () => {
  const classes = useStyles();
  const [shopId] = useCurrentShopId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [navigationItem, setNavigationItem] = useState(null);
  const [sortableTreeNode, setSortableTreeNode] = useState(null);

  const { isLoadingNavigationTree } = useNavigationTree(shopId);
  const { isLoadingNavigationItems } = useNavigationItems(shopId);
  const { createNavigationItem } = useCreateNavigationItem();
  const { updateNavigationTree } = useUpdateNavigationTree(shopId);
  const { deleteNavigationItem, updateNavigationItem } = useUpdateNavigationItem(shopId);

  const {
    navigationItems,
    onSetSortableNavigationTree,
    sortableNavigationTree,
    onDiscardNavigationTreeChanges,
    isUnSavedChanges
  } = useUI();

  const addNavigationItem = () => {
    setIsModalOpen(true);
    setModalMode("create");
    setNavigationItem(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const updateNavigationItemFunc = (navigationItemDoc, sortableTreeNodeNav) => {
    // avoid change items if the tree has unsaved changes
    if (!isUnSavedChanges) {
      const { _id, draftData } = navigationItemDoc;
      const { content, url, isUrlRelative, shouldOpenInNewWindow, classNames } = draftData;
      const { value } = content.find((ct) => ct.language === "en");
      const navigationItemNav = {
        _id,
        name: value,
        url,
        isUrlRelative,
        shouldOpenInNewWindow,
        classNames
      };

      // Add visibility flags from the navigation tree node
      if (sortableTreeNodeNav) {
        const { node: navigationTreeItem } = sortableTreeNodeNav;
        navigationItemNav.isInNavigationTree = typeof navigationTreeItem === "object";
        navigationItemNav.isVisible = navigationTreeItem.isVisible;
        navigationItemNav.isPrivate = navigationTreeItem.isPrivate;
        navigationItemNav.isSecondary = navigationTreeItem.isSecondary;
      }

      setIsModalOpen(true);
      setModalMode("edit");
      setNavigationItem(navigationItemNav);
      setSortableTreeNode(sortableTreeNodeNav);
    }
  };

  return (
    <>
      <ContentViewPrimaryDetailLayout
        AppBarComponent={
          <PrimaryAppBar title={i18next.t("admin.navigation.title") || "Main Navigation"}>
            <Button color="primary" onClick={onDiscardNavigationTreeChanges}>{i18next.t("app.cancel")}</Button>
            <Button color="primary" disabled={!isUnSavedChanges} variant="contained" onClick={updateNavigationTree}>{i18next.t("app.saveChanges")}</Button>
          </PrimaryAppBar>
        }

        PrimaryComponent={
          <>
            {!isLoadingNavigationItems &&
              <NavigationItemList
                navigationItems={navigationItems}
                onClickAddNavigationItem={addNavigationItem}
                onClickUpdateNavigationItem={updateNavigationItemFunc}
              />
            }
            {isLoadingNavigationItems &&
              <div className={classes.spinner}>
                <CircularProgress />
              </div>
            }
          </>
        }

        DetailComponent={
          <>
            {!isLoadingNavigationTree &&
              <NavigationTreeContainer
                sortableNavigationTree={sortableNavigationTree}
                onSetSortableNavigationTree={onSetSortableNavigationTree}
                onClickUpdateNavigationItem={updateNavigationItemFunc}
              />
            }
            {isLoadingNavigationTree &&
              <div className={classes.spinner}>
                <CircularProgress />
              </div>
            }
          </>
        }
      />
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        fullWidth={true}
        maxWidth="sm"
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        <DialogContent>
          <NavigationItemForm
            createNavigationItem={createNavigationItem}
            deleteNavigationItem={deleteNavigationItem}
            mode={modalMode}
            navigationItem={navigationItem}
            shopId={shopId}
            sortableTreeNode={sortableTreeNode}
            onCloseForm={handleCloseModal}
            updateNavigationItem={updateNavigationItem}
            onSetSortableNavigationTree={onSetSortableNavigationTree}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default withNavigationUIStore(NavigationDashboard);
