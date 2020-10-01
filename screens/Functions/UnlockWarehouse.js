import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { API_COMPANYCODE } from '../../api/Api';

import { API_WAREHOUSE } from '../../api/ApiUnlockWarehouse';

import ResultWarehouse from '../../components/UnlockWarehouse/ResultWarehouse';
import CreateWarehouse from '../../components/UnlockWarehouse/CreateWarehouse';
import Loader from '../../loading/Loader';

import { scale } from '../../responsive/Responsive';

const checkUserAuth = userCompanyCode => (userCompanyCode === "*" || userCompanyCode === "8810");

export default class UnlockWarehouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCompanyCode: [],
            companyCode: '',
            user: '',
            pass: '',
            resultWarehouse: {},
            isLoading: false,
            navigation: props.navigation,
            result: '',
            userAuth: props.route.params.userAuth,
        };
    };
    componentDidMount() {
        if (!checkUserAuth(this.state.userAuth.BUKRS)) {
            this.setState({
                companyCode: this.state.userAuth.BUKRS,
            })
        }
        let username;
        let password;
        AsyncStorage.getItem('user').then((user) => {
            username = user;
        }).then(() => AsyncStorage.getItem('pass').then((pass) => {
            password = pass;
        })).then(() => AsyncStorage.getItem('listCompanyCode').then((listCompanyCode) => {
            this.setState({
                listCompanyCode: JSON.parse(listCompanyCode),
                user: username,
                pass: password,
            });
        }));
    };
    onChangeCompanyCode = text => this.setState({ companyCode: text.replace(/[^0-9]/g, '') });
    getCompanyCode = () => this.state.companyCode;
    navigateResult = (data) => { this.state.navigation.navigate('ResultCreateWarehouse', { resultShow: data }) };

    render() {
        const { companyCode, user, pass, listCompanyCode } = this.state;
        const { resultWarehouse, isLoading, result,userAuth } = this.state;

        return (
            <View style={{ padding: scale(5) }}>
                <Loader loading={isLoading} />
                <View style={{ zIndex: 2 }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ flexDirection: 'row', width: scale(314) }}>
                            <View style={{ flexDirection: 'row', width: scale(300) }}>
                                <Text style={[styles.titleParam, { width: scale(70) }]}>C.Code</Text>
                                <View style={{
                                    width: scale(240),
                                    // height: 30,
                                    position: 'absolute',
                                    right: 0

                                }}>
                                    <SearchableDropdown
                                        onItemSelect={(item) => {
                                            this.setState({ companyCode: item.name.substring(0, 4) });
                                        }}
                                        containerStyle={styles.containerStyle}
                                        itemStyle={styles.itemInputStyle}
                                        itemTextStyle={{ color: '#222' }}
                                        itemsContainerStyle={{ maxHeight: scale(200) }}
                                        items={listCompanyCode}
                                        resetValue={false}
                                        textInputProps={
                                            checkUserAuth(userAuth.BUKRS) ?
                                            {
                                                // value: this.state.fromCompanyCode,
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ companyCode: text }),
                                                width: '100%',
                                            }:{
                                                value: userAuth.BUKRS,
                                                editable: false,
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ companyCode: text }),
                                                width: '100%',
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
                        {/* Button Search */}
                        <View>
                            <TouchableOpacity
                                style={styles.buttonSearch}
                                activeOpacity={0.5}
                                onPress={() => {
                                    if (companyCode == '') {
                                        this.setState({
                                            result: 'Chưa nhập mã công ty'
                                        });
                                    } else {
                                        this.setState({ isLoading: true });
                                        fetch(API_WAREHOUSE, {
                                            method: 'post',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                bukrs: companyCode,
                                                username: user,
                                                pass: pass
                                            })
                                        }).then(res => res.json()).then(res => {
                                            if (res.DATA.length != 0)
                                                this.setState({
                                                    resultWarehouse: res.DATA[0],
                                                    isLoading: false,
                                                    result: ''
                                                });
                                            else {
                                                this.setState({
                                                    isLoading: false,
                                                    resultWarehouse: {},
                                                    result: 'Không tìm thấy kết quả phù hợp'
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
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: scale(10), zIndex: 0 }}>
                    <Text style={{ color: '#e3610b' }}>{result}</Text>
                </View>
                <View >
                    <CreateWarehouse auth={{ user: user, pass: pass }} companyCode={companyCode} navigateResult={this.navigateResult.bind(this)} />
                </View>
                {/* From Result */}
                {
                    'BUKRS' in resultWarehouse ? (
                        <View>
                            <ResultWarehouse resultWarehouse={resultWarehouse} />
                        </View>
                    ) : null
                }
            </View >
        )
    }
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
        marginRight: scale(5)
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
        // padding: 0,
        textAlign: 'center',
        borderWidth: scale(1),
        borderRadius: scale(6),
        backgroundColor: 'white',
        padding: scale(5)
    },
    //stytle item in search list
    itemInputStyle: {
        height: scale(50),
        paddingHorizontal: scale(6),
        // padding: scale(6),
        textAlign: 'center',
        backgroundColor: 'white',
        borderColor: '#bbb',
        borderWidth: scale(1),
        borderRadius: scale(6),
    },
});