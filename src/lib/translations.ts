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
  "nav.user": { en: "User", my: "အသုံးပြုသူ" },
  "nav.adminDashboard": { en: "Admin Dashboard", my: "Admin Dashboard" },
  "nav.createFactory": { en: "My Factory", my: "ကျွန်ုပ်၏ စက်ရုံ" },
  "nav.loggingOut": { en: "Logging out...", my: "ထွက်နေသည်..." },
  "nav.profile": { en: "My Profile", my: "ကျွန်ုပ်၏ ပရိုဖိုင်" },
  "nav.changePassword": { en: "Change Password", my: "စကားဝှက် ပြောင်းရန်" },
  "auth.loginRequired": {
    en: "You need to log in first to write a review. Go to login page?",
    my: "သုံးသပ်ချက် ရေးရန် အရင် ဝင်ရောက်ပါ။ ဝင်ရောက်ရန် စာမျက်နှာသို့ သွားမလား?",
  },
  "review.successTitle": {
    en: "Review Submitted",
    my: "သုံးသပ်ချက် တင်သွင်းပြီးပါပြီ",
  },
  "review.successMessage": {
    en: "Your review has been submitted successfully. It will be visible after admin approval.",
    my: "သင့်သုံးသပ်ချက်ကို အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ။ စီမံခန့်ခွဲသူ အတည်ပြုပြီးနောက်မှ မြင်ရမည်ဖြစ်ပါသည်။",
  },

  // My Factories
  "myFactories.title": { en: "🏭 My Factories", my: "🏭 ကျွန်ုပ်၏ စက်ရုံများ" },
  "myFactories.subtitle": {
    en: "Factories you have submitted",
    my: "သင်တင်သွင်းထားသည့် စက်ရုံများ",
  },
  "myFactories.empty": {
    en: "You haven't submitted any factories yet",
    my: "သင်သည် စက်ရုံများ မတင်သွင်းရသေးပါ",
  },
  "myFactories.createFirst": {
    en: "Submit your first factory →",
    my: "ပထမဆုံး စက်ရုံကို တင်သွင်းရန် →",
  },
  "myFactories.edit": { en: "Edit", my: "ပြင်ဆင်ရန်" },
  "myFactories.view": { en: "View", my: "ကြည့်ရှုရန်" },
  "myFactories.status.pending": { en: "Pending Review", my: "စစ်ဆေးဆဲ" },
  "myFactories.status.approved": { en: "Approved", my: "အတည်ပြုပြီး" },
  "myFactories.status.declined": { en: "Declined", my: "ငြင်းပယ်ပြီး" },
  "myFactories.loading": { en: "Loading your factories...", my: "သင့်စက်ရုံများကို ဆွဲနေသည်..." },
  "myFactories.previous": { en: "Previous", my: "နောက်သို့" },
  "myFactories.next": { en: "Next", my: "ရှေ့သို့" },
  "myFactories.pageOf": {
    en: "Page {page} of {total}",
    my: "စာမျက်နှာ {total} အနက် {page}",
  },
  "myFactories.newFactory": { en: "+ New Factory", my: "+ စက်ရုံအသစ်" },

  // Edit Factory
  "editFactory.title": { en: "✏️ Edit Factory", my: "✏️ စက်ရုံ ပြင်ဆင်ရန်" },
  "editFactory.subtitle": {
    en: "Update your factory information",
    my: "သင့်စက်ရုံ အချက်အလက်များကို ပြင်ဆင်ပါ",
  },
  "editFactory.success": {
    en: "Factory updated successfully!",
    my: "စက်ရုံကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ!",
  },
  "editFactory.back": {
    en: "← Back to My Factories",
    my: "← ကျွန်ုပ်၏ စက်ရုံများသို့ ပြန်ရန်",
  },

  // Factory Submitted Modal
  "factorySubmitted.title": {
    en: "Factory Submitted",
    my: "စက်ရုံ တင်သွင်းပြီးပါပြီ",
  },
  "factorySubmitted.message": {
    en: "Your factory has been submitted successfully! It will appear on the site after admin review.",
    my: "သင့်စက်ရုံကို အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ! စီမံခန့်ခွဲသူ စစ်ဆေးပြီးနောက် စာမျက်နှာပေါ်တွင် ပေါ်လာမည်ဖြစ်ပါသည်။",
  },
  "factorySubmitted.ok": { en: "OK", my: "OK" },

  // New Factory Page
  "newFactory.title": { en: "+ New Factory", my: "+ စက်ရုံအသစ်" },
  "newFactory.subtitle": {
    en: "Help other workers by sharing factory information",
    my: "စက်ရုံ အချက်အလက်များကို မျှဝေခြင်းဖြင့် အခြားအလုပ်သမားများကို ကူညီပါ",
  },
  "newFactory.notice": {
    en: "📝 Your submission will be reviewed by an admin before appearing publicly.",
    my: "📝 သင့်တင်သွင်းမှုကို အများပြည်သူထံ ပေါ်လာမီးမတိုင်မီ စီမံခန့်ခွဲသူက စစ်ဆေးပါမည်။",
  },

  // Factory Form Fields
  "factoryForm.basicInfo": { en: "📋 Basic Information", my: "📋 အခြေခံ အချက်အလက်များ" },
  "factoryForm.address": { en: "📍 Address", my: "📍 လိပ်စာ" },
  "factoryForm.factoryName": { en: "Factory Name *", my: "စက်ရုံ အမည် *" },
  "factoryForm.factoryNamePlaceholder": { en: "Enter factory name", my: "စက်ရုံ အမည်ထည့်ပါ" },
  "factoryForm.regNumber": { en: "Registration Number *", my: "မှတ်ပုံတင် အမှတ် *" },
  "factoryForm.regNumberPlaceholder": { en: "e.g. 0105519000001", my: "ဥပမာ။ 0105519000001" },
  "factoryForm.operator": { en: "Operator", my: "လုပ်ငန်းရှင်" },
  "factoryForm.operatorPlaceholder": { en: "Company operator name", my: "ကုမ္ပဏီ လုပ်ငန်းရှင် အမည်" },
  "factoryForm.businessActivity": { en: "Business Activity", my: "စီးပွားဖြစ် လုပ်ငန်း" },
  "factoryForm.businessActivityPlaceholder": { en: "e.g. Textile manufacturing", my: "ဥပမာ။ အထည်ထုတ်လုပ်ရေး" },
  "factoryForm.phone": { en: "Phone", my: "ဖုန်း" },
  "factoryForm.phonePlaceholder": { en: "Contact phone number", my: "ဆက်သွယ်ရန် ဖုန်းနံပါတ်" },
  "factoryForm.workers": { en: "Number of Workers", my: "အလုပ်သမား အရေအတွက်" },
  "factoryForm.workersPlaceholder": { en: "e.g. 500", my: "ဥပမာ။ 500" },
  "factoryForm.houseNumber": { en: "House Number", my: "အိမ်အမှတ်" },
  "factoryForm.houseNumberPlaceholder": { en: "House/Building number", my: "အိမ်/အဆောက်အအုံ အမှတ်" },
  "factoryForm.village": { en: "Village", my: "ကျေးရွာ" },
  "factoryForm.villagePlaceholder": { en: "Village/Moo", my: "ကျေးရွာ/မွှေ" },
  "factoryForm.soi": { en: "Soi", my: "ဆိုင်း" },
  "factoryForm.soiPlaceholder": { en: "Soi", my: "ဆိုင်း" },
  "factoryForm.road": { en: "Road", my: "လမ်း" },
  "factoryForm.roadPlaceholder": { en: "Road name", my: "လမ်းအမည်" },
  "factoryForm.subdistrict": { en: "Subdistrict", my: "ရပ်ကွက်" },
  "factoryForm.subdistrictPlaceholder": { en: "Subdistrict (Tambon)", my: "ရပ်ကွက် (တံတား)" },
  "factoryForm.district": { en: "District", my: "မြို့နယ်" },
  "factoryForm.districtPlaceholder": { en: "District (Amphoe)", my: "မြို့နယ် (အမ်ဖို့)" },
  "factoryForm.province": { en: "Province *", my: "ဒေသ *" },
  "factoryForm.provincePlaceholder": { en: "Select province", my: "ဒေသ ရွေးပါ" },
  "factoryForm.regNumberRequired": {
    en: "Registration number is required",
    my: "မှတ်ပုံတင် အမှတ် ဖြည့်သွင်းရန် လိုအပ်ပါသည်",
  },
  "factoryForm.provinceRequired": {
    en: "Province is required",
    my: "ဒေသ ဖြည့်သွင်းရန် လိုအပ်ပါသည်",
  },
  "factoryForm.postalCode": { en: "Postal Code", my: "စာပို့ ကုဒ်" },
  "factoryForm.postalCodePlaceholder": { en: "e.g. 10110", my: "ဥပမာ။ 10110" },
  "factoryForm.submitFactory": { en: "Submit Factory", my: "စက်ရုံ တင်သွင်းရန်" },
  "factoryForm.saveChanges": { en: "Save Changes", my: "ပြောင်းလဲမှုများ သိမ်းဆည်းရန်" },
  "factoryForm.factoryImage": { en: "🏭 Factory Image", my: "🏭 စက်ရုံ ပုံ" },
  "factoryForm.uploadImage": { en: "Upload Image", my: "ပုံ တင်ရန်" },
  "factoryForm.removeImage": { en: "Remove", my: "ဖျက်ရန်" },
  "factoryForm.imageHint": {
    en: "JPG or PNG, recommended 400×400px",
    my: "JPG သို့မဟုတ် PNG၊ 400×400px အကြံပြုထားသည်",
  },

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
  "filters.allRegions": { en: "All Provinces", my: "ဒေသအားလုံး" },
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
  "factoryList.allRegions": { en: "All Provinces", my: "ဒေသအားလုံး" },
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
  "factoryList.submitFactory": { en: "➕ Submit Factory", my: "➕ စက်ရုံ တင်သွင်းရန်" },
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
  "factoryDetail.type": { en: "Postal Code", my: "စာပို့ ကုဒ်" },
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

  // Factory Address Fields
  "factoryDetail.address.houseNumber": { en: "No.", my: "အိမ်အမှတ်" },
  "factoryDetail.address.village": { en: "Village", my: "ကျေးရွာ" },
  "factoryDetail.address.soi": { en: "Soi", my: "ဆိုင်း" },
  "factoryDetail.address.road": { en: "Road", my: "လမ်း" },
  "factoryDetail.address.subdistrict": { en: "Subdistrict", my: "မြို့နယ်" },
  "factoryDetail.address.district": { en: "District", my: "ခရိုင်" },
  "factoryDetail.address.province": { en: "Province", my: "ဒေသ" },

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
  "about.disclaimer": {
    en: '"Disclaimer: In the event of any dispute, the decision of WorkerVoice shall be final"',
    my: 'Disclaimer: အကယ်၍ အငြင်းပွားစရာတစ်စုံတစ်ရာရှိလာပါက WorkerVoice အဖွဲ့အစည်း၏ ဆုံးဖြတ်ချက်သည်သာ အတည်ဖြစ်သည်။',
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
    en: "WorkerVoice will never ask you to contact us through unofficial channels. For your safety, please only use the contact form and official social media links on this page.",
    my: "WorkerVoice သည် တရားဝင်မဟုတ်သော လမ်းကြောင်းများမှတစ်ဆင့် ဆက်သွယ်ရန် ဘယ်သောအခါမှ တောင်းဆိုမည်မဟုတ်ပါ။ သင့်လုံခြုံရေးအတွက် ဤစာမျက်နှာရှိ ဆက်သွယ်ရန်ဖောင်နှင့် တရားဝင် လူမှုကွန်ယက်လင့်ခ်များကိုသာ အသုံးပြုပါ။",
  },
  "contact.backHome": {
    en: "← Back to home",
    my: "← ပင်မစာမျက်နှာသို့ ပြန်သွားရန်",
  },
  "contact.form.title": {
    en: "Send us a message",
    my: "ကျွန်တော်တို့ထံ မက်ဆေ့ချ်တစ်ခု ပေးပို့ပါ",
  },
  "contact.form.subtitle": {
    en: "Fill out the form below and we will get back to you as soon as possible.",
    my: "အောက်ပါဖောင်ကို ဖြည့်ပြီး ကျွန်တော်တို့ ဖြစ်နိုင်သမျှ အမြန်ဆုံး ပြန်လည်ဆက်သွယ်ပါမည်။",
  },
  "contact.form.name": { en: "Your Name", my: "သင့်အမည်" },
  "contact.form.email": { en: "Email Address", my: "အီးမေးလ်လိပ်စာ" },
  "contact.form.subject": { en: "Subject", my: "ခေါင်းစဉ်" },
  "contact.form.message": { en: "Message", my: "မက်ဆေ့ချ်" },
  "contact.form.namePlaceholder": { en: "Enter your name", my: "သင့်အမည်ကို ထည့်ပါ" },
  "contact.form.emailPlaceholder": {
    en: "Enter your email",
    my: "သင့်အီးမေးလ်ကို ထည့်ပါ",
  },
  "contact.form.subjectPlaceholder": {
    en: "What is this about?",
    my: "ဘာအတွက်လဲ",
  },
  "contact.form.messagePlaceholder": {
    en: "Write your message here...",
    my: "သင့်မက်ဆေ့ချ်ကို ဒီမှာ ရေးပါ...",
  },
  "contact.form.nameRequired": {
    en: "Name is required",
    my: "အမည် လိုအပ်ပါသည်",
  },
  "contact.form.emailRequired": {
    en: "Email is required",
    my: "အီးမေးလ် လိုအပ်ပါသည်",
  },
  "contact.form.emailInvalid": {
    en: "Please enter a valid email",
    my: "မှန်ကန်သော အီးမေးလ်ကို ထည့်ပါ",
  },
  "contact.form.subjectRequired": {
    en: "Subject is required",
    my: "ခေါင်းစဉ် လိုအပ်ပါသည်",
  },
  "contact.form.messageRequired": {
    en: "Message is required",
    my: "မက်ဆေ့ချ် လိုအပ်ပါသည်",
  },
  "contact.form.submit": { en: "Send Message", my: "မက်ဆေ့ချ် ပေးပို့ရန်" },
  "contact.form.sending": {
    en: "Sending...",
    my: "ပေးပို့နေသည်...",
  },
  "contact.form.successTitle": {
    en: "Message sent!",
    my: "မက်ဆေ့ချ် ပေးပို့ပြီးပါပြီ!",
  },
  "contact.form.successMessage": {
    en: "Thank you for reaching out. We will get back to you shortly.",
    my: "ဆက်သွယ်ပေးတဲ့အတွက် ကျေးဇူးတင်ပါတယ်။ ကျွန်တော်တို့ မကြာမီ ပြန်လည်ဆက်သွယ်ပါမည်။",
  },
  "contact.form.errorTitle": {
    en: "Something went wrong",
    my: "တစ်ခုခု မှားသွားပါပြီ",
  },
  "contact.form.errorMessage": {
    en: "Could not send your message. Please try again later.",
    my: "သင့်မက်ဆေ့ချ်ကို ပေးပို့မရပါ။ နောက်မှ ထပ်ကြိုးစားပါ။",
  },
  "contact.form.retry": { en: "Try again", my: "ထပ်ကြိုးစားရန်" },
  "contact.channels.title": {
    en: "Other Ways to Reach Us",
    my: "ကျွန်တော်တို့ထံ ဆက်သွယ်နည်းများ",
  },
  "contact.channels.description": {
    en: "Follow us on social media for the latest updates, announcements, and community support.",
    my: "နောက်ဆုံးရ သတင်းများ၊ ကြေညာချက်များနှင့် အသိုင်းအဝိုင်း အကူအညီများအတွက် လူမှုကွန်ယက်များတွင် ကြည့်ရှုပါ။",
  },

  // Footer
  "footer.brand": {
    en: "- Migrant Worker Review Network",
    my: "- ရွှေ့ပြောင်းအလုပ်သမားများ ပြန်လည်သုံးသပ်ချက် ကွန်ယက်",
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
    en: "Invalid email or password.",
    my: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေပါသည်။",
  },
  "login.emailNotVerified": {
    en: "Email not verified. A verification link has been sent to your email.",
    my: "အီးမေးလ် အတည်ပြုခြင်း မလုပ်ရသေးပါ။ အတည်ပြုရန်လင့်ခ်ကို သင့်အီးမေးလ်သို့ ပေးပို့ပြီးပါပြီ။",
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
    my: "မဝင်ရောက်မီ သင့်အကောင့်ကို အတည်ပြုရန် သင့်အီးမေးလ်ကို စစ်ဆေးပါ။",
  },
  "register.verificationResent": {
    en: "A new verification link has been sent to your email. Please verify your account.",
    my: "အတည်ပြုရန်လင့်ခ်အသစ်ကို သင့်အီးမေးလ်သို့ ပေးပို့ပြီးပါပြီ။ သင့်အကောင့်ကို စစ်ဆေးပါ။",
  },
  "register.createAccount": { en: "Create account", my: "အကောင့်ဖန်တီးရန်" },

  // Demo Guide
  "demo.title": { en: "Demo Guide", my: "Demo လမ်းညွှန်" },
  "demo.subtitle": {
    en: "Try WorkerVoice with demo accounts",
    my: "Demo အကောင့်များဖြင့် WorkerVoice ကို စမ်းသုံးကြည့်ပါ",
  },
  "demo.quickAccess": { en: "Quick Access", my: "အမြန်ဝင်ရောက်ရန်" },
  "demo.loginCredentials": { en: "Login Credentials", my: "ဝင်ရောက်ရန် အချက်အလက်များ" },
  "demo.userRole": { en: "User Demo", my: "User Demo" },
  "demo.adminRole": { en: "Admin Demo", my: "Admin Demo" },
  "demo.telegramBot": { en: "Telegram Bot", my: "Telegram Bot" },
  "demo.userAccount": { en: "User Account", my: "အသုံးပြုသူ အကောင့်" },
  "demo.adminAccount": { en: "Admin Account", my: "Admin အကောင့်" },
  "demo.superAdminAccount": { en: "Super Admin Account", my: "Super Admin အကောင့်" },
  "demo.email": { en: "Email", my: "အီးမေးလ်" },
  "demo.password": { en: "Password", my: "စကားဝှက်" },
  "demo.features": { en: "Features", my: "လုပ်ဆောင်ချက်များ" },
  "demo.instructions": { en: "How to use", my: "အသုံးပြုပုံ" },
  "demo.backToLogin": { en: "Back to Login", my: "ဝင်ရောက်ရန် ပြန်သွားရန်" },
  "demo.userFeatures": {
    en: "Browse factories, write reviews, write contact messages",
    my: "စက်ရုံများကြည့်ရှုရန်၊ သုံးသပ်ချက်ရေးရန်၊ ဆက်သွယ်ရန် မက်ဆေ့ချ်များရေးရန်",
  },
  "demo.adminFeatures": {
    en: "View dashboard and manage factories, reviews, messages, users",
    my: "Dashboard ကြည့်ရှုရန်၊ စက်ရုံများ၊ သုံးသပ်ချက်များ၊ မက်ဆေ့ချ်များ၊ အသုံးပြုသူများကို စီမံခန့်ခွဲရန်",
  },
  "demo.superAdminFeatures": {
    en: "Full access: View dashboard and manage factories, reviews, messages, users and admins",
    my: "အပြည့်အစုံ ဝင်ရောက်ခွင့်: Dashboard ကြည့်ရှုရန်၊ စက်ရုံများ၊ သုံးသပ်ချက်များ၊ မက်ဆေ့ချ်များ၊ အသုံးပြုသူများနှင့် adminများကို စီမံခန့်ခွဲရန်",
  },
  "demo.telegramFeatures": {
    en: "Search factories, get instant info via Telegram",
    my: "Telegram မှတဆင့် စက်ရုံများ ရှာဖွေရန်၊ ချက်ချင်း အချက်အလက် ရရှိရန်",
  },
  "demo.howToUseLinks": {
    en: "Click the links above to try each demo directly, or use the login credentials.",
    my: "အပေါ်ပါ လင့်ခ်များကို နှိပ်၍ တိုက်ရိုက် စမ်းသုံးနိုင်ပါသည်၊ သို့မဟုတ် ဝင်ရောက်ရန် အချက်အလက်များကို အသုံးပြုနိုင်ပါသည်။",
  },
  "demo.tryDemo": { en: "Try demo accounts →", my: "Demo အကောင့်များ စမ်းသုံးကြည့်ပါ →" },
};

export type TranslationKey = keyof typeof translations;
