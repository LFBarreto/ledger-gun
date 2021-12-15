import React, { useCallback, useEffect } from "react";
import styled from "@ledgerhq/react-ui/components/styled";

type CommandTooltipProps = {
  message: string;
  selectedCommand: string | null;
  setSelectedCommand: (command: string) => void;
  enterCommand: (command: string) => void;
};

const Container = styled.div`
  border: 5px solid ${({ theme }) => theme.colors.primary.c100};
  display: inline-flex;
  flex-direction: column;
  align-items: start;
  position: absolute;
  right: 0px;
  bottom: 19px;
  width: 375px;
  overflow: hidden;
`;

const CommandItem = styled.div<{ selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: start;
  background-color: ${(p) => (p.selected ? p.theme.colors.primary.c100 : p.theme.colors.neutral.c00)};
  color: ${(p) => (p.selected ? p.theme.colors.neutral.c00 : "unset")};
  padding: 5px;
`;

const CommandTitle = styled.span`
  font-weight: bold;
`;

const CommandDescription = styled.span``;

const hardcodedCommands = [
  { command: "/send", description: "Send crypto to the recipient" },
  { command: "/request", description: "Request crypto from the recipient" },
  { command: "/giphy", description: "Send gif to the recipient" },
];

const CommandTooltip = ({ message, selectedCommand, setSelectedCommand, enterCommand }: CommandTooltipProps) => {
  const filteredCommands = hardcodedCommands.filter(({ command }) => command.startsWith(message));

  useEffect(() => {
    if (filteredCommands.length) {
      setSelectedCommand(filteredCommands[0].command);
    }
  }, [message]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        enterCommand(selectedCommand + " ");
        return;
      }

      if (filteredCommands.length < 2 || selectedCommand === null) return;

      const currentCommandIndex = filteredCommands.findIndex(({ command }) => selectedCommand === command);
      if (e.key === "ArrowDown" && currentCommandIndex < filteredCommands.length - 1) {
        setSelectedCommand(filteredCommands[currentCommandIndex + 1].command);
        return;
      }
      if (e.key === "ArrowUp" && currentCommandIndex > 0) {
        setSelectedCommand(filteredCommands[currentCommandIndex - 1].command);
        return;
      }
    },
    [filteredCommands, selectedCommand]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Container>
      {filteredCommands.map(({ command, description }) => (
        <CommandItem selected={selectedCommand === command} key={command}>
          <CommandTitle>{command}</CommandTitle>
          {" - "}
          <CommandDescription>{description}</CommandDescription>
        </CommandItem>
      ))}
    </Container>
  );
};

export default CommandTooltip;
