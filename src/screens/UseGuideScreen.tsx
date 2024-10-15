import React from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {logout} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {globalStyles} from '../styles/globalStyles';
export default function UseGuideScreen() {
  const navigation = useNavigation();

  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Container>
          <Text>유저 가이드 화면입니다.</Text>
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
`;

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
`;
