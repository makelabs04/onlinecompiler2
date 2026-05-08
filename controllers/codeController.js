// backend/controllers/codeController.js
const axios = require('axios');
const LANGUAGES = require('../config/languages');
const ExecutionModel = require('../models/ExecutionModel');

// ── Judge0 CE Language IDs ────────────────────────────────────────
const JUDGE0_LANG_IDS = {
  python:     71,
  java:       62,
  cpp:        54,
  c:          50,
  csharp:     51,
  javascript: 63,
  php:        68,
};

class CodeController {

  // ── POST /api/code/run ──────────────────────────────────────────
  static async runCode(req, res) {
    try {
      const { language, source_code, stdin = '' } = req.body;

      if (!language || !source_code) {
        return res.status(400).json({
          success: false,
          message: 'language and source_code are required.',
        });
      }

      const langConfig = LANGUAGES[language];
      if (!langConfig) {
        return res.status(400).json({
          success: false,
          message: `Unsupported language: "${language}"`,
          supported: Object.keys(LANGUAGES),
        });
      }

      const languageId = JUDGE0_LANG_IDS[language];
      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Judge0 language ID not found for: "${language}"`,
        });
      }

      const startTime = Date.now();

      // Step 1 — Submit to Judge0 CE
      const token = await CodeController.submitCode(languageId, source_code, stdin);

      // Step 2 — Poll for result
      const result = await CodeController.pollResult(token);

      const executionTime = Date.now() - startTime;

      // Step 3 — Decode base64 outputs
      const stdout = CodeController.decode(result.stdout);
      const stderr = CodeController.decode(result.stderr);
      const compileOutput = CodeController.decode(result.compile_output);
      const exitCode = result.exit_code ?? 0;

      const errorOutput = [compileOutput, stderr].filter(Boolean).join('\n').trim();

      ExecutionModel.saveExecution({
        language,
        source_code,
        stdin,
        stdout,
        stderr: errorOutput,
        exit_code: exitCode,
        execution_time: executionTime,
        status: result.status?.id === 3 ? 'completed' : 'error',
      }).catch(() => {});

      return res.json({
        success:        true,
        output:         stdout,
        error:          errorOutput,
        exit_code:      exitCode,
        execution_time: executionTime,
        language:       langConfig.name,
        status:         result.status?.description || 'Completed',
        memory:         result.memory,
        time:           result.time,
      });

    } catch (error) {
      console.error('Code execution error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Code execution failed. Please try again.',
      });
    }
  }

  // ── Submit code to Judge0, returns token ─────────────────────────
  static async submitCode(languageId, sourceCode, stdin) {
    const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

    const payload = {
      language_id:    languageId,
      source_code:    Buffer.from(sourceCode).toString('base64'),
      stdin:          Buffer.from(stdin || '').toString('base64'),
      base64_encoded: true,
    };

    const response = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    if (!response.data?.token) {
      throw new Error('Judge0 did not return a submission token.');
    }

    return response.data.token;
  }

  // ── Poll Judge0 until result is ready ────────────────────────────
  static async pollResult(token, maxAttempts = 15, intervalMs = 1000) {
    const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await CodeController.sleep(intervalMs);

      const response = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,status,exit_code,memory,time`,
        { timeout: 10000 }
      );

      const data = response.data;
      const statusId = data.status?.id;

      // 1=In Queue, 2=Processing, 3=Accepted, 4+=Error/Done
      if (statusId && statusId >= 3) {
        return data;
      }

      console.log(`  Poll ${attempt}/${maxAttempts} — ${data.status?.description}`);
    }

    throw new Error('Execution timed out. Please try again.');
  }

  // ── Decode base64 safely ─────────────────────────────────────────
  static decode(b64) {
    if (!b64) return '';
    try {
      return Buffer.from(b64, 'base64').toString('utf-8');
    } catch {
      return b64;
    }
  }
static async health(req, res) {
    return res.json({ success: true, status: 'online' });
  }
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── GET /api/code/languages ──────────────────────────────────────
  static async getLanguages(req, res) {
    const langs = Object.values(LANGUAGES).map(l => ({
      id:       l.id,
      name:     l.name,
      extension:l.extension,
      icon:     l.icon,
      color:    l.color,
      judge0Id: JUDGE0_LANG_IDS[l.id],
    }));
    return res.json({ success: true, languages: langs });
  }

  // ── GET /api/code/languages/:id/default ─────────────────────────
  static async getDefaultCode(req, res) {
    const lang = LANGUAGES[req.params.id];
    if (!lang) {
      return res.status(404).json({ success: false, message: 'Language not found' });
    }
    return res.json({ success: true, code: lang.defaultCode, language: lang.name });
  }

  // ── GET /api/code/stats ──────────────────────────────────────────
  static async getStats(req, res) {
    try {
      const stats = await ExecutionModel.getStats();
      return res.json({ success: true, stats });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = CodeController;