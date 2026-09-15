
import { NextResponse } from "next/server";

import {
  createTask,
  updateLead,
  getLeads,
  getTasks,
  updateTask,
} from "@/lib/workflows/store";

import { executeAICommand } from "@/lib/ai/command-actions";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type AIRequestBody = {
  message?: string;
  messages?: ChatMessage[];
  pageContext?: unknown;
};

type DemoAnalysis = {
  intent: string;
  sentiment: "Positive" | "Neutral" | "Frustrated" | "Negative";
  priority: "Low" | "Medium" | "High";
  confidence: number;
  actions: string[];
  response: string;
  suggestedReply?: string;
  recommendedAction?: string;
  actionType?: string;
};

type LeadLike = {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

type TaskLike = {
  id: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  leadId?: string;
  workflowId?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
};

/* =========================================================
   SAFE CONVERSATION HISTORY
   ========================================================= */

function getSafeMessages(
  messages: ChatMessage[] | undefined
): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" ||
          message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 12000),
    }));
}

/* =========================================================
   NEXAFLOW AI KNOWLEDGE
   ========================================================= */

const NEXAFLOW_KNOWLEDGE = `
NexaFlow AI is a modern AI-powered SaaS operations and automation platform.

It is designed to help businesses understand their operational data and turn
natural-language requests into useful business actions.

NexaFlow combines:

- AI assistance
- business operations
- workflow automation
- lead management
- task management
- analytics
- activity tracking
- AI-powered actions
- workflow execution
- customer-support intelligence
- follow-up automation
- business insights

The product experience is designed around an AI Operations Control Center.

The AI assistant can help users:

- understand business activity
- work with leads
- create and manage tasks
- understand workflows
- execute supported workflow actions
- organize follow-ups
- analyze customer-support requests
- summarize business activity
- plan automation
- turn natural-language instructions into structured actions

The system is designed as an AI-agent-style SaaS experience rather than a
simple decorative chatbot.

NexaFlow AI was designed and developed by Faiza Noor.

The project demonstrates modern full-stack web engineering, AI-assisted
product thinking, SaaS UX, automation architecture, real business data
handling, workflow execution, analytics, authentication, and responsive
dashboard design.

The project is intended to demonstrate how AI can become an operational
interface for a business instead of being limited to question answering.

Do not invent features that do not exist.

Do not claim that external AI APIs are being used when the application is
running in demo mode.

Do not invent customers, revenue, users, companies, or business results.

Portfolio:
https://faiza-noor10.vercel.app/
`;

/* =========================================================
   CREATOR KNOWLEDGE
   ========================================================= */

const CREATOR_KNOWLEDGE = `
The creator and developer of NexaFlow AI is Faiza Noor.

Faiza Noor is a Full-Stack Web Engineer and MS Office Specialist.

Professional positioning:

- Independent Full-Stack Web Engineer
- 1+ year of web development experience
- Focused on modern full-stack web applications
- Interested in AI-powered products and automation
- Self-taught developer
- Professional, product-focused and practical development approach

Core technical skills include:

- React
- Next.js
- TypeScript
- JavaScript
- HTML
- CSS
- Tailwind CSS
- Framer Motion
- Node.js
- Express.js
- REST APIs
- Authentication and authorization
- CRUD systems
- MongoDB
- PostgreSQL / SQL
- Git
- GitHub
- Vercel
- Netlify
- VS Code
- npm
- AI-assisted development

Faiza's work focuses on building polished, responsive and functional web
applications rather than only static interfaces.

She is particularly interested in:

- AI SaaS
- automation systems
- full-stack applications
- dashboards
- workflow systems
- business tools
- intelligent user experiences

Professional links:

Portfolio:
https://faiza-noor10.vercel.app/

LinkedIn:
https://www.linkedin.com/in/faiza-noor-b2711b42b

GitHub:
https://github.com/fizzanoor051-arch

Contact email:
fizzanoor051@gmail.com

When someone asks about Faiza professionally, describe her confidently but
honestly.

Do not mention private personal information.

Do not invent employers, clients, degrees, awards, revenue, or certifications.

When someone asks about her projects, describe her work at a high level.

Do not unnecessarily list individual project names unless the user explicitly
asks for a specific project name.

When discussing her portfolio, provide:
https://faiza-noor10.vercel.app/
`;

/* =========================================================
   LANGUAGE DETECTION
   ========================================================= */

type ResponseLanguage =
  | "english"
  | "roman-urdu"
  | "urdu"
  | "mixed";

function detectLanguage(text: string): ResponseLanguage {
  const value = text.trim();

  if (/[\u0600-\u06FF]/.test(value)) {
    return "urdu";
  }

  const normalized = value
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = normalized
    .split(/\s+/)
    .filter(Boolean);

  const romanUrduWords = new Set([
    "mujhe",
    "mjy",
    "mujhy",
    "mery",
    "meri",
    "mera",
    "mere",
    "mary",
    "mry",
    "aap",
    "ap",
    "aapka",
    "aapki",
    "aapke",
    "apka",
    "apki",
    "apke",
    "tum",
    "tumhara",
    "tumhari",
    "tumhare",
    "tm",
    "tmhara",
    "tmhari",
    "tmhare",
    "kya",
    "kia",
    "ky",
    "hai",
    "ha",
    "hain",
    "hen",
    "ho",
    "tha",
    "thi",
    "the",
    "hoga",
    "hogi",
    "honge",
    "kr",
    "karo",
    "kro",
    "kar",
    "karna",
    "karta",
    "karte",
    "krty",
    "krta",
    "krti",
    "batao",
    "btao",
    "bata",
    "btana",
    "batana",
    "bta",
    "dikhao",
    "dikhayo",
    "dikha",
    "dikhana",
    "dekhao",
    "dekho",
    "chahiye",
    "chahta",
    "chahti",
    "chahye",
    "liye",
    "lay",
    "le",
    "lo",
    "ka",
    "ki",
    "ke",
    "ko",
    "se",
    "ny",
    "ne",
    "par",
    "pe",
    "ye",
    "yeh",
    "yah",
    "is",
    "iss",
    "us",
    "uss",
    "sab",
    "sabh",
    "sari",
    "saray",
    "sare",
    "sara",
    "wala",
    "wali",
    "waly",
    "walay",
    "bohat",
    "bahut",
    "buht",
    "zyada",
    "kam",
    "acha",
    "achha",
    "achi",
    "theek",
    "thik",
    "yr",
    "yaar",
    "yar",
    "han",
    "haan",
    "hmm",
    "nahi",
    "nai",
    "ni",
    "nahin",
    "kuch",
    "koi",
    "kaise",
    "kaisay",
    "kesy",
    "kesi",
    "kyun",
    "kyu",
    "q",
    "kis",
    "kon",
    "kaun",
    "aaj",
    "aj",
    "kal",
    "haftay",
    "hafte",
    "ab",
    "phir",
    "pehle",
    "baad",
    "unka",
    "unki",
    "unke",
    "unko",
    "mujh",
    "apna",
    "apni",
    "apne",
    "sath",
    "saath",
    "bary",
    "bare",
    "baare",
    "krdo",
    "krny",
    "karne",
    "show",
    "status",
    "lead",
    "leads",
    "task",
    "tasks",
    "workflow",
    "workflows",
    "banao",
    "banado",
    "bana",
    "do",
    "baje",
  ]);

  const romanUrduPhrases = [
    "mry high priority leads",
    "meri high priority leads",
    "mery high priority leads",
    "meri leads",
    "mery leads",
    "meri tasks",
    "mery tasks",
    "meri workflows",
    "show kro",
    "show karo",
    "status btao",
    "status batao",
    "iss week",
    "is week",
    "iss haftay",
    "is haftay",
    "aaj ki",
    "aaj ke",
    "aaj ka",
    "kal ki",
    "kal ke",
    "kal ka",
    "mere leads",
    "mery leads",
    "mere tasks",
    "unka status",
    "unki status",
    "un ka status",
    "un ki status",
    "kis ne",
    "kis ny",
    "kon hai",
    "kaun hai",
    "kya hai",
    "kia hai",
    "mujhe batao",
    "mujhy batao",
    "mujhe dikhao",
    "mujhy dikhao",
    "ye project",
    "is project",
    "nexaflow ka",
    "nexaflow ke",
    "nexaflow ki",
    "all of them",
    "un sab",
    "saray",
    "sari",
  ];

  const romanPhraseMatches =
    romanUrduPhrases.filter((phrase) =>
      normalized.includes(phrase)
    ).length;

  const englishWords = new Set([
    "the",
    "this",
    "that",
    "these",
    "those",
    "what",
    "who",
    "how",
    "where",
    "when",
    "why",
    "which",
    "show",
    "list",
    "find",
    "get",
    "give",
    "tell",
    "explain",
    "create",
    "make",
    "add",
    "update",
    "delete",
    "remove",
    "change",
    "my",
    "your",
    "their",
    "our",
    "all",
    "some",
    "any",
    "from",
    "with",
    "for",
    "about",
    "into",
    "on",
    "in",
    "to",
    "today",
    "tomorrow",
    "yesterday",
    "week",
    "month",
    "project",
    "developer",
    "created",
    "built",
    "developed",
    "designed",
    "leads",
    "lead",
    "tasks",
    "task",
    "workflows",
    "workflow",
    "analytics",
    "activity",
    "dashboard",
    "status",
    "priority",
    "business",
    "automation",
    "please",
    "can",
    "could",
    "would",
    "should",
    "help",
    "and",
    "or",
    "but",
    "also",
    "them",
    "those",
    "did",
    "many",
    "schedule",
    "scheduled",
    "tomorrow",
    "today",
  ]);

  const englishMatches = words.filter((word) =>
    englishWords.has(word)
  ).length;

  const romanGrammarSignals = [
    "mujhe",
    "mujhy",
    "mry",
    "meri",
    "mera",
    "mere",
    "aap",
    "ap",
    "tum",
    "tumhara",
    "kya",
    "kia",
    "hai",
    "hain",
    "ho",
    "kr",
    "kro",
    "karo",
    "karna",
    "batao",
    "btao",
    "dikhao",
    "dikhado",
    "kis",
    "ny",
    "ne",
    "kon",
    "kaun",
    "iss",
    "is",
    "ye",
    "yeh",
    "unka",
    "unki",
    "unke",
    "ko",
    "se",
    "ka",
    "ki",
    "ke",
    "par",
    "pe",
    "yaar",
    "yr",
    "buht",
    "bohat",
    "zyada",
    "nahi",
    "ni",
    "aaj",
    "kal",
    "baje",
  ];

  const romanGrammarMatches =
    words.filter((word) =>
      romanGrammarSignals.includes(word)
    ).length;

  const hasRomanUrdu =
    romanPhraseMatches > 0 ||
    romanGrammarMatches >= 1;

  const hasEnglish =
    englishMatches > 0;

  if (hasRomanUrdu && hasEnglish) {
    return "mixed";
  }

  if (hasRomanUrdu) {
    return "roman-urdu";
  }

  return "english";
}

/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,]+$/g, "")
    .replace(/\s+/g, " ");
}

function containsAny(
  text: string,
  words: string[]
): boolean {
  return words.some((word) =>
    text.includes(word)
  );
}








function p5SchedulePreviousTasks(
  memoryKey: string
) {
  const tasks =
    p5ResolveReferencedTasks(
      memoryKey
    );

  const scheduledTasks:
    P5Task[] = [];

  const now =
    new Date();

  const tomorrow =
    new Date(now);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  tomorrow.setHours(
    10,
    0,
    0,
    0
  );

  for (const task of tasks) {
    if (
      task.status ===
        "completed" ||
      task.status ===
        "cancelled"
    ) {
      continue;
    }

    try {
      const updated =
        updateTask(
          task.id,
          {
            dueDate:
              tomorrow.toISOString(),
            updatedAt:
              new Date().toISOString(),
          }
        );

      if (updated) {
        scheduledTasks.push(
          updated as P5Task
        );
      }
    } catch {
      // Continue with remaining tasks.
    }
  }

  p5StoreScheduledTaskMemory(
    memoryKey,
    scheduledTasks
  );

  return {
    tasks,
    scheduledTasks,
  };
}
function p5IsCreateForPreviousRequest(
  text?: string
): boolean {
  const value =
    p5Normalize(text);

  const create =
    value.includes("create") ||
    value.includes("make") ||
    value.includes("add") ||
    value.includes("banao") ||
    value.includes("banado") ||
    value.includes("bana do") ||
    value.includes("create karo") ||
    value.includes("create kro");

  const reference =
    value.includes("them") ||
    value.includes("those") ||
    value.includes("these") ||
    value.includes("unko") ||
    value.includes("unhain") ||
    value.includes("un ko") ||
    value.includes("inko") ||
    value.includes("in ko");

  const task =
    value.includes("task") ||
    value.includes("tasks") ||
    value.includes("follow-up") ||
    value.includes("follow up") ||
    value.includes("followup");

  return (
    create &&
    reference &&
    task
  );
}

function p5IsSchedulePreviousRequest(
  text?: string
): boolean {
  const value =
    p5Normalize(text);

  const schedule =
    value.includes("schedule") ||
    value.includes("tomorrow") ||
    value.includes("kal") ||
    value.includes("set for") ||
    value.includes("make those") ||
    value.includes("kar do") ||
    value.includes("kr do");

  const reference =
    value.includes("them") ||
    value.includes("those") ||
    value.includes("these") ||
    value.includes("unko") ||
    value.includes("unhain") ||
    value.includes("un ko") ||
    value.includes("inko") ||
    value.includes("in ko");

  const followUp =
    value.includes("follow-up") ||
    value.includes("follow up") ||
    value.includes("followup");

  return (
    schedule &&
    reference &&
    followUp
  );
}
/* =========================================================
   NATURAL CONVERSATION
   ========================================================= */

function isGreeting(text: string): boolean {
  return /^(hi|hello|hey|hy|helo|salam|aoa|assalamualaikum|assalam o alaikum|good morning|good afternoon|good evening)[!. ]*$/i.test(
    text.trim()
  );
}

function isHowAreYou(text: string): boolean {
  return containsAny(
    normalize(text),
    [
      "how are you",
      "how r you",
      "how are u",
      "how r u",
      "kaise ho",
      "kaisay ho",
      "kesi ho",
      "kesy ho",
      "kya haal hai",
      "haal kya hai",
    ]
  );
}

function isWhatAreYou(text: string): boolean {
  const value = normalize(text);

  const identityPatterns = [
    /\bwhat are you\b/,
    /\bwhat r you\b/,
    /\bwhat are u\b/,
    /\bwhat is nexaflow\b/,
    /\bwhat's nexaflow\b/,
    /\bwhat is this\b/,
    /\bwhat is this app\b/,
    /\bwhat is this project\b/,
    /\bwhat is this platform\b/,
    /\bwho are you\b/,
    /\bwho r you\b/,
    /\bwho r u\b/,
    /\bwho are u\b/,
    /\btum kon ho\b/,
    /\btum kaun ho\b/,
    /\baap kon ho\b/,
    /\baap kaun ho\b/,
    /\bye kya hai\b/,
    /\bye kia hai\b/,
    /\bnexaflow kya hai\b/,
    /\bnexaflow kia hai\b/,
  ];

  const creatorPatterns = [
    "who created",
    "who create",
    "who made",
    "who make",
    "who built",
    "who build",
    "who developed",
    "who develop",
    "who designed",
    "who design",
    "who is your creator",
    "who is the creator",
    "who is behind",
    "kis ne banaya",
    "kis ny banaya",
    "kis ne banai",
    "kis ny banai",
    "kis ne create",
    "kis ny create",
    "kis ne develop",
    "kis ny develop",
    "kis ne design",
    "kis ny design",
  ];

  if (containsAny(value, creatorPatterns)) {
    return false;
  }

  return identityPatterns.some(
    (pattern) => pattern.test(value)
  );
}

function isCapabilitiesQuestion(
  text: string
): boolean {
  const value = normalize(text);

  return containsAny(
    value,
    [
      "what do you do",
      "what can you do",
      "what are your capabilities",
      "what can u do",
      "tum kya kartay ho",
      "tum kya karte ho",
      "aap kya karte ho",
      "aap kya krty ho",
      "kya kya kar sakty ho",
      "kya kya karte ho",
    ]
  );
}

/* =========================================================
   CREATOR / PROJECT / FAIZA
   ========================================================= */

function isCreatorQuestion(
  text: string
): boolean {
  const value = normalize(text);

  const patterns = [
    /\bwho created (you|this|this project|nexaflow)\b/,
    /\bwho made (you|this|this project|nexaflow)\b/,
    /\bwho built (you|this|this project|nexaflow)\b/,
    /\bwho developed (you|this|this project|nexaflow)\b/,
    /\bwho designed (you|this|this project|nexaflow)\b/,
    /\bwho is your creator\b/,
    /\bwho is the creator\b/,
    /\bwho is behind (you|this|this project|nexaflow)\b/,
    /\bwho made this app\b/,
    /\bwho created this app\b/,
    /\bwho built this app\b/,
    /\bwho developed this app\b/,
    /\bwho made this website\b/,
    /\bwho created this website\b/,
    /\bwho built this website\b/,
    /\bwho developed this website\b/,
    /\bcreator of nexaflow\b/,
    /\bdeveloper of nexaflow\b/,
    /\bdeveloper behind nexaflow\b/,
    /\bcreator behind nexaflow\b/,
    /\byou were created by who\b/,
    /\bthis was made by who\b/,
    /\bnexaflow was built by who\b/,
    /\bcreated by whom\b/,
    /\bmade by whom\b/,
    /\bbuilt by whom\b/,
    /\bdeveloped by whom\b/,

    /\btumhein kis ne banaya\b/,
    /\btumhe kis ne banaya\b/,
    /\btum ko kis ne banaya\b/,
    /\btumko kis ne banaya\b/,
    /\btumhein kis ny banaya\b/,
    /\btumhe kis ny banaya\b/,
    /\btum ko kis ny banaya\b/,
    /\btumko kis ny banaya\b/,
    /\bye kis ne banaya\b/,
    /\bye kis ny banaya\b/,
    /\bye project kis ne banaya\b/,
    /\bye project kis ny banaya\b/,
    /\bis project ko kis ne banaya\b/,
    /\bis project ko kis ny banaya\b/,
    /\bis ka creator kon hai\b/,
    /\bis ka creator kaun hai\b/,
    /\bis project ka creator kon hai\b/,
    /\bis project ka creator kaun hai\b/,
    /\bis ka developer kon hai\b/,
    /\bis ka developer kaun hai\b/,
    /\bnexaflow kis ne banaya\b/,
    /\bnexaflow kis ny banaya\b/,
    /\bnexaflow kis ne create kiya\b/,
    /\bnexaflow kis ny create kiya\b/,
    /\bnexaflow kis ne develop kiya\b/,
    /\bnexaflow kis ny develop kiya\b/,
    /\bnexaflow kis ne design kiya\b/,
    /\bnexaflow kis ny design kiya\b/,
    /\bnexaflow ka creator kon hai\b/,
    /\bnexaflow ka creator kaun hai\b/,
    /\bnexaflow ka developer kon hai\b/,
    /\bnexaflow ka developer kaun hai\b/,

    /کس نے بنایا/,
    /کس نے بنائی/,
    /کس نے بنائے/,
    /کس نے تیار کیا/,
    /کس نے ڈویلپ کیا/,
    /کس نے ڈیولپ کیا/,
    /کس نے ڈیزائن کیا/,
    /کس نے کریئیٹ کیا/,
    /آپ کو کس نے بنایا/,
    /تمہیں کس نے بنایا/,
    /تم کو کس نے بنایا/,
    /یہ کس نے بنایا/,
    /یہ پروجیکٹ کس نے بنایا/,
    /اس پروجیکٹ کا کریئیٹر کون ہے/,
    /اس کا کریئیٹر کون ہے/,
    /اس کا ڈویلپر کون ہے/,
    /نیکسا فلو کس نے بنایا/,
  ];

  return patterns.some(
    (pattern) => pattern.test(value)
  );
}

function isProjectQuestion(
  text: string
): boolean {
  const value = normalize(text);

  return containsAny(
    value,
    [
      "tell me about this project",
      "tell me about nexaflow",
      "about this project",
      "about nexaflow",
      "what is this project",
      "what is the project",
      "explain this project",
      "explain nexaflow",
      "how does nexaflow work",
      "how does this work",
      "project details",
      "project information",
      "nexaflow details",
      "nexaflow ka batao",
      "nexaflow k bary",
      "nexaflow ke bary",
      "nexaflow kay bary",
      "project k bary",
      "project ke bary",
      "project kay bary",
      "is project ka batao",
      "ye project kya hai",
      "ye project kis liye",
    ]
  );
}

function isFaizaQuestion(
  text: string
): boolean {
  const value = normalize(text);

  return containsAny(
    value,
    [
      "tell me about faiza",
      "tell me about fizza",
      "about faiza",
      "about fizza",
      "who is faiza",
      "who is fizza",
      "faiza noor",
      "fizza noor",
      "tell me about me",
      "about me",
      "my information",
      "my profile",
      "meri information",
      "mery information",
      "meri profile",
      "mery profile",
      "mera intro",
      "meri details",
      "mery details",
      "mere bary",
      "mery bary",
      "mere bare",
      "mery bare",
      "mere baare",
      "mery baare",
      "what do you know about me",
      "what you know about me",
      "what do you know about faiza",
      "what you know about faiza",
      "faiza noor kon hai",
      "faiza noor kaun hai",
      "faiza kon hai",
      "fizza kon hai",
    ]
  );
}

/* =========================================================
   RESPONSES
   ========================================================= */

function getGreeting(
  language: ResponseLanguage
): string {
  if (language === "urdu") {
    return "السلام علیکم! 👋 میں NexaFlow AI ہوں۔ میں آپ کے business operations، leads، tasks، workflows اور automation کے ساتھ کام کرنے میں مدد کر سکتا ہوں۔";
  }

  if (language === "roman-urdu") {
    return "Assalamualaikum! 👋 Main NexaFlow AI hoon. Main aap ke leads, tasks, workflows, analytics aur business automation mein help kar sakta hoon. Batao, kya karna hai?";
  }

  if (language === "mixed") {
    return "Hey! 👋 Main NexaFlow AI hoon — your AI business operations assistant. Leads, tasks, workflows ya automation mein jo kaam karna ho, batao.";
  }

  return "Hi! 👋 I'm NexaFlow AI — your AI business operations assistant. I can help with leads, tasks, workflows, analytics and automation. What would you like to work on?";
}

function getHowAreYou(
  language: ResponseLanguage
): string {
  if (language === "urdu") {
    return "میں بالکل تیار ہوں۔ 😊 آپ NexaFlow کے بارے میں پوچھ سکتے ہیں، اپنے business data کو سمجھ سکتے ہیں، یا کوئی action مجھ سے کروا سکتے ہیں۔";
  }

  if (language === "roman-urdu") {
    return "Main bilkul ready hoon 😄 Aap NexaFlow ke bary mein pooch sakty hain ya apne workspace mein koi real action karwa sakty hain.";
  }

  if (language === "mixed") {
    return "I'm doing great 😄 Aur main ready hoon to work with your NexaFlow workspace. Leads, tasks, workflows ya automation — jo chahiye bolo.";
  }

  return "I'm doing great and ready to help. 😄 You can ask me about NexaFlow, your workspace, leads, tasks, workflows, analytics, or automation.";
}

function getWhatAreYou(
  language: ResponseLanguage
): string {
  if (language === "urdu") {
    return "میں NexaFlow AI ہوں — ایک AI-powered business operations assistant جو natural language کو سمجھ کر leads، tasks، workflows، analytics اور automation کے ساتھ کام کرنے کے لیے بنایا گیا ہے۔";
  }

  if (language === "roman-urdu") {
    return "Main NexaFlow AI hoon — aik AI-powered business operations assistant jo natural language samajh kar leads, tasks, workflows, analytics aur automation ke sath kaam karta hai.";
  }

  if (language === "mixed") {
    return "I'm NexaFlow AI — an AI-powered business operations assistant. Main natural language ko understand karke leads, tasks, workflows, analytics aur automation ke sath work kar sakta hoon.";
  }

  return "I'm NexaFlow AI — an AI-powered business operations assistant built to understand natural-language requests and work with leads, tasks, workflows, analytics and automation.";
}

function getCapabilities(
  language: ResponseLanguage
): string {
  if (language === "urdu") {
    return `میں صرف سوالوں کے جواب دینے کے لیے نہیں بنایا گیا۔ میں آپ کے business operations کے ساتھ کام کرنے کے لیے بنایا گیا ہوں۔

میں:

• leads کو سمجھ اور organize کر سکتا ہوں
• tasks create اور manage کر سکتا ہوں
• workflows کو سمجھ اور supported actions execute کر سکتا ہوں
• business activity summarize کر سکتا ہوں
• analytics اور performance کو explain کر سکتا ہوں
• customer-support requests analyze کر سکتا ہوں
• follow-ups plan کر سکتا ہوں
• natural-language business commands کو actionable operations میں تبدیل کر سکتا ہوں

یعنی مقصد صرف chat نہیں — AI کو business operations کا interface بنانا ہے۔`;
  }

  if (language === "roman-urdu") {
    return `Main sirf questions ke answers dene ke liye nahi bana. Main business operations ke sath actual kaam karne ke liye bana hoon.

Main:

• leads ko samajh aur organize kar sakta hoon
• tasks create aur manage kar sakta hoon
• workflows ko samajh aur supported actions run kar sakta hoon
• business activity summarize kar sakta hoon
• analytics aur performance explain kar sakta hoon
• customer-support requests analyze kar sakta hoon
• follow-ups plan kar sakta hoon
• natural language commands ko actionable operations mein convert kar sakta hoon

Yani goal sirf chatbot hona nahi — AI ko business operations ka interface banana hai.`;
  }

  return `NexaFlow AI is designed as more than a chatbot.

It can:

• understand and organize leads
• create and manage tasks
• understand and execute supported workflow actions
• summarize business activity
• explain analytics and performance
• analyze customer-support requests
• plan follow-ups
• turn natural-language business requests into actionable operations

The goal is to make AI an operational interface for a business, not just a question-answering layer.`;
}

function getCreatorResponse(
  language: ResponseLanguage
): string {
  if (language === "urdu") {
    return `NexaFlow AI کو **Faiza Noor** نے design اور develop کیا ہے۔

Faiza ایک Full-Stack Web Engineer اور MS Office Specialist ہیں، جن کا focus modern full-stack web applications، AI-powered products اور business automation پر ہے۔

ان کی core technologies میں React، Next.js، TypeScript، JavaScript، Node.js، Express، MongoDB، PostgreSQL/SQL، Tailwind CSS، Framer Motion، REST APIs، authentication، Git/GitHub اور modern deployment platforms شامل ہیں۔

NexaFlow AI ان کے AI SaaS، automation اور product engineering capabilities کو demonstrate کرنے والا flagship project ہے۔

Portfolio:
https://faiza-noor10.vercel.app/`;
  }

  if (language === "roman-urdu") {
    return `NexaFlow AI ko **Faiza Noor** ne design aur develop kiya hai.

Faiza aik Full-Stack Web Engineer aur MS Office Specialist hain, jinka focus modern full-stack applications, AI-powered products aur business automation par hai.

Unki core technologies mein React, Next.js, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL/SQL, Tailwind CSS, Framer Motion, REST APIs, authentication, Git/GitHub aur modern deployment platforms shamil hain.

NexaFlow AI unki AI SaaS, automation aur product engineering capabilities ko demonstrate karne wala flagship project hai.

Portfolio:
https://faiza-noor10.vercel.app/`;
  }

  return `NexaFlow AI was designed and developed by **Faiza Noor**.

Faiza Noor is a Full-Stack Web Engineer and MS Office Specialist focused on modern full-stack applications, AI-powered products and business automation.

Her core stack includes React, Next.js, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL/SQL, Tailwind CSS, Framer Motion, REST APIs, authentication, Git/GitHub and modern deployment platforms.

NexaFlow AI is a flagship demonstration of her AI SaaS, automation and product-engineering capabilities.

Portfolio:
https://faiza-noor10.vercel.app/`;
}

function getProjectResponse(
  language: ResponseLanguage
): string {
  if (language === "urdu") {
    return `NexaFlow AI ایک modern AI-powered SaaS platform ہے جسے business operations کو زیادہ intelligent اور automated بنانے کے لیے بنایا گیا ہے۔

اس کا core idea یہ ہے کہ user صرف natural language میں بتائے کہ اسے کیا چاہیے، اور AI اس request کو سمجھ کر relevant business operation یا automation میں تبدیل کرے۔

Platform میں AI assistance، workflow automation، lead management، task management، analytics، activity tracking، customer-support intelligence اور workflow execution جیسے capabilities شامل ہیں۔

اس project کی خاص بات صرف اس کا interface نہیں بلکہ اس کی product thinking ہے: AI کو ایک simple chatbot کے بجائے business operations کا control layer بنانا۔

NexaFlow AI کو **Faiza Noor** نے design اور develop کیا ہے۔

Portfolio:
https://faiza-noor10.vercel.app/`;
  }

  if (language === "roman-urdu") {
    return `NexaFlow AI aik modern AI-powered SaaS platform hai jo business operations ko intelligent aur automated banane ke liye build kiya gaya hai.

Is ka core idea ye hai ke user sirf natural language mein bataye ke usay kya chahiye, aur AI us request ko samajh kar relevant business operation ya automation mein convert kare.

Platform mein AI assistance, workflow automation, lead management, task management, analytics, activity tracking, customer-support intelligence aur workflow execution jaisi capabilities hain.

Is project ki real strength sirf UI nahi, balkay product thinking hai: AI ko simple chatbot ke bajaye business operations ka control layer banana.

NexaFlow AI ko **Faiza Noor** ne design aur develop kiya hai.

Portfolio:
https://faiza-noor10.vercel.app/`;
  }

  return `NexaFlow AI is a modern AI-powered SaaS platform built to make business operations more intelligent and automated.

The core idea is simple: users can describe what they need in natural language, and the AI can understand the request and turn it into a relevant business operation or automation.

The platform brings together AI assistance, workflow automation, lead management, task management, analytics, activity tracking, customer-support intelligence and workflow execution.

Its key product idea is to make AI an operational control layer for a business rather than simply another chatbot.

NexaFlow AI was designed and developed by **Faiza Noor**.

Portfolio:
https://faiza-noor10.vercel.app/`;
}

function getFaizaResponse(
  language: ResponseLanguage
): string {
  if (language === "roman-urdu") {
    return `Faiza Noor aik Full-Stack Web Engineer hain jo modern web applications, AI-powered SaaS aur automation systems build karti hain.

Unka technical focus React, Next.js, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL/SQL, Tailwind CSS, Framer Motion, REST APIs, authentication, CRUD systems aur Git/GitHub par hai.

Unke paas 1+ year ka web development experience hai aur woh independent full-stack development aur AI-assisted product development par focus karti hain.

Portfolio:
https://faiza-noor10.vercel.app/

LinkedIn:
https://www.linkedin.com/in/faiza-noor-b2711b42b

GitHub:
https://github.com/fizzanoor051-arch`;
  }

  if (language === "urdu") {
    return `Faiza Noor ایک Full-Stack Web Engineer ہیں جو modern web applications، AI-powered SaaS اور automation systems پر کام کرتی ہیں۔

ان کی technical focus React، Next.js، TypeScript، JavaScript، Node.js، Express، MongoDB، PostgreSQL/SQL، Tailwind CSS، Framer Motion، REST APIs، authentication، CRUD systems اور Git/GitHub پر ہے۔

ان کے پاس 1+ year کا web development experience ہے اور وہ independent full-stack اور AI-assisted product development پر focus کرتی ہیں۔

Portfolio:
https://faiza-noor10.vercel.app/

LinkedIn:
https://www.linkedin.com/in/faiza-noor-b2711b42b

GitHub:
https://github.com/fizzanoor051-arch`;
  }

  return `Faiza Noor is a Full-Stack Web Engineer focused on modern web applications, AI-powered SaaS and automation systems.

Her technical focus includes React, Next.js, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL/SQL, Tailwind CSS, Framer Motion, REST APIs, authentication, CRUD systems and Git/GitHub.

She has 1+ year of web development experience and focuses on independent full-stack development and AI-assisted product development.

Portfolio:
https://faiza-noor10.vercel.app/

LinkedIn:
https://www.linkedin.com/in/faiza-noor-b2711b42b

GitHub:
https://github.com/fizzanoor051-arch`;
}

/* =========================================================
   CUSTOMER SUPPORT ANALYSIS
   ========================================================= */

function analyzeCustomerSupport(
  text: string
): DemoAnalysis | null {
  const lower = text.toLowerCase();

  const refundWords = [
    "refund",
    "money back",
    "return my money",
    "want my money",
    "chargeback",
    "reimbursement",
    "charged",
    "charged me",
  ];

  const supportWords = [
    "support",
    "help",
    "issue",
    "problem",
    "complaint",
    "customer service",
    "not working",
    "doesn't work",
    "cant use",
    "can't use",
  ];

  const frustratedWords = [
    "waiting",
    "10 days",
    "days",
    "nobody",
    "no one",
    "still",
    "again",
    "frustrated",
    "angry",
    "disappointed",
    "unacceptable",
    "terrible",
    "ridiculous",
    "ignored",
    "not helping",
    "not helping me",
  ];

  const negativeWords = [
    "bad",
    "worst",
    "hate",
    "awful",
    "terrible",
    "angry",
    "unacceptable",
  ];

  const hasRefundIntent =
    refundWords.some((word) =>
      lower.includes(word)
    );

  const hasSupportIntent =
    supportWords.some((word) =>
      lower.includes(word)
    );

  const hasFrustration =
    frustratedWords.some((word) =>
      lower.includes(word)
    );

  const hasNegative =
    negativeWords.some((word) =>
      lower.includes(word)
    );

  if (!hasRefundIntent && !hasSupportIntent) {
    return null;
  }

  let sentiment: DemoAnalysis["sentiment"] =
    "Neutral";

  if (hasFrustration) {
    sentiment = "Frustrated";
  } else if (hasNegative) {
    sentiment = "Negative";
  }

  const priority: DemoAnalysis["priority"] =
    hasRefundIntent || hasFrustration
      ? "High"
      : hasSupportIntent
        ? "Medium"
        : "Low";

  if (hasRefundIntent) {
    return {
      intent: "Refund Request",
      sentiment,
      priority,
      confidence: hasFrustration ? 97 : 94,
      actions: [
        "Detect refund intent",
        "Analyze customer sentiment",
        "Generate a helpful response",
        "Create a support follow-up task",
        "Track the refund request",
      ],
      response: `I detected a refund request and analyzed the customer's emotional state.

Intent: Refund Request

Sentiment: ${sentiment}

Priority: ${priority}

Recommended action:

Offer a clear refund response and create a support follow-up task so the request is not lost.`,
      suggestedReply:
        "I'm sorry you've had to wait this long. I understand how frustrating that is. I'll make sure your refund request is reviewed and followed up on promptly.",
      recommendedAction:
        "Offer refund + create support task",
      actionType: "refund",
    };
  }

  return {
    intent: "Customer Support Request",
    sentiment,
    priority,
    confidence: hasFrustration ? 94 : 91,
    actions: [
      "Classify the customer request",
      "Analyze customer sentiment",
      "Generate a suggested response",
      "Create a support follow-up task",
      "Track the interaction",
    ],
    response: `I analyzed this customer support request.

Intent: Customer Support Request

Sentiment: ${sentiment}

Priority: ${priority}

Recommended action:

Respond to the customer and create a support follow-up task when human assistance is required.`,
    suggestedReply:
      "Thanks for reaching out. I'm sorry you're experiencing this issue. I'll review your request and make sure the appropriate next step is taken.",
    recommendedAction:
      "Respond + create support task",
    actionType: "support",
  };
}

/* =========================================================
   BUSINESS REQUEST ANALYSIS
   ========================================================= */

function analyzeRequest(
  message: string
): DemoAnalysis {
  const text =
    message.toLowerCase().trim();

  if (
    /\b(create|make|add|set up)\b.*\btask\b/i.test(
      text
    ) ||
    /\bfollow[- ]?up task\b/i.test(
      text
    ) ||
    /\btask\b.*\b(banao|bana do|banado|create karo|create kro)\b/i.test(
      text
    )
  ) {
    return {
      intent: "Task automation",
      sentiment: "Neutral",
      priority:
        text.includes("urgent") ||
        text.includes("asap")
          ? "High"
          : "Medium",
      confidence: 99,
      actions: [
        "Understand the task request",
        "Extract task details",
        "Create the task",
        "Track task status",
      ],
      response:
        "I can create this task and track it in your NexaFlow workspace.",
    };
  }

  const customerAnalysis =
    analyzeCustomerSupport(text);

  if (customerAnalysis) {
    return customerAnalysis;
  }

  if (
    text.includes("lead") ||
    text.includes("prospect") ||
    text.includes("potential customer") ||
    text.includes("qualification")
  ) {
    return {
      intent:
        "Lead management automation",
      sentiment: "Neutral",
      priority: "High",
      confidence: 96,
      actions: [
        "Extract lead information",
        "Classify lead quality",
        "Assign lead priority",
        "Create a follow-up task",
        "Store the lead for future tracking",
      ],
      response:
        "I identified this as a lead management request.",
    };
  }

  if (
    text.includes("follow up") ||
    text.includes("follow-up") ||
    text.includes("followup") ||
    text.includes("remind")
  ) {
    return {
      intent:
        "Follow-up automation",
      sentiment: "Neutral",
      priority: "Medium",
      confidence: 95,
      actions: [
        "Identify the customer or lead",
        "Create a follow-up task",
        "Assign a due date",
        "Track completion status",
      ],
      response:
        "I identified this as a follow-up automation request.",
    };
  }

  if (
    text.includes("task") ||
    text.includes("to-do") ||
    text.includes("todo") ||
    text.includes("assign")
  ) {
    return {
      intent: "Task automation",
      sentiment: "Neutral",
      priority: "Medium",
      confidence: 94,
      actions: [
        "Understand the requested task",
        "Create a structured task",
        "Assign priority",
        "Track task status",
      ],
      response:
        "I identified this as a task-management request.",
    };
  }

  if (
    text.includes("sales") ||
    text.includes("sell") ||
    text.includes("selling") ||
    text.includes("conversion")
  ) {
    return {
      intent: "Sales automation",
      sentiment: "Neutral",
      priority: "High",
      confidence: 95,
      actions: [
        "Capture potential opportunities",
        "Qualify prospects",
        "Create follow-up tasks",
        "Track sales activity",
      ],
      response:
        "I identified this as a sales automation request.",
    };
  }

  if (
    text.includes("analytics") ||
    text.includes("report") ||
    text.includes("activity") ||
    text.includes("summary") ||
    text.includes("performance")
  ) {
    return {
      intent: "Business analytics",
      sentiment: "Neutral",
      priority: "Medium",
      confidence: 93,
      actions: [
        "Collect workspace activity",
        "Summarize important events",
        "Identify trends",
        "Present actionable insights",
      ],
      response:
        "I identified this as a business analytics request.",
    };
  }

  if (
    text.includes("automate") ||
    text.includes("automation") ||
    text.includes("workflow") ||
    text.includes("process")
  ) {
    return {
      intent:
        "Workflow automation",
      sentiment: "Neutral",
      priority: "High",
      confidence: 95,
      actions: [
        "Understand the business process",
        "Break the process into steps",
        "Define triggers and actions",
        "Create an automation workflow",
        "Track execution history",
      ],
      response:
        "I identified this as a workflow automation request.",
    };
  }

  return {
    intent:
      "Business automation planning",
    sentiment: "Neutral",
    priority: "Medium",
    confidence: 88,
    actions: [
      "Understand the business request",
      "Identify the required information",
      "Recommend automation steps",
      "Create a task or workflow",
      "Track the result",
    ],
    response:
      "I understand the request as a business-operations question. Tell me what you want to accomplish, and I can help turn it into a practical NexaFlow workflow, task or automation.",
  };
}

/* =========================================================
   P3 — LEAD INTELLIGENCE
   ========================================================= */

function isLeadReadRequest(
  text: string
): boolean {
  const value = normalize(text);

  const hasLead =
    value.includes("lead") ||
    value.includes("leads") ||
    value.includes("prospect") ||
    value.includes("prospects");

  const hasReadIntent =
    value.includes("show") ||
    value.includes("list") ||
    value.includes("find") ||
    value.includes("get") ||
    value.includes("give") ||
    value.includes("tell") ||
    value.includes("dikhao") ||
    value.includes("dikhado") ||
    value.includes("batao") ||
    value.includes("dekhao") ||
    value.includes("kon kon");

  return hasLead && hasReadIntent;
}

function extractLeadPriority(
  text: string
): "high" | "medium" | "low" | undefined {
  const value = normalize(text);

  if (
    value.includes("high priority") ||
    value.includes("high-priority")
  ) {
    return "high";
  }

  if (
    value.includes("medium priority") ||
    value.includes("medium-priority")
  ) {
    return "medium";
  }

  if (
    value.includes("low priority") ||
    value.includes("low-priority")
  ) {
    return "low";
  }

  return undefined;
}

function extractLeadStatus(
  text: string
): "new" | "contacted" | "qualified" | undefined {
  const value = normalize(text);

  if (
    value.includes("qualified") ||
    value.includes("qualify")
  ) {
    return "qualified";
  }

  if (value.includes("contacted")) {
    return "contacted";
  }

  if (
    value.includes("new leads") ||
    value.includes("new lead")
  ) {
    return "new";
  }

  return undefined;
}

function isThisWeek(
  text: string
): boolean {
  const value = normalize(text);

  return (
    value.includes("this week") ||
    value.includes("iss week") ||
    value.includes("is week") ||
    value.includes("this haftay") ||
    value.includes("iss haftay") ||
    value.includes("is haftay")
  );
}

function isToday(
  text: string
): boolean {
  const value = normalize(text);

  return (
    value.includes("today") ||
    value.includes("aaj")
  );
}

function getStartOfWeek(
  date: Date
): Date {
  const result = new Date(date);

  const day = result.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function getStartOfToday(
  date: Date
): Date {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function readRealLeads(
  message: string
): LeadLike[] {
  const leads =
    getLeads() as LeadLike[];

  const priority =
    extractLeadPriority(message);

  const status =
    extractLeadStatus(message);

  const thisWeek =
    isThisWeek(message);

  const today =
    isToday(message);

  const now =
    new Date();

  const weekStart =
    getStartOfWeek(now);

  const todayStart =
    getStartOfToday(now);

  const filtered =
    leads.filter(
      (lead) => {
        if (
          priority &&
          lead.priority !== priority
        ) {
          return false;
        }

        if (
          status &&
          lead.status !== status
        ) {
          return false;
        }

        if (
          (thisWeek || today) &&
          lead.createdAt
        ) {
          const created =
            new Date(
              lead.createdAt
            );

          if (
            thisWeek &&
            created < weekStart
          ) {
            return false;
          }

          if (
            today &&
            created < todayStart
          ) {
            return false;
          }
        }

        return true;
      }
    );

  const rank: Record<
    string,
    number
  > = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...filtered].sort(
    (a, b) =>
      (rank[b.priority || "low"] || 0) -
      (rank[a.priority || "low"] || 0)
  );
}

function formatLeadList(
  leads: LeadLike[],
  language: ResponseLanguage
): string {
  if (leads.length === 0) {
    if (language === "roman-urdu") {
      return "Is filter ke mutabiq koi lead nahi mili.";
    }

    if (language === "urdu") {
      return "اس filter کے مطابق کوئی lead نہیں ملی۔";
    }

    return "I couldn't find any leads matching that filter.";
  }

  const lines =
    leads.map(
      (lead, index) => {
        const details = [
          lead.priority
            ? lead.priority
                .charAt(0)
                .toUpperCase() +
              lead.priority.slice(1)
            : "",
          lead.status
            ? lead.status
                .charAt(0)
                .toUpperCase() +
              lead.status.slice(1)
            : "",
        ].filter(Boolean);

        return `${index + 1}. ${
          lead.name || "Unnamed lead"
        }${
          details.length
            ? ` — ${details.join(" · ")}`
            : ""
        }`;
      }
    );

  if (language === "roman-urdu") {
    return `Mujhe ${leads.length} matching lead${
      leads.length === 1
        ? ""
        : "s"
    } mili hain:\n\n${lines.join(
      "\n"
    )}`;
  }

  if (language === "urdu") {
    return `مجھے ${leads.length} matching leads ملی ہیں:\n\n${lines.join(
      "\n"
    )}`;
  }

  return `I found ${leads.length} matching lead${
    leads.length === 1
      ? ""
      : "s"
  }:\n\n${lines.join("\n")}`;
}

/* =========================================================
   P3 — PREVIOUS RESULT MEMORY
   ========================================================= */

function isReferenceToPreviousResults(
  text: string
): boolean {
  const value =
    normalize(text);

  return (
    value.includes("all of them") ||
    value.includes("all them") ||
    value.includes("those leads") ||
    value.includes("these leads") ||
    value.includes("those") ||
    value.includes("these") ||
    value.includes("un sab") ||
    value.includes("saray") ||
    value.includes("sari") ||
    value.includes("sab ko") ||
    value.includes("unko") ||
    value.includes("inko")
  );
}

function getPreviousLeadNames(
  messages: ChatMessage[]
): string[] {
  const assistantMessages =
    messages
      .filter(
        (message) =>
          message.role ===
          "assistant"
      )
      .map(
        (message) =>
          message.content
      )
      .reverse();

  for (
    const content of assistantMessages
  ) {
    const lines =
      content.split("\n");

    const names: string[] = [];

    for (
      const line of lines
    ) {
      const match =
        line.match(
          /^\s*\d+\.\s+(.+?)(?:\s+—|$)/
        );

      if (match?.[1]) {
        names.push(
          match[1].trim()
        );
      }
    }

    if (names.length > 0) {
      return names;
    }
  }

  return [];
}

function getPreviousLeads(
  messages: ChatMessage[]
): LeadLike[] {
  const names =
    getPreviousLeadNames(
      messages
    );

  if (names.length === 0) {
    return [];
  }

  const leads =
    getLeads() as LeadLike[];

  const normalizedNames =
    names.map((name) =>
      normalize(name)
    );

  return leads.filter(
    (lead) =>
      lead.name &&
      normalizedNames.includes(
        normalize(lead.name)
      )
  );
}

/* =========================================================
   P3 — PREVIOUS CREATED TASK MEMORY
   ========================================================= */

function getPreviousCreatedTaskIds(
  messages: ChatMessage[]
): string[] {
  const assistantMessages =
    messages
      .filter(
        (message) =>
          message.role ===
          "assistant"
      )
      .map(
        (message) =>
          message.content
      )
      .reverse();

  for (
    const content of assistantMessages
  ) {
    const matches =
      content.match(
        /task-ai-followup-[a-zA-Z0-9-]+/g
      );

    if (
      matches &&
      matches.length > 0
    ) {
      return [
        ...new Set(matches),
      ];
    }
  }

  return [];
}

function getPreviousCreatedTasks(
  messages: ChatMessage[]
): TaskLike[] {
  const ids =
    getPreviousCreatedTaskIds(
      messages
    );

  if (ids.length === 0) {
    return [];
  }

  const tasks =
    getTasks() as TaskLike[];

  const idSet =
    new Set(ids);

  return tasks.filter(
    (task) =>
      idSet.has(task.id)
  );
}

/* =========================================================
   P3 — BULK FOLLOW-UP
   ========================================================= */

function isBulkFollowUpRequest(
  text: string
): boolean {
  const value =
    normalize(text);

  const followUp =
    value.includes("follow up") ||
    value.includes("follow-up") ||
    value.includes("followup") ||
    value.includes("follow up task");

  const multiple =
    value.includes("all of them") ||
    value.includes("all them") ||
    value.includes("those leads") ||
    value.includes("these leads") ||
    value.includes("all leads") ||
    value.includes("un sab") ||
    value.includes("saray") ||
    value.includes("sari") ||
    value.includes("sab ko");

  const taskIntent =
    value.includes("task") ||
    value.includes("tasks") ||
    value.includes("create") ||
    value.includes("make") ||
    value.includes("add") ||
    value.includes("banao") ||
    value.includes("banado") ||
    value.includes("bana do") ||
    value.includes("create karo") ||
    value.includes("create kro");

  return (
    followUp &&
    multiple &&
    taskIntent
  );
}

function createBulkFollowUpTasks(
  leads: LeadLike[],
  language: ResponseLanguage
) {
  if (leads.length === 0) {
    return {
      count: 0,
      tasks: [],
      message:
        language === "roman-urdu"
          ? "Previous result mein koi lead nahi mili jinke liye follow-up tasks create kar sakun."
          : language === "urdu"
            ? "پچھلے result میں کوئی ایسی lead نہیں ملی جس کے لیے follow-up tasks create کیے جا سکیں۔"
            : "I couldn't find the previous leads to create follow-up tasks for.",
    };
  }

  const existingTasks =
    getTasks() as TaskLike[];

  const now =
    new Date().toISOString();

  const createdTasks: TaskLike[] = [];

  for (const lead of leads) {
    const alreadyExists =
      existingTasks.some(
        (task) =>
          task.title ===
            "Follow-up" &&
          task.leadId ===
            lead.id &&
          task.status !==
            "completed" &&
          task.status !==
            "cancelled"
      );

    if (alreadyExists) {
      continue;
    }

    const created =
      createTask({
        id: `task-ai-followup-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

        title: "Follow-up",

        description: `Follow-up task for ${
          lead.name || "lead"
        }.`,

        priority:
          lead.priority === "high"
            ? "high"
            : lead.priority ===
                "medium"
              ? "medium"
              : "low",

        status: "pending",

        createdAt: now,

        updatedAt: now,

        leadId: lead.id,
      });

    createdTasks.push(
      created as TaskLike
    );
  }

  const names =
    leads.map(
      (lead) =>
        lead.name ||
        "Unnamed lead"
    );

  if (createdTasks.length === 0) {
    const message =
      language === "roman-urdu"
        ? `In ${leads.length} leads ke liye follow-up tasks pehle se exist karte hain. Koi duplicate task create nahi kiya.`
        : language === "urdu"
          ? `${leads.length} leads کے لیے follow-up tasks پہلے سے موجود ہیں۔ کوئی duplicate task create نہیں کیا گیا۔`
          : `Follow-up tasks for these ${leads.length} leads already exist. No duplicate tasks were created.`;

    return {
      count: 0,
      tasks: [],
      message,
    };
  }

  if (language === "roman-urdu") {
    return {
      count: createdTasks.length,
      tasks: createdTasks,
      message: `Done ✅ ${createdTasks.length} follow-up ${
        createdTasks.length === 1
          ? "task"
          : "tasks"
      } actual workspace mein create kar diye hain.\n\nLeads: ${names.join(
        ", "
      )}`,
    };
  }

  if (language === "urdu") {
    return {
      count: createdTasks.length,
      tasks: createdTasks,
      message: `مکمل ✅ ${createdTasks.length} follow-up tasks actual workspace میں create کر دیے گئے ہیں۔\n\nLeads: ${names.join(
        "، "
      )}`,
    };
  }

  return {
    count: createdTasks.length,
    tasks: createdTasks,
    message: `Done ✅ ${createdTasks.length} follow-up ${
      createdTasks.length === 1
        ? "task has"
        : "tasks have"
    } been created in the actual workspace.\n\nLeads: ${names.join(
      ", "
    )}`,
  };
}

/* =========================================================
   P3 — DATE / TIME UNDERSTANDING
   ========================================================= */

function extractDueTime(
  text: string
): string | undefined {
  const englishMatch =
    text.match(
      /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i
    );

  const romanUrduMatch =
    text.match(
      /\b(\d{1,2})(?::(\d{2}))?\s*baje\b/i
    );

  const match =
    englishMatch ||
    romanUrduMatch;

  if (!match) {
    return undefined;
  }

  let hour =
    Number(match[1]);

  const minute =
    match[2]
      ? Number(match[2])
      : 0;

  const period =
    match[3]?.toLowerCase();

  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return undefined;
  }

  if (
    period === "pm" &&
    hour < 12
  ) {
    hour += 12;
  }

  if (
    period === "am" &&
    hour === 12
  ) {
    hour = 0;
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

function isScheduleRequest(
  text: string
): boolean {
  const value =
    normalize(text);

  const hasTomorrow =
    value.includes("tomorrow") ||
    value.includes("kal");

  const hasTime =
    extractDueTime(text) !==
    undefined;

  const schedulingLanguage =
    value.includes("schedule") ||
    value.includes("scheduled") ||
    value.includes("set") ||
    value.includes("move") ||
    value.includes("remind") ||
    value.includes("kar do") ||
    value.includes("krdo") ||
    value.includes("karna") ||
    value.includes("baje");

  return (
    hasTomorrow &&
    hasTime &&
    schedulingLanguage
  );
}

function buildTomorrowDateTime(
  time: string
): string {
  const [hour, minute] =
    time
      .split(":")
      .map(Number);

  const date =
    new Date();

  date.setDate(
    date.getDate() + 1
  );

  date.setHours(
    hour,
    minute,
    0,
    0
  );

  return date.toISOString();
}

function schedulePreviousCreatedTasks(
  messages: ChatMessage[],
  userMessage: string,
  language: ResponseLanguage
) {
  const time =
    extractDueTime(
      userMessage
    );

  if (!time) {
    return null;
  }

  const previousTasks =
    getPreviousCreatedTasks(
      messages
    );

  if (
    previousTasks.length === 0
  ) {
    return null;
  }

  const dueDate =
    buildTomorrowDateTime(
      time
    );

  const updatedTasks =
    previousTasks
      .map((task) => {
        const updated =
          updateTask(
            task.id,
            {
              dueDate,
            }
          );

        return (
          updated as TaskLike
        );
      })
      .filter(Boolean);

  const [hourText, minuteText] =
    time.split(":");

  const hourNumber =
    Number(hourText);

  const minuteTextFormatted =
    minuteText === "00"
      ? ""
      : `:${minuteText}`;

  const displayHour =
    hourNumber > 12
      ? hourNumber - 12
      : hourNumber === 0
        ? 12
        : hourNumber;

  const ampm =
    hourNumber >= 12
      ? "PM"
      : "AM";

  const displayTime =
    `${displayHour}${minuteTextFormatted} ${ampm}`;

  if (
    language === "roman-urdu"
  ) {
    return {
      count:
        updatedTasks.length,
      tasks:
        updatedTasks,
      message: `Done ✅ ${updatedTasks.length} follow-up ${
        updatedTasks.length === 1
          ? "task"
          : "tasks"
      } kal ${displayTime} ke liye schedule kar diye hain.`,
    };
  }

  if (language === "urdu") {
    return {
      count:
        updatedTasks.length,
      tasks:
        updatedTasks,
      message: `مکمل ✅ ${updatedTasks.length} follow-up tasks کل ${displayTime} کے لیے schedule کر دیے گئے ہیں۔`,
    };
  }

  return {
    count:
      updatedTasks.length,
    tasks:
      updatedTasks,
    message: `Done ✅ ${updatedTasks.length} follow-up ${
      updatedTasks.length === 1
        ? "task is"
        : "tasks are"
    } scheduled for tomorrow at ${displayTime}.`,
  };
}

/* =========================================================
   P3 — COUNT / VERIFICATION
   ========================================================= */

function isTaskCountQuestion(
  text: string
): boolean {
  const value =
    normalize(text);

  return (
    value.includes(
      "how many did you create"
    ) ||
    value.includes(
      "how many tasks did you create"
    ) ||
    value.includes(
      "how many did you make"
    ) ||
    value.includes(
      "how many did you add"
    ) ||
    value.includes(
      "how many tasks"
    ) ||
    value.includes(
      "kitne create kiye"
    ) ||
    value.includes(
      "kitny create kiye"
    ) ||
    value.includes(
      "kitne tasks banaye"
    ) ||
    value.includes(
      "kitny tasks banaye"
    ) ||
    value.includes(
      "kitne task banaye"
    ) ||
    value.includes(
      "kitny task banaye"
    ) ||
    value.includes(
      "kitne banaye"
    ) ||
    value.includes(
      "kitny banaye"
    )
  );
}

function verifyPreviousCreatedTasks(
  messages: ChatMessage[],
  language: ResponseLanguage
) {
  const previousTasks =
    getPreviousCreatedTasks(
      messages
    );

  if (
    previousTasks.length === 0
  ) {
    const previousLeads =
      getPreviousLeads(
        messages
      );

    if (
      previousLeads.length === 0
    ) {
      return null;
    }

    const leadIds =
      new Set(
        previousLeads.map(
          (lead) => lead.id
        )
      );

    const tasks =
      getTasks() as TaskLike[];

    const matchingTasks =
      tasks.filter(
        (task) =>
          task.title ===
            "Follow-up" &&
          task.leadId &&
          leadIds.has(
            task.leadId
          )
      );

    if (
      matchingTasks.length ===
      0
    ) {
      return null;
    }

    if (
      language ===
      "roman-urdu"
    ) {
      return `Actual workspace verify karne ke baad **${matchingTasks.length} follow-up tasks** milay hain.`;
    }

    if (
      language ===
      "urdu"
    ) {
      return `Actual workspace verify کرنے کے بعد **${matchingTasks.length} follow-up tasks** ملے ہیں۔`;
    }

    return `I verified the actual workspace and found **${matchingTasks.length} follow-up tasks** for those leads.`;
  }

  const ids =
    new Set(
      previousTasks.map(
        (task) => task.id
      )
    );

  const currentTasks =
    getTasks() as TaskLike[];

  const matchingTasks =
    currentTasks.filter(
      (task) =>
        ids.has(task.id)
    );

  if (
    language ===
    "roman-urdu"
  ) {
    return `Actual workspace verify karne ke baad **${matchingTasks.length} follow-up tasks** create kiye gaye thay.`;
  }

  if (
    language ===
    "urdu"
  ) {
    return `Actual workspace verify کرنے کے بعد **${matchingTasks.length} follow-up tasks** create کیے گئے تھے۔`;
  }

  return `I verified the actual workspace: **${matchingTasks.length} follow-up tasks** were created.`;
}

/* =========================================================
   P3 — REAL LEAD RESPONSE
   ========================================================= */

function getLeadReadResponse(
  leads: LeadLike[],
  language: ResponseLanguage
): string {
  return formatLeadList(
    leads,
    language
  );
}
/* =========================================================
   P5 — CONVERSATION MEMORY
   REMEMBER → RESOLVE → ACT
   ========================================================= */

type P5MemoryType =
  | "lead_results"
  | "task_results"
  | "scheduled_tasks"
  | "other_leads"
  | "general";

type P5MemoryItem = {
  id: string;
  type: P5MemoryType;
  name?: string;
  leadId?: string;
  taskId?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
};

type P5ConversationMemory = {
  lastLeadResults: P5MemoryItem[];
  lastTaskResults: P5MemoryItem[];
  lastScheduledTasks: P5MemoryItem[];
  lastReferencedLeads: P5MemoryItem[];
  lastReferencedTasks: P5MemoryItem[];
  lastAction?: string;
  lastActionAt?: string;
};

/*
   Demo-mode conversation memory.

   IMPORTANT:
   This intentionally stays in server memory.
   It does not require Prisma or another database.

   Later, this same structure can be moved to:
   Redis / database / session storage.
*/

const p5MemoryStore =
  globalThis as typeof globalThis & {
    __nexaFlowConversationMemory?: Map<
      string,
      P5ConversationMemory
    >;
  };

if (!p5MemoryStore.__nexaFlowConversationMemory) {
  p5MemoryStore.__nexaFlowConversationMemory =
    new Map<string, P5ConversationMemory>();
}

const p5ConversationMemory =
  p5MemoryStore.__nexaFlowConversationMemory;

function p5GetMemoryKey(
  request: Request,
  userMessage?: string
): string {
  /*
     Try to use an existing user/session identifier
     when available.

     In demo mode, fallback to a stable browser/session
     header or a conversation fingerprint.
  */

  const headers = request.headers;

  const possibleKeys = [
    headers.get("x-user-id"),
    headers.get("x-session-id"),
    headers.get("x-conversation-id"),
  ].filter(Boolean);

  if (possibleKeys.length > 0) {
    return possibleKeys[0] as string;
  }

  /*
     Fallback for demo mode.

     We intentionally do NOT use the complete message
     as the memory key because every message would create
     a new memory bucket.
  */

  const existingDemoKey =
    headers.get("x-nexaflow-demo-session");

  if (existingDemoKey) {
    return existingDemoKey;
  }

  return "nexaflow-demo-conversation";
}

function p5GetMemory(
  memoryKey: string
): P5ConversationMemory {
  const existing =
    p5ConversationMemory.get(memoryKey);

  if (existing) {
    return existing;
  }

  const freshMemory: P5ConversationMemory = {
    lastLeadResults: [],
    lastTaskResults: [],
    lastScheduledTasks: [],
    lastReferencedLeads: [],
    lastReferencedTasks: [],
  };

  p5ConversationMemory.set(
    memoryKey,
    freshMemory
  );

  return freshMemory;
}

function p5SaveMemory(
  memoryKey: string,
  updates: Partial<P5ConversationMemory>
) {
  const current =
    p5GetMemory(memoryKey);

  const updated: P5ConversationMemory = {
    ...current,
    ...updates,
    lastActionAt:
      new Date().toISOString(),
  };

  p5ConversationMemory.set(
    memoryKey,
    updated
  );

  return updated;
}

function p5Normalize(
  value?: string
): string {
  return (value || "")
    .toLowerCase()
    .trim();
}

function p5HasPronounReference(
  text?: string
): boolean {
  const value =
    p5Normalize(text);

  return (
    /\bthem\b/.test(value) ||
    /\bthose\b/.test(value) ||
    /\bthese\b/.test(value) ||
    /\bthat\b/.test(value) ||
    /\bthose leads\b/.test(value) ||
    /\bthese leads\b/.test(value) ||
    /\bthose tasks\b/.test(value) ||
    /\bthese tasks\b/.test(value) ||
    value.includes("unhain") ||
    value.includes("unko") ||
    value.includes("un ko") ||
    value.includes("un") ||
    value.includes("inko") ||
    value.includes("in ko") ||
    value.includes("yeh") ||
    value.includes("ye")
  );
}

function p5IsOtherLeadsRequest(
  text?: string
): boolean {
  const value =
    p5Normalize(text);

  return (
    value.includes("other leads") ||
    value.includes("remaining leads") ||
    value.includes("rest of the leads") ||
    value.includes("rest leads") ||
    value.includes("baqi leads") ||
    value.includes("baqi wali leads") ||
    value.includes("doosri leads") ||
    value.includes("dusri leads") ||
    value.includes("baki leads")
  );
}

function p5IsTaskReference(
  text?: string
): boolean {
  const value =
    p5Normalize(text);

  return (
    value.includes("task") ||
    value.includes("tasks") ||
    value.includes("follow-up") ||
    value.includes("follow up") ||
    value.includes("followup") ||
    value.includes("those") ||
    value.includes("them")
  );
}

function p5IsLeadReference(
  text?: string
): boolean {
  const value =
    p5Normalize(text);

  return (
    value.includes("lead") ||
    value.includes("leads") ||
    value.includes("them") ||
    value.includes("those") ||
    value.includes("these") ||
    value.includes("unko") ||
    value.includes("unhain") ||
    value.includes("baqi")
  );
}






type P5Lead = {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

type P5Task = {
  id: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  leadId?: string;
  workflowId?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
};



  

function p5LeadToMemoryItem(
  lead: P5Lead
): P5MemoryItem {
  return {
    id: lead.id,
    type: "lead_results",
    name: lead.name,
    leadId: lead.id,
    status: lead.status,
    priority: lead.priority,
    createdAt: lead.createdAt,
  };
}

function p5TaskToMemoryItem(
  task: P5Task
): P5MemoryItem {
  return {
    id: task.id,
    type: "task_results",
    name: task.title,
    taskId: task.id,
    leadId: task.leadId,
    status: task.status,
    createdAt: task.createdAt,
  };
}

function p5RememberLeads(
  memoryKey: string,
  leads: P5Lead[],
  action = "read_leads"
) {
  const items =
    leads.map(p5LeadToMemoryItem);

  return p5SaveMemory(
    memoryKey,
    {
      lastLeadResults: items,
      lastReferencedLeads: items,
      lastAction: action,
    }
  );
}

function p5RememberTasks(
  memoryKey: string,
  tasks: P5Task[],
  action = "create_tasks"
) {
  const items =
    tasks.map(p5TaskToMemoryItem);

  return p5SaveMemory(
    memoryKey,
    {
      lastTaskResults: items,
      lastReferencedTasks: items,
      lastAction: action,
    }
  );
}

function p5RememberScheduledTasks(
  memoryKey: string,
  tasks: P5Task[]
) {
  const items =
    tasks.map(p5TaskToMemoryItem);

  return p5SaveMemory(
    memoryKey,
    {
      lastScheduledTasks: items,
      lastReferencedTasks: items,
      lastAction: "schedule_tasks",
    }
  );
}

function p5GetPreviousLeads(
  memoryKey: string
): P5Lead[] {
  const memory =
    p5GetMemory(memoryKey);

  const currentLeads =
    getLeads() as P5Lead[];

  const ids =
    new Set(
      memory.lastReferencedLeads
        .map((item) =>
          item.leadId || item.id
        )
    );

  return currentLeads.filter(
    (lead) =>
      ids.has(lead.id)
  );
}

function p5GetPreviousTasks(
  memoryKey: string
): P5Task[] {
  const memory =
    p5GetMemory(memoryKey);

  const currentTasks =
    getTasks() as P5Task[];

  const ids =
    new Set(
      memory.lastReferencedTasks
        .map((item) =>
          item.taskId || item.id
        )
    );

  return currentTasks.filter(
    (task) =>
      ids.has(task.id)
  );
}

function p5ResolveReferencedLeads(
  memoryKey: string
): P5Lead[] {
  return p5GetPreviousLeads(
    memoryKey
  );
}
function p5CreateTasksForPreviousLeads(
  memoryKey: string
) {
  const leads =
    p5ResolveReferencedLeads(
      memoryKey
    );

  const existingTasks =
    getTasks() as P5Task[];

  const createdTasks: P5Task[] = [];
  const skippedTasks: P5Task[] = [];

  for (const lead of leads) {
    const duplicate =
      existingTasks.find(
        (task) =>
          task.leadId === lead.id &&
          p5Normalize(
            task.title
          ) === "follow-up" &&
          task.status !==
            "completed" &&
          task.status !==
            "cancelled"
      );

    if (duplicate) {
      skippedTasks.push(
        duplicate
      );
      continue;
    }

    const now =
      new Date().toISOString();

    try {
      const task =
        createTask({
          id:
            `task-memory-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
          title:
            "Follow-up",
          description:
            `Follow up with ${lead.name || "this lead"} from the previous conversation context.`,
          priority:
  lead.priority === "high"
    ? "high"
    : lead.priority === "low"
      ? "low"
      : "medium",
          status:
            "pending",
          createdAt:
            now,
          updatedAt:
            now,
          leadId:
            lead.id,
        }) as P5Task;

      createdTasks.push(
        task
      );

      existingTasks.push(
        task
      );
    } catch {
      // Keep processing remaining leads.
    }
  }

  return {
    leads,
    createdTasks,
    skippedTasks,
  };
}


function p5ResolveReferencedTasks(
  memoryKey: string
): P5Task[] {
  return p5GetPreviousTasks(
    memoryKey
  );
}

function p5GetOtherLeads(
  memoryKey: string
): P5Lead[] {
  const allLeads =
    getLeads() as P5Lead[];

  const previousLeads =
    p5GetPreviousLeads(
      memoryKey
    );

  const previousIds =
    new Set(
      previousLeads.map(
        (lead) => lead.id
      )
    );

  return allLeads.filter(
    (lead) =>
      !previousIds.has(lead.id)
  );
}

function p5BuildReferenceContext(
  memoryKey: string
) {
  const memory =
    p5GetMemory(memoryKey);

  const leads =
    p5GetPreviousLeads(
      memoryKey
    );

  const tasks =
    p5GetPreviousTasks(
      memoryKey
    );

  return {
    leads,
    tasks,
    lastAction:
      memory.lastAction,
  };
}

function p5HasMemory(
  memoryKey: string
): boolean {
  const memory =
    p5GetMemory(memoryKey);

  return (
    memory.lastReferencedLeads.length >
      0 ||
    memory.lastReferencedTasks.length >
      0
  );
}

function p5BuildMemorySummary(
  memoryKey: string
): string {
  const context =
    p5BuildReferenceContext(
      memoryKey
    );

  const leadNames =
    context.leads
      .map(
        (lead) =>
          lead.name || lead.id
      )
      .join(", ");

  const taskNames =
    context.tasks
      .map(
        (task) =>
          task.title || task.id
      )
      .join(", ");

  return [
    context.leads.length > 0
      ? `Previous leads: ${leadNames}.`
      : "",
    context.tasks.length > 0
      ? `Previous tasks: ${taskNames}.`
      : "",
    context.lastAction
      ? `Previous action: ${context.lastAction}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function p5ShouldResolveMemory(
  text?: string
): boolean {
  return (
    p5HasPronounReference(text) &&
    p5HasMemory(
      "nexaflow-demo-conversation"
    )
  );
}

function p5ResolveIntent(
  memoryKey: string,
  userMessage: string
) {
  const value =
    p5Normalize(userMessage);

  const context =
    p5BuildReferenceContext(
      memoryKey
    );

  const referencesLeads =
    p5IsLeadReference(
      value
    );

  const referencesTasks =
    p5IsTaskReference(
      value
    );

  const hasThem =
    p5HasPronounReference(
      value
    );

  if (
    hasThem &&
    referencesTasks &&
    context.tasks.length > 0
  ) {
    return {
      type: "tasks" as const,
      items: context.tasks,
      source: "previous_tasks" as const,
      confidence: 1,
    };
  }

  if (
    hasThem &&
    referencesLeads &&
    context.leads.length > 0
  ) {
    return {
      type: "leads" as const,
      items: context.leads,
      source: "previous_leads" as const,
      confidence: 1,
    };
  }

  if (
    referencesTasks &&
    context.tasks.length > 0
  ) {
    return {
      type: "tasks" as const,
      items: context.tasks,
      source: "previous_tasks" as const,
      confidence: 0.9,
    };
  }

  if (
    referencesLeads &&
    context.leads.length > 0
  ) {
    return {
      type: "leads" as const,
      items: context.leads,
      source: "previous_leads" as const,
      confidence: 0.9,
    };
  }

  return {
    type: "none" as const,
    items: [],
    source: "none" as const,
    confidence: 0,
  };
}

function p5BuildLeadNames(
  leads: P5Lead[]
): string {
  if (leads.length === 0) {
    return "No leads";
  }

  return leads
    .map(
      (lead) =>
        lead.name || lead.id
    )
    .join(", ");
}

function p5BuildTaskNames(
  tasks: P5Task[]
): string {
  if (tasks.length === 0) {
    return "No tasks";
  }

  return tasks
    .map(
      (task) =>
        task.title || task.id
    )
    .join(", ");
}

function p5EnglishMemoryResponse(
  message: string
): string {
  return `I remember the previous context. ${message}`;
}

function p5RomanUrduMemoryResponse(
  message: string
): string {
  return `Mujhe previous context yaad hai. ${message}`;
}

function p5UrduMemoryResponse(
  message: string
): string {
  return `مجھے پچھلا context یاد ہے۔ ${message}`;
}

function p5BuildMemoryResponse(
  userMessage: string,
  message: string
): string {
  const language =
    detectLanguage(
      userMessage
    );

  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return p5RomanUrduMemoryResponse(
      message
    );
  }

  if (
    language === "urdu"
  ) {
    return p5UrduMemoryResponse(
      message
    );
  }

  return p5EnglishMemoryResponse(
    message
  );
}

function p5StoreCreatedTaskMemory(
  memoryKey: string,
  tasks: P5Task[]
) {
  if (tasks.length === 0) {
    return;
  }

  p5RememberTasks(
    memoryKey,
    tasks,
    "create_tasks"
  );
}

function p5StoreLeadReadMemory(
  memoryKey: string,
  leads: P5Lead[]
) {
  if (leads.length === 0) {
    return;
  }

  p5RememberLeads(
    memoryKey,
    leads,
    "read_leads"
  );
}

function p5StoreScheduledTaskMemory(
  memoryKey: string,
  tasks: P5Task[]
) {
  if (tasks.length === 0) {
    return;
  }

  p5RememberScheduledTasks(
    memoryKey,
    tasks
  );
}

function p5ResolveOtherLeads(
  memoryKey: string
) {
  return p5GetOtherLeads(
    memoryKey
  );
}

function p5OtherLeadReport(
  userMessage: string,
  leads: P5Lead[]
): string {
  const language =
    detectLanguage(
      userMessage
    );

  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return `Previous group ke ilawa ${leads.length} other leads hain: ${p5BuildLeadNames(leads)}.`;
  }

  if (
    language === "urdu"
  ) {
    return `پچھلے گروپ کے علاوہ ${leads.length} دوسری leads ہیں: ${p5BuildLeadNames(leads)}۔`;
  }

  return `There are ${leads.length} other leads outside the previous group: ${p5BuildLeadNames(leads)}.`;
}

function p5CanResolveReference(
  memoryKey: string,
  userMessage: string
): boolean {
  if (
    !p5HasMemory(memoryKey)
  ) {
    return false;
  }

  return (
    p5HasPronounReference(
      userMessage
    ) ||
    p5IsOtherLeadsRequest(
      userMessage
    )
  );
}

function p5GetMemoryDebug(
  memoryKey: string
) {
  const memory =
    p5GetMemory(
      memoryKey
    );

  return {
    leads:
      memory.lastReferencedLeads.map(
        (item) => ({
          id: item.leadId || item.id,
          name: item.name,
        })
      ),
    tasks:
      memory.lastReferencedTasks.map(
        (item) => ({
          id: item.taskId || item.id,
          title: item.name,
          leadId: item.leadId,
        })
      ),
    lastAction:
      memory.lastAction,
  };
}
   
     /* =========================================================
   P6 — DATE INTELLIGENCE
   TODAY / TOMORROW / YESTERDAY / WEEK / MONDAY
   ROMAN URDU + ENGLISH DATE RESOLUTION
   ========================================================= */

type P6DateIntent =
  | "today"
  | "tomorrow"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "next_week"
  | "monday"
  | "next_monday"
  | "day_after_tomorrow";

type P6TimeIntent =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "exact";

type P6ResolvedDate = {
  intent: P6DateIntent;
  label: string;
  date: Date;
  time?: string;
  hour: number;
  minute: number;
  isExactTime: boolean;
  startOfDay: Date;
  endOfDay: Date;
};

type P6DateRange = {
  start: Date;
  end: Date;
  label: string;
};

function p6Normalize(
  value?: string
): string {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function p6StartOfDay(
  date: Date
): Date {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function p6EndOfDay(
  date: Date
): Date {
  const result =
    new Date(date);

  result.setHours(
    23,
    59,
    59,
    999
  );

  return result;
}

function p6AddDays(
  date: Date,
  days: number
): Date {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
}

function p6StartOfWeek(
  date: Date
): Date {
  const result =
    p6StartOfDay(date);

  const day =
    result.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + diff
  );

  return result;
}

function p6EndOfWeek(
  date: Date
): Date {
  const start =
    p6StartOfWeek(date);

  return p6EndOfDay(
    p6AddDays(start, 6)
  );
}

function p6GetTimeIntent(
  text: string
): P6TimeIntent {
  const value =
    p6Normalize(text);

  if (
    value.includes("morning") ||
    value.includes("subah") ||
    value.includes("sawere") ||
    value.includes("savere")
  ) {
    return "morning";
  }

  if (
    value.includes("afternoon") ||
    value.includes("dopahar")
  ) {
    return "afternoon";
  }

  if (
    value.includes("evening") ||
    value.includes("shaam") ||
    value.includes("sham")
  ) {
    return "evening";
  }

  if (
    value.includes("night") ||
    value.includes("raat") ||
    value.includes("rat")
  ) {
    return "night";
  }

  if (
    /\b\d{1,2}(?::\d{2})?\s*(am|pm)?\b/i.test(
      value
    ) ||
    /\b\d{1,2}\s*(baje|bj|bajay)\b/i.test(
      value
    )
  ) {
    return "exact";
  }

  return "exact";
}

function p6ExtractTime(
  text: string
): {
  hour: number;
  minute: number;
  isExactTime: boolean;
} {
  const value =
    p6Normalize(text);

  /*
   * Examples:
   * 10
   * 10:30
   * 10 am
   * 10:30 pm
   * 10 baje
   */

  const match =
    value.match(
      /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje|bj|bajay)?\b/i
    );

  if (match) {
    let hour =
      Number(match[1]);

    const minute =
      match[2]
        ? Number(match[2])
        : 0;

    const suffix =
      (match[3] || "")
        .toLowerCase();

    if (
      suffix === "pm" &&
      hour < 12
    ) {
      hour += 12;
    }

    if (
      suffix === "am" &&
      hour === 12
    ) {
      hour = 0;
    }

    /*
     * Roman Urdu:
     * "10 baje" normally means 10 AM
     * unless "shaam/raat" is also present.
     */
    if (
      (suffix === "baje" ||
        suffix === "bj" ||
        suffix === "bajay") &&
      (value.includes("shaam") ||
        value.includes("sham") ||
        value.includes("raat") ||
        value.includes("rat"))
    ) {
      if (hour < 12) {
        hour += 12;
      }
    }

    return {
      hour:
        Math.min(
          Math.max(hour, 0),
          23
        ),
      minute:
        Math.min(
          Math.max(minute, 0),
          59
        ),
      isExactTime: true,
    };
  }

  /*
   * Natural time defaults
   */
  if (
    value.includes("morning") ||
    value.includes("subah") ||
    value.includes("sawere") ||
    value.includes("savere")
  ) {
    return {
      hour: 9,
      minute: 0,
      isExactTime: false,
    };
  }

  if (
    value.includes("afternoon") ||
    value.includes("dopahar")
  ) {
    return {
      hour: 14,
      minute: 0,
      isExactTime: false,
    };
  }

  if (
    value.includes("evening") ||
    value.includes("shaam") ||
    value.includes("sham")
  ) {
    return {
      hour: 18,
      minute: 0,
      isExactTime: false,
    };
  }

  if (
    value.includes("night") ||
    value.includes("raat") ||
    value.includes("rat")
  ) {
    return {
      hour: 21,
      minute: 0,
      isExactTime: false,
    };
  }

  /*
   * Default scheduling time.
   */
  return {
    hour: 10,
    minute: 0,
    isExactTime: false,
  };
}

function p6GetDateIntent(
  text: string
): P6DateIntent | null {
  const value =
    p6Normalize(text);

  if (
    value.includes(
      "day after tomorrow"
    ) ||
    value.includes(
      "day-after-tomorrow"
    ) ||
    value.includes("parson") ||
    value.includes("parso")
  ) {
    return "day_after_tomorrow";
  }

  if (
    value.includes(
      "next monday"
    ) ||
    value.includes(
      "next mon"
    )
  ) {
    return "next_monday";
  }

  if (
    value === "monday" ||
    value.includes(
      " on monday"
    ) ||
    value.startsWith(
      "monday "
    )
  ) {
    return "monday";
  }

  if (
    value.includes(
      "next week"
    ) ||
    value.includes(
      "next wk"
    )
  ) {
    return "next_week";
  }

  if (
    value.includes(
      "last week"
    ) ||
    value.includes(
      "previous week"
    ) ||
    value.includes(
      "pichlay week"
    ) ||
    value.includes(
      "pichle week"
    ) ||
    value.includes(
      "pichlay haftay"
    ) ||
    value.includes(
      "pichle haftay"
    )
  ) {
    return "last_week";
  }

  if (
    value.includes(
      "this week"
    ) ||
    value.includes(
      "current week"
    ) ||
    value.includes(
      "is week"
    ) ||
    value.includes(
      "iss week"
    ) ||
    value.includes(
      "is haftay"
    ) ||
    value.includes(
      "iss haftay"
    )
  ) {
    return "this_week";
  }

  if (
    value.includes(
      "yesterday"
    ) ||
    value.includes(
      "yesterdays"
    )
  ) {
    return "yesterday";
  }

  if (
    value.includes(
      "tomorrow"
    ) ||
    value.includes(
      "kal"
    )
  ) {
    return "tomorrow";
  }

  if (
    value === "today" ||
    value.includes(
      "today "
    ) ||
    value.startsWith(
      "today"
    ) ||
    value === "aaj" ||
    value.startsWith(
      "aaj "
    )
  ) {
    return "today";
  }

  return null;
}

function p6ResolveMonday(
  baseDate: Date,
  nextMonday: boolean
): Date {
  const result =
    p6StartOfDay(baseDate);

  const currentDay =
    result.getDay();

  const daysUntilMonday =
    currentDay === 0
      ? 1
      : 8 - currentDay;

  /*
   * If today is Monday:
   * "Monday" = today
   * "next Monday" = +7 days
   */
  if (
    !nextMonday &&
    currentDay === 1
  ) {
    return result;
  }

  if (
    nextMonday
  ) {
    const days =
      currentDay === 1
        ? 7
        : daysUntilMonday;

    return p6AddDays(
      result,
      days
    );
  }

  return p6AddDays(
    result,
    currentDay === 0
      ? 1
      : 8 - currentDay
  );
}

function p6ResolveDate(
  text: string,
  baseDate = new Date()
): P6ResolvedDate | null {
  const intent =
    p6GetDateIntent(text);

  if (!intent) {
    return null;
  }

  const time =
    p6ExtractTime(text);

  let targetDate =
    p6StartOfDay(baseDate);

  let label = "";

  switch (intent) {
    case "today":
      label = "today";
      break;

    case "tomorrow":
      targetDate =
        p6AddDays(
          targetDate,
          1
        );
      label = "tomorrow";
      break;

    case "yesterday":
      targetDate =
        p6AddDays(
          targetDate,
          -1
        );
      label = "yesterday";
      break;

    case "day_after_tomorrow":
      targetDate =
        p6AddDays(
          targetDate,
          2
        );
      label =
        "day after tomorrow";
      break;

    case "this_week":
      targetDate =
        p6StartOfWeek(
          targetDate
        );
      label = "this week";
      break;

    case "last_week":
      targetDate =
        p6AddDays(
          p6StartOfWeek(
            targetDate
          ),
          -7
        );
      label = "last week";
      break;

    case "next_week":
      targetDate =
        p6AddDays(
          p6StartOfWeek(
            targetDate
          ),
          7
        );
      label = "next week";
      break;

    case "monday":
      targetDate =
        p6ResolveMonday(
          targetDate,
          false
        );
      label = "Monday";
      break;

    case "next_monday":
      targetDate =
        p6ResolveMonday(
          targetDate,
          true
        );
      label = "next Monday";
      break;
  }

  targetDate.setHours(
    time.hour,
    time.minute,
    0,
    0
  );

  return {
    intent,
    label,
    date: targetDate,
    time: `${String(
      time.hour
    ).padStart(2, "0")}:${String(
      time.minute
    ).padStart(2, "0")}`,
    hour: time.hour,
    minute: time.minute,
    isExactTime:
      time.isExactTime,
    startOfDay:
      p6StartOfDay(
        targetDate
      ),
    endOfDay:
      p6EndOfDay(
        targetDate
      ),
  };
}

function p6ResolveDateRange(
  text: string,
  baseDate = new Date()
): P6DateRange | null {
  const intent =
    p6GetDateIntent(text);

  if (!intent) {
    return null;
  }

  const today =
    p6StartOfDay(baseDate);

  switch (intent) {
    case "today":
      return {
        start: today,
        end:
          p6EndOfDay(
            today
          ),
        label: "today",
      };

    case "yesterday": {
      const date =
        p6AddDays(
          today,
          -1
        );

      return {
        start: date,
        end:
          p6EndOfDay(
            date
          ),
        label: "yesterday",
      };
    }

    case "tomorrow": {
      const date =
        p6AddDays(
          today,
          1
        );

      return {
        start: date,
        end:
          p6EndOfDay(
            date
          ),
        label: "tomorrow",
      };
    }

    case "day_after_tomorrow": {
      const date =
        p6AddDays(
          today,
          2
        );

      return {
        start: date,
        end:
          p6EndOfDay(
            date
          ),
        label:
          "day after tomorrow",
      };
    }

    case "this_week":
      return {
        start:
          p6StartOfWeek(
            today
          ),
        end:
          p6EndOfWeek(
            today
          ),
        label:
          "this week",
      };

    case "last_week": {
      const start =
        p6AddDays(
          p6StartOfWeek(
            today
          ),
          -7
        );

      return {
        start,
        end:
          p6EndOfWeek(
            start
          ),
        label:
          "last week",
      };
    }

    case "next_week": {
      const start =
        p6AddDays(
          p6StartOfWeek(
            today
          ),
          7
        );

      return {
        start,
        end:
          p6EndOfWeek(
            start
          ),
        label:
          "next week",
      };
    }

    case "monday":
    case "next_monday": {
      const resolved =
        p6ResolveDate(
          text,
          baseDate
        );

      if (!resolved) {
        return null;
      }

      return {
        start:
          resolved.startOfDay,
        end:
          resolved.endOfDay,
        label:
          resolved.label,
      };
    }
  }
}

function p6HasDateIntent(
  text?: string
): boolean {
  return (
    p6GetDateIntent(
      text || ""
    ) !== null
  );
}
function p6IsPureDateQuestion(
  text?: string
): boolean {
  const value =
    p6Normalize(text);

  if (
    !p6HasDateIntent(
      value
    )
  ) {
    return false;
  }
  const actionWords = [
  "create",
  "make",
  "add",
  "schedule",
  "set",
  "move",
  "update",
  "task",
  "tasks",
  "follow-up",
  "follow up",
  "followup",
  "remind",
  "reminder",
  "banao",
  "banado",
  "bana do",
  "kar do",
  "kr do",
];
    return !actionWords.some(
    (word) =>
      value.includes(word)
  );
}
 /* =========================================================
   P7 — AGENT PLANNING
   ========================================================= */
type P7Lead = {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

type P7Plan = {
  id: string;
  leadIds: string[];
  leadCount: number;
  requiresConfirmation: boolean;
  createdAt: string;
};
type P7Task = {
  id: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  leadId?: string;
  workflowId?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
};

type P7ExecutionResult = {
  planned: number;
  updated: number;
  failed: number;
  reviewTasksCreated: number;
  verifiedInactive: number;
};

const p7Store =
  globalThis as typeof globalThis & {
    __nexaFlowP7Plans?: Map<string, P7Plan>;
  };

if (!p7Store.__nexaFlowP7Plans) {
  p7Store.__nexaFlowP7Plans =
    new Map<string, P7Plan>();
}

const p7Plans =
  p7Store.__nexaFlowP7Plans;

function p7Normalize(
  value?: string
): string {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function p7GetMemoryKey(
  request: Request
): string {
  return (
    request.headers.get("x-user-id") ||
    request.headers.get("x-session-id") ||
    request.headers.get("x-conversation-id") ||
    request.headers.get(
      "x-nexaflow-demo-session"
    ) ||
    "nexaflow-demo-agent"
  );
}

function p7IsCleanupRequest(
  text?: string
): boolean {
  const value =
    p7Normalize(text);

  return (
    value.includes("clean up my leads") ||
    value.includes("clean my leads") ||
    value.includes("cleanup my leads") ||
    value === "clean up leads" ||
    value === "cleanup leads" ||
    value === "clean leads" ||
    value.includes("leads cleanup")
  );
}

function p7IsConfirmation(
  text?: string
): boolean {
  const value =
    p7Normalize(text);

  return [
    "yes",
    "yeah",
    "yep",
    "yup",
    "ok",
    "okay",
    "sure",
    "proceed",
    "go ahead",
    "do it",
    "confirm",
    "confirmed",
    "yes proceed",
    "yes please",
    "haan",
    "han",
    "haan karo",
    "han karo",
    "kar do",
    "kr do",
    "theek hai",
    "thik hai",
  ].some(
    (item) =>
      value === item ||
      value.startsWith(
        `${item} `
      )
  );
}

function p7IsRejection(
  text?: string
): boolean {
  const value =
    p7Normalize(text);

  return [
    "no",
    "nope",
    "cancel",
    "cancel it",
    "stop",
    "not now",
    "never mind",
    "reject",
    "nahi",
    "nahin",
    "cancel karo",
    "cancel kar do",
    "mat karo",
    "rehne do",
  ].some(
    (item) =>
      value === item ||
      value.startsWith(
        `${item} `
      )
  );
}

function p7IsInactiveLead(
  lead: P7Lead
): boolean {
  const status =
    p7Normalize(
      lead.status
    );

  if (
    status === "inactive" ||
    status === "archived"
  ) {
    return true;
  }

  if (
    status === "qualified" ||
    status === "converted" ||
    status === "active"
  ) {
    return false;
  }

  return (
    status === "" ||
    status === "new" ||
    status === "unqualified" ||
    status === "cold" ||
    status === "lost"
  );
}

function p7FindInactiveLeads(): P7Lead[] {
  const leads =
    getLeads() as P7Lead[];

  return leads.filter(
    p7IsInactiveLead
  );
}

function p7CreatePlan(
  request: Request
): P7Plan | null {
  const leads =
    p7FindInactiveLeads();

  if (leads.length === 0) {
    return null;
  }

  const memoryKey =
    p7GetMemoryKey(request);

  const plan: P7Plan = {
    id:
      `p7-plan-${Date.now()}`,
    leadIds:
      leads.map(
        (lead) => lead.id
      ),
    leadCount:
      leads.length,
    requiresConfirmation:
      true,
    createdAt:
      new Date().toISOString(),
  };

  p7Plans.set(
    memoryKey,
    plan
  );

  return plan;
}

function p7GetPendingPlan(
  request: Request
): P7Plan | null {
  return (
    p7Plans.get(
      p7GetMemoryKey(request)
    ) || null
  );
}

function p7ClearPlan(
  request: Request
) {
  p7Plans.delete(
    p7GetMemoryKey(request)
  );
}

function p7PlanResponse(
  plan: P7Plan,
  language: string
): string {
  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return `Maine ${plan.leadCount} leads identify ki hain jo inactive lag rahi hain.

Main:
• ${plan.leadCount} leads ko inactive mark kar sakta hoon
• Unke liye review tasks create kar sakta hoon
• Changes verify kar sakta hoon

Kya aap proceed karna chahte hain?`;
  }

  if (language === "urdu") {
    return `مجھے ${plan.leadCount} leads ملی ہیں جو inactive لگ رہی ہیں۔

میں:
• ${plan.leadCount} leads کو inactive mark کر سکتا ہوں
• ان کے لیے review tasks create کر سکتا ہوں
• Changes verify کر سکتا ہوں

کیا آپ proceed کرنا چاہتے ہیں؟`;
  }

  return `I found ${plan.leadCount} leads that appear inactive.

I can:
• Mark ${plan.leadCount} leads as inactive
• Create review tasks for them
• Verify the changes

Would you like me to proceed?`;
}

function p7ExecutePlan(
  request: Request
): P7ExecutionResult {
  const plan =
    p7GetPendingPlan(request);

  if (!plan) {
    return {
      planned: 0,
      updated: 0,
      failed: 0,
      reviewTasksCreated: 0,
      verifiedInactive: 0,
    };
  }

  const leads =
    getLeads() as P7Lead[];

  const tasks =
    getTasks() as P7Task[];

  let updated = 0;
  let failed = 0;
  let reviewTasksCreated = 0;

  for (
    const leadId of plan.leadIds
  ) {
    const lead =
      leads.find(
        (item) =>
          item.id === leadId
      );

    if (!lead) {
      failed++;
      continue;
    }

    try {
      const result =
        updateLead(
          lead.id,
          {
            status: "inactive",
          }
        );

      if (!result) {
        failed++;
        continue;
      }

      updated++;

      const existingTask =
        tasks.find(
          (task) =>
            task.leadId ===
              lead.id &&
            p7Normalize(
              task.title
            ) ===
              "review inactive lead" &&
            task.status !==
              "completed" &&
            task.status !==
              "cancelled"
        );

      if (!existingTask) {
        const now =
          new Date().toISOString();

        const created =
          createTask({
            id:
              `p7-review-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
            title:
              "Review inactive lead",
            description:
              `Review ${lead.name || "this lead"} after cleanup.`,
            priority:
              lead.priority === "high"
                ? "high"
                : lead.priority === "low"
                  ? "low"
                  : "medium",
            status:
              "pending",
            createdAt: now,
            updatedAt: now,
            leadId:
              lead.id,
          });

        if (created) {
          reviewTasksCreated++;
          tasks.push(
            created as P7Task
          );
        }
      }
    } catch {
      failed++;
    }
  }

  const currentLeads =
    getLeads() as P7Lead[];

  const verifiedInactive =
    currentLeads.filter(
      (lead) =>
        plan.leadIds.includes(
          lead.id
        ) &&
        p7Normalize(
          lead.status
        ) === "inactive"
    ).length;

  p7ClearPlan(request);

  return {
    planned:
      plan.leadIds.length,
    updated,
    failed,
    reviewTasksCreated,
    verifiedInactive,
  };
}

function p7ExecutionResponse(
  result: P7ExecutionResult,
  language: string
): string {
  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return `Cleanup complete ✅

• ${result.updated} leads inactive mark ki gayi.
• ${result.reviewTasksCreated} review tasks create kiye gaye.
• ${result.verifiedInactive} leads verify hui hain.${result.failed > 0 ? `\n• ${result.failed} updates fail hui hain.` : ""}`;
  }

  if (language === "urdu") {
    return `Cleanup مکمل ✅

• ${result.updated} leads کو inactive mark کیا گیا۔
• ${result.reviewTasksCreated} review tasks create کیے گئے۔
• ${result.verifiedInactive} leads verify کی گئیں۔${result.failed > 0 ? `\n• ${result.failed} updates fail ہوئیں۔` : ""}`;
  }

  return `Cleanup completed successfully. ✅

• ${result.updated} leads were marked as inactive.
• ${result.reviewTasksCreated} review tasks were created.
• ${result.verifiedInactive} leads were verified as inactive.${result.failed > 0 ? `\n• ${result.failed} updates failed.` : ""}`;
}



function p6FormatDate(
  date: Date
): string {
  return new Intl.DateTimeFormat(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function p6FormatTime(
  date: Date
): string {
  return new Intl.DateTimeFormat(
    "en-PK",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(date);
}

function p6BuildDateResponse(
  text: string
): string | null {
  const resolved =
    p6ResolveDate(text);

  if (!resolved) {
    return null;
  }

  const date =
    p6FormatDate(
      resolved.date
    );

  const time =
    p6FormatTime(
      resolved.date
    );

  return `Date understood: ${resolved.label} → ${date} at ${time}.`;
}
    /* =========================================================
   P8 — CHATGPT-LEVEL PERSONALITY
   ========================================================= */

function p8Normalize(text?: string): string {
  return (text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function p8IsGreeting(text?: string): boolean {
  const value = p8Normalize(text);

  return /^(hi|hey|hello|hiya|heyy|hey there|good morning|good afternoon|good evening|salam|assalam o alaikum|aoa|aoa nexaflow|hi nexaflow|hey nexaflow|hello nexaflow)[!.?,\s]*$/i.test(
    value
  );
}

function p8IsHowAreYou(text?: string): boolean {
  const value = p8Normalize(text);

  return [
    "how are you",
    "how are you?",
    "how r u",
    "how r u?",
    "how are u",
    "how are u?",
    "kaise ho",
    "kaisay ho",
    "kesi ho",
    "kesay ho",
    "kya haal hai",
    "kia haal hai",
    "kya hal hai",
    "kia hal hai",
  ].includes(value);
}

function p8IsIdentityQuestion(text?: string): boolean {
  const value = p8Normalize(text);

  return [
    "what are you",
    "what are you?",
    "who are you",
    "who are you?",
    "what is nexaflow",
    "what is nexaflow?",
    "what can you do",
    "what can you do?",
    "tum kya ho",
    "tum kia ho",
    "aap kya ho",
    "aap kia ho",
    "nexaflow kya hai",
    "nexaflow kia hai",
  ].includes(value);
}

function p8IsThanks(text?: string): boolean {
  const value = p8Normalize(text);

  return /^(thanks|thank you|thankyou|thx|ty|shukriya|thanks a lot|thank you so much|bohat shukriya|bahut shukriya)[!.?,\s]*$/i.test(
    value
  );
}

function p8IsGoodbye(text?: string): boolean {
  const value = p8Normalize(text);

  return /^(bye|goodbye|see you|see ya|talk later|catch you later|allah hafiz|khuda hafiz|phir miltay hain|phir milte hain)[!.?,\s]*$/i.test(
    value
  );
}

function p8IsHelpQuestion(text?: string): boolean {
  const value = p8Normalize(text);

  return [
    "help",
    "help me",
    "i need help",
    "what can i ask you",
    "what can i ask",
    "how can you help",
    "how can you help me",
    "mujhe help chahiye",
    "mujhe madad chahiye",
  ].includes(value);
}

function p8Response(
  text: string,
  language: string
): string | null {
  if (p8IsGreeting(text)) {
    if (
      language === "roman-urdu" ||
      language === "mixed"
    ) {
      return "Hey! 👋 I'm NexaFlow AI. What would you like to work on?";
    }

    if (language === "urdu") {
      return "Hey! 👋 میں NexaFlow AI ہوں۔ آپ کس کام پر کام کرنا چاہتے ہیں؟";
    }

    return "Hey! 👋 I'm NexaFlow AI. What would you like to work on?";
  }

  if (p8IsHowAreYou(text)) {
    if (
      language === "roman-urdu" ||
      language === "mixed"
    ) {
      return "I'm doing great and ready to help with your NexaFlow workspace. What are we working on?";
    }

    if (language === "urdu") {
      return "میں بالکل ٹھیک ہوں اور آپ کے NexaFlow workspace میں مدد کے لیے ready ہوں۔ ہم کس کام پر کام کریں؟";
    }

    return "I'm doing great and ready to help with your NexaFlow workspace. What are we working on?";
  }

  if (p8IsIdentityQuestion(text)) {
    if (
      language === "roman-urdu" ||
      language === "mixed"
    ) {
      return "I'm NexaFlow AI — an AI-powered operations assistant that can understand your workspace, analyze leads, manage tasks, run workflows and turn natural-language requests into real actions.";
    }

    if (language === "urdu") {
      return "میں NexaFlow AI ہوں — ایک AI-powered operations assistant جو آپ کے workspace کو سمجھ سکتا ہے، leads analyze کر سکتا ہے، tasks manage کر سکتا ہے، workflows run کر سکتا ہے اور natural-language requests کو real actions میں تبدیل کر سکتا ہے۔";
    }

    return "I'm NexaFlow AI — an AI-powered operations assistant that can understand your workspace, analyze leads, manage tasks, run workflows and turn natural-language requests into real actions.";
  }

  if (p8IsThanks(text)) {
    if (
      language === "roman-urdu" ||
      language === "mixed"
    ) {
      return "You're welcome! 👋";
    }

    if (language === "urdu") {
      return "خوش آمدید! 👋";
    }

    return "You're welcome! 👋";
  }

  if (p8IsGoodbye(text)) {
    if (
      language === "roman-urdu" ||
      language === "mixed"
    ) {
      return "See you! 👋 I'll be here when you need me.";
    }

    if (language === "urdu") {
      return "پھر ملتے ہیں! 👋 جب بھی ضرورت ہو، میں یہاں ہوں۔";
    }

    return "See you! 👋 I'll be here when you need me.";
  }

  if (p8IsHelpQuestion(text)) {
    if (
      language === "roman-urdu" ||
      language === "mixed"
    ) {
      return "You can ask me to analyze leads, create or schedule tasks, run workflows, check analytics, or help you manage your NexaFlow workspace.";
    }

    if (language === "urdu") {
      return "آپ مجھ سے leads analyze کرنے، tasks create یا schedule کرنے، workflows run کرنے، analytics check کرنے یا NexaFlow workspace manage کرنے کے لیے کہہ سکتے ہیں۔";
    }

    return "You can ask me to analyze leads, create or schedule tasks, run workflows, check analytics, or help you manage your NexaFlow workspace.";
  }

  return null;
}
/* =========================================================
   P9 — SAFETY / CONFIRMATION
   ========================================================= */

type P9RiskLevel =
  | "low"
  | "medium"
  | "high";

type P9ActionType =
  | "delete_leads"
  | "delete_tasks"
  | "delete_workflows"
  | "bulk_update_leads"
  | "bulk_update_tasks"
  | "bulk_run_workflows"
  | "unknown";

type P9SafetyPlan = {
  id: string;
  action: P9ActionType;
  risk: P9RiskLevel;
  description: string;
  count?: number;
  createdAt: number;
};

const p9Store =
  globalThis as typeof globalThis & {
    __nexaFlowP9Plans?: Map<
      string,
      P9SafetyPlan
    >;
  };

if (!p9Store.__nexaFlowP9Plans) {
  p9Store.__nexaFlowP9Plans =
    new Map<
      string,
      P9SafetyPlan
    >();
}

const p9Plans =
  p9Store.__nexaFlowP9Plans;

function p9Normalize(
  text?: string
): string {
  return (text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function p9GetMemoryKey(
  request: Request
): string {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    realIp ||
    "anonymous"
  );
}

function p9IsConfirmation(
  text?: string
): boolean {
  const value =
    p9Normalize(text);

  return [
    "yes",
    "yes please",
    "yeah",
    "yep",
    "yup",
    "sure",
    "sure go ahead",
    "go ahead",
    "proceed",
    "proceed please",
    "confirm",
    "confirmed",
    "do it",
    "do that",
    "okay",
    "ok",
    "haan",
    "han",
    "jee",
    "ji",
    "haan kar do",
    "han kar do",
    "kar do",
    "kr do",
    "proceed karo",
    "aagay karo",
  ].includes(value);
}

function p9IsRejection(
  text?: string
): boolean {
  const value =
    p9Normalize(text);

  return [
    "no",
    "nope",
    "nah",
    "cancel",
    "cancel it",
    "don't",
    "dont",
    "stop",
    "never mind",
    "never mind",
    "nahi",
    "nahin",
    "na",
    "mat karo",
    "cancel kar do",
    "rehne do",
    "chor do",
    "chhor do",
  ].includes(value);
}

function p9DetectAction(
  text?: string
): P9ActionType | null {
  const value =
    p9Normalize(text);

  const deleteLeadWords = [
    "delete all leads",
    "delete all my leads",
    "remove all leads",
    "remove all my leads",
    "delete every lead",
    "remove every lead",
    "sari leads delete",
    "sari leads delete karo",
    "sab leads delete",
    "sab leads delete karo",
    "all leads delete",
    "all leads remove",
  ];

  if (
    deleteLeadWords.some(
      (phrase) =>
        value.includes(phrase)
    )
  ) {
    return "delete_leads";
  }

  const deleteTaskWords = [
    "delete all tasks",
    "delete all my tasks",
    "remove all tasks",
    "remove all my tasks",
    "delete every task",
    "remove every task",
    "sab tasks delete",
    "sari tasks delete",
    "all tasks delete",
  ];

  if (
    deleteTaskWords.some(
      (phrase) =>
        value.includes(phrase)
    )
  ) {
    return "delete_tasks";
  }

  const deleteWorkflowWords = [
    "delete all workflows",
    "delete all my workflows",
    "remove all workflows",
    "remove all my workflows",
    "delete every workflow",
    "remove every workflow",
    "sab workflows delete",
    "saray workflows delete",
    "all workflows delete",
  ];

  if (
    deleteWorkflowWords.some(
      (phrase) =>
        value.includes(phrase)
    )
  ) {
    return "delete_workflows";
  }

  const bulkLeadUpdateWords = [
    "update all leads",
    "change all leads",
    "mark all leads",
    "update every lead",
    "change every lead",
    "mark every lead",
    "sab leads update",
    "sari leads update",
    "all leads update",
  ];

  if (
    bulkLeadUpdateWords.some(
      (phrase) =>
        value.includes(phrase)
    )
  ) {
    return "bulk_update_leads";
  }

  const bulkTaskUpdateWords = [
    "update all tasks",
    "change all tasks",
    "mark all tasks",
    "update every task",
    "change every task",
    "mark every task",
    "sab tasks update",
    "sari tasks update",
    "all tasks update",
  ];

  if (
    bulkTaskUpdateWords.some(
      (phrase) =>
        value.includes(phrase)
    )
  ) {
    return "bulk_update_tasks";
  }

  const bulkWorkflowRunWords = [
    "run all workflows",
    "run every workflow",
    "execute all workflows",
    "execute every workflow",
    "sab workflows run",
    "saray workflows run",
    "all workflows run",
  ];

  if (
    bulkWorkflowRunWords.some(
      (phrase) =>
        value.includes(phrase)
    )
  ) {
    return "bulk_run_workflows";
  }

  return null;
}

function p9IsDangerousAction(
  text?: string
): boolean {
  return (
    p9DetectAction(text) !== null
  );
}

function p9GetActionLabel(
  action: P9ActionType
): string {
  switch (action) {
    case "delete_leads":
      return "delete leads";

    case "delete_tasks":
      return "delete tasks";

    case "delete_workflows":
      return "delete workflows";

    case "bulk_update_leads":
      return "bulk update leads";

    case "bulk_update_tasks":
      return "bulk update tasks";

    case "bulk_run_workflows":
      return "run multiple workflows";

    default:
      return "perform this bulk action";
  }
}

function p9GetRiskLevel(
  action: P9ActionType
): P9RiskLevel {
  if (
    action === "delete_leads" ||
    action === "delete_tasks" ||
    action === "delete_workflows"
  ) {
    return "high";
  }

  if (
    action === "bulk_update_leads" ||
    action === "bulk_update_tasks" ||
    action === "bulk_run_workflows"
  ) {
    return "medium";
  }

  return "low";
}

function p9CreatePlan(
  request: Request,
  action: P9ActionType,
  count?: number
): P9SafetyPlan {
  const memoryKey =
    p9GetMemoryKey(request);

  const plan: P9SafetyPlan = {
    id:
      `p9-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    action,
    risk:
      p9GetRiskLevel(action),
    description:
      p9GetActionLabel(action),
    count,
    createdAt: Date.now(),
  };

  p9Plans.set(
    memoryKey,
    plan
  );

  return plan;
}

function p9GetPendingPlan(
  request: Request
): P9SafetyPlan | null {
  const memoryKey =
    p9GetMemoryKey(request);

  return (
    p9Plans.get(memoryKey) ||
    null
  );
}

function p9ClearPlan(
  request: Request
): void {
  const memoryKey =
    p9GetMemoryKey(request);

  p9Plans.delete(
    memoryKey
  );
}

function p9BuildConfirmation(
  plan: P9SafetyPlan,
  language: string
): string {
  const countText =
    typeof plan.count === "number"
      ? `${plan.count} `
      : "";

  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    if (
      plan.risk === "high"
    ) {
      return `⚠️ Ye high-risk action hai.\n\n${countText}${plan.description} permanently remove ho sakte hain. Ye action easily undo nahi kiya ja sakta.\n\nKya aap proceed karna chahtay hain?`;
    }

    return `⚠️ Ye bulk action hai.\n\n${countText}${plan.description} ek saath affect honge.\n\nKya aap proceed karna chahtay hain?`;
  }

  if (language === "urdu") {
    if (
      plan.risk === "high"
    ) {
      return `⚠️ یہ ایک high-risk action ہے۔\n\n${countText}${plan.description} permanently remove ہو سکتے ہیں۔ یہ action آسانی سے undo نہیں کیا جا سکتا۔\n\nکیا آپ proceed کرنا چاہتے ہیں؟`;
    }

    return `⚠️ یہ ایک bulk action ہے۔\n\n${countText}${plan.description} ایک ساتھ affect ہوں گے۔\n\nکیا آپ proceed کرنا چاہتے ہیں؟`;
  }

  if (
    plan.risk === "high"
  ) {
    return `⚠️ This is a high-risk action.\n\n${countText}${plan.description} may be permanently removed. This action may not be easily reversible.\n\nWould you like me to proceed?`;
  }

  return `⚠️ This is a bulk action.\n\n${countText}${plan.description} will be affected at once.\n\nWould you like me to proceed?`;
}

function p9BuildCancellation(
  language: string
): string {
  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return "Theek hai — action cancel kar diya gaya. Koi change nahi kiya gaya.";
  }

  if (language === "urdu") {
    return "ٹھیک ہے — action cancel کر دیا گیا۔ کوئی change نہیں کیا گیا۔";
  }

  return "Understood — the action was cancelled. No changes were made.";
}

function p9BuildConfirmed(
  plan: P9SafetyPlan,
  language: string
): string {
  const action =
    p9GetActionLabel(
      plan.action
    );

  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return `Confirmed ✅ ${action} ke liye confirmation mil gayi hai.`;
  }

  if (language === "urdu") {
    return `Confirmed ✅ ${action} کے لیے confirmation مل گئی ہے۔`;
  }

  return `Confirmed ✅ Permission received to ${action}.`;
}

/* =========================================================
   P10 — FINAL AI COMMAND CENTER POLISH
   ========================================================= */

type P10AgentStage =
  | "understanding"
  | "planning"
  | "acting"
  | "verifying"
  | "completed"
  | "cancelled"
  | "error";

type P10AgentMeta = {
  stage: P10AgentStage;
  intent?: string;
  action?: string;
  verified?: boolean;
};

function p10Normalize(
  text?: string
): string {
  return (text || "")
    .trim()
    .replace(/\s+/g, " ");
}

function p10IsTechnicalText(
  text: string
): boolean {
  const value =
    p10Normalize(text).toLowerCase();

  return (
    value.includes(
      "i identified this as"
    ) ||
    value.includes(
      "intent classification"
    ) ||
    value.includes(
      "request classification"
    ) ||
    value.includes(
      "business automation request"
    ) ||
    value.includes(
      "system detected"
    )
  );
}

function p10CleanResponse(
  text: string
): string {
  let response =
    p10Normalize(text);

  if (
    p10IsTechnicalText(response)
  ) {
    response =
      response
        .replace(
          /^.*?[:\-]\s*/i,
          ""
        )
        .trim();
  }

  response =
    response
      .replace(
        /\n{3,}/g,
        "\n\n"
      )
      .trim();

  return response;
}

function p10BuildAgentMeta(
  stage: P10AgentStage,
  options?: {
    intent?: string;
    action?: string;
    verified?: boolean;
  }
): P10AgentMeta {
  return {
    stage,
    intent:
      options?.intent,
    action:
      options?.action,
    verified:
      options?.verified,
  };
}

function p10SuccessMeta(
  action?: string,
  intent?: string
): P10AgentMeta {
  return p10BuildAgentMeta(
    "completed",
    {
      action,
      intent,
      verified: true,
    }
  );
}

function p10ErrorMeta(
  intent?: string
): P10AgentMeta {
  return p10BuildAgentMeta(
    "error",
    {
      intent,
      verified: false,
    }
  );
}

function p10CancelledMeta(
  intent?: string
): P10AgentMeta {
  return p10BuildAgentMeta(
    "cancelled",
    {
      intent,
      verified: false,
    }
  );
}

function p10BuildNaturalError(
  language: string
): string {
  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return "Something went wrong while processing that request. Please try again.";
  }

  if (
    language === "urdu"
  ) {
    return "اس request کو process کرتے ہوئے مسئلہ پیش آیا۔ براہِ کرم دوبارہ کوشش کریں۔";
  }

  return "Something went wrong while processing that request. Please try again.";
}

function p10BuildNoResults(
  language: string
): string {
  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return "Mujhe is request ke liye koi matching results nahi mile.";
  }

  if (
    language === "urdu"
  ) {
    return "مجھے اس request کے لیے کوئی matching results نہیں ملے۔";
  }

  return "I couldn't find any matching results for that request.";
}

function p10BuildAgentStatus(
  language: string,
  stage: P10AgentStage
): string {
  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    switch (stage) {
      case "understanding":
        return "Samajh raha hoon…";

      case "planning":
        return "Plan bana raha hoon…";

      case "acting":
        return "Action perform kar raha hoon…";

      case "verifying":
        return "Result verify kar raha hoon…";

      case "completed":
        return "Done ✅";

      case "cancelled":
        return "Cancelled.";

      default:
        return "Processing…";
    }
  }

  if (
    language === "urdu"
  ) {
    switch (stage) {
      case "understanding":
        return "سمجھ رہا ہوں…";

      case "planning":
        return "Plan بنا رہا ہوں…";

      case "acting":
        return "Action perform کر رہا ہوں…";

      case "verifying":
        return "Result verify کر رہا ہوں…";

      case "completed":
        return "مکمل ✅";

      case "cancelled":
        return "Cancel کر دیا گیا۔";

      default:
        return "Processing…";
    }
  }

  switch (stage) {
    case "understanding":
      return "Understanding…";

    case "planning":
      return "Planning…";

    case "acting":
      return "Working on it…";

    case "verifying":
      return "Verifying result…";

    case "completed":
      return "Done ✅";

    case "cancelled":
      return "Cancelled.";

    default:
      return "Processing…";
  }
}

function p10BuildResultSummary(
  result: {
    created?: number;
    updated?: number;
    deleted?: number;
    verified?: number;
    failed?: number;
  },
  language: string
): string {
  const parts: string[] = [];

  if (
    typeof result.created ===
    "number"
  ) {
    parts.push(
      `${result.created} created`
    );
  }

  if (
    typeof result.updated ===
    "number"
  ) {
    parts.push(
      `${result.updated} updated`
    );
  }

  if (
    typeof result.deleted ===
    "number"
  ) {
    parts.push(
      `${result.deleted} deleted`
    );
  }

  if (
    typeof result.verified ===
    "number"
  ) {
    parts.push(
      `${result.verified} verified`
    );
  }

  if (
    typeof result.failed ===
    "number" &&
    result.failed > 0
  ) {
    parts.push(
      `${result.failed} failed`
    );
  }

  if (
    parts.length === 0
  ) {
    return "";
  }

  const summary =
    parts.join(" • ");

  if (
    language === "roman-urdu" ||
    language === "mixed"
  ) {
    return `Summary: ${summary}.`;
  }

  if (
    language === "urdu"
  ) {
    return `Summary: ${summary}۔`;
  }

  return `Summary: ${summary}.`;
}

function p10FormatList(
  items: string[],
  maxItems = 8
): string {
  if (
    items.length === 0
  ) {
    return "";
  }

  const visible =
    items.slice(
      0,
      maxItems
    );

  const lines =
    visible.map(
      (item) =>
        `• ${item}`
    );

  if (
    items.length > maxItems
  ) {
    lines.push(
      `• +${items.length - maxItems} more`
    );
  }

  return lines.join("\n");
}

function p10BuildCommandResponse(
  message: string,
  meta: P10AgentMeta
): {
  message: string;
  agent: P10AgentMeta;
} {
  return {
    message:
      p10CleanResponse(
        message
      ),
    agent: meta,
  };
}
/* =========================================================
   POST
   ========================================================= */

export async function POST(
  request: Request
) {
  try {
    let body: AIRequestBody;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request body.",
        },
        { status: 400 }
      );
    }
  const directMessage =
  typeof body.message ===
  "string"
    ? body.message.trim()
    : "";


  

    const conversationMessages =
      getSafeMessages(
        body.messages
      );

    let userMessage =
      directMessage;

    if (
      !userMessage &&
      conversationMessages.length >
        0
    ) {
      const lastUserMessage =
        [
          ...conversationMessages,
        ]
          .reverse()
          .find(
            (item) =>
              item.role === "user"
          );

      userMessage =
        lastUserMessage?.content ||
        "";
    }

    if (!userMessage) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide a message.",
        },
        { status: 400 }
      );
    }
  


    const language =
      detectLanguage(
        userMessage
      );
       
    /* =====================================================
   P8 — NATURAL PERSONALITY
   ===================================================== */

const p8Reply =
  p8Response(
    userMessage,
    language
  );

if (p8Reply) {
  return NextResponse.json({
    success: true,
    mode: "demo",
    type: "conversation",
    message: p8Reply,
    reply: p8Reply,
    language,
    usage: null,
  });
}
/* =====================================================
   P9 — SAFETY / CONFIRMATION
   ===================================================== */

const p9PendingPlan =
  p9GetPendingPlan(
    request
  );

/*
 * Existing P7 cleanup flow already has
 * its own PLAN → CONFIRM system.
 * Do not intercept P7 confirmation here.
 */

if (
  p9PendingPlan &&
  p9IsRejection(
    userMessage
  )
) {
  p9ClearPlan(
    request
  );

  const response =
    p9BuildCancellation(
      language
    );

  return NextResponse.json({
    success: true,
    mode: "demo",
    type:
      "safety_cancelled",
    message:
      response,
    reply:
      response,
    language,
    usage: null,
  });
}

if (
  p9PendingPlan &&
  p9IsConfirmation(
    userMessage
  )
) {
  const response =
    p9BuildConfirmed(
      p9PendingPlan,
      language
    );

  /*
   * P9 only grants confirmation here.
   * The existing action engine continues
   * after this safety gate.
   */

  p9ClearPlan(
    request
  );

  return NextResponse.json({
    success: true,
    mode: "demo",
    type:
      "safety_confirmed",
    message:
      response,
    reply:
      response,
    language,
    safety: {
      confirmed: true,
      action:
        p9PendingPlan.action,
      risk:
        p9PendingPlan.risk,
    },
    usage: null,
  });
}

const p9Action =
  p9DetectAction(
    userMessage
  );

if (
  p9Action &&
  !p7IsCleanupRequest(
    userMessage
  )
) {
  let p9Count:
    | number
    | undefined;

  if (
    p9Action ===
    "delete_leads" ||
    p9Action ===
    "bulk_update_leads"
  ) {
    p9Count =
      getLeads().length;
  }

  if (
    p9Action ===
    "delete_tasks" ||
    p9Action ===
    "bulk_update_tasks"
  ) {
    p9Count =
      getTasks().length;
  }

  const plan =
    p9CreatePlan(
      request,
      p9Action,
      p9Count
    );

  const response =
    p9BuildConfirmation(
      plan,
      language
    );

  return NextResponse.json({
    success: true,
    mode: "demo",
    type:
      "safety_confirmation_required",
    message:
      response,
    reply:
      response,
    language,
    safety: {
      required: true,
      confirmed: false,
      action:
        plan.action,
      risk:
        plan.risk,
      count:
        plan.count,
    },
    usage: null,
  });
}
      /* =====================================================
   P7 — CONFIRMATION
   ===================================================== */

if (
  p7IsConfirmation(
    userMessage
  )
) {
  const pendingPlan =
    p7GetPendingPlan(
      request
    );

  if (pendingPlan) {
    const result =
      p7ExecutePlan(
        request
      );

    const response =
      p7ExecutionResponse(
        result,
        language
      );

    return NextResponse.json({
      success: true,
      mode: "demo",
      type:
        "agent_execution",
      message:
        response,
      reply:
        response,
      language,
      agent: {
        name:
          "NexaFlow Lead Cleanup Agent",
        execution: [
          "PLAN",
          "CONFIRM",
          "EXECUTE",
          "VERIFY",
          "REPORT",
        ],
        status:
          "completed",
      },
      result,
      usage: null,
    });
  }
}
/* =====================================================
   P7 — CANCEL
   ===================================================== */

if (
  p7IsRejection(
    userMessage
  )
) {
  const pendingPlan =
    p7GetPendingPlan(
      request
    );

  if (pendingPlan) {
    p7ClearPlan(
      request
    );

    return NextResponse.json({
      success: true,
      mode: "demo",
      type:
        "agent_cancelled",
      message:
        language === "roman-urdu" ||
        language === "mixed"
          ? "Theek hai — cleanup cancel kar diya gaya. Koi change nahi kiya gaya."
          : language === "urdu"
            ? "ٹھیک ہے — cleanup cancel کر دیا گیا۔ کوئی change نہیں کیا گیا۔"
            : "Understood — cleanup cancelled. No changes were made.",
      reply:
        language === "roman-urdu" ||
        language === "mixed"
          ? "Theek hai — cleanup cancel kar diya gaya. Koi change nahi kiya gaya."
          : language === "urdu"
            ? "ٹھیک ہے — cleanup cancel کر دیا گیا۔ کوئی change نہیں کیا گیا۔"
            : "Understood — cleanup cancelled. No changes were made.",
      language,
      usage: null,
    });
  }
}
/* =====================================================
   P7 — PLAN
   ===================================================== */

if (
  p7IsCleanupRequest(
    userMessage
  )
) {
  const plan =
    p7CreatePlan(
      request
    );

  if (!plan) {
    return NextResponse.json({
      success: true,
      mode: "demo",
      type:
        "agent_plan",
      message:
        language === "roman-urdu" ||
        language === "mixed"
          ? "Mujhe koi inactive lead nahi mili jo cleanup ke liye action demand karti ho."
          : language === "urdu"
            ? "مجھے کوئی inactive lead نہیں ملی جس پر cleanup action کی ضرورت ہو۔"
            : "I couldn't find any leads that appear inactive and need cleanup.",
      reply:
        language === "roman-urdu" ||
        language === "mixed"
          ? "Mujhe koi inactive lead nahi mili jo cleanup ke liye action demand karti ho."
          : language === "urdu"
            ? "مجھے کوئی inactive lead نہیں ملی جس پر cleanup action کی ضرورت ہو۔"
            : "I couldn't find any leads that appear inactive and need cleanup.",
      language,
      usage: null,
    });
  }

  const response =
    p7PlanResponse(
      plan,
      language
    );

  return NextResponse.json({
    success: true,
    mode: "demo",
    type:
      "agent_plan",
    message:
      response,
    reply:
      response,
    language,
    agent: {
      name:
        "NexaFlow Lead Cleanup Agent",
      execution: [
        "PLAN",
        "CONFIRM",
        "EXECUTE",
        "VERIFY",
        "REPORT",
      ],
      status:
        "awaiting_confirmation",
    },
    plan: {
      id:
        plan.id,
      leadCount:
        plan.leadCount,
      leadIds:
        plan.leadIds,
      requiresConfirmation:
        true,
    },
    usage: null,
  });
}

/* =========================================================
   P4 — MULTI-STEP LEAD OPERATIONS AGENT
   READ → ANALYZE → ACT → VERIFY → REPORT
   ========================================================= */

type P4Lead = {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

type P4Task = {
  id: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  leadId?: string;
  workflowId?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
};

type P4AgentResult = {
  found: number;
  alreadyQualified: number;
  qualifiedNow: number;
  qualificationFailed: number;
  tasksCreated: number;
  duplicatesSkipped: number;
  taskFailures: number;
  verifiedQualified: number;
  verifiedTasks: number;
};

/* ---------------------------------------------------------
   P4 — REQUEST DETECTION
   --------------------------------------------------------- */
function isP4MultiStepRequest(
  text: string
): boolean {
  const value =
    normalize(text);

  const hasHighPriority =
    value.includes("high priority") ||
    value.includes("high-priority") ||
    value.includes("high leads") ||
    value.includes("high priority leads") ||
    value.includes("high-priority leads") ||
    value.includes("high-priority lead");

  const hasLead =
    value.includes("lead") ||
    value.includes("leads") ||
    value.includes("leadon");

  const hasQualify =
    value.includes("qualify") ||
    value.includes("qualified") ||
    value.includes("qualify them") ||
    value.includes("qualify all") ||
    value.includes("qualified hain") ||
    value.includes("qualified hain unko") ||
    value.includes("check kro") ||
    value.includes("check karo") ||
    value.includes("check kar");

  const hasFollowUp =
    value.includes("follow up") ||
    value.includes("follow-up") ||
    value.includes("followup") ||
    value.includes("follow ups") ||
    value.includes("follow-ups") ||
    value.includes("followups") ||
    value.includes("follow up laga") ||
    value.includes("follow up lag");

  const hasAction =
    value.includes("create") ||
    value.includes("make") ||
    value.includes("add") ||
    value.includes("banao") ||
    value.includes("banado") ||
    value.includes("bana do") ||
    value.includes("kar do") ||
    value.includes("kr do") ||
    value.includes("laga do") ||
    value.includes("lagado") ||
    value.includes("schedule") ||
    value.includes("scheduled") ||
    value.includes("set");

  const hasTomorrowOrTime =
    value.includes("tomorrow") ||
    value.includes("kal") ||
    value.includes("tomorrow morning") ||
    value.includes("kal subah") ||
    value.includes("10 baje") ||
    value.includes("10 am") ||
    value.includes("10:00");

  return (
    hasHighPriority &&
    hasLead &&
    hasQualify &&
    hasFollowUp &&
    (
      hasAction ||
      hasTomorrowOrTime
    )
  );
}

/* ---------------------------------------------------------
   P4 — PREVIOUS LEADS QUALIFICATION
   --------------------------------------------------------- */

function p4IsPreviousLeadQualificationRequest(
  text: string
): boolean {
  const value =
    normalize(text);

  return (
    value === "qualify" ||
    value === "qualify karo" ||
    value === "qualify kro" ||
    value === "qualify them" ||
    value === "qualify these" ||
    value === "qualify these leads" ||
    value === "qualify these leads karo" ||
    value === "inko qualify karo" ||
    value === "unko qualify karo" ||
    value === "in leads ko qualify karo" ||
    value === "in ko qualify karo"
  );
}

function p4QualifyPreviousLeads(
  leads: P4Lead[]
) {
  let qualifiedNow = 0;
  let alreadyQualified = 0;
  let failed = 0;

  for (
    const lead of leads
  ) {
    if (
      normalize(
        lead.status || ""
      ) === "qualified"
    ) {
      alreadyQualified++;
      continue;
    }

    try {
      const updated =
        updateLead(
          lead.id,
          {
            status:
              "qualified",
          }
        );

      if (updated) {
        qualifiedNow++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return {
    qualifiedNow,
    alreadyQualified,
    failed,
  };
}
/* ---------------------------------------------------------
   P4 — READ
   --------------------------------------------------------- */

function p4ReadHighPriorityLeads(
  userMessage?: string
): P4Lead[] {
  const allLeads =
    getLeads() as P4Lead[];

  const highPriority =
    allLeads.filter(
      (lead) =>
        normalize(
          lead.priority || ""
        ) === "high"
    );

  if (
    !userMessage ||
    !isThisWeek(userMessage)
  ) {
    return highPriority;
  }

  const weekStart =
    getStartOfWeek(
      new Date()
    );

  return highPriority.filter(
    (lead) => {
      if (!lead.createdAt) {
        return true;
      }

      const created =
        new Date(
          lead.createdAt
        );

      return created >= weekStart;
    }
  );
}

/* ---------------------------------------------------------
   P4 — ANALYZE
   --------------------------------------------------------- */

function p4AnalyzeLeads(
  leads: P4Lead[]
) {
  const alreadyQualified =
    leads.filter(
      (lead) =>
        normalize(
          lead.status || ""
        ) === "qualified"
    );

  const needsQualification =
    leads.filter(
      (lead) =>
        normalize(
          lead.status || ""
        ) !== "qualified"
    );

  return {
    alreadyQualified,
    needsQualification,
  };
}

/* ---------------------------------------------------------
   P4 — ACT: QUALIFY
   --------------------------------------------------------- */

function p4QualifyLeads(
  leads: P4Lead[]
) {
  let qualifiedNow = 0;
  let qualificationFailed = 0;

  for (
    const lead of leads
  ) {
    try {
      const updated =
        updateLead(
          lead.id,
          {
            status:
              "qualified",
          }
        );

      if (updated) {
        qualifiedNow++;
      } else {
        qualificationFailed++;
      }
    } catch {
      qualificationFailed++;
    }
  }

  return {
    qualifiedNow,
    qualificationFailed,
  };
}

/* ---------------------------------------------------------
   P4 — DUPLICATE DETECTION
   --------------------------------------------------------- */

function p4IsOpenFollowUpTask(
  task: P4Task,
  leadId: string
): boolean {
  if (
    task.leadId !== leadId
  ) {
    return false;
  }

  if (
    task.status ===
      "completed" ||
    task.status ===
      "cancelled"
  ) {
    return false;
  }

  const title =
    normalize(
      task.title || ""
    );

  return (
    title === "follow-up" ||
    title === "follow up" ||
    title === "followup" ||
    title.startsWith(
      "follow-up with"
    ) ||
    title.startsWith(
      "follow up with"
    ) ||
    title.startsWith(
      "followup with"
    )
  );
}

/* ---------------------------------------------------------
   P4 — ACT: CREATE FOLLOW-UP TASKS
   --------------------------------------------------------- */
  function p4CreateFollowUpTasks(
  leads: P4Lead[],
  userMessage: string
) {
  const tasks =
    getTasks() as P4Task[];

  const now =
    new Date();

  const dueDate =
    p6HasDateIntent(
      userMessage
    )
      ? p6ResolveDate(
          userMessage,
          now
        )
      : null;

  const qualifiedLeads =
    leads.filter(
      (lead) =>
        normalize(
          lead.status || ""
        ) === "qualified"
    );

  let tasksCreated = 0;
  let duplicatesSkipped = 0;
  let taskFailures = 0;

  const createdTaskIds: string[] = [];

  for (
    const lead of qualifiedLeads
  ) {
    const existing =
      tasks.find(
        (task) =>
          task.leadId === lead.id &&
          normalize(
            task.title || ""
          ) === "follow-up" &&
          task.status !==
            "completed" &&
          task.status !==
            "cancelled"
      );

    if (existing) {
      duplicatesSkipped++;
      continue;
    }

    try {
      const taskNow =
        new Date();

      const task: P4Task = {
        id:
          `task-ai-followup-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

        title:
          "Follow-up",

        description:
          `Follow-up with ${lead.name || "lead"}.`,

        priority:
          lead.priority === "high"
            ? "high"
            : lead.priority === "low"
              ? "low"
              : "medium",

        status:
          "pending",

        leadId:
          lead.id,

        createdAt:
          taskNow.toISOString(),

        updatedAt:
          taskNow.toISOString(),

        ...(dueDate
          ? {
              dueDate:
                dueDate.date.toISOString(),
            }
          : {}),
      };

      createTask(
        task as any
      );

      createdTaskIds.push(
        task.id
      );

      tasksCreated++;
    } catch {
      taskFailures++;
    }
  }

  return {
    tasksCreated,
    duplicatesSkipped,
    taskFailures,
    createdTaskIds,
  };
}


 
            
   
/* ---------------------------------------------------------
   P4 — VERIFY
   --------------------------------------------------------- */

function p4Verify(
  originalLeads: P4Lead[]
) {
  const currentLeads =
    getLeads() as P4Lead[];

  const currentTasks =
    getTasks() as P4Task[];

  const leadIds =
    new Set(
      originalLeads.map(
        (lead) =>
          lead.id
      )
    );

  const verifiedQualified =
    currentLeads.filter(
      (lead) =>
        leadIds.has(
          lead.id
        ) &&
        normalize(
          lead.status || ""
        ) === "qualified"
    ).length;

  const verifiedTasks =
    currentTasks.filter(
      (task) =>
        task.leadId &&
        leadIds.has(
          task.leadId
        ) &&
        p4IsOpenFollowUpTask(
          task,
          task.leadId
        )
    ).length;

  return {
    verifiedQualified,
    verifiedTasks,
  };
}

/* ---------------------------------------------------------
   P4 — COMPLETE AGENT
   --------------------------------------------------------- */

function runP4LeadAgent(
  userMessage?: string
): P4AgentResult {
  /*
   * READ
   */
  const leads =
    p4ReadHighPriorityLeads(
      userMessage
    );

  /*
   * ANALYZE
   */
  const {
    alreadyQualified,
    needsQualification,
  } =
    p4AnalyzeLeads(
      leads
    );

  /*
   * ACT — QUALIFY
   */
  const qualification =
    p4QualifyLeads(
      needsQualification
    );

  /*
   * ACT — CREATE FOLLOW-UPS
   *
   * Use all selected leads because:
   * - already-qualified leads also need follow-up
   * - newly-qualified leads also need follow-up
   * - duplicate protection prevents duplicate tasks
   */
  const taskResult =
     p4CreateFollowUpTasks(
  leads,
  userMessage || ""
)
  /*
   * VERIFY
   */
  const verification =
    p4Verify(
      leads
    );

  /*
   * REPORT DATA
   */
  return {
    found:
      leads.length,

    alreadyQualified:
      alreadyQualified.length,

    qualifiedNow:
      qualification.qualifiedNow,

    qualificationFailed:
      qualification.qualificationFailed,

    tasksCreated:
      taskResult.tasksCreated,

    duplicatesSkipped:
      taskResult.duplicatesSkipped,

    taskFailures:
      taskResult.taskFailures,

    verifiedQualified:
      verification.verifiedQualified,

    verifiedTasks:
      verification.verifiedTasks,
  };
}

/* ---------------------------------------------------------
   P4 — ENGLISH REPORT
   --------------------------------------------------------- */

function p4EnglishReport(
  result: P4AgentResult
): string {
  return `Multi-step agent completed successfully. 🤖

READ
• Found ${result.found} high-priority leads.

ANALYZE
• ${result.alreadyQualified} were already qualified.
• ${result.qualifiedNow} were qualified during this run.

ACT
• ${result.tasksCreated} follow-up ${
    result.tasksCreated === 1
      ? "task was"
      : "tasks were"
  } created.
• ${result.duplicatesSkipped} existing open follow-up ${
    result.duplicatesSkipped === 1
      ? "task was"
      : "tasks were"
  } skipped to prevent duplicates.

VERIFY
• ${result.verifiedQualified} leads are currently verified as qualified.
• ${result.verifiedTasks} open follow-up ${
    result.verifiedTasks === 1
      ? "task is"
      : "tasks are"
  } verified in the workspace.

REPORT
${result.qualificationFailed > 0
  ? `• ${result.qualificationFailed} lead qualification ${
      result.qualificationFailed === 1
        ? "failed"
        : "failures"
    } occurred.\n`
  : ""}${result.taskFailures > 0
  ? `• ${result.taskFailures} task ${
      result.taskFailures === 1
        ? "creation failed"
        : "creations failed"
    }.\n`
  : ""}The workspace was read, updated, and verified as part of the same operation.`;
}

/* ---------------------------------------------------------
   P4 — ROMAN URDU REPORT
   --------------------------------------------------------- */

function p4RomanUrduReport(
  result: P4AgentResult
): string {
  return `Multi-step agent successfully complete ho gaya. 🤖

READ
• ${result.found} high-priority leads mili hain.

ANALYZE
• ${result.alreadyQualified} leads pehle se qualified thi.
• ${result.qualifiedNow} leads is run mein qualify kar di hain.

ACT
• ${result.tasksCreated} follow-up ${
    result.tasksCreated === 1
      ? "task"
      : "tasks"
  } create kiye gaye.
• ${result.duplicatesSkipped} existing open follow-up ${
    result.duplicatesSkipped === 1
      ? "task"
      : "tasks"
  } duplicate se bachne ke liye skip kiye gaye.

VERIFY
• ${result.verifiedQualified} leads ab workspace mein qualified verify hui hain.
• ${result.verifiedTasks} open follow-up ${
    result.verifiedTasks === 1
      ? "task"
      : "tasks"
  } workspace mein verify hue hain.

REPORT
${result.qualificationFailed > 0
  ? `• ${result.qualificationFailed} lead qualification ${
      result.qualificationFailed === 1
        ? "fail hui"
        : "fail hui hain"
    }.\n`
  : ""}${result.taskFailures > 0
  ? `• ${result.taskFailures} task ${
      result.taskFailures === 1
        ? "create nahi ho saka"
        : "create nahi ho sakay"
    }.\n`
  : ""}AI ne READ → ANALYZE → ACT → VERIFY → REPORT complete kiya hai.`;
}

/* ---------------------------------------------------------
   P4 — URDU REPORT
   --------------------------------------------------------- */

function p4UrduReport(
  result: P4AgentResult
): string {
  return `Multi-step agent کامیابی سے مکمل ہو گیا۔ 🤖

READ
• ${result.found} high-priority leads ملیں۔

ANALYZE
• ${result.alreadyQualified} leads پہلے سے qualified تھیں۔
• ${result.qualifiedNow} leads کو اس run میں qualify کیا گیا۔

ACT
• ${result.tasksCreated} follow-up tasks create کیے گئے۔
• ${result.duplicatesSkipped} existing open follow-up tasks کو duplicate سے بچنے کے لیے skip کیا گیا۔

VERIFY
• ${result.verifiedQualified} leads کو workspace میں qualified verify کیا گیا۔
• ${result.verifiedTasks} open follow-up tasks workspace میں verify کیے گئے۔

REPORT
${result.qualificationFailed > 0
  ? `• ${result.qualificationFailed} lead qualifications fail ہوئیں۔\n`
  : ""}${result.taskFailures > 0
  ? `• ${result.taskFailures} task creations fail ہوئیں۔\n`
  : ""}AI نے READ → ANALYZE → ACT → VERIFY → REPORT مکمل کیا ہے۔`;
}

/* ---------------------------------------------------------
   P4 — LANGUAGE-AWARE REPORT
   --------------------------------------------------------- */

function p4BuildReport(
  result: P4AgentResult,
  userMessage: string
): string {
  const p5MemoryKey =
  p5GetMemoryKey(
    request,
    userMessage
  );

const p5Memory =
  p5GetMemory(
    p5MemoryKey
  );
  const language =
    detectLanguage(
      userMessage
    );

  if (
    language ===
    "roman-urdu" ||
    language ===
    "mixed"
  ) {
    return p4RomanUrduReport(
      result
    );
  }

  if (
    language === "urdu"
  ) {
    return p4UrduReport(
      result
    );
  }

  return p4EnglishReport(
    result
  );
}

    /* =====================================================
       NATURAL CONVERSATION
       ===================================================== */

    if (
      isGreeting(userMessage)
    ) {
      const response =
        getGreeting(language);

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge: "general",
        usage: null,
      });
    }

    if (
      isHowAreYou(
        userMessage
      )
    ) {
      const response =
        getHowAreYou(language);

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge: "general",
        usage: null,
      });
    }
    const p5MemoryKey =
  p5GetMemoryKey(
    request,
    userMessage
  );
        /* =====================================================
       P5 — CONVERSATION MEMORY / REFERENCE RESOLUTION
       ===================================================== */

    if (
      p5CanResolveReference(
        p5MemoryKey,
        userMessage
      )
    ) {
      if (
        p5IsOtherLeadsRequest(
          userMessage
        )
      ) {
        const otherLeads =
          p5ResolveOtherLeads(
            p5MemoryKey
          );

        const response =
          p5OtherLeadReport(
            userMessage,
            otherLeads
          );

        return NextResponse.json({
          success: true,
          mode: "demo",
          type:
            "conversation_memory",
          message:
            response,
          reply:
            response,
          language,
          memory: {
            enabled: true,
            resolved:
              "other_leads",
            count:
              otherLeads.length,
            leadIds:
              otherLeads.map(
                (lead) =>
                  lead.id
              ),
          },
          usage: null,
        });
      }

      const resolved =
        p5ResolveIntent(
          p5MemoryKey,
          userMessage
        );

      if (
        resolved.type ===
        "leads"
      ) {
        const leads =
          resolved.items as P5Lead[];

        const response =
          p5BuildMemoryResponse(
            userMessage,
            `Previous ${leads.length} leads ko reference kiya gaya hai: ${p5BuildLeadNames(leads)}.`
          );

        return NextResponse.json({
          success: true,
          mode: "demo",
          type:
            "conversation_memory",
          message:
            response,
          reply:
            response,
          language,
          memory: {
            enabled: true,
            resolved:
              "previous_leads",
            confidence:
              resolved.confidence,
            count:
              leads.length,
            leadIds:
              leads.map(
                (lead) =>
                  lead.id
              ),
            leadNames:
              leads.map(
                (lead) =>
                  lead.name ||
                  lead.id
              ),
          },
          usage: null,
        });
      }

      if (
        resolved.type ===
        "tasks"
      ) {
        const tasks =
          resolved.items as P5Task[];

        const response =
          p5BuildMemoryResponse(
            userMessage,
            `Previous ${tasks.length} tasks ko reference kiya gaya hai: ${p5BuildTaskNames(tasks)}.`
          );

        return NextResponse.json({
          success: true,
          mode: "demo",
          type:
            "conversation_memory",
          message:
            response,
          reply:
            response,
          language,
          memory: {
            enabled: true,
            resolved:
              "previous_tasks",
            confidence:
              resolved.confidence,
            count:
              tasks.length,
            taskIds:
              tasks.map(
                (task) =>
                  task.id
              ),
          },
          usage: null,
        });
      }
    }
    /* =====================================================
   P4 — QUALIFY PREVIOUS LEADS
   ===================================================== */

if (
  p4IsPreviousLeadQualificationRequest(
    userMessage
  )
) {
  const previousLeads =
    p5GetPreviousLeads(
      p5MemoryKey
    ) as P4Lead[];

  if (
    previousLeads.length === 0
  ) {
    const response =
      language === "roman-urdu" ||
      language === "mixed"
        ? "Mujhe previous leads nahi mil rahi. Pehle leads find/read karo, phir bolo: qualify karo."
        : language === "urdu"
          ? "مجھے previous leads نہیں مل رہیں۔ پہلے leads find/read کریں، پھر کہیں: qualify کرو۔"
          : "I couldn't find the previous leads. Please find or read the leads first, then ask me to qualify them.";

    return NextResponse.json({
      success: true,
      mode: "demo",
      type:
        "conversation_memory",
      message:
        response,
      reply:
        response,
      language,
      usage: null,
    });
  }

  const qualification =
    p4QualifyPreviousLeads(
      previousLeads
    );

  const verifiedLeads =
    getLeads() as P4Lead[];

  const verified =
    verifiedLeads.filter(
      (lead) =>
        previousLeads.some(
          (previous) =>
            previous.id ===
            lead.id
        ) &&
        normalize(
          lead.status || ""
        ) === "qualified"
    ).length;

  const response =
    language === "roman-urdu" ||
    language === "mixed"
      ? `Done ✅ Previous ${previousLeads.length} leads check kar li hain.\n\n• ${qualification.alreadyQualified} pehle se qualified thi.\n• ${qualification.qualifiedNow} leads qualify kar di hain.\n• ${qualification.failed} qualification failures.\n\nVERIFY\n• ${verified} leads ab qualified verify hui hain.`
      : language === "urdu"
        ? `مکمل ✅ Previous ${previousLeads.length} leads check کر لی گئی ہیں۔\n\n• ${qualification.alreadyQualified} پہلے سے qualified تھیں۔\n• ${qualification.qualifiedNow} leads کو qualify کیا گیا۔\n• ${qualification.failed} qualification failures۔\n\nVERIFY\n• ${verified} leads اب qualified verify ہوئی ہیں۔`
        : `Done ✅ I checked the previous ${previousLeads.length} leads.\n\n• ${qualification.alreadyQualified} were already qualified.\n• ${qualification.qualifiedNow} leads were qualified.\n• ${qualification.failed} qualification failures.\n\nVERIFY\n• ${verified} leads are now verified as qualified.`;

  return NextResponse.json({
    success: true,
    mode: "demo",
    type:
      "conversation_memory",
    message:
      response,
    reply:
      response,
    language,
    knowledge:
      "workspace",
    memory: {
      enabled: true,
      resolved:
        "previous_leads",
      count:
        previousLeads.length,
      leadIds:
        previousLeads.map(
          (lead) =>
            lead.id
        ),
    },
    action: {
      type:
        "qualify_previous_leads",
      status:
        "completed",
      count:
        qualification.qualifiedNow,
    },
    verification: {
      qualified:
        verified,
    },
    usage: null,
  });
}
    /* =====================================================
       P4 — MULTI-STEP AGENT
       READ → ANALYZE → ACT → VERIFY → REPORT
       ===================================================== */

    if (
      isP4MultiStepRequest(
        userMessage
      )
    ) {
      const agentResult =
        runP4LeadAgent(
          userMessage
        );

      const response =
        p4BuildReport(
          agentResult,
          userMessage
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        type:
          "multi_step_agent",
        message:
          response,
        reply:
          response,
        language,
        knowledge:
          "workspace",
        agent: {
          name:
            "NexaFlow Lead Operations Agent",
          execution: [
            "READ",
            "ANALYZE",
            "ACT",
            "VERIFY",
            "REPORT",
          ],
          result:
            agentResult,
        },
        action: {
          type:
            "multi_step_agent",
          status:
            "completed",
        },
        workflow: {
          intent:
            "Multi-step lead qualification and follow-up automation",
          priority:
            "High",
          actions: [
            "Read high-priority leads",
            "Analyze qualification status",
            "Qualify required leads",
            "Create follow-up tasks",
            "Prevent duplicate follow-ups",
            "Verify workspace changes",
            "Report execution results",
          ],
          status:
            "completed",
        },
        usage: null,
      });
    }
/* =====================================================
   P6 — DATE INTELLIGENCE
   ===================================================== */

if (
  p6IsPureDateQuestion(
    userMessage
  )
) {
  const resolvedDate =
    p6ResolveDate(
      userMessage
    );

  if (resolvedDate) {
    return NextResponse.json({
      success: true,
      mode: "demo",
      type:
        "date_intelligence",
      message:
        p6BuildDateResponse(
          userMessage
        ),
      reply:
        p6BuildDateResponse(
          userMessage
        ),
      language,
      date: {
        intent:
          resolvedDate.intent,
        label:
          resolvedDate.label,
        iso:
          resolvedDate.date.toISOString(),
        date:
          p6FormatDate(
            resolvedDate.date
          ),
        time:
          p6FormatTime(
            resolvedDate.date
          ),
        hour:
          resolvedDate.hour,
        minute:
          resolvedDate.minute,
        isExactTime:
          resolvedDate.isExactTime,
      },
      usage: null,
    });
  }
}
    /* =====================================================
       P3 — SCHEDULE EXACT PREVIOUS TASK BATCH
       ===================================================== */

    if (
      isScheduleRequest(
        userMessage
      )
    ) {
      const scheduled =
        schedulePreviousCreatedTasks(
          conversationMessages,
          userMessage,
          language
        );

      if (scheduled) {
        return NextResponse.json({
          success: true,
          mode: "demo",
          message:
            scheduled.message,
          reply:
            scheduled.message,
          language,
          knowledge:
            "workspace",
          action: {
            type:
              "schedule_followups",
            status:
              "completed",
            count:
              scheduled.count,
          },
          tasks:
            scheduled.tasks,
          usage: null,
        });
      }
    }

    /* =====================================================
       P3 — REAL TASK COUNT
       ===================================================== */

    if (
      isTaskCountQuestion(
        userMessage
      )
    ) {
      const verified =
        verifyPreviousCreatedTasks(
          conversationMessages,
          language
        );

      if (verified) {
        return NextResponse.json({
          success: true,
          mode: "demo",
          message: verified,
          reply: verified,
          language,
          knowledge:
            "workspace",
          action: {
            type:
              "verify_tasks",
            status:
              "completed",
          },
          usage: null,
        });
      }
    }

    /* =====================================================
       P3 — BULK FOLLOW-UP
       ===================================================== */

    if (
      isBulkFollowUpRequest(
        userMessage
      )
    ) {
      const previousLeads =
        getPreviousLeads(
          conversationMessages
        );

      const result =
        createBulkFollowUpTasks(
          previousLeads,
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message:
          result.message,
        reply:
          result.message,
        language,
        knowledge:
          "workspace",
        action: {
          type:
            "bulk_create_tasks",
          status:
            "completed",
          count:
            result.count,
        },
        tasks:
          result.tasks,
        workflow: {
          intent:
            "Bulk follow-up automation",
          priority:
            "High",
          actions: [
            "Read previous lead results",
            "Resolve lead references",
            "Create follow-up tasks",
            "Remember created task batch",
          ],
          status:
            "completed",
        },
        usage: null,
      });
    }

    /* =====================================================
       P3 — REAL LEAD READING
       ===================================================== */

    if (
      isLeadReadRequest(
        userMessage
      )
    ) {
      const leads =
        readRealLeads(
          userMessage
        );

      const response =
        getLeadReadResponse(
          leads,
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge:
          "workspace",
        leads,
        count:
          leads.length,
        filters: {
          priority:
            extractLeadPriority(
              userMessage
            ),
          status:
            extractLeadStatus(
              userMessage
            ),
          dateRange:
            isThisWeek(
              userMessage
            )
              ? "this_week"
              : isToday(
                    userMessage
                  )
                ? "today"
                : undefined,
        },
        action: {
          type:
            "read_leads",
          status:
            "completed",
          count:
            leads.length,
        },
        usage: null,
      });
    }

    /* =====================================================
       NEXAFLOW KNOWLEDGE
       ===================================================== */

    if (
      isCreatorQuestion(
        userMessage
      )
    ) {
      const response =
        getCreatorResponse(
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge:
          "creator",
        source:
          CREATOR_KNOWLEDGE,
        usage: null,
      });
    }

    if (
      isFaizaQuestion(
        userMessage
      )
    ) {
      const response =
        getFaizaResponse(
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge:
          "creator",
        source:
          CREATOR_KNOWLEDGE,
        usage: null,
      });
    }

    if (
      isProjectQuestion(
        userMessage
      )
    ) {
      const response =
        getProjectResponse(
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge:
          "nexaflow",
        source:
          NEXAFLOW_KNOWLEDGE,
        usage: null,
      });
    }

    if (
      isWhatAreYou(
        userMessage
      )
    ) {
      const response =
        getWhatAreYou(
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge:
          "nexaflow",
        source:
          NEXAFLOW_KNOWLEDGE,
        usage: null,
      });
    }

    if (
      isCapabilitiesQuestion(
        userMessage
      )
    ) {
      const response =
        getCapabilities(
          language
        );

      return NextResponse.json({
        success: true,
        mode: "demo",
        message: response,
        reply: response,
        language,
        knowledge:
          "nexaflow",
        source:
          NEXAFLOW_KNOWLEDGE,
        usage: null,
      });
    }

    /* =====================================================
       EXISTING EXECUTABLE COMMAND SYSTEM
       ===================================================== */

    const analysis =
      analyzeRequest(
        userMessage
      );

    const actionResult =
      await executeAICommand(
        userMessage
      );

    if (
      actionResult.handled
    ) {
      return NextResponse.json({
        success: true,
        mode: "demo",
        message:
          actionResult.message ||
          "Action completed successfully.",
        reply:
          actionResult.message ||
          "Action completed successfully.",
        language,
        action: {
          type:
            actionResult.type,
          status:
            "completed",
        },
        task:
          actionResult.task,
        tasks:
          actionResult.tasks,
        leads:
          actionResult.leads,
        count:
          actionResult.count,
        workflow: {
          intent:
            analysis.intent,
          priority:
            analysis.priority,
          actions:
            actionResult.type
              ? [
                  "Understand the request",
                  "Read workspace data",
                  "Execute the requested action",
                  "Track the result",
                ]
              : analysis.actions,
          status:
            "completed",
        },
        analysis: {
          intent:
            analysis.intent,
          sentiment:
            analysis.sentiment,
          priority:
            analysis.priority,
          confidence:
            analysis.confidence,
          actions:
            analysis.actions,
          suggestedReply:
            analysis.suggestedReply,
          recommendedAction:
            analysis.recommendedAction,
          actionType:
            analysis.actionType,
        },
        usage: null,
      });
    }

    /* =====================================================
       NORMAL BUSINESS INTELLIGENCE
       ===================================================== */

    return NextResponse.json({
      success: true,
      mode: "demo",
      message:
        analysis.response,
      reply:
        analysis.response,
      language,
      workflow: {
        intent:
          analysis.intent,
        priority:
          analysis.priority,
        actions:
          analysis.actions,
        status:
          "planned",
      },
      analysis: {
        intent:
          analysis.intent,
        sentiment:
          analysis.sentiment,
        priority:
          analysis.priority,
        confidence:
          analysis.confidence,
        actions:
          analysis.actions,
        suggestedReply:
          analysis.suggestedReply,
        recommendedAction:
          analysis.recommendedAction,
        actionType:
          analysis.actionType,
      },
      usage: null,
    });
  } catch (error) {
    console.error(
      "NexaFlow Demo AI error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process the request right now.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   GET
   ========================================================= */

export async function GET() {
  return NextResponse.json({
    success: true,
    service:
      "NexaFlow AI",
    status: "demo",
    mode: "free",
    capabilities: [
      "Natural language conversation",
      "English / Urdu / Roman Urdu / mixed-language understanding",
      "NexaFlow project knowledge",
      "Creator knowledge",
      "Real workspace lead reading",
      "Lead priority filtering",
      "Date-based lead filtering",
      "Previous-result lead references",
      "Bulk follow-up task creation",
      "Created-task batch memory",
      "Exact previous-task scheduling",
      "Tomorrow time understanding",
      "Actual task-count verification",
      "Business automation planning",
      "Task automation",
      "Lead management",
      "Workflow automation",
      "Customer-support intelligence",
      "Analytics assistance",
    ],
    creator:
      "Faiza Noor",
    portfolio:
      "https://faiza-noor10.vercel.app/",
    message:
      "NexaFlow AI Demo Mode is active. No external AI API credits are required.",
  });
}
