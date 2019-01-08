import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Relay from 'react-relay/classic';

import RouteAlertsContainer from './RouteAlertsContainer';

const getSortKey = ({ shortName }) => {
  const matchGroups = shortName && shortName.match(/[0-9]+/g);
  return matchGroups ? Number.parseInt(matchGroups[0], 10) : shortName;
};

const StopAlertsContainer = ({ stop }) => {
  const patternsWithAlerts = stop.stoptimesForPatterns
    .map(stoptime => stoptime.pattern)
    .filter(pattern => pattern.route.alerts.length > 0);
  if (patternsWithAlerts.length === 0) {
    return (
      <div className="no-stop-alerts-message">
        <FormattedMessage
          id="disruption-info-route-no-alerts"
          defaultMessage="No known disruptions or diversions for route."
        />
      </div>
    );
  }
  return (
    <div className="momentum-scroll">
      {orderBy(patternsWithAlerts, pattern => getSortKey(pattern.route)).map(
        pattern => (
          <RouteAlertsContainer
            key={pattern.code}
            isScrollable={false}
            patternId={pattern.code}
            route={pattern.route}
          />
        ),
      )}
    </div>
  );
};

StopAlertsContainer.propTypes = {
  stop: PropTypes.shape({
    stoptimesForPatterns: PropTypes.arrayOf(
      PropTypes.shape({
        pattern: PropTypes.object.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

const containerComponent = Relay.createContainer(StopAlertsContainer, {
  fragments: {
    stop: () => Relay.QL`
    fragment on Stop {
      stoptimesForPatterns(numberOfDepartures: 1, timeRange: 604800) {
        pattern {
          code
          route {
            ${RouteAlertsContainer.getFragment('route')}
            id
            gtfsId
            shortName
            longName
            mode
            color
            alerts {
              effectiveEndDate
              effectiveStartDate
              id
              trip {
                pattern {
                  code
                }
              }
            }
          }
        }
      }
    }
    `,
  },
});

export { containerComponent as default, StopAlertsContainer as Component };
