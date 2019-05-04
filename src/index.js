const fs = require('fs');
const glob = require('glob');
const camelcase = require('camelcase');
const uppercamelcase = require('uppercamelcase');
const path = require('path');
const cheerio = require('cheerio');
const prettier = require('prettier');

const initialTypeDefinitions = `/// <reference types="react" />
import { ComponentType, SVGAttributes } from 'react';
interface Props extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}
type Icon = ComponentType<Props>;
`;

const parseSvg = svg => {
  svg = svg.replace(/<!--.*-->/, '');

  const $ = cheerio.load(svg, { xmlMode: true });

  $('*').each((index, el) => {
    Object.keys(el.attribs).forEach(name => {
      if (name.includes('-')) {
        $(el)
          .attr(camelcase(name), el.attribs[name])
          .removeAttr(name);
      }

      if (name === 'stroke') {
        $(el).attr(name, 'currentColor');
      }
    });

    if (el.name === 'svg') {
      $(el).attr('otherProps', '...');
    }
  });

  return $;
};

const getComponent = ($, componentName) => {
  const component = `
    import React from 'react';
    import PropTypes from 'prop-types';
    const ${componentName} = (props) => {
      const { color, size, ...otherProps } = props;
      return (
        ${$('svg')
          .toString()
          .replace(new RegExp('stroke="currentColor"', 'g'), 'stroke={color}')
          .replace('width="24"', 'width={size}')
          .replace('height="24"', 'height={size}')
          .replace('otherProps="..."', '{...otherProps}')}
      )
    };
    ${componentName}.propTypes = {
      color: PropTypes.string,
      size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
    }
    ${componentName}.defaultProps = {
      color: 'currentColor',
      size: '24',
    }
    export default ${componentName}
  `;

  return prettier.format(component, {
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    parser: 'flow',
  });
};

const svgicon2component = async ({ src, outDir }) => {
  const icons = glob.sync(src);

  fs.writeFileSync(path.join(outDir, 'index.js'), '', 'utf-8');
  fs.writeFileSync(
    path.join(outDir, 'index.d.ts'),
    initialTypeDefinitions,
    'utf-8'
  );

  icons.forEach(icon => {
    const id = path.basename(icon, '.svg');
    const componentName = id === 'github' ? 'GitHub' : uppercamelcase(id);
    const fileName = path.basename(icon).replace('.svg', '.js');
    const svg = fs.readFileSync(icon, 'utf-8');

    const $ = parseSvg(svg);
    const component = getComponent($, componentName);
    const exportStr = `export ${componentName} from './icons/${id}';\r\n`;
    const exportTypeStr = `export const ${componentName}: Icon;\n`;

    fs.writeFileSync(path.join(outDir, fileName), component, 'utf-8');
    fs.appendFileSync(path.join(outDir, 'index.js'), exportStr, 'utf-8');
    fs.appendFileSync(path.join(outDir, 'index.d.ts'), exportTypeStr, 'utf-8');
  });
};

module.exports = svgicon2component;
