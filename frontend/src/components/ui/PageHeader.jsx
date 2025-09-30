import React from 'react';

// ✅ PAGEHEADER VAZIO PARA NÃO QUEBRAR OUTRAS PÁGINAS
const PageHeader = ({
  title,
  subtitle,
  actions = [],
  breadcrumb = [],
  className = ''
}) => {
  // Não renderiza nada - Layout já tem o header
  return null;
};

export default PageHeader;
