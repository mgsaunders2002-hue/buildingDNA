/* =========================================================
   BIOLOGY 30 — VIRTUAL DNA CONSTRUCTION LAB
   script.js
   ========================================================= */


/* =========================================================
   1. STORAGE
   ========================================================= */

const STORAGE_KEY =
  "bio30VirtualDNALab";


/* =========================================================
   2. DEFAULT LAB DATA
   ========================================================= */

const defaultLabData = {

  studentName: "",

  currentStage: 1,

  completedStages: {
    stage1: false,
    stage2: false,
    stage3: false,
    stage4: false,
    stage5: false,
    stage6: false,
    challenge: false
  },


  /* =====================================================
     STAGE 1
     ===================================================== */

  stage1: {

    selectedParts: {
      phosphate: "",
      sugar: "",
      base: ""
    },

    structureCorrect: false,

    baseIdentity: "",

    informationExplanation: "",

    analysisCorrect: false
  },


  /* =====================================================
     STAGE 2
     ===================================================== */

  stage2: {

    structures: {

      adenine: {
        family: "",
        rings: ""
      },

      guanine: {
        family: "",
        rings: ""
      },

      cytosine: {
        family: "",
        rings: ""
      },

      thymine: {
        family: "",
        rings: ""
      }

    },

    structureCorrect: false,

    widestPair: "",

    narrowestPair: "",

    normalPairs: [],

    applicationCorrect: false,

    calculations: {
      thymine: "",
      guanine: "",
      cytosine: "",
      purines: ""
    },

    calculationsCorrect: false,

    synthesisCorrect: false
  },


  /* =====================================================
     STAGE 3
     ===================================================== */

  stage3: {

    components: [

      {
        phosphate: "",
        sugar: "",
        base: ""
      },

      {
        phosphate: "",
        sugar: "",
        base: ""
      },

      {
        phosphate: "",
        sugar: "",
        base: ""
      },

      {
        phosphate: "",
        sugar: "",
        base: ""
      },

      {
        phosphate: "",
        sugar: "",
        base: ""
      },

      {
        phosphate: "",
        sugar: "",
        base: ""
      }

    ],

    buildCorrect: false,

    bondSelected: false,

    bondAnswer: "",

    bondCorrect: false,

    selectedModel: "",

    diagnosisCorrect: false,

    analysisCorrect: false
  },


  /* =====================================================
     STAGE 4
     ===================================================== */

  stage4: {

    complement: [
      "",
      "",
      "",
      "",
      "",
      ""
    ],

    complementCorrect: false,

    hydrogenBondAnswer: "",

    analysisCorrect: false
  },


  /* =====================================================
     STAGE 5
     ===================================================== */

  stage5: {

    topDirection: "",

    bottomDirection: "",

    orientationCorrect: false,

    analysisCorrect: false
  },


  /* =====================================================
     STAGE 6
     ===================================================== */

  stage6: {

    selectedModel: "",

    evidence: [],

    modelCorrect: false,

    analysisCorrect: false
  },


  /* =====================================================
     FINAL CHALLENGE
     ===================================================== */

  challenge: {

    complement: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],

    topDirection: "",

    bottomDirection: "",

    constructionCorrect: false,

    reasoningCorrect: false
  },


  /* =====================================================
     STUDENT NOTEBOOK
     ===================================================== */

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
   3. LOAD SAVED DATA
   ========================================================= */

let labData =
  loadLabData();


function loadLabData() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {

    return structuredClone(
      defaultLabData
    );

  }


  try {

    const parsed =
      JSON.parse(saved);


    return mergeDeep(
      structuredClone(
        defaultLabData
      ),
      parsed
    );

  }

  catch (error) {

    console.error(
      "Could not load saved lab data:",
      error
    );


    return structuredClone(
      defaultLabData
    );

  }

}


/* =========================================================
   4. DEEP MERGE
   ========================================================= */

function mergeDeep(
  target,
  source
) {

  if (
    typeof target !== "object" ||
    target === null
  ) {

    return source;

  }


  if (
    typeof source !== "object" ||
    source === null
  ) {

    return target;

  }


  Object.keys(
    source
  ).forEach(key => {

    if (
      Array.isArray(
        source[key]
      )
    ) {

      target[key] =
        source[key];

    }

    else if (
      typeof source[key] ===
        "object" &&
      source[key] !== null
    ) {

      if (
        typeof target[key] !==
          "object" ||
        target[key] === null
      ) {

        target[key] = {};

      }


      target[key] =
        mergeDeep(
          target[key],
          source[key]
        );

    }

    else {

      target[key] =
        source[key];

    }

  });


  return target;

}


/* =========================================================
   5. SAVE DATA
   ========================================================= */

function saveLabData() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        labData
      )
    );


    updateSaveStatus(
      "✓ Saved"
    );

  }

  catch (error) {

    console.error(
      "Could not save lab data:",
      error
    );


    updateSaveStatus(
      "Save failed"
    );

  }

}


/* =========================================================
   6. SAVE STATUS
   ========================================================= */

function updateSaveStatus(
  message
) {

  const status =
    document.querySelector(
      "#save-status"
    );


  if (!status) {
    return;
  }


  status.textContent =
    message;

}


/* =========================================================
   7. RESET LAB
   ========================================================= */

function resetLab() {

  localStorage.removeItem(
    STORAGE_KEY
  );


  labData =
    structuredClone(
      defaultLabData
    );


  window.location.href =
    "index.html";

}


/* =========================================================
   8. PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const page =
      document.body.dataset.page;


    displayStudentName();


    setupAutosaveFields();


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

    }

  }
);


/* =========================================================
   9. STUDENT NAME DISPLAY
   ========================================================= */

function displayStudentName() {

  const display =
    document.querySelector(
      "#student-display"
    );


  if (
    display &&
    labData.studentName
  ) {

    display.textContent =
      labData.studentName;

  }

}


/* =========================================================
   10. AUTOSAVE TEXT FIELDS
   ========================================================= */

function setupAutosaveFields() {

  const fields =
    document.querySelectorAll(
      "[data-save-field]"
    );


  fields.forEach(field => {

    const key =
      field.dataset.saveField;


    if (
      labData.notebook[key] !==
      undefined
    ) {

      field.value =
        labData.notebook[key];

    }


    field.addEventListener(
      "input",
      () => {

        labData.notebook[key] =
          field.value;


        saveLabData();

      }
    );

  });

}


/* =========================================================
   11. FEEDBACK HELPERS
   ========================================================= */

function showFeedback(
  element,
  type,
  message
) {

  if (!element) {
    return;
  }


  element.className =
    `feedback-box ${type}`;


  element.innerHTML =
    message;

}


function clearFeedback(
  element
) {

  if (!element) {
    return;
  }


  element.className =
    "feedback-box";


  element.innerHTML =
    "";

}


/* =========================================================
   12. UNLOCK NEXT STAGE
   ========================================================= */

function unlockNext(
  selector
) {

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


/* =========================================================
   13. REASONING CHECK
   ========================================================= */

function requireReasoning(
  text,
  minimumLength = 60
) {

  if (!text) {
    return false;
  }


  const cleaned =
    text.trim();


  if (
    cleaned.length <
    minimumLength
  ) {

    return false;

  }


  const words =
    cleaned
      .split(/\s+/)
      .filter(Boolean);


  return (
    words.length >=
    Math.max(
      10,
      Math.floor(
        minimumLength / 5
      )
    )
  );

}


/* =========================================================
   14. SELECTABLE PIECES
   ========================================================= */

let selectedPiece =
  null;


function selectPiece(
  element
) {

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


  selectedPiece =
    null;

}


/* =========================================================
   15. DRAG AND DROP
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

      event.dataTransfer.setData(
        "application/json",
        JSON.stringify(data)
      );


      event.dataTransfer.effectAllowed =
        "copy";


      element.classList.add(
        "dragging"
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
  handler
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


        handler(data);

      }

      catch (error) {

        console.error(
          "Invalid drag data:",
          error
        );

      }

    }
  );

}


/* =========================================================
   16. HOME PAGE
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


  const nameInput =
    document.querySelector(
      "#student-name"
    );


  const startButton =
    document.querySelector(
      "#start-lab"
    );


  const continueButton =
    document.querySelector(
      "#continue-lab"
    );


  const newLabButton =
    document.querySelector(
      "#new-lab"
    );


  if (
    labData.studentName
  ) {

    if (savedPanel) {
      savedPanel.hidden =
        false;
    }


    if (newPanel) {
      newPanel.hidden =
        true;
    }


    if (savedName) {

      savedName.textContent =
        labData.studentName;

    }

  }

  else {

    if (savedPanel) {
      savedPanel.hidden =
        true;
    }


    if (newPanel) {
      newPanel.hidden =
        false;
    }

  }


  startButton?.addEventListener(
    "click",
    () => {

      const name =
        nameInput?.value.trim();


      if (!name) {

        alert(
          "Please enter your name before entering the lab."
        );

        return;

      }


      labData.studentName =
        name;


      labData.currentStage =
        1;


      saveLabData();


      window.location.href =
        "stage1.html";

    }
  );


  nameInput?.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        startButton?.click();

      }

    }
  );


  continueButton?.addEventListener(
    "click",
    () => {

      const stage =
        Math.min(
          Math.max(
            Number(
              labData.currentStage
            ) || 1,
            1
          ),
          6
        );


      window.location.href =
        `stage${stage}.html`;

    }
  );


  newLabButton?.addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "Start a new lab? This will erase the saved work currently stored in this browser."
        );


      if (!confirmed) {
        return;
      }


      localStorage.removeItem(
        STORAGE_KEY
      );


      labData =
        structuredClone(
          defaultLabData
        );


      if (savedPanel) {
        savedPanel.hidden =
          true;
      }


      if (newPanel) {
        newPanel.hidden =
          false;
      }


      if (nameInput) {

        nameInput.value =
          "";


        nameInput.focus();

      }

    }
  );

}
