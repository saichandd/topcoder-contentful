import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { config } from 'topcoder-react-utils';

import Card from './Card';

import './style.scss';

export default function CommunityBlog({
  isLoading,
  posts,
}) {
  return (
    <div styleName="container">
      <h1 styleName="title">
        From the Community Blog
      </h1>
      <div styleName="content">
        {
          isLoading ? <LoadingIndicator /> : (
            posts.slice(0, 3).map(post => (
              <Card
                key={post.link}
                link={post.link}
                text={post['content:encoded']}
                title={post.title}
              />
            ))
          )
        }
      </div>
      <div styleName="linksContainer">
        <a
          href={config.URL.BLOG}
          rel="noopener noreferrer"
          styleName="link"
          target="_blank"
        >
Visit the Blog
        </a>
      </div>
    </div>
  );
}

CommunityBlog.propTypes = {
  isLoading: PT.bool.isRequired,
  posts: PT.arrayOf(PT.shape({
    'content:encoded': PT.string.isRequired,
    description: PT.string.isRequired,
    link: PT.string.isRequired,
    title: PT.string.isRequired,
  })).isRequired,
};
