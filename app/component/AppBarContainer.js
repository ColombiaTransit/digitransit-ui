import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { matchShape, routerShape } from 'found';
import { FormattedMessage } from 'react-intl';
import getContext from 'recompose/getContext';
import connectToStores from 'fluxible-addons-react/connectToStores';
import withBreakpoint from '../util/withBreakpoint';

import LazilyLoad, { importLazy } from './LazilyLoad';

const modules = {
  AppBar: () => importLazy(import('./AppBar')),
  AppBarHsl: () => importLazy(import('./AppBarHsl')),
  MessageBar: () => importLazy(import('./MessageBar')),
};

// DT-3375: added style
const AppBarContainer = ({
  router,
  match,
  homeUrl,
  logo,
  user,
  favourites,
  style,
  lang,
  breakpoint,
  ...args
}) => {
  const [isClient, setClient] = useState(false);

  useEffect(() => {
    // To prevent SSR from rendering something https://reactjs.org/docs/react-dom.html#hydrate
    setClient(true);
  });

  return (
    <>
      <a
        href="#mainContent"
        id="skip-to-content-link"
        style={{ display: isClient ? 'block sr-only' : 'none' }}
      >
        <FormattedMessage
          id="skip-to-content"
          defaultMessage="Skip to content"
        />
      </a>
      <LazilyLoad modules={modules}>
        {({ AppBar, AppBarHsl, MessageBar }) =>
          style === 'hsl' ? (
            <div
              className="hsl-header-container"
              style={{ display: isClient ? 'block' : 'none' }}
            >
              <AppBarHsl user={user} lang={lang} favourites={favourites} />
              <MessageBar breakpoint={breakpoint} />
            </div>
          ) : (
            <AppBar
              {...args}
              showLogo
              logo={logo}
              homeUrl={homeUrl}
              user={user}
              breakpoint={breakpoint}
              titleClicked={() =>
                router.push({
                  ...match.location,
                  pathname: homeUrl,
                  state: {
                    ...match.location.state,
                    errorBoundaryKey:
                      match.location.state &&
                      match.location.state.errorBoundaryKey
                        ? match.location.state.errorBoundaryKey + 1
                        : 1,
                  },
                })
              }
            />
          )
        }
      </LazilyLoad>
    </>
  );
};

AppBarContainer.propTypes = {
  match: matchShape.isRequired,
  router: routerShape.isRequired,
  homeUrl: PropTypes.string.isRequired,
  logo: PropTypes.string,
  user: PropTypes.object,
  favourites: PropTypes.array,
  style: PropTypes.string.isRequired,
  lang: PropTypes.string,
  breakpoint: PropTypes.string.isRequired,
};

const AppBarContainerWithBreakpoint = withBreakpoint(AppBarContainer);

const WithContext = connectToStores(
  getContext({
    match: matchShape.isRequired,
    router: routerShape.isRequired,
  })(AppBarContainerWithBreakpoint),
  ['FavouriteStore', 'UserStore', 'PreferencesStore'],
  context => ({
    user: context.getStore('UserStore').getUser(),
    lang: context.getStore('PreferencesStore').getLanguage(),
    favourites: context.getStore('FavouriteStore').getFavourites(),
  }),
);

WithContext.propTypes = {
  title: PropTypes.node,
};

export default WithContext;
