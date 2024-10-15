import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useUserStore} from '../../store/useUserStore';
import api from '../../api/config';

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
}: {
  id: string;
  name: string;
  statusMessage: string;
  isDisabled: boolean;
  isFavorite: boolean;
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userInfo} = useUserStore();

  const toggleFavorite = () => {};

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
          <Pressable>
            <Image
              source={require('../../assets/icons/favoriteIcon.png')}
              alt="favorite"
              style={{width: 20, height: 19, marginBottom: 10}}
            />
          </Pressable>
        ) : (
          <Pressable>
            <Image
              source={require('../../assets/icons/notFavoriteIcon.png')}
              alt="notFavorite"
              style={{width: 20, height: 19, marginBottom: 10}}
            />
          </Pressable>
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
