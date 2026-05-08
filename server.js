/**
 * Motor de Inferencia Lógica como Servicio
 * Servidor HTTP con motor Prolog (Tau Prolog) vía Express
 */

const express = require("express");
const pl = require("tau-prolog");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const KB_PATH = path.join(__dirname, "knowledge", "base.pl");

// ─── Capa Funcional: normalización de entrada ────────────────────────────────

const normalizeQuery = (query) => {
  const trimmed = query.trim();
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
};

const formatAnswers = (answers) =>
  answers.map((answer) => ({
    solution: answer.toString(),
    bindings: extractBindings(answer),
  }));

const extractBindings = (term) => {
  if (!term || term.id !== ",") return {};
  const bindings = {};
  const collectLinks = (t) => {
    if (!t) return;
    if (t.id === "=" && t.args && t.args.length === 2) {
      bindings[t.args[0].toString()] = t.args[1].toString();
    } else if (t.id === ",") {
      collectLinks(t.args[0]);
      collectLinks(t.args[1]);
    }
  };
  collectLinks(term);
  return bindings;
};

// ─── Capa Asíncrona: motor de inferencia ─────────────────────────────────────

const runPrologQuery = (queryStr) =>
  new Promise((resolve, reject) => {
    const session = pl.create(1000);
    const kb = fs.readFileSync(KB_PATH, "utf-8");

    session.consult(kb, {
      success: () => {
        session.query(queryStr, {
          success: () => {
            const answers = [];
            const fetchNext = () => {
              session.answer({
                success: (answer) => {
                  answers.push(answer);
                  fetchNext();
                },
                fail: () => resolve(answers),
                error: (err) => reject(new Error(`Inference error: ${err}`)),
                limit: () => reject(new Error("Step limit reached")),
              });
            };
            fetchNext();
          },
          error: (err) => reject(new Error(`Query parse error: ${err.toString()}`)),
        });
      },
      error: (err) => reject(new Error(`KB load error: ${err.toString()}`)),
    });
  });

// ─── Endpoints ────────────────────────────────────────────────────────────────

app.post("/query", async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "El campo 'query' es requerido." });
  }

  const normalized = normalizeQuery(query);
  try {
    const rawAnswers = await runPrologQuery(normalized);
    if (rawAnswers.length === 0) {
      return res.json({ query: normalized, results: [], count: 0, message: "false." });
    }
    return res.json({ query: normalized, results: formatAnswers(rawAnswers), count: rawAnswers.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    knowledgeBase: fs.existsSync(KB_PATH) ? "loaded" : "missing",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Motor de Inferencia corriendo en http://localhost:${PORT}`);
});