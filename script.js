/* =========================================================
   BIOLOGY 30 — VIRTUAL DNA CONSTRUCTION LAB
   COMPLETE script.js
   ========================================================= */


/* =========================================================
   1. STORAGE + DEFAULT DATA
   ========================================================= */

const STORAGE_KEY = "bio30VirtualDNALab";
const LEGACY_STORAGE_KEY = "bio30_dna_virtual_lab";

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

  stage1: {
    model: {
      phosphate: "",
      sugar: "",
      base: ""
    },
    attempts: 0,
    modelCorrect: false,
    variableComponent: "",
    analysisCorrect: false
  },

  stage2: {
    families: {
      adenine: "",
      guanine: "",
      cytosine: "",
      thymine: ""
    },

    rings: {
      adenine: "",
      guanine: "",
      cytosine: "",
      thymine: ""
    },

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

  stage3: {
    components: [
      { phosphate: "", sugar: "", base: "" },
      { phosphate: "", sugar: "", base: "" },
      { phosphate: "", sugar: "", base: "" },
      { phosphate: "", sugar: "", base: "" },
      { phosphate: "", sugar: "", base: "" },
      { phosphate: "", sugar: "", base: "" }
    ],

    buildCorrect: false,

    bondSelected: false,
    bondAnswer: "",
    bondCorrect: false,

    selectedModel: "",
    diagnosisCorrect: false,

    analysisCorrect: false
  },

  stage4: {
    sequence: ["", "", "", "", "", ""],

    complementCorrect: false,

    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",

    analysisCorrect: false
  },

  stage5: {
    topLeft: "5",
    topRight: "3",
    bottomLeft: "5",
    bottomRight: "3",

    sequence: [
      "T",
      "A",
      "C",
      "G",
      "T",
      "T"
    ],

    bondCounts: [
      2,
      2,
      3,
      3,
      2,
      2
    ],

    repairsCorrect: false,
    analysisCorrect: false
  },

  stage6: {
    selectedModel: "",
    evidence: [],
    analysisCorrect: false
  },

  challenge: {
    sequence: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],

    leftDirection: "",
    rightDirection: "",

    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",
    purines: "",

    analysisCorrect: false
  },

  notebook: {
    stage1Note: "",
    stage2Note: "",
    stage3Note: "",
    stage3DiagnosisNote: "",
    stage4Note: "",
    stage5Note: "",
    stage6Note: "",
    finalNote: ""
  }
};


/* =========================================================
   2. STORAGE HELPERS
   ========================================================= */

function cloneDefaultData() {
  return JSON.parse(
    JSON.stringify(defaultLabData)
  );
}


function mergeObjects(target, source) {
  if (!source || typeof source !== "object") {
    return target;
  }

  Object.keys(source).forEach(key => {
    const value = source[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      if (
        !target[key] ||
        typeof target[key] !== "object" ||
        Array.isArray(target[key])
      ) {
        target[key] = {};
      }

      mergeObjects(
        target[key],
        value
      );
    } else {
      target[key] = value;
    }
  });

  return target;
}


function loadLabData() {
  let raw =
    localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    raw =
      localStorage.getItem(
        LEGACY_STORAGE_KEY
      );
  }

  if (!raw) {
    return cloneDefaultData();
  }

  try {
    return mergeObjects(
      cloneDefaultData(),
      JSON.parse(raw)
    );
  } catch (error) {
    console.warn(
      "Could not read saved lab data.",
      error
    );

    return cloneDefaultData();
  }
}


let labData = loadLabData();


function saveLabData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(labData)
  );

  showSaveStatus();
}


function showSaveStatus() {
  const status =
    document.querySelector(
      "#save-status"
    );

  if (!status) return;

  status.textContent = "✓ Saved";

  clearTimeout(
    showSaveStatus.timer
  );

  showSaveStatus.timer =
    setTimeout(() => {
      status.textContent =
        document.body.dataset.page === "home"
          ? "Progress saves automatically"
          : "✓ Saved";
    }, 1000);
}


/* =========================================================
   3. INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    displayStudentName();
    restoreSavedTextFields();
    setupSavedTextFields();

    const page =
      document.body.dataset.page;

    switch (page) {
      case "home":
        setupHomePage();
        break;

      case "stage1":
        setupStage1();
        break;

      case "stage2":
        setupStage2();
        break;

      case "stage3":
        setupStage3();
        break;

      case "stage4":
        setupStage4();
        break;

      case "stage5":
        setupStage5();
        break;

      case "stage6":
        setupStage6();
        break;

      case "challenge":
        setupChallenge();
        break;

      case "complete":
        setupCompletionPage();
        break;
    }
  }
);


/* =========================================================
   4. GENERAL HELPERS
   ========================================================= */

function displayStudentName() {
  document
    .querySelectorAll(
      "#student-display"
    )
    .forEach(element => {
      if (labData.studentName) {
        element.textContent =
          labData.studentName;
      }
    });
}


function setupSavedTextFields() {
  document
    .querySelectorAll(
      "[data-save-field]"
    )
    .forEach(field => {
      field.addEventListener(
        "input",
        () => {
          const key =
            field.dataset.saveField;

          if (
            Object.prototype.hasOwnProperty.call(
              labData.notebook,
              key
            )
          ) {
            labData.notebook[key] =
              field.value;

            saveLabData();
          }
        }
      );
    });
}


function restoreSavedTextFields() {
  document
    .querySelectorAll(
      "[data-save-field]"
    )
    .forEach(field => {
      const key =
        field.dataset.saveField;

      if (
        Object.prototype.hasOwnProperty.call(
          labData.notebook,
          key
        )
      ) {
        field.value =
          labData.notebook[key] || "";
      }
    });
}


function showFeedback(
  element,
  type,
  message
) {
  if (!element) return;

  element.className =
    `feedback-box visible ${type}`;

  element.innerHTML =
    message;
}


function clearFeedback(element) {
  if (!element) return;

  element.className =
    "feedback-box";

  element.innerHTML = "";
}


function requireReasoning(
  text,
  minimumCharacters = 50
) {
  return (
    String(text || "")
      .trim()
      .length >=
    minimumCharacters
  );
}


function unlockNext(selector) {
  const link =
    document.querySelector(
      selector
    );

  if (!link) return;

  link.classList.remove(
    "locked"
  );

  link.setAttribute(
    "aria-disabled",
    "false"
  );
}


function lockNext(selector) {
  const link =
    document.querySelector(
      selector
    );

  if (!link) return;

  link.classList.add(
    "locked"
  );

  link.setAttribute(
    "aria-disabled",
    "true"
  );
}


/* =========================================================
   5. CLICK + DRAG HELPERS
   ========================================================= */

let selectedPiece = null;


function selectPiece(element) {
  clearSelectedPiece();

  selectedPiece = element;

  element.classList.add(
    "selected-piece"
  );
}


function clearSelectedPiece() {
  document
    .querySelectorAll(
      ".selected-piece"
    )
    .forEach(element => {
      element.classList.remove(
        "selected-piece"
      );
    });

  selectedPiece = null;
}


function makeDraggable(
  element,
  data
) {
  element.draggable = true;

  element.addEventListener(
    "dragstart",
    event => {
      element.classList.add(
        "dragging"
      );

      event.dataTransfer.effectAllowed =
        "copy";

      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify(data)
      );
    }
  );

  element.addEventListener(
    "dragend",
    () => {
      element.classList.remove(
        "dragging"
      );
    }
  );
}


function setupDropTarget(
  element,
  callback
) {
  element.addEventListener(
    "dragenter",
    event => {
      event.preventDefault();

      element.classList.add(
        "drag-over"
      );
    }
  );

  element.addEventListener(
    "dragover",
    event => {
      event.preventDefault();

      event.dataTransfer.dropEffect =
        "copy";

      element.classList.add(
        "drag-over"
      );
    }
  );

  element.addEventListener(
    "dragleave",
    () => {
      element.classList.remove(
        "drag-over"
      );
    }
  );

  element.addEventListener(
    "drop",
    event => {
      event.preventDefault();

      element.classList.remove(
        "drag-over"
      );

      try {
        const raw =
          event.dataTransfer.getData(
            "text/plain"
          );

        const data =
          JSON.parse(raw);

        callback(data);
      } catch (error) {
        console.warn(
          "Could not process dropped item.",
          error
        );
      }
    }
  );
}


/* =========================================================
   6. HOME PAGE
   ========================================================= */

function setupHomePage() {
  const savedPanel =
    document.querySelector(
      "#saved-work-panel"
    );

  const newPanel =
    document.querySelector(
      "#new-student-panel"
    );

  const savedName =
    document.querySelector(
      "#saved-student-name"
    );

  const continueButton =
    document.querySelector(
      "#continue-lab"
    );

  const newButton =
    document.querySelector(
      "#new-lab"
    );

  const nameInput =
    document.querySelector(
      "#student-name"
    );

  const startButton =
    document.querySelector(
      "#start-lab"
    );

  const hasSavedStudent =
    Boolean(
      labData.studentName &&
      labData.studentName.trim()
    );

  if (hasSavedStudent) {
    if (savedPanel) {
      savedPanel.hidden = false;
    }

    if (newPanel) {
      newPanel.hidden = true;
    }

    if (savedName) {
      savedName.textContent =
        labData.studentName;
    }
  } else {
    if (savedPanel) {
      savedPanel.hidden = true;
    }

    if (newPanel) {
      newPanel.hidden = false;
    }
  }

  continueButton?.addEventListener(
    "click",
    () => {
      window.location.href =
        getNextIncompletePage();
    }
  );

  newButton?.addEventListener(
    "click",
    () => {
      const confirmed =
        window.confirm(
          "Start a new lab? This will erase the saved lab currently stored on this browser."
        );

      if (!confirmed) return;

      localStorage.removeItem(
        STORAGE_KEY
      );

      localStorage.removeItem(
        LEGACY_STORAGE_KEY
      );

      labData =
        cloneDefaultData();

      if (savedPanel) {
        savedPanel.hidden = true;
      }

      if (newPanel) {
        newPanel.hidden = false;
      }

      if (nameInput) {
        nameInput.value = "";
        nameInput.focus();
      }
    }
  );

  startButton?.addEventListener(
    "click",
    () => {
      const name =
        nameInput?.value.trim();

      if (!name) {
        window.alert(
          "Please enter your first and last name before beginning the lab."
        );

        nameInput?.focus();
        return;
      }

      labData =
        cloneDefaultData();

      labData.studentName =
        name;

      saveLabData();

      window.location.href =
        "stage1.html";
    }
  );

  nameInput?.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        startButton?.click();
      }
    }
  );
}


function getNextIncompletePage() {
  const completed =
    labData.completedStages;

  if (!completed.stage1) {
    return "stage1.html";
  }

  if (!completed.stage2) {
    return "stage2.html";
  }

  if (!completed.stage3) {
    return "stage3.html";
  }

  if (!completed.stage4) {
    return "stage4.html";
  }

  if (!completed.stage5) {
    return "stage5.html";
  }

  if (!completed.stage6) {
    return "stage6.html";
  }

  if (!completed.challenge) {
    return "challenge.html";
  }

  return "complete.html";
}


/* =========================================================
   7. STAGE 1
   ========================================================= */

function setupStage1() {
  const cards =
    document.querySelectorAll(
      ".molecule-card"
    );

  const sites =
    document.querySelectorAll(
      ".nucleotide-site"
    );

  const modelFeedback =
    document.querySelector(
      "#stage1-model-feedback"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage1-analysis-feedback"
    );

  const reveal =
    document.querySelector(
      "#stage1-model-reveal"
    );

  cards.forEach(card => {
    makeDraggable(
      card,
      {
        type: "stage1",
        piece:
          card.dataset.piece
      }
    );

    card.addEventListener(
      "click",
      () => {
        selectPiece(card);
      }
    );
  });

  sites.forEach(site => {
    setupDropTarget(
      site,
      data => {
        if (
          data.type !==
          "stage1"
        ) {
          return;
        }

        placeStage1Piece(
          site,
          data.piece
        );
      }
    );

    site.addEventListener(
      "click",
      () => {
        if (
          selectedPiece &&
          selectedPiece.classList.contains(
            "molecule-card"
          )
        ) {
          placeStage1Piece(
            site,
            selectedPiece.dataset.piece
          );

          clearSelectedPiece();
          return;
        }

        const key =
          site.dataset.site;

        if (
          labData.stage1.model[key]
        ) {
          labData.stage1.model[key] =
            "";

          labData.stage1.modelCorrect =
            false;

          saveLabData();
          renderStage1();
        }
      }
    );
  });

  renderStage1();

  document
    .querySelector(
      "#check-stage1-model"
    )
    ?.addEventListener(
      "click",
      () => {
        labData.stage1.attempts++;

        const model =
          labData.stage1.model;

        const correct =
          model.phosphate ===
            "phosphate" &&
          model.sugar ===
            "deoxyribose" &&
          model.base ===
            "dna-base";

        if (correct) {
          labData.stage1.modelCorrect =
            true;

          saveLabData();

          renderStage1();

          reveal?.classList.add(
            "visible"
          );

          showFeedback(
            modelFeedback,
            "success",
            `
              <strong>Model verified.</strong><br>
              You constructed a DNA nucleotide from a phosphate group,
              deoxyribose sugar and DNA nitrogenous base.
            `
          );
        } else {
          labData.stage1.modelCorrect =
            false;

          saveLabData();

          showFeedback(
            modelFeedback,
            "hint",
            getStage1Hint()
          );
        }
      }
    );

  document
    .querySelector(
      "#clear-stage1-model"
    )
    ?.addEventListener(
      "click",
      () => {
        labData.stage1.model = {
          phosphate: "",
          sugar: "",
          base: ""
        };

        labData.stage1.modelCorrect =
          false;

        saveLabData();

        renderStage1();

        reveal?.classList.remove(
          "visible"
        );

        clearFeedback(
          modelFeedback
        );
      }
    );

  document
    .querySelectorAll(
      'input[name="stage1-variable"]'
    )
    .forEach(option => {
      option.checked =
        option.value ===
        labData.stage1.variableComponent;

      option.addEventListener(
        "change",
        () => {
          labData.stage1.variableComponent =
            option.value;

          saveLabData();
        }
      );
    });

  document
    .querySelector(
      "#check-stage1-analysis"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage1.modelCorrect
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Validate your nucleotide model first."
          );

          return;
        }

        const explanation =
          document.querySelector(
            "#stage1-note"
          )?.value || "";

        if (
          labData.stage1.variableComponent !==
          "base"
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Which part of a DNA nucleotide can vary while the sugar and phosphate remain present?"
          );

          return;
        }

        if (
          !requireReasoning(
            explanation,
            40
          )
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Your choice is correct. Expand your explanation of how variation in bases allows DNA to store information."
          );

          return;
        }

        labData.stage1.analysisCorrect =
          true;

        labData.completedStages.stage1 =
          true;

        saveLabData();

        showFeedback(
          analysisFeedback,
          "success",
          `
            <strong>Stage 1 complete.</strong><br>
            Different sequences of nitrogenous bases allow DNA to carry different genetic information.
          `
        );

        unlockNext(
          "#stage1-next"
        );
      }
    );

  if (
    labData.stage1.modelCorrect
  ) {
    reveal?.classList.add(
      "visible"
    );
  }

  if (
    labData.completedStages.stage1
  ) {
    unlockNext(
      "#stage1-next"
    );
  }
}


function placeStage1Piece(
  site,
  piece
) {
  const key =
    site.dataset.site;

  labData.stage1.model[key] =
    piece;

  labData.stage1.modelCorrect =
    false;

  labData.completedStages.stage1 =
    false;

  saveLabData();

  renderStage1();

  lockNext(
    "#stage1-next"
  );
}


function renderStage1() {
  document
    .querySelectorAll(
      ".nucleotide-site"
    )
    .forEach(site => {
      const key =
        site.dataset.site;

      const piece =
        labData.stage1.model[key];

      site.classList.remove(
        "correct-site",
        "error-site"
      );

      if (!piece) {
        site.innerHTML =
          "<span>Connection site</span>";

        return;
      }

      const source =
        document.querySelector(
          `.molecule-card[data-piece="${piece}"]`
        );

      const svg =
        source?.querySelector(
          "svg"
        );

      if (svg) {
        site.innerHTML = "";

        site.appendChild(
          svg.cloneNode(true)
        );
      } else {
        site.textContent =
          piece;
      }

      if (
        labData.stage1.modelCorrect
      ) {
        site.classList.add(
          "correct-site"
        );
      }
    });
}


function getStage1Hint() {
  const attempt =
    labData.stage1.attempts;

  if (attempt === 1) {
    return "At least one selected molecular component is incorrect.";
  }

  if (attempt === 2) {
    return "Compare the sugars carefully. DNA contains deoxyribose rather than ribose.";
  }

  if (attempt === 3) {
    return "One nitrogenous base in the tray belongs to RNA rather than DNA.";
  }

  return "A DNA nucleotide requires phosphate, deoxyribose and a DNA nitrogenous base.";
}


/* =========================================================
   8. STAGE 2
   ========================================================= */

function setupStage2() {
  const structureFeedback =
    document.querySelector(
      "#stage2-structure-feedback"
    );

  const applicationFeedback =
    document.querySelector(
      "#stage2-application-feedback"
    );

  const calculationFeedback =
    document.querySelector(
      "#stage2-calculation-feedback"
    );

  const synthesisFeedback =
    document.querySelector(
      "#stage2-synthesis-feedback"
    );

  const summary =
    document.querySelector(
      "#stage2-summary"
    );

  const bases = [
    "adenine",
    "guanine",
    "cytosine",
    "thymine"
  ];

  bases.forEach(base => {
    const family =
      document.querySelector(
        `#stage2-${base}-family`
      );

    const rings =
      document.querySelector(
        `#stage2-${base}-rings`
      );

    if (family) {
      family.value =
        labData.stage2
          .families[base] || "";

      family.addEventListener(
        "change",
        () => {
          labData.stage2
            .families[base] =
            family.value;

          invalidateStage2(
            "structure"
          );
        }
      );
    }

    if (rings) {
      rings.value =
        labData.stage2
          .rings[base] || "";

      rings.addEventListener(
        "change",
        () => {
          labData.stage2
            .rings[base] =
            rings.value;

          invalidateStage2(
            "structure"
          );
        }
      );
    }
  });

  document
    .querySelector(
      "#check-stage2-structures"
    )
    ?.addEventListener(
      "click",
      () => {
        const f =
          labData.stage2.families;

        const r =
          labData.stage2.rings;

        const correct =
          f.adenine === "purine" &&
          f.guanine === "purine" &&
          f.cytosine === "pyrimidine" &&
          f.thymine === "pyrimidine" &&
          r.adenine === "2" &&
          r.guanine === "2" &&
          r.cytosine === "1" &&
          r.thymine === "1";

        labData.stage2.structureCorrect =
          correct;

        saveLabData();

        showFeedback(
          structureFeedback,
          correct
            ? "success"
            : "hint",
          correct
            ? `
                <strong>Structural analysis correct.</strong><br>
                Adenine and guanine are two-ring purines.
                Cytosine and thymine are one-ring pyrimidines.
              `
            : "At least one classification is incorrect. Compare the number of rings in each molecular structure."
        );
      }
    );

  document
    .querySelectorAll(
      'input[name="stage2-widest"]'
    )
    .forEach(option => {
      option.checked =
        option.value ===
        labData.stage2.widestPair;

      option.addEventListener(
        "change",
        () => {
          labData.stage2.widestPair =
            option.value;

          invalidateStage2(
            "application"
          );
        }
      );
    });

  document
    .querySelectorAll(
      'input[name="stage2-narrowest"]'
    )
    .forEach(option => {
      option.checked =
        option.value ===
        labData.stage2.narrowestPair;

      option.addEventListener(
        "change",
        () => {
          labData.stage2.narrowestPair =
            option.value;

          invalidateStage2(
            "application"
          );
        }
      );
    });

  document
    .querySelectorAll(
      ".stage2-normal-pair"
    )
    .forEach(box => {
      box.checked =
        labData.stage2.normalPairs
          .includes(box.value);

      box.addEventListener(
        "change",
        () => {
          labData.stage2.normalPairs =
            Array.from(
              document.querySelectorAll(
                ".stage2-normal-pair:checked"
              )
            )
              .map(
                item =>
                  item.value
              );

          invalidateStage2(
            "application"
          );
        }
      );
    });

  document
    .querySelector(
      "#check-stage2-application"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage2.structureCorrect
        ) {
          showFeedback(
            applicationFeedback,
            "hint",
            "Complete Part A correctly first."
          );

          return;
        }

        const selectedPairs =
          [
            ...labData.stage2.normalPairs
          ].sort();

        const correctPairs =
          ["AT", "GC"].sort();

        const correct =
          labData.stage2.widestPair ===
            "AG" &&
          labData.stage2.narrowestPair ===
            "CT" &&
          JSON.stringify(
            selectedPairs
          ) ===
            JSON.stringify(
              correctPairs
            );

        labData.stage2.applicationCorrect =
          correct;

        saveLabData();

        showFeedback(
          applicationFeedback,
          correct
            ? "success"
            : "hint",
          correct
            ? `
                <strong>Correct.</strong><br>
                Two purines would create a wider pairing, two pyrimidines a narrower pairing, and normal DNA pairs one purine with one pyrimidine.
              `
            : "Reconsider the size of purines versus pyrimidines and distinguish molecular width from normal complementary pairing."
        );
      }
    );

  const counts = {
    "#stage2-thymine-count":
      "thymineCount",
    "#stage2-guanine-count":
      "guanineCount",
    "#stage2-cytosine-count":
      "cytosineCount",
    "#stage2-purine-count":
      "purineCount"
  };

  Object.entries(counts)
    .forEach(
      ([selector, key]) => {
        const input =
          document.querySelector(
            selector
          );

        if (!input) return;

        input.value =
          labData.stage2[key] || "";

        input.addEventListener(
          "input",
          () => {
            labData.stage2[key] =
              input.value;

            invalidateStage2(
              "calculations"
            );
          }
        );
      }
    );

  document
    .querySelector(
      "#check-stage2-calculations"
    )
    ?.addEventListener(
      "click",
      () => {
        const correct =
          Number(
            labData.stage2.thymineCount
          ) === 72 &&
          Number(
            labData.stage2.guanineCount
          ) === 48 &&
          Number(
            labData.stage2.cytosineCount
          ) === 48 &&
          Number(
            labData.stage2.purineCount
          ) === 120;

        labData.stage2.calculationsCorrect =
          correct;

        saveLabData();

        showFeedback(
          calculationFeedback,
          correct
            ? "success"
            : "hint",
          correct
            ? `
                <strong>Correct.</strong><br>
                T = 72, G = 48, C = 48 and total purines = 120.
              `
            : "Apply Chargaff's rules first: A = T and G = C."
        );
      }
    );

  document
    .querySelector(
      "#check-stage2-synthesis"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage2.structureCorrect ||
          !labData.stage2.applicationCorrect ||
          !labData.stage2.calculationsCorrect
        ) {
          showFeedback(
            synthesisFeedback,
            "hint",
            "Complete Parts A, B and C correctly first."
          );

          return;
        }

        const answer =
          document.querySelector(
            "#stage2-note"
          )?.value || "";

        if (
          !requireReasoning(
            answer,
            70
          )
        ) {
          showFeedback(
            synthesisFeedback,
            "hint",
            "Expand your comparison of normal purine-pyrimidine pairing with a purine-purine or pyrimidine-pyrimidine pair."
          );

          return;
        }

        labData.stage2.synthesisCorrect =
          true;

        labData.completedStages.stage2 =
          true;

        saveLabData();

        summary?.classList.add(
          "visible"
        );

        showFeedback(
          synthesisFeedback,
          "success",
          `
            <strong>Stage 2 complete.</strong>
          `
        );

        unlockNext(
          "#stage2-next"
        );
      }
    );

  if (
    labData.stage2.synthesisCorrect
  ) {
    summary?.classList.add(
      "visible"
    );
  }

  if (
    labData.completedStages.stage2
  ) {
    unlockNext(
      "#stage2-next"
    );
  }
}


function invalidateStage2(level) {
  if (level === "structure") {
    labData.stage2.structureCorrect =
      false;

    labData.stage2.applicationCorrect =
      false;

    labData.stage2.synthesisCorrect =
      false;
  }

  if (level === "application") {
    labData.stage2.applicationCorrect =
      false;

    labData.stage2.synthesisCorrect =
      false;
  }

  if (level === "calculations") {
    labData.stage2.calculationsCorrect =
      false;

    labData.stage2.synthesisCorrect =
      false;
  }

  labData.completedStages.stage2 =
    false;

  saveLabData();

  lockNext(
    "#stage2-next"
  );
}


/* =========================================================
   9. STAGE 3
   ========================================================= */

function setupStage3() {
  ensureStage3Data();

  const targetBases = [
    "A",
    "T",
    "G",
    "C",
    "C",
    "A"
  ];

  const parts =
    document.querySelectorAll(
      ".stage3-part"
    );

  const slots =
    document.querySelectorAll(
      ".stage3-component-slot"
    );

  const buildFeedback =
    document.querySelector(
      "#stage3-build-feedback"
    );

  const bondFeedback =
    document.querySelector(
      "#stage3-bond-feedback"
    );

  const diagnosisFeedback =
    document.querySelector(
      "#stage3-diagnosis-feedback"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage3-analysis-feedback"
    );

  const bondTarget =
    document.querySelector(
      "#stage3-bond-target"
    );

  parts.forEach(part => {
    const data = {
      type: "stage3-component",
      component:
        part.dataset.partType,
      base:
        part.dataset.base || ""
    };

    makeDraggable(
      part,
      data
    );

    part.addEventListener(
      "click",
      () => {
        selectPiece(part);
      }
    );
  });

  slots.forEach(slot => {
    setupDropTarget(
      slot,
      data => {
        if (
          data.type !==
          "stage3-component"
        ) {
          return;
        }

        placeStage3Component(
          slot,
          data.component,
          data.base
        );
      }
    );

    slot.addEventListener(
      "click",
      () => {
        if (
          selectedPiece &&
          selectedPiece.classList.contains(
            "stage3-part"
          )
        ) {
          placeStage3Component(
            slot,
            selectedPiece.dataset.partType,
            selectedPiece.dataset.base || ""
          );

          clearSelectedPiece();
          return;
        }

        const position =
          Number(
            slot.dataset.position
          );

        const component =
          slot.dataset.component;

        if (
          labData.stage3
            .components[position]
            ?.[component]
        ) {
          labData.stage3
            .components[position]
            [component] = "";

          invalidateStage3FromBuild();

          saveLabData();

          renderStage3Build();
        }
      }
    );
  });

  renderStage3Build();

  document
    .querySelector(
      "#check-stage3-build"
    )
    ?.addEventListener(
      "click",
      () => {
        const complete =
          labData.stage3.components
            .every(
              component =>
                component.phosphate ===
                  "phosphate" &&
                component.sugar ===
                  "sugar" &&
                component.base
            );

        if (!complete) {
          labData.stage3.buildCorrect =
            false;

          saveLabData();

          showFeedback(
            buildFeedback,
            "hint",
            `
              <strong>Your strand is incomplete.</strong><br>
              Each nucleotide requires phosphate, deoxyribose and a nitrogenous base.
            `
          );

          return;
        }

        const incorrect = [];

        labData.stage3.components
          .forEach(
            (component, index) => {
              if (
                component.base !==
                targetBases[index]
              ) {
                incorrect.push(
                  index + 1
                );
              }
            }
          );

        if (incorrect.length) {
          labData.stage3.buildCorrect =
            false;

          saveLabData();

          showFeedback(
            buildFeedback,
            "hint",
            `
              The molecular components are present, but the required base sequence is incorrect at position${incorrect.length > 1 ? "s" : ""} ${incorrect.join(", ")}.
            `
          );

          return;
        }

        labData.stage3.buildCorrect =
          true;

        saveLabData();

        renderStage3Build();

        showFeedback(
          buildFeedback,
          "success",
          `
            <strong>Strand validated.</strong><br>
            You constructed 5′–A T G C C A–3′ from six DNA nucleotides.
          `
        );
      }
    );

  document
    .querySelector(
      "#clear-stage3-build"
    )
    ?.addEventListener(
      "click",
      () => {
        labData.stage3.components =
          createEmptyStage3Components();

        invalidateStage3FromBuild();

        clearSelectedPiece();

        saveLabData();

        renderStage3Build();

        clearFeedback(
          buildFeedback
        );
      }
    );

  if (
    labData.stage3.bondSelected
  ) {
    bondTarget?.classList.add(
      "selected-bond"
    );

    if (bondTarget) {
      bondTarget.textContent =
        "Bond selected ✓";
    }
  }

  bondTarget?.addEventListener(
    "click",
    () => {
      labData.stage3.bondSelected =
        !labData.stage3.bondSelected;

      labData.stage3.bondCorrect =
        false;

      labData.stage3.diagnosisCorrect =
        false;

      labData.stage3.analysisCorrect =
        false;

      labData.completedStages.stage3 =
        false;

      saveLabData();

      bondTarget.classList.toggle(
        "selected-bond",
        labData.stage3.bondSelected
      );

      bondTarget.textContent =
        labData.stage3.bondSelected
          ? "Bond selected ✓"
          : "Select bond";

      lockNext(
        "#stage3-next"
      );
    }
  );

  document
    .querySelectorAll(
      'input[name="stage3-bond-answer"]'
    )
    .forEach(option => {
      option.checked =
        option.value ===
        labData.stage3.bondAnswer;

      option.addEventListener(
        "change",
        () => {
          labData.stage3.bondAnswer =
            option.value;

          labData.stage3.bondCorrect =
            false;

          labData.stage3.diagnosisCorrect =
            false;

          labData.stage3.analysisCorrect =
            false;

          labData.completedStages.stage3 =
            false;

          saveLabData();

          lockNext(
            "#stage3-next"
          );
        }
      );
    });

  document
    .querySelector(
      "#check-stage3-bond"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage3.buildCorrect
        ) {
          showFeedback(
            bondFeedback,
            "hint",
            "Validate Part A first."
          );

          return;
        }

        if (
          !labData.stage3.bondSelected
        ) {
          showFeedback(
            bondFeedback,
            "hint",
            "Select the connection between the neighbouring nucleotides first."
          );

          return;
        }

        if (
          labData.stage3.bondAnswer !==
          "sugar-phosphate"
        ) {
          labData.stage3.bondCorrect =
            false;

          saveLabData();

          showFeedback(
            bondFeedback,
            "hint",
            "Phosphodiester bonds form part of the sugar-phosphate backbone, not the hydrogen bonds between complementary bases."
          );

          return;
        }

        labData.stage3.bondCorrect =
          true;

        saveLabData();

        showFeedback(
          bondFeedback,
          "success",
          `
            <strong>Correct.</strong><br>
            Adjacent DNA nucleotides are joined by covalent phosphodiester bonds in the sugar-phosphate backbone.
          `
        );
      }
    );

  document
    .querySelectorAll(
      ".stage3-model-select"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          labData.stage3.selectedModel =
            button.dataset.model || "";

          labData.stage3.diagnosisCorrect =
            false;

          labData.stage3.analysisCorrect =
            false;

          labData.completedStages.stage3 =
            false;

          saveLabData();

          renderStage3ModelSelection();

          lockNext(
            "#stage3-next"
          );
        }
      );
    });

  renderStage3ModelSelection();

  document
    .querySelector(
      "#check-stage3-diagnosis"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage3.bondCorrect
        ) {
          showFeedback(
            diagnosisFeedback,
            "hint",
            "Complete Part B first."
          );

          return;
        }

        if (
          labData.stage3.selectedModel !==
          "A"
        ) {
          showFeedback(
            diagnosisFeedback,
            "hint",
            "Re-examine which molecules form the repeating backbone and where the bases attach."
          );

          return;
        }

        const explanation =
          document.querySelector(
            "#stage3-diagnosis-note"
          )?.value || "";

        if (
          !requireReasoning(
            explanation,
            80
          )
        ) {
          showFeedback(
            diagnosisFeedback,
            "hint",
            "Model A is correct, but explain why and identify the structural problem in both incorrect models."
          );

          return;
        }

        labData.stage3.diagnosisCorrect =
          true;

        saveLabData();

        showFeedback(
          diagnosisFeedback,
          "success",
          `
            <strong>Model diagnosis accepted.</strong><br>
            Model A shows an alternating sugar-phosphate backbone with the bases attached to deoxyribose sugars.
          `
        );
      }
    );

  document
    .querySelector(
      "#check-stage3-analysis"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage3.buildCorrect ||
          !labData.stage3.bondCorrect ||
          !labData.stage3.diagnosisCorrect
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Complete Parts A, B and C correctly first."
          );

          return;
        }

        const explanation =
          document.querySelector(
            "#stage3-note"
          )?.value || "";

        if (
          !requireReasoning(
            explanation,
            70
          )
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Explain both what changes when the base sequence changes and what remains unchanged."
          );

          return;
        }

        labData.stage3.analysisCorrect =
          true;

        labData.completedStages.stage3 =
          true;

        saveLabData();

        showFeedback(
          analysisFeedback,
          "success",
          `
            <strong>Stage 3 complete.</strong><br>
            The base sequence can change while the repeating sugar-phosphate backbone remains structurally consistent.
          `
        );

        unlockNext(
          "#stage3-next"
        );
      }
    );

  if (
    labData.completedStages.stage3
  ) {
    unlockNext(
      "#stage3-next"
    );
  }
}


function createEmptyStage3Components() {
  return Array.from(
    { length: 6 },
    () => ({
      phosphate: "",
      sugar: "",
      base: ""
    })
  );
}


function ensureStage3Data() {
  if (
    !Array.isArray(
      labData.stage3.components
    ) ||
    labData.stage3.components.length !==
      6
  ) {
    labData.stage3.components =
      createEmptyStage3Components();
  }

  labData.stage3.components =
    labData.stage3.components.map(
      item => ({
        phosphate:
          item?.phosphate || "",
        sugar:
          item?.sugar || "",
        base:
          item?.base || ""
      })
    );
}


function placeStage3Component(
  slot,
  componentType,
  base
) {
  const position =
    Number(
      slot.dataset.position
    );

  const required =
    slot.dataset.component;

  if (
    !Number.isInteger(position) ||
    position < 0 ||
    position > 5
  ) {
    return;
  }

  if (
    componentType !==
    required
  ) {
    showFeedback(
      document.querySelector(
        "#stage3-build-feedback"
      ),
      "hint",
      "That molecular part does not belong in this position within the nucleotide."
    );

    slot.classList.add(
      "error-site"
    );

    setTimeout(
      () => {
        slot.classList.remove(
          "error-site"
        );
      },
      600
    );

    return;
  }

  if (
    required ===
    "phosphate"
  ) {
    labData.stage3
      .components[position]
      .phosphate =
      "phosphate";
  }

  if (
    required ===
    "sugar"
  ) {
    labData.stage3
      .components[position]
      .sugar =
      "sugar";
  }

  if (
    required ===
    "base"
  ) {
    const value =
      String(base || "")
        .toUpperCase();

    if (
      ![
        "A",
        "T",
        "G",
        "C"
      ].includes(value)
    ) {
      return;
    }

    labData.stage3
      .components[position]
      .base =
      value;
  }

  invalidateStage3FromBuild();

  saveLabData();

  renderStage3Build();

  clearFeedback(
    document.querySelector(
      "#stage3-build-feedback"
    )
  );
}


function invalidateStage3FromBuild() {
  labData.stage3.buildCorrect =
    false;

  labData.stage3.bondCorrect =
    false;

  labData.stage3.diagnosisCorrect =
    false;

  labData.stage3.analysisCorrect =
    false;

  labData.completedStages.stage3 =
    false;

  lockNext(
    "#stage3-next"
  );
}


function renderStage3Build() {
  document
    .querySelectorAll(
      ".stage3-component-slot"
    )
    .forEach(slot => {
      const position =
        Number(
          slot.dataset.position
        );

      const component =
        slot.dataset.component;

      const value =
        labData.stage3
          .components[position]
          ?.[component] || "";

      slot.classList.remove(
        "filled-component",
        "filled-phosphate",
        "filled-sugar",
        "filled-base",
        "correct-site",
        "base-a",
        "base-t",
        "base-g",
        "base-c"
      );

      if (!value) {
        slot.textContent =
          component === "phosphate"
            ? "P?"
            : component === "sugar"
              ? "D?"
              : "Base?";

        return;
      }

      slot.classList.add(
        "filled-component"
      );

      if (
        component ===
        "phosphate"
      ) {
        slot.textContent = "P";

        slot.classList.add(
          "filled-phosphate"
        );
      }

      if (
        component ===
        "sugar"
      ) {
        slot.textContent = "D";

        slot.classList.add(
          "filled-sugar"
        );
      }

      if (
        component ===
        "base"
      ) {
        slot.textContent =
          value;

        slot.classList.add(
          "filled-base",
          `base-${value.toLowerCase()}`
        );
      }

      if (
        labData.stage3.buildCorrect
      ) {
        slot.classList.add(
          "correct-site"
        );
      }
    });
}


function renderStage3ModelSelection() {
  document
    .querySelectorAll(
      ".stage3-model-card"
    )
    .forEach(card => {
      card.classList.toggle(
        "selected-model",
        card.dataset.model ===
          labData.stage3.selectedModel
      );
    });

  document
    .querySelectorAll(
      ".stage3-model-select"
    )
    .forEach(button => {
      const selected =
        button.dataset.model ===
        labData.stage3.selectedModel;

      button.textContent =
        selected
          ? `Model ${button.dataset.model} selected ✓`
          : `Select Model ${button.dataset.model}`;
    });
}


/* =========================================================
   10. STAGE 4
   ========================================================= */

function setupStage4() {
  const bank =
    document.querySelectorAll(
      ".base-bank-button"
    );

  const positions =
    document.querySelectorAll(
      ".complement-position"
    );

  const feedback =
    document.querySelector(
      "#stage4-feedback"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage4-analysis-feedback"
    );

  const correctSequence = [
    "T",
    "A",
    "C",
    "G",
    "G",
    "T"
  ];

  bank.forEach(button => {
    makeDraggable(
      button,
      {
        type: "dna-base",
        base:
          button.dataset.base
      }
    );

    button.addEventListener(
      "click",
      () => {
        selectPiece(button);
      }
    );
  });

  positions.forEach(position => {
    setupDropTarget(
      position,
      data => {
        if (
          data.type !==
          "dna-base"
        ) {
          return;
        }

        placeStage4Base(
          position,
          data.base
        );
      }
    );

    position.addEventListener(
      "click",
      () => {
        if (
          selectedPiece &&
          selectedPiece.classList.contains(
            "base-bank-button"
          )
        ) {
          placeStage4Base(
            position,
            selectedPiece.dataset.base
          );

          clearSelectedPiece();
          return;
        }

        const index =
          Number(
            position.dataset.position
          );

        labData.stage4
          .sequence[index] = "";

        labData.stage4
          .complementCorrect =
          false;

        labData.completedStages.stage4 =
          false;

        saveLabData();

        renderStage4();

        lockNext(
          "#stage4-next"
        );
      }
    );
  });

  const inputMap = {
    "#stage4-at-pairs":
      "atPairs",
    "#stage4-gc-pairs":
      "gcPairs",
    "#stage4-hydrogen-bonds":
      "hydrogenBonds"
  };

  Object.entries(inputMap)
    .forEach(
      ([selector, key]) => {
        const input =
          document.querySelector(
            selector
          );

        if (!input) return;

        input.value =
          labData.stage4[key] || "";

        input.addEventListener(
          "input",
          () => {
            labData.stage4[key] =
              input.value;

            labData.stage4
              .analysisCorrect =
              false;

            labData.completedStages.stage4 =
              false;

            saveLabData();

            lockNext(
              "#stage4-next"
            );
          }
        );
      }
    );

  renderStage4();

  document
    .querySelector(
      "#check-stage4-complement"
    )
    ?.addEventListener(
      "click",
      () => {
        const correct =
          correctSequence.every(
            (base, index) =>
              labData.stage4
                .sequence[index] ===
              base
          );

        labData.stage4.complementCorrect =
          correct;

        saveLabData();

        showFeedback(
          feedback,
          correct
            ? "success"
            : "hint",
          correct
            ? "<strong>Complementary strand validated.</strong>"
            : "At least one complementary base is incorrect."
        );
      }
    );

  document
    .querySelector(
      "#check-stage4-analysis"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage4.complementCorrect
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Validate the complementary strand first."
          );

          return;
        }

        const calculationsCorrect =
          Number(
            labData.stage4.atPairs
          ) === 3 &&
          Number(
            labData.stage4.gcPairs
          ) === 3 &&
          Number(
            labData.stage4.hydrogenBonds
          ) === 15;

        if (
          !calculationsCorrect
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Recheck the number of A-T pairs, G-C pairs and total hydrogen bonds."
          );

          return;
        }

        const explanation =
          document.querySelector(
            "#stage4-note"
          )?.value || "";

        if (
          !requireReasoning(
            explanation,
            45
          )
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Expand your explanation."
          );

          return;
        }

        labData.stage4.analysisCorrect =
          true;

        labData.completedStages.stage4 =
          true;

        saveLabData();

        showFeedback(
          analysisFeedback,
          "success",
          "<strong>Stage 4 complete.</strong>"
        );

        unlockNext(
          "#stage4-next"
        );
      }
    );

  if (
    labData.completedStages.stage4
  ) {
    unlockNext(
      "#stage4-next"
    );
  }
}


function placeStage4Base(
  element,
  base
) {
  const position =
    Number(
      element.dataset.position
    );

  labData.stage4
    .sequence[position] =
    String(base).toUpperCase();

  labData.stage4.complementCorrect =
    false;

  labData.stage4.analysisCorrect =
    false;

  labData.completedStages.stage4 =
    false;

  saveLabData();

  renderStage4();

  lockNext(
    "#stage4-next"
  );
}


function renderStage4() {
  const template = [
    "A",
    "T",
    "G",
    "C",
    "C",
    "A"
  ];

  const complement = {
    A: "T",
    T: "A",
    G: "C",
    C: "G"
  };

  document
    .querySelectorAll(
      ".complement-position"
    )
    .forEach(element => {
      const position =
        Number(
          element.dataset.position
        );

      const base =
        labData.stage4
          .sequence[position];

      if (!base) {
        element.className =
          "complement-position";

        element.textContent = "?";

        return;
      }

      element.className =
        `complement-position dna-base base-${base.toLowerCase()}`;

      element.textContent =
        base;
    });

  document
    .querySelectorAll(
      ".hydrogen-bond-zone"
    )
    .forEach(element => {
      const position =
        Number(
          element.dataset.position
        );

      const top =
        template[position];

      const bottom =
        labData.stage4
          .sequence[position];

      const correct =
        bottom ===
        complement[top];

      element.classList.toggle(
        "connected",
        correct
      );

      element.textContent =
        correct
          ? (
              top === "G" ||
              top === "C"
            )
            ? "···"
            : "··"
          : "";
    });
}


/* =========================================================
   11. STAGE 5
   ========================================================= */

function setupStage5() {
  const baseBank =
    document.querySelectorAll(
      ".base-bank-button"
    );

  const diagnosticBases =
    document.querySelectorAll(
      ".diagnostic-base"
    );

  const feedback =
    document.querySelector(
      "#stage5-feedback"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage5-analysis-feedback"
    );

  baseBank.forEach(button => {
    makeDraggable(
      button,
      {
        type: "stage5-base",
        base:
          button.dataset.base
      }
    );

    button.addEventListener(
      "click",
      () => {
        selectPiece(button);
      }
    );
  });

  diagnosticBases.forEach(button => {
    setupDropTarget(
      button,
      data => {
        if (
          data.type !==
          "stage5-base"
        ) {
          return;
        }

        const position =
          Number(
            button.dataset.position
          );

        labData.stage5
          .sequence[position] =
          data.base;

        invalidateStage5();

        renderStage5();
      }
    );

    button.addEventListener(
      "click",
      () => {
        if (
          selectedPiece &&
          selectedPiece.classList.contains(
            "base-bank-button"
          )
        ) {
          const position =
            Number(
              button.dataset.position
            );

          labData.stage5
            .sequence[position] =
            selectedPiece.dataset.base;

          clearSelectedPiece();

          invalidateStage5();

          renderStage5();
        }
      }
    );
  });

  const directionMap = {
    topLeft:
      "#stage5-top-left",
    topRight:
      "#stage5-top-right",
    bottomLeft:
      "#stage5-bottom-left",
    bottomRight:
      "#stage5-bottom-right"
  };

  Object.entries(
    directionMap
  ).forEach(
    ([key, selector]) => {
      document
        .querySelector(
          selector
        )
        ?.addEventListener(
          "click",
          () => {
            labData.stage5[key] =
              labData.stage5[key] ===
              "5"
                ? "3"
                : "5";

            invalidateStage5();

            renderStage5();
          }
        );
    }
  );

  document
    .querySelectorAll(
      ".diagnostic-bonds span"
    )
    .forEach(
      (bond, index) => {
        bond.addEventListener(
          "click",
          () => {
            labData.stage5
              .bondCounts[index] =
              labData.stage5
                .bondCounts[index] ===
                2
                ? 3
                : 2;

            invalidateStage5();

            renderStage5();
          }
        );
      }
    );

  renderStage5();

  document
    .querySelector(
      "#check-stage5-repair"
    )
    ?.addEventListener(
      "click",
      () => {
        const correctSequence = [
          "T",
          "A",
          "C",
          "G",
          "G",
          "T"
        ];

        const correctBonds = [
          2,
          2,
          3,
          3,
          3,
          2
        ];

        const directionsCorrect =
          labData.stage5.topLeft ===
            "5" &&
          labData.stage5.topRight ===
            "3" &&
          labData.stage5.bottomLeft ===
            "3" &&
          labData.stage5.bottomRight ===
            "5";

        const sequenceCorrect =
          correctSequence.every(
            (base, index) =>
              labData.stage5
                .sequence[index] ===
              base
          );

        const bondsCorrect =
          correctBonds.every(
            (count, index) =>
              labData.stage5
                .bondCounts[index] ===
              count
          );

        const correct =
          directionsCorrect &&
          sequenceCorrect &&
          bondsCorrect;

        labData.stage5.repairsCorrect =
          correct;

        saveLabData();

        if (correct) {
          showFeedback(
            feedback,
            "success",
            "<strong>Repairs validated.</strong>"
          );
        } else {
          const hints = [];

          if (!directionsCorrect) {
            hints.push(
              "Check the antiparallel strand directions."
            );
          }

          if (!sequenceCorrect) {
            hints.push(
              "Check the complementary base sequence."
            );
          }

          if (!bondsCorrect) {
            hints.push(
              "Check hydrogen bond numbers."
            );
          }

          showFeedback(
            feedback,
            "hint",
            hints.join("<br>")
          );
        }
      }
    );

  document
    .querySelector(
      "#check-stage5-analysis"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !labData.stage5.repairsCorrect
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Repair the model first."
          );

          return;
        }

        const explanation =
          document.querySelector(
            "#stage5-note"
          )?.value || "";

        if (
          !requireReasoning(
            explanation,
            80
          )
        ) {
          showFeedback(
            analysisFeedback,
            "hint",
            "Expand your explanation and identify at least two structural errors."
          );

          return;
        }

        labData.stage5.analysisCorrect =
          true;

        labData.completedStages.stage5 =
          true;

        saveLabData();

        showFeedback(
          analysisFeedback,
          "success",
          "<strong>Stage 5 complete.</strong>"
        );

        unlockNext(
          "#stage5-next"
        );
      }
    );

  if (
    labData.completedStages.stage5
  ) {
    unlockNext(
      "#stage5-next"
    );
  }
}


function invalidateStage5() {
  labData.stage5.repairsCorrect =
    false;

  labData.stage5.analysisCorrect =
    false;

  labData.completedStages.stage5 =
    false;

  saveLabData();

  lockNext(
    "#stage5-next"
  );
}


function renderStage5() {
  const directionMap = {
    topLeft:
      "#stage5-top-left",
    topRight:
      "#stage5-top-right",
    bottomLeft:
      "#stage5-bottom-left",
    bottomRight:
      "#stage5-bottom-right"
  };

  Object.entries(
    directionMap
  ).forEach(
    ([key, selector]) => {
      const element =
        document.querySelector(
          selector
        );

      if (element) {
        element.textContent =
          `${labData.stage5[key]}′`;
      }
    }
  );

  document
    .querySelectorAll(
      ".diagnostic-base"
    )
    .forEach(button => {
      const position =
        Number(
          button.dataset.position
        );

      const base =
        labData.stage5
          .sequence[position];

      if (!base) return;

      button.className =
        `diagnostic-base base-${base.toLowerCase()}`;

      button.textContent =
        base;
    });

  document
    .querySelectorAll(
      ".diagnostic-bonds span"
    )
    .forEach(
      (element, index) => {
        element.textContent =
          labData.stage5
            .bondCounts[index] ===
            3
            ? "···"
            : "··";
      }
    );
}


/* =========================================================
   12. STAGE 6
   ========================================================= */

function setupStage6() {
  const models =
    document.querySelectorAll(
      ".candidate-model"
    );

  const buttons =
    document.querySelectorAll(
      ".model-select-button"
    );

  const evidence =
    document.querySelectorAll(
      ".stage6-evidence"
    );

  const feedback =
    document.querySelector(
      "#stage6-feedback"
    );

  buttons.forEach(button => {
    button.addEventListener(
      "click",
      () => {
        labData.stage6.selectedModel =
          button.dataset.model;

        labData.stage6.analysisCorrect =
          false;

        labData.completedStages.stage6 =
          false;

        saveLabData();

        models.forEach(model => {
          model.classList.toggle(
            "selected-model",
            model.dataset.model ===
              labData.stage6.selectedModel
          );
        });

        lockNext(
          "#stage6-next"
        );
      }
    );
  });

  evidence.forEach(box => {
    box.checked =
      labData.stage6.evidence
        .includes(box.value);

    box.addEventListener(
      "change",
      () => {
        labData.stage6.evidence =
          Array.from(
            document.querySelectorAll(
              ".stage6-evidence:checked"
            )
          ).map(
            item =>
              item.value
          );

        labData.stage6.analysisCorrect =
          false;

        labData.completedStages.stage6 =
          false;

        saveLabData();

        lockNext(
          "#stage6-next"
        );
      }
    );
  });

  if (
    labData.stage6.selectedModel
  ) {
    models.forEach(model => {
      model.classList.toggle(
        "selected-model",
        model.dataset.model ===
          labData.stage6.selectedModel
      );
    });
  }

  document
    .querySelector(
      "#check-stage6-investigation"
    )
    ?.addEventListener(
      "click",
      () => {
        const explanation =
          document.querySelector(
            "#stage6-note"
          )?.value || "";

        if (
          labData.stage6.selectedModel !==
          "A"
        ) {
          showFeedback(
            feedback,
            "hint",
            "Re-evaluate the models. Your selected structure contains an error."
          );

          return;
        }

        const required = [
          "complementary",
          "antiparallel",
          "hydrogen"
        ];

        const evidenceCorrect =
          required.every(
            item =>
              labData.stage6.evidence
                .includes(item)
          );

        if (!evidenceCorrect) {
          showFeedback(
            feedback,
            "hint",
            "Your structural evidence is incomplete."
          );

          return;
        }

        if (
          !requireReasoning(
            explanation,
            120
          )
        ) {
          showFeedback(
            feedback,
            "hint",
            "Expand your written evaluation using structural evidence."
          );

          return;
        }

        labData.stage6.analysisCorrect =
          true;

        labData.completedStages.stage6 =
          true;

        saveLabData();

        showFeedback(
          feedback,
          "success",
          "<strong>Stage 6 complete.</strong>"
        );

        unlockNext(
          "#stage6-next"
        );
      }
    );

  if (
    labData.completedStages.stage6
  ) {
    unlockNext(
      "#stage6-next"
    );
  }
}


/* =========================================================
   13. FINAL CHALLENGE
   ========================================================= */

function setupChallenge() {
  const bank =
    document.querySelectorAll(
      ".base-bank-button"
    );

  const slots =
    document.querySelectorAll(
      ".final-base-slot"
    );

  const feedback =
    document.querySelector(
      "#final-feedback"
    );

  const completedHelix =
    document.querySelector(
      "#completed-double-helix"
    );

  bank.forEach(button => {
    makeDraggable(
      button,
      {
        type: "challenge-base",
        base:
          button.dataset.base
      }
    );

    button.addEventListener(
      "click",
      () => {
        selectPiece(button);
      }
    );
  });

  slots.forEach(slot => {
    setupDropTarget(
      slot,
      data => {
        if (
          data.type !==
          "challenge-base"
        ) {
          return;
        }

        placeChallengeBase(
          slot,
          data.base
        );
      }
    );

    slot.addEventListener(
      "click",
      () => {
        if (
          selectedPiece &&
          selectedPiece.classList.contains(
            "base-bank-button"
          )
        ) {
          placeChallengeBase(
            slot,
            selectedPiece.dataset.base
          );

          clearSelectedPiece();
          return;
        }

        const position =
          Number(
            slot.dataset.position
          );

        labData.challenge
          .sequence[position] = "";

        invalidateChallenge();

        renderChallenge();
      }
    );
  });

  document
    .querySelector(
      "#final-left-direction"
    )
    ?.addEventListener(
      "click",
      () => {
        labData.challenge.leftDirection =
          cycleDirection(
            labData.challenge.leftDirection
          );

        invalidateChallenge();

        renderChallenge();
      }
    );

  document
    .querySelector(
      "#final-right-direction"
    )
    ?.addEventListener(
      "click",
      () => {
        labData.challenge.rightDirection =
          cycleDirection(
            labData.challenge.rightDirection
          );

        invalidateChallenge();

        renderChallenge();
      }
    );

  const calculationMap = {
    "#final-at":
      "atPairs",
    "#final-gc":
      "gcPairs",
    "#final-hydrogen":
      "hydrogenBonds",
    "#final-purines":
      "purines"
  };

  Object.entries(
    calculationMap
  ).forEach(
    ([selector, key]) => {
      const input =
        document.querySelector(
          selector
        );

      if (!input) return;

      input.value =
        labData.challenge[key] || "";

      input.addEventListener(
        "input",
        () => {
          labData.challenge[key] =
            input.value;

          invalidateChallenge(
            false
          );
        }
      );
    }
  );

  renderChallenge();

  document
    .querySelector(
      "#submit-final-challenge"
    )
    ?.addEventListener(
      "click",
      () => {
        const correctSequence = [
          "C",
          "G",
          "T",
          "A",
          "A",
          "C",
          "G",
          "G"
        ];

        const sequenceCorrect =
          correctSequence.every(
            (base, index) =>
              labData.challenge
                .sequence[index] ===
              base
          );

        const directionsCorrect =
          labData.challenge.leftDirection ===
            "3" &&
          labData.challenge.rightDirection ===
            "5";

        const calculationsCorrect =
          Number(
            labData.challenge.atPairs
          ) === 3 &&
          Number(
            labData.challenge.gcPairs
          ) === 5 &&
          Number(
            labData.challenge.hydrogenBonds
          ) === 21 &&
          Number(
            labData.challenge.purines
          ) === 3;

        const explanation =
          document.querySelector(
            "#final-note"
          )?.value || "";

        const problems = [];

        if (!sequenceCorrect) {
          problems.push(
            "Check the complementary strand."
          );
        }

        if (!directionsCorrect) {
          problems.push(
            "Check the antiparallel 5′ and 3′ directions."
          );
        }

        if (!calculationsCorrect) {
          problems.push(
            "Check the structural calculations."
          );
        }

        if (
          !requireReasoning(
            explanation,
            160
          )
        ) {
          problems.push(
            "Expand the final model defence."
          );
        }

        if (
          problems.length
        ) {
          showFeedback(
            feedback,
            "hint",
            `
              <strong>The model is not yet fully validated.</strong><br>
              ${problems.join("<br>")}
            `
          );

          return;
        }

        labData.challenge.analysisCorrect =
          true;

        labData.completedStages.challenge =
          true;

        saveLabData();

        completedHelix?.classList.add(
          "visible"
        );

        showFeedback(
          feedback,
          "success",
          `
            <strong>DNA molecule validated.</strong><br>
            Your complete double helix has been unlocked.
          `
        );

        unlockNext(
          "#final-next"
        );

        setTimeout(
          () => {
            completedHelix?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          },
          300
        );
      }
    );

  if (
    labData.completedStages.challenge
  ) {
    completedHelix?.classList.add(
      "visible"
    );

    unlockNext(
      "#final-next"
    );
  }
}


function cycleDirection(current) {
  if (!current) {
    return "3";
  }

  if (current === "3") {
    return "5";
  }

  return "";
}


function placeChallengeBase(
  slot,
  base
) {
  const position =
    Number(
      slot.dataset.position
    );

  labData.challenge
    .sequence[position] =
    String(base).toUpperCase();

  invalidateChallenge();

  renderChallenge();
}


function invalidateChallenge(
  save = true
) {
  labData.challenge.analysisCorrect =
    false;

  labData.completedStages.challenge =
    false;

  if (save) {
    saveLabData();
  } else {
    saveLabData();
  }

  lockNext(
    "#final-next"
  );
}


function renderChallenge() {
  const template = [
    "G",
    "C",
    "A",
    "T",
    "T",
    "G",
    "C",
    "C"
  ];

  const complement = {
    A: "T",
    T: "A",
    C: "G",
    G: "C"
  };

  document
    .querySelectorAll(
      ".final-base-slot"
    )
    .forEach(slot => {
      const position =
        Number(
          slot.dataset.position
        );

      const base =
        labData.challenge
          .sequence[position];

      if (!base) {
        slot.className =
          "final-base-slot";

        slot.textContent = "?";

        return;
      }

      slot.className =
        `final-base-slot dna-base base-${base.toLowerCase()}`;

      slot.textContent =
        base;
    });

  document
    .querySelectorAll(
      ".final-bond-row > div"
    )
    .forEach(
      (bond, position) => {
        const top =
          template[position];

        const bottom =
          labData.challenge
            .sequence[position];

        const correct =
          bottom ===
          complement[top];

        bond.textContent =
          correct
            ? (
                top === "G" ||
                top === "C"
              )
              ? "···"
              : "··"
            : "";
      }
    );

  const left =
    document.querySelector(
      "#final-left-direction"
    );

  const right =
    document.querySelector(
      "#final-right-direction"
    );

  if (left) {
    left.textContent =
      labData.challenge.leftDirection
        ? `${labData.challenge.leftDirection}′`
        : "?";
  }

  if (right) {
    right.textContent =
      labData.challenge.rightDirection
        ? `${labData.challenge.rightDirection}′`
        : "?";
  }
}


/* =========================================================
   14. COMPLETION PAGE
   ========================================================= */

function setupCompletionPage() {
  const student =
    document.querySelector(
      "#completion-student"
    );

  const sequence =
    document.querySelector(
      "#final-sequence-display"
    );

  const notebook =
    document.querySelector(
      "#notebook-output"
    );

  if (student) {
    student.textContent =
      labData.studentName
        ? `${labData.studentName}, you completed the Biology 30 Virtual DNA Construction Lab.`
        : "Biology 30 Virtual DNA Construction Lab completed.";
  }

  if (sequence) {
    sequence.innerHTML = `
      <div>
        5′ — G C A T T G C C — 3′
      </div>

      <div>
        3′ — ${labData.challenge.sequence.join(" ")} — 5′
      </div>
    `;
  }

  if (notebook) {
    notebook.innerHTML =
      buildNotebookHTML();
  }

  document
    .querySelector(
      "#download-report"
    )
    ?.addEventListener(
      "click",
      downloadLabReport
    );

  document
    .querySelector(
      "#print-report"
    )
    ?.addEventListener(
      "click",
      () => {
        window.print();
      }
    );

  document
    .querySelector(
      "#start-over"
    )
    ?.addEventListener(
      "click",
      startLabAgain
    );
}


function buildNotebookHTML() {
  const responses = [
    [
      "Stage 1 — Nucleotide Structure",
      labData.notebook.stage1Note
    ],

    [
      "Stage 2 — Nitrogenous Bases",
      labData.notebook.stage2Note
    ],

    [
      "Stage 3 — Model Diagnosis",
      labData.notebook.stage3DiagnosisNote
    ],

    [
      "Stage 3 — DNA Strand",
      labData.notebook.stage3Note
    ],

    [
      "Stage 4 — Complementary DNA",
      labData.notebook.stage4Note
    ],

    [
      "Stage 5 — Error Analysis",
      labData.notebook.stage5Note
    ],

    [
      "Stage 6 — Structural Investigation",
      labData.notebook.stage6Note
    ],

    [
      "Final Challenge — Model Defence",
      labData.notebook.finalNote
    ]
  ];

  return responses
    .map(
      ([title, response]) => `
        <div class="record-item">
          <strong>
            ${escapeHTML(title)}
          </strong>

          <p>
            ${escapeHTML(
              response ||
              "No response recorded."
            )}
          </p>
        </div>
      `
    )
    .join("");
}


/* =========================================================
   15. DOWNLOAD REPORT
   ========================================================= */

function downloadLabReport() {
  const date =
    new Date()
      .toLocaleDateString();

  const report = `
BIOLOGY 30
VIRTUAL DNA CONSTRUCTION LAB

Student:
${labData.studentName || "Not recorded"}

Date:
${date}


==================================================
LAB COMPLETION
==================================================

Stage 1:
${completionText(labData.completedStages.stage1)}

Stage 2:
${completionText(labData.completedStages.stage2)}

Stage 3:
${completionText(labData.completedStages.stage3)}

Stage 4:
${completionText(labData.completedStages.stage4)}

Stage 5:
${completionText(labData.completedStages.stage5)}

Stage 6:
${completionText(labData.completedStages.stage6)}

Final Challenge:
${completionText(labData.completedStages.challenge)}


==================================================
FINAL DNA MOLECULE
==================================================

5′ — G C A T T G C C — 3′

3′ — ${labData.challenge.sequence.join(" ")} — 5′


A–T pairs:
${labData.challenge.atPairs || "Not recorded"}

G–C pairs:
${labData.challenge.gcPairs || "Not recorded"}

Hydrogen bonds:
${labData.challenge.hydrogenBonds || "Not recorded"}

Purines:
${labData.challenge.purines || "Not recorded"}


==================================================
STUDENT RESPONSES
==================================================

STAGE 1
${labData.notebook.stage1Note || "No response recorded."}


STAGE 2
${labData.notebook.stage2Note || "No response recorded."}


STAGE 3 — MODEL DIAGNOSIS
${labData.notebook.stage3DiagnosisNote || "No response recorded."}


STAGE 3 — TRANSFER
${labData.notebook.stage3Note || "No response recorded."}


STAGE 4
${labData.notebook.stage4Note || "No response recorded."}


STAGE 5
${labData.notebook.stage5Note || "No response recorded."}


STAGE 6
${labData.notebook.stage6Note || "No response recorded."}


FINAL CHALLENGE
${labData.notebook.finalNote || "No response recorded."}


==================================================
END OF LAB RECORD
==================================================
`.trim();

  const blob =
    new Blob(
      [report],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  const safeName =
    (
      labData.studentName ||
      "student"
    )
      .trim()
      .replace(
        /\s+/g,
        "_"
      )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      );

  link.href = url;

  link.download =
    `${safeName}_DNA_Lab_Record.txt`;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(
    url
  );
}


/* =========================================================
   16. START OVER
   ========================================================= */

function startLabAgain() {
  const confirmed =
    window.confirm(
      "Start a new lab? This will permanently erase the saved work currently stored on this browser."
    );

  if (!confirmed) return;

  localStorage.removeItem(
    STORAGE_KEY
  );

  localStorage.removeItem(
    LEGACY_STORAGE_KEY
  );

  labData =
    cloneDefaultData();

  window.location.href =
    "index.html";
}


function completionText(
  completed
) {
  return completed
    ? "Completed ✓"
    : "Not completed";
}


function escapeHTML(text) {
  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    String(text);

  return div.innerHTML;
}
