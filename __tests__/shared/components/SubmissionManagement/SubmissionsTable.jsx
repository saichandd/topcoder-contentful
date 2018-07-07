import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SubmissionsTable from 'components/SubmissionManagement/SubmissionsTable';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <SubmissionsTable
      showDetails={{ 12345: true }}
      submissionObjects={[{
        submissionId: 12345,
      }]}
      type="DESIGN"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <SubmissionsTable
      showDetails={{ 12345: true }}
      type="DESIGN"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
