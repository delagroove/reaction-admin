import { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { shopSettingsQuery } from "../graphql/queries";

const useNavigationShopSettings = (shopId) => {
  const [navigationShopSettings, setNavigationShopSettings] = useState({});

  const { loading, data, refetch } = useQuery(shopSettingsQuery, {
    variables: {
      shopId
    },
    skip: !shopId,
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (!loading && data) {
      setNavigationShopSettings(data?.shopSettings || {});
    }
  }, [data, loading]);

  return {
    navigationShopSettings,
    isLoadingNavigationShopSettings: loading,
    refetchNavigationShopSettings: refetch
  };
};

export default useNavigationShopSettings;
