---
modified: 2026-05-06
---

# OLD 3.2 Selection of Regions of Interest (ROIs)

To test the hypothesis of supramodal prefrontal control, we defined a set of Regions of Interest (ROIs) based on the multimodal parcellation of the Human Connectome Project (HCP-MMP1) by [[Glasser et al. (2016) - Nature]]. This atlas maps cortical areas based on a combination of cortical architecture (myelin), function (task-fMRI) and connectivity, providing a significantly higher precision than traditional Brodmann maps. ROIs were divided into three categories: (1) Prefrontal Seed Regions (the controllers), (2) Auditory Where-Stream targets ("dorsal/spatial"), (3) Auditory What-Stream targets ("Ventral/objects").

The selection of ROIs is based on previous research, mainly by [[Rolls et al. (2023) - Cerebral Cortex]] about connectivity of auditory areas using the Glasser Altas [[Glasser et al. (2016) - Nature]]

In general the amount of ROIs found in both streams is far from balanced. There are more areas assigned to the what/ventral auditory stream. This makes sense since language comprehension requires more cotrical compute than locating sounds. 
## 3.2.1 Prefrontal Seed Regions 

We selected distict prefrontal "control hubs" as seed regions based on the functional dissociation described by [[Bedini & Baldauf (2021)]] in the visual stream. 

- **Frontal Eye Field (FEF):** We defined the FEF using the specific Glasser label [[FEF]]. This region is located in the caudal middle frontal gyrus, ventral to the junction of the superior sulcus (sPCS) and superior frontal sulcus (SFS).
	- The FEF contains topographic maps of contralateral space and is a core node of the Dorsal Attention Network ([[DAN]]), responsible for spatial attentional and oculomotor control. 
- **anterior Inferior Frontal Junction (IFJa):** We defined the IFJa using the specific Glasser label IFJa. This region is located at the junction of the inferior precentral sulcus (iPCS) and the inferior frontal sulcus (IFS).
	- Unlike the FEF, the IFJa is part of the Frontoparietal Network ([[FPN]]) and shows multiple-demand characteristics. 
- Control Seed (IFJp): We included the posterior IFJ (IFJp) to validate the specificity of IFJa. 

### IFJa vs IFJp 
Most papers soeak of the IFJ as a whole unit, but [[Bedini (2023) - Brain Structure]] found that IFJa and IFJp exhibit totally different connectivity patterns. 

While the majority of neuroimaging literature treats the IFJ as a monolithic unit, recent evidence suggests a functional and conenctional dossiociation between its anterior (IFJa) and posterior (IFJp) subdivisions. We utilized the high resolution of the HCP-MMP1 to make use of this distinction. 

According to [[Bedini & Baldauf (2021)]], [[IFJ]]p is a core node of tthe multiple demand system and the [[FPN]]. It is activated by tasks involving reasoning and math tasks, serving as a general-purpose executive mediator

**IFJp:** According to the IFJp belongs to the multiple demand system and might serve as a mediator for those areas. 

**IFJa:** functions as a mediator for lower-order regions especially for language related regions [[Bedini & Baldauf (2021)]] 

This is why we contrasted IFJa and IFJp and focus on IFJa as a seed region for the auditory what-pathway. In figure ... we contrasted functional connectivity of both the IFJa and IFJp. 

## 3.2.2 Target Definitions

### 3.2.2.1 ROIs for the What-Stream
Since the what-stream mainly focusses on semantics and comprehension, it is the main speech processing pathway - as in the visual stream for object recognition. 
There is a lot of research on it 

Starting from the core and belt regions and moving anteriorly to the IFJ, we found following regions belonging certainly to the what-stream: 

STGa (aSTG old description) is according to [[Ahveninen et al. (2006) - PNAS]] and the connectivity to [[TA2]] from [[Glasser et al. (2016) - Nature]] certainly part of the what-stream. STGa has also connectivity to [[IFG]]. Also a bit of dorsal stream to IFG and fOP but weaker. 

**Core/Belt:** [[PBelt]] as a starting point, showing preferential connectivity accordning to [[Rolls et al. (2023) - Cerebral Cortex]]

**Semantic Processing:** We selected the superior temporal areas [[STGa]], [[STSda]], [[STSdp]], [[TA2]] and [[TPOJ1]] to represent the auditory what-stream. This selection is driven by converging evidence from function activation contrasts, myelin mapping and effective connectivity and responses to auditory cues ([[Glasser et al. (2016) - Nature]], [[Ahveninen et al. (2006) - PNAS]], [[Dureux (2024)]]

**Secondary Targets:** We inclduded TPOJ2, TPOJ3 as a high-level convergence zone. Even though located in the parietal junction, [[Glasser et al. (2016) - Nature]] intentified it as a part of the [[Auditory Association Cortex]] activated during language comprehension tasks. 

vielleicht auch TPOJ2 und TPOJ3 aufhemen

TPOJ2 and TPOJ3 could function as bringing together semantic representations involving many types of representation. 

### 3.2.2.1 ROIs for the Where-Stream 
The research on the auditory where-stream is a bit thin. Mainly I focussed on [[Rolls et al. (2023) - Cerebral Cortex]] for the connectivity between the areas. 

Previous research shows that all [[STG]] subregions connect to the [[fOP]] via dorsal pathways, which could mean that STG generally belongs to the dorsal stream. 
BUT 
#### 3.2.2.1.1 FOP
[[fOP]] areas are vage. the only source I found was [[Frühholz (2015) - NeuroImage]] in which it says that [[BA44, 44]] is part of fOP and therefore it could be part of the dorsal pathway. 

**FOP1 (Frontal Opercular Area 1):** Located in the frontal operculum. According to [[Frühholz (2015) - NeuroImage]], the fOP is a primary target of the auditory dorsal pathway ([[Frühholz (2015) - NeuroImage#^5b4da1]]). [[Rolls et al. (2023) - Cerebral Cortex]] associated fOP regions with the "Group 3" network (including [[A4]], [[A5]], [[MT]]), linking it to somatosensory and motion processing. Inclusion of FOP1 captures the frontal endpoint of the "Sound to Motor" stream described by [[Hickok & Poeppel (2004) - Cognition]], [[Hickok & Poeppel 2007 - Nature]]. 

#### 3.2.2.1.2 Spatial supporting regions 7AL, 7AM and 7PC
According to [[Rolls et al. (2023) - Cerebral Cortex]], the areas [[7AL]], [[7Am]], [[7PC]] could all be involved in spatial processing within the auditory stream. Since we hypothesise supramodality in which the FEF directs visual as well as auditory signals, it is plausible that letter named regions also play a significant role in spatial processing of auditory tasks.

Though, one could argue MT and MST also play a role in motion, but as studies show, there is no response of MT/MST for auditory stimuli only --> Study raussuchen, da gab es eine!! Siehe [[MT#Source]]

#### 3.2.2.1.3 PSL
According to [[Rolls et al. (2023) - Cerebral Cortex]] [[PSL]] is involved in language-semantic functions, but [[Dureux (2024)]] shows that PSL is unresponsive to auditive stimuli ([[Dureux (2024)#^51288d]]) suggesting PSL could be a highly specialised area. 
It has high conenctivity to STS along with [[TPOJ1]], [[STV]], [[PSL]], [[TGv]], [[TGd]], [[PGi]] which could suggest PSL being part of the [[Auditory What-Stream (Ventral)]]. 

