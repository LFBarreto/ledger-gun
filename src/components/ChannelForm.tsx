import React, { useState } from "react";
import styled from "styled-components";

import Button from "./Button";
import Input from "./Input";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Label = styled.p`
  font-family: monospace;
  line-height: 1.5rem;
  font-size: 1.1rem;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const FieldInput = styled(Input)`
  border: 2px solid ${(props) => props.theme.colors.primary.c100};
`;

const Body = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.space[7]}px;
`;

export type ChannelFormProps = {
  onSubmit: (_: string) => void;
  onClose: () => void;
};

const ChannelForm = ({ onSubmit, onClose }: ChannelFormProps): JSX.Element => {
  const [channelId, setChannelId] = useState<string | undefined>();

  const handleSubmit = () => {
    if (channelId) {
      onSubmit(channelId);
    }
  };

  return (
    <Container>
      <Body>
        <Label>Room ID</Label>
        <FieldInput value={channelId} onChange={setChannelId} />
      </Body>
      <Footer>
        <SubmitButton onClick={handleSubmit}>Create</SubmitButton>
        <Button onClick={onClose}>Cancel</Button>
      </Footer>
    </Container>
  );
};

export default ChannelForm;
