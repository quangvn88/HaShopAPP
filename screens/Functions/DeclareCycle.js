import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { API_PO } from '../../api/ApiDeclareCycle';

import CreatePo from '../../components/DeclareCycle/CreatePo';
import ResultPo from '../../components/DeclareCycle/ResultPo';
import Loader from '../../loading/Loader';

import { scale } from '../../responsive/Responsive';
const screenHeight = Math.round(Dimensions.get('window').height);
const paramsHeight = scale(220);
const bottomHeight = Platform.OS == 'ios' ? scale(100) : scale(50);
const headerHeight = Platform.OS == 'ios' ? scale(100) : scale(50);
const resultHeight = screenHeight - paramsHeight - headerHeight - bottomHeight - scale(10);

export default class DeclareCycle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: '',
            month: '',
            user: '',
            pass: '',
            resultPo: [],
            result: '',
            isLoading: false,
            userAuth: props.route.params.userAuth,
        };
    }
    componentDidMount() {
        AsyncStorage.getItem('user').then((user) => {
            this.setState({ user: user })
        }).then(
            () => AsyncStorage.getItem('pass').then((pass) => {
                this.setState({ pass: pass })
            })
        )
    };

    onChangeMonth = text =>
        this.setState({
            month: text.replace(/[^0-9]/g, '')
        }, () => {
            if (text < 0) this.setState({ month: '1' });
            if (text > 12) this.setState({ month: '12' });
        });
    onChangeYear = text => this.setState({ year: text.replace(/[^0-9]/g, '') });
    updateLoading = (boolean) => this.setState({ isLoading: boolean, resultPo: [] });

    render() {
        const { month, year, user, pass, userAuth } = this.state;
        const { result, resultPo, isLoading } = this.state;
        return (
            <View style={{ padding: scale(5) }}>
                <Loader loading={isLoading} />
                <View style={{
                    height: paramsHeight,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Tham số Tháng Năm */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', paddingRight: scale(10) }}>
                                <Text style={styles.titleParam}>Tháng</Text>
                                <TextInput
                                    returnKeyType='done'
                                    keyboardType={'number-pad'}
                                    maxLength={2}
                                    style={[styles.input, { width: scale(50) }]}
                                    onChangeText={text => this.onChangeMonth(text)}
                                    value={month}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleParam}>Năm</Text>
                                <TextInput
                                    returnKeyType='done'
                                    keyboardType={'number-pad'}
                                    maxLength={4}
                                    style={[styles.input, { width: scale(80) }]}
                                    onChangeText={text => this.onChangeYear(text)}
                                    value={year}
                                />
                            </View>
                        </View>
                        {/* Button Search */}
                        <View>
                            <TouchableOpacity
                                style={styles.buttonSearch}
                                activeOpacity={0.5}
                                onPress={() => {
                                    if ((year == '' || Number(year) == 0) && (Number(month) == '0' || month == ''))
                                        this.setState({
                                            result: 'Chưa nhập tháng, năm'
                                        })
                                    else if (year == '' || Number(year) == 0)
                                        this.setState({
                                            result: 'Chưa nhập năm'
                                        })
                                    else if (month == '' || Number(month) == 0)
                                        this.setState({
                                            result: 'Chưa nhập tháng'
                                        })
                                    else {
                                        this.updateLoading(true);
                                        fetch(API_PO, {
                                            method: 'post',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                gjahr: year,
                                                month: month,
                                                username: user,
                                                pass: pass
                                            })
                                        }).then(res => res.json()).then(res => {
                                            // console.log(res);

                                            if (res.DATA.length != 0)
                                                this.setState({
                                                    resultPo: res.DATA,
                                                    isLoading: false,
                                                    result: ''
                                                })
                                            else {
                                                this.setState({
                                                    resultPo: [],
                                                    isLoading: false,
                                                    result: 'Không tìm thấy kết quả phù hợp'
                                                })
                                            }
                                        }).catch(err => {
                                            this.setState({
                                                resultPo: [],
                                                isLoading: false,
                                                result: 'Lỗi: ' + err
                                            })
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
                        <CreatePo auth={{ user: user, pass: pass, userAuth: userAuth }} />
                    </View>
                </View>
                <View style={{ height: resultHeight }}>
                    {resultPo.length != 0 ? (
                        <ResultPo resultPo={resultPo} auth={{ user: user, pass: pass, userAuth: userAuth }} />
                    ) : null}
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
        marginRight: scale(10),
    },
    input: {
        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: scale(5),
        borderWidth: scale(1),
        borderRadius: scale(6),
        height: scale(34),
        padding: 0,
        height: scale(34),
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
});