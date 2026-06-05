---
ai_generated: true
model: claude-opus-4-8
date_created: 04/06/26
tags: [ai-generated]
type: note
---

## Funkkurs — SRC Funkbeispiele & Muster-Funksprüche (Seefunk)

Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Fertige **Seefunk-Funksprüche** auf **Englisch** zum Nachsprechen — mit **Tipps**. Für Binnenfunk (Deutsch) → [[Funkkurs — UBI Funkbeispiele & Muster-Funksprüche]].

> [!abstract] So liest du die Beispiele
> `→` = man sendet, `←` = Antwort der Gegenstation. Seefunk läuft **auf Englisch**. Alphabet & Floskeln: [[Funkkurs — Funkverfahren & Buchstabieralphabet]].

---

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
→ "Kiel Traffic, Kiel Traffic – this is Albatros, Delta Alfa 4711, radio check, OVER"
← "Albatros – this is Kiel Traffic, loud and clear, OVER"
→ "Thank you, Albatros, OUT"
```
> [!tip] Tipp
> **Nicht auf Kanal 16 testen.** Antwort: „loud and clear" oder **Readability 1–5**.

> [!note] „Traffic" oder „Radio"? — kleine Eselsbrücke aus der Praxis
> **…Traffic** = die **Verkehrszentrale (VTS)**, die das Revier überwacht und lenkt (z. B. **Kiel Traffic**). **…Radio** = die **Küstenfunkstelle** (DP07), die Gespräche vermittelt und Wetter sendet (z. B. **Kiel Radio**). — Ich (Max) hab den Unterschied mal auf die harte Tour gelernt: Wir sind ganz entspannt mit **Gennaker** ins **Verkehrstrennungsgebiet (TSS)** reingekreuzt — und prompt meldete sich **Kiel Traffic** und bat uns freundlich-bestimmt, den Bereich zu verlassen. Die *Traffic* passt eben auf den Verkehr auf, das *Radio* nicht. 😅

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

### A13 · Verständigungsproblem (Say again / I spell)
```
→ "Freya – this is Albatros, say again your position, OVER"
← "Albatros – this is Freya, I spell my position:
   five four degrees, three zero minutes North — I say again, OVER"
→ "Roger, understood, OVER"
```
> [!tip] Tipp
> Schlecht verstanden? **„SAY AGAIN"** (nicht „repeat"). Wichtiges per **„I spell"** buchstabieren. Bei eigenem Fehler **„CORRECTION"**.

### A14 · Anruf einer Küstenfunkstelle (Gesprächswunsch)
```
→ "Kiel Radio, Kiel Radio – this is Albatros, Delta Alfa 4711, OVER"
← "Albatros – this is Kiel Radio, change to channel 27, OVER"
→ "Channel 27, Albatros, OVER"
   ... auf Kanal 27 ...
→ "Kiel Radio, this is Albatros – request weather report
   for the western Baltic, OVER"
```
> [!tip] Tipp
> Küstenfunkstelle = voll **25 W**. Anruf kurz, dann auf den **Arbeitskanal** der Station wechseln.

### A15 · Mensch über Bord (eigenes Schiff)
```
→ "PAN PAN – PAN PAN – PAN PAN  (bei akuter Lebensgefahr: MAYDAY)
    ALL STATIONS x3
    THIS IS Albatros, MMSI 211123456
    MAN OVERBOARD, position 54 30 N 010 15 E,
    require assistance for search, OVER"
```
> [!warning] Tipp
> Schwebt die Person in **akuter Lebensgefahr**, ist es ein **MAYDAY** (dann erst DSC-Alarm K70). Sonst **PAN PAN**. Personenzahl & letzte Position nennen.

### A16 · Funkstille im Notverkehr (SILENCE MAYDAY)
```
[Du störst laufenden Notverkehr nicht und forderst Ruhe:]
→ "SILENCE DISTRESS (seelonce distress), this is Albatros, OUT"

[Leitende Station / Schiff in Not:]
→ "SILENCE MAYDAY (seelonce mayday)"
```
> [!tip] Tipp
> **SILENCE MAYDAY** (Aussprache *seelonce mayday*) = Funkstille vom Notschiff/der leitenden Station. **SILENCE DISTRESS** (*seelonce distress*) = von einer anderen Station. → Details: [[Funkkurs — Notverfahren & Funkschema (alle Fälle)]].

### A17 · Notverkehr beenden (SILENCE FINI)
```
→ "MAYDAY, ALL STATIONS x3,
    THIS IS Bremen Rescue, time 1450 UTC,
    yacht Freya, SILENCE FINI (seelonce feenee)"
```
> [!tip] Tipp
> **SILENCE FINI** (Aussprache *seelonce feenee*) beendet den Notverkehr — nur **leitende Station / Schiff in Not**. Danach läuft Normalverkehr wieder.

### A18 · SÉCURITÉ empfangen (Wetterwarnung)
```
← "SÉCURITÉ x3, ALL STATIONS x3, this is Kiel Radio,
   listen channel 27 for a gale warning, OVER"
[→ auf Kanal 27 zuhören — nicht antworten, nur mitschreiben]
```
> [!tip] Tipp
> Bei **SÉCURITÉ/Wetterwarnung**: auf den angekündigten Kanal wechseln und **zuhören** — keine Bestätigung nötig.

---

> [!success] Übungs-Idee für den Kurs
> Karten mit Situationen ziehen lassen (Container treibt, Motor aus, Liegeplatz, Mensch über Bord, Wetterwarnung …) → Teilnehmer wählen **Verkehrsart** und sprechen den passenden **englischen** Muster-Funkspruch. Gegenseitig **Readability** geben. Binnen-Beispiele → [[Funkkurs — UBI Funkbeispiele & Muster-Funksprüche]].

---
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
