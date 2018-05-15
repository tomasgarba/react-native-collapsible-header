import React, { Component } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Collapsible extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    headerMaxHeight: PropTypes.number.isRequired,
    headerMinHeight: PropTypes.number,
    renderContent: PropTypes.func.isRequired,
    renderHeader: PropTypes.func.isRequired,
  };

  static defaultProps = {
    backgroundColor: 'transparent',
    headerMinHeight: Platform.select({ ios: 20, android: 24 }),
  }

  scrollY = new Animated.Value(0);
  max = this.props.headerMaxHeight + this.props.headerMinHeight;

  const headerPosition = this.scroll.interpolate({
    inputRange: [0, this.max],
    outputRange: [0, -this.max],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
    { useNativeDriver: true },
  );

  const headerStyle = [
    styles.header,
    { height: this.max },
    { transform: [{ translateY: headerPosition}] },
  ];

  render() {
    const { backgroundColor, renderContent, renderHeader, ...scrollViewProps } = this.props;

    const contentStyle = [
      styles.content,
      {
        backgroundColor,
        marginTop: this.max,
      },
    ];

    return (
      <View style={styles.fill}>
        <Animated.ScrollView
          bounces={false}
          style={styles.fill}
          scrollEventThrottle={16}
          onScroll={onScroll}
          {...scrollViewProps}
        >
          <View style={contentStyle}>{renderContent}</View>
        </Animated.ScrollView>
        <Animated.View style={headerStyle}>{renderHeader}</Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    backgroundColor: 'transparent',
  },
});
