/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import SimpleSchema from "simpl-schema";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import muiCheckboxOptions from "reacto-form/esm/muiCheckboxOptions";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Chip, Divider, IconButton } from "@material-ui/core";

import CloseIcon from "mdi-material-ui/Close";
import ErrorsBlock from "@reactioncommerce/components/ErrorsBlock/v1";
import Field from "@reactioncommerce/components/Field/v1";
import TextField from "@reactioncommerce/catalyst/TextField";
import { i18next } from "/client/api";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import { changeNodeAtPath } from "react-sortable-tree";
import { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import getNavigationTreeItemIds from "../utils/getNavigationTreeItemIds";
import { useUI } from "../context/UIContext";
import useGetUrls from "../hooks/useGetUrls";

const useStyles = makeStyles((theme) => ({
  closeButtonContainer: {
    textAlign: "right"
  },
  formActions: {
    textAlign: "right",
    marginTop: theme.spacing(2)
  },
  formActionButton: {
    marginLeft: theme.spacing()
  },
  option: {
    position: "absolute",
    right: 0,
    fontSize: theme.spacing(1.5),
    marginRight: theme.spacing(1)
  },
  textField: {
    marginTop: theme.spacing(3)
  },
  configItem: {
    marginTop: theme.spacing(3)
  }
}));

const navigationItemFormSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    min: 2,
    max: 50
  },
  url: {
    type: String,
    min: 1,
    max: 100
  },
  classNames: {
    type: String,
    optional: true
  },
  isUrlRelative: {
    type: Boolean,
    optional: true
  },
  shouldOpenInNewWindow: {
    type: Boolean,
    optional: true
  },
  isVisible: {
    type: Boolean,
    optional: true
  },
  isPrivate: {
    type: Boolean,
    optional: true
  },
  isSecondary: {
    type: Boolean,
    optional: true
  },
  isInNavigationTree: {
    type: Boolean,
    optional: true
  }
});

const navigationItemValidator = navigationItemFormSchema.getFormValidator();

const NavigationItemForm = (props) => {
  const classes = useStyles();
  const { getAssets, isGetAssetsLoading, assets } = useGetUrls();
  const { onSetHandleNavigationInfo, sortableNavigationTree, isUnSavedChanges } = useUI();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [urlAsset, setUrlAsset] = useState({});
  const [defaultOption, setDefaultOption] = useState(null);

  const {
    createNavigationItem,
    mode,
    navigationItem,
    onCloseForm,
    updateNavigationItem,
    deleteNavigationItem,
    shopId,
    sortableTreeNode,
    onSetSortableNavigationTree
  } = props;

  useEffect(() => {
    if (mode === "edit") {
      setValues(navigationItem);
      setUrlAsset(navigationItem.url);
      setDefaultOption({ value: navigationItem.url, label: navigationItem.url });
    } else {
      // TODO: translate this
      setDefaultOption({ value: "/", label: i18next.t('navigationItem.selOrCreateUrl') });
    }
  }, [navigationItem, mode]);

  const { getFirstErrorMessage, getInputProps, hasErrors, getErrors, submitForm } = useReactoForm({
    onChanging: (formData) => {
      setValues({
        ...formData,
        url: urlAsset
      });
    },
    async onSubmit(formData) {
      setLoading(true);
      const formDataCleaned = navigationItemFormSchema.clean(formData);
      const { name, url, isUrlRelative, shouldOpenInNewWindow, classNames } = formDataCleaned;

      const navigationItemUpdate = {
        draftData: {
          content: {
            value: name,
            language: "en"
          },
          url,
          isUrlRelative,
          shouldOpenInNewWindow,
          classNames
        },
        shopId
      };

      if (mode === "create") {
        await createNavigationItem(navigationItemUpdate);
      } else {
        await updateNavigationItem({
          id: navigationItem._id,
          navigationItem: navigationItemUpdate,
          shopId
        });
      }

      if (navigationItem && navigationItem.isInNavigationTree) {
        const { isVisible, isPrivate, isSecondary } = formDataCleaned;

        const newSortableNavigationTree = changeNodeAtPath({
          ...sortableTreeNode,
          newNode: {
            ...sortableTreeNode.node,
            isVisible,
            isPrivate,
            isSecondary
          }
        });

        onSetSortableNavigationTree(newSortableNavigationTree);
      }

      setLoading(false);
      return onCloseForm();
    },
    validator: navigationItemValidator,
    value: values
    // logErrorsOnSubmit: true
  });

  const handleClickDelete = () => {
    const navigationTreeItemIds = getNavigationTreeItemIds(sortableNavigationTree);
    const isInTree = navigationTreeItemIds.includes(navigationItem._id);

    // Don't allow deleting items if they are in the tree
    if (!isInTree && !isUnSavedChanges) {
      deleteNavigationItem({
        id: navigationItem._id,
        shopId
      });
    } else if (isUnSavedChanges) {
      // TODO: translate this
      onSetHandleNavigationInfo({
        error: true,
        message: i18next.t('navigationItem.messages.firtSaveChanges'),
        typeMessage: "error"
      });
    } else {
      // TODO: translate this
      onSetHandleNavigationInfo({
        error: true,
        message: i18next.t('navigationItem.messages.notDeleteIsUsed'),
        typeMessage: "error"
      });
    }

    return onCloseForm();
  };

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === "create-option" || actionMeta.action === "select-option") {
      setUrlAsset(newValue.value);
      setValues({
        ...values,
        isUrlRelative: true,
        url: newValue.value
      });
    }
  };

  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta === "input-change") {
      getAssets(shopId, inputValue);
    }
  };

  const handleFocus = () => {
    getAssets(shopId);
  };

  const Option = (options) => {
    const {
      data: { label, type, color }
    } = options;

    return (
      <div>
        <components.Option {...options}>
          {label}
          <Chip size="small" label={type || "custom"} color={color || "default"} className={classes.option} />
        </components.Option>
      </div>
    );
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={8}>
          {mode === "create" && <h4>{i18next.t("admin.navigation.addItem")}</h4>}
          {mode !== "create" && <h4>{i18next.t("admin.navigation.editItem")}</h4>}
        </Grid>
        <Grid item xs={4} className={classes.closeButtonContainer}>
          <IconButton onClick={onCloseForm}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            className={classes.textField}
            name="name"
            error={hasErrors(["name"])}
            helperText={getFirstErrorMessage(["name"])}
            label={i18next.t("navigationItem.displayName")}
            {...getInputProps("name", muiOptions)}
          />

          <TextField
            className={classes.textField}
            name="classNames"
            error={hasErrors(["classNames"])}
            helperText={getFirstErrorMessage(["classNames"])}
            label={i18next.t("navigationItem.classNames")}
            {...getInputProps("classNames", muiOptions)}
          />

          <Field label={i18next.t("navigationItem.url")}>
            {defaultOption && (
              <CreatableSelect
                isClearable
                isSearchable
                defaultValue={defaultOption}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onFocus={handleFocus}
                options={assets}
                isLoading={isGetAssetsLoading}
                components={{ Option }}
                styles={{
                  option: (base) => ({
                    ...base,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center"
                  })
                }}
              />
            )}
            <ErrorsBlock names={["url"]} errors={getErrors(["url"])} />
          </Field>

          <FormGroup row>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              name="isUrlRelative"
              label={i18next.t("navigationItem.isUrlRelative")}
              {...getInputProps("isUrlRelative", muiCheckboxOptions)}
            />
            <FormControlLabel
              control={<Checkbox color="primary" />}
              name="shouldOpenInNewWindow"
              label={i18next.t("navigationItem.shouldOpenInNewWindow")}
              {...getInputProps("shouldOpenInNewWindow", muiCheckboxOptions)}
            />
          </FormGroup>

          {navigationItem && navigationItem.isInNavigationTree && (
            <Fragment>
              <Divider />

              <FormControl className={classes.configItem} component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    name="isVisible"
                    label={i18next.t("navigationItem.isVisible")}
                    {...getInputProps("isVisible", muiCheckboxOptions)}
                  />
                  <ErrorsBlock names={["isVisible"]} />
                </FormGroup>
                <FormLabel component="legend">
                  <Typography variant="caption" display="block" gutterBottom>
                    {i18next.t("navigationItem.isVisibleHelpText")}
                  </Typography>
                </FormLabel>
              </FormControl>

              <Divider />

              <FormControl className={classes.configItem} component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    name="isPrivate"
                    label={i18next.t("navigationItem.isPrivate")}
                    {...getInputProps("isPrivate", muiCheckboxOptions)}
                  />
                  <ErrorsBlock names={["isPrivate"]} />
                </FormGroup>
                <FormLabel component="legend">
                  <Typography variant="caption" display="block" gutterBottom>
                    {i18next.t("navigationItem.isPrivateHelpText")}
                  </Typography>
                </FormLabel>
              </FormControl>

              <Divider />

              <FormControl className={classes.configItem} component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    name="isSecondary"
                    label={i18next.t("navigationItem.isSecondary")}
                    {...getInputProps("isSecondary", muiCheckboxOptions)}
                  />
                  <ErrorsBlock names={["isSecondary"]} />
                </FormGroup>
                <FormLabel component="legend">
                  <Typography variant="caption" display="block" gutterBottom>
                    {i18next.t("navigationItem.isSecondaryHelpText")}
                  </Typography>
                </FormLabel>
              </FormControl>

              <Divider />
            </Fragment>
          )}
        </Grid>
      </Grid>
      <Grid>
        <Grid item xs={12} className={classes.formActions}>
          {mode !== "create" && (
            <ConfirmDialog
              title={i18next.t("admin.navigation.deleteTitle")}
              message={i18next.t("admin.navigation.deleteMessage")}
              onConfirm={handleClickDelete}
            >
              {({ openDialog }) => (
                <Button color="primary" onClick={openDialog}>
                  {i18next.t("admin.navigation.delete")}
                </Button>
              )}
            </ConfirmDialog>
          )}
          <Button className={classes.formActionButton} color="primary" onClick={onCloseForm} variant="outlined">
            {i18next.t("app.cancel")}
          </Button>
          <Button
            className={classes.formActionButton}
            color="primary"
            type="submit"
            onClick={submitForm}
            disabled={loading}
            variant="contained"
          >
            {i18next.t("app.saveChanges")}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

NavigationItemForm.propTypes = {
  createNavigationItem: PropTypes.func,
  deleteNavigationItem: PropTypes.func,
  mode: PropTypes.oneOf(["create", "edit"]),
  navigationItem: PropTypes.object,
  onCloseForm: PropTypes.func,
  onSetSortableNavigationTree: PropTypes.func,
  shopId: PropTypes.string,
  sortableTreeNode: PropTypes.object,
  updateNavigationItem: PropTypes.func
};

export default NavigationItemForm;
