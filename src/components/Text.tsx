import styled from "styled-components";

const Text = styled.span<{ bold?: boolean }>`
  font-family: monospace;
  line-height: 1.5rem;
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.primary.c100};
  ${(p) => p.bold && "font-weight: bold"};
`;

export default Text;
