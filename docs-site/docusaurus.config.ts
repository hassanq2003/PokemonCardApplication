import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Pokemon Card App Docs',
  tagline: 'Documentation for Pokemon Card Application',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://yourusername.github.io', // Replace with your GitHub Pages URL
  baseUrl: '/pokemon-card-application/', // Replace with your repo name
  organizationName: 'yourusername', // Your GitHub username
  projectName: 'pokemon-card-application', // Your repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs', // Points to docs folder at same level as docs-site
          routeBasePath: '/', // Serve docs at root
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/yourusername/pokemon-card-application/tree/main/docs',
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'Pokemon Card App',
      logo: { alt: 'Pokemon Card Logo', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Docs' },
        { href: 'https://github.com/yourusername/pokemon-card-application', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Docs', items: [{ label: 'Tutorial', to: '/intro' }] },
        {
          title: 'Community',
          items: [
            { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
            { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
            { label: 'X', href: 'https://x.com/docusaurus' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/yourusername/pokemon-card-application' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pokemon Card App.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
