// Centralized configuration for the AMP website.
export const CONFIG = {
  theme: {
    default: 'dark',
    storageKey: 'amp-theme'
  },
  updates: {
    recentThresholdDays: 30
  },
  search: {
    debounceMs: 150
  },
  layouts: {
    storageKey: 'amp-values-layout'
  },
  endpoints: {
    valuesManifest: './data/values/manifest.json',
    valuesPath: './data/values/',
    vhsManifest: './data/vhs/manifest.json',
    vhsPath: './data/vhs/'
  },
  placeholders: {
    image: 'https://placehold.co/600x400/1e1e1e/808080?text=Image+Not+Found'
  }
};

// Discord Servers Configuration
export const DISCORD_SERVERS = [
  {
    name: "Anomic Official",
    description: "The main official Anomic community server.",
    icon: "https://cdn.discordapp.com/icons/554290029397147663/d5ceff0c25f038baee4f3e9032c51de3.webp?size=1024",
    invite: "https://discord.gg/acwuYj5qGr",
    members: "4,000+",
    verified: true
  },
  {
    name: "Anomic Marketplace",
    description: "Trade items, discuss values, and make deals.",
    icon: "https://cdn.discordapp.com/icons/1127572045908164668/dad3071849960ef50713425b330f96c6.webp?size=64",
    invite: "https://discord.gg/vc4jUwFmv2",
    members: "15,000+",
    verified: true
  },
  {
    name: "Anomic Wiki",
    description: "Community driven wiki and guides.",
    icon: "https://cdn.discordapp.com/icons/1195240884921446400/3ef5959bc697ad301adc9909c40e483b.webp?size=64",
    invite: "https://discord.gg/JQ7U5n3Fsw",
    members: "1,500+",
    verified: true
  },
  {
    name: "Anomic Competitive",
    description: "Competitive gameplay and tournaments.",
    icon: "https://cdn.discordapp.com/icons/1359693100351619092/e96746891f8d772e24243d7458f7c072.webp?size=64",
    invite: "https://discord.gg/EbA4KyWwq8",
    members: "700+",
    verified: false
  },
  {
    name: "Anomic Building",
    description: "Competitive building and tournaments.",
    icon: "https://cdn.discordapp.com/icons/1256755437714538627/d15e0ba7704e7f725726efdeef1bbcc8.webp?size=64",
    invite: "https://discord.gg/DaEZzuqcA5",
    members: "2,000+",
    verified: true
  },
  {
    name: "Anomic Revamp",
    description: "The main official Anomic Revamp community server.",
    icon: "https://cdn.discordapp.com/icons/1492442682201473135/ca0d4d4ecb2b7a608c90ac10db862ebd.webp?size=64",
    invite: "https://discord.gg/qbHwCGTNwd",
    members: "800+",
    verified: false
  }
];