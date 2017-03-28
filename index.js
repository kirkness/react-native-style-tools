// @flow
import { StyleSheet, Dimensions } from 'react-native';

const dimensions = Dimensions.get('window');

const config = {};

/**
 * Percentage width or height of the screen.
 */
export function percentage(perc: number, direction: 'height' | 'width') {
  if (!direction) {
    throw new Error('You must supply a direction (\'height\', \'width\') to percentage.');
  }
  return dimensions[direction] * (perc / 100);
}

/**
 * Mutates global config obj to add consts.
 */
export function buildConsts(consts: { [key: any]: any }): void {
  config.consts = { ...consts };
}


/**
 * Create a stylesheet, call back is passed the global consts.
 */
export function createStyleSheet(callback: Function): { [key: string]: number } {
  if (!config.consts) {
    console.warn('createStyleSheet found no constants, make sure you first call buildConsts');
  }
  const styles = callback(config.consts);
  const styleSheet = StyleSheet.create(styles);
  return { ...styleSheet, __original: styles };
}

const SCALABLE_PROPS = [
  'width',
  'height',
  'margin',
  'padding',
  'fontsize',
  'radius',
];

const isScaleable = (key, value) => {
  console.log({ key, value });
  return SCALABLE_PROPS.some(prop => ~key.toLowerCase().indexOf(prop)) &&
    typeof value === 'number';
};

/**
 * Scale a stylesheet's scaleable props by a factor.
 */
export function scale(factor, { __original }) {
  return createStyleSheet(() => (
    Object.keys(__original).reduce((styles, key) => ({
      ...styles,
      [key]: Object.keys(__original[key]).reduce((styleSub, styleSubKey) => ({
        ...styleSub,
        [styleSubKey]: isScaleable(styleSubKey, __original[key][styleSubKey])
          ? (__original[key][styleSubKey] * factor) : __original[key][styleSubKey],
      }), {}),
    }), {})
  ));
}


/**
 * Import option 2.
 */
export default {
  createStyleSheet,
  buildConsts,
  percentage,
  scale,
};
