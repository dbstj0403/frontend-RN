import io from 'socket.io-client';
import {CHAT_ENDPOINT} from 'react-native-dotenv';
const socket = io(CHAT_ENDPOINT);
export default socket;
