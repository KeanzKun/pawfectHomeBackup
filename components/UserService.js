import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_ADDRESS } from '../config';

export const fetchUserDetails = async (setUserDetailsCallback) => {
    const token = await AsyncStorage.getItem('token'); // Retrieve token
    console.log('Frontend token:', token); // Print the token
    fetch(`${SERVER_ADDRESS}/api/get-user-details`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}` // Send token in header
        }
    })
        .then((response) => response.json())
        .then((data) => {
            // Update the state with user details using the callback
            setUserDetailsCallback(data);
        })
        .catch((error) => console.error(error));
};
