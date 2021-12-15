import styled from "styled-components";

export const BaseButton = styled.button`
  font-family: monospace;
  font-size: 1.1rem;
  line-height: 1.5rem;
  color: ${(props) => props.theme.colors.primary.c100};
  background: ${(props) => props.theme.colors.background.main};
  border: transparent;

  :hover {
    background: ${(props) => props.theme.colors.primary.c100};
    color: ${(props) => props.theme.colors.background.main};
  }

  :active {
    font-weight: bold;
    background: ${(props) => props.theme.colors.primary.c100};
    color: ${(props) => props.theme.colors.background.main};
  }
`;

const Button = styled(BaseButton)`
  border: 2px solid ${(props) => props.theme.colors.primary.c100};
  border-radius: 0;
  padding: ${(props) => props.theme.space[3]}px;
`;

export default Button;
