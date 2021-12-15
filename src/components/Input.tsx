import React, { useCallback, useState } from "react";
import styled from "@ledgerhq/react-ui/components/styled";

const BaseInput = styled.input.attrs({ color: "primary.c100" })`
  background-color: transparent;
  border: none;
  caret-color: currentColor;
  height: auto;
  text-decoration: none !important;
  text-align: right;
  padding-right: 5px;
  resize: initial;
  width: 100%;
  height: 50px;
`;
export default function ChatInput({
  value = "",
  onChange,
  ...rest
}: Partial<{
  value: string;
  onChange?: (val?: string) => void;
  placeholder?: string;
  type: string;
}>): React.ReactElement {
  const [submited, setSubmited] = useState(false);
  const handleChange = useCallback(
    (evt) => {
      if (submited) {
        setSubmited(false);
      } else {
        onChange && onChange(evt.target.value);
      }
    },
    [onChange, submited]
  );

  return (
    <BaseInput
      autoFocus
      spellCheck="false"
      value={value}
      onChange={handleChange}
      {...rest}
    />
  );
}
