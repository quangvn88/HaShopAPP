import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView
} from 'react-native';
import { scale } from '../../responsive/Responsive';
const sumQuantity = arr => {
    const quantity = arr.map((item) => {
        return item.FKLMG_ND + item.FKLMG_TX
    });
    const result = quantity.reduce((accumulator, currentValue) => accumulator + currentValue);
    return result;
};
const sumRevenue = arr => {
    const revenue = arr.map((item) => {
        return item.NETWR_ND + item.NETWR_TX
    });
    const result = revenue.reduce((accumulator, currentValue) => accumulator + currentValue);
    return result;
}

export default function DetailQuantityRevenue(props) {
    const { item, quantity } = props;
    const unit = quantity ? 'L15' : 'VNĐ';

    // console.log(item.LISTMATHANG);
    const convertNumber = (num) => {
        var str = num.toString();
        var result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return result;
    };
    const sum = quantity ? sumQuantity(item.LISTMATHANG) : sumRevenue(item.LISTMATHANG);
    const [itemDetailButton, setItemDetailButton] = useState('+');
    const [itemDetail, setItemDetail] = useState(false);
    const itemDetailButtonClick = () => {
        if (itemDetailButton == '+') {
            setItemDetailButton('-');
            setItemDetail(true);
        } else {
            setItemDetailButton('+');
            setItemDetail(false);
        }
    };
    // console.log(sum);
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.buttonDetail}
                        activeOpacity={0.5}
                        onPress={itemDetailButtonClick}
                    >
                        <Text style={styles.textButtonDetail}>{itemDetailButton}</Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity

                            activeOpacity={0.5}
                            onPress={itemDetailButtonClick}
                        >
                            <Text>{item.VTEXT}: </Text>
                        </TouchableOpacity>
                        {/* <Text>{item.VTEXT}: </Text> */}
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>{convertNumber(sum)} </Text>
                    <Text style={{ fontWeight: 'bold' }}>({unit})</Text>
                </View>
            </View>
            {itemDetail ? (
                <View>
                    <FlatList
                        data={item.LISTMATHANG}
                        renderItem={({ item }) =>
                            <Item item={item} unit={unit} />
                        }
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
            ) : null}
        </View>

    )
}
function Item({ item, unit }) {
    const convertNumber = (num) => {
        var str = num.toString();
        var result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return result;
    };
    const sum = unit == 'L15' ? (item.FKLMG_TX + item.FKLMG_ND) : (item.NETWR_ND + item.NETWR_TX);
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: scale(135) }}>
                <ScrollView horizontal={true}>
                    {/* {item.MATNR} -  */}
                    <Text style={{ fontWeight: 'bold' }}>{item.MAKTX}</Text>
                </ScrollView>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text>S.lg: </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>{convertNumber(sum)} </Text>
                    <Text style={{ fontWeight: 'bold' }}>({unit})</Text>
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
    },
    buttonRelease: {
        backgroundColor: 'green',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderRadius: scale(6),
        padding: scale(5),
        paddingHorizontal: scale(10)
    }
});