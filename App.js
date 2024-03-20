import Home from './components/Home';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        sceneContainerStyle={{
          backgroundColor: 'transparent',
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'GameBoard') {
              iconName = focused ? 'dice-5' : 'dice-5-outline';
            } else if (route.name === 'Scoreboard') {
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          // tabBarStyle: { display: route.params?.hasPlayerName ? 'flex' : 'none' },
        })
        }
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarStyle: {display: 'none'},
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="GameBoard"
          component={GameBoard}
          options={{
            tabBarLabel: 'GameBoard',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dice-5" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Scoreboard"
          component={Scoreboard}
          options={{
            tabBarLabel: 'Scoreboard',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


