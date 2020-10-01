import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { scale } from '../../responsive/Responsive';

export default function ResultWarehouse(props) {
    const { resultWarehouse } = props;
    // console.log(props);
    return (
        <View style={{ borderRadius: scale(6), borderWidth: scale(1), padding: scale(5), backgroundColor: 'white' }}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                <View>
                    <Text>C.Code</Text>
                    <Text style={styles.textHidden}>6610</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>F.Month</Text>
                    <Text style={styles.textHidden}>01</Text>
                </View>
                <View>
                    <Text>F.Year</Text>
                    <Text style={styles.textHidden}>2020</Text>
                </View>
                <View>
                    <Text>T.Month</Text>
                    <Text style={styles.textHidden}>01</Text>
                </View>
                <View>
                    <Text>T.Year</Text>
                    <Text style={styles.textHidden}>2020</Text>
                </View>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{resultWarehouse.BUKRS}</Text>
                    <Text style={styles.textHidden}>C.Code</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{Number(resultWarehouse.VMMON)}</Text>
                    <Text style={styles.textHidden}>F.Month</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{resultWarehouse.VMGJA}</Text>
                    <Text style={styles.textHidden}>F.Year</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{Number(resultWarehouse.LFMON)}</Text>
                    <Text style={styles.textHidden}>T.Month</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{resultWarehouse.LFGJA}</Text>
                    <Text style={styles.textHidden}>T.Year</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    titleParam: {
        textAlignVertical: 'center', paddingRight: scale(10)
    },
    input:
    {
        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: scale(5),
        borderWidth: scale(1),
        borderRadius: scale(6),
    },
    textHidden: { textAlign: 'center', color: 'white' }

});