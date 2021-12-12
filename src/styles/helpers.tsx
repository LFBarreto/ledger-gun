import React from "react";
import Color from "color";
import uniqueId from "lodash/uniqueId";

export const rgba = (c: string, a: number): string =>
  Color(c).alpha(a).rgb().toString();

export const darken = (c: string, a: number): string =>
  Color(c).darken(a).toString();

export const lighten = (c: string, a: number): string =>
  Color(c).lighten(a).toString();

export const mix = (c: string, b: string, a: number): string =>
  Color(c).mix(Color(b), a).toString();

export const multiline = (str: string): React.ReactNode[] =>
  str.split("\n").map((line) => <p key={uniqueId()}> {line} </p>);

export const centerEllipsis = (str: string, maxLength = 25): string =>
  str?.length > maxLength
    ? `${str.substr(0, Math.floor(maxLength / 2))}...${str.substr(
        Math.floor(-maxLength / 2)
      )}`
    : str;
