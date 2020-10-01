import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { scale } from '../../responsive/Responsive';

export default function ResultUser(props) {
    const { userDetail } = props;
    return (
        <View style={{ borderWidth: scale(1), borderRadius: scale(5), padding: scale(5), backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                    <Text style={styles.textTitle}>Title</Text>
                    <Text style={[styles.textValue, { width: scale(70), marginLeft: scale(57) }]}>{userDetail.TITLE}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                    <Text style={styles.textTitle}>Trạng thái</Text>
                    {userDetail.UFLAG == 0 ? <Text style={[styles.textStatus, { color: 'green' }]}>Hoạt động</Text>
                        : userDetail.UFLAG !== undefined ? < Text style={[styles.textStatus, { color: 'red' }]}>Bị khóa</Text>
                            : < Text style={styles.textStatus}></Text>
                    }
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                <Text style={styles.textTitle}>Last name</Text>
                <Text style={[styles.textValue, { width: scale(250), marginLeft: scale(14.3) }]}>{userDetail.NAME_LAST}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                <Text style={styles.textTitle}>First name</Text>
                <Text style={[styles.textValue, { width: scale(250), marginLeft: scale(13.6) }]}>{userDetail.NAME_FIRST}</Text>
            </View>
            {/* </View> */}
            <View>
                <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                    <Text style={styles.textTitle}>Function</Text>
                    <Text style={[styles.textValue, { width: scale(250), marginLeft: scale(26) }]}>{userDetail.FUNCTION}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                    <Text style={styles.textTitle}>Department</Text>
                    <Text style={[styles.textValue, { width: scale(250), marginLeft: scale(3) }]}>{userDetail.DEPARTMENT}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                        <Text style={styles.textTitle}>Room Num</Text>
                        <Text style={[styles.textValue, { width: scale(120), marginLeft: scale(9.5) }]}>{userDetail.ROOMNUMBER}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                        <Text style={styles.textTitle}>Phone</Text>
                        <Text style={[styles.textValue, { width: scale(120), marginLeft: scale(43) }]}>{userDetail.TEL_NUMBER}</Text>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10), justifyContent: 'flex-end' }}>
                        <Text style={styles.textTitle}>Floor</Text>
                        <Text style={[styles.textValue, { width: scale(110), marginLeft: scale(11) }]}>{userDetail.FLOOR}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                        <Text style={styles.textTitle}>Mobile</Text>
                        <Text style={[styles.textValue, { width: scale(110), textAlign: 'center' }]}>{userDetail.MOBILE}</Text>
                    </View>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    textValue: {
        paddingLeft: scale(10),
        paddingHorizontal: scale(5),
        height: scale(34),
        textAlignVertical: 'center',
        borderRadius: scale(6),
        borderWidth: scale(1),
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: scale(30),
    },
    textStatus: {
        height: scale(34),
        textAlignVertical: 'center',
        borderRadius: scale(6),
        borderWidth: scale(1),
        fontWeight: 'bold',
        textAlign: 'center',
        width: scale(100),
        lineHeight: scale(30),
    },
    textTitle: { textAlignVertical: 'center', paddingRight: scale(5), alignSelf: 'center' }
});
