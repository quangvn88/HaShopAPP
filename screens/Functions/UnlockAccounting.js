import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

import { API_COMPANYCODE } from '../../api/Api';
import { API_ACOUNTING } from '../../api/ApiUnlockAcounting';

import ResultAcounting from '../../components/UnlockAcounting/ResultAcounting';
import CreateAcounting from '../../components/UnlockAcounting/CreateAcounting';
import Loader from '../../loading/Loader';

import { scale } from '../../responsive/Responsive';

const checkUserAuth = userCompanyCode => (userCompanyCode === "*" || userCompanyCode === "8810");

export default class UnlockAcounting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCompanyCode: [],
            companyCode: '',
            user: '',
            pass: '',
            resultAcounting: [],
            isLoading: false,
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
    updateResult = (data) => this.setState(data);

    render() {
        const { companyCode, user, pass, listCompanyCode } = this.state;
        const { resultAcounting, isLoading, result, userAuth } = this.state;

        return (
            <View style={{ padding: scale(5) }}>
                <Loader loading={isLoading} />
                <View style={{ flexDirection: 'row', width: '100%', zIndex: 2 }}>
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
                                            } : {
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
                                    fetch(API_ACOUNTING, {
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
                                                resultAcounting: res.DATA,
                                                isLoading: false,
                                                result: ''
                                            });
                                        else {
                                            this.setState({
                                                isLoading: false,
                                                resultAcounting: [],
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
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: scale(10) }}>
                    <Text style={{ color: '#e3610b' }}>{result}</Text>
                </View>
                <View>
                    {/* Form Create */}
                    {/* {isCreate ? ( */}
                    <View style={{}}>
                        <CreateAcounting auth={{ user: user, pass: pass }} companyCode={companyCode} />
                    </View>
                    {/* ) : null} */}
                    {/* From Result */}
                    {resultAcounting.length != 0 ? (
                        <View>
                            <ResultAcounting resultAcounting={resultAcounting} />
                        </View>
                    ) : null}
                </View>
            </View>
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
    //style container search
    containerStyle: {
        width: '100%',
        padding: 0,
        zIndex: 1
    },
    //style input search
    textInputStyle: {
        height: scale(34),
        width: '100%',
        padding: scale(5),
        textAlign: 'center',
        borderWidth: scale(1),
        borderRadius: scale(6),
        backgroundColor: 'white',
    },
    //stytle item in search list
    itemInputStyle: {
        height: scale(50),
        paddingHorizontal: scale(6),
        // padding: scale(6),
        textAlign: 'left',
        backgroundColor: 'white',
        borderColor: '#bbb',
        borderWidth: scale(1),
        borderRadius: scale(6),
    },
});