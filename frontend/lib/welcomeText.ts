import type { Lang } from "./i18n";

export interface WelcomeText {
title: string;
body: string;
hint: string;
button: string;
}

export const WELCOME_TEXT: Record<Lang, WelcomeText> = {
en: {
  title: "Welcome to ArchiveX",
  body: "This site contains hidden easter eggs that appear as codes.",
  hint: "To use a code, message @dnskrxevelyn_bot on Telegram.",
  button: "I understand",
},
ru: {
  title: "Добро пожаловать в ArchiveX",
  body: "На этом сайте есть скрытые пасхалки, которые выглядят как коды.",
  hint: "Чтобы использовать код, напиши боту @dnskrxevelyn_bot в Telegram.",
  button: "Понятно",
},
uk: {
  title: "Ласкаво просимо до ArchiveX",
  body: "На цьому сайті є приховані пасхалки, що виглядають як коди.",
  hint: "Щоб скористатися кодом, напиши боту @dnskrxevelyn_bot у Telegram.",
  button: "Зрозуміло",
},
es: {
  title: "Bienvenido a ArchiveX",
  body: "Este sitio contiene huevos de pascua ocultos que aparecen como códigos.",
  hint: "Para usar un código, escríbele a @dnskrxevelyn_bot en Telegram.",
  button: "Entendido",
},
zh: {
  title: "欢迎来到 ArchiveX",
  body: "本网站包含以代码形式出现的隐藏彩蛋。",
  hint: "如需使用代码，请在 Telegram 上联系 @dnskrxevelyn_bot。",
  button: "我明白了",
},
tr: {
  title: "ArchiveX'e hoş geldiniz",
  body: "Bu sitede kod şeklinde görünen gizli paskalya yumurtaları bulunur.",
  hint: "Bir kodu kullanmak için Telegram'da @dnskrxevelyn_bot'a yaz.",
  button: "Anladım",
},
pt: {
  title: "Bem-vindo ao ArchiveX",
  body: "Este site contém ovos de páscoa ocultos que aparecem como códigos.",
  hint: "Para usar um código, envie uma mensagem para @dnskrxevelyn_bot no Telegram.",
  button: "Entendi",
},
};
