import React, {useEffect, useState, useRef} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {
  TouchableOpacity,
  Text,
  FlatList,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import io, {Socket} from 'socket.io-client';
import {CHAT_ENDPOINT} from 'react-native-dotenv';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {globalStyles} from '../styles/globalStyles';
import api from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserStore} from '../store/useUserStore';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
// import {encode} from 'react-native-quick-base64';
// import {decode} from 'react-native-quick-base64';
import {Buffer} from 'buffer'; // Buffer 모듈 사용

type RootStackParamList = {
  Main: undefined;
  ChattingRoom: {roomId: string; name: string};
};

type ChattingRoomRouteProp = RouteProp<RootStackParamList, 'ChattingRoom'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'ChattingRoom'>;

type Message = {
  senderId: string;
  message: string | ArrayBuffer;
  chatRoomId: string;
  isAudio: boolean;
  audioFileId?: string; // 오디오 파일 ID 추가
};

export default function ChattingRoomScreen() {
  const route = useRoute<ChattingRoomRouteProp>();
  const {roomId} = route.params;
  const {name} = route.params;
  const navigation = useNavigation<NavigationProp>();
  const {userInfo, setUserInfo} = useUserStore();

  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [currentAudio, setCurrentAudio] = useState<Sound | null>(null);

  const audioDirectory = `${RNFS.DocumentDirectoryPath}/audioMessages`;

  // 컴포넌트 마운트 시 오디오 디렉토리 생성
  useEffect(() => {
    const setupAudioDirectory = async () => {
      try {
        const exists = await RNFS.exists(audioDirectory);
        if (!exists) {
          await RNFS.mkdir(audioDirectory);
        }
      } catch (error) {
        console.error('Error creating audio directory:', error);
      }
    };
    setupAudioDirectory();

    // 컴포넌트 언마운트 시 오디오 파일 정리
    return () => {
      cleanupAudioFiles();
    };
  }, []);

  const cleanupAudioFiles = async () => {
    try {
      const files = await RNFS.readDir(audioDirectory);
      await Promise.all(files.map(file => RNFS.unlink(file.path)));
    } catch (error) {
      console.error('Error cleaning up audio files:', error);
    }
  };

  const saveAudioFile = async (base64Audio: string): Promise<string> => {
    // null 체크 추가
    if (!base64Audio) {
      throw new Error('Audio data is empty');
    }

    const audioId = `audio_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const filePath = `${audioDirectory}/${audioId}.wav`;

    try {
      await RNFS.writeFile(filePath, base64Audio, 'base64');
      return audioId;
    } catch (error) {
      console.error('Error saving audio file:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getMessageList = async () => {
      const token = await AsyncStorage.getItem('jwtAccessToken');
      try {
        const response = await api.get(`/chat/${roomId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          console.log(response.data);
          // messageDTOS를 messageList state에 저장
          setMessageList(
            response.data.messageDTOS.map((msg: any) => ({
              senderId: msg.senderName, // 여기서는 senderName을 senderId로 사용
              message: msg.message,
              createdAt: msg.createdAt,
              isAudio: false, // 오디오 메시지 여부는 서버 응답에 따라 조정 필요
            })),
          );
        }
      } catch (e: any) {
        console.log(e);
        if (e.response && e.response.status === 500) {
          console.log('no users!');
        }
      }
    };
    getMessageList();
  }, [roomId]);

  // 메시지 발신자가 현재 사용자인지 확인하는 함수
  const isCurrentUser = (senderId: string) => {
    return senderId === userInfo.name || senderId === userInfo.customId;
  };

  useEffect(() => {
    console.log('채팅룸 입장 후 소켓연결 시도!', roomId);
    socketRef.current = io(CHAT_ENDPOINT, {
      query: {
        chatRoomId: roomId,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server with roomId:', roomId);
    });

    socketRef.current.on('messageData', receiveMessage);

    socketRef.current.on('audioData', receiveAudioMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('MessageData', receiveMessage);
        socketRef.current.disconnect();
      }

      if (currentAudio) {
        currentAudio.release();
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() !== '' && socketRef.current) {
      // 새 메시지 객체 생성
      const newMessage: Message = {
        senderId: userInfo.customId, // 또는 userInfo.name
        message: message.trim(),
        chatRoomId: roomId,
        isAudio: false,
      };

      // 화면에 먼저 메시지 추가
      setMessageList(prev => [...prev, newMessage]);

      console.log(message);

      // 서버로 메시지 전송
      socketRef.current.emit(
        'textMessage',
        JSON.stringify({
          chatRoomId: roomId,
          message: message.trim(),
          senderId: userInfo?.customId,
        }),
      );

      // 입력창 비우기
      setMessage('');
    }
  };

  // const receiveMessage = (res: Message) => {
  //   console.log('Received message:', res);
  //   setMessageList(prev => [...prev, res]);
  // };

  const receiveMessage = (res: Message) => {
    console.log('Received message:', res);
    // ArrayBuffer를 Base64 문자열로 변환하여 저장
    const processedMessage =
      res.message instanceof ArrayBuffer
        ? {
            ...res,
            message: arrayBufferToBase64(res.message),
            isAudio: true,
          }
        : {...res, isAudio: false};
    setMessageList(prev => [...prev, processedMessage]);
  };

  // const receiveAudioMessage = (res: any) => {
  //   console.log('Received audio message:', res);

  //   const processedMessage = {
  //     ...res,
  //     message: message, // 서버에서 받은 message를 그대로 사용
  //     isAudio: true,
  //   };

  //   console.log('Processed audio message:', processedMessage.message);
  //   setMessageList(prev => [...prev, processedMessage]);
  // };

  const receiveAudioMessage = async (res: any) => {
    console.log(res);
    try {
      // 오디오 데이터를 파일로 저장하고 ID 받기
      const audioId = await saveAudioFile(res);

      const audioMessage: Message = {
        senderId: userInfo.customId,
        message: '음성 메시지',
        chatRoomId: roomId,
        isAudio: true,
        audioFileId: audioId,
      };

      setMessageList(prev => [...prev, audioMessage]);
    } catch (error) {
      console.error('Error processing audio message:', error);
    }
  };

  // const playAudio = async (audioData: string) => {
  //   console.log(
  //     'Playing audio data (first 100 chars):',
  //     audioData.substring(0, 100) + '...',
  //   );
  //   if (!audioData || audioData.length === 0) {
  //     console.error('Invalid audio data');
  //     return;
  //   }

  //   if (currentAudio) {
  //     currentAudio.stop();
  //     currentAudio.release();
  //   }

  //   // 1. Base64 데이터를 파일로 저장할 경로 설정
  //   const filePath = `${
  //     RNFS.DocumentDirectoryPath
  //   }/temp_audio_${Date.now()}.mp3`;

  //   try {
  //     // 2. Base64 데이터를 로컬 파일로 저장
  //     await RNFS.writeFile(filePath, audioData, 'base64');
  //     console.log(`Audio file saved at path: ${filePath}`);

  //     // 3. 파일 내용 확인 (디버깅용)
  //     const fileContents = await RNFS.readFile(filePath, 'base64');
  //     console.log(
  //       'Saved file content (first 100 chars):',
  //       fileContents.substring(0, 100),
  //     );

  //     // 4. Sound 객체를 사용하여 파일 경로로 재생
  //     const sound = new Sound(filePath, '', error => {
  //       if (error) {
  //         console.error('Failed to load the sound', error);
  //         return;
  //       }
  //       setCurrentAudio(sound);
  //       sound.play(success => {
  //         if (success) {
  //           console.log('Successfully finished playing');
  //         } else {
  //           console.log('Playback failed due to audio decoding errors');
  //         }
  //         sound.release();

  //         // 5. 재생 후, 파일 삭제
  //         RNFS.unlink(filePath).catch(err =>
  //           console.error('Failed to delete the temporary audio file', err),
  //         );
  //       });
  //     });
  //   } catch (error) {
  //     console.error('Error playing audio:', error);
  //   }
  // };

  const playAudio = async (audioId: string) => {
    if (currentAudio) {
      currentAudio.stop();
      currentAudio.release();
    }

    const filePath = `${audioDirectory}/${audioId}.wav`;

    try {
      const exists = await RNFS.exists(filePath);
      if (!exists) {
        console.error('Audio file not found');
        return;
      }

      const sound = new Sound(filePath, '', error => {
        if (error) {
          console.error('Failed to load sound:', error);
          return;
        }
        setCurrentAudio(sound);
        sound.play(success => {
          if (success) {
            console.log('Successfully played the sound');
          } else {
            console.log('Playback failed');
          }
          sound.release();
        });
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // const renderItem = ({item}: {item: any}) => {
  //   // const isMe = item.senderId === 'dbstj0403';
  //   const isMe = isCurrentUser(item.senderId);
  //   // const isAudio = isAudioMessage(item.message);
  //   // console.log('item', item.message);
  //   return (
  //     <MessageContainer isMe={isMe}>
  //       {!isMe && (
  //         <ProfileImage source={require('../assets/icons/profileImg.png')} />
  //       )}
  //       <MessageBubble isMe={isMe}>
  //         {/* <MessageText style={globalStyles.regular16} isMe={isMe}>
  //           {item.message}
  //         </MessageText> */}

  //         {/* {isAudio ? (
  //           <TouchableOpacity
  //             onPress={() => playAudio(item.message as ArrayBuffer)}>
  //             <Text style={globalStyles.regular16}>🔊 음성 메시지 재생</Text>
  //           </TouchableOpacity>
  //         ) : (
  //           <MessageText style={globalStyles.regular16} isMe={isMe}>
  //             {item.message as string}
  //           </MessageText>
  //         )} */}

  //         {item.isAudio ? (
  //           <TouchableOpacity onPress={() => playAudio(item.message as string)}>
  //             <Text style={globalStyles.regular16}>🔊 음성 메시지 재생</Text>
  //           </TouchableOpacity>
  //         ) : (
  //           <MessageText style={globalStyles.regular16} isMe={isMe}>
  //             {item.message as string}
  //           </MessageText>
  //         )}
  //       </MessageBubble>
  //     </MessageContainer>
  //   );
  // };

  const renderItem = ({item}: {item: Message}) => {
    const isMe = isCurrentUser(item.senderId);

    return (
      <MessageContainer isMe={isMe}>
        {!isMe && (
          <ProfileImage source={require('../assets/icons/profileImg.png')} />
        )}
        <MessageBubble isMe={isMe}>
          {item.isAudio ? (
            <TouchableOpacity
              onPress={() => item.audioFileId && playAudio(item.audioFileId)}>
              <Text
                style={[
                  globalStyles.regular16,
                  {
                    color: isMe ? '#666666' : 'white',
                  },
                ]}>
                🔊 음성 메시지 재생
              </Text>
            </TouchableOpacity>
          ) : (
            <MessageText style={globalStyles.regular16} isMe={isMe}>
              {item.message}
            </MessageText>
          )}
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
          <Name style={globalStyles.semibold16}>{name}</Name>
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

const ChatContainer = styled.View`
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
