import React, { memo, useState } from 'react';
import { View, Animated, StyleSheet, PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import BrekitTheme, { withBrekit } from './theme';

const Slider = props => {
  const {
    minimumValue,
    maximumValue,
    trackStyle,
    thumbStyle,
    activeColor,
    disabled,
    theme,
    styles,
    step,
  } = props;
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [trackSize, setTrackSize] = useState({ width: 0, height: 0 });
  const [thumbSize, setThumbSize] = useState({ width: 0, height: 0 });
  const [measured, setMeasured] = useState(false);
  const position = new Animated.Value(value); //recieve value from user
  const _panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (e, gestureState) => {
      _previousLeft = _getThumbLeft(_getCurrentVal());
      _fireChangeEvent('onSlidingStart');
    },
    onPanResponderMove: (e, gestureState) => {
      if (props.disabled) {
        return;
      }

      _setCurrentValue(_getValue(gestureState));
      _fireChangeEvent('onValueChange');
    },
    onPanResponderRelease: (e, gestureState) => {
      if (props.disabled) {
        return;
      }

      _setCurrentValue(_getValue(gestureState));
      _fireChangeEvent('onSlidingComplete');
    },
  });

  const _getRatio = value => (value - minimumValue) / (maximumValue - minimumValue);

  const _getThumbLeft = value => _getRatio(value) * (containerSize.width - thumbSize.width);

  const _getCurrentVal = () => position.__getValue();

  const _setCurrentValue = value => position.setValue(value);

  const _getValue = gestureState => {
    const length = containerSize.width - thumbSize.width;
    const thumbLeft = _previousLeft + gestureState.dx;

    const ratio = thumbLeft / length;

    if (step) {
      return Math.max(
        minimumValue,
        Math.min(
          maximumValue,
          minimumValue + Math.round((ratio * (maximumValue - minimumValue)) / step) * step
        )
      );
    }
    return Math.max(
      minimumValue,
      Math.min(maximumValue, ratio * (maximumValue - minimumValue) + minimumValue)
    );
  };
  // container size
  const _measureContainer = x => {
    _handleMeasure('containerSize', x);
  };
  // track size
  const _measureTrack = x => {
    _handleMeasure('trackSize', x);
  };
  // thumb size
  const _measureThumb = x => {
    _handleMeasure('thumbSize', x);
  };
  // calculate all of them

  const _handleMeasure = (name, x) => {
    const { width, height } = x.nativeEvent.layout;
    const size = { width, height };
    const storeName = `_${name}`;
    const currentSize = Slider[storeName];
    if (currentSize && width === currentSize.width && height === currentSize.height) {
      return;
    }
    [storeName] = size; // initialize a new var with the current sizes
    if (Slider._containerSize && Slider._trackSize && Slider._thumbSize) {
      setContainerSize(Slider._containerSize);
      setTrackSize(Slider._trackSize);
      setThumbSize(Slider._thumbSize);
      setMeasured(true);
    }
  };

  const _fireChangeEvent = event => {
    if (props[event]) {
      props[event](_getCurrentVal());
    }
  };

  const thumbLeft = position.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: [0, containerSize.width - thumbSize.width],
  });

  const minimumTrackWidth = position.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: [0, containerSize.width - thumbSize.width],
  });

  const visibleStyle = {};
  if (!measured) visibleStyle.opacity = 0;

  const minimumTrackStyle = {
    position: 'absolute',
    width: Animated.add(minimumTrackWidth, thumbSize.width / 2),
    backgroundColor: activeColor || theme.COLORS.PRIMARY,
    ...visibleStyle,
  };

  const containerStyles = [styles.container, styles];

  return (
    <View style={containerStyles} onLayout={_measureContainer}>
      <View
        renderToHardwareTextureAndroid
        style={[styles.track, trackStyle]}
        onLayout={_measureTrack}
      />
      <Animated.View renderToHardwareTextureAndroid style={[styles.track, minimumTrackStyle]} />
      <Animated.View
        renderToHardwareTextureAndroid
        style={[
          styles.thumb,
          thumbStyle,
          disabled && styles.disabled,
          {
            transform: [{ translateX: thumbLeft }, { translateY: 0 }],
            ...visibleStyle,
          },
        ]}
        {..._panResponder.panHandlers}
        onLayout={_measureThumb}
      />
    </View>
  );
};

Slider.defaultProps = {
  disabled: false,
  minimumValue: 0,
  maximumValue: 100,
  trackStyle: {},
  thumbStyle: {},
  value: 0,
  step: 0,
  style: null,
  theme: BrekitTheme,
  onSlidingComplete: () => {},
  onSlidingStart: () => {},
  onValueChange: () => {},
};

Slider.propTypes = {
  value: PropTypes.number,
  disabled: PropTypes.bool,
  minimumValue: PropTypes.number,
  maximumValue: PropTypes.number,
  trackStyle: PropTypes.any,
  thumbStyle: PropTypes.any,
  step: PropTypes.number,
  styles: PropTypes.any,
  onSlidingComplete: PropTypes.func,
  onSlidingStart: PropTypes.func,
  onValueChange: PropTypes.func,
};

const styles = theme =>
  StyleSheet.create({
    container: {
      height: 40,
      justifyContent: 'center',
    },
    track: {
      height: theme.SIZES.TRACK_SIZE,
      width: '100%',
      borderRadius: theme.SIZES.TRACK_SIZE / 2,
      position: 'absolute',
      backgroundColor: theme.COLORS.GREY,
    },
    thumb: {
      width: theme.SIZES.THUMB_SIZE,
      height: theme.SIZES.THUMB_SIZE,
      borderRadius: theme.SIZES.THUMB_SIZE / 2,
      borderWidth: 2,
      borderColor: theme.COLORS.PRIMARY,
      backgroundColor: theme.COLORS.WHITE,
    },
    disabled: {
      backgroundColor: theme.COLORS.MUTED,
    },
  });

export default withBrekit(memo(Slider), styles);
