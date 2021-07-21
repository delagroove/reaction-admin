import { useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { AssestNavigation } from "../graphql/queries";
import { getOptions } from "../utils/helpers";
import { i18next } from "/client/api";


const useGetUrls = () => {
  const [assets, setAssets] = useState([]);
  const [getUrls, { loading }] = useLazyQuery(
    AssestNavigation,
    {
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      onCompleted(data) {
        // TODO: translate this
        const defaultUrls = [
          { value: "/products", label: i18next.t('admin.navigation.items.allProducts'), color: "default", type: i18next.t('admin.navigation.items.default') },
          { value: "/cart", label: i18next.t('admin.navigation.items.shopCart'), color: "default", type: i18next.t('admin.navigation.items.default')}
        ];

        const tags = getOptions(data?.tags?.nodes || [], {
          key: i18next.t('admin.navigation.options.tags'),
          color: "primary",
          prefix: "tag"
        });

        const products = getOptions(data?.products?.nodes || [], {
          key: i18next.t('admin.navigation.options.products'),
          color: "secondary",
          prefix: "product"
        });

        const pages = getOptions(data?.pages?.nodes || [], {
          key: i18next.t('admin.navigation.options.pages'),
          color: "primary",
          prefix: "blog"
        });

        setAssets([...defaultUrls, ...tags, ...products, ...pages]);
      }
    }
  );

  const getAssets = async (shopId, filter = "") => {
    if (shopId) {
      await getUrls({
        variables: {
          filter,
          shopId
        }
      });
    }
  };

  return {
    assets,
    getAssets,
    isGetAssetsLoading: loading
  };
};

export default useGetUrls;
