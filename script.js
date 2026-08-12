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
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Stage 3 | Construct a DNA Strand</title>

  <link rel="stylesheet" href="style.css">
</head>

<body data-page="stage3">

<header class="site-header">

  <div class="header-inner">

    <div>
      <div class="course-label">BIOLOGY 30</div>
      <div class="site-title">Virtual DNA Construction Lab</div>
    </div>

    <div class="save-status">
      <span id="student-display"></span>
      <span id="save-status">✓ Saved</span>
    </div>

  </div>

</header>


<div class="progress-wrapper">

  <div class="progress-label">
    <span>Stage 3 of 6</span>
    <strong>Construct a Polynucleotide Strand</strong>
  </div>

  <div class="progress-bar">
    <div class="progress-fill progress-3"></div>
  </div>

</div>


<main class="lab-page">


  <!-- =====================================================
       HEADING
       ===================================================== -->

  <section class="stage-heading">

    <span class="stage-number">
      STAGE 03
    </span>

    <h1>
      Construct a DNA Strand
    </h1>

    <p>
      A DNA strand is more than a sequence of letters.
      Use your knowledge of nucleotide structure to construct
      a strand from molecular components, identify how neighbouring
      nucleotides are connected, and evaluate different models
      of DNA structure.
    </p>

  </section>



  <!-- =====================================================
       PART A
       ===================================================== -->

  <section class="lab-panel">

    <div class="panel-heading">

      <span class="panel-label">
        PART A — MOLECULAR CONSTRUCTION
      </span>

      <h2>
        Build the required DNA strand.
      </h2>

      <p>
        Select molecular components from the tray and place them
        into the six nucleotide positions. Some components do not
        belong in DNA and should not be used.
      </p>

      <p class="small-note">
        You may drag a component into the model or click a component
        and then click its destination.
      </p>

    </div>


    <div class="target-banner">

      <span>
        REQUIRED STRAND
      </span>

      <strong>
        5′ — A T G C C A — 3′
      </strong>

    </div>



    <!-- =====================================================
         MOLECULAR PARTS TRAY
         ===================================================== -->

    <div class="stage3-parts-bank advanced-parts-bank">

      <div class="stage3-bank-intro">

        <h3>
          Molecular Parts Tray
        </h3>

        <p>
          Identify each structure before deciding whether and where
          it belongs in the strand.
        </p>

      </div>



      <!-- PHOSPHATE -->

      <button
        type="button"
        class="stage3-part molecular-part-card phosphate-part"
        data-part-type="phosphate"
        data-part-value="phosphate"
        aria-label="Molecular structure option"
      >

        <svg
          class="stage3-molecule-svg phosphate-svg"
          viewBox="0 0 140 110"
          aria-hidden="true"
        >

          <circle
            cx="70"
            cy="55"
            r="22"
            class="molecule-central-atom"
          />

          <text
            x="70"
            y="62"
            text-anchor="middle"
            class="molecule-symbol"
          >
            P
          </text>

          <line
            x1="70"
            y1="33"
            x2="70"
            y2="10"
            class="molecule-bond"
          />

          <line
            x1="70"
            y1="77"
            x2="70"
            y2="100"
            class="molecule-bond"
          />

          <line
            x1="48"
            y1="55"
            x2="20"
            y2="55"
            class="molecule-bond"
          />

          <line
            x1="92"
            y1="55"
            x2="120"
            y2="55"
            class="molecule-bond"
          />

          <text
            x="70"
            y="9"
            text-anchor="middle"
            class="molecule-small-label"
          >
            O
          </text>

          <text
            x="70"
            y="109"
            text-anchor="middle"
            class="molecule-small-label"
          >
            O
          </text>

          <text
            x="14"
            y="60"
            text-anchor="middle"
            class="molecule-small-label"
          >
            O
          </text>

          <text
            x="126"
            y="60"
            text-anchor="middle"
            class="molecule-small-label"
          >
            O
          </text>

        </svg>

        <span class="molecular-part-code">
          STRUCTURE 1
        </span>

      </button>



      <!-- DEOXYRIBOSE -->

      <button
        type="button"
        class="stage3-part molecular-part-card sugar-part"
        data-part-type="sugar"
        data-part-value="deoxyribose"
        aria-label="Molecular structure option"
      >

        <svg
          class="stage3-molecule-svg sugar-svg"
          viewBox="0 0 150 120"
          aria-hidden="true"
        >

          <polygon
            points="75,16 125,50 106,104 44,104 25,50"
            class="sugar-ring"
          />

          <text
            x="76"
            y="14"
            text-anchor="middle"
            class="molecule-small-label"
          >
            O
          </text>

          <text
            x="18"
            y="48"
            class="molecule-carbon-label"
          >
            1′
          </text>

          <text
            x="31"
            y="110"
            class="molecule-carbon-label"
          >
            2′
          </text>

          <text
            x="106"
            y="111"
            class="molecule-carbon-label"
          >
            3′
          </text>

          <text
            x="126"
            y="49"
            class="molecule-carbon-label"
          >
            4′
          </text>

          <text
            x="130"
            y="79"
            class="molecule-small-label"
          >
            CH₂OH
          </text>

          <text
            x="43"
            y="91"
            class="molecule-small-label"
          >
            H
          </text>

          <text
            x="93"
            y="91"
            class="molecule-small-label"
          >
            OH
          </text>

        </svg>

        <span class="molecular-part-code">
          STRUCTURE 2
        </span>

      </button>



      <!-- RIBOSE DISTRACTOR -->

      <button
        type="button"
        class="stage3-part molecular-part-card sugar-part distractor-part"
        data-part-type="sugar"
        data-part-value="ribose"
        aria-label="Molecular structure option"
      >

        <svg
          class="stage3-molecule-svg sugar-svg"
          viewBox="0 0 150 120"
          aria-hidden="true"
        >

          <polygon
            points="75,16 125,50 106,104 44,104 25,50"
            class="sugar-ring"
          />

          <text
            x="76"
            y="14"
            text-anchor="middle"
            class="molecule-small-label"
          >
            O
          </text>

          <text
            x="18"
            y="48"
            class="molecule-carbon-label"
          >
            1′
          </text>

          <text
            x="31"
            y="110"
            class="molecule-carbon-label"
          >
            2′
          </text>

          <text
            x="106"
            y="111"
            class="molecule-carbon-label"
          >
            3′
          </text>

          <text
            x="126"
            y="49"
            class="molecule-carbon-label"
          >
            4′
          </text>

          <text
            x="130"
            y="79"
            class="molecule-small-label"
          >
            CH₂OH
          </text>

          <text
            x="37"
            y="91"
            class="molecule-small-label"
          >
            OH
          </text>

          <text
            x="93"
            y="91"
            class="molecule-small-label"
          >
            OH
          </text>

        </svg>

        <span class="molecular-part-code">
          STRUCTURE 3
        </span>

      </button>



      <!-- ADENINE -->

      <button
        type="button"
        class="stage3-part molecular-part-card base-part"
        data-part-type="base"
        data-part-value="A"
        aria-label="Molecular structure option"
      >

        <div class="simplified-base purine-structure">

          <span class="ring ring-six">
            N
          </span>

          <span class="ring ring-five">
            N
          </span>

          <span class="base-feature">
            NH₂
          </span>

        </div>

        <span class="molecular-part-code">
          STRUCTURE 4
        </span>

      </button>



      <!-- THYMINE -->

      <button
        type="button"
        class="stage3-part molecular-part-card base-part"
        data-part-type="base"
        data-part-value="T"
        aria-label="Molecular structure option"
      >

        <div class="simplified-base pyrimidine-structure">

          <span class="ring ring-six">
            N
          </span>

          <span class="base-feature feature-top">
            CH₃
          </span>

          <span class="base-feature feature-bottom">
            O
          </span>

        </div>

        <span class="molecular-part-code">
          STRUCTURE 5
        </span>

      </button>



      <!-- CYTOSINE -->

      <button
        type="button"
        class="stage3-part molecular-part-card base-part"
        data-part-type="base"
        data-part-value="C"
        aria-label="Molecular structure option"
      >

        <div class="simplified-base pyrimidine-structure">

          <span class="ring ring-six">
            N
          </span>

          <span class="base-feature feature-top">
            NH₂
          </span>

          <span class="base-feature feature-bottom">
            O
          </span>

        </div>

        <span class="molecular-part-code">
          STRUCTURE 6
        </span>

      </button>



      <!-- GUANINE -->

      <button
        type="button"
        class="stage3-part molecular-part-card base-part"
        data-part-type="base"
        data-part-value="G"
        aria-label="Molecular structure option"
      >

        <div class="simplified-base purine-structure">

          <span class="ring ring-six">
            N
          </span>

          <span class="ring ring-five">
            N
          </span>

          <span class="base-feature feature-top">
            O
          </span>

          <span class="base-feature feature-bottom">
            NH₂
          </span>

        </div>

        <span class="molecular-part-code">
          STRUCTURE 7
        </span>

      </button>



      <!-- URACIL DISTRACTOR -->

      <button
        type="button"
        class="stage3-part molecular-part-card base-part distractor-part"
        data-part-type="base"
        data-part-value="U"
        aria-label="Molecular structure option"
      >

        <div class="simplified-base pyrimidine-structure">

          <span class="ring ring-six">
            N
          </span>

          <span class="base-feature feature-top">
            O
          </span>

          <span class="base-feature feature-bottom">
            O
          </span>

        </div>

        <span class="molecular-part-code">
          STRUCTURE 8
        </span>

      </button>

    </div>



    <div class="stage3-construction-instructions">

      <strong>
        Construction rules
      </strong>

      <p>
        Build six DNA nucleotides in the required 5′ → 3′ sequence.
        Each nucleotide has three molecular attachment sites.
        Decide which type of structure belongs in each position.
      </p>

    </div>



    <!-- =====================================================
         STRAND BUILD AREA
         ===================================================== -->

    <div class="stage3-strand-builder">

      <span class="stage3-direction">
        5′
      </span>


      <div class="stage3-nucleotide-grid">


        <!-- NUCLEOTIDE 1 -->

        <div
          class="stage3-nucleotide-slot"
          data-position="0"
        >

          <span class="nucleotide-number">
            1
          </span>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="0"
            data-component="phosphate"
            aria-label="Empty molecular site in nucleotide 1"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="0"
            data-component="sugar"
            aria-label="Empty molecular site in nucleotide 1"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="0"
            data-component="base"
            aria-label="Empty molecular site in nucleotide 1"
          >
            ?
          </button>

        </div>



        <!-- NUCLEOTIDE 2 -->

        <div
          class="stage3-nucleotide-slot"
          data-position="1"
        >

          <span class="nucleotide-number">
            2
          </span>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="1"
            data-component="phosphate"
            aria-label="Empty molecular site in nucleotide 2"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="1"
            data-component="sugar"
            aria-label="Empty molecular site in nucleotide 2"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="1"
            data-component="base"
            aria-label="Empty molecular site in nucleotide 2"
          >
            ?
          </button>

        </div>



        <!-- NUCLEOTIDE 3 -->

        <div
          class="stage3-nucleotide-slot"
          data-position="2"
        >

          <span class="nucleotide-number">
            3
          </span>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="2"
            data-component="phosphate"
            aria-label="Empty molecular site in nucleotide 3"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="2"
            data-component="sugar"
            aria-label="Empty molecular site in nucleotide 3"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="2"
            data-component="base"
            aria-label="Empty molecular site in nucleotide 3"
          >
            ?
          </button>

        </div>



        <!-- NUCLEOTIDE 4 -->

        <div
          class="stage3-nucleotide-slot"
          data-position="3"
        >

          <span class="nucleotide-number">
            4
          </span>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="3"
            data-component="phosphate"
            aria-label="Empty molecular site in nucleotide 4"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="3"
            data-component="sugar"
            aria-label="Empty molecular site in nucleotide 4"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="3"
            data-component="base"
            aria-label="Empty molecular site in nucleotide 4"
          >
            ?
          </button>

        </div>



        <!-- NUCLEOTIDE 5 -->

        <div
          class="stage3-nucleotide-slot"
          data-position="4"
        >

          <span class="nucleotide-number">
            5
          </span>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="4"
            data-component="phosphate"
            aria-label="Empty molecular site in nucleotide 5"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="4"
            data-component="sugar"
            aria-label="Empty molecular site in nucleotide 5"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="4"
            data-component="base"
            aria-label="Empty molecular site in nucleotide 5"
          >
            ?
          </button>

        </div>



        <!-- NUCLEOTIDE 6 -->

        <div
          class="stage3-nucleotide-slot"
          data-position="5"
        >

          <span class="nucleotide-number">
            6
          </span>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="5"
            data-component="phosphate"
            aria-label="Empty molecular site in nucleotide 6"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="5"
            data-component="sugar"
            aria-label="Empty molecular site in nucleotide 6"
          >
            ?
          </button>

          <button
            type="button"
            class="stage3-component-slot"
            data-position="5"
            data-component="base"
            aria-label="Empty molecular site in nucleotide 6"
          >
            ?
          </button>

        </div>

      </div>


      <span class="stage3-direction">
        3′
      </span>

    </div>


    <div class="lab-actions">

      <button
        id="check-stage3-build"
        class="check-button"
        type="button"
      >
        Validate My Strand
      </button>

      <button
        id="clear-stage3-build"
        class="secondary-button"
        type="button"
      >
        Clear Strand
      </button>

    </div>


    <div
      id="stage3-build-feedback"
      class="feedback-box"
      aria-live="polite"
    ></div>

  </section>



  <!-- =====================================================
       PART B
       ===================================================== -->

  <section class="analysis-section">

    <span class="panel-label">
      PART B — BOND ANALYSIS
    </span>

    <h2>
      How are nucleotides connected within one strand?
    </h2>

    <p>
      Examine the connection between two neighbouring nucleotides.
      Select the bond in the model and identify which molecular
      structures participate in this connection.
    </p>


    <div class="stage3-bond-model">

      <div class="mini-nucleotide">

        <span class="mini-phosphate">
          P
        </span>

        <span class="mini-sugar">
          D
        </span>

        <span class="mini-base base-a">
          A
        </span>

      </div>


      <button
        type="button"
        id="stage3-bond-target"
        class="stage3-bond-target"
      >
        Select bond
      </button>


      <div class="mini-nucleotide">

        <span class="mini-phosphate">
          P
        </span>

        <span class="mini-sugar">
          D
        </span>

        <span class="mini-base base-t">
          T
        </span>

      </div>

    </div>


    <div class="choice-grid">

      <label class="choice-card">

        <input
          type="radio"
          name="stage3-bond-answer"
          value="bases"
        >

        <span>
          Two nitrogenous bases
        </span>

      </label>


      <label class="choice-card">

        <input
          type="radio"
          name="stage3-bond-answer"
          value="sugar-phosphate"
        >

        <span>
          A phosphate group and sugars of adjacent nucleotides
        </span>

      </label>


      <label class="choice-card">

        <input
          type="radio"
          name="stage3-bond-answer"
          value="phosphates"
        >

        <span>
          Two phosphate groups
        </span>

      </label>


      <label class="choice-card">

        <input
          type="radio"
          name="stage3-bond-answer"
          value="hydrogen"
        >

        <span>
          Complementary nitrogenous bases
        </span>

      </label>

    </div>


    <button
      id="check-stage3-bond"
      class="check-button"
      type="button"
    >
      Check Bond Analysis
    </button>


    <div
      id="stage3-bond-feedback"
      class="feedback-box"
      aria-live="polite"
    ></div>

  </section>



  <!-- =====================================================
       PART C
       ===================================================== -->

  <section class="analysis-section">

    <span class="panel-label">
      PART C — MODEL DIAGNOSIS
    </span>

    <h2>
      Which model correctly represents one DNA strand?
    </h2>

    <p>
      Evaluate all three models. Only one correctly represents
      the relationship between the sugar-phosphate backbone and
      the nitrogenous bases.
    </p>


    <div class="stage3-model-grid">


      <!-- MODEL A -->

      <article
        class="stage3-model-card"
        data-model="A"
      >

        <span class="model-id">
          MODEL A
        </span>

        <div class="stage3-model-line">

          <span class="model-p">
            P
          </span>

          <span class="model-d">
            D
          </span>

          <span class="model-p">
            P
          </span>

          <span class="model-d">
            D
          </span>

          <span class="model-p">
            P
          </span>

          <span class="model-d">
            D
          </span>

        </div>

        <div class="stage3-attached-bases">

          <span>A</span>
          <span>T</span>
          <span>G</span>

        </div>

        <button
          type="button"
          class="stage3-model-select"
          data-model="A"
        >
          Select Model A
        </button>

      </article>



      <!-- MODEL B -->

      <article
        class="stage3-model-card"
        data-model="B"
      >

        <span class="model-id">
          MODEL B
        </span>

        <div class="stage3-model-line">

          <span class="model-d">
            D
          </span>

          <span class="model-base">
            A
          </span>

          <span class="model-d">
            D
          </span>

          <span class="model-base">
            T
          </span>

          <span class="model-d">
            D
          </span>

          <span class="model-base">
            G
          </span>

        </div>

        <div class="stage3-side-phosphates">

          <span>P</span>
          <span>P</span>
          <span>P</span>

        </div>

        <button
          type="button"
          class="stage3-model-select"
          data-model="B"
        >
          Select Model B
        </button>

      </article>



      <!-- MODEL C -->

      <article
        class="stage3-model-card"
        data-model="C"
      >

        <span class="model-id">
          MODEL C
        </span>

        <div class="stage3-model-line">

          <span class="model-p">
            P
          </span>

          <span class="model-d">
            D
          </span>

          <span class="model-p">
            P
          </span>

          <span class="model-d">
            D
          </span>

          <span class="model-p">
            P
          </span>

          <span class="model-d">
            D
          </span>

        </div>

        <div class="stage3-attached-bases incorrect-attachment">

          <span>A</span>
          <span>T</span>
          <span>G</span>

        </div>

        <button
          type="button"
          class="stage3-model-select"
          data-model="C"
        >
          Select Model C
        </button>

      </article>

    </div>


    <label
      for="stage3-diagnosis-note"
      class="response-label"
    >
      Explain why your selected model is correct and identify
      the structural problem in each incorrect model.
    </label>


    <textarea
      id="stage3-diagnosis-note"
      data-save-field="stage3DiagnosisNote"
      placeholder="Use the organization of the sugar-phosphate backbone and base attachment as evidence..."
    ></textarea>


    <button
      id="check-stage3-diagnosis"
      class="check-button"
      type="button"
    >
      Submit Model Diagnosis
    </button>


    <div
      id="stage3-diagnosis-feedback"
      class="feedback-box"
      aria-live="polite"
    ></div>

  </section>



  <!-- =====================================================
       PART D
       ===================================================== -->

  <section class="analysis-section">

    <span class="panel-label">
      PART D — APPLY YOUR MODEL
    </span>

    <h2>
      Predict what changes and what stays the same.
    </h2>


    <div class="stage3-sequence-change">

      <div>

        <span>
          Original strand
        </span>

        <strong>
          5′ — A T G C C A — 3′
        </strong>

      </div>


      <div class="sequence-arrow">
        →
      </div>


      <div>

        <span>
          Changed strand
        </span>

        <strong>
          5′ — G C T A T G — 3′
        </strong>

      </div>

    </div>


    <label
      for="stage3-note"
      class="response-label"
    >
      If the base sequence changes from the first strand to the
      second, which parts of the molecular structure change and
      which parts remain unchanged? Explain your reasoning.
    </label>


    <textarea
      id="stage3-note"
      data-save-field="stage3Note"
      placeholder="Consider the bases, sugars, phosphates, and overall backbone..."
    ></textarea>


    <button
      id="check-stage3-analysis"
      class="check-button"
      type="button"
    >
      Complete Stage 3
    </button>


    <div
      id="stage3-analysis-feedback"
      class="feedback-box"
      aria-live="polite"
    ></div>

  </section>



  <!-- =====================================================
       NAVIGATION
       ===================================================== -->

  <nav class="stage-navigation">

    <a
      href="stage2.html"
      class="nav-button back-button"
    >
      ← Stage 2
    </a>

    <a
      href="stage4.html"
      id="stage3-next"
      class="nav-button next-button locked"
      aria-disabled="true"
    >
      Continue to Stage 4 →
    </a>

  </nav>

</main>


<footer>
  Biology 30 • Molecular Genetics
</footer>


<script src="script.js"></script>

</body>

</html>
