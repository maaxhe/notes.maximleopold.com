---
date_created: 04/06/26
tags: [funkkurs]
type: note
---

## Funkkurs - NAVTEX & NAVAREA

Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Alles zum NAVTEX-Textsystem und zur weltweiten NAVAREA-Einteilung.

Kurz gesagt ist **NAVTEX** der automatische Empfang von Sicherheitsmeldungen als Text - Navigationswarnungen, Wetter, SAR. Ein eigenes Gerät empfängt die Meldungen still, speichert sie und zeigt sie im Display an. Zur Abgrenzung gegenüber WX (Sprechfunk) siehe [[Funkkurs — Revierkanäle Ostsee & Mittelmeer#Wetter & Sicherheitsmeldungen: WX (Sprechfunk) vs. NX (NAVTEX)|WX vs. NX]].

---

### 1. Was ist NAVTEX?
NAVTEX steht für Navigational Telex und ist Teil des **GMDSS** zur Verbreitung von **MSI** (Maritime Safety Information). Ein eigener Empfänger - nicht das UKW-Gerät - empfängt automatisch und speichert die Meldungen; man liest sie im Display oder als Ausdruck, wann man will. Inhalte sind unter anderem Navigationswarnungen, Wetterberichte und -warnungen, Eismeldungen und SAR-Informationen. Die Reichweite liegt bei ~250-400 sm (Mittelwelle, Bodenwelle) und deckt damit Küstengewässer großflächig ab.

### 2. Frequenzen
| Frequenz | Verwendung |
|---|---|
| **518 kHz** | international, Meldungen in Englisch (Standard) |
| 490 kHz | national, in der Landessprache (z. B. Deutsch) |
| 4209,5 kHz | Tropengebiete |

### 3. Der Meldungskopf B1B2B3B4
Jede NAVTEX-Meldung beginnt mit vier Zeichen, die steuern, von wem sie kommt, worum es geht und welche Nummer sie hat:
```
ZCZC        <- Startsignal: markiert den Anfang jeder Meldung
C A 24      <- der eigentliche Kopf B1B2B3B4
│ │ └─ B3B4 = laufende Nummer der Meldung (01-99)
│ └─── B2 = Kategorie (Inhalt, A-Z)
└───── B1 = Sendestation (Buchstabe)
...Meldungstext...
NNNN        <- Endsignal: markiert das Ende der Meldung
```
Vorweg läuft das Startsignal **ZCZC** (daher das Z), das den Meldungsanfang markiert; den Abschluss bildet **NNNN**. Der eigentliche Kopf sind die vier Zeichen B1B2B3B4. B1 bezeichnet die Sendestation: Jeder Sender hat einen Buchstaben (A, B, C …) und einen festen Sendezeit-Slot, damit sich benachbarte Stationen nicht stören. B2 ist die Kategorie und sagt, worum es geht (siehe Tabelle). B3B4 ist die fortlaufende Nummer von 01 bis 99; eine bereits empfangene Nummer wird nicht doppelt gespeichert. Die Nummer 00 ist ein Sonderfall für besonders dringende Meldungen, die der Empfänger immer ausgibt.

Wichtige Kategorien (B2):
| Buchstabe | Inhalt |
|---|---|
| A | Navigationswarnungen (nicht abwählbar) |
| B | Wetterwarnungen (nicht abwählbar) |
| C | Eismeldungen |
| D | SAR-Informationen (nicht abwählbar) |
| E | Wettervorhersagen |
| F | Lotsendienst |
| L | weitere Navigationswarnungen |
| Z | „keine Meldung" (QRU) |

> [!important] Sicherheitskategorien lassen sich NICHT abwählen
> A (Navigationswarnung), B (Wetterwarnung) und D (SAR) empfängt das Gerät immer - sie sind sicherheitskritisch. Andere Kategorien wie der Lotsendienst lassen sich im Empfänger ausfiltern.

### 4. NAVAREA - die weltweite Einteilung
![[funkkurs-navarea.jpg]]
<sub>Die Welt-Seegebiete des WWNWS (NAVAREA I-XXI). Bild: Wikimedia Commons.</sub>

Für die Verbreitung von MSI sind die Weltmeere im **WWNWS** (World-Wide Navigational Warning Service) in ~21 **NAVAREAs** (römische Ziffern I-XXI) eingeteilt. Jede NAVAREA hat einen NAVAREA-Koordinator, also ein verantwortliches Land, das die NAVAREA-Warnungen für sein Gebiet herausgibt. Die NAVTEX-Sender arbeiten innerhalb dieser Gebiete mit koordinierten Sendezeiten (über das B1-Zeichen), damit sich die Stationen nicht überlagern. Deutschland liegt in **NAVAREA I** (Nord- und Ostsee, Koordinator Großbritannien).

Wichtig ist, NAVAREA und NAVTEX nicht zu verwechseln: NAVAREA ist das große geografische Gebiet (die weltweite Einteilung der Warnzonen), NAVTEX dagegen das technische System bzw. Gerät, über das die Meldungen innerhalb einer Region empfangen werden. Zusätzlich gibt es METAREAs (gleiche Grenzen) für die Wetterverantwortung.

### 5. NAVTEX in der Ostsee
![[funkkurs-navtex-ostsee.jpg]]
<sub>Beispiel: NAVTEX-Senderabdeckung Ostsee. Bild: Wikimedia Commons.</sub>

---

Zur Einordnung für den SRC-Kurs: NAVTEX ist wissenswert, aber kein Bediengerät der SRC-Prüfung. Wichtig für die Teilnehmenden sind die Kernpunkte - 518 kHz englisch, 490 kHz national, das Gerät empfängt und speichert Text automatisch, A/B/D kommen immer durch, und das Ganze ist weltweit in NAVAREAs organisiert.

---
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
