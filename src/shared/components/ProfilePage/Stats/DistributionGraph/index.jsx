/* eslint-env browser */
import d3 from 'd3';
import React from 'react';
import { toPairs } from 'lodash';
import PT from 'prop-types';
import { getRatingColor } from 'utils/tc';
import ChartTooltip from '../ChartTooltip';
import styles from './index.scss';

const getRanges = distribution => (
  toPairs(distribution)
    .map(([name, number]) => {
      const [start, end] = name.match(/ratingRange(\d+)To(\d+)/).slice(1).map(rating => parseInt(rating, 10));
      return {
        name,
        number,
        start,
        end,
      };
    })
    .sort((a, b) => a.start - b.start)
);

const getNonZeroRanges = (ranges) => {
  let st = 0;
  while (ranges[st].number === 0) {
    st += 1;
  }
  let end = ranges.length - 1;
  while (end > st && ranges[end].number === 0) {
    end -= 1;
  }
  return ranges.slice(st, end + 1);
};

export default class DistributionGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.graphRef = React.createRef();
  }

  componentDidMount() {
    const $scope = this;
    $scope.desktop = window.innerWidth >= 900;
    this.draw();
    this.resizeHandle = () => {
      if (window.innerWidth < 900 && $scope.desktop) {
        $scope.desktop = false;
        this.draw();
      } else if (window.innerWidth >= 900 && !$scope.desktop) {
        $scope.desktop = true;
        this.draw();
      }
    };
    window.addEventListener('resize', this.resizeHandle);
  }

  componentDidUpdate(prevProps) {
    const { distribution } = this.props;
    if (prevProps.distribution !== distribution) {
      this.draw();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandle);
  }

  draw() {
    const $scope = this;
    const { distribution: wrapper, rating } = this.props;
    if (!wrapper) {
      return;
    }
    const { distribution } = wrapper;

    const desktopMeasurements = {
      w: 855,
      h: 400,
      padding: {
        top: 20,
        right: 5,
        bottom: 100,
        left: 40,
      },
    };

    const mobileMeasurements = {
      w: 370,
      h: 200,
      padding: {
        top: 50,
        left: 40,
        bottom: 80,
        right: 50,
      },
    };

    d3.select($scope.graphRef.current).select('svg').remove();
    const { w, h, padding } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    const totalW = w + padding.left + padding.right;
    const totalH = h + padding.top + padding.bottom;

    const ranges = getNonZeroRanges(getRanges(distribution));

    const xScale = d3.scale.ordinal()
      .domain(d3.range(ranges.length))
      .rangeRoundBands([padding.left, padding.left + w], 0.05);
    const yScale = d3.scale.linear()
      .domain([0, d3.max(ranges, range => range.number) + 1])
      .range([totalH - padding.bottom, padding.top]);
    const xScale2 = d3.scale.linear()
      .domain([ranges[0].start,
        d3.max(ranges, range => range.end)])
      .range([padding.left, totalW - padding.right]);
    const xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(ranges.length);
    const yAxis = ticks => d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(ticks);
    const svg = d3.select($scope.graphRef.current)
      .append('svg')
      .attr('width', totalW)
      .attr('height', totalH);

    svg.append('rect')
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', '#f6f6f6');

    svg.append('g')
      .attr('class', styles.grid)
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis(5).tickSize(-totalW, 0, 0).tickFormat(''));

    svg.append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis(5));

    svg.append('line')
      .attr('x1', xScale2(rating))
      .attr('y1', totalH - padding.bottom)
      .attr('x2', xScale2(rating))
      .attr('y2', padding.top)
      .attr('stroke-width', 2)
      .attr('stroke', getRatingColor(rating));

    svg.selectAll('rect.bar')
      .data(ranges)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.number))
      .attr('width', xScale.rangeBand())
      .attr('height', d => totalH - padding.bottom - yScale(d.number))
      .attr('fill', d => getRatingColor(d.start));

    svg.selectAll('rect.hover')
      .data(ranges)
      .enter()
      .append('rect')
      .attr('class', 'hover')
      .attr('fill', 'transparent')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.number))
      .attr('width', xScale.rangeBand())
      .attr('height', d => totalH - padding.bottom - yScale(d.number))
      .on('mouseover', (d) => {
        const e = d3.event;
        $scope.setState({
          show: true,
          left: e.pageX,
          top: e.pageY,
          challengeName: `${d.number} Coders`,
          challengeData: `Rating Range: ${d.start} - ${d.start + 99}`,
          rating: d.number,
          ratingColor: getRatingColor(d.start),
        });
      })
      .on('mousemove', () => {
        const e = d3.event;
        $scope.setState({
          show: true,
          left: e.pageX,
          top: e.pageY,
        });
      })
      .on('mouseout', () => {
        $scope.setState({
          show: false,
        });
      });

    svg.selectAll('line.xaxis')
      .data(ranges)
      .enter()
      .append('line')
      .attr('class', 'xaxis')
      .attr('x1', (d, i) => (
        (i === 0) ? padding.left : xScale(i) - 0.5
      ))
      .attr('x2', (d, i) => (
        i === ranges.length - 1
          ? totalW - padding.right
          : xScale(i) + xScale.rangeBand() + 0.5
      ))
      .attr('y1', h + padding.top + 0.5)
      .attr('y2', h + padding.top + 0.5)
      .attr('stroke', d => getRatingColor(d.start));

    svg.append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(0,${(h + padding.top)})`)
      .call(xAxis)
      .selectAll('text')
      .attr('x', 9)
      .attr('y', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(90)')
      .style('text-anchor', 'start')
      .text((d, i) => `${ranges[i].start} - ${ranges[i].end}`);
  }

  render() {
    return (
      <div styleName="distribution-graph" ref={this.graphRef}>
        <ChartTooltip {...this.state} />
      </div>
    );
  }
}

DistributionGraph.defaultProps = {
  distribution: null,
};

DistributionGraph.propTypes = {
  distribution: PT.shape(),
  rating: PT.number.isRequired,
};
