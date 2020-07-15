import React from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import PropTypes from 'prop-types';

import BrekitTheme, { withBrekit } from '../../theme';
import getIconType from '../../helpers/getIconType';
import galioConfig from '../../config/Brekit.json';

const Brekit = createIconSetFromIcoMoon(galioConfig, 'Brekit', './fonts/Brekit.ttf');

const Icon = (props) => {
  const { name, family, size, color, styles, theme, medium, large, ...rest } = props;
  if (family === 'Brekit') {
    if (name) {
      return (
        <Brekit
          name={name}
          size={
            size ||
            (medium ? theme.SIZES.ICON_MEDIUM : large ? theme.SIZES.ICON_LARGE : theme.SIZES.ICON)
          }
          color={color || theme.COLORS.THEME.BLACK}
          {...rest}
        />
      );
    }
  } else {
    const IconInstance = getIconType(family);
    if (name && IconInstance) {
      return (
        <IconInstance
          name={name}
          size={
            size ||
            (medium ? theme.SIZES.ICON_MEDIUM : large ? theme.SIZES.ICON_LARGE : theme.SIZES.ICON)
          }
          color={color || theme.COLORS.THEME.BLACK}
          {...rest}
        />
      );
    }
  }

  return null;
};

Icon.defaultProps = {
  name: null,
  family: null,
  size: null,
  color: null,
  styles: {},
  theme: BrekitTheme,
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  family: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  styles: PropTypes.any,
  theme: PropTypes.any,
};

export default withBrekit(Icon);
