import { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { defaultNavigationTreeIdQuery } from "../graphql/queries";

const useNavigationTreeId = (shopId) => {
  const [defaultNavigationTreeId, setDefaultNavigationTreeId] = useState("");
  const { loading, data, refetch } = useQuery(defaultNavigationTreeIdQuery, {
    variables: {
      id: shopId
    },
    skip: !shopId,
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (!loading && data) {
      setDefaultNavigationTreeId(data.shop.defaultNavigationTreeId);
    }
  }, [data, loading]);

  return {
    defaultNavigationTreeId,
    loadingDefaultNavigationTreeId: loading,
    refetchDefaultNavigationTreeId: refetch
  };
};

export default useNavigationTreeId;
