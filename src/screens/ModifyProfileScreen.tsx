import React from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {globalStyles} from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';
import {useState, useEffect} from 'react';
import {useUserStore} from '../store/useUserStore';

interface StatusButtonProps {
  isActive?: boolean;
}

interface MyInfo {
  customId: string;
  isDisabled: boolean;
  name: string;
  phoneNumber: string;
  voiceType: string | null;
}

export default function ModifyProfilescreen() {
  const navigation = useNavigation();
  const {userInfo, setUserInfo} = useUserStore();
  const [myInfo, setMyInfo] = useState<MyInfo>();
  console.log(userInfo);
  const [name, setName] = useState(myInfo?.name);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(myInfo?.isDisabled);
  const [voiceType, setVoiceType] = useState('MALE');

  console.log('myInfo', userInfo.name);

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  useEffect(() => {
    const getMyProfile = async () => {
      const token = await AsyncStorage.getItem('jwtAccessToken');
      try {
        const response = await api.get('/users/my-info', {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          console.log('내 정보 불러오기 성공!', response.data);
          setMyInfo(response.data);
          setIsDisabled(response.data.isDisabled);
          setName(response.data.name); // name 상태 업데이트
        }
      } catch (e) {
        console.log('Failed to get myProfile info.', e);
        console.log(e);
      }
    };

    getMyProfile();
  }, []);

  const handleSave = () => {
    if (myInfo) {
      const updatedInfo = {...myInfo, name, isDisabled, voiceType};
      setMyInfo(updatedInfo);
      console.log('Updated Info:', updatedInfo);
    }
  };

  const modifyProfile = async () => {
    // await handleSave();
    const updatedInfo = {...myInfo, name, isDisabled, voiceType};
    console.log('myinfo confirm', updatedInfo);
    const token = await AsyncStorage.getItem('jwtAccessToken');
    try {
      const response = await api.post('/users/my-info', updatedInfo, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 204) {
        console.log('내 정보 수정하기 성공!', response.data);
        setUserInfo(updatedInfo);
      }
    } catch (e) {
      console.log('Failed to get myProfile info.', e);
      console.log(e);
    }
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
          <Text style={globalStyles.semibold16}>개인 정보 수정</Text>
          <View style={{width: 3}} />
        </Header>
        <Container
          showsVerticalScrollIndicator={false} // 세로 스크롤바 숨기기
          showsHorizontalScrollIndicator={false} // 가로 스크롤바 숨기기
        >
          <Content>
            <InputSection>
              <InputLabel>아이디</InputLabel>
              <Text style={globalStyles.bold20}>{userInfo?.customId}</Text>
              <InputLabel>이름</InputLabel>
              <InputWrapper>
                <Input
                  value={name}
                  onChangeText={e => setName(e)}
                  placeholder={myInfo?.name}
                  placeholderTextColor="black"
                />
              </InputWrapper>

              <InputLabel>현재 비밀번호</InputLabel>
              <InputWrapper>
                <Input
                  value={phoneNumber}
                  onChangeText={e => setPhoneNumber(e)}
                  placeholder="기존 비밀번호를 입력해 주세요."
                  placeholderTextColor="#999"
                />
              </InputWrapper>

              <InputLabel>새 비밀번호</InputLabel>
              <InputWrapper>
                <Input
                  value={phoneNumber}
                  onChangeText={e => setPhoneNumber(e)}
                  placeholder="8~12 자리 영소문자, 숫자, 특수문자 조합"
                  placeholderTextColor="#999"
                />
              </InputWrapper>

              <InputLabel>비밀번호 확인</InputLabel>
              <InputWrapper>
                <Input
                  value={phoneNumber}
                  onChangeText={e => setPhoneNumber(e)}
                  placeholder="8~12 자리 영소문자, 숫자, 특수문자 조합"
                  placeholderTextColor="#999"
                />
              </InputWrapper>
            </InputSection>

            <StatusSection>
              <SectionLabel>청각 상태</SectionLabel>

              <ToggleSection>
                <StatusButtons>
                  <ActiveStatusButton
                    isActive={isDisabled === true}
                    onPress={() => setIsDisabled(true)}>
                    <ActiveStatusButtonText isActive={isDisabled === true}>
                      어려움이 있어요
                    </ActiveStatusButtonText>
                  </ActiveStatusButton>
                  <InactiveStatusButton
                    isActive={isDisabled === false}
                    onPress={() => {
                      setIsDisabled(false);
                      setVoiceType(null);
                    }}>
                    <InactiveStatusButtonText isActive={isDisabled === false}>
                      잘 들려요
                    </InactiveStatusButtonText>
                  </InactiveStatusButton>
                </StatusButtons>
                {/* {hearingCondition === true ? (
                  <Image
                    source={require('../assets/icons/voiceToggleIcon.png')}
                    alt="voice"
                    style={{width: 25, height: 25}}
                  />
                ) : (
                  <Image
                    source={require('../assets/icons/voiceToggleIcon2.png')}
                    alt="voice"
                    style={{width: 25, height: 25}}
                  />
                )} */}
              </ToggleSection>
              {/* {hearingCondition === true ? (
                <CheckboxContainer>
                  <SectionLabel>기본 목소리 설정</SectionLabel>
                  <CheckboxWrapper onPress={() => setGender('MALE')}>
                    <Checkbox isChecked={gender === 'MALE'}>
                      {gender === 'male' && <CheckMark>✓</CheckMark>}
                    </Checkbox>
                    <CheckboxLabel>남성</CheckboxLabel>
                  </CheckboxWrapper>
                  <CheckboxWrapper onPress={() => setGender('FEMALE')}>
                    <Checkbox isChecked={gender === 'FEMALE'}>
                      {gender === 'female' && <CheckMark>✓</CheckMark>}
                    </Checkbox>
                    <CheckboxLabel>여성</CheckboxLabel>
                  </CheckboxWrapper>
                </CheckboxContainer>
              ) : null} */}
              {isDisabled === true ? (
                <View style={{marginTop: 20}}>
                  <SectionLabel>목소리 설정</SectionLabel>
                  <CheckboxContainer>
                    <CheckboxWrapper onPress={() => setVoiceType('MALE')}>
                      <Checkbox isChecked={voiceType === 'MALE'}>
                        {voiceType === 'MALE' && <CheckMark>✓</CheckMark>}
                      </Checkbox>
                      <CheckboxLabel>남성</CheckboxLabel>
                    </CheckboxWrapper>
                    <CheckboxWrapper onPress={() => setVoiceType('FEMALE')}>
                      <Checkbox isChecked={voiceType === 'FEMALE'}>
                        {voiceType === 'FEMALE' && <CheckMark>✓</CheckMark>}
                      </Checkbox>
                      <CheckboxLabel>여성</CheckboxLabel>
                    </CheckboxWrapper>
                  </CheckboxContainer>
                </View>
              ) : null}
            </StatusSection>
          </Content>
          <StartButton isActive={true} onPress={modifyProfile}>
            <StartButtonText isActive={true} style={globalStyles.semibold}>
              변경하기
            </StartButtonText>
          </StartButton>
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

const Content = styled.ScrollView`
  flex: 1;
`;

const InputSection = styled.View`
  margin-top: 10px;
  display: flex;
  gap: 11px;
`;

const InputLabel = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 40px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

const SectionLabel = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StartButton = styled.TouchableOpacity<{isActive: boolean}>`
  background-color: ${props => (props.isActive ? 'black' : '#f2f2f2')};
  padding: 15px 0;
  align-items: center;
  border-radius: 5px;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const StartButtonText = styled.Text<{isActive: boolean}>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => (props.isActive ? 'white' : 'black')};
`;

const StatusSection = styled.View`
  margin-top: 20px;
`;

const StatusButtons = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`;

const StatusButton = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 10px;
  margin-right: 10px;
`;

const ActiveStatusButton = styled(StatusButton)<StatusButtonProps>`
  background-color: black;
  background-color: ${props => (props.isActive ? 'black' : 'white')};
`;

const InactiveStatusButton = styled(StatusButton)<StatusButtonProps>`
  background-color: #f0f0f0;
  background-color: ${props => (props.isActive ? 'black' : 'white')};
`;

const StatusButtonText = styled.Text<StatusButtonProps>`
  font-weight: bold;
  color: ${props => (props.isActive ? 'white' : '#888')};
`;

const ActiveStatusButtonText = styled(StatusButtonText)<StatusButtonProps>``;

const InactiveStatusButtonText = styled(StatusButtonText)<StatusButtonProps>``;

const ToggleSection = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxContainer = styled.View`
  display: flex;
  justify-content: flex-start;
`;

const CheckboxWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
`;

const Checkbox = styled.View<{isChecked: boolean}>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${props => (props.isChecked ? 'black' : '#ccc')};
  background-color: white;
  margin-right: 8px;
  margin-top: 5px;
  justify-content: center;
  align-items: center;
`;

const CheckMark = styled.Text`
  color: black;
  font-size: 14px;
  font-weight: bold;
`;

const CheckboxLabel = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  color: #333;
`;
