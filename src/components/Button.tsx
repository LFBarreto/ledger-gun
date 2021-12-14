import styled from "styled-components";

const Button = styled.button`
  font-family: monospace;
  font-size: 1.1rem;
  line-height: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.primary.c100};
  border-radius: 0;
  color: ${(props) => props.theme.colors.primary.c100};
  background: ${(props) => props.theme.colors.background.main};
  padding: ${(props) => props.theme.space[3]}px;

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

export default Button;
