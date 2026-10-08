# VOLUME 03: TARS CORE (Transit Ambiguity Recovery System)
## Physics-Constrained Bayesian Pipeline for Sparse Exoplanetary Transits
### Author: Roshan Kumar Gupta
### Grant: **$5,500 Emergent Ventures Grant** (Awarded by Tyler Cowen / Mercatus Center)
### Repositories: [`rk-roshan-kr/TarsCore`](https://github.com/rk-roshan-kr/TarsCore) • [`rk-roshan-kr/Tars-Transit-Ambiguity-Recovery-System`](https://github.com/rk-roshan-kr/Tars-Transit-Ambiguity-Recovery-System)

---

## 1. Executive Summary & Grant Context

Project TARS is an astrophysical signal-processing and machine-learning framework designed to recover single-transit and sparse-transit exoplanets from NASA Kepler and TESS photometric missions. 
* **The Core Problem**: Conventional planet search pipelines discard candidates that display fewer than 3 periodic transits, discarding thousands of long-period, potentially habitable terrestrial candidates.
* **Funding & Validation**: Backed by a **$5,500 research grant from Emergent Ventures** (Tyler Cowen, Mercatus Center at George Mason University), TARS introduces the **ECHO (Exoplanet Candidate Heuristic Optimizer)** pipeline to solve period ambiguity using physical constraints and Bayesian Markov Chain Monte Carlo (MCMC) posterior sampling.
* **Performance**: Achieves **70.1% vetting precision** in the sparse-transit regime, successfully disentangling genuine exoplanets from Background Eclipsing Binaries (BEBs) and stellar flares.

---

## 2. Problem Statement: The Sparse-Transit Blindspot

### 2.1 The Periodic Transit Assumption
Standard exoplanet detection algorithms (such as NASA's Kepler SOC Pipeline and TESS SPOC) operate on a rigid mathematical assumption:
$$\text{Number of Observed Transits } N \ge 3$$
This allows simple phase-folding:
$$\text{Phase } \phi(t) = \frac{t - T_0}{P} \pmod 1$$
Where:
- $T_0$ is the central transit epoch.
- $P$ is the orbital period.

### 2.2 Why Modern Surveys Miss Long-Period Habitable Worlds
TESS observes the sky in **27.4-day sectors**. An Earth analog around a Sun-like star has an orbital period of $\sim 365\text{ days}$:
* In a 27.4-day sector, a habitable-zone planet transits **at most once**.
* Because standard pipelines require 3 transits, **100% of these single transits are rejected as unvetted instrumental anomalies or false alarms**.
* Discarding single transits biases our exoplanet catalog heavily toward scorching, short-period "Hot Jupiters."

---

## 3. The TARS / ECHO Pipeline Architecture

```
                          ┌───────────────────────────┐
                          │   NASA TESS / KEPLER SPOC │
                          │   Raw Light Curve Flux F(t)   │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │ STAGE 1: STELLAR FILTERING│
                          │ • Spline / GP Detrending  │
                          │ • Flare & Outlier Masking │
                          └─────────────┬─────────────┘
                                        │ Cleaned Residuals
                                        ▼
                          ┌───────────────────────────┐
                          │ STAGE 2: ECHO ENGINE      │
                          │ • Box Least Squares (BLS) │
                          │ • Depth: ΔF/F = (Rp/Rs)²  │
                          │ • Duration: T_dur ∝ P^(1/3│
                          └─────────────┬─────────────┘
                                        │ Detected Candidates
                                        ▼
                          ┌───────────────────────────┐
                          │ STAGE 3: FALSE-POSITIVE   │
                          │ DISENTANGLEMENT           │
                          │ • Centroid Pixel Offset   │
                          │ • Odd/Even Depth Ratio    │
                          │ • Secondary Eclipse Check │
                          └─────────────┬─────────────┘
                                        │ Genuine Transit Signals
                                        ▼
                          ┌───────────────────────────┐
                          │ STAGE 4: BAYESIAN MCMC    │
                          │ Mandel & Agol Analytic    │
                          │ Limb-Darkening Posterior  │
                          └───────────────────────────┘
```

### Stage 1: Stellar Detrending & Flare Removal
* Raw photometric time-series suffer from rotational stellar starspot modulation and instrument thermal drift.
* TARS applies a **Savitzky-Golay / Gaussian Process filter** with an asymmetric iterative rejection window:
  - Flux values $> 3\sigma$ above the median (stellar flares) are pruned.
  - Negative deviations (potential planetary transits) are strictly preserved.

### Stage 2: The ECHO Transit Extraction Engine
* Measures the transit depth:
$$\delta = \frac{\Delta F}{F} = \left(\frac{R_p}{R_s}\right)^2$$
Where $R_p$ is planetary radius and $R_s$ is stellar radius.
* Evaluates the physical transit duration constraint dictated by Kepler’s Third Law:
$$T_{\text{dur}} \approx \frac{R_s P^{1/3}}{\pi a} \sqrt{(1 + k)^2 - b^2}$$
Where $a$ is semi-major axis, $k = R_p/R_s$, and $b = (a/R_s)\cos(i)$ is the transit impact parameter.
* If a detected dip violates the Keplerian velocity constraints for the host star's density ($\rho_*$), it is immediately rejected.

### Stage 3: False Positive Disentanglement & ECHO Negative Detector
Over 60% of apparent transit signals are astrophysical false positives. TARS applies three mathematical filters:
1. **Centroid Shift Analysis**: Measures the center-of-light pixel drift during transit. If the centroid moves by $> 2.5\sigma$, the dip originates from a Background Eclipsing Binary (BEB) in the same pixel aperture, not the target star.
2. **Odd-Even Depth Consistency**: Calculates the difference between alternating transit depths:
$$\Delta_{\text{odd-even}} = |\delta_{\text{odd}} - \delta_{\text{even}}|$$
If $\Delta_{\text{odd-even}} > 3\sigma$, the signal is an eclipsing binary system with primary and secondary eclipses.
3. **Secondary Eclipse Rejection**: Searches phase $\phi \approx 0.5$ for an occultation dip. If present, the transiting body is a luminous companion (star), not a dark planet.

### Stage 4: Bayesian MCMC Posterior Modeling
* Fits the light curve using the **Mandel & Agol (2002)** analytic quadratic limb-darkening model:
$$I(r) = 1 - u_1(1 - \mu) - u_2(1 - \mu)^2, \quad \mu = \sqrt{1 - r^2}$$
* Samples the posterior probability distribution over parameters $\{P, T_0, R_p/R_s, a/R_s, i, e, \omega\}$ using ensemble Markov Chain Monte Carlo (`emcee`), providing rigorous $1\sigma$ parameter uncertainties.

---

## 4. Senior Interview & Defense Questions ("Grill Me")

### Q1: "Why use Box Least Squares (BLS) instead of Fast Fourier Transforms (FFT)?"
> **Roshan's Defense**: "Fast Fourier Transforms assume a sinusoidal signal. A planetary transit is not a sinusoid; it is a **periodic inverted top-hat (box-like dip)** with a very low duty cycle (typically transiting for only 2 to 4 hours in a 30-day orbit, or $\sim 0.5\%$ of the total period). FFT spreads the transit power across hundreds of high-frequency harmonics, reducing SNR below detection thresholds. Box Least Squares (BLS) explicitly models a two-level step function, concentrating the entire signal power into a single analytical cross-correlation peak."

### Q2: "How do you constrain orbital period if only a single transit is observed?"
> **Roshan's Defense**: "We leverage the **stellar density constraint (Seager & Mallén-Ornelas 2003)**. For a circular orbit, the duration of the transit $T_{\text{dur}}$, the transit depth $\delta$, and the mean stellar density $\rho_*$ (known from Gaia DR3 and the TESS Input Catalog) are mathematically coupled:
$$P \ge \frac{G \rho_* \pi^2 T_{\text{dur}}^3}{32 (1 - b^2)^{3/2}}$$
By calculating the transit velocity from the ingress and egress slope:
$$v_{\text{trans}} \approx \frac{2 R_p}{t_{\text{ingress}}}$$
We place rigorous Bayesian lower and upper bounds on the semi-major axis $a$ and orbital period $P$ even with a single recorded dip."

### Q3: "What was the significance of the $5,500 Emergent Ventures grant?"
> **Roshan's Defense**: "Emergent Ventures, directed by economist Tyler Cowen at the Mercatus Center, funds high-risk, high-upside moonshot research. The grant validated our non-traditional approach to astrophysical data processing—demonstrating that custom Bayesian algorithms can extract viable candidate signals from public archival space data without requiring multimillion-dollar dedicated telescope observation time."
