/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {View, Text} from 'react-native';

const FormDescView = ({
  text,
  marginVertical,
  fontSize,
}: {
  text: string;
  marginVertical: any;
  fontSize: any;
}) => {
  return (
    <View style={{marginVertical: marginVertical}}>
      <Text style={{color: 'pink', fontSize: fontSize, lineHeight: 30}}>
        {text}
      </Text>
    </View>
  );
};

export default FormDescView;
