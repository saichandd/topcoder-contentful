// import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
// import PT from 'prop-types';
import React from 'react';

export default class Testing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // query: null,
    };

    setTimeout(() => this.setState({
      assetQueries: true,
    }), 3000);

    setTimeout(() => this.setState({
      assetQueries: false,
    }), 6000);

    setTimeout(() => this.setState({
      entryQueries: {
        content_type: 'viewport',
      },
    }), 9000);
  }

  render() {
    const {
      assetQueries,
      entryQueries,
    } = this.state;
    return (
      <div>
        <ContentfulLoader
          assetQueries={assetQueries}
          entryQueries={entryQueries}
          render={data => (
            <pre>
              {JSON.stringify(data, null, '  ')}
            </pre>
          )}
          renderPlaceholder={() => 'LOADING'}
        />
      </div>
    );
  }
}
