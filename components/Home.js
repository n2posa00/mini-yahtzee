import { View, Text, Pressable, Keyboard, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import styles from "../styles/style";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from "./Header";
import Footer from "./Footer";
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINT,
} from "../constants/Game";

export default Home = ({ navigation }) => {

    const [playerName, setPlayerName] = useState("");
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            // navigation.setParams({ hasPlayerName: true });
            Keyboard.dismiss();
        }
    };

    return (
        <>
            <Header />
            <View style={styles.container}>
                <MaterialCommunityIcons
                    name='information'
                    size={90}
                    color='tomato'
                />
                {!hasPlayerName ?
                    <>
                        <Text style={styles.infoText}>For scoreboard enter your name...</Text>
                        <TextInput style={styles.nameInput} onChangeText={setPlayerName} autoFocus={true} />
                        <Pressable style={styles.nameButton} onPress={() => handlePlayerName(playerName)}>
                            <Text style={styles.nameButtonText}>OK</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        <ScrollView>
                            <View style={{padding: 10}}>
                                <Text style={styles.rulesHeader}>Rules of the game</Text>
                                <Text style={styles.infoText} multiline="true">
                                    THE GAME: Upper section of the classic Yahtzee
                                    dice game. You have {NBR_OF_DICES} dices and
                                    for the every dice you have {NBR_OF_THROWS}
                                    throws. After each throw you can keep dices in
                                    order to get same dice spot counts as many as
                                    possible. In the end of the turn you must select
                                    your points from {MIN_SPOT} to {MAX_SPOT}.
                                    Game ends when all points have been selected.
                                    The order for selecting those is free.
                                </Text>
                                <Text style={styles.infoText} multiline='true'>POINTS: After each turn game calculates the sum for the dices you selected. Only the dices having the same spot count are calculated. Inside the game you can not select same points from {MIN_SPOT} to {MAX_SPOT} again.</Text>
                                <Text style={styles.infoText} multiline='true'>GOAL: To get points as much as possible. {BONUS_POINTS_LIMIT} points is the limit of getting bonus which gives you {BONUS_POINT} points more.</Text>
                                <Text style={styles.glText}>Good luck, {playerName}</Text>
                                <View style={styles.startContainer}>
                                    <Pressable style={styles.startButton} onPress={() => {
                                        navigation.navigate("GameBoard", { player: playerName });
                                    }}>
                                        <Text style={styles.nameButtonText}>Start the game</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                }
            </View>
            <Footer />
        </>
    );
}