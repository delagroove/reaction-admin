import i18next from "i18next";
import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/react-hooks";
import { useUI } from "../context/UIContext";
import { createNavigationItemMutation } from "../graphql/mutations";

const useCreateNavigationItem = () => {
  const { onAddNavigationItem } = useUI();
  const { enqueueSnackbar } = useSnackbar();

  const [addNavigationItem, { loading }] = useMutation(createNavigationItemMutation, {
    onCompleted(data) {
      const { createNavigationItem: { navigationItem } } = data;
      onAddNavigationItem(navigationItem);
      enqueueSnackbar(i18next.t("changesSaved"), { variant: "success" });
    },
    onError() {
      enqueueSnackbar(i18next.t("changesNotSaved"), { variant: "error" });
    }
  });

  const handleCreateNavigationItem = async (navigationItem) => {
    await addNavigationItem({
      variables: {
        input: {
          navigationItem
        }
      }
    });
  };

  return {
    createNavigationItem: handleCreateNavigationItem,
    loadingAddNavigationItem: loading
  };
};

export default useCreateNavigationItem;
