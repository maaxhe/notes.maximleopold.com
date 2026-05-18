---
modified: 2026-05-18
---

# DATA for Bachelorarbeit 

[[ROIs sets for BrainRest]]



### Data FEF vs IFJa part correlation
^f184fc
^7d880b
[[Data FEF vs IFJa part correlation]]
[[Data FEF vs IFJa full correlation]]

### Data 44 vs 45

[[Data 44 vs 45 part corr]]
[[Data 44 vs 45 full corr]]
[[Data 44 single seed part corr]]
[[Data 45 single seed part corr]]

### Data FEF vs 55b part corr

[[Data FEF vs 55b part correlation]]

### Data FEF (single seed)

[[Data FEF (single seed) part correlation]]
[[Data FEF (single seed) full correlation]]

### Data IFJa (single seed)

[[Data IFJa (single seed) full correlation]]
[[Data IFJa (single seed) part correlation]]

### Data IFJa vs IFJp part corr

[[Data IFJa vs IFJp part correlation]]

### Data FEF vs IFJp part corr 

[[Data FEF vs IFJp part correlation]]

### Data 55b part corr

[[Data 55b part corr]]

### Data 55b vs IFJa part corr

[[Data 55b vs IFJa part correlation]]



# Code zum Anpassen der Brain Grafiken

% 1. UI-Elemente und Panels löschen (Colorbar-Schutz)
allUI = [findall(gcf, 'Type', 'uicontrol'); findall(gcf, 'Type', 'uipanel')];
if ~isempty(allUI), delete(allUI); end

% 2. Deine bewährte Rand-Berechnung mit vertikalem Sicherheits-Offset
ax = gca;
outerpos = ax.OuterPosition;
ti = ax.TightInset; 

% Wir fügen 0.05 (5%) Puffer hinzu, damit oben/unten nichts abgeschnitten wird
padding = 0.05;

left = outerpos(1) + ti(1);
bottom = outerpos(2) + ti(2) + padding; % Puffer unten
ax_width = outerpos(3) - ti(1) - ti(3);
ax_height = outerpos(4) - ti(2) - ti(4) - (2 * padding); % Puffer oben/unten abziehen

% Position setzen
ax.Position = [left bottom ax_width ax_height];

% 3. Farbskala sicherstellen
if isempty(findobj(gcf, 'Type', 'ColorBar')), colorbar; end

% 4. Export als SVG (Vektor-Modus erzwingen)
set(gcf, 'Renderer', 'Painters');
saveas(gcf, 'BrainPlot_Final.svg');

disp('Export fertig: 5% Puffer oben/unten hinzugefügt.');


OOODDER: 

% 1. UI-Elemente nur verstecken statt löschen (schont die Colorbar)
set(findall(gcf, 'Type', 'uicontrol'), 'Visible', 'off');
set(findall(gcf, 'Type', 'uipanel'), 'Visible', 'off');

% 2. Die Colorbar explizit wieder einschalten (falls sie versteckt wurde)
cb = findall(gcf, 'Type', 'colorbar');
if ~isempty(cb)
    set(cb, 'Visible', 'on');
else
    cb = colorbar; % Neu erstellen, falls alle Stricke reißen
end

% 3. Deine Rand-Berechnung mit Sicherheits-Puffer
ax = gca;
ti = ax.TightInset; 
padding = 0.05;

% Wir nutzen hier feste Werte für die Breite, um Platz für die Colorbar zu lassen
% [Links, Unten, Breite, Höhe]
ax.Position = [ti(1) + 0.02, ti(2) + padding, 0.75, 1 - ti(2) - ti(4) - 2*padding];

% 4. Export (Painters für Vektoren)
set(gcf, 'Renderer', 'Painters');
print(gcf, 'BrainPlot_Final.svg', '-dsvg', '-vector');

disp('Export fertig: UI ist nur unsichtbar, Colorbar sollte stehen.');

# Müll


R_FEF
R_IFJa

R_STV, R_7AL, R_7Am, R_7PC, R_PBelt, R_A4, R_44, R_45, R_47l, R_PGi, R_STGa, R_PSL, R_STSda, R_STSdp, R_TGd, R_TGv

R_7AL, R_7Am, R_7PC, R_PBelt, R_A4, R_A5, R_44, R_45, R_47l, R_PGi, R_STGa, R_PSL, R_STSda, R_STSdp, R_STV, R_TGd, R_TGv, R_TPOJ1



Seeds: L_PSL, L_STV:
L_FEF, L_7AL, L_7Am, L_7PC, L_MT, L_MST, L_PBelt, L_A4, L_A5, L_PF, L_PFop, L_PFm, L_PFcm, L_PGi, L_TPOJ1, L_STGa, L_STSda, L_STSdp, L_TGd, L_TGv, L_44, L_45, L_47l, L_IFJa


stv vs psl full correltaion
![[Pasted image 20260213123320.png]]



stv vs psl partial correltaion
![[psl stv partial rcorrelation.png]]


rig

Right hemisphere: 
![[Pasted image 20260204154354.png]]
![[circ_full812_R_FEF_IFJa_essential.png]]
![[Screenshot 2026-02-04 at 15.56.32.png]]




Left Hemisphere: 
![[Screenshot 2026-02-04 at 15.57.26.png]]

tiefer reingehen in left vs right 

![[circ_full812_L_FEF_IFJa_essential.png]]

44, 45, 47l vielleicht als seed regions? 
wo ist IFJa unterschiedlich von 44, 45, 47l 
Unterschied zwischen IFJa und IFJp?
results in g drive reintun 



spatial hearing, language contrast, predictive modelling 



A5 connectivity, left-right hemisphere partial connectivity:
![[A5 partial connectivity left-right hemisphere.png]]


A4 vs A5 full connectivity 
![[Pasted image 20260205132254.png]]


### FEF vs 55b full connectivity
![[FEF vs 55b full812.png]]
55b DTI paper Bedini


### PSL vs STV full connectivity
![[PSL vs STV full connecivity.png]]


### see also
[[Glasser]]
Type:
Tags: 
Status: 
Location: 
Created: 2026-02-04 15:30

### Source