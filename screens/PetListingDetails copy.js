import React, { useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome for icons
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const PetListingDetails = () => {
    const navigation = useNavigation();
    const fullDescription = ` Lorem ipsum dolor sit amet,
    consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Magna etiam tempor orci eu lobortis elementum nibh.
    Eget lorem dolor sed viverra ipsum nunc aliquet.
    Ut consequat semper viverra nam libero.
    Ultrices in iaculis nunc sed augue.
    Cum sociis natoque penatibus et magnis dis.
    Pretium aenean pharetra magna ac placerat vestibulum.
    Pellentesque eu tincidunt tortor aliquam nulla facilisi
    cras fermentum. Velit aliquet sagittis id consectetur purus
    ut faucibus. Nunc vel risus commodo viverra maecenas accumsan
    lacus vel facilisis. Et sollicitudin ac orci phasellus egestas
    tellus. Tempus egestas sed sed risus pretium quam
    vulputate dignissim. Eget arcu dictum varius duis at.
    Consectetur libero id faucibus nisl tincidunt eget.

    Pulvinar etiam non quam lacus suspendisse faucibus.
    Diam sit amet nisl suscipit. Turpis egestas maecenas
    pharetra convallis posuere. Sed risus pretium quam vulputate.
    Laoreet id donec ultrices tincidunt arcu. Ipsum suspendisse
    ultrices gravida dictum fusce ut placerat orci. Feugiat sed
    lectus vestibulum mattis ullamcorper velit sed ullamcorper.
    Pulvinar mattis nunc sed blandit libero volutpat sed. Consequat
    mauris nunc congue nisi vitae suscipit. Sit amet est placerat
    in egestas. Semper auctor neque vitae tempus quam pellentesque
    nec nam aliquam. Malesuada fames ac turpis egestas integer.
    Non blandit massa enim nec dui. Odio facilisis mauris sit
    amet massa vitae tortor condimentum lacinia. Non nisi est sit
    amet facilisis magna. Phasellus faucibus scelerisque eleifend
    donec pretium vulputate sapien. Elit eget gravida cum sociis
    natoque penatibus et. In nibh mauris cursus mattis molestie a.`;
    const shortDescription = fullDescription.slice(0, 300) + "..."; // display the first 100 characters

    const [description, setDescription] = useState(shortDescription);
    const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);

    const toggleDescription = () => {
        if (isFullDescriptionShown) {
            setDescription(shortDescription);
        } else {
            setDescription(fullDescription);
        }

        setIsFullDescriptionShown(!isFullDescriptionShown);
    };

    return (

        <View style={{ flex: 1 }}>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()} // Navigate back to the previous screen
            >
                <Text style={styles.backButtonText}>&lt;</Text>
            </TouchableOpacity>

            <ScrollView style={styles.container} stickyHeaderIndices={[1]}>

                <View key={0}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }}
                        style={styles.image}
                    />
                </View>

                <View key={1} style={styles.detailsContainer}>
                    <Text style={styles.petName}>
                        Fluffy <Icon name="venus" size={20} color="#900" />
                    </Text>
                    <Text style={styles.detailText}>Dog</Text>
                    <Text style={styles.detailText}>Pomeranian</Text>
                    <Text style={styles.detailText}>Age: 3 years, 5 months</Text>
                    <Text style={styles.detailText}>Location: San Francisco</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Pet Description</Text>
                </View>

                <View style={styles.description}>
                    <Text>
                        {description}
                    </Text>
                    <TouchableOpacity onPress={toggleDescription}>
                        <Text style={styles.showMore}>
                            {isFullDescriptionShown ? "Show Less" : "Show More"}
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.buttonFrame}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        underlayColor={Color.sandybrown}
                    >
                        <Text style={styles.loginButtonText}>Found</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        underlayColor={Color.sandybrown}
                    >
                        <Text style={styles.loginButtonText}>Delist</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonFrame: {
        flex: 1,
        paddingHorizontal: windowHeight * 0.03,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        width: windowWidth,
        justifyContent: 'space-between',
        marginVertical: windowHeight * 0.08
    },
    showMore: {
        color: Color.sandybrown
    },
    backButton: {
        position: 'absolute',
        top: 10, // adjust this value as per your needs
        left: 10, // adjust this value as per your needs
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        borderRadius: 20,
        backgroundColor: '#FF9E5C',
        alignItems: "center",
        zIndex: 1, // make sure the button is above other elements
    },
    backButtonText: {
        paddingTop: windowHeight * 0.004,
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },
    loginButton: {
        borderRadius: 80,
        backgroundColor: Color.sandybrown,
        width: '45%',
        height: windowHeight * 0.09,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    loginButtonText: {
        fontSize: windowHeight * 0.03,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    titleContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.01,
    },
    adoptionContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.01,
    },
    listingDateContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.05,
    },
    description: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.05
    },
    image: {
        width: windowWidth,
        height: windowHeight * 0.4,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    detailsContainer: {
        height: windowHeight * 0.21,
        marginHorizontal: windowHeight * 0.03,
        paddingVertical: windowHeight * 0.02,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: windowWidth * 0.08,
        bottom: windowHeight * 0.04,
    },
    petName: {
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.01
    },
    title: {
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.01
    },
    date: {
        fontSize: 18,
        fontWeight: '700',
    },
    adoptionFee: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.01,
        marginTop: windowHeight * - 0.01
    },
    detailText: {
        fontSize: 15,
    },
    contactContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginVertical: windowHeight * 0.08,
        alignItems: 'center',
    },
    contactButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: windowWidth * 0.8,
        marginTop: windowHeight * 0.02
    },
    contactButton: {
        width: windowWidth * 0.15,
        height: windowWidth * 0.15,
        borderRadius: 50,
        backgroundColor: Color.sandybrown,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default PetListingDetails;
