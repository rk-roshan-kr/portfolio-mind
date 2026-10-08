# VOLUME 04: NAVISENSE IDR (SIH 26168)
## AI-ML Based Intelligent Dead Reckoning for GNSS-Denied Vehicular Navigation
### Author: Roshan Kumar Gupta
### Award: **1st Place Champion** — Tekathon 2026 (Smart Vehicles Category)
### Problem Statement: **ISRO Problem Statement SIH26168** (Ministry of Space / Smart India Hackathon)
### Repository: [`rk-roshan-kr/navisense-idr-sih-26168`](https://github.com/rk-roshan-kr/navisense-idr-sih-26168) | License: MIT

---

## 1. Executive Summary & Competition Context

Navisense IDR is an AI-enhanced inertial dead-reckoning system developed for the **Indian Space Research Organisation (ISRO) Problem Statement SIH26168**. Designed to maintain continuous, sub-meter trajectory estimation for emergency and autonomous vehicles navigating through dense urban canyons, multi-kilometer tunnels, underpasses, and electronic GNSS jamming zones:
* **Competition Triumph**: Awarded **1st Place Champion** in the Smart Vehicles theme during Tekathon 2026 (Internal SIH Round).
* **Core Technological Leap**: Replaces traditional double-integration strapdown INS (which diverges by hundreds of meters in seconds) with a **4-Component Cascade** fusing deep temporal convolutional neural kinematics (`UniversalMotionNetV2`), an Error-State Kalman Filter with Non-Holonomic Constraints (ES-EKF-NHC), and soft vector road corridor registration using Huber M-estimators.
* **Empirical Validation**: Evaluated on the benchmark **IO-VNBD Dataset**, reducing 60-second GNSS outage drift from **$>450\text{ m}$** (raw INS) and **$78.4\text{ m}$** (conventional EKF) down to **$12.3\text{ m}$** (a **$6.4\times$ improvement**), with a longitudinal corridor drift rate of **$<2.6\%$**.
* **Zero Stationary Creep**: Eliminates zero-speed runaway drift ($0.00\text{ m}$ drift while waiting at red lights) via a dual-threshold Zero-Velocity Update (`ZUPT`) state machine.
* **Dual Deployment**: Ships as both a standalone, zero-cloud **Android Cockpit APK** capturing real-time 50 Hz phone IMU signals, and a high-performance **60 FPS MapLibre 3D web dashboard**.

---

## 2. Problem Statement: Why Inertial Navigation Fails in Vehicles

### 2.1 The Double-Integration Divergence Catastrophe
In a classical Strapdown Inertial Navigation System (INS), position $p(t)$ is computed by double-integrating accelerometer readings:
$$v(t) = v_0 + \int_{0}^{t} \left( R_b^n(t) a^b(t) - g^n \right) dt$$
$$p(t) = p_0 + \int_{0}^{t} v(t) dt$$

Where:
- $a^b(t)$ is raw body-frame acceleration.
- $R_b^n(t)$ is the body-to-navigation rotation matrix derived from gyroscope angular velocity $\omega(t)$.
- $g^n$ is the local gravity vector $[0, 0, 9.80665]^T$.

#### The Error Propagation Law:
If the accelerometer has a constant bias offset $b_a$, and the gyroscope has an angular bias $b_g$:
1. Attitude error $\delta \theta(t)$ grows linearly: $\delta \theta(t) \approx b_g \cdot t$.
2. This causes a misalignment in gravity cancellation: $\delta a(t) \approx g \cdot \delta \theta(t) = g \cdot b_g \cdot t$.
3. Position error $\delta p(t)$ therefore grows with the **cube of time ($t^3$)**:
$$\delta p(t) \approx \frac{1}{2} b_a t^2 + \frac{1}{6} g b_g t^3$$

On commodity consumer-grade MEMS IMUs (such as those in smartphones):
- Within **10 seconds** of satellite loss, position error exceeds **25 meters**.
- Within **60 seconds**, position error exceeds **450 meters**, rendering the navigation system completely useless.

---

## 3. The 4-Component Neural-Kinematic Cascade

Navisense IDR resolves the cubic divergence crisis through an interconnected 4-tier pipeline:

```
                                  CLEAR SKY (GNSS AVAILABLE)
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │ Component 2: Calibration  │
                                 │   • Mount Euler estimation│
                                 │   • Scale & bias tuning   │
                                 │   • FiLM latent vector    │
                                 └─────────────┬─────────────┘
                                               │
  PHONE SENSORS                                ▼
  ┌─────────────────┐             ┌───────────────────────────┐
  │ Component 1     │             │ Component 2: Neural Net   │
  │ Preprocessing   ├────────────►│ UniversalMotionNetV2      │
  │ • 9-DoF IMU     │             │ • Speed prediction (v)    │
  │ • Gravity align │             │ • Turn rate prediction (ω)│
  │ • ZUPT detector │             │ • Heteroscedastic unc (σ) │
  └─────────────────┘             └─────────────┬─────────────┘
                                                │
                                                ▼
  MAP INTEGRATION                 ┌───────────────────────────┐
  ┌─────────────────┐             │ Component 3: EKF Filter   │
  │ Component 4     ├────────────►│ Error-State Kalman Filter │
  │ OpenStreetMap   │   Soft      │ • Kinematic propagation   │
  │ Vector Network  │ Observation │ • Zero Velocity Updates   │
  │ • Huber M-est   │             │ • Continuous covariance P │
  └─────────────────┘             └─────────────┬─────────────┘
                                                │
                                                ▼
                                  CONTINUOUS DEAD-RECKONING
                                  Sub-2.6% drift over distance
```

### Component 1: Sensor Preprocessing & Gravity Alignment (`SensorConditioner`)
1. **Dynamic Gravity Decoupling**:
   - Phone orientation inside a vehicle is arbitrary (mounted in a cradle, resting at an angle, or horizontal).
   - During steady-state driving, average low-frequency acceleration represents the gravity vector.
   - Navisense computes the local gravity projection vector using Principal Component Analysis (PCA) and low-pass filtering:
$$q_{\text{align}} = \text{RotAlign}(a_{\text{lowpass}}, [0, 0, -g]^T)$$
   - Transforms all raw acceleration and angular rates from the **Phone Body Frame ($b$)** directly into the **Vehicle Dynamic Frame ($v$)**, where $x$ is forward, $y$ is lateral, and $z$ is vertical.

2. **Dual-Threshold Stationary Detector (`ZUPT`)**:
   - Vehicles spend 20–30% of urban travel time stopped at traffic intersections.
   - Traditional INS continues integrating noise, causing the vehicle marker on screen to "creep" into intersections.
   - Navisense monitors acceleration variance $\sigma_a^2$ and gyroscope magnitude $\|\omega\|$:
$$\text{If } \sigma_a^2 < \tau_a \quad \text{AND} \quad \|\omega\| < \tau_\omega \implies \text{State} = \text{STATIONARY}$$
   - Instantly forces $v(t) = 0$ and clamps the velocity covariance in the filter. Stationary creep is **$0.00\text{ m}$**.

---

### Component 2: Universal Neural Motion Network (`UniversalMotionNetV2`)
Rather than integrating raw accelerations, Navisense uses a **Temporal Convolutional Network (TCN)** to predict instantaneous forward speed $v$ and yaw rate $\omega_z$ directly from temporal IMU windows (50 samples = 1.0 second):

$$\hat{v}_k, \hat{\omega}_k, \hat{\sigma}_{v, k}^2, \hat{\sigma}_{\omega, k}^2 = \text{UniversalMotionNetV2}(a_{k-49:k}, \omega_{k-49:k})$$

#### Key Architectural Choices:
1. **Dilated Causal 1D Convolutions**:
   - Expands the receptive field over 1.0 second of driving history without losing temporal causality.
2. **Heteroscedastic Uncertainty Estimation**:
   - Instead of predicting only velocity, the network predicts the **variance $\hat{\sigma}^2$** via Gaussian Negative Log-Likelihood (NLL) loss:
$$\mathcal{L} = \frac{1}{2} \exp(-s) \|v - \hat{v}\|^2 + \frac{1}{2} s, \quad s = \log \hat{\sigma}^2$$
   - When the vehicle drives smoothly on a highway, the network predicts low variance ($\hat{\sigma} \approx 0.2\text{ m/s}$).
   - When hitting potholes or aggressive road bumps, the network automatically outputs high uncertainty ($\hat{\sigma} \approx 1.8\text{ m/s}$), instructing the downstream Kalman filter to trust kinematic constraints over instantaneous neural predictions!

3. **Maneuver Specialist Network (`ManeuverSpecialistNet`)**:
   - Standard neural odometry underestimates sharp, aggressive 90-degree turns and emergency braking.
   - A specialized high-curvature sub-network activates dynamically when centrifugal acceleration $a_y = v \cdot \omega_z$ exceeds $1.5\text{ m/s}^2$.

---

### Component 3: Error-State Kalman Filter with Non-Holonomic Constraints (`NavigationStateEstimator`)

We employ an **Error-State Extended Kalman Filter (ES-EKF)**. The full nominal state is:
$$x = [p_x, p_y, p_z, v_x, v_y, v_z, \psi, b_{\omega}]^T$$

#### Non-Holonomic Constraints (NHC):
A land vehicle equipped with rubber tires does not skid sideways or fly into the air under normal road conditions. This provides two rigid physical equality constraints:
$$v_y^v \approx 0 \quad (\text{Lateral velocity is zero})$$
$$v_z^v \approx 0 \quad (\text{Vertical velocity is zero})$$

These constraints are injected as pseudo-measurements into the filter at **50 Hz**:
$$z_{\text{nhc}} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} v_y^v \\ v_z^v \end{bmatrix} + \eta_{\text{nhc}}, \quad R_{\text{nhc}} = \text{diag}(\sigma_{\text{lateral}}^2, \sigma_{\text{vertical}}^2)$$

This single mathematical constraint destroys the lateral drift typical of consumer IMUs, bounding the error vector strictly to the vehicle's longitudinal axis of travel.

---

### Component 4: Soft Vector Road Network Registration (`MapRegistrator`)

#### Why Traditional "Hard" Map-Matching Fails:
Standard commercial map-matching snaps the vehicle's coordinates $(x, y)$ onto the nearest road polygon center. If a vehicle takes an exit ramp, hard snapping often pulls the car back onto the highway, resulting in violent trajectory "teleportation" and routing failures.

#### Navisense Soft Corridor Registration:
Navisense models the road network from OpenStreetMap (OSM) as a continuous vector corridor with heading direction $\theta_{\text{road}}$ and width $W$:
1. **Huber M-Estimator Projection**:
   - The measurement residual $r = d_{\text{perp}}$ (perpendicular distance from road centerline) is weighted using a robust Huber loss:
$$\rho(r) = \begin{cases} \frac{1}{2} r^2 & \text{if } |r| \le \delta \\ \delta (|r| - \frac{1}{2}\delta) & \text{if } |r| > \delta \end{cases}$$
   - This gently guides the Kalman filter heading along the road direction without snapping.
2. **Lane Datum Calibration**:
   - During clear-sky GNSS driving, the system learns the constant offset between the vehicle's true driving lane and the OSM centerline.
   - When the tunnel blackout begins, the learned datum offset is preserved, preventing the car from drifting into oncoming traffic lanes.

---

## 4. Empirical Benchmark Results

Evaluated rigorously on the **IO-VNBD (In-Out Vehicular Navigation Benchmark Dataset)** over simulated and real GNSS outages spanning urban canyons, expressway flyovers, and long underground tunnels:

| Benchmark Metric | Raw Strapdown INS | Conventional EKF-NHC | Navisense IDR (Ours) | Quantitative Advantage |
| :--- | :---: | :---: | :---: | :---: |
| **60s Outage Drift** | $> 450.0\text{ m}$ (Diverged) | $78.4\text{ m}$ | **$12.3\text{ m}$** | **$6.4\times$ Reduction in Error** |
| **120s Outage Drift** | $> 1,800.0\text{ m}$ (Fatal) | $184.2\text{ m}$ | **$28.7\text{ m}$** | **$6.4\times$ Better Accuracy** |
| **Longitudinal Drift Rate** | $> 35.0\%$ | $8.2\%$ | **$< 2.6\%$** | **$3.1\times$ Superior Tracking** |
| **Stationary Creep (Red Light)** | Unbounded runaway | Constant drift | **$0.00\text{ m}$ (ZUPT Locked)** | **Zero Creep** |
| **Reconvergence Continuity** | Fatal Discontinuity | Severe Position Jump | **Smooth (Zero Teleportation)** | **Continuous Re-entry** |

---

## 5. Senior Interview & Defense Questions ("Grill Me")

### Q1: "Why use smartphone IMUs when modern autonomous cars have wheel speed encoders and CAN bus access?"
> **Roshan's Defense**: "Wheel speed encoders on the CAN bus are indeed reliable, but accessing them requires physical vehicle taps, manufacturer OBD-II reverse engineering, and introduces severe vehicle-specific dependency. Furthermore, wheel odometry fails catastrophically during **wheel slip, hydroplaning, or icy road conditions**, where wheel rotation does not equal ground displacement. Navisense was designed for ISRO's requirement: a **universal, zero-install emergency vehicle solution**. By mastering consumer phone IMUs via deep neural kinematics and EKF non-holonomic constraints, we achieve sub-2.6% drift on any vehicle—from an ambulance to a logistics truck—without plugging a single wire into the dashboard."

### Q2: "What if the driver picks up the phone or it slides around during a turn?"
> **Roshan's Defense**: "That is addressed in Component 1 (`SensorConditioner`). We track the dynamic alignment quaternion $q_{\text{align}}$. If the high-frequency angular rate $\omega$ exhibits non-vehicular rotation (e.g., human hand manipulation or sliding on a seat), the variance $\sigma_{\omega}^2$ spikes outside the rigid-body vehicle kinematics envelope. The filter immediately flags `ALIGNMENT_INVALID`, drops the confidence factor, and falls back to pure kinematic heading hold until steady-state gravity projection re-converges."

### Q3: "Why not replace the Kalman Filter entirely with an end-to-end LSTM or Transformer?"
> **Roshan's Defense**: "End-to-end recurrent neural networks lack **guaranteed physical constraints and continuous covariance tracking**. A pure neural network will occasionally emit physically impossible predictions (e.g. accelerating from 0 to 100 km/h in 50 milliseconds during an out-of-distribution sensor glitch). By restricting the neural network to what it does best (estimating instantaneous forward velocity $v$ and learned uncertainty $\sigma$ from high-dimensional vibration waveforms), and delegating state propagation to an **Error-State Kalman Filter**, we maintain strict Newtonian kinematic guarantees and have a mathematically audited covariance matrix $P$ at every single millisecond."
