import React from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  Alert,
} from 'react-native';
import {useNavigation, StackActions} from '@react-navigation/native';
import {logout} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {globalStyles} from '../styles/globalStyles';
export default function SettingsScreen() {
  const navigation = useNavigation();

  const kakaoLogout = async () => {
    try {
      const message = await logout();
      console.log(message);
      // 로그아웃 성공 후 처리 (예: 상태 업데이트, 네비게이션 등)
      Alert.alert(
        '로그아웃 완료',
        '성공적으로 로그아웃이 완료되었습니다!',
        [
          {
            text: '확인',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}], // 스택을 초기화하고 Login으로 이동
              });
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('카카오 로그아웃 실패', error);
    }
  };

  const goToUseGuide = () => {
    navigation.navigate('Guide');
  };

  const goToWithdrawal = () => {
    navigation.navigate('Withdrawal');
  };

  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Container>
          <HeadContainer>
            <Text style={globalStyles.bold20}>설정</Text>
            <SearchIcon
              source={require('../assets/icons/searchIcon.png')}
              alt="search"
            />
          </HeadContainer>
          <TopImage
            source={require('../assets/setting/settingTopImg.png')}
            alt="settingImg"
          />
          <MenuContainer>
            <MenuItem>
              <ImageWrapper>
                <Image
                  source={require('../assets/setting/person.png')}
                  alt="modify"
                  style={{width: 24, height: 24}}
                />
              </ImageWrapper>

              <Text style={globalStyles.bold18}>개인 정보 수정</Text>
              <Image
                source={require('../assets/icons/goToIcon.png')}
                alt="modify"
                style={{width: 24, height: 24, marginLeft: 178}}
              />
            </MenuItem>

            <MenuItem onPress={goToUseGuide}>
              <ImageWrapper>
                <Image
                  source={require('../assets/setting/guide.png')}
                  alt="modify"
                  style={{width: 24, height: 24}}
                />
              </ImageWrapper>

              <Text style={globalStyles.bold18}>사용 가이드</Text>
              <Image
                source={require('../assets/icons/goToIcon.png')}
                alt="modify"
                style={{width: 24, height: 24, marginLeft: 198}}
              />
            </MenuItem>

            <MenuItem>
              <ImageWrapper>
                <Image
                  source={require('../assets/setting/info.png')}
                  alt="modify"
                  style={{width: 24, height: 24}}
                />
              </ImageWrapper>

              <Text style={globalStyles.bold18}>버전</Text>
              <VersionText style={globalStyles.grayRegular16}>
                1.0.0v
              </VersionText>
            </MenuItem>

            <MenuItem onPress={kakaoLogout}>
              <ImageWrapper>
                <Image
                  source={require('../assets/setting/logout.png')}
                  alt="modify"
                  style={{width: 18, height: 18}}
                />
              </ImageWrapper>
              <Text style={globalStyles.bold18}>로그아웃</Text>
            </MenuItem>

            <MenuItem onPress={goToWithdrawal}>
              <ImageWrapper>
                <Image
                  source={require('../assets/setting/cancel.png')}
                  alt="modify"
                  style={{width: 24, height: 24}}
                />
              </ImageWrapper>
              <Text style={globalStyles.bold18}>회원 탈퇴</Text>
            </MenuItem>
          </MenuContainer>
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

const HeadContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const SearchIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const TopImage = styled.Image`
  width: 345px;
  height: 173px;
  margin-bottom: 10px;
`;

const MenuContainer = styled.View`
  width: 100%;
  display: flex;
  gap: 20px;
`;

const MenuItem = styled(TouchableOpacity)`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ImageWrapper = styled.View`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const VersionText = styled.Text`
  margin-left: 231px;
`;
