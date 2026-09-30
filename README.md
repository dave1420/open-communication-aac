# Open Communication AAC

An early, offline-first, tremor-aware augmentative and alternative communication (AAC) application. The project aims to provide a free communication aid for adults who have difficulty speaking, beginning with needs identified after stroke.

This repository is in discovery and prototype development. It is not a medical device, a substitute for assessment by a speech-language pathologist, or a guaranteed emergency-call system.

Current release candidate: **0.1.0**. See [CHANGELOG.md](CHANGELOG.md).

## Current prototype

- Large, adjustable phrase targets
- Adjustable repeat-tap protection
- Optional one-tap speech
- A physical/native keyboard path and a large on-screen keyboard
- An always-visible on-screen keyboard with Quick phrases below it
- Local word suggestions that never send message text to a server
- Two large rows of common sentence starters and frequently needed words
- Contextual next-word suggestions after starters such as "I need" and "I am"
- One editable message field shared by physical typing, starters, predictions, quick phrases, and the on-screen keyboard
- A protected Clear text control beside the message field
- Message composition, repeat, undo, and protected clear
- Keyboard, pointer, and touch-compatible native controls
- Local preferences without saved conversation history
- Installable web-app metadata and offline caching
- Light, dark-system-independent high-contrast-safe styling

The initial phrases are placeholders for usability testing. A communicator should choose their own vocabulary, photographs, symbols, voice, layout, and access method with appropriate clinical and family support.

## Run locally

Requirements: Node.js 22 or newer.

```powershell
npm install
npm run dev
```

Validation:

```powershell
npm test
npm run build
npm run format:check
```

For production-like offline testing, run `npm run build`, then `npm run preview`. Visit the app once while online before disconnecting because the service worker must cache the application shell and built assets.

## Project principles

- Respect adult competence and personal agency.
- Design with the communicator, not merely for them.
- Keep core communication available offline.
- Make accidental activation preventable and reversible.
- Support multiple access methods and changing motor ability.
- Keep vocabulary portable using open formats.
- Collect no communication content or analytics by default.
- Maintain a low-tech backup.

See [SOLUTION_OPTIONS.md](SOLUTION_OPTIONS.md) for the evaluated approaches and [docs/PRODUCT_PRINCIPLES.md](docs/PRODUCT_PRINCIPLES.md) for product boundaries.

## Status and licence

This project is free and open source under the [Mozilla Public License 2.0](LICENSE). Changes to covered files must remain available under MPL-2.0 when distributed. Third-party components retain their own licences; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
