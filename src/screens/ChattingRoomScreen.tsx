import React, {useEffect, useState, useRef} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import io, {Socket} from 'socket.io-client';
import {CHAT_ENDPOINT} from 'react-native-dotenv';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {globalStyles} from '../styles/globalStyles';

type RootStackParamList = {
  Main: undefined;
  ChattingRoom: {roomId: string};
};

type ChattingRoomRouteProp = RouteProp<RootStackParamList, 'ChattingRoom'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'ChattingRoom'>;

type Message = {
  senderId: string;
  message: string;
  chatRoomId: string;
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
      console.log('message', message);
      socketRef.current.emit(
        'textMessage',
        JSON.stringify({
          chatRoomId: roomId,
          message,
          senderId: 'dbstj0403',
        }),
      );
      setMessage('');
    }
  };

  const receiveMessage = (res: Message) => {
    console.log('Received message:', res);
    setMessageList(prev => [...prev, res]);
  };

  // const renderItem = ({item}: {item: Message}) => (
  //   <MessageItem>
  //     <Text>
  //       {item.senderId}: {item.message}
  //     </Text>
  //   </MessageItem>
  // );

  const renderItem = ({item}: {item: Message}) => {
    const isMe = item.senderId === 'dbstj0403';
    return (
      <MessageContainer isMe={isMe}>
        {!isMe && (
          <ProfileImage source={require('../assets/icons/profileImg.png')} />
        )}
        <MessageBubble isMe={isMe}>
          <MessageText style={globalStyles.regular16} isMe={isMe}>
            {item.message}
          </MessageText>
        </MessageBubble>
      </MessageContainer>
    );
  };

  const moveToBack = () => {
    navigation.navigate('ChatRoomList');
  };

  return (
    <Container>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Header>
          <TouchableOpacity onPress={moveToBack}>
            <Image
              source={require('../assets/icons/backwardIcon.png')}
              alt="Login"
              style={{width: 7.4, height: 12}}
            />
          </TouchableOpacity>
          <Name style={globalStyles.semibold16}>최석환</Name>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Image
              source={require('../assets/icons/searchIcon.png')}
              alt="search"
              style={{width: 24, height: 24}}
            />
            <Image
              source={require('../assets/icons/menuIcon.png')}
              alt="search"
              style={{width: 24, height: 24, marginLeft: 5}}
            />
          </View>
        </Header>
        {/* <Text>RoomId: {roomId}</Text> */}
        <ChatContainer>
          <FlatList
            data={messageList}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
          />
        </ChatContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <InputContainer>
            <AttachmentButton>
              <Image
                source={require('../assets/icons/attachmentIcon.png')}
                style={{width: 24, height: 24}}
              />
            </AttachmentButton>
            <StyledTextInput
              placeholder="메세지를 입력해 주세요."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#999"
            />
            <SendButton onPress={sendMessage}>
              <Image
                source={require('../assets/icons/sendIcon.png')}
                style={{width: 12, height: 13}}
              />
            </SendButton>
          </InputContainer>
        </KeyboardAvoidingView>
      </SafeAreaContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Name = styled.Text`
  margin-left: 50px;
`;

const ChatContainer = styled.ScrollView`
  flex: 1;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const MessageItem = styled.View`
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 5px;
`;

// const InputContainer = styled.View`
//   flex-direction: row;
//   align-items: center;
// `;

// const StyledTextInput = styled.TextInput`
//   flex: 1;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   padding: 10px;
//   margin-right: 10px;
// `;

// const SendButton = styled.TouchableOpacity`
//   background-color: #007bff;
//   padding: 10px;
//   border-radius: 5px;
// `;

// const SendButtonText = styled.Text`
//   color: white;
// `;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-color: #dfdfdf;
  padding-horizontal: 20px;
`;

const MessageContainer = styled.View<{isMe: boolean}>`
  flex-direction: ${props => (props.isMe ? 'row-reverse' : 'row')};
  margin-bottom: 10px;
  padding-horizontal: 10px;
  align-items: flex-end;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
`;

const MessageBubble = styled.View<{isMe: boolean}>`
  background-color: ${props => (props.isMe ? 'white' : 'black')};
  padding: 10px;
  border-radius: 4px;
  max-width: 70%;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

const MessageText = styled.Text<{isMe: boolean}>`
  color: ${props => (props.isMe ? '#666666' : 'white')};
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

const AttachmentButton = styled.TouchableOpacity`
  padding: 5px;
  margin-right: 10px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  color: #333;
`;

const SendButton = styled.TouchableOpacity`
  padding: 5px;
  margin-left: 10px;
`;
