import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CollapsibleSectionComponent } from './collapsible-section.component';
import { SelectControlComponent } from '../controls/select-control.component';
import { SliderControlComponent } from '../controls/slider-control.component';

@Component({
  selector: 'app-container-settings',
  imports: [CollapsibleSectionComponent, SelectControlComponent, SliderControlComponent],
  template: `
    <app-collapsible-section 
      title="Conteneur" 
      [defaultOpen]="defaultOpen()"
    >
      <app-select-control 
        label="Mise en page du conteneur" 
        [options]="layoutOptions()"
      />
      
      <app-select-control 
        label="Largeur du contenu" 
        [options]="widthOptions()"
      />
      
      <app-slider-control 
        label="Largeur" 
        [min]="0" 
        [max]="2000"
        [availableUnits]="['px', '%', 'em', 'rem', 'vw']"
      />
      
      <app-slider-control 
        label="Hauteur mini" 
        [min]="0" 
        [max]="1000"
        [availableUnits]="['px', '%', 'em', 'rem', 'vh']"
      />
      
      <p class="text-[10px] text-gray-400 italic mb-4">
        Pour atteindre la pleine hauteur du conteneur, utilisez 100vh.
      </p>
    </app-collapsible-section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerSettingsComponent {
  defaultOpen = input(true);
  
  layoutOptions = signal(['Grille', 'Flex', 'Block']);
  widthOptions = signal(['Encadré', 'Pleine largeur']);
}
