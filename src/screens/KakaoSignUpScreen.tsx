import React from 'react';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../styles/globalStyles';
import api from '../api/config';

interface StatusButtonProps {
  isActive?: boolean;
}

export default function KakaoSignUpScreen({navigation}) {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [hearingCondition, setHearingCondition] = useState<boolean>(false);
  const [gender, setGender] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(true);

  const isFormFilled = () => {
    return (
      id !== '' &&
      name !== '' &&
      phoneNumber !== '' &&
      hearingCondition !== null
    );
  };

  const checkIdDuplication = async () => {
    console.log(id);
    const token = await AsyncStorage.getItem('jwtAccessToken');
    console.log(token);
    try {
      const response = await api.post(
        '/users/validate',
        {customId: id},
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 200) {
        if (response.data.isAvailable === true) {
          setIsDuplicate(false);
          // 아이디가 사용 가능한 경우의 처리
          Alert.alert(
            '확인',
            '사용 가능한 아이디입니다.',
            [{text: '확인', onPress: () => console.log('확인')}],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            '중복 아이디',
            '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.',
            [{text: '확인', onPress: () => console.log('확인')}],
            {cancelable: false},
          );
        }
      }
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 403) {
        // 403 상태 코드인 경우 (아이디 중복)
        Alert.alert(
          '중복 아이디',
          '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.',
          [{text: '확인', onPress: () => console.log('확인')}],
          {cancelable: false},
        );
      } else {
        // 기타 오류 처리
        console.log(error.response.status);
        Alert.alert(
          '오류',
          '아이디 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
          [{text: '확인', onPress: () => console.log('확인')}],
          {cancelable: false},
        );
      }
    }
  };

  const submit = async () => {
    const token = await AsyncStorage.getItem('jwtAccessToken');
    if (isDuplicate) {
      Alert.alert(
        '오류',
        '아이디 중복 확인을 해 주세요!',
        [{text: '확인', onPress: () => console.log('확인')}],
        {cancelable: false},
      );
    }
    if (!isFormFilled()) {
      Alert.alert(
        '오류',
        '비었거나 형식이 맞지 않는 항목이 있습니다. 다시 입력해 주세요.',
        [{text: '확인', onPress: () => console.log('확인')}],
        {cancelable: false},
      );
    }
    try {
      console.log(id, name, phoneNumber, hearingCondition, gender);
      const response = await api.post(
        '/users/my-info',
        {
          customId: id,
          name: name,
          phoneNumber: phoneNumber,
          isDisabled: hearingCondition,
          voiceType: gender,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 204) {
        console.log('회원가입 성공!');
        navigation.replace('Main');
      }
      console.log(response.status);
    } catch (e) {
      console.log(e);
      Alert.alert(
        '오류',
        '회원가입 과정 중 오류가 발생했습니다. 다시 시도해 주세요.',
        [{text: '확인', onPress: () => console.log('확인')}],
        {cancelable: false},
      );
    }
  };

  const moveToLogin = () => {
    navigation.replace('Login');
  };

  const goToFriendsListScreen = () => {
    navigation.replace('FriendsList');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <Header>
          <TouchableOpacity onPress={moveToLogin}>
            <Image
              source={require('../assets/icons/backwardIcon.png')}
              alt="Login"
              style={{width: 7.4, height: 12}}
            />
          </TouchableOpacity>
          <Text style={globalStyles.semibold16}>회원가입</Text>
          <View style={{width: 5}}></View>
        </Header>

        <Content>
          <Text style={globalStyles.bold20}>모두를 위한 통화,</Text>
          <Text style={globalStyles.bold20}>들리담과 함께 시작해요.</Text>

          <InputSection>
            <InputLabel>아이디</InputLabel>
            <InputWrapper>
              <Input
                value={id}
                onChangeText={e => setId(e)}
                placeholder="아이디를 입력해 주세요."
                placeholderTextColor="#999"
              />
              <VerifyButton onPress={checkIdDuplication}>
                <VerifyButtonText>중복 확인</VerifyButtonText>
              </VerifyButton>
            </InputWrapper>

            <InputLabel>이름</InputLabel>
            <InputWrapper>
              <Input
                value={name}
                onChangeText={e => setName(e)}
                placeholder="이름을 입력해 주세요."
                placeholderTextColor="#999"
              />
            </InputWrapper>

            <InputLabel>핸드폰 번호</InputLabel>
            <InputWrapper>
              <Input
                value={phoneNumber}
                onChangeText={e => setPhoneNumber(e)}
                placeholder="01012345678"
                placeholderTextColor="#999"
              />
              <VerifyButton>
                <VerifyButtonText>인증 받기</VerifyButtonText>
              </VerifyButton>
            </InputWrapper>
          </InputSection>

          <StatusSection>
            <SectionLabel>청각 상태</SectionLabel>

            <ToggleSection>
              <StatusButtons>
                <ActiveStatusButton
                  isActive={hearingCondition === true}
                  onPress={() => setHearingCondition(true)}>
                  <ActiveStatusButtonText isActive={hearingCondition === true}>
                    어려움이 있어요
                  </ActiveStatusButtonText>
                </ActiveStatusButton>
                <InactiveStatusButton
                  isActive={hearingCondition === false}
                  onPress={() => setHearingCondition(false)}>
                  <InactiveStatusButtonText
                    isActive={hearingCondition === false}>
                    잘 들려요
                  </InactiveStatusButtonText>
                </InactiveStatusButton>
              </StatusButtons>
              {hearingCondition === true ? (
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
              )}
            </ToggleSection>
            {hearingCondition === true ? (
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
            ) : null}
          </StatusSection>
        </Content>
        <StartButton isActive={isFormFilled()} onPress={submit}>
          <StartButtonText isActive={isFormFilled()}>시작하기</StartButtonText>
        </StartButton>
      </Container>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const InputSection = styled.View`
  margin-top: 30px;
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

const VerifyButton = styled.TouchableOpacity`
  background-color: #f2f2f2;
  padding: 5px 10px;
  border-radius: 5px;
  position: absolute;
  right: 0;
`;

const VerifyButtonText = styled.Text`
  color: #666666;
  font-size: 12px;
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
  margin-top: 10px;
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
