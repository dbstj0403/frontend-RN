import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {useUserStore} from '../store/useUserStore';
import {useRoute} from '@react-navigation/native';
import api from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ModifyMyProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, name, statusMessage} = route.params as {
    id: string;
    name: string;
    statusMessage: string;
  };

  const [customName, setCustomName] = useState(name);
  const [customStatusMessage, setCustomStatusMessage] = useState(statusMessage);

  const {userInfo, setUserInfo} = useUserStore();

  const moveToMyProfile = () => {
    navigation.goBack();
  };

  const changeProfile = async () => {
    const updatedInfo = {
      ...userInfo,
      name: customName,
      statusMessage: customStatusMessage,
    };
    console.log('myinfo confirm', updatedInfo);
    const token = await AsyncStorage.getItem('jwtAccessToken');
    try {
      const response = await api.post(
        '/users/profile',
        {
          name: customName,
          statusMessage: customStatusMessage,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 204) {
        console.log('내 정보 수정하기 성공!', response.data);
        Alert.alert(
          '알림',
          '정보 수정이 성공적으로 완료되었습니다.',
          [{text: '확인', onPress: () => console.log('확인')}],
          {cancelable: false},
        );
        setUserInfo(updatedInfo);
      }
    } catch (e) {
      console.log('Failed to change myProfile info.', e);
      console.log(e);
    }
  };
  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Header>
          <TouchableOpacity onPress={moveToMyProfile}>
            <Image
              source={require('../assets/icons/xIcon.png')}
              alt="Backward"
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeProfile}>
            <Image
              source={require('../assets/icons/checkIcon.png')}
              alt="complete"
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        </Header>
        <Container>
          <InputContainer>
            <NameInput
              value={customName}
              onChangeText={setCustomName}
              maxLength={6}
            />
            <CounterText>({name.length}/6)</CounterText>
          </InputContainer>
          <InputContainer>
            <StatusInput
              value={customStatusMessage}
              onChangeText={setCustomStatusMessage}
              multiline
              numberOfLines={2}
              maxLength={24}
            />
            <CounterText>({statusMessage.length}/24)</CounterText>
          </InputContainer>
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
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-horizontal: 20px;
`;

const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const NameInput = styled(TextInput)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const StatusInput = styled(TextInput)`
  font-size: 16px;
  text-align: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const CounterText = styled.Text`
  font-size: 12px;
  color: gray;
  align-self: flex-end;
  margin-top: 5px;
`;
