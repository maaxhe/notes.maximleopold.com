---
title: "Are Neural Oscillations Necessary or Just a Byproduct?"
date: 2025-04-18
tags: [Neuroscience]
description: "It is a hot debate in neuroscience whether the brain actually needs oscillations to function properly or whether they are merely a byproduct of neural communication."
modified: 2026-03-12
---

> *Ursprünglich veröffentlicht auf [maximleopold.com](https://maximleopold.com/blog/are-neural-oscillations-necessary-or-just-a-byproduct)*

# Are Neural Oscillations Necessary or Just a Byproduct?

It is a hot debate in neuroscience whether the brain actually needs oscillations or not to function properly.

In the brain, we can measure oscillations at various frequencies. Many studies show the importance of oscillations for understanding the brain. Using EEG or MEG to measure oscillations, we can observe whether humans sleep, are tired, attend to a certain stimulus or move their eyes.

With these brain waves, we can track activity and therefore understand the brain.

But are these oscillations only useful for reading the brain, or do they serve an important purpose in the brain?

Surely neurons create an electromagnetic current when communicating. But we also observe very distinct patterns and rhythmic communication of distant neural regions in synchronised frequencies.

Therefore, the question arises whether these oscillations are really necessary for the brain to communicate or are just an epiphenomenon of neurons communicating via action potentials.

---

<figure>
  <img src="/covers/oscillations/meg_daten.png" alt="Example MEG data showing oscillatory activity" />
  <figcaption>MEG data reveal rhythmic activity across frequencies — a key window into brain dynamics.</figcaption>
</figure>

<figure>
  <img src="/covers/oscillations/waves.jpg" alt="Illustration of waves to metaphorically depict brain rhythms" />
  <figcaption>Waves as a metaphor: oscillations emerge and propagate — but are they necessary for computation?</figcaption>
</figure>

## TL;DR

We do not know the answer yet. We will need more studies and models proving or disproving the theory of “Communication Through Coherence”. For now, it seems to provide a useful explanation of communication between distant neural regions in the brain.

In this article, I will discuss the current debate on brain oscillations.

## What does the Communication through Coherence Hypothesis state?

The Communication Through Coherence (CTC) hypothesis by Pascal Fries (2005) suggests that oscillating rhythms (especially in the gamma range) enable effective communication between distant brain regions.

Imagine a lower brain area as someone trying to shine a light torch (a neural signal) through a window. The window represents a higher brain area, which only opens at specific times, rhythmically. If the torch is turned on while the window is closed, no light gets through.

The torch needs to be just in time. Both need to have the same rhythm for communication.

But if the torch is flicked on precisely when the window opens, the signal passes.

In the same way, rhythmic synchronisation aligns the excited brain regions, making sure that the signals from one group of neurons arrive when the higher brain region is receptive. Without such temporal alignment, communication would be weak or lost. The one stimulus that matches the window opening wins over the other torches.

<figure>
  <img src="/covers/oscillations/window.png" alt="Window metaphor illustration for communication through coherence" />
  <figcaption>CTC‑Metaphor: A light signal gets through only if the window (of opportunity) is open - timing is key!</figcaption>
</figure>

## Why Gamma Rhythms Might Matter for Brain Communication

Imagine the last time you went to a concert with the audience giving applause after the show. They clap randomly at first, but then slowly synchronise into a single rhythm. No one planned it; the rhythm emerges spontaneously.

Same with oscillations in your brain. They might arise spontaneously from millions of neurons firing at the same time and influencing their neighbours.

Although this analogy isn’t perfect, since only specific brain regions synchronise and communicate with each other at the same time, it shows how rhythmic synchrony can spontaneously emerge and lead to stronger communication, like in the audience.

<figure>
  <img src="/covers/oscillations/cheering.jpg" alt="Audience clapping in synchrony as analogy for neural synchronisation" />
  <figcaption>Applaus wird oft spontan synchron — wie neuronale Gruppen, die sich rhythmisch ausrichten.</figcaption>
</figure>

Whenever we look at something, gamma rhythms (40–90Hz) appear in our brains. This happens consistently, regardless of the stimulus. But what does that imply? There must be a reason for this phenomenon — or could it only be an epiphenomenon?

If neurons react to a stimulus by firing together, a gamma rhythm emerges naturally. Pascal Fries strongly believes these gamma rhythms play crucial roles in the brain, saying: “Neuronal communication is subserved by neuronal synchronisation” (Fries, 2015). This belief formed his “Communication Through Coherence” (CTC) theory.

<figure>
  <img src="/covers/oscillations/gamma.png" alt="Gamma rhythm power spectrum / illustration" />
  <figcaption>Gamma‑Band (30–90 Hz): short, precise timing-window - really useful for selective communication.</figcaption>
</figure>

## Classical vs. Rhythmic View

Let’s look at the classical view of neuronal communication. Fries argues it lacks in several aspects when explaining cognition:

- Neurons communicate through anatomical synaptic connections, which means connections are mostly fixed and are not flexible. But cognition is very flexible.
- Information strength depends solely on firing rates. This does not explain selective routing between brain areas.
- Timing isn’t considered significant, but it surely must be, according to studies.
- Es erklärt die Flexibilität der Aufmerksamkeit nicht ausreichend.

On the other side, Fries’ rhythmic view aims to solve these issues:

- Communication relies on oscillatory synchronisation. This makes it more flexible since anatomical connections are not necessarily required.
- Precise timing controls signal flow.
- Selective routing determines which neural groups communicate. That explains flexible attention.
- Hierarchical and context-dependent cognition becomes possible.

## Rhythms in the Brain

To understand rhythmic communication, let’s briefly overview the important brain rhythms and their roles:

### Gamma Rhythm (30–90 Hz)

- Short, rapid excitation windows for precise timing.
- Drives feedforward communication and attention.

### Beta Rhythm (13–30 Hz)

- Mediates top-down predictions (as attention)
- Associated with deeper cortical layers and feedback processes.
- Influences gamma rhythms.

### Alpha Rhythm (8–12 Hz)

- Provides rhythmic inhibition of gamma rhythms.
- Acts as a suppressive rhythm, turning off communication channels for unattended stimuli.

### Theta Rhythm (4–8 Hz)

- Organises gamma phase resets (for new assessment of attention).
- Saccadic rhythms occur at a theta rhythm.

## Testing the Communication Through Coherence Hypothesis

To see how these rhythms interact, let’s look at an experimental study with macaques:

The macaques’ task was to attend to one of two simultaneously presented stimuli. Although both stimuli activated neuronal responses in area V1, only the stimulus attended by the macaque successfully entrained gamma rhythms in area V4 and silenced the other stimulus (“winner takes all”). This shows how gamma rhythms selectively route information in the brain.

This is evidence that the same gamma frequencies emerge in two distant brain regions through attention and synchronise strongly.

<figure>
  <img src="/covers/oscillations/attention_task.png" alt="Two‑stimulus attention task used to study gamma synchrony" />
  <figcaption>Exercise paradigm: Two stimuli, only one will be attended to - it will win the gamma-coupling to V4.</figcaption>
</figure>

<figure>
  <img src="/covers/oscillations/coherence.png" alt="Coherence plot showing coupling between brain areas" />
  <figcaption>Coherence: a measure of phase-stable coupling between brain areas — central to the CTC hypothesis.</figcaption>
</figure>

But does this prove we actually need oscillations? Pascal Fries certainly believes so, yet there are opposing viewpoints.

For instance, Schneider et al. (2021) demonstrated that neurons in Spiking Neural Networks (SNNs) naturally produce gamma-like patterns when firing consecutively. This could mean that oscillations could be a consequence rather than a cause of neuronal activity.

## How Could We Test Fries’ Theory?

Here are possible methods to test Fries’ hypothesis:

1. Introduce rhythmic noise or competing oscillations to disrupt gamma rhythms in animal models, making neurons rhythmically “blind” (e.g., Cardin et al., 2009).
2. Develop computational models (like Schneider’s SNNs) that test if rhythmic oscillations are necessary for effective neural communication.

## Is Spike Rate Alone Enough?

Looking at simpler organisms helps clarify the debate. _Aplysia californica_ relies primarily on spike-rate communication. With fewer neurons, gamma-like oscillations cannot form. While slower rhythms might exist, there’s no evidence for gamma rhythms.

Also, _C. elegans_, an even simpler organism, seems to function effectively without clear oscillatory communication. This raises the question: **At what point do oscillations become necessary?**

<figure>
  <img src="/covers/oscillations/aplysia.jpg" alt="Aplysia (sea slug) photo" />
  <figcaption>Simpler nervous systems such as in <em>Aplysia</em> likely function primarily via spike rate — without pronounced gamma activity.</figcaption>
</figure>

<figure>
  <img src="/covers/oscillations/aplysia_circuit.png" alt="Aplysia gill‑withdrawal circuit diagram" />
  <figcaption>Diagram of the gill-withdrawal reflex: few neurons, clear spike-rate pathway.</figcaption>
</figure>

<figure>
  <img src="/covers/oscillations/synapse.png" alt="Synapse illustration" />
  <figcaption>Synaptic communication generates electric fields — the source of observable oscillations in summed signals.</figcaption>
</figure>

## Conclusion

I believe neural oscillations weren’t initially necessary when organisms with neurons emerged. They likely emerged spontaneously due to electrochemical signalling between neurons in simple organisms and became more beneficial as brains grew in complexity. Evolution might have favoured brains that relied on oscillatory communication.

But neuroscience remains young, and ongoing research will continue testing theories like CTC.

---

## Sources

- https://medium.com/@max.herr/are-neural-oscillations-necessary-or-just-a-byproduct-655c17007caa
- Baldauf, D., & Desimone, R. (2014). Neural mechanisms of object-based attention. _Science_, 344(6182), 424–427.
- Cardin, J. A., et al. (2009). Driving fast-spiking cells induces gamma rhythm and controls sensory responses. _Nature_, 459(7247), 663–667.
- Fries, P. (2015). Rhythms for cognition: communication through coherence. _Neuron_, 88(1), 220-235.
- Schneider, M., et al. (2021). A mechanism for inter-areal coherence through communication based on connectivity and oscillatory power. _Neuron_, 109(24), 4050–4067.e12.
