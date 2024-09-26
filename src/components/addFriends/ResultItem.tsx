import React from 'react';
import {Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import api from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReslutItem({
  id,
  name,
  statusMessage,
}: {
  id: string;
  name: string;
  statusMessage: string;
}) {
  const addFriend = async () => {
    const token = await AsyncStorage.getItem('jwtAccessToken');
    console.log(token, id);
    try {
      const response = await api.post(
        '/friend/add',
        {customId: id},
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 200) {
        console.log('친구 추가 성공!');
        console.log(response.data);
        if (response.data.isSuccess === false) {
          Alert.alert(
            '알림',
            '이미 친구인 사용자입니다.',
            [{text: '확인', onPress: () => console.log('확인')}],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            '완료',
            '친구 추가가 완료되었습니다!',
            [{text: '확인', onPress: () => console.log('확인')}],
            {cancelable: false},
          );
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert(
        '오류',
        '친구 추가에 실패하였습니다.\n다시 시도해 주세요.',
        [{text: '확인', onPress: () => console.log('확인')}],
        {cancelable: false},
      );
    }
  };
  return (
    <>
      <Container>
        <Image
          source={require('../../assets/icons/profileImg.png')}
          alt="profile"
          style={{width: 35, height: 35, marginRight: 15}}
        />
        <NameText style={globalStyles.bold18}>{name}</NameText>
        <Text style={globalStyles.grayRegular16}>{statusMessage}</Text>
        <TouchableOpacity onPress={addFriend}>
          <Text>친구 추가</Text>
        </TouchableOpacity>
      </Container>
    </>
  );
}

const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const NameText = styled.Text`
  margin-right: 10;
`;
