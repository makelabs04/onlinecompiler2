// frontend/js/app.js
// ── MakeLabs Main Application ────────────────────────────────────

const API_BASE = '/api';

// ── State ─────────────────────────────────────────────────────────
const state = {
  currentLang: 'python',
  isRunning: false,
  pendingStdin: '',
  executionTime: null,
  charCount: 0,
  lineCount: 1,
  editorHistory: {},
  resizing: false,
  theme: 'dark',
};

// ── Language Definitions ──────────────────────────────────────────
const LANGUAGES = {
  java: {
    id: 'java', name: 'Java', icon: '☕', color: '#f89820', ext: '.java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // FizzBuzz example
        for (int i = 1; i <= 15; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
  },
  python: {
    id: 'python', name: 'Python', icon: '🐍', color: '#3572A5', ext: '.py',
    defaultCode: `# Python - MakeLabs Online Compiler
print("Hello, World!")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)

# Function example
def greet(name):
    return f"Welcome to MakeLabs, {name}!"

print(greet("Developer"))`,
  },
  cpp: {
    id: 'cpp', name: 'C++', icon: '⚡', color: '#00599C', ext: '.cpp',
    defaultCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    vector<string> langs = {"C++", "Java", "Python"};
    for (const auto& lang : langs) {
        cout << "Language: " << lang << endl;
    }
    
    return 0;
}`,
  },
  c: {
    id: 'c', name: 'C', icon: '🔧', color: '#A8B9CC', ext: '.c',
    defaultCode: `#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello, World!\\n");
    
    int arr[] = {1, 2, 3, 4, 5};
    int sum = 0;
    int n = sizeof(arr) / sizeof(arr[0]);
    
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    printf("Sum: %d\\n", sum);
    printf("Average: %.1f\\n", (float)sum / n);
    
    return 0;
}`,
  },
  csharp: {
    id: 'csharp', name: 'C#', icon: '💜', color: '#68217A', ext: '.cs',
    defaultCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
        
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var evens = numbers.Where(n => n % 2 == 0).ToList();
        
        Console.WriteLine($\"Even numbers: {string.Join(\", \", evens)}\");
        Console.WriteLine($\"Sum: {numbers.Sum()}\");
    }
}`,
  },
  javascript: {
    id: 'javascript', name: 'JavaScript', icon: '🌐', color: '#F7DF1E', ext: '.js',
    defaultCode: `// JavaScript - MakeLabs Online Compiler
console.log("Hello, World!");

// Arrow functions & array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);

// Async example
const greet = async (name) => {
    return \`Welcome to MakeLabs, \${name}!\`;
};

greet("Developer").then(msg => console.log(msg));`,
  },
  php: {
    id: 'php', name: 'PHP', icon: '🐘', color: '#777BB4', ext: '.php',
    defaultCode: `<?php
echo "Hello, World!\\n";

// Arrays and loops
$fruits = ["Apple", "Banana", "Cherry"];
foreach ($fruits as $index => $fruit) {
    echo ($index + 1) . ". " . $fruit . "\\n";
}

// Functions
function factorial($n) {
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}

echo "5! = " . factorial(5) . "\\n";
echo "Welcome to MakeLabs!\\n";
?>`,
  },
};

// ── Example Snippets ──────────────────────────────────────────────
const EXAMPLES = [
  { title: 'FizzBuzz', lang: 'python', code: 'for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)' },
  { title: 'Palindrome Checker', lang: 'javascript', code: 'function isPalindrome(str) {\n  const clean = str.replace(/[^A-Za-z0-9]/g, "").toLowerCase();\n  return clean === clean.split("").reverse().join("");\n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));\nconsole.log(isPalindrome("MakeLabs"));' },
  { title: 'Fibonacci Sequence', lang: 'java', code: 'public class Main {\n  public static void main(String[] args) {\n    int n = 10, first = 0, second = 1;\n    System.out.println("Fibonacci Series till " + n + " terms:");\n    for (int i = 1; i <= n; ++i) {\n      System.out.print(first + ", ");\n      int nextTerm = first + second;\n      first = second;\n      second = nextTerm;\n    }\n  }\n}' },
  { title: 'Selection Sort', lang: 'cpp', code: '#include <iostream>\nusing namespace std;\n\nvoid selectionSort(int arr[], int n) {\n  for (int i = 0; i < n-1; i++) {\n    int min_idx = i;\n    for (int j = i+1; j < n; j++)\n      if (arr[j] < arr[min_idx])\n        min_idx = j;\n    swap(arr[min_idx], arr[i]);\n  }\n}\n\nint main() {\n  int arr[] = {64, 25, 12, 22, 11};\n  int n = sizeof(arr)/sizeof(arr[0]);\n  selectionSort(arr, n);\n  cout << "Sorted array: ";\n  for (int i=0; i < n; i++) cout << arr[i] << " ";\n  return 0;\n}' },
  { title: 'REST API Fetch', lang: 'php', code: '<?php\n$url = "https://jsonplaceholder.typicode.com/users/1";\n$response = file_get_contents($url);\n$data = json_decode($response, true);\n\necho "Name: " . $data["name"] . "\\n";\necho "Email: " . $data["email"] . "\\n";\necho "Company: " . $data["company"]["name"] . "\\n";\n?>' },
  { title: 'LINQ Query', lang: 'csharp', code: 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nclass Program {\n  static void Main() {\n    var scores = new List<int> { 97, 92, 81, 60, 100, 75, 84 };\n    var highScores = scores.Where(s => s > 80).OrderByDescending(s => s);\n\n    Console.WriteLine("Scores above 80:");\n    foreach (var score in highScores) {\n      Console.WriteLine(score);\n    }\n  }\n}' }
];

// ── Settings ──────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  fontSize: 15,
  tabSize: 4,
  lineWrap: true
};

function openSettingsModal() {
  const settings = JSON.parse(localStorage.getItem('cc-settings')) || DEFAULT_SETTINGS;
  $('setting-font-size').value = settings.fontSize;
  $('setting-tab-size').value = settings.tabSize;
  $('setting-line-wrap').checked = settings.lineWrap;
  openModal('settings-modal');
}

function applySettings(settings) {
  if (!cmEditor) return;
  cmEditor.setOption('tabSize', parseInt(settings.tabSize));
  cmEditor.setOption('indentUnit', parseInt(settings.tabSize));
  cmEditor.setOption('lineWrapping', settings.lineWrap);
  const cmWrapper = document.querySelector('.CodeMirror');
  if (cmWrapper) {
    cmWrapper.style.setProperty('font-size', `${settings.fontSize}px`, 'important');
  }
  cmEditor.refresh();
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('cc-settings')) || DEFAULT_SETTINGS;
  applySettings(settings);
}

// Bind settings save button
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = $('btn-save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newSettings = {
        fontSize: parseInt($('setting-font-size').value) || 15,
        tabSize: parseInt($('setting-tab-size').value) || 4,
        lineWrap: $('setting-line-wrap').checked
      };
      localStorage.setItem('cc-settings', JSON.stringify(newSettings));
      applySettings(newSettings);
      closeModal('settings-modal');
      showToast('Settings saved!', 'success');
    });
  }
});

// ── DOM Refs ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ── Init ──────────────────────────────────────────────────────────
let cmEditor;
document.addEventListener('DOMContentLoaded', () => {

  cmEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'python',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    extraKeys: {
      "Ctrl-/": "toggleComment",
      "Cmd-/": "toggleComment"
    },
  });

  buildLangTabs();
  buildSidebarBtns();
  setLanguage('python');
  bindEditorEvents();
  bindResizeHandle();
  bindTopbarActions();
  updateStatusBar();
  showWelcomeOutput();
  injectLangTabStyles();

  const savedTheme = localStorage.getItem('cc-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    const themeBtn = Array.from($$('button')).find(b => b.dataset.tooltip === 'Toggle Theme');
    if (themeBtn) themeBtn.innerHTML = '☀️';
  }
  checkBackend();
  setInterval(checkBackend, 30000);
});

// ── Inject lang-tabs styles ───────────────────────────────────────
function injectLangTabStyles() {
  if (document.getElementById('_codecraft_tab_fix')) return;
  const style = document.createElement('style');
  style.id = '_codecraft_tab_fix';
  style.textContent = `
    .lang-tabs {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      gap: 4px !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      align-items: center !important;
      padding: 0 4px !important;
      max-width: 100% !important;
    }
    .lang-tabs::-webkit-scrollbar { display: none !important; }
    .lang-tab {
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      padding: 5px 12px !important;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      cursor: pointer !important;
      border-radius: 6px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      border: 1px solid transparent !important;
      background: transparent !important;
      color: var(--text-muted, #8b949e) !important;
      transition: all 0.15s ease !important;
    }
    .lang-tab:hover {
      background: rgba(255,255,255,0.06) !important;
      color: var(--text-primary, #e6edf3) !important;
    }
    .lang-tab.active {
      background: rgba(88,166,255,0.12) !important;
      border-color: rgba(88,166,255,0.35) !important;
      color: #58a6ff !important;
    }
    #editor-wrapper { position: relative !important; }
    .error-line-marker {
      position: absolute; left: 0; width: 100%;
      background: rgba(248, 81, 73, 0.18);
      border-left: 3px solid #f85149;
      pointer-events: none;
    }
    #code-editor {
      position: relative !important;
      z-index: 2 !important;
      background: transparent !important;
    }
    #editor-wrapper { background: var(--bg-editor, #0d1117) !important; }
    .error-squiggle-panel { padding: 10px 14px; }
    .squiggle-item {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 7px 10px; margin-bottom: 5px; border-radius: 6px;
      background: rgba(248,81,73,0.08); border-left: 3px solid #f85149;
      font-family: 'JetBrains Mono', monospace; font-size: 11px;
      line-height: 1.6; color: #f85149; cursor: pointer; transition: background 0.15s;
    }
    .squiggle-item:hover { background: rgba(248,81,73,0.16); }
    .squiggle-item .sq-line { font-weight: 700; min-width: 50px; color: #ff7b72; }
    .squiggle-item .sq-msg { color: #e6edf3; font-family: 'Poppins', sans-serif; font-size: 11px; }
    .squiggle-item .sq-code { display: block; margin-top: 3px; color: #8b949e; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .error-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: rgba(248,81,73,0.15); color: #f85149;
      border: 1px solid rgba(248,81,73,0.3); border-radius: 10px;
      padding: 1px 8px; font-size: 10px; font-weight: 600;
      margin-left: 8px; font-family: 'Poppins', sans-serif;
    }
  `;
  document.head.appendChild(style);
}

// ── Backend Health Check ──────────────────────────────────────────
async function checkBackend() {
  const pill = $('backend-status');
  if (!pill) return;
  const label = pill.querySelector('span:last-child');
  try {
    const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
    const d = await r.json();
    if (d.success) {
      pill.classList.remove('offline');
      pill.classList.add('online');
      label.textContent = 'Backend Online';
      state.backendOnline = true;
    } else { throw new Error('Health check failed'); }
  } catch (err) {
    pill.classList.remove('online');
    pill.classList.add('offline');
    label.textContent = 'Backend Offline';
    state.backendOnline = false;
  }
}

// ── Language Tabs ─────────────────────────────────────────────────
function buildLangTabs() {
  const container = $('lang-tabs');
  container.innerHTML = '';
  Object.values(LANGUAGES).forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'lang-tab';
    btn.dataset.lang = lang.id;
    btn.innerHTML = `<span class="lang-icon">${lang.icon}</span><span class="lang-label">${lang.name}</span>`;
    btn.addEventListener('click', () => setLanguage(lang.id));
    container.appendChild(btn);
  });
}

function setLanguage(langId) {
  const lang = LANGUAGES[langId];
  if (!lang) return;
  if (state.currentLang && state.currentLang !== langId && cmEditor) {
    state.editorHistory[state.currentLang] = cmEditor.getValue();
  }
  state.currentLang = langId;
  const savedCode = state.editorHistory[langId];
  const newCode = savedCode !== undefined ? savedCode : lang.defaultCode;
  if (cmEditor) {
    cmEditor.setValue(newCode);
    const modeMap = {
      python: 'python',
      javascript: 'javascript',
      java: 'text/x-java',
      cpp: 'text/x-c++src',
      c: 'text/x-csrc',
      csharp: 'text/x-csharp',
      php: 'application/x-httpd-php'
    };
    cmEditor.setOption('mode', modeMap[langId]);
  }
  $$('.lang-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === langId));
  $('editor-filename').textContent = `main${lang.ext}`;
  $('editor-lang-badge').textContent = lang.name;
  $('status-lang').textContent = lang.name;
  clearErrorHighlights();
  updateEditorMeta();
  clearOutput();
}

// ── Editor Events ─────────────────────────────────────────────────
function bindEditorEvents() {
  cmEditor.on('change', () => {
    updateEditorMeta();
    state.editorHistory[state.currentLang] = cmEditor.getValue();
    scheduleLint();
  });
  cmEditor.on('cursorActivity', updateEditorMeta);
}

function updateEditorMeta() {
  if (!cmEditor) return;
  const val = cmEditor.getValue();
  const cursor = cmEditor.getCursor();
  $('editor-lines').textContent = `${cmEditor.lineCount()} lines`;
  $('editor-cursor').textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
  $('status-chars').textContent = `${val.length} chars`;
}

// ── Run Code ──────────────────────────────────────────────────────
async function runCode() {
  if (state.isRunning) return;

  const code = cmEditor.getValue().trim();
  if (!code) {
    showToast('Editor is empty. Write some code first!', 'warning');
    return;
  }

  state.isRunning = true;
  clearLintTimeout();
  const startTime = Date.now();

  const runBtn = $('run-btn');
  runBtn.classList.add('loading');
  runBtn.innerHTML = '<div class="spinner"></div> Running...';
  setOutputTab('output');
  showExecStatus('running', 'Executing your code...');

  const terminal = $('output-terminal');
  terminal.innerHTML = `
    <div class="output-line system">▶ Running ${LANGUAGES[state.currentLang].name} code...</div>
    <div class="output-line system pulse">● Waiting for output</div>
  `;

  const stdin = state.pendingStdin || '';
  // state.pendingStdin = '';

  try {
    const response = await fetch(`${API_BASE}/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: state.currentLang,
        source_code: code,
        stdin,
      }),
    });
    const data = await response.json();
    const elapsed = Date.now() - startTime;
    state.executionTime = elapsed;
    if (data.success) {
      renderOutput(data.output, data.error, elapsed, data.exit_code);
    } else {
      renderError(data.message || 'Execution failed', elapsed);
    }
  } catch (err) {
    const elapsed = Date.now() - startTime;
    renderApiError(elapsed);
  } finally {
    state.isRunning = false;
    runBtn.classList.remove('loading');
    runBtn.innerHTML = '<span class="run-icon">▶</span> Run';
  }
}

// ── Stdin Bar (Programiz-style) ───────────────────────────────────
function showStdinBar() {
  const terminal = $('output-terminal');
  const oldBar = $('inline-input-prompt');
  if (oldBar) oldBar.style.display = 'none';

  const lines = terminal.querySelectorAll('.output-line:not(.system)');
  const lastLine = lines[lines.length - 1];

  // --- NEW: Capture the prompt text ---
  const promptText = lastLine ? lastLine.textContent : '';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'terminal-inline-input';
  input.autocomplete = 'off';
  input.spellcheck = false;

  if (lastLine) {
    lastLine.style.display = 'flex';
    lastLine.style.alignItems = 'center';
    lastLine.appendChild(input);
  } else {
    const div = document.createElement('div');
    div.className = 'output-line';
    div.style.display = 'flex';
    div.appendChild(input);
    terminal.appendChild(div);
  }

  setTimeout(() => input.focus(), 50);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value;

      const span = document.createElement('span');
      span.style.color = 'var(--accent-green)';
      span.style.marginLeft = '6px';
      span.textContent = val;
      input.replaceWith(span);

      // --- NEW: Save the typed input mapping to its prompt ---
      state.inputHistory = state.inputHistory || [];
      state.inputHistory.push({ prompt: promptText, value: val });

      state.pendingStdin = (state.pendingStdin || '') + val + '\n';
      runCode();
    }
  });
}

function hideStdinBar() {
  // Old bottom bar-a hide pandrom
  const wrap = $('inline-input-prompt');
  if (wrap) wrap.style.display = 'none';
  
  // Execution mudinja aprm leftover inputs edhachum irundha adha disable pandrom
  $$('.terminal-inline-input').forEach(el => el.disabled = true);
}
function hideStdinBar() {
  const wrap = $('inline-input-prompt');
  if (wrap) wrap.style.display = 'none';
}

// ── Render Output ─────────────────────────────────────────────────
function renderOutput(stdout, stderr, elapsed, exitCode) {
  hideStdinBar();
  const terminal = $('output-terminal');
  terminal.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'output-line system';
  header.textContent = `▶ ${LANGUAGES[state.currentLang].name} | Exit code: ${exitCode} | ${elapsed}ms`;
  terminal.appendChild(header);

  const divider = document.createElement('div');
  divider.className = 'output-line system';
  divider.textContent = '─'.repeat(40);
  terminal.appendChild(divider);

  // --- NEW: Reconstruct stdout to separate prompt and result into different lines ---
  let displayStdout = stdout || '';
  if (state.inputHistory && state.inputHistory.length > 0) {
    state.inputHistory.forEach(item => {
      if (item.prompt) {
        // Insert the user's input and a newline (\n) right after the prompt
        displayStdout = displayStdout.replace(item.prompt, item.prompt + item.value + '\n');
      }
    });
  }

  // ── NEW LOGIC: Detect missing input crashes ──
  const isEofError = stderr && (
    stderr.includes('NoSuchElementException') || // Java
    stderr.includes('EOFError') ||               // Python
    (state.currentLang === 'csharp' && stderr.includes('NullReferenceException')) // C#
  );

  // Note: We use displayStdout here instead of stdout
  const looksLikePrompt = isEofError || (displayStdout && !displayStdout.endsWith('\n') && !stderr && exitCode === 0);

  if (looksLikePrompt) {
    // Print only displayStdout (the prompt), hide the crash error
    if (displayStdout) {
      displayStdout.split('\n').forEach(line => {
        const el = document.createElement('div');
        el.className = 'output-line';
        el.textContent = line;
        terminal.appendChild(el);
      });
    }
    showStdinBar();
    showExecStatus('running', 'Waiting for input...');
    updateStatusBar('normal', '⌨ Waiting for input…');
    return; // Stop here! Don't print the error.
  }

  // ── Normal Output Rendering ──
  // Note: We use displayStdout here instead of stdout
  if (displayStdout) {
    displayStdout.split('\n').forEach(line => {
      const el = document.createElement('div');
      el.className = 'output-line';
      el.textContent = line;
      terminal.appendChild(el);
    });
  } else if (!stderr) {
    const el = document.createElement('div');
    el.className = 'output-line system';
    el.textContent = '(no output)';
    terminal.appendChild(el);
  }

  if (stderr) {
    const errHeader = document.createElement('div');
    errHeader.className = 'output-line error';
    errHeader.textContent = '⚠ stderr:';
    terminal.appendChild(errHeader);

    stderr.split('\n').forEach(line => {
      if (!line.trim()) return;
      const el = document.createElement('div');
      el.className = 'output-line error';
      el.textContent = line;
      terminal.appendChild(el);
    });

    const errorLines = parseErrorLines(stderr, exitCode);
    if (errorLines.length > 0) {
      highlightErrorLines(errorLines);
      appendErrorSquiggles(terminal, errorLines, stderr);
    }
  } else {
    clearErrorHighlights();
  }

  if (exitCode === 0) {
    hideStdinBar();
    showExecStatus('success', `Finished in ${elapsed}ms`);
    updateStatusBar('success', `✓ Ran successfully in ${elapsed}ms`);
    $('tab-badge-output').classList.remove('visible');
    clearErrorHighlights();

    const successLine = document.createElement('div');
    successLine.className = 'output-line success-banner';
    successLine.textContent = '=== Code Execution Successful ===';
    terminal.appendChild(successLine);
  } else {
    hideStdinBar();
    showExecStatus('error', `Exited with code ${exitCode}`);
    updateStatusBar('error', `✗ Exit code ${exitCode}`);
    $('tab-badge-output').classList.add('visible');
  }

  // Pass original stdout to info panel so line count remains accurate
  updateInfoPanel(elapsed, exitCode, stdout, stderr);
}
  // ── KEY LOGIC: detect stdin prompt vs finished output ──
  // If stdout ends without a newline AND no error, it's a prompt like "Enter your name: "
//   const looksLikePrompt = stdout && !stdout.endsWith('\n') && !stderr && exitCode === 0;

//   if (looksLikePrompt) {
//     showStdinBar();
//     showExecStatus('running', 'Waiting for input...');
//     updateStatusBar('normal', '⌨ Waiting for input…');
//   } else if (exitCode === 0) {
//     hideStdinBar();
//     showExecStatus('success', `Finished in ${elapsed}ms`);
//     updateStatusBar('success', `✓ Ran successfully in ${elapsed}ms`);
//     $('tab-badge-output').classList.remove('visible');
//     clearErrorHighlights();

//     // Show "=== Code Execution Successful ===" like Programiz
//     const successLine = document.createElement('div');
//     successLine.className = 'output-line success-banner';
//     successLine.textContent = '=== Code Execution Successful ===';
//     terminal.appendChild(successLine);
//   } else {
//     hideStdinBar();
//     showExecStatus('error', `Exited with code ${exitCode}`);
//     updateStatusBar('error', `✗ Exit code ${exitCode}`);
//     $('tab-badge-output').classList.add('visible');
//   }

//   updateInfoPanel(elapsed, exitCode, stdout, stderr);
// }

function renderError(msg, elapsed) {
  hideStdinBar();
  const terminal = $('output-terminal');
  terminal.innerHTML = `
    <div class="output-line system">▶ ${LANGUAGES[state.currentLang].name} | ${elapsed}ms</div>
    <div class="output-line system">${'─'.repeat(40)}</div>
    <div class="output-line error">✗ Error: ${escapeHtml(msg)}</div>
  `;
  showExecStatus('error', msg);
  updateStatusBar('error', `✗ ${msg}`);
  $('tab-badge-output').classList.add('visible');
}

function renderApiError(elapsed) {
  hideStdinBar();
  const terminal = $('output-terminal');
  terminal.innerHTML = `
    <div class="output-line system">▶ ${LANGUAGES[state.currentLang].name} | ${elapsed}ms</div>
    <div class="output-line system">${'─'.repeat(40)}</div>
    <div class="output-line error">✗ Cannot connect to MakeLabs API server.</div>
  `;
  showExecStatus('error', 'API server not running');
  updateStatusBar('error', '✗ API offline');
}

function updateInfoPanel(elapsed, exitCode, stdout, stderr) {
  const lang = LANGUAGES[state.currentLang];
  $('info-lang').textContent = lang.name;
  $('info-time').textContent = `${elapsed}ms`;
  $('info-exit').textContent = exitCode;
  $('info-exit').className = 'value ' + (exitCode === 0 ? 'green' : 'red');
  $('info-lines-out').textContent = stdout ? stdout.split('\n').length : 0;
  $('info-errors').textContent = stderr ? stderr.split('\n').filter(l => l.trim()).length : 0;
  $('info-errors').className = 'value ' + (stderr ? 'red' : 'green');
}

// ── Error Line Parsing ────────────────────────────────────────────
function parseErrorLines(stderr, exitCode) {
  if (!stderr || exitCode === 0) return [];
  const errors = [];
  const lines = stderr.split('\n');
  const lang = state.currentLang;

  const patterns = {
    python: [/File\s+"[^"]*",\s+line\s+(\d+)/gi, /line\s+(\d+)/gi],
    java: [/\.java:(\d+):/gi, /line\s+(\d+)/gi],
    c: [/\.c:(\d+):\d+:/gi, /\.c:(\d+):/gi],
    cpp: [/\.cpp:(\d+):\d+:/gi, /\.cpp:(\d+):/gi],
    csharp: [/\((\d+),\d+\):\s*error/gi, /line\s+(\d+)/gi],
    javascript: [/:(\d+):\d+\)?$/gm, /evalmachine\.__anonymous__:(\d+)/gi],
    php: [/on line\s+(\d+)/gi, /in\s+\S+\s+on\s+line\s+(\d+)/gi],
  };

  const langPatterns = patterns[lang] || [/line\s+(\d+)/gi];
  const seen = new Set();

  for (const pattern of langPatterns) {
    pattern.lastIndex = 0;
    for (const line of lines) {
      let match;
      const re = new RegExp(pattern.source, pattern.flags);
      while ((match = re.exec(line)) !== null) {
        const lineNum = parseInt(match[1], 10);
        if (!isNaN(lineNum) && lineNum > 0 && !seen.has(lineNum)) {
          seen.add(lineNum);
          const msg = extractErrorMessage(line, lang);
          errors.push({ line: lineNum, message: msg, raw: line.trim() });
        }
      }
    }
  }
  return errors.slice(0, 10);
}

function extractErrorMessage(line, lang) {
  const cleaned = line.trim();
  const msg = cleaned
    .replace(/^[^\s:]+:\d+:\d+:\s*/, '')
    .replace(/^[^\s:]+:\d+:\s*/, '')
    .replace(/^\s*\^\s*$/, '')
    .replace(/^error:/i, '⚠ ')
    .replace(/^warning:/i, '⚡ ')
    .trim();
  return msg || cleaned;
}

// ── Error Highlight Overlay ───────────────────────────────────────
function highlightErrorLines(errorLines) {
  clearErrorHighlights();
  const editor = $('code-editor');
  const wrapper = $('editor-wrapper');
  if (!editor || !wrapper) return;

  const overlay = document.createElement('div');
  overlay.id = '_error_overlay';
  overlay.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: hidden;`;
  wrapper.style.position = 'relative';
  wrapper.insertBefore(overlay, editor);
  editor._errorLines = errorLines;
  syncErrorHighlights();
}

function syncErrorHighlights() {
  const editor = $('code-editor');
  const overlay = document.getElementById('_error_overlay');
  if (!editor || !overlay || !editor._errorLines) return;

  const style = window.getComputedStyle(editor);
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5 || 20;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const scrollTop = editor.scrollTop;

  overlay.innerHTML = '';
  editor._errorLines.forEach(({ line }) => {
    const y = paddingTop + (line - 1) * lineHeight - scrollTop;
    if (y + lineHeight < 0 || y > editor.clientHeight) return;
    const marker = document.createElement('div');
    marker.style.cssText = `position: absolute; left: ${paddingLeft}px; top: ${y}px; width: calc(100% - ${paddingLeft}px); height: ${lineHeight}px; background: rgba(248, 81, 73, 0.12); border-left: 3px solid #f85149; box-sizing: border-box;`;
    overlay.appendChild(marker);
  });
}

function clearErrorHighlights() {
  const overlay = document.getElementById('_error_overlay');
  if (overlay) overlay.remove();
  const editor = $('code-editor');
  if (editor) editor._errorLines = null;
}

// ── Error Squiggle Panel ──────────────────────────────────────────
function appendErrorSquiggles(terminal, errorLines, stderr) {
  if (!errorLines.length) return;
  const editor = $('code-editor');
  const codeLines = editor ? editor.value.split('\n') : [];

  const sep = document.createElement('div');
  sep.className = 'output-line system';
  sep.textContent = '─'.repeat(40);
  terminal.appendChild(sep);

  const heading = document.createElement('div');
  heading.className = 'output-line system';
  heading.innerHTML = `⚠ Syntax / Runtime Errors <span class="error-badge">✗ ${errorLines.length} error${errorLines.length > 1 ? 's' : ''}</span>`;
  terminal.appendChild(heading);

  const panel = document.createElement('div');
  panel.className = 'error-squiggle-panel';

  errorLines.forEach(({ line, message }) => {
    const codeLine = codeLines[line - 1] || '';
    const item = document.createElement('div');
    item.className = 'squiggle-item';
    item.innerHTML = `
      <span class="sq-line">Ln ${line}</span>
      <span>
        <span class="sq-msg">${escapeHtml(message)}</span>
        ${codeLine.trim() ? `<span class="sq-code">${escapeHtml(codeLine.trim())}</span>` : ''}
      </span>
    `;
    item.addEventListener('click', () => jumpToLine(line));
    panel.appendChild(item);
  });
  terminal.appendChild(panel);
}

function jumpToLine(lineNum) {
  if (!cmEditor) return;
  cmEditor.setCursor({ line: lineNum - 1, ch: 0 });
  cmEditor.focus();
  showToast(`Jumped to line ${lineNum}`, 'info');
}

// ── Live Lint ─────────────────────────────────────────────────────
let _lintTimeout = null;
function scheduleLint() {
  clearLintTimeout();
  _lintTimeout = setTimeout(() => lintCurrentCode(), 800);
}
function clearLintTimeout() {
  if (_lintTimeout) { clearTimeout(_lintTimeout); _lintTimeout = null; }
}

function lintCurrentCode() {
  if (!cmEditor) return;
  const code = cmEditor.getValue();
  const lang = state.currentLang;
  const errors = [];
  if (lang === 'python') errors.push(...lintPython(code));
  else if (lang === 'javascript') errors.push(...lintJavaScript(code));
  else if (lang === 'java') errors.push(...lintJava(code));
  else if (lang === 'php') errors.push(...lintPHP(code));
  if (errors.length > 0) highlightErrorLines(errors);
  else clearErrorHighlights();
}

function lintPython(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    if (line.startsWith('\t') && code.includes('    ')) errors.push({ line: lineNum, message: 'Inconsistent indentation' });
    const singleQuotes = (trimmed.match(/(?<!\\)'/g) || []).length;
    if (trimmed && !trimmed.startsWith('#') && singleQuotes % 2 !== 0 && !trimmed.includes("'''")) errors.push({ line: lineNum, message: 'Possible unclosed string' });
    if (/^print\s+[^(]/.test(trimmed) && !trimmed.startsWith('#')) errors.push({ line: lineNum, message: 'print() requires parentheses' });
  });
  return errors.slice(0, 8);
}

function lintJavaScript(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (/if\s*\([^=!<>]*[^=!<>]=[^=][^)]*\)/.test(trimmed)) errors.push({ line: lineNum, message: 'Possible assignment in condition' });
  });
  return errors.slice(0, 8);
}

function lintJava(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (/System\.out\.print(ln)?\(.*\)\s*$/.test(trimmed) && !trimmed.endsWith(';')) errors.push({ line: lineNum, message: 'Missing semicolon' });
  });
  return errors.slice(0, 8);
}

function lintPHP(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed) && !trimmed.startsWith('$')) errors.push({ line: lineNum, message: 'PHP variables must start with $' });
  });
  return errors.slice(0, 8);
}

// ── UI Control ────────────────────────────────────────────────────
function setOutputTab(tabId) {
  $$('.output-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  $$('.output-panel').forEach(p => p.classList.toggle('active', p.id === `${tabId}-panel`));
}

function showExecStatus(type, msg) {
  const el = $('exec-status');
  el.className = `exec-status ${type}`;
  const icons = { running: '⟳', success: '✓', error: '✗' };
  el.innerHTML = `<span>${icons[type]}</span> ${escapeHtml(msg)}`;
}

function updateStatusBar(st = 'normal', msg = null) {
  const bar = $('status-bar');
  bar.className = st === 'error' ? 'error-state' : st === 'success' ? 'success-state' : '';
  if (msg) $('status-msg').textContent = msg;
}

function clearOutput() {
  hideStdinBar();
  showWelcomeOutput();
  showExecStatus('running', 'Ready');
  $('tab-badge-output').classList.remove('visible');
  updateStatusBar('normal', '');
  $('info-lang').textContent = LANGUAGES[state.currentLang].name;
}

function showWelcomeOutput() {
  $('output-terminal').innerHTML = `<div class="output-placeholder"><div class="ph-icon">▷</div><p>Click <strong>Run</strong> to execute</p></div>`;
}

// ── Toggle Theme ──────────────────────────────────────────────────
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-mode');
  const themeBtn = Array.from($$('button')).find(b => b.dataset.tooltip === 'Toggle Theme');
  if (isLight) {
    if (themeBtn) themeBtn.innerHTML = '☀️';
    showToast('Switched to Light Theme', 'info');
    localStorage.setItem('cc-theme', 'light');
    if (cmEditor) cmEditor.setOption('theme', 'eclipse');
  } else {
    if (themeBtn) themeBtn.innerHTML = '🌙';
    showToast('Switched to Dark Theme', 'info');
    localStorage.setItem('cc-theme', 'dark');
    if (cmEditor) cmEditor.setOption('theme', 'dracula');
  }
}

// ── Event Binding ─────────────────────────────────────────────────
function bindTopbarActions() {
  // Run button — fires immediately, no "need input?" prompt
  $('run-btn').addEventListener('click', () => {
    state.pendingStdin = '';
    state.inputHistory = [];
    const code = cmEditor ? cmEditor.getValue().trim() : '';
    
    if (!code) { showToast('Editor is empty. Write some code first!', 'warning'); return; }
    setOutputTab('output');
    runCode();
  });

  const askAiBtn = $('btn-ask-ai');
  if (askAiBtn) {
    askAiBtn.addEventListener('click', () => {
      askAI();
    });
  }

  $('btn-reset').addEventListener('click', () => {
    cmEditor.setValue(LANGUAGES[state.currentLang].defaultCode);
    state.editorHistory[state.currentLang] = LANGUAGES[state.currentLang].defaultCode;
    updateEditorMeta(); clearErrorHighlights();
    showToast('Reset to default code', 'info');
  });

  $('btn-clear').addEventListener('click', () => {
    if (!cmEditor.getValue().trim()) {
      showToast('Editor is already empty', 'info');
      return;
    }
    cmEditor.setValue('');
    state.editorHistory[state.currentLang] = '';
    updateEditorMeta();
    clearErrorHighlights();
    clearOutput();
    showToast('Editor cleared!', 'success');
  });

  $('btn-copy').addEventListener('click', () => {
    const code = cmEditor.getValue();
    if (!code.trim()) { showToast('Nothing to copy', 'warning'); return; }
    navigator.clipboard.writeText(code).then(() => showToast('Code copied!', 'success'));
  });

  $('btn-save').addEventListener('click', () => openModal('save-modal'));
  $('btn-do-save').addEventListener('click', saveSnippet);

  $$('.output-tab').forEach(tab => tab.addEventListener('click', () => setOutputTab(tab.dataset.tab)));

  $$('.modal-close').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id))
  );
  $$('.modal-overlay').forEach(o =>
    o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); })
  );

  $('btn-copy-url').addEventListener('click', () =>
    navigator.clipboard.writeText($('share-url').value).then(() => showToast('URL copied!', 'success'))
  );

  $('btn-web-share').addEventListener('click', async () => {
    try {
      await navigator.share({ title: 'MakeLabs Snippet', url: $('share-url').value });
    } catch (err) { console.log("Share failed or cancelled"); }
  });

  $('btn-share-whatsapp').addEventListener('click', () => {
    const url = encodeURIComponent($('share-url').value);
    window.open(`https://wa.me/?text=Check out my code: ${url}`, '_blank');
  });
}

async function saveSnippet() {
  const title = $('snippet-title').value.trim() || 'Untitled Snippet';
  const code = cmEditor.getValue();
  const isPublic = $('snippet-public').checked;
  try {
    const res = await fetch(`${API_BASE}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, language: state.currentLang, source_code: code, is_public: isPublic }),
    });
    const data = await res.json();
    if (data.success) {
      closeModal('save-modal');
      const shareUrl = `${window.location.origin}/snippet/${data.id}`;
      $('share-url').value = shareUrl;
      openModal('share-modal');
      showToast('Snippet saved!', 'success');
    } else { showToast(data.message || 'Save failed', 'error'); }
  } catch {
    closeModal('save-modal');
    showToast('Backend connection required', 'warning');
  }
}

function buildSidebarBtns() {
  const actions = [
    { icon: '📂', tooltip: 'Examples', action: () => { populateExamples(); openModal('examples-modal'); } },
    { icon: '⚙', tooltip: 'Settings', action: () => openSettingsModal() },
    { icon: '❓', tooltip: 'Help', action: () => openModal('help-modal') },
  ];
  const sidebar = $('sidebar');
  sidebar.innerHTML = '';
  actions.forEach(({ icon, tooltip, action }) => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-btn';
    btn.dataset.tooltip = tooltip;
    btn.innerHTML = icon;
    btn.addEventListener('click', action);
    sidebar.appendChild(btn);
  });
  const sep = document.createElement('div');
  sep.className = 'sidebar-sep';
  sidebar.appendChild(sep);
  const themeBtn = document.createElement('button');
  themeBtn.className = 'sidebar-btn';
  themeBtn.dataset.tooltip = 'Toggle Theme';
  themeBtn.innerHTML = '🌙';
  themeBtn.addEventListener('click', toggleTheme);
  sidebar.appendChild(themeBtn);
}

function populateExamples() {
  const container = $('examples-container');
  if (!container) return;
  container.innerHTML = '';
  EXAMPLES.forEach(ex => {
    const lang = LANGUAGES[ex.lang];
    if (!lang) return;
    const card = document.createElement('div');
    card.className = 'example-card';
    card.innerHTML = `
      <div class="ex-title">${escapeHtml(ex.title)}</div>
      <div class="ex-lang"><span>${lang.icon}</span> ${lang.name}</div>
    `;
    card.addEventListener('click', () => {
      setLanguage(ex.lang);
      cmEditor.setValue(ex.code);
      closeModal('examples-modal');
      showToast(`Loaded ${ex.title}`, 'success');
    });
    container.appendChild(card);
  });
}

function bindResizeHandle() {
  const handle = $('resize-handle');
  const outputPane = $('output-pane');
  const main = $('main');
  let startX, startWidth;
  handle.addEventListener('mousedown', e => {
    state.resizing = true; startX = e.clientX; startWidth = outputPane.offsetWidth;
    handle.classList.add('dragging'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!state.resizing) return;
    const delta = startX - e.clientX;
    const newWidth = Math.min(Math.max(startWidth + delta, 250), main.offsetWidth * 0.7);
    outputPane.style.width = newWidth + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (state.resizing) { state.resizing = false; handle.classList.remove('dragging'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }
  });
}

function openModal(id) { const el = $(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = $(id); if (el) el.classList.remove('open'); }

function showToast(msg, type = 'info') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${escapeHtml(msg)}`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── AI Assistant ──────────────────────────────────────────────────
let currentChatHistory = [];

async function askAI() {
  if (!cmEditor) return;
  const code = cmEditor.getValue().trim();
  if (!code) { showToast('Please write some code first!', 'warning'); return; }

  currentChatHistory = [
    { role: "system", content: "You are a helpful coding tutor. Keep explanations short, formatted in markdown, and always end by asking the user what they want to do next." },
    { role: "user", content: `Language: ${state.currentLang}\nCode:\n${code}\n\nExplain this code and suggest an improvement.` }
  ];

  openModal('ai-modal');
  $('ai-chat-history').innerHTML = '';
  $('ai-chat-input').value = '';

  appendChatMessage('AI', '<div class="spinner" style="border-top-color: var(--text-primary); width: 14px; height: 14px;"></div> Thinking...');
  await fetchAiResponse();
}

async function fetchAiResponse() {
  try {
    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatHistory: currentChatHistory }),
    });
    const data = await response.json();
    const chatContainer = $('ai-chat-history');
    chatContainer.removeChild(chatContainer.lastChild);
    if (data.success) {
      currentChatHistory.push(data.reply);
      appendChatMessage('AI', data.reply.content);
    } else {
      appendChatMessage('System', '❌ ' + (data.message || 'Analysis failed.'));
    }
  } catch (err) {
    $('ai-chat-history').removeChild($('ai-chat-history').lastChild);
    appendChatMessage('System', '❌ Could not connect to the backend server.');
  }
}

function appendChatMessage(sender, text) {
  const chatContainer = $('ai-chat-history');
  const msgDiv = document.createElement('div');
  const isUser = sender === 'You';
  msgDiv.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
  msgDiv.style.backgroundColor = isUser ? '#a371f7' : 'var(--bg-tertiary)';
  msgDiv.style.color = isUser ? '#fff' : 'var(--text-primary)';
  msgDiv.style.padding = '12px 16px';
  msgDiv.style.borderRadius = '8px';
  msgDiv.style.maxWidth = '85%';
  msgDiv.style.whiteSpace = 'pre-wrap';
  msgDiv.style.lineHeight = '1.6';
  msgDiv.style.border = isUser ? 'none' : '1px solid var(--border)';
  msgDiv.innerHTML = `<strong style="font-size:11px; opacity:0.8; display:block; margin-bottom:4px; text-transform:uppercase;">${sender}</strong>${text}`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Bind AI send button
document.addEventListener('DOMContentLoaded', () => {
  const btnAiSend = $('btn-ai-send');
  const aiInput = $('ai-chat-input');
  if (btnAiSend && aiInput) {
    const sendFollowUp = () => {
      const text = aiInput.value.trim();
      if (!text) return;
      appendChatMessage('You', text);
      currentChatHistory.push({ role: 'user', content: text });
      aiInput.value = '';
      appendChatMessage('AI', '<div class="spinner" style="border-top-color: var(--text-primary); width: 14px; height: 14px;"></div> Thinking...');
      fetchAiResponse();
    };
    btnAiSend.addEventListener('click', sendFollowUp);
    aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendFollowUp(); });
  }
});

window.runCode = runCode;
window.setLanguage = setLanguage;
window.jumpToLine = jumpToLine;
