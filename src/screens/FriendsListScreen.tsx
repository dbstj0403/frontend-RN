import React, {useState, useCallback, useRef} from 'react';
import styled from 'styled-components/native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import ListItem from '../components/FriendsList/ListItem';
import {globalStyles} from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';

export default function FriendsListScreen() {
  const navigation = useNavigation();
  const [friendsList, setFriendsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const lastUpdateTime = useRef(0);

  const moveToAddFriends = () => {
    navigation.navigate('AddFriends');
  };

  // 자신의 아이디 정보를 가져오는 함수
  const getMyInfo = async () => {};

  const getFriends = useCallback(
    async (forceUpdate = false) => {
      const currentTime = Date.now();
      const timeSinceLastUpdate = currentTime - lastUpdateTime.current;

      // 마지막 업데이트 후 5분(300000ms) 이내라면 업데이트 하지 않음
      if (
        !forceUpdate &&
        timeSinceLastUpdate < 300000 &&
        friendsList.length > 0
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('jwtAccessToken');
      try {
        const response = await api.get('/friend/all', {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          console.log('친구 목록 불러오기 성공!', response.data);
          setFriendsList(response.data);
          lastUpdateTime.current = currentTime;
        }
      } catch (e) {
        console.log('친구 목록 불러오기 실패:', e);
        console.log(e);
        setError('친구 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [friendsList.length],
  );

  useFocusEffect(
    useCallback(() => {
      getFriends();
    }, [getFriends]),
  );

  const onRefresh = useCallback(() => {
    getFriends(true);
  }, [getFriends]);

  return (
    <ScreenContainer>
      <BackgroundImage
        source={require('../assets/background/homeBackground.png')}
        resizeMode="cover"
      />
      <SafeAreaContainer>
        <Container>
          <Header>
            <HeaderTitle>주소록</HeaderTitle>
            <TouchableOpacity onPress={moveToAddFriends}>
              <Image
                source={require('../assets/icons/addFriendsIcon.png')}
                alt="Add Friends"
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          </Header>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }>
            <Text style={globalStyles.grayBold16}>누구와 연락할까요?</Text>
            <TopImage
              source={require('../assets/FriendsList/FriednsListTop.png')}
              alt="friendsListImg"
            />
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>나의 프로필</Text>
              {/* <ListItem /> */}
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>즐겨찾기</Text>
              {/* <ListItem /> */}
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>목록</Text>
              {error ? (
                <Text style={{color: 'red'}}>{error}</Text>
              ) : (
                friendsList.map(friend => (
                  <ListItem
                    key={friend.friendId}
                    id={friend.friendId}
                    name={friend.name}
                    statusMessage={friend.statusMessage}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
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
  width: 311px;
  height: 117px;
  margin-bottom: 20px;
`;
