import { View, Text, Pressable } from 'react-native';
import styles from "../styles/style";
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINT,
    SCOREBOARD_KEY,
    MAX_NBR_SCOREBOARD_ROWS
} from "../constants/Game";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let board = [];

export default GameBoard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Start the game by throwing dices');
    const [currentRound, setcurrentRound] = useState(0);
    const [totalThrows, setTotalThrows] = useState(0);
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [points, setPoints] = useState(0);
    // const [bonusPointsAwarded, setBonusPointsAwarded] = useState(false);

    // Are dices selected or not
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));

    // Dice spots (1, 2, 3, 4, 5, 6) for each dice
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));

    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));

    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

    // one way to handle with useEffects 

    // This one is for passing the player name from Home component to GameBoard component
    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, [route.params?.player]);

    useEffect(() => {
        calculatePoints();
        checkPointsToSelectRow();
        deSelectAllDices();
        checkRounds();
        checkBonusPoints();
        saveScore();
    }, [selectedDicePoints, dicePointsTotal, nbrOfThrowsLeft, gameEndStatus]);

    //This useEffect is for reading scoreboard from the async storage
    // when user navigates to the GameBoard component (have a look at the assignment instructions). Trigger here is the navigation for useEffect


    // This useEffect is for handling the gameflow so that the game does not stop too early or does not continue after it should not. Use nbrOfthrowsLeft to fire useEffect when nbrOfThrowsLeft changes.

    // call the function for calculating the points inside Text component
    // For replacing the zero with the actual points
    const pointsRow = [];

    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={'pointsRow' + spot}>
                <Text key={'pointsRow' + spot}>
                    {dicePointsTotal[spot]}
                </Text>
            </Col>
        );
    }

    const pointsToSelectRow = [];

    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={'buttonsRow' + diceButton}>
                <Pressable
                    key={'buttonsRow' + diceButton}
                    onPress={() => { selectDicePoints(diceButton), deSelectDice(diceButton) }}
                >
                    <MaterialCommunityIcons
                        name={'numeric-' + (diceButton + 1) + '-circle'}
                        key={'buttonsRow' + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}
                    >

                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    function getDiceColor(i) {
        return selectedDices[i] ? 'black' : 'tomato';
    }

    function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? 'black' : 'tomato';
    }

    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
        else {
            setStatus('You have to throw dices first');
        }
    }

    const deSelectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            let spots = i + 1;
            for (let j = 0; j < dices.length; j++) {
                if (diceSpots[j] === spots) {
                    dices[j] = false;
                }
            }
            setSelectedDices(dices);
        }
        else {
            setStatus('You have to throw dices first');
        }
    }

    const deSelectAllDices = () => {
        if (nbrOfThrowsLeft === NBR_OF_THROWS && !gameEndStatus) {
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
    }

    const checkPointsToSelectRow = () => {
        if (selectedDicePoints.every((x) => x === true) && nbrOfThrowsLeft === NBR_OF_THROWS) {
            setGameEndStatus(true);
            setStatus('Game over');
        }
    }

    const throwDices = () => {
        if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            setStatus('Select your points before next throw');
            return 1;
        }
        else if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            setGameEndStatus(false);
            diceSpots.fill(0);
            dicePointsTotal.fill(0);
        }

        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6) + 1;
                spots[i] = randomNumber;
                board[i] = 'dice-' + randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
        setTotalThrows(totalThrows + 1);
    }

    const dicesRow = [];

    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={"dice" + dice}>
                <Pressable
                    key={"dice" + dice}
                    onPress={() => selectDice(dice)}
                >
                    <MaterialCommunityIcons
                        name={board[dice] ? board[dice] : 'dice-1'}
                        size={50}
                        color={getDiceColor(dice)}
                        key={'dice' + dice}
                    />
                </Pressable>
            </Col>
        );
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selected = [...selectedDices];
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x, index) => (x === (i + 1) && selected[index] ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
                setDicePointsTotal(points);
                setSelectedDices(selected);
                setSelectedDicePoints(selectedPoints);
                setNbrOfThrowsLeft(NBR_OF_THROWS);
                return points[i];
            }
            else {
                setStatus('You have already selected points for ' + (i + 1));
            }
        }
        else {
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
        }
    }

    const calculatePoints = () => {
        let total = 0;
        for (let i = 0; i < MAX_SPOT; i++) {
            if (selectedDicePoints[i]) {
                total += dicePointsTotal[i];
            }
        }
        setPoints(total);
    }

    const checkBonusPoints = () => {
        if (points >= BONUS_POINTS_LIMIT && gameEndStatus) {
            setPoints(points + BONUS_POINT);
            // setBonusPointsAwarded(true);
        }
    }

    const checkRounds = () => {
        if (nbrOfThrowsLeft === NBR_OF_THROWS && currentRound === 6) {
            setGameEndStatus(true);
            setStatus('Game over');
        }
        if (nbrOfThrowsLeft === 2) {
            setcurrentRound(currentRound + 1);
        }
    }

    const saveScore = async () => {
        if (gameEndStatus) {
            let scoreboard = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (scoreboard === null) {
                scoreboard = [];
            }
            else {
                scoreboard = JSON.parse(scoreboard);
            }
            const currentDate = new Date();
            const timeFormatter = new Intl.DateTimeFormat('default', { hour: 'numeric', minute: 'numeric' });
            const formattedTime = timeFormatter.format(currentDate);
            scoreboard.push({ 
                name: playerName, 
                points: points,
                date: currentDate.toLocaleDateString(),
                time: formattedTime
             });
            scoreboard.sort((a, b) => b.points - a.points);
            scoreboard = scoreboard.slice(0, MAX_NBR_SCOREBOARD_ROWS);
            await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scoreboard));
            alert('Score saved');
        }
    }

    const playAgain = () => {
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setcurrentRound(0);
        setTotalThrows(0);
        setGameEndStatus(false);
        setPoints(0);
        // setBonusPointsAwarded(false);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setStatus('Start the game by throwing dices');
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                <Text style={styles.playerText}>Player: {playerName}</Text>
                <Text style={styles.roundText}>Round {currentRound}/6</Text>
                {/* <Text>Total throws: {totalThrows}/18</Text> */}
                <Container fluid>
                    <Row>{dicesRow}</Row>
                </Container>
                <Container fluid>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container fluid>
                    <Row>{pointsToSelectRow}</Row>
                </Container>
                <Text style={styles.throwsText}>Throws left: {nbrOfThrowsLeft}</Text>
                <View style={styles.statusContainer}>
                    <Text>{status}</Text>
                </View>
                {!gameEndStatus ?
                <>
                <Pressable style={styles.throwButton} disabled={gameEndStatus} onPress={() => throwDices()}>
                    <Text style={styles.nameButtonText}>Throw dices</Text>
                </Pressable>
                </>
                :
                <>
                <Pressable style={styles.playAgainButton} onPress={() => playAgain()}>
                    <Text style={styles.nameButtonText}>Play again</Text>
                </Pressable>
                <Pressable style={styles.scoreboardButton} onPress={() => navigation.navigate('Scoreboard')}>
                    <Text style={styles.nameButtonText}>Scoreboard</Text>
                </Pressable>
                </>
                }
                <Text style={styles.pointsText}>Total points: {points}</Text>
                {(BONUS_POINTS_LIMIT - points) > 0 ?
                    <>
                        <Text>You are {BONUS_POINTS_LIMIT - points} point(s) away from from bonus points</Text>
                    </>
                    :
                    <>
                        <Text style={styles.bonusText}>50 points will be awarded when the game ends!</Text>
                    </>
                }
            </View>
            <Footer />
        </>
    );
}