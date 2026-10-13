/** French (Wallonia / Brussels). `tr` is the trade object for trade pages, null on the generic page. */

export default {
  code: "fr",
  htmlLang: "fr-BE",
  ogLocale: "fr_BE",
  label: "FR",
  slugs: { thanks: "merci", privacy: "confidentialite" },

  trades: {
    electrician: { slug: "electricien", label: "Électricien", plural: "électriciens", adPlural: "Électriciens", search: "électricien près de chez moi" },
    roofer: { slug: "couvreur", label: "Couvreur", plural: "couvreurs", adPlural: "Couvreurs", search: "couvreur près de chez moi" },
    plumber: { slug: "plombier", label: "Plombier", plural: "plombiers", adPlural: "Plombiers", search: "plombier près de chez moi" },
    heating: { slug: "chauffagiste", label: "Chauffage / pompes à chaleur", plural: "chauffagistes", adPlural: "Chauffagistes", search: "installateur pompe à chaleur" },
    other: { label: "Autre service à domicile", plural: "artisans" },
  },

  meta: {
    title: (tr) =>
      tr
        ? `Plus de clients via Google Maps pour les ${tr.plural} — PinRank`
        : "PinRank — En tête de Google Maps pour les artisans en Belgique",
    description: (tr) =>
      `PinRank optimise chaque semaine votre fiche Google Business pour que les ${tr ? tr.plural : "électriciens, couvreurs et entreprises de services à domicile"} en Belgique montent dans Google Maps. Pas mieux classé après 3 mois ? Remboursé.`,
  },

  /** Text on the link-preview image (scripts/og.mjs). */
  og: { eyebrow: "Pour les électriciens, couvreurs et artisans en Belgique", title: "En tête de Google Maps.", sub: "Pas mieux classé après 3 mois ? Remboursé." },

  /** Headline on the ad videos (scripts/ad-video.mjs). */
  adVideo: { headline: (tr) => (tr ? `${tr.adPlural} : êtes-vous dans le top 3 de Google Maps ?` : "Êtes-vous dans le top 3 de Google Maps ?") },

  nav: { cta: "Test gratuit", langLabel: "Langue" },

  hero: {
    eyebrow: (tr) => (tr ? `Pour les ${tr.plural} en Belgique` : "Pour les électriciens, couvreurs et services à domicile en Belgique"),
    title: (tr) =>
      tr
        ? `Quelqu’un cherche <em>« ${tr.search} »</em> en ce moment. Êtes-vous dans le top 3 ?`
        : "Apparaissez en tête de Google Maps — et soyez appelé <em>avant</em> vos concurrents.",
    sub: "Chaque semaine, PinRank travaille votre fiche Google Business pour que les clients de votre région vous trouvent et vous appellent. Votre classement n’a pas progressé après 3 mois ? Vous êtes remboursé.",
    cta: "Vérifiez gratuitement si vous êtes éligible",
    ctaNote: "4 questions · 30 secondes · Sans engagement",
    wa: "Je préfère envoyer un WhatsApp",
    trust: ["Satisfait ou remboursé après 3 mois", "Votre fiche travaillée chaque semaine", "Rapport de classement mensuel"],
  },

  demo: {
    label: "Exemple illustratif",
    week: "Semaine",
    avg: "Position moy.",
    top3: "Dans le top 3",
    play: "Lecture",
    pause: "Pause",
    alt: "Animation : le classement d’un artisan sur 25 points de sa région s’améliore en 12 semaines.",
    captions: [
      { w: 0, t: "Mesure de départ sur 25 points de votre région" },
      { w: 1, t: "Fiche entièrement optimisée" },
      { w: 3, t: "Nouvelles publications et photos chaque semaine" },
      { w: 6, t: "Chaque avis reçoit une réponse" },
      { w: 9, t: "Google voit une entreprise active et fiable" },
      { w: 12, t: "L’objectif : le top 3 autour de chez vous" },
    ],
  },

  mock: {
    label: "Ce que voit votre client sur Google",
    you: "Votre entreprise",
    rivalA: "Concurrent A",
    rivalB: "Concurrent B",
    open: "Ouvert",
    call: "Appeler",
    route: "Itinéraire",
    caption: "Illustration",
  },

  problem: {
    title: "Hors du top 3, le téléphone sonne rarement",
    body: "Lors d’une panne de courant ou d’une fuite de toiture, personne ne va en page deux. On cherche sur Google, on voit trois entreprises sur la carte et on en appelle une. Si vous n’y êtes pas, le chantier part chez quelqu’un d’autre — même si vous travaillez mieux ou moins cher.",
    points: [
      { t: "Dépendant des autres", d: "Sans clients via Google, vous dépendez du bouche-à-oreille ou de plateformes qui vous font payer chaque demande." },
      { t: "Une fiche à l’abandon", d: "Google récompense les fiches actives : nouvelles photos, publications, réponses aux avis. La plupart des artisans n’ont pas le temps." },
      { t: "Des concurrents qui bougent", d: "Ceux qui mettent leur fiche à jour chaque semaine montent petit à petit. Ceux qui ne font rien descendent." },
    ],
  },

  grid: {
    title: "Nous mesurons votre classement sur 25 points de votre région",
    body: "Votre position dans Google Maps dépend de l’endroit d’où le client cherche. Nous mesurons donc votre classement sur une grille autour de votre entreprise — avant de commencer, puis chaque mois. Vous voyez noir sur blanc si ça marche.",
    before: "Aujourd’hui",
    after: "L’objectif après 3 mois",
    legend: ["Top 3", "Position 4–10", "Invisible"],
    caption: "Exemple illustratif. Lors de l’appel gratuit, nous regardons ensemble où vous en êtes aujourd’hui.",
  },

  how: {
    title: "Comment ça marche",
    steps: [
      { t: "Appel gratuit de 15 minutes", d: "Nous regardons ensemble votre fiche Google et votre classement actuel sur les recherches qui vous amènent des clients." },
      { t: "Nous optimisons votre fiche", d: "La première semaine, nous ajustons vos catégories, services, description, photos et zone d’intervention selon les recherches de votre métier." },
      { t: "Chaque semaine, un pas en avant", d: "Ensuite, nous travaillons votre fiche chaque semaine. Chaque mois, vous recevez un rapport avec votre classement sur la carte." },
    ],
  },

  features: {
    title: "Ce que nous faisons pour vous chaque semaine",
    sub: "Vous faites votre métier. Nous montrons à Google que votre entreprise est active, pertinente et fiable.",
    items: [
      { t: "Recherche de mots-clés", d: "Nous identifions ce que les clients de votre région recherchent vraiment et construisons votre fiche autour." },
      { t: "Fiche entièrement optimisée", d: "Catégories, services, description et zone d’intervention complétés et ajustés." },
      { t: "Publications Google hebdomadaires", d: "Une nouvelle publication chaque semaine, pour que Google voie que votre entreprise est active." },
      { t: "Photos de vos chantiers", d: "Nous publions régulièrement des photos avec la bonne description. Vous n’avez qu’à nous les envoyer." },
      { t: "Réponse à chaque avis", d: "Chaque avis reçoit une réponse professionnelle — même les moins bons." },
      { t: "Rapport de classement mensuel", d: "Chaque mois, vous voyez sur la carte comment votre position évolue. Pas de chiffres flous." },
    ],
  },

  proof: { title: "Ce que disent nos clients" },

  guarantee: {
    ring: "SATISFAIT OU REMBOURSÉ • PAS MIEUX CLASSÉ, REMBOURSÉ • ",
    months: "mois",
    badge: "3 mois",
    title: "Pas mieux classé après 3 mois ? Remboursé.",
    body: "Nous mesurons votre classement au départ. Si votre position moyenne dans Google Maps n’a pas progressé après 3 mois, nous vous remboursons ce que vous nous avez payé. Le risque est pour nous, pas pour vous.",
    note: "Les conditions sont fixées par écrit avant le démarrage.",
  },

  fit: {
    title: "Est-ce fait pour vous ?",
    yesTitle: "Oui, si…",
    yes: [
      "vous êtes électricien, couvreur, plombier, chauffagiste ou une autre entreprise de services à domicile",
      "vous travaillez dans une région fixe en Belgique",
      "vous pouvez prendre plus de chantiers et préférez les recevoir en direct plutôt que via des plateformes",
    ],
    noTitle: "Non, si…",
    no: ["vous ne pouvez déjà plus accepter de nouveaux clients", "vous n’avez pas de zone d’intervention fixe", "vous attendez des résultats en une semaine"],
  },

  pricing: {
    title: "Une formule. Un prix clair.",
    name: "PinRank Local",
    period: { month: "par mois", once: "paiement unique" },
    vat: "HTVA",
    includes: [
      "Recherche de mots-clés pour votre métier et votre région",
      "Optimisation complète de votre fiche Google",
      "Publications et photos chaque semaine",
      "Réponse à chaque avis",
      "Rapport de classement mensuel sur la carte",
      "Satisfait ou remboursé après 3 mois",
    ],
    cta: "Planifier un appel gratuit",
    note: "D’abord un appel sans engagement — vous décidez ensuite.",
  },

  faq: {
    title: "Questions fréquentes",
    items: [
      { q: "En combien de temps vais-je voir des résultats ?", a: "Cela dépend de votre région et de la concurrence. Le classement local se construit en semaines, pas en jours — c’est pourquoi nous mesurons après 3 mois et vous offrons alors une garantie de remboursement." },
      { q: "Comment fonctionne exactement la garantie ?", a: "Au départ, nous mesurons votre classement sur la carte pour vos mots-clés principaux. Après 3 mois, nous mesurons à nouveau, de la même façon. Si votre position moyenne ne s’est pas améliorée, nous vous remboursons ce que vous avez payé." },
      { q: "Est-ce que je dois faire beaucoup moi-même ?", a: "Très peu. Vous nous donnez accès à votre fiche Google Business (nous vous expliquons comment) et vous nous envoyez de temps en temps des photos de vos chantiers. Nous faisons le reste." },
      { q: "Je n’ai pas encore de fiche Google Business. Puis-je quand même commencer ?", a: "Dites-le-nous pendant l’appel. Nous verrons ensemble quelle est la meilleure première étape." },
      { q: "Est-ce la même chose que Google Ads ?", a: "Non. Avec Google Ads, vous payez chaque clic et tout s’arrête dès que vous arrêtez de payer. Nous travaillons votre place dans les résultats normaux de Google Maps — là, vous ne payez pas au clic." },
      { q: "Que se passe-t-il pendant l’appel gratuit ?", a: "Nous regardons votre classement actuel, nous vous montrons ce que vos concurrents font différemment et nous vous disons honnêtement si nous pouvons vous aider. Si ce n’est pas le cas, nous vous le dirons aussi." },
    ],
  },

  final: {
    title: "Curieux de savoir où vous en êtes ?",
    body: "Répondez à 4 questions et planifiez directement un appel gratuit de 15 minutes. Une question d’abord ? Envoyez-nous un WhatsApp.",
    cta: "Vérifiez gratuitement si vous êtes éligible",
  },

  sticky: { cta: "Test gratuit" },

  quiz: {
    title: "Êtes-vous éligible ?",
    progress: "Étape {n} sur {total}",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    q1: "Quel est votre métier ?",
    q2: "Dans quelle région travaillez-vous ?",
    q2Placeholder: "ex. Liège, Namur ou Charleroi",
    q3: "Avez-vous déjà une fiche Google Business ?",
    gbp: { yes: "Oui", no: "Non", unsure: "Je ne sais pas" },
    q4: "Où pouvons-nous vous joindre ?",
    fields: { name: "Votre nom", company: "Nom de l’entreprise", phone: "Numéro de GSM", email: "Adresse e-mail" },
    submit: "Voir mon résultat",
    privacy: "Nous utilisons vos données uniquement pour donner suite à votre demande.",
    privacyLink: "Politique de confidentialité",
    errors: { required: "Merci de compléter ce champ.", phone: "Ce numéro ne semble pas valide.", email: "Cette adresse e-mail ne semble pas valide." },
    resultTitle: "Bonne nouvelle, {name} !",
    resultBody: "Nous aidons les {plural} dans la région de {region}. Choisissez ci-dessous un moment pour votre appel gratuit de 15 minutes.",
    resultBodyNoCal: "Nous aidons les {plural} dans la région de {region}. Envoyez-nous un WhatsApp et nous planifions tout de suite un appel gratuit de 15 minutes.",
    or: "ou",
    wa: "Vous préférez WhatsApp ? Envoyez-nous un message",
    waPrimary: "Planifier l’appel via WhatsApp",
  },

  wa: {
    generic: "Bonjour PinRank, j’aimerais en savoir plus pour mieux apparaître dans Google Maps.",
    quiz: "Bonjour PinRank, je suis {name} de {company} ({trade}, {region}). J’aimerais planifier un appel gratuit au sujet de mon classement dans Google Maps.",
  },

  thanks: {
    meta: "Votre appel est planifié — PinRank",
    title: "Parfait, votre appel est planifié !",
    body: "Vous allez recevoir une confirmation par e-mail avec tous les détails.",
    prepTitle: "Pour en tirer le meilleur",
    prep: [
      "Vérifiez que vous pouvez vous connecter au compte Google lié à votre fiche d’entreprise.",
      "Pensez aux 2–3 services pour lesquels vous voulez le plus de clients.",
      "Notez les concurrents que vous voyez souvent au-dessus de vous.",
    ],
    wa: "Un oubli ou besoin de déplacer l’appel ? Envoyez-nous un WhatsApp",
    back: "Retour au site",
  },

  cookie: {
    text: "Nous utilisons des cookies pour mesurer quelles publicités fonctionnent — uniquement si vous êtes d’accord.",
    accept: "J’accepte",
    decline: "Refuser",
    settings: "Paramètres des cookies",
  },

  footer: {
    vat: "N° d’entreprise",
    privacy: "Confidentialité",
    disclaimer: "PinRank n’est pas affilié à Google. Google et Google Maps sont des marques de Google LLC.",
  },

  privacy: {
    meta: "Politique de confidentialité — PinRank",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour",
    sections: (c) => [
      { h: "Qui est responsable ?", p: `${c.name}${c.address ? `, ${c.address}` : ""}${c.vat ? `, numéro d’entreprise ${c.vat}` : ""}. Une question sur vos données ? Écrivez à ${c.email}.` },
      { h: "Quelles données collectons-nous ?", p: "Ce que vous remplissez dans notre questionnaire (nom, nom de l’entreprise, région, métier, numéro de GSM, adresse e-mail), ce que vous indiquez en planifiant un appel, les messages que vous nous envoyez via WhatsApp et — uniquement avec votre accord — des cookies publicitaires." },
      { h: "Pourquoi ?", p: "Pour donner suite à votre demande et planifier un appel (mesures précontractuelles, art. 6.1.b RGPD). Les cookies publicitaires servent uniquement à mesurer quelles publicités fonctionnent, et seulement avec votre consentement (art. 6.1.a RGPD), que vous pouvez retirer à tout moment via « Paramètres des cookies » en bas de page." },
      { h: "Avec qui les partageons-nous ?", p: "Avec les services qui nous aident : Cal.com (prise de rendez-vous), Meta (mesure publicitaire, uniquement avec consentement), WhatsApp (messages), notre hébergeur et l’outil dans lequel nous suivons les demandes. Certains traitent des données hors de l’UE, sur la base des clauses contractuelles types de la Commission européenne ou du EU-US Data Privacy Framework. Nous ne vendons jamais vos données." },
      { h: "Combien de temps les conservons-nous ?", p: "Si vous ne devenez pas client, nous supprimons vos données au plus tard 24 mois après notre dernier contact. Si vous devenez client, nous les conservons le temps nécessaire à notre collaboration et à nos obligations légales." },
      { h: "Vos droits", p: `Vous avez le droit d’accès, de rectification, d’effacement, de limitation, de portabilité et d’opposition. Écrivez à ${c.email}. Si notre réponse ne vous satisfait pas, vous pouvez introduire une plainte auprès de l’Autorité de protection des données (www.autoriteprotectiondonnees.be).` },
    ],
  },
};
