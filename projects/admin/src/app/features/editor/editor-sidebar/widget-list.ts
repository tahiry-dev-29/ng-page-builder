import { Block, BlockType, ResponsiveStyles, BlockStyles } from 'page-builder';

export interface WidgetItem {
  label: string;
  icon: string;
  category: 'layout' | 'basic';
  blockType: BlockType;
}

// Helper to create default responsive styles
function createDefaultStyles(overrides?: Partial<BlockStyles>): ResponsiveStyles {
  return {
    desktop: { ...overrides }
  };
}

export const WIDGETS: WidgetItem[] = [
  // Layout
  { label: 'Conteneur', icon: 'check_box_outline_blank', category: 'layout', blockType: 'container' },
  { label: 'Grille', icon: 'grid_view', category: 'layout', blockType: 'grid' },
  // Basic
  { label: 'Titre', icon: 'title', category: 'basic', blockType: 'heading' },
  { label: 'Texte', icon: 'format_align_left', category: 'basic', blockType: 'text' },
  { label: 'Image', icon: 'image', category: 'basic', blockType: 'image' },
  { label: 'Bouton', icon: 'smart_button', category: 'basic', blockType: 'button' },
  { label: 'Espaceur', icon: 'space_bar', category: 'basic', blockType: 'spacer' },
  { label: 'Séparateur', icon: 'horizontal_rule', category: 'basic', blockType: 'divider' },
  { label: 'Vidéo', icon: 'play_circle', category: 'basic', blockType: 'video' },
  { label: 'Liste d\'icônes', icon: 'format_list_bulleted', category: 'basic', blockType: 'icon-list' },
  { label: 'Google Maps', icon: 'map', category: 'basic', blockType: 'map' },
];

// Create block from widget with responsive styles structure
export function createBlockFromWidget(widget: WidgetItem, id: string): Block {
  switch (widget.blockType) {
    case 'container':
      return {
        id,
        type: 'container',
        label: 'Conteneur',
        data: {},
        styles: createDefaultStyles({
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          minHeight: '100px',
          backgroundColor: '#ffffff'
        }),
        children: []
      };

    case 'grid':
      return {
        id,
        type: 'grid',
        label: 'Grille',
        data: { columns: 2, rows: 1 },
        styles: createDefaultStyles({
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          padding: '20px'
        }),
        children: []
      };

    case 'heading':
      return {
        id,
        type: 'heading',
        label: 'Titre',
        data: { text: 'Nouveau Titre', tag: 'h2' },
        styles: createDefaultStyles({
          fontSize: '32px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '16px'
        })
      };

    case 'text':
      return {
        id,
        type: 'text',
        label: 'Texte',
        data: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        styles: createDefaultStyles({
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4b5563'
        })
      };

    case 'image':
      return {
        id,
        type: 'image',
        label: 'Image',
        data: { src: 'https://placehold.co/600x400', alt: 'Placeholder image' },
        styles: createDefaultStyles({
          width: '100%',
          borderRadius: '8px'
        })
      };

    case 'button':
      return {
        id,
        type: 'button',
        label: 'Bouton',
        data: { text: 'Click Me', link: '#', target: '_self' },
        styles: createDefaultStyles({
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '6px',
          fontWeight: '500',
          textAlign: 'center',
          cursor: 'pointer'
        })
      };

    case 'spacer':
      return {
        id,
        type: 'spacer',
        label: 'Espaceur',
        data: { height: '50px' },
        styles: createDefaultStyles({
          height: '50px'
        })
      };

    case 'divider':
      return {
        id,
        type: 'divider',
        label: 'Séparateur',
        data: { style: 'solid', width: '100%', color: '#e5e7eb' },
        styles: createDefaultStyles({
          borderTop: '1px solid #e5e7eb',
          margin: '20px 0',
          width: '100%'
        })
      };

    case 'video':
      return {
        id,
        type: 'video',
        label: 'Vidéo',
        data: { src: '' },
        styles: createDefaultStyles({
          width: '100%',
          aspectRatio: '16/9'
        })
      };

    default:
      return {
        id,
        type: widget.blockType,
        label: widget.label,
        data: {},
        styles: createDefaultStyles({})
      };
  }
}
