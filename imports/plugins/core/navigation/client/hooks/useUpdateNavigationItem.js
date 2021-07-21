import i18next from "i18next";
import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/react-hooks";
import {
  updateNavigationItemMutation,
  deleteNavigationItemMutation,
  publishNavigationChangesMutation
} from "../graphql/mutations";
import { useUI } from "../context/UIContext";
import useNavigationTreeId from "./useNavigationTreeId";


const useUpdateNavigationItem = (shopId) => {
  const { onDeleteNavigationItem, onUpdateNavigationItem } = useUI();
  const { defaultNavigationTreeId } = useNavigationTreeId(shopId);
  const { enqueueSnackbar } = useSnackbar();

  const [publishNavigationItem] = useMutation(publishNavigationChangesMutation, {
    onError(error) {
      // TODO: translate this
      enqueueSnackbar(`Ha ocurrido un error publishNavigationItem ${error.message}`, { variant: "error" });
    }
  });

  const handlePublishNavigationChanges = async () => {
    await publishNavigationItem({
      variables: {
        input: {
          id: defaultNavigationTreeId,
          shopId
        }
      }
    });
  };


  const handleUpdateNavigationItem = (data) => {
    const { updateNavigationItem: { navigationItem } } = data;
    onUpdateNavigationItem(navigationItem);
    handlePublishNavigationChanges();
  };

  const [updateNavigationItem] = useMutation(updateNavigationItemMutation, {
    onCompleted(data) {
      handleUpdateNavigationItem(data);
      enqueueSnackbar(i18next.t("changesSaved"), { variant: "success" });
    },
    onError() {
      enqueueSnackbar(i18next.t("changesNotSaved"), { variant: "error" });
    }
  });

  const handleUpdateNavigationItemMutation = async (inputUpdateNavigation) => {
    await updateNavigationItem({
      variables: {
        input: inputUpdateNavigation
      }
    });
  };

  const handleDeleteNavigationItem = (data) => {
    const { deleteNavigationItem: { navigationItem } } = data;
    onDeleteNavigationItem(navigationItem);
    handlePublishNavigationChanges();
  };

  const [deleteNavigationItem] = useMutation(deleteNavigationItemMutation, {
    onCompleted(data) {
      handleDeleteNavigationItem(data);
      enqueueSnackbar(i18next.t("changesSaved"), { variant: "success" });
    },
    onError() {
      enqueueSnackbar(i18next.t("changesNotSaved"), { variant: "error" });
    }
  });

  const handleDeleteNavigationItemMutation = async (inputDeleteNavigation) => {
    await deleteNavigationItem({
      variables: {
        input: inputDeleteNavigation
      }
    });
  };

  return {
    publishNavigationChanges: handlePublishNavigationChanges,
    deleteNavigationItem: handleDeleteNavigationItemMutation,
    updateNavigationItem: handleUpdateNavigationItemMutation
  };
};

export default useUpdateNavigationItem;
