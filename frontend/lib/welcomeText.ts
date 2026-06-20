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
  body: "A curated archive of DDNet and TeeWorlds clients. Every entry is hand-picked and tested.",
  hint: "Some clients include cheats. Use at your own risk. We are not liable for how you use them.",
  button: "Continue",
},
ru: {
  title: "Добро пожаловать в ArchiveX",
  body: "Кураторский архив клиентов DDNet и TeeWorlds. Каждый клиент отобран и проверен вручную.",
  hint: "Некоторые клиенты содержат читы. Используйте на свой страх и риск. Мы не несём ответственности за их использование.",
  button: "Продолжить",
},
uk: {
  title: "Ласкаво просимо до ArchiveX",
  body: "Кураторський архів клієнтів DDNet і TeeWorlds. Кожен клієнт відібраний і перевірений вручну.",
  hint: "Деякі клієнти містять чити. Використовуйте на свій ризик. Ми не несемо відповідальності за їх використання.",
  button: "Продовжити",
},
es: {
  title: "Bienvenido a ArchiveX",
  body: "Un archivo curado de clientes de DDNet y TeeWorlds. Cada entrada seleccionada y probada a mano.",
  hint: "Algunos clientes incluyen cheats. Usa bajo tu propio riesgo. No somos responsables de como los uses.",
  button: "Continuar",
},
zh: {
  title: "欢迎来到 ArchiveX",
  body: "精心策划的 DDNet 和 TeeWorlds 客户端档案库。每个条目都经过手工挑选和测试。",
  hint: "部分客户端包含作弊。使用风险自负。我们对你如何使用它们不承担责任。",
  button: "继续",
},
tr: {
  title: "ArchiveX'e Hoş Geldin",
  body: "DDNet ve TeeWorlds istemcilerinin küratörlü bir arşivi. Her giriş elle seçilmiş ve test edilmiştir.",
  hint: "Bazı istemciler hile içerir. Riski sana ait. İstemcileri nasıl kullandığından sorumlu değiliz.",
  button: "Devam",
},
pt: {
  title: "Bem-vindo ao ArchiveX",
  body: "Um arquivo curado de clientes de DDNet e TeeWorlds. Cada entrada selecionada e testada à mão.",
  hint: "Alguns clientes incluem cheats. Use por sua conta e risco. Não somos responsáveis por como você os usa.",
  button: "Continuar",
},
};