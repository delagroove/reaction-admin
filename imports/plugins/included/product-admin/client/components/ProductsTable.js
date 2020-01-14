import React, { useMemo, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import decodeOpaqueId from "/imports/utils/decodeOpaqueId.js";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { Card, CardHeader, CardContent, Checkbox, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import productsQuery from "../graphql/queries/products";
import { i18next } from "/client/api";
import PublishedStatusCell from "./DataTable/PublishedStatusCell";
import StatusIconCell from "./DataTable/StatusIconCell";

/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */

const useStyles = makeStyles({
  card: {
    overflow: "visible"
  }
});

/**
 * @name ProductsTable
 * @returns {React.Component} A React component
 */
function ProductsTable() {
  const apolloClient = useApolloClient();
  const [shopId] = useCurrentShopId();
  const history = useHistory();

  // Create and memoize the column data
  const columns = useMemo(() => [
    {
      id: "selection",
      headerProps: {},
      cellProps: {
        isClickDisabled: true,
        padding: "checkbox"
      },
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      ),
      Cell: ({ row }) => (
        <Checkbox
          {...row.getToggleRowSelectedProps()}
          title={`Toggle row selection for ${row.values.fullName}`}
        />
      )
    },
    {
      Header: "Title",
      accessor: "title"
    },
    {
      Header: "Product ID",
      accessor: (row) => {
        const { id: productId } = decodeOpaqueId(row._id);
        return productId;
      }
    },
    {
      Header: "Price",
      accessor: "price.range"
    },
    {
      Header: "Published",
      Cell: ({ row }) => <PublishedStatusCell row={row} />
    },
    {
      Header: "Status",
      Cell: ({ row }) => <StatusIconCell row={row} />,
      id: "isVisible"
    }
  ], []);

  const onFetchData = useCallback(async ({ globalFilter, pageIndex, pageSize }) => {
    if (!shopId) {
      return {
        data: [],
        pageCount: 0
      };
    }
    // TODO: Add loading and error handling
    const { data } = await apolloClient.query({
      query: productsQuery,
      variables: {
        shopIds: [shopId],
        query: globalFilter,
        first: pageSize,
        offset: pageIndex * pageSize
      }
    });
    console.log("data", data);

    // Return the fetched data as an array of objects and the calculated page count
    return {
      data: data.products.nodes,
      pageCount: Math.ceil(data.products.totalCount / pageSize)
    };
  }, [apolloClient, shopId]);

  // Row click callback
  const onRowClick = useCallback(async ({ row }) => {
    let variantId = "";
    const { id: productId } = decodeOpaqueId(row.original._id);
    if (row.original.variants.length) {
      ({ id: variantId } = decodeOpaqueId(row.original.variants[0]._id));
    }

    history.push(`/products/${productId}/${variantId}`);
  }, [history]);

  const onSelectRows = useCallback(async ({ selectedRows }) => {
    console.log("Selected rows", selectedRows);
  }, []);

  const dataTableProps = useDataTable({
    columns,
    getRowID: (row) => row._id,
    onFetchData,
    onRowClick,
    onSelectRows
  });

  const [{ selectedRows }] = dataTableProps.state;

  // Create options for the built-in ActionMenu in the DataTable
  const options = useMemo(() => [{
    label: "Filter by file",
    onClick: () => {
      console.log("Filter by file");
    }
  }, {
    label: "Publish",
    confirmTitle: `Publish ${selectedRows.length} products`,
    confirmMessage: `Are you sure you want to publish ${selectedRows.length} products to your storefront?`,
    isDisabled: selectedRows.length === 0,
    onClick: () => {
      console.log(`Published ${selectedRows.length} products`);
    }
  }, {
    label: "Make Visible",
    confirmTitle: `Make ${selectedRows.length} products visible`,
    confirmMessage: `Are you sure you want to make ${selectedRows.length} products visible to customers?`,
    isDisabled: selectedRows.length === 0,
    onClick: () => {
      console.log(`Made ${selectedRows.length} products visible`);
    }
  }, {
    label: "Make Hidden",
    confirmTitle: `Make ${selectedRows.length} products hidden`,
    confirmMessage: `Are you sure you want to make ${selectedRows.length} products hidden from customers?`,
    isDisabled: selectedRows.length === 0,
    onClick: () => {
      console.log(`Made ${selectedRows.length} products hidden`);
    }
  }, {
    label: "Duplicate",
    confirmTitle: `Duplicate ${selectedRows.length} products`,
    confirmMessage: `Are you sure you want to duplicate ${selectedRows.length} products?`,
    isDisabled: selectedRows.length === 0,
    onClick: () => {
      console.log(`Duplicated ${selectedRows.length} products`);
    }
  }, {
    label: "Archive",
    confirmTitle: `Archive ${selectedRows.length} products`,
    confirmMessage: `Are you sure you want to archive ${selectedRows.length} products? This will hide them from both admins and customers.`,
    isDisabled: selectedRows.length === 0,
    onClick: () => {
      console.log(`Archived ${selectedRows.length} products`);
    }
  }], [selectedRows]);

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.products")} />
      <CardContent>
        <DataTable
          {...dataTableProps}
          actionMenuProps={{ options }}
          placeholder={"Filter products"}
          isFilterable
        />
      </CardContent>
    </Card>
  );
}

export default ProductsTable;
