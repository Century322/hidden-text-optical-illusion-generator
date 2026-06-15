export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface GeneratorParams {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontSpacing: number;

  whiteBorder: number;

  colorForeground: string;
  colorBackground: string;
}
