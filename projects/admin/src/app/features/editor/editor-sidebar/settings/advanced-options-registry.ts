/**
 * Registry of advanced options available for each widget type
 */

export type AdvancedOptionType =
  | 'layout'
  | 'custom-cursor'
  | 'wrapper-link'
  | 'liquid-glass'
  | 'image-masking'
  | 'sticky-section'
  | 'onepage-scroll'
  | 'motion-effects'
  | 'transformer'
  | 'responsive'
  | 'attributes'
  | 'custom-css';

export interface AdvancedOption {
  id: AdvancedOptionType;
  label: string;
  icon?: string;
  isPro?: boolean;
}

export const COMMON_OPTIONS: AdvancedOption[] = [
  { id: 'layout', label: 'Mise en page' },
  { id: 'responsive', label: 'Responsive' },
  { id: 'attributes', label: 'Attributs' },
  { id: 'custom-css', label: 'CSS personnalisé' },
];

export const CONTAINER_OPTIONS: AdvancedOption[] = [
  { id: 'layout', label: 'Mise en page' },
  { id: 'custom-cursor', label: 'Custom Cursor', icon: 'ads_click' },
  { id: 'wrapper-link', label: 'Wrapper Link', icon: 'link' },
  { id: 'liquid-glass', label: 'Liquid Glass Effects', icon: 'water_drop' },
  { id: 'image-masking', label: 'Image Masking', icon: 'image' },
  { id: 'sticky-section', label: 'Sticky Section - Royal Addons', icon: 'push_pin', isPro: true },
  {
    id: 'onepage-scroll',
    label: 'ElementsKit Onepage Scroll',
    icon: 'vertical_align_center',
    isPro: true,
  },
  { id: 'motion-effects', label: 'Effets de mouvement', icon: 'animation' },
  { id: 'transformer', label: 'Transformer', icon: 'transform' },
  { id: 'responsive', label: 'Responsive', icon: 'devices' },
  { id: 'attributes', label: 'Attributs', icon: 'code' },
  { id: 'custom-css', label: 'CSS personnalisé', icon: 'css', isPro: true },
];

export const IMAGE_OPTIONS: AdvancedOption[] = [
  { id: 'layout', label: 'Mise en page' },
  { id: 'image-masking', label: 'Image Masking', icon: 'image' },
  { id: 'motion-effects', label: 'Effets de mouvement', icon: 'animation' },
  { id: 'responsive', label: 'Responsive', icon: 'devices' },
  { id: 'attributes', label: 'Attributs', icon: 'code' },
  { id: 'custom-css', label: 'CSS personnalisé', icon: 'css', isPro: true },
];

export const TEXT_OPTIONS: AdvancedOption[] = [
  { id: 'layout', label: 'Mise en page' },
  { id: 'motion-effects', label: 'Effets de mouvement', icon: 'animation' },
  { id: 'responsive', label: 'Responsive', icon: 'devices' },
  { id: 'attributes', label: 'Attributs', icon: 'code' },
  { id: 'custom-css', label: 'CSS personnalisé', icon: 'css', isPro: true },
];

export const GRID_OPTIONS: AdvancedOption[] = CONTAINER_OPTIONS;

/**
 * Get advanced options for a widget type
 */
export function getAdvancedOptions(widgetType: string): AdvancedOption[] {
  switch (widgetType) {
    case 'container':
      return CONTAINER_OPTIONS;
    case 'grid':
      return GRID_OPTIONS;
    case 'image':
      return IMAGE_OPTIONS;
    case 'text':
      return TEXT_OPTIONS;
    default:
      return COMMON_OPTIONS;
  }
}
