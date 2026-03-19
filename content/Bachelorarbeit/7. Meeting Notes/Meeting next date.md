---
modified: 2026-03-19
---

- [ ] Tabelle der ROIs sollen dann die eEgebnisse zeigen oder das, was ich vorher gedacht habe? 
- [x] kann ich bei der Toolbox auch mean_conn <0 einfach rausfiltern?
	- [x] ich will die am liebsten gar nicht erst angezeigt bekommen. 
- [x] soll ich MEG_PDC nutzen? 
	- [x] woher kommen die subjects? HCP
	- [x] Warum ist FEF delta so anders zu meinen fMRI daten? 


nochmal mit 55subs laufen lassen 
371 auch nutzen 
larger sample size for predicitve modelling 
start with 55 fMRI seed based (single seed) conn 
then directed connectivity (MEG) 
then 371 contrast with those interesting ROIs 

R= 0.3 for prediction is starting getting good 


eyes open for MEG:
### MEG_PDC R_FEF delta 
![[MEG_pdc R_FEF delta.png]]

#######################################################################################################  15-Mar-2026 10:42:36

Significant 27 area(s) that receives input from R_FEF in delta:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_43       delta           0.0000       4.7750
    R_FEF          R_FOP1     delta           0.0000       4.0728
    R_FEF          R_FOP2     delta           0.0046       2.8348
    R_FEF          R_OP4      delta           0.0000       4.7050
    R_FEF          R_PFcm     delta           0.0000       4.5708
    R_FEF          R_MT       delta           0.0088       2.6213
    R_FEF          R_MST      delta           0.0033       2.9394
    R_FEF          R_PBelt    delta           0.0000       4.2713
    R_FEF          R_A4       delta           0.0039       2.8828
    R_FEF          R_A5       delta           0.0000       5.4884
    R_FEF          R_STV      delta           0.0238       2.2595
    R_FEF          R_PGi      delta           0.0008       3.3658
    R_FEF          R_TPOJ1    delta           0.0000       4.9904
    R_FEF          R_STGa     delta           0.0000       4.5727
    R_FEF          R_STSda    delta           0.0000       5.4884
    R_FEF          R_STSdp    delta           0.0000       5.3143
    R_FEF          R_STSva    delta           0.0000       5.3046
    R_FEF          R_STSvp    delta           0.0000       5.7197
    R_FEF          R_TA2      delta           0.0000       5.3046
    R_FEF          R_TE1a     delta           0.0000       4.9756
    R_FEF          R_TGd      delta           0.0000       5.4884
    R_FEF          R_TGv      delta           0.0000       4.2682
    R_FEF          R_AVI      delta           0.0017       3.1446
    R_FEF          R_47l      delta           0.0000       5.0912
    R_FEF          R_45       delta           0.0263       2.2212
    R_FEF          R_44       delta           0.0010       3.2923
    R_FEF          R_IFJa     delta           0.0011       3.2711



#######################################################################################################  15-Mar-2026 10:42:36

Significant 2 area(s) that sends output to R_FEF in delta:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_55b      delta           0.0474       1.9824
    R_FEF          R_7AL      delta           0.0002       3.6672


### MEG_PDC R_FEF theta 

![[meg_pdc r_fef theta.png]]

#######################################################################################################  15-Mar-2026 10:46:55

Significant 13 area(s) that receives input from R_FEF in theta:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_FOP1     theta           0.0162       2.4053
    R_FEF          R_OP4      theta           0.0003       3.5924
    R_FEF          R_PFcm     theta           0.0000       4.7288
    R_FEF          R_MST      theta           0.0037       2.8988
    R_FEF          R_PBelt    theta           0.0000       4.3694
    R_FEF          R_A5       theta           0.0000       4.4352
    R_FEF          R_STV      theta           0.0315       2.1507
    R_FEF          R_PGi      theta           0.0031       2.9621
    R_FEF          R_TPOJ1    theta           0.0000       4.4352
    R_FEF          R_STSdp    theta           0.0000       4.9943
    R_FEF          R_STSvp    theta           0.0000       4.5898
    R_FEF          R_TGd      theta           0.0005       3.5043
    R_FEF          R_TGv      theta           0.0053       2.7912



#######################################################################################################  15-Mar-2026 10:46:55

Significant 5 area(s) that sends output to R_FEF in theta:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_55b      theta           0.0058       2.7588
    R_FEF          R_7AL      theta           0.0000       4.4352
    R_FEF          R_7Am      theta           0.0479       1.9786
    R_FEF          R_PFop     theta           0.0050       2.8040
    R_FEF          R_IFSp     theta           0.0050       2.8040


### MEG R_FEF Alpha
![[MEG_PDC R_FEF alpha.png]]

#######################################################################################################  15-Mar-2026 10:49:09

Significant 13 area(s) that receives input from R_FEF in alpha:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_OP4      alpha           0.0066       2.7183
    R_FEF          R_PFcm     alpha           0.0000       4.2129
    R_FEF          R_MST      alpha           0.0030       2.9645
    R_FEF          R_PBelt    alpha           0.0003       3.5844
    R_FEF          R_A5       alpha           0.0014       3.1964
    R_FEF          R_STV      alpha           0.0002       3.7231
    R_FEF          R_PGi      alpha           0.0002       3.7845
    R_FEF          R_TPOJ1    alpha           0.0000       4.6727
    R_FEF          R_STSda    alpha           0.0294       2.1784
    R_FEF          R_STSdp    alpha           0.0000       5.2381
    R_FEF          R_STSvp    alpha           0.0000       4.8959
    R_FEF          R_TGd      alpha           0.0001       3.8521
    R_FEF          R_TGv      alpha           0.0223       2.2860



#######################################################################################################  15-Mar-2026 10:49:09

Significant 7 area(s) that sends output to R_FEF in alpha:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_55b      alpha           0.0005       3.5082
    R_FEF          R_FOP3     alpha           0.0058       2.7617
    R_FEF          R_STGa     alpha           0.0050       2.8043
    R_FEF          R_45       alpha           0.0003       3.5958
    R_FEF          R_IFSp     alpha           0.0001       4.0440
    R_FEF          R_IFJp     alpha           0.0000       4.5032
    R_FEF          R_IFJa     alpha           0.0086       2.6291
    

### MEG_PDC R_FEF beta 
![[Screenshot 2026-03-15 at 10.52.30.png]]

#######################################################################################################  15-Mar-2026 10:52:20

Significant 3 area(s) that receives input from R_FEF in beta:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_PFcm     beta            0.0280       2.1972
    R_FEF          R_STSdp    beta            0.0033       2.9372
    R_FEF          R_TGd      beta            0.0033       2.9372



#######################################################################################################  15-Mar-2026 10:52:20

Significant 9 area(s) that sends output to R_FEF in beta:

 
    seed_region    ROIs       band_name       p_values     z_scores
    ---------------------------------------------------------------
    R_FEF          R_55b      beta            0.0033       2.9372
    R_FEF          R_FOP1     beta            0.0023       3.0518
    R_FEF          R_FOP2     beta            0.0033       2.9372
    R_FEF          R_FOP3     beta            0.0167       2.3937
    R_FEF          R_7AL      beta            0.0151       2.4292
    R_FEF          R_STGa     beta            0.0336       2.1251
    R_FEF          R_TA2      beta            0.0066       2.7152
    R_FEF          R_IFSp     beta            0.0167       2.3937
    R_FEF          R_IFJp     beta            0.0033       2.9372