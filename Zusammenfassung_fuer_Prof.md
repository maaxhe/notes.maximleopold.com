# Bachelorarbeit: Supramodal Top-Down Control of Auditory Processing Streams

**Maximilian Leopold**
**Stand: Februar 2026**

---

## Thema und zentrale Hypothese

Diese Bachelorarbeit untersucht, ob die präfrontalen Regionen FEF (Frontal Eye Field) und IFJa (Inferior Frontal Junction anterior) als supramodale Aufmerksamkeits-Hubs auch für auditorische Verarbeitungsströme fungieren -- analog zu ihrer etablierten Rolle im visuellen System.

**Zentrale Hypothese:**
- **FEF** kontrolliert bevorzugt den **auditorischen dorsalen (Where-)Stream** (räumliche Verarbeitung, sensomotorische Integration)
- **IFJa** kontrolliert bevorzugt den **auditorischen ventralen (What-)Stream** (Objektidentifikation, semantische Verarbeitung, Sprachverständnis)

Diese Hypothese baut auf der Arbeit von Bedini & Baldauf (2021) auf, die eine supramodale Organisation der präfrontalen Aufmerksamkeitskontrolle für das visuelle System nachgewiesen haben.

---

## Gesamtübersicht aller Arbeitsmaterialien

Alle Notizen, Quellen, Analysen und Kapitelentwürfe sind hier einsehbar:

**Gesamtübersicht Auditory Streams:**
https://notes.maximleopold.com/Bachelorarbeit/Auditory-Streams-Overview

**Komplette Gliederung der Arbeit:**
https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/0.0-Outline-Bachelorarbeit

---

## 1. Introduction

Die Einleitung führt von der klassischen Wernicke-Perspektive zur modernen Dual-Stream-Architektur und identifiziert die Forschungslücke: Gilt die supramodale Organisation von FEF/IFJ auch für das auditorische System?

**Inhalt:**
- 1.1 Von Wernicke zum Dual-Stream-Modell: Historische Entwicklung der auditorischen Sprachverarbeitung, Übergang vom monolithischen Wernicke-Modell zu zwei separaten Verarbeitungspfaden
- 1.2 Die Forschungslücke: Top-Down-Kontrolle der auditorischen Streams ist ungeklärt -- wer steuert die Pfade?
- 1.3 Hypothese: Supramodale Organisation -- FEF kontrolliert den dorsalen, IFJ den ventralen Stream

**Links:**
- Introduction: https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/1.0-Introduction
- From Wernicke's to Dual Stream: https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/1.1.-From-Wernickes-to-Dual-Stream

---

## 2. Theoretical Background

Der theoretische Hintergrund erläutert die Dual-Stream-Architektur, die auditorischen What- und Where-Streams im Detail sowie die Rolle von FEF und IFJ als Top-Down-Kontrollregionen.

**Inhalt:**
- 2.1 Dual-Stream-Architektur sensorischer Verarbeitung (evolutionäre Ursprünge, visuelle Analogie)
- 2.2 Das auditorische Dual-Stream-Modell (nach Hickok & Poeppel 2007; Rauschecker & Scott 2009)
- 2.3 Auditorischer What-Stream (ventral): Definition, Funktion, Lateralisierung, Anatomie
- 2.4 Auditorischer Where-Stream (dorsal): Definition, Funktion, Lateralisierung, Anatomie
- 2.5 Top-Down-Kontrolle: FEF und IFJ, Abgrenzung von IFJp und BA44/45/47l, Supramodale Hypothese
- 2.6 Anatomische Klassifikationsherausforderungen: A4, A5, TPOJ1, STSdp; Begründung für Glasser-Atlas

**Links:**
- Theoretical Background: https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/2.0-Theoretical-Background
- Auditory What-Stream: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/Auditory-What-Stream-(Ventral)
- Auditory Where-Stream: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/Auditory-Where-Stream-(Dorsal)
- FEF vs IFJ: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/FEF-vs-IFJ
- Lateralisierung: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/Lateralization-in-Auditory-Stream
- DAN: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/DAN
- VAN: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/VAN
- FPN: https://notes.maximleopold.com/Bachelorarbeit/1.-Streams-and-related/FPN

---

## 3. Methods

Die Methodik beschreibt die Datengrundlage, die Parcellierung und Auswahl der ROIs sowie die Analyse-Pipeline.

**Inhalt:**
- 3.1 Daten: HCP (Human Connectome Project) resting-state fMRI, 371 Probanden
- 3.2 Parcellierung und ROI-Auswahl:
  - Seed-Regionen: FEF und IFJa
  - Target ROIs im auditorischen Kortex (basierend auf Rolls et al. 2023 und Glasser et al. 2016)
  - What-Stream ROIs: STGa, TA2, STSda, STSdp, TGd, TGv, TPOJ1, BA45, BA47l, PGi
  - Where-Stream ROIs: A4, A5, STV, 7AL, 7Am, 7PC, MT, MST, PBelt, BA44
  - Core/Belt (Baseline): A1, LBelt, MBelt, PBelt
- 3.3 Analyse-Pipeline: Funktionale und partielle Konnektivitätsanalysen, FDR-Korrektur

**Links:**
- Methods: https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/3.0-Methods
- Selection of ROIs (detailliert): https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/3.2-Selection-of-ROIs
- Alle Glasser-Areale (Referenz): https://notes.maximleopold.com/Bachelorarbeit/2.-Glasser-areas

---

## 4. Results

Die Ergebnisse zeigen die Konnektivitätsmuster von FEF und IFJa zu den auditorischen Regionen und adressieren ambige Areale.

**Inhalt:**
- 4.1 Globale Konnektivitätsmuster: Validierung der Seed-Regionen
- 4.2 Testing the Where-Stream (FEF-Konnektivität):
  - FEF zeigt bevorzugte Konnektivität zu Bewegungsarealen MT/MST und A4
  - FEF-Verbindungen zu motorischen Sprachregionen
- 4.3 Testing the What-Stream (IFJa-Konnektivität):
  - IFJa zeigt starke Verbindung zum semantischen System
  - Vergleich IFJa vs. IFJp und BA44/45/47l
- 4.4 Auflösung von Ambiguitäten:
  - A5: Zeigt Konnektivität zu BEIDEN Streams (BA44/IFJa ventral UND MT/MST dorsal) -- Übergangsregion
  - PSL: Trotz semantischer Klassifikation unresponsiv auf auditive Stimuli (Dureux 2024)
  - STSdp: Stream-Zuordnung noch unklar
  - A4 vs. STV: A4 zeigt schwächere visuelle Konnektivität (PCV) und schwächere 55b-Konnektivität

**Ergebnisfiguren:**
- Zirkuläre Konnektivitätsdiagramme FEF vs. IFJa (rechte und linke Hemisphäre)
- A5 partielle Konnektivität (Links-Rechts-Vergleich)
- A4 vs. A5 volle Konnektivität
- FEF vs. 55b volle Konnektivität
- PSL vs. STV volle Konnektivität

**Links:**
- Results: https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/4.0-Results
- Alle Figures: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/0-figures-for-Bachelorarbeit

---

## 5. Discussion

Die Diskussion ordnet die Ergebnisse in den Forschungskontext ein und bestätigt die supramodale Hypothese.

**Inhalt:**
- 5.1 Bestätigung der supramodalen Organisation: FEF/IFJ-Konnektivitätsmuster entsprechen der Vorhersage aus Bedini & Baldauf (2021) -- das Gehirn nutzt "General-Purpose"-Aufmerksamkeits-Hubs im PFC
  - Top-Down-Kontrollarchitektur: FEF-Verbindung zu auditorischer Bewegung und Sprechmotorik
- 5.2 Neubewertung des auditorischen Where-Streams:
  - Spatial Link: FEF-Konnektivität zu A4, MT, MST (Rauschecker & Scott 2009)
  - Motor Link: FEF kontrolliert motorische Aktionen, Verbindungen zu BA44 (Hickok & Poeppel 2004)
- 5.3 Neubewertung des auditorischen What-Streams:
  - IFJ-Semantik und Verbindungen zum semantischen System (Rolls et al. 2023)
  - Abgrenzung IFJ vs. BA44/45/47l als Multiple-Demand-System
- 5.4 Anatomische Ambiguitäten: A5, PSL, STSdp
- 5.5 Predictive Modelling: Vergleich mit Glasser-Offline-Tasks (LANGUAGE-STORY) und De Vries & Baldauf (2021)
- 5.6 Hemisphärische Lateralisierung:
  - Linke Hemisphäre: Bestätigung von Hickok & Poeppel (2007)
  - Rechte Hemisphäre: Bestätigung von Frühholz (2015) und Griffiths et al. (1998)
- 5.7 Limitationen und Ausblick:
  - Resting-state fMRI ist indirekt
  - Glasser-Atlas gut, aber manche Areale (A4, A5) könnten weiter unterteilt werden
  - Effective Connectivity für Nachweis der Top-Down-Richtung
  - MEG für Frequenzanalysen (De Vries et al. 2021)

**Links:**
- Discussion: https://notes.maximleopold.com/Bachelorarbeit/4.-Schreiben/5.0-Discussion

---

## Quellen und Literaturnotizen

Alle verwendeten Quellen mit meinen Annotationen und Exzerpten:

**Gesamtübersicht aller Quellen:**
https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/BA-All-Sources

**Wichtigste Quellen (mit Notizen):**
- Bedini & Baldauf (2021) -- FEF vs IFJ, Supramodale Hypothese: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Bedini-&-Baldauf-(2021)
- Glasser et al. (2016) -- HCP-MMP1 Parcellation Atlas: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Glasser-et-al.-(2016)---Nature
- Rolls et al. (2023) -- Auditory Cortical Connectivity: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Rolls-et-al.-(2023)---Cerebral-Cortex
- Hickok & Poeppel (2007) -- Dual Stream Model: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Hickok-&-Poeppel-2007---Nature
- Hickok & Poeppel (2004) -- Dorsal/Ventral Streams: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Hickok-&-Poeppel-(2004)---Cognition
- Rauschecker & Scott (2009): https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Rauschecker-&-Scott-(2009)---Nature-Neuroscience
- Friederici (2011) -- Language Processing Pathways: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Friederici-(2011)---Physiological-Reviews
- De Vries & Baldauf (2021): https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/De-Vries-&-Baldauf-(2021)---Journal-of-Neuroscience
- Frühholz (2015) -- Affective Prosody: https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Frühholz-(2015)---NeuroImage
- Ahveninen et al. (2006): https://notes.maximleopold.com/Bachelorarbeit/5.-Sources/Ahveninen-et-al.-(2006)---PNAS

---

## Glasser-Areale (Nachschlagewerk)

Detaillierte Notizen zu allen verwendeten Glasser-Arealen mit Connectivity-Informationen:
https://notes.maximleopold.com/Bachelorarbeit/2.-Glasser-areas

**Klassische anatomische Regionen (Referenz):**
https://notes.maximleopold.com/Bachelorarbeit/3.-Other-areas

---

## Meeting Notes

Protokolle unserer Besprechungen:
https://notes.maximleopold.com/Bachelorarbeit/7.-Meeting-Notes

---

## Zusammenfassung des aktuellen Stands

| Kapitel | Status | Fortschritt |
|---------|--------|-------------|
| Abstract | Entwurf | 0% |
| 1.0 Introduction | Entwurf | ~15% |
| 1.1 From Wernicke's to Dual Stream | Entwurf | 30% |
| 2.0 Theoretical Background | Outline fertig | 0% |
| 3.0 Methods | Outline fertig | 0% |
| 3.2 Selection of ROIs | Entwurf | 10% |
| 4.0 Results | Entwurf, Figures vorhanden | 10% |
| 5.0 Discussion | Outline fertig | 0% |
| Quellen & Notizen | Umfassend | ~80% |
| Glasser-Areale | Umfassend | ~90% |

**Forschungsnotizen und Quellenarbeit sind weitgehend abgeschlossen. Die Hauptarbeit liegt nun im Verschriftlichen der einzelnen Kapitel.**
