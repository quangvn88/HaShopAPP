import React, { Component } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Alert
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import CreditApproval from '../Functions/CreditApproval';
import DeclareCycle from '../Functions/DeclareCycle';
import OrderApproval from '../Functions/OrderApproval';
import NegativeApproval from '../Functions/NegativeApproval';
import QuantityRevenue from '../Functions/QuantityRevenue';
import UnlockAccounting from '../Functions/UnlockAccounting';
import UnlockUser from '../Functions/UnlockUser';

import UnlockWarehouse from '../Functions/UnlockWarehouse';
import ResultUnlockWarehouse from '../../components/UnlockWarehouse/ResultCreateWarehouse';

import Function from '../../components/Function/Function';

import { scale } from '../../responsive/Responsive';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        this.state = {
            userAuth: props.userAuth,
            functions: [
                {
                    name: 'OrderApproval',
                    title: 'Phê duyệt đơn hàng',
                    imageUrl: require('../../assets/OrderApproval.png'),
                    keyAuth: 'PD_DONHANG'
                },
                {
                    name: 'NegativeApproval',
                    title: 'Cho phép xuất âm',
                    imageUrl: require('../../assets/NegativeApproval.png'),
                    keyAuth: 'XUATAM'
                },
                {
                    name: 'DeclareCycle',
                    title: 'Khai báo PO CKG',
                    imageUrl: require('../../assets/DeclareCycle.png'),
                    keyAuth: 'KB_POCKG'
                },
                {
                    name: 'QuantityRevenue',
                    title: 'Sản lượng, Doanh Thu',
                    imageUrl: require('../../assets/QuantityRevenue.png'),
                    keyAuth: 'BC_SLDT'
                },
                {
                    name: 'CreditApproval',
                    title: 'Duyệt tín dụng',
                    imageUrl: require('../../assets/CreditApproval.png'),
                    keyAuth: 'DUYET_TD'
                },
                {
                    name: 'UnlockUser',
                    title: 'Mở khóa tài khoản',
                    imageUrl: require('../../assets/UnlockUser.png'),
                    keyAuth: 'MOKHOA'
                },
                {
                    name: 'UnlockWarehouse',
                    title: 'Mở kỳ kho',
                    imageUrl: require('../../assets/UnlockWarehouse.png'),
                    keyAuth: 'MOKY_KHO'
                },
                {
                    name: 'UnlockAccounting',
                    title: 'Mở kỳ kế toán',
                    imageUrl: require('../../assets/UnlockAccounting.png'),
                    keyAuth: 'MOKY_KT'
                }
            ]
        }
    }
    // componentDidMount() {
    //     const getUserAuth = async () => {
    //         await AsyncStorage.getItem('userAuth').then(userAuth => {
    //             this.setState({ userAuth: JSON.parse(userAuth) })
    //         });
    //     }
    //     getUserAuth();
    // }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                userAuth: nextProps.userAuth,
            })
        }
    }
    render() {
        const { functions, userAuth } = this.state;
        const { navigation } = this.props;
        return (
            <FlatList
                data={functions}
                numColumns={2}
                renderItem={({ item }) =>
                    <View style={styles.container}>
                        <Function
                            functionProps={item}
                            imageSource={item.imageUrl}
                            onPress={() => {
                                if (userAuth[item.keyAuth] === "X")
                                    navigation.navigate(item.name, { userAuth: userAuth });
                                else {
                                    Alert.alert("Truy cập thất bại", "Tài khoản của bạn không có quyền sử dụng chức năng này");
                                }
                            }}
                        />
                    </View>
                }
                keyExtractor={(item, index) => `${index}`}
            />
        );
    };
}

const Stack = createStackNavigator();

export default function Home({ userAuth }) {
    // console.log(userAuth);
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => {
                return {
                    headerBackTitle: ' ',
                    headerStyle: styles.headerStyle,
                    headerTintColor: '#fff',
                    headerTitleStyle: Platform.OS == 'ios' ? {
                        fontWeight: 'bold',
                        textAlign: 'center',
                        alignSelf: 'center'
                    } : {
                            fontWeight: 'bold',
                            textAlign: 'center',
                            width: route.name == "Home" ? '100%' : '85%',
                        },

                }
            }
            }
        >
            <Stack.Screen name="Home" children={(props) => <HomeScreen {...props} userAuth={userAuth} />} options={{ title: 'Trang chủ', }} />
            <Stack.Screen name="UnlockUser" component={UnlockUser} options={{ title: 'Mở khóa tài khoản', }} />
            <Stack.Screen name="OrderApproval" component={OrderApproval} options={{ title: 'Phê duyệt đơn hàng', }} />
            <Stack.Screen name="NegativeApproval" component={NegativeApproval} options={{ title: 'Cho phép xuất âm', }} />
            <Stack.Screen name="QuantityRevenue" component={QuantityRevenue} options={{ title: 'Sản lượng, Doanh thu', }} />
            <Stack.Screen name="CreditApproval" component={CreditApproval} options={{ title: 'Phê duyệt tín dụng', }} />
            <Stack.Screen name="DeclareCycle" component={DeclareCycle} options={{ title: 'Khai báo PO CKG', }} />
            <Stack.Screen name="UnlockAccounting" component={UnlockAccounting} options={{ title: 'Mở kỳ kế toán', }} />

            <Stack.Screen name="UnlockWarehouse" component={UnlockWarehouse} options={{ title: 'Mở kỳ kho', }} />
            <Stack.Screen name="ResultCreateWarehouse" component={ResultUnlockWarehouse} options={{ title: 'Kết quả', }} />

        </Stack.Navigator >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerStyle: {
        backgroundColor: '#4169E1',
        height: scale(80),
        borderBottomWidth: scale(3),
        borderBottomColor: '#FB7200',
    }
});