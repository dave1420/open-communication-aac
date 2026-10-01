# Changelog

All notable project changes will be recorded here. Versions use Semantic Versioning.

## Unreleased

- Independent saved text sizes (20, 24, or 28 px labels), with larger bold keyboard letters and message text.
- Existing saved profiles receive larger default lettering without resetting button, voice, or access preferences.
- A quieter visual design with compact branding, flat warm surfaces, and clear speech-action hierarchy.
- Wide tablet message controls beside the field; preserved starter and QWERTY order.
- Reserved message and prediction space, stronger focus outlines, and stationary pressed feedback.
- Communication size settings now cover starters, predictions, speech controls, and keyboard keys as well as phrases.
- Optional local line pictures beside phrase words, with a saved text-only preference.
- Corrected footer spacing and matching installation colours.
- Clear confirmation uses large in-app buttons, a safe default focus, and recoverable Undo.
- A reusable visual style kit and tablet review guide in `docs/VISUAL_STYLE.md`.

## 0.1.0 - Release candidate

Initial accessible AAC prototype:

- One editable message field shared by every input method.
- Local text-to-speech using the browser or device voice.
- Selectable installed/online voices with adjustable rate, pitch, and a safe preview phrase.
- Large on-screen QWERTY keyboard and physical/device keyboard support.
- Large common-starter and frequently needed word controls.
- Local prefix completion and contextual next-word suggestions.
- Expanded offline vocabulary using AAC-priority words plus common SCOWL English and Canadian frequency bands.
- Quick communication phrases for essential needs and conversation.
- Device-only custom phrase buttons with add, remove, and immediate undo controls.
- Caregiver editing mode that keeps settings and phrase-management controls out of everyday communication.
- Sticky message and speech controls that remain available while navigating the board.
- A calmer tablet-first visual system with warmer surfaces, teal primary actions, softer grouping, and preserved control positions.
- Adjustable phrase-grid columns, target size, repeat-tap protection, and optional phrase speech.
- Speak, Repeat, Undo, Backspace, punctuation, and protected Clear text controls.
- Responsive layouts, visible focus, reduced-motion support, and high-contrast-safe borders.
- Intact, centred QWERTY rows at tablet widths without breakpoint-induced key reordering.
- Offline application shell, installable web-app metadata, and local-only preferences.
- No account, analytics, advertising, cloud AI, or retained conversation history.
- Automated interaction-logic tests and GitHub Actions validation.

Known limitations:

- Starter vocabulary is provisional and must be personalized with the communicator.
- Word prediction is English-only and deterministic in this release.
- Switch scanning, dwell selection, eye-gaze-specific testing, full board editing, and Open Board Format import/export are not yet implemented.
- Offline updates currently may require a second refresh while the new application shell replaces the previous cache.
- This release must not be the only means of requesting emergency assistance.
