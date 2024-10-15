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
export default function UseGuideScreen() {
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
          <Text style={globalStyles.semibold16}>사용자 가이드</Text>
          <View style={{width: 15}} />
        </Header>
        <Container>
          <GuideConstiner>
            <GuideItem>
              <Text style={globalStyles.bold18}>카카오 로그인</Text>
              <Text style={globalStyles.grayRegular14}>
                들리담 서비스에 오신 걸 환영해요!
              </Text>
              <Text style={globalStyles.grayRegular14}>
                서비스를 시작하기 전에, 카카오 로그인을 진행해 주세요.
              </Text>
            </GuideItem>

            <GuideItem>
              <Text style={globalStyles.bold18}>회원 가입</Text>
              <Text style={globalStyles.grayRegular14}>
                들리담 서비스에 처음 오신 분의 경우,
              </Text>
              <Text style={globalStyles.grayRegular14}>
                간단한 내용 기입을 통해 들리담의 회원이 되어 주세요.
              </Text>
            </GuideItem>

            <GuideItem>
              <Text style={globalStyles.bold18}>주소록 및 친구 추가</Text>
              <Text style={globalStyles.grayRegular14}>
                아이디를 통해 친구 추가하고, 친구와 채팅할 수 있어요.
              </Text>
              <Text style={globalStyles.grayRegular14}>
                친구 목록에서는 내가 추가한 친구들의 목록을 볼 수 있답니다.
              </Text>
            </GuideItem>

            <GuideItem>
              <Text style={globalStyles.bold18}>채팅</Text>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  display: 'flex',
                  gap: 5,
                }}>
                <Text style={globalStyles.bold14}>TTS 기능</Text>
                <Text style={globalStyles.grayRegular14}>
                  들리담은 TTS, Text to Speech를 통해 사용자가 작성한 텍스트를
                  음성으로 바꿀 수 있어요.
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  display: 'flex',
                  gap: 5,
                }}>
                <Text style={globalStyles.bold14}>당신의 채팅을 음성으로</Text>
                <Text style={globalStyles.grayRegular14}>
                  실시간으로 채팅을 진행하며, 상대방은 청각 장애인 사용자의
                  채팅을 음성으로 들을 수 있어요.
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  display: 'flex',
                  gap: 5,
                }}>
                <Text style={globalStyles.bold14}>목소리 설정을 자유롭게</Text>
                <Text style={globalStyles.grayRegular14}>
                  자신의 텍스트를 음성으로 바꾸어 주는 목소리가 마음에 들지
                  않는다면 직접 원하는 목소리 음성 파일을 업로드하여 목소리를
                  변경할 수 있어요.
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  display: 'flex',
                  gap: 5,
                }}>
                <Text style={globalStyles.bold14}>나의 상태를 캐릭터로</Text>
                <Text style={globalStyles.grayRegular14}>
                  청각 장애인의 경우 프로필 사진이 헤드폰을 쓴 들리담 캐릭터로
                  표시돼요.
                </Text>
              </View>
            </GuideItem>

            <GuideItem>
              <Text style={globalStyles.bold18}>개인 정보 수정</Text>
              <Text style={globalStyles.grayRegular14}>
                서비스에 표시되는 이름, 한줄소개, 청각 장애 유무를 언제든지
                수정할 수 있어요.
              </Text>
            </GuideItem>
          </GuideConstiner>
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

const GuideConstiner = styled.View`
  width: 100%;
  display: flex;
  gap: 36px;
  margin-bottom: 30px;
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

const GuideItem = styled.View`
  width: 100%;
  display: flex;
  gap: 4px;
`;
