---
title: "Warum Google 2,4 Milliarden für einen Agenten-Loop zahlt"
date: 2025-07-13
tags: [KI, Agentic AI, Architecture]
description: "Wie ein cleverer Software-Loop plötzlich Milliarden wert wird – und warum Google dafür Windsurf-Ingenieure samt exklusiven Lizenzen einkauft."
modified: 2026-03-12
---

> *Ursprünglich veröffentlicht auf [maximleopold.com](https://maximleopold.com/blog/google-zahlt-f-r-agentenloop-md-f-r-website)*

# Warum Google 2,4 Milliarden für einen Agenten-Loop zahlt

## Wie ein cleverer Software-Loop plötzlich Millarden wert ist und warum Google das richtig findet.

Google landet wieder einen großen Coup, wenn es darum geht, KI-Fachleute anzuheuern. Nachdem Meta mit einem Gehaltsversprechen von 200 Millionen US-Dollar über mehrere Jahre den KI-Leader Ruoming Pang bei Apple abgeworben hat, zieht Google nach.

Google holt sich führende Software-Engineers von Windsurf für schlappe **2,4 Milliarden Dollar**, noch dazu **exklusive Lizenzen** für deren Technologie.

Aber was hat es mit diesen AI-Coding-Apps auf sich? Was machen sie so anders als ChatGPT?

---

## ChatGPT vs. Agenten-Apps

ChatGPT kann mittlerweile ziemlich gut coden. Ich werf bei einem Fehler einfach den Error ins Chatfenster, GPT sagt mir, was schiefgelaufen ist, und nach zehn Iterationen klappt’s meistens. Es ist ein bisschen wie Pair Programming mit einem sehr geduldigen Kollegen.

**Copilot** in VS Code ist eleganter integriert, aber auch eher passiv. Er wartet auf meine Eingabe, statt selbst aktiv zu werden.

**„Was also macht diese Apps so wertvoll und worin unterscheiden sie sich von ChatGPT?“**

Apps wie **Lovable**, **Bolt**, **Dust** oder **v0** automatisieren genau diesen Prozess. Statt immer neu nachzufragen, bringen sie einen kompletten Workflow mit, von dem Input bis zur funktionierenden Anwendung. Alles in einem durchgehenden Loop.

---

## Der Workflow

Hier sitzt der Workflow von Lovable und Co. (erstellt mit Obsidian Canvas):

<figure>
  <img src="/covers//agentic_workflow.png" alt="Agentic Workflow" />
  <figcaption>Synaptic communication generates electric fields — the source of observable oscillations in summed signals.</figcaption>
</figure>

Hier mal aufgedröselt, wie dieser Workflow aussieht:

---

### Client

Wie bei ChatGPT das Input Window. Nur dass du hier sowas eingibst wie:

> „Baue mir eine Landing Page mit einem Login-Fenster und einem Buchungstool mit Kalender.“

---

### Agent

Der Agent nimmt diese Request auf und gibt sie weiter ans Backend, genauer: an den Model Client.  
Die Request wird als JSON weitergegeben:

```json
{
  "request": {
    "description": "Eine Landing Page mit einem Login-Fenster und einem Buchungstool mit Kalender"
  }
}
```

⸻

Model Client (z. B. BAML)

Der Prompt wird dort in eine Funktion verpackt. Aus deinem Wunsch wird ein strukturierter Funktionsaufruf:

```json
class AppRequest {
  description string
}

class CodeOutput {
  html string
  css string
  javascript string
}

function GenerateLandingPage(
  request: AppRequest
) -> CodeOutput {
  client OpenAIClient

  prompt #"
  You are a helpful frontend developer assistant.

  Generate the full code for a responsive landing page based on the following description:

  {{ request.description }}

  The page should be written using HTML, CSS, and JavaScript. Include a login window and a booking tool with a calendar if requested.

  Only return the code in structured format.
  "#
}
```

So hat man den Prompt als Funktion gespeichert und kann ihn wiederverwenden.
Das ist gerade bei Sprachmodellen hilfreich, weil sie bei langen Kontexten sonst gern mal vergessen, was sie eigentlich tun sollten.

⸻

AI Model (z. B. GPT-4o mini)

Das Modell produziert daraufhin Code und schickt ihn zurück an den Model Client.
Der Model Client schickt den erhaltenen Code weiter an den Agent:

„Ich habe Code erhalten.“

⸻

MCP + Sandbox

Der Agent schickt den Code weiter an den MCP Server und sagt sinngemäß:

„Bitte prüfe den Code, ob er funktioniert und starte diese App in der Sandbox.“

Das passiert z. B. per Funktion wie:

create_app_environment(code_files)

Die App wird dann in einer isolierten Umgebung (der Sandbox) ausgeführt. So bleibt der Computer sicher.

⸻

iFrame

Der Output wird im Browser als Vorschau angezeigt. Der User sieht sofort, was generiert wurde.

Und dann? Wartet der Agent einfach auf deine nächste Eingabe. Zum Beispiel:

„Mach den Hintergrund dunkel.“

Diese neue Anweisung wird wieder in eine Funktion gepackt:

```json
function EditCode(
history: Message[],
feedback: string,
code_files: File[]
) -> CodeChanges
```

Das Modell bekommt jetzt den bisherigen Code + dein Feedback und liefert eine verbesserte Version zurück.
Der gesamte Prozess beginnt von vorn, nur eben nicht mehr bei Null.

⸻

Eigentlich wie ein Mensch

Eigentlich wie mein typischer Chatverlauf mit GPT, nur automatisiert und in einer sauberen Pipeline.

Das ist wirklich durchdachte Software-Architektur und genau das macht die Firmen um Lovable so wertvoll, dass Google & Co. nicht widerstehen können.

Wir brauchen also gar nicht unbedingt bessere Modelle.
Was wir brauchen, sind bessere Systeme drumherum: saubere Prompts, gutes Kontextmanagement, Sandbox-Umgebungen und eine stabile Darstellung.

Und genau das macht Tools wie Lovable, Bolt und v0 im Moment so spannend – gerade für Leute, die selbst wenig oder gar nicht coden.

⸻

Bis zum nächsten Mal
Maxim 🧠🌀

⸻

### Quellen

- [beam.com - agentic apps](https://www.beam.cloud/blog/agentic-apps?utm_source=tldrai)
- [handelsblatt.com - google wirbt ki experten ab](https://www.handelsblatt.com/technik/it-internet/alphabet-google-wirbt-ki-experten-ab-fuer-24-milliarden-dollar/100141221.html)
