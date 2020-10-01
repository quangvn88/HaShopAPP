import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { scale } from '../../responsive/Responsive';
import { createStackNavigator } from '@react-navigation/stack';

const CurrentDate = () => {
    var date = new Date().getDate(); //Current Date
    date = date < 10 ? '0' + date : date;
    var month = new Date().getMonth() + 1; //Current Month
    month = month < 10 ? '0' + month : month;
    var year = new Date().getFullYear(); //Current Year
    return (date + '/' + month + '/' + year);
}

function ProfileScreen({ userDetail }) {
    const currentTime = CurrentDate();
    return (

        <View style={styles.container} >
            <View style={{ flexDirection: 'row' }}>
                <Text>Ngày: </Text>
                <Text style={styles.value}>{currentTime}</Text>
            </View>
            <View>
                <Text style={styles.value}>{userDetail.NAME_LAST}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.value}>{userDetail.DEPARTMENT} </Text>
                <Text style={styles.value}>{userDetail.ROOMNUMBER}</Text>
            </View>
            <View style={{ marginBottom: scale(20), alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Tài khoản: </Text>
                    <Text style={styles.value}>{userDetail.USERNAME}</Text>
                </View>
            </View>
        </View >
    )
}

const Stack = createStackNavigator();

export default function Profile({ userDetail }) {
    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerStyle: styles.headerStyle,
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%'
                },
            }}
        >
            <Stack.Screen
                name="Profile"
                children={(props) => <ProfileScreen {...props} userDetail={userDetail} />}
                options={{ title: 'Thông tin tài khoản', }}
            />
        </Stack.Navigator >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',//theo chiều dọc
        justifyContent: 'center'//theo chiều ngang
    },
    buttonLogout: {
        backgroundColor: '#3763ed',
        padding: scale(5),
        borderWidth: scale(1),
        borderRadius: scale(6),
        borderColor: '#3763ed'
    },
    value: {
        fontSize: 15, fontWeight: 'bold', fontStyle: 'italic'
    },
    headerStyle: {
        backgroundColor: '#4169E1',
        height: scale(70),
        borderBottomWidth: scale(3),
        borderBottomColor: '#FB7200'
    }
})