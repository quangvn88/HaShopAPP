import React, { Component, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert
} from 'react-native';
import moment from 'moment';

import { API_CREATE_PO } from '../../api/ApiDeclareCycle';

import DateTimePicker from '../DateTimePicker/DateTimePickerModal';
import Loader from '../../loading/Loader';
import { scale } from '../../responsive/Responsive';

const CurrentDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    return (date + '/' + month + '/' + year);
}
const CurrentHours = () => {
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    return (hours + ':' + minutes + ':00');
}

const checkUserAuth = userCompanyCode => (userCompanyCode === "*" || userCompanyCode === "8810");

export default function CreatePo(props) {
    const [date, handleDate] = useState(CurrentDate());
    const [time, handleTime] = useState(CurrentHours());
    const [period, onChangePeriod] = useState('');
    const { user, pass, userAuth } = props.auth;
    const [isLoading, updateLoading] = useState(false);
    const [condition, setCondition] = React.useState('');

    const pickerDate = data => handleDate(data);
    const pickerTime = data => handleTime(data);

    return (
        <View>
            <View style={{ borderRadius: scale(6), borderWidth: scale(1), padding: scale(5), backgroundColor: 'white' }}>
                <Loader loading={isLoading} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: scale(10) }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.titleParam, { paddingRight: scale(43.8) }]}>Ngày</Text>
                        <View>
                            <DateTimePicker
                                options={{
                                    mode: 'date',
                                    value: 'date',
                                }}
                                pickerDateTime={pickerDate.bind(this)}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleParam}>Chu kỳ</Text>
                        <TextInput
                            returnKeyType='done'
                            keyboardType={'number-pad'}
                            maxLength={2}
                            style={styles.input}
                            onChangeText={text => onChangePeriod(text.replace(/[^0-9]/g, ''))}
                            value={period}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.titleParam}>Thời điểm</Text>
                        <View>
                            <DateTimePicker
                                options={{
                                    mode: 'time',
                                    value: 'time',
                                }}
                                pickerDateTime={pickerTime.bind(this)}
                            />
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.buttonCreate}
                            onPress={() => {
                                const bedat = moment(moment('' + (date.replace(/\./g, '')), 'DDMMYYYY')).format('YYYYMMDD');
                                const timef = time.split(":").join("");
                                const period_no = period;
                                if (!checkUserAuth(userAuth.BUKRS))
                                    setCondition('Tài khoản của bạn không có quyền thực hiện chức năng này');
                                else if (period_no == '' || Number(period_no) == 0)
                                    setCondition('Cần nhập kỳ để thêm mới');
                                // Alert.alert('Thêm mới thất bại', 'Bạn cần nhập kỳ để thêm mới');
                                else if (Number(period_no) < 0 || (Number(period_no) > 6))
                                    setCondition('Kỳ cần lớn hơn 0 và nhỏ hơn 6');
                                // Alert.alert('Thêm mới thất bại', 'Kỳ cần lớn hơn 0 và nhỏ hơn 6');
                                else {
                                    updateLoading(true);
                                    fetch(API_CREATE_PO, {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            bedat: bedat,
                                            timef: timef,
                                            period: period_no,
                                            username: user,
                                            pass: pass
                                        })
                                    }).then(res => res.json()).then(res => {
                                        updateLoading(false);
                                        setCondition('');
                                        setTimeout(() => {
                                            if (res.RETURN.TYPE == 'S')
                                                Alert.alert('Thành công', 'Thêm mới thành công PO CKG');
                                            else
                                                Alert.alert('Thất bại', 'Có lỗi xảy ra vui lòng thử lại');
                                        }, 100)
                                    }).catch(err => {
                                        updateLoading(false);
                                        setTimeout(() => {
                                            Alert.alert('Thất bại', 'Lỗi: ' + err);
                                        }, 100)

                                    })
                                }
                            }}
                        >
                            <Text style={{ color: 'white' }}>Thêm mới</Text>
                        </TouchableOpacity>
                    </View>
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
        // marginRight: scale(8.6),
        paddingRight: scale(10),
        // alignSelf:'center'
    },
    input:
    {
        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: scale(5),
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: 0,
        width: scale(50),
        height: scale(34),
    },
    buttonCreate: {
        justifyContent: 'center',
        backgroundColor: '#28A745',
        borderColor: 'transparent',
        // elevation:1,
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: scale(10),
    },
});