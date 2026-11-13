# r15 screenshots

Native quote cards in the cream "What people say" section. No-consent shots are the whole section. Consent shots are the viewport, scrolled so the cards and the top of the wall are both in frame.

Each shot waits for `document.fonts.ready` and 250ms. The H2 family is `unbounded` (next/font's name for Unbounded), weight 700, and that face is loaded in every shot. `check('1em Unbounded')` asks for weight 400, which this family does not have, so it is false unless a nearby weight is already loaded. `check('700 1em unbounded')` is true in every shot. Card text is `NH Geist`, and that face is loaded in every shot. `check('1em Geist')` is true as well, but the cards use the `NH Geist` name.

- / at 1440, no-consent: docs/qa/r15/home-1440-no-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- / at 1440, consent: docs/qa/r15/home-1440-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- / at 360, no-consent: docs/qa/r15/home-360-no-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- / at 360, consent: docs/qa/r15/home-360-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /keynotes/output-paradox-reengage-teams at 1440, no-consent: docs/qa/r15/output-paradox-1440-no-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') true. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /keynotes/output-paradox-reengage-teams at 1440, consent: docs/qa/r15/output-paradox-1440-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') true. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /keynotes/output-paradox-reengage-teams at 360, no-consent: docs/qa/r15/output-paradox-360-no-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') true. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /keynotes/output-paradox-reengage-teams at 360, consent: docs/qa/r15/output-paradox-360-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') true. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /session at 1440, no-consent: docs/qa/r15/session-1440-no-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /session at 1440, consent: docs/qa/r15/session-1440-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /session at 360, no-consent: docs/qa/r15/session-360-no-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
- /session at 360, consent: docs/qa/r15/session-360-consent.png
  - H2: `unbounded, "NH Unbounded Fallback", sans-serif`. unbounded 700: loaded. check('1em Unbounded') false. check('700 1em unbounded') true.
  - Card: `"NH Geist", "NH Geist Fallback", sans-serif`. NH Geist: loaded. check('1em Geist') true. check('400 17px "NH Geist"') true.
