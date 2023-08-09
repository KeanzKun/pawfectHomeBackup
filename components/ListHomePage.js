import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import TextStroke from '../components/TextStroke';
import { Color, FontFamily } from "../GlobalStyles";


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ListHomePage = React.memo(({ item, navigation }) => {
    // Assuming your server is running at http://localhost:5000
    const imageUrl = `http://10.0.2.2:5000/api/pets/pet_image/${item.pet_photo}`;

    return (
        <TouchableOpacity style={styles.item}
            onPress={() => navigation.navigate("PetDetails")}>
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
            <View style={styles.itemTextContainer}>
                <TextStroke stroke="#533e41" strokeWidth={0.3} style={[styles.itemText, { fontSize: 19, fontWeight: '800' }]}>{item.pet_name}</TextStroke >
                <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{item.pet_type}</TextStroke>
                <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{item.pet_age} {item.pet_gender}</TextStroke>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 24,
    },
    dropdownContainer: {
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    header: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: 'white',
    },
    categories: {
        alignSelf: 'flex-start',
        fontSize: 25,
        letterSpacing: 0.7,
        color: Color.dimgray,
        fontWeight: '900',
    },
    categoriesContainer: {
        marginVertical: windowHeight * 0.01,
        width: windowWidth * 0.9,
    },
    button: {
        backgroundColor: 'white',
        width: windowWidth * 0.21,
        height: windowHeight * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 15,
    },
    searchButton: {
        backgroundColor: 'white',
        width: '100%',
        height: windowHeight * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingHorizontal: windowWidth * 0.04,
        borderRadius: 30,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: windowWidth * 0.9, // was 0.8
        marginBottom: windowHeight * 0.03,
    },
    searchInput: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRadius: 40,
        width: '100%',
        height: windowHeight * 0.06,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    item: {
        height: windowHeight * 0.25,
        width: windowWidth * 0.42,
        marginBottom: windowWidth * 0.045,
        marginLeft: windowWidth * 0.03,
        marginRight: windowWidth * 0.03,
        borderRadius: 30,
        overflow: 'hidden',
    },
    itemImage: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    filterIcon: {
        width: '55%',
        height: '55%'
    },
    searchContainer: {
        width: windowWidth * 0.9,
        alignItems: 'center',
    },

    titleText: {
        marginVertical: windowHeight * 0.024,
        fontSize: 33,
        letterSpacing: 0.4,
        color: Color.sandybrown,
        fontWeight: '900',
    },
    itemTextContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        marginLeft: windowWidth * 0.05,
        marginBottom: windowHeight * 0.02
    },
    itemText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
    },

    searchText: {
        alignSelf: 'flex-start',
        fontWeight: '400',
        fontSize: 13,
    },
});

export default ListHomePage;