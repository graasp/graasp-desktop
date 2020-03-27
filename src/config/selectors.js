// id selectors, mainly used for tests
// this file needs to use module.exports
// since mocha + node 12 don't support es6

const DRAWER_BUTTON_ID = 'drawerButton';

const SPACE_NEARBY_MENU_ITEM_ID = 'spacesNearbyMenuItem';
const SPACES_NEARBY_SPACE_GRID_ID = 'spacesNearbySpaceGrid';
const VISIT_MENU_ITEM_ID = 'visitMenuItem';
const VISIT_MAIN_ID = 'visit';
const LOAD_MENU_ITEM_ID = 'loadMenuItem';
const LOAD_MAIN_ID = 'load';
const SETTINGS_MENU_ITEM_ID = 'settingsMenuItem';
const SETTINGS_MAIN_ID = 'settings';
const VISIT_INPUT_ID = 'visitInput';
const VISIT_BUTTON_ID = 'visitButton';
const SPACE_TOOLBAR_ID = 'spaceToolbar';
const HOME_MENU_ITEM_ID = 'homeMenuItem';
const HOME_MAIN_ID = 'homeMain';
const DASHBOARD_MENU_ITEM_ID = 'dashboardMenuItem';
const DASHBOARD_MAIN_ID = 'dashboardMain';

const PHASE_MENU_LIST_ID = 'phaseMenuList';

const SPACE_START_PREVIEW_BUTTON = 'spaceStartPreviewButton';
const SPACE_DESCRIPTION_ID = 'spaceDescription';
const SPACE_SAVE_ICON_CLASS = 'spaceSaveIcon';
const SPACE_PREVIEW_ICON_CLASS = 'spacePreviewIcon';
const PHASE_DESCRIPTION_ID = 'phaseDescription';
const PHASE_MENU_ITEM = 'phase-menu-item';
const BANNER_WARNING_PREVIEW_ID = 'bannerWarningPreview';
const SPACE_EXPORT_BUTTON_CLASS = 'spaceExportButton';
const SPACE_DELETE_BUTTON_CLASS = 'spaceDeleteButton';
const SPACE_CLEAR_BUTTON_CLASS = 'spaceClearButton';
const SPACE_SYNC_BUTTON_CLASS = 'spaceSyncButton';

const buildSpaceCardId = id => `space-card-${id}`;
const SPACE_DESCRIPTION_EXPAND_BUTTON_CLASS = 'spaceDescriptionExpandButton';
const buildSpaceCardDescriptionId = id => `spaceCardDescription-${id}`;
const SPACE_CARD_LINK_CLASS = 'spaceCardLink';

const LOAD_BROWSE_BUTTON_ID = 'loadBrowseButton';
const LOAD_INPUT_ID = 'loadInput';
const LOAD_LOAD_BUTTON_ID = 'loadLoadButton';

module.exports = {
  SPACE_NEARBY_MENU_ITEM_ID,
  DRAWER_BUTTON_ID,
  SPACES_NEARBY_SPACE_GRID_ID,
  LOAD_MENU_ITEM_ID,
  LOAD_MAIN_ID,
  VISIT_BUTTON_ID,
  VISIT_INPUT_ID,
  VISIT_MAIN_ID,
  VISIT_MENU_ITEM_ID,
  SETTINGS_MENU_ITEM_ID,
  SETTINGS_MAIN_ID,
  HOME_MENU_ITEM_ID,
  SPACE_TOOLBAR_ID,
  PHASE_MENU_LIST_ID,
  SPACE_START_PREVIEW_BUTTON,
  SPACE_DESCRIPTION_ID,
  SPACE_SAVE_ICON_CLASS,
  SPACE_PREVIEW_ICON_CLASS,
  PHASE_DESCRIPTION_ID,
  PHASE_MENU_ITEM,
  BANNER_WARNING_PREVIEW_ID,
  SPACE_EXPORT_BUTTON_CLASS,
  SPACE_DELETE_BUTTON_CLASS,
  SPACE_CLEAR_BUTTON_CLASS,
  SPACE_SYNC_BUTTON_CLASS,
  HOME_MAIN_ID,
  buildSpaceCardId,
  SPACE_DESCRIPTION_EXPAND_BUTTON_CLASS,
  buildSpaceCardDescriptionId,
  SPACE_CARD_LINK_CLASS,
  LOAD_BROWSE_BUTTON_ID,
  LOAD_INPUT_ID,
  LOAD_LOAD_BUTTON_ID,
  DASHBOARD_MENU_ITEM_ID,
  DASHBOARD_MAIN_ID,
};
