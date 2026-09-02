// Generates lesson objects from the vocabulary bank in nouns.js.
// This runs once when the server starts (it's a pure function of nouns.js,
// so lesson IDs stay stable across restarts as long as nouns.js keeps the
// same topic order and chunk size).
//
// The generator only ever needs correct gender tags to build grammatically
// valid sentences — see the ARTICLES table below for how each of the three
// genders map onto nominative/accusative/dative, definite and indefinite.

const ARTICLES = {
  der: { nomDef: "der", accDef: "den", datDef: "dem", nomIndef: "ein", accIndef: "einen", datIndef: "einem" },
  die: { nomDef: "die", accDef: "die", datDef: "der", nomIndef: "eine", accIndef: "eine", datIndef: "einer" },
  das: { nomDef: "das", accDef: "das", datDef: "dem", nomIndef: "ein", accIndef: "ein", datIndef: "einem" }
};

const MIN_WORDS_BY_LEVEL = { beginner: 20, intermediate: 35, advanced: 50 };

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(pool, excludeDe, count) {
  const candidates = pool.filter((n) => n.de !== excludeDe);
  return shuffle(candidates).slice(0, count);
}

function makeReadingLesson(level, topic, nouns, idx) {
  const sentences = nouns.map((n) => `Das ist ${ARTICLES[n.gender].nomIndef} ${n.de}.`);
  const passage = `Hier lernst du Wörter zum Thema „${topic.title}“. ${sentences.join(" ")}`;
  const quiz = nouns.map((n) => {
    const options = shuffle([n.en, ...pickDistractors(topic.nouns, n.de, 3).map((d) => d.en)]);
    return { question: `Was bedeutet "${n.de}" auf Englisch?`, options, answerIndex: options.indexOf(n.en) };
  });
  return {
    id: `gen-${level}-reading-${topic.id}-${idx}`,
    level,
    skill: "reading",
    title: `${topic.title}: Wortschatz ${idx + 1}`,
    summary: `Vocabulary reading practice for ${topic.title.toLowerCase()}.`,
    topic: topic.title,
    content: { passage, quiz }
  };
}

function makeListeningLesson(level, topic, nouns, idx) {
  const text = nouns.map((n) => `Ich mag ${ARTICLES[n.gender].accDef} ${n.de}.`).join(" ");
  const quiz = nouns.map((n) => {
    const options = shuffle([n.de, ...pickDistractors(topic.nouns, n.de, 3).map((d) => d.de)]);
    return {
      question: `Welches Wort hast du gehört, das "${n.en}" bedeutet?`,
      options,
      answerIndex: options.indexOf(n.de)
    };
  });
  return {
    id: `gen-${level}-listening-${topic.id}-${idx}`,
    level,
    skill: "listening",
    title: `${topic.title}: Hörverständnis ${idx + 1}`,
    summary: `Listening practice for ${topic.title.toLowerCase()} vocabulary.`,
    topic: topic.title,
    lang: "de-DE",
    content: { lang: "de-DE", text, quiz }
  };
}

function makeSpeakingLesson(level, topic, nouns, idx) {
  const phrases = nouns.flatMap((n) => [
    { de: `Das ist ${ARTICLES[n.gender].nomIndef} ${n.de}.`, en: `This is a ${n.en}.` },
    { de: `Ich mag ${ARTICLES[n.gender].accDef} ${n.de}.`, en: `I like the ${n.en}.` }
  ]);
  return {
    id: `gen-${level}-speaking-${topic.id}-${idx}`,
    level,
    skill: "speaking",
    title: `${topic.title}: Aussprache ${idx + 1}`,
    summary: `Speaking practice with ${topic.title.toLowerCase()} vocabulary.`,
    topic: topic.title,
    content: {
      instructions: "Listen to each phrase, then press record and say it back in German.",
      phrases
    }
  };
}

function makeWritingLesson(level, topic, nouns, idx) {
  const wordList = nouns.map((n) => `${ARTICLES[n.gender].nomDef} ${n.de}`).join(", ");
  const sampleAnswer = nouns.map((n) => `Ich habe ${ARTICLES[n.gender].accIndef} ${n.de}.`).join(" ");
  const minWords = MIN_WORDS_BY_LEVEL[level];
  return {
    id: `gen-${level}-writing-${topic.id}-${idx}`,
    level,
    skill: "writing",
    title: `${topic.title}: Schreibübung ${idx + 1}`,
    summary: `Writing practice using ${topic.title.toLowerCase()} vocabulary.`,
    topic: topic.title,
    content: {
      prompt: `Schreibe ein paar Sätze zum Thema „${topic.title}“. Benutze mindestens drei dieser Wörter: ${wordList}.`,
      minWords,
      keywords: nouns.map((n) => n.de.toLowerCase()),
      sampleAnswer
    }
  };
}

function makeGenderQuizLesson(level, topic, nouns, idx) {
  const options = ["der", "die", "das"];
  const quiz = nouns.map((n) => ({
    question: `Welcher Artikel passt zu "${n.de}"?`,
    options,
    answerIndex: options.indexOf(n.gender)
  }));
  return {
    id: `gen-${level}-grammar-gender-${topic.id}-${idx}`,
    level,
    skill: "grammar",
    title: `Artikel-Training: ${topic.title} ${idx + 1}`,
    summary: `Practice der/die/das with ${topic.title.toLowerCase()} vocabulary.`,
    topic: topic.title,
    content: {
      explanation: `Jedes deutsche Nomen hat einen Artikel: der, die oder das. Übe mit Wörtern zum Thema „${topic.title}“.`,
      examples: nouns.map((n) => ({ de: `${ARTICLES[n.gender].nomDef} ${n.de}`, en: n.en })),
      quiz
    }
  };
}

function makeAccusativeQuizLesson(level, topic, nouns, idx) {
  const options = ["den", "die", "das", "dem"];
  const quiz = nouns.map((n) => ({
    question: `Ich mag ___ ${n.de}. (Akkusativ)`,
    options,
    answerIndex: options.indexOf(ARTICLES[n.gender].accDef)
  }));
  return {
    id: `gen-${level}-grammar-akk-${topic.id}-${idx}`,
    level,
    skill: "grammar",
    title: `Akkusativ-Training: ${topic.title} ${idx + 1}`,
    summary: `Practice accusative articles with ${topic.title.toLowerCase()} vocabulary.`,
    topic: topic.title,
    content: {
      explanation:
        "Nach \"mögen\" steht das Objekt im Akkusativ. Der bestimmte Artikel ändert sich: der → den, die → die, das → das.",
      examples: nouns
        .slice(0, 3)
        .map((n) => ({ de: `Ich mag ${ARTICLES[n.gender].accDef} ${n.de}.`, en: `I like the ${n.en}.` })),
      quiz
    }
  };
}

function makeDativeQuizLesson(level, topic, nouns, idx) {
  const options = ["dem", "der", "den", "die"];
  const quiz = nouns.map((n) => ({
    question: `Ich spreche von ___ ${n.de}. (Dativ)`,
    options,
    answerIndex: options.indexOf(ARTICLES[n.gender].datDef)
  }));
  return {
    id: `gen-${level}-grammar-dat-${topic.id}-${idx}`,
    level,
    skill: "grammar",
    title: `Dativ-Training: ${topic.title} ${idx + 1}`,
    summary: `Practice dative articles with ${topic.title.toLowerCase()} vocabulary.`,
    topic: topic.title,
    content: {
      explanation:
        "Nach \"von\" steht das Nomen im Dativ. Der bestimmte Artikel wird zu: der/das → dem, die → der.",
      examples: nouns
        .slice(0, 3)
        .map((n) => ({ de: `Ich spreche von ${ARTICLES[n.gender].datDef} ${n.de}.`, en: `I'm talking about the ${n.en}.` })),
      quiz
    }
  };
}

// nounBank: { beginner: [topic, ...], intermediate: [...], advanced: [...] }
function generateLessons(nounBank) {
  const lessons = [];
  const CHUNK_SIZE = 4;

  for (const level of Object.keys(nounBank)) {
    for (const topic of nounBank[level]) {
      const chunks = chunk(topic.nouns, CHUNK_SIZE);
      chunks.forEach((nounsInChunk, idx) => {
        lessons.push(makeReadingLesson(level, topic, nounsInChunk, idx));
        lessons.push(makeListeningLesson(level, topic, nounsInChunk, idx));
        lessons.push(makeSpeakingLesson(level, topic, nounsInChunk, idx));
        lessons.push(makeWritingLesson(level, topic, nounsInChunk, idx));
        lessons.push(makeGenderQuizLesson(level, topic, nounsInChunk, idx));
        lessons.push(makeAccusativeQuizLesson(level, topic, nounsInChunk, idx));
        lessons.push(makeDativeQuizLesson(level, topic, nounsInChunk, idx));
      });
    }
  }

  return lessons;
}

module.exports = { generateLessons };
