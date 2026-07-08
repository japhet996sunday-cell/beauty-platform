# Lumière

A premium beauty and skincare social platform, built as a fully static, framework-free front end. Instagram/TikTok-inspired interaction patterns — feed, stories, discovery, messaging — wrapped in a soft, editorial visual identity distinct from typical social app UI.

## Tech stack

- **HTML5** — semantic markup, ARIA attributes for interactive components
- **CSS3** — custom properties (design tokens), Flexbox, CSS Grid, CSS Columns (masonry)
- **Vanilla JavaScript (ES6 Modules)** — no frameworks, no build step, no dependencies

No React, no Vue, no bundler. Every page is a plain `.html` file that can be opened directly or served by any static file host.

## Getting started

Because the JS uses native ES modules, pages must be served over HTTP (not opened via `file://`) or `import`/`export` will be blocked by the browser's CORS policy for local files.

```bash
# from the project root
python3 -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000/index.html`.

## Project structure

```
lumiere/
├── index.html                Landing page
├── signin.html                Sign in
├── signup.html                 Sign up
├── forgot-password.html         Password reset request
├── home.html                     Home feed (stories + posts)
├── discover.html                  Discover (search, filters, masonry, people)
├── profile.html                    User profile (gallery grid/list)
├── create.html                      Create post (upload, caption, tags)
├── notifications.html                Notifications (grouped, filterable)
├── messages.html                      Messages (conversations + chat)
├── settings.html                       Settings (appearance, privacy, account)
│
├── css/
│   ├── styles.css              Entry point — imports every module below
│   ├── tokens.css               Design tokens: color, spacing, type, radii (light + dark)
│   ├── base.css                   Reset and base element styles
│   ├── components.css              Shared UI: buttons, inputs, cards, avatars, toggles
│   ├── navigation.css               Header, mobile drawer, bottom tab bar
│   ├── feedback.css                  Toasts, modals, skeletons, empty/error states
│   ├── landing.css                    Landing page sections
│   ├── auth.css                        Sign in / up / forgot password
│   ├── feed.css                         Stories rail, post cards, carousel
│   ├── discover.css                      Search, filter chips, masonry grid
│   ├── profile.css                        Cover, avatar, stats, gallery
│   ├── create.css                          Dropzone, image previews, composer
│   ├── notifications.css                    Notification list items
│   ├── messages.css                          Conversation list, chat window
│   └── settings.css                           Settings sections, danger zone
│
└── js/
    ├── app.js                   Global bootstrap — runs on every page
    │                            (theme init, nav wiring, ripple effect)
    ├── utils/
    │   ├── theme.js              Light/dark/system theme persistence
    │   ├── ripple.js              Button ripple effect (event delegation)
    │   ├── debounce.js             Generic debounce helper
    │   ├── format.js                Compact number formatting (1.2K, 3.4M)
    │   ├── infiniteScroll.js         IntersectionObserver-based pagination
    │   └── mockData.js                Deterministic mock data generators
    │                                  (users, posts, stories, conversations,
    │                                   chat messages, notifications)
    ├── components/
    │   ├── toast.js               Toast notification queue
    │   ├── modal.js                 Modal open/close + focus handling
    │   ├── navigation.js             Mobile drawer + theme toggle wiring
    │   ├── postCard.js                Feed post card renderer
    │   ├── feedInteractions.js         Like/comment/share/bookmark/carousel
    │   │                                (single delegated listener)
    │   ├── stories.js                   Stories rail renderer
    │   ├── storyViewer.js                Full-screen story viewer + auto-progress
    │   └── followButton.js                Follow/unfollow toggle behavior
    └── pages/
        ├── auth.js                Sign in/up/forgot-password validation
        ├── home.js                 Home feed controller
        ├── discover.js              Discover page controller
        ├── profile.js                 Profile page controller
        ├── create.js                   Create post controller
        ├── notifications.js             Notifications controller
        ├── messages.js                    Messages controller
        └── settings.js                      Settings controller
```

Each page loads `js/app.js` (shared behavior) plus its own `js/pages/*.js` controller. CSS follows the same pattern: `styles.css` imports the shared modules and every page-specific stylesheet, so a single `<link>` tag is all any page needs.

## Design system

Defined entirely in `css/tokens.css` as CSS custom properties, with a parallel `[data-theme="dark"]` override block.

| Token group | Examples |
|---|---|
| Color | `--color-bg`, `--color-ink`, `--color-accent`, `--color-gold`, `--color-danger` |
| Typography | `--font-display` (Fraunces), `--font-body` (Plus Jakarta Sans), `--fs-*` scale |
| Spacing | `--space-1` through `--space-9` (4px–96px scale) |
| Radius | `--radius-sm/md/lg`, `--radius-petal` (signature asymmetric corner), `--radius-full` |
| Motion | `--duration-fast/base/slow`, `--ease-standard`, `--ease-out` |

**Signature visual details:**
- The "petal" border radius (asymmetric corner rounding) on cards, avatars, and icon tiles
- A conic "glow ring" gradient around story avatars and the brand mark
- Fraunces (serif, display) paired with Plus Jakarta Sans (body/UI)

Dark mode is toggled via `data-theme` on `<html>` and persists to `localStorage`; Settings additionally supports a "System" option that follows the OS preference live via `matchMedia`.

## Features by page

**Landing** — hero, feature grid, community showcase, testimonials, CTA, footer.

**Auth** — sign in, sign up (with live password-strength meter), forgot password. Client-side validation with inline error states.

**Home Feed** — stories rail with a full-screen story viewer (tap/keyboard navigation, auto-advancing progress bars); infinite-scrolling post feed with skeleton loaders; sidebar follow suggestions.

**Feed cards** — avatar, username, verified badge, timestamp, multi-image carousel (arrows, dots, double-tap-to-like), caption, hashtags, like/comment/share/bookmark, comment preview. All interactions run through one delegated event listener rather than per-card listeners.

**Discover** — debounced search with empty state, category filter chips, Posts/People tabs, CSS-columns masonry grid, people grid with follow/unfollow.

**Profile** — cover image, overlapping avatar, bio, stats, Posts/Saved tabs, grid↔list gallery toggle, edit-profile modal.

**Create Post** — drag-and-drop or click-to-browse upload, live image preview grid (reorderable cover, removable tiles), caption with character counter, custom tag input, publish toggles, simulated upload progress.

**Notifications** — grouped by day, filterable by type (like/comment/follow/mention), unread highlighting, inline follow-back, mark-all-read.

**Messages** — conversation list with online-status and unread badges, searchable; chat window with message bubbles, a timed typing-indicator sequence, and mobile back-navigation between list and chat.

**Settings** — theme picker (light/dark/system), reduce-motion toggle, privacy controls, per-category notification toggles, account management, and a danger zone with a type-to-confirm delete flow.

## Architecture notes

- **No global state** — each page controller owns its own local state; shared behavior lives in small, imported utility/component modules.
- **Event delegation** — feed interactions, follow buttons, and modals all attach one listener to a container rather than one per element, so infinite-scroll-appended content works without re-binding.
- **Deterministic mock data** — `mockData.js` uses a seeded pseudo-random generator so content is stable across reloads instead of reshuffling every visit.
- **Progressive feedback** — every mutating action (like, bookmark, follow, publish, delete) confirms via a toast; destructive actions (account deletion) require explicit typed confirmation in a modal.
- **Accessibility** — skip link, semantic landmarks, `aria-label`/`aria-pressed`/`aria-selected` on interactive controls, visible focus states, `prefers-reduced-motion` respected in the base tokens.

## Browser support

Targets current versions of Chrome, Firefox, Safari, and Edge. Uses `color-mix()`, CSS nesting-free custom properties, `IntersectionObserver`, and ES modules — no polyfills included.
 
