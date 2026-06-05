---
ai_generated: true
model: claude-opus-4-8
date_created: 04/06/26
tags: [ai-generated]
type: moc
---

## Funkzeugnis-Kurs SRC & UBI (Hub)

Übersicht & Einstieg für meinen Wochenend-Kurs (auf Deutsch). Die Inhalte sind in **Module** ausgelagert (siehe Index unten), damit diese Datei schlank bleibt.

> [!abstract] So nutzt du diese Unterlage
> Diese Seite ist der **Hub**. Arbeite die Module der Reihe nach durch (Index unten, thematisch gruppiert), oder spring gezielt rein. Jedes Modul ist eigenständig lesbar und verlinkt auf verwandte Themen. Zum Üben: [[Funkkurs — Quiz & Prüfungssimulation]].

> [!warning] Vor dem Kurs gegenchecken
> Kanäle, MMSI/ATIS-Formate und Prüfungsmodalitäten können sich ändern. Aktuelle Quellen: *Handbuch Seefunk* / *Handbuch Binnenschifffahrtsfunk* (Bundesnetzagentur), DSV/DMYV-Prüfungsfragenkatalog. Diese Notiz ist ein Lehr-Gerüst, **kein Ersatz** für den amtlichen Fragenkatalog.

---

## 📂 Module (nach Themen)

### 📋 Grundlagen & Recht
- [[Funkkurs — Rechtliche Grundlagen]] — Wann braucht man SRC/UBI? Pflicht, Zeugnisarten, Rufzeichen, MMSI/ATIS.
- [[Funkkurs — Wichtige Stellen & Behörden]] — Wer macht was: BNetzA, BSH, Seeschiffsregister, DGzRS/Bremen Rescue, GDWS/WSV, ITU, DSV/DMYV.

### 🌊 Die zwei Zeugnisse
- [[Funkkurs — SRC Seefunk (GMDSS)]] — GMDSS, Seegebiete, DSC, MMSI, Kanäle, Sendeleistung, MAYDAY, SRC-Prüfung.
- [[Funkkurs — UBI Binnenfunk]] — ATIS, die 4 Verkehrskreise, Kanal 10, Notverkehr, UBI-Prüfung.

### 🔌 Technik
- [[Funkkurs — Technik (Wellen, Antenne, Geräte)]] — UKW-Wellen, Frequenzen, Reichweite, Antenne, Strom/Batterie, Simplex/Duplex/Semiduplex, Praxis.
- [[Funkkurs — DSC (Digital Selective Calling)]] — DSC-Rufarten, Notalarm im Detail, MMSI, Fehlalarm.
- [[Funkkurs — Notfunkgeräte (EPIRB, SART & Co.)]] — EPIRB, PLB, SART, AIS-SART, MOB-Sender (mit Bildern).
- [[Funkkurs — NAVTEX & NAVAREA]] — Textsystem für Sicherheitsmeldungen, Meldungskopf, NAVAREA-Weltkarte.
- [[Funkkurs — Grafik-Generator (Python)]] — erzeugt die matplotlib-Plots des Kurses.

### 📡 Funkpraxis
- [[Funkkurs — Notverfahren & Funkschema (alle Fälle)]] — MAYDAY, RELAY, Abbruch, Silence, PAN PAN, SÉCURITÉ + Funkschema-Matrix.
- [[Funkkurs — Funkverfahren & Buchstabieralphabet]] — Buchstabieralphabet, Floskeln, Routine-Anruf, Funkprobe.
- [[Funkkurs — Funkbeispiele & Muster-Funksprüche]] — viele fertige Funksprüche (Routine, Not, Dringlich, Sicherheit, DSC) mit Tipps.
- [[Funkkurs — Revierkanäle Ostsee & Mittelmeer]] — Praxis-Kanäle für Ostsee & Mittelmeer/Adria.

### 🎓 Kurs & Prüfung
- [[Funkkurs — Ablaufplan & Prüfungsfallen]] — Wochenend-Plan + typische Stolperfallen.
- 🌊 [[Funkkurs — Quiz SRC (Seefunk)]] — Quiz zum Seefunk (mit Rechenaufgaben).
- 🛶 [[Funkkurs — Quiz UBI (Binnenfunk)]] — Quiz zum Binnenfunk.
- [[Funkkurs — Quiz & Prüfungssimulation]] — Übersicht, die auf beide Quizze verweist.

---

## 📄 Druckbare Handouts (PDF, DIN A4)
> [!info] Zum Aushändigen & Laminieren
> Fertige A4-PDFs für die Teilnehmer — einfach öffnen und drucken (A4, 100 %).

- 📘 [[SRC-Handout.pdf]] — **3 Seiten** Übersicht: Notruf-Schema, 4 Verkehrsarten, Kanäle, Sendeleistung, Alphabet, DSC, Seegebiete, Behörden + **Funk-Vokabeln EN↔DE**.
- 🆘 [[SRC-Notfallkarte.pdf]] — **1 Seite** nur Notverfahren (MAYDAY/RELAY/RECEIVED/Cancel/PAN PAN/SÉCURITÉ/Silence) — zum **Laminieren** fürs Schiff.
- 📡 [[SRC-Geraete-und-Notfunk.pdf]] — **2 Seiten** Geräte & Bedienung: DSC, Squelch/Dual Watch/Scan, EPIRB/SART/PLB (mit Bildern), Wartung & Preise.
- 🗣️ [[SRC-Funksprueche-Uebung.pdf]] — **2 Seiten** Muster-Funksprüche auf **Englisch** zum Nachsprechen/Üben.
- 🔀 [[Funkkurs-Diagramme.pdf]] — **alle 18 Fluss- & Schemadiagramme** des Kurses als Bild-Sammlung (Recht, SRC, Notverfahren, DSC, Notfunk, Technik, UBI).

---

## 1. Überblick — Welches Zeugnis wofür?

|                     | **SRC**                                                                                   | **UBI**                                                     |
| ------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Voller Name         | Short Range Certificate (Beschränkt Gültiges UKW-Sprechfunkzeugnis für den Seefunkdienst) | UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk        |
| Gewässer            | See (Küste), UKW-Reichweite **bis ~35 sm**                                                | Binnen (Flüsse, Kanäle, Seen)                               |
| System              | **GMDSS** (Seenotfunk) mit **DSC**                                                        | Binnenfunk mit **ATIS** (kein DSC)                          |
| Identifikation      | **MMSI** (9-stellig)                                                                      | **ATIS-Kennung**                                            |
| **Funksprache**     | **Englisch** (international!)                                                             | **Deutsch** (Landessprache)                                 |
| Not-Aussendung      | DSC-Notalarm auf **Kanal 70** + Sprechfunk Kanal 16                                       | Sprechfunk an Revierzentrale / Schiff-Schiff                |
| Geltung             | weltweit (nur UKW-Bereich)                                                                | RAINWAT-Vertragsstaaten (Europa-Binnen)                     |
| Prüfungsinhalt      | Theorie (24 MC, 19 richtig) + Praxis: DSC + **englisches Diktat/Übersetzung**             | Theorie (MC) + Praxis: Sprechfunk (kein Englisch, kein DSC) |
| Herausgeber Prüfung | DSV / DMYV (im Auftrag)                                                                   | DSV / DMYV (im Auftrag)                                     |

**Merksatz für die Teilnehmer:** SRC = Salzwasser + DSC + **Englisch**. UBI = Binnen + ATIS + Deutsch. Wer beides fährt, braucht beides.

> [!important] Kernpunkt SRC: Es wird auf ENGLISCH gefunkt
> Der Seefunk ist international — auf See begegnen sich Schiffe aller Nationen, deshalb ist Englisch die verbindliche Funksprache. Not-, Dringlichkeits- und Sicherheitsverkehr werden in der Prüfung **in Englisch** abgewickelt (mit Buchstabieralphabet), dazu kommen **Diktat und Übersetzung** englischer Seefunktexte. Beim UBI (Binnen) wird dagegen in der Landessprache, also Deutsch, gefunkt.

---

## Quellen (recherchiert 06/2026)
- ADAC Skipper — *SRC: Alles zum Funkzeugnis* — https://skipper.adac.de/src-short-range-certificate/
- src-lrc-ubi.de — *DSC im Seefunk: Notruf, Kanal 70* — https://src-lrc-ubi.de/glossar-dsc-notruf-seefunk/
- src-lrc-ubi.de — *SRC Prüfung: Ablauf, 27 Seefunktexte* — https://src-lrc-ubi.de/glossar-src-pruefung-ablauf/
- src-lrc-ubi.de — *Binnenschifffahrtsfunk: Verkehrskreise & UBI* — https://src-lrc-ubi.de/glossar-binnenschifffahrtsfunk/
- src-lrc-ubi.de — *UBI (UKW-Sprechfunkzeugnis Binnen) – ATIS* — https://src-lrc-ubi.de/ubi-funkschein/
- CCNR/ZKR — *Handbuch Binnenschifffahrtsfunk, Allgemeiner Teil 2017* — https://www.ccr-zkr.org/files/documents/reglementRP/rp41a_pg_062017.pdf
- Yachtschule Rünthe — *Ablaufschema Funkmeldungen GMDSS 2008 (PDF)* — https://www.yachtschule-ruenthe.de/fileadmin/datensammlung/dateien/ablaufschemafunk_y1708.pdf
- amtliche Fragenkataloge SRC & UBI (gültig ab 10/2018), Bundesnetzagentur / DSV-DMYV
- DP07 Seefunk — Küstenfunkstellen & Wetter-Sendezeiten Ostsee — https://dp07.com/
- Detlef Hahn — *Küstenfunkstellen* — https://detlefhahn.de/segeln/funkschein/kuefust.php
- Euronautic — *UKW-Kanäle Kroatien/Adria* — https://euronautic.eu/de/wasserfahrzeuge/wichtige_informationen/ukw_kanale/
- Scansail — *Seefunk in der Charterpraxis* — https://blog.scansail.com/de/seefunk-in-der-charterpraxis/
- BSH — *Wetter- und Warnfunk* (Sendezeiten/Kanäle) — https://www.bsh.de/ (Publikation Wetter- und Warnfunk)
- Bundesnetzagentur — *Seefunk* (Zuteilung Rufzeichen/MMSI/ATIS) — https://bundesnetzagentur.de/seefunk
- ELWIS — *Sprechfunkzeugnisse* (Recht/Zuständigkeit) — https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/
- DMYV — *Merkblatt Funkzeugnis Seefunkdienst* — https://www.dmyv.de/
- Wikipedia/DGzRS — *Bremen Rescue Radio* (MRCC Bremen) — https://de.wikipedia.org/wiki/Bremen_Rescue_Radio
- Detlef Hahn — *GMDSS Meldungen* (Silence-Floskeln) — https://detlefhahn.de/segeln/funkschein/gmdss/wrc_07_meldungen.php

> [!note] Maßgeblich bleiben die amtlichen Fragenkataloge und Handbücher — vor der Prüfung gegenchecken.

### See also
*Superlink:* [[220 ⚓️Marine]]

Verwandt: [[Bootsschule Land in Sicht]]

Created: 04/06/26 · Erweitert (Web-Recherche + Bilder): 04/06/26 · In Module gesplittet: 04/06/26
