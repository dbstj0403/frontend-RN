import React from 'react';
import axios from 'axios';
import api from '../api/config';
import {SERVER_URL} from 'react-native-dotenv';
console.log(SERVER_URL);
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';
import {globalStyles} from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';

const LoginScreen = ({navigation}) => {
  const handleKakaoLogin = async () => {
    try {
      const {accessToken, refreshToken}: KakaoOAuthToken = await login();
      if (accessToken) {
        await AsyncStorage.setItem('kakaoAccessToken', accessToken);
        await AsyncStorage.setItem('kakaoRefreshToken', refreshToken);
        console.log(
          'handleKakaoLogin',
          'success',
          accessToken,
          'refreshToken',
          refreshToken,
        );
        await sendToken(accessToken);
      } else {
        console.log('Kakao login failed: No access token received');
      }
    } catch (err) {
      console.log('Kakao login failed', err);
    }
  };

  const sendToken = async (accessToken: string) => {
    console.log(SERVER_URL);
    try {
      const response = await api.post('/oauth2/login/KAKAO', {
        accessToken: accessToken,
        deviceToken: 1,
      });
      if (response.status === 200) {
        console.log('kakao token 보낸 함수 응답:', response.data);
        await AsyncStorage.setItem('jwtAccessToken', response.data.accessToken);
        await AsyncStorage.setItem(
          'jwtRefreshToken',
          response.data.refreshToken,
        );
        if (response.data.isSignUpUser === true) {
          console.log('Existing user logged in');
          navigation.replace('Main');
        } else {
          navigation.replace('KakaoSignUp');
        }
      } else {
        console.log('Server response not OK:', response.status);
      }
    } catch (e) {
      console.log('Sending Kakao access token to server failed:', e);
    }
  };

  const moveToSignUpPage = () => {
    navigation.replace('KakaoSignUp');
  };

  return (
    <LoginPageContainer>
      <Image
        source={require('../assets/icons/loginIcon.png')}
        alt="Login"
        style={{width: 30, height: 30}}
      />
      <LoginText style={globalStyles.bold20}>로그인</LoginText>
      <View>
        <Text style={globalStyles.bold12}>이메일</Text>
        <UserTextInput
          placeholder="이메일을 입력해 주세요."
          style={globalStyles.grayRegular16}
        />
        <Text style={globalStyles.bold12}>비밀번호</Text>
        <UserTextInput
          placeholder="비밀번호를 입력해 주세요."
          style={globalStyles.bold12}
          secureTextEntry={true}
        />
      </View>
      <ButtonContainer>
        <TouchableOpacity
          onPress={() => {
            navigation.replace('FriendsList');
          }}>
          <ButtonText style={globalStyles.semibold}>로그인</ButtonText>
        </TouchableOpacity>
      </ButtonContainer>
      <SearchContainer>
        <Text style={globalStyles.regular12}>아이디 찾기</Text>
        <Text style={globalStyles.regular12}>|</Text>
        <Text style={globalStyles.regular12}>비밀번호 찾기</Text>
        <Text style={globalStyles.regular12}>|</Text>
        <Text onPress={moveToSignUpPage} style={globalStyles.regular12}>
          회원 가입
        </Text>
      </SearchContainer>
      <HRTextContainer>
        <Line />
        <HRText style={globalStyles.bold12}>간편 로그인</HRText>
        <Line />
      </HRTextContainer>
      <KakaoButtonContainer onPress={handleKakaoLogin}>
        <KakaoButtonText style={globalStyles.semibold}>
          카카오로 간편 로그인
        </KakaoButtonText>
      </KakaoButtonContainer>
    </LoginPageContainer>
  );
};

const LoginPageContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const LoginText = styled.Text`
  margin-top: 20px;
  margin-bottom: 40px;
`;

const UserTextInput = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: black;
  height: 50px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: gray;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const KakaoButtonContainer = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #feea00;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const KakaoButtonText = styled.Text`
  color: black;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const SearchContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 8px;
`;

const HRTextContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: #ccc;
`;

const HRText = styled.Text`
  margin: 0 10px;
`;

export default LoginScreen;
