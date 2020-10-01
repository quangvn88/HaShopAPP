import React, { Component, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    Alert
} from 'react-native';

import { API_UNLOCK_ACOUNTING } from '../../api/ApiUnlockAcounting';

import Loader from '../../loading/Loader';
import { scale } from '../../responsive/Responsive';

export default function CreateAcounting(props) {
    const [result, setResult] = useState('');
    const { auth, companyCode } = props;
    const { user, pass } = auth;
    const [fromMonth, onChangeFromMonth] = useState('');
    const [toMonth, onChangeToMonth] = useState('');
    const [fromYear, onChangeFromYear] = useState('');
    const [toYear, onChangeToYear] = useState('');
    const [isLoading, updateLoading] = useState(false);

    return (
        <View>
            <View style={{ borderRadius: scale(6), borderWidth: scale(1), padding: scale(5), backgroundColor: 'white' }}>
                <Loader loading={isLoading} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                            <Text style={styles.titleParam}>From Period</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={2}
                                style={[styles.input, { width: scale(43) }]}
                                onChangeText={text => onChangeFromMonth(text.replace(/[^0-9]/g, ''))}
                                value={fromMonth}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titleParam}>From Year</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={4}
                                style={[styles.input, { width: scale(58) }]}
                                onChangeText={text => onChangeFromYear(text.replace(/[^0-9]/g, ''))}
                                value={fromYear}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                            <Text style={styles.titleParam}>To Period</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={2}
                                style={[styles.input, { width: scale(43) }]}
                                onChangeText={text => onChangeToMonth(text.replace(/[^0-9]/g, ''))}
                                value={toMonth}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titleParam}>To Year</Text>
                            <TextInput
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                maxLength={4}
                                style={[styles.input, { width: scale(58) }]}
                                onChangeText={text => onChangeToYear(text.replace(/[^0-9]/g, ''))}
                                value={toYear}
                            />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={styles.buttonCreate}
                            onPress={() => {
                                if (
                                    companyCode == '' ||
                                    fromMonth == '' ||
                                    fromYear == '' ||
                                    toMonth == '' ||
                                    toYear == ''
                                )
                                    setResult('Bạn chưa nhập đủ tham số')
                                else if (Number(fromYear) == 0 || Number(toYear) == 0 || Number(fromMonth) == 0 || Number(toMonth) == 0)
                                    setResult('Period và Fiscal Year cần khác 0')
                                // Alert.alert('Thêm mới thất bại', 'Fiscal Year khác 0');
                                else if (Number(toMonth) > 16 || Number(fromMonth) > 16)
                                    setResult('Period cần nhỏ hơn 16')
                                else if (Number(toMonth) > Number(fromMonth))
                                    setResult('From Period cần nhỏ hơn To Period')
                                else {
                                    updateLoading(true);
                                    fetch(API_UNLOCK_ACOUNTING, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            bukrs: companyCode,
                                            fromperiod: fromMonth,
                                            toperiod: toMonth,
                                            fromyear: fromYear,
                                            toyear: toYear,
                                            username: user,
                                            pass: pass
                                        })
                                    }).then(res => res.json()).then(res => {
                                        updateLoading(false);
                                        setResult('');
                                        if (res.RETURN.TYPE == 'S') {
                                            setTimeout(() => {
                                                Alert.alert('Kết quả', 'Thêm mới kỳ kế toán thành công');
                                            }, 100)
                                        }
                                        else {
                                            setResult('Mã công ty không tồn tại')
                                            // Alert.alert('Kết quả', 'Mã công ty không tồn tại');
                                        }
                                    }).catch(err => {
                                        updateLoading(false);
                                        setResult("Lỗi:  " + err)
                                    })
                                }
                            }}
                        >
                            <Text style={{ color: 'white' }}>Thêm mới</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: scale(10) }}>
                <Text style={{ color: '#e3610b' }}>{result}</Text>
            </View>
        </View >
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