---
ai_generated: true
model: claude-opus-4-8
date_created: 04/06/26
tags: [ai-generated, marine]
type: note
---

## Funkkurs — Funkbeispiele & Muster-Funksprüche

Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Fertige **Muster-Funksprüche** zum Vorlesen, Nachsprechen und Üben — mit **Tipps**.

> [!abstract] So liest du die Beispiele
> `→` = man sendet, `←` = Antwort der Gegenstation. **Teil A = SRC (Seefunk, ENGLISCH)** · **Teil B = UBI (Binnenfunk, DEUTSCH)**. Alphabet & Floskeln: [[Funkkurs — Funkverfahren & Buchstabieralphabet]].

> [!important] Der Sprach-Unterschied
> **SRC läuft auf Englisch** (internationaler Seefunk), **UBI auf Deutsch** (Binnenfunk, Landessprache). Schon daran erkennt man im Beispiel sofort, zu welchem Zeugnis es gehört.

---

# 🌊 Teil A — SRC (Seefunk, Englisch)

### A1 · Routine: Marina anrufen (Liegeplatz)
```
→ "Marina Heiligenhafen, Marina Heiligenhafen, Marina Heiligenhafen –
   this is Albatros, Albatros, Albatros, call sign Delta Alfa 4711, OVER"
← "Albatros – this is Marina Heiligenhafen, change to channel 71, OVER"
→ "Channel 71, Albatros, OVER"
   ... auf Kanal 71 ...
→ "Marina Heiligenhafen, this is Albatros – we are a 12-metre yacht,
   request a berth for tonight, OVER"
```
> [!tip] Tipp
> Erst auf **Kanal 16/Anrufkanal** rufen, dann sofort auf den **Arbeitskanal** wechseln. Anliegen **kurz und konkret**. Am Ende mit **OUT** abschließen.

### A2 · Routine: Schiff–Schiff (Begegnung absprechen)
```
→ "Sailing yacht on my starboard side off Fehmarn –
   this is motor vessel Nordstern, channel 06, OVER"
← "Nordstern – this is sailing yacht Freya, channel 06, OVER"
→ "Freya – I will pass you on your port side, OVER"
← "Roger, on my port side, OUT"
```
> [!tip] Tipp
> Kennst du den Namen nicht, **beschreibe das Schiff** (Position/Typ). Schiff-Schiff auf **06/08/72/77** — nicht lange auf 16.

### A3 · Funkprobe / Radio Check
```
→ "Kiel Radio, Kiel Radio – this is Albatros, Delta Alfa 4711, radio check, OVER"
← "Albatros – this is Kiel Radio, loud and clear, OVER"
→ "Thank you, Albatros, OUT"
```
> [!tip] Tipp
> **Nicht auf Kanal 16 testen.** Antwort: „loud and clear" oder **Readability 1–5**.

### A4 · MAYDAY (Notmeldung)
```
→ [erst DSC-Notalarm auf Kanal 70, dann auf Kanal 16:]
   "MAYDAY – MAYDAY – MAYDAY
    THIS IS Albatros, Albatros, Albatros, call sign Delta Alfa 4711, MMSI 211123456
    MAYDAY Albatros
    POSITION 54 degrees 30 minutes North, 010 degrees 15 minutes East
    NATURE OF DISTRESS: we are sinking after collision
    ASSISTANCE REQUIRED: immediate assistance
    PERSONS ON BOARD: four
    OVER"
```
> [!danger] Tipp für den Ernstfall
> **Ruhig, langsam, deutlich.** Reihenfolge: *Wer – Wo – Was – Welche Hilfe – Wie viele*. Antwortet niemand → nach ~1 Min wiederholen.

### A5 · MAYDAY RELAY (fremde Notmeldung weiterleiten)
```
→ "MAYDAY RELAY – MAYDAY RELAY – MAYDAY RELAY
    ALL STATIONS, ALL STATIONS, ALL STATIONS
    THIS IS Nordstern, Nordstern, Nordstern, MMSI 211987654
    Following received from yacht Freya at 1420 UTC:
    ... [Notmeldung wiederholen] ...
    OVER"
```

### A6 · RECEIVED MAYDAY (bestätigen)
```
→ "MAYDAY
    Albatros, Albatros, Albatros
    THIS IS Nordstern, Nordstern, Nordstern
    RECEIVED MAYDAY"
```
> [!tip] Tipp
> Erst **kurz warten**, ob eine Küstenfunkstelle/MRCC quittiert.

### A7 · Fehlalarm widerrufen (Cancel)
```
→ "ALL STATIONS, ALL STATIONS, ALL STATIONS
    THIS IS Albatros, Delta Alfa 4711, MMSI 211123456
    PLEASE CANCEL MY DISTRESS ALERT OF 0915 UTC
    OUT"
```
> [!warning] Tipp
> Versehentlichen DSC-Alarm **nie einfach ausschalten** → [[Funkkurs — DSC (Digital Selective Calling)]].

### A8 · PAN PAN (Dringlichkeit)
```
→ "PAN PAN – PAN PAN – PAN PAN
    ALL STATIONS, ALL STATIONS, ALL STATIONS
    THIS IS Albatros, Albatros, Albatros, MMSI 211123456
    POSITION 2 nautical miles south of Fehmarn
    We are disabled, engine failure, drifting, no immediate danger
    Request a tow, OVER"
```
> [!tip] Tipp
> Position hier **im Sprechfunk** nennen (DSC überträgt sie bei Dringlichkeit **nicht** automatisch).

### A9 · PAN PAN MEDICO (funkärztliche Beratung)
```
→ "PAN PAN – PAN PAN – PAN PAN
    Bremen Rescue, Bremen Rescue, Bremen Rescue
    THIS IS Albatros, MMSI 211123456
    I require MEDICAL ADVICE, OVER"
← [Küstenfunkstelle vermittelt Verbindung zum Arzt – Medico Cuxhaven]
```

### A10 · SÉCURITÉ (Sicherheitsmeldung)
```
→ "SÉCURITÉ – SÉCURITÉ – SÉCURITÉ
    ALL STATIONS, ALL STATIONS, ALL STATIONS
    THIS IS Albatros, MMSI 211123456
    For safety message, listen channel 67, OVER"
   ... auf Kanal 67 ...
→ "SÉCURITÉ ... drifting container sighted, position 54 30 N 010 15 E,
   danger to navigation, OUT"
```
> [!tip] Tipp
> Ankündigung auf **K16**, eigentliche Warnung auf einem **Arbeitskanal**.

### A11 · DSC-Routine-Anruf (Einzelanruf)
```
→ [DSC-Menü:] Individual Call → MMSI der Gegenstation → Arbeitskanal wählen → senden (K70)
← Gegenstation quittiert per DSC, beide wechseln auf den Arbeitskanal
→ "Freya – this is Albatros, OVER" (jetzt Sprechfunk)
```
> [!tip] Tipp
> Du wählst die **Funktion**, nicht den Kanal — moderne Geräte stellen den Arbeitskanal automatisch ein.

### A12 · DSC-Testanruf
```
→ [DSC-Menü:] Test Call → MMSI einer Küstenfunkstelle → senden
← Küstenfunkstelle bestätigt automatisch ("Test acknowledged")
```
> [!warning] Tipp
> Zum Testen **nur „Test Call"** — niemals den DSC-Notalarm.

---

# 🛶 Teil B — UBI (Binnenfunk, Deutsch)

> [!info] Anders als im Seefunk
> Binnenfunk läuft **auf Deutsch**, **ohne DSC** (Identifikation per **ATIS**, automatisch). Anruf-/Sicherheitskanal Schiff–Schiff ist **Kanal 10**; an Land ruft man die **Revierzentrale**.

### B1 · Routine: Schleuse anrufen
```
→ "Schleuse Brunsbüttel, Schleuse Brunsbüttel – hier ist Möwe, Möwe, kommen"
← "Möwe – hier ist Schleuse Brunsbüttel, kommen"
→ "Wir sind ein Sportboot, 9 Meter, vor der Schleuse, bitten um Einfahrt, kommen"
← "Möwe – bitte warten, Einfahrt in zehn Minuten, Ende"
```
> [!tip] Tipp
> „**Kommen**" statt „over", „**Ende**" statt „out" — im Binnenfunk wird **deutsch** gesprochen.

### B2 · Routine: Brücke anrufen (Öffnung)
```
→ "Brücke Oldenburg, Brücke Oldenburg – hier ist Möwe, kommen"
← "Möwe – hier ist Brücke Oldenburg, kommen"
→ "Bitten um Öffnung für die Durchfahrt flussabwärts, kommen"
```

### B3 · Schiff–Schiff (Begegnung) auf Kanal 10
```
→ "Talfahrer vor der Kurve bei km 320 – hier ist Möwe, Bergfahrt, Kanal 10, kommen"
← "Möwe – hier ist Talfahrer Rheingold, kommen"
→ "Wir begegnen uns Backbord an Backbord, kommen"
← "Verstanden, Backbord an Backbord, Ende"
```
> [!tip] Tipp
> Auf **Kanal 10** Dauerhörwache halten. Begegnungsabsprache ist Sicherheit der Schifffahrt → kurz und eindeutig.

### B4 · Nautische Information: Revierzentrale
```
→ "Revierzentrale Oberwesel, Revierzentrale Oberwesel – hier ist Möwe, kommen"
← "Möwe – hier ist Revierzentrale Oberwesel, kommen"
→ "Bitten um aktuelle Wasserstands- und Verkehrsinformation für die Gebirgsstrecke, kommen"
```

### B5 · Notruf im Binnenfunk (per Sprechfunk!)
```
→ "MAYDAY – MAYDAY – MAYDAY
    hier ist Möwe, Möwe, Möwe
    Position: Rhein km 320, am rechten Ufer
    Wir haben Wassereinbruch nach Grundberührung
    Brauchen sofort Hilfe
    Drei Personen an Bord
    kommen"
```
> [!danger] Tipp
> **Kein DSC im Binnenfunk** — der Notruf geht **per Sprechfunk** an die **Revierzentrale** oder über **Kanal 10**. ATIS-Kennung wird automatisch mitgesendet. Sonst gleicher Aufbau wie der Seefunk-MAYDAY.

---

> [!success] Übungs-Idee für den Kurs
> Karten mit Situationen ziehen lassen (Container treibt, Motor aus, Liegeplatz, Schleuse, Mensch über Bord …) → Teilnehmer wählen **Zeugnis (SRC/UBI), Sprache und Verkehrsart** und sprechen den passenden Muster-Funkspruch. Gegenseitig **Readability** geben.

---
Tags: #marine
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
