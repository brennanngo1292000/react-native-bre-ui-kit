import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Text from './atomic/ions/Text';
import BrekitTheme, { withBrekit } from './theme';

const { height } = Dimensions.get('screen');

const Toast = props => {
  const {
    isShow,
    fadeInDuration,
    fadeOutDuration,
    positionIndicator,
    positionOffset,
    children,
    textStyle,
    theme,
    color,
    round,
    style,
    styles,
    ...rest
  } = props;

  const [isShowSt, setIsShowSt] = useState(isShow);
  const [fadeAnim] = useState(new Animated.Value(0));

  let animation;
  let visibilityTimeout;

  const setVisibility = isShow => setIsShowSt(isShow);

  const getTopPosition = () => {
    if (positionIndicator === 'top') {
      return positionOffset;
    }

    if (positionIndicator === 'bottom') {
      return height - positionOffset;
    }

    return height / 2;
  };
  const renderContent = () => {
    const textStyles = [styles.text, textStyle];

    if (typeof children === 'string') {
      return <Text style={textStyles}>{children}</Text>;
    }

    return children;
  };

  const colorStyle = styles[`${color}Color`];
  const toastStyles = [
    styles.toast,
    color && colorStyle,
    color && !colorStyle && { backgroundColor: color },
    round && { borderRadius: theme.SIZES.BASE * 2 },
    {
      top: getTopPosition(),
      opacity: fadeAnim,
    },
    style,
  ];

  useEffect(() => {
    if (isShow) {
      setVisibility(true);
      animation = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
      }).start();
    } else {
      animation = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: fadeOutDuration,
      }).start();

      visibilityTimeout = setTimeout(() => {
        setVisibility(false);
      }, fadeOutDuration);
    }
  }, [isShow, fadeInDuration, fadeOutDuration]);

  useEffect(() => {
    return () => {
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }

      if (animation) {
        animation.stop();
      }
    };
  }, []);

  return isShowSt ? (
    <Animated.View style={toastStyles} {...rest}>
      {renderContent()}
    </Animated.View>
  ) : null;
};

const styles = theme =>
  StyleSheet.create({
    toast: {
      padding: theme.SIZES.BASE,
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 9999,
    },
    text: {
      fontSize: theme.SIZES.FONT,
      color: theme.COLORS.WHITE,
    },
    primaryColor: {
      backgroundColor: theme.COLORS.PRIMARY,
    },
    themeColor: {
      backgroundColor: theme.COLORS.THEME,
    },
    infoColor: {
      backgroundColor: theme.COLORS.INFO,
    },
    errorColor: {
      backgroundColor: theme.COLORS.ERROR,
    },
    warningColor: {
      backgroundColor: theme.COLORS.WARNING,
    },
    successColor: {
      backgroundColor: theme.COLORS.SUCCESS,
    },
  });

Toast.propTypes = {
  children: PropTypes.node.isRequired,
  isShow: PropTypes.bool.isRequired,
  positionIndicator: PropTypes.oneOf(['top', 'center', 'bottom']),
  positionOffset: PropTypes.number,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  color: PropTypes.oneOfType([
    PropTypes.oneOf(['primary', 'theme', 'info', 'error', 'warning', 'success']),
    PropTypes.string,
  ]),
  round: PropTypes.bool,
  style: ViewPropTypes.style,
  textStyle: ViewPropTypes.style,
  styles: PropTypes.any,
  theme: PropTypes.any,
};

Toast.defaultProps = {
  positionIndicator: 'top',
  positionOffset: 120,
  fadeInDuration: 300,
  fadeOutDuration: 300,
  color: 'primary',
  round: false,
  style: null,
  textStyle: null,
  styles: {},
  theme: BrekitTheme,
};

export default withBrekit(Toast, styles);
