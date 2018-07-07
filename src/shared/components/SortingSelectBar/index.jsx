import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Select from 'react-select';
import './style.scss';

export default function SortingSelectBar({
  onSelect, options, title, value,
}) {
  return (
    <div styleName="sortingBar">
      <h1 styleName="title">
        {title}
      </h1>
      {
        options ? (
          <div styleName="view-options-toggle-container">
            <p styleName="view-options-toggle-container-label">
              Sort by:
            </p>
            <Select
              searchable={false}
              clearable={false}
              options={options}
              onChange={item => onSelect(item.value)}
              value={value}
              placeholder="Select an option"
            />
          </div>
        ) : null
      }
    </div>
  );
}

SortingSelectBar.defaultProps = {
  onSelect: _.noop,
  options: null,
  title: '',
  value: null,
};

SortingSelectBar.propTypes = {
  onSelect: PT.func,
  options: PT.arrayOf(PT.shape()),
  title: PT.string,
  value: PT.shape(),
};
