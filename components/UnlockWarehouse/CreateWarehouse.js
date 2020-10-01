import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    Alert
} from 'react-native';
import { CheckBox } from 'react-native-elements';

import { API_UNLOCK_WAREHOUSE } from '../../api/ApiUnlockWarehouse';
import Loader from '../../loading/Loader';

import { scale } from '../../responsive/Responsive';

export default function CreateWarehouse(props) {
    const [fiscalYear, onChangeYear] = useState('');
    const [period, onChangePeriod] = useState('');
    const { user, pass } = props.auth;
    const { companyCode } = props;
    const navigateResult = (data) => props.navigateResult(data);

    const [checkAndClosePeriod, setCheckAndClose] = useState(true);
    const [checkPeriod, setCheckPeriod] = useState(false);
    const [closePeriod, setClosePeriod] = useState(false);

    const [quantity, setQuantity] = useState(false);
    const [value, setValue] = useState(false);
    const [isLoading, updateLoading] = useState(false);
    const [condition, setCondition] = React.useState('');

    return (
        <View>
            <View style={{ borderRadius: scale(6), borderWidth: scale(1), padding: scale(5), backgroundColor: 'white' }}>
                <Loader loading={isLoading} />
                <View style={{ flexDirection: 'row', paddingBottom: scale(10), justifyContent: 'space-between' }}>
                    <View>
                        <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                            <Text style={styles.titleParam}>Period</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={2}
                                style={[styles.input, { width: scale(80), marginLeft: scale(58.5) }]}
                                onChangeText={text => onChangePeriod(text.replace(/[^0-9]/g, ''))}
                                value={period}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titleParam}>Fiscal Year</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={4}
                                style={[styles.input, { width: scale(80), marginLeft: scale(27.5) }]}
                                onChangeText={text => onChangeYear(text.replace(/[^0-9]/g, ''))}
                                value={fiscalYear}
                            />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={styles.buttonCreate}
                            onPress={() => {
                                if (companyCode == '' || fiscalYear == '' || period == '')
                                    setCondition('Chưa nhập đủ tham số')
                                else if (Number(fiscalYear) == 0 && Number(period) == 0)
                                    setCondition('Period và Fiscal Year cần khác 0')
                                else if (Number(fiscalYear) == 0)
                                    setCondition('Fiscal Year cần khác 0')
                                else if (Number(period) == 0)
                                    setCondition('Period cần khác 0')
                                else if (Number(period) > 12)
                                    setCondition('Period cần nhỏ hơn 12')
                                else {
                                    updateLoading(true);
                                    const bodyRequest = {
                                        bukrs: companyCode,
                                        period: period,
                                        year: fiscalYear,
                                        xcomp: checkAndClosePeriod ? 'X' : '',
                                        xinco: checkPeriod ? 'X' : '',
                                        xmove: closePeriod ? 'X' : '',
                                        xnegq: quantity ? 'X' : '',
                                        xnegv: value ? 'X' : '',
                                        username: user,
                                        pass: pass
                                    }
                                    fetch(API_UNLOCK_WAREHOUSE, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(bodyRequest)
                                    }).then(res => res.json()).then(res => {
                                        updateLoading(false);
                                        setCondition('');
                                        setTimeout(() => navigateResult(res.ET_DATA), 100)
                                    }).catch(err => {
                                        // console.log(err);
                                        updateLoading(false);
                                        setTimeout(() => {
                                            Alert.alert(
                                                "Mở kỳ thất bại",
                                                "Lỗi:  " + err
                                            );
                                        }, 100)
                                    })
                                }
                            }}
                        >
                            <Text style={{ color: 'white' }}>Thêm mới</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <CheckBox
                        containerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            paddingHorizontal: scale(5),
                            marginLeft: 0,
                            marginRight: scale(15),
                            margin: 0,
                            padding: scale(5)
                        }}
                        title='Check and then close period'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={checkAndClosePeriod}
                        onPress={() => {
                            setCheckAndClose(true);
                            setCheckPeriod(false);
                            setClosePeriod(false);
                        }}
                    />
                    <CheckBox
                        containerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            paddingHorizontal: scale(5),
                            marginLeft: 0,
                            marginRight: scale(15),
                            margin: 0,
                            padding: scale(5)
                        }}
                        title='Check period only'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={checkPeriod}
                        onPress={() => {
                            setCheckAndClose(false);
                            setCheckPeriod(true);
                            setClosePeriod(false);
                        }}
                    />
                    <CheckBox
                        containerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            paddingHorizontal: scale(5),
                            marginLeft: 0,
                            marginRight: scale(15),
                            margin: 0,
                            padding: scale(5)
                        }}
                        title='Close period only'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={closePeriod}
                        onPress={() => {
                            setCheckAndClose(false);
                            setCheckPeriod(false);
                            setClosePeriod(true);
                        }}
                    />
                    <CheckBox
                        containerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            paddingHorizontal: scale(5),
                            marginLeft: 0,
                            marginRight: scale(15),
                            margin: 0,
                            padding: scale(5)
                        }}
                        title='Allow Negative Quantities in Previous Period'
                        checked={quantity}
                        onPress={() => setQuantity(!quantity)}
                    />
                    <CheckBox
                        containerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            paddingHorizontal: scale(5),
                            marginLeft: 0,
                            marginRight: scale(15),
                            margin: 0,
                            padding: scale(5)
                        }}
                        title='Allow Negative Values in Previous Period'
                        checked={value}
                        onPress={() => setValue(!value)}
                    />
                </View>
            </View >
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: scale(10) }}>
                <Text style={{ color: '#e3610b' }}>{condition}</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    titleParam: {
        height: scale(34),
        lineHeight: scale(34),
        marginRight: scale(5)
    },
    input: {
        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: scale(5),
        borderWidth: scale(1),
        borderRadius: scale(6),
        height: scale(34),
        padding: 0
    },
    buttonCreate: {
        justifyContent: 'center',
        backgroundColor: '#28A745',
        borderColor: '#28A745',
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: scale(10),
    },
});