import styled from "styled-components";
import {
  getRest,
  getStyleResets,
  getWrapperStyles,
  styleGenerator,
  variablesGenerator,
} from "../../../utils/StyleGenerators";
import { PageWise, Style, Variable } from "./types/types.d";

export const styledElements = {
  styledEditor: styled.div<{ $styles: PageWise; $variables: Variable[] }>`
    ${({ $styles, $variables }) => {
      const {
        overflow,
        "background-color": backgroundColor,
        ...rest
      } = $styles;
      const variablesString = variablesGenerator($variables);
      const styleResets = getStyleResets($styles);
      const style = styleGenerator(rest);

      return variablesString + styleResets + style;
    }};
  `,
  styledComponentWrapperDiv: styled.div<{ $styles: Style; $type: string }>`
    ${({ $styles, $type }) => getWrapperStyles($styles, $type)};
  `,
  styledWrapperDivWithVariables: styled.div<{
    $variables: Variable[];
    $pageWise: PageWise;
  }>`
    ${({ $variables, $pageWise }) => {
      const styleResets = getStyleResets($pageWise);
      const variablesStyles = variablesGenerator($variables);
      return variablesStyles + styleResets;
    }};
  `,
  styledDiv: styled.div<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)};
  `,
  styledFixed: styled.div<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)};
  `,
  styledAudio: styled.audio<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)}
  `,
  styledButton: styled.a<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)}
  `,
  styledHr: styled.hr<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)}
  `,
  styledI: styled.i<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)}
  `,
  styledImg: styled.img<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)}
  `,
  styledVideo: styled.video<{ $styles: Style }>`
    ${({ $styles }) => getRest($styles)}
  `,
};
