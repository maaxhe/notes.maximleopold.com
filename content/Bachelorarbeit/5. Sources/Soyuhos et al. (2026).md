---
ai_generated: true
model: claude-sonnet-4-6
date_created: 2026-05-02
tags:
  - source
  - ba
  - methods
  - fMRI
  - functional-connectivity
  - CPM
  - HCP
  - FFA
  - PPA
  - cognitivescience
  - Neuroscience
modified: 2026-05-23
---

Soyuhos, O., Scarpa, A., & Baldauf, D. (2026). Distinct resting-state connectomes for face and scene perception predict individual task performance. *Human Brain Mapping*, *47*, e70498. https://doi.org/10.1002/hbm.70498

- [x] Paper gelesen?
- [x] Infos rausgeschrieben?

## Soyuhos et al. (2026)

**Core argument:** The FFA and PPA are embedded in distinct intrinsic resting-state networks whose connectivity profiles predict individual behavioral performance on face-matching and scene n-back tasks (double dissociation). MEG analyses further show this spatial segregation is expressed in beta/gamma amplitude coupling, with dominant incoming influences (ROI→Seed) in higher frequencies and outgoing influences (Seed→ROI) in lower frequencies.

**Why this paper matters for the thesis:**
- Uses the same CONN-based analysis pipeline, same HCP dataset, same Baldauf lab toolbox (BrainRest), and the same Wilcoxon + FDR statistical framework as this thesis
- Provides methodological precedent for the thesis approach — cite in §3.3 when introducing the connectivity analysis method
- The paper is from the same lab (Baldauf) and therefore the closest methodological reference available

**Methods details (fMRI-relevant only — no MEG in thesis):**

| Step | Soyuhos (2026) detail |
|------|----------------------|
| Dataset | HCP 1200 Subjects Release; N=55 for connectivity (twin-excluded, MEG-complete); N=371 for CPM |
| Scanner | Siemens 3T Connectome Skyra, TR=720ms, TE=33.1ms, 52°, 2mm, multi-band=8 |
| Preprocessing | HCP minimal preprocessing pipeline; ICA-FIX denoising |
| Time series normalization | z-normalized: (x−mean)/stdev before connectivity computation |
| Run concatenation | All 4 runs concatenated → 1 continuous dataset (~60 min/subject) |
| Atlas | HCP-MMP1, Connectome Workbench for parcel-wise time series |
| FC computation | FSLNets toolbox, `nets_netmats` function, **ridgep=0.01** (ridge-regularized partial correlations) |
| Matrix size | 360×360 (whole brain) |
| Statistical test | Wilcoxon signed-rank test, FDR-corrected q<0.05 for 180 ROIs per hemisphere |
| CPM network | FFA network: 37 regions (bilateral seeds + significant ROIs); PPA network: 23 regions |
| CPM feature selection | Edges with **negative** correlation to RT (p<0.05) selected as predictive features |
| CPM summarization | Single summary score = sum of partial correlation values of selected edges |
| CPM model | Linear regression: y = mx + b; slope and intercept from training set applied to held-out subject |
| CPM validation | LOO cross-validation; permutation testing (1000 iterations); Spearman's r as performance metric |
| CPM sample | N=350 (face-matching), N=352 (scene tasks) after motion exclusion (>0.15mm FD) |

**Key results:**
- FFA network: preferential connectivity with lateral occipitotemporal, inferior temporal, temporoparietal regions
- PPA network: preferential connectivity with ventral medial visual, posterior cingulate, entorhinal-perirhinal regions
- Double dissociation in CPM: FFA network predicts face-matching RT, PPA network predicts scene n-back RT (not vice versa)
- MEG: spatial segregation reflected in beta (13–30Hz) and gamma (30–100Hz) amplitude coupling; dominant incoming influences in high frequencies

**Relation to thesis methods:**
- Same statistical framework (Wilcoxon + FDR) ✓
- Same HCP dataset and preprocessing ✓
- Same CPM approach (LOO, Spearman r, permutation) ✓
- **Difference:** Soyuhos uses data-driven ROI selection (Neurosynth contrast); thesis uses theory-driven ROI selection based on dual-stream literature
- **Difference:** Soyuhos uses FSLNets ridgep=0.01; check with Daniel whether BrainRest uses same regularization
- **Difference:** Soyuhos N=55 for connectivity; thesis N=812 (larger, 4-run completeness criterion)

**BibTeX key:** `soyuhos2026`

```bibtex
@article{soyuhos2026,
  author    = {Soyuhos, Orhan and Scarpa, Aurelia and Baldauf, Daniel},
  title     = {Distinct resting-state connectomes for face and scene perception
               predict individual task performance},
  journal   = {Human Brain Mapping},
  year      = {2026},
  volume    = {47},
  pages     = {e70498},
  doi       = {10.1002/hbm.70498}
}
```

**PDF:** `/Users/maxmacbookpro/Downloads/Human Brain Mapping - 2026 - Soyuhos - Distinct Resting‐State Connectomes for Face and Scene Perception Predict Individual.pdf`

## see also
[[Soyuhos, O., & Baldauf, D. (2022)]]
[[3.3 Matrix Construction]]
[[3.4 Brain Behaviour Correlation]]
Tags: #cognitivescience/neuroscience #science #source
