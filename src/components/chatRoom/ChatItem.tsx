import React from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// 네비게이션 파라미터 타입 정의
type RootStackParamList = {
  ChattingRoom: {roomId: string; name: string};
  // 다른 스크린들도 여기에 추가...
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChattingRoom'>;

// room prop의 타입을 명시적으로 정의
type Room = {
  chatRoomId: string;
  partnerName: string;
  lastChatMessage?: string;
};

export default function ChatItem({room}: {room: Room}) {
  const navigation = useNavigation<NavigationProp>();

  const moveToChattingRoom = () => {
    navigation.navigate('ChattingRoom', {
      roomId: room.chatRoomId,
      name: room.partnerName,
    });
  };

  return (
    <>
      <Container onPress={moveToChattingRoom}>
        <Image
          source={require('../../assets/icons/profileImg.png')}
          alt="profile"
          style={{width: 40, height: 40, marginRight: 10}}
        />
        <ContentContainer>
          <Text style={globalStyles.bold18}>{room.partnerName}</Text>
          <Text style={globalStyles.grayRegular16}>
            {room.lastChatMessage
              ? room.lastChatMessage
              : '마지막 메세지가 없습니다.'}
          </Text>
        </ContentContainer>
      </Container>
    </>
  );
}

const Container = styled.TouchableOpacity`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 50px;
`;

const ContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  height: 50px;
  justify-content: space-between;
`;
