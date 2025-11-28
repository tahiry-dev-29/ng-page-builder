import { BlockStyles } from './block.interface';

/**
 * Converts BlockStyles object to CSS style object
 */
export function blockStylesToCSS(styles?: BlockStyles): Record<string, string> {
  if (!styles) return {};

  const cssStyles: Record<string, string> = {};

  // Direct mapping for most properties
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined) {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      cssStyles[cssKey] = value;
    }
  });

  return cssStyles;
}

/**
 * Converts BlockStyles to inline style string
 */
export function blockStylesToString(styles?: BlockStyles): string {
  const cssStyles = blockStylesToCSS(styles);
  return Object.entries(cssStyles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

/**
 * Merges multiple BlockStyles objects
 */
export function mergeBlockStyles(...styles: (BlockStyles | undefined)[]): BlockStyles {
  return styles
    .filter((style): style is BlockStyles => style !== undefined)
    .reduce((acc, style) => ({ ...acc, ...style }), {} as BlockStyles);
}

/**
 * Gets computed padding value
 */
export function getPadding(styles?: BlockStyles): string {
  if (!styles) return '0';
  
  if (styles.padding) return styles.padding;
  
  const top = styles.paddingTop || '0';
  const right = styles.paddingRight || '0';
  const bottom = styles.paddingBottom || '0';
  const left = styles.paddingLeft || '0';
  
  return `${top} ${right} ${bottom} ${left}`;
}

/**
 * Gets computed margin value
 */
export function getMargin(styles?: BlockStyles): string {
  if (!styles) return '0';
  
  if (styles.margin) return styles.margin;
  
  const top = styles.marginTop || '0';
  const right = styles.marginRight || '0';
  const bottom = styles.marginBottom || '0';
  const left = styles.marginLeft || '0';
  
  return `${top} ${right} ${bottom} ${left}`;
}
