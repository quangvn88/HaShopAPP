import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { API_CHECK_NEGATIVE } from '../../api/ApiNegativeApproval';
import Loader from '../../loading/Loader';
import { scale } from '../../responsive/Responsive';

export default function ResultNegativeApproval(props) {
    const { item, auth } = props;
    var isApproval = item.XMCNG == '' ? true : false;
    const updateApproval = () => { isApproval = !isApproval };
    const { user, pass } = auth;
    const [isLoading, updateLoading] = useState(false);
    const updateButtonApproval = data => props.updateButtonApproval(data);

    return (
        <View style={styles.container}>
            <Loader
                loading={isLoading}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ paddingRight: scale(15) }}>
                    <Text style={{ paddingBottom: scale(10) }}>Mặt hàng</Text>
                    <Text style={{ paddingBottom: scale(10) }}>Plant/Kho</Text>
                    <Text style={{ paddingBottom: scale(10) }}>Tồn hiện tại</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.textValue}>{item.MATNR} - {item.MAKTX}</Text>
                    <Text style={styles.textValue}>{item.WERKS} - {item.NAME}</Text>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.CLABS} ({item.MEINS})</Text>
                        <TouchableOpacity
                            style={[styles.buttonApproval, { backgroundColor: isApproval ? 'green' : 'red', borderColor: isApproval ? 'green' : 'red' }]}
                            onPress={() => {
                                updateLoading(true);
                                const matnr = item.MATNR;
                                const werks = item.WERKS;
                                isApproval ? fetch(API_CHECK_NEGATIVE, {
                                    method: 'post',
                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        matnr: matnr,
                                        werks: werks,
                                        xmcng: 'X',
                                        username: user,
                                        pass: pass
                                    })
                                }).then(res => res.json()).then(res => {
                                    updateLoading(false);
                                    setTimeout(() => {
                                        Alert.alert(
                                            "Cho phép xuất âm",
                                            `${item.MATNR} - ${item.MAKTX}\n${item.NAME}`,
                                            [
                                                {
                                                    text: "OK", onPress: () => {
                                                        updateButtonApproval(prevState => ({
                                                            item: {
                                                                ...prevState.item,
                                                                XMCNG: 'X'
                                                            }
                                                        }));
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    }, 100);
                                    updateApproval();
                                }).catch((err) => {
                                    // console.log(error);
                                    updateLoading(false);
                                    setTimeout(() => {
                                        Alert.alert('Phê duyệt thất bại', 'Lỗi: ' + err);
                                    }, 100)
                                }) : fetch(API_CHECK_NEGATIVE, {
                                    method: 'post',
                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        matnr: matnr,
                                        werks: werks,
                                        xmcng: '',
                                        username: user,
                                        pass: pass
                                    })
                                }).then(res => res.json()).then(res => {
                                    updateLoading(false);
                                    setTimeout(() => {
                                        Alert.alert(
                                            "Không cho phép xuất âm",
                                            `${item.MATNR} - ${item.MAKTX}\n${item.NAME}`,
                                            [
                                                {
                                                    text: "OK", onPress: () => {

                                                        updateButtonApproval(prevState => ({
                                                            item: {
                                                                ...prevState.item,
                                                                XMCNG: ''
                                                            }
                                                        }));
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    }, 100)
                                    updateApproval();
                                }).catch((err) => {
                                    updateLoading(false)
                                    setTimeout(() => {
                                        Alert.alert(
                                            "Kết quả",
                                            "Lỗi: " + err,
                                        );
                                    }, 100)
                                })
                            }}
                        >
                            {
                                isApproval ? <Text style={{ color: 'white' }}>Phê duyệt</Text> :
                                    <Text style={{ color: 'white' }}>Không phê duyệt</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: { padding: scale(5), borderWidth: scale(1), borderRadius: scale(6), backgroundColor: 'white' },
    buttonApproval: { padding: scale(10), borderWidth: scale(1), borderRadius: scale(6) },
    textValue: { paddingBottom: scale(10), fontWeight: 'bold' }
});