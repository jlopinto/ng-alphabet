import { animate, animation, style } from '@angular/animations';

export const fallingEnter = animation(
  [
    style({ top: 0, left: '{{xStart}}' }),
    animate('{{fallingSpeed}}', style({
      top: '100%', left: '{{xEnd}}'
    }))
  ], {
  params: {
    fallingSpeed: '7s',
    xStart: '10%',
    xend: '20%'
  }
});

export const fallingLeave = animation([
  style({
    opacity: 1
  }),
  animate('.2s', style({
    opacity: 0
  }))
]);
