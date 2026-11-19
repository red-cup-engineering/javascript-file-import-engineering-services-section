# javascript-file-import-engineering-services-section

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

Groups independently packaged transformations over JavaScript file imports.

## Admitted ESM reference evidence

The file reader uses the existing JavaScript parser and shared module-site API, not the removed JavaScriptNode audit scanner. Static imports/reexports, literal dynamic imports and direct literal `import.meta.resolve` retain authored ordering and quote-interior UTF-16 offsets. Specifiers are decoded JavaScript string values; source slices can therefore differ when escapes are authored. CommonJS requests and computed expressions are outside this ESM-only profile. No resolution or execution occurs.

Unlike the former heuristic scan, malformed or parser-unsupported syntax refuses instead of yielding partial import evidence. The real installed-package inspector already runs native syntax checks and skips invalid files before reading references; parser limits remain explicit rather than a conformant empty closure. The NDJSON face uses the current Function owner.

This source prerequisite is qualified with authentic local source/archive suppliers; existing declared historical suppliers and registry availability are not a frozen installation or release claim.
