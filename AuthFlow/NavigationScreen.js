import * as React from 'react';
import {
    View,
    Platform
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/MainScreen/Home';
import Profile from '../screens/MainScreen/Profile';

import { scale } from '../responsive/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';

function DrawerScreen() {
    return (
        <View>
        </View>
    )
}

const Tab = createBottomTabNavigator();

export default function MyTabs({ navigation, userDetail, userAuth }) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            swipeEnabled={false}
            tabBarOptions={{
                showIcon: true,
                showLabel: false,
                keyboardHidesTabBar: true,
                activeTintColor: "#4169E1",
                inactiveTintColor: "#adacac",
                iconStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: scale(40),
                    width: scale(40)
                },
                style: {
                    height: scale(100),

                }
            }}
        >
            <Tab.Screen
                name="Home"
                children={(props) => <HomeScreen {...props} userAuth={userAuth} />}
                // component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                children={(props) => <Profile {...props} userDetail={userDetail} />}
                options={{
                    title: 'My home',
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    tabBarIcon: ({ color }) =>
                        <MaterialCommunityIcons name="account" color={color} size={30} />,
                }}
            />
            <Tab.Screen
                name="Drawer"
                component={DrawerScreen}
                listeners={{
                    tabPress: e => {
                        e.preventDefault();
                        navigation.openDrawer();
                    },
                }}
                options={{
                    tabBarLabel: 'Menu',
                    tabBarIcon: ({ color }) =>
                        <MaterialCommunityIcons name="menu" color={color} size={30} />,
                }}
            />
        </Tab.Navigator>
    );
}