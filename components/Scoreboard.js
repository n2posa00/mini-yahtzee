import { View, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import styles from "../styles/style";
import {
    SCOREBOARD_KEY,
} from "../constants/Game";
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import Footer from './Footer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default Scoreboard = ({ navigation }) => {

    const [scoreboard, setScoreboard] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboard();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboard = async () => {
        let storedScoreboard = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (storedScoreboard !== null) {
            setScoreboard(JSON.parse(storedScoreboard));
        }
    };

    const clearScoreboard = async () => {
        await AsyncStorage.removeItem(SCOREBOARD_KEY);
        setScoreboard([]);
    }


    return (
        <>
            <Header />
            {scoreboard.length ?
                <>
                    <View style={styles.scoreboardTitle}>
                        <Text style={styles.scoreboardHeader}>Scoreboard for top 5</Text>
                    </View>
                    <DataTable style={styles.scoreboard}>
                        <DataTable.Header style={{ backgroundColor: "tomato" }}>
                            <DataTable.Title numeric style={{ flex: 0.5, paddingRight: 20, borderRightWidth: 1 }}>
                                <Text style={styles.scoreboardTitleText}>Rank</Text>
                            </DataTable.Title>
                            <DataTable.Title style={{ flex: 1, borderRightWidth: 1, paddingLeft: 10 }}>
                                <Text style={styles.scoreboardTitleText}>Name</Text>
                            </DataTable.Title>
                            <DataTable.Title style={{ flex: 1.5, borderRightWidth: 1, paddingLeft: 10 }}>
                                <Text style={styles.scoreboardTitleText}>Date</Text>
                            </DataTable.Title>
                            {/* <DataTable.Title style={{ flex: 1, borderRightWidth: 1, paddingLeft: 10 }}>
                                <Text style={styles.scoreboardTitleText}>Time</Text>
                                </DataTable.Title> */}
                            <DataTable.Title numeric style={{ flex: 1 }}>
                                <Text style={styles.scoreboardTitleText}>Score</Text>
                            </DataTable.Title>
                        </DataTable.Header>
                        {scoreboard.map((row, index) => {
                            return (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell numeric style={{ flex: 0.5, paddingRight: 20, borderRightWidth: 1, fontFamily: 'WalterTurncoat-Regular' }}>
                                        <Text style={styles.scoreboardText}>{index + 1}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1, borderRightWidth: 1, paddingLeft: 10, fontFamily: 'WalterTurncoat-Regular' }}>
                                        <Text style={styles.scoreboardText}>{row.name}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1.5, borderRightWidth: 1, paddingLeft: 10, fontFamily: 'WalterTurncoat-Regular' }}>
                                        <Text style={styles.scoreboardText}>{row.date}</Text>
                                    </DataTable.Cell>
                                    {/* <DataTable.Cell style={{ flex: 1, borderRightWidth: 1, paddingLeft: 10, fontFamily: 'WalterTurncoat-Regular' }}>{row.time}</DataTable.Cell> */}
                                    <DataTable.Cell numeric style={{ flex: 1, fontFamily: 'WalterTurncoat-Regular' }}>
                                        <Text style={styles.scoreboardText}>{row.points}</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            );
                        })}
                    </DataTable>
                    <Pressable style={styles.startButton} onPress={() => clearScoreboard()}>
                        <Text style={styles.nameButtonText}>Clear scoreboard</Text>
                    </Pressable>
                </>
                :
                <>
                    <View style={styles.container}>
                        <MaterialCommunityIcons
                            name='clipboard-list'
                            size={90}
                            color='tomato'
                        />
                        <Text style={styles.glText}>Scoreboard is currently empty</Text>
                    </View>
                </>
            }
            <Footer />
        </>
    );
}