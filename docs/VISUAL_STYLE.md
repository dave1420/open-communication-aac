# Visual style

The app should feel like a well-made personal communication tool: warm paper,
dark ink, clear keys, and one confident speech action. The communicator's words
have more visual weight than the product name.

## Reusable kit

`src/tokens.css` owns the shared colour palette, spacing scale, corner radius,
and communication control sizes. `src/styles.css` applies those values to the
actual layout. `src/icons.ts` contains the local line icons; no external fonts,
image services, or icon downloads are needed at runtime.

- Paper: `#F7F6F2`. Controls: `#FFFEFA`. Text: `#172B3A`.
- Speech action: `#165E63`, with white text. Other everyday actions use dark
  text on pale surfaces. Clear text also has a restrained red cue and a label.
- Segoe UI/system type: normal weight for help, semibold for controls, larger
  comfortable text for the message.
- Spacing uses 4, 8, 12, 16, and 24 pixel steps. Key separation remains visible.
- Panels are flat. The keyboard's subtle raised key edge supports recognition;
  it is not applied to every surrounding surface.
- Focus uses a dark three-pixel outline with separation from the control.
- Press feedback changes colour and border, never the control's position or size.

## Access and stability

Keep the established order: message and actions, two starter rows, suggestions,
QWERTY keyboard, and Quick phrases. Wide tablets place message actions alongside
the field to recover vertical space. Narrower tablets put actions below it.
The keyboard remains in the same order and does not wrap individual keys into
new rows.

Message input focus from communication controls does not scroll the page.
The message field and suggestion row reserve their space. Long messages scroll
inside the field. Live status text is announced in full to assistive technology;
long visual status text may be shortened with an ellipsis to avoid moving keys.

Communication button size applies to phrase tiles and to the height of speech,
starter, prediction, and keyboard controls. At the default Extra large setting,
phrase tiles are at least 88 pixels tall and other communication controls are at
least 64 pixels tall. At Maximum these become 104 and 80 pixels respectively.
Keyboard key width still depends on the screen and the fixed QWERTY row. Larger
settings may require scrolling; do not silently shrink targets to force a fit.

Text size is an independent, device-saved setting: Large (20 px), Extra large
(24 px), or Maximum (28 px), at the browser's default 16 px root size. Large is
the default, including for older saved profiles. Communication labels and
editing controls use that size; keyboard letters are 4 px larger and bold,
and the message is 8 px larger. Supporting hints are at least 16 px. Values
are expressed in rem so browser text preferences are respected. Branding and
footer text are secondary and do not scale with this setting.

Larger text can wrap labels and increase control heights without changing the
QWERTY order or shrinking touch targets. More scrolling may be needed. Choose
text and button sizes separately with the communicator on their actual device.
At Extra large and Maximum text sizes, medium-width screens show three starter
buttons per row rather than six so familiar words are not split across lines.
Their reading order is preserved; this reflow happens only when changing settings
or screen width, not when typing or choosing a prediction.

Pictures beside phrases can be switched off in settings, and that choice is
saved on the device. Icons always accompany words. Their recognition should be
checked with the communicator; they are not a universal language.

Clear opens an in-app confirmation with large Keep message and Clear text
buttons. Focus starts on Keep message; Escape cancels. Confirmed clearing can
be reversed with Undo.

## Review each change

Preview the real screen at tablet landscape and portrait sizes. Check an empty
message, predictions, a long message, keyboard entry, Clear and Undo, pictures
off, and the Maximum size setting. Restore any preferences changed during tests.
Check all three text sizes, saved text size after reload, long phrase wrapping,
and text size with the smallest and largest button sizes.
Check contrast, focus, overflow, and the footer. Then try the important tasks on
the intended physical device with the person who will use it.

Browser viewport checks are useful layout evidence, not proof of comfort for a
particular person with tremor or a clinical assessment.
