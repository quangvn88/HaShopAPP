import React from 'react';
import {
    View,
    Text,
    FlatList,
} from 'react-native';
import { scale } from '../../responsive/Responsive';

export default function ResultCreateWarehouse(props) {
    const { resultShow } = props.route.params;
    return (
        <View>
            <FlatList
                data={resultShow}
                renderItem={({ item }) =>
                    <View style={{ padding: scale(10) }}>
                        <Text style={{ fontSize:17 }}>{item}</Text>
                    </View>
                }
                keyExtractor={(item, index) => `${index}`}
            />
        </View>
    )
}
// color: '#e01414',