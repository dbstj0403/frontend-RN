import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/config';
import {useNavigation} from '@react-navigation/native';

export default function FriendSearchItem({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const navigation = useNavigation();
  const createChatRoom = async () => {
    const token = await AsyncStorage.getItem('jwtAccessToken');
    try {
      const response = await api.post(
        '/chat/connect',
        {
          friendId: id,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 200) {
        console.log('roomId', response.data.chatRoomId);
        console.log('Create Chatting room successfully! data: ', response.data);
        navigation.navigate('ChattingRoom', {roomId: response.data.chatRoomId});
      }
    } catch (e) {
      console.log('failed to create chatting room!', e);
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
        <TouchableOpacity onPress={createChatRoom}>
          <Text>선택</Text>
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
  margin-right: 10px;
`;
