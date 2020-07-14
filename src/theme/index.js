import React, { useContext, createContext, forwardedRef } from 'react';
import PropTypes from 'prop-types';

import BREKIT_COLORS from './colors';
import BREKIT_SIZES from './sizes';

const BrekitTheme = {
  COLORS: BREKIT_COLORS,
  SIZES: BREKIT_SIZES,
};

export default BrekitTheme;

const BrekitContext = createContext();

export const useBrekitTheme = () => {
  const theme = useContext(BrekitContext);

  if (theme === undefined) {
    throw new Error('useBrekitTheme must be used within a component wrapped with BrekitProvider');
  }

  return theme;
};

export const withBrekit = (Component, styles) =>
  forwardedRef((props, ref) => {
    return (
      <BrekitContext.Consumer>
        {theme => (
          <Component
            ref={ref}
            {...props}
            theme={{ ...BrekitTheme, ...theme }}
            styles={styles && styles({ ...BrekitTheme, ...theme })}
          />
        )}
      </BrekitContext.Consumer>
    );
  });

export const BrekitProvider = (props) => {
  const { theme, children } = props;
  const { COLORS: CUSTOM_COLORS, SIZES: CUSTOM_SIZES, customTheme } = theme;

  const providerTheme = {
    COLORS: { ...BrekitTheme.COLORS, ...CUSTOM_COLORS },
    SIZES: { ...BrekitTheme.SIZES, ...CUSTOM_SIZES },
    ...customTheme,
  };

  return <BrekitContext.Provider value={providerTheme}>{children}</BrekitContext.Provider>;
};

BrekitProvider.propTypes = {
  children: PropTypes.any,
  theme: PropTypes.any,
};

BrekitProvider.defaultProps = {
  children: null,
  theme: {},
};
