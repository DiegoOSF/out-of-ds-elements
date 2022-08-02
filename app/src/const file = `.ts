const file = `
import { StyleSheet, Platform } from 'react-native';
import { units } from '../../../styles/utils';
import { fonts } from '../../../styles/fonts';

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: 'center',
    color: '#013F3C',
    fontSize: units.fontSizeSm,
    fontFamily: fonts.bold,
    paddingVertical: units.buttonPadding,
    backgroundColor: 'transparent',
    ...Platform.select({
      android: { paddingVertical: 13 },
    }),
  },
  disabledTextStyle: {
    color: '#9F9F9F',
  },
  buttonStyle: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: units.buttonRadius,
  },
  activeButtonStyle: {
    backgroundColor: '#BCF236',
  },
  disabledButtonStyle: {
    backgroundColor: '#F1F1F1',
  },
});

export default styles;
`

const REGEX_HEXADECIMAL = RegExp(/#((\w{2})(\w{2})(\w{2})|(\w{3}))/gm)

console.log(file.match(REGEX_HEXADECIMAL))
