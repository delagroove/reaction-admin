import { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useUI } from "../context/UIContext";
import { defaultNavigationTreeQuery } from "../graphql/queries";
import useNavigationTreeId from "./useNavigationTreeId";

const useNavigationTree = (shopId) => {
  const { onSetNavigationTree } = useUI();
  const { defaultNavigationTreeId } = useNavigationTreeId(shopId);
  const [navigationTreeName, setNavigationTreeName] = useState("");
  const shouldSkip = !(shopId && defaultNavigationTreeId !== "");

  const { loading, refetch } = useQuery(defaultNavigationTreeQuery, {
    variables: {
      id: defaultNavigationTreeId,
      // TODO: get this from shop config language
      language: "en",
      shopId
    },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
    onCompleted(data) {
      if (data) {
        const { navigationTreeById: { name, draftItems } } = data;
        setNavigationTreeName(name);
        onSetNavigationTree(draftItems || {});
      }
    }
  });

  return {
    navigationTreeName,
    isLoadingNavigationTree: loading,
    refetchNavigationTree: refetch
  };
};

export default useNavigationTree;
