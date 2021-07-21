/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, { createContext, useReducer, useMemo, useContext, useEffect } from "react";
import _ from "lodash";
import useNavigationShopSettings from "../hooks/useNavigationShopSettings";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import transformNavigationTree from "../utils/transformNavigationTree";
import { navigationTreeToSortable } from "../utils/helpers";

const ACTIONS = {
  SET_NAVIGATION_ITEMS: "SET_NAVIGATION_ITEMS",
  SET_NAVIGATION_SORTABLE_TREE: "SET_NAVIGATION_SORTABLE_TREE",
  SET_INITIAL_NAVIGATION_TREE: "SET_INITIAL_NAVIGATION_TREE",
  DISCARD_CHANGES: "DISCARD_CHANGES",
  ADD_NAVIGATION_ITEM: "ADD_NAVIGATION_ITEM",
  UPDATE_NAVIGATION_ITEM: "UPDATE_NAVIGATION_ITEM",
  DELETE_NAVIGATION_ITEM: "DELETE_NAVIGATION_ITEM",
  SET_NAVIGATION_INFO: "SET_NAVIGATION_INFO",
  SET_SHOP_SETTINGS: "SET_SHOP_SETTINGS"
};

/* typeMessage possible values */
// error
// warning
// info
// success
/* --------------------------- */

const initialState = {
  sortableNavigationTree: [],
  initialNavigationTree: [],
  navigationItems: [],
  navigationShopSettings: {},
  error: false,
  message: "",
  typeMessage: "error",
  isUnSavedChanges: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_NAVIGATION_SORTABLE_TREE: {
      // we need to know if the tree has changed. But it doesn't matter if it's expanded
      const draftNavigationTree = transformNavigationTree(action.payload);
      const initialNavigationTree = transformNavigationTree(state.initialNavigationTree);
      const isUnSavedChanges = !_.isEqual(draftNavigationTree, initialNavigationTree);

      return {
        ...state,
        error: isUnSavedChanges,
        message: "menu updated",
        typeMessage: "warning",
        isUnSavedChanges,
        sortableNavigationTree: action.payload
      };
    }

    case ACTIONS.SET_INITIAL_NAVIGATION_TREE: {
      const sortableNavigationTree = navigationTreeToSortable(action.payload, state.navigationShopSettings);

      return {
        ...state,
        initialNavigationTree: sortableNavigationTree,
        sortableNavigationTree,
        error: false,
        message: "",
        isUnSavedChanges: false
      };
    }

    case ACTIONS.SET_NAVIGATION_ITEMS: {
      return {
        ...state,
        navigationItems: action.payload
      };
    }

    case ACTIONS.SET_SHOP_SETTINGS: {
      return {
        ...state,
        navigationShopSettings: action.payload
      };
    }

    case ACTIONS.DISCARD_CHANGES: {
      return {
        ...state,
        sortableNavigationTree: state.initialNavigationTree,
        error: false,
        message: "",
        typeMessage: "error",
        isUnSavedChanges: false
      };
    }

    case ACTIONS.ADD_NAVIGATION_ITEM: {
      return {
        ...state,
        navigationItems: [action.payload, ...state.navigationItems]
      };
    }

    case ACTIONS.UPDATE_NAVIGATION_ITEM: {
      const { navigationItems, sortableNavigationTree } = state;
      const indexItem = _.findIndex(navigationItems, { _id: action.payload._id });
      navigationItems[indexItem] = action.payload;

      const indexItemTree = _.findIndex(sortableNavigationTree, { id: action.payload._id });

      // try to update the navigationTree only if the navigationItem is there
      if (sortableNavigationTree?.[indexItemTree]) {
        sortableNavigationTree[indexItemTree].navigationItem = action.payload;
        sortableNavigationTree[indexItemTree].title = action.payload.draftData.content?.[0]?.value;
        sortableNavigationTree[indexItemTree].subtitle = action.payload.draftData.url;
      }

      return {
        ...state,
        sortableNavigationTree,
        navigationItems
      };
    }

    case ACTIONS.DELETE_NAVIGATION_ITEM: {
      const { navigationItems } = state;
      const navigationItem = _.find(navigationItems, action.payload);
      _.remove(navigationItems, (element) => _.isEqual(element, navigationItem));

      return {
        ...state,
        error: false,
        message: "",
        navigationItems
      };
    }

    case ACTIONS.SET_NAVIGATION_INFO: {
      return {
        ...state,
        error: action.payload.error,
        message: action.payload.message,
        typeMessage: action.payload.typeMessage
      };
    }

    default:
      return state;
  }
};

export const UIContext = createContext();

export const UIProvider = (props) => {
  const [shopId] = useCurrentShopId();
  const { navigationShopSettings } = useNavigationShopSettings(shopId);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_SHOP_SETTINGS,
      payload: navigationShopSettings
    });
  }, [navigationShopSettings]);

  const handleDiscardChanges = () => dispatch({ type: ACTIONS.DISCARD_CHANGES });

  const handleSetNavigationItems = (navigationItems) =>
    dispatch({
      type: ACTIONS.SET_NAVIGATION_ITEMS,
      payload: navigationItems
    });

  const handleAddNavigationItem = (navigationItem) =>
    dispatch({
      type: ACTIONS.ADD_NAVIGATION_ITEM,
      payload: navigationItem
    });

  const handleSetNavigationTree = (navigationTree) =>
    dispatch({
      type: ACTIONS.SET_INITIAL_NAVIGATION_TREE,
      payload: navigationTree
    });

  const handleSetSortableNavigationTree = (sortableNavigationTree) =>
    dispatch({
      type: ACTIONS.SET_NAVIGATION_SORTABLE_TREE,
      payload: sortableNavigationTree
    });

  const handleUpdateNavigationItem = (navigationItem) =>
    dispatch({
      type: ACTIONS.UPDATE_NAVIGATION_ITEM,
      payload: navigationItem
    });

  const handleDeleteNavigationItem = (navigationItem) =>
    dispatch({
      type: ACTIONS.DELETE_NAVIGATION_ITEM,
      payload: navigationItem
    });

  const handleNavigationInfo = ({ error, message, typeMessage }) =>
    dispatch({
      type: ACTIONS.SET_NAVIGATION_INFO,
      payload: {
        error,
        message,
        typeMessage
      }
    });

  const handleUpdateNavigationTree = (navigationTree) =>
    dispatch({
      type: ACTIONS.SET_INITIAL_NAVIGATION_TREE,
      payload: navigationTree.draftItems
    });

  const value = useMemo(
    () => ({
      ...state,
      onSetNavigationItems: handleSetNavigationItems,
      onAddNavigationItem: handleAddNavigationItem,
      onDeleteNavigationItem: handleDeleteNavigationItem,
      onUpdateNavigationItem: handleUpdateNavigationItem,
      onUpdateNavigationTree: handleUpdateNavigationTree,
      onSetSortableNavigationTree: handleSetSortableNavigationTree,
      onDiscardNavigationTreeChanges: handleDiscardChanges,
      onSetNavigationTree: handleSetNavigationTree,
      onSetHandleNavigationInfo: handleNavigationInfo
    }),
    [state]
  );

  return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    console.log(context);
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

export const ManagedUIContext = ({ children }) => <UIProvider>{children}</UIProvider>;
