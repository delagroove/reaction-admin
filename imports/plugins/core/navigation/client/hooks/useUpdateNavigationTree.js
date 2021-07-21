import i18next from "i18next";
import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/react-hooks";
import { updateNavigationTreeMutation } from "../graphql/mutations";
import { useUI } from "../context/UIContext";
import useNavigationShopSettings from "./useNavigationShopSettings";
import useUpdateNavigationItem from "./useUpdateNavigationItem";
import useNavigationTreeId from "./useNavigationTreeId";


const useUpdateNavigationTree = (shopId) => {
  const { navigationShopSettings } = useNavigationShopSettings(shopId);
  const { defaultNavigationTreeId } = useNavigationTreeId(shopId);
  const { publishNavigationChanges } = useUpdateNavigationItem(shopId);
  const { onUpdateNavigationTree, sortableNavigationTree } = useUI();
  const { enqueueSnackbar } = useSnackbar();

  const {
    shouldNavigationTreeItemsBeAdminOnly,
    shouldNavigationTreeItemsBePubliclyVisible,
    shouldNavigationTreeItemsBeSecondaryNavOnly
  } = navigationShopSettings;

  const handleUpdateNavigationTree = (data) => {
    const { updateNavigationTree: { navigationTree } } = data;
    onUpdateNavigationTree(navigationTree);
    publishNavigationChanges();
  };

  const [updateNavigationTree, { loading }] = useMutation(updateNavigationTreeMutation, {
    onCompleted(data) {
      handleUpdateNavigationTree(data);
      enqueueSnackbar(i18next.t("changesSaved"), { variant: "success" });
    },
    onError() {
      enqueueSnackbar(i18next.t("changesNotSaved"), { variant: "error" });
    }
  });

  const sortableNavigationTreeToDraftItems = (sortableNavigationTreeNav) => sortableNavigationTreeNav.map((node) => {
    const newNode = {};
    newNode.navigationItemId = node.id;
    newNode.expanded = node.expanded;
    newNode.isVisible = typeof node.isVisible === "boolean" ? node.isVisible : shouldNavigationTreeItemsBePubliclyVisible;
    newNode.isPrivate = typeof node.isPrivate === "boolean" ? node.isPrivate : shouldNavigationTreeItemsBeAdminOnly;
    newNode.isSecondary = typeof node.isSecondary === "boolean" ? node.isSecondary : shouldNavigationTreeItemsBeSecondaryNavOnly;

    if (Array.isArray(node.children) && node.children.length) {
      newNode.items = sortableNavigationTreeToDraftItems(node.children);
    }

    return newNode;
  });

  const handleUpdateNavigationTreeMutation = async () => {
    const input = {
      id: defaultNavigationTreeId,
      navigationTree: {
        draftItems: sortableNavigationTreeToDraftItems(sortableNavigationTree)
      },
      shopId
    };

    await updateNavigationTree({
      variables: {
        input
      }
    });
  };

  return {
    updateNavigationTree: handleUpdateNavigationTreeMutation,
    isLoadingUpdateNavigationTree: loading
  };
};

export default useUpdateNavigationTree;
