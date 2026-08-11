/* =========================================================
   BIOLOGY 30 — VIRTUAL DNA CONSTRUCTION LAB
   CLEAN FINAL SCRIPT.JS
   ========================================================= */


/* =========================================================
   1. STORAGE
   ========================================================= */

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


  /* ---------- STAGE 1 ---------- */

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


  /* ---------- STAGE 2 ---------- */

  stage2: {

    assignments: {
      adenine: "",
      guanine: "",
      cytosine: "",
      thymine: ""
    },

    groupingCorrect: false,
    pattern: "",
    analysisCorrect: false
  },


  /* ---------- STAGE 3 ---------- */

  stage3: {

    sequence: ["", "", "", "", "", ""],

    strandCorrect: false,
    backboneAnswer: "",
    analysisCorrect: false
  },


  /* ---------- STAGE 4 ---------- */

  stage4: {

    sequence: ["", "", "", "", "", ""],

    complementCorrect: false,

    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",

    analysisCorrect: false
  },


  /* ---------- STAGE 5 ---------- */

  stage5: {

    topLeft: "5",
    topRight: "3",

    bottomLeft: "5",
    bottomRight: "3",

    sequence: ["T", "A", "C", "G", "T", "T"],

    bondCounts: [2, 2, 3, 3, 2, 2],

    repairsCorrect: false,
    analysisCorrect: false
  },


  /* ---------- STAGE 6 ---------- */

  stage6: {

    selectedModel: "",

    evidence: [],

    analysisCorrect: false
  },


  /* ---------- FINAL CHALLENGE ---------- */

  challenge: {

    sequence: [
      "", "", "", "", "", "", "", ""
    ],

    leftDirection: "",
    rightDirection: "",

    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",
    purines: "",

    analysisCorrect: false
  },


  /* ---------- NOTEBOOK ---------- */

  notebook: {

    stage1Note: "",
    stage2Note: "",
    stage3Note: "",
    stage4Note: "",
    stage5Note: "",
    stage6Note: "",
    finalNote: ""
  }

};



/* =========================================================
   2. LOAD / MERGE SAVED DATA
   ========================================================= */

function cloneDefaultData() {

  return JSON.parse(
    JSON.stringify(defaultLabData)
  );

}


function mergeObjects(target, source) {

  if (!source) {
    return target;
  }


  Object.keys(source).forEach(key => {

    const sourceValue =
      source[key];


    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue)
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
        sourceValue
      );

    }

    else {

      target[key] =
        sourceValue;

    }

  });


  return target;

}


function loadLabData() {

  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!raw) {

    return cloneDefaultData();

  }


  try {

    const parsed =
      JSON.parse(raw);


    return mergeObjects(
      cloneDefaultData(),
      parsed
    );

  }

  catch (error) {

    console.warn(
      "Saved DNA lab data could not be read.",
      error
    );


    return cloneDefaultData();

  }

}


let labData =
  loadLabData();



/* =========================================================
   3. SAVE DATA
   ========================================================= */

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


  if (!status) {
    return;
  }


  const normalText =
    document.body.dataset.page === "home"
      ? "Progress saves automatically"
      : "✓ Saved";


  status.textContent =
    "✓ Saved";


  clearTimeout(
    showSaveStatus.timer
  );


  showSaveStatus.timer =
    setTimeout(() => {

      status.textContent =
        normalText;

    }, 1200);

}



/* =========================================================
   4. PAGE INITIALIZATION
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
   5. HOME PAGE
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

  }

  else {

    if (savedPanel) {
      savedPanel.hidden = true;
    }

    if (newPanel) {
      newPanel.hidden = false;
    }

  }


  /* CONTINUE */

  continueButton?.addEventListener(
    "click",
    () => {

      window.location.href =
        getNextIncompletePage();

    }
  );


  /* START NEW */

  newButton?.addEventListener(
    "click",
    () => {

      const confirmed =
        window.confirm(
          "Start a new lab? This will erase the saved lab currently stored on this browser."
        );


      if (!confirmed) {
        return;
      }


      localStorage.removeItem(
        STORAGE_KEY
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


  /* START */

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


  /* ENTER KEY */

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
   6. STUDENT NAME
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



/* =========================================================
   7. NOTEBOOK AUTO-SAVE
   ========================================================= */

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



/* =========================================================
   8. SHARED INTERACTION HELPERS
   ========================================================= */

let selectedPiece = null;


function selectPiece(element) {

  clearSelectedPiece();


  selectedPiece =
    element;


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


function showFeedback(
  element,
  type,
  message
) {

  if (!element) {
    return;
  }


  element.className =
    `feedback-box visible ${type}`;


  element.innerHTML =
    message;

}


function clearFeedback(element) {

  if (!element) {
    return;
  }


  element.className =
    "feedback-box";


  element.innerHTML =
    "";

}


function unlockNext(selector) {

  const link =
    document.querySelector(
      selector
    );


  if (!link) {
    return;
  }


  link.classList.remove(
    "locked"
  );


  link.setAttribute(
    "aria-disabled",
    "false"
  );

}


function requireReasoning(
  text,
  minimumCharacters
) {

  return (
    text.trim().length >=
    minimumCharacters
  );

}



/* =========================================================
   9. DRAG SUPPORT
   ========================================================= */

function makeDraggable(
  element,
  data
) {

  element.setAttribute(
    "draggable",
    "true"
  );


  element.addEventListener(
    "dragstart",
    event => {

      element.classList.add(
        "dragging"
      );


      event.dataTransfer.setData(
        "application/json",
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
    "dragover",
    event => {

      event.preventDefault();

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

        const data =
          JSON.parse(
            event.dataTransfer.getData(
              "application/json"
            )
          );


        callback(data);

      }

      catch (error) {

        console.warn(
          "Could not read dragged item.",
          error
        );

      }

    }
  );

}



/* =========================================================
   10. STAGE 1
   CONSTRUCT A NUCLEOTIDE
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

  const checkModel =
    document.querySelector(
      "#check-stage1-model"
    );

  const clearModel =
    document.querySelector(
      "#clear-stage1-model"
    );

  const modelFeedback =
    document.querySelector(
      "#stage1-model-feedback"
    );

  const reveal =
    document.querySelector(
      "#stage1-model-reveal"
    );

  const checkAnalysis =
    document.querySelector(
      "#check-stage1-analysis"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage1-analysis-feedback"
    );


  restoreStage1Model();


  cards.forEach(card => {

    const data = {
      type: "stage1-piece",
      piece: card.dataset.piece,
      id: card.dataset.pieceId
    };


    makeDraggable(
      card,
      data
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
          "stage1-piece"
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

        if (!selectedPiece) {

          /* Allow clearing an occupied site */

          const siteName =
            site.dataset.site;


          if (
            labData.stage1.model[
              siteName
            ]
          ) {

            labData.stage1.model[
              siteName
            ] = "";


            labData.stage1.modelCorrect =
              false;


            saveLabData();


            renderStage1Site(
              site,
              ""
            );

          }


          return;

        }


        if (
          !selectedPiece.classList.contains(
            "molecule-card"
          )
        ) {
          return;
        }


        placeStage1Piece(
          site,
          selectedPiece.dataset.piece
        );


        clearSelectedPiece();

      }
    );

  });


  /* CHECK MODEL */

  checkModel?.addEventListener(
    "click",
    () => {

      labData.stage1.attempts++;


      const model =
        labData.stage1.model;


      const slotChecks = {
        phosphate: model.phosphate === "phosphate",
        sugar: model.sugar === "deoxyribose",
        base: model.base === "dna-base"
      };


      const correct =
        slotChecks.phosphate &&
        slotChecks.sugar &&
        slotChecks.base;


      if (correct) {

        labData.stage1.modelCorrect =
          true;


        saveLabData();


        sites.forEach(site => {

          site.classList.remove(
            "error-site"
          );

          site.classList.add(
            "correct-site"
          );

        });


        reveal?.classList.add(
          "visible"
        );


        showFeedback(
          modelFeedback,
          "success",
          `
            <strong>Model verified.</strong><br>
            The three structures you selected can form one
            DNA nucleotide. Continue to the structural analysis.
          `
        );

      }

      else {

        labData.stage1.modelCorrect =
          false;


        saveLabData();


        /* Mark exactly which site(s) are wrong */

        sites.forEach(site => {

          const siteName =
            site.dataset.site;


          const isEmpty =
            !model[siteName];


          const isWrong =
            !isEmpty &&
            !slotChecks[siteName];


          site.classList.toggle(
            "error-site",
            isWrong
          );


          site.classList.remove(
            "correct-site"
          );

        });


        const wrongSlots =
          Object.entries(slotChecks)
            .filter(([, ok]) => !ok)
            .map(([slot]) => slot);


        const slotLabels = {
          phosphate: "phosphate site",
          sugar: "sugar site",
          base: "base site"
        };


        const namedWrong =
          wrongSlots
            .filter(slot => model[slot])
            .map(slot => slotLabels[slot]);


        const namedEmpty =
          wrongSlots
            .filter(slot => !model[slot])
            .map(slot => slotLabels[slot]);


        let specificMessage = "";


        if (namedWrong.length) {

          specificMessage +=
            `The structure in your <strong>${namedWrong.join(" and ")}</strong> is incorrect.<br>`;

        }


        if (namedEmpty.length) {

          specificMessage +=
            `Your <strong>${namedEmpty.join(" and ")}</strong> ${namedEmpty.length > 1 ? "are" : "is"} still empty.<br>`;

        }


        showFeedback(
          modelFeedback,
          "hint",
          specificMessage +
          "<br>" +
          getStage1SlotHint(labData.stage1.attempts)
        );

      }

    }
  );


  /* CLEAR MODEL */

  clearModel?.addEventListener(
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


      sites.forEach(site => {

        site.classList.remove(
          "correct-site",
          "error-site",
          "active-site"
        );


        site.innerHTML =
          "<span>Connection site</span>";

      });


      reveal?.classList.remove(
        "visible"
      );


      clearFeedback(
        modelFeedback
      );

    }
  );


  /* ANALYSIS CHOICE */

  document
    .querySelectorAll(
      'input[name="stage1-variable"]'
    )
    .forEach(option => {

      if (
        option.value ===
        labData.stage1.variableComponent
      ) {

        option.checked = true;

      }


      option.addEventListener(
        "change",
        () => {

          labData.stage1.variableComponent =
            option.value;


          saveLabData();

        }
      );

    });


  /* CHECK ANALYSIS */

  checkAnalysis?.addEventListener(
    "click",
    () => {

      if (
        !labData.stage1.modelCorrect
      ) {

        showFeedback(
          analysisFeedback,
          "hint",
          `
            Verify your nucleotide model before submitting
            the structural analysis.
          `
        );

        return;
      }


      const selected =
        document.querySelector(
          'input[name="stage1-variable"]:checked'
        );


      const explanation =
        document.querySelector(
          "#stage1-note"
        )?.value || "";


      if (
        !selected ||
        selected.value !== "base"
      ) {

        showFeedback(
          analysisFeedback,
          "hint",
          `
            Compare DNA nucleotides carefully.
            Which component can vary while the sugar and
            phosphate remain part of every nucleotide?
          `
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
          `
            Your component choice is correct, but your
            explanation needs more reasoning.
            Explain how different bases create different
            nucleotide sequences.
          `
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
          Variation in the nitrogenous bases allows different
          base sequences to carry different genetic information.
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


    sites.forEach(site => {

      site.classList.add(
        "correct-site"
      );

    });

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

  const siteName =
    site.dataset.site;


  labData.stage1.model[
    siteName
  ] =
    piece;


  labData.stage1.modelCorrect =
    false;


  saveLabData();


  renderStage1Site(
    site,
    piece
  );

}



function renderStage1Site(
  site,
  piece
) {

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


  if (
    source &&
    source.querySelector("svg")
  ) {

    const svg =
      source
        .querySelector("svg")
        .cloneNode(true);


    svg.removeAttribute(
      "aria-label"
    );


    site.innerHTML = "";

    site.appendChild(svg);

    return;
  }


  site.textContent =
    piece;

}



function restoreStage1Model() {

  document
    .querySelectorAll(
      ".nucleotide-site"
    )
    .forEach(site => {

      const piece =
        labData.stage1.model[
          site.dataset.site
        ];


      if (piece) {

        renderStage1Site(
          site,
          piece
        );

      }

    });

}



function getStage1SlotHint(
  attempt
) {

  if (attempt <= 2) {

    return `
      Reconsider the structure in the site marked in red above.
    `;

  }


  return `
    Remember: the sugar found in DNA has an
    <strong>H</strong> at the 2′ carbon (not an
    <strong>OH</strong> — that sugar is ribose, found in RNA),
    and the base must be one of the four nitrogenous bases
    found in DNA (not uracil, which is found only in RNA).
  `;

}



/* =========================================================
   11. STAGE 2
   ANALYZE BASES
   ========================================================= */

function setupStage2() {

  const cards =
    document.querySelectorAll(
      ".analysis-base-card"
    );

  const zones =
    document.querySelectorAll(
      ".classification-dropzone"
    );

  const groupFeedback =
    document.querySelector(
      "#stage2-group-feedback"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage2-analysis-feedback"
    );

  const termReveal =
    document.querySelector(
      "#stage2-term-reveal"
    );


  cards.forEach(card => {

    makeDraggable(
      card,
      {
        type: "stage2-base",
        base: card.dataset.base
      }
    );


    card.addEventListener(
      "click",
      () => {

        selectPiece(card);

      }
    );

  });


  zones.forEach(zone => {

    setupDropTarget(
      zone,
      data => {

        if (
          data.type !==
          "stage2-base"
        ) {
          return;
        }


        assignStage2Base(
          data.base,
          zone.dataset.group
        );

      }
    );


    zone.addEventListener(
      "click",
      () => {

        if (
          !selectedPiece ||
          !selectedPiece.classList.contains(
            "analysis-base-card"
          )
        ) {
          return;
        }


        assignStage2Base(
          selectedPiece.dataset.base,
          zone.dataset.group
        );


        clearSelectedPiece();

      }
    );

  });


  renderStage2Groups();


  /* CHECK GROUPING */

  document
    .querySelector(
      "#check-stage2-groups"
    )
    ?.addEventListener(
      "click",
      () => {

        const a =
          labData.stage2.assignments;


        const groupingOne =
          (
            a.adenine === "group1" &&
            a.guanine === "group1" &&
            a.cytosine === "group2" &&
            a.thymine === "group2"
          );


        const groupingTwo =
          (
            a.adenine === "group2" &&
            a.guanine === "group2" &&
            a.cytosine === "group1" &&
            a.thymine === "group1"
          );


        if (
          groupingOne ||
          groupingTwo
        ) {

          labData.stage2.groupingCorrect =
            true;


          saveLabData();


          showFeedback(
            groupFeedback,
            "success",
            `
              <strong>Your grouping is structurally consistent.</strong><br>
              Now determine what feature separates the two groups.
            `
          );

        }

        else {

          labData.stage2.groupingCorrect =
            false;


          saveLabData();


          showFeedback(
            groupFeedback,
            "hint",
            `
              The four structures can be divided into two groups
              of two. Compare the underlying ring structures rather
              than the letters or names of the bases.
            `
          );

        }

      }
    );


  /* PATTERN CHOICE */

  document
    .querySelectorAll(
      'input[name="stage2-pattern"]'
    )
    .forEach(option => {

      if (
        option.value ===
        labData.stage2.pattern
      ) {

        option.checked = true;

      }


      option.addEventListener(
        "change",
        () => {

          labData.stage2.pattern =
            option.value;


          saveLabData();

        }
      );

    });


  /* CHECK ANALYSIS */

  document
    .querySelector(
      "#check-stage2-analysis"
    )
    ?.addEventListener(
      "click",
      () => {

        if (
          !labData.stage2.groupingCorrect
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Validate your grouping before submitting
              the pattern analysis.
            `
          );

          return;
        }


        const explanation =
          document.querySelector(
            "#stage2-note"
          )?.value || "";


        if (
          labData.stage2.pattern !==
          "rings"
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Re-examine the molecular diagrams.
              What structural feature is shared by adenine
              and guanine but differs in cytosine and thymine?
            `
          );

          return;
        }


        if (
          !requireReasoning(
            explanation,
            35
          )
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Your pattern is correct. Add an explanation that
              describes the structural difference between the
              two groups.
            `
          );

          return;
        }


        labData.stage2.analysisCorrect =
          true;


        labData.completedStages.stage2 =
          true;


        saveLabData();


        termReveal?.classList.add(
          "visible"
        );


        showFeedback(
          analysisFeedback,
          "success",
          `
            <strong>Stage 2 complete.</strong><br>
            Adenine and guanine are double-ring purines.
            Cytosine and thymine are single-ring pyrimidines.
          `
        );


        unlockNext(
          "#stage2-next"
        );

      }
    );


  if (
    labData.stage2.analysisCorrect
  ) {

    termReveal?.classList.add(
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



function assignStage2Base(
  base,
  group
) {

  labData.stage2.assignments[
    base
  ] =
    group;


  labData.stage2.groupingCorrect =
    false;


  saveLabData();


  renderStage2Groups();

}



function renderStage2Groups() {

  const group1 =
    document.querySelector(
      "#stage2-group1"
    );

  const group2 =
    document.querySelector(
      "#stage2-group2"
    );


  if (
    !group1 ||
    !group2
  ) {
    return;
  }


  group1.innerHTML = "";
  group2.innerHTML = "";


  const names = {
    adenine: "Adenine",
    guanine: "Guanine",
    cytosine: "Cytosine",
    thymine: "Thymine"
  };


  Object.entries(
    labData.stage2.assignments
  )
  .forEach(
    ([base, group]) => {

      if (!group) {
        return;
      }


      const tag =
        document.createElement(
          "button"
        );


      tag.type =
        "button";


      tag.className =
        "classified-base-tag";


      tag.textContent =
        names[base];


      tag.title =
        "Click to remove";


      tag.addEventListener(
        "click",
        event => {

          event.stopPropagation();


          labData.stage2.assignments[
            base
          ] = "";


          labData.stage2.groupingCorrect =
            false;


          saveLabData();


          renderStage2Groups();

        }
      );


      if (group === "group1") {

        group1.appendChild(
          tag
        );

      }

      else {

        group2.appendChild(
          tag
        );

      }

    }
  );


  if (
    !group1.children.length
  ) {

    group1.textContent =
      "Place two bases here";

  }


  if (
    !group2.children.length
  ) {

    group2.textContent =
      "Place two bases here";

  }

}



/* =========================================================
   12. STAGE 3
   BUILD A DNA STRAND
   ========================================================= */

function setupStage3() {

  const bank =
    document.querySelectorAll(
      ".whole-nucleotide"
    );

  const slots =
    document.querySelectorAll(
      ".strand-build-slot"
    );

  const feedback =
    document.querySelector(
      "#stage3-feedback"
    );

  const analysisFeedback =
    document.querySelector(
      "#stage3-analysis-feedback"
    );


  const target =
    ["A", "T", "G", "C", "C", "A"];


  bank.forEach(button => {

    makeDraggable(
      button,
      {
        type: "stage3-nucleotide",
        base: button.dataset.base
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
          "stage3-nucleotide"
        ) {
          return;
        }


        placeStage3Nucleotide(
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
            "whole-nucleotide"
          )
        ) {

          placeStage3Nucleotide(
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


        if (
          labData.stage3.sequence[
            position
          ]
        ) {

          labData.stage3.sequence[
            position
          ] = "";


          labData.stage3.strandCorrect =
            false;


          saveLabData();


          renderStage3Slots();

        }

      }
    );

  });


  renderStage3Slots();


  /* CHECK STRAND */

  document
    .querySelector(
      "#check-stage3-strand"
    )
    ?.addEventListener(
      "click",
      () => {

        const correct =
          target.every(
            (base, index) =>

              labData.stage3.sequence[
                index
              ] === base
          );


        if (correct) {

          labData.stage3.strandCorrect =
            true;


          saveLabData();


          showFeedback(
            feedback,
            "success",
            `
              <strong>Strand validated.</strong><br>
              Your nucleotides are in the required sequence
              and form a continuous polynucleotide strand.
            `
          );

        }

        else {

          labData.stage3.strandCorrect =
            false;


          saveLabData();


          showFeedback(
            feedback,
            "hint",
            `
              Your strand does not yet match the required
              5′–A T G C C A–3′ sequence.
              Recheck the position of each nucleotide.
            `
          );

        }

      }
    );


  /* CLEAR */

  document
    .querySelector(
      "#clear-stage3-strand"
    )
    ?.addEventListener(
      "click",
      () => {

        labData.stage3.sequence =
          ["", "", "", "", "", ""];


        labData.stage3.strandCorrect =
          false;


        saveLabData();


        renderStage3Slots();


        clearFeedback(
          feedback
        );

      }
    );


  /* BACKBONE ANSWER */

  document
    .querySelectorAll(
      'input[name="stage3-backbone"]'
    )
    .forEach(option => {

      if (
        option.value ===
        labData.stage3.backboneAnswer
      ) {

        option.checked = true;

      }


      option.addEventListener(
        "change",
        () => {

          labData.stage3.backboneAnswer =
            option.value;


          saveLabData();

        }
      );

    });


  /* ANALYSIS */

  document
    .querySelector(
      "#check-stage3-analysis"
    )
    ?.addEventListener(
      "click",
      () => {

        if (
          !labData.stage3.strandCorrect
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Validate the DNA strand before submitting
              your structural analysis.
            `
          );

          return;
        }


        if (
          labData.stage3.backboneAnswer !==
          "sugar-phosphate"
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Examine the repeating components along the
              outside of the strand.
            `
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
            45
          )
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Your backbone identification is correct.
              Explain why changing the base sequence does not
              change the repeating sugar-phosphate structure.
            `
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
            The sugar-phosphate backbone provides structural
            continuity while the base sequence can vary.
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



function placeStage3Nucleotide(
  slot,
  base
) {

  const position =
    Number(
      slot.dataset.position
    );


  labData.stage3.sequence[
    position
  ] =
    base;


  labData.stage3.strandCorrect =
    false;


  saveLabData();


  renderStage3Slots();

}



function renderStage3Slots() {

  document
    .querySelectorAll(
      ".strand-build-slot"
    )
    .forEach(slot => {

      const position =
        Number(
          slot.dataset.position
        );


      const base =
        labData.stage3.sequence[
          position
        ];


      if (!base) {

        slot.innerHTML = "";

        return;

      }


      slot.innerHTML = `

        <div class="whole-nucleotide">

          <span class="nt-phosphate">
            P
          </span>

          <span class="nt-sugar">
            D
          </span>

          <span class="nt-base base-${base.toLowerCase()}">
            ${base}
          </span>

        </div>

      `;

    });

}



/* =========================================================
   13. STAGE 4
   BUILD COMPLEMENTARY STRAND
   ========================================================= */

function setupStage4() {

  const bankButtons =
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


  const template =
    ["A", "T", "G", "C", "C", "A"];


  const correctComplement =
    ["T", "A", "C", "G", "G", "T"];


  bankButtons.forEach(button => {

    makeDraggable(
      button,
      {
        type: "dna-base",
        base: button.dataset.base
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


        labData.stage4.sequence[
          index
        ] = "";


        labData.stage4.complementCorrect =
          false;


        saveLabData();


        renderStage4();

      }
    );

  });


  restoreStage4Calculations();

  renderStage4();


  /* CHECK COMPLEMENT */

  document
    .querySelector(
      "#check-stage4-complement"
    )
    ?.addEventListener(
      "click",
      () => {

        const wrongIndex =
          correctComplement.findIndex(
            (base, index) =>

              labData.stage4.sequence[
                index
              ] !== base
          );


        if (
          wrongIndex === -1
        ) {

          labData.stage4.complementCorrect =
            true;


          saveLabData();


          renderStage4();


          showFeedback(
            feedback,
            "success",
            `
              <strong>Complementary strand validated.</strong><br>
              Every base forms the expected complementary
              relationship with the template strand.
            `
          );

        }

        else {

          labData.stage4.complementCorrect =
            false;


          saveLabData();


          showFeedback(
            feedback,
            "hint",
            `
              At least one base pair is incorrect.
              Re-examine position ${wrongIndex + 1} and determine
              which base should pair with
              <strong>${template[wrongIndex]}</strong>.
            `
          );

        }

      }
    );


  /* SAVE CALCULATIONS */

  const atInput =
    document.querySelector(
      "#stage4-at-pairs"
    );

  const gcInput =
    document.querySelector(
      "#stage4-gc-pairs"
    );

  const hydrogenInput =
    document.querySelector(
      "#stage4-hydrogen-bonds"
    );


  atInput?.addEventListener(
    "input",
    () => {

      labData.stage4.atPairs =
        atInput.value;

      saveLabData();

    }
  );


  gcInput?.addEventListener(
    "input",
    () => {

      labData.stage4.gcPairs =
        gcInput.value;

      saveLabData();

    }
  );


  hydrogenInput?.addEventListener(
    "input",
    () => {

      labData.stage4.hydrogenBonds =
        hydrogenInput.value;

      saveLabData();

    }
  );


  /* ANALYSIS */

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
            `
              Validate the complementary strand before
              completing the molecular analysis.
            `
          );

          return;
        }


        const countsCorrect =
          Number(
            labData.stage4.atPairs
          ) === 3 &&

          Number(
            labData.stage4.gcPairs
          ) === 3 &&

          Number(
            labData.stage4.hydrogenBonds
          ) === 15;


        if (!countsCorrect) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Recheck your calculations.
              Count the A–T pairs and G–C pairs first,
              then use the number of hydrogen bonds associated
              with each type of pair.
            `
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
            `
              Your calculations are correct. Explain why a
              region with more G–C pairs would require more
              energy to separate.
            `
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
          `
            <strong>Stage 4 complete.</strong><br>
            This molecule contains 3 A–T pairs, 3 G–C pairs,
            and 15 hydrogen bonds in total.
          `
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


  labData.stage4.sequence[
    position
  ] =
    base;


  labData.stage4.complementCorrect =
    false;


  saveLabData();


  renderStage4();

}



function renderStage4() {

  const template =
    ["A", "T", "G", "C", "C", "A"];


  const complements = {
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
        labData.stage4.sequence[
          position
        ];


      if (!base) {

        element.className =
          "complement-position";


        element.textContent =
          "?";

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


      const templateBase =
        template[position];


      const placed =
        labData.stage4.sequence[
          position
        ];


      const correct =
        placed ===
        complements[
          templateBase
        ];


      element.classList.toggle(
        "connected",
        correct
      );


      if (!correct) {

        element.textContent =
          "";

        return;
      }


      element.textContent =
        (
          templateBase === "G" ||
          templateBase === "C"
        )
          ? "···"
          : "··";

    });

}



function restoreStage4Calculations() {

  const at =
    document.querySelector(
      "#stage4-at-pairs"
    );

  const gc =
    document.querySelector(
      "#stage4-gc-pairs"
    );

  const hydrogen =
    document.querySelector(
      "#stage4-hydrogen-bonds"
    );


  if (at) {
    at.value =
      labData.stage4.atPairs;
  }

  if (gc) {
    gc.value =
      labData.stage4.gcPairs;
  }

  if (hydrogen) {
    hydrogen.value =
      labData.stage4.hydrogenBonds;
  }

}



/* =========================================================
   14. STAGE 5
   DIAGNOSE AND REPAIR DNA
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

  const directionButtons = {
    topLeft:
      document.querySelector(
        "#stage5-top-left"
      ),

    topRight:
      document.querySelector(
        "#stage5-top-right"
      ),

    bottomLeft:
      document.querySelector(
        "#stage5-bottom-left"
      ),

    bottomRight:
      document.querySelector(
        "#stage5-bottom-right"
      )
  };


  const bondElements =
    document.querySelectorAll(
      ".diagnostic-bonds span"
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

    button.addEventListener(
      "click",
      () => {

        selectPiece(button);

      }
    );

  });


  diagnosticBases.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          !selectedPiece ||
          !selectedPiece.classList.contains(
            "base-bank-button"
          )
        ) {
          return;
        }


        const position =
          Number(
            button.dataset.position
          );


        labData.stage5.sequence[
          position
        ] =
          selectedPiece.dataset.base;


        labData.stage5.repairsCorrect =
          false;


        saveLabData();


        clearSelectedPiece();


        renderStage5Model();

      }
    );

  });


  /* DIRECTIONS */

  Object.entries(
    directionButtons
  )
  .forEach(
    ([key, button]) => {

      button?.addEventListener(
        "click",
        () => {

          labData.stage5[key] =
            labData.stage5[key] === "5"
              ? "3"
              : "5";


          labData.stage5.repairsCorrect =
            false;


          saveLabData();


          renderStage5Model();

        }
      );

    }
  );


  /* HYDROGEN BOND REPAIR */

  bondElements.forEach(
    (bond, index) => {

      bond.title =
        "Click to change the number of hydrogen bonds";


      bond.style.cursor =
        "pointer";


      bond.addEventListener(
        "click",
        () => {

          labData.stage5.bondCounts[
            index
          ] =
            labData.stage5.bondCounts[
              index
            ] === 2
              ? 3
              : 2;


          labData.stage5.repairsCorrect =
            false;


          saveLabData();


          renderStage5Model();

        }
      );

    }
  );


  renderStage5Model();


  /* CHECK REPAIRS */

  document
    .querySelector(
      "#check-stage5-repair"
    )
    ?.addEventListener(
      "click",
      () => {

        const correctSequence =
          [
            "T",
            "A",
            "C",
            "G",
            "G",
            "T"
          ];


        const correctBonds =
          [2, 2, 3, 3, 3, 2];


        const directionsCorrect =
          labData.stage5.topLeft === "5" &&
          labData.stage5.topRight === "3" &&
          labData.stage5.bottomLeft === "3" &&
          labData.stage5.bottomRight === "5";


        const sequenceCorrect =
          correctSequence.every(
            (base, index) =>

              labData.stage5.sequence[
                index
              ] === base
          );


        const bondsCorrect =
          correctBonds.every(
            (count, index) =>

              labData.stage5.bondCounts[
                index
              ] === count
          );


        if (
          directionsCorrect &&
          sequenceCorrect &&
          bondsCorrect
        ) {

          labData.stage5.repairsCorrect =
            true;


          saveLabData();


          showFeedback(
            feedback,
            "success",
            `
              <strong>Repairs validated.</strong><br>
              The base pairing, hydrogen bonding, and strand
              orientation now represent a valid DNA model.
            `
          );

        }

        else {

          const hints = [];


          if (!directionsCorrect) {

            hints.push(
              "Check whether the two strands are antiparallel."
            );

          }


          if (!sequenceCorrect) {

            hints.push(
              "At least one complementary base pair is still incorrect."
            );

          }


          if (!bondsCorrect) {

            hints.push(
              "Check the number of hydrogen bonds shown for each base pair."
            );

          }


          showFeedback(
            feedback,
            "hint",
            `
              <strong>The model still contains an error.</strong><br>
              ${hints.join("<br>")}
            `
          );

        }

      }
    );


  /* ANALYSIS */

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
            `
              Repair and validate the DNA model before
              submitting your error analysis.
            `
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
            `
              Your repaired model is correct. Expand your
              explanation so that you identify and explain
              at least two problems in the original model.
            `
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
          `
            <strong>Stage 5 complete.</strong><br>
            You diagnosed and repaired multiple structural
            errors rather than simply identifying them.
          `
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



function renderStage5Model() {

  const directionMap = {

    topLeft: "#stage5-top-left",
    topRight: "#stage5-top-right",
    bottomLeft: "#stage5-bottom-left",
    bottomRight: "#stage5-bottom-right"

  };


  Object.entries(
    directionMap
  )
  .forEach(
    ([key, selector]) => {

      const element =
        document.querySelector(
          selector
        );


      if (element) {

        element.textContent =
          labData.stage5[key] +
          "′";

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
        labData.stage5.sequence[
          position
        ];


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
          labData.stage5.bondCounts[
            index
          ] === 3
            ? "···"
            : "··";

      }
    );

}



/* =========================================================
   15. STAGE 6
   DNA STRUCTURAL INVESTIGATION
   ========================================================= */

function setupStage6() {

  const models =
    document.querySelectorAll(
      ".candidate-model"
    );

  const selectButtons =
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


  /* RESTORE MODEL */

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


  selectButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        labData.stage6.selectedModel =
          button.dataset.model;


        saveLabData();


        models.forEach(model => {

          model.classList.toggle(
            "selected-model",
            model.dataset.model ===
              labData.stage6.selectedModel
          );

        });

      }
    );

  });


  /* RESTORE EVIDENCE */

  evidence.forEach(box => {

    box.checked =
      labData.stage6.evidence.includes(
        box.value
      );


    box.addEventListener(
      "change",
      () => {

        labData.stage6.evidence =
          Array.from(
            document.querySelectorAll(
              ".stage6-evidence:checked"
            )
          )
          .map(
            checked =>
              checked.value
          );


        saveLabData();

      }
    );

  });


  /* CHECK INVESTIGATION */

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
          !labData.stage6.selectedModel
        ) {

          showFeedback(
            feedback,
            "hint",
            `
              Select the model you believe is biologically
              plausible before submitting your evaluation.
            `
          );

          return;
        }


        if (
          labData.stage6.selectedModel !==
          "A"
        ) {

          showFeedback(
            feedback,
            "hint",
            `
              Your selected model contains a structural problem.
              Compare base pairing, hydrogen bonding, and
              strand orientation across all three models.
            `
          );

          return;
        }


        const requiredEvidence =
          [
            "complementary",
            "antiparallel",
            "hydrogen"
          ];


        const missingEvidence =
          requiredEvidence.some(
            item =>
              !labData.stage6.evidence.includes(
                item
              )
          );


        if (missingEvidence) {

          showFeedback(
            feedback,
            "hint",
            `
              Your model choice is correct, but your evidence
              is incomplete. Use multiple independent structural
              features to support the model.
            `
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
            `
              Your evidence selection is strong. Expand your
              written evaluation so that you defend Model A
              and explain why at least one competing model
              is biologically implausible.
            `
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
          `
            <strong>Stage 6 complete.</strong><br>
            Model A is supported by complementary pairing,
            appropriate hydrogen bonding, and antiparallel
            strand orientation. You are ready for the
            final construction challenge.
          `
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
   16. FINAL CHALLENGE
   ========================================================= */

function setupChallenge() {

  const baseBank =
    document.querySelectorAll(
      ".base-bank-button"
    );

  const slots =
    document.querySelectorAll(
      ".final-base-slot"
    );

  const leftDirection =
    document.querySelector(
      "#final-left-direction"
    );

  const rightDirection =
    document.querySelector(
      "#final-right-direction"
    );

  const feedback =
    document.querySelector(
      "#final-feedback"
    );

  const completedHelix =
    document.querySelector(
      "#completed-double-helix"
    );


  baseBank.forEach(button => {

    makeDraggable(
      button,
      {
        type: "challenge-base",
        base: button.dataset.base
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


        labData.challenge.sequence[
          position
        ] = "";


        labData.challenge.analysisCorrect =
          false;


        saveLabData();


        renderChallenge();

      }
    );

  });


  leftDirection?.addEventListener(
    "click",
    () => {

      labData.challenge.leftDirection =
        cycleDirection(
          labData.challenge.leftDirection
        );


      saveLabData();


      renderChallenge();

    }
  );


  rightDirection?.addEventListener(
    "click",
    () => {

      labData.challenge.rightDirection =
        cycleDirection(
          labData.challenge.rightDirection
        );


      saveLabData();


      renderChallenge();

    }
  );


  setupChallengeCalculationSaving();

  restoreChallengeCalculations();

  renderChallenge();


  /* VALIDATE */

  document
    .querySelector(
      "#submit-final-challenge"
    )
    ?.addEventListener(
      "click",
      () => {

        const complement =
          [
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
          complement.every(
            (base, index) =>

              labData.challenge.sequence[
                index
              ] === base
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


        const issues = [];


        if (!sequenceCorrect) {

          issues.push(
            "The complementary strand contains at least one incorrect base."
          );

        }


        if (!directionsCorrect) {

          issues.push(
            "The strand orientations are not yet antiparallel."
          );

        }


        if (!calculationsCorrect) {

          issues.push(
            "At least one structural calculation is incorrect."
          );

        }


        if (
          !requireReasoning(
            explanation,
            160
          )
        ) {

          issues.push(
            "Your defence needs more evidence and explanation."
          );

        }


        if (
          issues.length > 0
        ) {

          showFeedback(
            feedback,
            "hint",
            `
              <strong>Your DNA model has not yet passed validation.</strong><br>
              ${issues.join("<br>")}
            `
          );

          return;
        }


        labData.challenge.analysisCorrect =
          true;


        labData.completedStages.challenge =
          true;


        saveLabData();


        renderChallenge();


        completedHelix?.classList.add(
          "visible"
        );


        showFeedback(
          feedback,
          "success",
          `
            <strong>DNA molecule validated.</strong><br>
            Your molecule satisfies the structural requirements
            for double-stranded DNA. The complete double helix
            has been unlocked below.
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
          350
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



function cycleDirection(
  current
) {

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


  labData.challenge.sequence[
    position
  ] =
    base;


  labData.challenge.analysisCorrect =
    false;


  saveLabData();


  renderChallenge();

}



function renderChallenge() {

  const template =
    [
      "G",
      "C",
      "A",
      "T",
      "T",
      "G",
      "C",
      "C"
    ];


  const correctPairs = {
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
        labData.challenge.sequence[
          position
        ];


      if (!base) {

        slot.className =
          "final-base-slot";


        slot.textContent =
          "?";

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

        const topBase =
          template[position];


        const bottomBase =
          labData.challenge.sequence[
            position
          ];


        const correct =
          bottomBase ===
          correctPairs[
            topBase
          ];


        if (!correct) {

          bond.textContent =
            "";

          return;
        }


        bond.textContent =
          (
            topBase === "G" ||
            topBase === "C"
          )
            ? "···"
            : "··";

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
        ? labData.challenge.leftDirection + "′"
        : "?";

  }


  if (right) {

    right.textContent =
      labData.challenge.rightDirection
        ? labData.challenge.rightDirection + "′"
        : "?";

  }

}



function setupChallengeCalculationSaving() {

  const map = {

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
    map
  )
  .forEach(
    ([selector, key]) => {

      const input =
        document.querySelector(
          selector
        );


      input?.addEventListener(
        "input",
        () => {

          labData.challenge[key] =
            input.value;


          saveLabData();

        }
      );

    }
  );

}



function restoreChallengeCalculations() {

  const map = {

    "#final-at":
      labData.challenge.atPairs,

    "#final-gc":
      labData.challenge.gcPairs,

    "#final-hydrogen":
      labData.challenge.hydrogenBonds,

    "#final-purines":
      labData.challenge.purines

  };


  Object.entries(
    map
  )
  .forEach(
    ([selector, value]) => {

      const input =
        document.querySelector(
          selector
        );


      if (input) {

        input.value =
          value || "";

      }

    }
  );

}



/* =========================================================
   17. COMPLETION PAGE
   Supports the completion page from our earlier build.
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



/* =========================================================
   18. LAB RECORD
   ========================================================= */

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
   19. DOWNLOAD REPORT
   ========================================================= */

function downloadLabReport() {

  const date =
    new Date()
      .toLocaleDateString();


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

Stage 3 — Construct a DNA Strand
${completionText(labData.completedStages.stage3)}

Stage 4 — Construct the Complementary Strand
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


STAGE 3 — DNA STRAND

${labData.notebook.stage3Note || "No response recorded."}


STAGE 4 — COMPLEMENTARY DNA

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


  link.href =
    url;


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
   20. START AGAIN
   ========================================================= */

function startLabAgain() {

  const confirmed =
    window.confirm(
      "Start a new lab? This will permanently erase the saved work currently stored on this browser."
    );


  if (!confirmed) {
    return;
  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  labData =
    cloneDefaultData();


  window.location.href =
    "index.html";

}



/* =========================================================
   21. UTILITIES
   ========================================================= */

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
