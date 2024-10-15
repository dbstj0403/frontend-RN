import React from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useUserStore} from '../../store/useUserStore';
import api from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  FriendsProfile: {
    id: string;
    name: string;
    statusMessage: string;
    isDisabled: boolean;
  };
};

export default function ListItem({
  id,
  name,
  statusMessage,
  isDisabled,
  isFavorite,
  updateFriendsList,
  updateFriendStatus,
}: {
  id: string;
  name: string;
  statusMessage: string;
  isDisabled: boolean;
  isFavorite: boolean;
  updateFriendsList: () => void;
  updateFriendStatus: (friendId: string, isFavorite: boolean) => void;
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userInfo} = useUserStore();

  const toggleFavorite = async () => {
    const token = await AsyncStorage.getItem('jwtAccessToken');
    try {
      const response = await api.post(
        '/friend/favorite',
        {customId: id},
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (response.status === 204) {
        console.log('toggle complete!', response.data);
        updateFriendStatus(id, !isFavorite); // 즉시 UI 업데이트
        updateFriendsList(); // 백그라운드에서 전체 목록 업데이트
      }
    } catch (e: any) {
      console.log(e);
      if (e.response && e.response.status === 500) {
        console.log('error', e);
      }
    }
  };

  const moveToProfile = () => {
    navigation.navigate('FriendsProfile', {
      id,
      name,
      statusMessage,
      isDisabled,
    });
  };

  if (id === userInfo?.customId) {
    return (
      <Pressable onPress={moveToProfile}>
        <Container>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Image
              source={require('../../assets/icons/profileImg.png')}
              alt="profile"
              style={{width: 35, height: 35, marginRight: 15}}
            />
            <NameText style={globalStyles.bold18}>{name}</NameText>
            <StatusText style={globalStyles.grayRegular16}>
              {statusMessage ? statusMessage : '상태 메세지가 없습니다.'}
            </StatusText>
          </View>
        </Container>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={moveToProfile}>
      <Container>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Image
            source={require('../../assets/icons/profileImg.png')}
            alt="profile"
            style={{width: 35, height: 35, marginRight: 15}}
          />
          <NameText style={globalStyles.bold18}>{name}</NameText>
          <StatusText style={globalStyles.grayRegular16}>
            {statusMessage ? statusMessage : '상태 메세지가 없습니다.'}
          </StatusText>
        </View>

        {isFavorite ? (
          <TouchableOpacity onPress={toggleFavorite}>
            <Image
              source={require('../../assets/icons/favoriteIcon.png')}
              alt="favorite"
              style={{width: 20, height: 19, marginBottom: 10}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleFavorite}>
            <Image
              source={require('../../assets/icons/notFavoriteIcon.png')}
              alt="notFavorite"
              style={{width: 20, height: 19, marginBottom: 10}}
            />
          </TouchableOpacity>
        )}
      </Container>
    </Pressable>
  );
}

const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const NameText = styled.Text`
  margin-right: 10px;
  margin-top: 3px;
`;

const StatusText = styled.Text`
  margin-top: 5px;
`;
