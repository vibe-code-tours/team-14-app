export type Language = "en" | "my";

type TranslationEntry = { en: string; my: string };

// Flat translation keys using dot notation
export const translations: Record<string, TranslationEntry> = {
  // Navigation
  "nav.home": { en: "Home", my: "ပင်မ" },
  "nav.factories": { en: "Factories", my: "စက်ရုံများ" },
  "nav.suggest": { en: "Suggest", my: "အကြံပြု" },
  "nav.contact": { en: "Contact", my: "ဆက်သွယ်ရန်" },

  // Privacy Banner
  "privacy.title": {
    en: "Your identity is completely safe",
    my: "၁၀၀% လူမည်မဖော်ပြဘဲ လျှို့ဝှက်ပေးထားပါသည်",
  },
  "privacy.subtitle": {
    en: "Your name and identity are completely safe. Reviews are anonymous.",
    my: "သင့်အမည်နှင့် သင်၏ လုံခြုံရေးကို အပြည့်အဝ ကာကွယ်ထားပါသည်။ ပြန်လည်သုံးသပ်ချက်များကို လူမည်မဖော်ပြဘဲ ရေးသားထားပါသည်။",
  },

  // Hero Section
  "hero.title": {
    en: "Find a safe workplace",
    my: "ဘေးကင်းပြီး ယုံကြည်စိတ်ချရသော အလုပ်ခွင်ကို ရှာဖွေပါ",
  },
  "hero.subtitle": {
    en: "Real reviews from migrant workers in Thailand 🇹🇭",
    my: "ထိုင်းနိုင်ငံရှိ ရွှေ့ပြောင်းလုပ်သားများ၏ အမှန်တကယ်ပြန်လည်သုံးသပ်ချက်များ 🇹🇭",
  },
  "hero.placeholder": {
    en: "Search factory name...",
    my: "စက်ရုံအမည်ကို ရှာဖွေပါ...",
  },
  "hero.searchButton": { en: "Search", my: "ရှာဖွေရန်" },

  // Stats Bar
  "stats.users": { en: "Active Users", my: "သုံးစွဲသူများ" },
  "stats.partners": { en: "Partners", my: "ပူးပေါင်းဆောင်ရွက်သူများ" },
  "stats.satisfaction": { en: "Satisfaction Rate", my: "ကျေနပ်မှုနှုန်း" },
  "stats.reviews": { en: "Reviews", my: "ပြန်လည်သုံးသပ်ချက်များ" },

  // Factory Filters
  "filters.region": { en: "Region:", my: "ဒေသ:" },
  "filters.workers": { en: "Workers:", my: "လုပ်သားများ:" },
  "filters.allRegions": { en: "All Regions", my: "ဒေသအားလုံး" },
  "filters.anySize": { en: "Any Size", my: "အရွယ်အစားအားလုံး" },
  "filters.small": { en: "1 - 100 workers", my: "လုပ်သား ၁ - ၁၀၀" },
  "filters.medium": { en: "101 - 500 workers", my: "လုပ်သား ၁၀၁ - ၅၀၀" },
  "filters.large": { en: "500+ workers", my: "လုပ်သား ၅၀၀+" },
  "filters.clear": { en: "Clear filters", my: "စစ်ထုတ်မှုများ ဖျက်ရန်" },

  // Factories Section
  "factories.title": { en: "Factories", my: "စက်ရုံများ" },
  "factories.viewAll": { en: "View all →", my: "အားလုံးကြည့်ရန် →" },
  "factories.noResults": { en: "No factories found.", my: "စက်ရုံ ရှာမတွေ့ပါ။" },
  "factories.clearFilters": {
    en: "Clear filters and try again",
    my: "စစ်ထုတ်မှုများ ဖျက်ပြီး ထပ်ကြိုးစားပါ",
  },

  // About Us
  "about.title": { en: "About WorkerVoice", my: "WorkerVoice အကြောင်း" },
  "about.p1": {
    en: "WorkerVoice is a platform that helps Myanmar migrant workers make informed decisions about workplaces. We believe every worker deserves to know the truth about their workplace before joining.",
    my: "WorkerVoice သည် မြန်မာနိုင်ငံမှ ရွှေ့ပြောင်းလုပ်သားများအတွက် အလုပ်ခွင်ဆိုင်ရာ သတင်းအချက်အလက်များကို ပွင့်လင်းစွာ မျှဝေပေးနေသည့် ပလက်ဖောင်းတစ်ခုဖြစ်ပါသည်။",
  },
  "about.p2": {
    en: "Our mission is to ensure every migrant worker can find safe and trustworthy employment. We provide anonymous reviews about salary, overtime, and housing conditions.",
    my: "ကျွန်တော်တို့၏ ရည်မှန်းချက်မှာ ရွှေ့ပြောင်းလုပ်သားများအားလုံး ဘေးကင်းပြီး ယုံကြည်စိတ်ချရသော အလုပ်များကို ရှာဖွေနိုင်စေရန်ဖြစ်ပါသည်။ လုပ်ခလစာ၊ အချိန်ပို၊ နေထိုင်ရေးအခြေအနေများကို လူမည်မဖော်ပြဘဲ ပြန်လည်သုံးသပ်ချက်များဖြင့် ကြိုတင်သိရှိနိုင်ပါသည်။",
  },
  "about.belief": {
    en: '"Listen to every worker\'s voice, protect every worker\'s safety."',
    my: '"လုပ်သားတိုင်း၏ အသံကို နားထောင်ပါ၊ လုပ်သားတိုင်း၏ ဘေးကင်းရေးကို ကာကွယ်ပါ။"',
  },

  // Contact Links
  "contact.title": { en: "Contact Us", my: "ဆက်သွယ်ရန်" },
  "contact.subtitle": {
    en: "Follow us on social media for updates and support.",
    my: "သတင်းအချက်အလက်များနှင့် အကူအညီအတွက် လူမှုကွန်ယက်များတွင် ကြည့်ရှုနိုင်ပါသည်။",
  },
  "contact.telegram": { en: "Telegram", my: "Telegram" },
  "contact.facebook": { en: "Facebook", my: "Facebook" },
  "contact.youtube": { en: "YouTube", my: "YouTube" },
  "contact.line": { en: "LINE", my: "LINE" },
  "contact.viewFull": {
    en: "Full contact page →",
    my: "ဆက်သွယ်ရေးစာမျက်နှာ အပြည့်အစုံ →",
  },
  "contact.socialMedia": {
    en: "Social Media",
    my: "လူမှုကွန်ယက်များ",
  },
  "contact.privacy": {
    en: "We will never ask you to contact us directly. Only reach us through our social media pages.",
    my: "WorkerVoice မှ သင့်အား ဆက်သွယ်ရန် ဘယ်သောအခါမှ မတောင်းဆိုပါ။ ကျွန်တော်တို့၏ လူမှုကွန်ယက်စာမျက်နှာများမှသာ ဆက်သွယ်ပါ။",
  },
  "contact.backHome": {
    en: "← Back to home",
    my: "← ပင်မစာမျက်နှာသို့ ပြန်သွားရန်",
  },

  // Footer
  "footer.brand": {
    en: "WorkerVoice — Migrant Worker Review Network",
    my: "WorkerVoice — ရွှေ့ပြောင်းလုပ်သား ပြန်လည်သုံးသပ်ချက် ကွန်ယက်",
  },
  "footer.tagline": {
    en: "Thailand 🇹🇭 • Helping workers find safe workplaces",
    my: "ထိုင်းနိုင်ငံ 🇹🇭 • လုပ်သားများအား ဘေးကင်းရောက်ရှိရေး ကူညီပေးနေသည်",
  },
  "footer.copyright": {
    en: "© 2026 WorkerVoice. All rights reserved.",
    my: "© 2026 WorkerVoice. မူပိုင်ခွင့် အားလုံး ထိန်းသိမ်းထားပါသည်။",
  },
};

export type TranslationKey = keyof typeof translations;
