/**
 * @summary formatted for match the provided user query result
 * @param {Object} data data query result
 * @param {Object} props props to format each option
 * @returns {Array} An array of options formatted for use with react-select
 */
export function getOptions(data, props) {
  const { key, color, prefix } = props;
  let options = [];

  if (data && Array.isArray(data) && data.length > 0) {
    options = data.map((node) => ({
      label: node?.name || node?.title || "Error fetching data",
      value: `/${prefix}/${node?.slug}` || "/",
      type: key,
      color
    }));
  }

  return options;
}

/**
 * @summary get the title of each item
 * @param {Object} navigationItem navigationItem object
 * @param {Object} language language
 * @returns {Array} title of each item
 */
export function getNavigationItemTitle(navigationItem, language = "en") {
  const data = navigationItem.draftData.content.find((item) => item.language === language) || { value: "" };
  return data;
}

/**
 * @summary formatted for match the provided user query result
 * @param {Object} navigationTree navigationTree object to transform
 * @param {Object} navigationShopSettings Shop navigation settings
 * @returns {Array} An array of options formatted for use with react-tree
 */
export function navigationTreeToSortable(navigationTree, navigationShopSettings) {
  const {
    shouldNavigationTreeItemsBeAdminOnly,
    shouldNavigationTreeItemsBePubliclyVisible,
    shouldNavigationTreeItemsBeSecondaryNavOnly
  } = navigationShopSettings;

  return navigationTree.map((node) => {
    const newNode = {};
    newNode.id = node.navigationItem._id;
    newNode.isVisible =
      typeof node.isVisible === "boolean" ? node.isVisible : shouldNavigationTreeItemsBePubliclyVisible;
    newNode.isPrivate = typeof node.isPrivate === "boolean" ? node.isPrivate : shouldNavigationTreeItemsBeAdminOnly;
    newNode.isSecondary =
      typeof node.isSecondary === "boolean" ? node.isSecondary : shouldNavigationTreeItemsBeSecondaryNavOnly;
    newNode.title = getNavigationItemTitle(node.navigationItem).value;
    newNode.expanded = typeof node.navigationItem.expanded === "boolean" ? node.navigationItem.expanded : false;
    newNode.subtitle = node.navigationItem.draftData.url;
    newNode.navigationItem = { ...node.navigationItem };

    if (Array.isArray(node.items) && node.items.length) {
      newNode.children = navigationTreeToSortable(node.items, navigationShopSettings);
    }

    return newNode;
  });
}
