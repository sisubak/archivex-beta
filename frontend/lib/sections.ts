export type Direction = "up" | "down" | "left" | "right" | "center";

export interface NavLink {
  targetId: string;
  slot: Slot;
  rotation: number;
  labelKey: string;
  disabled?: boolean;
}

export type Slot =
  | "top" | "bottom" | "left" | "right"
  | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface Section {
  id: string;
  title: string;
  x: number;
  y: number;
  nav: NavLink[];
  cardKind?:
    | "default"
    | "menu"
    | "status"
    | "about"
    | "rules"
    | "team"
    | "faq"
    | "faq-sub"
    | "clients"
    | "bio"
    | "naked";
  bioCoderId?: "mister" | "luna" | "vafla";
}

export const SECTIONS: Section[] = [
  {
    id: "menu",
    title: "Main Menu",
    x: 0,
    y: 0,
    cardKind: "menu",
    nav: [
      { targetId: "clients", slot: "top",    rotation: 0,   labelKey: "sectionClients" },
      { targetId: "status",  slot: "right",  rotation: 90,  labelKey: "sectionStatus" },
      { targetId: "faq",     slot: "bottom", rotation: 180, labelKey: "sectionFaq" },
      { targetId: "about",   slot: "left",   rotation: 270, labelKey: "sectionAbout" },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    x: 0,
    y: -100,
    cardKind: "clients",
    nav: [
      { targetId: "about",  slot: "bottomLeft",  rotation: 225, labelKey: "sectionAbout" },
      { targetId: "menu",   slot: "bottom",      rotation: 180, labelKey: "sectionCenter" },
      { targetId: "status", slot: "bottomRight", rotation: 135, labelKey: "sectionStatus" },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    x: 0,
    y: 100,
    cardKind: "faq",
    nav: [
      { targetId: "about",      slot: "topLeft",     rotation: 315, labelKey: "sectionAbout" },
      { targetId: "menu",       slot: "top",         rotation: 0,   labelKey: "sectionCenter" },
      { targetId: "status",     slot: "topRight",    rotation: 45,  labelKey: "sectionStatus" },
      { targetId: "faq-kog",    slot: "left",        rotation: 270, labelKey: "faqKog",    disabled: true },
      { targetId: "faq-novice", slot: "right",       rotation: 90,  labelKey: "faqNovice", disabled: true },
      { targetId: "faq-block",  slot: "bottomLeft",  rotation: 225, labelKey: "faqBlock",  disabled: true },
      { targetId: "faq-fng",    slot: "bottom",      rotation: 180, labelKey: "faqFng",    disabled: true },
      { targetId: "faq-krx",    slot: "bottomRight", rotation: 135, labelKey: "faqKrx",    disabled: true },
    ],
  },
  {
    id: "faq-kog",
    title: "KoG",
    x: -100,
    y: 100,
    cardKind: "faq-sub",
    nav: [
      { targetId: "faq", slot: "right", rotation: 90, labelKey: "sectionFaq" },
    ],
  },
  {
    id: "faq-novice",
    title: "Novice",
    x: 100,
    y: 100,
    cardKind: "faq-sub",
    nav: [
      { targetId: "faq", slot: "left", rotation: 270, labelKey: "sectionFaq" },
    ],
  },
  {
    id: "faq-block",
    title: "Block",
    x: -100,
    y: 200,
    cardKind: "faq-sub",
    nav: [
      { targetId: "faq", slot: "topRight", rotation: 45, labelKey: "sectionFaq" },
    ],
  },
  {
    id: "faq-fng",
    title: "FNG",
    x: 0,
    y: 200,
    cardKind: "faq-sub",
    nav: [
      { targetId: "faq", slot: "top", rotation: 0, labelKey: "sectionFaq" },
    ],
  },
  {
    id: "faq-krx",
    title: "Tutorial KRX Crack",
    x: 100,
    y: 200,
    cardKind: "faq-sub",
    nav: [
      { targetId: "faq", slot: "topLeft", rotation: 315, labelKey: "sectionFaq" },
    ],
  },
  {
    id: "about",
    title: "About",
    x: -100,
    y: 0,
    cardKind: "about",
    nav: [
      { targetId: "about-rules", slot: "topLeft",     rotation: 315, labelKey: "subRules" },
      { targetId: "menu",        slot: "right",       rotation: 90,  labelKey: "sectionCenter" },
      { targetId: "team",  slot: "bottomLeft",  rotation: 225, labelKey: "subTeam" },
    ],
  },
  {
    id: "about-rules",
    title: "Rules",
    x: -200,
    y: -100,
    cardKind: "rules",
    nav: [
      { targetId: "about", slot: "bottomRight", rotation: 135, labelKey: "sectionAbout" },
    ],
  },
  {
    id: "team",
    title: "Team",
    x: -300,
    y: 200,
    cardKind: "team",
    nav: [
      { targetId: "about", slot: "top", rotation: 0, labelKey: "sectionAbout" },
      { targetId: "team-mister", slot: "bottomLeft", rotation: 225, labelKey: "bioMister" },
      { targetId: "team-luna", slot: "bottom", rotation: 180, labelKey: "bioLuna" },
      { targetId: "team-vafla", slot: "bottomRight", rotation: 135, labelKey: "bioVafla" },
    ],
  },
  {
    id: "team-mister",
    title: "mister/𝝚h",
    x: -400,
    y: 300,
    cardKind: "bio",
    bioCoderId: "mister",
    nav: [
      { targetId: "team", slot: "topRight", rotation: 45, labelKey: "subTeam" },
      { targetId: "team-luna", slot: "right", rotation: 90, labelKey: "bioLuna" },
    ],
  },
  {
    id: "team-luna",
    title: "LoserLuna",
    x: -300,
    y: 300,
    cardKind: "bio",
    bioCoderId: "luna",
    nav: [
      { targetId: "team", slot: "top", rotation: 0, labelKey: "subTeam" },
      { targetId: "team-mister", slot: "left", rotation: 270, labelKey: "bioMister" },
      { targetId: "team-vafla", slot: "right", rotation: 90, labelKey: "bioVafla" },
    ],
  },
  {
    id: "team-vafla",
    title: "乙乇尺ㄒ丨вафля",
    x: -200,
    y: 300,
    cardKind: "bio",
    bioCoderId: "vafla",
    nav: [
      { targetId: "team", slot: "topLeft", rotation: 315, labelKey: "subTeam" },
      { targetId: "team-luna", slot: "left", rotation: 270, labelKey: "bioLuna" },
    ],
  },

  {
    id: "status",
    title: "Status",
    x: 100,
    y: 0,
    cardKind: "status",
    nav: [
      { targetId: "clients", slot: "topLeft",    rotation: 315, labelKey: "sectionClients" },
      { targetId: "menu",    slot: "left",       rotation: 270, labelKey: "sectionCenter" },
      { targetId: "faq",     slot: "bottomLeft", rotation: 225, labelKey: "sectionFaq" },
    ],
  },

];

export function getSection(id: string): Section {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Section ${id} not found`);
  return s;
}