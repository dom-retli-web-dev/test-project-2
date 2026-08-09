import type { ThemeConfig } from './types/theme-config.d.ts';

import enStrings from './src/i18n/en.json' with { type: 'json' };

export const themeConfig: ThemeConfig = {
  site: import.meta.env?.SITE_OVERRIDE || 'https://thedelightedbaker.com',
  primaryColor: '#b4835a',
  themeColor: '#5c3a2a',
  generateWebmanifest: true,
  name: 'The Delighted Baker',
  shortName: 'Delighted Baker',
  darkMode: false,
  robots: import.meta.env?.ROBOTS || 'index, follow',
  xHandle: 'delightedbaker',

  author: {
    type: 'Person',
    name: 'The Delighted Baker',
    url: '',
    image: '',
  },
  publisher: {
    type: 'Organization',
    name: 'The Delighted Baker',
    url: '',
    image: '',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    languages: {
      en: 'English',
    },
    languageModules: {
      en: enStrings,
    },
  },

  // md(x) code block rendering
  expressiveCodeThemes: {
    light: 'min-light',
    dark: 'min-dark',
  },

  // content/article settings
  articles: {
    imageFallback: true,
    gridView: true,
    textOverImage: false,
    categories: true, // if set false, make sure to also remove category directories under /pages
    tags: true, // if set false, make sure to also remove tag directories under /pages
    entriesPerPage: 4,
    tocMaxDepth: 3,
    defaults: {
      author: {
        name: 'Jane Doe',
        url: 'https://en.wikipedia.org/wiki/Jane_Doe_(disambiguation)',
      },
    },
    social: {
      // default values - can be overridden at the Single component level
      xHandle: 'example', // to be added as "via @handle" in the tweet
      buttons: {
        email: true,
        facebook: true,
        hackernews: true,
        linkedin: true,
        pinterest: false,
        reddit: true,
        telegram: false,
        x: true,
        whatsapp: false,
      },
      buttonsSmallScreen: {
        email: true,
        facebook: true,
        hackernews: false,
        linkedin: true,
        pinterest: false,
        reddit: true,
        telegram: true,
        x: true,
        whatsapp: true,
      },
    },
  },

  // promotion settings
  promotions: {
    newsletterSignup: 'footer',
    footerBanner: false,
    navAd: false,
    topBanner: false,
    heroChip: false,
  },

  // for the purpose of this demo, we render intergration options on-demand instead of prerendering them.
  onDemandRenderedCollections: ['integration_options'],

  // you can also dynamically integrate events from your Add to Calendar PRO account (https://add-to-calendar-pro.com/), having your API key set as environment variable ADD_TO_CALENDAR_PRO_API_KEY.
  dynamicEvents: {
    pullFromAddToCalendarPro: false,
    filterBy: {
      from: '',
      to: '',
      group: '',
    },
  },

  // LLM and coding assistant settings
  llms: {
    autoGeneration: true,
    intro: 'The Delighted Baker is a Michigan-based micro bakery specializing in artisan sourdough loaves and seasonal bakes crafted with premium ingredients and patient fermentation.',
    excludePagesPattern: [],
    includePages: [],
    addArticles: 'selected',
    addEvents: 'all',
    addFAQ: 'all',
  },

  askAiTrigger: 'Tell me about The Delighted Baker — the breads, the ingredients, and what is available this week.',
};
