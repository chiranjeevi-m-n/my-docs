// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "My Docs",
  tagline: "Documentation powered by Docusaurus",
  favicon: "img/favicon.ico",

<<<<<<< HEAD
  // Set the production url of your site here
  url: 'https://Deloitte_gloal_cloud_services.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/my-docs/',
=======
  // Set correct production URL
  url: "https://Cirruslabs.github.io",
  // Set base URL to match the repository name
  baseUrl: "/my-docs/",
>>>>>>> 569c427 (commit)

  // GitHub Pages deployment config
  organizationName: "Cirruslabs", // Your GitHub username
  projectName: "my-docs", // Your repo name

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: "./sidebars.js",
          editUrl:
            "https://github.com/chiranjeevi-m-n/my-docs/edit/main/", // Update edit URL
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/chiranjeevi-m-n/my-docs/edit/main/blog/", // Update edit URL
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "My Docs",
        logo: {
          alt: "My Docs Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/chiranjeevi-m-n/my-docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} My Docs. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    },
};

export default config;
