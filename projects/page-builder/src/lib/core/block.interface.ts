/**
 * Styles that can be applied to a block
 */
export interface BlockStyles {
  // Layout
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: string;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  columnGap?: string;
  rowGap?: string;

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

  // Sizing
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  lineHeight?: string;
  letterSpacing?: string;
  color?: string;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;

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

  // Effects
  boxShadow?: string;
  textShadow?: string;
  opacity?: string;

  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;

  // Transform
  transform?: string;
  transition?: string;

  // Cursor
  cursor?: string;

  // Allow custom properties
  [key: string]: string | undefined;
}

/**
 * Responsive styles container
 */
export interface ResponsiveStyles {
  desktop: BlockStyles;
  tablet?: BlockStyles;
  mobile?: BlockStyles;
  hover?: BlockStyles;
}

/**
 * Content types for different blocks
 */
export interface TextContent {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export interface ImageContent {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ButtonContent {
  text: string;
  link?: string;
  target?: '_self' | '_blank';
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface SpacerContent {
  height: string;
}

export interface DividerContent {
  style: 'solid' | 'dashed' | 'dotted';
  width: string;
  color: string;
}

import { CdkDragDrop } from '@angular/cdk/drag-drop';

export type BlockType =
  | 'container'
  | 'grid'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'spacer'
  | 'divider'
  | 'video'
  | 'icon-list'
  | 'map';

export interface BlockDropEvent {
  event: CdkDragDrop<Block[], any>;
  targetId: string;
}

/**
 * Core Block interface - matches Elementor structure
 */
export interface Block {
  id: string;
  type: BlockType;
  label?: string;
  data?: TextContent | ImageContent | ButtonContent | SpacerContent | DividerContent | Record<string, any>;
  styles: ResponsiveStyles;
  children?: Block[];
}

/**
 * Helper to create default styles
 */
export function createDefaultStyles(overrides?: Partial<BlockStyles>): ResponsiveStyles {
  return {
    desktop: {
      ...overrides
    }
  };
}

/**
 * Helper to merge responsive styles for a given device
 */
export function getComputedStyles(
  styles: ResponsiveStyles, 
  device: 'desktop' | 'tablet' | 'mobile',
  isHovered: boolean = false
): BlockStyles {
  let computed: BlockStyles = { ...styles.desktop };
  
  // Apply tablet overrides
  if (device === 'tablet' || device === 'mobile') {
    if (styles.tablet) {
      computed = { ...computed, ...styles.tablet };
    }
  }
  
  // Apply mobile overrides
  if (device === 'mobile') {
    if (styles.mobile) {
      computed = { ...computed, ...styles.mobile };
    }
  }
  
  // Apply hover state
  if (isHovered && styles.hover) {
    computed = { ...computed, ...styles.hover };
  }
  
  return computed;
}
