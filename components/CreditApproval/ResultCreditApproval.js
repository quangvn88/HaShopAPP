import React, { useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    FlatList,
    Alert,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

import { API_RELEASE_VBELN } from '../../api/ApiCreditApproval';
import Loader from '../../loading/Loader';
import { scale } from '../../responsive/Responsive';

export default function Orders(props) {
    const { credit, index, auth, creditList } = props;
    const [creditDetailButton, setCreditDetailButton] = useState('+');
    const [itemDetailButton, setItemDetailButton] = useState('+');
    const [creditDetail, setCreditDetail] = useState(false);
    const [itemDetail, setItemDetail] = useState(false);
    const [isLoading, updateLoading] = useState(false);
    const { user, pass } = auth;

    const removeCredit = (index) => {
        props.removeCredit(index);
    }

    const creditDetailButtonClick = () => {
        if (creditDetailButton == '+') {
            setCreditDetailButton('-');
            setCreditDetail(true);
        } else {
            setCreditDetailButton('+');
            setCreditDetail(false);
        }
    };
    const itemDetailButtonClick = () => {
        if (itemDetailButton == '+') {
            setItemDetailButton('-');
            setItemDetail(true);
        } else {
            setItemDetailButton('+');
            setItemDetail(false);
        }
    };
    const convertNumber = (num) => {
        var str = num.toString();
        var result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return result;
    }
    const itemList = credit.LISTMATHANG;
    return (
        <View>
            <Loader loading={isLoading} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.buttonDetail}
                        activeOpacity={0.5}
                        onPress={creditDetailButtonClick}
                    >
                        <Text style={styles.textButtonDetail}>{creditDetailButton}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={creditDetailButtonClick}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginRight: 5 }}>
                                <Text style={{ textAlignVertical: 'center' }}>Lệnh xuất: </Text>
                                <Text style={{ textAlignVertical: 'center' }}>Delivery Date:</Text>
                            </View>
                            <View>
                                <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>{credit.VBELN}</Text>
                                <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>{credit.NGAYXUAT}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.buttonRelease}
                    activeOpacity={0.5}
                    onPress={() => {
                        const vbeln = credit.VBELN
                        Alert.alert(
                            "Phê duyệt",
                            "Phê duyệt lệnh xuất số: " + vbeln,
                            [
                                {
                                    text: "Hủy bỏ",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: "Đồng ý", onPress: () => {
                                        updateLoading(true);
                                        fetch(API_RELEASE_VBELN, {
                                            method: 'post',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                vbeln: vbeln,
                                                username: user,
                                                pass: pass
                                            })
                                        }).then(res => res.json()).then(res => {
                                            updateLoading(false);
                                            if (res.RETURN.TYPE === "S") {
                                                creditList.splice(index, 1);
                                                setTimeout(() => {
                                                    Alert.alert(
                                                        "Phê duyệt thành công",
                                                        "Lệnh xuất: " + vbeln,
                                                        [
                                                            {
                                                                text: "OK", onPress: () => {
                                                                    removeCredit({ resultCredit: creditList });
                                                                }
                                                            }
                                                        ],
                                                        { cancelable: false }
                                                    );
                                                }, 100)
                                            }
                                            else {
                                                // console.log(res);
                                                updateLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert('Phê duyệt thất bại', 'Có lỗi xảy ra, vui lòng thử lại');
                                                }, 100)
                                            }
                                        }).catch(err => {
                                            // console.log(err);
                                            updateLoading(false);
                                            setTimeout(() => {
                                                Alert.alert(
                                                    "Phê duyệt thất bại",
                                                    "Lỗi: " + err,
                                                )
                                            }, 100)
                                        })
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }}
                >
                    <Text style={{ color: 'white' }}>Release</Text>
                </TouchableOpacity>
            </View>
            {creditDetail ? (
                <View style={{ paddingLeft: scale(20) }}>
                    <View >
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Khách hàng: </Text>
                                <ScrollView horizontal={true}>
                                    <Text style={{ fontWeight: 'bold' }}>{credit.KHACHHANG}</Text>
                                </ScrollView>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ textAlignVertical: 'center' }}>Hạn mức: </Text>
                                    <Text style={{ textAlignVertical: 'center' }}>Công nợ: </Text>
                                    <Text style={{ textAlignVertical: 'center' }}>Hạn mức còn lại: </Text>
                                    <Text style={{ textAlignVertical: 'center' }}>Tổng nợ đáo hạn: </Text>
                                    <Text style={{ textAlignVertical: 'center' }}>Số đáo hạn dài nhất: </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'right', fontWeight: 'bold' }}>{convertNumber(credit.HANMUC)}</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'right', fontWeight: 'bold' }}>{convertNumber(credit.CONGNO)}</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'right', fontWeight: 'bold' }}>{convertNumber(credit.HMCONLAI)}</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'right', fontWeight: 'bold' }}>{convertNumber(credit.E_DMBTR)}</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'right', fontWeight: 'bold' }}>{credit.E_MAX_DUE}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold' }}>(VNĐ)</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold' }}>(VNĐ)</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold' }}>(VNĐ)</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold' }}>(VNĐ)</Text>
                                        <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold' }}>(Ngày)</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.buttonDetail}
                                    activeOpacity={0.5}
                                    onPress={itemDetailButtonClick}
                                >
                                    <Text style={styles.textButtonDetail}>{itemDetailButton}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={itemDetailButtonClick}
                                >
                                    <Text style={{ textAlignVertical: 'center' }}>Mặt hàng</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                    {itemDetail ? (
                        <FlatList
                            data={itemList}
                            renderItem={({ item }) =>
                                <Item
                                    item={item}
                                />}
                            keyExtractor={(item, index) => `${index}`}
                        />
                    ) : null}
                </View>
            ) : null}
        </View>
    );
}
function Item({ item }) {
    const convertNumber = (num) => {
        var str = num.toString();
        var result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return result;
    }
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
                <ScrollView horizontal={true}>
                    <Text style={{ fontWeight: 'bold' }}>{item.MATHANG}</Text>
                </ScrollView>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text>S.lg: </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>{convertNumber(item.SOLUONG)} </Text>
                    <Text style={{ fontWeight: 'bold' }}>({item.DONVI})</Text>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    buttonDetail: {
        width: scale(30),
        height: scale(30),
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: scale(5),
        marginRight: scale(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButtonDetail: {
        fontSize: scale(20),
        height: scale(30),
        lineHeight: scale(27),
    }
    ,
    buttonRelease: {
        backgroundColor: 'green',
        justifyContent: 'center',
        borderColor: 'green',
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: scale(5),
        paddingHorizontal: scale(10)
    }
});