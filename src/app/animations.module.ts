import { animate, animation, style } from '@angular/animations';


export const letterEnter = animation(
  [
    style({
      opacity: 0,
    }),
    animate('.2s 0s ease-in', style({
      opacity: 1
    }))
  ], {
});

export const letterFalling = animation(
  [
    style({
      top: 0,
      // left: '{{xStart}}',
      transform: 'scale({{scale}}) translate3d({{xStart}}, -110%, 0)',
      zIndex: '{{zIndex}}'
    }),

    animate('{{fallingSpeed}} 0s {{fallingEase}}', style({
      // top: '{{yEnd}}',
      // left: '{{xEnd}}',
      transform: 'scale({{scale}}) translate3d({{xEnd}}, 100vh, 0)',
    }))
  ], {
});

export const fallingLeave = animation([
  style({
    opacity: 1
  }),
  animate('.6s ', style({
    opacity: 0
  }))
]);

export const found = animation([
  style({
    opacity: 1
  }),
  animate('1.4s cubic-bezier(0.36, 0, 0.66, -0.56)', style({
    opacity: 0,
    transform: 'scale(.5)'
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
