import React, { useState, Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Dimensions
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { API_DELETE_PO } from '../../api/ApiDeclareCycle';

import Loader from '../../loading/Loader';
import { scale } from '../../responsive/Responsive';
const screenHeight = Math.round(Dimensions.get('window').height);
const paramsHeight = scale(220);
const bottomHeight = scale(50);
const headerHeight = scale(50);
const resultHeight = screenHeight - paramsHeight - headerHeight - bottomHeight - scale(100);

export default class ResultPo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            resultPo: props.resultPo,
        };
    }
    updateResultPo = data => this.setState(data);

    render() {
        const { auth, resultPo } = this.state;
        return (
            <View style={{ backgroundColor: 'white', borderRadius: scale(6), borderWidth: scale(1), padding: scale(5), backgroundColor: 'white' }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                    <View>
                        <Text style={{ textAlign: 'center' }}>Ngày CKG</Text>
                        <Text style={styles.textHidden}>01.06.2020</Text>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center' }}>Thời điểm</Text>
                        <Text style={styles.textHidden}>00:00:00</Text>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center' }}>Năm</Text>
                        <Text style={styles.textHidden}>2020</Text>
                    </View>
                    <View>
                        <Text>Tháng</Text>
                        <Text style={styles.textHidden}>1</Text>
                    </View>
                    <View>
                        <Text>Chu kỳ</Text>
                        <Text style={styles.textHidden}>1</Text>
                    </View>
                    <View style={styles.textHidden}>
                        <AntDesign name="delete" color={'white'} size={24} />
                        <View style={{ marginTop: -25 }}>
                            <AntDesign name="delete" color={'white'} size={24} />
                        </View>
                    </View>
                </View>
                {/* List result */}
                <FlatList
                    data={resultPo}
                    renderItem={({ item, index }) =>
                        <View>
                            <ResultPoList
                                item={item}
                                index={index}
                                auth={auth}
                                updateResultPo={this.updateResultPo.bind(this)}
                                resultPo={resultPo}
                            />
                        </View>
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
            </View >
        )
    }
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
        borderRadius: scale(5),
    },
    textHidden: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
    valueHidden: { textAlign: 'center', color: 'white' }
});

function ResultPoList(props) {
    const { item, index, auth, resultPo } = props;
    const userCompanyCode = auth.BUKRS;
    const updateResultPo = data => props.updateResultPo(data);
    const [isLoading, updateLoading] = useState(false);
    const checkUserAuth = userCompanyCode => (userCompanyCode === "*" || userCompanyCode === "8810");
    return (
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingTop: scale(5) }}>
            <Loader loading={isLoading} />
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.BEDAT}</Text>
                <Text style={styles.valueHidden}>Ngày CKG</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.TIME_F}</Text>
                <Text style={styles.valueHidden}>Thời điểm</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.GJAHR}</Text>
                <Text style={styles.valueHidden}>Năm</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{Number(item.ZMONTH)}</Text>
                <Text style={styles.valueHidden}>Tháng</Text>
            </View>
            <View>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{Number(item.PERIOD_NO)}</Text>
                <Text style={styles.valueHidden}>Chu kỳ</Text>
            </View>
            <View>
                <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={() => {
                        if (!checkUserAuth(userCompanyCode))
                            Alert.alert('Thất bại', 'Tài khoản của bạn không có quyền thực hiện chức năng này');
                        else {
                            updateLoading(true);
                            fetch(API_DELETE_PO, {
                                method: 'post',
                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    bedat: item.BEDAT,
                                    timef: item.TIME_F,
                                    username: auth.user,
                                    pass: auth.pass
                                })
                            }).then(res => res.json()).then(res => {
                                updateLoading(false);
                                setTimeout(() => {
                                    if (res.RETURN.TYPE == 'S') {
                                        resultPo.splice(index, 1);
                                        Alert.alert('Thành công', 'Xóa thành công PO CKG',
                                            [
                                                {
                                                    text: "OK", onPress: () => {
                                                        updateResultPo({ resultPo: resultPo });
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    } else
                                        Alert.alert('Thất bại', 'Có lỗi xảy ra vui lòng thử lại');
                                }, 100)
                            }).catch(err => {
                                updateLoading(false);
                                setTimeout(() => {
                                    Alert.alert('Thất bại', 'Lỗi: ' + err);
                                }, 100)
                            })
                        }
                    }}
                >
                    <View style={{ marginTop: scale(-3) }}>
                        <AntDesign name="delete" color={'red'} size={24} />
                    </View>

                    {/* <Text style={{ textAlign: 'center', paddingHorizontal: 10, color: 'white' }}>Xóa</Text> */}
                </TouchableOpacity>
                <View>
                    <AntDesign name="delete" color={'white'} size={24} />
                </View>
            </View>
        </View>
    )
}