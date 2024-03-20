import React from "react";
import {Text, View} from "react-native";
import styles from "../styles/style";

export default Footer = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.author}>
                Author: Samuli Pohjola
            </Text>
        </View>
    );
}