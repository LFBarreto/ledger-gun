import React, { useCallback, useEffect, useState } from "react";
import { keyframes } from "styled-components";
import styled from "@ledgerhq/react-ui/components/styled";
import { Flex } from "@ledgerhq/react-ui";

const blink = keyframes`
  0% {
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  74% {
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;

const BaseInput = styled.textarea`
  background-color: transparent;
  border: none;
  caret-color: currentColor;
  height: auto;
  text-decoration: none !important;
  text-align: right;
  padding-right: 5px;
  resize: initial;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 0;
`;

const Caret = styled.span.attrs({ bg: "primary.c100" })`
  display: inline-block;
  margin-left: 0.5em;
  width: 1em;
  height: 1em;
  animation: ${blink} 1s linear infinite;
`;

const TextHolder = styled.div.attrs({ color: "primary.c100", flex: 1 })`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: transparent;
  border: none;
  caret-color: currentColor;
  height: auto;xc
  text-decoration: none !important;
  text-align: right;
  padding-right: 5px;
  pointer-events: none;
  white-space: pre;
`;

const ENTER_KEY_CODE = 13;

export default function ChatInput({
  defaultValue = "",
  onChange,
  onSubmit,
  ...rest
}: Partial<{
  defaultValue: string;
  onChange?: (val?: string) => void;
  onSubmit?: (val?: string) => void;
}>): React.ReactElement {
  const [value, setValue] = useState(defaultValue);
  const [submited, setSubmited] = useState(false);
  const handleChange = useCallback(
    (evt) => {
      if (submited) {
        setSubmited(false);
      } else {
        onChange && onChange(evt.target.value);
        setValue(evt.target.value);
      }
    },
    [onChange, submited]
  );

  const handleSubmit = useCallback(
    ({ keyCode, shiftKey }) => {
      if (keyCode == ENTER_KEY_CODE && !shiftKey) {
        // handl submit !shift + enter
        onSubmit && onSubmit(value);
        setValue("");
        setSubmited(true);
      }
    },
    [value, onSubmit]
  );

  useEffect(() => setValue(defaultValue), [defaultValue]);

  return (
    <Flex position="relative" height="fit-content" {...rest}>
      <BaseInput
        autoFocus
        spellCheck="false"
        value={value}
        onKeyDown={handleSubmit}
        onChange={handleChange}
      />
      <TextHolder>
        {value}
        <Caret />
      </TextHolder>
    </Flex>
  );
}
