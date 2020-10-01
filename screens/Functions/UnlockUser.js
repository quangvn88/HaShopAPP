import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

import { API_USERNAME } from '../../api/Api';
import { API_UNLOCKUSER, API_USERDETAIL } from '../../api/ApiUnlockUser';

import Loader from '../../loading/Loader';
import ResultUser from '../../components/UnlockUser/ResultUser';

import { scale } from '../../responsive/Responsive';

export default class UnlockUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            user: '',
            pass: '',
            listUser: [],
            userDetail: {},
            isLoading: false,
            isEmpty: true,
            isLocking: false,
            result: ''
        };
    }
    componentDidMount() {
        let username;
        let password;
        AsyncStorage.getItem('user').then((user) => {
            username = user;
        }).then(() => AsyncStorage.getItem('pass').then((pass) => {
            password = pass;
        })).then(() => AsyncStorage.getItem('listUserName').then((listUserName) => {
            this.setState({
                listUser: JSON.parse(listUserName),
                user: username,
                pass: password,
            });
        }))
    };
    onChangeQuery = text => this.setState({ query: text });
    userState = boolean => this.setState({ isLocking: boolean });

    render() {
        const { user, pass, query, listUser } = this.state;
        const { userDetail, isEmpty, isLocking, isLoading, result } = this.state;
        return (
            <View style={{ padding: scale(5) }}>
                <Loader loading={isLoading} />
                <View style={{ flexDirection: 'row', width: '100%', zIndex: 2 }}>
                    <View style={{ flexDirection: 'row', width: scale(314) }}>
                        <View style={{ flexDirection: 'row', width: scale(300) }}>
                            <Text style={[styles.titleParam, { width: scale(70) }]}>Tài khoản</Text>
                            <View style={{
                                width: scale(220),
                                // height: 30,
                                position: 'absolute',
                                right: 0
                            }}>
                                <SearchableDropdown
                                    onItemSelect={(item) => {
                                        this.setState({ query: item.name });
                                    }}
                                    containerStyle={styles.containerStyle}
                                    itemStyle={styles.itemInputStyle}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: scale(200) }}
                                    items={listUser}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            // value: fromCompanyCode,
                                            maxLength: 20,
                                            placeholder: "User name",
                                            underlineColorAndroid: "transparent",
                                            style: styles.textInputStyle,
                                            onTextChange: text => this.setState({ query: text }),
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: true,
                                        }}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.buttonSearch}
                            onPress={() => {
                                if (query == '') {
                                    this.setState({
                                        result: 'Chưa nhập tên tài khoản'
                                    })
                                } else {
                                    this.setState({ isLoading: true });
                                    fetch(API_USERDETAIL, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            user: query,
                                            username: user,
                                            pass: pass
                                        })
                                    }).then(res => res.json()).then(res => {
                                        if (res.DATA.length != 0)
                                            this.setState({
                                                userDetail: res.DATA[0],
                                                isEmpty: false,
                                                isLocking: res.DATA[0].UFLAG == 0 ? false : true,
                                                isLoading: false,
                                                result: ''
                                            });
                                        else {
                                            this.setState({
                                                isLoading: false,
                                                userDetail: {},
                                                isEmpty: true,
                                                result: 'Tài khoản không tồn tại'
                                            });
                                        }
                                    }).catch(err => {
                                        this.setState({
                                            isLoading: false,
                                            result: 'Lỗi: ' + err
                                        });
                                    })
                                }
                            }}
                        >
                            <Text style={{ color: 'white' }}>Tìm kiếm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: scale(10) }}>
                    <Text style={{ color: '#e3610b' }}>{result}</Text>
                </View>
                {/* Result User */}
                <View>
                    <ResultUser userDetail={userDetail} />
                </View>
                {/* Unlock button */}
                {
                    !isEmpty && isLocking ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: scale(10) }}>
                            <TouchableOpacity
                                style={[styles.buttonUnlock, { backgroundColor: 'yellow' }]}
                                onPress={() => {
                                    this.setState({ isLoading: true });
                                    fetch(API_UNLOCKUSER, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            user: query,
                                            username: user,
                                            pass: pass
                                        })
                                    }).then(res => res.json()).then(res => {
                                        this.setState(prevState => ({
                                            userDetail: {
                                                ...prevState.userDetail,
                                                UFLAG: 0
                                            },
                                            isLocking: false,
                                            isLoading: false,
                                            result: ''
                                        }));
                                        setTimeout(() => Alert.alert('Mở khóa thành công', res.RETURN[0].MESSAGE), 100)
                                    })

                                }}
                            >
                                <Text >Mở khóa tài khoản</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }

            </View >
        );
    }
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
        marginRight: scale(5)
    },
    buttonUnlock: {
        justifyContent: 'center',
        backgroundColor: '#28A745',
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: scale(10),
    },
    buttonSearch: {
        justifyContent: 'center',
        backgroundColor: '#0066CC',
        borderColor: 'transparent',
        elevation: 1,
        borderWidth: scale(1),
        borderRadius: scale(6),
        height: scale(34),
        lineHeight: scale(34),
        paddingHorizontal: scale(10),
    },
    containerStyle: {
        width: '100%',
        padding: 0,
        zIndex: 1
    },
    //style input search
    textInputStyle: {
        height: scale(34),
        width: '100%',
        padding: 0,
        textAlign: 'center',
        borderWidth: scale(1),
        borderRadius: scale(6),
        backgroundColor: 'white',
    },
    //stytle item in search list
    itemInputStyle: {
        height: scale(50),
        padding: scale(6),
        textAlign: 'left',
        backgroundColor: 'white',
        borderColor: '#bbb',
        borderWidth: scale(1),
        borderRadius: scale(6),
    },
});