/* =====================================================================
   WEDDING CONFIGURATION  —  edit everything about the invitation here.
   ---------------------------------------------------------------------
   • Text fields that appear in both languages are { en: "...", pa: "..." }.
   • Leave a field as "" or null to hide it. Nothing is invented if blank.
   • Times are local to `timezone` (IST). Use 24-hour "HH:MM".
   • Two invitation "sides" share one site:
       default            → groom side (Aneja family)
       add #bride to URL  → bride side (Khurana family)
       (on your own hosting, ?side=bride also works)
   ===================================================================== */
window.WEDDING = {
  siteUrl: "https://nishkam-b.github.io/nikhil-weds-dikshita/", // ← paste the final public URL here once hosted (used for sharing)
  timezone: "Asia/Kolkata",
  utcOffset: "+05:30",

  couple: {
    groom: { en: "Nikhil", pa: "ਨਿਖਿਲ" },
    bride: { en: "Dikshita", pa: "ਦੀਕਸ਼ਿਤਾ" },
    monogram: "monogram.webp",
    monogramSmall: "monogram-sm.webp",
  },

  // The main ceremony the countdown points to (must match an event id below)
  mainEventId: "anand-karaj",

  /* ---------------- Invitation wording, per side ---------------- */
  sides: {
    groom: {
      order: ["groom", "bride"], // whose name comes first
      blessingLine: {
        en: "By the grace of Waheguru Ji and with the blessings of Sri Guru Granth Sahib Ji",
        pa: "ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਕਿਰਪਾ ਅਤੇ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਅਸ਼ੀਰਵਾਦ ਨਾਲ",
      },
      heavenlyBlessings: {
        en: "Late Smt. Krishna Devi Aneja & Late Sh. Harbans Lal Aneja",
        pa: "ਸਵ. ਸ੍ਰੀਮਤੀ ਕ੍ਰਿਸ਼ਨਾ ਦੇਵੀ ਅਨੇਜਾ ਅਤੇ ਸਵ. ਸ੍ਰੀ ਹਰਬੰਸ ਲਾਲ ਅਨੇਜਾ",
      },
      hosts: { en: "Mrs. Rajni & Mr. Deepak Aneja", pa: "ਸ੍ਰੀਮਤੀ ਰਜਨੀ ਅਤੇ ਸ੍ਰੀ ਦੀਪਕ ਅਨੇਜਾ" },
      request: {
        en: "request the honour of your gracious presence with family on the auspicious occasion of the Anand Karaj of their beloved son",
        pa: "ਆਪਣੇ ਪਿਆਰੇ ਸਪੁੱਤਰ ਦੇ ਅਨੰਦ ਕਾਰਜ ਦੇ ਸ਼ੁਭ ਮੌਕੇ ਉੱਤੇ ਆਪ ਜੀ ਨੂੰ ਪਰਿਵਾਰ ਸਮੇਤ ਪਧਾਰਨ ਦਾ ਸਨਿਮਰ ਸੱਦਾ ਦਿੰਦੇ ਹਨ",
      },
      firstLineage: {
        en: "Grandson of Late Smt. Krishna Devi Aneja & Late Sh. Harbans Lal Aneja",
        pa: "ਸਵ. ਸ੍ਰੀਮਤੀ ਕ੍ਰਿਸ਼ਨਾ ਦੇਵੀ ਅਨੇਜਾ ਅਤੇ ਸਵ. ਸ੍ਰੀ ਹਰਬੰਸ ਲਾਲ ਅਨੇਜਾ ਦੇ ਪੋਤਰੇ",
      },
      secondLineage: {
        en: "D/o Mrs. Anju Khurana & Late Mr. Gulshan Khurana",
        pa: "ਸ੍ਰੀਮਤੀ ਅੰਜੂ ਖੁਰਾਣਾ ਅਤੇ ਸਵ. ਸ੍ਰੀ ਗੁਲਸ਼ਨ ਖੁਰਾਣਾ ਦੀ ਸਪੁੱਤਰੀ",
      },
      eagerlyAwaiting: { en: "“Our Sunshine” Yashiv Aneja", pa: "“ਸਾਡੀ ਧੁੱਪ” ਯਸ਼ਿਵ ਅਨੇਜਾ" },
      compliments: [
        { en: "Deepika & Nipun Aneja", pa: "ਦੀਪਿਕਾ ਅਤੇ ਨਿਪੁਨ ਅਨੇਜਾ" },
        { en: "All Aneja & Ahuja Family", pa: "ਸਮੂਹ ਅਨੇਜਾ ਅਤੇ ਆਹੂਜਾ ਪਰਿਵਾਰ" },
        { en: "Relatives & Friends", pa: "ਰਿਸ਼ਤੇਦਾਰ ਅਤੇ ਦੋਸਤ" },
      ],
      contact: {
        names: { en: "Rajni & Deepak Aneja", pa: "ਰਜਨੀ ਅਤੇ ਦੀਪਕ ਅਨੇਜਾ" },
        address: { en: "173 Gandhi Nagar, Sri Ganganagar (Raj.)", pa: "173 ਗਾਂਧੀ ਨਗਰ, ਸ੍ਰੀ ਗੰਗਾਨਗਰ (ਰਾਜ.)" },
        phones: ["92615 99999", "95495 00009", "97832 34560"],
      },
      film: null, // invitation film for this side (see bride side)
    },

    bride: {
      order: ["bride", "groom"],
      blessingLine: { en: "By the grace of Waheguru Ji", pa: "ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਕਿਰਪਾ ਨਾਲ" },
      heavenlyBlessings: {
        en: "Late Smt. Lajwanti Khurana & Late Shri Harbhagwan Khurana",
        pa: "ਸਵ. ਸ੍ਰੀਮਤੀ ਲਾਜਵੰਤੀ ਖੁਰਾਣਾ ਅਤੇ ਸਵ. ਸ੍ਰੀ ਹਰਭਗਵਾਨ ਖੁਰਾਣਾ",
      },
      hosts: { en: "Mrs. Anju Khurana", pa: "ਸ੍ਰੀਮਤੀ ਅੰਜੂ ਖੁਰਾਣਾ" },
      request: {
        en: "requests the honour of your presence with family at the Anand Karaj of her beloved daughter",
        pa: "ਆਪਣੀ ਪਿਆਰੀ ਸਪੁੱਤਰੀ ਦੇ ਅਨੰਦ ਕਾਰਜ ਉੱਤੇ ਆਪ ਜੀ ਨੂੰ ਪਰਿਵਾਰ ਸਮੇਤ ਪਧਾਰਨ ਦਾ ਸਨਿਮਰ ਸੱਦਾ ਦਿੰਦੇ ਹਨ",
      },
      firstLineage: {
        en: "Granddaughter of Late Smt. Lajwanti Khurana & Late Shri Harbhagwan Khurana · D/o Mrs. Anju Khurana & Late Mr. Gulshan Khurana",
        pa: "ਸਵ. ਸ੍ਰੀਮਤੀ ਲਾਜਵੰਤੀ ਖੁਰਾਣਾ ਅਤੇ ਸਵ. ਸ੍ਰੀ ਹਰਭਗਵਾਨ ਖੁਰਾਣਾ ਦੀ ਪੋਤਰੀ · ਸ੍ਰੀਮਤੀ ਅੰਜੂ ਖੁਰਾਣਾ ਅਤੇ ਸਵ. ਸ੍ਰੀ ਗੁਲਸ਼ਨ ਖੁਰਾਣਾ ਦੀ ਸਪੁੱਤਰੀ",
      },
      secondLineage: { en: "S/o Mrs. Rajni & Mr. Deepak Aneja", pa: "ਸ੍ਰੀਮਤੀ ਰਜਨੀ ਅਤੇ ਸ੍ਰੀ ਦੀਪਕ ਅਨੇਜਾ ਦੇ ਸਪੁੱਤਰ" },
      eagerlyAwaiting: null,
      compliments: [{ en: "Khurana's & Jasuja's", pa: "ਖੁਰਾਣਾ ਅਤੇ ਜਸੂਜਾ ਪਰਿਵਾਰ" }],
      contact: null, // add { names, address, phones: [] } if the bride side wants contacts shown
      film: { src: "lavan-film.mp4", poster: "film-poster.webp" },
    },
  },

  /* ---------------- Venues ---------------- */
  // `mapQuery` is what Google Maps searches for. Replace with an exact
  // Google Maps place link in `mapUrl` if you have one (it wins if set).
  venues: {
    klm: {
      name: { en: "K.L.M. Hotel & Resort", pa: "ਕੇ.ਐਲ.ਐਮ. ਹੋਟਲ ਐਂਡ ਰਿਜ਼ੋਰਟ" },
      address: { en: "Sri Ganganagar, Rajasthan", pa: "ਸ੍ਰੀ ਗੰਗਾਨਗਰ, ਰਾਜਸਥਾਨ" },
      mapQuery: "KLM Hotel & Resort, Sri Ganganagar, Rajasthan",
      mapUrl: "",
      parking: null,
    },
    gurdwara: {
      name: { en: "Ridhi Sidhi Enclave Gurudwara", pa: "ਰਿੱਧੀ ਸਿੱਧੀ ਐਨਕਲੇਵ ਗੁਰਦੁਆਰਾ" },
      subtitle: {
        en: "Gurudwara Baba Jorawar Singh Baba Fateh Singh Ji",
        pa: "ਗੁਰਦੁਆਰਾ ਬਾਬਾ ਜ਼ੋਰਾਵਰ ਸਿੰਘ ਬਾਬਾ ਫ਼ਤਹਿ ਸਿੰਘ ਜੀ",
      },
      address: { en: "Sri Ganganagar, Rajasthan", pa: "ਸ੍ਰੀ ਗੰਗਾਨਗਰ, ਰਾਜਸਥਾਨ" },
      mapQuery: "Gurudwara Baba Jorawar Singh Baba Fateh Singh Ji, Ridhi Sidhi Enclave, Sri Ganganagar",
      mapUrl: "",
      parking: null,
    },
    sapphire: {
      name: { en: "Blue Sapphire (By Jagga)", pa: "ਬਲੂ ਸੈਫ਼ਾਇਰ (ਬਾਇ ਜੱਗਾ)" },
      address: { en: "Sri Karanpur By-pass Road, Sri Ganganagar", pa: "ਸ੍ਰੀ ਕਰਨਪੁਰ ਬਾਈ-ਪਾਸ ਰੋਡ, ਸ੍ਰੀ ਗੰਗਾਨਗਰ" },
      mapQuery: "Blue Sapphire by Jagga, Sri Karanpur Bypass Road, Sri Ganganagar",
      mapUrl: "",
      parking: null,
    },
  },

  /* ---------------- Functions (chronological) ----------------
     type: roka | mehendi | haldi | sangeet | chooda | anand-karaj | reception | ring
     end: "" when no end time was given (calendar entries then use the start only)
     enabled: false hides a function everywhere (e.g. a reception-only invite)  */
  events: [
    {
      id: "ring",
      type: "ring",
      enabled: true,
      name: { en: "Ring Ceremony", pa: "ਮੰਗਣੀ (ਰਿੰਗ ਸੈਰੇਮਨੀ)" },
      date: "2026-11-13",
      start: "20:00",
      end: "",
      venue: "klm",
      dressCode: null,
    },
    {
      id: "anand-karaj",
      type: "anand-karaj",
      enabled: true,
      name: { en: "Anand Karaj", pa: "ਅਨੰਦ ਕਾਰਜ" },
      subtitle: { en: "Lavan Phere", pa: "ਲਾਵਾਂ ਫੇਰੇ" },
      date: "2026-11-14",
      start: "10:00",
      end: "11:00",
      venue: "gurdwara",
      note: { en: "Followed by lunch at K.L.M. Hotel & Resort", pa: "ਉਪਰੰਤ ਦੁਪਹਿਰ ਦਾ ਭੋਜਨ ਕੇ.ਐਲ.ਐਮ. ਹੋਟਲ ਐਂਡ ਰਿਜ਼ੋਰਟ ਵਿਖੇ" },
      noteVenue: "klm",
      dressCode: null,
    },
    {
      id: "reception",
      type: "reception",
      enabled: true,
      name: { en: "Reception", pa: "ਰਿਸੈਪਸ਼ਨ" },
      date: "2026-11-14",
      start: "20:00",
      end: "",
      venue: "sapphire",
      dressCode: null,
    },
  ],

  /* Dress codes: the section is hidden while every event's dressCode is null.
     Example:  dressCode: { text: {en:"Pastels", pa:"ਹਲਕੇ ਰੰਗ"}, colours: ["#DCE5D5","#F1D9D7"] }  */

  /* ---------------- Gallery ----------------
     Real photos: { src, alt:{en,pa}, caption:{en,pa} }
     Placeholders (shown as labelled empty frames): { placeholder: true, label:{en,pa} }  */
  gallery: [
    { src: "monogram.webp", alt: { en: "Illustrated N and D monogram with lotus vines, a camel and a couple at a jharokha window", pa: "ਕਮਲ ਦੀਆਂ ਵੇਲਾਂ ਨਾਲ ਸਜਿਆ N ਅਤੇ D ਮੋਨੋਗ੍ਰਾਮ" }, caption: { en: "Our monogram", pa: "ਸਾਡਾ ਮੋਨੋਗ੍ਰਾਮ" } },
    { src: "anand-karaj-mandap.webp", alt: { en: "Illustration of the couple seated before Sri Guru Granth Sahib Ji under a floral canopy", pa: "ਫੁੱਲਾਂ ਦੀ ਛਾਂ ਹੇਠ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਅੱਗੇ ਬੈਠੀ ਜੋੜੀ ਦਾ ਚਿੱਤਰ" }, caption: { en: "Anand Karaj illustration", pa: "ਅਨੰਦ ਕਾਰਜ ਦਾ ਚਿੱਤਰ" } },
    { placeholder: true, label: { en: "Couple portrait", pa: "ਜੋੜੀ ਦੀ ਤਸਵੀਰ" } },
    { placeholder: true, label: { en: "Engagement photo", pa: "ਮੰਗਣੀ ਦੀ ਤਸਵੀਰ" } },
    { placeholder: true, label: { en: "Pre-wedding photo", pa: "ਵਿਆਹ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਤਸਵੀਰ" } },
    { placeholder: true, label: { en: "Family photo", pa: "ਪਰਿਵਾਰਕ ਤਸਵੀਰ" } },
  ],

  /* ---------------- Background music ----------------
     Starts at 50% volume when the guest taps "Open Invitation"; guests can pause it from the top bar.  */
  music: { src: "wedding-music.mp3", volume: 0.5, title: { en: "", pa: "" } },

  /* ---------------- Sharing ---------------- */
  shareMessage: {
    en: "With the blessings of Waheguru, you are warmly invited to the Anand Karaj of {first} & {second} on Saturday, 14 November 2026 in Sri Ganganagar. All details here:",
    pa: "ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਕਿਰਪਾ ਨਾਲ, ਆਪ ਜੀ ਨੂੰ {first} ਅਤੇ {second} ਦੇ ਅਨੰਦ ਕਾਰਜ (ਸ਼ਨਿੱਚਰਵਾਰ, 14 ਨਵੰਬਰ 2026, ਸ੍ਰੀ ਗੰਗਾਨਗਰ) ਲਈ ਨਿੱਘਾ ਸੱਦਾ ਹੈ। ਪੂਰੀ ਜਾਣਕਾਰੀ:",
  },
};
