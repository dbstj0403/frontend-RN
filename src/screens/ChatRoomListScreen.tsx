import React, {useState, useCallback} from 'react';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import ChatItem from '../components/chatRoom/ChatItem';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';

export default function ChatRoomListScreen() {
  const navigation = useNavigation();
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getChatRoomList = useCallback(async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('jwtAccessToken');
    try {
      const response = await api.get('/chat', {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        console.log('채팅방 리스트 가져오기 성공!', response.data);
        setChatRooms(response.data);
      }
    } catch (e) {
      console.log('채팅방 리스트 불러오기 실패', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getChatRoomList();
    }, [getChatRoomList]),
  );

  const moveToAddChatRoom = () => {
    navigation.navigate('AddChatRoom');
  };

  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Container>
          <Header>
            <HeaderTitle>채팅</HeaderTitle>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/icons/searchIcon.png')}
                alt="search"
                style={{width: 27, height: 27, marginRight: 10}}
              />
              <TouchableOpacity onPress={moveToAddChatRoom}>
                <Image
                  source={require('../assets/icons/addFriendsIcon2.png')}
                  alt="Add Friends"
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>
            </View>
          </Header>
          <ScrollView
            showsVerticalScrollIndicator={false} // 세로 스크롤바 숨기기
            showsHorizontalScrollIndicator={false} // 가로 스크롤바 숨기기
          >
            <View style={{marginTop: 10}}>
              <Text style={globalStyles.grayBold16}>당신의 대화를</Text>
              <Text style={globalStyles.grayBold16}>빠짐없이 기록할게요.</Text>
            </View>
            <TopImage
              source={require('../assets/chatRoomList/chatRoomListTopImg.png')}
              alt="chatRoomListImg"
            />
            {isLoading ? (
              <Text>채팅방 목록을 불러오는 중...</Text>
            ) : chatRooms.length > 0 ? (
              chatRooms.map((room, index) => (
                <ChatItem key={index} room={room} />
              ))
            ) : (
              <Text>채팅방이 없습니다.</Text>
            )}
          </ScrollView>
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
`;

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const TopImage = styled.Image`
  width: 345px;
  height: 140px;
  margin-bottom: 10px;
`;
