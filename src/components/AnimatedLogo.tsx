import React, { useCallback, useEffect, useState } from "react";
import styled from "@ledgerhq/react-ui/components/styled";
import { Flex } from "@ledgerhq/react-ui";

const Root = styled(Flex).attrs({
  flex: "1",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "flex-end",
})`
  > * {
    text-align: right;
  }
`;

const ledgerLogo =
  `                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
...............................................                                ...............................................  
'OXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXO,                              ,OXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXO' 
,KMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMX;                              ;XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK, 
,KMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMX;                              ;XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK, 
,KMMMMMMKkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkko.                              .okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkKMMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,0WWWWWNc                                                                                                              cNWWWWW0' 
.,,,,,'.                                                                                                              .',,,,,'  
                                                                                                                                
                                                                                                                                
                                                                                                                                
                                               ;oooooo;                                                                         
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMk.                                                                        
                                              .xMMMMMMNOxxxxxxxxxxxxxxxxxxxxxx:                                                 
                                              .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMx.                                                
                                              .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMx.                                                
                                              .dXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXd.                                                
                                               ................................                                                 
                                                                                                                                
                                                                                                                                
                                                                                                                                
.oxxxxxd,                                                                                                              ,dxxxxxl. 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWl                                                                                                              lWMMMMMK, 
,KMMMMMWk;,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'.                              .',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,;kWMMMMMK, 
,KMMMMMMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK;                              ;KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMMMMMK, 
,KMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMX;                              ;XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK, 
,KMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMX;                              ;XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK, 
.coooooooooooooooooooooooooooooooooooooooooooooc.                              .coooooooooooooooooooooooooooooooooooooooooooooc. 
                                                                                                                                
                                                                                                                                
                                                                                                                                
                                                                                                                                
                                                                                                                                
                                                                                                                                `.split(
    /\n/
  );

const Container = styled.div.attrs({ color: "primary.c100" })`
  font-size: 5px;
  font-family: monospace;
  line-height: 5px;
  width: 100%;
  text-align: right;
  height: auto;
  white-space: pre;
`;

export default function AnimatedLogo({ choices = [] }: any) {
  const [text, setText] = useState("");
  const [c, setC] = useState([]);
  const array = [ledgerLogo];
  const count = ledgerLogo.length;

  const loopTimer = 50;

  let offset = 1;
  let index = 0;
  let frame = 0;
  const totalFrames = count * loopTimer;

  const startLoopChoices = useCallback(() => {
    index = 0;
    frame = 0;
    const int = setInterval(() => {
      if (!choices[index]) {
        clearInterval(int);
      } else {
        setC((cc) => cc.concat(choices[index]));
        index++;
      }
    }, 200);
  }, []);

  const start = useCallback(() => {
    const int = setInterval(() => {
      if (!array[index]) {
        startLoopChoices();
        clearInterval(int);
      } else {
        if (frame >= totalFrames) {
          index++;
          frame = 0;
          offset = 0;
        } else {
          let text = "";
          if (index === 0) {
            text = array[index].slice(0, offset).join("\n");
          } else {
            text = array[index]
              .slice(0, offset)
              .concat(array[index - 1].slice(offset, array[index].length))
              .join("\n");
            setText(text);
          }
          setText(text);
          offset++;
          frame += loopTimer;
        }
      }
    }, loopTimer);
  }, []);

  useEffect(() => start(), []);

  return (
    <Root>
      <Container>{text}</Container>
      {c.map((Comp: any, i) => (
        <Comp key={i} />
      ))}
    </Root>
  );
}
