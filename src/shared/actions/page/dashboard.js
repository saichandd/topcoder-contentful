/**
 * Actions for dashboard page UI.
 */

import { createActions } from 'redux-actions';

export const TABS = {
  COMMUNITIES: 'COMMUNITIES',
  MY_ACTIVE_CHALLENGES: 'MY_ACTIVE_CHALLENGES',
  SRMS: 'SRMS',
};

/**
 * Payload creator for the action that shows/hides the dash announcement.
 * @param {Boolean} show
 * @return {Boolean}
 */
function showAnnouncement(show) {
  return show;
}

/**
 * Payload creator for the action that shows/hides challenges filter by
 * community.
 * @param {Boolean} show
 * @return {Boolean} Payload.
 */
function showChallengesFilter(show) {
  return show;
}

/**
 * Payload creator for the action that shows/hides member earnings in
 * the dashboard.
 * @param {Boolean} show
 * @return {Boolean} Payload.
 */
function showEarnings(show) {
  return show;
}

/**
 * Payload creator for the action that shows/hides XL badge version in the
 * dashboard.
 * @param {String} name Optional. Name of the achievement for which the XL
 *  badge should be shown. The user, anyway, should have this achievement to
 *  see this badge. If undefined, then no badges will be expanded.
 * @return {String}
 */
function showXlBadge(name) {
  return name || '';
}

/**
 * Payload creator for the action that switches challenge filter.
 * @param {String} communityId
 * @return {String}
 */
function switchChallengeFilter(communityId) {
  return communityId;
}

/**
 * Payload creator for the action that switches dash tabs.
 * @param {String} tab A value from TABS hash.
 * @return {String} Payload.
 */
function switchTab(tab) {
  return tab;
}

export default createActions({
  PAGE: {
    DASHBOARD: {
      SHOW_ANNOUNCEMENT: showAnnouncement,
      SHOW_CHALLENGE_FILTER: showChallengesFilter,
      SHOW_EARNINGS: showEarnings,
      SHOW_XL_BADGE: showXlBadge,
      SWITCH_CHALLENGE_FILTER: switchChallengeFilter,
      SWITCH_TAB: switchTab,
    },
  },
});
