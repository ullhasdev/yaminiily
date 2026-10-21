import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ============================================================================
 * PROJECT LOVE.EXE
 * A Gloomy Coquette × MS Paint × Windows 2000 Personal Confession Website
 * ============================================================================
 *
 * STRICT PALETTE TOKENS:
 *   --paper-white:     #FFFFFF
 *   --porcelain-ivory: #F8F4F3
 *   --ink-black:       #171419
 *   --pure-black:      #000000
 *   --hot-pink:        #F01483
 *   --dusty-rose:      #DABBC4
 *   --faded-mauve:     #A88D9A
 *   --ash-grey:        #777078
 *   --pale-blush:      #F1E3E7
 *   --windows-blue:    #0A246A
 *
 * CUSTOMIZABLE CONTENT FILES (public/content/*.txt):
 *   1. public/content/homepage.txt
 *   2. public/content/ten_things.txt
 *   3. public/content/letter.txt
 *   4. public/content/confession.txt
 *   5. public/content/responses.txt
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. DEFAULT UTF-8 PLAIN TEXT CONTENT FILES (public/content/*.txt)
// ----------------------------------------------------------------------------
const DEFAULT_CONTENT_FILES = {
  'homepage.txt': `heading: for you, if you're still awake...
subtitle: [p.s.: i started making this at 1:24am of 15 oct and ill be meeting you tomm lol.]
top_note: saved in: C:\\My Documents\\for_you\\love_note.bmp
middle_note: (please read these in order... start with Z)
footer_note: handmade for one person only. best viewed at 2:00 am.
z_key: Z
z_label: 10 things I love about you
z_hint: ← start here first
y_key: Y
y_label: click here
y_hint: (read after Z...)
x_key: X
x_label: click here after you read all this
x_hint: (save this one for last)`,

  'ten_things.txt': `# Edit each numbered entry below (1 through 10).
# Multi-line thoughts are supported inside each numbered block.
# Never use HTML tags — all text is rendered safely as plain text.

1.  Your music taste, because i genuinely got so happy when you told me that you have similar taste hehe
---
2.  The way you are irl, like you were so niceeee to me when we met irl 😭
---
3.  You were with me at my lowest and i realy appreciate that
---
4.  Your aesthetics and vibe :3 (if you havent noticed, i tried to make the website like your aesthetics)
---
5.  Your family, like i was wondering HOW CAN SOMEONE HAS THIS COOL FAMILY, LIKE YOUR SIS, BUA AND MUM ARE SO COOL IRL
---
6.  Your voice, like i know you're insecure about it but i genuinely find it sweet and pretty unique
---
7.  The way you react when i tell you stuff, like no girl has ever listened to me that well as much as you did >w< 
---
8.  When you were with me in the garba while knowing the fact that you'll rarely meet your school friends again
---
9.  The way you said that you missed me even when i texted you after i ignored you for the entire day 😭
---
10. Everything, like i love everything about you and these are just a few top 10/9 of them :3 `,

  'letter.txt': `something I wanted to tell you...

  Beloved yamini,

 YOU ABSOLUTELY DONT KNOW HOW BADLY I LIKE YOU, like you're the most awesome person i have ever met and i think the thing i feel for you is something above friendship (i hope ykw i mean 😭)


 You'll be wondering why didnt i simply said it in texts, but according to me those are pretty uncool, like saying it in texts and making an entire website for it are different things and you deserve more than a simple text 😭😭😭

 Also im a bit shy to say it but i started to realllyyyyyyyyyyyy like you since we started talking and i have like never felt this way before compared to how i feel being with you 😭😭😭😭😭😭, like dyk that i got reallllllyy impressed when you said albert camus when i mentioned about the absurd, like ARRAGRAHRGARGHHHHHHHHH >o<

 You met me at a very strange time in my life, and im SO glad that i met you, like i dont know what ill be without you, like i dont have friends as good as you and I also hope that you like this letter 😭😭
 (p.s.: scroll very down and play the music before you switch to another page hehe)

 Always yours, 
— Ullhas `,

  'confession.txt': `heading: one last thing before you close this window...
body: I really like you and see you more as a friend, I wish you feel the same way i feel for you 😭💗

I am not forcing you and its really upto you :3

question: Can i be your boyfriend?
quiet_note: Take all the time you need ^^ `,

  'responses.txt': `accept_label: Yes, I'd like that.
accept_title: YOU REALLY DONT KNOW HOW MUCH HAPPY THAT MAKES ME
accept_message: I reallllyy appreciate that you feel the same way that i do for you and idk what to say 😭😭😭😭😭
decline_label: Not that way, but thank you.
decline_title: ERROR 404, button not working
decline_message: ERROR 404`,

  'README.txt': `======================================================================
PROJECT LOVE.EXE — HOW TO CUSTOMIZE YOUR CONTENT FILES
======================================================================

All personal writing lives in plain UTF-8 text files inside:
  public/content/

You never need to edit React components or CSS code to personalize this
website. Simply edit the five text files below in any plain-text editor
(such as Notepad, TextEdit, or VS Code), save as UTF-8, and refresh.

1. public/content/homepage.txt
   - Format: key: value lines (heading, subtitle, top_note, middle_note,
     footer_note, z_key, z_label, z_hint, y_key, y_label, y_hint,
     x_key, x_label, x_hint).

2. public/content/ten_things.txt
   - Format: Separate each of the 10 reasons with a line containing "---".
   - Lines starting with "#" are ignored as comments.
   - Multi-line entries and leading numbers ("1. ...") are supported.

3. public/content/letter.txt
   - Format: Freeform plain text.
   - If the first line is followed by a blank line, it is used as the
     letter title (default: "something I wanted to tell you...").
   - Every paragraph break and intentional blank line is preserved.
   - The final paragraph or lines starting with "—" / "-" are styled
     gently as your handwritten signature.

4. public/content/confession.txt
   - Format: key: value sections (heading, body, question, quiet_note).
   - Multi-paragraph text under "body:" is supported until "question:".

5. public/content/responses.txt
   - Format: key: value lines (accept_label, accept_title, accept_message,
     decline_label, decline_title, decline_message).

SECURITY & SAFETY NOTE:
- All text files are rendered strictly as plain text nodes.
- HTML tags (like <script> or <img>) are never executed and will appear
  harmlessly as literal characters.`
};

const STORAGE_PREFIX = 'project_love_exe_content_v1_';

// ----------------------------------------------------------------------------
// 2. CONTENT FILE PARSERS (SAFE PLAIN-TEXT PARSING, ZERO HTML INJECTION)
// ----------------------------------------------------------------------------

function parseHomepageTxt(raw) {
  if (!raw || !raw.trim()) return null;
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const data = {
    heading: "for you, if you're still awake...",
    subtitle: '',
    top_note: 'C:\\My Documents\\love_note\\index.htm',
    middle_note: '(read in order: Z → Y → X)',
    footer_note: '',
    z_key: 'Z',
    z_label: '10 things I love about you',
    z_hint: '← start here',
    y_key: 'Y',
    y_label: 'click here',
    y_hint: '(after Z...)',
    x_key: 'X',
    x_label: 'click here after you read all this',
    x_hint: '(read last)'
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).trim();
      if (key in data) {
        data[key] = val;
      }
    }
  }
  return data;
}

function parseTenThingsTxt(raw) {
  if (!raw || !raw.trim()) return null;
  const cleanedLines = raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'));
  const joined = cleanedLines.join('\n').trim();
  if (!joined) return null;

  let blocks = [];
  if (joined.includes('\n---')) {
    blocks = joined
      .split(/\n---\s*\n?/)
      .map((b) => b.trim())
      .filter(Boolean);
  } else {
    blocks = joined
      .split(/\n(?=\d+[\.\)]\s)/)
      .map((b) => b.trim())
      .filter(Boolean);
  }

  return blocks.map((block, index) => {
    const match = block.match(/^(\d+)[\.\)]\s*([\s\S]*)$/);
    if (match) {
      return {
        number: match[1],
        text: match[2].trim()
      };
    }
    return {
      number: String(index + 1),
      text: block
    };
  });
}

function parseLetterTxt(raw) {
  if (!raw || !raw.trim()) return null;
  const normalized = raw.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  let title = 'something I wanted to tell you...';
  let startIdx = 0;

  if (lines.length >= 2 && lines[0].trim() !== '' && lines[1].trim() === '') {
    title = lines[0].trim();
    startIdx = 2;
  }

  const bodyLines = lines.slice(startIdx);
  return {
    title,
    lines: bodyLines
  };
}

function parseConfessionTxt(raw) {
  if (!raw || !raw.trim()) return null;
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const result = {
    heading: 'one last thing...',
    bodyParagraphs: [],
    question: 'Would you like to go out with me sometime?',
    quiet_note: ''
  };

  let currentKey = null;
  let bodyBuffer = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) continue;

    const keyMatch = line.match(/^(heading|body|question|quiet_note):\s*(.*)$/);
    if (keyMatch) {
      const [, key, val] = keyMatch;
      currentKey = key;
      if (key === 'body') {
        if (val.trim()) bodyBuffer.push(val.trim());
      } else {
        result[key] = val.trim();
      }
    } else if (currentKey === 'body') {
      bodyBuffer.push(line);
    }
  }

  const rawBody = bodyBuffer.join('\n').trim();
  result.bodyParagraphs = rawBody
    ? rawBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return result;
}

function parseResponsesTxt(raw) {
  if (!raw || !raw.trim()) return null;
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const result = {
    accept_label: "Yes, I'd like that.",
    accept_title: 'thank you.',
    accept_message: '',
    decline_label: 'Not that way, but thank you.',
    decline_title: 'thank you for telling me honestly.',
    decline_message: ''
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).trim();
      if (key in result) {
        result[key] = val;
      }
    }
  }
  return result;
}

// ----------------------------------------------------------------------------
// 3. ORIGINAL HAND-DRAWN SVG ILLUSTRATIONS (STRICT HEX TOKENS ONLY)
// ----------------------------------------------------------------------------

/**
 * Hand-drawn MS Paint Heart with vivid #F01483 fill and thick, uneven #000000 outline
 */
function MsPaintHeart({ variant = 1, size = 44, className = '', title = 'Hand-drawn hot pink heart' }) {
  const paths = {
    1: 'M 25 43 C 21 39, 5 29, 5 16 C 5 8, 12 4, 18 7 C 22 9, 24 14, 25 16 C 26 13, 29 7, 35 6 C 42 5, 46 11, 45 19 C 44 30, 29 39, 25 43 Z',
    2: 'M 24 44 C 19 38, 4 27, 6 14 C 7 6, 15 4, 20 8 C 23 11, 24 15, 25 17 C 27 12, 31 6, 37 7 C 44 8, 46 15, 43 23 C 40 32, 28 40, 24 44 Z',
    3: 'M 26 42 C 20 38, 6 28, 7 15 C 8 8, 14 5, 20 9 C 23 11, 25 15, 25 17 C 26 14, 30 8, 36 8 C 42 8, 45 14, 43 21 C 41 30, 30 39, 26 42 Z'
  };
  const d = paths[variant] || paths[1];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Vivid marker-pink fill (#F01483) and thick MS Paint black brush outline (#000000) */}
      <path
        d={d}
        fill="var(--hot-pink)"
        stroke="var(--pure-black)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Imperfect second MS Paint stroke near top edge for authentic hand-drawn weight */}
      <path
        d="M 11 14 C 12 10, 16 9, 19 11"
        stroke="var(--pure-black)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Tiny white pixel-like paper gap inside heart */}
      <path
        d="M 35 12 C 37 12, 39 14, 38 17"
        stroke="var(--paper-white)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Dusty-Rose Satin Ribbon Bow (#DABBC4 fill, #171419 ink outline)
 */
function DustyRoseRibbon({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.78)}
      viewBox="0 0 80 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left Ribbon Tail */}
      <path
        d="M 36 28 C 31 39, 23 49, 15 58 L 23 56 L 26 60 C 32 49, 37 39, 40 30 Z"
        fill="var(--dusty-rose)"
        stroke="var(--ink-black)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right Ribbon Tail */}
      <path
        d="M 44 28 C 49 38, 56 49, 64 59 L 57 55 L 53 60 C 48 49, 43 38, 40 30 Z"
        fill="var(--dusty-rose)"
        stroke="var(--ink-black)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left Bow Loop */}
      <path
        d="M 37 24 C 26 11, 8 10, 7 23 C 6 35, 24 36, 37 27 Z"
        fill="var(--dusty-rose)"
        stroke="var(--ink-black)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Right Bow Loop */}
      <path
        d="M 43 24 C 54 11, 72 11, 73 24 C 74 36, 55 36, 43 27 Z"
        fill="var(--dusty-rose)"
        stroke="var(--ink-black)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Crease Details */}
      <path
        d="M 21 22 C 26 23, 31 24, 35 25 M 59 22 C 54 23, 49 24, 45 25"
        stroke="var(--ink-black)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Center Knot */}
      <path
        d="M 36 21 C 39 19, 42 19, 44 21 C 46 24, 45 28, 43 30 C 40 31, 37 31, 35 29 C 34 26, 34 23, 36 21 Z"
        fill="var(--dusty-rose)"
        stroke="var(--ink-black)"
        strokeWidth="2.2"
      />
    </svg>
  );
}

/**
 * Faded Mauve Melancholic Rose (#A88D9A petals, #171419 fine ink sketch lines)
 */
function FadedMauveRose({ size = 58, className = '', flip = false }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      {/* Drooping Stem */}
      <path
        d="M 32 36 C 31 49, 27 61, 22 75"
        stroke="var(--ink-black)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Small Thorns */}
      <path
        d="M 30 48 L 26 46 M 27 60 L 31 59"
        stroke="var(--ink-black)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Faded Leaf */}
      <path
        d="M 29 52 C 19 49, 13 54, 15 60 C 21 61, 26 57, 29 52 Z"
        fill="var(--faded-mauve)"
        stroke="var(--ink-black)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Rose Outer Petals */}
      <path
        d="M 20 24 C 14 16, 22 7, 33 9 C 45 8, 51 18, 45 27 C 41 34, 25 35, 20 24 Z"
        fill="var(--faded-mauve)"
        stroke="var(--ink-black)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Rose Inner Swirl */}
      <path
        d="M 25 19 C 28 14, 37 14, 39 20 C 40 25, 32 27, 28 23 C 26 20, 31 17, 34 19"
        stroke="var(--ink-black)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Fallen Petal */}
      <path
        d="M 42 54 C 46 52, 50 56, 47 60 C 44 62, 40 58, 42 54 Z"
        fill="var(--faded-mauve)"
        stroke="var(--ink-black)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Uneven Hand-Drawn Black Scribble Divider (#000000)
 */
function HandDrawnDivider({ variant = 1, className = '' }) {
  return (
    <div className={`w-full overflow-hidden my-3 ${className}`} aria-hidden="true">
      {variant === 1 && (
        <svg viewBox="0 0 800 18" className="w-full h-4" preserveAspectRatio="none">
          <path
            d="M 2 9 C 85 5, 160 13, 255 8 C 350 4, 440 14, 545 8 C 640 4, 720 12, 798 7"
            stroke="var(--pure-black)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 18 12 C 140 9, 290 13, 420 10 C 570 7, 680 13, 785 10"
            stroke="var(--pure-black)"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
      {variant === 2 && (
        <svg viewBox="0 0 800 22" className="w-full h-5" preserveAspectRatio="none">
          <path
            d="M 4 11 C 70 15, 145 6, 230 12 C 325 16, 405 6, 500 11 C 600 15, 695 7, 796 12"
            stroke="var(--pure-black)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
      {variant === 3 && (
        /* Lace-inspired scalloped ink divider */
        <svg viewBox="0 0 600 24" className="w-full h-5" preserveAspectRatio="none">
          <path
            d="M 2 6 L 598 7"
            stroke="var(--ink-black)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 2 7 Q 15 20 30 7 Q 45 20 60 7 Q 75 20 90 7 Q 105 20 120 7 Q 135 20 150 7 Q 165 20 180 7 Q 195 20 210 7 Q 225 20 240 7 Q 255 20 270 7 Q 285 20 300 7 Q 315 20 330 7 Q 345 20 360 7 Q 375 20 390 7 Q 405 20 420 7 Q 435 20 450 7 Q 465 20 480 7 Q 495 20 510 7 Q 525 20 540 7 Q 555 20 570 7 Q 585 20 598 7"
            stroke="var(--ink-black)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Rough Black Ink Underline for Handwritten Links
 */
function RoughUnderline({ active = false }) {
  return (
    <svg
      viewBox="0 0 260 12"
      className="w-full h-3 mt-0.5 overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 2 6 C 55 10, 125 3, 190 8 C 220 10, 245 4, 258 6"
        stroke="var(--pure-black)"
        strokeWidth={active ? '3.2' : '2'}
        strokeLinecap="round"
        fill="none"
      />
      {active && (
        <path
          d="M 8 10 C 80 6, 165 11, 252 8"
          stroke="var(--pure-black)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

// ----------------------------------------------------------------------------
// 4. OPTIONAL 2:00 AM MUSIC BOX SYNTHESIZER (WEB AUDIO API, USER-INITIATED)
// ----------------------------------------------------------------------------
function useMusicBox() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Delicate, melancholic music-box notes (A minor / F major lullaby progression)
      const melody = [
        440.0, 523.25, 659.25, 587.33, 523.25, 493.88, 440.0, 392.0,
        349.23, 440.0, 523.25, 493.88, 440.0, 329.63, 349.23, 329.63
      ];
      let step = 0;

      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(melody[step % melody.length], now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.5);
        step += 1;
      };

      playChime();
      intervalRef.current = setInterval(playChime, 950);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying, stopMusic]);

  useEffect(() => {
    return () => stopMusic();
  }, [stopMusic]);

  return { isPlaying, toggleMusic };
}

// ----------------------------------------------------------------------------
// 5. MAIN APPLICATION COMPONENT
// ----------------------------------------------------------------------------
export default function App() {
  // Normalize initial route from window.location.pathname
  const getInitialRoute = () => {
    const path = (window.location.pathname || '/').toLowerCase();
    if (path === '/z' || path.endsWith('/z')) return '/z';
    if (path === '/y' || path.endsWith('/y')) return '/y';
    if (path === '/x' || path.endsWith('/x')) return '/x';
    return '/';
  };

  const [route, setRoute] = useState(getInitialRoute);
  const [historyStack, setHistoryStack] = useState([getInitialRoute()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Content files state loaded via fetch('/content/*.txt') + localStorage override
  const [contentFiles, setContentFiles] = useState(() => {
    const initial = { ...DEFAULT_CONTENT_FILES };
    try {
      Object.keys(DEFAULT_CONTENT_FILES).forEach((filename) => {
        const saved = localStorage.getItem(STORAGE_PREFIX + filename);
        if (saved !== null) {
          initial[filename] = saved;
        }
      });
    } catch {
      // Ignore storage access errors in restricted environments
    }
    return initial;
  });

  // Track if external static files exist in public/content/
  const [loadStatus, setLoadStatus] = useState('loaded');

  // Selected response on X page
  const [selectedResponse, setSelectedResponse] = useState(null);

  // Retro Notepad.exe modal state for inspecting/editing public/content/*.txt
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [activeFileTab, setActiveFileTab] = useState('letter.txt');
  const [editorDraft, setEditorDraft] = useState('');
  const [saveNotice, setSaveNotice] = useState('');

  // Hover state for homepage links
  const [hoveredChoice, setHoveredChoice] = useState(null);

  // End-of-content detection states for Z and Y pages
  const [zEndReached, setZEndReached] = useState(false);
  const [yEndReached, setYEndReached] = useState(false);
  const zSentinelRef = useRef(null);
  const ySentinelRef = useRef(null);

  // Optional 2:00 AM music box
  const { isPlaying, toggleMusic } = useMusicBox();

  // Attempt to load static files from /content/<filename> on mount if no local override is set
  useEffect(() => {
    let isMounted = true;
    const filenames = ['homepage.txt', 'ten_things.txt', 'letter.txt', 'confession.txt', 'responses.txt'];

    async function fetchStaticFiles() {
      const updates = {};
      for (const file of filenames) {
        try {
          const hasLocalOverride = localStorage.getItem(STORAGE_PREFIX + file) !== null;
          if (hasLocalOverride) continue;

          const res = await fetch(`/content/${file}`, { cache: 'no-store' });
          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            // Ensure we didn't get an SPA HTML fallback page
            if (!contentType.includes('text/html')) {
              const text = await res.text();
              if (text && !text.trim().toLowerCase().startsWith('<!doctype html')) {
                updates[file] = text;
              }
            }
          }
        } catch {
          // Static server doesn't have /content/<file>; keep bundled content file
        }
      }
      if (isMounted && Object.keys(updates).length > 0) {
        setContentFiles((prev) => ({ ...prev, ...updates }));
      }
      if (isMounted) setLoadStatus('ready');
    }

    fetchStaticFiles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize with browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.route) {
        setRoute(event.state.route);
      } else {
        setRoute(getInitialRoute());
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate to a route and push to browser history
  const navigateTo = useCallback(
    (targetRoute) => {
      setRoute(targetRoute);
      try {
        window.history.pushState({ route: targetRoute }, '', targetRoute);
      } catch {
        // Ignore pushState restrictions in sandboxed iframes
      }
      setHistoryStack((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, targetRoute];
      });
      setHistoryIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [historyIndex]
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const target = historyStack[nextIdx];
      setHistoryIndex(nextIdx);
      setRoute(target);
      try {
        window.history.pushState({ route: target }, '', target);
      } catch {}
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      try {
        window.history.back();
      } catch {}
    }
  }, [historyIndex, historyStack]);

  const goForward = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = historyStack[nextIdx];
      setHistoryIndex(nextIdx);
      setRoute(target);
      try {
        window.history.pushState({ route: target }, '', target);
      } catch {}
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      try {
        window.history.forward();
      } catch {}
    }
  }, [historyIndex, historyStack]);

  // IntersectionObserver for end-of-content detection on Z and Y pages
  useEffect(() => {
    if (route === '/z') {
      setZEndReached(false);
      const node = zSentinelRef.current;
      if (!node || typeof IntersectionObserver === 'undefined') {
        setZEndReached(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setZEndReached(true);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }

    if (route === '/y') {
      setYEndReached(false);
      const node = ySentinelRef.current;
      if (!node || typeof IntersectionObserver === 'undefined') {
        setYEndReached(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setYEndReached(true);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [route, contentFiles]);

  // Notepad.exe Editor Handlers
  const openNotepad = (filename = 'letter.txt') => {
    setActiveFileTab(filename);
    setEditorDraft(contentFiles[filename] ?? '');
    setSaveNotice('');
    setIsNotepadOpen(true);
  };

  const switchNotepadTab = (filename) => {
    setActiveFileTab(filename);
    setEditorDraft(contentFiles[filename] ?? '');
    setSaveNotice('');
  };

  const saveNotepadFile = () => {
    setContentFiles((prev) => ({
      ...prev,
      [activeFileTab]: editorDraft
    }));
    try {
      localStorage.setItem(STORAGE_PREFIX + activeFileTab, editorDraft);
    } catch {}
    setSaveNotice(`Saved public/content/${activeFileTab} (UTF-8)`);
  };

  const resetCurrentFile = () => {
    const def = DEFAULT_CONTENT_FILES[activeFileTab] || '';
    setEditorDraft(def);
    setContentFiles((prev) => ({
      ...prev,
      [activeFileTab]: def
    }));
    try {
      localStorage.removeItem(STORAGE_PREFIX + activeFileTab);
    } catch {}
    setSaveNotice(`Restored default public/content/${activeFileTab}`);
  };

  const downloadCurrentFile = () => {
    const blob = new Blob([editorDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFileTab;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Parse all 5 content files safely
  const homepageData = parseHomepageTxt(contentFiles['homepage.txt']);
  const tenThingsData = parseTenThingsTxt(contentFiles['ten_things.txt']);
  const letterData = parseLetterTxt(contentFiles['letter.txt']);
  const confessionData = parseConfessionTxt(contentFiles['confession.txt']);
  const responsesData = parseResponsesTxt(contentFiles['responses.txt']);

  // Page-specific background token (#FFFFFF for / and /x, #F8F4F3 for /z and /y)
  const pageBg =
    route === '/z' || route === '/y' ? 'var(--porcelain-ivory)' : 'var(--paper-white)';

  // Windows 2000 file path indicator for the current route
  const retroFilePath = {
    '/': 'C:\\My Documents\\love_note\\index.htm',
    '/z': 'C:\\My Documents\\love_note\\z_ten_things.htm',
    '/y': 'C:\\My Documents\\love_note\\y_letter.txt',
    '/x': 'C:\\My Documents\\love_note\\x_confession.htm'
  }[route];

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative selection-custom"
      style={{
        backgroundColor: pageBg,
        color: 'var(--ink-black)'
      }}
    >
      {/* CENTRALIZED DESIGN TOKENS & TYPOGRAPHY STYLESHEET */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Homemade+Apple&family=Kalam:wght@300;400;700&family=Reenie+Beanie&display=swap');

        :root {
          --paper-white: #FFFFFF;
          --porcelain-ivory: #F8F4F3;
          --ink-black: #171419;
          --pure-black: #000000;
          --hot-pink: #F01483;
          --dusty-rose: #DABBC4;
          --faded-mauve: #A88D9A;
          --ash-grey: #777078;
          --pale-blush: #F1E3E7;
          --windows-blue: #0A246A;
        }

        /* Role 1: Expressive handwritten font for headings & marginal notes */
        .font-expressive {
          font-family: 'Reenie Beanie', 'Homemade Apple', 'Caveat', cursive, sans-serif;
        }

        .font-script-heading {
          font-family: 'Homemade Apple', 'Reenie Beanie', 'Caveat', cursive, sans-serif;
        }

        /* Role 2: Legible handwritten font for the personal letter & 10 entries */
        .font-letter {
          font-family: 'Kalam', 'Caveat', 'Comic Sans MS', cursive, sans-serif;
        }

        /* Role 3: Classic system or monospace font for tiny retro-computer details */
        .font-retro {
          font-family: 'Courier Prime', 'Courier New', 'Tahoma', monospace;
        }

        /* Text selection using Pale Blush & Ink Black */
        .selection-custom ::selection {
          background-color: var(--pale-blush);
          color: var(--ink-black);
        }

        /* Visible keyboard focus ring using Windows Blue & Pure Black */
        .focus-retro:focus-visible {
          outline: 2px dashed var(--windows-blue);
          outline-offset: 4px;
        }

        /* Subtle handmade paper texture overlay without external images or extra colors */
        .paper-grain {
          background-image: radial-gradient(var(--dusty-rose) 0.45px, transparent 0.45px);
          background-size: 28px 28px;
        }

        /* Restrained doodle movement on hover */
        .doodle-wiggle {
          transition: transform 0.25s ease;
        }
        .doodle-wiggle-active {
          transform: rotate(-6deg) translateY(-2px);
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          .doodle-wiggle-active {
            transform: none !important;
          }
        }
      `}</style>

      {/* ====================================================================
          TINY WINDOWS 2000 RETRO ADDRESS / NAVIGATION BAR
         ==================================================================== */}
      <header
        className="w-full border-b px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-retro"
        style={{
          backgroundColor: 'var(--paper-white)',
          borderColor: 'var(--pure-black)',
          color: 'var(--ink-black)'
        }}
        aria-label="Windows 2000 Address and Navigation Bar"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-1.5 py-0.5 font-bold tracking-tight"
            style={{
              backgroundColor: 'var(--windows-blue)',
              color: 'var(--paper-white)'
            }}
          >
            LOVE.EXE
          </span>

          {/* Back / Forward / Home controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goBack}
              disabled={historyIndex <= 0}
              className="px-1.5 py-0.5 border focus-retro disabled:opacity-40"
              style={{
                borderColor: 'var(--pure-black)',
                backgroundColor: 'var(--porcelain-ivory)',
                color: 'var(--ink-black)'
              }}
              title="Back"
              aria-label="Go Back"
            >
              ◄ Back
            </button>
            <button
              type="button"
              onClick={goForward}
              disabled={historyIndex >= historyStack.length - 1}
              className="px-1.5 py-0.5 border focus-retro disabled:opacity-40"
              style={{
                borderColor: 'var(--pure-black)',
                backgroundColor: 'var(--porcelain-ivory)',
                color: 'var(--ink-black)'
              }}
              title="Forward"
              aria-label="Go Forward"
            >
              Fwd ►
            </button>
            {route !== '/' && (
              <button
                type="button"
                onClick={() => navigateTo('/')}
                className="px-2 py-0.5 border focus-retro underline"
                style={{
                  borderColor: 'var(--pure-black)',
                  backgroundColor: 'var(--paper-white)',
                  color: 'var(--ink-black)'
                }}
              >
                [Home /]
              </button>
            )}
          </div>

          <span style={{ color: 'var(--ash-grey)' }} className="hidden sm:inline">
            Address:
          </span>
          <span
            className="px-2 py-0.5 border truncate max-w-[220px] sm:max-w-xs md:max-w-md"
            style={{
              borderColor: 'var(--ash-grey)',
              backgroundColor: 'var(--paper-white)',
              color: 'var(--ink-black)'
            }}
          >
            {retroFilePath}
          </span>
        </div>

        {/* Direct route switcher + time label */}
        <nav aria-label="Direct page routes" className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className={`px-1.5 py-0.5 focus-retro ${route === '/' ? 'underline font-bold' : ''}`}
            style={{ color: route === '/' ? 'var(--hot-pink)' : 'var(--ash-grey)' }}
          >
            [/]
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/z')}
            className={`px-1.5 py-0.5 focus-retro ${route === '/z' ? 'underline font-bold' : ''}`}
            style={{ color: route === '/z' ? 'var(--hot-pink)' : 'var(--ash-grey)' }}
          >
            [/z]
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/y')}
            className={`px-1.5 py-0.5 focus-retro ${route === '/y' ? 'underline font-bold' : ''}`}
            style={{ color: route === '/y' ? 'var(--hot-pink)' : 'var(--ash-grey)' }}
          >
            [/y]
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/x')}
            className={`px-1.5 py-0.5 focus-retro ${route === '/x' ? 'underline font-bold' : ''}`}
            style={{ color: route === '/x' ? 'var(--hot-pink)' : 'var(--ash-grey)' }}
          >
            [/x]
          </button>
          <span className="hidden md:inline pl-1" style={{ color: 'var(--ash-grey)' }}>
            [02:14 AM]
          </span>
        </nav>
      </header>

      {/* ====================================================================
          MAIN PAGE ROUTER VIEW (/, /z, /y, /x)
         ==================================================================== */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-6 sm:py-10 flex flex-col justify-between">
        {/* ------------------------------------------------------------------
            ROUTE 1: HOMEPAGE (/) — MS PAINT HAND-DRAWN LOVE NOTE
           ------------------------------------------------------------------ */}
        {route === '/' && (
          <section
            aria-label="Handmade homepage love note"
            className="w-full flex-1 flex flex-col justify-between py-2"
          >
            {/* Top thin, slightly irregular black horizontal border */}
            <div>
              <div className="flex items-center justify-between text-xs font-retro mb-1" style={{ color: 'var(--ash-grey)' }}>
                <span>{homepageData?.top_note || 'saved in: C:\\My Documents\\for_you\\love_note.bmp'}</span>
                <span>ms_paint_canvas.bmp (800×600)</span>
              </div>
              <HandDrawnDivider variant={1} />
            </div>

            {!homepageData ? (
              /* Graceful error state if homepage.txt is emptied or missing */
              <div
                className="my-12 p-6 border-2 font-retro text-sm max-w-xl"
                style={{
                  borderColor: 'var(--pure-black)',
                  backgroundColor: 'var(--porcelain-ivory)',
                  color: 'var(--ink-black)'
                }}
                role="alert"
              >
                <p className="font-bold mb-2" style={{ color: 'var(--windows-blue)' }}>
                  [Notepad.exe — Missing or Empty Content File]
                </p>
                <p className="mb-3">
                  The file <code>public/content/homepage.txt</code> is currently empty or missing.
                  No fabricated personal text was substituted.
                </p>
                <button
                  type="button"
                  onClick={() => openNotepad('homepage.txt')}
                  className="px-3 py-1 border focus-retro underline"
                  style={{
                    borderColor: 'var(--pure-black)',
                    backgroundColor: 'var(--paper-white)'
                  }}
                >
                  Open public/content/homepage.txt in Notepad.exe
                </button>
              </div>
            ) : (
              /* ASYMMETRICAL MS PAINT CANVAS COMPOSITION WITH GENEROUS WHITESPACE */
              <div className="relative my-4 sm:my-8 flex-1 flex flex-col justify-between">
                {/* UPPER AREA: Top-left handwritten heading + two scattered hot-pink hearts */}
                <div className="relative pt-2 pb-6 md:pl-4 max-w-2xl">
                  {/* Scattered Heart #1 (upper left-center) */}
                  <div
                    className={`inline-block mr-3 align-middle doodle-wiggle ${
                      hoveredChoice ? 'doodle-wiggle-active' : ''
                    }`}
                  >
                    <MsPaintHeart variant={1} size={42} title="Hot pink MS Paint heart" />
                  </div>

                  {/* Scattered Heart #2 (upper right of heading area) */}
                  <div
                    className="float-right sm:mr-8 -mt-1 doodle-wiggle"
                    style={{ transform: 'rotate(9deg)' }}
                  >
                    <MsPaintHeart variant={2} size={36} title="Second hot pink MS Paint heart" />
                  </div>

                  <h1
                    className="font-expressive text-4xl sm:text-5xl md:text-6xl leading-none tracking-wide mt-2 mb-3"
                    style={{ color: 'var(--ink-black)' }}
                  >
                    {homepageData.heading}
                  </h1>

                  {homepageData.subtitle && (
                    <p
                      className="font-letter text-lg sm:text-xl max-w-xl leading-relaxed"
                      style={{ color: 'var(--ink-black)' }}
                    >
                      {homepageData.subtitle}
                    </p>
                  )}

                  {homepageData.middle_note && (
                    <p
                      className="font-expressive text-2xl sm:text-3xl mt-3"
                      style={{ color: 'var(--ash-grey)' }}
                    >
                      {homepageData.middle_note}
                    </p>
                  )}
                </div>

                {/* Irregular black scribble under top heading */}
                <div className="w-11/12 sm:w-4/5 my-2">
                  <HandDrawnDivider variant={2} />
                </div>

                {/* MIDDLE AREA: Informal asymmetrical Z / Y / X choices + middle-right heart + gloomy coquette doodles */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-6 sm:my-10">
                  {/* Left / Center Informal Navigation Choices */}
                  <nav
                    aria-label="Confession sequence navigation"
                    className="md:col-span-8 flex flex-col gap-8 sm:gap-10"
                  >
                    {/* CHOICE 1: Z — "10 things I love about you" */}
                    <div
                      className="pl-1 sm:pl-4 flex flex-col items-start"
                      onMouseEnter={() => setHoveredChoice('Z')}
                      onMouseLeave={() => setHoveredChoice(null)}
                    >
                      <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                        <a
                          href="/z"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/z');
                          }}
                          onFocus={() => setHoveredChoice('Z')}
                          onBlur={() => setHoveredChoice(null)}
                          className="font-expressive text-5xl sm:text-6xl font-bold focus-retro leading-none"
                          style={{ color: 'var(--ink-black)' }}
                          aria-label={`${homepageData.z_key} — ${homepageData.z_label}`}
                        >
                          {homepageData.z_key}
                        </a>

                        <span
                          className="font-expressive text-3xl sm:text-4xl select-none"
                          style={{ color: 'var(--ink-black)' }}
                          aria-hidden="true"
                        >
                          —
                        </span>

                        <a
                          href="/z"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/z');
                          }}
                          onFocus={() => setHoveredChoice('Z')}
                          onBlur={() => setHoveredChoice(null)}
                          className="font-expressive text-4xl sm:text-5xl focus-retro inline-block"
                          style={{ color: 'var(--ink-black)' }}
                        >
                          <span>&ldquo;{homepageData.z_label}&rdquo;</span>
                          <RoughUnderline active={hoveredChoice === 'Z'} />
                        </a>

                        {/* Small hot-pink heart appearing beside link on hover/focus */}
                        <span
                          className={`inline-flex items-center transition-opacity duration-150 ${
                            hoveredChoice === 'Z' ? 'opacity-100' : 'opacity-0'
                          }`}
                          aria-hidden="true"
                        >
                          <MsPaintHeart variant={1} size={26} />
                        </span>

                        {homepageData.z_hint && (
                          <span
                            className="font-expressive text-2xl sm:text-3xl ml-1"
                            style={{ color: 'var(--hot-pink)' }}
                          >
                            {homepageData.z_hint}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Short off-center hand-drawn scribble */}
                    <div className="w-3/4 sm:w-2/3 pl-6">
                      <HandDrawnDivider variant={1} />
                    </div>

                    {/* CHOICE 2: Y — "click here" (indented asymmetrically) */}
                    <div
                      className="pl-6 sm:pl-16 md:pl-24 flex flex-col items-start"
                      onMouseEnter={() => setHoveredChoice('Y')}
                      onMouseLeave={() => setHoveredChoice(null)}
                    >
                      <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                        <a
                          href="/y"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/y');
                          }}
                          onFocus={() => setHoveredChoice('Y')}
                          onBlur={() => setHoveredChoice(null)}
                          className="font-expressive text-5xl sm:text-6xl font-bold focus-retro leading-none"
                          style={{ color: 'var(--ink-black)' }}
                          aria-label={`${homepageData.y_key} — ${homepageData.y_label}`}
                        >
                          {homepageData.y_key}
                        </a>

                        <span
                          className="font-expressive text-3xl sm:text-4xl select-none"
                          style={{ color: 'var(--ink-black)' }}
                          aria-hidden="true"
                        >
                          —
                        </span>

                        <a
                          href="/y"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/y');
                          }}
                          onFocus={() => setHoveredChoice('Y')}
                          onBlur={() => setHoveredChoice(null)}
                          className="font-expressive text-4xl sm:text-5xl focus-retro inline-block"
                          style={{ color: 'var(--ink-black)' }}
                        >
                          <span>&ldquo;{homepageData.y_label}&rdquo;</span>
                          <RoughUnderline active={hoveredChoice === 'Y'} />
                        </a>

                        {/* Small hot-pink heart appearing beside link on hover/focus */}
                        <span
                          className={`inline-flex items-center transition-opacity duration-150 ${
                            hoveredChoice === 'Y' ? 'opacity-100' : 'opacity-0'
                          }`}
                          aria-hidden="true"
                        >
                          <MsPaintHeart variant={2} size={26} />
                        </span>

                        {homepageData.y_hint && (
                          <span
                            className="font-expressive text-2xl sm:text-3xl"
                            style={{ color: 'var(--ash-grey)' }}
                          >
                            {homepageData.y_hint}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Short hand-drawn scribble */}
                    <div className="w-4/5 sm:w-3/4 pl-2">
                      <HandDrawnDivider variant={2} />
                    </div>

                    {/* CHOICE 3: X — "click here after you read all this" */}
                    <div
                      className="pl-2 sm:pl-8 md:pl-10 flex flex-col items-start"
                      onMouseEnter={() => setHoveredChoice('X')}
                      onMouseLeave={() => setHoveredChoice(null)}
                    >
                      <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                        <a
                          href="/x"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/x');
                          }}
                          onFocus={() => setHoveredChoice('X')}
                          onBlur={() => setHoveredChoice(null)}
                          className="font-expressive text-5xl sm:text-6xl font-bold focus-retro leading-none"
                          style={{ color: 'var(--ink-black)' }}
                          aria-label={`${homepageData.x_key} — ${homepageData.x_label}`}
                        >
                          {homepageData.x_key}
                        </a>

                        <span
                          className="font-expressive text-3xl sm:text-4xl select-none"
                          style={{ color: 'var(--ink-black)' }}
                          aria-hidden="true"
                        >
                          —
                        </span>

                        <a
                          href="/x"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('/x');
                          }}
                          onFocus={() => setHoveredChoice('X')}
                          onBlur={() => setHoveredChoice(null)}
                          className="font-expressive text-4xl sm:text-5xl focus-retro inline-block"
                          style={{ color: 'var(--ink-black)' }}
                        >
                          <span>&ldquo;{homepageData.x_label}&rdquo;</span>
                          <RoughUnderline active={hoveredChoice === 'X'} />
                        </a>

                        {/* Small hot-pink heart appearing beside link on hover/focus */}
                        <span
                          className={`inline-flex items-center transition-opacity duration-150 ${
                            hoveredChoice === 'X' ? 'opacity-100' : 'opacity-0'
                          }`}
                          aria-hidden="true"
                        >
                          <MsPaintHeart variant={3} size={26} />
                        </span>

                        {homepageData.x_hint && (
                          <span
                            className="font-expressive text-2xl sm:text-3xl"
                            style={{ color: 'var(--ash-grey)' }}
                          >
                            {homepageData.x_hint}
                          </span>
                        )}
                      </div>
                    </div>
                  </nav>

                  {/* Middle-Right Area: Vivid Hot-Pink Heart + Dusty-Rose Ribbon + Faded Mauve Rose */}
                  <aside
                    aria-label="Handmade gloomy coquette doodles"
                    className="md:col-span-4 flex md:flex-col items-center justify-around md:justify-center gap-6 py-4"
                  >
                    {/* Middle-right hot-pink heart */}
                    <div
                      className={`doodle-wiggle ${
                        hoveredChoice === 'Y' || hoveredChoice === 'Z' ? 'doodle-wiggle-active' : ''
                      }`}
                    >
                      <MsPaintHeart variant={3} size={62} title="Middle-right hot pink heart" />
                    </div>

                    {/* Dusty-rose satin ribbon bow */}
                    <div
                      className={`doodle-wiggle ${
                        hoveredChoice === 'X' ? 'doodle-wiggle-active' : ''
                      }`}
                    >
                      <DustyRoseRibbon size={74} />
                    </div>

                    {/* Faded mauve melancholic rose */}
                    <div className="flex flex-col items-center">
                      <FadedMauveRose size={52} />
                      <span
                        className="font-expressive text-2xl mt-1"
                        style={{ color: 'var(--ash-grey)' }}
                      >
                        (drawn for you)
                      </span>
                    </div>
                  </aside>
                </div>

                {/* Spacious negative space & subtle lace detail before bottom border */}
                <div className="pt-8 sm:pt-14">
                  <div className="max-w-xs ml-auto mr-4 mb-2 text-right">
                    <span
                      className="font-expressive text-2xl"
                      style={{ color: 'var(--ash-grey)' }}
                    >
                      {homepageData.footer_note}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom thin, slightly irregular black horizontal border */}
            <div>
              <HandDrawnDivider variant={3} />
              <div
                className="flex flex-wrap items-center justify-between text-xs font-retro mt-1"
                style={{ color: 'var(--ash-grey)' }}
              >
                <span>status: waiting quietly...</span>
                <span>sequence: [Z] → [Y] → [X]</span>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------
            ROUTE 2: Z PAGE (/z) — TEN THINGS I LOVE ABOUT YOU
           ------------------------------------------------------------------ */}
        {route === '/z' && (
          <article
            aria-label="10 things I love about you"
            className="w-full max-w-3xl mx-auto py-4 sm:py-6"
          >
            {/* Diary page top header */}
            <div className="flex items-center justify-between mb-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="font-expressive text-2xl sm:text-3xl focus-retro underline"
                style={{ color: 'var(--ash-grey)' }}
              >
                ← back to homepage
              </a>
              <span className="font-retro text-xs" style={{ color: 'var(--ash-grey)' }}>
                page 1 of 3 [ten_things.txt]
              </span>
            </div>

            <HandDrawnDivider variant={1} />

            {/* Title + Dusty Rose Bow + Hot-Pink Heart */}
            <header className="my-6 sm:my-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span
                  className="font-expressive text-3xl block"
                  style={{ color: 'var(--hot-pink)' }}
                >
                  part Z —
                </span>
                <h1
                  className="font-expressive text-5xl sm:text-6xl leading-none mt-1"
                  style={{ color: 'var(--ink-black)' }}
                >
                  10 things I love about you
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <DustyRoseRibbon size={58} />
                <MsPaintHeart variant={1} size={38} />
              </div>
            </header>

            {!tenThingsData || tenThingsData.length === 0 ? (
              <div
                className="my-10 p-6 border-2 font-retro text-sm"
                style={{
                  borderColor: 'var(--pure-black)',
                  backgroundColor: 'var(--paper-white)',
                  color: 'var(--ink-black)'
                }}
                role="alert"
              >
                <p className="font-bold mb-2" style={{ color: 'var(--windows-blue)' }}>
                  [Notepad.exe — Content File Empty or Missing]
                </p>
                <p className="mb-3">
                  Could not load entries from <code>public/content/ten_things.txt</code>.
                </p>
                <button
                  type="button"
                  onClick={() => openNotepad('ten_things.txt')}
                  className="px-3 py-1 border focus-retro underline"
                  style={{ borderColor: 'var(--pure-black)' }}
                >
                  Edit public/content/ten_things.txt
                </button>
              </div>
            ) : (
              /* Ten individually styled handwritten diary entries */
              <ol className="space-y-8 sm:space-y-10 my-8">
                {tenThingsData.map((entry, idx) => {
                  // Slight organic variations in margin/indentation for a real diary feel
                  const offsetClasses = [
                    'sm:pl-0',
                    'sm:pl-6',
                    'sm:pl-2',
                    'sm:pl-8',
                    'sm:pl-1',
                    'sm:pl-7',
                    'sm:pl-3',
                    'sm:pl-5',
                    'sm:pl-0',
                    'sm:pl-4'
                  ];
                  const indentClass = offsetClasses[idx % offsetClasses.length];

                  return (
                    <li
                      key={idx}
                      className={`relative ${indentClass}`}
                    >
                      <div
                        className="p-4 sm:p-5 border paper-grain"
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? 'var(--paper-white)' : 'var(--porcelain-ivory)',
                          borderColor: 'var(--ink-black)'
                        }}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Handwritten number in vivid Hot Pink (#F01483) */}
                          <span
                            className="font-expressive text-4xl sm:text-5xl font-bold leading-none select-none pt-0.5"
                            style={{ color: 'var(--hot-pink)' }}
                          >
                            #{entry.number}.
                          </span>

                          {/* Editable reason text in Ink Black (#171419) */}
                          <div className="flex-1 font-letter text-lg sm:text-xl leading-relaxed whitespace-pre-wrap break-words">
                            {entry.text}
                          </div>

                          {/* Occasional tiny hearts or floral doodles */}
                          {idx === 0 && <MsPaintHeart variant={1} size={26} className="shrink-0" />}
                          {idx === 3 && <DustyRoseRibbon size={42} className="shrink-0" />}
                          {idx === 6 && <FadedMauveRose size={36} className="shrink-0" />}
                          {idx === 9 && <MsPaintHeart variant={2} size={30} className="shrink-0" />}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* End-of-content sentinel for Z page */}
            <div ref={zSentinelRef} className="h-2 w-full" aria-hidden="true" />

            {/* Imperfect handwritten divider at the actual end of the list */}
            <div className="mt-10 mb-6">
              <HandDrawnDivider variant={2} />
            </div>

            {/* Reveal "go to Y →" after all 10 entries */}
            <footer
              className={`py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity duration-300 ${
                zEndReached ? 'opacity-100' : 'opacity-95'
              }`}
            >
              <span
                className="font-expressive text-2xl sm:text-3xl"
                style={{ color: 'var(--ash-grey)' }}
              >
                (there is still a letter I wrote for you...)
              </span>

              <a
                href="/y"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/y');
                }}
                className="group inline-flex items-center gap-3 px-4 py-2 focus-retro"
                style={{ color: 'var(--ink-black)' }}
              >
                <MsPaintHeart variant={1} size={28} />
                <span className="font-expressive text-4xl sm:text-5xl">
                  go to Y →
                  <RoughUnderline active />
                </span>
              </a>
            </footer>
          </article>
        )}

        {/* ------------------------------------------------------------------
            ROUTE 3: Y PAGE (/y) — THE COMPLETE HANDWRITTEN LETTER
           ------------------------------------------------------------------ */}
        {route === '/y' && (
          <article
            aria-label="Personal handwritten letter"
            className="w-full max-w-2xl mx-auto py-4 sm:py-6"
          >
            {/* Top navigation bar */}
            <div className="flex items-center justify-between mb-3">
              <a
                href="/z"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/z');
                }}
                className="font-expressive text-2xl sm:text-3xl focus-retro underline"
                style={{ color: 'var(--ash-grey)' }}
              >
                ← back to Z
              </a>
              <span className="font-retro text-xs" style={{ color: 'var(--ash-grey)' }}>
                page 2 of 3 [public/content/letter.txt]
              </span>
            </div>

            {!letterData ? (
              <div
                className="my-10 p-6 border-2 font-retro text-sm"
                style={{
                  borderColor: 'var(--pure-black)',
                  backgroundColor: 'var(--paper-white)',
                  color: 'var(--ink-black)'
                }}
                role="alert"
              >
                <p className="font-bold mb-2" style={{ color: 'var(--windows-blue)' }}>
                  [Notepad.exe — Letter File Missing or Empty]
                </p>
                <p className="mb-3">
                  <code>public/content/letter.txt</code> is currently empty. Edit the file to write
                  your personal letter.
                </p>
                <button
                  type="button"
                  onClick={() => openNotepad('letter.txt')}
                  className="px-3 py-1 border focus-retro underline"
                  style={{ borderColor: 'var(--pure-black)' }}
                >
                  Open public/content/letter.txt in Notepad.exe
                </button>
              </div>
            ) : (
              /* Warm-white stationery paper sheet (#F8F4F3) with subtle ink & dusty-rose borders */
              <div
                className="relative p-6 sm:p-10 md:p-14 border-2 paper-grain"
                style={{
                  backgroundColor: 'var(--porcelain-ivory)',
                  borderColor: 'var(--ink-black)',
                  boxShadow: '5px 5px 0px var(--dusty-rose)'
                }}
              >
                {/* Inner subtle dusty-rose border */}
                <div
                  className="pointer-events-none absolute inset-2 border"
                  style={{ borderColor: 'var(--dusty-rose)' }}
                  aria-hidden="true"
                />

                {/* Marginalia doodles near top corners */}
                <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <span
                      className="font-retro text-xs block mb-1"
                      style={{ color: 'var(--ash-grey)' }}
                    >
                      file: letter.txt (UTF-8)
                    </span>
                    <h1
                      className="font-expressive text-4xl sm:text-5xl md:text-6xl leading-none"
                      style={{ color: 'var(--ink-black)' }}
                    >
                      {letterData.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <MsPaintHeart variant={2} size={32} />
                    <FadedMauveRose size={42} />
                  </div>
                </div>

                <HandDrawnDivider variant={1} />

                {/* Complete Rendered Letter Body — preserves all paragraph breaks & intentional blank lines */}
                <div
                  className="relative z-10 my-6 font-letter text-lg sm:text-xl md:text-[22px] leading-[1.85] break-words"
                  style={{ color: 'var(--ink-black)' }}
                >
                  {letterData.lines.map((line, index) => {
                    const isBlank = line.trim() === '';
                    const isSignatureLine =
                      line.trim().startsWith('—') ||
                      line.trim().startsWith('--') ||
                      (index >= letterData.lines.length - 2 && line.trim().length > 0 && line.trim().length < 55);

                    if (isBlank) {
                      return (
                        <div
                          key={index}
                          className="h-6 sm:h-7 select-none"
                          aria-hidden="true"
                        />
                      );
                    }

                    return (
                      <p
                        key={index}
                        className={`whitespace-pre-wrap ${
                          isSignatureLine ? 'font-expressive text-3xl sm:text-4xl mt-2' : 'mb-1'
                        }`}
                        style={{ color: 'var(--ink-black)' }}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Bottom margin floral & ribbon detail */}
                <div className="relative z-10 mt-10 pt-4 flex items-center justify-between">
                  <DustyRoseRibbon size={54} />
                  <div className="flex items-center gap-2">
                    <span
                      className="font-expressive text-2xl"
                      style={{ color: 'var(--ash-grey)' }}
                    >
                      end of letter
                    </span>
                    <MsPaintHeart variant={3} size={24} />
                  </div>
                </div>
              </div>
            )}

            {/* End-of-letter sentinel */}
            <div ref={ySentinelRef} className="h-2 w-full" aria-hidden="true" />

            {/* Reveal "go to X →" strictly after the complete rendered letter */}
            <footer
              className={`mt-10 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity duration-300 ${
                yEndReached ? 'opacity-100' : 'opacity-95'
              }`}
              style={{ borderColor: 'var(--ink-black)' }}
            >
              <span
                className="font-expressive text-2xl sm:text-3xl"
                style={{ color: 'var(--ash-grey)' }}
              >
                (when you finish reading, there is one last page...)
              </span>

              <a
                href="/x"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/x');
                }}
                className="inline-flex items-center gap-3 px-4 py-2 focus-retro"
                style={{ color: 'var(--ink-black)' }}
              >
                <MsPaintHeart variant={2} size={28} />
                <span className="font-expressive text-4xl sm:text-5xl">
                  go to X →
                  <RoughUnderline active />
                </span>
              </a>
            </footer>
          </article>
        )}

        {/* ------------------------------------------------------------------
            ROUTE 4: X PAGE (/x) — THE FINAL CONFESSION (QUIET & SINCERE)
           ------------------------------------------------------------------ */}
        {route === '/x' && (
          <section
            aria-label="Final confession"
            className="w-full max-w-2xl mx-auto py-8 sm:py-14 flex-1 flex flex-col justify-center"
          >
            {/* Subtle back link */}
            <div className="flex items-center justify-between mb-8">
              <a
                href="/y"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/y');
                }}
                className="font-expressive text-2xl focus-retro underline"
                style={{ color: 'var(--ash-grey)' }}
              >
                ← back to letter (Y)
              </a>
              <span className="font-retro text-xs" style={{ color: 'var(--ash-grey)' }}>
                page 3 of 3 [confession.txt]
              </span>
            </div>

            {!confessionData ? (
              <div
                className="my-10 p-6 border-2 font-retro text-sm"
                style={{
                  borderColor: 'var(--pure-black)',
                  backgroundColor: 'var(--porcelain-ivory)',
                  color: 'var(--ink-black)'
                }}
                role="alert"
              >
                <p className="font-bold mb-2" style={{ color: 'var(--windows-blue)' }}>
                  [Notepad.exe — Confession File Empty or Missing]
                </p>
                <p className="mb-3">
                  <code>public/content/confession.txt</code> is empty or missing.
                </p>
                <button
                  type="button"
                  onClick={() => openNotepad('confession.txt')}
                  className="px-3 py-1 border focus-retro underline"
                  style={{ borderColor: 'var(--pure-black)' }}
                >
                  Edit public/content/confession.txt
                </button>
              </div>
            ) : (
              /* Quiet, spacious confession layout where the words dominate */
              <div className="my-4 sm:my-8">
                {/* Single vivid hot-pink heart and optional dusty-rose ribbon */}
                <div className="flex items-center gap-4 mb-6">
                  <MsPaintHeart variant={1} size={46} />
                  <DustyRoseRibbon size={52} />
                </div>

                {/* Short heading */}
                <h1
                  className="font-expressive text-5xl sm:text-6xl leading-none mb-8"
                  style={{ color: 'var(--ink-black)' }}
                >
                  {confessionData.heading}
                </h1>

                {/* Main confession paragraphs */}
                <div className="space-y-6 font-letter text-xl sm:text-2xl leading-relaxed mb-10">
                  {confessionData.bodyParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="whitespace-pre-wrap"
                      style={{ color: 'var(--ink-black)' }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <HandDrawnDivider variant={1} />

                {/* Direct Question */}
                <div className="my-8 sm:my-10">
                  <p
                    className="font-expressive text-4xl sm:text-5xl leading-tight mb-3"
                    style={{ color: 'var(--ink-black)' }}
                  >
                    {confessionData.question}
                  </p>
                  {confessionData.quiet_note && (
                    <p
                      className="font-letter text-base sm:text-lg"
                      style={{ color: 'var(--ash-grey)' }}
                    >
                      {confessionData.quiet_note}
                    </p>
                  )}
                </div>

                {/* Two Equally Respectful Response Choices (No guilt, no moving buttons) */}
                {responsesData && (
                  <div className="mt-8">
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                      role="group"
                      aria-label="Response options"
                    >
                      {/* Option 1: Accept */}
                      <button
                        type="button"
                        onClick={() => setSelectedResponse('accept')}
                        aria-pressed={selectedResponse === 'accept'}
                        className="p-4 sm:p-5 border-2 text-left focus-retro transition-colors flex items-center justify-between gap-3"
                        style={{
                          borderColor: 'var(--pure-black)',
                          backgroundColor:
                            selectedResponse === 'accept'
                              ? 'var(--pale-blush)'
                              : 'var(--paper-white)',
                          color: 'var(--ink-black)'
                        }}
                      >
                        <span className="font-letter text-xl sm:text-2xl">
                          {responsesData.accept_label}
                        </span>
                        <MsPaintHeart variant={1} size={26} className="shrink-0" />
                      </button>

                      {/* Option 2: Respectful Decline */}
                      <button
                        type="button"
                        onClick={() => setSelectedResponse('decline')}
                        aria-pressed={selectedResponse === 'decline'}
                        className="p-4 sm:p-5 border-2 text-left focus-retro transition-colors flex items-center justify-between gap-3"
                        style={{
                          borderColor: 'var(--pure-black)',
                          backgroundColor:
                            selectedResponse === 'decline'
                              ? 'var(--porcelain-ivory)'
                              : 'var(--paper-white)',
                          color: 'var(--ink-black)'
                        }}
                      >
                        <span className="font-letter text-xl sm:text-2xl">
                          {responsesData.decline_label}
                        </span>
                        <FadedMauveRose size={28} className="shrink-0" />
                      </button>
                    </div>

                    {/* Local On-Screen Confirmation Message */}
                    {selectedResponse && (
                      <div
                        className="mt-8 p-6 sm:p-8 border-2"
                        style={{
                          borderColor: 'var(--ink-black)',
                          backgroundColor: 'var(--porcelain-ivory)',
                          color: 'var(--ink-black)'
                        }}
                        role="status"
                        aria-live="polite"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h2 className="font-expressive text-4xl sm:text-5xl">
                            {selectedResponse === 'accept'
                              ? responsesData.accept_title
                              : responsesData.decline_title}
                          </h2>
                          {selectedResponse === 'accept' ? (
                            <MsPaintHeart variant={2} size={34} />
                          ) : (
                            <DustyRoseRibbon size={46} />
                          )}
                        </div>

                        <p className="font-letter text-lg sm:text-xl leading-relaxed whitespace-pre-wrap mb-4">
                          {selectedResponse === 'accept'
                            ? responsesData.accept_message
                            : responsesData.decline_message}
                        </p>

                        <div
                          className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs font-retro"
                          style={{
                            borderColor: 'var(--dusty-rose)',
                            color: 'var(--ash-grey)'
                          }}
                        >
                          <span>
                            [local display only — nothing is transmitted or stored on any server]
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(null)}
                            className="underline focus-retro"
                            style={{ color: 'var(--ink-black)' }}
                          >
                            [clear selection]
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ====================================================================
          RETRO WINDOWS 2000 STATUS BAR & CONTENT FILE INSPECTOR TRIGGER
         ==================================================================== */}
      <footer
        className="w-full border-t px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-retro"
        style={{
          backgroundColor: 'var(--porcelain-ivory)',
          borderColor: 'var(--pure-black)',
          color: 'var(--ink-black)'
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => openNotepad(route === '/z' ? 'ten_things.txt' : route === '/y' ? 'letter.txt' : route === '/x' ? 'confession.txt' : 'homepage.txt')}
            className="px-2 py-0.5 border font-bold focus-retro"
            style={{
              borderColor: 'var(--pure-black)',
              backgroundColor: 'var(--paper-white)',
              color: 'var(--windows-blue)'
            }}
          >
            [Notepad.exe: Edit public/content/*.txt]
          </button>

          {/* Optional user-initiated 2:00 AM music box with mute control */}
          <button
            type="button"
            onClick={toggleMusic}
            aria-pressed={isPlaying}
            className="px-2 py-0.5 border focus-retro"
            style={{
              borderColor: 'var(--pure-black)',
              backgroundColor: isPlaying ? 'var(--pale-blush)' : 'var(--paper-white)',
              color: 'var(--ink-black)'
            }}
          >
            {isPlaying ? '[♪ 2:00 AM music box: ON (Mute)]' : '[♪ 2:00 AM music box: OFF]'}
          </button>
        </div>

        <div className="flex items-center gap-3" style={{ color: 'var(--ash-grey)' }}>
          <span>UTF-8 plain-text content system: {loadStatus}</span>
          <span className="hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => openNotepad('README.txt')}
            className="underline focus-retro"
            style={{ color: 'var(--ink-black)' }}
          >
            [How to edit content files]
          </button>
        </div>
      </footer>

      {/* ====================================================================
          WINDOWS 2000 NOTEPAD.EXE MODAL — LIVE CONTENT FILE EDITOR & GUIDE
         ==================================================================== */}
      {isNotepadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ backgroundColor: 'rgba(23, 20, 25, 0.45)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notepad-title"
        >
          <div
            className="w-full max-w-3xl border-2 flex flex-col max-h-[90vh]"
            style={{
              backgroundColor: 'var(--porcelain-ivory)',
              borderColor: 'var(--pure-black)',
              boxShadow: '6px 6px 0px var(--pure-black)'
            }}
          >
            {/* Classic Windows 2000 Title Bar (#0A246A) */}
            <div
              className="px-3 py-1.5 flex items-center justify-between font-retro text-xs sm:text-sm font-bold"
              style={{
                backgroundColor: 'var(--windows-blue)',
                color: 'var(--paper-white)'
              }}
            >
              <span id="notepad-title">
                public/content/{activeFileTab} — Notepad.exe
              </span>
              <button
                type="button"
                onClick={() => setIsNotepadOpen(false)}
                className="px-2 py-0.2 border font-bold focus-retro"
                style={{
                  backgroundColor: 'var(--porcelain-ivory)',
                  color: 'var(--pure-black)',
                  borderColor: 'var(--pure-black)'
                }}
                aria-label="Close Notepad"
              >
                X
              </button>
            </div>

            {/* File Tabs Bar */}
            <div
              className="px-2 py-1.5 border-b flex flex-wrap items-center gap-1 font-retro text-xs"
              style={{
                borderColor: 'var(--pure-black)',
                backgroundColor: 'var(--porcelain-ivory)'
              }}
            >
              {[
                'homepage.txt',
                'ten_things.txt',
                'letter.txt',
                'confession.txt',
                'responses.txt',
                'README.txt'
              ].map((filename) => (
                <button
                  key={filename}
                  type="button"
                  onClick={() => switchNotepadTab(filename)}
                  className={`px-2 py-1 border focus-retro ${
                    activeFileTab === filename ? 'font-bold underline' : ''
                  }`}
                  style={{
                    borderColor: 'var(--pure-black)',
                    backgroundColor:
                      activeFileTab === filename
                        ? 'var(--paper-white)'
                        : 'var(--porcelain-ivory)',
                    color:
                      activeFileTab === filename
                        ? 'var(--hot-pink)'
                        : 'var(--ink-black)'
                  }}
                >
                  {filename}
                </button>
              ))}
            </div>

            {/* Plain-Text Textarea */}
            <div className="p-3 flex-1 flex flex-col min-h-[260px]">
              <label htmlFor="notepad-textarea" className="sr-only">
                Edit content of public/content/{activeFileTab}
              </label>
              <textarea
                id="notepad-textarea"
                value={editorDraft}
                onChange={(e) => {
                  setEditorDraft(e.target.value);
                  setSaveNotice('');
                }}
                rows={14}
                className="w-full flex-1 p-3 border font-retro text-xs sm:text-sm leading-relaxed focus-retro resize-y"
                style={{
                  backgroundColor: 'var(--paper-white)',
                  borderColor: 'var(--pure-black)',
                  color: 'var(--ink-black)'
                }}
              />
            </div>

            {/* Bottom Controls inside Notepad */}
            <div
              className="px-3 py-2 border-t flex flex-wrap items-center justify-between gap-2 font-retro text-xs"
              style={{
                borderColor: 'var(--pure-black)',
                backgroundColor: 'var(--porcelain-ivory)'
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {activeFileTab !== 'README.txt' && (
                  <>
                    <button
                      type="button"
                      onClick={saveNotepadFile}
                      className="px-3 py-1 border font-bold focus-retro"
                      style={{
                        borderColor: 'var(--pure-black)',
                        backgroundColor: 'var(--hot-pink)',
                        color: 'var(--paper-white)'
                      }}
                    >
                      Save &amp; Apply Changes
                    </button>
                    <button
                      type="button"
                      onClick={resetCurrentFile}
                      className="px-2.5 py-1 border focus-retro"
                      style={{
                        borderColor: 'var(--pure-black)',
                        backgroundColor: 'var(--paper-white)',
                        color: 'var(--ink-black)'
                      }}
                    >
                      Reset to Default
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={downloadCurrentFile}
                  className="px-2.5 py-1 border focus-retro"
                  style={{
                    borderColor: 'var(--pure-black)',
                    backgroundColor: 'var(--paper-white)',
                    color: 'var(--ink-black)'
                  }}
                >
                  Download {activeFileTab}
                </button>
              </div>

              <div className="flex items-center gap-3">
                {saveNotice && (
                  <span className="font-bold" style={{ color: 'var(--windows-blue)' }}>
                    {saveNotice}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsNotepadOpen(false)}
                  className="px-3 py-1 border focus-retro"
                  style={{
                    borderColor: 'var(--pure-black)',
                    backgroundColor: 'var(--paper-white)',
                    color: 'var(--ink-black)'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
