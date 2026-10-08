# VOLUME 08: UPSTREAM OPEN-SOURCE ENGINEERING
## Production Contributions to Apache, CNCF, Linux Foundation & Red Hat
### Author: Roshan Kumar Gupta
### Tracking Workspace: [`D:\opensource\PULL_REQUESTS.md`](file:///D:/opensource/PULL_REQUESTS.md) | GitHub: [`rk-roshan-kr`](https://github.com/rk-roshan-kr)

---

## 1. Executive Summary & Engineering Philosophy

Contributing code to Tier-1 open-source foundations (the Apache Software Foundation, Cloud Native Computing Foundation, Linux Foundation, and Red Hat) requires far more than writing clever code. It demands **extreme discipline, architectural humility, and strict adherence to enterprise governance**:
* **Developer Certificate of Origin (DCO) & EasyCLA Compliance**: 100% of commits are signed with verified SSH/GPG cryptographic signatures (`Signed-off-by`).
* **Respect for Maintainer Bandwidth**: Pull requests are tightly scoped to specific issue reproductions, contain comprehensive unit and integration tests, and strictly adhere to upstream formatting and deprecation policies.
* **Track Record**: Merged code in **CNCF OpenTelemetry** and **Apache Fineract**; active and passing PRs in **OpenSearch Dashboards**, **Red Hat Cockpit**, **Apache Airflow**, **Apache Iggy**, and **Tailscale**.

---

## 2. Granular Technical Deep Dive: Upstream Pull Requests

### 1. CNCF OpenTelemetry Browser: Navigation Instrumentation Refactoring
* **Repository**: `open-telemetry/opentelemetry-browser`
* **Pull Request**: [#449](https://github.com/open-telemetry/opentelemetry-browser/pull/449) | **Tracking Issue**: [#439](https://github.com/open-telemetry/opentelemetry-browser/issues/439)
* **Status**: **`MERGED`** into upstream `main` (Merged by maintainer overbalance / Jared Freeze)
* **The Problem**: In `packages/instrumentation/src/navigation/utils.ts`, the URL hash change detector contained redundant boolean logic that evaluated both presence and absence conditions across URL transitions.
* **The Fix**:
  - Factored down the redundant expression `((fromHasHash && toHasHash) || (!fromHasHash && toHasHash))` strictly to `toHasHash`.
  - Removed unused `fromHasHash` variable allocation.
  - Aligned the try block with catch fallback logic: `sameBase && hashesAreDifferent && notRemovingHash`.
  - **CI & Verification**: Passed EasyCLA and all 9/9 upstream CI workflows; verified across 315/315 browser unit test suites.

---

### 2. Apache Fineract Backoffice UI: Record Action Popover Teardown
* **Repository**: `apache/fineract-backoffice-ui`
* **Pull Request**: [#703](https://github.com/apache/fineract-backoffice-ui/pull/703) | **Tracking Issue**: [#586](https://github.com/apache/fineract-backoffice-ui/issues/586)
* **Status**: **`MERGED`** into upstream `main` (Merged by committer Aman-Mittal)
* **The Problem**: When navigating away from record views in the Fineract core banking UI, floating action menus and creation popovers remained mounted in the DOM as "ghost overlays," blocking interaction on subsequent pages.
* **The Fix**:
  - Implemented component unmount cleanup handlers that explicitly dismiss all floating overlays during component teardown.
  - Added unit test suites verifying unmount behavior across all 8 record view components.
  - **CI & Verification**: Passed all 31 CI workflows; verified across **411/411 Mocked Backend E2E** tests and **141/141 Real Backend E2E** tests.

---

### 3. Apache Fineract Backoffice UI: ESLint `unicorn/no-array-sort` Remediation
* **Repository**: `apache/fineract-backoffice-ui`
* **Pull Request**: [#688](https://github.com/apache/fineract-backoffice-ui/pull/688) | **Tracking Issue**: [#679](https://github.com/apache/fineract-backoffice-ui/issues/679)
* **Status**: **`MERGED`** into upstream `main` (Merged by committer Aman-Mittal)
* **The Problem**: The codebase relied on in-place mutable `.sort()` operations, violating modern immutability standards and requiring 14 suppression rules in `eslint-suppressions.json`.
* **The Fix**:
  - Replaced mutable `.sort()` with ECMAScript 2023 immutable `.toSorted()` across `DataTableComponent` and `BusinessStepsComponent`.
  - Configured `tsconfig.json` with ES2023 library typings.
  - Pruned all 14 baseline suppressions from the linter configuration.

---

### 4. Red Hat Cockpit Project: Function Keys Intercept in Web Terminal
* **Repository**: `cockpit-project/cockpit`
* **Pull Request**: [#23800](https://github.com/cockpit-project/cockpit/pull/23800) | **Tracking Issue**: [#23763](https://github.com/cockpit-project/cockpit/issues/23763)
* **Status**: **`Open`** (All integration test suites passing)
* **The Problem**: Users administering Linux servers via Cockpit's web terminal could not use Midnight Commander (`mc`), `htop`, or terminal text editors because pressing function keys (`F1–F10`) triggered native browser shortcuts (e.g. `F5` reloaded the webpage, destroying the SSH session; `F1` opened Chrome help).
* **The Fix**:
  - In `pkg/lib/cockpit-components-terminal.tsx`, attached a custom keydown handler to the `Term` instance that intercepts `F1–F10` and calls `event.preventDefault()`, allowing xterm to transmit raw ANSI escape sequences while preserving `F11` (fullscreen) and `F12` (developer tools).
  - **CI & Verification**: Passed **8/8 RPM package build matrix jobs** (CentOS Stream 9/10, Fedora 43/44/45/Rawhide) and **9/9 Red Hat Testing Farm cross-distribution integration test suites**.

---

### 5. OpenSearch Dashboards: Full-Height Embed Mode & Date Field Formatting
* **Repository**: `opensearch-project/OpenSearch-Dashboards`
* **Pull Requests**: [#12879](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/12879) & [#12880](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/12880)
* **Issues**: [#11091](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/11091) & [#8441](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/8441)
* **Status**: **`Open`** (DCO Passed, Automated Review Passed)
* **The Fixes**:
  - **PR #12879**: Detected `embed` URL query parameters and applied `.deLayout--embed`, overriding `$osdHeaderOffset` subtractions to allow embedded discover dashboards to fill full `100vh` without whitespace gaps.
  - **PR #12880**: In `table_row.tsx`, prevented line wrapping on timestamp fields by enforcing `eui-textNoWrap` on all columns of type `date`, while allowing long unstructured log text columns to wrap normally via `eui-textBreakAll`.

---

### 6. Apache Airflow: REST API Port Boundary Validation
* **Repository**: `apache/airflow`
* **Pull Request**: [#74197](https://github.com/apache/airflow/pull/74197) | **Tracking Issue**: [#68382](https://github.com/apache/airflow/issues/68382)
* **Status**: **`Open`** (CI Passed)
* **The Fix**:
  - Enforced strict numerical bounds (`ge=0, le=65535`) on the `port` field in Pydantic's `ConnectionBody` datamodel (`airflow-core/src/airflow/api_fastapi/core_api/datamodels/connections.py`).
  - Rejects out-of-range port numbers with an explicit HTTP 422 Unprocessable Entity at the FastAPI boundary before unvalidated data enters database state.

---

### 7. Apache Iggy: Node SDK System Snapshot Command
* **Repository**: `apache/iggy`
* **Pull Request**: [#4389](https://github.com/apache/iggy/pull/4389) | **Tracking Issue**: [#4331](https://github.com/apache/iggy/issues/4331) (Assigned to `rk-roshan-kr`)
* **Status**: **`Open`** (Label: `S-waiting-on-review`, Codecov: `+0.09%`)
* **The Fix**:
  - Implemented binary serialization and socket command execution for the system `snapshot` command (Code `1004`) in the TypeScript/Node SDK.
  - Added binary serialization enforcing compression bytes, snapshot type count, and array buffers.
  - Validated client-side mutual exclusivity rules preventing `SystemSnapshotType.All` from being combined with specific sub-types.
  - Achieved **100% diff coverage** across all newly authored SDK files.

---

## 3. Senior Interview & Defense Questions ("Grill Me")

### Q1: "How do you navigate and debug massive, unfamiliar open-source codebases like Airflow or OpenSearch?"
> **Roshan's Defense**: "You do not try to read 500,000 lines of code top to bottom. You start with the **reproducing test case**. First, I locate the existing unit test suite for the affected component (e.g., `test_connections.py` in Airflow or `app_container.test.tsx` in OpenSearch). I write a failing test that isolates the reported bug. Once the failure is deterministic, I trace the execution call stack backwards using breakpoint debugging and AST symbol references. Once the minimal fix is applied, I ensure that not only does my new test pass, but the entire existing regression suite passes without altering public API contracts."

### Q2: "What is your philosophy on maintainer interactions and code review feedback?"
> **Roshan's Defense**: "Maintainers are volunteer gatekeepers protecting systems used by thousands of enterprises; their time is the most constrained resource in the software industry. My rule is: **never submit a PR with failing CI, missing tests, or unformatted code**. If a maintainer requests changes, I acknowledge the review immediately, make the exact requested modifications, explain the architectural rationale concisely, and re-run all test suites locally before pushing. Zero ego, maximum velocity."
