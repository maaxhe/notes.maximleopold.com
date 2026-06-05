---
ai_generated: true
model: claude-opus-4-8
date_created: 04/06/26
tags: [ai-generated, marine]
type: note
---

## Funkkurs — Grafik-Generator (Python)

Modul des [[Funkzeugnis-Kurs SRC und UBI|Funkzeugnis-Kurs SRC & UBI]]. Erzeugt die **matplotlib-Plots** für den Kurs (Reichweite, Stromaufnahme, Batterie-Laufzeit, Verkehrsarten-Priorität).

> [!info] So benutzt du es
> Skript mit **lokalem `python3 funkkurs_figs.py`** ausführen (braucht `matplotlib` + `numpy`). Die PNGs landen direkt im Vault-Root und werden in den Modulen per `![[…]]` eingebettet. Werte im Skript anpassen → neu ausführen → Grafiken aktualisieren sich.

> [!warning] Nicht im Browser-Python (Pyodide) ausführen!
> In einer **Pyodide/WASM**-Umgebung (Browser, manche Notebook-Plugins) schlägt `matplotlib.use("Agg")` fehl (`AttributeError: 'NoneType' … parentNode`). Das Skript ist für **normales Desktop-Python3** gedacht. Im Browser stattdessen das `use("Agg")` weglassen und `fig.savefig` durch Anzeige ersetzen — oder einfach lokal im Terminal laufen lassen.

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

VAULT = "/Users/maxmacbookpro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain online"
plt.rcParams.update({"font.size": 12, "figure.facecolor": "white", "savefig.facecolor": "white"})

# 1) Reichweite vs. Antennenhöhe (Funkhorizont):  km = 3.84*(sqrt(h1)+sqrt(h2))
h1 = np.linspace(1, 25, 200)
fig, ax = plt.subplots(figsize=(8,5))
for h2, lbl, c in [(2,"Beiboot/Handfunke (2 m)","#ffa94d"),
                   (16,"Yacht-Masttop (16 m)","#4dabf7"),
                   (100,"Küstenfunkstelle (100 m)","#69db7c")]:
    ax.plot(h1, 3.84*(np.sqrt(h1)+np.sqrt(h2))/1.852, label=f"Gegenstation: {lbl}", color=c, lw=2.5)
ax.set_xlabel("Eigene Antennenhöhe  h1  [m]"); ax.set_ylabel("Reichweite  [sm]")
ax.set_title("UKW-Reichweite — Höhe schlägt Watt"); ax.grid(True, alpha=.3); ax.legend()
fig.tight_layout(); fig.savefig(f"{VAULT}/funkkurs-reichweite.png", dpi=130)

# 2) Stromaufnahme Festgerät
fig, ax = plt.subplots(figsize=(7,4.5))
amps = [0.5, 1.0, 5.0]
ax.bar(["Standby/Empfang","Senden 1 W","Senden 25 W"], amps,
       color=["#69db7c","#ffd43b","#ff6b6b"], edgecolor="black")
ax.set_ylabel("Stromaufnahme  [A @ 12 V]"); ax.set_title("Senden ist der Stromfresser")
fig.tight_layout(); fig.savefig(f"{VAULT}/funkkurs-stromaufnahme.png", dpi=130)

# 3) Batterie-Betriebszeit = nutzbare Kapazität / Strom
I = np.linspace(0.3, 6, 200)
fig, ax = plt.subplots(figsize=(8,5))
for cap, c in [(70,"#ffa94d"),(100,"#4dabf7")]:
    ax.plot(I, (cap*0.5)/I, color=c, lw=2.5, label=f"{cap} Ah (50% nutzbar)")
ax.set_xlabel("Mittlere Stromaufnahme  [A]"); ax.set_ylabel("Betriebszeit  [h]")
ax.set_ylim(0,120); ax.grid(True, alpha=.3); ax.legend()
ax.set_title("Betriebszeit = nutzbare Kapazität / Strom")
fig.tight_layout(); fig.savefig(f"{VAULT}/funkkurs-batterie-laufzeit.png", dpi=130)

print("Grafiken erstellt.")
```

> [!tip] Erweitern
> Weitere Ideen: Kanalbelegungs-Übersicht als Grafik, Tortendiagramm „Sende- vs. Empfangszeit", oder eine Karte der Küstenfunkstellen. Einfach neue `fig`-Blöcke nach dem Muster ergänzen.

---
Tags: #marine
*Superlink:* [[Funkzeugnis-Kurs SRC und UBI]]
Created: 04/06/26
