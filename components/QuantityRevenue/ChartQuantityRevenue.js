import React, { useState, Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from '../../responsive/Responsive';

// Tính tổng sản lượng nội địa

export default class ChartQuantityRevenue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: this.props.quantity,
      allRes: this.props.allRes,
      value: this.props.quantity ? [this.props.allRes.ESUM_FKLMG_ND, this.props.allRes.ESUM_FKLMG_TX] : [this.props.allRes.ESUM_NETWR_ND, this.props.allRes.ESUM_NETWR_TX],
      title: this.props.quantity ? 'sản lượng' : 'doanh thu',
      name: this.props.quantity ? 'Sản lượng' : 'Doanh thu',
      unit: this.props.quantity ? 'L15' : 'VNĐ',
      height: this.props.height,
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        quantity: nextProps.quantity,
        allRes: nextProps.allRes,
        value: nextProps.quantity ? [nextProps.allRes.ESUM_FKLMG_ND, nextProps.allRes.ESUM_FKLMG_TX] : [nextProps.allRes.ESUM_NETWR_ND, nextProps.allRes.ESUM_NETWR_TX],
        title: nextProps.quantity ? 'sản lượng' : 'doanh thu',
        name: nextProps.quantity ? 'Sản lượng' : 'Doanh thu',
        unit: nextProps.quantity ? 'L15' : 'VNĐ',
        height: this.props.height,
      })
    }
  }
  render() {
    const { height, allRes, value, title, name, unit } = this.state;
    const chartOptions =
    {
      title: {
        text: 'Biểu đồ ' + title
      },
      chart: {
        type: 'column'
      },
      series: [
        {
          name: name,
          data: value
        },
      ],
      xAxis: {
        categories: [
          'Nội địa',
          'Tái xuất',
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: unit
        }
      },
      credits: {
        enabled: false,
      },
    }

    const modules = ['highcharts-more', 'solid-gauge'];
    return (
      <View style={{ height: height }}>
        <ScrollView>
          <HighchartsReactNative
            styles={[styles.container, { height: scale(470) }]}
            options={chartOptions}
            modules={modules}
            useSSL={true}
            useCDN={true}
          />
        </ScrollView>
      </View >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
  }
});