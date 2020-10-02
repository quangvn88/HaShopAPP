import * as React from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import AppStyle from '../../theme';
import Param from './param';

export const PoScreen = () => {
  const [result, handleResult] = React.useState({
    data: [],
    warning: '',
    isNewData: false
  });

  // use memo param
  const paramComponent = React.useMemo(() =>
    <Param
      result={result}
      handleResult={handleResult}
    />
    , [result]
  );

  return (
    <View style={AppStyle.StyleCommon.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          {paramComponent}
        </View>
      </TouchableWithoutFeedback>
      {result.data.length != 0 ? resultComponent : null}
    </View>
  );
};