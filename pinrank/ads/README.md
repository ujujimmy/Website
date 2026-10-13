# PinRank — Meta ads pack

Copy in Dutch and French for the four trades (roofers, renovation, plumbers, electricians), four angles each
(top 3, money-back, lead platforms, socials),
the ad videos, and links with tracking already on them.

> **Before launch:** every link and the videos say `pinrank.be`. Once the real domain is set
> in `src/config.mjs`, regenerate the videos (`scripts/ad-video.mjs`) and search-replace the
> domain in this file.

## Campaign setup (a starting point to test, not a proven recipe)

- **Objective:** Leads → conversion location **Website** → conversion event **Lead**.
  The page fires `Lead` when someone finishes the 4 questions. Switch optimisation to
  `Schedule` (a booked call) once you see about 50 bookings a week.
- **Special ad category:** none.
- **One ad set per language**, so each audience only sees its own language:
  - NL: locations *Vlaams Gewest* + *Brussel*, language *Dutch*
  - FR: locations *Région wallonne* + *Bruxelles*, language *French*
- **Audience:** start broad (Advantage+ audience). The trade in the headline and first line does the filtering.
- **Budget:** start around €20–30 a day per ad set and judge after roughly €150–200 spend each.
  Turn off the weakest angle per trade, then put the money behind the winner.
- **Placements:** 4:5 videos for Feed, the 9:16 video for Stories and Reels.
- **Offer:** every ad leads to the free ranking scan. It's a concrete thing to get, which usually pulls more clicks than "book a call".
- **Rules worth keeping:** don't use the Google or Google Maps logo; keep "Illustratief voorbeeld /
  Exemple illustratif" visible (it's in every video); don't promise a specific rank.

## Tracking links

`utm_source=meta&utm_medium=paid&utm_campaign=pinrank_{lang}&utm_content={trade}_{angle}`: the page keeps
these for the visit and sends them with each lead to your webhook, so you can see which trade and angle
brought in each booking.

## Videos (`ads/video/`)

| File | Use |
|---|---|
| `{lang}-all-4x5.mp4` | Feed, general ad (all four trades) |
| `{lang}-all-9x16.mp4` | Stories / Reels |
| `{lang}-{trade}-4x5.mp4` | Feed, one per trade: headline and search bar name the trade |

1080 px wide, 30 fps, 14 s, H.264 MP4 with a silent sound track. Add captions or music in Ads Manager if you like.

---

# Nederlands (Vlaanderen + Brussel)

Ad set: **Vlaams Gewest + Brussel**, language **Nederlands**. Button: **Meer informatie**.

## Algemeen / général

Landing page: `https://pinrank.be/nl/` · Video (feed): `ads/video/nl-all-4x5.mp4` · Stories/Reels: `ads/video/nl-all-9x16.mp4`

### top3

**Primary text**

```
Iemand zoekt nu een dakwerker, aannemer, loodgieter of elektricien in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Vraag je gratis rankingscan aan: in 30 seconden.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Gratis rankingscan · geld-terug-garantie  
**Link:** `https://pinrank.be/nl/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=all_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor vakmensen in België. Je eerste rankingscan is gratis.
```

**Headline:** Niet hoger na 3 maanden? Geld terug.  
**Description:** Speciaal voor vakmensen  
**Link:** `https://pinrank.be/nl/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=all_garantie`

### leads

**Primary text**

```
Nog altijd betalen per aanvraag op een leadplatform?

Mensen die zelf een vakman zoeken bellen meestal een van de eerste bedrijven op de kaart. Geen commissie, geen aanvraag die je deelt met vijf concurrenten.

PinRank werkt aan je profiel om daar te komen. Met geld-terug-garantie na 3 maanden.
```

**Headline:** Klanten die rechtstreeks jóu bellen  
**Description:** Geen commissie per aanvraag  
**Link:** `https://pinrank.be/nl/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=all_leads`

### social

**Primary text**

```
Geen tijd voor Instagram, TikTok of YouTube?

Wij maken van je werffoto’s en filmpjes reels met ondertitels, schrijven de captions en posten ze voor je. En we werken aan je plek bovenaan in Google Maps.

Jij geeft toegang, wij doen de rest. Speciaal voor vakmensen in België.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Je socials én Google Maps, geregeld  
**Description:** Jij geeft toegang, wij doen de rest  
**Link:** `https://pinrank.be/nl/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=all_social`

## Dakwerkers

Landing page: `https://pinrank.be/nl/dakwerker/` · Video (feed): `ads/video/nl-dakwerker-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘dakwerker in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Vraag je gratis rankingscan aan: in 30 seconden.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Gratis rankingscan · geld-terug-garantie  
**Link:** `https://pinrank.be/nl/dakwerker/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=dakwerker_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor dakwerkers in België. Je eerste rankingscan is gratis.
```

**Headline:** Niet hoger na 3 maanden? Geld terug.  
**Description:** Speciaal voor dakwerkers  
**Link:** `https://pinrank.be/nl/dakwerker/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=dakwerker_garantie`

### leads

**Primary text**

```
Nog altijd betalen per aanvraag op een leadplatform?

Mensen die zelf zoeken naar ‘dakwerker in de buurt’ bellen meestal een van de eerste bedrijven op de kaart. Geen commissie, geen aanvraag die je deelt met vijf concurrenten.

PinRank werkt aan je profiel om daar te komen. Met geld-terug-garantie na 3 maanden.
```

**Headline:** Klanten die rechtstreeks jóu bellen  
**Description:** Geen commissie per aanvraag  
**Link:** `https://pinrank.be/nl/dakwerker/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=dakwerker_leads`

### social

**Primary text**

```
Geen tijd voor Instagram, TikTok of YouTube?

Wij maken van je werffoto’s en filmpjes reels met ondertitels, schrijven de captions en posten ze voor je. En we werken aan je plek bovenaan in Google Maps.

Jij geeft toegang, wij doen de rest. Speciaal voor dakwerkers in België.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Je socials én Google Maps, geregeld  
**Description:** Jij geeft toegang, wij doen de rest  
**Link:** `https://pinrank.be/nl/dakwerker/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=dakwerker_social`

## Renovatiebedrijven

Landing page: `https://pinrank.be/nl/renovatie/` · Video (feed): `ads/video/nl-renovatie-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘renovatie aannemer in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Vraag je gratis rankingscan aan: in 30 seconden.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Gratis rankingscan · geld-terug-garantie  
**Link:** `https://pinrank.be/nl/renovatie/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=renovatie_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor renovatiebedrijven in België. Je eerste rankingscan is gratis.
```

**Headline:** Niet hoger na 3 maanden? Geld terug.  
**Description:** Speciaal voor renovatiebedrijven  
**Link:** `https://pinrank.be/nl/renovatie/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=renovatie_garantie`

### leads

**Primary text**

```
Nog altijd betalen per aanvraag op een leadplatform?

Mensen die zelf zoeken naar ‘renovatie aannemer in de buurt’ bellen meestal een van de eerste bedrijven op de kaart. Geen commissie, geen aanvraag die je deelt met vijf concurrenten.

PinRank werkt aan je profiel om daar te komen. Met geld-terug-garantie na 3 maanden.
```

**Headline:** Klanten die rechtstreeks jóu bellen  
**Description:** Geen commissie per aanvraag  
**Link:** `https://pinrank.be/nl/renovatie/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=renovatie_leads`

### social

**Primary text**

```
Geen tijd voor Instagram, TikTok of YouTube?

Wij maken van je werffoto’s en filmpjes reels met ondertitels, schrijven de captions en posten ze voor je. En we werken aan je plek bovenaan in Google Maps.

Jij geeft toegang, wij doen de rest. Speciaal voor renovatiebedrijven in België.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Je socials én Google Maps, geregeld  
**Description:** Jij geeft toegang, wij doen de rest  
**Link:** `https://pinrank.be/nl/renovatie/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=renovatie_social`

## Loodgieters

Landing page: `https://pinrank.be/nl/loodgieter/` · Video (feed): `ads/video/nl-loodgieter-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘loodgieter in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Vraag je gratis rankingscan aan: in 30 seconden.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Gratis rankingscan · geld-terug-garantie  
**Link:** `https://pinrank.be/nl/loodgieter/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=loodgieter_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor loodgieters in België. Je eerste rankingscan is gratis.
```

**Headline:** Niet hoger na 3 maanden? Geld terug.  
**Description:** Speciaal voor loodgieters  
**Link:** `https://pinrank.be/nl/loodgieter/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=loodgieter_garantie`

### leads

**Primary text**

```
Nog altijd betalen per aanvraag op een leadplatform?

Mensen die zelf zoeken naar ‘loodgieter in de buurt’ bellen meestal een van de eerste bedrijven op de kaart. Geen commissie, geen aanvraag die je deelt met vijf concurrenten.

PinRank werkt aan je profiel om daar te komen. Met geld-terug-garantie na 3 maanden.
```

**Headline:** Klanten die rechtstreeks jóu bellen  
**Description:** Geen commissie per aanvraag  
**Link:** `https://pinrank.be/nl/loodgieter/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=loodgieter_leads`

### social

**Primary text**

```
Geen tijd voor Instagram, TikTok of YouTube?

Wij maken van je werffoto’s en filmpjes reels met ondertitels, schrijven de captions en posten ze voor je. En we werken aan je plek bovenaan in Google Maps.

Jij geeft toegang, wij doen de rest. Speciaal voor loodgieters in België.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Je socials én Google Maps, geregeld  
**Description:** Jij geeft toegang, wij doen de rest  
**Link:** `https://pinrank.be/nl/loodgieter/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=loodgieter_social`

## Elektriciens

Landing page: `https://pinrank.be/nl/elektricien/` · Video (feed): `ads/video/nl-elektricien-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘elektricien in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Vraag je gratis rankingscan aan: in 30 seconden.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Gratis rankingscan · geld-terug-garantie  
**Link:** `https://pinrank.be/nl/elektricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=elektricien_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor elektriciens in België. Je eerste rankingscan is gratis.
```

**Headline:** Niet hoger na 3 maanden? Geld terug.  
**Description:** Speciaal voor elektriciens  
**Link:** `https://pinrank.be/nl/elektricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=elektricien_garantie`

### leads

**Primary text**

```
Nog altijd betalen per aanvraag op een leadplatform?

Mensen die zelf zoeken naar ‘elektricien in de buurt’ bellen meestal een van de eerste bedrijven op de kaart. Geen commissie, geen aanvraag die je deelt met vijf concurrenten.

PinRank werkt aan je profiel om daar te komen. Met geld-terug-garantie na 3 maanden.
```

**Headline:** Klanten die rechtstreeks jóu bellen  
**Description:** Geen commissie per aanvraag  
**Link:** `https://pinrank.be/nl/elektricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=elektricien_leads`

### social

**Primary text**

```
Geen tijd voor Instagram, TikTok of YouTube?

Wij maken van je werffoto’s en filmpjes reels met ondertitels, schrijven de captions en posten ze voor je. En we werken aan je plek bovenaan in Google Maps.

Jij geeft toegang, wij doen de rest. Speciaal voor elektriciens in België.

Bonus: we bouwen gratis een website voor je zaak.
```

**Headline:** Je socials én Google Maps, geregeld  
**Description:** Jij geeft toegang, wij doen de rest  
**Link:** `https://pinrank.be/nl/elektricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=elektricien_social`

---

# Français (Wallonie + Bruxelles)

Ad set: **Région wallonne + Bruxelles**, language **Français**. Button: **En savoir plus**.

## Algemeen / général

Landing page: `https://pinrank.be/fr/` · Video (feed): `ads/video/fr-all-4x5.mp4` · Stories/Reels: `ads/video/fr-all-9x16.mp4`

### top3

**Primary text**

```
Quelqu’un cherche un couvreur, une entreprise de rénovation, un plombier ou un électricien dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Demandez votre scan de classement gratuit : 30 secondes.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Scan gratuit · satisfait ou remboursé  
**Link:** `https://pinrank.be/fr/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=all_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les artisans en Belgique. Votre premier scan est gratuit.
```

**Headline:** Pas de progrès en 3 mois ? Remboursé.  
**Description:** Spécialement pour les artisans  
**Link:** `https://pinrank.be/fr/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=all_garantie`

### leads

**Primary text**

```
Vous payez encore chaque demande sur une plateforme ?

Les gens qui cherchent eux-mêmes un artisan appellent le plus souvent l’une des premières entreprises sur la carte. Pas de commission, pas de demande partagée avec cinq concurrents.

PinRank travaille votre fiche pour y arriver. Avec garantie satisfait ou remboursé après 3 mois.
```

**Headline:** Les clients vous appellent en direct  
**Description:** Pas de commission par demande  
**Link:** `https://pinrank.be/fr/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=all_leads`

### social

**Primary text**

```
Pas le temps pour Instagram, TikTok ou YouTube ?

Nous transformons vos photos et vidéos de chantier en reels sous-titrés, écrivons les légendes et les publions pour vous. Et nous travaillons votre place en tête de Google Maps.

Vous donnez l’accès, nous faisons le reste. Spécialement pour les artisans en Belgique.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Vos réseaux et Google Maps, réglés  
**Description:** Vous donnez l’accès, on fait le reste  
**Link:** `https://pinrank.be/fr/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=all_social`

## Couvreurs

Landing page: `https://pinrank.be/fr/couvreur/` · Video (feed): `ads/video/fr-couvreur-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « couvreur près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Demandez votre scan de classement gratuit : 30 secondes.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Scan gratuit · satisfait ou remboursé  
**Link:** `https://pinrank.be/fr/couvreur/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=couvreur_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les couvreurs en Belgique. Votre premier scan est gratuit.
```

**Headline:** Pas de progrès en 3 mois ? Remboursé.  
**Description:** Spécialement pour les couvreurs  
**Link:** `https://pinrank.be/fr/couvreur/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=couvreur_garantie`

### leads

**Primary text**

```
Vous payez encore chaque demande sur une plateforme ?

Les gens qui cherchent eux-mêmes « couvreur près de chez moi » appellent le plus souvent l’une des premières entreprises sur la carte. Pas de commission, pas de demande partagée avec cinq concurrents.

PinRank travaille votre fiche pour y arriver. Avec garantie satisfait ou remboursé après 3 mois.
```

**Headline:** Les clients vous appellent en direct  
**Description:** Pas de commission par demande  
**Link:** `https://pinrank.be/fr/couvreur/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=couvreur_leads`

### social

**Primary text**

```
Pas le temps pour Instagram, TikTok ou YouTube ?

Nous transformons vos photos et vidéos de chantier en reels sous-titrés, écrivons les légendes et les publions pour vous. Et nous travaillons votre place en tête de Google Maps.

Vous donnez l’accès, nous faisons le reste. Spécialement pour les couvreurs en Belgique.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Vos réseaux et Google Maps, réglés  
**Description:** Vous donnez l’accès, on fait le reste  
**Link:** `https://pinrank.be/fr/couvreur/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=couvreur_social`

## Entreprises de rénovation

Landing page: `https://pinrank.be/fr/renovation/` · Video (feed): `ads/video/fr-renovation-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « entreprise de rénovation près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Demandez votre scan de classement gratuit : 30 secondes.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Scan gratuit · satisfait ou remboursé  
**Link:** `https://pinrank.be/fr/renovation/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=renovation_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les entreprises de rénovation en Belgique. Votre premier scan est gratuit.
```

**Headline:** Pas de progrès en 3 mois ? Remboursé.  
**Description:** Spécialement pour les entreprises de rénovation  
**Link:** `https://pinrank.be/fr/renovation/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=renovation_garantie`

### leads

**Primary text**

```
Vous payez encore chaque demande sur une plateforme ?

Les gens qui cherchent eux-mêmes « entreprise de rénovation près de chez moi » appellent le plus souvent l’une des premières entreprises sur la carte. Pas de commission, pas de demande partagée avec cinq concurrents.

PinRank travaille votre fiche pour y arriver. Avec garantie satisfait ou remboursé après 3 mois.
```

**Headline:** Les clients vous appellent en direct  
**Description:** Pas de commission par demande  
**Link:** `https://pinrank.be/fr/renovation/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=renovation_leads`

### social

**Primary text**

```
Pas le temps pour Instagram, TikTok ou YouTube ?

Nous transformons vos photos et vidéos de chantier en reels sous-titrés, écrivons les légendes et les publions pour vous. Et nous travaillons votre place en tête de Google Maps.

Vous donnez l’accès, nous faisons le reste. Spécialement pour les entreprises de rénovation en Belgique.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Vos réseaux et Google Maps, réglés  
**Description:** Vous donnez l’accès, on fait le reste  
**Link:** `https://pinrank.be/fr/renovation/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=renovation_social`

## Plombiers

Landing page: `https://pinrank.be/fr/plombier/` · Video (feed): `ads/video/fr-plombier-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « plombier près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Demandez votre scan de classement gratuit : 30 secondes.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Scan gratuit · satisfait ou remboursé  
**Link:** `https://pinrank.be/fr/plombier/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=plombier_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les plombiers en Belgique. Votre premier scan est gratuit.
```

**Headline:** Pas de progrès en 3 mois ? Remboursé.  
**Description:** Spécialement pour les plombiers  
**Link:** `https://pinrank.be/fr/plombier/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=plombier_garantie`

### leads

**Primary text**

```
Vous payez encore chaque demande sur une plateforme ?

Les gens qui cherchent eux-mêmes « plombier près de chez moi » appellent le plus souvent l’une des premières entreprises sur la carte. Pas de commission, pas de demande partagée avec cinq concurrents.

PinRank travaille votre fiche pour y arriver. Avec garantie satisfait ou remboursé après 3 mois.
```

**Headline:** Les clients vous appellent en direct  
**Description:** Pas de commission par demande  
**Link:** `https://pinrank.be/fr/plombier/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=plombier_leads`

### social

**Primary text**

```
Pas le temps pour Instagram, TikTok ou YouTube ?

Nous transformons vos photos et vidéos de chantier en reels sous-titrés, écrivons les légendes et les publions pour vous. Et nous travaillons votre place en tête de Google Maps.

Vous donnez l’accès, nous faisons le reste. Spécialement pour les plombiers en Belgique.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Vos réseaux et Google Maps, réglés  
**Description:** Vous donnez l’accès, on fait le reste  
**Link:** `https://pinrank.be/fr/plombier/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=plombier_social`

## Électriciens

Landing page: `https://pinrank.be/fr/electricien/` · Video (feed): `ads/video/fr-electricien-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « électricien près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Demandez votre scan de classement gratuit : 30 secondes.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Scan gratuit · satisfait ou remboursé  
**Link:** `https://pinrank.be/fr/electricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=electricien_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les électriciens en Belgique. Votre premier scan est gratuit.
```

**Headline:** Pas de progrès en 3 mois ? Remboursé.  
**Description:** Spécialement pour les électriciens  
**Link:** `https://pinrank.be/fr/electricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=electricien_garantie`

### leads

**Primary text**

```
Vous payez encore chaque demande sur une plateforme ?

Les gens qui cherchent eux-mêmes « électricien près de chez moi » appellent le plus souvent l’une des premières entreprises sur la carte. Pas de commission, pas de demande partagée avec cinq concurrents.

PinRank travaille votre fiche pour y arriver. Avec garantie satisfait ou remboursé après 3 mois.
```

**Headline:** Les clients vous appellent en direct  
**Description:** Pas de commission par demande  
**Link:** `https://pinrank.be/fr/electricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=electricien_leads`

### social

**Primary text**

```
Pas le temps pour Instagram, TikTok ou YouTube ?

Nous transformons vos photos et vidéos de chantier en reels sous-titrés, écrivons les légendes et les publions pour vous. Et nous travaillons votre place en tête de Google Maps.

Vous donnez l’accès, nous faisons le reste. Spécialement pour les électriciens en Belgique.

En bonus : nous créons gratuitement le site web de votre entreprise.
```

**Headline:** Vos réseaux et Google Maps, réglés  
**Description:** Vous donnez l’accès, on fait le reste  
**Link:** `https://pinrank.be/fr/electricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=electricien_social`
