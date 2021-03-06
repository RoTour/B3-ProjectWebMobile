import { StyleSheet } from 'react-native';

export const AppCss = StyleSheet.create({
  margin: {
    margin: 10,
  },
  bigMargin: {
    margin: 20,
  },
  bigMarginBottom: {
    marginBottom: 20,
  },
  primaryBg: {
    backgroundColor: '#44d62c',
  },
  bg: {
    backgroundColor: '#080C1E',
    flex: 1,
  },
  white: {
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
  },
  bigText: {
    fontSize: 18,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexStretch: {
    display: 'flex',
    alignItems: 'stretch',
  },
  rounded: {
    borderRadius: 10,
  },
  expand: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    color: '#fff',
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
    alignItems: undefined,
  },
  fullWidth: {
    width: '100%',
  },
});
