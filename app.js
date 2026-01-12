const weekGrid = document.getElementById("weekGrid");
const landingSection = document.getElementById("landing");
const appSection = document.getElementById("app");
const recipesSection = document.getElementById("recipes");
const enterAppButton = document.getElementById("enterApp");
const enterRecipesButton = document.getElementById("enterRecipes");
const backToLandingButton = document.getElementById("backToLanding");
const openRecipesFromAppButton = document.getElementById("openRecipesFromApp");
const backToLandingFromRecipesButton = document.getElementById(
  "backToLandingFromRecipes",
);
const openAppFromRecipesButton = document.getElementById("openAppFromRecipes");
const weekStartInput = document.getElementById("weekStart");
const weekRange = document.getElementById("weekRange");
const saveStatus = document.getElementById("saveStatus");
const prevWeekButton = document.getElementById("prevWeek");
const nextWeekButton = document.getElementById("nextWeek");
const thisWeekButton = document.getElementById("thisWeek");
const clearWeekButton = document.getElementById("clearWeek");
const shoppingList = document.getElementById("shoppingList");
const shoppingEmpty = document.getElementById("shoppingEmpty");

const recipeForm = document.getElementById("recipeForm");
const recipeFormTitle = document.getElementById("recipeFormTitle");
const recipeNameInput = document.getElementById("recipeName");
const recipeUrlInput = document.getElementById("recipeUrl");
const recipeServingsInput = document.getElementById("recipeServings");
const ingredientList = document.getElementById("ingredientList");
const ingredientAddButton = document.getElementById("ingredientAdd");
const recipeSaveButton = document.getElementById("recipeSave");
const recipeCancelButton = document.getElementById("recipeCancel");
const recipeSearchInput = document.getElementById("recipeSearch");
const recipeList = document.getElementById("recipeList");
const recipeEmpty = document.getElementById("recipeEmpty");
const recipeModal = document.getElementById("recipeModal");
const recipeModalBackdrop = document.getElementById("recipeModalBackdrop");
const recipeModalForm = document.getElementById("recipeModalForm");
const recipeModalNameInput = document.getElementById("recipeModalName");
const recipeModalUrlInput = document.getElementById("recipeModalUrl");
const recipeModalServingsInput = document.getElementById("recipeModalServings");
const recipeModalIngredientList = document.getElementById("recipeModalIngredientList");
const recipeModalIngredientAddButton = document.getElementById("recipeModalIngredientAdd");
const recipeModalCancelButton = document.getElementById("recipeModalCancel");
const recipeModalCloseButton = document.getElementById("recipeModalClose");

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
const RECIPE_DB_KEY = "recipe-db-v1";
const SERVING_OPTIONS = [1, 2];
const DEFAULT_BASE_SERVINGS = 2;

let currentWeekStart = startOfWeek(new Date());
let currentData = loadWeekData(currentWeekStart);
let recipeDb = loadRecipeDb();
let saveTimer = null;
let editingRecipeId = null;
let modalDayKey = null;

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function startOfWeek(date) {
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = (base.getDay() + 6) % 7;
  base.setDate(base.getDate() - weekday);
  return base;
}

function storageKey(weekStart) {
  return `recipe-week-${formatDate(weekStart)}`;
}

function loadWeekData(weekStart) {
  const key = storageKey(weekStart);
  const raw = localStorage.getItem(key);
  if (!raw) {
    return { days: {}, shoppingChecked: {}, updatedAt: null };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      days: parsed.days || {},
      shoppingChecked: parsed.shoppingChecked || {},
      updatedAt: parsed.updatedAt || null,
    };
  } catch (error) {
    return { days: {}, shoppingChecked: {}, updatedAt: null };
  }
}

function saveWeekData() {
  const key = storageKey(currentWeekStart);
  const payload = {
    days: currentData.days,
    shoppingChecked: currentData.shoppingChecked || {},
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(payload));
    return true;
  } catch (error) {
    return false;
  }
}

function setSaveStatus(text) {
  saveStatus.textContent = text;
}

function scheduleSave() {
  setSaveStatus("保存中...");
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(() => {
    const ok = saveWeekData();
    setSaveStatus(ok ? "保存済み" : "保存に失敗");
  }, 300);
}

function commitSave() {
  setSaveStatus("保存中...");
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  const ok = saveWeekData();
  setSaveStatus(ok ? "保存済み" : "保存に失敗");
}

function getDayData(key) {
  if (!currentData.days[key]) {
    currentData.days[key] = {};
  }
  const day = currentData.days[key];
  if (typeof day.dinner === "string" && !day.dinnerId && !day.dinnerText) {
    day.dinnerText = day.dinner;
    delete day.dinner;
  }
  return day;
}

function getShoppingState() {
  if (!currentData.shoppingChecked || typeof currentData.shoppingChecked !== "object") {
    currentData.shoppingChecked = {};
  }
  return currentData.shoppingChecked;
}

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function normalizeNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    return 0;
  }
  return number;
}

function formatNumber(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function normalizeBaseServings(value) {
  const number = Number(value);
  if (SERVING_OPTIONS.includes(number)) {
    return number;
  }
  return DEFAULT_BASE_SERVINGS;
}

function resolveDayServings(dayData, recipe) {
  if (!recipe) {
    return 0;
  }
  const base = normalizeBaseServings(recipe.baseServings);
  const custom = normalizeNumber(dayData.servings);
  return custom > 0 ? custom : base;
}

function normalizeIngredient(entry) {
  if (typeof entry === "string") {
    return { name: entry, count: 1, grams: 0 };
  }
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const name = String(entry.name || "").trim();
  if (!name) {
    return null;
  }
  return {
    name,
    count: normalizeNumber(entry.count),
    grams: normalizeNumber(entry.grams),
  };
}

function normalizeIngredients(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.map(normalizeIngredient).filter(Boolean);
}

function formatIngredientDisplay(ingredient) {
  const parts = [];
  if (ingredient.count > 0) {
    parts.push(`x${formatNumber(ingredient.count)}`);
  }
  if (ingredient.grams > 0) {
    parts.push(`${formatNumber(ingredient.grams)}g`);
  }
  if (parts.length === 0) {
    return ingredient.name;
  }
  return `${ingredient.name} ${parts.join(" / ")}`;
}

function loadRecipeDb() {
  const raw = localStorage.getItem(RECIPE_DB_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((recipe) => ({
      ...recipe,
      baseServings: normalizeBaseServings(recipe.baseServings),
      ingredients: normalizeIngredients(recipe.ingredients),
    }));
  } catch (error) {
    return [];
  }
}

function saveRecipeDb() {
  try {
    localStorage.setItem(RECIPE_DB_KEY, JSON.stringify(recipeDb));
    return true;
  } catch (error) {
    return false;
  }
}

function searchRecipes(query) {
  const normalized = normalizeText(query);
  if (!normalized) {
    return [];
  }
  return recipeDb.filter((recipe) => {
    const ingredientsText = recipe.ingredients
      .map((ingredient) => ingredient.name)
      .join(" ");
    const haystack = normalizeText(`${recipe.name} ${ingredientsText}`);
    return haystack.includes(normalized);
  });
}

function getRecipeById(id) {
  return recipeDb.find((recipe) => recipe.id === id) || null;
}

function getRecipeByName(name) {
  const normalized = normalizeText(name);
  if (!normalized) {
    return null;
  }
  return recipeDb.find((recipe) => normalizeText(recipe.name) === normalized) || null;
}

function selectRecipeForDay(dayKey, recipe) {
  const entry = getDayData(dayKey);
  entry.dinnerId = recipe.id;
  entry.servings = normalizeBaseServings(recipe.baseServings);
  delete entry.dinnerText;
  commitSave();
  renderWeek(currentWeekStart);
}

function openRecipeModal({ dayKey, name }) {
  modalDayKey = dayKey;
  recipeModalForm.reset();
  recipeModalNameInput.value = name || "";
  recipeModalUrlInput.value = "";
  recipeModalServingsInput.value = String(DEFAULT_BASE_SERVINGS);
  resetIngredientList(recipeModalIngredientList);
  recipeModal.hidden = false;
  document.body.classList.add("modal-open");
  recipeModalNameInput.focus();
}

function closeRecipeModal() {
  recipeModal.hidden = true;
  document.body.classList.remove("modal-open");
  modalDayKey = null;
}

function createIngredientRow(listEl, { name = "", count = "", grams = "" } = {}) {
  const row = document.createElement("div");
  row.className = "ingredient-row";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "例：玉ねぎ";
  nameInput.value = name;
  nameInput.dataset.field = "name";

  const countInput = document.createElement("input");
  countInput.type = "number";
  countInput.min = "0";
  countInput.step = "1";
  countInput.placeholder = "1";
  countInput.value = count ? String(count) : "";
  countInput.dataset.field = "count";

  const gramsInput = document.createElement("input");
  gramsInput.type = "number";
  gramsInput.min = "0";
  gramsInput.step = "1";
  gramsInput.placeholder = "g";
  gramsInput.value = grams ? String(grams) : "";
  gramsInput.dataset.field = "grams";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "削除";
  removeButton.addEventListener("click", () => {
    row.remove();
    if (listEl.children.length === 0) {
      createIngredientRow(listEl);
    }
  });

  row.appendChild(nameInput);
  row.appendChild(countInput);
  row.appendChild(gramsInput);
  row.appendChild(removeButton);
  listEl.appendChild(row);
}

function resetIngredientList(listEl, ingredients = []) {
  listEl.innerHTML = "";
  if (ingredients.length === 0) {
    createIngredientRow(listEl);
    return;
  }
  ingredients.forEach((ingredient) => createIngredientRow(listEl, ingredient));
}

function collectIngredientsFrom(listEl) {
  const rows = listEl.querySelectorAll(".ingredient-row");
  const ingredients = [];

  rows.forEach((row) => {
    const name = row.querySelector('[data-field="name"]').value.trim();
    if (!name) {
      return;
    }
    const countValue = row.querySelector('[data-field="count"]').value;
    const gramsValue = row.querySelector('[data-field="grams"]').value;
    const count = normalizeNumber(countValue);
    const grams = normalizeNumber(gramsValue);
    ingredients.push({ name, count, grams });
  });

  return ingredients;
}

function addIngredientRow() {
  createIngredientRow(ingredientList);
}

function collectIngredients() {
  return collectIngredientsFrom(ingredientList);
}

function resetRecipeForm() {
  editingRecipeId = null;
  recipeFormTitle.textContent = "レシピを登録";
  recipeSaveButton.textContent = "登録";
  recipeCancelButton.hidden = true;
  recipeForm.reset();
  recipeServingsInput.value = String(DEFAULT_BASE_SERVINGS);
  resetIngredientList(ingredientList);
}

function fillRecipeForm(recipe) {
  recipeNameInput.value = recipe.name || "";
  recipeUrlInput.value = recipe.url || "";
  recipeServingsInput.value = String(normalizeBaseServings(recipe.baseServings));
  resetIngredientList(ingredientList, normalizeIngredients(recipe.ingredients));
}

function startEditingRecipe(recipe) {
  editingRecipeId = recipe.id;
  recipeFormTitle.textContent = "レシピを編集";
  recipeSaveButton.textContent = "更新";
  recipeCancelButton.hidden = false;
  fillRecipeForm(recipe);
}

function renderRecipeList() {
  const query = recipeSearchInput.value.trim();
  const list = query ? searchRecipes(query) : recipeDb.slice();
  recipeList.innerHTML = "";

  if (list.length === 0) {
    recipeEmpty.hidden = false;
    return;
  }
  recipeEmpty.hidden = true;

  list.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-card__header";

    const title = document.createElement("h3");
    title.className = "recipe-card__title";
    title.textContent = recipe.name;

    const actions = document.createElement("div");
    actions.className = "recipe-card__actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "button--ghost button--small";
    editButton.textContent = "編集";
    editButton.addEventListener("click", () => startEditingRecipe(recipe));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "button--ghost button--small";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => {
      const ok = window.confirm(`「${recipe.name}」を削除しますか？`);
      if (!ok) {
        return;
      }
      recipeDb = recipeDb.filter((entry) => entry.id !== recipe.id);
      saveRecipeDb();
      renderRecipeList();
      renderWeek(currentWeekStart);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    header.appendChild(title);
    header.appendChild(actions);
    card.appendChild(header);

    const servings = document.createElement("p");
    servings.className = "recipe-card__meta";
    servings.textContent = `基準: ${formatNumber(
      normalizeBaseServings(recipe.baseServings),
    )}人前`;
    card.appendChild(servings);

    if (recipe.url) {
      const url = document.createElement("a");
      url.className = "recipe-card__url";
      url.href = recipe.url;
      url.target = "_blank";
      url.rel = "noreferrer";
      url.textContent = recipe.url;
      card.appendChild(url);
    } else {
      const url = document.createElement("p");
      url.className = "recipe-detail__notice";
      url.textContent = "URLは未登録";
      card.appendChild(url);
    }

    if (recipe.ingredients.length > 0) {
      const listEl = document.createElement("ul");
      listEl.className = "recipe-card__ingredients";
      recipe.ingredients.forEach((ingredient) => {
        const item = document.createElement("li");
        item.textContent = formatIngredientDisplay(ingredient);
        listEl.appendChild(item);
      });
      card.appendChild(listEl);
    } else {
      const empty = document.createElement("p");
      empty.className = "recipe-detail__notice";
      empty.textContent = "食材が未登録";
      card.appendChild(empty);
    }

    recipeList.appendChild(card);
  });
}

function openRecipesView({ scroll } = { scroll: true }) {
  landingSection.hidden = true;
  appSection.hidden = true;
  recipesSection.hidden = false;
  renderRecipeList();
  if (scroll) {
    recipesSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openAppView({ scroll } = { scroll: true }) {
  landingSection.hidden = true;
  appSection.hidden = false;
  recipesSection.hidden = true;
  if (scroll) {
    appSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openLandingView() {
  landingSection.hidden = false;
  appSection.hidden = true;
  recipesSection.hidden = true;
}

function syncViewFromHash() {
  if (window.location.hash === "#app") {
    openAppView({ scroll: false });
    return;
  }
  if (window.location.hash === "#recipes") {
    openRecipesView({ scroll: false });
    return;
  }
  if (window.location.hash === "#landing") {
    openLandingView();
    return;
  }
  openAppView({ scroll: false });
}

function renderSearchResults({ query, container, dayKey }) {
  container.innerHTML = "";
  const trimmed = query.trim();
  if (!trimmed) {
    container.hidden = true;
    return;
  }
  const matches = searchRecipes(trimmed).slice(0, 6);
  const exactMatch = getRecipeByName(trimmed);
  container.hidden = false;

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "recipe-detail__notice";
    empty.textContent = "該当するレシピがありません。";
    container.appendChild(empty);
  } else {
    matches.forEach((recipe) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "recipe-search__item";
      item.textContent = recipe.name;

      if (recipe.ingredients.length > 0) {
        const meta = document.createElement("span");
        meta.className = "recipe-search__meta";
        meta.textContent = recipe.ingredients
          .slice(0, 2)
          .map(formatIngredientDisplay)
          .join(" / ");
        item.appendChild(meta);
      }

      item.addEventListener("click", () => {
        selectRecipeForDay(dayKey, recipe);
      });

      container.appendChild(item);
    });
  }

  if (!exactMatch) {
    const createButton = document.createElement("button");
    createButton.type = "button";
    createButton.className = "recipe-search__item recipe-search__item--create";
    createButton.textContent = `「${trimmed}」を新規登録`;
    createButton.addEventListener("click", () => {
      openRecipeModal({ dayKey, name: trimmed });
    });
    container.appendChild(createButton);
  }
}

function renderRecipeDetail({ dayData, recipe, dayKey }) {
  const detail = document.createElement("div");
  detail.className = "recipe-detail";

  if (recipe) {
    const baseServings = normalizeBaseServings(recipe.baseServings);
    const name = document.createElement("div");
    name.className = "recipe-detail__name";
    name.textContent = recipe.name;
    detail.appendChild(name);

    const servings = document.createElement("p");
    servings.className = "recipe-detail__meta";
    servings.textContent = `基準: ${formatNumber(baseServings)}人前`;
    detail.appendChild(servings);

    if (recipe.url) {
      const link = document.createElement("a");
      link.className = "recipe-detail__link";
      link.href = recipe.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "レシピURLを開く";
      detail.appendChild(link);
    } else {
      const url = document.createElement("p");
      url.className = "recipe-detail__notice";
      url.textContent = "URLは未登録";
      detail.appendChild(url);
    }

    if (recipe.ingredients.length > 0) {
      const listEl = document.createElement("ul");
      listEl.className = "recipe-detail__ingredients";
      recipe.ingredients.forEach((ingredient) => {
        const item = document.createElement("li");
        item.textContent = formatIngredientDisplay(ingredient);
        listEl.appendChild(item);
      });
      detail.appendChild(listEl);
    } else {
      const empty = document.createElement("p");
      empty.className = "recipe-detail__notice";
      empty.textContent = "食材が未登録";
      detail.appendChild(empty);
    }

    const actions = document.createElement("div");
    actions.className = "recipe-detail__actions";

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "button--ghost button--small";
    clearButton.textContent = "選択解除";
    clearButton.addEventListener("click", () => {
      const entry = getDayData(dayKey);
      delete entry.dinnerId;
      delete entry.servings;
      commitSave();
      renderWeek(currentWeekStart);
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "button--ghost button--small";
    editButton.textContent = "レシピを編集";
    editButton.addEventListener("click", () => {
      openRecipesView({ scroll: true });
      history.replaceState(null, "", "#recipes");
      startEditingRecipe(recipe);
    });

    actions.appendChild(clearButton);
    actions.appendChild(editButton);
    detail.appendChild(actions);

    return detail;
  }

  if (dayData.dinnerId && !recipe) {
    const empty = document.createElement("p");
    empty.className = "recipe-detail__empty";
    empty.textContent = "レシピが削除されています。";
    detail.appendChild(empty);

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "button--ghost button--small";
    clearButton.textContent = "選択解除";
    clearButton.addEventListener("click", () => {
      const entry = getDayData(dayKey);
      delete entry.dinnerId;
      delete entry.servings;
      commitSave();
      renderWeek(currentWeekStart);
    });
    detail.appendChild(clearButton);

    return detail;
  }

  if (dayData.dinnerText) {
    const legacy = document.createElement("p");
    legacy.className = "recipe-detail__empty";
    legacy.textContent = `以前の入力: ${dayData.dinnerText}`;
    detail.appendChild(legacy);

    const actions = document.createElement("div");
    actions.className = "recipe-detail__actions";

    const registerButton = document.createElement("button");
    registerButton.type = "button";
    registerButton.className = "button--ghost button--small";
    registerButton.textContent = "レシピDBに追加";
    registerButton.addEventListener("click", () => {
      resetRecipeForm();
      fillRecipeForm({ name: dayData.dinnerText, url: "", ingredients: [] });
      openRecipesView({ scroll: true });
      history.replaceState(null, "", "#recipes");
    });

    actions.appendChild(registerButton);
    detail.appendChild(actions);

    return detail;
  }

  const empty = document.createElement("p");
  empty.className = "recipe-detail__empty";
  empty.textContent = "まだレシピが選択されていません。";
  detail.appendChild(empty);

  const hint = document.createElement("p");
  hint.className = "recipe-detail__notice";
  hint.textContent = "料理名を入力すると候補が出ます。";
  detail.appendChild(hint);

  return detail;
}

function renderServingControl({ dayData, recipe }) {
  const wrapper = document.createElement("label");
  wrapper.className = "servings-field";

  const label = document.createElement("span");
  label.textContent = "今日は何人前";
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.step = "1";

  if (recipe) {
    const baseServings = normalizeBaseServings(recipe.baseServings);
    const servingsValue = resolveDayServings(dayData, recipe);
    input.value = servingsValue ? formatNumber(servingsValue) : formatNumber(baseServings);
    input.placeholder = formatNumber(baseServings);
  } else {
    input.disabled = true;
    input.placeholder = "-";
  }

  input.addEventListener("input", () => {
    if (!recipe) {
      return;
    }
    const value = normalizeNumber(input.value);
    if (value > 0) {
      dayData.servings = value;
    } else {
      delete dayData.servings;
    }
    scheduleSave();
    renderShoppingList();
  });

  input.addEventListener("blur", () => {
    if (!recipe) {
      return;
    }
    if (!input.value) {
      const baseServings = normalizeBaseServings(recipe.baseServings);
      dayData.servings = baseServings;
      input.value = formatNumber(baseServings);
      scheduleSave();
      renderShoppingList();
    }
  });

  wrapper.appendChild(input);

  if (!recipe) {
    const hint = document.createElement("span");
    hint.className = "servings-field__hint";
    hint.textContent = "レシピ選択後に入力";
    wrapper.appendChild(hint);
  }

  return wrapper;
}

function renderWeek(weekStart) {
  currentWeekStart = weekStart;
  currentData = loadWeekData(weekStart);
  weekStartInput.value = formatDate(weekStart);

  const endDate = new Date(weekStart);
  endDate.setDate(endDate.getDate() + 6);
  weekRange.textContent = `${formatDisplayDate(weekStart)} - ${formatDisplayDate(endDate)}`;

  weekGrid.innerHTML = "";

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    const dateKey = formatDate(date);
    const dayData = getDayData(dateKey);
    const selectedRecipe = dayData.dinnerId ? getRecipeById(dayData.dinnerId) : null;

    const card = document.createElement("article");
    card.className = "day-card";
    card.style.setProperty("--delay", `${index * 0.06}s`);

    const header = document.createElement("div");
    header.className = "day-header";

    const title = document.createElement("h2");
    title.className = "day-title";
    title.textContent = DAY_LABELS[index];

    const dateLabel = document.createElement("span");
    dateLabel.className = "day-date";
    dateLabel.textContent = formatDisplayDate(date);

    header.appendChild(title);
    header.appendChild(dateLabel);
    card.appendChild(header);

    const searchWrapper = document.createElement("div");
    searchWrapper.className = "recipe-search";

    const label = document.createElement("label");
    label.textContent = "料理名";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "料理名を入力";
    if (selectedRecipe) {
      input.value = selectedRecipe.name;
    } else if (dayData.dinnerText) {
      input.value = dayData.dinnerText;
    }

    const results = document.createElement("div");
    results.className = "recipe-search__results";
    results.hidden = true;

    input.addEventListener("input", () => {
      renderSearchResults({ query: input.value, container: results, dayKey: dateKey });
    });

    input.addEventListener("focus", () => {
      renderSearchResults({ query: input.value, container: results, dayKey: dateKey });
    });

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }
      const trimmed = input.value.trim();
      if (!trimmed) {
        return;
      }
      event.preventDefault();
      const existing = getRecipeByName(trimmed);
      if (existing) {
        selectRecipeForDay(dateKey, existing);
        return;
      }
      openRecipeModal({ dayKey: dateKey, name: trimmed });
    });

    searchWrapper.appendChild(label);
    searchWrapper.appendChild(input);
    searchWrapper.appendChild(results);

    card.appendChild(searchWrapper);
    card.appendChild(renderRecipeDetail({ dayData, recipe: selectedRecipe, dayKey: dateKey }));
    card.appendChild(renderServingControl({ dayData, recipe: selectedRecipe }));

    weekGrid.appendChild(card);
  }

  renderShoppingList();
  setSaveStatus("保存済み");
}

function renderShoppingList() {
  const checkedState = getShoppingState();
  const totals = new Map();
  const orderedKeys = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + index);
    const dateKey = formatDate(date);
    const dayData = getDayData(dateKey);
    if (!dayData.dinnerId) {
      continue;
    }
    const recipe = getRecipeById(dayData.dinnerId);
    if (!recipe) {
      continue;
    }
    const baseServings = normalizeBaseServings(recipe.baseServings);
    const servings = resolveDayServings(dayData, recipe);
    const multiplier = servings / baseServings;
    recipe.ingredients.forEach((ingredient) => {
      const name = ingredient.name.trim();
      if (!name) {
        return;
      }
      const countValue = normalizeNumber(ingredient.count);
      const gramsValue = normalizeNumber(ingredient.grams);
      const key = normalizeText(name);
      if (!totals.has(key)) {
        totals.set(key, { name, count: 0, grams: 0 });
        orderedKeys.push(key);
      }
      const entry = totals.get(key);
      entry.count += countValue * multiplier;
      if (gramsValue > 0) {
        const gramsMultiplier = countValue > 0 ? countValue : 1;
        entry.grams += gramsValue * gramsMultiplier * multiplier;
      }
    });
  }

  Object.keys(checkedState).forEach((key) => {
    if (!totals.has(key)) {
      delete checkedState[key];
    }
  });

  shoppingList.innerHTML = "";

  if (orderedKeys.length === 0) {
    shoppingEmpty.hidden = false;
    return;
  }
  shoppingEmpty.hidden = true;

  orderedKeys.forEach((key) => {
    const itemData = totals.get(key);
    const listItem = document.createElement("li");
    listItem.className = "checklist__item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checklist__toggle";
    checkbox.checked = Boolean(checkedState[key]);
    checkbox.addEventListener("change", () => {
      checkedState[key] = checkbox.checked;
      listItem.classList.toggle("checklist__item--checked", checkbox.checked);
      scheduleSave();
    });

    const text = document.createElement("span");
    text.className = "checklist__text";
    text.textContent = itemData.name;

    listItem.appendChild(checkbox);
    listItem.appendChild(text);

    if (itemData.count > 0) {
      const countBadge = document.createElement("span");
      countBadge.className = "checklist__count";
      countBadge.textContent = `x${formatNumber(itemData.count)}`;
      listItem.appendChild(countBadge);
    }

    if (itemData.grams > 0) {
      const gramsBadge = document.createElement("span");
      gramsBadge.className = "checklist__count";
      gramsBadge.textContent = `${formatNumber(itemData.grams)}g`;
      listItem.appendChild(gramsBadge);
    }

    if (checkbox.checked) {
      listItem.classList.add("checklist__item--checked");
    }

    shoppingList.appendChild(listItem);
  });
}

function shiftWeek(offset) {
  const next = new Date(currentWeekStart);
  next.setDate(next.getDate() + offset * 7);
  renderWeek(startOfWeek(next));
}

weekStartInput.addEventListener("change", (event) => {
  if (!event.target.value) {
    return;
  }
  const selected = new Date(`${event.target.value}T00:00:00`);
  renderWeek(startOfWeek(selected));
});

prevWeekButton.addEventListener("click", () => shiftWeek(-1));
nextWeekButton.addEventListener("click", () => shiftWeek(1));
thisWeekButton.addEventListener("click", () => renderWeek(startOfWeek(new Date())));

clearWeekButton.addEventListener("click", () => {
  const label = formatDisplayDate(currentWeekStart);
  const ok = window.confirm(`${label}の週をクリアしますか？`);
  if (!ok) {
    return;
  }
  localStorage.removeItem(storageKey(currentWeekStart));
  renderWeek(currentWeekStart);
});

ingredientAddButton.addEventListener("click", () => addIngredientRow());
recipeModalIngredientAddButton.addEventListener("click", () => {
  createIngredientRow(recipeModalIngredientList);
});

recipeModalBackdrop.addEventListener("click", () => closeRecipeModal());
recipeModalCloseButton.addEventListener("click", () => closeRecipeModal());
recipeModalCancelButton.addEventListener("click", () => closeRecipeModal());

recipeModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = recipeModalNameInput.value.trim();
  if (!name) {
    recipeModalNameInput.focus();
    return;
  }

  const url = recipeModalUrlInput.value.trim();
  const ingredients = collectIngredientsFrom(recipeModalIngredientList);
  const baseServings = normalizeBaseServings(recipeModalServingsInput.value);
  const now = new Date().toISOString();
  const existing = getRecipeByName(name);
  let targetRecipe = null;

  if (existing) {
    recipeDb = recipeDb.map((recipe) =>
      recipe.id === existing.id
        ? { ...recipe, name, url, ingredients, baseServings, updatedAt: now }
        : recipe,
    );
    targetRecipe = { id: existing.id, baseServings };
  } else {
    targetRecipe = {
      id: `recipe-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name,
      url,
      ingredients,
      baseServings,
      createdAt: now,
      updatedAt: now,
    };
    recipeDb.push(targetRecipe);
  }

  saveRecipeDb();
  renderRecipeList();

  if (modalDayKey) {
    selectRecipeForDay(modalDayKey, targetRecipe);
  } else {
    renderWeek(currentWeekStart);
  }
  closeRecipeModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  if (!recipeModal.hidden) {
    closeRecipeModal();
  }
});

recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = recipeNameInput.value.trim();
  if (!name) {
    recipeNameInput.focus();
    return;
  }

  const url = recipeUrlInput.value.trim();
  const ingredients = collectIngredients();
  const baseServings = normalizeBaseServings(recipeServingsInput.value);
  const now = new Date().toISOString();

  if (editingRecipeId) {
    recipeDb = recipeDb.map((recipe) =>
      recipe.id === editingRecipeId
        ? { ...recipe, name, url, ingredients, baseServings, updatedAt: now }
        : recipe,
    );
  } else {
    recipeDb.push({
      id: `recipe-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name,
      url,
      ingredients,
      baseServings,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveRecipeDb();
  resetRecipeForm();
  renderRecipeList();
  renderWeek(currentWeekStart);
});

recipeCancelButton.addEventListener("click", () => {
  resetRecipeForm();
});

recipeSearchInput.addEventListener("input", renderRecipeList);

enterAppButton.addEventListener("click", () => {
  openAppView({ scroll: true });
  history.replaceState(null, "", "#app");
});

enterRecipesButton.addEventListener("click", () => {
  openRecipesView({ scroll: true });
  history.replaceState(null, "", "#recipes");
});

backToLandingButton.addEventListener("click", () => {
  openLandingView();
  history.replaceState(null, "", "#landing");
});

openRecipesFromAppButton.addEventListener("click", () => {
  openRecipesView({ scroll: true });
  history.replaceState(null, "", "#recipes");
});

backToLandingFromRecipesButton.addEventListener("click", () => {
  openLandingView();
  history.replaceState(null, "", "#landing");
});

openAppFromRecipesButton.addEventListener("click", () => {
  openAppView({ scroll: true });
  history.replaceState(null, "", "#app");
});

window.addEventListener("hashchange", syncViewFromHash);

resetRecipeForm();
renderWeek(currentWeekStart);
renderRecipeList();
syncViewFromHash();
