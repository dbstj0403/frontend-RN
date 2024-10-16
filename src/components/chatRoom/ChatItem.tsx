import React from 'react';
import {Image, Text, View, Alert, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  ChattingRoom: {roomId: string; name: string};
  // 다른 스크린들도 여기에 추가...
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChattingRoom'>;

type Room = {
  chatRoomId: string;
  partnerName: string;
  lastChatMessage?: string;
};

export default function ChatItem({
  room,
  leaveChatRoom,
}: {
  room: Room;
  leaveChatRoom: (roomId: string) => void;
}) {
  const navigation = useNavigation<NavigationProp>();

  const moveToChattingRoom = () => {
    navigation.navigate('ChattingRoom', {
      roomId: room.chatRoomId,
      name: room.partnerName,
    });
  };

  const handleLongPress = () => {
    Alert.alert(
      '채팅방 나가기',
      `${room.partnerName}님과의 채팅방에서 나가시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '나가기',
          onPress: () => leaveChatRoom(room.chatRoomId),
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <Container
      onPress={moveToChattingRoom}
      onLongPress={handleLongPress}
      delayLongPress={500}>
      <Image
        source={require('../../assets/icons/profileImg.png')}
        alt="profile"
        style={{width: 40, height: 40, marginRight: 10}}
      />
      <ContentContainer>
        <NameText style={globalStyles.bold18}>{room.partnerName}</NameText>
        <MessageText style={globalStyles.grayRegular16}>
          {room.lastChatMessage
            ? room.lastChatMessage
            : '마지막 메세지가 없습니다.'}
        </MessageText>
      </ContentContainer>
    </Container>
  );
}

const Container = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
`;

const ContentContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const NameText = styled.Text`
  margin-bottom: 5px;
`;

const MessageText = styled.Text`
  color: #888;
`;
