import React from 'react';
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
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
  removeFriendFromList,
}: {
  id: string;
  name: string;
  statusMessage: string;
  isDisabled: boolean;
  isFavorite: boolean;
  updateFriendsList: () => void;
  updateFriendStatus: (friendId: string, isFavorite: boolean) => void;
  removeFriendFromList: (friendId: string) => void;
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

  const moveToMyProfile = () => {
    navigation.navigate('MyProfile', {
      id,
      name,
      statusMessage,
      isDisabled,
    });
  };

  const handleLongPress = () => {
    Alert.alert(
      '친구 삭제',
      `${name}님을 친구 목록에서 삭제하시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: deleteFriend, style: 'destructive'},
      ],
      {cancelable: true},
    );
  };

  const deleteFriend = async () => {
    const token = await AsyncStorage.getItem('jwtAccessToken');
    console.log(id);
    try {
      const response = await api.delete('/friend/delete', {
        headers: {
          Authorization: token,
        },
        data: {
          customId: id,
        },
      });
      if (response.status === 204) {
        console.log('친구 삭제 완료!', response.data);
        removeFriendFromList(id); // 즉시 UI에서 친구 제거
        updateFriendsList(); // 백그라운드에서 전체 목록 업데이트
      }
    } catch (e: any) {
      console.log('친구 삭제 실패:', e);
      Alert.alert('오류', '친구를 삭제하는데 실패했습니다.');
    }
  };

  if (id === userInfo?.customId) {
    return (
      <Pressable onPress={moveToMyProfile}>
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
    <Pressable
      onPress={moveToProfile}
      onLongPress={handleLongPress}
      delayLongPress={500}>
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
