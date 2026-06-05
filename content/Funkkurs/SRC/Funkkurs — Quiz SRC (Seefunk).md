---
ai_generated: true
model: claude-opus-4-8
date_created: 04/06/26
tags: [ai-generated]
type: note
---

## Funkkurs — Quiz SRC (Seefunk)

Fragen zum **SRC / Seefunk**. Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Antworten ausklappbar. Für Binnenfunk → [[Funkkurs — Quiz UBI (Binnenfunk)]].

> [!tip] So übst du
> Erst **ohne Aufklappen** beantworten, dann auflösen. Am Ende die **Mini-Prüfungssimulation**.

---

### A) Recht, Behörden & Kennungen
**1.** Wer braucht an Bord ein Funkzeugnis?
<details><summary>Antwort</summary>Der <b>Schiffsführer</b> muss ein ausreichendes Zeugnis haben; eine Funkstelle darf nur bedienen, wer das passende Zeugnis besitzt.</details>

**2.** Welche zwei Dinge braucht man, um legal zu funken?
<details><summary>Antwort</summary>(1) Den <b>Schein</b> (DSV/DMYV), (2) die <b>Frequenzzuteilung</b> + Kennungen (MMSI/Rufzeichen) von der <b>Bundesnetzagentur</b>.</details>

**3.** Wer stellt das SRC aus, wer vergibt die MMSI?
<details><summary>Antwort</summary>SRC: <b>DSV/DMYV</b>. MMSI: <b>Bundesnetzagentur</b> (Außenstelle Hamburg).</details>

**4.** Wie ist ein Sportboot-Rufzeichen aufgebaut?
<details><summary>Antwort</summary><b>2 Buchstaben + 4 Ziffern</b>, 1. Buchstabe immer <b>D</b> (z. B. DA4711). Registrierte Schiffe: 4-Buchstaben-Rufzeichen (z. B. DDTW).</details>

**5.** Wie viele Ziffern hat die MMSI, und wofür stehen die ersten drei?
<details><summary>Antwort</summary><b>9 Ziffern</b>; die ersten drei = <b>MID</b> (Deutschland 211/218).</details>

**6.** Welche Urkunde enthält die eigene MMSI?
<details><summary>Antwort</summary>Die <b>Zuteilungsurkunde (Ship Station Licence)</b>.</details>

**7.** Welche Funkstelle kennzeichnet die MMSI 002111240?
<details><summary>Antwort</summary>Eine <b>deutsche Küstenfunkstelle</b> (00 = Küstenfunkstelle, 211 = MID) — „Bremen Rescue".</details>

**8.** Welche Stelle stellt das Flaggenzertifikat aus?
<details><summary>Antwort</summary>Das <b>BSH</b> (8 Jahre gültig).</details>

**9.** Ab welcher Rumpflänge ist die Eintragung ins Seeschiffsregister Pflicht — und wo?
<details><summary>Antwort</summary>Ab <b>15 m</b>, beim <b>Amtsgericht</b> (Seeschiffsregister am Heimathafen).</details>

### B) GMDSS & Seegebiete
**10.** Wofür steht GMDSS und was ist die Kernidee?
<details><summary>Antwort</summary><b>Global Maritime Distress and Safety System</b>; Kernidee: automatischer Notalarm per Knopfdruck (DSC), dann Sprechfunk.</details>

**11.** Welches Seegebiet deckt das SRC ab?
<details><summary>Antwort</summary><b>A1</b> — UKW-Reichweite einer DSC-Küstenfunkstelle (~20–35 sm).</details>

**12.** Was sind A2, A3, A4 grob — und welcher Schein gilt dort?
<details><summary>Antwort</summary>A2 = Grenzwelle (MF), A3 = Satellit, A4 = Polargebiete (KW). Dafür braucht es das <b>LRC</b>.</details>

### C) DSC & Kanal 70
**13.** Welcher Kanal ist nur DSC, und was darf man dort nicht?
<details><summary>Antwort</summary><b>Kanal 70</b> — dort wird <b>nie gesprochen</b>.</details>

**14.** Muss man vor einem DSC-Call manuell auf Kanal 70 wechseln?
<details><summary>Antwort</summary><b>Nein.</b> Das Gerät überwacht K70 automatisch und schaltet beim Senden selbst drauf. Man wählt die <b>Funktion</b>, nicht den Kanal.</details>

**15.** Welche Daten sendet der DSC-Notalarm automatisch?
<details><summary>Antwort</summary><b>MMSI, Position, Zeit</b> und ggf. die <b>Art der Not</b>.</details>

**16.** Wird die Position auch bei PAN PAN/SÉCURITÉ automatisch per DSC gesendet?
<details><summary>Antwort</summary><b>Nein</b> — die Position wird <b>nur beim Notalarm</b> automatisch mitgesendet. Bei Dringlichkeit/Sicherheit nennt man sie im Sprechfunk.</details>

**17.** Nenne drei Auswahlpunkte der „Nature of Distress".
<details><summary>Antwort</summary>z. B. <b>Fire/explosion, Flooding, Collision, Grounding, Sinking, Man overboard</b> (oder „undesignated").</details>

**18.** Häufiger Praxisfehler bei DSC trotz Schein?
<details><summary>Antwort</summary><b>MMSI nie programmiert</b> → Notalarm ohne gültige Kennung.</details>

**19.** Wie testet man DSC — und was darf man nie?
<details><summary>Antwort</summary><b>„Test Call"</b> an eine Küstenfunkstellen-MMSI (auto-Bestätigung). <b>Nie</b> einen DSC-Notalarm zum Testen auslösen.</details>

### D) Kanäle & Frequenzen (See)
**20.** Welche Frequenz hat Kanal 16?
<details><summary>Antwort</summary><b>156,800 MHz</b> (Simplex).</details>

**21.** Warum ist Kanal 16 ein Simplex-Kanal?
<details><summary>Antwort</summary>Damit ihn <b>alle</b> mithören können — bei einem Not-/Anrufkanal gewollt.</details>

**22.** Wofür ist Kanal 06?
<details><summary>Antwort</summary><b>On-Scene/SAR</b> (Search and Rescue), Schiff-Schiff.</details>

**23.** Welche Ausweichkanäle nimmt man, wenn 16 und 06 belegt sind?
<details><summary>Antwort</summary><b>08 und 13.</b></details>

**24.** Welche Kanäle sind AIS (kein Sprechfunk)?
<details><summary>Antwort</summary><b>87 und 88.</b></details>

**25.** Welche UKW-Kanalbereiche stehen im Seefunk zur Verfügung?
<details><summary>Antwort</summary><b>1–28</b> und <b>60–88.</b></details>

### E) Sendeleistung
**26.** Welche zwei Sendeleistungen gibt es, und was heißt die Einstellung?
<details><summary>Antwort</summary><b>1 W</b> oder <b>25 W</b> — bedeutet jeweils „maximal" (real abhängig von Antenne usw.).</details>

**27.** Wann immer 25 W?
<details><summary>Antwort</summary>Bei <b>Not/Dringlich/Sicherheit</b> und im Verkehr mit <b>Küstenfunkstellen</b>.</details>

**28.** Warum funkt man im Hafen mit 1 W?
<details><summary>Antwort</summary>Mehr Leistung bringt nichts (Sichtweite-Funk), <b>blockiert aber den Kanal großräumig</b> und stört andere. 1 W bleibt lokal → Frequenz-Wiederverwendung. „Lautstärke, nicht Qualität."</details>

### F) Notverfahren
**29.** Nenne die 3 Dringlichkeitsstufen mit Kennwort.
<details><summary>Antwort</summary>Not = <b>MAYDAY</b>, Dringlichkeit = <b>PAN PAN</b>, Sicherheit = <b>SÉCURITÉ</b>.</details>

**30.** Reihenfolge beim Absetzen einer Seenotmeldung?
<details><summary>Antwort</summary>roter Knopf → DSC-Alarm <b>K70</b> → Gerät auf <b>K16</b> → Sprech-<b>MAYDAY</b> (englisch).</details>

**31.** Reihenfolge der MAYDAY-Inhalte nach „THIS IS …"?
<details><summary>Antwort</summary>Position · Nature of distress · Assistance required · Persons on board · Other information · OVER.</details>

**32.** Was ist ein MAYDAY RELAY?
<details><summary>Antwort</summary>Weiterleitung einer <b>fremden</b> Notmeldung, wenn das Schiff selbst nicht senden kann.</details>

**33.** Wie bestätigt man eine empfangene Notmeldung?
<details><summary>Antwort</summary>„MAYDAY, [Notschiff ×3], THIS IS [eigener Name ×3], <b>RECEIVED MAYDAY</b>".</details>

**34.** Was bedeutet Silence Mayday (Aussprache: „Seelonce Mäidäi"), wer spricht es?
<details><summary>Antwort</summary>Funkstille; gesprochen vom <b>Schiff in Not</b> oder der <b>leitenden Station</b>. (Andere: „Silence Distress".)</details>

**35.** Was bedeutet Silence Fini (Aussprache: „Seelonce Feenee")?
<details><summary>Antwort</summary>„Silence Fini" — Notverkehr beendet, Normalverkehr frei.</details>

**36.** Was heißt PRU-DONCE?
<details><summary>Antwort</summary>Funkstille gelockert — eingeschränkter Verkehr wieder erlaubt.</details>

**37.** Versehentlicher DSC-Alarm — was tun?
<details><summary>Antwort</summary>Nicht ausschalten! Auf K16 widerrufen: „ALL STATIONS ×3, THIS IS …, PLEASE CANCEL MY DISTRESS ALERT OF [UTC], OUT".</details>

**38.** Was ist ein MEDICO-Gespräch, welche Stufe?
<details><summary>Antwort</summary><b>Funkärztliche Beratung</b> (TMAS/Medico Cuxhaven) — <b>PAN PAN</b> (Dringlichkeit), nicht MAYDAY.</details>

### G) Technik
**39.** Frequenzbereich UKW-Seefunk + Ausbreitung?
<details><summary>Antwort</summary><b>156–162 MHz</b>; <b>quasi-optisch/Sichtweite</b>.</details>

**40.** Wovon hängt die Reichweite hauptsächlich ab?
<details><summary>Antwort</summary>Von der <b>Antennenhöhe</b> — nicht von der Leistung.</details>

**41.** Faustformel für die Reichweite?
<details><summary>Antwort</summary>Reichweite [km] ≈ <b>3,84 × (√h₁ + √h₂)</b>.</details>

**42.** Spannung und Senderstrom (25 W) eines Festgeräts?
<details><summary>Antwort</summary><b>12 V</b>; beim Senden mit 25 W ~<b>5 A</b>.</details>

**43.** Warum nie die Batterie komplett entladen?
<details><summary>Antwort</summary>Tiefentladung <b>schädigt sie dauerhaft</b> (Blei/AGM irreversibel) — und leer = kein Funk/Notruf. Max. ~50 % entnehmen.</details>

**44.** Simplex vs. Duplex?
<details><summary>Antwort</summary>Simplex = 1 Frequenz, abwechselnd. Duplex = 2 Frequenzen, gleichzeitig (Schiff↔Küstenfunkstelle).</details>

**45.** Was macht das Schiff beim Semiduplex, wenn es die Sprechtaste drückt?
<details><summary>Antwort</summary>Es schaltet von RX- auf seine <b>TX-Frequenz</b> (Küstenfunkstelle arbeitet Duplex).</details>

**46.** Gerätearten und typische Leistung?
<details><summary>Antwort</summary><b>Festeinbau</b> (25 W, 12 V, DSC) und <b>Handfunke</b> (5–6 W, Akku).</details>

### H) Wetter, Funkprobe & Bremen Rescue
**47.** WX vs. NX — hören oder lesen?
<details><summary>Antwort</summary><b>WX = Wetter per Sprechfunk → hören.</b> <b>NX = NAVTEX-Text → lesen</b> (518/490 kHz, eigener Empfänger).</details>

**48.** Wie macht man eine Sprechfunk-Funkprobe?
<details><summary>Antwort</summary>Küstenfunkstelle/Schiff auf Arbeitskanal rufen: „… RADIO CHECK, OVER" → Antwort „loud and clear"/Readability 1–5. (Nicht auf K16.)</details>

**49.** MMSI und Rufname von Bremen Rescue?
<details><summary>Antwort</summary>MMSI <b>00 211 1240</b>, Rufname <b>„Bremen Rescue"</b>; hört K16 + K70 + Grenzwelle 2187,5 kHz.</details>

### I) Buchstabieren & Floskeln
**50.** Buchstabiere KIEL.
<details><summary>Antwort</summary>Kilo – India – Echo – Lima.</details>

**51.** Muss man den Schiffsnamen buchstabieren?
<details><summary>Antwort</summary><b>Nein</b> — Namen spricht man als Wort; <b>Rufzeichen</b> buchstabieren, <b>Zahlen</b> einzeln nennen.</details>

**52.** Warum nie „Over and Out"?
<details><summary>Antwort</summary>Widerspruch: OVER = Antwort erwartet, OUT = Schluss. Entweder/oder.</details>

### J) Offizielle Buchfragen (Lernstandskontrolle IV)
**53.** Welche Behörde erteilt sechsstellige Rufzeichen?
<details><summary>Antwort</summary><b>Bundesnetzagentur</b>, Außenstelle Hamburg.</details>

**54.** Wie setzt sich die Küstenfunkstellen-MMSI zusammen?
<details><summary>Antwort</summary>9 Ziffern, die ersten <b>beiden Nullen</b>, dann die <b>MID</b> (z. B. 002111240).</details>

**55.** Woran erkennt man die Nationalität in der MMSI?
<details><summary>Antwort</summary>An der <b>MID</b> (Seefunkkennzahl).</details>

### K) Rechenaufgaben
**56.** 100-Ah-Batterie, Funke zieht im Schnitt 0,5 A — Laufzeit (50 % nutzbar)?
<details><summary>Lösung</summary>50 Ah ÷ 0,5 A = <b>100 h</b>.</details>

**57.** Reichweite bei eigener Antenne 9 m, Gegenstation 4 m?
<details><summary>Lösung</summary>3,84 × (3 + 2) = 19,2 km ≈ <b>10 sm</b>.</details>

**58.** Du hast den Schein — welche Schritte fehlen noch, bis du legal funken darfst?
<details><summary>Antwort</summary>Antrag bei der <b>Bundesnetzagentur</b> (Formular BNetzA 224) → Zuteilung von <b>Rufzeichen + MMSI</b> → <b>Zuteilungsurkunde</b> an Bord → <b>MMSI ins Gerät programmieren</b>.</details>

**59.** In welcher Zeit wird im Seefunk gefunkt, und was bedeutet „Z"?
<details><summary>Antwort</summary><b>UTC</b> (24 h, vierstellig); <b>Z = Zulu = UTC</b>.</details>

**60.** Was bedeutet die Date-Time-Group 041530Z?
<details><summary>Antwort</summary><b>4. Tag</b> des Monats, <b>15:30 UTC</b> (DDHHMM + Zonenkürzel Z).</details>

**61.** Was ist die Grenzwelle, und welche Reichweite/welches Seegebiet?
<details><summary>Antwort</summary><b>Mittelfrequenz (MF)</b>, ~1,6–4 MHz; Not 2182 kHz / DSC 2187,5 kHz. Reicht als Bodenwelle <b>~100–150 sm</b> → Seegebiet <b>A2</b> (LRC).</details>

**62.** Wodurch wird Seegebiet A3 abgedeckt, und bis wohin?
<details><summary>Antwort</summary>Durch <b>Inmarsat-Satelliten</b> — ~<b>70° N bis 70° S</b> (fast weltweit, außer Polkappen).</details>

**63.** Warum braucht es A4 mit Kurzwelle, wenn es Satelliten gibt?
<details><summary>Antwort</summary>Weil die geostationären Satelliten die <b>Polargebiete</b> nicht abdecken — dort funktioniert nur <b>Kurzwelle (HF)</b>.</details>

**64.** Wie breitet sich Kurzwelle aus — und was ist daran anders als bei UKW?
<details><summary>Antwort</summary>Über <b>Reflexion an der Ionosphäre (Raumwelle)</b> → weltweite, aber <b>schwankende</b> Reichweite (statt UKW-Sichtweite).</details>

**65.** Wie wird eine mit DSC ausgerüstete **Seefunkstelle** gekennzeichnet? *(Buchfrage)*
<details><summary>Antwort</summary>Durch <b>Schiffsname, Rufzeichen und MMSI</b> (Rufnummer des mobilen Seefunkdienstes).</details>

**66.** Wie ist eine **Küstenfunkstelle** gekennzeichnet? *(Buchfrage)*
<details><summary>Antwort</summary>Durch den <b>geografischen Ortsnamen</b> + Art des Dienstes: allgemeine Küstenfunkstelle „… <b>Radio</b>" (z. B. Kiel Radio), Revier-/Verkehrsfunk „… <b>Traffic</b>".</details>

**67.** Welche Funkstelle wird mit dem Rufnamen „Warnemünde Traffic" gerufen? *(Buchfrage)*
<details><summary>Antwort</summary>Die <b>Küstenfunkstelle des Revierfunkdienstes</b> in Warnemünde.</details>

**68.** Was ist der Unterschied zwischen „All ships" und „All stations"?
<details><summary>Antwort</summary><b>All ships</b> = an alle <b>Schiffsfunkstellen</b>. <b>All stations</b> = an <b>alle Funkstellen</b> (auch Land-/Küstenfunkstellen).</details>

**69.** Wann buchstabiert/wiederholt man laut Radio Regulations — im Anruf oder in der Meldung?
<details><summary>Antwort</summary>In der <b>Meldung</b> (nicht im Anruf): Orts-/Eigennamen, Positionen, Zahlen, Uhrzeiten — mit „I spell" / „new word", und unbedingt befolgen.</details>

---

### Mini-Prüfungssimulation SRC (schnell)
> K70 nur DSC · 3 Dringlichkeitsstufen · MMSI 9-stellig · Position nur bei Not · A1-Seegebiet · Funksprache Englisch · K16 = Anruf/Not · BNetzA für MMSI · DSC→K16→MAYDAY · Fehlalarm widerrufen.

---
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
