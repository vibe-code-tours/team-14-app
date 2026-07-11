export type Language = "en" | "my";

type TranslationEntry = { en: string; my: string };

// Flat translation keys using dot notation
export const translations: Record<string, TranslationEntry> = {
  // Navigation
  "nav.home": { en: "Home", my: "ပင်မ" },
  "nav.factories": { en: "Factories", my: "စက်ရုံများ" },
  "nav.suggest": { en: "Suggest", my: "အကြံပြု" },
  "nav.writeReview": { en: "Write a Review", my: "သုံးသပ်ချက် ရေးရန်" },
  "nav.contact": { en: "Contact", my: "ဆက်သွယ်ရန်" },
  "nav.login": { en: "Log in", my: "ဝင်ရောက်ရန်" },
  "nav.logout": { en: "Log out", my: "ထွက်ရန်" },
  "nav.profile": { en: "My Profile", my: "ကျွန်ုပ်၏ ပရိုဖိုင်" },

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
    my: "ထိုင်းနိုင်ငံရှိ ရွှေ့ပြောင်းအလုပ်သမားများ၏ အမှန်တကယ်ပြန်လည်သုံးသပ်ချက်များ 🇹🇭",
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
  "filters.workers": { en: "Workers:", my: "အလုပ်သမားများ:" },
  "filters.allRegions": { en: "All Regions", my: "ဒေသအားလုံး" },
  "filters.anySize": { en: "Any Size", my: "အရွယ်အစားအားလုံး" },
  "filters.small": { en: "1 - 100 workers", my: "အလုပ်သမား ၁ - ၁၀၀" },
  "filters.medium": { en: "101 - 500 workers", my: "အလုပ်သမား ၁၀၁ - ၅၀၀" },
  "filters.large": { en: "500+ workers", my: "အလုပ်သမား ၅၀၀+" },
  "filters.clear": { en: "Clear filters", my: "စစ်ထုတ်မှုများ ဖျက်ရန်" },

  // Factories Section
  "factories.title": { en: "Factories", my: "စက်ရုံများ" },
  "factories.viewAll": { en: "View all →", my: "အားလုံးကြည့်ရန် →" },
  "factories.noResults": { en: "No factories found.", my: "စက်ရုံ ရှာမတွေ့ပါ။" },
  "factories.clearFilters": {
    en: "Clear filters and try again",
    my: "စစ်ထုတ်မှုများ ဖျက်ပြီး ထပ်ကြိုးစားပါ",
  },

  // Factory List Page
  "factoryList.title": { en: "🏭 Factories", my: "🏭 စက်ရုံများ" },
  "factoryList.subtitle": {
    en: "Browse verified factories in Thailand",
    my: "ထိုင်းနိုင်ငံရှိ စစ်ဆေးပြီးသား စက်ရုံများကို ကြည့်ရှုပါ",
  },
  "factoryList.searchPlaceholder": {
    en: "Search by factory name...",
    my: "စက်ရုံအမည်ဖြင့် ရှာဖွေပါ...",
  },
  "factoryList.allRegions": { en: "All Regions", my: "ဒေသအားလုံး" },
  "factoryList.search": { en: "Search", my: "ရှာဖွေရန်" },
  "factoryList.loading": { en: "Loading...", my: "ဆွဲနေသည်..." },
  "factoryList.showing": {
    en: "Showing {count} of {total} factories",
    my: "စက်ရုံ {total} ခုအနက် {count} ခု ပြသနေသည်",
  },
  "factoryList.empty": { en: "No factories found", my: "စက်ရုံ ရှာမတွေ့ပါ" },
  "factoryList.suggestFactory": {
    en: "Suggest a factory →",
    my: "စက်ရုံ အကြံပြုရန် →",
  },
  "factoryList.workers": { en: "workers", my: "အလုပ်သမားများ" },
  "factoryList.thailand": { en: "Thailand", my: "ထိုင်း" },
  "factoryList.previous": { en: "Previous", my: "နောက်သို့" },
  "factoryList.next": { en: "Next", my: "ရှေ့သို့" },
  "factoryList.pageOf": {
    en: "Page {page} of {total}",
    my: "စာမျက်နှာ {total} အနက် {page}",
  },

  // Factory Detail Page
  "factoryDetail.notFound": {
    en: "Factory not found",
    my: "စက်ရုံ ရှာမတွေ့ပါ",
  },
  "factoryDetail.backToFactories": {
    en: "← Back to factories",
    my: "← စက်ရုံများသို့ ပြန်သွားရန်",
  },
  "factoryDetail.thailand": { en: "🇹🇭 Thailand", my: "🇹🇭 ထိုင်း" },
  "factoryDetail.basedOn": {
    en: "Based on {count} reviews",
    my: "ပြန်လည်သုံးသပ်ချက် {count} ခုအပေါ် အခြေခံသည်",
  },
  "factoryDetail.multiCriteriaScore": {
    en: "Multi-Criteria Score",
    my: "အဆင့်သတ်မှတ်ချက် အမျိုးမျိုး",
  },
  "factoryDetail.salaryScore": {
    en: "💰 Salary Paid On-Time",
    my: "💰 လုပ်ခလစာ အချိန်မီ ပေးအပ်မှု",
  },
  "factoryDetail.otScore": {
    en: "⏱️ OT Hours & Fairness",
    my: "⏱️ အချိန်ပိုနာရီနှင့် တရားမျှတမှု",
  },
  "factoryDetail.housingScore": {
    en: "🏠 Housing & Dormitory Quality",
    my: "🏠 နေထိုင်ရေးနှင့် အိပ်ဆောင် အရည်အသွေး",
  },
  "factoryDetail.aboutTab": { en: "About", my: "အကြောင်းအရာ" },
  "factoryDetail.reviewsTab": { en: "Reviews", my: "သုံးသပ်ချက်များ" },
  "factoryDetail.aboutSection": { en: "About", my: "အကြောင်းအရာ" },
  "factoryDetail.detailsSection": { en: "Details", my: "အသေးစိတ်" },
  "factoryDetail.location": { en: "Location", my: "တည်နေရာ" },
  "factoryDetail.workers": { en: "Workers", my: "အလုပ်သမားများ" },
  "factoryDetail.operator": { en: "Operator", my: "လုပ်ငန်းရှင်" },
  "factoryDetail.type": { en: "Type", my: "အမျိုးအစား" },
  "factoryDetail.workerReviews": {
    en: "🗣️ Worker Reviews",
    my: "🗣️ အလုပ်သမားများ၏ သုံးသပ်ချက်များ",
  },
  "factoryDetail.noReviews": {
    en: "No reviews yet. Be the first to write a review!",
    my: "ပြန်လည်သုံးသပ်ချက် မရှိသေးပါ။ ပထမဆုံး ရေးသားပါ!",
  },
  "factoryDetail.reviewFrom": {
    en: "From {country} • Submitted {date}",
    my: "{country}မှ • {date} တွင် တင်သွင်းခဲ့သည်",
  },
  "factoryDetail.backToAll": {
    en: "← Back to all factories",
    my: "← စက်ရုံအားလုံးသို့ ပြန်သွားရန်",
  },

  // About Us
  "about.title": { en: "About WorkerVoice", my: "WorkerVoice အကြောင်း" },
  "about.p1": {
    en: "WorkerVoice is a platform that helps Myanmar migrant workers make informed decisions about workplaces. We believe every worker deserves to know the truth about their workplace before joining.",
    my: "WorkerVoice သည် မြန်မာနိုင်ငံမှ ရွှေ့ပြောင်းအလုပ်သမားများအတွက် အလုပ်ခွင်ဆိုင်ရာ သတင်းအချက်အလက်များကို ပွင့်လင်းစွာ မျှဝေပေးနေသည့် ပလက်ဖောင်းတစ်ခုဖြစ်ပါသည်။",
  },
  "about.p2": {
    en: "Our mission is to ensure every migrant worker can find safe and trustworthy employment. We provide anonymous reviews about salary, overtime, and housing conditions.",
    my: "ကျွန်တော်တို့၏ ရည်မှန်းချက်မှာ ရွှေ့ပြောင်းအလုပ်သမားများအားလုံး ဘေးကင်းပြီး ယုံကြည်စိတ်ချရသော အလုပ်များကို ရှာဖွေနိုင်စေရန်ဖြစ်ပါသည်။ လုပ်ခလစာ၊ အချိန်ပို၊ နေထိုင်ရေးအခြေအနေများကို လူမည်မဖော်ပြဘဲ ပြန်လည်သုံးသပ်ချက်များဖြင့် ကြိုတင်သိရှိနိုင်ပါသည်။",
  },
  "about.belief": {
    en: '"Listen to every worker\'s voice, protect every worker\'s safety."',
    my: '"အလုပ်သမားတိုင်း၏ အသံကို နားထောင်ပါ၊ အလုပ်သမားတိုင်း၏ ဘေးကင်းရေးကို ကာကွယ်ပါ။"',
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
    my: "WorkerVoice — ရွှေ့ပြောင်းအလုပ်သမားများ ပြန်လည်သုံးသပ်ချက် ကွန်ယက်",
  },
  "footer.tagline": {
    en: "Thailand 🇹🇭 • Helping workers find safe workplaces",
    my: "ထိုင်းနိုင်ငံ 🇹🇭 • အလုပ်သမားများအား ဘေးကင်းရောက်ရှိရေး ကူညီပေးနေသည်",
  },
  "footer.copyright": {
    en: "© 2026 WorkerVoice. All rights reserved.",
    my: "© 2026 WorkerVoice. မူပိုင်ခွင့် အားလုံး ထိန်းသိမ်းထားပါသည်။",
  },

  // Login Page
  "login.title": { en: "Log in", my: "ဝင်ရောက်ရန်" },
  "login.noAccount": { en: "Don't have an account?", my: "အကောင့်မရှိဘူးလား?" },
  "login.createOne": { en: "Create one", my: "ဖန်တီးရန်" },
  "login.email": { en: "Email", my: "အီးမေးလ်" },
  "login.password": { en: "Password", my: "စကားဝှက်" },
  "login.invalidCredentials": {
    en: "Invalid email or password, or your email is not yet verified.",
    my: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေပါသည်၊ သို့မဟုတ် သင့်အီးမေးလ်ကို မစစ်ဆေးရသေးပါ။",
  },
  "login.forgotPassword": {
    en: "Forgot your password?",
    my: "စကားဝှက် မေ့နေပါသလား?",
  },

  // Register Page
  "register.title": { en: "Create an account", my: "အကောင့်ဖန်တီးရန်" },
  "register.hasAccount": { en: "Already have an account?", my: "အကောင့်ရှိပြီးသားလား?" },
  "register.fullName": { en: "Full name", my: "အပြည့်အစုံ အမည်" },
  "register.nickname": { en: "Nickname (optional)", my: "နာမည်ခေါ်စဉ် (ရွေးချယ်စရာ)" },
  "register.nicknameHint": {
    en: "Add a nickname to keep your real name private on reviews. If you skip this, your full name will be shown publicly.",
    my: "ပြန်လည်သုံးသပ်ချက်များတွင် သင့်အမည်ကို လျှို့ဝှက်ထားရန် နာမည်ခေါ်စဉ် ထည့်ပါ။ ဒီဟာကို ข้ามလွှားပါက သင့်အပြည့်အစုံ အမည်ကို အများပြည်သူသို့ ပြသပါမည်။",
  },
  "register.checkEmail": {
    en: "Check your email to verify your account before logging in.",
    my: "ဝင်ရောက်မီး သင့်အကောင့်ကို စစ်ဆေးရန် သင့်အီးမေးလ်ကို စစ်ဆေးပါ။",
  },
  "register.createAccount": { en: "Create account", my: "အကောင့်ဖန်တီးရန်" },
};

export type TranslationKey = keyof typeof translations;
