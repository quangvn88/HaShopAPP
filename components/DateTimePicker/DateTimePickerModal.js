import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    Dimensions
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Icon from '../../assets/date_icon.png';
import { scale } from '../../responsive/Responsive';
const screenWidth = Math.round(Dimensions.get('window').width);

const FormatDate = (myValue) => {
    var date = myValue.getDate();
    date = date < 10 ? '0' + date : date;
    var month = myValue.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var year = myValue.getFullYear();
    return date + '/' + month + '/' + year;
}

const FormatHour = (myValue) => {
    var hour = myValue.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    var minutes = myValue.getMinutes();
    minutes.toString();
    if (minutes < 10) minutes = '0' + minutes;
    return hour + ':' + minutes + ':00';
}

const CurrentDate = () => {
    var date = new Date().getDate(); //Current Date
    date = date < 10 ? '0' + date : date;
    var month = new Date().getMonth() + 1; //Current Month
    month = month < 10 ? '0' + month : month;
    var year = new Date().getFullYear(); //Current Year
    return (date + '/' + month + '/' + year);
}

const CurrentHours = () => {
    var hours = new Date().getHours();
    if (hours < 10) hours = '0' + hours;
    var minutes = new Date().getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return (hours + ':' + minutes + ':00');
}

export default function DateTimePicker(props) {
    const { options } = props;
    const { mode } = options;
    const [myValue, setValue] = useState(mode == 'date' ? CurrentDate() : CurrentHours());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const pickerDateTime = (date) => {
        props.pickerDateTime(date);
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDatePickerVisibility(false);
        // console.log(options);
        switch (options.value) {
            case 'date':
                pickerDateTime(FormatDate(date));
                setValue(FormatDate(date));
                break;
            case 'fromDate':
                pickerDateTime({ fromDate: FormatDate(date) });
                setValue(FormatDate(date));
                break;
            case 'toDate':
                pickerDateTime({ toDate: FormatDate(date) });
                setValue(FormatDate(date));
                break;
            case 'time':
                pickerDateTime(FormatHour(date).substring(0, 6) + '00');
                setValue(FormatHour(date));
                break;
        }
    };
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={styles.input}
                    onPress={showDatePicker}
                >
                    <Text style={{ textAlign: 'center' }}>{myValue}</Text>
                </TouchableOpacity>
                {/* Button Icon */}
                <TouchableOpacity
                    onPress={showDatePicker}
                >
                    <Image
                        source={Icon}
                        style={styles.icon}
                    >
                    </Image>
                </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    input: {
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: scale(10),
        borderWidth: scale(1),
        borderRadius: scale(6),
        width: scale(130),
        height: scale(34)
    },
    icon: {
        width: scale(35),
        height: scale(35)
    }
})