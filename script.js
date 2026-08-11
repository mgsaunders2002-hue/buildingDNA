/* =========================================================
   BIOLOGY 30 — VIRTUAL DNA CONSTRUCTION LAB
   script.js
   ========================================================= */


/* =========================================================
   1. LAB STORAGE
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

  stage1: {
    phosphate: false,
    deoxyribose: false,
    base: false
  },

  stage2: {
    adenine: "",
    guanine: "",
    cytosine: "",
    thymine: ""
  },

  stage3: {
    sequence: ["", "", "", "", "", ""]
  },

  stage4: {
    sequence: ["", "", "", "", "", ""]
  },

  stage5: {
    topLeft: "",
    topRight: "",
    bottomLeft: "",
    bottomRight: ""
  },

  stage6: {
    helixFormed: false,
    backbone: "",
    centre: "",
    bonds: ""
  },

  challenge: {
    sequence: ["", "", "", "", "", "", "", ""],
    leftEnd: "",
    rightEnd: "",
    atPairs: "",
    gcPairs: "",
    hydrogenBonds: "",
    relationship: ""
  },

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
   2. LOAD / SAVE
   ========================================================= */

function loadLabData() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return structuredClone(defaultLabData);
  }

  try {

    const parsed = JSON.parse(saved);

    return mergeObjects(
      structuredClone(defaultLabData),
      parsed
    );

  } catch (error) {

    console.warn("Could not read saved lab data.");

    return structuredClone(defaultLabData);
  }
}


function mergeObjects(target, source) {

  for (const key in source) {

    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {

      if (!target[key]) {
        target[key] = {};
      }

      mergeObjects(target[key], source[key]);

    } else {

      target[key] = source[key];
    }
  }

  return target;
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

  const status = document.querySelector("#save-status");

  if (!status) return;

  const original = status.textContent;

  status.textContent = "✓ Saved";

  clearTimeout(showSaveStatus.timer);

  showSaveStatus.timer = setTimeout(() => {
    status.textContent = original || "✓ Saved";
  }, 1300);
}


/* =========================================================
   3. GENERAL PAGE SETUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  displayStudentName();

  setupNotebookSaving();

  restoreNotebookFields();

  const page = document.body.dataset.page;

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
      setupFinalChallenge();
      break;

    case "complete":
      setupCompletionPage();
      break;
  }

});


/* =========================================================
   4. STUDENT NAME
   ========================================================= */

function setupHomePage() {

  const nameInput = document.querySelector("#student-name");
  const startButton = document.querySelector("#start-lab");

  if (!nameInput || !startButton) return;

  nameInput.value = labData.studentName || "";

  startButton.addEventListener("click", () => {

    const name = nameInput.value.trim();

    if (!name) {

      alert("Please enter your name before beginning the lab.");

      nameInput.focus();

      return;
    }

    labData.studentName = name;

    saveLabData();

    window.location.href = "stage1.html";
  });


  nameInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      startButton.click();
    }

  });
}


function displayStudentName() {

  const displays = document.querySelectorAll("#student-display");

  displays.forEach(display => {

    if (labData.studentName) {
      display.textContent = labData.studentName;
    }

  });
}


/* =========================================================
   5. LAB NOTEBOOK AUTO-SAVE
   ========================================================= */

function setupNotebookSaving() {

  const fields = document.querySelectorAll("[data-save-field]");

  fields.forEach(field => {

    field.addEventListener("input", () => {

      const key = field.dataset.saveField;

      if (key in labData.notebook) {

        labData.notebook[key] = field.value;

      } else if (key === "finalAT") {

        labData.challenge.atPairs = field.value;

      } else if (key === "finalGC") {

        labData.challenge.gcPairs = field.value;

      } else if (key === "finalHydrogen") {

        labData.challenge.hydrogenBonds = field.value;

      } else if (key === "finalRelationship") {

        labData.challenge.relationship = field.value;
      }

      saveLabData();
    });

  });

}


function restoreNotebookFields() {

  const fields = document.querySelectorAll("[data-save-field]");

  fields.forEach(field => {

    const key = field.dataset.saveField;

    if (key in labData.notebook) {

      field.value = labData.notebook[key] || "";

    } else if (key === "finalAT") {

      field.value = labData.challenge.atPairs || "";

    } else if (key === "finalGC") {

      field.value = labData.challenge.gcPairs || "";

    } else if (key === "finalHydrogen") {

      field.value = labData.challenge.hydrogenBonds || "";

    } else if (key === "finalRelationship") {

      field.value = labData.challenge.relationship || "";
    }

  });
}


/* =========================================================
   6. SHARED FEEDBACK
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


function unlockNext(id) {

  const next = document.querySelector(id);

  if (!next) return;

  next.classList.remove("locked");

  next.setAttribute("aria-disabled", "false");
}


/* =========================================================
   7. CLICK-TO-PLACE HELPERS
   ========================================================= */

let selectedPiece = null;


function selectPiece(piece) {

  document
    .querySelectorAll(".selected-piece")
    .forEach(item => item.classList.remove("selected-piece"));

  selectedPiece = piece;

  piece.classList.add("selected-piece");
}


function clearSelectedPiece() {

  if (selectedPiece) {
    selectedPiece.classList.remove("selected-piece");
  }

  selectedPiece = null;
}


/* =========================================================
   8. STAGE 1 — BUILD A NUCLEOTIDE
   ========================================================= */

function setupStage1() {

  const pieces = document.querySelectorAll(".molecule-piece");
  const dropZones = document.querySelectorAll(".molecule-drop-zone");

  const feedback = document.querySelector("#stage1-feedback");
  const checkButton = document.querySelector("#check-stage1");


  restoreStage1();


  pieces.forEach(piece => {

    piece.addEventListener("click", () => {
      selectPiece(piece);
    });


    piece.addEventListener("dragstart", event => {

      event.dataTransfer.setData(
        "text/plain",
        piece.dataset.piece
      );

      piece.classList.add("dragging");
    });


    piece.addEventListener("dragend", () => {

      piece.classList.remove("dragging");
    });

  });


  dropZones.forEach(zone => {

    zone.addEventListener("dragover", event => {

      event.preventDefault();

      zone.classList.add("drag-over");
    });


    zone.addEventListener("dragleave", () => {

      zone.classList.remove("drag-over");
    });


    zone.addEventListener("drop", event => {

      event.preventDefault();

      zone.classList.remove("drag-over");

      const pieceType =
        event.dataTransfer.getData("text/plain");

      placeStage1Piece(zone, pieceType);
    });


    zone.addEventListener("click", () => {

      if (!selectedPiece) return;

      placeStage1Piece(
        zone,
        selectedPiece.dataset.piece
      );

      clearSelectedPiece();
    });

  });


  checkButton?.addEventListener("click", () => {

    clearFeedback(feedback);

    const correct =
      labData.stage1.phosphate &&
      labData.stage1.deoxyribose &&
      labData.stage1.base;

    if (correct) {

      labData.completedStages.stage1 = true;

      saveLabData();

      showFeedback(
        feedback,
        "success",
        `
          <strong>Nucleotide assembled correctly.</strong><br>
          A DNA nucleotide contains a phosphate group,
          a deoxyribose sugar and one nitrogenous base.
        `
      );

      unlockNext("#stage1-next");

    } else {

      showFeedback(
        feedback,
        "hint",
        `
          Your nucleotide is not complete yet.
          Check that you have included exactly one
          <strong>phosphate</strong>,
          one <strong>deoxyribose sugar</strong>,
          and one <strong>nitrogenous base</strong>.
        `
      );
    }

  });


  if (labData.completedStages.stage1) {
    unlockNext("#stage1-next");
  }
}


function placeStage1Piece(zone, pieceType) {

  const accepted = zone.dataset.accept;

  if (pieceType !== accepted) {

    zone.classList.add("incorrect");

    setTimeout(() => {
      zone.classList.remove("incorrect");
    }, 450);

    const feedback =
      document.querySelector("#stage1-feedback");

    let message = "That component does not belong in this position.";

    if (pieceType === "ribose") {

      message =
        "Ribose is the sugar found in RNA. DNA contains deoxyribose.";

    }

    showFeedback(
      feedback,
      "error",
      message
    );

    return;
  }


  zone.classList.remove("incorrect");
  zone.classList.add("correct");

  if (accepted === "phosphate") {

    labData.stage1.phosphate = true;

    zone.innerHTML =
      `<div class="assembled-phosphate">P</div>`;

  }

  if (accepted === "deoxyribose") {

    labData.stage1.deoxyribose = true;

    zone.innerHTML =
      `<div class="assembled-sugar">D</div>`;

  }

  if (accepted === "base") {

    labData.stage1.base = true;

    zone.innerHTML =
      `<div class="assembled-base base-a">A</div>`;
  }

  saveLabData();
}


function restoreStage1() {

  const mapping = {
    phosphate: ".phosphate-drop",
    deoxyribose: ".sugar-drop",
    base: ".base-drop"
  };

  Object.keys(mapping).forEach(key => {

    if (!labData.stage1[key]) return;

    const zone = document.querySelector(mapping[key]);

    if (!zone) return;

    zone.classList.add("correct");

    if (key === "phosphate") {
      zone.innerHTML =
        `<div class="assembled-phosphate">P</div>`;
    }

    if (key === "deoxyribose") {
      zone.innerHTML =
        `<div class="assembled-sugar">D</div>`;
    }

    if (key === "base") {
      zone.innerHTML =
        `<div class="assembled-base base-a">A</div>`;
    }

  });
}


/* =========================================================
   9. STAGE 2 — PURINES / PYRIMIDINES
   ========================================================= */

function setupStage2() {

  const cards =
    document.querySelectorAll(".visual-base-card");

  const zones =
    document.querySelectorAll(".base-drop-area");

  const feedback =
    document.querySelector("#stage2-feedback");

  restoreStage2();


  cards.forEach(card => {

    card.addEventListener("click", () => {
      selectPiece(card);
    });


    card.addEventListener("dragstart", event => {

      event.dataTransfer.setData(
        "text/plain",
        card.dataset.base
      );

      card.classList.add("dragging");
    });


    card.addEventListener("dragend", () => {

      card.classList.remove("dragging");
    });

  });


  zones.forEach(zone => {

    zone.addEventListener("dragover", event => {

      event.preventDefault();
      zone.classList.add("drag-over");
    });


    zone.addEventListener("dragleave", () => {

      zone.classList.remove("drag-over");
    });


    zone.addEventListener("drop", event => {

      event.preventDefault();

      zone.classList.remove("drag-over");

      const base =
        event.dataTransfer.getData("text/plain");

      classifyBase(base, zone);
    });


    zone.addEventListener("click", () => {

      if (!selectedPiece) return;

      classifyBase(
        selectedPiece.dataset.base,
        zone
      );

      clearSelectedPiece();
    });

  });


  document
    .querySelector("#check-stage2")
    ?.addEventListener("click", () => {

      const correct =
        labData.stage2.adenine === "purine" &&
        labData.stage2.guanine === "purine" &&
        labData.stage2.cytosine === "pyrimidine" &&
        labData.stage2.thymine === "pyrimidine";

      if (correct) {

        labData.completedStages.stage2 = true;

        saveLabData();

        showFeedback(
          feedback,
          "success",
          `
            <strong>Correct.</strong>
            Adenine and guanine are purines because they
            have two-ring structures. Cytosine and thymine
            are pyrimidines because they have one ring.
          `
        );

        unlockNext("#stage2-next");

      } else {

        showFeedback(
          feedback,
          "hint",
          `
            Look closely at the ring structures.
            <strong>Purines have two rings</strong> and
            <strong>pyrimidines have one ring.</strong>
          `
        );
      }

    });


  if (labData.completedStages.stage2) {
    unlockNext("#stage2-next");
  }
}


function classifyBase(base, zone) {

  const parent = zone.closest(".classification-zone");

  const category = parent.dataset.category;

  labData.stage2[base] = category;

  saveLabData();

  renderStage2Assignments();
}


function renderStage2Assignments() {

  const purineZone =
    document.querySelector("#purine-drop");

  const pyrimidineZone =
    document.querySelector("#pyrimidine-drop");

  if (!purineZone || !pyrimidineZone) return;

  purineZone.innerHTML = "";
  pyrimidineZone.innerHTML = "";

  const labels = {
    adenine: "Adenine (A)",
    guanine: "Guanine (G)",
    cytosine: "Cytosine (C)",
    thymine: "Thymine (T)"
  };


  Object.keys(labData.stage2).forEach(base => {

    const category = labData.stage2[base];

    if (!category) return;

    const tag = document.createElement("button");

    tag.type = "button";

    tag.className = "molecule-piece";

    tag.style.width = "auto";

    tag.textContent = labels[base];

    tag.addEventListener("click", () => {

      labData.stage2[base] = "";

      saveLabData();

      renderStage2Assignments();
    });


    if (category === "purine") {
      purineZone.appendChild(tag);
    }

    if (category === "pyrimidine") {
      pyrimidineZone.appendChild(tag);
    }

  });


  if (!purineZone.children.length) {
    purineZone.textContent = "Drop bases here";
  }

  if (!pyrimidineZone.children.length) {
    pyrimidineZone.textContent = "Drop bases here";
  }
}


function restoreStage2() {
  renderStage2Assignments();
}


/* =========================================================
   10. STAGE 3 — BUILD FIRST STRAND
   ========================================================= */

function setupStage3() {

  const nucleotides =
    document.querySelectorAll(".mini-nucleotide");

  const slots =
    document.querySelectorAll(".strand-slot");

  const feedback =
    document.querySelector("#stage3-feedback");

  const target = ["A", "T", "G", "C", "C", "A"];


  restoreStage3();


  nucleotides.forEach(nucleotide => {

    nucleotide.addEventListener("click", () => {
      selectPiece(nucleotide);
    });


    nucleotide.addEventListener("dragstart", event => {

      event.dataTransfer.setData(
        "text/plain",
        nucleotide.dataset.base
      );
    });

  });


  slots.forEach(slot => {

    slot.addEventListener("dragover", event => {

      event.preventDefault();
      slot.classList.add("drag-over");
    });


    slot.addEventListener("dragleave", () => {

      slot.classList.remove("drag-over");
    });


    slot.addEventListener("drop", event => {

      event.preventDefault();

      slot.classList.remove("drag-over");

      const base =
        event.dataTransfer.getData("text/plain");

      placeStage3Base(slot, base);
    });


    slot.addEventListener("click", () => {

      if (!selectedPiece) return;

      placeStage3Base(
        slot,
        selectedPiece.dataset.base
      );

      clearSelectedPiece();
    });

  });


  document
    .querySelector("#check-stage3")
    ?.addEventListener("click", () => {

      const sequence = labData.stage3.sequence;

      const correct =
        sequence.every(
          (base, index) => base === target[index]
        );

      if (correct) {

        labData.completedStages.stage3 = true;

        saveLabData();

        showFeedback(
          feedback,
          "success",
          `
            <strong>DNA strand constructed correctly.</strong><br>
            Notice the repeating phosphate and deoxyribose
            structure along the strand. This forms the
            <strong>sugar-phosphate backbone.</strong>
          `
        );

        unlockNext("#stage3-next");

      } else {

        showFeedback(
          feedback,
          "hint",
          `
            Compare the bases you built with the target
            sequence <strong>5′–A T G C C A–3′</strong>.
            Your nucleotides must appear in that exact order.
          `
        );
      }

    });


  if (labData.completedStages.stage3) {
    unlockNext("#stage3-next");
  }
}


function placeStage3Base(slot, base) {

  const position = Number(slot.dataset.position);

  labData.stage3.sequence[position] = base;

  saveLabData();

  renderStage3Slot(slot, base);
}


function renderStage3Slot(slot, base) {

  slot.innerHTML = `
    <div class="mini-nucleotide">
      <span class="mini-phosphate">P</span>
      <span class="mini-sugar">D</span>
      <span class="mini-base base-${base.toLowerCase()}">
        ${base}
      </span>
    </div>
  `;
}


function restoreStage3() {

  document
    .querySelectorAll(".strand-slot")
    .forEach(slot => {

      const position = Number(slot.dataset.position);

      const base =
        labData.stage3.sequence[position];

      if (base) {
        renderStage3Slot(slot, base);
      }

    });
}


/* =========================================================
   11. STAGE 4 — COMPLEMENTARY STRAND
   ========================================================= */

function setupStage4() {

  const choices =
    document.querySelectorAll(".base-choice");

  const slots =
    document.querySelectorAll(".complement-slot");

  const feedback =
    document.querySelector("#stage4-feedback");

  const correctSequence =
    ["T", "A", "C", "G", "G", "T"];


  restoreStage4();


  choices.forEach(choice => {

    choice.addEventListener("click", () => {
      selectPiece(choice);
    });

  });


  slots.forEach(slot => {

    slot.addEventListener("click", () => {

      if (!selectedPiece) {

        slot.classList.toggle("selected");

        return;
      }

      const base = selectedPiece.dataset.base;

      placeStage4Base(slot, base);

      clearSelectedPiece();
    });

  });


  document
    .querySelector("#check-stage4")
    ?.addEventListener("click", () => {

      const sequence =
        labData.stage4.sequence;

      let incorrectIndex = -1;

      sequence.forEach((base, index) => {

        if (
          incorrectIndex === -1 &&
          base !== correctSequence[index]
        ) {
          incorrectIndex = index;
        }

      });


      if (incorrectIndex === -1) {

        labData.completedStages.stage4 = true;

        saveLabData();

        showAllHydrogenBonds();

        showFeedback(
          feedback,
          "success",
          `
            <strong>Complementary strand complete.</strong><br>
            Each base has paired correctly:
            A with T and C with G. The two strands are now
            held together by hydrogen bonds.
          `
        );

        unlockNext("#stage4-next");

      } else {

        const template =
          ["A", "T", "G", "C", "C", "A"];

        const original =
          template[incorrectIndex];

        const chosen =
          sequence[incorrectIndex] || "nothing";

        showFeedback(
          feedback,
          "error",
          `
            Check base pair ${incorrectIndex + 1}.
            The template contains <strong>${original}</strong>,
            but you placed <strong>${chosen}</strong>.
            Apply the complementary base-pairing rule.
          `
        );
      }

    });


  if (labData.completedStages.stage4) {

    showAllHydrogenBonds();

    unlockNext("#stage4-next");
  }
}


function placeStage4Base(slot, base) {

  const position = Number(slot.dataset.position);

  labData.stage4.sequence[position] = base;

  saveLabData();

  renderStage4Slot(slot, base);

  updateHydrogenBond(position);
}


function renderStage4Slot(slot, base) {

  slot.innerHTML = `
    <div class="built-nucleotide">
      <span class="dna-base base-${base.toLowerCase()}">
        ${base}
      </span>
      <span class="backbone-unit sugar">D</span>
      <span class="backbone-unit">P</span>
    </div>
  `;
}


function restoreStage4() {

  document
    .querySelectorAll(".complement-slot")
    .forEach(slot => {

      const position =
        Number(slot.dataset.position);

      const base =
        labData.stage4.sequence[position];

      if (base) {

        renderStage4Slot(slot, base);

        updateHydrogenBond(position);
      }

    });
}


function updateHydrogenBond(position) {

  const template =
    ["A", "T", "G", "C", "C", "A"];

  const complements = {
    A: "T",
    T: "A",
    G: "C",
    C: "G"
  };

  const chosen =
    labData.stage4.sequence[position];

  const correct =
    chosen === complements[template[position]];

  const bond =
    document.querySelector(
      `.bond-zone[data-position="${position}"]`
    );

  if (!bond) return;

  bond.classList.toggle("connected", correct);


  if (correct) {

    const pair = template[position];

    bond.innerHTML =
      pair === "G" || pair === "C"
        ? "···"
        : "··";

  } else {

    bond.innerHTML = "";
  }
}


function showAllHydrogenBonds() {

  for (let i = 0; i < 6; i++) {
    updateHydrogenBond(i);
  }
}


/* =========================================================
   12. STAGE 5 — ANTIPARALLEL
   ========================================================= */

function setupStage5() {

  const pieces =
    document.querySelectorAll(".direction-piece");

  const drops =
    document.querySelectorAll(".direction-drop");

  const feedback =
    document.querySelector("#stage5-feedback");


  restoreStage5();


  pieces.forEach(piece => {

    piece.addEventListener("click", () => {
      selectPiece(piece);
    });


    piece.addEventListener("dragstart", event => {

      event.dataTransfer.setData(
        "text/plain",
        piece.dataset.direction
      );
    });

  });


  drops.forEach(drop => {

    drop.addEventListener("dragover", event => {
      event.preventDefault();
    });


    drop.addEventListener("drop", event => {

      event.preventDefault();

      const direction =
        event.dataTransfer.getData("text/plain");

      placeDirection(drop, direction);
    });


    drop.addEventListener("click", () => {

      if (!selectedPiece) return;

      placeDirection(
        drop,
        selectedPiece.dataset.direction
      );

      clearSelectedPiece();
    });

  });


  document
    .querySelector("#check-stage5")
    ?.addEventListener("click", () => {

      const correct =
        labData.stage5.topLeft === "5" &&
        labData.stage5.topRight === "3" &&
        labData.stage5.bottomLeft === "3" &&
        labData.stage5.bottomRight === "5";

      if (correct) {

        labData.completedStages.stage5 = true;

        saveLabData();

        drops.forEach(drop =>
          drop.classList.add("correct")
        );

        showFeedback(
          feedback,
          "success",
          `
            <strong>Correct.</strong>
            The strands are complementary and
            <strong>antiparallel</strong>.
            One runs 5′ → 3′ while the other runs 3′ → 5′.
          `
        );

        unlockNext("#stage5-next");

      } else {

        showFeedback(
          feedback,
          "hint",
          `
            Complementary base pairing is correct, but now
            focus on strand direction. If the top strand runs
            <strong>5′ → 3′</strong>, the bottom strand must run
            <strong>3′ → 5′</strong>.
          `
        );
      }

    });


  if (labData.completedStages.stage5) {

    drops.forEach(drop =>
      drop.classList.add("correct")
    );

    unlockNext("#stage5-next");
  }
}


function placeDirection(drop, direction) {

  const map = {
    "top-left-direction": "topLeft",
    "top-right-direction": "topRight",
    "bottom-left-direction": "bottomLeft",
    "bottom-right-direction": "bottomRight"
  };

  const key = map[drop.id];

  if (!key) return;

  labData.stage5[key] = direction;

  drop.textContent = direction + "′";

  saveLabData();
}


function restoreStage5() {

  const map = {
    topLeft: "top-left-direction",
    topRight: "top-right-direction",
    bottomLeft: "bottom-left-direction",
    bottomRight: "bottom-right-direction"
  };

  Object.keys(map).forEach(key => {

    const value = labData.stage5[key];

    if (!value) return;

    const element =
      document.querySelector(`#${map[key]}`);

    if (element) {
      element.textContent = value + "′";
    }

  });
}


/* =========================================================
   13. STAGE 6 — DOUBLE HELIX
   ========================================================= */

function setupStage6() {

  const model =
    document.querySelector("#dna-transform-model");

  const button =
    document.querySelector("#form-helix");

  const feedback =
    document.querySelector("#stage6-feedback");

  const backbone =
    document.querySelector("#label-backbone");

  const centre =
    document.querySelector("#label-centre");

  const bonds =
    document.querySelector("#label-bonds");


  if (labData.stage6.helixFormed && model) {

    model.classList.add("helix-mode");

    if (button) {
      button.textContent = "Double Helix Formed ✓";
    }

  }


  if (backbone) {
    backbone.value = labData.stage6.backbone || "";
  }

  if (centre) {
    centre.value = labData.stage6.centre || "";
  }

  if (bonds) {
    bonds.value = labData.stage6.bonds || "";
  }


  button?.addEventListener("click", () => {

    model?.classList.add("helix-mode");

    labData.stage6.helixFormed = true;

    saveLabData();

    button.textContent =
      "Double Helix Formed ✓";
  });


  backbone?.addEventListener("change", () => {

    labData.stage6.backbone = backbone.value;

    saveLabData();
  });


  centre?.addEventListener("change", () => {

    labData.stage6.centre = centre.value;

    saveLabData();
  });


  bonds?.addEventListener("change", () => {

    labData.stage6.bonds = bonds.value;

    saveLabData();
  });


  document
    .querySelector("#check-stage6")
    ?.addEventListener("click", () => {

      if (!labData.stage6.helixFormed) {

        showFeedback(
          feedback,
          "hint",
          `
            Form the double helix before completing this stage.
          `
        );

        return;
      }


      const correct =
        backbone.value === "backbone" &&
        centre.value === "bases" &&
        bonds.value === "hydrogen";

      if (correct) {

        labData.completedStages.stage6 = true;

        saveLabData();

        showFeedback(
          feedback,
          "success",
          `
            <strong>DNA construction complete.</strong><br>
            The sugar-phosphate backbones form the outside,
            complementary bases face inward, and hydrogen bonds
            hold the two strands together.
          `
        );

        unlockNext("#stage6-next");

      } else {

        showFeedback(
          feedback,
          "hint",
          `
            Examine the completed molecule again.
            Ask yourself which structures make up the outside,
            what forms the rungs, and what holds the two strands
            together.
          `
        );
      }

    });


  if (labData.completedStages.stage6) {
    unlockNext("#stage6-next");
  }
}


/* =========================================================
   14. FINAL CHALLENGE
   ========================================================= */

function setupFinalChallenge() {

  const slots =
    document.querySelectorAll(".final-base-slot");

  const endDrops =
    document.querySelectorAll(".final-end-drop");

  const feedback =
    document.querySelector("#final-feedback");

  const template =
    ["G", "C", "A", "T", "T", "G", "C", "C"];

  const correctComplement =
    ["C", "G", "T", "A", "A", "C", "G", "G"];


  restoreFinalChallenge();


  /*
    Because the final page deliberately removes much of the
    scaffolding, clicking an empty base slot cycles through
    A → T → C → G.
  */

  slots.forEach(slot => {

    slot.addEventListener("click", () => {

      const position =
        Number(slot.dataset.position);

      const current =
        labData.challenge.sequence[position];

      const cycle =
        ["", "A", "T", "C", "G"];

      const currentIndex =
        cycle.indexOf(current);

      const next =
        cycle[(currentIndex + 1) % cycle.length];

      labData.challenge.sequence[position] = next;

      saveLabData();

      renderFinalBaseSlot(slot, next);
    });

  });


  endDrops.forEach(drop => {

    drop.addEventListener("click", () => {

      const position =
        drop.dataset.position;

      const key =
        position === "left"
          ? "leftEnd"
          : "rightEnd";

      const current =
        labData.challenge[key];

      const next =
        current === ""
          ? "3"
          : current === "3"
          ? "5"
          : "";

      labData.challenge[key] = next;

      drop.textContent =
        next ? next + "′" : "?";

      saveLabData();
    });

  });


  document
    .querySelector("#submit-final")
    ?.addEventListener("click", () => {

      const sequenceCorrect =
        labData.challenge.sequence.every(
          (base, index) =>
            base === correctComplement[index]
        );

      const directionCorrect =
        labData.challenge.leftEnd === "3" &&
        labData.challenge.rightEnd === "5";

      /*
        Template:
        G C A T T G C C

        A-T pairs:
        A = 1
        T = 2
        total AT pairs = 3

        GC pairs = 5

        Hydrogen bonds =
        3 AT × 2 = 6
        5 GC × 3 = 15
        total = 21
      */

      const analysisCorrect =
        Number(labData.challenge.atPairs) === 3 &&
        Number(labData.challenge.gcPairs) === 5 &&
        Number(labData.challenge.hydrogenBonds) === 21 &&
        labData.challenge.relationship === "antiparallel";


      if (
        sequenceCorrect &&
        directionCorrect &&
        analysisCorrect
      ) {

        labData.completedStages.challenge = true;

        saveLabData();

        showFeedback(
          feedback,
          "success",
          `
            <strong>Final DNA molecule constructed correctly.</strong><br>
            You correctly applied complementary base pairing,
            antiparallel strand orientation and hydrogen-bond
            calculations.
          `
        );

        unlockNext("#final-next");

      } else {

        let hints = [];


        if (!sequenceCorrect) {

          hints.push(
            "Check the complementary base sequence."
          );
        }


        if (!directionCorrect) {

          hints.push(
            "Check the 5′ and 3′ orientation of the second strand."
          );
        }


        if (
          Number(labData.challenge.atPairs) !== 3 ||
          Number(labData.challenge.gcPairs) !== 5
        ) {

          hints.push(
            "Count the A–T and G–C base pairs again."
          );
        }


        if (
          Number(labData.challenge.hydrogenBonds) !== 21
        ) {

          hints.push(
            "Remember: A–T has 2 hydrogen bonds and G–C has 3."
          );
        }


        if (
          labData.challenge.relationship !== "antiparallel"
        ) {

          hints.push(
            "Review the relationship between the two strand directions."
          );
        }


        showFeedback(
          feedback,
          "hint",
          `
            <strong>Not quite yet.</strong><br>
            ${hints.join("<br>")}
          `
        );
      }

    });


  if (labData.completedStages.challenge) {
    unlockNext("#final-next");
  }
}


function renderFinalBaseSlot(slot, base) {

  if (!base) {

    slot.innerHTML = "?";

    return;
  }

  slot.innerHTML = `
    <span class="dna-base base-${base.toLowerCase()}">
      ${base}
    </span>
  `;
}


function restoreFinalChallenge() {

  document
    .querySelectorAll(".final-base-slot")
    .forEach(slot => {

      const position =
        Number(slot.dataset.position);

      const base =
        labData.challenge.sequence[position];

      renderFinalBaseSlot(slot, base);
    });


  const left =
    document.querySelector(
      '.final-end-drop[data-position="left"]'
    );

  const right =
    document.querySelector(
      '.final-end-drop[data-position="right"]'
    );


  if (left) {

    left.textContent =
      labData.challenge.leftEnd
        ? labData.challenge.leftEnd + "′"
        : "?";
  }


  if (right) {

    right.textContent =
      labData.challenge.rightEnd
        ? labData.challenge.rightEnd + "′"
        : "?";
  }
}


/* =========================================================
   15. COMPLETION PAGE
   ========================================================= */

function setupCompletionPage() {

  const student =
    document.querySelector("#completion-student");

  const sequenceDisplay =
    document.querySelector("#final-sequence-display");

  const notebookOutput =
    document.querySelector("#notebook-output");


  if (student) {

    student.textContent =
      labData.studentName
        ? `${labData.studentName}, you completed the Biology 30 DNA Construction Lab.`
        : "Biology 30 DNA Construction Lab completed.";
  }


  if (sequenceDisplay) {

    const complement =
      labData.challenge.sequence.join(" ");

    sequenceDisplay.innerHTML = `
      <div>5′ — G C A T T G C C — 3′</div>
      <div>3′ — ${complement} — 5′</div>
    `;
  }


  if (notebookOutput) {

    notebookOutput.innerHTML =
      buildNotebookHTML();
  }


  document
    .querySelector("#download-report")
    ?.addEventListener(
      "click",
      downloadLabReport
    );


  document
    .querySelector("#print-report")
    ?.addEventListener(
      "click",
      () => window.print()
    );


  document
    .querySelector("#start-over")
    ?.addEventListener(
      "click",
      startLabAgain
    );
}


/* =========================================================
   16. NOTEBOOK OUTPUT
   ========================================================= */

function buildNotebookHTML() {

  const entries = [

    [
      "Stage 1 — DNA Nucleotide",
      labData.notebook.stage1Note
    ],

    [
      "Stage 2 — Purines and Pyrimidines",
      labData.notebook.stage2Note
    ],

    [
      "Stage 3 — Sugar-Phosphate Backbone",
      labData.notebook.stage3Note
    ],

    [
      "Stage 4 — Complementary Strands",
      labData.notebook.stage4Note
    ],

    [
      "Stage 5 — Antiparallel DNA",
      labData.notebook.stage5Note
    ],

    [
      "Stage 6 — DNA Structure",
      labData.notebook.stage6Note
    ],

    [
      "Final Reflection",
      labData.notebook.finalNote
    ]
  ];


  return entries
    .map(([heading, response]) => `

      <div class="record-item">

        <strong>${heading}</strong>

        <p>
          ${escapeHTML(response || "No response recorded.")}
        </p>

      </div>

    `)
    .join("");
}


/* =========================================================
   17. DOWNLOAD LAB REPORT
   ========================================================= */

function downloadLabReport() {

  const date =
    new Date().toLocaleDateString();

  const complement =
    labData.challenge.sequence.join("");


  const report = `
BIOLOGY 30
VIRTUAL DNA CONSTRUCTION LAB

Student:
${labData.studentName || "Not recorded"}

Date:
${date}

--------------------------------------------------
LAB COMPLETION
--------------------------------------------------

Stage 1 — Build a DNA Nucleotide
Completed: ${yesNo(labData.completedStages.stage1)}

Stage 2 — Purines and Pyrimidines
Completed: ${yesNo(labData.completedStages.stage2)}

Stage 3 — Build a DNA Strand
Completed: ${yesNo(labData.completedStages.stage3)}

Stage 4 — Build the Complementary Strand
Completed: ${yesNo(labData.completedStages.stage4)}

Stage 5 — Antiparallel DNA
Completed: ${yesNo(labData.completedStages.stage5)}

Stage 6 — Double Helix
Completed: ${yesNo(labData.completedStages.stage6)}

Final Challenge
Completed: ${yesNo(labData.completedStages.challenge)}


--------------------------------------------------
FINAL DNA MOLECULE
--------------------------------------------------

5′ — G C A T T G C C — 3′
3′ — ${spacedSequence(complement)} — 5′


A–T base pairs:
${labData.challenge.atPairs}

G–C base pairs:
${labData.challenge.gcPairs}

Total hydrogen bonds:
${labData.challenge.hydrogenBonds}

Relationship between strands:
${formatRelationship(
  labData.challenge.relationship
)}


--------------------------------------------------
LAB NOTEBOOK
--------------------------------------------------

STAGE 1
What three components make up every DNA nucleotide?

${labData.notebook.stage1Note || "No response recorded."}


STAGE 2
What structural difference separates purines from pyrimidines?

${labData.notebook.stage2Note || "No response recorded."}


STAGE 3
What forms the structural backbone of a DNA strand?

${labData.notebook.stage3Note || "No response recorded."}


STAGE 4
Why is the second DNA strand described as complementary?

${labData.notebook.stage4Note || "No response recorded."}


STAGE 5
Explain what antiparallel means in a DNA molecule.

${labData.notebook.stage5Note || "No response recorded."}


STAGE 6
How does the structure of DNA help it store genetic information?

${labData.notebook.stage6Note || "No response recorded."}


FINAL REFLECTION
Describe how the different parts of DNA work together to create
a stable molecule capable of storing genetic information.

${labData.notebook.finalNote || "No response recorded."}


--------------------------------------------------
END OF LAB RECORD
--------------------------------------------------
`;


  const blob =
    new Blob(
      [report],
      { type: "text/plain;charset=utf-8" }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  const safeName =
    (labData.studentName || "student")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");


  link.href = url;

  link.download =
    `${safeName}_DNA_Construction_Lab.txt`;


  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}


/* =========================================================
   18. START OVER
   ========================================================= */

function startLabAgain() {

  const confirmed = confirm(
    "Start the lab again? This will erase all saved progress and notebook responses on this device."
  );

  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);

  window.location.href = "index.html";
}


/* =========================================================
   19. UTILITIES
   ========================================================= */

function yesNo(value) {
  return value ? "Yes" : "No";
}


function spacedSequence(sequence) {

  return sequence
    ? sequence.split("").join(" ")
    : "";
}


function formatRelationship(value) {

  if (value === "antiparallel") {
    return "Complementary and antiparallel";
  }

  if (value === "parallel") {
    return "Parallel";
  }

  if (value === "identical") {
    return "Identical";
  }

  return "Not recorded";
}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
