"use client";

import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { useLanguage } from "@/src/contexts/LanguageContext";

const sections = [
  {
    id: "1",
    titleMy: "စည်းကမ်းချက်များကို သဘောတူညီမှု",
    titleEn: "Acceptance of Terms",
    bodyMy: "အသုံးပြုသူများသည် ဤပလက်ဖောင်း (Website / Telegram Mini App) ကို အသုံးပြုခြင်းဖြင့် ဖော်ပြပါ စည်းကမ်းသတ်မှတ်ချက် အားလုံးကို အလိုအလျောက် သဘောတူညီပြီးဖြစ်ကြောင်းနှင့် လိုက်နာရန် တာဝန်ရှိကြောင်း အတိအလင်း သတ်မှတ်သည်။",
    bodyEn: "By using this platform (Website / Telegram Mini App), users are explicitly deemed to have automatically accepted and agreed to comply with all the terms and conditions stated herein.",
  },
  {
    id: "2",
    titleMy: "အသုံးပြုသူများ တင်ပြသည့် အချက်အလက်ဆိုင်ရာ စည်းကမ်းချက်များ",
    titleEn: "User-Generated Content / Reviews",
    bodyMy: "အလုပ်ရုံများ (Factories) နှင့် ပတ်သက်၍ Review ရေးသားရာတွင် မမှန်ကန်သော အချက်အလက်များ၊ ရည်ရွယ်ချက်ရှိရှိ တိုက်ခိုက်ခြင်းများ၊ ဆဲဆိုရိုင်းစိုင်းခြင်းများနှင့် ဥပဒေနှင့်မညီညွတ်သော စာသားများ မပါဝင်စေဘဲ မိမိ၏ ကိုယ်တွေ့အတွေ့အကြုံစစ်မှန်မှုကိုသာ အခြေခံ၍ ရေးသားရမည်။",
    bodyEn: "When writing reviews about factories, users must base their reviews solely on their own genuine experiences. Reviews must not contain false information, intentional attacks, profanity, or illegal content.",
  },
  {
    id: "3",
    titleMy: "အမည်မသိစနစ်နှင့် လျှို့ဝှက်ချက် ထိန်းသိမ်းမှု",
    titleEn: "Anonymity & Privacy Policy",
    bodyMy: "လုပ်သားများ၏ လုံခြုံရေးအတွက် Review များကို အမည်မဖော်ပြဘဲ (Anonymous) တင်ဆက်ပေးမည်ဖြစ်သော်လည်း၊ အသုံးပြုသူဘက်မှ အခြားသူများ၏ ကိုယ်ရေးကိုယ်တာအချက်အလက် (Privacy) ကို ထိခိုက်စေမည့် အကြောင်းအရာများ (ဥပမာ - မန်နေဂျာ သို့မဟုတ် အခြားသူတစ်ဦးဦး၏ အမည်နှင့် ဖုန်းနံပါတ် တိုက်ရိုက်ဖော်ပြခြင်း) မပြုလုပ်ရန် တားမြစ်ထားပါသည်။",
    bodyEn: "For workers' safety, reviews will be presented anonymously. However, users are prohibited from posting content that violates others' privacy (e.g., directly naming or sharing phone numbers of managers or other individuals).",
  },
  {
    id: "4",
    titleMy: "အချင်းချင်း လေးစားမှုရှိရေး စည်းကမ်းများ",
    titleEn: "Community Guidelines",
    bodyMy: "မှန်ကန်သော အချက်အလက်များကိုသာ ရေးပါ- မိမိကိုယ်တိုင် ကြုံတွေ့ခဲ့ရသော (သို့မဟုတ်) သေချာပေါက် မှန်ကန်သော အလုပ်ခွင် အခြေအနေများကိုသာ ရိုးသားစွာ ရေးသားပါ။ အလုပ်ရှင်ကို မလိုမုန်းထား၍ သတင်းအမှားများ တမင်လုပ်ကြံရေးသားခြင်းကို ခွင့်မပြုပါ။",
    bodyEn: "Write only truthful information — honestly describe workplace conditions you have personally experienced or are certain about. Intentionally fabricating false information to harm employers is not allowed.",
  },
  {
    id: "5",
    titleMy: "တားမြစ်ထားသော လုပ်ဆောင်ချက်များ",
    titleEn: "Prohibited Conduct",
    bodyMy: "ပလက်ဖောင်းပေါ်ရှိ စက်ရုံအချက်အလက်များကို ခွင့်ပြုချက်မရှိဘဲ စီးပွားရေးအရ အလွဲသုံးစားလုပ်ခြင်း၊ စနစ်အား နှောင့်ယှက်ဖျက်ဆီးရန် ကြိုးပမ်းခြင်း (Hacking/Spamming) နှင့် Review အတုများစွာကို စက်ရုပ် (Bot) များသုံး၍ ရည်ရွယ်ချက်ရှိရှိ တင်ခြင်းများကို တားမြစ်ထားပါသည်။",
    bodyEn: "Commercial misuse of factory data without authorization, attempts to disrupt or damage the system (Hacking/Spamming), and posting fake reviews using bots are strictly prohibited.",
  },
  {
    id: "6",
    titleMy: "ဉာဏပစ္စည်းမူပိုင်ခွင့်",
    titleEn: "Intellectual Property Rights",
    bodyMy: "WorkerVoice ပလက်ဖောင်းပေါ်တွင် သုံးစွဲထားသော လိုဂို (Logo 4 - Lighthouse ဒီဇိုင်း)၊ အသွင်အပြင် (UI Layout)၊ နည်းပညာကုဒ်များနှင့် စုစည်းထားသော ပလက်ဖောင်း၏ မူပိုင်ဖြစ်ပြီး ခွင့်ပြုချက်မရှိဘဲ ကူးယူ အသုံးပြုခြင်းအားခွင့်မပြုပါ။",
    bodyEn: "The logo (Logo 4 - Lighthouse design), UI layout, source code, and all compiled assets of the WorkerVoice platform are its intellectual property. Copying or using them without authorization is prohibited.",
  },
  {
    id: "7",
    titleMy: "တာဝန်ယူမှု ကန့်သတ်ချက်",
    titleEn: "Limitation of Liability",
    bodyMy: "ဤပလက်ဖောင်းသည် လုပ်သားများအချင်းချင်း အချက်အလက် မျှဝေပေးသော နေရာသာဖြစ်ပြီး၊ တင်ပြထားသော Review များသည် အသုံးပြုသူများ၏ ကိုယ်ပိုင်အမြင်သာ ဖြစ်သည်။ ထို့ကြောင့် Review များကြောင့် ဖြစ်ပေါ်လာနိုင်သော စက်ရုံနှင့် အလုပ်သမားကြား ပဋိပက္ခများ သို့မဟုတ် နစ်နာမှုများအတွက် WorkerVoice ဘက်မှ တိုက်ရိုက် တာဝန်ယူမည်မဟုတ်ပါ။",
    bodyEn: "This platform is merely a space for workers to share information with each other, and published reviews represent only the personal opinions of users. Therefore, WorkerVoice is not directly liable for any conflicts or damages between factories and workers that may arise from reviews.",
  },
  {
    id: "8",
    titleMy: "အချက်အလက်များကို ပြင်ဆင်ခြင်းနှင့် ဖျက်သိမ်းပိုင်ခွင့်",
    titleEn: "Right to Modify or Delete Content",
    bodyMy: "စနစ်၏ စည်းကမ်းချက်များနှင့် မညီညွတ်သော၊ မဟုတ်မမှန်သော သို့မဟုတ် ရိုင်းစိုင်းစော်ကားသော သုံးသပ်ချက် (Review) များကို Admin အဖွဲ့မှ ကြိုတင်အကြောင်းကြားခြင်းမရှိဘဲ ပြင်ဆင်ပိုင်ခွင့်၊ ပယ်ဖျက်ပိုင်ခွင့်နှင့် အဆိုပါအကောင့်အား ပိတ်သိမ်းပိုင်ခွင့် (Account Termination) ရှိပါသည်။",
    bodyEn: "The Admin team reserves the right to modify, delete, or terminate accounts without prior notice for reviews that violate the system's terms, are untrue, or are offensive.",
  },
  {
    id: "9",
    titleMy: "အရေးကြီးသော အသိပေးချက်",
    titleEn: "Disclaimer",
    bodyMy: "ဥပဒေရေးရာ အကြံပေးချက်မဟုတ်ပါ- ဤဝဘ်ဆိုက်တွင် ဖော်ပြထားသော အချက်အလက်များသည် အလုပ်သမားများ၏ ကိုယ်ပိုင်အတွေ့အကြုံများသာ ဖြစ်ပါသည်။ ပြဿနာတစ်စုံတစ်ရာ ဖြစ်ပေါ်လာပါက တရားဝင် ဥပဒေအကြံပေးချက် (သို့မဟုတ်) ရှေ့နေ၏ အကြံပြုချက်အဖြစ် အသုံးပြုခြင်းအားခွင့်မပြုထားပါ။",
    bodyEn: "Not legal advice — the information on this website is solely the personal experiences of workers. If any issues arise, this information must not be used as a substitute for official legal advice or an attorney's recommendation.",
  },
  {
    id: "10",
    titleMy: "စည်းကမ်းချက်များအား ပြောင်းလဲနိုင်ခွင့်",
    titleEn: "Changes to Terms",
    bodyMy: "ပလက်ဖောင်းသည် လိုအပ်ချက်အရဖြစ်စေ၊ ဥပဒေကြောင်းအရဖြစ်စေ ဤ Terms and Conditions များကို အချိန်မရွေး ပြောင်းလဲပြင်ဆင်နိုင်ခွင့်ရှိပြီး၊ ပြင်ဆင်ချက်များကို ပလက်ဖောင်းပေါ်တွင် အသိပေးကြေညာသွားမည်ဖြစ်ပါသည်။",
    bodyEn: "The platform reserves the right to modify these Terms and Conditions at any time due to operational or legal requirements, and any changes will be announced on the platform.",
  },
];

const introMy = "ဤအချက်များသည် ရွှေ့ပြောင်းလုပ်သားများအတွက် အလုပ်ရုံပြန်လည်သုံးသပ်ချက် (Review) များ ပံ့ပိုးပေးသည့် WorkerVoice platform ၏ သဘာဝနှင့် ကိုက်ညီပြီး အသုံးပြုသူများနှင့် စနစ်အား အကာအကွယ်ပေးနိုင်ရန် ပြင်ဆင်ထားသော အဓိက စည်းကမ်းချက်များ ဖြစ်သည်။";
const introEn = "These are the key terms and conditions designed to protect both users and the system, aligned with the nature of WorkerVoice — a platform supporting workplace reviews for migrant workers.";

const numerals = {
  my: ["၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉", "၁၀"],
  en: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
};

export default function TermsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto p-4 md:p-8 mt-6 w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {t("terms.title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            WorkerVoice
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Intro */}
          <p className="text-slate-600 dark:text-slate-400 italic">
            {language === "en" ? introEn : introMy}
          </p>

          {/* Sections */}
          {sections.map((section, index) => (
            <section key={section.id}>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                {numerals[language][index]}{language === "my" ? "။" : "."}{" "}
                {language === "en" ? section.titleEn : section.titleMy}
              </h2>
              <p>
                {language === "en" ? section.bodyEn : section.bodyMy}
              </p>
            </section>
          ))}

          {/* Disclaimer Note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">
              {language === "en" ? "Limitation of Liability" : "တာဝန်ယူမှု ကန့်သတ်ချက်"}
            </p>
            <p>
              {language === "en"
                ? "The comments written by users are their own opinions and do not represent the official views of the WorkerVoice organization."
                : "အသုံးပြုသူများ ရေးသားထားသော မှတ်ချက်များသည် ရေးသားသူ၏ အာဘော်သာဖြစ်ပြီး WorkerVoice အဖွဲ့အစည်း၏ တရားဝင်အမြင် မဟုတ်ပါ။"}
            </p>
          </div>

          {/* Note */}
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            *{" "}
            {language === "en"
              ? "Note: These terms are suggested based on the Migrant Worker Reviews process of the WorkerVoice project."
              : "မှတ်ချက်။ ။ ဤအချက်များသည် WorkerVoice ပရောဂျက်၏ စက်ရုံသုံးသပ်ချက်စနစ် (Migrant Worker Reviews) လုပ်ငန်းစဉ်အပေါ် အခြေခံ၍ အကြံပြုထားခြင်း ဖြစ်ပါသည်။"}
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center pb-4">
          <button
            onClick={() => window.history.back()}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
          >
            {t("terms.back")}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
