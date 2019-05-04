/// <reference types="react" />
import { ComponentType, SVGAttributes } from 'react';
interface Props extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}
type Icon = ComponentType<Props>;
export const Airplay: Icon;
export const Rectangle: Icon;
