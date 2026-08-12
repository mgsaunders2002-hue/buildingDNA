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
            ] =
              "";


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


        saveLabData();


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
        selected.value !==
          "base"
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


          labData.stage2.structureCorrect =
            false;


          saveLabData();

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


          labData.stage2.structureCorrect =
            false;


          saveLabData();

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

          rings.adenine === "2" &&

          rings.guanine === "2" &&

          rings.cytosine === "1" &&

          rings.thymine === "1";


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
              Your classifications are consistent with the
              molecular structures.
            `
          );

        }

        else {

          labData.stage2.structureCorrect =
            false;


          saveLabData();


          showFeedback(
            structureFeedback,
            "hint",
            `
              At least one classification is incorrect.
              Compare the fused ring systems carefully.
            `
          );

        }

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


          labData.stage2.applicationCorrect =
            false;


          saveLabData();

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


          labData.stage2.applicationCorrect =
            false;


          saveLabData();

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


          labData.stage2.applicationCorrect =
            false;


          saveLabData();

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
          ["AT", "GC"]
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

          labData.stage2.applicationCorrect =
            false;


          saveLabData();


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


          labData.stage2.calculationsCorrect =
            false;


          saveLabData();

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


        if (correct) {

          labData.stage2.calculationsCorrect =
            true;


          saveLabData();


          showFeedback(
            calculationFeedback,
            "success",
            `
              <strong>Calculations correct.</strong><br>
              A = 72, T = 72, G = 48 and C = 48.
              The molecule therefore contains 120 purines.
            `
          );

        }

        else {

          labData.stage2.calculationsCorrect =
            false;


          saveLabData();


          showFeedback(
            calculationFeedback,
            "hint",
            `
              Apply Chargaff's rules first:
              A = T and G = C.
              Then determine which bases are purines.
            `
          );

        }

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


        if (
          !requireReasoning(
            explanation,
            70
          )
        ) {

          showFeedback(
            synthesisFeedback,
            "hint",
            `
              Expand your explanation to compare normal
              purine–pyrimidine pairing with either
              purine–purine or pyrimidine–pyrimidine pairing.
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
            You connected molecular structure,
            complementary base pairing, DNA width and
            Chargaff's rules.
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
function setupStage3() {

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

  const componentSlots =
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


  if (
    !Array.isArray(
      labData.stage3.components
    ) ||
    labData.stage3.components.length !== 6
  ) {

    labData.stage3.components =
      targetBases.map(() => ({
        phosphate: "",
        sugar: "",
        base: ""
      }));

  }


  labData.stage3.components =
    labData.stage3.components.map(
      component => ({
        phosphate:
          component?.phosphate || "",

        sugar:
          component?.sugar || "",

        base:
          component?.base || ""
      })
    );


  parts.forEach(part => {

    const componentType =
      part.dataset.partType;

    const componentValue =
      part.dataset.partValue ||
      part.dataset.base ||
      (
        componentType === "phosphate"
          ? "phosphate"
          : componentType === "sugar"
            ? "deoxyribose"
            : ""
      );

    const partData = {
      type: "stage3-component",
      component: componentType,
      value: componentValue
    };


    makeDraggable(
      part,
      partData
    );


    part.addEventListener(
      "click",
      () => {

        selectPiece(part);

      }
    );

  });


  componentSlots.forEach(slot => {

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
          data.value
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

          const selectedType =
            selectedPiece.dataset.partType;

          const selectedValue =
            selectedPiece.dataset.partValue ||
            selectedPiece.dataset.base ||
            (
              selectedType === "phosphate"
                ? "phosphate"
                : selectedType === "sugar"
                  ? "deoxyribose"
                  : ""
            );


          placeStage3Component(
            slot,
            selectedType,
            selectedValue
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
          labData.stage3.components[
            position
          ]?.[component]
        ) {

          labData.stage3.components[
            position
          ][component] = "";

          resetStage3CompletionFrom(
            "build"
          );

          saveLabData();

          renderStage3Build();

          clearFeedback(
            buildFeedback
          );

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
          labData.stage3.components.every(
            component =>

              component.phosphate &&
              component.sugar &&
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
              Every nucleotide must contain all three molecular
              components before the strand can be validated.
            `
          );

          return;

        }


        const wrongPositions = [];


        labData.stage3.components.forEach(
          (component, index) => {

            if (
              component.phosphate !==
                "phosphate" ||
              component.sugar !==
                "deoxyribose" ||
              component.base !==
                targetBases[index]
            ) {

              wrongPositions.push(
                index + 1
              );

            }

          }
        );


        if (
          wrongPositions.length > 0
        ) {

          labData.stage3.buildCorrect =
            false;

          saveLabData();

          showFeedback(
            buildFeedback,
            "hint",
            `
              <strong>The strand is not yet correct.</strong><br>
              Re-examine nucleotide position${
                wrongPositions.length > 1
                  ? "s"
                  : ""
              } ${wrongPositions.join(", ")}.
              Check both molecular composition and the required
              5′ → 3′ base sequence.
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
            You constructed six DNA nucleotides with the required
            5′–A T G C C A–3′ base sequence.
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
          targetBases.map(() => ({
            phosphate: "",
            sugar: "",
            base: ""
          }));

        resetStage3CompletionFrom(
          "build"
        );

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

      bondTarget.classList.toggle(
        "selected-bond",
        labData.stage3.bondSelected
      );

      bondTarget.textContent =
        labData.stage3.bondSelected
          ? "Bond selected ✓"
          : "Select bond";

      saveLabData();

      lockStage3Next();

      clearFeedback(
        bondFeedback
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

          lockStage3Next();

          clearFeedback(
            bondFeedback
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
            `
              Validate your molecular strand in Part A before
              analysing how adjacent nucleotides are connected.
            `
          );

          return;

        }


        if (
          !labData.stage3.bondSelected
        ) {

          showFeedback(
            bondFeedback,
            "hint",
            `
              Select the connection between the two neighbouring
              nucleotides in the model before identifying the
              structures involved.
            `
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
            `
              That connection is not correct. Think about the
              repeating sugar–phosphate backbone of a single
              DNA strand and distinguish it from hydrogen bonding
              between complementary bases.
            `
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
            <strong>Bond analysis correct.</strong><br>
            Adjacent nucleotides within one DNA strand are joined
            by covalent phosphodiester bonds involving the sugar
            of one nucleotide and the phosphate associated with
            the next nucleotide.
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

          lockStage3Next();

          clearFeedback(
            diagnosisFeedback
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
            `
              Complete the bond analysis in Part B before
              submitting your model diagnosis.
            `
          );

          return;

        }


        if (
          !labData.stage3.selectedModel
        ) {

          showFeedback(
            diagnosisFeedback,
            "hint",
            `
              Select the model you think correctly represents
              one DNA strand.
            `
          );

          return;

        }


        if (
          labData.stage3.selectedModel !==
          "A"
        ) {

          labData.stage3.diagnosisCorrect =
            false;

          saveLabData();

          showFeedback(
            diagnosisFeedback,
            "hint",
            `
              Re-examine the organization of the backbone.
              In a DNA strand, sugars and phosphates repeat along
              the outside of the molecule, while each nitrogenous
              base is attached to a deoxyribose sugar.
            `
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
            `
              Your model choice is correct, but the diagnosis
              needs more evidence. Explain why the selected model
              is correct and identify the structural problem in
              <strong>both</strong> incorrect models.
            `
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
            Model A shows the repeating sugar–phosphate backbone
            with nitrogenous bases attached to the sugars.
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
            `
              Complete and validate Parts A, B and C before
              submitting the transfer question.
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
            70
          )
        ) {

          showFeedback(
            analysisFeedback,
            "hint",
            `
              Expand your explanation. Identify what changes when
              the base sequence changes and what remains constant
              in the sugar–phosphate backbone.
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
            Changing the base sequence changes the order of the
            nitrogenous bases, but the repeating deoxyribose and
            phosphate components of the backbone remain the same.
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


function placeStage3Component(
  slot,
  componentType,
  componentValue
) {

  const position =
    Number(
      slot.dataset.position
    );

  const requiredComponent =
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
    requiredComponent
  ) {

    const feedback =
      document.querySelector(
        "#stage3-build-feedback"
      );

    showFeedback(
      feedback,
      "hint",
      `
        That molecular part does not belong in this position.
        Match the part to its role within a nucleotide.
      `
    );

    slot.classList.add(
      "error-site"
    );

    setTimeout(
      () =>
        slot.classList.remove(
          "error-site"
        ),
      700
    );

    return;

  }


  let value =
    String(
      componentValue || ""
    );


  if (
    componentType ===
    "phosphate"
  ) {

    value =
      value || "phosphate";

  }

  else if (
    componentType ===
    "sugar"
  ) {

    value =
      value || "deoxyribose";

  }

  else if (
    componentType ===
    "base"
  ) {

    value =
      value.toUpperCase();

    if (
      ![
        "A",
        "T",
        "G",
        "C",
        "U"
      ].includes(value)
    ) {

      return;

    }

  }

  else {

    return;

  }


  labData.stage3.components[
    position
  ][requiredComponent] =
    value;

  resetStage3CompletionFrom(
    "build"
  );

  saveLabData();

  renderStage3Build();

  clearFeedback(
    document.querySelector(
      "#stage3-build-feedback"
    )
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
        labData.stage3.components[
          position
        ]?.[component] || "";


      slot.classList.remove(
        "filled-component",
        "correct-site",
        "error-site",
        "base-a",
        "base-t",
        "base-g",
        "base-c"
      );


      if (!value) {

        slot.textContent = "?";

        slot.setAttribute(
          "aria-label",
          `Empty molecular attachment site in nucleotide ${position + 1}`
        );

        return;

      }


      slot.classList.add(
        "filled-component"
      );


      const visualSource =
        Array.from(
          document.querySelectorAll(
            ".stage3-part"
          )
        )
        .find(part => {

          const sourceType =
            part.dataset.partType;

          const sourceValue =
            part.dataset.partValue ||
            part.dataset.base ||
            (
              sourceType === "phosphate"
                ? "phosphate"
                : sourceType === "sugar"
                  ? "deoxyribose"
                  : ""
            );

          return (
            sourceType ===
              component &&
            String(
              sourceValue
            ).toUpperCase() ===
              String(
                value
              ).toUpperCase()
          );

        });


      if (visualSource) {

        slot.innerHTML =
          visualSource.innerHTML;

      }

      else {

        slot.textContent =
          value;

      }


      if (
        component === "base"
      ) {

        slot.classList.add(
          `base-${value.toLowerCase()}`
        );

      }


      slot.setAttribute(
        "aria-label",
        `Placed molecular component in nucleotide ${position + 1}`
      );


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

      const selected =
        card.dataset.model ===
        labData.stage3.selectedModel;

      card.classList.toggle(
        "selected-model",
        selected
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


function resetStage3CompletionFrom(
  point
) {

  if (
    point === "build"
  ) {

    labData.stage3.buildCorrect =
      false;

    labData.stage3.bondCorrect =
      false;

    labData.stage3.diagnosisCorrect =
      false;

    labData.stage3.analysisCorrect =
      false;

  }

  labData.completedStages.stage3 =
    false;

  lockStage3Next();

}


function lockStage3Next() {

  const link =
    document.querySelector(
      "#stage3-next"
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

  const correctComplement = [
    "T",
    "A",
    "C",
    "G",
    "G",
    "T"
  ];


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
              <strong>Complementary strand validated.</strong>
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
              Re-examine position ${wrongIndex + 1}.
            `
          );

        }

      }
    );


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
              Validate the complementary strand first.
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
              Expand your explanation.
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
            <strong>Stage 4 complete.</strong>
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

  const template = [
    "A",
    "T",
    "G",
    "C",
    "C",
    "A"
  ];

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


  bondElements.forEach(
    (bond, index) => {

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
              <strong>Repairs validated.</strong>
            `
          );

        }

        else {

          const hints = [];


          if (!directionsCorrect) {

            hints.push(
              "Check whether the strands are antiparallel."
            );

          }

          if (!sequenceCorrect) {

            hints.push(
              "At least one complementary base is incorrect."
            );

          }

          if (!bondsCorrect) {

            hints.push(
              "Check the hydrogen bond counts."
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
              Repair the model first.
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
              Expand your explanation to identify
              at least two structural errors.
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
            <strong>Stage 5 complete.</strong>
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
              Select a model first.
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
            `
          );

          return;

        }


        const requiredEvidence = [
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
              Your evidence is incomplete.
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
              Expand your written evaluation.
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
            <strong>Stage 6 complete.</strong>
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


  document
    .querySelector(
      "#submit-final-challenge"
    )
    ?.addEventListener(
      "click",
      () => {

        const complement = [
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
            The completed double helix has been unlocked below.
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

  if (
    current === "3"
  ) {

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

          labData.challenge[
            key
          ] =
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
