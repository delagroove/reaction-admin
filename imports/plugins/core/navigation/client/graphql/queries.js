import gql from "graphql-tag";
import { navigationTreeWith10LevelsFragment, navigationItemFragment } from "./fragments";

export const defaultNavigationTreeQuery = gql`
  query defaultNavigationTreeQuery($id: ID!, $language: String!, $shopId: ID!) {
    navigationTreeById(id: $id, language: $language, shopId: $shopId) {
      ...NavigationTreeWith10Levels
    }
  }

  ${navigationTreeWith10LevelsFragment}
`;

export const shopSettingsQuery = gql`
  query shopSettingsQuery($shopId: ID!) {
    shopSettings(shopId: $shopId) {
      shouldNavigationTreeItemsBeAdminOnly
      shouldNavigationTreeItemsBePubliclyVisible
      shouldNavigationTreeItemsBeSecondaryNavOnly
    }
  }
`;

export const defaultNavigationTreeIdQuery = gql`
  query defaultNavigationTreeIdQuery($id: ID!) {
    shop(id: $id) {
      _id
      defaultNavigationTreeId
    }
  }

`;

export const navigationItemsQuery = gql`
  query navigationItemsQuery($shopId: ID!, $first: ConnectionLimitInt, $after: ConnectionCursor) {
    navigationItemsByShopId(shopId: $shopId, first: $first, after: $after) {
      totalCount
      nodes {
        ...NavigationItem
      }
    }
  }
  ${navigationItemFragment}
`;


export const AssestNavigation = gql`
  query AssestNavigation($shopId: ID!, $filter: String) {
    tags(shopId: $shopId, filter: $filter, first: 5) {
      nodes {
        _id
        name
        slug
      }
    }

    products(shopIds: [$shopId], query: $filter, first: 5, isVisible: true) {
      nodes {
        _id
        title
        slug
      }
    }

    pages(shopId: $shopId, filter: $filter, first: 5) {
      nodes {
        _id
        name
        slug
      }
    }
  }
`;
