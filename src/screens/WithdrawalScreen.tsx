import React from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {logout} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {globalStyles} from '../styles/globalStyles';

export default function Withdrawalcreen() {
  const navigation = useNavigation();

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Header>
          <TouchableOpacity onPress={goToSettings}>
            <Image
              source={require('../assets/icons/backwardIcon.png')}
              alt="Login"
              style={{width: 7.4, height: 12}}
            />
          </TouchableOpacity>
          <Text style={globalStyles.semibold16}>회원 탈퇴</Text>
          <View style={{width: 3}} />
        </Header>
        <Container>
          <Image
            source={require('../assets/withdrawal/crying.png')}
            alt="Login"
            style={{width: 350, height: 350}}
          />

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 10,
            }}>
            <Text style={globalStyles.bold24}>회원 탈퇴를</Text>
            <Text style={globalStyles.bold24}>진행하시겠습니까?</Text>
          </View>

          <BtnContainer>
            <BackBtn onPress={goToSettings}>
              <Text style={globalStyles.greySemibold}>돌아가기</Text>
            </BackBtn>
            <WithdrawalBtn>
              <Text style={globalStyles.whiteSemibold}>탈퇴햐기</Text>
            </WithdrawalBtn>
          </BtnContainer>
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

const Container = styled(ScrollView)`
  flex: 1;
  padding: 0 20px;
  display: flex;
  margin-top: 10px;
  gap: 36px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-color: #dfdfdf;
  padding-horizontal: 20px;
`;

const BtnContainer = styled.View`
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;

const Btn = styled.TouchableOpacity`
  width: 348px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackBtn = styled(Btn)`
  background-color: #cccccc;
  color: #666666;
`;

const WithdrawalBtn = styled(Btn)`
  background-color: black;
  color: white;
`;
