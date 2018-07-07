import _ from 'lodash';
import mockReduxStore from 'redux-mock-store';
import PT from 'prop-types';
import React from 'react';
import ResourceCard from 'components/tc-communities/ResourceCard';
import TU from 'react-dom/test-utils';
import { Provider } from 'react-redux';

const store = mockReduxStore()();

class Wrapper extends React.Component {
  getChildContext() {
    return {
      router: {
        history: {
          createHref: _.noop,
          push: _.noop,
          replace: _.noop,
        },
      },
    };
  }

  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        <ResourceCard {...this.props} />
      </Provider>
    );
  }
}

Wrapper.childContextTypes = {
  router: PT.shape({
    history: PT.shape({}),
  }),
};

function Icon() {
  return <div />;
}

test('Render properly', () => {
  TU.renderIntoDocument((
    <Wrapper
      icon={Icon}
      title="Take the First Steps to Stand Out in the Community"
      text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris."
    />
  ));

  TU.renderIntoDocument((
    <Wrapper
      icon={Icon}
      title="Take the First Steps to Stand Out in the Community"
      text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris."
      link={{
        title: 'Learn about badges',
        url: '#',
      }}
      theme={{
        container: 'container',
        icon: 'image',
        title: 'title',
        text: 'text',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
});
