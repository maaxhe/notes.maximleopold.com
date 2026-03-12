---
title: "Wie ich meine Website (fast) ohne zu coden gebaut habe"
date: 2025-09-14
tags: [KI, Webentwicklung]
description: "Warum ich meine Website nicht mehr selbst „coden“ musste: Mit KI fühlt sich Webentwicklung an wie vom Laufen aufs Fahrrad umzusteigen – schneller, einfacher, effizienter. Mein Experiment zeigt, warum das nicht nur Websites betrifft, sondern die Zukunft vieler Berufe."
modified: 2026-03-12
---

> *Ursprünglich veröffentlicht auf [maximleopold.com](https://maximleopold.com/blog/warum-ich-meine-website-nicht-mehr-coden-musste-und-was-das-ber-die-zukunft-sagt)*

# Wie ich meine Website (fast) ohne zu coden gebaut habe

<em>Foto: Christian Petersen//Getty Images</em>

Vergiss Wordpress - mach es lieber selbst!
Vor fünf Jahren hätte ich niemals gedacht, dass ich jemals meine eigene Website bauen könnte. Zumindest nicht in wenigen Tagen. Programmieren war für mich wie ein Marathon: Wenn du wirklich gut werden willst, musst du jeden Tag trainieren, Zeile für Zeile schreiben – jahrelang.

Aber was, wenn du eigentlich nur ankommen und nicht den ganzen Weg laufen willst?

Genau hier setzen die "relativ" neuen KI-Chatbots an. Sie sind wie ein **Fahrrad**:

Du kannst weiter zu Fuß gehen und alles mühsam selbst coden.
... oder du steigst aufs Rad und bist in einem Bruchteil der Zeit am Ziel.

Für Coder ist oft der Weg das Ziel - es macht Freude zu coden.
Aber ich möchte lieber schnell ans Ziel kommen.

## Warum lieber lokal statt auf lovable/base44?

Theoretisch könntest du dein Projekt auch komplett in lovable oder base44 vibe coden (also einfach nur über Befehle schreiben, was du programmiert haben willst).Das Problem hier ist:
Du hast bei diesen online Vibe-Coding-Tools sehr wenige freie Token zur Nutzung - und wenn du dir ein Pro-Abo holst, ist es auch viel zu überteuert. Deshalb ziehen wir dein ganzes Projekt lokal auf deinen Rechner und dann kannst du dort mit ChatGPT deutlich häufiger und genauere Prompts scheiben.

Alles, was du dafür brauchst:

- ChatGPT Plus Abo ODER ChatGPT API
- IDE (also Code Environment wie z.B. VS Code)
- github Account

---

## **Mein Experiment: Website in drei Tagen**

Ich habe also das Fahrrad genommen. Innerhalb von drei Tagen stand meine Website.

Und der Workflow war einfacher, als ich dachte. Hier zeige ich dir, welche konkreten Schritte ich genommen habe:

1. mit ChatGPΤ einen ausführlichen Prompt (Chat-Befehl an den ChatBot) schreiben, der deine Wünsche sehr gut abbildet
2. diesen Wunsch umsetzen und ein erstes Ergebnis deiner Website generieren lassen
3. Projekt auf Github laden
4. Dieses Ergebnis lokal zum Laufen bringen
5. Eine Umgebung schaffen, in der du mit einem ChatBot ganz genau deine Befehle umsetzen kannst
6. Online stellen via Netlify
7. Verbinden mit deiner eigenen Domain
8. weitere Betreuung deiner Website

### **Mein konkreter Workflow**

Hangeln wir uns durch die einzelnen Punkte, damit du am Ende eine Website exakt nach deinen Vorstellungen kreiert hast.

1. **ChatGPT als Meta-Prompt-Generator**

   - Frag als erstes ChatGPT: „Schreibe mir einen ausführlichen und detaillierten Prompt für Lovable/Base44, um eine Next.js + Tailwind Website nach folgenden Kriterien zu erstellen:
     .... [HIER DEINE KRITERIEN EINSETZEN] ..."
   - Die Kritierien könnten so aussehen:
     - eine Website, die oben einen Menübar hat, mit folgenden Reitern: "Home", "Blog", "Portfolio", "Über mich", "Kontakt"
     - diese Website soll interessierte im Bereich Neurowissenschaften ansprechen, die Seite dient als mein Aushängeschild
     - die Homepage soll abgerundete Kacheln für Informationen und Bilder anzeigen
     - füge Animationen für Links und Überschriften hinzu, bei der der Farbverlauf von Rot ins orange übergeht
   - ....

   Und was du sonst noch gerne haben möchtest.

Denn was jetzt ChatGPT macht: Es schreibt deine Ideen in eine klare, strukturierte Form, die für Coding-KI ideal aufgebreitet ist.

- Diesen Prompt habe ich kopiert (der ist in der Regel sehr lang)

2. **Scaffold in Lovable/Base44 erzeugen**
   - [lovable.dev](https://lovable.dev) oder [base44.com](https://base44.com) besuchen und dich registrieren
   - Prompt dort einfügen und warten ....
   - Diese Zeit kannst du nutzen, um dir einen Account auf [github.com](https://github.com) zu machen. Den brauchst du unbedingt, damit es nachher sehr leicht ist, die Seite online zu stellen und danach zu pflegen.
   - In der Zwischenzeit wurde deine Website bestimmt generiert.

<figure>
  <img src="/covers/website/lovable_screenshot.png" alt="Lovable.dev screenshot" />
  <figcaption>Lovable.dev screenshot</figcaption>
</figure>

3. **Projekt auf GitHub laden**

Ganz oben rechts in der Leiste siehst du ein kleines Github-Symbol. Dort draufklicken - so kannst du dieses Projekt auf dein eigenes Github ziehen.

4. **VS Code und Codex zum Laufen bringen**

Zunächst brauchst du eine IDE. Hier empfehle ich dir VS Code, weil du dort sehr bequem mit ChatGPT arbeiten kannst:
[VS Code Link](https://code.visualstudio.com/download)

In VS Code

<figure>
  <img src="/covers/website/screenshot_extention.jpg" alt="codex extention" />
  <figcaption>Screenshot aus meinem VS Code, wo du dir Codex runterladen kannst</figcaption>
</figure>

Jetzt sieht links das ChatGPT-Logo und kannst dich dort mit deinem ChatGPT-Account einloggen. Du kannst auch die API verwenden, solltest du kein Plus-Abo haben.

Jetzt brauchst du nur noch dein Projekt lokal. Erstelle dir auf deinem Rechner einen Ordner für dein Projekt - wo auch immer du es liegen haben möchtest - und anschließend öffnest du diesen Ordner in VS Code.

Wenn du den leeren Ordner in VS Code hast, öffnest du unten das Terminal. Das geht, indem du unten

<figure>
  <img src="/covers/website/terminal_screenshot.jpg" alt="terminal screenshot" />
  <figcaption>Screenshot aus meinem VS Code, um das Terminal zu öffnen</figcaption>
</figure>

in dieses Terminal gibst du folgenden Befehl ein und fügt noch deinen Github-Username und den Namen deinen Projektes auf Github hinzu.

```
git clone https://github.com/<USER_NAME>/<REPOSITORY_NAME>.git
cd <REPOSITORY NAME>
npm install
npm run dev
```

Wenn du

```
nom run dev
```

ausgeführt hast, sollte ganz unten folgendes sehen:

<figure>
  <img src="/covers/website/localhost_terminal.png" alt="localhost terminal" />
  <figcaption>Screenshot dem Terminal für localhost</figcaption>
</figure>

Jetzt gibst du "http://localhost:8081/" in deinen Browser als normale Adresse ein und solltest deine Website sehen können.

Es ist quasi eine Vorschau, wie sie online aussehen würde - nur alles noch lokal.

5. **Iterieren mit Prompts in VS Code**

Jetzt hast du alles geschafft und kannst anfangen, deine Website nach deinen Wünschen anzupassen.
Dafür öffnest du Codex (also das ChatGPT Logo auf der Seite) und schreibst, was immer du geändert haben möchtest.
Bilder ziehst du am besten in einen extra Ordner in deinem Projekt und sagst Codex, wie das Bild heißt, wo es liegt und wo du es auf deiner Website platziert haben willst.

Viel Spaß beim Bauen!

<figure>
  <img src="/covers/website/codex_screenshot.png" alt="codex screenshot" />
  <figcaption>Screenshot aus meinem VS Code mit Codex von ChatGPT</figcaption>
</figure>

Beispiel Prompts für Codex:

- „Baue Hero-Section mit Claim und zwei CTAs.“
- „Passe Farben an: dunkler Hintergrund, schimmernde Akzente.“
- „Markdown-Blog einfügen: Posts mit Frontmatter (title, date, tags).“

Änderungen sieht man sofort! (Eventuell musst du die Seite im Browser refreshen)

6. **Domain verbinden & deployen**

Wie stellst du diese Website online?

Möchtest du eine eigene Domain haben und ist dir der Link erstmal egal?
Du kannst auch direkt auf Netlify deine Website kostenlos online hochladen.
Alles, was du dafür brauchst, ist ein Netlify Account.
-> [https://www.netlify.com(https://www.netlify.com)]
Registriere dich dort am besten mit deinem Github Account.

Wenn du dir einen Account eingerichtet hast, kannst du auf "Add a new Project" auf dein Github-Projekt (deine Website) verweisen und Netlify macht den Rest.
Es dauert eine Weile und wenn Netlify deine Website hochgeladen hat, siehst du den Link.

Das war's auch schon! Deine Website ist jetzt online! Herzlichen Glückwunsch :D

<figure>
  <img src="/covers/website/netlify_screenshot.png" alt="netlify screenshot" />
  <figcaption>Die Website (Github Repo) auf Netlify hochladen</figcaption>
</figure>

7. **Content pflegen**

Wie machst du weitere Änderungen?

Am einfachsten ist es, wenn du Codex sagst:
pushe das Projekt auf github und deploye es auf Netlify.

Wenn du aber gerne Token sparen möchtest, kannst du auch folgende Befehle in deinem Terminal nutzen:

```
git add .
git commit -m neue hero
git push
```

und anschließend, wenn du ganz sicher bist, dass du dein Projekt genau so online stellen willst:

```
netlify deploy --prod
```

Zack! Das war's

Änderungen wie ein neuer Blogartikel? Einfach ein Markdown-File + Bild hinzufügen, committen, pushen → Netlify deployed.

Du könntest jetzt deine Website noch mit einer eigenen Domain verbinden, die du z.B. auf Strato gekauft hast. Dafür musst du dann in die Einstellungen deiner gekauften Domain gehen und dort auf "DNS" und den entsprechenden Link von Netlify einfügen.
(Dieser Teil ist nicht Hauptfokus dieses Artikels, aber ich bin sicher, wenn du bis hier gekommen bist, ist das Einrichten einer eigenen Domain der leichteste Schritt)

Viel Spaß beim Vibe Coden :D

---

## **Warum das besser ist als WordPress**

Ich bin echt begeistert, wie schnell und einfach es geht, wenn man eine Website selbst codet.

Ich habe vorher mit WordPress gearbeitet, aber:

Schau dir mal meine Alte vs. Neue Seite an:
Und die alte hat mich deutlich mehr Nerven gekostet!

<figure>
  <img src="/covers/website/alte_website_screenshot.png" alt="alte website screenshot" />
  <figcaption>meien alte Website mit Wordpress gehostet</figcaption>
</figure>

vs. meiner neuen:
(und auf dem screenshot sieht man die schönen Animationen nicht, checke es selbst aus [Maxim Leopold](https://www.maximleopold.com))

<figure>
  <img src="/covers/website/website_screenshot.png" alt="neue website screenshot" />
  <figcaption>meien aktuelle Website mit Netlify gehostet und selbst in VS Code programmiert</figcaption>
</figure>

- Jede Kleinigkeit kostet extra (wie z.B. ein mitlaufendes Menü)
- Änderungen sind mühsam, weil oft versteckt
- nervige Menüführung in Wordpress
- ca. 10€/Monat, mit Plugins deutlich mehr

Mit AI + Code sieht das anders aus:

- Drei Prompts ersetzen teure Plugins
- Änderungen sind sofort sichtbar
- Alles modular, flexibel und unter deiner Kontrolle - genau so, wie du es magst.
- ca. 1-2€/Monat nur für die Domain. Außer das ChatGPT Abo, ist es kostenlos.

---

## **Was ich gelernt habe**

- **Geschwindigkeit:** Dinge, die früher Tage dauerten, gehen heute in Minuten.
- **Managen statt coden:** Der Skill liegt nicht mehr im Tippen, sondern im präzisen Prompten.
- **80/20-Regel:** AI erledigt 80 %, die letzten 20 % Feinschliff mache ich selbst (manchmal will man genau die Helligkeit oder genau die Farbe, das mache ich dann lieber selbst).
- **AI ist Partner:** Ich war nicht „User“, sondern Dirigent; und wenn man sich etwas mit Programmieren auskennt (Terminal und VS Code bedienen), dann ist man bereits sehr gut aufgestellt.
- **Preis:** Es ist vor allem auch viel günstiger und gleichzeitig individueller und schneller als Wordpress.

---

## **Die Meta-Ebene: Was das über die Zukunft sagt**

Mein Website-Experiment ist nur ein Vorgeschmack. Und KI-Agenten sind gerade erst im Kommen.
Wir werden es bald erleben, dass jeder Mensch fantastische Tools mit AI bauen kann - in wenigen Stunden.

Programmieren verändert sich. Früher war der Wert eines Entwicklers: jede Zeile Code selbst schreiben. Heute (und morgen noch mehr) geht es darum, **Workflows zu managen und Produkte zu bauen**:

- Anforderungen formulieren
- schnell iterieren
- direkt anpassen
- das Ganze im Blick behalten

**Programmierer werden zu Product-Managern ihrer eigenen Workflows.**

Das Handwerk – Zeile für Zeile Code – übernimmt zunehmend die KI.

Der menschliche Wert liegt im **strategischen Denken und Orchestrieren**.

Und so wird es nicht nur in der Softwareentwicklung laufen. Viele Jobs werden sich so entwickeln: KI automatisiert das Handwerkliche, wir geben die Richtung vor.

---

## **Fazit**

Ich habe meine Website nicht gebaut, <em>obwohl ich kein Developer bin.</em>

Ich habe sie gebaut, <em>weil ich AI als Developer genutzt habe.</em>

Und genau das ist die Zukunft: Wer noch zu Fuß läuft, verliert Zeit.

Die Kunst liegt nicht mehr im Laufen, sondern im Dirigieren und Managen.

Und jeder mit einem Fahrrad überholt diejenigen, die jede Strecke zu Fuß laufen wollen.
