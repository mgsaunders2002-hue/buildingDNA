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


  /* =====================================================
     STAGE 1
     ===================================================== */

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


  /* =====================================================
     STAGE 2
     ===================================================== */

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


  /* =====================================================
     STAGE 3
     ===================================================== */

  stage3: {

    /*
      The phosphate + deoxyribose backbone is
      pre-built at every position.

      Stage 3 focuses on base sequence,
      directionality, backbone bonding,
      structural diagnosis, and transfer.
    */

    sequence: [
      "",
      "",
      "",
      "",
      "",
      ""
    ],

    buildCorrect: false,

    bondChoice: "",
    bondAnswer: "",
    bondCorrect: false,

    errorAnswer: "",
    consequenceAnswer: "",
    diagnosisCorrect: false,

    analysisCorrect: false

  },


  /* =====================================================
     STAGE 4
     ===================================================== */

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


  /* =====================================================
     STAGE 5
     ===================================================== */

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


  /* =====================================================
     STAGE 6
     ===================================================== */

  stage6: {

    selectedModel: "",
    evidence: [],

    analysisCorrect: false

  },


  /* =====================================================
     FINAL CHALLENGE
     ===================================================== */

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


  /* =====================================================
     NOTEBOOK / SAVED WRITTEN RESPONSES
     ===================================================== */

  notebook: {

    stage1Note: "",
    stage2Note: "",

    stage3Note: "",
    stage3DiagnosisNote: "",

    stage4StabilityNote: "",
    stage4HeatingNote: "",
    stage4Note: "",

    stage5Note: "",
    stage6Note: "",

    finalNote: ""

  }

};



/* =========================================================
   DATA MANAGEMENT
   ========================================================= */


function cloneDefaultData() {

  return JSON.parse(
    JSON.stringify(defaultLabData)
  );

}



function mergeObjects(
  target,
  source
) {

  if (!source) {

    return target;

  }


  Object.keys(source)
    .forEach(key => {

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
   PAGE INITIALIZATION
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
   HOME PAGE
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

      if (
        event.key === "Enter"
      ) {

        startButton?.click();

      }

    }
  );

}



/* =========================================================
   CONTINUE SAVED LAB
   ========================================================= */


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
   STUDENT NAME
   ========================================================= */


function displayStudentName() {

  document
    .querySelectorAll(
      "#student-display"
    )
    .forEach(element => {

      if (
        labData.studentName
      ) {

        element.textContent =
          labData.studentName;

      }

    });

}



/* =========================================================
   SAVED WRITTEN RESPONSES
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
   SHARED SELECTION FUNCTIONS
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



/* =========================================================
   FEEDBACK
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



/* =========================================================
   NAVIGATION
   ========================================================= */


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



/* =========================================================
   BIOLOGY ANSWER VALIDATION
   ========================================================= */


/*
  Written responses are NOT accepted simply because
  they are long enough.

  The functions below allow students to explain ideas
  in their own words while still requiring the correct
  biological concepts.
*/


function normalizeBiologyAnswer(text) {

  return String(text || "")
    .toLowerCase()
    .replace(/[′’']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

}



function containsAny(
  text,
  terms
) {

  const normalized =
    normalizeBiologyAnswer(text);


  return terms.some(
    term =>
      normalized.includes(
        normalizeBiologyAnswer(term)
      )
  );

}



function hasMinimumLength(
  text,
  minimumCharacters
) {

  return (
    normalizeBiologyAnswer(text).length >=
    minimumCharacters
  );

}



/* ---------------------------------------------------------
   STAGE 1 WRITTEN RESPONSE
   --------------------------------------------------------- */


function validateStage1Explanation(text) {

  const hasBase =
    containsAny(
      text,
      [
        "base",
        "nitrogenous base",
        "adenine",
        "thymine",
        "guanine",
        "cytosine"
      ]
    );


  const hasConstantStructure =
    containsAny(
      text,
      [
        "sugar and phosphate",
        "phosphate and sugar",
        "deoxyribose and phosphate",
        "phosphate and deoxyribose",
        "sugar-phosphate",
        "sugar phosphate"
      ]
    );


  const hasInformationIdea =
    containsAny(
      text,
      [
        "genetic information",
        "base sequence",
        "sequence",
        "genetic code",
        "information"
      ]
    );


  return (
    hasMinimumLength(text, 35) &&
    hasBase &&
    hasConstantStructure &&
    hasInformationIdea
  );

}



/* ---------------------------------------------------------
   STAGE 2 WRITTEN RESPONSE
   --------------------------------------------------------- */


function validateStage2Explanation(text) {

  const normalPairing =
    containsAny(
      text,
      [
        "purine-pyrimidine",
        "purine pyrimidine",
        "purine and pyrimidine",
        "one purine and one pyrimidine"
      ]
    );


  const purinePurine =
    containsAny(
      text,
      [
        "purine-purine",
        "purine purine",
        "two purines",
        "2 purines",
        "purine and purine"
      ]
    );


  const wider =
    containsAny(
      text,
      [
        "wider",
        "too wide",
        "greater width",
        "increase the width"
      ]
    );


  const pyrimidinePyrimidine =
    containsAny(
      text,
      [
        "pyrimidine-pyrimidine",
        "pyrimidine pyrimidine",
        "two pyrimidines",
        "2 pyrimidines",
        "pyrimidine and pyrimidine"
      ]
    );


  const narrower =
    containsAny(
      text,
      [
        "narrower",
        "too narrow",
        "smaller width",
        "decrease the width"
      ]
    );


  return (
    hasMinimumLength(text, 60) &&
    normalPairing &&
    (
      (
        purinePurine &&
        wider
      ) ||
      (
        pyrimidinePyrimidine &&
        narrower
      )
    )
  );

}



/* ---------------------------------------------------------
   STAGE 3 — STRUCTURAL DIAGNOSIS
   --------------------------------------------------------- */


function validateStage3Diagnosis(text) {

  const phosphate =
    containsAny(
      text,
      [
        "phosphate",
        "phosphate group"
      ]
    );


  const phosphodiester =
    containsAny(
      text,
      [
        "phosphodiester",
        "phosphodiester bond",
        "phosphodiester bonds",
        "phosphodiester linkage",
        "phosphodiester linkages"
      ]
    );


  const disruptedBackbone =
    containsAny(
      text,
      [
        "backbone is disrupted",
        "disrupts the backbone",
        "backbone cannot continue",
        "backbone is not continuous",
        "backbone isn't continuous",
        "backbone is incomplete",
        "breaks the backbone",
        "interrupts the backbone",
        "incomplete backbone",
        "continuous backbone",
        "cannot form a continuous",
        "can't form a continuous",
        "cannot form the backbone",
        "can't form the backbone",
        "backbone cannot form",
        "backbone can't form"
      ]
    );


  return (
    hasMinimumLength(text, 45) &&
    phosphate &&
    phosphodiester &&
    disruptedBackbone
  );

}



/* ---------------------------------------------------------
   STAGE 3 — TRANSFER QUESTION
   --------------------------------------------------------- */


function validateStage3Transfer(text) {

  const basesChange =
    containsAny(
      text,
      [
        "bases change",
        "base changes",
        "base sequence changes",
        "sequence of bases changes",
        "order of bases changes",
        "order of the bases changes",
        "base order changes",
        "nitrogenous bases change",
        "different bases",
        "different base sequence",
        "different sequence"
      ]
    );


  const sugarsRemain =
    containsAny(
      text,
      [
        "sugar stays",
        "sugars stay",
        "sugar remains",
        "sugars remain",
        "sugar stays the same",
        "sugars stay the same",
        "deoxyribose stays",
        "deoxyribose remains",
        "deoxyribose stays the same"
      ]
    );


  const phosphatesRemain =
    containsAny(
      text,
      [
        "phosphate stays",
        "phosphates stay",
        "phosphate remains",
        "phosphates remain",
        "phosphate stays the same",
        "phosphates stay the same"
      ]
    );


  const backboneSame =
    containsAny(
      text,
      [
        "backbone stays",
        "backbone remains",
        "backbone does not change",
        "backbone doesn't change",
        "same backbone",
        "backbone stays the same",
        "sugar-phosphate backbone remains",
        "sugar-phosphate backbone stays",
        "sugar phosphate backbone remains",
        "sugar phosphate backbone stays"
      ]
    );


  return (
    hasMinimumLength(text, 45) &&
    basesChange &&
    (
      backboneSame ||
      (
        sugarsRemain &&
        phosphatesRemain
      )
    )
  );

}



/* ---------------------------------------------------------
   STAGE 4 — PART A STABILITY EXPLANATION
   --------------------------------------------------------- */


function validateStage4Stability(text) {

  const gc =
    containsAny(
      text,
      [
        "g-c",
        "g c",
        "gc",
        "guanine-cytosine",
        "guanine and cytosine"
      ]
    );


  const at =
    containsAny(
      text,
      [
        "a-t",
        "a t",
        "at",
        "adenine-thymine",
        "adenine and thymine"
      ]
    );


  const hydrogen =
    containsAny(
      text,
      [
        "hydrogen bond",
        "hydrogen bonds",
        "hydrogen bonding"
      ]
    );


  const three =
    containsAny(
      text,
      [
        "three hydrogen",
        "3 hydrogen",
        "three bonds",
        "3 bonds"
      ]
    );


  const two =
    containsAny(
      text,
      [
        "two hydrogen",
        "2 hydrogen",
        "two bonds",
        "2 bonds"
      ]
    );


  return (
    hasMinimumLength(text, 45) &&
    gc &&
    at &&
    hydrogen &&
    three &&
    two
  );

}



/* ---------------------------------------------------------
   STAGE 4 — PART C HEATING EXPLANATION
   --------------------------------------------------------- */


function validateStage4Heating(text) {

  const lowerGC =
    containsAny(
      text,
      [
        "lower gc",
        "less gc",
        "fewer g-c",
        "fewer gc",
        "35%",
        "35 percent",
        "region n"
      ]
    );


  const hydrogen =
    containsAny(
      text,
      [
        "hydrogen bond",
        "hydrogen bonds",
        "hydrogen bonding"
      ]
    );


  const gcThree =
    containsAny(
      text,
      [
        "three hydrogen",
        "3 hydrogen",
        "three bonds",
        "3 bonds",
        "g-c pairs form three",
        "gc pairs form three"
      ]
    );


  const easier =
    containsAny(
      text,
      [
        "easier to separate",
        "separate more easily",
        "less energy",
        "lower energy",
        "easier to break",
        "easier to pull apart"
      ]
    );


  return (
    hasMinimumLength(text, 45) &&
    lowerGC &&
    hydrogen &&
    gcThree &&
    easier
  );

}



/* ---------------------------------------------------------
   STAGE 4 — PART D SYNTHESIS
   --------------------------------------------------------- */


function validateStage4Synthesis(text) {

  const complementary =
    containsAny(
      text,
      [
        "complementary",
        "base pairing",
        "complementary base pairing",
        "a pairs with t",
        "adenine pairs with thymine",
        "g pairs with c",
        "guanine pairs with cytosine"
      ]
    );


  const hydrogen =
    containsAny(
      text,
      [
        "hydrogen bond",
        "hydrogen bonds",
        "hydrogen bonding"
      ]
    );


  const stability =
    containsAny(
      text,
      [
        "stable",
        "stability",
        "hold the strands",
        "holds the strands",
        "hold the two strands",
        "holds the two strands",
        "hold dna together",
        "holds dna together"
      ]
    );


  const separation =
    containsAny(
      text,
      [
        "separate",
        "separation",
        "break the hydrogen",
        "hydrogen bonds break",
        "hydrogen bonds can break",
        "hydrogen bonds are broken"
      ]
    );


  const backbone =
    containsAny(
      text,
      [
        "backbone",
        "sugar-phosphate",
        "sugar phosphate",
        "covalent",
        "phosphodiester"
      ]
    );


  const remainsIntact =
    containsAny(
      text,
      [
        "remains intact",
        "remain intact",
        "stays intact",
        "stay intact",
        "does not break",
        "doesn't break",
        "not broken",
        "without breaking",
        "without disrupting"
      ]
    );


  return (
    hasMinimumLength(text, 70) &&
    complementary &&
    hydrogen &&
    stability &&
    separation &&
    backbone &&
    remainsIntact
  );

}



/* ---------------------------------------------------------
   STAGE 5 — ERROR DIAGNOSIS
   --------------------------------------------------------- */


function validateStage5Explanation(text) {

  const directionError =
    containsAny(
      text,
      [
        "antiparallel",
        "direction",
        "5'",
        "3'",
        "same direction",
        "opposite direction"
      ]
    );


  const pairingError =
    containsAny(
      text,
      [
        "base pair",
        "base pairing",
        "complementary",
        "incorrect pair",
        "wrong pair",
        "a-t",
        "g-c"
      ]
    );


  const bondError =
    containsAny(
      text,
      [
        "hydrogen bond",
        "hydrogen bonds",
        "bond count",
        "two hydrogen",
        "three hydrogen",
        "2 hydrogen",
        "3 hydrogen"
      ]
    );


  const errorCategories = [
    directionError,
    pairingError,
    bondError
  ].filter(Boolean).length;


  return (
    hasMinimumLength(text, 65) &&
    errorCategories >= 2
  );

}



/* ---------------------------------------------------------
   STAGE 6 — MODEL EVIDENCE
   --------------------------------------------------------- */


function validateStage6Explanation(text) {

  const complementary =
    containsAny(
      text,
      [
        "complementary",
        "base pairing",
        "a-t",
        "g-c",
        "adenine",
        "thymine",
        "guanine",
        "cytosine"
      ]
    );


  const antiparallel =
    containsAny(
      text,
      [
        "antiparallel",
        "opposite directions",
        "opposite direction",
        "5'",
        "3'"
      ]
    );


  const hydrogen =
    containsAny(
      text,
      [
        "hydrogen bond",
        "hydrogen bonds",
        "hydrogen bonding",
        "two hydrogen",
        "three hydrogen",
        "2 hydrogen",
        "3 hydrogen"
      ]
    );


  return (
    hasMinimumLength(text, 90) &&
    complementary &&
    antiparallel &&
    hydrogen
  );

}



/* ---------------------------------------------------------
   FINAL CHALLENGE — MOLECULAR DEFENCE
   --------------------------------------------------------- */


function validateFinalDefence(text) {

  const nucleotideStructure =
    containsAny(
      text,
      [
        "nucleotide",
        "phosphate",
        "deoxyribose",
        "sugar",
        "nitrogenous base"
      ]
    );


  const backbone =
    containsAny(
      text,
      [
        "sugar-phosphate",
        "sugar phosphate",
        "backbone",
        "phosphodiester"
      ]
    );


  const complementary =
    containsAny(
      text,
      [
        "complementary",
        "base pairing",
        "a-t",
        "g-c",
        "adenine",
        "thymine",
        "guanine",
        "cytosine"
      ]
    );


  const antiparallel =
    containsAny(
      text,
      [
        "antiparallel",
        "opposite directions",
        "opposite direction",
        "5'",
        "3'"
      ]
    );


  const hydrogen =
    containsAny(
      text,
      [
        "hydrogen bond",
        "hydrogen bonds",
        "hydrogen bonding",
        "two hydrogen",
        "three hydrogen",
        "2 hydrogen",
        "3 hydrogen"
      ]
    );


  return (
    hasMinimumLength(text, 120) &&
    nucleotideStructure &&
    backbone &&
    complementary &&
    antiparallel &&
    hydrogen
  );

}



/* =========================================================
   DRAG AND DROP — SHARED
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


      event.dataTransfer.effectAllowed =
        "copy";


      const payload =
        JSON.stringify(data);


      event.dataTransfer.setData(
        "text/plain",
        payload
      );


      try {

        event.dataTransfer.setData(
          "application/json",
          payload
        );

      }

      catch (error) {

        /* no action needed */

      }

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
    event => {

      if (
        !element.contains(
          event.relatedTarget
        )
      ) {

        element.classList.remove(
          "drag-over"
        );

      }

    }
  );


  element.addEventListener(
    "drop",
    event => {

      event.preventDefault();


      element.classList.remove(
        "drag-over"
      );


      let raw =
        event.dataTransfer.getData(
          "text/plain"
        );


      if (!raw) {

        raw =
          event.dataTransfer.getData(
            "application/json"
          );

      }


      if (!raw) {

        console.warn(
          "Drop occurred, but no drag data was available."
        );

        return;

      }


      try {

        const data =
          JSON.parse(raw);


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
   STAGE 1 — CONSTRUCT A NUCLEOTIDE
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



  /* =====================================================
     PART A — BUILD THE NUCLEOTIDE
     ===================================================== */


  cards.forEach(card => {

    makeDraggable(
      card,
      {
        type: "stage1-piece",
        piece: card.dataset.piece,
        id: card.dataset.pieceId
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

        /*
          If no tray piece is selected,
          clicking an occupied site removes
          the current molecule from that site.
        */

        if (!selectedPiece) {

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


            labData.stage1.analysisCorrect =
              false;


            labData.completedStages.stage1 =
              false;


            saveLabData();


            renderStage1Site(
              site,
              ""
            );


            reveal?.classList.remove(
              "visible"
            );


            lockStage1Next();


            clearFeedback(
              modelFeedback
            );


            clearFeedback(
              analysisFeedback
            );

          }


          return;

        }


        /*
          If a molecule card has been selected,
          clicking a site places it there.
        */

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



  checkModel?.addEventListener(
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
            DNA nucleotide.
          `
        );

      }

      else {

        labData.stage1.modelCorrect =
          false;


        labData.stage1.analysisCorrect =
          false;


        labData.completedStages.stage1 =
          false;


        saveLabData();


        lockStage1Next();


        showStage1Hint(
          modelFeedback
        );

      }

    }
  );



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


      labData.stage1.analysisCorrect =
        false;


      labData.completedStages.stage1 =
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


      lockStage1Next();


      clearFeedback(
        modelFeedback
      );


      clearFeedback(
        analysisFeedback
      );

    }
  );



  /* =====================================================
     PART B — STRUCTURAL ANALYSIS
     ===================================================== */


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


          /*
            Changing the answer invalidates the
            previous Stage 1 completion until the
            student submits a correct answer again.
          */

          labData.stage1.analysisCorrect =
            false;


          labData.completedStages.stage1 =
            false;


          saveLabData();


          lockStage1Next();


          clearFeedback(
            analysisFeedback
          );

        }
      );

    });



  checkAnalysis?.addEventListener(
    "click",
    () => {

      /*
        Students cannot complete the written
        analysis until the nucleotide itself
        has been correctly constructed.
      */

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


      /*
        Objective portion:
        the nitrogenous base is the component
        that can vary among DNA nucleotides.
      */

      if (
        !selected ||
        selected.value !==
          "base"
      ) {

        labData.stage1.analysisCorrect =
          false;


        labData.completedStages.stage1 =
          false;


        saveLabData();


        lockStage1Next();


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


      /*
        Written portion:
        the response must now contain the correct
        biological reasoning.

        It must communicate that:
        1. the nitrogenous base varies,
        2. sugar and phosphate remain part of the
           nucleotide structure,
        3. variation in base sequence carries
           genetic information.
      */

      if (
        !validateStage1Explanation(
          explanation
        )
      ) {

        labData.stage1.analysisCorrect =
          false;


        labData.completedStages.stage1 =
          false;


        saveLabData();


        lockStage1Next();


        showFeedback(
          analysisFeedback,
          "hint",
          `
            Your component choice is correct, but the written
            explanation is not yet complete.<br><br>

            Explain what happens to the nitrogenous base,
            what remains consistent in the nucleotide,
            and why variation in the bases matters for
            genetic information.
          `
        );


        return;

      }


      /*
        Both the objective answer and the
        biological explanation are correct.
      */

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
          base sequences to carry different genetic information,
          while phosphate and deoxyribose remain structural
          components of DNA nucleotides.
        `
      );


      unlockNext(
        "#stage1-next"
      );

    }
  );



  /* =====================================================
     RESTORE PREVIOUSLY COMPLETED STATE
     ===================================================== */


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
    labData.completedStages.stage1 &&
    labData.stage1.analysisCorrect
  ) {

    unlockNext(
      "#stage1-next"
    );

  }

}



/* =========================================================
   STAGE 1 — PLACE MOLECULAR COMPONENT
   ========================================================= */


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


  /*
    Any change to the constructed model means
    it must be validated again.
  */

  labData.stage1.modelCorrect =
    false;


  labData.stage1.analysisCorrect =
    false;


  labData.completedStages.stage1 =
    false;


  saveLabData();


  lockStage1Next();


  renderStage1Site(
    site,
    piece
  );


  document
    .querySelector(
      "#stage1-model-reveal"
    )
    ?.classList.remove(
      "visible"
    );


  clearFeedback(
    document.querySelector(
      "#stage1-model-feedback"
    )
  );


  clearFeedback(
    document.querySelector(
      "#stage1-analysis-feedback"
    )
  );

}



/* =========================================================
   STAGE 1 — RENDER SITE
   ========================================================= */


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


    site.innerHTML =
      "";


    site.appendChild(
      svg
    );


    return;

  }


  site.textContent =
    piece;

}



/* =========================================================
   STAGE 1 — RESTORE MODEL
   ========================================================= */


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



/* =========================================================
   STAGE 1 — PROGRESSIVE HINTS
   ========================================================= */


function showStage1Hint(
  feedback
) {

  const attempt =
    labData.stage1.attempts;


  if (
    attempt === 1
  ) {

    showFeedback(
      feedback,
      "hint",
      `
        Your model contains at least one incorrect component
        or connection.
      `
    );


    return;

  }


  if (
    attempt === 2
  ) {

    showFeedback(
      feedback,
      "hint",
      `
        Examine the two five-carbon sugars carefully.
        Look specifically at the group attached to the
        <strong>2′ carbon</strong>.
      `
    );


    return;

  }


  if (
    attempt === 3
  ) {

    showFeedback(
      feedback,
      "hint",
      `
        One nitrogenous base in the parts tray belongs
        to RNA rather than DNA.
      `
    );


    return;

  }


  showFeedback(
    feedback,
    "hint",
    `
      A DNA nucleotide requires a phosphate group,
      deoxyribose sugar, and a DNA nitrogenous base.
    `
  );

}



/* =========================================================
   STAGE 1 — LOCK NEXT
   ========================================================= */


function lockStage1Next() {

  const link =
    document.querySelector(
      "#stage1-next"
    );


  if (!link) {

    return;

  }


  link.classList.add(
    "locked"
  );


  link.setAttribute(
    "aria-disabled",
    "true"
  );

}
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



  /* =====================================================
     PART A — CLASSIFY THE BASES
     ===================================================== */


  bases.forEach(base => {

    const familySelect =
      document.querySelector(
        `#stage2-${base}-family`
      );


    const ringSelect =
      document.querySelector(
        `#stage2-${base}-rings`
      );


    if (familySelect) {

      familySelect.value =
        labData.stage2.families[
          base
        ] || "";


      familySelect.addEventListener(
        "change",
        () => {

          labData.stage2.families[
            base
          ] =
            familySelect.value;


          resetStage2CompletionFrom(
            "structure"
          );


          saveLabData();

          lockStage2Next();


          clearFeedback(
            structureFeedback
          );


          clearFeedback(
            applicationFeedback
          );


          clearFeedback(
            calculationFeedback
          );


          clearFeedback(
            synthesisFeedback
          );

        }
      );

    }


    if (ringSelect) {

      ringSelect.value =
        labData.stage2.rings[
          base
        ] || "";


      ringSelect.addEventListener(
        "change",
        () => {

          labData.stage2.rings[
            base
          ] =
            ringSelect.value;


          resetStage2CompletionFrom(
            "structure"
          );


          saveLabData();

          lockStage2Next();


          clearFeedback(
            structureFeedback
          );


          clearFeedback(
            applicationFeedback
          );


          clearFeedback(
            calculationFeedback
          );


          clearFeedback(
            synthesisFeedback
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

        const families =
          labData.stage2.families;


        const rings =
          labData.stage2.rings;


        const correctFamilies =

          families.adenine ===
            "purine" &&

          families.guanine ===
            "purine" &&

          families.cytosine ===
            "pyrimidine" &&

          families.thymine ===
            "pyrimidine";


        const correctRings =

          rings.adenine ===
            "2" &&

          rings.guanine ===
            "2" &&

          rings.cytosine ===
            "1" &&

          rings.thymine ===
            "1";


        if (
          correctFamilies &&
          correctRings
        ) {

          labData.stage2.structureCorrect =
            true;


          saveLabData();


          showFeedback(
            structureFeedback,
            "success",
            `
              <strong>Structural analysis correct.</strong><br>
              Adenine and guanine are two-ring purines.
              Cytosine and thymine are one-ring pyrimidines.
            `
          );

        }

        else {

          resetStage2CompletionFrom(
            "structure"
          );


          saveLabData();

          lockStage2Next();


          showFeedback(
            structureFeedback,
            "hint",
            `
              At least one classification is incorrect.
              Compare the number of rings in each molecular
              structure carefully.
            `
          );

        }

      }
    );



  /* =====================================================
     PART B — APPLY BASE STRUCTURE
     ===================================================== */


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


          resetStage2CompletionFrom(
            "application"
          );


          saveLabData();

          lockStage2Next();


          clearFeedback(
            applicationFeedback
          );


          clearFeedback(
            synthesisFeedback
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


          resetStage2CompletionFrom(
            "application"
          );


          saveLabData();

          lockStage2Next();


          clearFeedback(
            applicationFeedback
          );


          clearFeedback(
            synthesisFeedback
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
        labData.stage2.normalPairs.includes(
          box.value
        );


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
              checked =>
                checked.value
            );


          resetStage2CompletionFrom(
            "application"
          );


          saveLabData();

          lockStage2Next();


          clearFeedback(
            applicationFeedback
          );


          clearFeedback(
            synthesisFeedback
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
            `
              Complete and validate Part A before applying
              the structural pattern.
            `
          );


          return;

        }


        const normalPairs =
          [
            ...labData.stage2.normalPairs
          ]
          .sort();


        const correctPairs =
          [
            "AT",
            "GC"
          ]
          .sort();


        const normalCorrect =
          JSON.stringify(
            normalPairs
          ) ===
          JSON.stringify(
            correctPairs
          );


        const correct =

          labData.stage2.widestPair ===
            "AG" &&

          labData.stage2.narrowestPair ===
            "CT" &&

          normalCorrect;


        if (correct) {

          labData.stage2.applicationCorrect =
            true;


          saveLabData();


          showFeedback(
            applicationFeedback,
            "success",
            `
              <strong>Structural predictions correct.</strong><br>
              A–G combines two purines and would be wider.
              C–T combines two pyrimidines and would be narrower.
              Normal DNA pairs one purine with one pyrimidine.
            `
          );

        }

        else {

          resetStage2CompletionFrom(
            "application"
          );


          saveLabData();

          lockStage2Next();


          showFeedback(
            applicationFeedback,
            "hint",
            `
              Reconsider the number of rings contributed by
              each base. Separate molecular width from normal
              complementary pairing.
            `
          );

        }

      }
    );



  /* =====================================================
     PART C — CHARGAFF CALCULATIONS
     ===================================================== */


  const countMap = {

    "#stage2-thymine-count":
      "thymineCount",

    "#stage2-guanine-count":
      "guanineCount",

    "#stage2-cytosine-count":
      "cytosineCount",

    "#stage2-purine-count":
      "purineCount"

  };


  Object.entries(
    countMap
  )
  .forEach(
    ([selector, key]) => {

      const input =
        document.querySelector(
          selector
        );


      if (!input) {

        return;

      }


      input.value =
        labData.stage2[key] || "";


      input.addEventListener(
        "input",
        () => {

          labData.stage2[key] =
            input.value;


          resetStage2CompletionFrom(
            "calculations"
          );


          saveLabData();

          lockStage2Next();


          clearFeedback(
            calculationFeedback
          );


          clearFeedback(
            synthesisFeedback
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

        if (
          !labData.stage2.applicationCorrect
        ) {

          showFeedback(
            calculationFeedback,
            "hint",
            `
              Complete Part B correctly before submitting
              the molecular calculations.
            `
          );


          return;

        }


        const thymineCorrect =
          Number(
            labData.stage2.thymineCount
          ) === 72;


        const guanineCorrect =
          Number(
            labData.stage2.guanineCount
          ) === 48;


        const cytosineCorrect =
          Number(
            labData.stage2.cytosineCount
          ) === 48;


        const purineCorrect =
          Number(
            labData.stage2.purineCount
          ) === 120;


        if (
          thymineCorrect &&
          guanineCorrect &&
          cytosineCorrect &&
          purineCorrect
        ) {

          labData.stage2.calculationsCorrect =
            true;


          saveLabData();


          showFeedback(
            calculationFeedback,
            "success",
            `
              <strong>Calculations correct.</strong><br>
              A = 72, T = 72, G = 48 and C = 48.<br>
              The molecule therefore contains
              <strong>120 purines</strong>.
            `
          );

        }

        else {

          resetStage2CompletionFrom(
            "calculations"
          );


          saveLabData();

          lockStage2Next();


          const hints = [];


          if (!thymineCorrect) {

            hints.push(
              "Use A = T to determine the number of thymine bases."
            );

          }


          if (
            !guanineCorrect ||
            !cytosineCorrect
          ) {

            hints.push(
              "Use G = C when determining guanine and cytosine."
            );

          }


          if (!purineCorrect) {

            hints.push(
              "Remember that adenine and guanine are the purines."
            );

          }


          showFeedback(
            calculationFeedback,
            "hint",
            `
              <strong>At least one calculation is incorrect.</strong><br>
              ${hints.join("<br>")}
            `
          );

        }

      }
    );



  /* =====================================================
     PART D — SYNTHESIS
     ===================================================== */


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
            `
              Complete Parts A, B and C correctly before
              submitting your Stage 2 synthesis.
            `
          );


          return;

        }


        const explanation =
          document.querySelector(
            "#stage2-note"
          )?.value || "";


        /*
          This is no longer a character-count check.

          A correct answer must explain that normal DNA
          pairs one purine with one pyrimidine AND must
          correctly explain the structural consequence
          of either:

          purine + purine = too wide

          OR

          pyrimidine + pyrimidine = too narrow
        */

        if (
          !validateStage2Explanation(
            explanation
          )
        ) {

          labData.stage2.synthesisCorrect =
            false;


          labData.completedStages.stage2 =
            false;


          saveLabData();

          lockStage2Next();


          showFeedback(
            synthesisFeedback,
            "hint",
            `
              Your explanation is not yet biologically complete.<br><br>

              Explain why normal DNA pairs one purine with one
              pyrimidine, then compare that arrangement with either
              two purines or two pyrimidines and describe what
              happens to the width of the DNA molecule.
            `
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
            <strong>Stage 2 complete.</strong><br>
            Normal base pairing combines one purine with one
            pyrimidine, helping maintain a consistent DNA width.
            Two purines would be too wide, while two pyrimidines
            would be too narrow.
          `
        );


        unlockNext(
          "#stage2-next"
        );

      }
    );



  /* =====================================================
     RESTORE COMPLETED STATE
     ===================================================== */


  if (
    labData.stage2.synthesisCorrect
  ) {

    summary?.classList.add(
      "visible"
    );

  }


  if (
    labData.completedStages.stage2 &&
    labData.stage2.synthesisCorrect
  ) {

    unlockNext(
      "#stage2-next"
    );

  }

}



/* =========================================================
   STAGE 2 — RESET DOWNSTREAM COMPLETION
   ========================================================= */


function resetStage2CompletionFrom(
  step
) {

  const order = [
    "structure",
    "application",
    "calculations",
    "synthesis"
  ];


  const start =
    order.indexOf(step);


  if (start === -1) {

    return;

  }


  if (
    start <=
    order.indexOf("structure")
  ) {

    labData.stage2.structureCorrect =
      false;

  }


  if (
    start <=
    order.indexOf("application")
  ) {

    labData.stage2.applicationCorrect =
      false;

  }


  if (
    start <=
    order.indexOf("calculations")
  ) {

    labData.stage2.calculationsCorrect =
      false;

  }


  if (
    start <=
    order.indexOf("synthesis")
  ) {

    labData.stage2.synthesisCorrect =
      false;

  }


  labData.completedStages.stage2 =
    false;


  document
    .querySelector(
      "#stage2-summary"
    )
    ?.classList.remove(
      "visible"
    );

}



/* =========================================================
   STAGE 2 — LOCK NEXT
   ========================================================= */


function lockStage2Next() {

  const link =
    document.querySelector(
      "#stage2-next"
    );


  if (!link) {

    return;

  }


  link.classList.add(
    "locked"
  );


  link.setAttribute(
    "aria-disabled",
    "true"
  );

}

}
