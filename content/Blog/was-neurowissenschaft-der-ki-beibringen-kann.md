---
title: "Was Neurowissenschaft der KI beibringen kann"
date: 2025-10-20
tags: [KI, Neuroscience, Architecture]
description: "Das Gehirn ist eine Wundermaschine. Mit gerade einmal 20 Watt Energie steuert es 86 Milliarden Neuronen, verarbeitet Bilder in Echtzeit und erkennt Muster in Millisekunden."
modified: 2026-03-12
---

> *Ursprünglich veröffentlicht auf [maximleopold.com](https://maximleopold.com/blog/was-neurowissenschaft-der-ki-beibringen-kann)*

# Was Neurowissenschaft der KI beibringen kann

Das Gehirn ist eine Wundermaschine. Mit gerade einmal 20 Watt Energie steuert es 86 Milliarden Neuronen, verarbeitet Bilder in Echtzeit und erkennt Muster in Millisekunden. Zum Vergleich: Moderne Sprachmodelle verschlingen Megawatt, um ein paar Sätze zu schreiben. Das ist nicht nur faszinierend – das ist auch ein massives Engineering-Problem.

Früher dachten viele: Wenn wir das Gehirn verstehen, kopieren wir es einfach, und schon haben wir KI. Aber so einfach funktioniert es leider nicht. Die Wahrheit ist eher umgekehrt:
Wir bauen mit KI vereinfachte Modelle des Gehirns, um zu verstehen, warum das Gehirn so viel besser ist. Dabei finden wir merken wir: Wir verstehen das Gehirn gar nicht so richtig.

Es hat einfach deutlich mehr Parameter als jedes LLM, ist deutlich effizienter und vor allem kann es deutlich schneller Muster erkennen. Aber wie?

Genau das setzt das Feld "Computational Neuroscience" ein: Sie analysieren Neurodaten -> damit neue Modelle vom Gehirn -> es entstehen neue Hypothesen -> bessere KI.

## Vom Mondflug zu Wingtips: Was wir von der Natur lernen

So wie Ingenieure beim Bau von Flugzeugen die Flügel der Vögel studiert haben, müssen wir heute das Gehirn studieren, um bessere KI zu bauen. Die Wingtips an modernen Flugzeugen - die kleinen Biegungen am Flügelende, die Turbulenzen und damit Spritverbrauch reduzieren - sind biologische Inspiration für Ingenieure, um weiter effizientere Flugzeuge zu bauen. Ähnlich dienst das Gehirn als Vorbild für KI, um effizientere und schlauere KI zu bauen. Nicht umsonst stellen OpenAI und Meta führende Neurowissenschaftler ein.

Im Zentrum der Forschung steht der Cortex – der evolutionär junge Teil des Gehirns, zuständig für Denken, Aufmerksamkeit, Planung. Er sieht fast überall gleich aus: sechs Schichten, homogen, nur lokal variierend. Diese Struktur hat uns zum Mond gebracht – und sie könnte das Vorbild für die nächste Generation KI sein.

<figure>
  <img src="/covers/cortical_column.jpeg" alt="Cortical Column" />
  <figcaption>Wie der Cortex aussieht. Die Figure ist nicht mehr ganz up to date, was die Einteilung angeht, jetzt ist Standard in der Neurowissenschaft: 150.000 Cortical Columns, aber das Prinzip bleibt gleich</figcaption>
</figure>

## Das konkrete Problem: Wie filtert das Gehirn Rauschen?

Ein klassisches Beispiel ist das [„Cocktail-Party-Problem"](https://maximleopold.com/blog/auditory-atttention). Mitten auf einer Partyschaffst du es, dich auf eine einzige Stimme zu konzentrieren, während andere Geräusche ausgeblendet werden. Klingt banal, ist aber eines der größten Rätsel der Kognitionsforschung.

Genau daran arbeite ich in meiner Bachelorarbeit: am Auditory Cortex. Dort werden auditive Inputs von Neuronen in höhere (komplexere) Areale geschickt (Bottom-Up), während der Prefrontalcortex Top-Down-Signale zurückschickt – eine Art Aufmerksamkeitsfilter, der markiert: „Das ist wichtig, den Rest kannst du ignorieren."

Der Cortex ist hochgradig rekursiv (recurrent) und untereinander stark verbunden – alles hängt mit fast allem zusammen. Chaotisch? Vielleicht. Aber misst man die Verbindungen, sieht man klare Zusammenhänge: Stärkere Connectivity zwischen Auditory und Prefrontal Cortex korreliert mit besserer Unterscheidung von Zielstimmen. Schwächere Connectivity – und die Ablenkung gewinnt.

Das ist mess- und modellierbar.

<figure>
  <img src="/covers/rolls2023.png" alt="Rolls 2023 auditory cortex" />
  <figcaption>Das sind die Verbindungen im Auditory Cortex: Jede Region scheint nahezu mit jeder anderen in Verbindung zu stehen. Das macht das Verstehen des Gehirns extrem mühsam - aber auch interessant.</figcaption>
</figure>

Wie man an den Verbindungen im Auditory Cortex sieht:
Das Gehirn als Vorbild zu nehmen, ist gar nicht so trivial. Und das faszinierende dabei ist: diese scheinbar wirre Struktur ist unfassbar effizient, schnell und zuverlässig.
Wir brauchen nur wenige Beispiele, um bereits Muster zu erkennen. Eine KI braucht tausende.
Also in diesem Gewirr scheint ein Geheimnis zu stecken, welches wir lüften wollen!

## Was das für KI bedeutet

Interessanterweise haben Transformer-Modelle Teile davon versehentlich nachgebaut. Self-Attention ist kein direkter Cortex-Mechanismus, aber ähnlich: Eingaben werden dynamisch gewichtet, Rückkopplungen betonen Relevantes. Das Problem: Transformers arbeiten ohne Hierarchien, ohne ein Signal von oben, das sagt, was wichtig ist. Es passiert alles auf einer Ebene - auf der Ebene der Token, basierend auf dem Training, welches die KI vorher durchlaufen hat. Zudem skalieren nicht elegant. Mehr Attention-Heads (Ein Head schaut sich einen bestimmten Teil des Satzes an) bedeuten exponentiell mehr Rechenzeit.

Das Gehirn löst das smarter: Es nutzt Sparsity – nur wenige Verbindungen feuern gleichzeitig, der Rest wird stillgelegt, aber verfügbar. Das passiert, weil Neuronen um Aktivität buhlen. Wer am schnellsten den Input richtig vorhergesagt hat, kann zuerst feuern und legt die anderen Neuronen um sich herum lahm.
Aber ein Transformer muss jeden Parameter für jedes Token berechnen - der kennt keine Sparcity.

Es gibt schon einige Modelle, die neuronale Schaltkreise modellieren und mit denen wir hoffen, eines Tages noch bessere KI zu bauen als aktuelle LLMs. Denn Skalierung alleine wird LLMs aus oben genannten Gründen nicht viel schlauer machen.

## Warum wir noch nicht verstehen

Das klingt alles lösbar – aber hier kommt der Haken. Viele denken: „Wir wissen mehr über das Universum als über das Gehirn." Der Grund ist nicht mehr Komplexität, sondern fehlende Modularität. Jedes Neuron hat bis zu 10.000 Verbindungen. Keine klaren Input-Hidden-Output-Layer, sondern rekursive, überlagerte, zeitlich verzweigte Netzwerke.
Also ein Neuron hat viele Verbindungen zu benachbarten, aber eben auch zu weit entfernten Neuronen. Sie sind flexibel in den Verbindungen und in der Hierarchie.

Früher hat man in der Neurowissenschaft am meisten über das Gehirn herausgefunden, indem man Gehirne untersucht hat, bei denen ein Areal ausgefallen ist (wie beim berühmten Patienten H.M., der seinen Hippocampus entfernt bekommen hat) – aber diese Methode stößt hier an Grenzen - Es ist ethisch einfach nicht vertretbar, Affen Gehirnareale rauszuoperieren. Heute brauchen wir KI-Modelle, die ganze Netzwerke simulieren und vorhersagen, wie Systeme sich verhalten. Nur so lassen sich Kausalitäten und Simulationen, die Hypothesen generieren, finden, bevor wir im Labor messen.

## Was jetzt kommt

In den nächsten paar Jahren werden wir erste Cortex-Modelle bei den großen Playern sehen, die Strukturen vom Cortex übernehmen. In unter zehn Jahren sehen wir Modelle, die vorhersagen, wie ein ADHD-Medikament lokale Strukturen im Gehirn verändert – noch bevor wir es im Menschen testen.

Das wird die Neurowissenschaft revolutionieren. Und gleichzeitig wird KI effizienter, weil sie von diesen biologischen Lösungen lernt.

Ob wir das wollen? Die Frage stellt sich nicht – sondern: Wer baut es verantwortungsvoll?

Eines aber bleibt sicher: Das Gehirn ist immer noch die Blaupause für Intelligenz. Und vielleicht der einzige Weg, KI wirklich schlau zu machen.

---

Falls, dir der Artikel gefallen hat, lies gerne hier unten weiter :) bis zum nächsten Mal!
Maxim
