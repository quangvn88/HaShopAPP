import React, { useState } from 'react';
import {
    View,
    Text,
} from 'react-native'

export default function DetailQuantityRevenue(props) {
    // console.log(props);
    const { allRes, quantity } = props;
    const sum = quantity ? (allRes.ESUM_FKLMG_ND + allRes.ESUM_FKLMG_TX) : (allRes.ESUM_NETWR_ND + allRes.ESUM_NETWR_TX)
    const unit = quantity ? 'L15' : 'VNĐ';
    const convertNumber = (num) => {
        var str = num.toString();
        var result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return result;
    };
    return (
        <View >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text>Tổng:</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>{convertNumber(sum)} </Text>
                    <Text style={{ fontWeight: 'bold' }}>({unit})</Text>
                </View>
            </View>
        </View >
    )
}