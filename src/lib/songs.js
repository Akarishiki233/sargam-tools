// Song catalogue: published sargam notations for traditional songs.
// Pure data — imported by routes.js, gen-sitemap.mjs and selftest.py (via
// node), so it must not import .vue files.
//
// Every notation below is transcribed from a real published source (see
// `sources`); nothing is invented. Where published sources disagree, the
// disagreement is documented in the i18n `variant_note` for that song.
//
// Notation convention (normalized): S r R g G m M P d D n N — lowercase =
// komal (flat), M = tivra Ma. `'` after a note = higher octave, `.` before
// a note = lower octave. (x) = kann grace touch, ~ = meend glide,
// { } = murki ornament, | = bar/phrasing line.

export const SONGS = [
  {
    id: 'raghupati-raghav',
    title: { en: 'Raghupati Raghav Raja Ram', hi: 'रघुपति राघव राजा राम' },
    subtitle: {
      en: 'Ram dhun — a devotional chant sung across India',
      hi: 'राम धुन — पूरे भारत में गाई जाने वाली भक्ति धुन',
    },
    scale: {
      en: 'Not stated in the source — relative notation, choose any comfortable Sa',
      hi: 'स्रोत में स्केल नहीं दिया गया — सापेक्ष नोटेशन, अपनी सुविधानुसार कोई भी सा चुनें',
    },
    taal: {
      en: 'Keherwa (8 beats) is the commonly used taal for this dhun',
      hi: 'इस धुन के लिए आमतौर पर कहरवा (8 मात्रा) ताल बजाई जाती है',
    },
    sources: [
      {
        name: 'notesandsargam.com',
        url: 'https://notesandsargam.com/raghupati-raghav-rajaram/',
      },
      {
        name: 'notationsworld.com',
        url: 'https://www.notationsworld.com/raghupati-raghav-raja-ram-sargam-and-flute-notes.html',
      },
    ],
    lines: [
      // Transcribed from notesandsargam.com. The source prints no octave
      // marks — everything sits in the middle octave. Bar lines, (x) kann,
      // ~ meend and { } murki follow the source.
      {
        lyric: { en: 'Raghupati Raghav', hi: 'रघुपति राघव' },
        notes: 'S S S S(r) S N D',
      },
      {
        lyric: { en: 'Raja Ram', hi: 'राजा राम' },
        notes: 'N R S R M~G M',
      },
      {
        lyric: { en: 'Patita Pavan Sitaram', hi: 'पतित पावन सीताराम' },
        notes: 'R g R S N D N G~R R~S',
      },
      {
        // The source notates this section with the words "Sitaram, Sitaram".
        lyric: { en: 'Sitaram Sitaram', hi: 'सीताराम सीताराम' },
        notes: 'G G G {M G R S} R M G M',
      },
      {
        lyric: { en: 'Bhaj Pyare Tu Sitaram', hi: 'भज प्यारे तू सीताराम' },
        notes: 'R R M P (d) P M G R R',
      },
    ],
  },
  {
    id: 'vaishnav-jan-to',
    title: { en: 'Vaishnav Jan To', hi: 'वैष्णव जन तो' },
    subtitle: {
      en: "Bhajan by Narsinh Mehta — Gandhi's favourite hymn",
      hi: 'नरसिंह मेहता का भजन — गाँधी जी का प्रिय भजन',
    },
    scale: {
      en: 'C# in the published notation (transpose to your comfort)',
      hi: 'प्रकाशित नोटेशन में C# (अपनी सुविधा अनुसार बदलें)',
    },
    taal: { en: 'Not stated', hi: 'निर्दिष्ट नहीं' },
    sources: [
      {
        name: 'onlinesangeet.com',
        url: 'https://onlinesangeet.com/vaishnav-jan-to-tene-kahiye-sargam-notes/',
      },
      {
        name: 'bansuritabla.com (PDF)',
        url: 'https://bansuritabla.com/wp-content/uploads/2020/11/Vaishnava-Jana-To.pdf',
      },
    ],
    lines: [
      {
        lyric: { en: 'Vaishnav jan to tene kahiye je', hi: 'वैष्णव जन तो तेने कहिये जे' },
        notes: 'S G | G G G M R G | G M P | P D P D (P) M G',
      },
      {
        lyric: { en: 'Peed parayi jaane re', hi: 'पीड परायी जाणे रे' },
        notes: "G M P | P P D P D N S' | n D P M | M P G M G",
      },
      {
        lyric: { en: 'Par dukkhe upkaar kare toye', hi: 'पर दुःखे उपकार करे तोये' },
        notes: 'G M | D D | D D D D | n n D P D | P P M G',
      },
      {
        lyric: { en: 'Mann abhiman na aane re', hi: 'मन अभिमान न आणे रे' },
        notes: "G M | P P | P D P D N S' | n D P M | M P G M G",
      },
      {
        lyric: { en: 'Sakal lok ma sahune vande', hi: 'सकल लोकमां सहुने वंदे' },
        notes: "G M P | N N N | N N S' N | S' S'",
      },
      {
        lyric: { en: 'Ninda na kare keni re', hi: 'निंदा न करे केनी रे' },
        notes: "D n D P | P D P D N S' | n D P M | M P G M G",
      },
      {
        lyric: { en: 'Vaach kaachh mann nischal raakhe', hi: 'वाच काछ मन निश्चल राखे' },
        notes: 'S R | S G G | G G | G M P P | P D P D (P) M G',
      },
      {
        lyric: { en: 'Dhan dhan janani teni re', hi: 'धन धन जननी तेनी रे' },
        notes: "G M P | P P D P D N S' | n D P M | M P G M G",
      },
    ],
  },
  {
    id: 'sare-jahan-se-achha',
    title: { en: 'Sare Jahan Se Achha', hi: 'सारे जहाँ से अच्छा' },
    subtitle: {
      en: 'Patriotic song — lyrics by Muhammad Iqbal',
      hi: 'देशभक्ति गीत — मुहम्मद इक़बाल की रचना',
    },
    scale: {
      en: 'C (Sa = C in the published notation)',
      hi: 'C (प्रकाशित नोटेशन में सा = C)',
    },
    taal: { en: 'Not stated', hi: 'निर्दिष्ट नहीं' },
    sources: [
      {
        name: 'notationiq.com',
        url: 'https://www.notationiq.com/sare-jahan-se-achha-hindustan-hamara-piano-harmonium-notes/',
      },
      {
        name: 'bhmurali.com (PDF)',
        url: 'https://bhmurali.com/pdf%20files/pat_sarejahan.pdf',
      },
    ],
    lines: [
      {
        lyric: { en: 'Sare jahan se achha', hi: 'सारे जहाँ से अच्छा' },
        notes: 'g g R S R .N S S',
      },
      {
        lyric: { en: 'Hindustan hamara hamara', hi: 'हिन्दोस्ताँ हमारा हमारा' },
        notes: '.P .D S R G M G G R M G R S',
      },
      {
        lyric: { en: 'Hum bulbule hain iski', hi: 'हम बुलबुलें हैं इसकी' },
        notes: 'G M P P P G M D P',
      },
      {
        lyric: { en: 'Ye gulsitan hamara hamara', hi: 'ये गुलसिताँ हमारा हमारा' },
        notes: 'G M P M g R S S S S .N .D .P',
      },
      {
        lyric: { en: 'Parbat wo sabse ooncha', hi: 'पर्बत वो सबसे ऊँचा' },
        notes: 'G G G G G M R R S S',
      },
      {
        lyric: { en: 'Hum saaya aasma ka', hi: 'हम साया आसमाँ का' },
        notes: '.P .D S R G M G G',
      },
      {
        lyric: { en: 'Wo santari hamara', hi: 'वो संतरी हमारा' },
        notes: 'G M P P P G M D P',
      },
      {
        lyric: { en: 'Wo paasbaan hamara', hi: 'वो पासबाँ हमारा' },
        notes: 'G M P M g',
      },
      {
        lyric: { en: 'Godi mein khelti hain', hi: 'गोदी में खेलती हैं' },
        notes: 'g g g g g R M g R S R .N',
      },
      {
        lyric: { en: 'Jis ki hazaaron nadiya', hi: 'जिस की हज़ारों नदियाँ' },
        notes: '.N .N .N .N S g S S',
      },
      {
        lyric: { en: 'Gulshan hai jinke dum se', hi: 'गुलशन है जिनके दम से' },
        notes: 'G M P P P G M D P',
      },
      {
        lyric: { en: 'Rashk-e-janna hamara', hi: 'रश्क-ए-जनाँ हमारा' },
        notes: 'G M P M g',
      },
      {
        lyric: { en: 'Mazhab nahin sikhata', hi: 'मज़हब नहीं सिखाता' },
        notes: 'G G G G G M R M g',
      },
      {
        lyric: { en: 'Aapas mein bair rakhna', hi: 'आपस में बैर रखना' },
        notes: 'R D D D D N P N D',
      },
      {
        lyric: { en: 'Hindi hai hum (×3)', hi: 'हिन्दी हैं हम (×3)' },
        notes: "S' S' S' S'",
      },
      {
        lyric: { en: 'Watan hai Hindostan', hi: 'वतन है हिन्दोस्ताँ' },
        notes: 'D G P M G M P M g',
      },
      {
        lyric: { en: 'Hamara hamara', hi: 'हमारा हमारा' },
        notes: 'R S S S S .N .D .P',
      },
    ],
  },
]

export function songById(id) {
  return SONGS.find((s) => s.id === id)
}

// One page per song per locale.
export function allSongPages() {
  const pages = []
  for (const s of SONGS) {
    pages.push({ id: s.id, path: `/songs/${s.id}/` })
    pages.push({ id: s.id, path: `/hi/songs/${s.id}/` })
  }
  return pages
}
