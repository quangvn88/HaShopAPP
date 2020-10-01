import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    Alert,
    FlatList
} from 'react-native';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

import { API_COMPANYCODE, API_PRODUCTCODE } from '../../api/Api';
import { API_GET_QUANTITY_REVENUE } from '../../api/ApiQuantityRevenue';

import DateTimePicker from '../../components/DateTimePicker/DateTimePickerModal';
import Loader from '../../loading/Loader';
import Chart from '../../components/QuantityRevenue/ChartQuantityRevenue';
import Sum from '../../components/QuantityRevenue/SumQuantityRevenue';
import Detail from '../../components/QuantityRevenue/DetailQuantityRevenue';

import { scale } from '../../responsive/Responsive';
import { ScrollView } from 'react-native-gesture-handler';

const CurrentDate = () => {
    var date = new Date().getDate(); //Current Date
    date = date < 10 ? '0' + date : date;
    var month = new Date().getMonth() + 1; //Current Month
    month = month < 10 ? '0' + month : month;
    var year = new Date().getFullYear(); //Current Year
    return (date + '/' + month + '/' + year);
}

const checkUserAuth = userCompanyCode => (userCompanyCode === "*" || userCompanyCode === "8810");

const screenHeight = Math.round(Dimensions.get('window').height);
const paramsHeight = scale(190);
const bottomHeight = Platform.OS == 'ios' ? scale(100) : scale(50);
const headerHeight = Platform.OS == 'ios' ? scale(100) : scale(50);
const resultHeight = screenHeight - paramsHeight - headerHeight - bottomHeight;

export default class OrderApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyCode: [],
            itemCode: [],
            fromCompany: '',
            toCompany: '',
            fromDate: CurrentDate(),
            toDate: CurrentDate(),
            fromItem: '',
            toItem: '',
            user: '',
            pass: '',
            result: [],
            allRes: {},
            checked: {
                quantity: true,
                revenue: false,
            },
            isLoading: false,
            isDetail: false,
            condition: '',
            userAuth: props.route.params.userAuth,
        };
    };
    componentDidMount() {
        if (!checkUserAuth(this.state.userAuth.BUKRS)) {
            this.setState({
                fromCompany: this.state.userAuth.BUKRS,
                toCompany: this.state.userAuth.BUKRS
            })
        }
        let username;
        let password;
        let listItem;
        AsyncStorage.getItem('user').then((user) => {
            username = user;
        }).then(() => AsyncStorage.getItem('pass').then((pass) => {
            password = pass;
        })).then(() => AsyncStorage.getItem('listItemCode').then((listItemCode) => {
            listItem = listItemCode;
        })).then(() => AsyncStorage.getItem('listCompanyCode').then((listCompanyCode) => {
            this.setState({
                itemCode: JSON.parse(listItem),
                companyCode: JSON.parse(listCompanyCode),
                user: username,
                pass: password,
            })
        }))
    };
    pickerDateTime = data => this.setState(data);
    updateLoading = (boolean) => this.setState({ isLoading: boolean });

    render() {
        const { companyCode, itemCode, userAuth } = this.state;
        const { fromCompany, toCompany } = this.state;
        const { fromDate, toDate } = this.state;
        const { fromItem, toItem } = this.state;
        const { user, pass, isLoading, isDetail } = this.state;
        const { result, allRes, condition } = this.state;
        const { quantity, revenue } = this.state.checked;
        return (
            <View style={{ padding: 5 }}>
                <Loader loading={isLoading} />
                <View style={{ height: paramsHeight, zIndex: 3 }}>
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10), zIndex: 3 }}>
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
                                        this.setState({ fromCompany: item.name.substring(0, 4) });
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
                                                onTextChange: text => this.setState({ fromCompany: text })
                                            } : {
                                                value: userAuth.BUKRS,
                                                editable: false,
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ fromCompany: text })
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
                                        this.setState({ toCompany: item.name.substring(0, 4) });
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
                                                onTextChange: text => this.setState({ toCompany: text }),
                                            } : {
                                                value: userAuth.BUKRS,
                                                editable: false,
                                                maxLength: 100,
                                                placeholder: "Company Code",
                                                underlineColorAndroid: "transparent",
                                                style: styles.textInputStyle,
                                                onTextChange: text => this.setState({ toCompany: text }),
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
                                        this.setState({ fromItem: item.name.substring(0, 7) });
                                    }}
                                    containerStyle={styles.containerStyleItem}
                                    itemStyle={styles.itemInputStyle}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: scale(200) }}
                                    items={itemCode}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            maxLength: 100,
                                            placeholder: "Mã mặt hàng",
                                            underlineColorAndroid: "transparent",
                                            style: styles.textInputStyle,
                                            onTextChange: text => this.setState({ fromItem: text })
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
                                        this.setState({ toItem: item.name.substring(0, 7) });
                                    }}
                                    containerStyle={styles.containerStyleItem}
                                    itemStyle={styles.itemInputStyle}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: scale(200) }}
                                    items={itemCode}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            maxLength: 100,
                                            placeholder: "Mã mặt hàng",
                                            underlineColorAndroid: "transparent",
                                            style: styles.textInputStyle,
                                            onTextChange: text => this.setState({ toItem: text }),
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
                    {/* Button Search */}
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10), justifyContent: 'space-between', zIndex: 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                containerStyle={{
                                    backgroundColor: 'none',
                                    borderWidth: 0,
                                    paddingHorizontal: scale(5),
                                    marginLeft: 0,
                                    padding: scale(5),
                                    marginRight: scale(15),
                                    margin: 0,
                                    height: scale(34),
                                    justifyContent: 'center'
                                }}
                                center
                                title='Sản lượng'
                                textStyle={quantity ? { color: '#007bff' } : {}}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={quantity}
                                onPress={() => this.setState({ checked: { quantity: true, revenue: false } })}
                            />
                            <CheckBox
                                containerStyle={{
                                    backgroundColor: 'none',
                                    borderWidth: 0,
                                    paddingHorizontal: scale(5),
                                    marginLeft: 0,
                                    marginRight: scale(15),
                                    margin: 0,
                                    padding: scale(5),
                                    height: scale(34),
                                    justifyContent: 'center'
                                }}
                                center
                                title='Doanh thu'
                                textStyle={revenue ? { color: '#007bff' } : {}}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={revenue}
                                onPress={() => this.setState({ checked: { quantity: false, revenue: true } })}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.buttonSearch}
                                onPress={() => {
                                    this.updateLoading(true);
                                    fetch(API_GET_QUANTITY_REVENUE, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            frombukrs: fromCompany,
                                            tobukrs: toCompany,
                                            fromitem: fromItem,
                                            toitem: toItem,
                                            fromdate: moment(moment('' + (fromDate.replace(/\./g, '')), 'DDMMYYYY')).format('YYYYMMDD'),
                                            todate: moment(moment('' + (toDate.replace(/\./g, '')), 'DDMMYYYY')).format('YYYYMMDD'),
                                            username: user,
                                            pass: pass
                                        })
                                    }).then((res) => res.json()).then((res) => {
                                        // console.log(res);
                                        if (res.DATA.length != 0) {
                                            this.setState({
                                                result: res.DATA,
                                                allRes: res,
                                                isLoading: false,
                                                condition: ''
                                            })
                                        } else {
                                            this.setState({
                                                result: [],
                                                allRes: {},
                                                isLoading: false,
                                                condition: 'Không tìm thấy kết quả phù hợp'
                                            })
                                            // this.updateLoading(false);
                                            // setTimeout(() => {
                                            //     Alert.alert(
                                            //         "Kết quả",
                                            //         "Không tìm thấy kết quả phù hợp",
                                            //         [{
                                            //             text: "OK", onPress: () => this.setState({
                                            //                 result: [],
                                            //                 allRes: {}
                                            //             })
                                            //         }],
                                            //         { cancelable: false }
                                            //     );
                                            // }, 100)
                                        }
                                    }).catch(err => {
                                        this.setState({
                                            result: [],
                                            allRes: {},
                                            isLoading: false,
                                            condition: 'Lỗi: ' + err
                                        })
                                        // setTimeout(() => {
                                        //     Alert.alert(
                                        //         "Tìm kiếm thất bại",
                                        //         "Lỗi: " + err
                                        //     );
                                        // }, 100)
                                    })
                                }}
                            >
                                <Text style={{ color: 'white' }}>Tìm kiếm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ zIndex: 0 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#e3610b' }}>{condition}</Text>
                    </View>
                    {/* Result Quantity */}
                    <View style={{ height: resultHeight - scale(10) }}>
                        {result.length != 0 && quantity ? (
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: scale(5) }}>
                                    <Text> </Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: 'green',
                                            paddingHorizontal: scale(5),
                                            width: scale(75),
                                            borderRadius: scale(6),
                                            height: scale(30),
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            this.setState({ isDetail: !isDetail })
                                        }}
                                    >
                                        {isDetail ? (
                                            <Text style={{ textAlign: 'center', color: 'white', height: scale(34), lineHeight: scale(34) }}>Biểu đồ</Text>
                                        ) : (
                                                <Text style={{ textAlign: 'center', color: 'white', height: scale(34), lineHeight: scale(34) }}>Chi tiết</Text>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                {isDetail ? (
                                    <View style={{ padding: scale(5), height: resultHeight - scale(39) }}>
                                        <View style={{ borderBottomWidth: scale(1), height: scale(30) }}>
                                            <Sum quantity={quantity} allRes={allRes} result={result} />
                                        </View>
                                        <View style={{ paddingTop: scale(5), height: resultHeight - scale(80) }}>
                                            <FlatList
                                                data={result}
                                                renderItem={({ item }) =>
                                                    <View style={{ paddingBottom: scale(15) }}>
                                                        <Detail item={item} quantity={quantity} />
                                                    </View>
                                                }
                                                keyExtractor={(item, index) => `${index}`}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                        <View>
                                            <Chart quantity={quantity} allRes={allRes} height={resultHeight - scale(39)} />
                                        </View>
                                    )}
                            </View>
                        ) : null}
                        {result.length != 0 && revenue ? (
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: scale(5) }}>
                                    <Text> </Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: 'green',
                                            paddingHorizontal: scale(5),
                                            width: scale(75),
                                            borderRadius: scale(6),
                                            height: scale(30),
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            this.setState({ isDetail: !isDetail })
                                        }}
                                    >
                                        {isDetail ? (
                                            <Text style={{ textAlign: 'center', color: 'white', height: scale(34), lineHeight: scale(34) }}>Biểu đồ</Text>
                                        ) : (
                                                <Text style={{ textAlign: 'center', color: 'white', height: scale(34), lineHeight: scale(34) }}>Chi tiết</Text>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                {isDetail ? (
                                    <View style={{ padding: scale(5), height: resultHeight - scale(100) }}>
                                        <View style={{ borderBottomWidth: scale(1), height: scale(30) }}>
                                            <Sum quantity={quantity} allRes={allRes} result={result} />
                                        </View>
                                        <View style={{ paddingTop: scale(5), height: resultHeight - scale(80) }}>
                                            <FlatList
                                                data={result}
                                                renderItem={({ item }) =>
                                                    <View style={{ paddingBottom: scale(15) }}>
                                                        <Detail item={item} quantity={quantity} />
                                                    </View>
                                                }
                                                keyExtractor={(item, index) => `${index}`}
                                            />
                                        </View>
                                    </View>) : (
                                        <Chart quantity={quantity} allRes={allRes} height={resultHeight - scale(39)} />
                                    )}
                            </View>
                        ) : null}
                    </View>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
        marginRight: scale(8.6),
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
        // height: 30,
        padding: 0,
        zIndex: 3
        // backgroundColor: 'transparent',
    },
    containerStyleItem: {
        width: '100%',
        // height: 30,
        padding: 0,
        zIndex: 1
    },
    //style input search
    textInputStyle: {
        height: scale(34),
        width: '100%',
        // padding: 0,
        padding: scale(5),
        textAlign: 'center',
        borderWidth: scale(1),
        borderRadius: scale(6),
        backgroundColor: 'white',
    },
    //stytle item in search list
    itemInputStyle: {
        height: scale(50),
        // width: scale(100),
        paddingHorizontal: scale(5),
        // padding: scale(6),
        textAlign: 'center',
        backgroundColor: 'white',
        borderColor: '#bbb',
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: 0
    },
});