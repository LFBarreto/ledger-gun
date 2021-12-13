import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./global";
import { ThemeNames, palettes } from "./palettes";
import defaultTheme, { Theme } from "./theme";

interface Props {
  children: React.ReactNode;
  selectedPalette?: ThemeNames;
}

export const StyleProvider = ({
  children,
  selectedPalette = "light",
}: Props): React.ReactElement => {
  const theme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        ...palettes[selectedPalette],
        palette: palettes[selectedPalette],
      },
      theme: selectedPalette,
    }),
    [selectedPalette]
  );
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
