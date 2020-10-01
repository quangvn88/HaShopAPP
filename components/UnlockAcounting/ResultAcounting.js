import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import { scale } from '../../responsive/Responsive';

export default function ResultAcounting(props) {
    const { resultAcounting } = props;
    return (
        <View style={{ borderRadius: scale(6), borderWidth: scale(1), padding: scale(5), backgroundColor: 'white' }}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                <View>
                    <Text>C.Code</Text>
                    <Text style={styles.textHidden}>6610</Text>
                </View>
                <View>
                    <Text>Type</Text>
                    <Text style={styles.textHidden}>+</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>F.Period</Text>
                    <Text style={styles.textHidden}>01</Text>
                </View>
                <View>
                    <Text>F.Year</Text>
                    <Text style={styles.textHidden}>2020</Text>
                </View>
                <View>
                    <Text>T.Period</Text>
                    <Text style={styles.textHidden}>01</Text>
                </View>
                <View>
                    <Text>T.Year</Text>
                    <Text style={styles.textHidden}>2020</Text>
                </View>
            </View>
            {/* Flatlist result */}
            <FlatList
                data={resultAcounting}
                renderItem={({ item }) =>
                    <Item
                        item={item}
                    />}
                keyExtractor={(item, index) => `${index}`}
            />
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

function Item({ item }) {
    return (
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.BUKRS}</Text>
                <Text style={styles.textHidden}>C.Code</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.MKOAR}</Text>
                <Text style={styles.textHidden}>Type</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{Number(item.FRPE1)}</Text>
                <Text style={styles.textHidden}>F.Period</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.FRYE1}</Text>
                <Text style={styles.textHidden}>F.Year</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{Number(item.TOPE1)}</Text>
                <Text style={styles.textHidden}>T.Period</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.TOYE1}</Text>
                <Text style={styles.textHidden}>T.Year</Text>
            </View>
        </View>
    )
}