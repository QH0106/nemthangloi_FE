// import { ButtonPropsSizeOverrides, ButtonPropsVariantOverrides } from '@mui/material/Button';
import { PaletteColorOptions } from '@mui/material/styles';
import { TypographyStyleOptions } from '@mui/material/styles/createTypography';
import { CSSProperties } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'display-large': CSSProperties;
    'display-medium': CSSProperties;
    'display-small': CSSProperties;

    'headline-large': CSSProperties;
    'headline-medium': CSSProperties;
    'headline-small': CSSProperties;

    'title-large': CSSProperties;
    'title-medium': CSSProperties;
    'title-small': CSSProperties;

    'body-large': CSSProperties;
    'body-regular': CSSProperties;
    'body-light': CSSProperties;
    'body-medium': CSSProperties;
    'body-small': CSSProperties;

    'label-large': CSSProperties;
    'label-medium': CSSProperties;
    'label-small': CSSProperties;
  }
  interface TypographyVariantsOptions {
    'display-large': TypographyStyleOptions;
    'display-medium': TypographyStyleOptions;
    'display-small': TypographyStyleOptions;

    'headline-large': TypographyStyleOptions;
    'headline-medium': TypographyStyleOptions;
    'headline-small': TypographyStyleOptions;

    'title-large': TypographyStyleOptions;
    'title-medium': TypographyStyleOptions;
    'title-small': TypographyStyleOptions;

    'body-large': TypographyStyleOptions;
    'body-regular': TypographyStyleOptions;
    'body-light': TypographyStyleOptions;
    'body-medium': TypographyStyleOptions;
    'body-small': TypographyStyleOptions;

    'label-large': TypographyStyleOptions;
    'label-medium': TypographyStyleOptions;
    'label-small': TypographyStyleOptions;
  }
  interface BreakpointOverrides {
    '2xs': true;
    '2xl': true;
    '3xl': true;
    tablet: true;
  }

  interface PaletteColor {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    main: string;
    '500'?: string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  }

  interface Palette {
    brown: PaletteColor;
    dark: PaletteColor;
    light: PaletteColor;
    bgColor: {
      primary: string;
      secondary: string;
    };
  }

  interface PaletteOptions {
    brown: PaletteColorOptions;
    dark: PaletteColorOptions;
    light: PaletteColorOptions;
    bgColor: {
      primary: string;
      secondary: string;
    };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'display-large': true;
    'display-medium': true;
    'display-small': true;

    'headline-large': true;
    'headline-medium': true;
    'headline-small': true;

    'title-large': true;
    'title-medium': true;
    'title-small': true;

    'body-large': true;
    'body-regular': true;
    'body-light': true;
    'body-medium': true;
    'body-small': true;
    'body-xs': true;

    'label-large': true;
    'label-medium': true;
    'label-small': true;
    'label-xs': true;
    'label-xl': true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    contained: false;
    primary: true;
    secondary: true;
    outlined: true;
    icon: true;
  }
}
