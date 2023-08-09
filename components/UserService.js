import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUserDetails = async (setUserDetailsCallback) => {
    const token = await AsyncStorage.getItem('token'); // Retrieve token
    console.log('Frontend token:', token); // Print the token
    fetch('http://10.0.2.2:5000/api/get-user-details', {
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

export const returnToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return token; // This will resolve to the token value or null if it doesn't exist
    } catch (error) {
        console.error(error);
        return null; // Return null in case of any error
    }
};