# Communication App: Solution Options

Status: initial discovery, 2026-09-24

## Purpose

Create a free augmentative and alternative communication (AAC) tool for an adult who has lost speech after a stroke and whose hand tremor is increasing. The tool should help him express needs, choices, feelings, information, and ordinary adult conversation without treating him like a child.

This is a communication aid, not a diagnosis, therapy replacement, or guaranteed emergency-call system. A speech-language pathologist (SLP), and where useful an occupational therapist, should help assess language, vision, cognition, positioning, and the most reliable access method.

## What the evidence implies

- Stroke can affect communication through aphasia, apraxia of speech, dysarthria, cognitive-communication impairment, or a combination. These require different interface and vocabulary choices.
- Canadian Stroke Best Practices recommends SLP assessment, supported-conversation training for family, aphasia-friendly information, and assessment for AAC tools such as tablets and alphabet boards.
- AAC should be multimodal. A person may use pictures, printed words, typing, gestures, yes/no responses, and speech generation at different times.
- Motor access must be adaptable. Direct touch may work now, while switch scanning, a trackball, or eye gaze may become useful later.
- The user's established button locations should remain stable. Personalization and the ability to move to another device without losing a board are essential.

## Possible solutions

| Option                                                     | Best use                                                          | Advantages                                                                                                                                     | Limitations                                                                                                                               | Recommendation                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Configure **Cboard**                                       | Immediate trial on Windows, tablet, or phone                      | Free, open source, browser-based, picture and text-to-speech boards, many languages, Chrome offline support                                    | Its standard layouts may not sufficiently filter tremor; browser speech and offline behavior must be tested on each device                | Trial now with a small personalized board                                             |
| Configure **Weave Chat AAC**                               | Immediate trial on iOS, Android, or Kindle                        | Free, built by an SLP and engineer, adjustable grids, button/border sizes, custom words/categories and recorded audio                          | No direct Windows offering; data/sync and fine motor behavior need hands-on evaluation                                                    | Strong mobile/tablet trial                                                            |
| Printed communication board/book                           | Always-available backup                                           | Cheap, no battery, no login, very reliable, can use large pictures and yes/no choices                                                          | No generated speech; slower vocabulary navigation                                                                                         | Mandatory companion to any app                                                        |
| Custom offline-first **Progressive Web App (PWA)**         | A free tool for the widest public audience                        | One codebase for Windows, macOS, Android, iPad/iPhone, Chromebook, and browsers; installable; can work offline; easiest public distribution    | Browser text-to-speech voices and assistive-input behavior vary; iOS offline/PWA testing requires care                                    | Best overall product direction                                                        |
| Native **Windows 11 WinUI 3** app                          | A Windows tablet or PC dedicated to the communicator              | Excellent Windows touch, keyboard, Narrator, high-contrast, eye-control integration, and installed system voices; dependable offline operation | Windows only; separate work would be needed for phones and iPads                                                                          | Best if the father's primary device is Windows and speed for him outranks broad reach |
| Cross-platform native app using Flutter or React Native    | App-store-focused mobile product                                  | Strong Android/iOS packaging and device integration; one mostly shared codebase                                                                | More deployment, signing, store, accessibility, and platform QA work; desktop support is less uniform                                     | Consider after the interaction design is proven                                       |
| Fork an existing open-source AAC project                   | Faster route to a feature-rich product                            | Reuses board editing, vocabulary, symbols, and speech work                                                                                     | Larger unfamiliar codebase; inherited interface may not suit post-stroke aphasia or tremor; licence obligations apply (Cboard is GPL-3.0) | Investigate only after hands-on trials identify exact gaps                            |
| Dedicated speech-generating device/commercial AAC software | When clinical assessment indicates specialized hardware or access | Professional mounting, switches, eye gaze, support, and established vocabularies may be available                                              | Cost, vendor lock-in, and customization constraints                                                                                       | Keep as a clinical option; a free app should not displace a better-fit device         |

## Recommended path

### 1. Help now: a two-week trial

1. With his consent, create the same small board in Cboard and, if a compatible tablet is available, Weave Chat.
2. Create a matching laminated paper board.
3. Start with a few high-value messages chosen by him, not a large generic vocabulary.
4. Observe real conversations at different times of day. Record only usability notes, not private messages.
5. Ask an SLP to help determine whether he benefits most from pictures, written words, typing, spelling, yes/no choices, or a mixture. Ask an occupational therapist about positioning, touch, stylus, keyguard, trackball, and switch access if tremor is a significant barrier.

Example initial content: yes, no, wait, say that again, I do not understand, pain, bathroom, hungry, thirsty, hot, cold, tired, reposition me, call [person], and a way to indicate where/how severe discomfort is. He should approve the words, pictures, and organization.

### 2. Build a focused prototype only after observing the trial

The first custom version should contain:

- A stable home board with two to four columns and adjustable, very large targets.
- Text plus optional adult-appropriate pictures or personal photos.
- A message strip with Speak, Repeat, Undo/Backspace, and a protected Clear action.
- A separate typing view with word/phrase prediction only if reading and spelling remain useful.
- Personal phrases, names, places, care needs, feelings, and ordinary social conversation.
- Fully offline operation with installed-device text-to-speech.
- Local autosave and simple backup/restore.
- Open Board Format (`.obf`/`.obz`) import/export so a person's vocabulary is portable.
- Caregiver editing behind an intentional, tremor-safe action, while communication remains one-tap simple.
- No account, advertising, analytics, cloud AI, or message logging by default.

### 3. Treat tremor support as a core feature

- Make frequent targets substantially larger than platform minimums; begin testing around 64--96 effective pixels with generous gaps, then let the user choose.
- Activate on pointer/touch release, allowing a finger to slide off to cancel.
- Provide an adjustable post-selection lockout/debounce period to reduce repeated taps.
- Offer optional dwell-to-select and adjustable dwell time, but never force it.
- Avoid drag, double-tap, swipe-only, small edge controls, and long-press as the only route to an action.
- Keep navigation and tile locations predictable; never reorder the board automatically.
- Make destructive actions reversible or confirmable, and keep them away from frequent controls.
- Support touch, mouse/trackball, keyboard, switch scanning, and eye gaze through the same logical focus order.
- Offer high contrast, large text, reduced motion, volume/voice/rate controls, and left/right-hand layouts.

## Suggested product architecture

Start with a local-only PWA and a portable board-data layer:

1. **Presentation:** responsive, stable grid; aphasia-friendly text and images; accessible HTML controls.
2. **Access layer:** direct touch, keyboard, switch scanning, dwell, and tremor filtering as selectable profiles.
3. **Communication:** local text-to-speech, recorded clips where desired, and a visible message strip.
4. **Data:** local encrypted-at-rest storage where supported, explicit export/import, and Open Board Format compatibility.
5. **Optional packaging:** install as a PWA first; add a Windows Store/native wrapper or a native WinUI edition only when testing proves a platform gap.

This separates a person's vocabulary from the app. If a device breaks or the project ends, their communication board can move elsewhere.

## Decisions to make after the first trial

- Which device and screen size is easiest for him to position and reach?
- Does he reliably recognize words, photographs, pictograms, or a combination?
- How many choices can appear at once without slowing comprehension or increasing errors?
- Does he prefer single phrases, phrase building, spelling, or several modes?
- What target size, spacing, release behavior, and lockout time work during both good and shaky periods?
- Which voice, speaking rate, and volume feel like his own choice?
- Does he need English only or additional languages?
- Can he intentionally use a keyboard key, external switch, trackball, stylus, or eye gaze if touch becomes unreliable?
- Who may edit and back up the board, and how is his privacy and control preserved?

## Success criteria for a prototype

- He can produce ten personally important messages without coaching.
- Accidental selections and repeated selections are measured and reduced to an acceptable level chosen with him.
- He can cancel or undo a wrong selection.
- The same core task works offline by touch, mouse/trackball, and keyboard/switch input.
- A family member can customize and back up the board without changing its established layout accidentally.
- Loss of internet, app restart, or device replacement does not erase the vocabulary.
- The printed backup is available and understandable.

## Sources

- [Canadian Stroke Best Practices: Language and Communication](https://www.strokebestpractices.ca/recommendations/stroke-rehabilitation-delivery/7-language-and-communication)
- [ASHA: Augmentative and Alternative Communication](https://www.asha.org/Practice-Portal/Professional-Issues/Augmentative-and-Alternative-Communication/)
- [Aphasia Institute: Supported Conversation for Adults With Aphasia](https://www.aphasia.ca/communication-tools-communicative-access-sca/)
- [Aphasia Institute: ParticiPics](https://www.aphasia.ca/participics/)
- [Cboard](https://www.cboard.io/en/)
- [Weave Chat AAC](https://www.weavechat.com/)
- [Open Board Format](https://www.openboardformat.org/)
- [Microsoft: Touch interactions](https://learn.microsoft.com/en-us/windows/apps/develop/input/touch-interactions)
- [W3C: What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C: Pointer Cancellation](https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation)
