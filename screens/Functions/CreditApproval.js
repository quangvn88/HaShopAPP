import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
    Dimensions,
    FlatList,
    Alert
} from 'react-native';
import moment from 'moment';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

import { API_COMPANYCODE } from '../../api/Api';
import { API_VBELNS } from '../../api/ApiCreditApproval';

import DateTimePicker from '../../components/DateTimePicker/DateTimePickerModal';
import ResultCredit from '../../components/CreditApproval/ResultCreditApproval';
import Loader from '../../loading/Loader';

import { scale } from '../../responsive/Responsive';
const screenHeight = Math.round(Dimensions.get('window').height);
const paramsHeight = scale(150);
const headerHeight = Platform.OS == 'ios' ? scale(100) : scale(50);
const bottomHeight = Platform.OS == 'ios' ? scale(100) : scale(50);
const resultHeight = screenHeight - paramsHeight - headerHeight - bottomHeight;

const CurrentDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    return (date + '/' + month + '/' + year);
}

const checkUserAuth = userCompanyCode => (userCompanyCode === "*" || userCompanyCode === "8810");

export default class CreditApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyCode: [],
            fromCompanyCode: '',
            toCompanyCode: '',
            fromDate: CurrentDate(),
            toDate: CurrentDate(),
            query: '',
            user: '',
            pass: '',
            resultCredit: [],
            isLoading: false,
            result: '',
            userAuth: props.route.params.userAuth,
        };
    };

    componentDidMount() {
        if (!checkUserAuth(this.state.userAuth.BUKRS)) {
            this.setState({
                fromCompanyCode: this.state.userAuth.BUKRS,
                toCompanyCode: this.state.userAuth.BUKRS
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
                companyCode: JSON.parse(listCompanyCode),
                user: username,
                pass: password,
            });
        }));
    };
    onChangeSearch = text => this.setState({ query: text.replace(/[^0-9]/g, '') });
    pickerDateTime = data => this.setState(data);
    removeCredit = data => this.setState(data);
    updateLoading = (boolean) => this.setState({ isLoading: boolean });

    render() {
        const { companyCode, userAuth } = this.state
        const { fromCompanyCode, toCompanyCode } = this.state;
        const { fromDate, toDate } = this.state;
        const { user, pass, query } = this.state;
        const { resultCredit, isLoading, result } = this.state;

        return (
            <View style={{ padding: scale(5) }}>
                <Loader loading={isLoading} />
                <View style={{ height: paramsHeight }}>
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10), zIndex: 2 }}>
                        <View style={{ flexDirection: 'row', width: '50%' }}>
                            <Text style={styles.titleParam}>Từ</Text>
                            <View style={{
                                width: '82%',
                                // height: 30,
                                position: 'absolute',
                                right: 10
                            }}>
                                <SearchableDropdown
                                    onItemSelect={(item) => {
                                        this.setState({ fromCompanyCode: item.name.substring(0, 4) });
                                    }}
                                    containerStyle={styles.containerStyle}
                                    itemStyle={styles.itemInputStyle}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: scale(200) }}
                                    items={companyCode}
                                    resetValue={false}
                                    textInputProps={
                                        checkUserAuth(userAuth.BUKRS) ?
                                            {
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ fromCompanyCode: text }),
                                                // width: 120
                                            } : {
                                                value: userAuth.BUKRS,
                                                editable: false,
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ fromCompanyCode: text }),
                                                // width: 120
                                            }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: true,
                                        }
                                    }
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: '50%' }}>
                            <Text style={[styles.titleParam, { position: 'absolute', left: 0, width: '18%' }]}>Đến</Text>
                            <View style={{
                                width: '82%',
                                // height: 30,
                                position: 'absolute',
                                right: 0,
                            }}>
                                <SearchableDropdown
                                    onItemSelect={(item) => {
                                        this.setState({ toCompanyCode: item.name.substring(0, 4) });
                                    }}
                                    containerStyle={styles.containerStyle}
                                    itemStyle={styles.itemInputStyle}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: scale(200) }}
                                    items={companyCode}
                                    resetValue={false}
                                    textInputProps={
                                        checkUserAuth(userAuth.BUKRS) ?
                                            {
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ toCompanyCode: text }),
                                                // width: 120
                                            } : {
                                                value: userAuth.BUKRS,
                                                editable: false,
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ toCompanyCode: text }),
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
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10), zIndex: 0 }}>
                        <View style={{ flexDirection: 'row', width: '50%' }}>
                            <Text style={[styles.titleParam]}>Từ</Text>
                            <View style={{
                                width: scale(176.5),
                                // height: 30,
                                position: 'absolute',
                                right: 0,
                            }}>
                                <DateTimePicker
                                    options={{
                                        mode: 'date',
                                        value: 'fromDate',
                                    }}
                                    pickerDateTime={this.pickerDateTime.bind(this)}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'space-between' }}>
                            <Text style={styles.titleParam}>Đến</Text>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <DateTimePicker
                                    options={{
                                        mode: 'date',
                                        value: 'toDate',
                                    }}
                                    pickerDateTime={this.pickerDateTime.bind(this)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', marginBottom: scale(10) }}>
                            <Text style={[styles.titleParam, { paddingRight: scale(5) }]}>Lệnh xuất</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={10}
                                style={styles.input}
                                onChangeText={text => this.onChangeSearch(text)}
                                value={query}
                                placeholder={'Số lệnh xuất'}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.buttonSearch}
                                onPress={() => {
                                    // Alert.alert('tét');
                                    this.updateLoading(true);
                                    if (query == '') {
                                        const frombukrs = fromCompanyCode;
                                        const tobukrs = toCompanyCode;
                                        const todate = moment(moment('' + (toDate.replace(/\./g, '')), 'DDMMYYYY')).format('YYYYMMDD');
                                        const fromdate = moment(moment('' + (fromDate.replace(/\./g, '')), 'DDMMYYYY')).format('YYYYMMDD');
                                        fetch(API_VBELNS, {
                                            method: 'post',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                frombukrs: frombukrs,
                                                tobukrs: tobukrs,
                                                todate: todate,
                                                fromdate: fromdate,
                                                username: user,
                                                pass: pass
                                            })
                                        }).then(res => res.json()).then(res => {
                                            // console.log(res);
                                            if (res.DATA.length != 0) {
                                                this.setState({
                                                    resultCredit: res.DATA,
                                                    isLoading: false,
                                                    result: ''
                                                })
                                            }
                                            else {
                                                this.setState({
                                                    resultCredit: [],
                                                    result: 'Không tìm thấy kết quả phù hợp',
                                                    isLoading: false
                                                })
                                                // this.updateLoading(false);
                                                // setTimeout(() => {
                                                //     Alert.alert(
                                                //         "Kết quả",
                                                //         "Không tìm thấy kết quả phù hợp",
                                                //         [{
                                                //             text: "OK", onPress: () => this.setState({
                                                //                 resultCredit: [],
                                                //             })
                                                //         }],
                                                //         { cancelable: false }
                                                //     );
                                                // }, 100)
                                            }
                                        }).catch(err => {
                                            // console.log(err);
                                            // this.updateLoading(false);
                                            // setTimeout(() => {
                                            //     Alert.alert("Tìm kiếm thất bại", "Lỗi: " + err);
                                            // }, 100);
                                            this.setState({
                                                resultCredit: [],
                                                result: 'Lỗi: ' + err,
                                                isLoading: false
                                            })
                                        })
                                    } else {
                                        const frombukrs = fromCompanyCode;
                                        const tobukrs = toCompanyCode;
                                        const vbeln = query;
                                        fetch(API_VBELNS, {
                                            method: 'post',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                frombukrs: frombukrs,
                                                tobukrs: tobukrs,
                                                vbeln: vbeln,
                                                username: user,
                                                pass: pass
                                            })
                                        }).then(res => res.json()).then(res => {
                                            if (res.DATA.length != 0) {
                                                this.setState({
                                                    resultCredit: res.DATA,
                                                    isLoading: false,
                                                    result: ''
                                                })
                                            }
                                            else {
                                                this.setState({
                                                    resultCredit: [],
                                                    result: 'Không tìm thấy kết quả phù hợp',
                                                    isLoading: false
                                                })
                                                // this.updateLoading(false);
                                                // setTimeout(() => {
                                                //     Alert.alert(
                                                //         "Kết quả",
                                                //         "Không tìm thấy kết quả phù hợp",
                                                //         [{
                                                //             text: "OK", onPress: () => this.setState({
                                                //                 resultCredit: [],
                                                //             })
                                                //         }],
                                                //         { cancelable: false }
                                                //     );
                                                // }, 100)
                                            }
                                        }).catch(err => {
                                            // console.log(err);
                                            // this.updateLoading(false);
                                            // setTimeout(() => {
                                            //     Alert.alert("Tìm kiếm thất bại", "Lỗi: " + err)
                                            // }, 100)
                                            this.setState({
                                                resultCredit: [],
                                                result: 'Lỗi: ' + err,
                                                isLoading: false
                                            })
                                        })
                                    }
                                }}
                            >
                                <Text style={{ color: 'white' }}>Tìm kiếm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#e3610b' }}>{result}</Text>
                    </View>
                </View>
                {/* Result Credit */}
                <View>
                    <FlatList
                        data={resultCredit}
                        maxHeight={resultHeight}
                        renderItem={({ item, index }) =>
                            <View style={{ marginBottom: scale(25) }}>
                                <ResultCredit
                                    creditList={resultCredit}
                                    auth={{ user: user, pass: pass }}
                                    credit={item}
                                    index={index}
                                    removeCredit={this.removeCredit.bind(this)}
                                />
                            </View>
                        }
                        keyExtractor={(item, index) => `${index}`}
                        contentContainerStyle={{ marginLeft: scale(5), paddingBottom: scale(20) }}
                    />
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
    },
    input: {
        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: scale(5),
        borderWidth: scale(1),
        borderRadius: scale(6),
        height: scale(34),
        padding: 0,
        width: scale(220)
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
        // padding: scale(6),
        paddingHorizontal: scale(5),
        textAlign: 'center',
        backgroundColor: 'white',
        borderColor: '#bbb',
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: 0
    },
});