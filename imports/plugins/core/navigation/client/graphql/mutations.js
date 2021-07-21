import gql from "graphql-tag";
import { navigationItemFragment, navigationTreeWith10LevelsFragment } from "./fragments.js";

export const updateNavigationItemMutation = gql`
  mutation updateNavigationItemMutation($input: UpdateNavigationItemInput!) {
    updateNavigationItem(input: $input) {
      navigationItem {
        ...NavigationItem
      }
    }
  }
  ${navigationItemFragment}
`;

export const updateNavigationTreeMutation = gql`
  mutation updateNavigationTreeMutation($input: UpdateNavigationTreeInput!) {
    updateNavigationTree(input: $input) {
      navigationTree {
        ...NavigationTreeWith10Levels
      }
    }
  }
  ${navigationTreeWith10LevelsFragment}
`;

export const deleteNavigationItemMutation = gql`
  mutation deleteNavigationItemMutation($input: DeleteNavigationItemInput!) {
    deleteNavigationItem(input: $input) {
      navigationItem {
        ...NavigationItem
      }
    }
  }
  ${navigationItemFragment}
`;

export const publishNavigationChangesMutation = gql`
  mutation publishNavigationChangesMutation($input: PublishNavigationChangesInput!) {
    publishNavigationChanges(input: $input) {
      navigationTree {
        ...NavigationTreeWith10Levels
      }
    }
  }
  ${navigationTreeWith10LevelsFragment}
`;

export const createNavigationItemMutation = gql`
  mutation createNavigationItemMutation($input: CreateNavigationItemInput!) {
    createNavigationItem(input: $input) {
      navigationItem {
        ...NavigationItem
      }
    }
  }
  ${navigationItemFragment}
`;
