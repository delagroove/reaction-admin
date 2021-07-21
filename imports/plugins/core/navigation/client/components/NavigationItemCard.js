import React from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DragIcon from "mdi-material-ui/Drag";
import FileOutlineIcon from "mdi-material-ui/FileOutline";
import PencilIcon from "mdi-material-ui/Pencil";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 60,
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing()
  },
  iconButton: {
    "padding": 6,
    "color": theme.palette.colors.black30,
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  rowContent: {
    flex: 1
  },
  subtitle: {
    display: "flex",
    alignItems: "center"
  },
  subtitleIcon: {
    marginRight: 4
  }
}));

const navigationItemSource = {
  beginDrag(props) {
    const { node: { navigationItem } } = props.row;
    const { _id, draftData } = navigationItem;
    const { value } = draftData.content.find((content) => content.language === "en");

    return {
      node: {
        id: _id,
        title: value
      }
    };
  }
};

/**
 * Specifies which props to inject into your component.
 * @param {Object} connect DnD connect
 * @param {Object} monitor DnD monitor
 * @returns {Object} DnD connection source
 */
const sourceCollect = (connect, monitor) => ({
  connectDragPreview: connect.dragPreview(),
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const NavigationItemCard = (props) => {
  const classes = useStyles();
  const {
    connectDragPreview,
    connectDragSource,
    isDragging,
    row: { node: { navigationItem } },
    onClickUpdateNavigationItem
  } = props;

  const { draftData } = navigationItem;
  const { value } = draftData.content.find((content) => content.language === "en");
  const title = value;
  const { url: subtitle } = draftData;

  const handleClickEdit = () => {
    onClickUpdateNavigationItem(navigationItem);
  };

  const dragHandle = (
    <div>
      <IconButton className={classes.iconButton}>
        <DragIcon />
      </IconButton>
    </div>
  );

  const toRender = (
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className={classes.card}>
        {connectDragSource(dragHandle, { dropEffect: "copy" })}
        <div className={classes.rowContent}>
          <Typography>{title}</Typography>
          <Typography className={classes.subtitle} variant="caption">
            <FileOutlineIcon className={classes.subtitleIcon} fontSize="inherit" /> {subtitle}
          </Typography>
        </div>
        <IconButton onClick={handleClickEdit}>
          <PencilIcon />
        </IconButton>
      </Card>
    </div>
  );

  return connectDragPreview(<div>{toRender}</div>);
};

NavigationItemCard.propTypes = {
  connectDragPreview: PropTypes.func,
  connectDragSource: PropTypes.func,
  isDragging: PropTypes.bool,
  onClickUpdateNavigationItem: PropTypes.func,
  row: PropTypes.object
};

export default DragSource("CARD", navigationItemSource, sourceCollect)(NavigationItemCard);
