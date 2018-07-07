import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Home from 'components/tc-communities/communities/veterans/Home';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';
import veteransActions from 'actions/page/communities/veterans/home';
import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';

/* Holds cache time [ms] for the data demanded by this container. */
const MAXAGE = 30 * 60 * 1000;

class HomeContainer extends React.Component {
  componentDidMount() {
    const {
      getAllActiveChallenges,
      lastUpdateOfActiveChallenges,
      loadingActiveChallenges,
      tokenV3,
    } = this.props;
    if (Date.now() - lastUpdateOfActiveChallenges > MAXAGE
    && !loadingActiveChallenges) getAllActiveChallenges(tokenV3);
  }

  render() {
    const {
      baseUrl,
      challenges,
      isWhatIsTopcoderVideoShown,
      loadingActiveChallenges,
      setChallengeListingFilter,
      showWhatIsTopcoderVideo,
    } = this.props;

    const activeChallenges = challenges.filter(x => x.status === 'ACTIVE')
      .sort((a, b) => moment(b.registrationStartDate).diff(a.registrationStartDate));

    return (
      <Home
        activeChallenges={activeChallenges}
        baseUrl={baseUrl}
        isWhatIsTopcoderVideoShown={isWhatIsTopcoderVideoShown}
        loadingActiveChallenges={loadingActiveChallenges}
        setChallengeListingFilter={setChallengeListingFilter}
        showWhatIsTopcoderVideo={showWhatIsTopcoderVideo}
      />
    );
  }
}

HomeContainer.defaultProps = {
  tokenV3: null,
};

HomeContainer.propTypes = {
  baseUrl: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  getAllActiveChallenges: PT.func.isRequired,
  isWhatIsTopcoderVideoShown: PT.bool.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingActiveChallenges: PT.bool.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showWhatIsTopcoderVideo: PT.func.isRequired,
  tokenV3: PT.string,
};

function mapStateToProps(state) {
  return {
    challenges: state.challengeListing.challenges,
    isWhatIsTopcoderVideoShown:
      state.page.communities.veterans.home.isWhatIsTopcoderVideoShown,
    lastUpdateOfActiveChallenges:
      state.challengeListing.lastUpdateOfActiveChallenges,
    loadingActiveChallenges:
      Boolean(state.challengeListing.loadingActiveChallengesUUID),
    tokenV3: state.auth.tokenV3,
  };
}

function mapDispatchToActions(dispatch) {
  const cla = challengeListingActions.challengeListing;
  const clsa = challengeListingSidebarActions.challengeListing.sidebar;
  const va = veteransActions.page.communities.veterans.home;
  return {
    getAllActiveChallenges: (tokenV3) => {
      const uuid = shortId();
      dispatch(cla.getAllActiveChallengesInit(uuid));
      dispatch(cla.getAllActiveChallengesDone(uuid, tokenV3));
    },
    setChallengeListingFilter: (filter) => {
      dispatch(cla.setFilter(filter));
      dispatch(clsa.selectBucket(BUCKETS.ALL));
    },
    showWhatIsTopcoderVideo: show => dispatch(va.showWhatIsTopcoderVideo(show)),
  };
}

export default connect(mapStateToProps, mapDispatchToActions)(HomeContainer);
