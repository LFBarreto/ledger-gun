import styled from "styled-components";

const Box = styled.div<{ withPadding?: boolean; withBorder?: boolean }>`
  padding: ${(p) => p.withPadding && `${p.theme.space[7]}px`};
  border: ${(p) => p.withBorder && `2px solid ${p.theme.colors.primary.c100}`};
`;

export default Box;
