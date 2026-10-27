/* Весь текст резюме. Правь только этот файл. */
const CONTENT = {
  ru: {
    langName: "RU",
    skip: "К содержанию",
    hud: {
      name: "Ярослав Кукар",
      role: "геймдизайнер",
      designer: "Режим дизайнера",
      progress: "Испытание {n}/3",
      progressDone: "Испытание пройдено 3/3"
    },
    hub: {
      kicker: "Stark Games · Минск · 20+ лет игр",
      title: "Испытание кандидата",
      subtitle: "Интерактивное резюме в мире игр студии: три мира — по одной игре Stark Games в каждом. Каждый мир несёт свой блок резюме, каждая механика — обоснована.",
      fact1: "БГУИР, «Информационные системы и технологии в игровой индустрии» (2023–2027)",
      fact2: "Системный дизайн, баланс, экономика — интересуюсь тем, как изменения влияют на игровой процесс",
      fact3: "7+ играбельных прототипов на GitHub — от Unity до HTML5",
      plain: "Просто резюме (PDF)",
      start: "Начать испытание",
      worlds: [
        { id: "ereality", num: "Мир 1", game: "по «Граням Реальности»", title: "Лист персонажа", desc: "Опыт и навыки: статы, квесты, достижения" },
        { id: "tiles", num: "Мир 2", game: "по Tile Seasons", title: "Сундук инструментов", desc: "Матч-3: собирай комбинации — открывай стек" },
        { id: "tree", num: "Мир 3", game: "по «Ёлочке»", title: "Контакты и открытка", desc: "Финал: почему Stark Games и как связаться" }
      ]
    },
    w1: {
      kicker: "Мир 1 · браузерная MMORPG «Грани Реальности»",
      title: "Лист персонажа",
      lead: "Опыт в формате, который студия знает наизусть: статы с обоснованием, квесты с наградами, достижения с фактами.",
      className: "Класс: геймдизайнер-системщик",
      level: "Уровень: 4-й курс БГУИР — профильная игровая специальность с инженерной базой",
      statsTitle: "Характеристики",
      stats: [
        { name: "Баланс и экономика", value: 8, why: "Варгейм на 4 фракции: 15+ плейтестов и итеративная правка характеристик по обратной связи — тот же цикл, что правка live ops события по данным." },
        { name: "Системный дизайн", value: 8, why: "GDD стратегии с элементами градостроителя: механики, прогрессия, баланс ресурсов — система описана целиком." },
        { name: "Документация", value: 8, why: "Документы структурированы под передачу в команду разработки — без уточняющих вопросов в чате." },
        { name: "Мат. статистика", value: 7, why: "Теория вероятностей: шансы, ожидаемая ценность, дисперсия — база для экономики F2P и дропов." },
        { name: "Level Design", value: 7, why: "echoloop: 8 уровней на одной механике — нарастание сложности без новых слов." },
        { name: "Код", value: 6, why: "C#, C++, Unity 6: понимаю цену реализации фичи и говорю с разработкой на одном языке." }
      ],
      questsTitle: "Журнал квестов",
      quests: [
        {
          name: "«Королевства Эридора»",
          tag: "настольная пошаговая тактика",
          text: "Спроектировал с нуля боевые механики, систему захвата территорий и баланс юнитов на 4 фракции. Провёл 15+ плейтест-сессий, собирал обратную связь и итеративно правил характеристики.",
          reward: "Цикл «гипотеза → плейтест → правка по данным» — как анализ live ops события после релиза."
        },
        {
          name: "Концепт-документ стратегии",
          tag: "полный GDD",
          text: "Разработал GDD для стратегии с элементами градостроительного симулятора: механики, прогрессия, баланс ресурсов, арт-стиль.",
          reward: "Документ, по которому команда строит без меня — проверено на групповом ревью."
        },
        {
          name: "echoloop",
          tag: "Unity 6 + URP",
          text: "Головоломка о времени: эхо прошлых проходов помогает будущим, 8 уровней, готовый играбельный билд.",
          reward: "Дизайн, доведённый до прототипа: не «было бы здорово», а «вот ссылка, играйте»."
        }
      ],
      achvTitle: "Достижения",
      achv: [
        { name: "Испытатель", desc: "15+ плейтест-сессий с сбором и разбором обратной связи" },
        { name: "Марафонец", desc: "7 интерактивных резюме-игр — каждый раз новый жанр и движок" },
        { name: "Лёгкий вес", desc: "Playable-реклама в одном HTML-файле: 472 КБ и 0 сетевых запросов" }
      ],
      why: "Почему RPG-лист: «Грани Реальности» — браузерная MMORPG студии, её язык — статы и квесты. Опыт подан в терминах, которые команда использует каждый день."
    },
    w2: {
      kicker: "Мир 2 · match-3 Tile Seasons / Match and Farm",
      title: "Сундук инструментов",
      lead: "Матч-3 — жанр студии, поэтому и стек я показываю её механикой. Собирай комбинации — каждая открытая карточка описывает инструмент и при чём он в команде.",
      hint: "Свайпай тайл на соседний или кликни два раза: собери 3+ в ряд. Лимита ходов нет, а если поле зашло в тупик — само перемешается.",
      chestTitle: "Сундук",
      tools: [
        { name: "C# / C++", desc: "Понимаю цену реализации фичи — говорю с разработкой на одном языке" },
        { name: "Unity 6 + URP", desc: "Прототипирую механики сам, не ставя прототип в очередь на неделю" },
        { name: "Таблицы с формулами", desc: "Контент и экономика событий на формулах, а не на глаз" },
        { name: "Figma + Photoshop", desc: "Вайрфреймы и мокапы делаю сам до передачи художнику" },
        { name: "PixiJS / Canvas", desc: "HTML5-игры, живущие прямо в браузере — формат соцсетей и веба" },
        { name: "Git", desc: "Ветки, ревью, командная работа — привычка, а не подвиг" }
      ],
      allFound: "Сундук собран: 6/6",
      found: "Открыто {n}/6",
      shuffled: "Поле перемешано — играем дальше",
      why: "Почему матч-3: это жанр Tile Seasons, но правила ослаблены — без лимита ходов и с гарантированным прогрессом. Резюме не должно быть сложнее работы: рекрутер должен получить контент, а не челлендж."
    },
    w3: {
      kicker: "Мир 3 · социальная игра «Ёлочка»",
      title: "Контакты и открытка",
      lead: "Финал — тёплый, как их зимние события: контакты на ёлке и открытка с честным ответом, почему именно Stark Games.",
      cardTitle: "Открытка: почему Stark Games",
      cardHint: "нажми, чтобы открыть",
      cardText: "Студия 20+ лет делает игры, в которые возвращаются: браузерная MMORPG, match-3, сезонные события. Мне близок этот фокус — не разовый вау-эффект, а контент и экономика, которые держат игрока месяцами. Мой цикл совпадает с вашим: гипотеза → прототип → плейтест → баланс по данным. Хочу проектировать события и баланс для миллионов игроков — и расти в команде, которая умеет это лучше всех.",
      contact: "Связаться со мной",
      ctaNote: "Напишет письмо на kukar.yar@gmail.com — откроется почтовый клиент.",
      ornaments: [
        { kind: "tel", icon: "☎", label: "Позвонить", value: "+375 44 783-84-89" },
        { kind: "mail", icon: "✉", label: "Написать", value: "kukar.yar@gmail.com" },
        { kind: "link", icon: "⌂", label: "GitHub", value: "github.com/Kerarty" },
        { kind: "pdf", icon: "❑", label: "PDF-резюме", value: "Скачать CV" }
      ],
      starLit: "Все три мира пройдены — звезда зажглась. Спасибо за время!",
      why: "Почему ёлка: «Ёлочка» — социальная сезонная игра студии, её тональность — уют и забота о игроке. Финал резюме сделан в этой тональности: тёплый, без пафоса, с конкретикой."
    },
    footer: {
      made: "Сделано с любовью к играм Stark Games",
      pdf: "Печатная версия: просто распечатай страницу"
    }
  },

  en: {
    langName: "EN",
    skip: "Skip to content",
    hud: {
      name: "Yaraslau Kukar",
      role: "game designer",
      designer: "Designer mode",
      progress: "Trial {n}/3",
      progressDone: "Trial complete 3/3"
    },
    hub: {
      kicker: "Stark Games · Minsk · 20+ years of games",
      title: "Candidate's Trial",
      subtitle: "An interactive resume set inside the studio's games: three worlds — one Stark Games title each. Every world carries its own resume block, every mechanic is justified.",
      fact1: "BSUIR, “Information systems and technologies in the game industry” (2023–2027)",
      fact2: "System design, balance, economy — focused on how changes affect gameplay",
      fact3: "7+ playable prototypes on GitHub — from Unity to HTML5",
      plain: "Plain resume (PDF)",
      start: "Begin the trial",
      worlds: [
        { id: "ereality", num: "World 1", game: "after Gran'i Real'nosti MMO", title: "Character sheet", desc: "Experience and skills: stats, quests, achievements" },
        { id: "tiles", num: "World 2", game: "after Tile Seasons", title: "Chest of tools", desc: "Match-3: combine tiles — unlock the stack" },
        { id: "tree", num: "World 3", game: "after Yolochka", title: "Contacts & postcard", desc: "Finale: why Stark Games and how to reach me" }
      ]
    },
    w1: {
      kicker: "World 1 · browser MMORPG Gran'i Real'nosti",
      title: "Character Sheet",
      lead: "Experience in a format the studio knows by heart: stats with reasoning, quests with rewards, achievements with facts.",
      className: "Class: systems game designer",
      level: "Level: 4th year at BSUIR — a game-industry major with an engineering base",
      statsTitle: "Attributes",
      stats: [
        { name: "Balance & economy", value: 8, why: "Wargame with 4 factions: 15+ playtests and iterative tuning from feedback — the same loop as patching a live ops event from data." },
        { name: "System design", value: 8, why: "GDD for a city-builder strategy: mechanics, progression, resource economy — the system described end to end." },
        { name: "Documentation", value: 8, why: "Documents structured for handover to a dev team — no follow-up questions in the chat." },
        { name: "Math & statistics", value: 7, why: "Probability theory: odds, expected value, variance — the base of F2P economy and drop design." },
        { name: "Level design", value: 7, why: "echoloop: 8 levels on a single mechanic — difficulty ramp without new vocabulary." },
        { name: "Code", value: 6, why: "C#, C++, Unity 6: I understand the cost of a feature and speak the dev team's language." }
      ],
      questsTitle: "Quest log",
      quests: [
        {
          name: "“Kingdoms of Eridor”",
          tag: "turn-based tabletop tactics",
          text: "Designed combat mechanics, territory capture and unit balance for 4 factions from scratch. Ran 15+ playtest sessions, collected feedback and iteratively tuned stats.",
          reward: "The loop “hypothesis → playtest → data-driven fix” — same as post-release live ops analysis."
        },
        {
          name: "Strategy concept document",
          tag: "full GDD",
          text: "Wrote a GDD for a strategy with city-builder elements: mechanics, progression, resource balance, art style.",
          reward: "A document the team builds from without me — proven in a group review."
        },
        {
          name: "echoloop",
          tag: "Unity 6 + URP",
          text: "A time puzzle: echoes of past runs help future ones, 8 levels, a playable build.",
          reward: "Design taken all the way to a prototype: not “it would be cool” but “here is the link, play it”."
        }
      ],
      achvTitle: "Achievements",
      achv: [
        { name: "Playtester", desc: "15+ playtest sessions with feedback collection and analysis" },
        { name: "Marathoner", desc: "7 interactive resume-games — a new genre and engine every time" },
        { name: "Featherweight", desc: "Playable ad in a single HTML file: 472 KB and 0 network requests" }
      ],
      why: "Why an RPG sheet: Gran'i Real'nosti is the studio's browser MMO, its native language is stats and quests. Experience is told in the terms the team uses daily."
    },
    w2: {
      kicker: "World 2 · match-3 Tile Seasons / Match and Farm",
      title: "Chest of Tools",
      lead: "Match-3 is the studio's genre, so I present my stack in its own mechanics. Combine tiles — each opened card describes a tool and what it brings to the team.",
      hint: "Swipe a tile onto its neighbor or tap twice: line up 3+. No move limit, and if the board deadlocks it shuffles itself.",
      chestTitle: "Chest",
      tools: [
        { name: "C# / C++", desc: "I understand what a feature costs to build — we speak the same language" },
        { name: "Unity 6 + URP", desc: "I prototype mechanics myself instead of queueing for a prototype" },
        { name: "Spreadsheets with formulas", desc: "Event content and economy driven by formulas, not gut feeling" },
        { name: "Figma + Photoshop", desc: "Wireframes and mockups done myself before touching an artist's time" },
        { name: "PixiJS / Canvas", desc: "HTML5 games living right in the browser — the social/web format" },
        { name: "Git", desc: "Branches, reviews, teamwork — a habit, not a feat" }
      ],
      allFound: "Chest complete: 6/6",
      found: "Unlocked {n}/6",
      shuffled: "Board shuffled — keep going",
      why: "Why match-3: it is Tile Seasons' genre, but the rules are softened — no move limit, guaranteed progress. A resume must not be harder than the job: the recruiter should get content, not a challenge."
    },
    w3: {
      kicker: "World 3 · social game Yolochka",
      title: "Contacts & Postcard",
      lead: "The finale is as warm as their winter events: contacts on the tree and a postcard with an honest answer to “why Stark Games”.",
      cardTitle: "Postcard: why Stark Games",
      cardHint: "tap to open",
      cardText: "For 20+ years the studio has made games people return to: a browser MMO, a match-3, seasonal events. That focus is close to me — not a one-time wow, but content and economy that keep a player for months. My loop matches yours: hypothesis → prototype → playtest → data-driven balance. I want to design events and balance for millions of players — and grow in a team that does it best.",
      contact: "Contact me",
      ctaNote: "Opens your mail client addressed to kukar.yar@gmail.com.",
      ornaments: [
        { kind: "tel", icon: "☎", label: "Call", value: "+375 44 783-84-89" },
        { kind: "mail", icon: "✉", label: "Email", value: "kukar.yar@gmail.com" },
        { kind: "link", icon: "⌂", label: "GitHub", value: "github.com/Kerarty" },
        { kind: "pdf", icon: "❑", label: "Resume PDF", value: "Download CV" }
      ],
      starLit: "All three worlds done — the star is lit. Thank you for your time!",
      why: "Why a tree: Yolochka is the studio's social seasonal game, its tone is coziness and care for the player. The finale follows that tone: warm, no pathos, with specifics."
    },
    footer: {
      made: "Made with love for Stark Games' worlds",
      pdf: "Printed version: just print the page"
    }
  }
};
if (typeof module !== "undefined") module.exports = CONTENT;
