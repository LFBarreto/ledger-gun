import React, { ReactNode, useState, useEffect } from "react";
import SplitPane from "react-split-pane";
import styled from "styled-components";
import useLocalStorage from "../hooks/useLocalStorage";

import { Room } from "../types";
import SideBar from "./SideBar";
import Button from "./Button";

const Container = styled.main`
  height: 100%;
  width: 100%;
  min-width: 360px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.space[3]}px;
  background: ${(props) => props.theme.colors.background.main};
  height: 100%;
  overflow: auto;
`;

const SideBarAffixButton = styled(Button)`
  z-index: 100;
  position: absolute;
  top: calc(${(props) => props.theme.space[3] + props.theme.space[7]}px + 2px);
  left: calc(${(props) => props.theme.space[3] + props.theme.space[7]}px + 2px);
`;

const SplitPaneLayout = styled(SplitPane)`
  position: relative !important;

  .Pane1 {
    margin-right: ${(props) => props.theme.space[3]}px;
  }

  .Resizer {
    background: ${(props) => props.theme.colors.background.main};
    opacity: 0.2;
    z-index: 1;
    box-sizing: border-box;
    background-clip: padding-box;
  }

  .Resizer:hover {
    transition: all 2s ease;
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;

export type LayoutProps = {
  children?: ReactNode;
  user: any;
  rooms: Room[];
};

const Layout = ({ children, user, rooms }: LayoutProps): JSX.Element => {
  const [isSidebarOpen, setSidebarOpen] = useLocalStorage(
    "layout-sidebar-open",
    true
  );
  const [sidebarWidth, setSidebarWidth] = useLocalStorage(
    "layout-sidebar-width",
    280
  );
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  const handleWindowSizeChange = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  if (!isSidebarOpen) {
    return (
      <Container>
        <SideBarAffixButton onClick={() => setSidebarOpen(true)}>
          {">>"}
        </SideBarAffixButton>
        <Content>{children}</Content>
      </Container>
    );
  }

  if (isMobile) {
    return (
      <Container>
        <SideBar
          user={user}
          rooms={rooms}
          onClose={() => setSidebarOpen(false)}
          onSelect={() => null}
          onCreate={() => null}
        />
      </Container>
    );
  }

  return (
    <Container>
      <SplitPaneLayout
        split="vertical"
        minSize={240}
        maxSize={640}
        defaultSize={sidebarWidth}
        onChange={setSidebarWidth}
      >
        <SideBar
          user={user}
          rooms={rooms}
          onClose={() => setSidebarOpen(false)}
          onSelect={() => null}
          onCreate={() => null}
        />
        <Content>{children}</Content>
      </SplitPaneLayout>
    </Container>
  );
};

export default Layout;
