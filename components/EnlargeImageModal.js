import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';

import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const EnlargeImageModal = ({ modalVisible, setModalVisible, imageUrl }) => {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{ flex: 1,backgroundColor: 'black' }}>
                <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(false)} style={{ flex: 1 }}>
                    <Image source={{ uri: imageUrl }} style={{ flex: 1, resizeMode: 'contain' }} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};



export default EnlargeImageModal;