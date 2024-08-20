import {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';

interface Friend {
  name: string;
  friendId: string;
  statusMessage: string;
  friendType: string;
}

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFriends = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      let storedFriends = null;
      if (!forceRefresh) {
        const storedData = await AsyncStorage.getItem('friends');
        storedFriends = storedData ? JSON.parse(storedData) : null;
      }

      if (storedFriends) {
        setFriends(storedFriends);
      } else {
        const token = await AsyncStorage.getItem('jwtAccessToken');
        const response = await api.get('/friend/all', {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          console.log('Successfully fetched friends from API');
          setFriends(response.data);
          await AsyncStorage.setItem('friends', JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {friends, loadFriends, isLoading};
};
