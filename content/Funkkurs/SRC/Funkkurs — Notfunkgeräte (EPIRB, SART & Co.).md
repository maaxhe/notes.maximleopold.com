---
date_created: 04/06/26
tags: [funkkurs]
type: note
---

## Funkkurs - Notfunkgeräte: EPIRB, SART & Co.

Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Hier geht es um die zusätzlichen Seenot-Geräte neben dem UKW-Funk - was alarmiert und was beim Orten hilft.

Die Grundidee in einem Satz: Die **EPIRB** alarmiert und löst die Rettungskette aus, **SART** und **AIS-SART** orten und helfen den Rettern, dich im Nahbereich genau zu finden. Beides ergänzt den UKW- und DSC-Funk.

---

### EPIRB - Emergency Position-Indicating Radio Beacon
![[funkkurs-epirb.jpg|260]] ![[funkkurs-epirb2.jpg|260]]
<sub>Zwei EPIRB-Bauformen (Seenotfunkbaken). Bilder: Wikimedia Commons.</sub>

Die EPIRB ist eine Seenot-Funkbake, die auf **406 MHz** über die **Cospas-Sarsat**-Satelliten alarmiert - weltweit, auch fernab jeder Küstenfunkstelle. Sie sendet ihre Kennung (ID) und Position (mit eingebautem GPS/GNSS sehr genau) und löst damit die internationale Rettungskette aus. Beim Sinken kann sie sich per Wasserdruck selbst auslösen und schwimmt automatisch auf (Float-free-Halterung). Das Gerät ist schiffsgebunden und muss **registriert** sein (Halter/Schiff hinterlegt) - sonst weiß niemand, zu wem der Alarm gehört. Moderne Geräte haben zusätzlich ein AIS-Homing-Signal für die Feinortung.

Für küstenfernes Fahren ist die EPIRB das primäre Alarmgerät - unabhängig von UKW-Reichweite und Bordstrom, denn sie hat eine eigene Batterie.

#### Wie die EPIRB alarmiert - und das 121,5-MHz-Homing
Die EPIRB sendet auf zwei Frequenzen mit zwei verschiedenen Aufgaben.

406 MHz ist der digitale Alarm über Satellit:
1. Die EPIRB wird aktiviert und sendet alle ~50 s einen digitalen Burst mit eindeutiger Kennung und (mit GPS) der Position.
2. Die Cospas-Sarsat-Satelliten empfangen den Burst - LEOSAR (niedrige Umlaufbahn), GEOSAR (geostationär) und modern MEOSAR (auf GPS-/Galileo-Satelliten).
3. Die Satelliten leiten das Signal an Bodenstationen (LUT) weiter; ohne GPS-Position wird sie über den Doppler-Effekt der bewegten Satelliten berechnet.
4. Ein MCC (Mission Control Centre) ordnet die Kennung zu und gibt die Meldung an das zuständige MRCC (z. B. Bremen Rescue) - die Rettung läuft an.

121,5 MHz ist das **Homing-Signal** für die Feinortung vor Ort. Die EPIRB sendet dazu zusätzlich ein schwaches, durchgehendes Peilsignal. Die anrückenden SAR-Einheiten (Flugzeug, Hubschrauber, Schiff) peilen es mit einem Funkpeiler an und finden so im Nahbereich den genauen Standort - den „letzten Kilometer" zum Havaristen. Wichtig dabei: 121,5 MHz wird seit 2009 nicht mehr von Satelliten überwacht (Cospas-Sarsat hat das eingestellt) und dient nur noch dem lokalen Homing, nicht der Alarmierung. Die eigentliche Alarmierung läuft ausschließlich über 406 MHz. Moderne EPIRBs ergänzen das Homing per AIS (UKW), damit Schiffe in der Nähe die Bake als Ziel auf dem Plotter sehen.

```mermaid
flowchart LR
 E[EPIRB aktiviert] -->|406 MHz Burst<br/>ID + Position| SAT[Cospas-Sarsat<br/>LEO / GEO / MEO]
 SAT --> LUT[Bodenstation LUT] --> MCC[MCC] --> MRCC[MRCC<br/>Bremen Rescue]
 MRCC -->|schickt SAR-Einheiten| U[Flugzeug / Schiff]
 E -.->|121,5 MHz Peilsignal<br/>Nahbereich| U
 style E fill:#ff6b6b,color:#fff
 style SAT fill:#4dabf7,color:#fff
 style MRCC fill:#69db7c,color:#000
```

> [!important] 406 vs. 121,5 MHz
> 406 MHz alarmiert weltweit über Satellit, 121,5 MHz peilt nur noch vor Ort an, ganz ohne Satellit.

#### Wie löst die EPIRB aus?
Es gibt drei Auslösewege:
1. Manuell - über einen Schalter oder eine Taste am Gerät (mit Sicherungskappe gegen versehentliches Drücken).
2. Automatisch durch Wasserkontakt - ein Wassersensor aktiviert die Bake, sobald sie im Wasser schwimmt.
3. Float-free (selbstausschwimmend) - die Halterung hat eine hydrostatische Auslösevorrichtung (HRU), die die EPIRB beim Sinken des Schiffs (Wasserdruck ~4 m Tiefe) freigibt. Sie schwimmt auf, der Wassersensor schaltet sie ein.

Bei den Bauarten unterscheidet man zwei Kategorien: Kategorie 1 ist float-free (automatisch ausschwimmend plus Wasserkontakt), Kategorie 2 nur manuell auslösbar. Für ernsthaftes Seerevier ist die selbstausschwimmende Variante sinnvoll, weil sie auch dann funktioniert, wenn die Crew es nicht mehr selbst schafft.

Versehentlich ausgelöst - was tun?

> [!danger] Fehlalarm immer widerrufen
> Nicht einfach wegstecken und hoffen! Die Alarmierung kann längst beim MRCC sein.
> 1. Sofort ausschalten (deaktivieren).
> 2. MRCC / Seenotleitung verständigen - in DE Bremen Rescue (Telefon +49-421-53687-0 oder per UKW), dass es ein Fehlalarm war und keine Seenot vorliegt.
> 3. Beaken-Kennung (Hex-ID) und Schiffsnamen angeben, damit der SAR-Einsatz abgebrochen wird.

Ein nicht widerrufener Fehlalarm bindet echte Rettungsressourcen - deshalb immer melden (genau wie beim [[Funkkurs — DSC (Digital Selective Calling)|DSC-Fehlalarm]]).

Zur Bedienung im manuellen Fall: Antenne aufrichten, Sicherung bzw. Kappe entfernen, auf ON schalten und die EPIRB senkrecht ins Wasser legen oder hochhalten, mit freier Sicht zum Himmel - nicht unter Deck oder in der Hand „verstecken". Eingeschaltet lassen, bis die Rettung da ist.

### PLB - Personal Locator Beacon
Die **PLB** ist die persönliche, kleine Variante der EPIRB (am Körper oder an der Rettungsweste), ebenfalls auf 406 MHz über Cospas-Sarsat. Sie ist personengebunden, während die EPIRB schiffsgebunden ist - eine PLB ergänzt die EPIRB also, ersetzt sie aber nicht.

Zur Bedienung: aus der Tasche oder Halterung nehmen, Antenne ausklappen, Knopf drücken und halten. Senkrecht halten, Antenne frei zum Himmel. Die PLB löst nur manuell aus (kein Float-free) und sendet kürzer als eine EPIRB.

### SART - Search and Rescue Radar Transponder
![[funkkurs-sart.jpg|300]]
<sub>SART „Tron" - 9-GHz-Radartransponder mit TEST/OFF/ON-Schalter, zum Hochhalten/Aufstellen in der Rettungsinsel. Bild: Wikimedia Commons, CC BY-SA.</sub>

Der **SART** dient der Nahbereich-Ortung, wenn die Retter schon im Gebiet sind. Er reagiert auf das **9-GHz-X-Band-Radar** der suchenden Schiffe und erzeugt auf deren Radarschirm eine typische Kette von 12 Punkten, die zum Standort weist.

Zur Bedienung: aus der Wandhalterung nehmen und mit in die Rettungsinsel nehmen. Auf den schwarzen Teleskopstab stecken und so hoch wie möglich aufstellen oder halten (durch eine Öffnung im Inseldach), denn die Höhe bestimmt die Reichweite - ein SART auf 1 m wird viel früher vom Radar erfasst. Schalter auf ON (Standby); sobald ein Schiffsradar es trifft, schaltet es automatisch auf Senden, und eine Indikatorlampe oder ein Ton signalisiert den Radarkontakt („Hilfe ist in Radar-Reichweite"). Die TEST-Stellung nur kurz zur Funktionsprüfung nutzen.

### AIS-SART
Der **AIS-SART** ist eine Weiterentwicklung: Er bestimmt per eingebautem GPS die Position und sendet sie im AIS-Format über UKW. So erscheint er als Notziel auf dem AIS/Plotter der Schiffe in der Nähe - oft praktischer als der Radar-SART.

Zur Bedienung: einschalten (ON), dann sendet er automatisch die GPS-Position als AIS-Ziel. Ebenfalls so hoch wie möglich anbringen, freie Sicht nach oben.

### MOB-Sender (Mensch über Bord)
Persönliche AIS-MOB- bzw. DSC-MOB-Geräte an der Rettungsweste lösen bei „Mensch über Bord" einen AIS-Alarm und/oder DSC-Alarm aus und senden die GPS-Position ans eigene Schiff.

Zur Bedienung: an der Rettungsweste befestigen; das Gerät aktiviert sich automatisch beim Aufblasen oder bei Wasserkontakt (oder manuell). Die Antenne klappt aus, und es geht sofort ein MOB-Alarm samt Position ans Schiff bzw. AIS. Regelmäßig den Batterie-Ablauf prüfen.

---

### Überblick: Wer macht was?
| Gerät | Frequenz/System | Aufgabe | gebunden an |
| --------------- | ----------------------- | ------------------------- | ------------- |
| EPIRB | 406 MHz · Cospas-Sarsat | alarmieren (weltweit) | Schiff |
| PLB | 406 MHz · Cospas-Sarsat | alarmieren (klein) | Person |
| SART | 9 GHz Radar | orten (Radarbild) | Rettungsinsel |
| AIS-SART | UKW / AIS | orten (AIS-Ziel) | Rettungsinsel |
| AIS/DSC-MOB | UKW / AIS / DSC | MOB-Alarm + Position | Person |

```mermaid
flowchart LR
 E[EPIRB / PLB<br/>406 MHz] -->|Satellit| SAT[Cospas-Sarsat] --> MRCC[MRCC / Bremen Rescue]
 MRCC -->|schickt Retter| R[Suchende Schiffe]
 S[SART / AIS-SART] -->|Radar / AIS<br/>Nahbereich| R
 style E fill:#ff6b6b,color:#fff
 style S fill:#4dabf7,color:#fff
 style MRCC fill:#69db7c,color:#000
```

### Wartung, Batterie & Lebensdauer
| Gerät | Batterie (Lager) | Sendedauer (aktiv) | typische Wartung |
|---|---|---|---|
| EPIRB | ~10 Jahre wartungsfrei | ≥ 48 h | Batteriewechsel ~alle 5-10 J. (Hersteller); HRU alle 2 Jahre tauschen |
| PLB | ~5-7 Jahre | ≥ 24 h | Batteriewechsel zum Ablaufdatum |
| SART / AIS-SART | ~5 Jahre | Standby ~96 h + Senden ~8 h | Batteriewechsel, Funktionstest |
| AIS/DSC-MOB | ~5-7 Jahre | ~24 h | Batterie-/Ablaufcheck |

Regelmäßig gemacht gehört bei der Wartung Folgendes: ein Selbsttest per Test-Funktion (etwa monatlich oder vor dem Törn - verbraucht kaum Batterie), der Blick auf das Batterie-Ablaufdatum (Wechsel nur durch zertifizierten Service wegen der Versiegelung) und das Erneuern der HRU (hydrostatische Auslösung der EPIRB) alle 2 Jahre, da sie ein eigenes Verfallsdatum hat. Außerdem sollte die Registrierung (Eigner, Kontakt, Schiff) aktuell bleiben, sonst ist der Alarm anonym.

Als grobe Preisrichtwerte für den Sportbootmarkt 2026: eine EPIRB kostet etwa 500-1000 € (kompakte Sportboot-Modelle), Voll-Profi-Geräte bis ~1200 €; eine PLB ca. 300-500 €; SART (Radar) bzw. AIS-SART ca. 500-800 €; AIS-MOB-Sender ca. 300-550 €. Die Preise schwanken je nach Hersteller und Händler - vor dem Kurs ggf. kurz aktuell prüfen.

Zur Einordnung für den SRC-Kurs: EPIRB und SART sind GMDSS-Ausrüstung und gehören eher ins LRC-Umfeld (küstenfern). Für den SRC reicht es zu wissen, was sie tun - die EPIRB alarmiert via Satellit, SART und AIS-SART helfen beim Orten. Im Küstenbereich (A1) bleibt DSC plus UKW das Hauptwerkzeug.

---
<sub>Bilder: Wikimedia Commons (EPIRB; SART „SART radar transponder", Jotron), CC BY-SA.</sub>

## Quellen (recherchiert 06/2026)
- Jotron - *EPIRB and SART differences* - https://www.jotron.com/news-insights/epirb-and-sart-differences
- src-lrc-ubi.de - *LRC: EPIRB, SART & AIS-SART* - https://src-lrc-ubi.de/glossar-lrc-epirb-sart-ais-sart/
- Wikipedia - *EPIRB* / *Search and rescue transponder* - https://en.wikipedia.org/wiki/Emergency_position-indicating_radio_beacon
- Compass24 / SVB / Ocean Signal / ACR - Ratgeber Notfunkbaken (Batterie, HRU, Preise) - https://www.compass24.de/ratgeber/epirb
- on-yacht.com - *Batteriewechsel & Wartung (zertifizierter Service)* - https://on-yacht.com/batteriewechsel-wartung

---
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
