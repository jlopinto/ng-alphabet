import { animate, animation, style } from '@angular/animations';

export const fallingEnter = animation(
  [
    style({
      top: 0,
      left: '{{xStart}}',
      transform: 'scale({{scale}})',
      zIndex: '{{zIndex}}'
    }),
    animate('{{fallingSpeed}}', style({
      top: '{{yEnd}}',
      left: '{{xEnd}}',
      transform: 'scale({{scale}})',
    }))
  ], {
});

export const fallingLeave = animation([
  style({
    opacity: 1
  }),
  //TODO: Fix visual issue
  animate('.6s', style({
    opacity: 0
  }))
]);

export const fadeModals = animation(
  [
    style({
      opacity: '{{opacityStart}}',
      transform: 'translate3d(0, {{translateYStart}}, 0)'
    }),
    animate('{{animSpeed}}', style({
      opacity: '{{opacityEnd}}',
      transform: 'translate3d(0, {{translateYEnd}}, 0)'
    }))
  ], {
  params: {
    animSpeed: '.5s',
    opacityEnd: '0.5',
    translateYStart: '0',
    translateYEnd: '0'
  }
});

export const fade = animation(
  [
    style({
      opacity: '{{opacityStart}}'
    }),
    animate('{{animSpeed}}', style({
      opacity: '{{opacityEnd}}'
    }))
  ], {
  params: {
    animSpeed: '.5s',
  }
});
