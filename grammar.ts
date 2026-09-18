import { GrammarRule } from '../types';

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'gram_1',
    title: 'أدوات التعريف والتنكير',
    titleFr: 'Les Articles Définis & Indéfinis',
    badge: 'أساسي جداً',
    summary: 'الأسماء في الفرنسية إما مذكرة أو مؤنثة، وتأخذ أداة مناسبة تحدد جنسها وعددها.',
    sections: [
      {
        heading: 'أولاً: أدوات التعريف (The / الـ التعريف)',
        explanation: 'تُستعمل للإشارة إلى شيء محدد ومعروف:',
        examples: [
          { french: 'Le livre', arabic: 'الكتاب (مذكر مفرد)', phonetics: 'لو ليفر' },
          { french: 'La table', arabic: 'الطاولة (مؤنث مفرد)', phonetics: 'لا تابل' },
          { french: "L'ami / L'école", arabic: 'الصديق / المدرسة (تبدأ بحرف صوتي)', phonetics: 'لامي / ليكول' },
          { french: 'Les enfants', arabic: 'الأطفال (جمع مذكر أو مؤنث)', phonetics: 'ليزانفان' },
        ],
      },
      {
        heading: 'ثانياً: أدوات التنكير (A / An / بعض)',
        explanation: 'تُستعمل للإشارة إلى شيء غير محدد:',
        examples: [
          { french: 'Un garçon', arabic: 'ولد / فتى (مذكر)', phonetics: 'أن جارسون' },
          { french: 'Une fille', arabic: 'بنت / فتاة (مؤنث)', phonetics: 'أون فيّ' },
          { french: 'Des stylos', arabic: 'أقلام (جمع)', phonetics: 'ديه ستيلو' },
        ],
      },
    ],
    proTip: 'نصيحة ذهبية: احفظ كل كلمة فرنسية جديدة دائماً مع أداتها (Un أو Une) لتعرف فوراً هل هي مذكرة أم مؤنثة!',
    commonMistake: {
      wrong: 'Le école',
      right: "L'école",
      explanation: 'عندما تبدأ الكلمة بحرف متحرك (a, e, i, o, u, y, h) تُحذف حركة الأداة ونضع فاصلة عليا L\'.',
    },
  },
  {
    id: 'gram_2',
    title: 'فعل الكينونة (Être) والملكية (Avoir)',
    titleFr: 'Les Verbes Auxiliaires : Être et Avoir',
    badge: 'أهم فعلين في الفرنسية',
    summary: 'الفعلان الأكثر استخداماً في كل المحادثات والتركيبات اللغوية.',
    sections: [
      {
        heading: 'تصريف فعل الكينونة (Être - To be)',
        explanation: 'يُستخدم للمهنة، الجنسية، والمشاعر:',
        table: {
          header: ['الضمير', 'التصريف', 'المعنى', 'مثال'],
          rows: [
            ['Je', 'suis', 'أنا أكون', 'Je suis content (أنا سعيد)'],
            ['Tu', 'es', 'أنت تكون', 'Tu es prêt (أنت جاهز)'],
            ['Il / Elle', 'est', 'هو / هي يكون', 'Il est médecin (هو طبيب)'],
            ['Nous', 'sommes', 'نحن نكون', 'Nous sommes en retard (تأخرنا)'],
            ['Vous', 'êtes', 'أنتم / حضرتك تكون', 'Vous êtes gentil (أنت لطيف)'],
            ['Ils / Elles', 'sont', 'هم يكونون', 'Ils sont ici (هم هنا)'],
          ],
        },
        examples: [
          { french: 'Je suis prêt pour le voyage.', arabic: 'أنا جاهز للسفر.', phonetics: 'جو سوي بريه بور لو فواياج.' },
        ],
      },
      {
        heading: 'تصريف فعل الملكية (Avoir - To have)',
        explanation: 'يُستخدم للملكية وللعمر أيضاً:',
        table: {
          header: ['الضمير', 'التصريف', 'المعنى', 'مثال'],
          rows: [
            ['Je', "J'ai", 'عندي / أملك', "J'ai 20 ans (عمري 20 سنة)"],
            ['Tu', 'as', 'عندك', 'Tu as faim (أنت جائع)'],
            ['Il / Elle', 'a', 'عنده / عندها', 'Elle a une voiture (لديها سيارة)'],
            ['Nous', 'avons', 'عندنا', 'Nous avons le temps (لدينا وقت)'],
            ['Vous', 'avez', 'عندكم', 'Vous avez des questions ? (عندكم أسئلة؟)'],
            ['Ils / Elles', 'ont', 'عندهم', 'Ils ont une belle maison (لديهم منزل جميل)'],
          ],
        },
        examples: [
          { french: "J'ai une idée formidable !", arabic: 'لديّ فكرة رائعة!', phonetics: 'جيه أون إيديه فورميدابل !' },
        ],
      },
    ],
    proTip: 'في الفرنسية نقول "عندي 20 سنة" (J’ai 20 ans) باستخدام فعل Avoir، ولا نقول "أنا أكون 20 سنة" كما في الإنجليزية!',
    commonMistake: {
      wrong: 'Je suis 25 ans',
      right: "J'ai 25 ans",
      explanation: 'العمر في الفرنسية يُعبّر عنه بفعل الملكية Avoir دائماً.',
    },
  },
  {
    id: 'gram_3',
    title: 'أسلوب النفي (La Négation)',
    titleFr: 'La Règle du Ne... Pas',
    badge: 'قاعدة الشطيرة السحرية',
    summary: 'النفي في الفرنسية يشبه الشطيرة (Sandwich): نضع الفعل بين Ne في البداية و Pas في النهاية.',
    sections: [
      {
        heading: 'الصيغة القياسية: [ Ne + الفعل + Pas ]',
        explanation: 'ببساطة خذ أي جملة وضع Ne قبل الفعل و Pas بعده مباشرة:',
        examples: [
          { french: 'Je parle français', arabic: 'أنا أتحدث الفرنسية (إثبات)', phonetics: 'جو بارل فرانسيه' },
          { french: 'Je ne parle pas français', arabic: 'أنا لا أتحدث الفرنسية (نفي)', phonetics: 'جو نو بارل با فرانسيه' },
          { french: 'Il comprend', arabic: 'هو يفهم', phonetics: 'إيل كومبران' },
          { french: 'Il ne comprend pas', arabic: 'هو لا يفهم', phonetics: 'إيل نو كومبران با' },
        ],
      },
      {
        heading: 'عندما يبدأ الفعل بحرف صوتي:',
        explanation: 'تتحول Ne إلى N\' لتسهيل النطق وسلاسة الكلام:',
        examples: [
          { french: "Je n'aime pas le froid.", arabic: 'أنا لا أحب البرد.', phonetics: 'جو نيم با لو فروا.' },
          { french: "Ce n'est pas possible.", arabic: 'هذا غير ممكن.', phonetics: 'سو نيه با بوسيدل.' },
        ],
      },
    ],
    proTip: 'في المحادثة الفرنسية اليومية السريعة والشارع، كثيراً ما يسقط الفرنسيون كلمة Ne ويقولون "Je sais pas" بدلاً من "Je ne sais pas"!',
    commonMistake: {
      wrong: 'Je ne pas sais',
      right: 'Je ne sais pas',
      explanation: 'الفعل يجب أن يكون محصوراً في الوسط بين ne و pas.',
    },
  },
  {
    id: 'gram_4',
    title: 'أدوات الاستفهام والأسئلة الشائعة',
    titleFr: 'Les Mots Interrogatifs',
    badge: 'كيف تسأل بذكاء',
    summary: 'الكلمات التي تحتاجها لطرح أي سؤال في الشارع، المطار، أو الفندق.',
    sections: [
      {
        heading: 'قائمة أدوات الاستفهام الذهبية',
        explanation: 'احفظ هذه الأدوات وستتمكن من السؤال عن أي شيء تريده:',
        examples: [
          { french: 'Où ?', arabic: 'أين؟', phonetics: 'أو' },
          { french: 'Quand ?', arabic: 'متى؟', phonetics: 'كان' },
          { french: 'Comment ?', arabic: 'كيف؟', phonetics: 'كومون' },
          { french: 'Pourquoi ?', arabic: 'لماذا؟', phonetics: 'بوركوا' },
          { french: 'Qui ?', arabic: 'مَن؟', phonetics: 'كي' },
          { french: 'Combien ?', arabic: 'كم؟', phonetics: 'كومبيان' },
          { french: "Qu'est-ce que... ?", arabic: 'ماذا...؟', phonetics: 'كيسكو... ؟' },
        ],
      },
    ],
    proTip: 'لتحويل أي جملة عادية إلى سؤال، يمكنك ببساطة رفع نبرة صوتك في نهاية الجملة! مثلاً: "Vous êtes prêt ?" (هل أنت جاهز؟).',
  },
];
