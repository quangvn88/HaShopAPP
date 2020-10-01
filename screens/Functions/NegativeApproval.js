import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

import { API_PLANTCODE, API_PRODUCTCODE } from '../../api/Api';
import { API_NEGATIVE } from '../../api/ApiNegativeApproval';

import ResultNegativeApproval from '../../components/NegativeApproval/ResultNegativeApproval';
import Loader from '../../loading/Loader';

import { scale } from '../../responsive/Responsive';

export default class NegativeApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPlantCode: [],
            listItemCode: [],
            plantCode: '',
            itemCode: '',
            user: '',
            pass: '',
            item: {},
            isLoading: false,
            result: ''
        };
    }
    componentDidMount() {
        let username;
        let password;
        let listItem;
        AsyncStorage.getItem('user').then((user) => {
            username = user;
        }).then(() => AsyncStorage.getItem('pass').then((pass) => {
            password = pass;
        })).then(() => AsyncStorage.getItem('listItemCode').then((listItemCode) => {
            listItem = listItemCode;
        })).then(() => AsyncStorage.getItem('listPlantCode').then((listPlantCode) => {
            this.setState({
                listItemCode: JSON.parse(listItem),
                listPlantCode: JSON.parse(listPlantCode),
                user: username,
                pass: password
            });
        }))
    };

    onChangeItemCode = text => this.setState({ itemCode: text.replace(/[^0-9]/g, '') });
    onChangePlantCode = text => this.setState({ plantCode: text });
    updateButtonApproval = data => this.setState(data);
    updateLoading = (boolean) => this.setState({ isLoading: boolean })

    render() {
        const { listItemCode, listPlantCode } = this.state;
        const { user, pass, plantCode, itemCode } = this.state;
        const { item, isLoading, result } = this.state;
        return (
            <View style={{ padding: scale(5) }}>
                <Loader loading={isLoading} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: scale(10), zIndex: 1 }}>
                    <View>
                        <View style={{ flexDirection: 'row', paddingBottom: scale(10), zIndex: 3 }}>
                            <Text style={styles.titleParam}>Mặt hàng</Text>
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    this.setState({ itemCode: item.name.substring(0, 7) });
                                }}
                                containerStyle={styles.containerStyle}
                                itemStyle={styles.itemInputStyle}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{ maxHeight: scale(200) }}
                                items={listItemCode}
                                resetValue={false}
                                textInputProps={
                                    {
                                        maxLength: 100,
                                        placeholder: "Mã mặt hàng",
                                        underlineColorAndroid: "transparent",
                                        style: styles.textInputStyle,
                                        // onTextChange: text => this.setState({ fromCompanyCode: text }),
                                        onTextChange: text => this.setState({ itemCode: text.replace(/[^0-9]/g, '') })
                                    }
                                }
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', zIndex: 2 }}>
                            <Text style={styles.titleParam}>Plant/Kho</Text>
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    this.setState({ plantCode: item.name.substring(0, 4) });
                                }}
                                containerStyle={styles.containerStylePlant}
                                itemStyle={styles.itemInputStyle}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{ maxHeight: scale(200) }}
                                items={listPlantCode}
                                resetValue={false}
                                textInputProps={
                                    {
                                        maxLength: 100,
                                        placeholder: "Mã kho",
                                        underlineColorAndroid: "transparent",
                                        style: styles.textInputStyle,
                                        onTextChange: text => this.setState({ plantCode: text }),
                                        // onTextChange: text => this.onChangePlantCode(text)
                                    }
                                }
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }}
                            />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', height: scale(80) }}>
                        <TouchableOpacity
                            style={styles.buttonSearch}
                            onPress={() => {
                                if (itemCode == '' && plantCode == '')
                                    this.setState({
                                        result: 'Chưa nhập mã mặt hàng, mã kho'
                                    })
                                else if (itemCode == '')
                                    this.setState({
                                        result: 'Chưa nhập mã mặt hàng'
                                    })
                                else if (plantCode == '')
                                    this.setState({
                                        result: 'Chưa nhập mă kho'
                                    })
                                else {
                                    this.updateLoading(true);
                                    const matnr = itemCode;
                                    const werks = plantCode;
                                    fetch(API_NEGATIVE, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            matnr: matnr,
                                            werks: werks,
                                            username: '' + user,
                                            pass: '' + pass
                                        })
                                    }).then(res => res.json()).then(res => {
                                        if (res.DATA.MATNR != '') {
                                            this.setState({
                                                item: res.DATA,
                                                isLoading: false,
                                                result: ''
                                            })
                                        } else {
                                            this.setState({
                                                item: {},
                                                isLoading: false,
                                                result: 'Không tìm thấy kết quả phù hợp'
                                            })
                                        }
                                    }).catch(err => {
                                        this.setState({
                                            item: {},
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
                <View style={{ zIndex: 0 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#e3610b' }}>{result}</Text>
                    </View>
                    {/* Result Negative Approval */}
                    <View >
                        {
                            ('MATNR' in item && item.MATNR != '') ? (
                                <ResultNegativeApproval
                                    item={item}
                                    auth={{ user: user, pass: pass }}
                                    updateButtonApproval={this.updateButtonApproval.bind(this)}
                                />
                                // <MatHang MATHANG={MATHANG} updateCheck={this.updateCheck.bind(this)} options={{ user: user, pass: pass, key: MATHANG.XMCNG }} />
                            ) : null
                        }
                    </View>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
        marginRight: scale(10),
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
        width: scale(220),
        backgroundColor: 'transparent',
        position: 'absolute',
        left: scale(80),
        zIndex: 2
    },
    containerStylePlant: {
        width: scale(220),
        backgroundColor: 'transparent',
        position: 'absolute',
        left: scale(80),
        zIndex: 1
    },
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
    textInputStyle: {
        height: scale(34),
        width: '100%',
        // padding: 0,
        textAlign: 'center',
        borderWidth: scale(1),
        borderRadius: scale(6),
        backgroundColor: 'white',
        padding: scale(5)
    }
});