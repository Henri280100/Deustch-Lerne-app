// All lesson content lives in this one file, on purpose: to add a new lesson,
// copy an object below and change the fields. No database migration needed.
//
// Shared fields: id, level ('beginner'|'intermediate'|'advanced'),
// skill ('grammar'|'reading'|'writing'|'listening'|'speaking'), title, summary
//
// Skill-specific `content` shapes are documented above each section.

const nounBank = require("./nouns");
const { generateLessons } = require("./generateLessons");

const curatedLessons = [
  // ---------------------------------------------------------------------
  // GRAMMAR — content: { explanation, examples[{de, en}], quiz[{question, options, answerIndex}] }
  // ---------------------------------------------------------------------
  {
    id: "gr-beg-1",
    level: "beginner",
    skill: "grammar",
    title: "Sein and haben",
    summary: "The two verbs you'll use in almost every sentence.",
    content: {
      explanation:
        "\"Sein\" (to be) and \"haben\" (to have) are irregular but essential. Learn their present-tense forms by heart before anything else — most other grammar leans on them.",
      examples: [
        { de: "Ich bin müde.", en: "I am tired." },
        { de: "Du hast einen Hund.", en: "You have a dog." },
        { de: "Er ist Lehrer.", en: "He is a teacher." },
        { de: "Wir haben Zeit.", en: "We have time." }
      ],
      quiz: [
        {
          question: "Wie heißt \"we are\" auf Deutsch?",
          options: ["wir sind", "wir bin", "wir ist", "wir haben"],
          answerIndex: 0
        },
        {
          question: "___ du Geschwister? (Do you have siblings?)",
          options: ["Bist", "Hast", "Ist", "Habt"],
          answerIndex: 1
        },
        {
          question: "Complete: Sie ___ meine Schwester.",
          options: ["hat", "ist", "sind", "habt"],
          answerIndex: 1
        }
      ]
    }
  },
  {
    id: "gr-beg-2",
    level: "beginner",
    skill: "grammar",
    title: "Der, die, das — noun genders",
    summary: "Why every German noun carries a gender, and how to guess it.",
    content: {
      explanation:
        "Every German noun is masculine (der), feminine (die), or neuter (das). There's no foolproof rule, but patterns help: words ending in -e are often feminine, words ending in -chen or -lein are always neuter, and words for male people/animals are usually masculine.",
      examples: [
        { de: "der Tisch", en: "the table (masc.)" },
        { de: "die Lampe", en: "the lamp (fem.)" },
        { de: "das Mädchen", en: "the girl (neut. — -chen rule!)" },
        { de: "die Straße", en: "the street (fem.)" }
      ],
      quiz: [
        {
          question: "Which article goes with \"Buch\" (book)?",
          options: ["der", "die", "das", "den"],
          answerIndex: 2
        },
        {
          question: "\"Mädchen\" is neuter because...",
          options: [
            "it ends in -chen",
            "all people are neuter",
            "it's a short word",
            "there's no reason"
          ],
          answerIndex: 0
        },
        {
          question: "Which article goes with \"Blume\" (flower)?",
          options: ["der", "die", "das", "dem"],
          answerIndex: 1
        }
      ]
    }
  },
  {
    id: "gr-int-1",
    level: "intermediate",
    skill: "grammar",
    title: "The Dative Case",
    summary: "Marking indirect objects — and the prepositions that always trigger it.",
    content: {
      explanation:
        "The dative case marks the indirect object (to/for whom something happens) and follows fixed prepositions like \"mit, nach, bei, seit, von, zu, aus\". Articles change: der→dem, die→der, das→dem, die(pl)→den (+n on the noun).",
      examples: [
        { de: "Ich gebe dem Mann das Buch.", en: "I give the man the book." },
        { de: "Sie fährt mit dem Auto.", en: "She travels by car." },
        { de: "Wir wohnen bei den Großeltern.", en: "We live at our grandparents'." }
      ],
      quiz: [
        {
          question: "Ich helfe ___ Frau. (helfen takes dative)",
          options: ["die", "der", "den", "das"],
          answerIndex: 1
        },
        {
          question: "Er kommt aus ___ Schweiz.",
          options: ["der", "die", "das", "dem"],
          answerIndex: 0
        },
        {
          question: "Which prepositions always take the dative?",
          options: [
            "für, ohne, gegen",
            "mit, nach, bei, seit",
            "durch, um, entlang",
            "an, auf, in"
          ],
          answerIndex: 1
        }
      ]
    }
  },
  {
    id: "gr-int-2",
    level: "intermediate",
    skill: "grammar",
    title: "Modal verbs and word order",
    summary: "Können, müssen, wollen — and where the second verb goes.",
    content: {
      explanation:
        "Modal verbs (können, müssen, wollen, dürfen, sollen, mögen) take a second, unconjugated verb that jumps to the very end of the sentence — this \"verb bracket\" is one of the most distinctive features of German word order.",
      examples: [
        { de: "Ich kann gut Deutsch sprechen.", en: "I can speak German well." },
        { de: "Wir müssen morgen früh aufstehen.", en: "We have to get up early tomorrow." },
        { de: "Sie will nächstes Jahr nach Berlin ziehen.", en: "She wants to move to Berlin next year." }
      ],
      quiz: [
        {
          question: "Where does the infinitive go with a modal verb?",
          options: ["Right after the modal", "At the end of the clause", "At the start", "It disappears"],
          answerIndex: 1
        },
        {
          question: "Ich ___ heute nicht arbeiten. (don't have to)",
          options: ["muss", "kann", "will", "muss nicht"],
          answerIndex: 3
        },
        {
          question: "Correct order: Du (musst / die Hausaufgaben / machen)",
          options: [
            "Du musst machen die Hausaufgaben.",
            "Du musst die Hausaufgaben machen.",
            "Du die Hausaufgaben musst machen.",
            "Machen du musst die Hausaufgaben."
          ],
          answerIndex: 1
        }
      ]
    }
  },
  {
    id: "gr-adv-1",
    level: "advanced",
    skill: "grammar",
    title: "Konjunktiv II",
    summary: "Talking about hypotheticals, wishes, and polite requests.",
    content: {
      explanation:
        "Konjunktiv II expresses hypothetical or unreal situations (\"if I were...\"), polite requests, and wishes. For most verbs it's formed with würde + infinitive; sein, haben, and modals have their own irregular forms (wäre, hätte, könnte, müsste...).",
      examples: [
        { de: "Wenn ich reich wäre, würde ich reisen.", en: "If I were rich, I would travel." },
        { de: "Könnten Sie mir bitte helfen?", en: "Could you please help me?" },
        { de: "Ich hätte gern einen Kaffee.", en: "I would like a coffee." }
      ],
      quiz: [
        {
          question: "Which is the Konjunktiv II of \"sein\" for \"ich\"?",
          options: ["ich bin", "ich war", "ich wäre", "ich sei"],
          answerIndex: 2
        },
        {
          question: "Most regular verbs form Konjunktiv II with...",
          options: ["a special ending only", "würde + infinitive", "the past tense", "haben + participle"],
          answerIndex: 1
        },
        {
          question: "\"Wenn ich Zeit ___, würde ich kommen.\"",
          options: ["habe", "hätte", "hatte", "haben"],
          answerIndex: 1
        }
      ]
    }
  },
  {
    id: "gr-adv-2",
    level: "advanced",
    skill: "grammar",
    title: "Passive voice and nominalization",
    summary: "Shifting focus away from the doer — common in formal and written German.",
    content: {
      explanation:
        "The passive voice (werden + past participle) shifts focus from who does an action to what happens. It's everywhere in news, academic, and business German. Nominalization — turning verbs into nouns (entscheiden → die Entscheidung) — is the other hallmark of formal written style.",
      examples: [
        { de: "Das Projekt wird nächste Woche abgeschlossen.", en: "The project will be finished next week." },
        { de: "Die Entscheidung wurde gestern getroffen.", en: "The decision was made yesterday." },
        { de: "Der Bericht ist geschrieben worden.", en: "The report has been written." }
      ],
      quiz: [
        {
          question: "The passive voice is formed with...",
          options: ["sein + participle", "werden + participle", "haben + participle", "würde + participle"],
          answerIndex: 1
        },
        {
          question: "Nominalize \"entscheiden\" (to decide):",
          options: ["die Entscheider", "das Entscheiden", "die Entscheidung", "der Entschieden"],
          answerIndex: 2
        },
        {
          question: "\"Der Brief ___ gestern geschickt.\"",
          options: ["ist", "wird", "wurde", "hat"],
          answerIndex: 2
        }
      ]
    }
  },

  // ---------------------------------------------------------------------
  // READING — content: { passage, quiz[{question, options, answerIndex}] }
  // ---------------------------------------------------------------------
  {
    id: "re-beg-1",
    level: "beginner",
    skill: "reading",
    title: "Meine Familie",
    summary: "A short passage introducing a family, with basic vocabulary.",
    content: {
      passage:
        "Ich heiße Anna und ich bin 24 Jahre alt. Ich wohne in München. Meine Familie ist klein: mein Vater heißt Peter, meine Mutter heißt Sabine. Ich habe einen Bruder. Er heißt Tom und ist 20 Jahre alt. Wir haben auch einen Hund. Er heißt Bello. Am Wochenende kochen wir zusammen und spielen Karten.",
      quiz: [
        { question: "Wie alt ist Anna?", options: ["20", "22", "24", "26"], answerIndex: 2 },
        { question: "Wo wohnt Anna?", options: ["Berlin", "München", "Hamburg", "Köln"], answerIndex: 1 },
        { question: "Wie heißt der Hund?", options: ["Tom", "Bello", "Peter", "Max"], answerIndex: 1 },
        { question: "Was machen sie am Wochenende?", options: ["Sie arbeiten.", "Sie kochen und spielen Karten.", "Sie schlafen viel.", "Sie reisen."], answerIndex: 1 }
      ]
    }
  },
  {
    id: "re-beg-2",
    level: "beginner",
    skill: "reading",
    title: "Ein Tag im Café",
    summary: "Simple present-tense storytelling about an everyday routine.",
    content: {
      passage:
        "Jeden Morgen gehe ich in ein kleines Café. Der Kaffee dort ist sehr gut. Ich bestelle immer einen Cappuccino und ein Croissant. Der Kellner heißt Jonas und er ist sehr freundlich. Ich lese die Zeitung und höre Musik. Nach dreißig Minuten gehe ich zur Arbeit.",
      quiz: [
        { question: "Was bestellt die Person?", options: ["Tee und Kuchen", "Cappuccino und Croissant", "Wasser und Brot", "Saft und Obst"], answerIndex: 1 },
        { question: "Wie heißt der Kellner?", options: ["Tom", "Peter", "Jonas", "Max"], answerIndex: 2 },
        { question: "Wie lange bleibt die Person im Café?", options: ["10 Minuten", "20 Minuten", "30 Minuten", "1 Stunde"], answerIndex: 2 }
      ]
    }
  },
  {
    id: "re-int-1",
    level: "intermediate",
    skill: "reading",
    title: "Umzug nach Berlin",
    summary: "A longer narrative with past tense and connector words.",
    content: {
      passage:
        "Letztes Jahr bin ich nach Berlin gezogen, weil ich einen neuen Job gefunden habe. Zuerst war es schwierig, weil ich niemanden kannte und die Stadt riesig ist. Nach ein paar Monaten habe ich jedoch neue Freunde gefunden, und jetzt fühle ich mich zu Hause. Am meisten mag ich die vielen Parks und die internationale Atmosphäre der Stadt. Manchmal vermisse ich trotzdem meine alte Heimatstadt, besonders wenn meine Familie dort Feste feiert.",
      quiz: [
        { question: "Warum ist die Person nach Berlin gezogen?", options: ["Wegen der Familie", "Wegen eines neuen Jobs", "Wegen des Wetters", "Wegen der Universität"], answerIndex: 1 },
        { question: "Was war am Anfang schwierig?", options: ["Die Sprache", "Das Essen", "Niemanden zu kennen", "Die Arbeit"], answerIndex: 2 },
        { question: "Was vermisst die Person manchmal?", options: ["Das Wetter", "Die alte Heimatstadt", "Ihr altes Auto", "Ihre alte Wohnung"], answerIndex: 1 }
      ]
    }
  },
  {
    id: "re-int-2",
    level: "intermediate",
    skill: "reading",
    title: "Nachhaltigkeit im Alltag",
    summary: "An opinion-style text on everyday sustainability habits.",
    content: {
      passage:
        "Immer mehr Menschen in Deutschland achten auf einen nachhaltigen Lebensstil. Viele kaufen Gemüse auf dem Wochenmarkt statt im Supermarkt, weil die Produkte oft regional sind. Andere verzichten auf das Auto und fahren stattdessen mit dem Fahrrad oder mit öffentlichen Verkehrsmitteln. Kritiker meinen jedoch, dass echte Veränderung nur durch politische Maßnahmen möglich ist, nicht nur durch individuelles Verhalten.",
      quiz: [
        { question: "Warum kaufen viele Menschen auf dem Wochenmarkt ein?", options: ["Es ist billiger.", "Die Produkte sind oft regional.", "Es gibt mehr Auswahl.", "Es ist schneller."], answerIndex: 1 },
        { question: "Was sagen Kritiker?", options: ["Individuelles Verhalten reicht aus.", "Politik ist nicht wichtig.", "Echte Veränderung braucht Politik.", "Nachhaltigkeit ist unwichtig."], answerIndex: 2 }
      ]
    }
  },
  {
    id: "re-adv-1",
    level: "advanced",
    skill: "reading",
    title: "Die Zukunft der Arbeit",
    summary: "A dense, opinion-driven text with subordinate clauses and nominal style.",
    content: {
      passage:
        "Die Digitalisierung verändert die Arbeitswelt in einem Tempo, das viele Unternehmen kaum bewältigen können. Während einige Berufe durch Automatisierung überflüssig werden, entstehen gleichzeitig neue Tätigkeitsfelder, die vor zehn Jahren noch undenkbar gewesen wären. Ökonomen sind sich uneinig darüber, ob diese Entwicklung langfristig zu mehr oder weniger Beschäftigung führen wird. Klar ist jedoch, dass lebenslanges Lernen zu einer Notwendigkeit geworden ist, wenn man mit dem Wandel Schritt halten möchte.",
      quiz: [
        { question: "Was ist laut Text eine Notwendigkeit geworden?", options: ["Frühe Rente", "Lebenslanges Lernen", "Weniger Arbeit", "Mehr Automatisierung"], answerIndex: 1 },
        { question: "Worüber sind sich Ökonomen uneinig?", options: ["Ob Digitalisierung existiert", "Die Auswirkung auf die Beschäftigung", "Die Kosten der Automatisierung", "Den Zeitpunkt des Wandels"], answerIndex: 1 },
        { question: "\"Überflüssig\" bedeutet in diesem Kontext am ehesten...", options: ["notwendig", "nicht mehr gebraucht", "sehr gefragt", "neu erfunden"], answerIndex: 1 }
      ]
    }
  },

  // ---------------------------------------------------------------------
  // LISTENING — content: { text (spoken via TTS), lang, quiz[...] }
  // ---------------------------------------------------------------------
  {
    id: "li-beg-1",
    level: "beginner",
    skill: "listening",
    title: "Im Restaurant",
    summary: "Listen to a short exchange and answer questions about it.",
    content: {
      lang: "de-DE",
      text: "Guten Tag! Ich möchte einen Tisch für zwei Personen, bitte. Wir hätten gern die Speisekarte. Ich nehme die Suppe und meine Freundin nimmt den Salat. Können wir auch zwei Gläser Wasser bekommen? Vielen Dank!",
      quiz: [
        { question: "Für wie viele Personen ist der Tisch?", options: ["Eine", "Zwei", "Drei", "Vier"], answerIndex: 1 },
        { question: "Was bestellt die sprechende Person?", options: ["Salat", "Suppe", "Pizza", "Kuchen"], answerIndex: 1 },
        { question: "Was möchten sie zu trinken?", options: ["Wein", "Wasser", "Saft", "Kaffee"], answerIndex: 1 }
      ]
    }
  },
  {
    id: "li-beg-2",
    level: "beginner",
    skill: "listening",
    title: "Wetterbericht",
    summary: "A simple weather report — practice numbers and everyday vocabulary.",
    content: {
      lang: "de-DE",
      text: "Guten Morgen! Hier ist der Wetterbericht für heute. Es ist bewölkt und kühl, ungefähr fünfzehn Grad. Am Nachmittag regnet es ein bisschen. Nehmen Sie also einen Regenschirm mit. Morgen wird es sonniger und wärmer, bis zu zwanzig Grad.",
      quiz: [
        { question: "Wie ist das Wetter heute Morgen?", options: ["Sonnig und warm", "Bewölkt und kühl", "Sehr heiß", "Verschneit"], answerIndex: 1 },
        { question: "Wie viel Grad sind es ungefähr?", options: ["5", "15", "25", "30"], answerIndex: 1 },
        { question: "Was soll man mitnehmen?", options: ["Eine Sonnenbrille", "Einen Regenschirm", "Eine Jacke aus Wolle", "Nichts"], answerIndex: 1 }
      ]
    }
  },
  {
    id: "li-int-1",
    level: "intermediate",
    skill: "listening",
    title: "Ein Vorstellungsgespräch",
    summary: "A short mock job interview exchange.",
    content: {
      lang: "de-DE",
      text: "Erzählen Sie mir bitte etwas über sich. Ich habe Wirtschaft studiert und drei Jahre Erfahrung im Marketing. In meiner letzten Stelle habe ich ein Team von fünf Personen geleitet. Ich suche jetzt eine neue Herausforderung, bei der ich mehr Verantwortung übernehmen kann. Meine Stärken sind Organisation und Kommunikation.",
      quiz: [
        { question: "Was hat die Person studiert?", options: ["Medizin", "Wirtschaft", "Jura", "Informatik"], answerIndex: 1 },
        { question: "Wie viele Personen hat sie geleitet?", options: ["Drei", "Vier", "Fünf", "Zehn"], answerIndex: 2 },
        { question: "Was sind ihre genannten Stärken?", options: ["Kreativität und Geduld", "Organisation und Kommunikation", "Technik und Design", "Sprachen und Reisen"], answerIndex: 1 }
      ]
    }
  },
  {
    id: "li-adv-1",
    level: "advanced",
    skill: "listening",
    title: "Podcast: Klimapolitik",
    summary: "A denser, opinion-style monologue on climate policy.",
    content: {
      lang: "de-DE",
      text: "Viele Expertinnen und Experten sind sich einig, dass die bisherigen Maßnahmen zur Reduktion von Emissionen nicht ausreichen, um die Klimaziele zu erreichen. Es wird diskutiert, ob strengere Vorschriften für die Industrie notwendig sind oder ob marktbasierte Instrumente wie ein höherer CO2-Preis wirkungsvoller wären. Kritiker warnen jedoch davor, dass zu strenge Regeln die Wirtschaft schwächen könnten, während Befürworter argumentieren, dass Untätigkeit langfristig teurer wird.",
      quiz: [
        { question: "Worüber sind sich viele Experten einig?", options: ["Die Maßnahmen reichen aus.", "Die Maßnahmen reichen nicht aus.", "Es gibt kein Klimaproblem.", "Die Industrie braucht keine Regeln."], answerIndex: 1 },
        { question: "Was schlagen manche als Alternative vor?", options: ["Weniger Steuern", "Einen höheren CO2-Preis", "Mehr Subventionen für Kohle", "Keine Regulierung"], answerIndex: 1 },
        { question: "Wovor warnen Kritiker?", options: ["Vor zu wenig Wirtschaftswachstum durch strenge Regeln", "Vor zu viel Innovation", "Vor sinkenden Emissionen", "Vor zu billiger Energie"], answerIndex: 0 }
      ]
    }
  },

  // ---------------------------------------------------------------------
  // SPEAKING — content: { instructions, phrases[{de, en}] }
  // Compared client-side against Web Speech API transcript.
  // ---------------------------------------------------------------------
  {
    id: "sp-beg-1",
    level: "beginner",
    skill: "speaking",
    title: "Sich vorstellen",
    summary: "Practice introducing yourself out loud.",
    content: {
      instructions: "Listen to each phrase, then press record and say it back in German.",
      phrases: [
        { de: "Hallo, ich heiße Anna.", en: "Hello, my name is Anna." },
        { de: "Ich komme aus Kanada.", en: "I come from Canada." },
        { de: "Ich wohne in Berlin.", en: "I live in Berlin." },
        { de: "Wie heißt du?", en: "What is your name?" }
      ]
    }
  },
  {
    id: "sp-beg-2",
    level: "beginner",
    skill: "speaking",
    title: "Im Geschäft",
    summary: "Everyday shopping phrases to practice out loud.",
    content: {
      instructions: "Listen to each phrase, then press record and say it back in German.",
      phrases: [
        { de: "Was kostet das?", en: "How much does that cost?" },
        { de: "Ich hätte gern zwei Äpfel.", en: "I would like two apples." },
        { de: "Haben Sie das in Größe M?", en: "Do you have that in size M?" },
        { de: "Kann ich mit Karte zahlen?", en: "Can I pay by card?" }
      ]
    }
  },
  {
    id: "sp-int-1",
    level: "intermediate",
    skill: "speaking",
    title: "Meine Meinung sagen",
    summary: "Practice expressing opinions with more complex sentences.",
    content: {
      instructions: "Listen to each phrase, then press record and say it back in German.",
      phrases: [
        { de: "Meiner Meinung nach ist das eine gute Idee.", en: "In my opinion, that's a good idea." },
        { de: "Ich stimme dir nicht ganz zu.", en: "I don't entirely agree with you." },
        { de: "Das kommt darauf an, wie man es sieht.", en: "That depends on how you look at it." }
      ]
    }
  },
  {
    id: "sp-adv-1",
    level: "advanced",
    skill: "speaking",
    title: "Eine Diskussion führen",
    summary: "Practice fluent, connected sentences used in debate.",
    content: {
      instructions: "Listen to each phrase, then press record and say it back in German.",
      phrases: [
        { de: "Auf der einen Seite gibt es Vorteile, auf der anderen Seite auch Nachteile.", en: "On the one hand there are advantages, on the other hand also disadvantages." },
        { de: "Es lässt sich nicht leugnen, dass wir handeln müssen.", en: "It cannot be denied that we need to act." },
        { de: "Abschließend lässt sich sagen, dass beide Standpunkte berechtigt sind.", en: "In conclusion, both viewpoints are valid." }
      ]
    }
  },

  // ---------------------------------------------------------------------
  // WRITING — content: { prompt, minWords, keywords[], sampleAnswer }
  // Graded with a lightweight self-check heuristic, not an AI grader.
  // ---------------------------------------------------------------------
  {
    id: "wr-beg-1",
    level: "beginner",
    skill: "writing",
    title: "Über mich",
    summary: "Write a short paragraph introducing yourself.",
    content: {
      prompt:
        "Schreibe 4–5 Sätze über dich: Wie heißt du? Woher kommst du? Wo wohnst du? Was machst du gern?",
      minWords: 25,
      keywords: ["ich", "heiße", "wohne", "komme"],
      sampleAnswer:
        "Ich heiße Laura. Ich komme aus Kanada, aber ich wohne jetzt in Deutschland. Ich bin 27 Jahre alt und arbeite als Designerin. In meiner Freizeit lese ich gern und koche gern italienisches Essen."
    }
  },
  {
    id: "wr-beg-2",
    level: "beginner",
    skill: "writing",
    title: "Mein Tagesablauf",
    summary: "Describe a typical day using present-tense verbs.",
    content: {
      prompt:
        "Beschreibe deinen typischen Tag. Was machst du morgens, mittags und abends?",
      minWords: 30,
      keywords: ["morgens", "dann", "abends"],
      sampleAnswer:
        "Morgens stehe ich um sieben Uhr auf und trinke Kaffee. Dann fahre ich mit dem Bus zur Arbeit. Mittags esse ich mit Kollegen zu Mittag. Abends koche ich zu Hause und sehe manchmal fern, bevor ich schlafen gehe."
    }
  },
  {
    id: "wr-int-1",
    level: "intermediate",
    skill: "writing",
    title: "Ein Ereignis in der Vergangenheit",
    summary: "Narrate a past event using Perfekt tense and connectors.",
    content: {
      prompt:
        "Erzähle von einer interessanten Reise oder einem besonderen Erlebnis. Benutze das Perfekt und Wörter wie 'zuerst', 'dann', 'danach', 'schließlich'.",
      minWords: 50,
      keywords: ["habe", "bin", "dann", "zuerst"],
      sampleAnswer:
        "Letzten Sommer habe ich eine Reise nach Italien gemacht. Zuerst bin ich nach Rom geflogen und habe das Kolosseum besucht. Dann bin ich mit dem Zug nach Florenz gefahren, wo ich viele Museen besichtigt habe. Danach habe ich ein paar Tage am Meer verbracht. Schließlich bin ich müde, aber glücklich, nach Hause zurückgekehrt."
    }
  },
  {
    id: "wr-adv-1",
    level: "advanced",
    skill: "writing",
    title: "Ein Meinungsessay",
    summary: "Write a short argumentative essay with a clear structure.",
    content: {
      prompt:
        "Schreibe einen kurzen Meinungsessay zum Thema 'Sollte Homeoffice zur Norm werden?'. Nenne mindestens ein Argument dafür und eines dagegen, und ziehe ein Fazit.",
      minWords: 80,
      keywords: ["einerseits", "andererseits", "Fazit"],
      sampleAnswer:
        "Die Frage, ob Homeoffice zur Norm werden sollte, wird kontrovers diskutiert. Einerseits bietet Homeoffice mehr Flexibilität und spart Pendelzeit, was die Work-Life-Balance verbessern kann. Andererseits fehlt vielen Menschen der persönliche Kontakt zu Kollegen, was die Zusammenarbeit und Kreativität beeinträchtigen kann. Ein hybrides Modell, das beide Ansätze kombiniert, scheint daher der sinnvollste Kompromiss zu sein. Zusammenfassend lässt sich sagen, dass die richtige Lösung stark vom Unternehmen und den individuellen Bedürfnissen abhängt."
    }
  }
];

const generatedLessons = generateLessons(nounBank);
const lessons = [...curatedLessons, ...generatedLessons];

function getAllLessons() {
  return lessons;
}

function getLessonById(id) {
  return lessons.find((l) => l.id === id);
}

function getLessonsFiltered({ level, skill }) {
  return lessons.filter(
    (l) => (!level || l.level === level) && (!skill || l.skill === skill)
  );
}

module.exports = { lessons, getAllLessons, getLessonById, getLessonsFiltered };
