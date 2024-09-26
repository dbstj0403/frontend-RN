import React, {useEffect, useState, useRef} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {TouchableOpacity, Text, TextInput, FlatList} from 'react-native';
import styled from 'styled-components/native';
import io, {Socket} from 'socket.io-client';
import {CHAT_ENDPOINT} from 'react-native-dotenv';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Main: undefined;
  ChattingRoom: {roomId: string};
};

type ChattingRoomRouteProp = RouteProp<RootStackParamList, 'ChattingRoom'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'ChattingRoom'>;

type Message = {
  senderId: string;
  message: string;
  roomId: string;
};

export default function ChattingRoomScreen() {
  const route = useRoute<ChattingRoomRouteProp>();
  const {roomId} = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('채팅룸 입장 후 소켓연결 시도@@!', roomId);
    socketRef.current = io(CHAT_ENDPOINT, {
      query: {
        chatRoomId: roomId,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server with roomId:', roomId);
    });

    socketRef.current.on('messageData', receiveMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('MessageData', receiveMessage);
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() !== '' && socketRef.current) {
      console.log(message, 'message');
      socketRef.current.emit('textMessage', message, 'dbstj0403', roomId);
      console.log('send message as ', message);
      setMessage('');
    }
  };

  const receiveMessage = (res: Message) => {
    console.log('Received message:', res);
    setMessageList(prev => [...prev, res]);
  };

  const renderItem = ({item}: {item: Message}) => (
    <MessageItem>
      <Text>
        {item.senderId}: {item.message}
      </Text>
    </MessageItem>
  );

  const moveToBack = () => {
    navigation.navigate('Main');
  };

  return (
    <Container>
      <Text>안녕하세요! 채팅방에 오신 걸 환영합니당~~ 😽 RoomId: {roomId}</Text>
      <TouchableOpacity onPress={moveToBack}>
        <Text>뒤로 가기</Text>
      </TouchableOpacity>
      <ChatContainer>
        <FlatList
          data={messageList}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </ChatContainer>
      <InputContainer>
        <StyledTextInput
          placeholder="메세지를 입력해 주세요."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor="#999"
        />
        <SendButton onPress={sendMessage}>
          <SendButtonText>전송</SendButtonText>
        </SendButton>
      </InputContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
  margin-top: 50px;
`;

const ChatContainer = styled.View`
  flex: 1;
  margin-bottom: 10px;
`;

const MessageItem = styled.View`
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 5px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-right: 10px;
`;

const SendButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 5px;
`;

const SendButtonText = styled.Text`
  color: white;
`;
