import React from 'react';
import PropTypes from 'prop-types';
import Text from '../ions/Text';
import BrekitTheme, { withBrekit } from '../../theme';

const Link = ({ children, onPress, theme, ...rest }) => {
  return (
    <Text color={theme.COLORS.PRIMARY} onPress={onPress} {...rest}>
      {children}
    </Text>
  );
};

Link.defaultProps = {
  children: null,
  theme: BrekitTheme,
};

Link.propTypes = {
  children: PropTypes.any,
  theme: PropTypes.any,
  onPress: PropTypes.func.isRequired,
};

export default withBrekit(Link);
