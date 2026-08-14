const STORAGE_KEY = "bio30_dna_virtual_lab";

const defaultLabData = {
  studentName: "",

  completedStages: {
    stage1: false,
    stage2: false,
    stage3: false,
    stage4: false,
    stage5: false,
    stage6: false,
    challenge: false
  },

  /* ===================== STAGE 1 ===================== */
  stage1: {
    model: { phosphate: "", sugar: "", base: "" },
    attempts: 0,
    modelCorrect: false,
    variableComponent: "",
    analysisCorrect: false
  },

  /* ===================== STAGE 2 ===================== */
  stage2: {
    families: { adenine: "", guanine: "", cytosine: "", thymine: "" },
    rings: { adenine: "", guanine: "", cytosine: "", thymine: "" },
    structureCorrect: false,
    widestPair: "",
    narrowestPair: "",
    normalPairs: [],
    applicationCorrect: false,
    thymineCount: "",
    guanineCount: "",
    cytosineCount: "",
    purineCount: "",
    calculationsCorrect: false,
    synthesisCorrect: false
  },

  /* ===================== STAGE 3 =====================
     The phosphate + deoxyribose backbone is pre-built at
     every position. Stage 3 focuses on base sequence,
     directionality, backbone bonding, structural
     diagnosis, and transfer. */
  stage3: {
    sequence: ["", "", "", "", "", ""],
    buildCorrect: false,
    bondChoice: "",
    bondAnswer: "",
    bondCorrect: false,
    errorAnswer: "",
    consequenceAnswer: "",
    diagnosisCorrect: false,
    analysisCorrect: false
  },

  /* ===================== STAGE 4 ===================== */
  stage4: {
    stabilityAnswer: "",
    stabilityCorrect: false,
    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",
    calculationsCorrect: false,
    heatingAnswer: "",
    heatingCorrect: false,
    analysisCorrect: false
  },

stage5: {
  sampleAnswer: "",
  partACorrect: false,

  diagnosisAnswer: "",
  diagnosisCorrect: false,

  backboneAnswer: "",
  backboneCorrect: false,

  claimAnswer: "",
  analysisCorrect: false
},

  /* ===================== STAGE 6 ===================== */
  stage6: {
    selectedModel: "",
    evidence: [],
    analysisCorrect: false
  },

  /* =================== FINAL CHALLENGE =================== */
  challenge: {
    sequence: ["", "", "", "", "", "", "", ""],
    leftDirection: "",
    rightDirection: "",
    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",
    purines: "",
    analysisCorrect: false
  },

  /* ============== NOTEBOOK / SAVED WRITTEN RESPONSES ============== */
  notebook: {
    stage1Note: "",
    stage2Note: "",
    stage3Note: "",
    stage3DiagnosisNote: "",
    stage4StabilityNote: "",
    stage4HeatingNote: "",
    stage4Note: "",
    stage5PartANote: "",
    stage5PartBNote: "",
    stage5PartCNote: "",
    stage5Note: "",
    stage6Note: "",
    finalNote: ""
  }
};


/* =========================================================
   DATA MANAGEMENT
   ========================================================= */

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(defaultLabData));
}

function mergeObjects(target, source) {
  if (!source) {
    return target;
  }

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];

    if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
      if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
        target[key] = {};
      }
      mergeObjects(target[key], sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

function loadLabData() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return cloneDefaultData();
  }

  try {
    const parsed = JSON.parse(raw);
    return mergeObjects(cloneDefaultData(), parsed);
  } catch (error) {
    console.warn("Saved DNA lab data could not be read.", error);
    return cloneDefaultData();
  }
}

let labData = loadLabData();

function saveLabData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(labData));
  showSaveStatus();
}

function showSaveStatus() {
  const status = document.querySelector("#save-status");
  if (!status) {
    return;
  }

  const normalText =
    document.body.dataset.page === "home"
      ? "Progress saves automatically"
      : "✓ Saved";

  status.textContent = "✓ Saved";

  clearTimeout(showSaveStatus.timer);
  showSaveStatus.timer = setTimeout(() => {
    status.textContent = normalText;
  }, 1200);
}


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  displayStudentName();
  restoreSavedTextFields();
  setupSavedTextFields();

  const page = document.body.dataset.page;

  switch (page) {
    case "home": setupHomePage(); break;
    case "stage1": setupStage1(); break;
    case "stage2": setupStage2(); break;
    case "stage3": setupStage3(); break;
    case "stage4": setupStage4(); break;
    case "stage5": setupStage5(); break;
    case "stage6": setupStage6(); break;
    case "challenge": setupChallenge(); break;
    case "complete": setupCompletionPage(); break;
  }
});


/* =========================================================
   HOME PAGE
   ========================================================= */

function setupHomePage() {
  const savedPanel = document.querySelector("#saved-work-panel");
  const newPanel = document.querySelector("#new-student-panel");
  const savedName = document.querySelector("#saved-student-name");
  const continueButton = document.querySelector("#continue-lab");
  const newButton = document.querySelector("#new-lab");
  const nameInput = document.querySelector("#student-name");
  const startButton = document.querySelector("#start-lab");

  const hasSavedStudent = Boolean(labData.studentName && labData.studentName.trim());

  if (hasSavedStudent) {
    if (savedPanel) savedPanel.hidden = false;
    if (newPanel) newPanel.hidden = true;
    if (savedName) savedName.textContent = labData.studentName;
  } else {
    if (savedPanel) savedPanel.hidden = true;
    if (newPanel) newPanel.hidden = false;
  }

  continueButton?.addEventListener("click", () => {
    window.location.href = getNextIncompletePage();
  });

  newButton?.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Start a new lab? This will erase the saved lab currently stored on this browser."
    );
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    labData = cloneDefaultData();

    if (savedPanel) savedPanel.hidden = true;
    if (newPanel) newPanel.hidden = false;
    if (nameInput) {
      nameInput.value = "";
      nameInput.focus();
    }
  });

  startButton?.addEventListener("click", () => {
    const name = nameInput?.value.trim();

    if (!name) {
      window.alert("Please enter your first and last name before beginning the lab.");
      nameInput?.focus();
      return;
    }

    labData = cloneDefaultData();
    labData.studentName = name;
    saveLabData();

    window.location.href = "stage1.html";
  });

  nameInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      startButton?.click();
    }
  });
}


/* =========================================================
   CONTINUE SAVED LAB
   ========================================================= */

function getNextIncompletePage() {
  const completed = labData.completedStages;

  if (!completed.stage1) return "stage1.html";
  if (!completed.stage2) return "stage2.html";
  if (!completed.stage3) return "stage3.html";
  if (!completed.stage4) return "stage4.html";
  if (!completed.stage5) return "stage5.html";
  if (!completed.stage6) return "stage6.html";
  if (!completed.challenge) return "challenge.html";

  return "complete.html";
}


/* =========================================================
   STUDENT NAME
   ========================================================= */

function displayStudentName() {
  document.querySelectorAll("#student-display").forEach(element => {
    if (labData.studentName) {
      element.textContent = labData.studentName;
    }
  });
}


/* =========================================================
   SAVED WRITTEN RESPONSES
   ========================================================= */

function setupSavedTextFields() {
  document.querySelectorAll("[data-save-field]").forEach(field => {
    field.addEventListener("input", () => {
      const key = field.dataset.saveField;
      if (Object.prototype.hasOwnProperty.call(labData.notebook, key)) {
        labData.notebook[key] = field.value;
        saveLabData();
      }
    });
  });
}

function restoreSavedTextFields() {
  document.querySelectorAll("[data-save-field]").forEach(field => {
    const key = field.dataset.saveField;
    if (Object.prototype.hasOwnProperty.call(labData.notebook, key)) {
      field.value = labData.notebook[key] || "";
    }
  });
}


/* =========================================================
   SHARED SELECTION FUNCTIONS
   ========================================================= */

let selectedPiece = null;

function selectPiece(element) {
  clearSelectedPiece();
  selectedPiece = element;
  element.classList.add("selected-piece");
}

function clearSelectedPiece() {
  document.querySelectorAll(".selected-piece").forEach(element => {
    element.classList.remove("selected-piece");
  });
  selectedPiece = null;
}


/* =========================================================
   FEEDBACK
   ========================================================= */

function showFeedback(element, type, message) {
  if (!element) return;
  element.className = `feedback-box visible ${type}`;
  element.innerHTML = message;
}

function clearFeedback(element) {
  if (!element) return;
  element.className = "feedback-box";
  element.innerHTML = "";
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function unlockNext(selector) {
  const link = document.querySelector(selector);
  if (!link) return;
  link.classList.remove("locked");
  link.setAttribute("aria-disabled", "false");
}


/* =========================================================
   BIOLOGY ANSWER VALIDATION

   Written responses are NOT accepted simply because they
   are long enough. These functions let students explain
   ideas in their own words while still requiring the
   correct biological concepts to be present.
   ========================================================= */

function normalizeBiologyAnswer(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[′’']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text, terms) {
  const normalized = normalizeBiologyAnswer(text);
  return terms.some(term => normalized.includes(normalizeBiologyAnswer(term)));
}

function hasMinimumLength(text, minimumCharacters) {
  return normalizeBiologyAnswer(text).length >= minimumCharacters;
}

/* ---------- STAGE 1 WRITTEN RESPONSE ---------- */
function validateStage1Explanation(text) {
  const hasBase = containsAny(text, [
    "base", "nitrogenous base", "adenine", "thymine", "guanine", "cytosine"
  ]);

  const hasConstantStructure = containsAny(text, [
    "sugar and phosphate", "phosphate and sugar",
    "deoxyribose and phosphate", "phosphate and deoxyribose",
    "sugar-phosphate", "sugar phosphate"
  ]);

  const hasInformationIdea = containsAny(text, [
    "genetic information", "base sequence", "sequence", "genetic code", "information"
  ]);

  return hasMinimumLength(text, 35) && hasBase && hasConstantStructure && hasInformationIdea;
}

/* ---------- STAGE 2 WRITTEN RESPONSE ---------- */
function validateStage2Explanation(text) {
  const normalPairing = containsAny(text, [
    "purine-pyrimidine", "purine pyrimidine", "purine and pyrimidine",
    "one purine and one pyrimidine"
  ]);

  const purinePurine = containsAny(text, [
    "purine-purine", "purine purine", "two purines", "2 purines", "purine and purine"
  ]);

  const wider = containsAny(text, [
    "wider", "too wide", "greater width", "increase the width"
  ]);

  const pyrimidinePyrimidine = containsAny(text, [
    "pyrimidine-pyrimidine", "pyrimidine pyrimidine", "two pyrimidines",
    "2 pyrimidines", "pyrimidine and pyrimidine"
  ]);

  const narrower = containsAny(text, [
    "narrower", "too narrow", "smaller width", "decrease the width"
  ]);

  return (
    hasMinimumLength(text, 60) &&
    normalPairing &&
    ((purinePurine && wider) || (pyrimidinePyrimidine && narrower))
  );
}

/* ---------- STAGE 3 — STRUCTURAL DIAGNOSIS ---------- */
function validateStage3Diagnosis(text) {
  const phosphate = containsAny(text, ["phosphate", "phosphate group"]);

  const phosphodiester = containsAny(text, [
    "phosphodiester", "phosphodiester bond", "phosphodiester bonds",
    "phosphodiester linkage", "phosphodiester linkages"
  ]);

  const disruptedBackbone = containsAny(text, [
    "backbone is disrupted", "disrupts the backbone", "backbone cannot continue",
    "backbone is not continuous", "backbone isn't continuous", "backbone is incomplete",
    "breaks the backbone", "interrupts the backbone", "incomplete backbone",
    "continuous backbone", "cannot form a continuous", "can't form a continuous",
    "cannot form the backbone", "can't form the backbone",
    "backbone cannot form", "backbone can't form"
  ]);

  return hasMinimumLength(text, 45) && phosphate && phosphodiester && disruptedBackbone;
}

/* ---------- STAGE 3 — TRANSFER QUESTION ---------- */
function validateStage3Transfer(text) {
  const basesChange = containsAny(text, [
    "bases change", "base changes", "base sequence changes",
    "sequence of bases changes", "order of bases changes",
    "order of the bases changes", "base order changes",
    "nitrogenous bases change", "different bases",
    "different base sequence", "different sequence"
  ]);

  const sugarsRemain = containsAny(text, [
    "sugar stays", "sugars stay", "sugar remains", "sugars remain",
    "sugar stays the same", "sugars stay the same",
    "deoxyribose stays", "deoxyribose remains", "deoxyribose stays the same"
  ]);

  const phosphatesRemain = containsAny(text, [
    "phosphate stays", "phosphates stay", "phosphate remains",
    "phosphates remain", "phosphate stays the same", "phosphates stay the same"
  ]);

  const backboneSame = containsAny(text, [
    "backbone stays", "backbone remains", "backbone does not change",
    "backbone doesn't change", "same backbone", "backbone stays the same",
    "sugar-phosphate backbone remains", "sugar-phosphate backbone stays",
    "sugar phosphate backbone remains", "sugar phosphate backbone stays"
  ]);

  return (
    hasMinimumLength(text, 45) &&
    basesChange &&
    (backboneSame || (sugarsRemain && phosphatesRemain))
  );
}

/* ---------- STAGE 4 — PART A STABILITY EXPLANATION ---------- */
function validateStage4Stability(text) {
  const gc = containsAny(text, ["g-c", "g c", "gc", "guanine-cytosine", "guanine and cytosine"]);
  const at = containsAny(text, ["a-t", "a t", "at", "adenine-thymine", "adenine and thymine"]);
  const hydrogen = containsAny(text, ["hydrogen bond", "hydrogen bonds", "hydrogen bonding"]);
  const three = containsAny(text, ["three hydrogen", "3 hydrogen", "three bonds", "3 bonds"]);
  const two = containsAny(text, ["two hydrogen", "2 hydrogen", "two bonds", "2 bonds"]);

  return hasMinimumLength(text, 45) && gc && at && hydrogen && three && two;
}

/* ---------- STAGE 4 — PART C HEATING EXPLANATION ---------- */
function validateStage4Heating(text) {
  const lowerGC = containsAny(text, [
    "lower gc", "less gc", "fewer g-c", "fewer gc", "35%", "35 percent", "region n"
  ]);

  const hydrogen = containsAny(text, ["hydrogen bond", "hydrogen bonds", "hydrogen bonding"]);

  const gcThree = containsAny(text, [
    "three hydrogen", "3 hydrogen", "three bonds", "3 bonds",
    "g-c pairs form three", "gc pairs form three"
  ]);

  const easier = containsAny(text, [
    "easier to separate", "separate more easily", "less energy",
    "lower energy", "easier to break", "easier to pull apart"
  ]);

  return hasMinimumLength(text, 45) && lowerGC && hydrogen && gcThree && easier;
}

/* ---------- STAGE 4 — PART D SYNTHESIS ---------- */
function validateStage4Synthesis(text) {
  const complementary = containsAny(text, [
    "complementary", "base pairing", "complementary base pairing",
    "a pairs with t", "adenine pairs with thymine",
    "g pairs with c", "guanine pairs with cytosine"
  ]);

  const hydrogen = containsAny(text, ["hydrogen bond", "hydrogen bonds", "hydrogen bonding"]);

  const stability = containsAny(text, [
    "stable", "stability", "hold the strands", "holds the strands",
    "hold the two strands", "holds the two strands",
    "hold dna together", "holds dna together"
  ]);

  const separation = containsAny(text, [
    "separate", "separation", "break the hydrogen",
    "hydrogen bonds break", "hydrogen bonds can break", "hydrogen bonds are broken"
  ]);

  const backbone = containsAny(text, [
    "backbone", "sugar-phosphate", "sugar phosphate", "covalent", "phosphodiester"
  ]);

  const remainsIntact = containsAny(text, [
    "remains intact", "remain intact", "stays intact", "stay intact",
    "does not break", "doesn't break", "not broken",
    "without breaking", "without disrupting"
  ]);

  return (
    hasMinimumLength(text, 70) &&
    complementary && hydrogen && stability && separation && backbone && remainsIntact
  );
}

/* ---------- STAGE 5 — PART A ---------- */

function validateStage5PartA(text) {

  const lowerGC = containsAny(text, [
    "lower gc",
    "less gc",
    "fewer g-c",
    "fewer gc",
    "3 g-c",
    "3 gc"
  ]);

  const moreAT = containsAny(text, [
    "more a-t",
    "more at",
    "9 a-t",
    "9 at",
    "more adenine-thymine"
  ]);

  const hydrogen = containsAny(text, [
    "hydrogen bond",
    "hydrogen bonds",
    "hydrogen bonding"
  ]);

  const bondDifference =
    containsAny(text, [
      "g-c has three",
      "g-c pairs have three",
      "g-c forms three",
      "gc forms three",
      "three hydrogen bonds"
    ]) &&
    containsAny(text, [
      "a-t has two",
      "a-t pairs have two",
      "a-t forms two",
      "at forms two",
      "two hydrogen bonds"
    ]);

  const easier = containsAny(text, [
    "less energy",
    "easier to separate",
    "separate more easily",
    "lower temperature",
    "easier to break apart"
  ]);

  return (
    hasMinimumLength(text, 55) &&
    lowerGC &&
    moreAT &&
    hydrogen &&
    bondDifference &&
    easier
  );

}


/* ---------- STAGE 5 — PART B ---------- */

function validateStage5PartB(text) {

  const mismatch = containsAny(text, [
    "mismatch",
    "mismatched base",
    "incorrectly paired",
    "incorrect base pair",
    "wrong base pair",
    "not complementary"
  ]);

  const hydrogen = containsAny(text, [
    "hydrogen bond",
    "hydrogen bonds",
    "hydrogen bonding"
  ]);

  const disruptedPairing = containsAny(text, [
    "cannot form normal",
    "cannot form the normal",
    "fewer hydrogen bonds",
    "reduced hydrogen bonding",
    "disrupts hydrogen bonding",
    "prevents normal hydrogen bonding"
  ]);

  const rejectsGC = containsAny(text, [
    "gc content alone",
    "g-c content alone",
    "already accounted for",
    "does not explain the unexpected",
    "doesn't explain the unexpected",
    "would be expected from gc",
    "predicted from gc"
  ]);

  const rejectsPhosphate = containsAny(text, [
    "extra phosphate",
    "additional phosphate",
    "phosphate group",
    "backbone",
    "does not directly affect hydrogen",
    "doesn't directly affect hydrogen",
    "would not directly reduce hydrogen"
  ]);

  return (
    hasMinimumLength(text, 80) &&
    mismatch &&
    hydrogen &&
    disruptedPairing &&
    (rejectsGC || rejectsPhosphate)
  );

}


/* ---------- STAGE 5 — PART C ---------- */

function validateStage5PartC(text) {

  const backbone = containsAny(text, [
    "sugar-phosphate backbone",
    "sugar phosphate backbone",
    "backbone"
  ]);

  const covalent = containsAny(text, [
    "covalent",
    "phosphodiester",
    "phosphodiester bond",
    "phosphodiester bonds"
  ]);

  const continuity = containsAny(text, [
    "continuity",
    "continuous",
    "break in the strand",
    "strand is broken",
    "interrupts the strand",
    "disrupts the strand"
  ]);

  const pairingCanRemain = containsAny(text, [
    "base pairing can remain",
    "base pairing remains",
    "bases can still pair",
    "bases remain complementary",
    "complementary bases remain",
    "hydrogen bonds can remain",
    "hydrogen bonding can remain"
  ]);

  return (
    hasMinimumLength(text, 65) &&
    backbone &&
    covalent &&
    continuity &&
    pairingCanRemain
  );

}


/* ---------- STAGE 5 — PART D ---------- */

function validateStage5Claim(text) {

  const notAlways = containsAny(text, [
    "not always",
    "not fully supported",
    "not necessarily",
    "does not always",
    "doesn't always",
    "cannot conclude",
    "can't conclude"
  ]);

  const gcCause = containsAny(text, [
    "lower gc",
    "less gc",
    "fewer g-c",
    "more a-t",
    "more at",
    "gc content",
    "g-c content"
  ]);

  const mismatchCause = containsAny(text, [
    "mismatch",
    "mismatched",
    "incorrect base pair",
    "incorrectly paired",
    "wrong base pair"
  ]);

  const hydrogen = containsAny(text, [
    "hydrogen bond",
    "hydrogen bonds",
    "hydrogen bonding"
  ]);

  return (
    hasMinimumLength(text, 85) &&
    notAlways &&
    gcCause &&
    mismatchCause &&
    hydrogen
  );

}

/* ---------- STAGE 6 — MODEL EVIDENCE ---------- */
function validateStage6Explanation(text) {
  const complementary = containsAny(text, [
    "complementary", "base pairing", "a-t", "g-c",
    "adenine", "thymine", "guanine", "cytosine"
  ]);

  const antiparallel = containsAny(text, [
    "antiparallel", "opposite directions", "opposite direction", "5'", "3'"
  ]);

  const hydrogen = containsAny(text, [
    "hydrogen bond", "hydrogen bonds", "hydrogen bonding",
    "two hydrogen", "three hydrogen", "2 hydrogen", "3 hydrogen"
  ]);

  return hasMinimumLength(text, 90) && complementary && antiparallel && hydrogen;
}

/* ---------- FINAL CHALLENGE — MOLECULAR DEFENCE ---------- */
function validateFinalDefence(text) {
  const nucleotideStructure = containsAny(text, [
    "nucleotide", "phosphate", "deoxyribose", "sugar", "nitrogenous base"
  ]);

  const backbone = containsAny(text, [
    "sugar-phosphate", "sugar phosphate", "backbone", "phosphodiester"
  ]);

  const complementary = containsAny(text, [
    "complementary", "base pairing", "a-t", "g-c",
    "adenine", "thymine", "guanine", "cytosine"
  ]);

  const antiparallel = containsAny(text, [
    "antiparallel", "opposite directions", "opposite direction", "5'", "3'"
  ]);

  const hydrogen = containsAny(text, [
    "hydrogen bond", "hydrogen bonds", "hydrogen bonding",
    "two hydrogen", "three hydrogen", "2 hydrogen", "3 hydrogen"
  ]);

  return (
    hasMinimumLength(text, 120) &&
    nucleotideStructure && backbone && complementary && antiparallel && hydrogen
  );
}


/* =========================================================
   DRAG AND DROP — SHARED

   FIXED: previously this block contained a duplicated,
   improperly nested copy of makeDraggable/setupDropTarget
   which made setupDropTarget inaccessible outside this
   block and broke drag-and-drop on Stage 1, Stage 3, and
   the Final Challenge. Restored to a single clean version
   of each function.
   ========================================================= */

function makeDraggable(element, data) {
  element.setAttribute("draggable", "true");

  element.addEventListener("dragstart", event => {
    element.classList.add("dragging");
    event.dataTransfer.effectAllowed = "copy";

    const payload = JSON.stringify(data);
    event.dataTransfer.setData("text/plain", payload);

    try {
      event.dataTransfer.setData("application/json", payload);
    } catch (error) {
      /* no action needed */
    }
  });

  element.addEventListener("dragend", () => {
    element.classList.remove("dragging");
  });
}

function setupDropTarget(element, callback) {
  element.addEventListener("dragenter", event => {
    event.preventDefault();
    element.classList.add("drag-over");
  });

  element.addEventListener("dragover", event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    element.classList.add("drag-over");
  });

  element.addEventListener("dragleave", event => {
    if (!element.contains(event.relatedTarget)) {
      element.classList.remove("drag-over");
    }
  });

  element.addEventListener("drop", event => {
    event.preventDefault();
    element.classList.remove("drag-over");

    let raw = event.dataTransfer.getData("text/plain");
    if (!raw) {
      raw = event.dataTransfer.getData("application/json");
    }

    if (!raw) {
      console.warn("Drop occurred, but no drag data was available.");
      return;
    }

    try {
      const data = JSON.parse(raw);
      callback(data);
    } catch (error) {
      console.warn("Could not read dragged item.", error);
    }
  });
}


/* =========================================================
   STAGE 1 — CONSTRUCT A NUCLEOTIDE
   ========================================================= */

function setupStage1() {
  const cards = document.querySelectorAll(".molecule-card");
  const sites = document.querySelectorAll(".nucleotide-site");
  const checkModel = document.querySelector("#check-stage1-model");
  const clearModel = document.querySelector("#clear-stage1-model");
  const modelFeedback = document.querySelector("#stage1-model-feedback");
  const reveal = document.querySelector("#stage1-model-reveal");
  const checkAnalysis = document.querySelector("#check-stage1-analysis");
  const analysisFeedback = document.querySelector("#stage1-analysis-feedback");

  restoreStage1Model();

  /* ---- PART A — BUILD THE NUCLEOTIDE ---- */

  cards.forEach(card => {
    makeDraggable(card, {
      type: "stage1-piece",
      piece: card.dataset.piece,
      id: card.dataset.pieceId
    });

    card.addEventListener("click", () => {
      selectPiece(card);
    });
  });

  sites.forEach(site => {
    setupDropTarget(site, data => {
      if (data.type !== "stage1-piece") return;
      placeStage1Piece(site, data.piece);
    });

    site.addEventListener("click", () => {
      /* If no tray piece is selected, clicking an occupied site
         removes the current molecule from that site. */
      if (!selectedPiece) {
        const siteName = site.dataset.site;

        if (labData.stage1.model[siteName]) {
          labData.stage1.model[siteName] = "";
          labData.stage1.modelCorrect = false;
          labData.stage1.analysisCorrect = false;
          labData.completedStages.stage1 = false;
          saveLabData();

          renderStage1Site(site, "");
          reveal?.classList.remove("visible");
          lockStage1Next();
          clearFeedback(modelFeedback);
          clearFeedback(analysisFeedback);
        }
        return;
      }

      /* If a molecule card has been selected, clicking a site places it there. */
      if (!selectedPiece.classList.contains("molecule-card")) return;

      placeStage1Piece(site, selectedPiece.dataset.piece);
      clearSelectedPiece();
    });
  });

  checkModel?.addEventListener("click", () => {
    labData.stage1.attempts++;
    const model = labData.stage1.model;

    const correct =
      model.phosphate === "phosphate" &&
      model.sugar === "deoxyribose" &&
      model.base === "dna-base";

    if (correct) {
      labData.stage1.modelCorrect = true;
      saveLabData();

      sites.forEach(site => {
        site.classList.remove("error-site");
        site.classList.add("correct-site");
      });

      reveal?.classList.add("visible");

      showFeedback(modelFeedback, "success", `
        <strong>Model verified.</strong><br>
        The three structures you selected can form one DNA nucleotide.
      `);
    } else {
      labData.stage1.modelCorrect = false;
      labData.stage1.analysisCorrect = false;
      labData.completedStages.stage1 = false;
      saveLabData();

      lockStage1Next();
      showStage1Hint(modelFeedback);
    }
  });

  clearModel?.addEventListener("click", () => {
    labData.stage1.model = { phosphate: "", sugar: "", base: "" };
    labData.stage1.modelCorrect = false;
    labData.stage1.analysisCorrect = false;
    labData.completedStages.stage1 = false;
    saveLabData();

    sites.forEach(site => {
      site.classList.remove("correct-site", "error-site", "active-site");
      site.innerHTML = "<span>Connection site</span>";
    });

    reveal?.classList.remove("visible");
    lockStage1Next();
    clearFeedback(modelFeedback);
    clearFeedback(analysisFeedback);
  });

  /* ---- PART B — STRUCTURAL ANALYSIS ---- */

  document.querySelectorAll('input[name="stage1-variable"]').forEach(option => {
    if (option.value === labData.stage1.variableComponent) {
      option.checked = true;
    }

    option.addEventListener("change", () => {
      labData.stage1.variableComponent = option.value;
      labData.stage1.analysisCorrect = false;
      labData.completedStages.stage1 = false;
      saveLabData();

      lockStage1Next();
      clearFeedback(analysisFeedback);
    });
  });

  checkAnalysis?.addEventListener("click", () => {
    if (!labData.stage1.modelCorrect) {
      showFeedback(analysisFeedback, "hint", `
        Verify your nucleotide model before submitting the structural analysis.
      `);
      return;
    }

    const selected = document.querySelector('input[name="stage1-variable"]:checked');
    const explanation = document.querySelector("#stage1-note")?.value || "";

    if (!selected || selected.value !== "base") {
      labData.stage1.analysisCorrect = false;
      labData.completedStages.stage1 = false;
      saveLabData();
      lockStage1Next();

      showFeedback(analysisFeedback, "hint", `
        Compare DNA nucleotides carefully.
        Which component can vary while the sugar and phosphate remain
        part of every nucleotide?
      `);
      return;
    }

    if (!validateStage1Explanation(explanation)) {
      labData.stage1.analysisCorrect = false;
      labData.completedStages.stage1 = false;
      saveLabData();
      lockStage1Next();

      showFeedback(analysisFeedback, "hint", `
        Your component choice is correct, but the written explanation
        is not yet complete.<br><br>
        Explain what happens to the nitrogenous base, what remains
        consistent in the nucleotide, and why variation in the bases
        matters for genetic information.
      `);
      return;
    }

    labData.stage1.analysisCorrect = true;
    labData.completedStages.stage1 = true;
    saveLabData();

    showFeedback(analysisFeedback, "success", `
      <strong>Stage 1 complete.</strong><br>
      Variation in the nitrogenous bases allows different base sequences
      to carry different genetic information, while phosphate and
      deoxyribose remain structural components of DNA nucleotides.
    `);

    unlockNext("#stage1-next");
  });

  if (labData.stage1.modelCorrect) {
    reveal?.classList.add("visible");
    sites.forEach(site => site.classList.add("correct-site"));
  }

  if (labData.completedStages.stage1 && labData.stage1.analysisCorrect) {
    unlockNext("#stage1-next");
  }
}

function placeStage1Piece(site, piece) {
  const siteName = site.dataset.site;
  labData.stage1.model[siteName] = piece;

  labData.stage1.modelCorrect = false;
  labData.stage1.analysisCorrect = false;
  labData.completedStages.stage1 = false;
  saveLabData();

  lockStage1Next();
  renderStage1Site(site, piece);

  document.querySelector("#stage1-model-reveal")?.classList.remove("visible");
  clearFeedback(document.querySelector("#stage1-model-feedback"));
  clearFeedback(document.querySelector("#stage1-analysis-feedback"));
}

function renderStage1Site(site, piece) {
  site.classList.remove("correct-site", "error-site");

  if (!piece) {
    site.innerHTML = "<span>Connection site</span>";
    return;
  }

  const source = document.querySelector(`.molecule-card[data-piece="${piece}"]`);

  if (source && source.querySelector("svg")) {
    const svg = source.querySelector("svg").cloneNode(true);
    site.innerHTML = "";
    site.appendChild(svg);
    return;
  }

  site.textContent = piece;
}

function restoreStage1Model() {
  document.querySelectorAll(".nucleotide-site").forEach(site => {
    const piece = labData.stage1.model[site.dataset.site];
    if (piece) {
      renderStage1Site(site, piece);
    }
  });
}

function showStage1Hint(feedback) {
  const attempt = labData.stage1.attempts;

  if (attempt === 1) {
    showFeedback(feedback, "hint", `
      Your model contains at least one incorrect component or connection.
    `);
    return;
  }

  if (attempt === 2) {
    showFeedback(feedback, "hint", `
      Examine the two five-carbon sugars carefully.
      Look specifically at the group attached to the <strong>2′ carbon</strong>.
    `);
    return;
  }

  if (attempt === 3) {
    showFeedback(feedback, "hint", `
      One nitrogenous base in the parts tray belongs to RNA rather than DNA.
    `);
    return;
  }

  showFeedback(feedback, "hint", `
    A DNA nucleotide requires a phosphate group, deoxyribose sugar,
    and a DNA nitrogenous base.
  `);
}

function lockStage1Next() {
  const link = document.querySelector("#stage1-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   STAGE 2 — ANALYZE THE NITROGENOUS BASES
   ========================================================= */

function setupStage2() {
  const structureFeedback = document.querySelector("#stage2-structure-feedback");
  const applicationFeedback = document.querySelector("#stage2-application-feedback");
  const calculationFeedback = document.querySelector("#stage2-calculation-feedback");
  const synthesisFeedback = document.querySelector("#stage2-synthesis-feedback");
  const summary = document.querySelector("#stage2-summary");
  const bases = ["adenine", "guanine", "cytosine", "thymine"];

  const clearAllStage2Feedback = () => {
    clearFeedback(structureFeedback);
    clearFeedback(applicationFeedback);
    clearFeedback(calculationFeedback);
    clearFeedback(synthesisFeedback);
  };

  /* ---- PART A — CLASSIFY THE BASES ---- */

  bases.forEach(base => {
    const familySelect = document.querySelector(`#stage2-${base}-family`);
    const ringSelect = document.querySelector(`#stage2-${base}-rings`);

    if (familySelect) {
      familySelect.value = labData.stage2.families[base] || "";
      familySelect.addEventListener("change", () => {
        labData.stage2.families[base] = familySelect.value;
        resetStage2CompletionFrom("structure");
        saveLabData();
        lockStage2Next();
        clearAllStage2Feedback();
      });
    }

    if (ringSelect) {
      ringSelect.value = labData.stage2.rings[base] || "";
      ringSelect.addEventListener("change", () => {
        labData.stage2.rings[base] = ringSelect.value;
        resetStage2CompletionFrom("structure");
        saveLabData();
        lockStage2Next();
        clearAllStage2Feedback();
      });
    }
  });

  document.querySelector("#check-stage2-structures")?.addEventListener("click", () => {
    const families = labData.stage2.families;
    const rings = labData.stage2.rings;

    const correctFamilies =
      families.adenine === "purine" &&
      families.guanine === "purine" &&
      families.cytosine === "pyrimidine" &&
      families.thymine === "pyrimidine";

    const correctRings =
      rings.adenine === "2" &&
      rings.guanine === "2" &&
      rings.cytosine === "1" &&
      rings.thymine === "1";

    if (correctFamilies && correctRings) {
      labData.stage2.structureCorrect = true;
      saveLabData();

      showFeedback(structureFeedback, "success", `
        <strong>Structural analysis correct.</strong><br>
        Adenine and guanine are two-ring purines.
        Cytosine and thymine are one-ring pyrimidines.
      `);
    } else {
      resetStage2CompletionFrom("structure");
      saveLabData();
      lockStage2Next();

      showFeedback(structureFeedback, "hint", `
        At least one classification is incorrect.
        Compare the number of rings in each molecular structure carefully.
      `);
    }
  });

  /* ---- PART B — APPLY BASE STRUCTURE ---- */

  document.querySelectorAll('input[name="stage2-widest"]').forEach(option => {
    option.checked = option.value === labData.stage2.widestPair;
    option.addEventListener("change", () => {
      labData.stage2.widestPair = option.value;
      resetStage2CompletionFrom("application");
      saveLabData();
      lockStage2Next();
      clearFeedback(applicationFeedback);
      clearFeedback(synthesisFeedback);
    });
  });

  document.querySelectorAll('input[name="stage2-narrowest"]').forEach(option => {
    option.checked = option.value === labData.stage2.narrowestPair;
    option.addEventListener("change", () => {
      labData.stage2.narrowestPair = option.value;
      resetStage2CompletionFrom("application");
      saveLabData();
      lockStage2Next();
      clearFeedback(applicationFeedback);
      clearFeedback(synthesisFeedback);
    });
  });

  document.querySelectorAll(".stage2-normal-pair").forEach(box => {
    box.checked = labData.stage2.normalPairs.includes(box.value);
    box.addEventListener("change", () => {
      labData.stage2.normalPairs = Array.from(
        document.querySelectorAll(".stage2-normal-pair:checked")
      ).map(checked => checked.value);

      resetStage2CompletionFrom("application");
      saveLabData();
      lockStage2Next();
      clearFeedback(applicationFeedback);
      clearFeedback(synthesisFeedback);
    });
  });

  document.querySelector("#check-stage2-application")?.addEventListener("click", () => {
    if (!labData.stage2.structureCorrect) {
      showFeedback(applicationFeedback, "hint", `
        Complete and validate Part A before applying the structural pattern.
      `);
      return;
    }

    const normalPairs = [...labData.stage2.normalPairs].sort();
    const correctPairs = ["AT", "GC"].sort();
    const normalCorrect = JSON.stringify(normalPairs) === JSON.stringify(correctPairs);

    const correct =
      labData.stage2.widestPair === "AG" &&
      labData.stage2.narrowestPair === "CT" &&
      normalCorrect;

    if (correct) {
      labData.stage2.applicationCorrect = true;
      saveLabData();

      showFeedback(applicationFeedback, "success", `
        <strong>Structural predictions correct.</strong><br>
        A–G combines two purines and would be wider.
        C–T combines two pyrimidines and would be narrower.
        Normal DNA pairs one purine with one pyrimidine.
      `);
    } else {
      resetStage2CompletionFrom("application");
      saveLabData();
      lockStage2Next();

      showFeedback(applicationFeedback, "hint", `
        Reconsider the number of rings contributed by each base.
        Separate molecular width from normal complementary pairing.
      `);
    }
  });

  /* ---- PART C — CHARGAFF CALCULATIONS ---- */

  const countMap = {
    "#stage2-thymine-count": "thymineCount",
    "#stage2-guanine-count": "guanineCount",
    "#stage2-cytosine-count": "cytosineCount",
    "#stage2-purine-count": "purineCount"
  };

  Object.entries(countMap).forEach(([selector, key]) => {
    const input = document.querySelector(selector);
    if (!input) return;

    input.value = labData.stage2[key] || "";
    input.addEventListener("input", () => {
      labData.stage2[key] = input.value;
      resetStage2CompletionFrom("calculations");
      saveLabData();
      lockStage2Next();
      clearFeedback(calculationFeedback);
      clearFeedback(synthesisFeedback);
    });
  });

  document.querySelector("#check-stage2-calculations")?.addEventListener("click", () => {
    if (!labData.stage2.applicationCorrect) {
      showFeedback(calculationFeedback, "hint", `
        Complete Part B correctly before submitting the molecular calculations.
      `);
      return;
    }

    const thymineCorrect = Number(labData.stage2.thymineCount) === 72;
    const guanineCorrect = Number(labData.stage2.guanineCount) === 48;
    const cytosineCorrect = Number(labData.stage2.cytosineCount) === 48;
    const purineCorrect = Number(labData.stage2.purineCount) === 120;

    if (thymineCorrect && guanineCorrect && cytosineCorrect && purineCorrect) {
      labData.stage2.calculationsCorrect = true;
      saveLabData();

      showFeedback(calculationFeedback, "success", `
        <strong>Calculations correct.</strong><br>
        A = 72, T = 72, G = 48 and C = 48.<br>
        The molecule therefore contains <strong>120 purines</strong>.
      `);
    } else {
      resetStage2CompletionFrom("calculations");
      saveLabData();
      lockStage2Next();

      const hints = [];
      if (!thymineCorrect) {
        hints.push("Use A = T to determine the number of thymine bases.");
      }
      if (!guanineCorrect || !cytosineCorrect) {
        hints.push("Use G = C when determining guanine and cytosine.");
      }
      if (!purineCorrect) {
        hints.push("Remember that adenine and guanine are the purines.");
      }

      showFeedback(calculationFeedback, "hint", `
        <strong>At least one calculation is incorrect.</strong><br>
        ${hints.join("<br>")}
      `);
    }
  });

  /* ---- PART D — SYNTHESIS ---- */

  document.querySelector("#check-stage2-synthesis")?.addEventListener("click", () => {
    if (
      !labData.stage2.structureCorrect ||
      !labData.stage2.applicationCorrect ||
      !labData.stage2.calculationsCorrect
    ) {
      showFeedback(synthesisFeedback, "hint", `
        Complete Parts A, B and C correctly before submitting your Stage 2 synthesis.
      `);
      return;
    }

    const explanation = document.querySelector("#stage2-note")?.value || "";

    if (!validateStage2Explanation(explanation)) {
      labData.stage2.synthesisCorrect = false;
      labData.completedStages.stage2 = false;
      saveLabData();
      lockStage2Next();

      showFeedback(synthesisFeedback, "hint", `
        Your explanation is not yet biologically complete.<br><br>
        Explain why normal DNA pairs one purine with one pyrimidine,
        then compare that arrangement with either two purines or two
        pyrimidines and describe what happens to the width of the
        DNA molecule.
      `);
      return;
    }

    labData.stage2.synthesisCorrect = true;
    labData.completedStages.stage2 = true;
    saveLabData();

    summary?.classList.add("visible");

    showFeedback(synthesisFeedback, "success", `
      <strong>Stage 2 complete.</strong><br>
      Normal base pairing combines one purine with one pyrimidine,
      helping maintain a consistent DNA width. Two purines would be
      too wide, while two pyrimidines would be too narrow.
    `);

    unlockNext("#stage2-next");
  });

  if (labData.stage2.synthesisCorrect) {
    summary?.classList.add("visible");
  }

  if (labData.completedStages.stage2 && labData.stage2.synthesisCorrect) {
    unlockNext("#stage2-next");
  }
}

function resetStage2CompletionFrom(step) {
  const order = ["structure", "application", "calculations", "synthesis"];
  const start = order.indexOf(step);
  if (start === -1) return;

  if (start <= order.indexOf("structure")) labData.stage2.structureCorrect = false;
  if (start <= order.indexOf("application")) labData.stage2.applicationCorrect = false;
  if (start <= order.indexOf("calculations")) labData.stage2.calculationsCorrect = false;
  if (start <= order.indexOf("synthesis")) labData.stage2.synthesisCorrect = false;

  labData.completedStages.stage2 = false;
  document.querySelector("#stage2-summary")?.classList.remove("visible");
}

function lockStage2Next() {
  const link = document.querySelector("#stage2-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   STAGE 3 — CONSTRUCT A DNA STRAND
   ========================================================= */

function setupStage3() {
  const targetBases = ["A", "T", "G", "C", "C", "A"];

  /* migrate older saved data safely */
  if (!Array.isArray(labData.stage3.sequence) || labData.stage3.sequence.length !== 6) {
    labData.stage3.sequence = ["", "", "", "", "", ""];
  }

  ["bondChoice", "bondAnswer", "errorAnswer", "consequenceAnswer"].forEach(key => {
    if (typeof labData.stage3[key] !== "string") {
      labData.stage3[key] = "";
    }
  });

  const bankButtons = document.querySelectorAll(".s3-bank .base-bank-button");
  const slots = document.querySelectorAll(".s3-base-slot");
  const buildFeedback = document.querySelector("#stage3-build-feedback");
  const backboneNote = document.querySelector("#stage3-backbone-note");
  const bondFeedback = document.querySelector("#stage3-bond-feedback");
  const diagnosisFeedback = document.querySelector("#stage3-diagnosis-feedback");
  const analysisFeedback = document.querySelector("#stage3-analysis-feedback");

  const clearAllStage3Feedback = () => {
    clearFeedback(buildFeedback);
    clearFeedback(bondFeedback);
    clearFeedback(diagnosisFeedback);
    clearFeedback(analysisFeedback);
  };

  /* ---- PART A — PLACE THE BASES ---- */

  bankButtons.forEach(button => {
    makeDraggable(button, { type: "stage3-base", base: button.dataset.base });
    button.addEventListener("click", () => selectPiece(button));
  });

  slots.forEach(slot => {
    setupDropTarget(slot, data => {
      if (data.type !== "stage3-base") return;
      placeStage3Base(slot, data.base);
    });

    slot.addEventListener("click", () => {
      if (selectedPiece && selectedPiece.classList.contains("base-bank-button")) {
        placeStage3Base(slot, selectedPiece.dataset.base);
        clearSelectedPiece();
        return;
      }

      const position = Number(slot.dataset.position);

      if (labData.stage3.sequence[position]) {
        labData.stage3.sequence[position] = "";
        resetStage3CompletionFrom("build");
        saveLabData();
        renderStage3Build();
        backboneNote?.classList.remove("visible");
        clearAllStage3Feedback();
      }
    });
  });

  renderStage3Build();

  if (labData.stage3.buildCorrect) {
    backboneNote?.classList.add("visible");
  }

  document.querySelector("#check-stage3-build")?.addEventListener("click", () => {
    const complete = labData.stage3.sequence.every(base => base);

    if (!complete) {
      labData.stage3.buildCorrect = false;
      saveLabData();

      showFeedback(buildFeedback, "hint", `
        <strong>Your strand is incomplete.</strong><br>
        Place a base in every position before validating the strand.
      `);
      return;
    }

    const wrongPositions = [];
    labData.stage3.sequence.forEach((base, index) => {
      if (base !== targetBases[index]) {
        wrongPositions.push(index + 1);
      }
    });

    if (wrongPositions.length > 0) {
      resetStage3CompletionFrom("build");
      saveLabData();
      renderStage3Build();
      backboneNote?.classList.remove("visible");

      showFeedback(buildFeedback, "hint", `
        <strong>The strand is not yet correct.</strong><br>
        Re-examine nucleotide position${wrongPositions.length > 1 ? "s" : ""}
        ${wrongPositions.join(", ")}.
        Check the template base directly above it and apply the
        base-pairing rules (A–T, G–C).
      `);
      return;
    }

    labData.stage3.buildCorrect = true;
    saveLabData();
    renderStage3Build();
    backboneNote?.classList.add("visible");

    showFeedback(buildFeedback, "success", `
      <strong>Strand validated.</strong><br>
      Correctly derived: 5′–A T G C C A–3′.
      Every base you placed follows Watson–Crick pairing with the
      template strand above it, and the new strand runs antiparallel to it.
    `);
  });

  document.querySelector("#clear-stage3-build")?.addEventListener("click", () => {
    labData.stage3.sequence = ["", "", "", "", "", ""];
    resetStage3CompletionFrom("build");
    clearSelectedPiece();
    saveLabData();
    renderStage3Build();
    backboneNote?.classList.remove("visible");
    clearAllStage3Feedback();
  });

  /* ---- PART B — IDENTIFY THE BACKBONE BOND ---- */

  document.querySelectorAll('input[name="stage3-location-answer"]').forEach(option => {
    option.checked = option.value === labData.stage3.bondChoice;
    option.addEventListener("change", () => {
      labData.stage3.bondChoice = option.value;
      labData.stage3.bondCorrect = false;
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();
      clearFeedback(bondFeedback);
      clearFeedback(diagnosisFeedback);
      clearFeedback(analysisFeedback);
    });
  });

  document.querySelectorAll('input[name="stage3-bond-answer"]').forEach(option => {
    option.checked = option.value === labData.stage3.bondAnswer;
    option.addEventListener("change", () => {
      labData.stage3.bondAnswer = option.value;
      labData.stage3.bondCorrect = false;
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();
      clearFeedback(bondFeedback);
      clearFeedback(diagnosisFeedback);
      clearFeedback(analysisFeedback);
    });
  });

  document.querySelector("#check-stage3-bond")?.addEventListener("click", () => {
    if (!labData.stage3.buildCorrect) {
      showFeedback(bondFeedback, "hint", `
        Validate your strand in Part A before analysing the bonds
        between adjacent nucleotides.
      `);
      return;
    }

    if (!labData.stage3.bondChoice) {
      showFeedback(bondFeedback, "hint", `
        Answer question 1 first.
        Choose which numbered bond continues the backbone.
      `);
      return;
    }

    if (labData.stage3.bondChoice !== "backbone") {
      labData.stage3.bondCorrect = false;
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();

      showFeedback(bondFeedback, "hint", `
        That bond does not join one nucleotide to the next in the
        sugar-phosphate backbone. It attaches a base to its own sugar
        within a single nucleotide. Re-examine the diagram and try again.
      `);
      return;
    }

    if (!labData.stage3.bondAnswer) {
      showFeedback(bondFeedback, "hint", `
        You identified the correct location.
        Now answer question 2: what type of bond is it?
      `);
      return;
    }

    if (labData.stage3.bondAnswer !== "sugar-phosphate") {
      labData.stage3.bondCorrect = false;
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();

      showFeedback(bondFeedback, "hint", `
        You identified the correct backbone bond, but the bond type
        is not correct. Think about the covalent linkage that connects
        successive DNA nucleotides.
      `);
      return;
    }

    labData.stage3.bondCorrect = true;
    saveLabData();

    showFeedback(bondFeedback, "success", `
      <strong>Bond analysis correct.</strong><br>
      The selected connection continues the sugar-phosphate backbone.
      Adjacent DNA nucleotides are linked by covalent phosphodiester bonds.
    `);
  });

  /* ---- PART C — STRUCTURAL ERROR ANALYSIS ---- */

  document.querySelectorAll('input[name="stage3-error-answer"]').forEach(option => {
    option.checked = option.value === labData.stage3.errorAnswer;
    option.addEventListener("change", () => {
      labData.stage3.errorAnswer = option.value;
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();
      clearFeedback(diagnosisFeedback);
      clearFeedback(analysisFeedback);
    });
  });

  document.querySelectorAll('input[name="stage3-consequence-answer"]').forEach(option => {
    option.checked = option.value === labData.stage3.consequenceAnswer;
    option.addEventListener("change", () => {
      labData.stage3.consequenceAnswer = option.value;
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();
      clearFeedback(diagnosisFeedback);
      clearFeedback(analysisFeedback);
    });
  });

  document.querySelector("#check-stage3-diagnosis")?.addEventListener("click", () => {
    if (!labData.stage3.bondCorrect) {
      showFeedback(diagnosisFeedback, "hint", `
        Complete the bond analysis in Part B before submitting your
        structural diagnosis.
      `);
      return;
    }

    if (!labData.stage3.errorAnswer) {
      showFeedback(diagnosisFeedback, "hint", `
        Identify the structural error in the DNA model first.
      `);
      return;
    }

    if (labData.stage3.errorAnswer !== "missing-phosphate") {
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();

      showFeedback(diagnosisFeedback, "hint", `
        Re-examine the backbone rather than the base sequence.
        Compare the repeating pattern with the strand you built in Part A.
      `);
      return;
    }

    if (!labData.stage3.consequenceAnswer) {
      showFeedback(diagnosisFeedback, "hint", `
        You found the structural error. Now predict its most direct consequence.
      `);
      return;
    }

    if (labData.stage3.consequenceAnswer !== "backbone-disrupted") {
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();

      showFeedback(diagnosisFeedback, "hint", `
        Think about what the missing phosphate does to the continuity
        of the sugar-phosphate backbone.
      `);
      return;
    }

    const explanation = document.querySelector("#stage3-diagnosis-note")?.value || "";

    if (!validateStage3Diagnosis(explanation)) {
      labData.stage3.diagnosisCorrect = false;
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();

      showFeedback(diagnosisFeedback, "hint", `
        Your selected answers are correct, but the written explanation
        is not yet biologically complete.<br><br>
        Explain the role of the missing phosphate, identify the type
        of bond normally involved, and explain what happens to the
        continuity of the sugar-phosphate backbone.
      `);
      return;
    }

    labData.stage3.diagnosisCorrect = true;
    saveLabData();

    showFeedback(diagnosisFeedback, "success", `
      <strong>Structural diagnosis accepted.</strong><br>
      The missing phosphate interrupts the normal sugar-phosphate
      backbone and prevents the expected phosphodiester linkage
      between neighbouring nucleotides.
    `);
  });

  /* ---- PART D — TRANSFER ---- */

  document.querySelector("#check-stage3-analysis")?.addEventListener("click", () => {
    if (
      !labData.stage3.buildCorrect ||
      !labData.stage3.bondCorrect ||
      !labData.stage3.diagnosisCorrect
    ) {
      showFeedback(analysisFeedback, "hint", `
        Complete and validate Parts A, B and C before submitting
        the transfer question.
      `);
      return;
    }

    const explanation = document.querySelector("#stage3-note")?.value || "";

    if (!validateStage3Transfer(explanation)) {
      labData.stage3.analysisCorrect = false;
      labData.completedStages.stage3 = false;
      saveLabData();
      lockStage3Next();

      showFeedback(analysisFeedback, "hint", `
        Your explanation is not yet biologically complete.<br><br>
        Identify what changes when the base sequence changes, and
        explain which structural components of the DNA strand
        remain unchanged.
      `);
      return;
    }

    labData.stage3.analysisCorrect = true;
    labData.completedStages.stage3 = true;
    saveLabData();

    showFeedback(analysisFeedback, "success", `
      <strong>Stage 3 complete.</strong><br>
      Changing the base sequence changes the order of the nitrogenous
      bases, but the repeating deoxyribose and phosphate components
      of the backbone remain the same.
    `);

    unlockNext("#stage3-next");
  });

  if (labData.completedStages.stage3 && labData.stage3.analysisCorrect) {
    unlockNext("#stage3-next");
  }
}

function placeStage3Base(slot, base) {
  const position = Number(slot.dataset.position);
  if (!Number.isInteger(position) || position < 0 || position > 5) return;

  const value = String(base || "").toUpperCase();
  if (!["A", "T", "G", "C"].includes(value)) return;

  labData.stage3.sequence[position] = value;
  resetStage3CompletionFrom("build");
  saveLabData();
  renderStage3Build();

  document.querySelector("#stage3-backbone-note")?.classList.remove("visible");
  clearFeedback(document.querySelector("#stage3-build-feedback"));
  clearFeedback(document.querySelector("#stage3-bond-feedback"));
  clearFeedback(document.querySelector("#stage3-diagnosis-feedback"));
  clearFeedback(document.querySelector("#stage3-analysis-feedback"));
}

function renderStage3Build() {
  document.querySelectorAll(".s3-base-slot").forEach(slot => {
    const position = Number(slot.dataset.position);
    const base = labData.stage3.sequence[position] || "";

    slot.classList.remove(
      "filled", "correct-site", "error-site",
      "base-a", "base-t", "base-g", "base-c"
    );

    if (!base) {
      slot.textContent = "?";
      slot.setAttribute("aria-label", `Empty base site, nucleotide ${position + 1}`);
      return;
    }

    slot.textContent = base;
    slot.classList.add("filled", `base-${base.toLowerCase()}`);
    slot.setAttribute("aria-label", `Base ${base} placed at nucleotide ${position + 1}`);

    if (labData.stage3.buildCorrect) {
      slot.classList.add("correct-site");
    }
  });

  /* Live hydrogen-bond display between the template and correctly
     placed bases. A–T = 2 hydrogen bonds, G–C = 3 hydrogen bonds. */
  const stage3TemplateBases = ["T", "A", "C", "G", "G", "T"];
  const stage3WatsonCrick = { A: "T", T: "A", G: "C", C: "G" };

  document.querySelectorAll(".s3-hbond-zone").forEach(zone => {
    const position = Number(zone.dataset.position);
    const templateBase = stage3TemplateBases[position];
    const placedBase = labData.stage3.sequence[position];
    const correct = placedBase && placedBase === stage3WatsonCrick[templateBase];

    if (!correct) {
      zone.textContent = "";
      return;
    }

    zone.textContent = (templateBase === "G" || templateBase === "C") ? "···" : "··";
  });
}

function resetStage3CompletionFrom(point) {
  if (point === "build") {
    labData.stage3.buildCorrect = false;
    labData.stage3.bondCorrect = false;
    labData.stage3.diagnosisCorrect = false;
    labData.stage3.analysisCorrect = false;
  }

  if (point === "bond") {
    labData.stage3.bondCorrect = false;
    labData.stage3.diagnosisCorrect = false;
    labData.stage3.analysisCorrect = false;
  }

  if (point === "diagnosis") {
    labData.stage3.diagnosisCorrect = false;
    labData.stage3.analysisCorrect = false;
  }

  if (point === "analysis") {
    labData.stage3.analysisCorrect = false;
  }

  labData.completedStages.stage3 = false;
  lockStage3Next();
}

function lockStage3Next() {
  const link = document.querySelector("#stage3-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   STAGE 4 — ANALYZE DNA STABILITY
   ========================================================= */

function setupStage4() {
  const stabilityFeedback = document.querySelector("#stage4-stability-feedback");
  const calculationFeedback = document.querySelector("#stage4-calculation-feedback");
  const heatingFeedback = document.querySelector("#stage4-heating-feedback");
  const analysisFeedback = document.querySelector("#stage4-analysis-feedback");

  const clearAllStage4Feedback = () => {
    clearFeedback(stabilityFeedback);
    clearFeedback(calculationFeedback);
    clearFeedback(heatingFeedback);
    clearFeedback(analysisFeedback);
  };

  /* migrate old saved data */
  if (typeof labData.stage4.stabilityAnswer !== "string") labData.stage4.stabilityAnswer = "";
  if (typeof labData.stage4.heatingAnswer !== "string") labData.stage4.heatingAnswer = "";
  if (typeof labData.stage4.atPairs !== "string") labData.stage4.atPairs = "";
  if (typeof labData.stage4.gcPairs !== "string") labData.stage4.gcPairs = "";
  if (typeof labData.stage4.hydrogenBonds !== "string") labData.stage4.hydrogenBonds = "";

  /* ---- PART A — DNA STABILITY ---- */

  document.querySelectorAll('input[name="stage4-stability-answer"]').forEach(option => {
    option.checked = option.value === labData.stage4.stabilityAnswer;
    option.addEventListener("change", () => {
      labData.stage4.stabilityAnswer = option.value;
      resetStage4CompletionFrom("stability");
      saveLabData();
      lockStage4Next();
      clearAllStage4Feedback();
    });
  });

  document.querySelector("#check-stage4-stability")?.addEventListener("click", () => {
    const answer = labData.stage4.stabilityAnswer;
    const explanation = document.querySelector("#stage4-stability-note")?.value || "";

    if (!answer) {
      showFeedback(stabilityFeedback, "hint", `
        Select which DNA region would generally require more energy to separate.
      `);
      return;
    }

    if (answer !== "x") {
      resetStage4CompletionFrom("stability");
      saveLabData();
      lockStage4Next();

      showFeedback(stabilityFeedback, "hint", `
        Compare the number of G–C base pairs in the two regions.
        Remember that G–C and A–T pairs do not form the same number
        of hydrogen bonds.
      `);
      return;
    }

    if (!validateStage4Stability(explanation)) {
      resetStage4CompletionFrom("stability");
      saveLabData();
      lockStage4Next();

      showFeedback(stabilityFeedback, "hint", `
        Your choice of Region X is correct, but the written explanation
        is not yet biologically complete.<br><br>
        Compare G–C and A–T base pairs and explain how many hydrogen
        bonds each type forms.
      `);
      return;
    }

    labData.stage4.stabilityCorrect = true;
    saveLabData();

    showFeedback(stabilityFeedback, "success", `
      <strong>Stability analysis correct.</strong><br>
      Region X contains more G–C base pairs. G–C pairs form three
      hydrogen bonds, whereas A–T pairs form two. Therefore, Region X
      generally requires more energy to separate.
    `);
  });

  /* ---- PART B — HYDROGEN-BOND CALCULATION ---- */

  const atInput = document.querySelector("#stage4-at-pairs");
  const gcInput = document.querySelector("#stage4-gc-pairs");
  const hydrogenInput = document.querySelector("#stage4-hydrogen-bonds");

  if (atInput) {
    atInput.value = labData.stage4.atPairs || "";
    atInput.addEventListener("input", () => {
      labData.stage4.atPairs = atInput.value;
      resetStage4CompletionFrom("calculations");
      saveLabData();
      lockStage4Next();
      clearFeedback(calculationFeedback);
      clearFeedback(heatingFeedback);
      clearFeedback(analysisFeedback);
    });
  }

  if (gcInput) {
    gcInput.value = labData.stage4.gcPairs || "";
    gcInput.addEventListener("input", () => {
      labData.stage4.gcPairs = gcInput.value;
      resetStage4CompletionFrom("calculations");
      saveLabData();
      lockStage4Next();
      clearFeedback(calculationFeedback);
      clearFeedback(heatingFeedback);
      clearFeedback(analysisFeedback);
    });
  }

  if (hydrogenInput) {
    hydrogenInput.value = labData.stage4.hydrogenBonds || "";
    hydrogenInput.addEventListener("input", () => {
      labData.stage4.hydrogenBonds = hydrogenInput.value;
      resetStage4CompletionFrom("calculations");
      saveLabData();
      lockStage4Next();
      clearFeedback(calculationFeedback);
      clearFeedback(heatingFeedback);
      clearFeedback(analysisFeedback);
    });
  }

  document.querySelector("#check-stage4-calculations")?.addEventListener("click", () => {
    if (!labData.stage4.stabilityCorrect) {
      showFeedback(calculationFeedback, "hint", `
        Complete Part A correctly before submitting the molecular calculation.
      `);
      return;
    }

    const atCorrect = Number(labData.stage4.atPairs) === 2;
    const gcCorrect = Number(labData.stage4.gcPairs) === 6;
    const hydrogenCorrect = Number(labData.stage4.hydrogenBonds) === 22;

    if (atCorrect && gcCorrect && hydrogenCorrect) {
      labData.stage4.calculationsCorrect = true;
      saveLabData();

      showFeedback(calculationFeedback, "success", `
        <strong>Calculations correct.</strong><br>
        Region X contains 2 A–T pairs and 6 G–C pairs.<br><br>
        2 × 2 hydrogen bonds = 4<br>
        6 × 3 hydrogen bonds = 18<br>
        <strong>Total = 22 hydrogen bonds.</strong>
      `);
      return;
    }

    resetStage4CompletionFrom("calculations");
    saveLabData();
    lockStage4Next();

    if (!atCorrect || !gcCorrect) {
      showFeedback(calculationFeedback, "hint", `
        Recount the base pairs in Region X. Classify each pair as
        either A–T or G–C before calculating hydrogen bonds.
      `);
      return;
    }

    showFeedback(calculationFeedback, "hint", `
      Your base-pair counts are correct.
      Now remember that A–T forms two hydrogen bonds and G–C forms three.
    `);
  });

  /* ---- PART C — APPLY GC CONTENT ---- */

  document.querySelectorAll('input[name="stage4-heating-answer"]').forEach(option => {
    option.checked = option.value === labData.stage4.heatingAnswer;
    option.addEventListener("change", () => {
      labData.stage4.heatingAnswer = option.value;
      resetStage4CompletionFrom("heating");
      saveLabData();
      lockStage4Next();
      clearFeedback(heatingFeedback);
      clearFeedback(analysisFeedback);
    });
  });

  document.querySelector("#check-stage4-heating")?.addEventListener("click", () => {
    if (!labData.stage4.calculationsCorrect) {
      showFeedback(heatingFeedback, "hint", `
        Complete Part B correctly before applying the pattern to the
        new DNA regions.
      `);
      return;
    }

    const answer = labData.stage4.heatingAnswer;
    const explanation = document.querySelector("#stage4-heating-note")?.value || "";

    if (!answer) {
      showFeedback(heatingFeedback, "hint", `
        Select which DNA region would separate more easily when heated.
      `);
      return;
    }

    if (answer !== "n") {
      resetStage4CompletionFrom("heating");
      saveLabData();
      lockStage4Next();

      showFeedback(heatingFeedback, "hint", `
        Compare the GC content of the two regions. A region with
        fewer G–C pairs has fewer three-hydrogen-bond interactions to break.
      `);
      return;
    }

    if (!validateStage4Heating(explanation)) {
      resetStage4CompletionFrom("heating");
      saveLabData();
      lockStage4Next();

      showFeedback(heatingFeedback, "hint", `
        Your choice of Region N is correct, but the written explanation
        is not yet biologically complete.<br><br>
        Explain how lower GC content changes the number of
        three-hydrogen-bond G–C interactions and therefore changes
        the energy needed to separate the strands.
      `);
      return;
    }

    labData.stage4.heatingCorrect = true;
    saveLabData();

    showFeedback(heatingFeedback, "success", `
      <strong>Prediction correct.</strong><br>
      Region N has lower GC content and therefore fewer
      three-hydrogen-bond G–C interactions. It would generally
      separate more easily when heated.
    `);
  });

  /* ---- PART D — STRUCTURAL SYNTHESIS ---- */

  document.querySelector("#check-stage4-analysis")?.addEventListener("click", () => {
    if (
      !labData.stage4.stabilityCorrect ||
      !labData.stage4.calculationsCorrect ||
      !labData.stage4.heatingCorrect
    ) {
      showFeedback(analysisFeedback, "hint", `
        Complete Parts A, B and C correctly before submitting the
        Stage 4 synthesis.
      `);
      return;
    }

    const explanation = document.querySelector("#stage4-note")?.value || "";

    if (!validateStage4Synthesis(explanation)) {
      labData.stage4.analysisCorrect = false;
      labData.completedStages.stage4 = false;
      saveLabData();
      lockStage4Next();

      showFeedback(analysisFeedback, "hint", `
        Your explanation is not yet biologically complete.<br><br>
        Connect complementary base pairing to hydrogen bonding and
        DNA stability. Then explain how the strands can separate
        without breaking the covalent sugar-phosphate backbone.
      `);
      return;
    }

    labData.stage4.analysisCorrect = true;
    labData.completedStages.stage4 = true;
    saveLabData();

    showFeedback(analysisFeedback, "success", `
      <strong>Stage 4 complete.</strong><br>
      Complementary bases stabilize double-stranded DNA through
      hydrogen bonding. Those hydrogen bonds can be broken when the
      strands need to separate, while the covalent sugar-phosphate
      backbones remain intact.
    `);

    unlockNext("#stage4-next");
  });

  if (labData.completedStages.stage4 && labData.stage4.analysisCorrect) {
    unlockNext("#stage4-next");
  }
}

function resetStage4CompletionFrom(step) {
  const order = ["stability", "calculations", "heating", "analysis"];
  const start = order.indexOf(step);
  if (start === -1) return;

  if (start <= order.indexOf("stability")) labData.stage4.stabilityCorrect = false;
  if (start <= order.indexOf("calculations")) labData.stage4.calculationsCorrect = false;
  if (start <= order.indexOf("heating")) labData.stage4.heatingCorrect = false;
  if (start <= order.indexOf("analysis")) labData.stage4.analysisCorrect = false;

  labData.completedStages.stage4 = false;
}

function lockStage4Next() {
  const link = document.querySelector("#stage4-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   STAGE 5 — DIAGNOSE AND REPAIR DNA
   ========================================================= */

function setupStage5() {
  const baseBank = document.querySelectorAll(".base-bank-button");
  const diagnosticBases = document.querySelectorAll(".diagnostic-base");

  const directionButtons = {
    topLeft: document.querySelector("#stage5-top-left"),
    topRight: document.querySelector("#stage5-top-right"),
    bottomLeft: document.querySelector("#stage5-bottom-left"),
    bottomRight: document.querySelector("#stage5-bottom-right")
  };

  const bondElements = document.querySelectorAll(".diagnostic-bonds span");
  const feedback = document.querySelector("#stage5-feedback");
  const analysisFeedback = document.querySelector("#stage5-analysis-feedback");

  baseBank.forEach(button => {
    button.addEventListener("click", () => selectPiece(button));
  });

  diagnosticBases.forEach(button => {
    button.addEventListener("click", () => {
      if (!selectedPiece || !selectedPiece.classList.contains("base-bank-button")) return;

      const position = Number(button.dataset.position);
      labData.stage5.sequence[position] = selectedPiece.dataset.base;

      resetStage5Completion();
      saveLabData();
      clearSelectedPiece();
      renderStage5Model();
      clearFeedback(feedback);
      clearFeedback(analysisFeedback);
    });
  });

  Object.entries(directionButtons).forEach(([key, button]) => {
    button?.addEventListener("click", () => {
      labData.stage5[key] = labData.stage5[key] === "5" ? "3" : "5";
      resetStage5Completion();
      saveLabData();
      renderStage5Model();
      clearFeedback(feedback);
      clearFeedback(analysisFeedback);
    });
  });

  bondElements.forEach((bond, index) => {
    bond.style.cursor = "pointer";
    bond.addEventListener("click", () => {
      labData.stage5.bondCounts[index] = labData.stage5.bondCounts[index] === 2 ? 3 : 2;
      resetStage5Completion();
      saveLabData();
      renderStage5Model();
      clearFeedback(feedback);
      clearFeedback(analysisFeedback);
    });
  });

  renderStage5Model();

  document.querySelector("#check-stage5-repair")?.addEventListener("click", () => {
    const correctSequence = ["T", "A", "C", "G", "G", "T"];
    const correctBonds = [2, 2, 3, 3, 3, 2];

    const directionsCorrect =
      labData.stage5.topLeft === "5" &&
      labData.stage5.topRight === "3" &&
      labData.stage5.bottomLeft === "3" &&
      labData.stage5.bottomRight === "5";

    const sequenceCorrect = correctSequence.every(
      (base, index) => labData.stage5.sequence[index] === base
    );

    const bondsCorrect = correctBonds.every(
      (count, index) => labData.stage5.bondCounts[index] === count
    );

    if (directionsCorrect && sequenceCorrect && bondsCorrect) {
      labData.stage5.repairsCorrect = true;
      saveLabData();

      showFeedback(feedback, "success", `
        <strong>Repairs validated.</strong><br>
        The strands are now antiparallel, the bases are complementary,
        and the hydrogen-bond counts are correct.
      `);
    } else {
      resetStage5Completion();
      saveLabData();

      const hints = [];
      if (!directionsCorrect) hints.push("Check whether the two strands run antiparallel.");
      if (!sequenceCorrect) hints.push("At least one complementary base is incorrect.");
      if (!bondsCorrect) hints.push("Check the hydrogen-bond counts for A–T and G–C pairs.");

      showFeedback(feedback, "hint", `
        <strong>The model still contains an error.</strong><br>
        ${hints.join("<br>")}
      `);
    }
  });

  document.querySelector("#check-stage5-analysis")?.addEventListener("click", () => {
    if (!labData.stage5.repairsCorrect) {
      showFeedback(analysisFeedback, "hint", `
        Repair and validate the DNA model first.
      `);
      return;
    }

    const explanation = document.querySelector("#stage5-note")?.value || "";

    if (!validateStage5Explanation(explanation)) {
      labData.stage5.analysisCorrect = false;
      labData.completedStages.stage5 = false;
      saveLabData();
      lockStage5Next();

      showFeedback(analysisFeedback, "hint", `
        Your explanation is not yet biologically complete.<br><br>
        Identify and explain at least two structural errors that
        were present in the original DNA model. Consider strand
        direction, complementary base pairing, and hydrogen-bond number.
      `);
      return;
    }

    labData.stage5.analysisCorrect = true;
    labData.completedStages.stage5 = true;
    saveLabData();

    showFeedback(analysisFeedback, "success", `
      <strong>Stage 5 complete.</strong><br>
      You correctly repaired the DNA model and identified the
      structural rules that had been violated.
    `);

    unlockNext("#stage5-next");
  });

  if (labData.completedStages.stage5 && labData.stage5.analysisCorrect) {
    unlockNext("#stage5-next");
  }
}

function renderStage5Model() {
  const directionMap = {
    topLeft: "#stage5-top-left",
    topRight: "#stage5-top-right",
    bottomLeft: "#stage5-bottom-left",
    bottomRight: "#stage5-bottom-right"
  };

  Object.entries(directionMap).forEach(([key, selector]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = labData.stage5[key] + "′";
    }
  });

  document.querySelectorAll(".diagnostic-base").forEach(button => {
    const position = Number(button.dataset.position);
    const base = labData.stage5.sequence[position];
    button.className = `diagnostic-base base-${base.toLowerCase()}`;
    button.textContent = base;
  });

  document.querySelectorAll(".diagnostic-bonds span").forEach((element, index) => {
    element.textContent = labData.stage5.bondCounts[index] === 3 ? "···" : "··";
  });
}

function resetStage5Completion() {
  labData.stage5.repairsCorrect = false;
  labData.stage5.analysisCorrect = false;
  labData.completedStages.stage5 = false;
  lockStage5Next();
}

function lockStage5Next() {
  const link = document.querySelector("#stage5-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   STAGE 6 — INVESTIGATE DNA STRUCTURE
   ========================================================= */

function setupStage6() {
  const models = document.querySelectorAll(".candidate-model");
  const selectButtons = document.querySelectorAll(".model-select-button");
  const evidence = document.querySelectorAll(".stage6-evidence");
  const feedback = document.querySelector("#stage6-feedback");

  if (labData.stage6.selectedModel) {
    models.forEach(model => {
      model.classList.toggle(
        "selected-model",
        model.dataset.model === labData.stage6.selectedModel
      );
    });
  }

  selectButtons.forEach(button => {
    button.addEventListener("click", () => {
      labData.stage6.selectedModel = button.dataset.model;
      resetStage6Completion();
      saveLabData();

      models.forEach(model => {
        model.classList.toggle(
          "selected-model",
          model.dataset.model === labData.stage6.selectedModel
        );
      });

      clearFeedback(feedback);
    });
  });

  evidence.forEach(box => {
    box.checked = labData.stage6.evidence.includes(box.value);
    box.addEventListener("change", () => {
      labData.stage6.evidence = Array.from(
        document.querySelectorAll(".stage6-evidence:checked")
      ).map(checked => checked.value);

      labData.stage6.analysisCorrect = false;
      labData.completedStages.stage6 = false;
      saveLabData();
      lockStage6Next();
      clearFeedback(feedback);
    });
  });

  document.querySelector("#check-stage6-investigation")?.addEventListener("click", () => {
    const explanation = document.querySelector("#stage6-note")?.value || "";

    if (!labData.stage6.selectedModel) {
      showFeedback(feedback, "hint", `
        Select the DNA model you believe is structurally consistent
        with the evidence.
      `);
      return;
    }

    if (labData.stage6.selectedModel !== "A") {
      resetStage6Completion();
      saveLabData();

      showFeedback(feedback, "hint", `
        Your selected model contains at least one structural problem.
        Re-examine the evidence for complementary base pairing,
        strand orientation, and hydrogen bonding.
      `);
      return;
    }

    const requiredEvidence = ["complementary", "antiparallel", "hydrogen"];
    const missingEvidence = requiredEvidence.some(
      item => !labData.stage6.evidence.includes(item)
    );

    if (missingEvidence) {
      resetStage6Completion();
      saveLabData();

      showFeedback(feedback, "hint", `
        Your model choice is correct, but the evidence selection is
        incomplete. Identify all structural evidence that supports the model.
      `);
      return;
    }

    if (!validateStage6Explanation(explanation)) {
      labData.stage6.analysisCorrect = false;
      labData.completedStages.stage6 = false;
      saveLabData();
      lockStage6Next();

      showFeedback(feedback, "hint", `
        Your selected model and evidence are correct, but the written
        evaluation is not yet biologically complete.<br><br>
        Explain how the model demonstrates complementary base pairing,
        antiparallel strand orientation, and hydrogen bonding between the bases.
      `);
      return;
    }

    labData.stage6.analysisCorrect = true;
    labData.completedStages.stage6 = true;
    saveLabData();

    showFeedback(feedback, "success", `
      <strong>Stage 6 complete.</strong><br>
      Model A is supported by complementary base pairing, antiparallel
      strand orientation, and the correct hydrogen-bond relationships
      between paired bases.
    `);

    unlockNext("#stage6-next");
  });

  if (labData.completedStages.stage6 && labData.stage6.analysisCorrect) {
    unlockNext("#stage6-next");
  }
}

function resetStage6Completion() {
  labData.stage6.analysisCorrect = false;
  labData.completedStages.stage6 = false;
  lockStage6Next();
}

function lockStage6Next() {
  const link = document.querySelector("#stage6-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   FINAL CHALLENGE
   ========================================================= */

function setupChallenge() {
  const baseBank = document.querySelectorAll(".base-bank-button");
  const slots = document.querySelectorAll(".final-base-slot");
  const leftDirection = document.querySelector("#final-left-direction");
  const rightDirection = document.querySelector("#final-right-direction");
  const feedback = document.querySelector("#final-feedback");
  const completedHelix = document.querySelector("#completed-double-helix");

  baseBank.forEach(button => {
    makeDraggable(button, { type: "challenge-base", base: button.dataset.base });
    button.addEventListener("click", () => selectPiece(button));
  });

  slots.forEach(slot => {
    setupDropTarget(slot, data => {
      if (data.type !== "challenge-base") return;
      placeChallengeBase(slot, data.base);
    });

    slot.addEventListener("click", () => {
      if (selectedPiece && selectedPiece.classList.contains("base-bank-button")) {
        placeChallengeBase(slot, selectedPiece.dataset.base);
        clearSelectedPiece();
        return;
      }

      const position = Number(slot.dataset.position);
      labData.challenge.sequence[position] = "";
      resetChallengeCompletion();
      saveLabData();
      renderChallenge();
      clearFeedback(feedback);
    });
  });

  leftDirection?.addEventListener("click", () => {
    labData.challenge.leftDirection = cycleDirection(labData.challenge.leftDirection);
    resetChallengeCompletion();
    saveLabData();
    renderChallenge();
    clearFeedback(feedback);
  });

  rightDirection?.addEventListener("click", () => {
    labData.challenge.rightDirection = cycleDirection(labData.challenge.rightDirection);
    resetChallengeCompletion();
    saveLabData();
    renderChallenge();
    clearFeedback(feedback);
  });

  setupChallengeCalculationSaving();
  restoreChallengeCalculations();
  renderChallenge();

  document.querySelector("#submit-final-challenge")?.addEventListener("click", () => {
    const complement = ["C", "G", "T", "A", "A", "C", "G", "G"];

    const sequenceCorrect = complement.every(
      (base, index) => labData.challenge.sequence[index] === base
    );

    const directionsCorrect =
      labData.challenge.leftDirection === "3" &&
      labData.challenge.rightDirection === "5";

    const atCorrect = Number(labData.challenge.atPairs) === 3;
    const gcCorrect = Number(labData.challenge.gcPairs) === 5;
    const hydrogenCorrect = Number(labData.challenge.hydrogenBonds) === 21;
    const purinesCorrect = Number(labData.challenge.purines) === 3;
    const calculationsCorrect = atCorrect && gcCorrect && hydrogenCorrect && purinesCorrect;

    const explanation = document.querySelector("#final-note")?.value || "";
    const issues = [];

    if (!sequenceCorrect) {
      issues.push("The complementary strand contains at least one incorrect base.");
    }

    if (!directionsCorrect) {
      issues.push("The strand orientations are not yet antiparallel.");
    }

    if (!calculationsCorrect) {
      if (!atCorrect || !gcCorrect) {
        issues.push("Recount the A–T and G–C base pairs.");
      }
      if (!hydrogenCorrect) {
        issues.push("Recalculate the total hydrogen bonds using 2 for each A–T pair and 3 for each G–C pair.");
      }
      if (!purinesCorrect) {
        issues.push("Recount the purines in the original strand. Adenine and guanine are purines.");
      }
    }

    if (!validateFinalDefence(explanation)) {
      issues.push(
        "Your molecular defence is not yet biologically complete. Include nucleotide structure, the sugar-phosphate backbone, complementary base pairing, antiparallel orientation, and hydrogen bonding."
      );
    }

    if (issues.length > 0) {
      labData.challenge.analysisCorrect = false;
      labData.completedStages.challenge = false;
      saveLabData();
      lockChallengeNext();
      completedHelix?.classList.remove("visible");

      showFeedback(feedback, "hint", `
        <strong>Your DNA model has not yet passed validation.</strong><br><br>
        ${issues.join("<br><br>")}
      `);
      return;
    }

    labData.challenge.analysisCorrect = true;
    labData.completedStages.challenge = true;
    saveLabData();
    renderChallenge();
    completedHelix?.classList.add("visible");

    showFeedback(feedback, "success", `
      <strong>DNA molecule validated.</strong><br>
      Your complementary sequence, strand orientation, structural
      calculations, and molecular defence are all biologically
      consistent.<br><br>
      The completed double helix has been unlocked below.
    `);

    unlockNext("#final-next");

    setTimeout(() => {
      completedHelix?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  });

  if (labData.completedStages.challenge && labData.challenge.analysisCorrect) {
    completedHelix?.classList.add("visible");
    unlockNext("#final-next");
  }
}

function cycleDirection(current) {
  if (!current) return "3";
  if (current === "3") return "5";
  return "";
}

function placeChallengeBase(slot, base) {
  const position = Number(slot.dataset.position);
  if (!Number.isInteger(position) || position < 0 || position > 7) return;

  const value = String(base || "").toUpperCase();
  if (!["A", "T", "G", "C"].includes(value)) return;

  labData.challenge.sequence[position] = value;
  resetChallengeCompletion();
  saveLabData();
  renderChallenge();
  clearFeedback(document.querySelector("#final-feedback"));
}

function renderChallenge() {
  const template = ["G", "C", "A", "T", "T", "G", "C", "C"];
  const correctPairs = { A: "T", T: "A", C: "G", G: "C" };

  document.querySelectorAll(".final-base-slot").forEach(slot => {
    const position = Number(slot.dataset.position);
    const base = labData.challenge.sequence[position];

    if (!base) {
      slot.className = "final-base-slot";
      slot.textContent = "?";
      return;
    }

    slot.className = `final-base-slot dna-base base-${base.toLowerCase()}`;
    slot.textContent = base;
  });

  document.querySelectorAll(".final-bond-row > div").forEach((bond, position) => {
    const topBase = template[position];
    const bottomBase = labData.challenge.sequence[position];
    const correct = bottomBase === correctPairs[topBase];

    if (!correct) {
      bond.textContent = "";
      return;
    }

    bond.textContent = (topBase === "G" || topBase === "C") ? "···" : "··";
  });

  const left = document.querySelector("#final-left-direction");
  const right = document.querySelector("#final-right-direction");

  if (left) {
    left.textContent = labData.challenge.leftDirection
      ? labData.challenge.leftDirection + "′"
      : "?";
  }

  if (right) {
    right.textContent = labData.challenge.rightDirection
      ? labData.challenge.rightDirection + "′"
      : "?";
  }
}

function setupChallengeCalculationSaving() {
  const map = {
    "#final-at": "atPairs",
    "#final-gc": "gcPairs",
    "#final-hydrogen": "hydrogenBonds",
    "#final-purines": "purines"
  };

  Object.entries(map).forEach(([selector, key]) => {
    const input = document.querySelector(selector);
    input?.addEventListener("input", () => {
      labData.challenge[key] = input.value;
      resetChallengeCompletion();
      saveLabData();
      clearFeedback(document.querySelector("#final-feedback"));
    });
  });
}

function restoreChallengeCalculations() {
  const map = {
    "#final-at": labData.challenge.atPairs,
    "#final-gc": labData.challenge.gcPairs,
    "#final-hydrogen": labData.challenge.hydrogenBonds,
    "#final-purines": labData.challenge.purines
  };

  Object.entries(map).forEach(([selector, value]) => {
    const input = document.querySelector(selector);
    if (input) {
      input.value = value || "";
    }
  });
}

function resetChallengeCompletion() {
  labData.challenge.analysisCorrect = false;
  labData.completedStages.challenge = false;
  lockChallengeNext();
  document.querySelector("#completed-double-helix")?.classList.remove("visible");
}

function lockChallengeNext() {
  const link = document.querySelector("#final-next");
  if (!link) return;
  link.classList.add("locked");
  link.setAttribute("aria-disabled", "true");
}


/* =========================================================
   COMPLETION PAGE
   ========================================================= */

function setupCompletionPage() {
  const student = document.querySelector("#completion-student");
  const sequence = document.querySelector("#final-sequence-display");
  const notebook = document.querySelector("#notebook-output");

  if (student) {
    student.textContent = labData.studentName
      ? `${labData.studentName}, you completed the Biology 30 Virtual DNA Construction Lab.`
      : "Biology 30 Virtual DNA Construction Lab completed.";
  }

  if (sequence) {
    sequence.innerHTML = `
      <div>5′ — G C A T T G C C — 3′</div>
      <div>3′ — ${labData.challenge.sequence.join(" ")} — 5′</div>
    `;
  }

  if (notebook) {
    notebook.innerHTML = buildNotebookHTML();
  }

  document.querySelector("#download-report")?.addEventListener("click", downloadLabReport);
  document.querySelector("#print-report")?.addEventListener("click", () => window.print());
  document.querySelector("#start-over")?.addEventListener("click", startLabAgain);
}

function buildNotebookHTML() {
  const responses = [
    ["Stage 1 — Nucleotide Structure", labData.notebook.stage1Note],
    ["Stage 2 — Nitrogenous Bases", labData.notebook.stage2Note],
    ["Stage 3 — Backbone Error Diagnosis", labData.notebook.stage3DiagnosisNote],
    ["Stage 3 — DNA Strand Transfer", labData.notebook.stage3Note],
    ["Stage 4 — DNA Stability", labData.notebook.stage4StabilityNote],
    ["Stage 4 — GC Content and Heating", labData.notebook.stage4HeatingNote],
    ["Stage 4 — Structural Synthesis", labData.notebook.stage4Note],
    ["Stage 5 — Error Analysis", labData.notebook.stage5Note],
    ["Stage 6 — Structural Investigation", labData.notebook.stage6Note],
    ["Final Challenge — Model Defence", labData.notebook.finalNote]
  ];

  return responses.map(([title, response]) => `
    <div class="record-item">
      <strong>${escapeHTML(title)}</strong>
      <p>${escapeHTML(response || "No response recorded.")}</p>
    </div>
  `).join("");
}

function downloadLabReport() {
  const date = new Date().toLocaleDateString();

  const report = `BIOLOGY 30
VIRTUAL DNA CONSTRUCTION LAB

Student:
${labData.studentName || "Not recorded"}

Date:
${date}

==================================================
LAB COMPLETION
==================================================

Stage 1 — Construct a DNA Nucleotide
${completionText(labData.completedStages.stage1)}

Stage 2 — Analyze the Nitrogenous Bases
${completionText(labData.completedStages.stage2)}

Stage 3 — Construct and Analyze a DNA Strand
${completionText(labData.completedStages.stage3)}

Stage 4 — Analyze DNA Stability
${completionText(labData.completedStages.stage4)}

Stage 5 — Diagnose and Repair DNA
${completionText(labData.completedStages.stage5)}

Stage 6 — DNA Structural Investigation
${completionText(labData.completedStages.stage6)}

Final Challenge
${completionText(labData.completedStages.challenge)}

==================================================
FINAL DNA MOLECULE
==================================================

5′ — G C A T T G C C — 3′
3′ — ${labData.challenge.sequence.join(" ")} — 5′

A–T base pairs:
${labData.challenge.atPairs}

G–C base pairs:
${labData.challenge.gcPairs}

Total hydrogen bonds:
${labData.challenge.hydrogenBonds}

Purines in original strand:
${labData.challenge.purines}

==================================================
LAB NOTEBOOK
==================================================

STAGE 1 — NUCLEOTIDE STRUCTURE

${labData.notebook.stage1Note || "No response recorded."}


STAGE 2 — NITROGENOUS BASES

${labData.notebook.stage2Note || "No response recorded."}


STAGE 3 — BACKBONE ERROR DIAGNOSIS

${labData.notebook.stage3DiagnosisNote || "No response recorded."}


STAGE 3 — DNA STRAND TRANSFER

${labData.notebook.stage3Note || "No response recorded."}


STAGE 4 — DNA STABILITY

${labData.notebook.stage4StabilityNote || "No response recorded."}


STAGE 4 — GC CONTENT AND HEATING

${labData.notebook.stage4HeatingNote || "No response recorded."}


STAGE 4 — STRUCTURAL SYNTHESIS

${labData.notebook.stage4Note || "No response recorded."}


STAGE 5 — ERROR ANALYSIS

${labData.notebook.stage5Note || "No response recorded."}


STAGE 6 — STRUCTURAL INVESTIGATION

${labData.notebook.stage6Note || "No response recorded."}


FINAL MODEL DEFENCE

${labData.notebook.finalNote || "No response recorded."}


==================================================
END OF LAB RECORD
==================================================
`;

  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const safeName = (labData.studentName || "student")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  link.href = url;
  link.download = `${safeName}_DNA_Lab_Record.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function startLabAgain() {
  const confirmed = window.confirm(
    "Start a new lab? This will permanently erase the saved work currently stored on this browser."
  );
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  labData = cloneDefaultData();
  window.location.href = "index.html";
}

function completionText(completed) {
  return completed ? "Completed ✓" : "Not completed";
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}
