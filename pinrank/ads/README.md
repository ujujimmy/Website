# PinRank — Meta ads pack

Everything needed to set up the Meta campaigns: copy in Dutch and French for every
trade, the ad videos, and links with tracking already on them.

> **Before launch:** every link and the videos say `pinrank.be`. Once the real domain is set
> in `src/config.mjs`, regenerate the videos (`scripts/ad-video.mjs`) and search-replace the
> domain in this file.

## Campaign setup (a starting point to test, not a proven recipe)

- **Objective:** Leads → conversion location **Website** → conversion event **Lead**.
  The page fires `Lead` when someone finishes the 4 questions. Switch optimisation to
  `Schedule` (a booked call) once you see about 50 bookings a week; before that Meta has too few to learn from.
- **Special ad category:** none.
- **One ad set per language**, so each audience only sees its own language:
  - NL: locations *Vlaams Gewest* + *Brussel*, language *Dutch*
  - FR: locations *Région wallonne* + *Bruxelles*, language *French*
- **Audience:** start broad (Advantage+ audience). The trade named in the headline and the
  first line does the filtering; electricians stop for "elektricien in de buurt".
- **Budget:** start around €20–30 a day per ad set and judge after roughly €150–200 spend each.
  Turn off the weakest angle per trade, then put the money behind the winner.
- **Placements:** 4:5 videos for Feed, the 9:16 video for Stories and Reels.
- **Rules worth keeping:** don't use the Google or Google Maps logo; keep "Illustratief
  voorbeeld / Exemple illustratif" visible (it's in every video); don't promise a specific rank.

## Tracking links

Every link uses `utm_source=meta&utm_medium=paid&utm_campaign=pinrank_{lang}&utm_content={trade}_{angle}`.
The page keeps these for the whole visit and sends them with each lead to your webhook, so you can see
which trade and angle brought in each booking. `fbclid` is kept too.

## Videos (`ads/video/`)

| File | Use |
|---|---|
| `{lang}-all-4x5.mp4` | Feed, general ad (all trades) |
| `{lang}-all-9x16.mp4` | Stories / Reels |
| `{lang}-{trade}-4x5.mp4` | Feed, one per trade — headline and search bar name the trade |

All are 1080 px wide, 30 fps, 14 seconds, H.264 MP4 with a silent sound track (most feed video plays muted). Add
captions or music in Ads Manager if you like.

---

# Nederlands (Vlaanderen + Brussel)

Ad set: **Vlaams Gewest + Brussel**, language **Nederlands**. Button: **Meer informatie**.

## Algemeen / général

Landing page: `https://pinrank.be/nl/` · Video (feed): `ads/video/nl-all-4x5.mp4` · Stories/Reels: `ads/video/nl-all-9x16.mp4`

### top3

**Primary text**

```
Iemand zoekt nu een vakman in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Check in 30 seconden of je in aanmerking komt.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Geld terug als je niet stijgt  
**Link:** `https://pinrank.be/nl/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=all_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor vakmensen in België. Gratis check, vrijblijvend.
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

## Elektriciens

Landing page: `https://pinrank.be/nl/elektricien/` · Video (feed): `ads/video/nl-elektricien-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘elektricien in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Check in 30 seconden of je in aanmerking komt.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Geld terug als je niet stijgt  
**Link:** `https://pinrank.be/nl/elektricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=elektricien_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor elektriciens in België. Gratis check, vrijblijvend.
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

## Dakwerkers

Landing page: `https://pinrank.be/nl/dakwerker/` · Video (feed): `ads/video/nl-dakwerker-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘dakwerker in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Check in 30 seconden of je in aanmerking komt.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Geld terug als je niet stijgt  
**Link:** `https://pinrank.be/nl/dakwerker/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=dakwerker_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor dakwerkers in België. Gratis check, vrijblijvend.
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

## Loodgieters

Landing page: `https://pinrank.be/nl/loodgieter/` · Video (feed): `ads/video/nl-loodgieter-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘loodgieter in de buurt’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Check in 30 seconden of je in aanmerking komt.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Geld terug als je niet stijgt  
**Link:** `https://pinrank.be/nl/loodgieter/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=loodgieter_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor loodgieters in België. Gratis check, vrijblijvend.
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

## Installateurs

Landing page: `https://pinrank.be/nl/verwarming/` · Video (feed): `ads/video/nl-verwarming-4x5.mp4`

### top3

**Primary text**

```
Iemand zoekt nu ‘warmtepomp installateur’ in jouw regio.

Google Maps toont drie bedrijven. Die drie krijgen het telefoontje.

PinRank werkt elke week aan je Google-bedrijfsprofiel, zodat jij daar staat. Niet hoger na 3 maanden? Dan krijg je je geld terug.

Check in 30 seconden of je in aanmerking komt.
```

**Headline:** Sta jij in de top 3 op Google Maps?  
**Description:** Geld terug als je niet stijgt  
**Link:** `https://pinrank.be/nl/verwarming/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=verwarming_top3`

### garantie

**Primary text**

```
Een marketingbureau dat je geld teruggeeft als het niet werkt?

Wij meten bij de start je positie in Google Maps op 25 punten rond je zaak. Na 3 maanden meten we opnieuw. Ben je niet gestegen, dan betalen we je terug.

Speciaal voor installateurs in België. Gratis check, vrijblijvend.
```

**Headline:** Niet hoger na 3 maanden? Geld terug.  
**Description:** Speciaal voor installateurs  
**Link:** `https://pinrank.be/nl/verwarming/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=verwarming_garantie`

### leads

**Primary text**

```
Nog altijd betalen per aanvraag op een leadplatform?

Mensen die zelf zoeken naar ‘warmtepomp installateur’ bellen meestal een van de eerste bedrijven op de kaart. Geen commissie, geen aanvraag die je deelt met vijf concurrenten.

PinRank werkt aan je profiel om daar te komen. Met geld-terug-garantie na 3 maanden.
```

**Headline:** Klanten die rechtstreeks jóu bellen  
**Description:** Geen commissie per aanvraag  
**Link:** `https://pinrank.be/nl/verwarming/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_nl&utm_content=verwarming_leads`

---

# Français (Wallonie + Bruxelles)

Ad set: **Région wallonne + Bruxelles**, language **Français**. Button: **En savoir plus**.

## Algemeen / général

Landing page: `https://pinrank.be/fr/` · Video (feed): `ads/video/fr-all-4x5.mp4` · Stories/Reels: `ads/video/fr-all-9x16.mp4`

### top3

**Primary text**

```
Quelqu’un cherche un artisan dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Vérifiez en 30 secondes si vous êtes éligible.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Remboursé si vous ne montez pas  
**Link:** `https://pinrank.be/fr/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=all_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les artisans en Belgique. Test gratuit, sans engagement.
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

## Électriciens

Landing page: `https://pinrank.be/fr/electricien/` · Video (feed): `ads/video/fr-electricien-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « électricien près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Vérifiez en 30 secondes si vous êtes éligible.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Remboursé si vous ne montez pas  
**Link:** `https://pinrank.be/fr/electricien/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=electricien_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les électriciens en Belgique. Test gratuit, sans engagement.
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

## Couvreurs

Landing page: `https://pinrank.be/fr/couvreur/` · Video (feed): `ads/video/fr-couvreur-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « couvreur près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Vérifiez en 30 secondes si vous êtes éligible.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Remboursé si vous ne montez pas  
**Link:** `https://pinrank.be/fr/couvreur/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=couvreur_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les couvreurs en Belgique. Test gratuit, sans engagement.
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

## Plombiers

Landing page: `https://pinrank.be/fr/plombier/` · Video (feed): `ads/video/fr-plombier-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « plombier près de chez moi » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Vérifiez en 30 secondes si vous êtes éligible.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Remboursé si vous ne montez pas  
**Link:** `https://pinrank.be/fr/plombier/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=plombier_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les plombiers en Belgique. Test gratuit, sans engagement.
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

## Chauffagistes

Landing page: `https://pinrank.be/fr/chauffagiste/` · Video (feed): `ads/video/fr-chauffagiste-4x5.mp4`

### top3

**Primary text**

```
Quelqu’un cherche « installateur pompe à chaleur » dans votre région en ce moment.

Google Maps affiche trois entreprises. Ce sont elles qui reçoivent l’appel.

Chaque semaine, PinRank travaille votre fiche Google Business pour que vous y soyez. Pas mieux classé après 3 mois ? Vous êtes remboursé.

Vérifiez en 30 secondes si vous êtes éligible.
```

**Headline:** Êtes-vous dans le top 3 de Google Maps ?  
**Description:** Remboursé si vous ne montez pas  
**Link:** `https://pinrank.be/fr/chauffagiste/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=chauffagiste_top3`

### garantie

**Primary text**

```
Une agence marketing qui vous rembourse si ça ne marche pas ?

Au départ, nous mesurons votre position dans Google Maps sur 25 points autour de votre entreprise. Après 3 mois, nous mesurons à nouveau. Pas de progrès ? Nous vous remboursons.

Spécialement pour les chauffagistes en Belgique. Test gratuit, sans engagement.
```

**Headline:** Pas de progrès en 3 mois ? Remboursé.  
**Description:** Spécialement pour les chauffagistes  
**Link:** `https://pinrank.be/fr/chauffagiste/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=chauffagiste_garantie`

### leads

**Primary text**

```
Vous payez encore chaque demande sur une plateforme ?

Les gens qui cherchent eux-mêmes « installateur pompe à chaleur » appellent le plus souvent l’une des premières entreprises sur la carte. Pas de commission, pas de demande partagée avec cinq concurrents.

PinRank travaille votre fiche pour y arriver. Avec garantie satisfait ou remboursé après 3 mois.
```

**Headline:** Les clients vous appellent en direct  
**Description:** Pas de commission par demande  
**Link:** `https://pinrank.be/fr/chauffagiste/?utm_source=meta&utm_medium=paid&utm_campaign=pinrank_fr&utm_content=chauffagiste_leads`
