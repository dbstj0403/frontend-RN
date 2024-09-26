import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation, NavigationProp} from '@react-navigation/native';

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
}: {
  id: string;
  name: string;
  statusMessage: string;
  isDisabled: boolean;
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const moveToProfile = () => {
    navigation.navigate('FriendsProfile', {
      id,
      name,
      statusMessage,
      isDisabled,
    });
  };
  return (
    <Pressable onPress={moveToProfile}>
      <Container>
        <Image
          source={require('../../assets/icons/profileImg.png')}
          alt="profile"
          style={{width: 35, height: 35, marginRight: 15}}
        />
        <NameText style={globalStyles.bold18}>{name}</NameText>
        <Text style={globalStyles.grayRegular16}>{statusMessage}</Text>
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
`;

const NameText = styled.Text`
  margin-right: 10;
`;
