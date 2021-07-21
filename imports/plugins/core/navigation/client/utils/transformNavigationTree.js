/**
 * @name transformNavigationTree
 * @summary Recursively returns the _ids of all items in a navigation tree
 * @param {Array} items Navigation tree's items
 * @returns {Array} Array of _ids
 */
export default function transformNavigationTree(items) {
  const transformedTree = items.map((item) => {
    const { children } = item;
    // this ovid to mutate the original object
    const itemObject = { ...item };
    delete itemObject.expanded;
    if (children) {
      itemObject.children = [...transformNavigationTree(children)];
    }
    return itemObject;
  });

  return transformedTree;
}
