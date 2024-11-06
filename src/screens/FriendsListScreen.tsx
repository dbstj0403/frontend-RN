import React, {useState, useCallback, useRef, useEffect} from 'react';
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
import {useUserStore} from '../store/useUserStore';

interface Friend {
  friendId: string;
  name: string;
  statusMessage: string;
  isDisabled: boolean;
  friendType: 'FRIEND' | 'CLOSE_FRIEND';
}

export default function FriendsListScreen() {
  const navigation = useNavigation();
  const {userInfo, setUserInfo} = useUserStore();
  const [allFriends, setAllFriends] = useState<Friend[]>([]);
  const [closeFriends, setCloseFriends] = useState<Friend[]>([]);
  const [regularFriends, setRegularFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const lastUpdateTime = useRef(0);

  const moveToAddFriends = () => {
    navigation.navigate('AddFriends');
  };

  useEffect(() => {
    const getMyInfo = async () => {
      const token = await AsyncStorage.getItem('jwtAccessToken');
      try {
        const response = await api.get('/users/my-info', {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          console.log('내 정보 불러오기 성공!', response.data);
          setUserInfo(response.data);
        }
      } catch (e) {
        console.log('내 정보 불러오기 실패', e);
      }
    };

    getMyInfo();
  }, [setUserInfo]);

  const getFriends = useCallback(async (forceUpdate = false) => {
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - lastUpdateTime.current;

    if (!forceUpdate && timeSinceLastUpdate < 300000) {
      return;
    }

    setIsLoading(true);
    setError('');

    const token = await AsyncStorage.getItem('jwtAccessToken');
    try {
      const response = await api.get('/friend/all', {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        console.log('친구 목록 불러오기 성공!', response.data);
        const friends: Friend[] = response.data;
        setAllFriends(friends);

        const close = friends.filter(
          friend => friend.friendType === 'CLOSE_FRIEND',
        );
        const regular = friends.filter(
          friend => friend.friendType === 'FRIEND',
        );

        setCloseFriends(close);
        setRegularFriends(regular);

        lastUpdateTime.current = currentTime;
      }
    } catch (e) {
      console.log('친구 목록 불러오기 실패:', e);
      setError('친구 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFriendStatus = useCallback(
    (friendId: string, isFavorite: boolean) => {
      setAllFriends(prev =>
        prev.map(friend =>
          friend.friendId === friendId
            ? {...friend, friendType: isFavorite ? 'CLOSE_FRIEND' : 'FRIEND'}
            : friend,
        ),
      );

      if (isFavorite) {
        setCloseFriends(prev => [
          ...prev,
          allFriends.find(f => f.friendId === friendId)!,
        ]);
        setRegularFriends(prev => prev.filter(f => f.friendId !== friendId));
      } else {
        setRegularFriends(prev => [
          ...prev,
          allFriends.find(f => f.friendId === friendId)!,
        ]);
        setCloseFriends(prev => prev.filter(f => f.friendId !== friendId));
      }
    },
    [allFriends],
  );

  const removeFriendFromList = useCallback((friendId: string) => {
    setAllFriends(prev => prev.filter(friend => friend.friendId !== friendId));
    setCloseFriends(prev =>
      prev.filter(friend => friend.friendId !== friendId),
    );
    setRegularFriends(prev =>
      prev.filter(friend => friend.friendId !== friendId),
    );
  }, []);

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
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
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
              {userInfo && (
                <ListItem
                  id={userInfo.customId}
                  name={userInfo.name}
                  statusMessage={
                    userInfo.statusMessage
                      ? userInfo.statusMessage
                      : '상태 메세지가 없습니다.'
                  }
                  isDisabled={userInfo.isDisabled}
                  isFavorite={false}
                  updateFriendsList={getFriends}
                  updateFriendStatus={updateFriendStatus}
                  removeFriendFromList={removeFriendFromList}
                />
              )}
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>즐겨찾기</Text>
              {closeFriends.map(friend => (
                <ListItem
                  key={friend.friendId}
                  id={friend.friendId}
                  name={friend.name}
                  statusMessage={friend.statusMessage}
                  isDisabled={friend.isDisabled}
                  isFavorite={true}
                  updateFriendsList={getFriends}
                  updateFriendStatus={updateFriendStatus}
                  removeFriendFromList={removeFriendFromList}
                />
              ))}
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>목록</Text>
              {error ? (
                <Text style={{color: 'red'}}>{error}</Text>
              ) : (
                regularFriends.map(friend => (
                  <ListItem
                    key={friend.friendId}
                    id={friend.friendId}
                    name={friend.name}
                    statusMessage={friend.statusMessage}
                    isDisabled={friend.isDisabled}
                    isFavorite={false}
                    updateFriendsList={getFriends}
                    updateFriendStatus={updateFriendStatus}
                    removeFriendFromList={removeFriendFromList}
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
