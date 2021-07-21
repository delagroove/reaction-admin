import { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { navigationItemsQuery } from "../graphql/queries";
import { useUI } from "../context/UIContext";


const useNavigationItems = (shopId) => {
  const { onSetNavigationItems } = useUI();
  const [navigationItems, setNavigationItems] = useState([]);

  const { loading, refetch } = useQuery(navigationItemsQuery, {
    variables: {
      shopId
    },
    skip: !shopId,
    fetchPolicy: "cache-and-network",
    onCompleted(data) {
      const { navigationItemsByShopId: { nodes } } = data;
      onSetNavigationItems(nodes);
      setNavigationItems(nodes);
    }
  });

  return {
    navigationItems,
    isLoadingNavigationItems: loading,
    refetchNavigationItems: refetch
  };
};

export default useNavigationItems;
