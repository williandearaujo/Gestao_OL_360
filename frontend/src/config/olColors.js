// ✅ PALETA OFICIAL OL
export const OL_COLORS = {
  // Vermelhos OL
  primary: '#821314',      // Vermelho principal
  light: '#c9252c',        // Vermelho claro
  hover: '#6d0f10',        // Hover mais escuro
  bg: '#fef2f2',          // Background claro
  border: '#c9252c',       // Borders
  text: '#821314',         // Texto vermelho

  // Neutros
  black: '#000000',        // Preto textos
  white: '#ffffff',        // Branco fundos
  grayLight: '#fcfcfc',    // Cinza muito claro
  grayMedium: '#cccccc',   // Cinza médio

  // Estados
  success: '#22c55e',      // Verde sucesso
  warning: '#f59e0b',      // Amarelo aviso
  error: '#ef4444',        // Vermelho erro
  info: '#3b82f6'          // Azul informação
};

// ✅ HELPER CLASSES
export const OL_CLASSES = {
  // Backgrounds
  bgPrimary: `bg-[${OL_COLORS.primary}]`,
  bgLight: `bg-[${OL_COLORS.bg}]`,
  bgHover: `hover:bg-[${OL_COLORS.hover}]`,

  // Textos
  textPrimary: `text-[${OL_COLORS.primary}]`,
  textLight: `text-[${OL_COLORS.light}]`,

  // Borders
  borderPrimary: `border-[${OL_COLORS.primary}]`,
  borderLight: `border-[${OL_COLORS.light}]`,

  // Hovers
  hoverBorderLight: `hover:border-[${OL_COLORS.light}]`,
  hoverTextPrimary: `hover:text-[${OL_COLORS.primary}]`,
  hoverBgLight: `hover:bg-[${OL_COLORS.bg}]`
};

export default OL_COLORS;
