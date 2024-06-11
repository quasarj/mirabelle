import React, { useState } from 'react';
import { TemplateContext } from './TemplateContext';

export default function TemplateContextProvider({ children, template }) {
  // const [template, setTemplate] = useState("MaskerVR");

  return (
    <TemplateContext.Provider value={ template }>
      {children}
    </TemplateContext.Provider>
  );
}