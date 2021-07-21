/**
 * @name getNavigationTreeItemIds
 * @summary Recursively returns the _ids of all items in a navigation tree
 * @param {Array} items Navigation tree's items
 * @returns {Array} Array of _ids
 */
export default function getNavigationTreeItemIds(items) {
  let itemIds = [];

  items.forEach((item) => {
    const { id, children } = item;
    itemIds.push(id);
    if (children) {
      const childItemIds = getNavigationTreeItemIds(children);
      itemIds = [...itemIds, ...childItemIds];
    }
  });

  return itemIds;
}
