import React, { useState, useEffect } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

import Block from './Block';
import Icon from './atomic/ions/Icon';
import Text from './atomic/ions/Text';
import GalioTheme from './theme';

const { width } = Dimensions.get('screen');

const AccordionContent = props => {
  const { content, contentStyle } = props;

  return <Text style={[styles.content, contentStyle]}>{content}</Text>;
};

AccordionContent.propTypes = {
  content: PropTypes.string,
  contentStyle: PropTypes.object,
};

const AccordionHeader = props => {
  const { expanded, expandedIcon, headerStyle, icon, title, chapterIcon } = props;
  return (
    <Block row middle style={[{ padding: 6 }, headerStyle]}>
      {chapterIcon ? (
        <Icon
          name={chapterIcon.name}
          family={chapterIcon.family}
          size={chapterIcon.size || 14}
          color={chapterIcon.color || GalioTheme.COLORS.PRIMARY}
          style={chapterIcon.style || { marginRight: 5 }}
        />
      ) : null}
      <Block row space="between" middle flex>
        <Text size={16}>{title}</Text>
        {expanded
          ? expandedIcon || (
              <Icon
                name="keyboard-arrow-up"
                family="material"
                size={16}
                color={GalioTheme.COLORS.MUTED}
              />
            )
          : icon || (
              <Icon
                name="keyboard-arrow-down"
                family="material"
                size={16}
                color={GalioTheme.COLORS.MUTED}
              />
            )}
      </Block>
    </Block>
  );
};

AccordionHeader.propTypes = {
  expanded: PropTypes.bool,
  expandedIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  headerStyle: ViewPropTypes.style,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  title: PropTypes.string,
  chapterIcon: PropTypes.object,
};

const AccordionAnimation = props => {
  const { children, style } = props;
  const [fade, setFade] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  });

  return <Animated.View style={{ ...style, opacity: fade }}>{children}</Animated.View>;
};

AccordionAnimation.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  style: ViewPropTypes.style,
};

const AccordionItem = props => {
  const {
    expanded,
    expandedIcon,
    headerStyle,
    contentStyle,
    icon,
    index,
    item,
    onAccordionClose,
    onAccordionOpen,
    setSelected,
  } = props;
  return (
    <Block>
      <TouchableWithoutFeedback
        onPress={() => {
          onAccordionOpen && !expanded && onAccordionOpen(item, index);
          onAccordionClose && expanded && onAccordionClose(item, index);
          setSelected(index);
        }}>
        <Block>
          <AccordionHeader
            expanded={expanded}
            expandedIcon={expandedIcon}
            headerStyle={headerStyle}
            icon={icon}
            title={item.title}
            chapterIcon={item.icon}
          />
        </Block>
      </TouchableWithoutFeedback>
      {expanded ? (
        <AccordionAnimation>
          <AccordionContent content={item.content} contentStyle={contentStyle} />
        </AccordionAnimation>
      ) : null}
    </Block>
  );
};

AccordionItem.propTypes = {
  expanded: PropTypes.bool,
  expandedIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  headerStyle: ViewPropTypes.style,
  contentStyle: PropTypes.object,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  index: PropTypes.any,
  item: PropTypes.object,
  onAccordionClose: PropTypes.func,
  onAccordionOpen: PropTypes.func,
  setSelected: PropTypes.func,
};

const Accordion = props => {
  const {
    theme,
    dataArray,
    icon,
    expandedIcon,
    headerStyle,
    contentStyle,
    opened,
    onAccordionOpen,
    onAccordionClose,
    listStyle,
    style,
  } = props;
  const [selected, setSelected] = useState(opened);

  return (
    <Block style={[styles.container, style]}>
      <FlatList
        data={dataArray}
        extraData={selected}
        style={listStyle}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => (
          <AccordionItem
            key={String(index)}
            expanded={selected === index}
            expandedIcon={expandedIcon}
            icon={icon}
            headerStyle={headerStyle}
            contentStyle={contentStyle}
            onAccordionOpen={onAccordionOpen}
            onAccordionClose={onAccordionClose}
            item={item}
            index={index}
            setSelected={s => setSelected(selected === s ? undefined : s)}
          />
        )}
      />
    </Block>
  );
};

Accordion.propTypes = {
  theme: PropTypes.any,
  dataArray: PropTypes.array,
  opened: PropTypes.number,
  listStyle: PropTypes.any,
  style: PropTypes.any,
  icon: PropTypes.any,
  expandedIcon: PropTypes.any,
  headerStyle: PropTypes.any,
  contentStyle: PropTypes.any,
  onAccordionClose: PropTypes.func,
  onAccordionOpen: PropTypes.func,
};

Accordion.defaultProps = {
  theme: GalioTheme,
  opened: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.8,
    borderRadius: 16,
    padding: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: 'white',
  },
  header: {
    padding: 6,
  },
  content: {
    padding: 10,
  },
});

export default Accordion;
