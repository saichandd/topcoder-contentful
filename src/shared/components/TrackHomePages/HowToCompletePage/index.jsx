/**
 * HowToComplete Component
 */
/* eslint-disable prefer-destructuring */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';

import FAQ from './FAQ';
import Header from './Header';
import StepByStep from './StepByStep';

import './styles.scss';

const HowToCompletePage = ({ howToComplete }) => {
  const data = howToComplete;
  let faq = {};
  let howToExtras = {};
  const header = {};
  let steps = {};
  const assetIds = [];
  let entryIds = [];
  let timeTableIds = [];
  let stepIds = [];
  let extrasIds = [];
  let faqIds = [];
  // Process Header
  header.title = howToComplete.introTitle;
  header.text = howToComplete.introText;
  if (howToComplete.timeTable) {
    timeTableIds = _.map(howToComplete.timeTable, item => (item.sys.id));
  }
  if (howToComplete.videoOrImage) {
    assetIds.push(howToComplete.videoOrImage.sys.id);
  }

  // Process StepByStep
  if (howToComplete.stepByStep) {
    stepIds = _.map(howToComplete.stepByStep, item => (item.sys.id));
  }

  // Process How To Extras
  if (howToComplete.howToExtras) {
    extrasIds = _.map(howToComplete.howToExtras, item => (item.sys.id));
  }
  // Process FAQ
  if (howToComplete.faq) {
    faqIds = _.map(howToComplete.faq, item => (item.sys.id));
  }

  entryIds = timeTableIds.concat(stepIds, extrasIds, faqIds);

  return (
    <ContentfulLoader
      assetIds={assetIds}
      entryIds={entryIds}
      render={(result) => {
        for (let i = 0; i !== faqIds.length; i += 1) {
          data.faq[i].fields = result.entries.items[faqIds[i]].fields;
        }
        for (let i = 0; i !== extrasIds.length; i += 1) {
          data.howToExtras[i].fields = result.entries.items[extrasIds[i]].fields;
        }
        for (let i = 0; i !== stepIds.length; i += 1) {
          data.stepByStep[i].fields = result.entries.items[stepIds[i]].fields;
        }
        for (let i = 0; i !== timeTableIds.length; i += 1) {
          data.timeTable[i].fields = result.entries.items[timeTableIds[i]].fields;
        }
        data.videoOrImage.fields = result.assets.items[assetIds[0]].fields;
        header.table = data.timeTable;
        header.media = data.videoOrImage;
        steps = {
          Steps: data.stepByStep,
        };
        howToExtras = {
          AQs: data.howToExtras,
        };
        faq = {
          AQs: data.faq,
        };
        return (
          <div styleName="outer-container">
            <div styleName="page">
              <div styleName="header">
                <Header data={header} />
              </div>
              <div styleName="steps" id="steps">
                <h1>
Step by Step
                </h1>
                <StepByStep data={steps} />
              </div>
              <div styleName="how-to-extras">
                <h1>
Extras
                </h1>
                <FAQ data={howToExtras} />
              </div>
              <div styleName="faq">
                <h1>
FAQ
                </h1>
                <div styleName="text">
Here’s a few answers to our most common questions
                </div>
                <FAQ data={faq} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

HowToCompletePage.propTypes = {
  howToComplete: PT.shape().isRequired,
};

export default HowToCompletePage;
