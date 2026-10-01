export default {
  site: {
    name: 'Sargam Tools',
    tagline: 'Free online tools for Indian music practice',
    footer: 'Sargam Tools — free harmonium, taal, drone and sargam utilities. Made for riyaz.',
  },
  nav: {
    home: 'Home',
    tools: 'Tools',
  },
  home: {
    title: 'Sargam Tools — Free Online Harmonium, Taal Metronome & Sargam Notes',
    description:
      'Free online toolkit for Indian music practice: playable harmonium, taal metronome (Teentaal, Keherwa, Dadra, Jhaptaal, Rupak), tanpura drone and sargam note converter. No download, no sign-up.',
    hero_title: 'Practice Indian music, right in your browser',
    hero_sub:
      'A free toolkit for riyaz: play the harmonium, keep taal with the metronome, tune your ear to a tanpura drone, and convert sargam notes — no downloads, no sign-up.',
    tools_title: 'The toolkit',
    why_title: 'Why practice with Sargam Tools',
    why: [
      {
        t: 'Zero setup',
        d: 'Everything runs in your browser with the Web Audio API. Open a page and start playing — it even keeps working offline after the first load.',
      },
      {
        t: 'Built for Indian music',
        d: 'Sargam labels, komal and tivra swaras, thekas with sam and khali, tanpura tuning — not a piano app with Indian names pasted on top.',
      },
      {
        t: 'Free forever',
        d: 'No accounts, no trials, no paywalled metronome. Supported by ads so every student can afford it — because it costs nothing.',
      },
    ],
    faq_title: 'Frequently asked questions',
    faq: [
      {
        q: 'Is Sargam Tools really free?',
        a: 'Yes. Every tool on this site is free with no account and no download. The site is supported by display ads.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. All tools run in your web browser using the Web Audio API, on desktop and mobile. After the first visit the pages also work offline.',
      },
      {
        q: 'What is sargam?',
        a: 'Sargam is the Indian solfege system: Sa, Re, Ga, Ma, Pa, Dha, Ni — the equivalent of Do, Re, Mi, Fa, Sol, La, Ti. Our converter translates between sargam and Western note names in any scale.',
      },
      {
        q: 'Can I use these tools for vocal practice?',
        a: 'Absolutely — that is what they are for. Singers use the tanpura drone to hold pitch, the taal metronome to lock rhythm, and the harmonium to check notes during riyaz.',
      },
    ],
  },
  tools: {
    harmonium: {
      name: 'Online Harmonium',
      tagline: 'Play a virtual harmonium with sargam labels',
      title: 'Online Harmonium — Play Virtual Harmonium in Your Browser | Sargam Tools',
      description:
        'Free online harmonium with warm reed-like sound. Play with keyboard, mouse or touch, change scale (Sa = C to B), add reverb and sustain. No download needed.',
      intro: [
        'This free online harmonium plays real sargam notes in your browser — Sa, Re, Ga, Ma, Pa, Dha, Ni across two octaves, with komal (flat) and tivra (sharp) swaras on the black keys. Use your computer keyboard, click, or tap on mobile.',
        'Change the scale to match your voice or your song: pick any Sa from C to B and every label updates instantly. Add reverb for a room feel, or turn on sustain to let notes ring like a real harmonium bellows.',
      ],
      how_title: 'How to play',
      how: [
        'Click any key (or tap on mobile) to sound the note. Computer keys A to K play the middle octave; W, E, T, Y, U play the black keys.',
        'Pick your scale with the Sa selector — singers usually match it to their comfortable pitch.',
        'Toggle sustain to hold notes, and reverb to add warmth.',
        'Shift the octave up or down to reach higher or lower notes.',
      ],
      faq: [
        {
          q: 'How do I play Sa Re Ga Ma on the keyboard?',
          a: 'Keys A S D F G H J play Sa Re Ga Ma Pa Dha Ni. The black keys W (komal Re), E (komal Ga), T (tivra Ma), Y (komal Dha) and U (komal Ni) give you all twelve swaras.',
        },
        {
          q: 'Can I change the scale?',
          a: 'Yes — choose any Sa from C to B. All sargam labels and pitches transpose instantly, so the same finger positions work in every key.',
        },
        {
          q: 'Does it work on mobile?',
          a: 'Yes. Tap the on-screen keys directly. For longer practice sessions a laptop with a physical keyboard is more comfortable.',
        },
        {
          q: 'Is the sound like a real harmonium?',
          a: 'The tone is synthesized in your browser to resemble harmonium reeds — layered, slightly breathy, with optional reverb. It is ideal for practice and pitch reference.',
        },
      ],
    },
    'taal-metronome': {
      name: 'Taal Metronome',
      tagline: 'Keep time in Teentaal, Keherwa, Dadra, Jhaptaal and Rupak',
      title: 'Taal Metronome — Teentaal, Keherwa, Dadra, Jhaptaal, Rupak | Sargam Tools',
      description:
        'Free online taal metronome for Indian classical practice. Thekas for Teentaal (16 beats), Keherwa (8), Dadra (6), Jhaptaal (10) and Rupak (7) with bols and sam/khali accents.',
      intro: [
        'A metronome that speaks tabla. Pick a taal and hear its theka — every bol (Dha, Dhin, Na, Ti…) on its beat, with the sam accented and khali marked, at any tempo from 40 to 208 BPM.',
        'Five essential taals are built in: Teentaal (16 beats, the workhorse of khyal), Keherwa (8, for bhajans and film songs), Dadra (6, light classical), Jhaptaal (10) and Rupak (7). Watch the bols light up as the cycle turns.',
      ],
      how_title: 'How to use it',
      how: [
        'Choose a taal — start with Keherwa (8 beats) if you are new.',
        'Set a comfortable tempo with the slider. Slow is fine; precision beats speed.',
        'Press Start and clap or play along. The highlighted bol shows where you are in the cycle.',
        'Count the sam (beat 1, accented) to feel the cycle resolve.',
      ],
      faq: [
        {
          q: 'What is a theka?',
          a: 'A theka is the standard bol pattern of a taal — the rhythmic skeleton tabla players repeat. This metronome plays the theka so you can internalize the cycle while you sing or play.',
        },
        {
          q: 'What are sam and khali?',
          a: 'Sam is beat 1, the downbeat where the cycle resolves — it is accented here. Khali is the "empty" division played without the bass dayan; it is shown hollow so you can feel the contrast.',
        },
        {
          q: 'Which taal should a beginner start with?',
          a: 'Keherwa (8 beats) — it underpins countless bhajans and film songs and is the easiest cycle to feel. Move to Dadra (6) and then Teentaal (16) as your timing steadies.',
        },
        {
          q: 'Can I practice vocals with it?',
          a: 'Yes — set a slow tempo, sing your alaap or bandish against the theka, and let the sam anchor your phrasing. That is exactly how riyaz with a metronome works.',
        },
      ],
    },
    'tanpura-drone': {
      name: 'Tanpura Drone',
      tagline: 'A steady Sa–Pa shruti box for riyaz',
      title: 'Online Tanpura Drone — Free Shruti Box for Practice | Sargam Tools',
      description:
        'Free online tanpura / shruti box drone. A continuous Sa–Pa drone in any scale (C to B) for riyaz, vocal practice and meditation. No download needed.',
      intro: [
        'Every riyaz session starts with a drone. This free tanpura plays the classic four-string pattern — Pa, Sa, Sa, low Sa — in a gentle loop, or a smooth continuous pad if you prefer, in any scale from C to B.',
        'Singers use it to lock their pitch, instrumentalists to tune by ear, and many simply leave it humming for meditation. Set your Sa, press play, and let it ring.',
      ],
      how_title: 'How to use it',
      how: [
        'Choose your Sa to match your voice or instrument.',
        'Pick tanpura plucks for the traditional feel, or the continuous pad for an unbroken tone.',
        'Press play and tune: sing or play Sa against the drone until the beats disappear.',
        'Leave it running through your whole riyaz session.',
      ],
      faq: [
        {
          q: 'What tuning does the tanpura use?',
          a: 'The classic four-string tuning: Pa (the fifth), high Sa, high Sa again, and low Sa. The plucks cycle in that order, which is the pattern you hear on real tanpuras.',
        },
        {
          q: 'Which Sa should I choose?',
          a: 'Match your comfortable singing pitch — most male voices sit around C# to E, most female voices around F# to A. There is no wrong answer; pick what feels natural.',
        },
        {
          q: 'Tanpura plucks or continuous pad?',
          a: 'Plucks sound like the real instrument and give your ear a rhythmic anchor. The pad is an unbroken tone, better for long meditative practice or when plucks distract you.',
        },
        {
          q: 'Can it help me sing in tune?',
          a: 'That is its main job. A constant Sa–Pa reference trains your ear to hear when you drift sharp or flat — the single most effective intonation exercise there is.',
        },
      ],
    },
    'sargam-converter': {
      name: 'Sargam Converter',
      tagline: 'Translate between sargam and Western notes',
      title: 'Sargam to Western Notes Converter — Sa Re Ga Ma to C D E | Sargam Tools',
      description:
        'Convert between sargam (Sa Re Ga Ma Pa Dha Ni) and Western notes (C D E F G A B) in any scale. Free online tool — paste notes, pick your Sa, get the translation instantly.',
      intro: [
        'Found sargam notes for a song but think in C-D-E? Or the reverse? Paste your notes, choose which Sa you are in, and get an instant translation — both directions, with komal and tivra swaras handled correctly.',
        'It understands full names (Sa, re, Ga, Ma#), Bhatkhande shorthand (S r R g G m M P d D n N) and flats like Db. Unrecognized tokens are skipped, never silently mangled.',
      ],
      how_title: 'How to use it',
      how: [
        'Pick the direction: Western to sargam, or sargam to Western.',
        'Set Sa to the scale of your notes (C by default).',
        'Paste or type notes separated by spaces — e.g. "C D E F G" or "S R G m P".',
        'Copy the result straight into your practice notebook.',
      ],
      faq: [
        {
          q: 'What formats does it accept?',
          a: 'Full sargam names (Sa, re, Re, ga, Ga, Ma, Ma#, Pa, dha, Dha, ni, Ni), shorthand (S r R g G m M P d D n N), Western sharps (C#, F#) and flats (Db, Eb). Separate notes with spaces or commas.',
        },
        {
          q: 'How are komal and tivra notes handled?',
          a: 'Exactly as in theory: komal Re/Ga/Dha/Ni are the flat variants, tivra Ma is the sharp one. Lowercase r/g/d/n mean komal; in shorthand, capital M means tivra Ma.',
        },
        {
          q: 'Why does the Sa setting matter?',
          a: 'Sargam is relative — "Re" means "two semitones above Sa". Tell the tool which pitch your Sa is (e.g. D) and every note lands on the right Western pitch.',
        },
        {
          q: 'Can I transpose a song to another key?',
          a: 'Yes — that is what the Sa selector does. Convert with Sa = C, then convert back with Sa = D, and the whole melody moves up a whole step.',
        },
      ],
    },
  },
  widget: {
    harmonium: {
      scale: 'Sa =',
      octave: 'Octave',
      volume: 'Volume',
      reverb: 'Reverb',
      sustain: 'Sustain',
      hint: 'Keys A–K play the middle octave, W E T Y U the black keys. Click, tap, or use your keyboard.',
    },
    taal: {
      taal: 'Taal',
      bpm: 'Tempo',
      start: 'Start',
      stop: 'Stop',
      beat: 'Beat',
      hint: 'Beat 1 (sam) is accented. Hollow beats are khali.',
    },
    drone: {
      root: 'Sa =',
      play: 'Start drone',
      stop: 'Stop',
      sound: 'Sound',
      tanpura: 'Tanpura plucks',
      pad: 'Continuous pad',
      hint: 'A steady Sa–Pa reference for your whole riyaz session.',
    },
    converter: {
      direction: 'Convert',
      to_sargam: 'Western → Sargam',
      to_western: 'Sargam → Western',
      root: 'Sa =',
      input_label: 'Your notes',
      placeholder: 'e.g. C D E F G A B   or   S R G m P D N',
      output_label: 'Result',
      copy: 'Copy',
      copied: 'Copied',
      example: 'Try an example',
      skipped: 'Skipped unrecognized tokens:',
      hint: 'Full names (Sa, re, Ma#), shorthand (S r R M), sharps and flats all work.',
    },
  },
}
