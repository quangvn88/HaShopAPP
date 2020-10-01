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
import { scale } from '../../responsive/Responsive';

import { API_RELEASE_EBELN } from '../../api/ApiOrderApproval';
import Loader from '../../loading/Loader';

export default function Orders(props) {
    const { order, index, auth, orderList } = props;
    const [orderDetailButton, setOrderDetailButton] = useState('+');
    const [itemDetailButton, setItemDetailButton] = useState('+');
    const [orderDetail, setOderDetail] = useState(false);
    const [itemDetail, setItemDetail] = useState(false);
    const [isLoading, updateLoading] = useState(false);
    // const { user, pass } = auth;

    const removeOrder = (index) => {
        props.removeOrder(index);
    }
    const orderDetailButtonClick = () => {
        if (orderDetailButton == '+') {
            setOrderDetailButton('-');
            setOderDetail(true);
        } else {
            setOrderDetailButton('+');
            setOderDetail(false);
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

    const itemList = order.LISTMATHANG;
    const { user, pass } = auth;

    return (
        <View>
            <Loader
                loading={isLoading}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={[styles.buttonDetail, { marginTop: scale(10) }]}
                        activeOpacity={0.5}
                        onPress={orderDetailButtonClick}
                    >
                        <Text style={styles.textButtonDetail}>{orderDetailButton}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={orderDetailButtonClick}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{ textAlignVertical: 'center' }}>Đơn hàng: </Text>
                                <Text style={{ textAlignVertical: 'center' }}>Đơn vị: </Text>
                            </View>
                            <View>
                                <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>{order.EBELN}</Text>
                                <Text style={{ fontWeight: 'bold' }}>{order.BUKRS}</Text>
                            </View>
                        </View>
                        <Text style={{ fontWeight: 'bold' }}>{order.BUTXT}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.buttonRelease}
                    activeOpacity={0.5}
                    onPress={() => {
                        //Xu ly nut realease lenh xuat LENHXUAT.VBELN
                        const ebeln = order.EBELN
                        Alert.alert(
                            "Phê duyệt",
                            "Phê duyệt đơn hàng số: " + ebeln,
                            [
                                {
                                    text: "Hủy bỏ",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: "Đồng ý", onPress: () => {
                                        updateLoading(true);
                                        fetch(API_RELEASE_EBELN, {
                                            method: 'post',
                                            headers: {
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                ebeln: ebeln,
                                                username: user,
                                                pass: pass
                                            })
                                        }).then(res => res.json()).then(res => {
                                            updateLoading(false);
                                            if (res.RETURN.TYPE === "S") {
                                                orderList.splice(index, 1);
                                                setTimeout(() => {
                                                    Alert.alert(
                                                        "Phê duyệt thành công",
                                                        "Đơn hàng: " + ebeln,
                                                        [
                                                            {
                                                                text: "OK", onPress: () => {
                                                                    removeOrder({ resultOrder: orderList });
                                                                }
                                                            }
                                                        ],
                                                        { cancelable: false }
                                                    )
                                                }, 100)
                                            }
                                            // Alert.alert('Phê duyệt thành công', 'Đã phê duyệt đơn hàng số ' + ebeln);
                                            else {
                                                // console.log(res);
                                                updateLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert(
                                                        "Phê duyệt thất bại",
                                                        "Có lỗi xảy ra, vui lòng thử lại"
                                                    );
                                                }, 100)
                                            }
                                        }).catch(err => {
                                            // console.log(err);
                                            updateLoading(false);
                                            setTimeout(() => {
                                                Alert.alert(
                                                    "Phê duyệt thất bại",
                                                    "Lỗi:  " + err
                                                );
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
            {/* Con cua don hang*/}
            {
                orderDetail ? (
                    <View style={{ paddingLeft: scale(20) }}>
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
                                <View>
                                    <Text style={{ textAlignVertical: 'center' }}>Mặt hàng</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        {/* Con cua mat hang Scroll View*/}
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
                ) : null
            }
        </View >
    );
}
function Item({ item }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
                <ScrollView horizontal={true}>
                    <Text style={{ fontWeight: 'bold' }}>{item.MATHANG}</Text>
                </ScrollView>
            </View>
            {/* <View style={{ flexDirection: 'row' }}>
                <Text>S.lg: </Text>
                <Text style={{ fontWeight: 'bold' }}>{item.SOLUONG} </Text>
                <Text>({item.DONVI})</Text>
            </View> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text>S.lg: </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.SOLUONG} </Text>
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