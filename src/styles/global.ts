import { createGlobalStyle } from "styled-components";
import { rgba } from "./helpers";

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  body {
    font-family: Inter;
    font-size: 100%;
    width: 100%;
    height: 100%;
    background-color: ${(p) => p.theme.colors.background.main};
    cursor: url('/cursor.ico') 8 8, auto;
  }

  [data-reactroot] {
    width: 100%;
    height: 100%;
    display: flex;
    padding: ${(p) => p.theme.space[3]}px;
  }

  @font-face {
    font-family: "Inter";
    src: url("fonts/Inter-ExtraLight-BETA.woff2") format("woff2");
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: "Inter";
    src: url("fonts/Inter-Light-BETA.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: "Inter";
    src: url("fonts/Inter-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Inter";
    src: url("fonts/Inter-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: "Inter";
    src: url("fonts/Inter-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: "Inter";
    src: url("fonts/Inter-ExtraBold.woff2") format("woff2");
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: "Alpha";
    src: url("fonts/HMAlphaMono-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  * {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    user-select: inherit;
    cursor: inherit;
    outline: none;
  }

  ::selection {
    background: ${(p) => rgba(p.theme.colors.primary.c100, 0.1)};
  }

  --track-color: rgba(0,0,0,0);

  .tippy-box[data-animation="fade"][data-state="hidden"] {
    opacity: 0;
  }

  [data-tippy-root] {
    max-width: calc(100vw - 10px);
  }

  .tippy-box {
    position: relative;
    background-color: ${(p) => p.theme.colors.neutral.c100};
    color: ${(p) => p.theme.colors.neutral.c00};
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    outline: 0;
    transition-property: transform, visibility, opacity;
  }

  .tippy-box[data-placement^="top"] > .tippy-arrow {
    bottom: 0;
  }

  .tippy-box[data-placement^="top"] > .tippy-arrow:before {
    bottom: -4px;
    left: 0;
    border-width: 10px 10px 0;
    border-top-color: initial;
    transform-origin: center top;
  }

  .tippy-box[data-placement^="bottom"] > .tippy-arrow {
    top: 0;
  }

  .tippy-box[data-placement^="bottom"] > .tippy-arrow:before {
    top: -4px;
    left: 0;
    border-width: 0 10px 10px;
    border-bottom-color: initial;
    transform-origin: center bottom;
  }

  .tippy-box[data-placement^="left"] > .tippy-arrow {
    right: 0;
  }

  .tippy-box[data-placement^="left"] > .tippy-arrow:before {
    border-width: 10px 0 10px 10px;
    border-left-color: initial;
    right: -4px;
    transform-origin: center left;
  }

  .tippy-box[data-placement^="right"] > .tippy-arrow {
    left: 0;
  }

  .tippy-box[data-placement^="right"] > .tippy-arrow:before {
    left: -4px;
    border-width: 10px 10px 10px 0;
    border-right-color: initial;
    transform-origin: center right;
  }

  .tippy-box[data-inertia][data-state="visible"] {
    transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
  }

  .tippy-arrow {
    width: 16px;
    height: 16px;
    color: ${(p) => p.theme.colors.neutral.c100};
  }

  .tippy-arrow:before {
    content: "";
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }

  .tippy-content {
    position: relative;
    padding: 8px 10px;
    z-index: 1;
  }
`;
