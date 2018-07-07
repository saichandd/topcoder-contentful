import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import YouTubeVideo from 'components/YouTubeVideo';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function Announcement({
  assets,
  announcement,
  hidePreviewMetaData,
  loading,
  preview,
  show,
  switchShow,
}) {
  if (loading) {
    return (
      <div styleName="loading">
        <LoadingIndicator />
      </div>
    );
  }

  if (!announcement || !announcement.fields) return null;

  const {
    backgroundImage,
    backgroundImagePosition,
    fontColor,
    maxTextWidth,
    publicTitle,
    readMore,
    readMoreLabel,
    endDate,
    startDate,
    text,
    title,
    type,
    youTubeVideoUrl,
  } = announcement.fields;

  const {
    createdAt,
    revision,
    updatedAt,
  } = announcement.sys;

  let res;

  if (!show) {
    res = (
      <div styleName="hidden">
        <div
          onClick={() => switchShow(true)}
          onKeyPress={() => switchShow(true)}
          role="button"
          styleName="hide"
          tabIndex={0}
        >
+
        </div>
        { type ? (
          <div styleName="type">
            {type}
          </div>
        ) : null }
        <h1
          styleName="title"
        >
          {publicTitle || title}
        </h1>
        <div
          styleName="text"
        >
          {text}
        </div>
      </div>
    );
  } else {
    let background = _.get(backgroundImage, 'sys.id');
    if (background) background = assets[background].fields.file.url;

    res = (
      <div
        styleName="container"
        style={{
          backgroundImage: background && `url(${background})`,
          backgroundPosition: backgroundImagePosition,
        }}
      >
        { preview ? (
          <h1 styleName="previewLabel">
Preview
          </h1>
        ) : null }
        <div styleName="details">
          <div
            onClick={() => switchShow(false)}
            onKeyPress={() => switchShow(false)}
            role="button"
            styleName="hide"
            tabIndex={0}
          >
&times;
          </div>
          { type ? (
            <div styleName="type">
              {type}
            </div>
          ) : null }
          <h1
            styleName="title"
            style={{
              color: fontColor,
              maxWidth: maxTextWidth,
            }}
          >
            {publicTitle || title}
          </h1>
          <div
            styleName="text"
            style={{
              color: fontColor,
              maxWidth: maxTextWidth,
            }}
          >
            {text}
          </div>
          {
            readMore ? (
              <PrimaryButton
                openNewTab
                size="sm"
                theme={{
                  button: style.readMore,
                }}
                to={readMore}
              >
                {readMoreLabel || 'Read more'}
              </PrimaryButton>
            ) : null
          }
        </div>
        {
          youTubeVideoUrl ? (
            <YouTubeVideo
              autoplay
              src={youTubeVideoUrl}
              styleName="video"
            />
          ) : null
        }
      </div>
    );
  }

  if (preview && !hidePreviewMetaData) {
    res = (
      <div styleName="preview">
        <div>
Created:
          {moment(createdAt).toLocaleString()}
        </div>
        <div>
Last update:
          {moment(updatedAt).toLocaleString()}
        </div>
        <div>
Revision:
          {revision}
        </div>
        <div>
Display start date:
          {moment(startDate).toLocaleString()}
        </div>
        <div>
Display end date:
          {moment(endDate).toLocaleString()}
        </div>
        <div styleName="previewContent">
          {res}
        </div>
      </div>
    );
  }

  return res;
}

Announcement.defaultProps = {
  assets: {},
  preview: false,
};

Announcement.propTypes = {
  assets: PT.shape(),
  announcement: PT.shape({
    fields: PT.shape({
      backgroundImage: PT.shape({
        sys: PT.shape({
          id: PT.string.isRequired,
        }).isRequired,
      }),
      backgroundImagePosition: PT.string,
      fontColor: PT.string,
      publicTitle: PT.string,
      readMore: PT.string,
      text: PT.string,
      title: PT.string,
      type: PT.string,
      youTubeVideoUrl: PT.string,
    }),
  }).isRequired,
  hidePreviewMetaData: PT.bool.isRequired,
  loading: PT.bool.isRequired,
  preview: PT.bool,
};
