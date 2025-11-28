/**
 * Styles that can be applied to a block
 */
export interface BlockStyles {
  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: string;

  // Border
  border?: string;
  borderWidth?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomRightRadius?: string;
  borderBottomLeftRadius?: string;

  // Typography
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;

  // Box Shadow
  boxShadow?: string;

  // Layout
  width?: string;
  height?: string;
  minHeight?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  columnGap?: string;
  rowGap?: string;

  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed';
  zIndex?: string;

  // Other
  [key: string]: string | undefined;
}

/**
 * Content specific to different block types
 */
export interface TextContent {
  text: string;
}

export interface ImageContent {
  src: string;
  alt?: string;
}

export interface GridContent {
  columns: number;
  rows: number;
}

/**
 * Core Block interface
 */
export interface Block {
  id: string;
  type: 'container' | 'grid' | 'text' | 'image' | 'video' | 'button' | 'separator' | 'spacer' | 'map';
  label?: string;
  styles?: BlockStyles;
  content?: TextContent | ImageContent | GridContent | any;
  children?: Block[];
}
