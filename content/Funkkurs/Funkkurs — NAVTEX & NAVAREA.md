---
ai_generated: true
model: claude-opus-4-8
date_created: 04/06/26
tags: [ai-generated, marine]
type: note
---

## Funkkurs — NAVTEX & NAVAREA

Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Alles zum **NAVTEX**-Textsystem und zur weltweiten **NAVAREA**-Einteilung.

> [!abstract] In einem Satz
> **NAVTEX = automatischer Empfang von Sicherheitsmeldungen als TEXT** (Navigationswarnungen, Wetter, SAR) — ein eigenes Gerät, das die Meldungen still empfängt, speichert und im Display anzeigt. Abgrenzung zu WX (Sprechfunk): [[Funkkurs — Revierkanäle Ostsee & Mittelmeer#Wetter & Sicherheitsmeldungen: WX (Sprechfunk) vs. NX (NAVTEX)|WX vs. NX]].

---

### 1. Was ist NAVTEX?
- **NAVTEX = Navigational Telex** — Teil des **GMDSS** zur Verbreitung von **MSI** (Maritime Safety Information).
- Ein **eigener Empfänger** (nicht das UKW-Gerät) empfängt **automatisch** und **speichert** die Meldungen; man **liest sie im Display** (oder Ausdruck), wann man will.
- Inhalte: **Navigationswarnungen, Wetterberichte/-warnungen, Eismeldungen, SAR-Informationen** u. a.
- **Reichweite** ~250–400 sm (Mittelwelle, Bodenwelle) — deckt damit Küsten­gewässer großflächig ab.

### 2. Frequenzen
| Frequenz | Verwendung |
|---|---|
| **518 kHz** | **international**, Meldungen in **Englisch** (Standard) |
| **490 kHz** | **national**, in der **Landessprache** (z. B. Deutsch) |
| 4209,5 kHz | Tropengebiete |

### 3. Der Meldungskopf B1B2B3B4
Jede NAVTEX-Meldung beginnt mit **vier Zeichen**, die steuern, **von wem**, **was** und **welche Nummer**:
```
Z C A 24
│ │ │ └─ B3B4 = laufende Nummer der Meldung
│ │ └─── B2 = Kategorie (Inhalt, A–Z)
│ └───── B1 = Sendestation (Buchstabe)
```
- **B1 — Sendestation:** jeder Sender hat einen Buchstaben (A, B, C …) und einen **festen Sendezeit-Slot**, damit sich benachbarte Stationen nicht stören.
- **B2 — Kategorie:** sagt, **worum** es geht (siehe Tabelle).
- **B3B4 — Nummer:** fortlaufend; eine bereits empfangene Nummer wird nicht doppelt gespeichert.

**Wichtige Kategorien (B2):**
| Buchstabe | Inhalt |
|---|---|
| **A** | **Navigationswarnungen** ⚠️ (nicht abwählbar) |
| **B** | **Wetterwarnungen** ⚠️ (nicht abwählbar) |
| **C** | Eismeldungen |
| **D** | **SAR-Informationen** ⚠️ (nicht abwählbar) |
| **E** | Wettervorhersagen |
| **F** | Lotsendienst |
| **L** | weitere Navigationswarnungen |
| **Z** | „keine Meldung" (QRU) |

> [!warning] Sicherheitskategorien lassen sich NICHT abwählen
> **A (Navigationswarnung), B (Wetterwarnung) und D (SAR)** empfängt das Gerät **immer** — sie sind sicherheitskritisch. Andere Kategorien (z. B. Lotsendienst) kann man im Empfänger **ausfiltern**.

### 4. NAVAREA — die weltweite Einteilung
![[funkkurs-navarea.jpg]]
<sub>Die Welt-Seegebiete des WWNWS (NAVAREA I–XXI). Bild: Wikimedia Commons.</sub>

- Für die Verbreitung von MSI sind die Weltmeere im **WWNWS** (World-Wide Navigational Warning Service) in **~21 NAVAREAs** (römische Ziffern **I–XXI**) eingeteilt.
- Jede NAVAREA hat einen **NAVAREA-Koordinator** (ein verantwortliches Land), der die **NAVAREA-Warnungen** für sein Gebiet herausgibt.
- Die **NAVTEX-Sender** arbeiten **innerhalb** dieser Gebiete mit **koordinierten Sendezeiten** (über das B1-Zeichen), damit sich Stationen nicht überlagern.
- **Deutschland** liegt in **NAVAREA I** (Nord- und Ostsee, Koordinator Großbritannien).

> [!info] NAVAREA vs. NAVTEX
> **NAVAREA = das große geografische Gebiet** (weltweite Einteilung der Warnzonen). **NAVTEX = das technische System/Gerät**, über das die Meldungen *innerhalb* einer Region empfangen werden. Zusätzlich gibt es **METAREA**s (gleiche Grenzen) für die **Wetter**verantwortung.

### 5. NAVTEX in der Ostsee
![[funkkurs-navtex-ostsee.jpg]]
<sub>Beispiel: NAVTEX-Senderabdeckung Ostsee. Bild: Wikimedia Commons.</sub>

---

> [!tip] Einordnung für den SRC-Kurs
> NAVTEX ist **wissenswert**, aber kein Bediengerät der SRC-Prüfung. Kernpunkte für die Teilnehmer: **518 kHz englisch / 490 kHz national · empfängt & speichert Text automatisch · A/B/D immer · weltweit organisiert in NAVAREAs**.

---
Tags: #marine
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
