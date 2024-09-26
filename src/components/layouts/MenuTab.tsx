import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

type IconMapping = {
  [key: string]: {
    active: ImageSourcePropType;
    inactive: ImageSourcePropType;
  };
};

const iconMapping: IconMapping = {
  FriendsList: {
    active: require('../../assets/icons/friendListIcon.png'),
    inactive: require('../../assets/icons/notFriendListIcon.png'),
  },
  ChatRoomList: {
    active: require('../../assets/icons/chatIcon.png'),
    inactive: require('../../assets/icons/notChatIcon.png'),
  },
  Settings: {
    active: require('../../assets/icons/settingIcon.png'),
    inactive: require('../../assets/icons/notSettingIcon.png'),
  },
};

export default function MenuTab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  if (!state || !state.routes) {
    // state나 routes가 없는 경우 빈 View를 반환
    return <View />;
  }

  return (
    <Container>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Menu key={route.key} onPress={onPress}>
            <Image
              source={
                isFocused
                  ? iconMapping[route.name].active
                  : iconMapping[route.name].inactive
              }
              style={{width: 25, height: 25, marginBottom: 2}}
            />
            <Text style={globalStyles.regularCaption}>{label as string}</Text>
          </Menu>
        );
      })}
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  height: 70px;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

const Menu = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
`;
