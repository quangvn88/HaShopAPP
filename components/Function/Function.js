import React from 'react'
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar
} from 'react-native'


import { scale } from '../../responsive/Responsive';

export default function Function(props) {
    const { functionProps, onPress, imageSource } = props;
    return (
        <TouchableOpacity
            activeOpacity={0.3}
            onPress={onPress}
        >
            <View style={styles.container}>
                <Image
                    style={styles.Image}
                    source={imageSource}
                />
                <Text style={styles.title}>{functionProps.title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: scale(5),
        borderRadius: scale(8),
        borderWidth: scale(5),
        backgroundColor: '#FFF',
        borderColor: "#FFF",
        margin: scale(4),
    },
    Image: {
        width: scale(70),
        height: scale(70)
    },
    title: {
        marginTop: scale(20),
        marginBottom: scale(8),
        textAlign: 'center',
        fontSize: 13
    },
});