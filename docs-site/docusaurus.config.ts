import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Pokemon Card App',
  tagline: 'Documentation for Pokemon Card Application',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Update with your actual GitHub info
  url: 'https://hassanq2003.github.io',
  baseUrl: '/PokemonCardApplication/',

  // GitHub pages deployment config
  organizationName: 'hassanq2003', // Replace with your GitHub username
  projectName: 'PokemonCardApplication', // Replace with your repo name

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
  [
    'classic',
    {
      docs: {
        path: '../docs',
        routeBasePath: '/',
        sidebarPath: './sidebars.ts', // ✅ use relative path directly
        editUrl: 'https://github.com/hassanq2003/PokemonCardApplication/tree/main/',
      },
      blog: false,
      theme: {
        customCss: './src/css/custom.css', // ✅ also fix this one
      },
    } satisfies Preset.Options,
  ],
],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Pokemon Card App',
      logo: {
        alt: 'Pokemon Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/hassan/PokemonCardApplication',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/hassanq2003/PokemonCardApplication',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pokemon Card App. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;