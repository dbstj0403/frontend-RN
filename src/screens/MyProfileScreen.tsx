import React from 'react';
import backgroundImage from '../assets/background/homeBackground.png';
import styled from 'styled-components/native';
import {useRoute} from '@react-navigation/native';
import {Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {globalStyles} from '../styles/globalStyles';

export default function MyProfileScreen() {
  const navigation = useNavigation();

  const moveToFriendsList = () => {
    navigation.navigate('FriendsList');
  };

  const route = useRoute();
  const {id, name, statusMessage} = route.params as {
    id: string;
    name: string;
    statusMessage: string;
  };

  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Header>
          <TouchableOpacity onPress={moveToFriendsList}>
            <Image
              source={require('../assets/icons/xIcon.png')}
              alt="Backward"
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
          <IconContainer>
            <Image
              source={require('../assets/icons/editIcon.png')}
              alt="edit"
              style={{width: 24, height: 24}}
            />
            <Image
              source={require('../assets/icons/profileSettingIcon.png')}
              alt="setting"
              style={{width: 24, height: 24}}
            />
          </IconContainer>
        </Header>
        <Container>
          <Image
            source={require('../assets/profile/profileImg.png')}
            alt="Profile Image"
            style={{width: 270, height: 218}}
          />
          <Text style={globalStyles.bold40}>{name}</Text>
          <Text style={globalStyles.grayBold20}>{statusMessage}</Text>
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
`;

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-horizontal: 20px;
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 1;
`;

const IconContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;
