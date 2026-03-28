

const baseTheme = {
  components: {
    MuiTypography: {
      defaultProps: {
        variant: 'body-large',
      },
      variants: [
        {
          props: { variant: 'display-large' },
          style: {
            fontSize: '57px',
            fontWeight: 700,
            lineHeight: '64px',
            letterSpacing: '-0.25px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '36px',
              lineHeight: '44px',
            },
          },
        },
        {
          props: { variant: 'display-medium' },
          style: {
            fontSize: '45px',
            fontWeight: 700,
            lineHeight: '52px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'display-small' },
          style: {
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: '44px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'headline-large' },
          style: {
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '40px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '16px',
              lineHeight: '24px',
            },
          },
        },
        {
          props: { variant: 'headline-medium' },
          style: {
            fontSize: '28px',
            fontWeight: 600,
            lineHeight: '36px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '18px',
              lineHeight: '24px',
            },
          },
        },
        {
          props: { variant: 'headline-small' },
          style: {
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '32px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
            },
          },
        },

        {
          props: { variant: 'title-large' },
          style: {
            fontSize: '22px',
            fontWeight: 400,
            lineHeight: '28px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '14px',
              lineHeight: '20px',
            },
          },
        },
        {
          props: { variant: 'title-medium' },
          style: {
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '0.15px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'title-small' },
          style: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '0.1px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '11px',
              lineHeight: '16px',
            },
          },
        },

        {
          props: { variant: 'body-large' },
          style: {
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '28px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '14px',
              lineHeight: '20px',
            },
          },
        },
        {
          props: { variant: 'body-regular' },
          style: {
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '28px',
            letterSpacing: '0px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'body-light' },
          style: {
            fontSize: '16px',
            fontWeight: 300,
            lineHeight: '24px',
            letterSpacing: '0.15px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '12px',
              lineHeight: '18px',
            },
          },
        },
        {
          props: { variant: 'body-medium' },
          style: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '0.15px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '12px',
              lineHeight: '18px',
            },
          },
        },
        {
          props: { variant: 'body-small' },
          style: {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '0.1px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '11px',
              lineHeight: '16px',
            },
          },
        },
        {
          props: { variant: 'body-xs' },
          style: {
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '0.1px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'label-large' },
          style: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '0.1px',
            fontFamily: 'var(--font-inter), sans-serif',
            '@media (max-width:900px)': {
              fontSize: '11px',
              lineHeight: '16px',
            },
          },
        },
        {
          props: { variant: 'label-medium' },
          style: {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '16px',
            letterSpacing: '0.5px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'label-small' },
          style: {
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '16px',
            letterSpacing: '0.5px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'label-xs' },
          style: {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '16px',
            letterSpacing: '0.5px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'label-xl' },
          style: {
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '14px',
            letterSpacing: '0.5px',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
      ],
    },
    MuiButton: {
      defaultProps: {
        variant: 'primary',
      },
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            background: 'transparent',
            border: '1px solid #DE3E96',
            // background: 'linear-gradient(90deg, #F6A81C 0%, #FFC828 100%)',
            color: '#DE3E96',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            background: 'linear-gradient(270deg, #EEEEEE 0%, #DEDEDE 100%)',
            color: 'black',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            backgroundColor: '#FFFFFF0A',
            color: 'white',
            border: 'none',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        },
      ],
      styleOverrides: {
        sizeLarge: {
          height: '52px',
        },
        sizeMedium: {
          height: '40px',
        },
        sizeSmall: {
          height: '32px',
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        sx: {
          borderRadius: 1,
          bgcolor: 'dark.400',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&.MuiPaginationItem-ellipsis': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '&.modal-sm': {
            width: '480px !important',
          },
        },
      },
    },
  },
  palette: {
    primary: {
      '50': '#ffe6ee',
      '100': '#ffb0cc',
      '200': '#ff8ab3',
      '300': '#ff5490',
      '400': '#ff337a',
      main: '#DE3E96',
      '600': '#e80051',
      '700': '#b5003f',
      '800': '#8c0031',
      '900': '#6b0025',
    },
    secondary: {
      '50': '#ffeff0',
      '100': '#ffced1',
      '200': '#ffb7bb',
      '300': '#ff969c',
      '400': '#ff8189',
      main: '#ff626b',
      '600': '#e85961',
      '700': '#b5464c',
      '800': '#8c363b',
      '900': '#6b292d',
    },
    info: {
      '50': '#eef8fb',
      '100': '#cae8f1',
      '200': '#b0ddeb',
      '300': '#8ccde2',
      '400': '#76c3dc',
      main: '#54b4d3',
      '600': '#4ca4c0',
      '700': '#3c8096',
      '800': '#2e6374',
      '900': '#234c59',
    },
    error: {
      '50': '#fcedf0',
      '100': '#f4c8cf',
      '200': '#efadb8',
      '300': '#e88797',
      '400': '#e37083',
      '500': '#dc4c64',
      '600': '#c8455b',
      '700': '#9c3647',
      '800': '#792a37',
      '900': '#5c202a',
    },
    success: {
      '50': '#e8f6ed',
      '100': '#b6e3c8',
      '200': '#93d5ad',
      '300': '#62c288',
      '400': '#43b671',
      '500': '#14a44d',
      '600': '#129546',
      '700': '#0e7437',
      '800': '#0b5a2a',
      '900': '#084520',
    },
    warning: {
      '50': '#fcf6e8',
      '100': '#f7e2b8',
      '200': '#f3d496',
      '300': '#edc066',
      '400': '#e9b449',
      '500': '#e4a11b',
      '600': '#cf9319',
      '700': '#a27213',
      '800': '#7d590f',
      '900': '#60440b',
    },
    brown: {
      main: '#2a2525',
    },
    dark: {
      '50': '#dbdbdb',
      '100': '#c3c3c3',
      '200': '#939393',
      '300': '#636363',
      '400': '#505050',
      '500': '#333333',
      '600': '#2c2c2c',
      '700': '#222222',
      '800': '#141414',
      '900': '#0f0f0f',
      main: '#1C1919',
    },
    light: {
      '50': '#ffffff',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e9e9e9',
      '400': '#e5e5e5',
      '500': '#dedede',
      '600': '#cacaca',
      '700': '#9e9e9e',
      '800': '#7a7a7a',
      '900': '#5d5d5d',
    },
    text: {
      // primary: '#000000',
      secondary: '#FFFFFF',
      disabled: '#FFFFFF26',
      primary: '#DE3E96', // Color Brand
      // secondary: '#767272',
      // disabled: '#FFFFFF26',
    },
    bgColor: {
      primary: '#FFFFFF',
      secondary: '#de3e96',
    },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      '2xs': 375,
      sm: 600,
      md: 900,
      tablet: 1024,
      lg: 1200,
      xl: 1536,
      '2xl': 1920,
      '3xl': 2560,
    },
  },
};

export { baseTheme };
