export interface WidgetItem {
  label: string;
  icon: string;
  category: 'layout' | 'basic';
}

export const WIDGETS: WidgetItem[] = [
  // Mise en page
  { label: 'Conteneur', icon: 'check_box_outline_blank', category: 'layout' },
  { label: 'Grille', icon: 'grid_view', category: 'layout' },
  { label: 'Flex', icon: 'format_align_left', category: 'layout' },
  // Basique
  { label: 'Titre', icon: 'title', category: 'basic' },
  { label: 'Image', icon: 'image', category: 'basic' },
  { label: 'Éditeur de texte', icon: 'format_align_left', category: 'basic' },
  { label: 'Vidéo', icon: 'play_circle', category: 'basic' },
  { label: 'Liste d\'icônes', icon: 'format_list_bulleted', category: 'basic' },
  { label: 'Bouton', icon: 'smart_button', category: 'basic' },
  { label: 'Séparateur', icon: 'horizontal_rule', category: 'basic' }, // Using horizontal_rule as separator
  { label: 'Espaceur', icon: 'space_bar', category: 'basic' }, // Using space_bar as spacer
  { label: 'Google Maps', icon: 'map', category: 'basic' },
];
