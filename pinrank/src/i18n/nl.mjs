/** Dutch (Flanders / Brussels). `tr` is the trade object for trade pages, null on the generic page. */

export default {
  code: "nl",
  htmlLang: "nl-BE",
  ogLocale: "nl_BE",
  label: "NL",
  slugs: { thanks: "bedankt", privacy: "privacy" },

  trades: {
    roofer: { slug: "dakwerker", label: "Dakwerker", plural: "dakwerkers", adPlural: "Dakwerkers", search: "dakwerker in de buurt", job: 2500 },
    renovation: { slug: "renovatie", label: "Renovatie / aannemer", plural: "renovatiebedrijven", adPlural: "Renovatiebedrijven", search: "renovatie aannemer in de buurt", job: 6000 },
    plumber: { slug: "loodgieter", label: "Loodgieter", plural: "loodgieters", adPlural: "Loodgieters", search: "loodgieter in de buurt", job: 350 },
    electrician: { slug: "elektricien", label: "Elektricien", plural: "elektriciens", adPlural: "Elektriciens", search: "elektricien in de buurt", job: 500 },
    other: { label: "Ander bouw- of thuisservicebedrijf", plural: "vakmensen", job: 1500 },
  },

  meta: {
    title: (tr) =>
      tr
        ? `Meer klanten via Google Maps voor ${tr.plural} — PinRank`
        : "PinRank — Bovenaan in Google Maps voor vakmensen in België",
    description: (tr) =>
      `PinRank optimaliseert elke week je Google-bedrijfsprofiel zodat ${tr ? tr.plural : "dakwerkers, renovatiebedrijven, loodgieters en elektriciens"} in België hoger staan in Google Maps. Niet hoger na 3 maanden? Geld terug.`,
  },

  /** Text on the link-preview image (scripts/og.mjs). */
  og: { eyebrow: "Voor dakwerkers, renovatie, loodgieters en elektriciens", title: "Bovenaan in Google Maps.", sub: "Niet hoger na 3 maanden? Geld terug." },

  /** Headline on the ad videos (scripts/ad-video.mjs). */
  adVideo: { headline: (tr) => (tr ? `${tr.adPlural}: sta jij in de top 3 op Google Maps?` : "Sta jij in de top 3 op Google Maps?") },

  nav: { cta: "Gratis scan", langLabel: "Taal" },

  hero: {
    eyebrow: (tr) => (tr ? `Voor ${tr.plural} in België` : "Voor dakwerkers, renovatiebedrijven, loodgieters en elektriciens in België"),
    title: (tr) =>
      tr
        ? `Iemand zoekt nu <em>‘${tr.search}’</em>. Sta jij in de top 3?`
        : "Sta bovenaan in Google Maps — en word gebeld <em>vóór</em> je concurrent.",
    sub: "PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat klanten uit jouw regio jóu vinden en bellen. Staat je ranking na 3 maanden niet hoger? Dan krijg je je geld terug.",
    cta: "Vraag je gratis rankingscan aan",
    ctaNote: "4 korte vragen · 30 seconden · Vrijblijvend",
    wa: "Liever meteen een WhatsApp sturen",
    pick: "Wat is jouw vak?",
    trust: ["Geld-terug-garantie na 3 maanden", "Reels en posts voor je socials", "Gratis website voor je zaak", "Maandelijks rankingrapport"],
  },

  demo: {
    label: "Illustratief voorbeeld",
    week: "Week",
    avg: "Gem. positie",
    top3: "In de top 3",
    play: "Afspelen",
    pause: "Pauzeren",
    alt: "Animatie: de ranking van een vakman op 25 punten in zijn regio verbetert over 12 weken.",
    captions: [
      { w: 0, t: "Startmeting op 25 punten in je regio" },
      { w: 1, t: "Profiel volledig geoptimaliseerd" },
      { w: 3, t: "Elke week nieuwe berichten en foto’s" },
      { w: 6, t: "Elke review krijgt een antwoord" },
      { w: 9, t: "Google ziet een actieve, betrouwbare zaak" },
      { w: 12, t: "Het doel: top 3 rond je zaak" },
    ],
  },

  mock: {
    label: "Wat je klant ziet op Google",
    you: "Jouw bedrijf",
    rivalA: "Concurrent A",
    rivalB: "Concurrent B",
    rivalC: "Concurrent C",
    notVisible: "Plaats 7 · klanten zien je niet",
    incoming: "Inkomende oproep",
    via: "Nieuwe klant via Google Maps",
    open: "Nu open",
    call: "Bellen",
    route: "Route",
    caption: "Illustratie",
  },

  problem: {
    title: "Wie niet in de top 3 staat, wordt zelden gebeld",
    body: "Bij een lekkend dak, een verstopte leiding of een stroompanne gaat niemand naar pagina twee. En wie een verbouwing plant, belt eerst de goed beoordeelde bedrijven bovenaan de kaart. Mensen googelen, zien drie bedrijven en bellen er één. Sta jij daar niet tussen, dan gaat die klus naar iemand anders — ook al werk je beter of goedkoper.",
    points: [
      { t: "Afhankelijk van anderen", d: "Zonder klanten via Google ben je afhankelijk van mond-tot-mondreclame of leadplatformen die je voor elke aanvraag laten betalen." },
      { t: "Een profiel dat stilstaat", d: "Google beloont profielen die actief zijn: nieuwe foto’s, berichten, antwoorden op reviews. De meeste vakmensen hebben daar geen tijd voor." },
      { t: "Concurrenten die wél bewegen", d: "Wie zijn profiel elke week bijwerkt, schuift langzaam op. Wie niets doet, zakt." },
    ],
  },

  grid: {
    title: "We meten je ranking op 25 punten in je regio",
    body: "Je positie in Google Maps hangt af van waar de klant zoekt. Daarom meten we op een raster rond je zaak hoe hoog je staat — vóór we beginnen en daarna elke maand. Zo zie je zwart op wit of het werkt.",
    before: "Vandaag",
    after: "Het doel na 3 maanden",
    legend: ["Top 3", "Plaats 4–10", "Niet zichtbaar"],
    caption: "Illustratief voorbeeld. In het gratis gesprek bekijken we samen waar jij vandaag staat.",
  },

  how: {
    title: "Zo werkt het",
    steps: [
      { t: "Gratis rankingscan en gesprek (15 min)", d: "We tonen je op de kaart waar je vandaag staat voor de zoekwoorden die jou klanten opleveren, en wie er boven je staat." },
      { t: "We zetten je profiel goed", d: "In de eerste week stemmen we je categorieën, diensten, beschrijving, foto’s en werkgebied af op de zoektermen van jouw vak." },
      { t: "Elke week een stap vooruit", d: "Daarna werken we wekelijks aan je profiel. Elke maand krijg je een rapport met je ranking op de kaart." },
    ],
  },

  features: {
    title: "Wat we elke week voor je doen",
    sub: "Jij doet je vak. Wij zorgen dat Google ziet dat je zaak actief, relevant en betrouwbaar is.",
    items: [
      { t: "Zoekwoordenonderzoek", d: "We zoeken uit waarop klanten in jouw regio echt zoeken en bouwen je profiel daarrond." },
      { t: "Volledig geoptimaliseerd profiel", d: "Categorieën, diensten, beschrijving en werkgebied volledig ingevuld en afgestemd." },
      { t: "Wekelijkse Google-berichten", d: "Elke week een nieuw bericht op je profiel, zodat Google ziet dat je zaak leeft." },
      { t: "Foto’s van je werk", d: "We plaatsen regelmatig foto’s met de juiste beschrijving. Jij stuurt ze gewoon door." },
      { t: "Antwoord op elke review", d: "Elke review krijgt een professioneel antwoord — ook de minder goede." },
      { t: "Maandelijks rankingrapport", d: "Elke maand zie je op de kaart hoe je positie evolueert. Geen vage cijfers." },
    ],
  },

  social: {
    title: "En je socials? Die doen we er gewoon bij.",
    body: "Klanten checken je Instagram, TikTok of YouTube voor ze bellen. Wij maken van je foto’s en filmpjes korte reels met ondertitels, schrijven de captions en posten ze voor je. Jij hoeft alleen toegang te geven.",
    steps: [
      { t: "Jij geeft toegang", d: "Tot je Instagram, Facebook, TikTok en YouTube. Eén keer; we leggen uit hoe." },
      { t: "Je stuurt foto’s en filmpjes", d: "Gewoon via WhatsApp, rechtstreeks van de werf." },
      { t: "Wij maken en posten alles", d: "Reels met ondertitels, captions en hashtags, op een vast ritme." },
    ],
    platforms: "Instagram · Facebook · TikTok · YouTube Shorts",
    label: "Voorbeeld van een reel",
    handle: "@jouwbedrijf",
    captions: {
      roofer: "Nieuw dak in Gent, klaar in 3 dagen",
      renovation: "Badkamer volledig vernieuwd in Leuven",
      plumber: "Lek gevonden en hersteld binnen het uur",
      electrician: "Nieuwe zekeringkast, veilig en gekeurd",
      other: "Weer een tevreden klant in de buurt",
    },
  },

  website: {
    title: "Geen website, of een verouderde? Wij bouwen er gratis een.",
    body: "Klanten die je vinden in Google Maps, klikken vaak door naar je website. Wij bouwen een snelle, mobiele site met je diensten, werkgebied, foto’s en reviews, gekoppeld aan je Google-profiel. Gratis, als onderdeel van je PinRank-pakket.",
    points: ["Snel en perfect op je gsm", "Je diensten, werkgebied en reviews", "Bel- en WhatsApp-knop bovenaan", "Wij bouwen hem: jij levert foto’s en info"],
    label: "Voorbeeld van een website",
    url: "jouwbedrijf.be",
    call: "Bel nu",
    quote: "Offerte aanvragen",
    reviews: "Google-reviews",
    samples: {
      roofer: { name: "Dakwerken Peeters", title: "Uw dakwerker in Gent en omstreken", services: ["Nieuw dak", "Dakherstelling", "Dakgoten"] },
      renovation: { name: "Peeters Renovatie", title: "Renovatie van A tot Z in Leuven", services: ["Badkamers", "Keukens", "Totaalrenovatie"] },
      plumber: { name: "Loodgieterij Peeters", title: "Uw loodgieter in Antwerpen, 7 op 7", services: ["Lekdetectie", "Ontstopping", "Sanitair"] },
      electrician: { name: "Elektro Peeters", title: "Erkend elektricien in Brugge", services: ["Keuring", "Zekeringkast", "Laadpalen"] },
    },
  },

  proof: { title: "Wat klanten zeggen" },

  guarantee: {
    ring: "GELD-TERUG-GARANTIE • NIET HOGER, GELD TERUG • ",
    months: "maanden",
    badge: "3 maanden",
    title: "Niet hoger na 3 maanden? Geld terug.",
    body: "We meten je ranking bij de start. Staat je gemiddelde positie in Google Maps na 3 maanden niet hoger, dan betalen we je terug wat je bij ons betaald hebt. Het risico ligt bij ons, niet bij jou.",
    note: "De voorwaarden leggen we vóór de start schriftelijk vast.",
  },

  fit: {
    title: "Is dit iets voor jou?",
    yesTitle: "Wel voor jou als…",
    yes: [
      "je een dakwerkersbedrijf, renovatiebedrijf, loodgieterij of elektriciteitsbedrijf hebt (of een ander bouw- of thuisservicebedrijf)",
      "je in België in een vaste regio werkt",
      "je meer klussen aankunt en die liever rechtstreeks krijgt dan via leadplatformen",
    ],
    noTitle: "Niet voor jou als…",
    no: ["je nu al geen nieuwe klanten meer aankunt", "je geen vast werkgebied hebt", "je resultaat verwacht binnen één week"],
  },

  calc: {
    title: "Wat levert één extra klus jou op?",
    sub: "Vul je eigen cijfers in en zie wanneer PinRank zichzelf terugverdient.",
    job: "Gemiddelde waarde van een klus",
    extra: "Extra klussen per maand via Google",
    revenue: "Extra omzet per maand",
    one: "PinRank is terugverdiend met {n} klus per maand.",
    many: "PinRank is terugverdiend met {n} klussen per maand.",
    note: "Rekenvoorbeeld met jouw cijfers, geen belofte van resultaat. Bedragen excl. btw.",
  },

  pricing: {
    title: "Eén pakket. Eén duidelijke prijs.",
    name: "PinRank Local",
    period: { month: "per maand", once: "eenmalig" },
    vat: "excl. btw",
    includes: [
      "Zoekwoordenonderzoek voor jouw vak en regio",
      "Volledige optimalisatie van je Google-profiel",
      "Wekelijkse berichten en foto’s",
      "Antwoord op elke review",
      "Maandelijks rankingrapport op de kaart",
      "Reels en posts voor Instagram, Facebook, TikTok en YouTube, met ondertitels",
      "Gratis website voor je zaak, gekoppeld aan je Google-profiel",
      "Geld-terug-garantie na 3 maanden",
    ],
    cta: "Plan een gratis gesprek",
    note: "Eerst een vrijblijvend gesprek — pas daarna beslis je.",
  },

  faq: {
    title: "Veelgestelde vragen",
    items: [
      { q: "Wat is de gratis rankingscan?", a: "Een kaart van je regio waarop je ziet op welke plaats je in Google Maps staat voor je belangrijkste zoekwoord, op 25 punten rond je zaak, en wie er boven je staat. We overlopen hem samen in het gratis gesprek." },
      { q: "Wat moet ik doen voor de social media?", a: "Je geeft ons één keer toegang tot je Instagram, Facebook, TikTok en YouTube en stuurt af en toe foto’s of filmpjes van je werk via WhatsApp. Wij monteren er reels van met ondertitels, schrijven de captions en posten alles voor je." },
      { q: "Is de website echt gratis?", a: "Ja. We bouwen hem als onderdeel van je PinRank-pakket, zonder extra kosten. Heb je al een website, dan bekijken we samen of we die beter maken of vervangen." },
      { q: "Hoe snel zie ik resultaat?", a: "Dat hangt af van je regio en hoeveel concurrentie er is. Lokale ranking bouw je op over weken, niet dagen — daarom meten we na 3 maanden en geven we je dan een geld-terug-garantie." },
      { q: "Hoe werkt de geld-terug-garantie precies?", a: "Bij de start meten we je ranking op de kaart voor je belangrijkste zoekwoorden. Na 3 maanden meten we opnieuw, op dezelfde manier. Is je gemiddelde positie niet verbeterd, dan storten we terug wat je betaald hebt." },
      { q: "Moet ik zelf veel doen?", a: "Heel weinig. Je geeft ons toegang tot je Google-bedrijfsprofiel (we leggen uit hoe) en stuurt af en toe foto’s van je werk door. De rest doen wij." },
      { q: "Ik heb nog geen Google-bedrijfsprofiel. Kan ik toch starten?", a: "Zeg het ons in het gesprek. We bekijken samen wat de beste eerste stap is." },
      { q: "Is dit hetzelfde als Google Ads?", a: "Nee. Met Google Ads betaal je per klik en stopt alles zodra je stopt met betalen. Wij werken aan je plek in de gewone Google Maps-resultaten — daar betaal je niet per klik." },
      { q: "Wat gebeurt er in het gratis gesprek?", a: "We bekijken je huidige ranking, tonen wat je concurrenten anders doen en zeggen eerlijk of we je kunnen helpen. Past het niet, dan zeggen we dat ook." },
    ],
  },

  final: {
    title: "Benieuwd waar je vandaag staat?",
    body: "Beantwoord 4 korte vragen en we maken je gratis rankingscan: waar sta je vandaag, en wie staat er boven je? We bespreken hem in een gesprek van 15 minuten.",
    cta: "Vraag je gratis rankingscan aan",
  },

  sticky: { cta: "Gratis scan" },

  quiz: {
    title: "Je gratis rankingscan",
    progress: "Stap {n} van {total}",
    close: "Sluiten",
    back: "Terug",
    next: "Volgende",
    q1: "Wat voor bedrijf heb je?",
    q2: "In welke regio werk je?",
    q2Placeholder: "bv. Gent, Leuven of Antwerpen",
    q3: "Heb je al een Google-bedrijfsprofiel?",
    gbp: { yes: "Ja", no: "Nee", unsure: "Weet ik niet" },
    q4: "Waar mogen we je bereiken?",
    fields: { name: "Je naam", company: "Bedrijfsnaam", phone: "Gsm-nummer", email: "E-mailadres" },
    submit: "Vraag mijn scan aan",
    privacy: "We gebruiken je gegevens alleen om je aanvraag op te volgen.",
    privacyLink: "Privacybeleid",
    errors: { required: "Vul dit even in.", phone: "Dit lijkt geen geldig nummer.", email: "Dit lijkt geen geldig e-mailadres." },
    resultTitle: "Goed nieuws, {name}!",
    resultBody: "We maken je rankingscan voor {region}. Kies hieronder een moment voor je gratis gesprek van 15 minuten: we tonen je waar je staat en wat je concurrenten anders doen.",
    resultBodyNoCal: "We maken je rankingscan voor {region}. Stuur ons een WhatsApp en we plannen meteen een gesprek van 15 minuten om hem te bespreken.",
    or: "of",
    wa: "Liever via WhatsApp? Stuur ons een bericht",
    waPrimary: "Plan je gesprek via WhatsApp",
  },

  wa: {
    generic: "Hallo PinRank, ik wil graag meer weten over hoger staan in Google Maps.",
    quiz: "Hallo PinRank, ik ben {name} van {company} ({trade}, {region}). Ik wil graag een gratis gesprek plannen over mijn ranking in Google Maps.",
  },

  thanks: {
    meta: "Je gesprek staat gepland — PinRank",
    title: "Top, je gesprek staat gepland!",
    body: "Je krijgt zo meteen een bevestiging per e-mail met alle details.",
    prepTitle: "Zo haal je er het meeste uit",
    prep: [
      "Zorg dat je kan inloggen op het Google-account dat aan je bedrijfsprofiel gekoppeld is.",
      "Denk na over de 2–3 diensten waarvoor je het liefst meer klanten wil.",
      "Noteer welke concurrenten je vaak boven jou ziet staan.",
    ],
    wa: "Iets vergeten of wil je verplaatsen? Stuur ons een WhatsApp",
    back: "Terug naar de website",
  },

  cookie: {
    text: "We gebruiken cookies om te meten welke advertenties werken — alleen als jij dat goed vindt.",
    accept: "Akkoord",
    decline: "Weigeren",
    settings: "Cookie-instellingen",
  },

  footer: {
    vat: "Ondernemingsnr.",
    privacy: "Privacybeleid",
    disclaimer: "PinRank is niet verbonden aan Google. Google en Google Maps zijn handelsmerken van Google LLC.",
  },

  privacy: {
    meta: "Privacybeleid — PinRank",
    title: "Privacybeleid",
    updated: "Laatst bijgewerkt",
    sections: (c) => [
      { h: "Wie is verantwoordelijk?", p: `${c.name}${c.address ? `, ${c.address}` : ""}${c.vat ? `, ondernemingsnummer ${c.vat}` : ""}. Vragen over je gegevens? Mail naar ${c.email}.` },
      { h: "Welke gegevens verzamelen we?", p: "Wat je invult in onze vragenlijst (naam, bedrijfsnaam, regio, type bedrijf, gsm-nummer, e-mailadres), wat je opgeeft bij het plannen van een gesprek, berichten die je ons via WhatsApp stuurt en — alleen met je toestemming — advertentiecookies." },
      { h: "Waarom?", p: "Om je aanvraag op te volgen en een gesprek met je te plannen (stappen vóór een overeenkomst, art. 6.1.b AVG). Advertentiecookies gebruiken we alleen om te meten welke advertenties werken, en enkel als je daarvoor toestemming geeft (art. 6.1.a AVG). Die toestemming kan je altijd intrekken via ‘Cookie-instellingen’ onderaan de pagina." },
      { h: "Met wie delen we ze?", p: "Met diensten die ons helpen: Cal.com (afspraken plannen), Meta (advertentiemeting, alleen met toestemming), WhatsApp (berichten), onze hostingprovider en de tool waarin we aanvragen bijhouden. Sommige van deze partijen verwerken gegevens buiten de EU; dat gebeurt dan op basis van de standaardcontractbepalingen van de Europese Commissie of het EU-VS Data Privacy Framework. We verkopen je gegevens nooit." },
      { h: "Hoe lang bewaren we ze?", p: "Word je geen klant, dan verwijderen we je gegevens uiterlijk 24 maanden na ons laatste contact. Word je klant, dan bewaren we ze zolang als nodig voor de samenwerking en onze wettelijke verplichtingen." },
      { h: "Jouw rechten", p: `Je hebt het recht op inzage, verbetering, verwijdering, beperking, overdraagbaarheid en bezwaar. Mail naar ${c.email}. Ben je niet tevreden met ons antwoord, dan kan je klacht indienen bij de Gegevensbeschermingsautoriteit (www.gegevensbeschermingsautoriteit.be).` },
    ],
  },
};
