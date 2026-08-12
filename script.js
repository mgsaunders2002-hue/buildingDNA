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
