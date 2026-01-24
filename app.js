/**
 * Kondate Proto v2 - Application
 * スマホファースト、プール式UI
 */

const App = {
  // ========================================
  // 状態管理
  // ========================================
  state: {
    currentScreen: 'onboarding',
    recipes: [],           // ユーザーのレシピ
    sets: [],              // ユーザーのセット
    currentSet: null,      // 現在選択中のセット
    nextSet: null,         // 次の献立
    setHistory: [],        // 過去の献立履歴 [{set, endedAt, cookedRecipes}]
    cookedRecipes: [],     // 作った料理のID
    shoppingChecked: [],   // チェック済み買い物アイテム
    fridge: [],            // 冷蔵庫の食材 [{name, amount, unit}]
    selectedRecipesForSet: [], // セット作成時の選択レシピ
    previousScreen: 'main',
  },

  // UI状態（保存しない）
  currentMyTab: 'recipes',
  mySelectedTag: null,
  selectorTab: 'my', // レシピ選択モーダルのタブ（my / public）

  // オンボーディング状態
  onboarding: {
    setSelected: false,      // セットを選んだことがある
    shoppingGuided: false,   // 買い物リストへ案内した
    purchasePrompted: false, // 買った？の案内をした
    fridgeNotified: false,   // 冷蔵庫通知をした
    cookingGuided: false,    // 料理の案内をした
    completed: false,        // 献立を完了した
  },

  // ========================================
  // 公開レシピデータ
  // ========================================
  publicRecipes: [
    {
      id: 'pub-001',
      name: '豚の生姜焼き',
      emoji: '🐷',
      servings: 2,
      tags: ['和食', '定番', '時短'],
      ingredients: [
        { name: '豚ロース薄切り', amount: 200, unit: 'g' },
        { name: '玉ねぎ', amount: 0.5, unit: '個' },
        { name: '生姜', amount: 1, unit: 'かけ' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 2, unit: '大さじ' },
        { name: 'みりん', amount: 1, unit: '大さじ' },
      ],
      steps: [
        '生姜をすりおろし、醤油・酒・みりんと混ぜてタレを作る',
        '玉ねぎを薄切りにする',
        'フライパンに油を熱し、豚肉を焼く',
        '玉ねぎを加えて炒める',
        'タレを加えて絡める',
      ],
    },
    {
      id: 'pub-002',
      name: '鶏の唐揚げ',
      emoji: '🍗',
      servings: 2,
      tags: ['和食', '定番', '鶏肉'],
      ingredients: [
        { name: '鶏もも肉', amount: 300, unit: 'g' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: '生姜', amount: 1, unit: 'かけ' },
        { name: 'にんにく', amount: 1, unit: 'かけ' },
        { name: '片栗粉', amount: 4, unit: '大さじ' },
      ],
      steps: [
        '鶏肉を一口大に切る',
        '醤油・酒・すりおろした生姜とにんにくで下味をつける（15分）',
        '片栗粉をまぶす',
        '170度の油で4〜5分揚げる',
      ],
    },
    {
      id: 'pub-003',
      name: '肉じゃが',
      emoji: '🥔',
      servings: 2,
      tags: ['和食', '定番', '煮物'],
      ingredients: [
        { name: '牛こま肉', amount: 150, unit: 'g' },
        { name: 'じゃがいも', amount: 2, unit: '個' },
        { name: '玉ねぎ', amount: 1, unit: '個' },
        { name: 'にんじん', amount: 0.5, unit: '本' },
        { name: '醤油', amount: 3, unit: '大さじ' },
        { name: '砂糖', amount: 2, unit: '大さじ' },
      ],
      steps: [
        'じゃがいも・にんじんは一口大、玉ねぎはくし切りにする',
        '鍋に油を熱し、牛肉を炒める',
        '野菜を加えて炒める',
        '水・醤油・砂糖を加えて落し蓋をし、20分煮る',
      ],
    },
    {
      id: 'pub-004',
      name: '麻婆豆腐',
      emoji: '🌶️',
      servings: 2,
      tags: ['中華', '定番', '時短'],
      ingredients: [
        { name: '絹豆腐', amount: 1, unit: '丁' },
        { name: '豚ひき肉', amount: 100, unit: 'g' },
        { name: '長ねぎ', amount: 0.5, unit: '本' },
        { name: '豆板醤', amount: 1, unit: '大さじ' },
        { name: '鶏がらスープ', amount: 150, unit: 'ml' },
      ],
      steps: [
        '豆腐を2cm角に切り、熱湯で軽く茹でておく',
        '長ねぎをみじん切りにする',
        'フライパンに油を熱し、豚ひき肉を炒める',
        '豆板醤を加えて香りを出す',
        '鶏がらスープを加え、豆腐を入れて煮込む',
        '水溶き片栗粉でとろみをつける',
      ],
    },
    {
      id: 'pub-005',
      name: '鮭のムニエル',
      emoji: '🐟',
      servings: 2,
      tags: ['洋食', '魚', '時短'],
      ingredients: [
        { name: '生鮭', amount: 2, unit: '切れ' },
        { name: 'バター', amount: 20, unit: 'g' },
        { name: 'レモン', amount: 0.5, unit: '個' },
        { name: '小麦粉', amount: 2, unit: '大さじ' },
      ],
      steps: [
        '鮭に塩こしょうをふり、小麦粉を薄くまぶす',
        'フライパンにバターを熱し、中火で鮭を焼く',
        '片面3分ずつ、こんがりと焼く',
        '仕上げにレモンを絞る',
      ],
    },
    {
      id: 'pub-006',
      name: '親子丼',
      emoji: '🍚',
      servings: 2,
      tags: ['和食', '丼', '時短'],
      ingredients: [
        { name: '鶏もも肉', amount: 150, unit: 'g' },
        { name: '玉ねぎ', amount: 0.5, unit: '個' },
        { name: '卵', amount: 3, unit: '個' },
        { name: 'ご飯', amount: 2, unit: '膳' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: 'みりん', amount: 2, unit: '大さじ' },
      ],
      steps: [
        '鶏肉を一口大に、玉ねぎを薄切りにする',
        '小鍋に醤油・みりん・水を入れ煮立てる',
        '鶏肉と玉ねぎを加え、火が通るまで煮る',
        '溶き卵を回し入れ、半熟で火を止める',
        'ご飯の上にのせて完成',
      ],
    },
    {
      id: 'pub-007',
      name: 'ハンバーグ',
      emoji: '🍔',
      servings: 2,
      tags: ['洋食', '定番', '肉'],
      ingredients: [
        { name: '合挽き肉', amount: 250, unit: 'g' },
        { name: '玉ねぎ', amount: 0.5, unit: '個' },
        { name: 'パン粉', amount: 30, unit: 'g' },
        { name: '卵', amount: 1, unit: '個' },
        { name: '牛乳', amount: 2, unit: '大さじ' },
      ],
      steps: [
        '玉ねぎをみじん切りにし、炒めて冷ます',
        'パン粉を牛乳で浸す',
        'ひき肉・玉ねぎ・パン粉・卵を混ぜてこねる',
        '小判型に成形し、中央をくぼませる',
        'フライパンで両面を焼き、蓋をして蒸し焼き',
        '竹串を刺して透明な汁が出れば完成',
      ],
    },
    {
      id: 'pub-008',
      name: '野菜炒め',
      emoji: '🥬',
      servings: 2,
      tags: ['中華', '時短', '野菜'],
      ingredients: [
        { name: '豚バラ肉', amount: 100, unit: 'g' },
        { name: 'キャベツ', amount: 200, unit: 'g' },
        { name: 'もやし', amount: 1, unit: '袋' },
        { name: 'にんじん', amount: 0.5, unit: '本' },
        { name: '鶏がらスープの素', amount: 1, unit: '小さじ' },
      ],
      steps: [
        '野菜を食べやすい大きさに切る',
        'フライパンに油を熱し、豚肉を炒める',
        '火の通りにくい野菜（にんじん）から順に加える',
        '鶏がらスープの素・塩こしょうで味付け',
        '強火で手早く炒めて完成',
      ],
    },
  ],

  // サンプルセット（セット選択画面用）
  sampleSets: [
    {
      id: 'sample-001',
      name: '定番おうちごはん',
      recipeIds: ['pub-001', 'pub-002', 'pub-003', 'pub-006'],
    },
    {
      id: 'sample-002',
      name: '時短ウィーク',
      recipeIds: ['pub-001', 'pub-004', 'pub-005', 'pub-008'],
    },
  ],

  // 公開セット（料理家のセット等）
  publicSets: [
    {
      id: 'chef-001',
      name: '平日5日間の時短セット',
      author: '田中シェフ',
      recipeIds: ['pub-001', 'pub-004', 'pub-005', 'pub-006', 'pub-008'],
      tags: ['時短', '平日'],
    },
    {
      id: 'chef-002',
      name: '和食の基本セット',
      author: 'おばあちゃんの台所',
      recipeIds: ['pub-001', 'pub-002', 'pub-003', 'pub-006'],
      tags: ['和食', '定番'],
    },
    {
      id: 'chef-003',
      name: '野菜たっぷりヘルシー週間',
      author: '野菜ソムリエYuki',
      recipeIds: ['pub-003', 'pub-008', 'pub-007'],
      tags: ['野菜', 'ヘルシー'],
    },
  ],

  // 現在のタブ状態
  currentMyTab: 'recipes',
  currentPublicTab: 'recipes',

  // ========================================
  // 初期化
  // ========================================
  init() {
    this.loadState();
    this.loadOnboarding();
    this.setupEventListeners();
    this.render();

    // オンボーディング済みならメイン画面へ
    if (localStorage.getItem('kondate-onboarded')) {
      this.showScreen('main');
      // 初回ガイドをチェック
      this.checkOnboardingGuide();
    }
  },

  loadOnboarding() {
    const saved = localStorage.getItem('kondate-onboarding');
    if (saved) {
      this.onboarding = { ...this.onboarding, ...JSON.parse(saved) };
    }
  },

  saveOnboarding() {
    localStorage.setItem('kondate-onboarding', JSON.stringify(this.onboarding));
  },

  // ========================================
  // オンボーディングガイド
  // ========================================
  checkOnboardingGuide() {
    // 既に全て完了していれば何もしない
    if (this.onboarding.completed) return;

    // 1. セットを選んでいない → セット選択を促す
    if (!this.state.currentSet && !this.onboarding.setSelected) {
      setTimeout(() => this.showGuide('selectSet'), 500);
      return;
    }

    // 2. セット選択直後 → 買い物リストを案内（shoppingGuidedは別のタイミングで設定）
    // これはselectSet後に呼ばれる

    // 3. 買い物リストにアイテムがある状態で戻ってきた → 買った？を促す
    if (this.state.currentSet && !this.onboarding.purchasePrompted) {
      const hasShoppingItems = this.getShoppingListCount() > 0;
      const hasFridgeItems = (this.state.fridge || []).length > 0;
      // 買い物リストがあるが冷蔵庫は空 = まだ買っていない
      if (hasShoppingItems && !hasFridgeItems) {
        // 少し遅延して表示（ページロード直後を避ける）
        setTimeout(() => this.showGuide('promptPurchase'), 800);
        return;
      }
    }

    // 4. 冷蔵庫に食材があるが料理案内がまだ
    if (!this.onboarding.cookingGuided) {
      const hasFridgeItems = (this.state.fridge || []).length > 0;
      if (hasFridgeItems && this.state.currentSet) {
        this.onboarding.cookingGuided = true;
        this.saveOnboarding();
        setTimeout(() => this.showGuide('startCooking'), 500);
        return;
      }
    }
  },

  showGuide(type) {
    const modal = document.getElementById('modal-guide');
    const illustration = document.getElementById('guide-illustration');
    const title = document.getElementById('guide-title');
    const description = document.getElementById('guide-description');
    const actions = document.getElementById('guide-actions');

    const guides = {
      selectSet: {
        illustration: '📋',
        title: '献立セットを選ぼう',
        description: 'まずは献立セットを選んでみましょう。<br>みんなのMenuにはすぐに使えるセットがあります。',
        actions: `
          <button class="btn-primary" onclick="App.closeGuide(); App.showScreen('public'); App.switchPublicTab('sets');">
            みんなのMenuを見る
          </button>
          <button class="btn-text" onclick="App.closeGuide()">あとで</button>
        `
      },
      guideShopping: {
        illustration: '🛒',
        title: '買い物リストができました',
        description: 'セットに含まれる材料が<br>買い物リストに追加されました。<br>買い物に行ってみましょう！',
        actions: `
          <button class="btn-primary" onclick="App.closeGuide(); App.showScreen('shopping');">
            買い物リストを見る
          </button>
          <button class="btn-text" onclick="App.closeGuide()">OK</button>
        `
      },
      promptPurchase: {
        illustration: '🛍️',
        title: '買い物できたかな？',
        description: '買い物リストの材料を買ったら<br>「買った」ボタンを押してね。<br>冷蔵庫に追加されるよ。',
        actions: `
          <button class="btn-primary" onclick="App.closeGuide(); App.showScreen('shopping');">
            買い物リストへ
          </button>
          <button class="btn-text" onclick="App.closeGuide(); App.onboarding.purchasePrompted = true; App.saveOnboarding();">あとで</button>
        `
      },
      fridgeStocked: {
        illustration: '🧊',
        title: '冷蔵庫に入りました！',
        description: '買った材料が冷蔵庫に追加されました。<br>さあ、料理を始めましょう。',
        actions: `
          <button class="btn-primary" onclick="App.closeGuide(); App.showScreen('main');">
            献立を見る
          </button>
        `
      },
      startCooking: {
        illustration: '👨‍🍳',
        title: '料理を作ってみよう',
        description: '献立からレシピを選んで<br>「作った！」を押すと<br>材料が冷蔵庫から消費されます。',
        actions: `
          <button class="btn-primary" onclick="App.closeGuide();">
            OK、作ってみる！
          </button>
        `
      },
      kondateComplete: {
        illustration: '🎉',
        title: '献立を完了しました！',
        description: 'おつかれさま！<br>全ての料理を作りました。<br>次の献立を選びましょう。',
        actions: `
          <button class="btn-primary" onclick="App.closeGuide(); App.showScreen('public'); App.switchPublicTab('sets');">
            次の献立を選ぶ
          </button>
          <button class="btn-text" onclick="App.closeGuide();">閉じる</button>
        `
      }
    };

    const guide = guides[type];
    if (!guide) return;

    illustration.textContent = guide.illustration;
    title.textContent = guide.title;
    description.innerHTML = guide.description;
    actions.innerHTML = guide.actions;

    modal.classList.remove('hidden');
  },

  closeGuide() {
    document.getElementById('modal-guide').classList.add('hidden');
  },

  loadState() {
    const saved = localStorage.getItem('kondate-v2-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.state = { ...this.state, ...parsed };
    }
  },

  saveState() {
    localStorage.setItem('kondate-v2-state', JSON.stringify({
      recipes: this.state.recipes,
      sets: this.state.sets,
      currentSet: this.state.currentSet,
      cookedRecipes: this.state.cookedRecipes,
      shoppingChecked: this.state.shoppingChecked,
      fridge: this.state.fridge,
    }));
    // バッジを更新
    this.updateBadges();
  },

  // ========================================
  // 画面遷移
  // ========================================
  showScreen(screenId) {
    // 前の画面を記録
    this.state.previousScreen = this.state.currentScreen;
    this.state.currentScreen = screenId;

    // 全画面を非表示
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // 対象画面を表示
    const screen = document.getElementById(`screen-${screenId}`);
    if (screen) {
      screen.classList.add('active');
    }

    // 画面ごとの初期化
    this.onScreenEnter(screenId);
  },

  onScreenEnter(screenId) {
    switch (screenId) {
      case 'main':
        this.renderMainScreen();
        break;
      case 'set-select':
        this.renderSetSelectScreen();
        break;
      case 'set-create':
        this.resetSetCreateForm();
        break;
      case 'recipe-add':
        this.resetRecipeAddForm();
        break;
      case 'recipes':
        this.renderRecipesScreen();
        break;
      case 'shopping':
        this.renderShoppingScreen();
        break;
      case 'public':
        this.renderPublicScreen();
        break;
    }
  },

  startApp() {
    localStorage.setItem('kondate-onboarded', 'true');
    this.showScreen('main');
  },

  // ========================================
  // メイン画面（献立リスト）
  // ========================================
  renderMainScreen() {
    const emptyState = document.getElementById('empty-state');
    const currentPool = document.getElementById('current-pool');
    const poolCards = document.getElementById('pool-cards');
    const setNameLabel = document.getElementById('current-set-name');

    if (!this.state.currentSet) {
      emptyState.classList.remove('hidden');
      currentPool.classList.add('hidden');
    } else {
      emptyState.classList.add('hidden');
      currentPool.classList.remove('hidden');

      // セット名を表示
      setNameLabel.textContent = this.state.currentSet.name;

      // セット内のレシピを取得
      const recipes = this.getRecipesFromSet(this.state.currentSet);

      poolCards.innerHTML = recipes.map(recipe => {
        const isCooked = this.state.cookedRecipes.includes(recipe.id);
        return `
          <div class="recipe-card ${isCooked ? 'cooked' : ''}" onclick="App.showRecipeFromPool('${recipe.id}')">
            <div class="card-emoji">${recipe.emoji || '🍽️'}</div>
            <div class="card-name">${recipe.name}</div>
            <div class="card-tags">
              ${(recipe.tags || []).slice(0, 2).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
            </div>
            ${isCooked ? '<div class="card-cooked-badge">済</div>' : ''}
          </div>
        `;
      }).join('');
    }

    // 次の献立セクションを描画
    this.renderNextSetSection();

    // 履歴セクションを描画
    this.renderHistorySection();

    // 冷蔵庫ショートカットを描画
    this.renderFridgeShortcut();
  },

  renderFridgeShortcut() {
    const shortcut = document.getElementById('fridge-shortcut');
    const badge = document.getElementById('fridge-count');
    const fridge = this.state.fridge || [];

    // 現在の献立があるときのみ表示
    if (!this.state.currentSet) {
      shortcut.classList.add('hidden');
      return;
    }

    shortcut.classList.remove('hidden');
    badge.textContent = fridge.length > 0 ? `${fridge.length}品` : '';
  },

  renderNextSetSection() {
    const section = document.getElementById('next-set-section');
    const content = document.getElementById('next-set-content');

    // 次の献立がなければ非表示（今の献立がない場合も）
    if (!this.state.nextSet && !this.state.currentSet) {
      section.classList.add('hidden');
      return;
    }

    // 今の献立がなく、次の献立がある場合は「今の献立にする」ボタンを表示
    if (!this.state.currentSet && this.state.nextSet) {
      section.classList.remove('hidden');
      const recipes = this.getRecipesFromSet(this.state.nextSet);
      content.innerHTML = `
        <div class="next-set-card has-set">
          <div class="next-set-name">${this.state.nextSet.name}</div>
          <div class="next-set-meta">${recipes.length}品</div>
          <div class="next-set-actions">
            <button class="btn-primary" onclick="App.promoteNextSet()">今の献立にする</button>
            <button class="btn-text" onclick="App.clearNextSet()">取り消し</button>
          </div>
        </div>
      `;
      return;
    }

    // 今の献立がある場合の通常表示
    if (!this.state.currentSet) {
      section.classList.add('hidden');
      return;
    }

    section.classList.remove('hidden');

    if (!this.state.nextSet) {
      content.innerHTML = `
        <div class="next-set-card">
          <p class="next-set-empty">まだ選んでない</p>
          <button class="btn-text" onclick="App.selectNextSet()">
            <span class="material-icons-round">add</span>
            次の献立を選ぶ
          </button>
        </div>
      `;
    } else {
      const recipes = this.getRecipesFromSet(this.state.nextSet);
      content.innerHTML = `
        <div class="next-set-card has-set">
          <div class="next-set-name">${this.state.nextSet.name}</div>
          <div class="next-set-meta">${recipes.length}品</div>
          <div class="next-set-actions">
            <button class="btn-text" onclick="App.selectNextSet()">変更</button>
            <button class="btn-text" onclick="App.clearNextSet()">取り消し</button>
          </div>
        </div>
      `;
    }
  },

  renderHistorySection() {
    const section = document.getElementById('history-section');
    const countEl = document.getElementById('history-count');
    const listEl = document.getElementById('history-list');

    const history = this.state.setHistory || [];

    if (history.length === 0) {
      section.classList.add('hidden');
      return;
    }

    section.classList.remove('hidden');
    countEl.textContent = history.length;

    listEl.innerHTML = history.slice().reverse().map(item => {
      const date = new Date(item.endedAt);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const totalRecipes = item.set.recipeIds.length;
      const cookedCount = (item.cookedRecipes || []).length;
      return `
        <div class="history-item">
          <div class="history-item-header">
            <span class="history-item-name">${item.set.name}</span>
            <span class="history-item-date">${dateStr}まで</span>
          </div>
          <div class="history-item-stats">${cookedCount}/${totalRecipes}品 作った</div>
        </div>
      `;
    }).join('');
  },

  toggleHistory() {
    const toggle = document.querySelector('.history-toggle');
    const list = document.getElementById('history-list');
    toggle.classList.toggle('expanded');
    list.classList.toggle('hidden');
  },

  // 献立画面からレシピ詳細を表示（作るためのビュー）
  showRecipeFromPool(recipeId) {
    let recipe = this.publicRecipes.find(r => r.id === recipeId);
    if (!recipe) {
      recipe = this.state.recipes.find(r => r.id === recipeId);
    }
    if (!recipe) return;

    const isCooked = this.state.cookedRecipes.includes(recipeId);

    const modal = document.getElementById('modal-recipe-detail');
    document.getElementById('detail-recipe-name').textContent = recipe.name;

    const body = document.getElementById('detail-recipe-body');
    body.innerHTML = `
      <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
      <div style="margin-bottom: 16px;">
        <strong>${recipe.servings}人前</strong>
        <span style="margin-left: 8px; color: var(--text-hint);">${(recipe.tags || []).join(' ')}</span>
      </div>
      ${recipe.url ? `<a href="${recipe.url}" target="_blank" style="color: var(--accent); display: block; margin-bottom: 16px;">レシピページを開く →</a>` : ''}
      <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">材料</h3>
      <ul style="list-style: none; margin-bottom: 24px;">
        ${(recipe.ingredients || []).map(ing => `
          <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
            ${ing.name} ${ing.amount}${ing.unit}
          </li>
        `).join('')}
      </ul>
      ${(recipe.steps && recipe.steps.length > 0) ? `
        <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">手順</h3>
        <ol style="margin-bottom: 24px; padding-left: 20px;">
          ${recipe.steps.map(step => `
            <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
              ${step}
            </li>
          `).join('')}
        </ol>
      ` : ''}
      <button class="btn-primary" style="width: 100%;" onclick="App.markAsCooked('${recipeId}')">
        ${isCooked ? '未調理に戻す' : '作った！'}
      </button>
    `;

    modal.classList.remove('hidden');
  },

  markAsCooked(recipeId) {
    const index = this.state.cookedRecipes.indexOf(recipeId);
    if (index === -1) {
      // 作った場合は冷蔵庫から材料を消費
      let recipe = this.publicRecipes.find(r => r.id === recipeId);
      if (!recipe) {
        recipe = this.state.recipes.find(r => r.id === recipeId);
      }
      if (recipe) {
        this.consumeIngredientsFromFridge(recipe);
      }
      this.state.cookedRecipes.push(recipeId);
      this.saveState();
      this.closeModal();
      this.renderMainScreen();

      // 献立の全レシピを作り終えたかチェック
      if (this.state.currentSet) {
        const totalRecipes = this.state.currentSet.recipeIds.length;
        const cookedCount = this.state.cookedRecipes.length;

        if (cookedCount >= totalRecipes && !this.onboarding.completed) {
          // 全部作り終えた！
          this.onboarding.completed = true;
          this.saveOnboarding();
          setTimeout(() => this.showGuide('kondateComplete'), 500);
        } else {
          this.showToast('作った！');
        }
      } else {
        this.showToast('作った！');
      }
    } else {
      this.state.cookedRecipes.splice(index, 1);
      this.showToast('未調理に戻しました');
      this.saveState();
      this.closeModal();
      this.renderMainScreen();
    }
  },

  getRecipesFromSet(set) {
    if (!set) return [];
    return set.recipeIds.map(id => {
      // 公開レシピから探す
      let recipe = this.publicRecipes.find(r => r.id === id);
      if (!recipe) {
        // ユーザーレシピから探す
        recipe = this.state.recipes.find(r => r.id === id);
      }
      return recipe;
    }).filter(Boolean);
  },

  toggleCooked(recipeId) {
    const index = this.state.cookedRecipes.indexOf(recipeId);
    if (index === -1) {
      this.state.cookedRecipes.push(recipeId);
      this.showToast('作った！');
    } else {
      this.state.cookedRecipes.splice(index, 1);
    }
    this.saveState();
    this.renderMainScreen();
  },

  clearCurrentSet() {
    if (confirm('今の献立をリセットしますか？')) {
      // 現在の献立を履歴に追加
      if (this.state.currentSet) {
        if (!this.state.setHistory) {
          this.state.setHistory = [];
        }
        this.state.setHistory.push({
          set: this.state.currentSet,
          endedAt: new Date().toISOString(),
          cookedRecipes: [...this.state.cookedRecipes],
        });
      }

      // 今の献立のみリセット（次の献立は残す）
      this.state.currentSet = null;
      this.state.cookedRecipes = [];
      this.state.shoppingChecked = [];
      this.saveState();
      this.renderMainScreen();
      this.showToast('リセットしました');
    }
  },

  promoteNextSet() {
    // 次の献立を今の献立に昇格
    if (this.state.nextSet) {
      this.state.currentSet = this.state.nextSet;
      this.state.nextSet = null;
      this.state.cookedRecipes = [];
      this.state.shoppingChecked = [];
      this.saveState();
      this.renderMainScreen();
      this.showToast('次の献立に切り替えました');
    }
  },

  selectNextSet() {
    // セット選択画面へ（次の献立選択モード）
    this.state.selectingFor = 'next';
    this.showScreen('set-select');
  },

  clearNextSet() {
    this.state.nextSet = null;
    this.saveState();
    this.renderMainScreen();
    this.showToast('次の献立を取り消しました');
  },

  // ========================================
  // セット選択画面
  // ========================================
  renderSetSelectScreen() {
    const setList = document.getElementById('set-list');

    // サンプルセット + ユーザーセット
    const allSets = [...this.sampleSets, ...this.state.sets];

    if (allSets.length === 0) {
      setList.innerHTML = '<p class="empty-hint">まだセットがないよ</p>';
      return;
    }

    setList.innerHTML = allSets.map(set => {
      const recipes = this.getRecipesFromSet(set);
      const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
      return `
        <div class="set-card" onclick="App.selectSet('${set.id}')">
          <div class="set-card-header">
            <span class="set-card-name">${set.name}</span>
            <span class="set-card-count">${recipes.length}品</span>
          </div>
          <div class="set-card-preview">
            <span class="set-card-preview-item">${previewNames}${recipes.length > 3 ? '...' : ''}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  selectSet(setId) {
    // サンプルセットから探す
    let set = this.sampleSets.find(s => s.id === setId);
    if (!set) {
      // ユーザーセットから探す
      set = this.state.sets.find(s => s.id === setId);
    }

    if (set) {
      // 次の献立を選択中の場合
      if (this.state.selectingFor === 'next') {
        this.state.nextSet = set;
        this.state.selectingFor = null;
        this.saveState();
        this.showScreen('main');
        this.showToast('次の献立を設定しました');
      } else {
        // 通常の献立選択
        this.state.currentSet = set;
        this.state.cookedRecipes = [];
        this.state.shoppingChecked = [];
        this.saveState();
        this.showScreen('main');

        // オンボーディング: 初めてセットを選んだ
        if (!this.onboarding.setSelected) {
          this.onboarding.setSelected = true;
          this.saveOnboarding();
          setTimeout(() => this.showGuide('guideShopping'), 500);
        } else {
          this.showToast('セットを選択しました');
        }
      }
    }
  },

  // ========================================
  // セット作成画面
  // ========================================
  resetSetCreateForm() {
    document.getElementById('set-name-input').value = '';
    this.state.selectedRecipesForSet = [];
    this.renderSelectedRecipes();
    this.updateSaveSetButton();
  },

  renderSelectedRecipes() {
    const container = document.getElementById('selected-recipes');

    if (this.state.selectedRecipesForSet.length === 0) {
      container.innerHTML = '<p class="empty-hint">まだ選んでないよ</p>';
      return;
    }

    container.innerHTML = this.state.selectedRecipesForSet.map(recipe => `
      <div class="selected-recipe-item">
        <span>${recipe.emoji || '🍽️'} ${recipe.name}</span>
        <button class="btn-remove-ingredient" onclick="App.removeRecipeFromSet('${recipe.id}')">
          <span class="material-icons-round">close</span>
        </button>
      </div>
    `).join('');
  },

  removeRecipeFromSet(recipeId) {
    this.state.selectedRecipesForSet = this.state.selectedRecipesForSet.filter(r => r.id !== recipeId);
    this.renderSelectedRecipes();
    this.updateSaveSetButton();
  },

  updateSaveSetButton() {
    const btn = document.getElementById('btn-save-set');
    const name = document.getElementById('set-name-input').value.trim();
    const count = this.state.selectedRecipesForSet.length;

    btn.disabled = !name || count < 1 || count > 7;
  },

  showRecipeSelector() {
    const modal = document.getElementById('modal-recipe-selector');

    // タブの状態をリセット
    this.selectorTab = 'my';
    document.querySelectorAll('#selector-tab-switcher .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === 'my');
    });

    // 検索をクリア
    document.getElementById('modal-recipe-search').value = '';

    // レシピリストを描画
    this.renderSelectorRecipes();

    modal.classList.remove('hidden');
  },

  switchSelectorTab(tab) {
    this.selectorTab = tab;

    // タブボタンの状態更新
    document.querySelectorAll('#selector-tab-switcher .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // 検索をクリア
    document.getElementById('modal-recipe-search').value = '';

    // レシピリストを再描画
    this.renderSelectorRecipes();
  },

  renderSelectorRecipes() {
    const list = document.getElementById('modal-recipe-list');

    // タブに応じてレシピを取得
    const recipes = this.selectorTab === 'my'
      ? this.state.recipes
      : this.publicRecipes;

    const selectedIds = this.state.selectedRecipesForSet.map(r =>
      typeof r === 'string' ? r : r.id
    );

    if (recipes.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-hint);">
          ${this.selectorTab === 'my' ? 'レシピがありません' : 'レシピを読み込み中...'}
        </div>
      `;
      return;
    }

    list.innerHTML = recipes.map(recipe => {
      const isSelected = selectedIds.includes(recipe.id);
      return `
        <div class="recipe-list-item ${isSelected ? 'selected' : ''}" onclick="App.toggleRecipeInSet('${recipe.id}')">
          <span class="recipe-list-emoji">${recipe.emoji || '🍽️'}</span>
          <div class="recipe-list-info">
            <div class="recipe-list-name">${recipe.name}</div>
            <div class="recipe-list-meta">${(recipe.tags || []).join(' ')}</div>
          </div>
          <span class="recipe-list-action material-icons-round">
            ${isSelected ? 'check_circle' : 'add_circle_outline'}
          </span>
        </div>
      `;
    }).join('');
  },

  filterSelectorRecipes() {
    const query = document.getElementById('modal-recipe-search').value.toLowerCase();
    const items = document.querySelectorAll('#modal-recipe-list .recipe-list-item');

    items.forEach(item => {
      const name = item.querySelector('.recipe-list-name').textContent.toLowerCase();
      const tags = item.querySelector('.recipe-list-meta').textContent.toLowerCase();
      item.style.display = (name.includes(query) || tags.includes(query)) ? '' : 'none';
    });
  },

  toggleRecipeInSet(recipeId) {
    const selectedIds = this.state.selectedRecipesForSet.map(r =>
      typeof r === 'string' ? r : r.id
    );

    if (selectedIds.includes(recipeId)) {
      // 削除
      this.state.selectedRecipesForSet = this.state.selectedRecipesForSet.filter(r => {
        const id = typeof r === 'string' ? r : r.id;
        return id !== recipeId;
      });
    } else {
      // 追加（7品まで）
      if (this.state.selectedRecipesForSet.length >= 7) {
        this.showToast('7品まで選べます');
        return;
      }
      // レシピを探す（ユーザーレシピ優先、なければ公開レシピ）
      let recipe = this.state.recipes.find(r => r.id === recipeId);
      if (!recipe) {
        recipe = this.publicRecipes.find(r => r.id === recipeId);
      }
      if (recipe) {
        this.state.selectedRecipesForSet.push(recipe);
      }
    }

    // 現在のタブのまま再描画
    this.renderSelectorRecipes();
    this.renderSelectedRecipes();
    this.updateSaveSetButton();
  },

  saveNewSet() {
    const name = document.getElementById('set-name-input').value.trim();
    if (!name || this.state.selectedRecipesForSet.length < 1) return;

    const recipeIds = this.state.selectedRecipesForSet.map(r =>
      typeof r === 'string' ? r : r.id
    );

    // 編集モードの場合は既存セットを更新
    if (this.state.editingSetId) {
      const existingSet = this.state.sets.find(s => s.id === this.state.editingSetId);
      if (existingSet) {
        existingSet.name = name;
        existingSet.recipeIds = recipeIds;
        this.saveState();
        this.state.editingSetId = null;
        this.showToast('セットを更新しました');
        this.showScreen('recipes');
        return;
      }
    }

    // 新規作成
    const newSet = {
      id: 'user-' + Date.now(),
      name: name,
      recipeIds: recipeIds,
    };

    this.state.sets.push(newSet);
    this.saveState();
    this.state.editingSetId = null;

    this.showToast('セットを作成しました');
    this.showScreen('set-select');
  },

  // ========================================
  // レシピ登録画面
  // ========================================
  resetRecipeAddForm() {
    // 取り込みエリアのリセット
    const importInput = document.getElementById('import-input');
    if (importInput) {
      importInput.value = '';
    }

    document.getElementById('recipe-name-input').value = '';
    document.getElementById('recipe-url-input').value = '';
    document.getElementById('ingredients-list').innerHTML = '';

    // 人数選択リセット
    document.querySelectorAll('.serving-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.servings === '2');
    });

    // タグ選択リセット
    document.querySelectorAll('#tags-selector .tag-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // 材料行を2つ追加
    this.addIngredientRow();
    this.addIngredientRow();
  },

  // ========================================
  // URL/テキスト取り込み機能
  // ========================================
  applyFromInput() {
    const input = document.getElementById('import-input').value.trim();

    if (!input) {
      this.showToast('URLまたはテキストを入力してください');
      return;
    }

    // URL判定
    if (input.startsWith('http://') || input.startsWith('https://')) {
      this.fetchRecipeFromUrl(input);
    } else {
      this.parseRecipeFromText(input);
    }
  },

  fetchRecipeFromUrl(url) {
    // プロトタイプでは準備中表示
    this.showToast('URL取り込みは準備中です');

    // URLだけはフォームに入れておく
    document.getElementById('recipe-url-input').value = url;
  },

  parseRecipeFromText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    let recipeName = '';
    let ingredients = [];
    let steps = [];
    let currentSection = 'none'; // none, ingredients, steps

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // セクション判定
      if (lowerLine.includes('材料') || lowerLine.includes('ingredient')) {
        currentSection = 'ingredients';
        continue;
      }
      if (lowerLine.includes('作り方') || lowerLine.includes('手順') || lowerLine.includes('step') || lowerLine.includes('レシピ')) {
        currentSection = 'steps';
        continue;
      }

      // 最初の行で料理名がまだない場合
      if (!recipeName && currentSection === 'none') {
        // 数字で始まらない、かつ短すぎない行を料理名とみなす
        if (!/^[\d０-９]/.test(line) && line.length > 1 && line.length < 30) {
          recipeName = line.replace(/^[#\*\-\s]+/, '').trim();
          continue;
        }
      }

      // 材料セクション
      if (currentSection === 'ingredients') {
        // 材料行をパース（例: "豚ロース 200g", "玉ねぎ 1個"）
        const ing = this.parseIngredientLine(line);
        if (ing) {
          ingredients.push(ing);
        }
      }

      // 手順セクション
      if (currentSection === 'steps') {
        // 番号や記号を除去
        const step = line.replace(/^[\d０-９]+[\.．\)）\s]+/, '').replace(/^[\-\*\•]\s*/, '').trim();
        if (step) {
          steps.push(step);
        }
      }
    }

    // 材料セクションが見つからなかった場合、全体から材料っぽい行を探す
    if (ingredients.length === 0) {
      for (const line of lines) {
        const ing = this.parseIngredientLine(line);
        if (ing && ing.name.length > 0 && ing.name.length < 15) {
          ingredients.push(ing);
        }
      }
    }

    // フォームに反映
    this.fillRecipeForm({
      name: recipeName,
      ingredients: ingredients,
      steps: steps
    });

    if (recipeName || ingredients.length > 0) {
      this.showToast('テキストから反映しました');
    } else {
      this.showToast('認識できる情報が少なかったため、手動で入力してください');
    }
  },

  parseIngredientLine(line) {
    // 様々なパターンに対応
    // "豚ロース 200g", "玉ねぎ...1個", "醤油 大さじ2"
    const cleanLine = line.replace(/^[\-\*\•]\s*/, '').trim();

    // 数量を含む部分を分離
    const patterns = [
      /^(.+?)\s*[\.…]+\s*(\d+\.?\d*)\s*(.*)$/,  // 名前...量 単位
      /^(.+?)\s+(\d+\.?\d*)\s*(.*)$/,           // 名前 量 単位
      /^(.+?)[：:]\s*(\d+\.?\d*)\s*(.*)$/,      // 名前: 量 単位
    ];

    for (const pattern of patterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        return {
          name: match[1].trim(),
          amount: parseFloat(match[2]) || 0,
          unit: match[3].trim() || ''
        };
      }
    }

    // パターンに合わなかった場合は名前だけ
    if (cleanLine.length > 0 && cleanLine.length < 20) {
      return {
        name: cleanLine,
        amount: 0,
        unit: ''
      };
    }

    return null;
  },

  fillRecipeForm(data) {
    // 料理名
    if (data.name) {
      document.getElementById('recipe-name-input').value = data.name;
    }

    // 材料
    if (data.ingredients && data.ingredients.length > 0) {
      const ingredientsList = document.getElementById('ingredients-list');
      ingredientsList.innerHTML = '';

      data.ingredients.forEach(ing => {
        this.addIngredientRow();
        const rows = ingredientsList.querySelectorAll('.ingredient-row');
        const lastRow = rows[rows.length - 1];
        lastRow.querySelector('.ing-name').value = ing.name;
        lastRow.querySelector('.ing-amount').value = ing.amount || '';
        lastRow.querySelector('.ing-unit').value = ing.unit || '';
      });
    }

    // 手順は現在フォームにないが、将来用にコンソール出力
    if (data.steps && data.steps.length > 0) {
      console.log('認識した手順:', data.steps);
    }
  },

  addIngredientRow() {
    const list = document.getElementById('ingredients-list');
    const row = document.createElement('div');
    row.className = 'ingredient-row';
    row.innerHTML = `
      <input type="text" class="ing-name" placeholder="材料名">
      <input type="text" class="ing-amount" placeholder="量">
      <input type="text" class="ing-unit" placeholder="単位">
      <button class="btn-remove-ingredient" onclick="this.parentElement.remove()">
        <span class="material-icons-round">close</span>
      </button>
    `;
    list.appendChild(row);
  },

  goBackFromRecipeAdd() {
    this.showScreen(this.state.previousScreen || 'recipes');
  },

  saveRecipe() {
    const name = document.getElementById('recipe-name-input').value.trim();
    if (!name) {
      this.showToast('料理名を入力してください');
      return;
    }

    // 人数
    const servingsBtn = document.querySelector('.serving-btn.active');
    const servings = servingsBtn ? parseInt(servingsBtn.dataset.servings) : 2;

    // タグ
    const tags = Array.from(document.querySelectorAll('#tags-selector .tag-btn.active'))
      .map(btn => btn.dataset.tag);

    // 材料
    const ingredients = [];
    document.querySelectorAll('.ingredient-row').forEach(row => {
      const ingName = row.querySelector('.ing-name').value.trim();
      const ingAmount = row.querySelector('.ing-amount').value.trim();
      const ingUnit = row.querySelector('.ing-unit').value.trim();
      if (ingName) {
        ingredients.push({
          name: ingName,
          amount: parseFloat(ingAmount) || 0,
          unit: ingUnit || '',
        });
      }
    });

    // URL
    const url = document.getElementById('recipe-url-input').value.trim();

    // 絵文字を自動選択
    const emoji = this.guessEmoji(name, tags);

    const newRecipe = {
      id: 'recipe-' + Date.now(),
      name,
      emoji,
      servings,
      tags,
      ingredients,
      url: url || null,
    };

    this.state.recipes.push(newRecipe);
    this.saveState();

    this.showToast('追加しました');
    this.showScreen('recipes');
  },

  guessEmoji(name, tags) {
    // 簡易的な絵文字推定
    if (name.includes('豚') || name.includes('ポーク')) return '🐷';
    if (name.includes('鶏') || name.includes('チキン')) return '🍗';
    if (name.includes('牛') || name.includes('ビーフ')) return '🐄';
    if (name.includes('魚') || name.includes('鮭') || name.includes('サーモン')) return '🐟';
    if (name.includes('野菜') || name.includes('サラダ')) return '🥗';
    if (name.includes('丼')) return '🍚';
    if (name.includes('カレー')) return '🍛';
    if (name.includes('パスタ') || name.includes('スパゲティ')) return '🍝';
    if (tags.includes('中華')) return '🥢';
    if (tags.includes('洋食')) return '🍽️';
    return '🍳';
  },

  // ========================================
  // レシピ一覧画面（わたしの）
  // ========================================
  renderRecipesScreen() {
    this.renderMyTagsFilter();
    this.renderMyRecipes();
    this.renderMySets();
  },

  renderMyTagsFilter() {
    const container = document.getElementById('my-tags-filter');
    if (!container) return;

    // ユーザーのレシピから全タグを収集
    const allTags = new Set();
    this.state.recipes.forEach(recipe => {
      (recipe.tags || []).forEach(tag => allTags.add(tag));
    });

    const tags = Array.from(allTags).sort();

    if (tags.length === 0) {
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');
    container.innerHTML = `
      <button class="tag-filter-btn ${!this.mySelectedTag ? 'active' : ''}" onclick="App.filterMyByTag(null)">すべて</button>
      ${tags.map(tag => `
        <button class="tag-filter-btn ${this.mySelectedTag === tag ? 'active' : ''}" onclick="App.filterMyByTag('${tag}')">${tag}</button>
      `).join('')}
    `;
  },

  filterMyByTag(tag) {
    this.mySelectedTag = tag;
    this.renderMyTagsFilter();
    this.renderMyRecipes();
  },

  renderMyRecipes() {
    const list = document.getElementById('recipe-list');
    const empty = document.getElementById('recipes-empty');

    // タグでフィルタリング
    let recipes = this.state.recipes;
    if (this.mySelectedTag) {
      recipes = recipes.filter(r => (r.tags || []).includes(this.mySelectedTag));
    }

    if (recipes.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = recipes.map(recipe => `
      <div class="recipe-list-item" onclick="App.showRecipeDetail('${recipe.id}')">
        <span class="recipe-list-emoji">${recipe.emoji || '🍽️'}</span>
        <div class="recipe-list-info">
          <div class="recipe-list-name">${recipe.name}</div>
          <div class="recipe-list-meta">${(recipe.tags || []).join(' ')}</div>
        </div>
        <span class="recipe-list-action material-icons-round">chevron_right</span>
      </div>
    `).join('');
  },

  renderMySets() {
    const list = document.getElementById('my-set-list');
    const empty = document.getElementById('my-sets-empty');

    if (this.state.sets.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = this.state.sets.map(set => {
      const recipes = this.getRecipesFromSet(set);
      const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
      return `
        <div class="set-card" onclick="App.showSetDetail('${set.id}')">
          <div class="set-card-header">
            <span class="set-card-name">${set.name}</span>
            <span class="set-card-count">${recipes.length}品</span>
          </div>
          <div class="set-card-preview">
            <span class="set-card-preview-item">${previewNames}${recipes.length > 3 ? '...' : ''}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  showSetDetail(setId) {
    // サンプルセット、ユーザーセット、公開セットから探す
    let set = this.sampleSets.find(s => s.id === setId);
    let isUserSet = false;
    let isSampleSet = !!set;

    if (!set) {
      set = this.state.sets.find(s => s.id === setId);
      isUserSet = !!set;
    }
    if (!set) {
      set = this.publicSets.find(s => s.id === setId);
    }
    if (!set) return;

    const recipes = this.getRecipesFromSet(set);
    const modal = document.getElementById('modal-set-detail');
    document.getElementById('detail-set-name').textContent = set.name;

    const body = document.getElementById('detail-set-body');
    body.innerHTML = `
      <div style="margin-bottom: 24px;">
        <p style="color: var(--text-sub); font-size: 14px;">${recipes.length}品のレシピ</p>
      </div>
      <div class="set-detail-recipes">
        ${recipes.map(recipe => `
          <div class="set-detail-recipe-item" onclick="App.showRecipeDetailFromSet('${recipe.id}', '${setId}')">
            <span class="set-detail-recipe-emoji">${recipe.emoji || '🍽️'}</span>
            <span class="set-detail-recipe-name">${recipe.name}</span>
            <span class="material-icons-round" style="color: var(--text-hint); margin-left: auto;">chevron_right</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
        ${isUserSet ? `
          <button class="btn-primary" style="width: 100%;" onclick="App.editSet('${setId}')">
            <span class="material-icons-round">edit</span>
            編集する
          </button>
          <button class="btn-text" style="color: red;" onclick="App.deleteSet('${setId}')">
            このセットを削除
          </button>
        ` : `
          <button class="btn-primary" style="width: 100%;" onclick="App.copySetToMy('${setId}')">
            <span class="material-icons-round">content_copy</span>
            わたしのセットに追加
          </button>
        `}
      </div>
    `;

    modal.classList.remove('hidden');
  },

  copySetToMy(setId) {
    // サンプルセットまたは公開セットをユーザーセットにコピー
    let set = this.sampleSets.find(s => s.id === setId);
    if (!set) {
      set = this.publicSets.find(s => s.id === setId);
    }
    if (!set) return;

    const newSet = {
      id: `set-${Date.now()}`,
      name: set.name + '（コピー）',
      recipeIds: [...set.recipeIds],
    };

    this.state.sets.push(newSet);
    this.saveState();
    this.closeModal();
    this.showToast('わたしのセットに追加しました');

    // 編集画面へ遷移
    this.editSet(newSet.id);
  },

  editSet(setId) {
    const set = this.state.sets.find(s => s.id === setId);
    if (!set) return;

    // 編集モードの状態を設定
    this.state.editingSetId = setId;

    // IDからレシピオブジェクトを取得
    this.state.selectedRecipesForSet = set.recipeIds.map(id => {
      let recipe = this.state.recipes.find(r => r.id === id);
      if (!recipe) {
        recipe = this.publicRecipes.find(r => r.id === id);
      }
      return recipe;
    }).filter(Boolean);

    // セット作成画面へ遷移（編集モード）
    this.closeModal();
    this.showScreen('set-create');

    // フォームに既存の値をセット
    document.getElementById('set-name-input').value = set.name;
    this.renderSelectedRecipes();
    this.updateSaveSetButton();
  },

  deleteSet(setId) {
    if (confirm('このセットを削除しますか？')) {
      this.state.sets = this.state.sets.filter(s => s.id !== setId);
      this.saveState();
      this.closeModal();
      this.renderMySets();
      this.showToast('削除しました');
    }
  },

  switchMyTab(tab) {
    this.currentMyTab = tab;

    // タブボタンの状態更新
    document.querySelectorAll('#screen-recipes .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === `my-${tab}`);
    });

    // タブコンテンツの表示切替
    document.getElementById('my-recipes-tab').classList.toggle('hidden', tab !== 'recipes');
    document.getElementById('my-sets-tab').classList.toggle('hidden', tab !== 'sets');

    // 検索プレースホルダー更新
    const searchInput = document.getElementById('recipe-search');
    searchInput.placeholder = tab === 'recipes' ? 'レシピを探す' : 'セットを探す';
    searchInput.value = '';

    // 追加ボタンのラベル更新
    const addLabel = document.getElementById('btn-add-my-label');
    if (addLabel) {
      addLabel.textContent = tab === 'recipes' ? 'レシピを追加' : 'セットを作る';
    }

    // タグフィルターの表示切替（レシピタブのみ）
    const tagsFilter = document.getElementById('my-tags-filter');
    if (tagsFilter) {
      tagsFilter.style.display = tab === 'recipes' ? '' : 'none';
    }
  },

  showAddForMyTab() {
    if (this.currentMyTab === 'recipes') {
      this.showScreen('recipe-add');
    } else {
      this.showScreen('set-create');
    }
  },

  filterMyItems() {
    const query = document.getElementById('recipe-search').value.toLowerCase();

    if (this.currentMyTab === 'recipes') {
      const items = document.querySelectorAll('#recipe-list .recipe-list-item');
      items.forEach(item => {
        const name = item.querySelector('.recipe-list-name').textContent.toLowerCase();
        const tags = item.querySelector('.recipe-list-meta').textContent.toLowerCase();
        item.style.display = (name.includes(query) || tags.includes(query)) ? '' : 'none';
      });
    } else {
      const items = document.querySelectorAll('#my-set-list .set-card');
      items.forEach(item => {
        const name = item.querySelector('.set-card-name').textContent.toLowerCase();
        item.style.display = name.includes(query) ? '' : 'none';
      });
    }
  },

  filterRecipes() {
    this.filterMyItems();
  },

  showRecipeDetail(recipeId) {
    let recipe = this.state.recipes.find(r => r.id === recipeId);
    if (!recipe) {
      recipe = this.publicRecipes.find(r => r.id === recipeId);
    }
    if (!recipe) return;

    const modal = document.getElementById('modal-recipe-detail');
    document.getElementById('detail-recipe-name').textContent = recipe.name;

    const body = document.getElementById('detail-recipe-body');
    body.innerHTML = `
      <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
      <div style="margin-bottom: 16px;">
        <strong>${recipe.servings}人前</strong>
        <span style="margin-left: 8px; color: var(--text-hint);">${(recipe.tags || []).join(' ')}</span>
      </div>
      ${recipe.url ? `<a href="${recipe.url}" target="_blank" style="color: var(--accent); display: block; margin-bottom: 16px;">レシピページを開く →</a>` : ''}
      <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">材料</h3>
      <ul style="list-style: none; margin-bottom: 24px;">
        ${(recipe.ingredients || []).map(ing => `
          <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
            ${ing.name} ${ing.amount}${ing.unit}
          </li>
        `).join('')}
      </ul>
      ${(recipe.steps && recipe.steps.length > 0) ? `
        <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">手順</h3>
        <ol style="margin-bottom: 24px; padding-left: 20px;">
          ${recipe.steps.map(step => `
            <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
              ${step}
            </li>
          `).join('')}
        </ol>
      ` : ''}
      ${recipe.id.startsWith('recipe-') ? `
        <button class="btn-text" style="color: red; margin-top: 24px;" onclick="App.deleteRecipe('${recipe.id}')">
          このレシピを削除
        </button>
      ` : ''}
    `;

    modal.classList.remove('hidden');
  },

  deleteRecipe(recipeId) {
    if (confirm('このレシピを削除する？')) {
      this.state.recipes = this.state.recipes.filter(r => r.id !== recipeId);
      this.saveState();
      this.closeModal();
      this.renderRecipesScreen();
      this.showToast('削除しました');
    }
  },

  showRecipeDetailFromSet(recipeId, setId) {
    // セット詳細からレシピ詳細を表示（戻り先を記憶）
    this.returnToSetId = setId;

    let recipe = this.state.recipes.find(r => r.id === recipeId);
    if (!recipe) {
      recipe = this.publicRecipes.find(r => r.id === recipeId);
    }
    if (!recipe) return;

    // セット詳細モーダルを閉じる
    document.getElementById('modal-set-detail').classList.add('hidden');

    const modal = document.getElementById('modal-recipe-detail');
    document.getElementById('detail-recipe-name').textContent = recipe.name;

    const body = document.getElementById('detail-recipe-body');
    body.innerHTML = `
      <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
      <div style="margin-bottom: 16px;">
        <strong>${recipe.servings}人前</strong>
        <span style="margin-left: 8px; color: var(--text-hint);">${(recipe.tags || []).join(' ')}</span>
      </div>
      ${recipe.url ? `<a href="${recipe.url}" target="_blank" style="color: var(--accent); display: block; margin-bottom: 16px;">レシピページを開く →</a>` : ''}
      <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">材料</h3>
      <ul style="list-style: none; margin-bottom: 24px;">
        ${(recipe.ingredients || []).map(ing => `
          <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
            ${ing.name} ${ing.amount}${ing.unit}
          </li>
        `).join('')}
      </ul>
      ${(recipe.steps && recipe.steps.length > 0) ? `
        <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">手順</h3>
        <ol style="margin-bottom: 24px; padding-left: 20px;">
          ${recipe.steps.map(step => `
            <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
              ${step}
            </li>
          `).join('')}
        </ol>
      ` : ''}
      <button class="btn-secondary" style="width: 100%; margin-top: 16px;" onclick="App.backToSetDetail()">
        <span class="material-icons-round">arrow_back</span>
        セット詳細に戻る
      </button>
    `;

    modal.classList.remove('hidden');
  },

  backToSetDetail() {
    // レシピ詳細からセット詳細に戻る
    document.getElementById('modal-recipe-detail').classList.add('hidden');
    if (this.returnToSetId) {
      this.showSetDetail(this.returnToSetId);
      this.returnToSetId = null;
    }
  },

  // ========================================
  // 買い物リスト画面
  // ========================================
  renderShoppingScreen() {
    const list = document.getElementById('shopping-list');
    const empty = document.getElementById('shopping-empty');
    const actions = document.getElementById('shopping-actions');

    if (!this.state.currentSet) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      actions.classList.add('hidden');
      return;
    }

    // 材料を集計
    const recipes = this.getRecipesFromSet(this.state.currentSet);
    const ingredientMap = new Map();

    recipes.forEach(recipe => {
      if (!recipe.ingredients) return;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name}-${ing.unit}`;
        if (ingredientMap.has(key)) {
          ingredientMap.get(key).amount += ing.amount;
        } else {
          ingredientMap.set(key, { ...ing });
        }
      });
    });

    const ingredients = Array.from(ingredientMap.values());

    if (ingredients.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      actions.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    actions.classList.remove('hidden');

    list.innerHTML = ingredients.map((ing, index) => {
      const isChecked = this.state.shoppingChecked.includes(index);
      return `
        <div class="shopping-item ${isChecked ? 'checked' : ''}" onclick="App.toggleShoppingItem(${index})">
          <div class="shopping-checkbox">
            <span class="material-icons-round">check</span>
          </div>
          <div class="shopping-info">
            <div class="shopping-name">${ing.name}</div>
            <div class="shopping-amount">${ing.amount}${ing.unit}</div>
          </div>
        </div>
      `;
    }).join('');

    // チェック済みボタンの表示制御
    const btnPurchaseChecked = document.getElementById('btn-purchase-checked');
    if (btnPurchaseChecked) {
      const hasChecked = this.state.shoppingChecked && this.state.shoppingChecked.length > 0;
      btnPurchaseChecked.style.display = hasChecked ? 'flex' : 'none';
    }
  },

  toggleShoppingItem(index) {
    const idx = this.state.shoppingChecked.indexOf(index);
    if (idx === -1) {
      this.state.shoppingChecked.push(index);
    } else {
      this.state.shoppingChecked.splice(idx, 1);
    }
    this.saveState();
    this.renderShoppingScreen();
  },

  // ========================================
  // Public画面（みんなの）
  // ========================================
  renderPublicScreen() {
    this.renderPublicRecipes();
    this.renderPublicSets();
  },

  renderPublicRecipes() {
    const list = document.getElementById('public-recipe-list');

    list.innerHTML = this.publicRecipes.map(recipe => `
      <div class="recipe-list-item" onclick="App.showRecipeDetail('${recipe.id}')">
        <span class="recipe-list-emoji">${recipe.emoji || '🍽️'}</span>
        <div class="recipe-list-info">
          <div class="recipe-list-name">${recipe.name}</div>
          <div class="recipe-list-meta">${(recipe.tags || []).join(' ')}</div>
        </div>
        <button class="btn-text" onclick="event.stopPropagation(); App.addPublicRecipeToMine('${recipe.id}')">
          保存
        </button>
      </div>
    `).join('');
  },

  renderPublicSets() {
    const list = document.getElementById('public-set-list');

    list.innerHTML = this.publicSets.map(set => {
      const recipes = this.getRecipesFromSet(set);
      const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
      return `
        <div class="public-set-card" onclick="App.showPublicSetDetail('${set.id}')">
          <div class="public-set-header">
            <span class="public-set-name">${set.name}</span>
            <span class="public-set-author">
              <span class="material-icons-round">person</span>
              ${set.author}
            </span>
          </div>
          <div class="public-set-preview">${previewNames}${recipes.length > 3 ? '...' : ''}</div>
          <div class="public-set-meta">
            <span class="public-set-count">${recipes.length}品</span>
            <div class="public-set-actions-inline">
              <button class="btn-use-set" onclick="event.stopPropagation(); App.usePublicSetAsKondate('${set.id}')">
                <span class="material-icons-round">style</span>
                使う
              </button>
              <button class="btn-save-set" onclick="event.stopPropagation(); App.savePublicSet('${set.id}')">
                <span class="material-icons-round">bookmark_border</span>
                保存
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  switchPublicTab(tab) {
    this.currentPublicTab = tab;

    // タブボタンの状態更新
    document.querySelectorAll('#screen-public .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === `public-${tab}`);
    });

    // タブコンテンツの表示切替
    document.getElementById('public-recipes-tab').classList.toggle('hidden', tab !== 'recipes');
    document.getElementById('public-sets-tab').classList.toggle('hidden', tab !== 'sets');

    // 検索プレースホルダー更新
    const searchInput = document.getElementById('public-search');
    searchInput.placeholder = tab === 'recipes' ? 'レシピを探す' : 'セットを探す';
    searchInput.value = '';
  },

  filterPublicItems() {
    const query = document.getElementById('public-search').value.toLowerCase();

    if (this.currentPublicTab === 'recipes') {
      const items = document.querySelectorAll('#public-recipe-list .recipe-list-item');
      items.forEach(item => {
        const name = item.querySelector('.recipe-list-name').textContent.toLowerCase();
        const tags = item.querySelector('.recipe-list-meta').textContent.toLowerCase();
        item.style.display = (name.includes(query) || tags.includes(query)) ? '' : 'none';
      });
    } else {
      const items = document.querySelectorAll('#public-set-list .public-set-card');
      items.forEach(item => {
        const name = item.querySelector('.public-set-name').textContent.toLowerCase();
        const author = item.querySelector('.public-set-author').textContent.toLowerCase();
        item.style.display = (name.includes(query) || author.includes(query)) ? '' : 'none';
      });
    }
  },

  filterPublicRecipes() {
    this.filterPublicItems();
  },

  addPublicRecipeToMine(recipeId) {
    const recipe = this.publicRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // 既に追加済みかチェック
    if (this.state.recipes.some(r => r.name === recipe.name)) {
      this.showToast('保存済みです');
      return;
    }

    // コピーして追加
    const newRecipe = {
      ...recipe,
      id: 'recipe-' + Date.now(),
    };
    this.state.recipes.push(newRecipe);
    this.saveState();
    this.showToast('レシピを保存しました');
  },

  savePublicSet(setId) {
    const set = this.publicSets.find(s => s.id === setId);
    if (!set) return;

    // 既に保存済みかチェック
    if (this.state.sets.some(s => s.name === set.name)) {
      this.showToast('保存済みです');
      return;
    }

    // コピーして追加
    const newSet = {
      ...set,
      id: 'set-' + Date.now(),
      originalAuthor: set.author,
    };
    this.state.sets.push(newSet);
    this.saveState();
    this.showToast('セットを保存しました');
  },

  showPublicSetDetail(setId) {
    const set = this.publicSets.find(s => s.id === setId);
    if (!set) return;

    const recipes = this.getRecipesFromSet(set);

    const modal = document.getElementById('modal-recipe-detail');
    document.getElementById('detail-recipe-name').textContent = set.name;

    const body = document.getElementById('detail-recipe-body');
    body.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: var(--text-sub);">
        <span class="material-icons-round" style="font-size: 18px;">person</span>
        ${set.author}
      </div>
      <div style="margin-bottom: 16px; color: var(--text-hint);">
        ${(set.tags || []).join(' ')}
      </div>
      <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">含まれるレシピ（${recipes.length}品）</h3>
      <ul style="list-style: none;">
        ${recipes.map(recipe => `
          <li style="padding: 12px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">${recipe.emoji || '🍽️'}</span>
            <span>${recipe.name}</span>
          </li>
        `).join('')}
      </ul>
      <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
        <button class="btn-primary" style="width: 100%;" onclick="App.usePublicSetAsKondate('${set.id}')">
          <span class="material-icons-round">style</span>
          この献立を使う
        </button>
        <button class="btn-secondary" style="width: 100%;" onclick="App.savePublicSet('${set.id}'); App.closeModal();">
          <span class="material-icons-round">bookmark_border</span>
          わたしのセットに保存
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
  },

  usePublicSetAsKondate(setId) {
    // 公開セットを直接献立として使用
    const set = this.publicSets.find(s => s.id === setId);
    if (!set) return;

    // セットを現在の献立に設定
    this.state.currentSet = {
      ...set,
      id: `temp-${set.id}`, // 一時的なID（保存はしない）
    };
    this.state.cookedRecipes = [];
    this.state.shoppingChecked = [];
    this.saveState();
    this.closeModal();
    this.showScreen('main');

    // オンボーディング: 初めてセットを選んだ
    if (!this.onboarding.setSelected) {
      this.onboarding.setSelected = true;
      this.saveOnboarding();
      setTimeout(() => this.showGuide('guideShopping'), 500);
    } else {
      this.showToast('献立に設定しました');
    }
  },

  // ========================================
  // モーダル
  // ========================================
  closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  },

  // ========================================
  // 冷蔵庫
  // ========================================
  showFridge() {
    const modal = document.getElementById('modal-fridge');
    const body = document.getElementById('fridge-body');

    const fridge = this.state.fridge || [];

    if (fridge.length === 0) {
      body.innerHTML = `
        <div class="fridge-empty">
          <div style="font-size: 48px; margin-bottom: 16px;">🧊</div>
          <p>冷蔵庫は空です</p>
          <p style="font-size: 12px; color: var(--text-hint); margin-top: 8px;">
            買い物リストで「購入した」を押すと<br>ここに食材が入ります
          </p>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="fridge-list">
          ${fridge.map(item => `
            <div class="fridge-item">
              <span class="fridge-item-name">${item.name}</span>
              <span class="fridge-item-amount">${item.amount}${item.unit}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    modal.classList.remove('hidden');
  },

  purchaseAll() {
    // 買い物リストの材料を冷蔵庫に追加
    const recipes = this.getRecipesFromSet(this.state.currentSet);
    const ingredientMap = new Map();

    recipes.forEach(recipe => {
      if (!recipe.ingredients) return;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name}-${ing.unit}`;
        if (ingredientMap.has(key)) {
          ingredientMap.get(key).amount += ing.amount;
        } else {
          ingredientMap.set(key, { ...ing });
        }
      });
    });

    // 冷蔵庫に追加（同じ食材があれば加算）
    if (!this.state.fridge) {
      this.state.fridge = [];
    }

    ingredientMap.forEach(newItem => {
      const existing = this.state.fridge.find(
        f => f.name === newItem.name && f.unit === newItem.unit
      );
      if (existing) {
        existing.amount += newItem.amount;
      } else {
        this.state.fridge.push({ ...newItem });
      }
    });

    // 買い物リストのチェックをリセット
    this.state.shoppingChecked = [];

    this.saveState();
    this.showScreen('main');

    // オンボーディング: 初めて購入した
    if (!this.onboarding.fridgeNotified) {
      this.onboarding.purchasePrompted = true;
      this.onboarding.fridgeNotified = true;
      this.saveOnboarding();
      setTimeout(() => this.showGuide('fridgeStocked'), 300);
    } else {
      this.showToast('冷蔵庫に追加しました！');
    }
  },

  purchaseChecked() {
    // チェック済みの材料のみを冷蔵庫に追加
    if (!this.state.shoppingChecked || this.state.shoppingChecked.length === 0) {
      this.showToast('チェックされた項目がありません');
      return;
    }

    // 材料を集計
    const recipes = this.getRecipesFromSet(this.state.currentSet);
    const ingredientMap = new Map();

    recipes.forEach(recipe => {
      if (!recipe.ingredients) return;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name}-${ing.unit}`;
        if (ingredientMap.has(key)) {
          ingredientMap.get(key).amount += ing.amount;
        } else {
          ingredientMap.set(key, { ...ing });
        }
      });
    });

    const ingredients = Array.from(ingredientMap.values());

    // 冷蔵庫に追加（チェック済みの材料のみ）
    if (!this.state.fridge) {
      this.state.fridge = [];
    }

    this.state.shoppingChecked.forEach(index => {
      const ing = ingredients[index];
      if (!ing) return;

      const existing = this.state.fridge.find(
        f => f.name === ing.name && f.unit === ing.unit
      );
      if (existing) {
        existing.amount += ing.amount;
      } else {
        this.state.fridge.push({ ...ing });
      }
    });

    // チェック済みをリセット
    this.state.shoppingChecked = [];

    this.saveState();
    this.renderShoppingScreen();

    // オンボーディング: 初めて購入した
    if (!this.onboarding.fridgeNotified) {
      this.onboarding.purchasePrompted = true;
      this.onboarding.fridgeNotified = true;
      this.saveOnboarding();
      setTimeout(() => this.showGuide('fridgeStocked'), 300);
    } else {
      this.showToast('チェック済みを冷蔵庫に追加しました');
    }
  },

  consumeIngredientsFromFridge(recipe) {
    // レシピの材料を冷蔵庫から消費
    if (!recipe.ingredients || !this.state.fridge) return;

    recipe.ingredients.forEach(ing => {
      const fridgeItem = this.state.fridge.find(
        f => f.name === ing.name && f.unit === ing.unit
      );
      if (fridgeItem) {
        fridgeItem.amount -= ing.amount;
        // 0以下になったら削除
        if (fridgeItem.amount <= 0) {
          this.state.fridge = this.state.fridge.filter(f => f !== fridgeItem);
        }
      }
    });
  },

  // ========================================
  // トースト
  // ========================================
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  },

  // ========================================
  // イベントリスナー
  // ========================================
  setupEventListeners() {
    // 人数選択
    document.querySelectorAll('.serving-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.serving-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // タグ選択
    document.querySelectorAll('#tags-selector .tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
      });
    });

    // セット名入力
    document.getElementById('set-name-input')?.addEventListener('input', () => {
      this.updateSaveSetButton();
    });

    // Publicタグフィルター
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tag = btn.dataset.tag;
        const items = document.querySelectorAll('#public-recipe-list .recipe-list-item');

        items.forEach(item => {
          if (tag === 'all') {
            item.style.display = '';
          } else {
            const tags = item.querySelector('.recipe-list-meta').textContent;
            item.style.display = tags.includes(tag) ? '' : 'none';
          }
        });
      });
    });

    // モーダル外クリックで閉じる
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => this.closeModal());
    });
  },

  // ========================================
  // レンダリング
  // ========================================
  render() {
    // 初期状態の設定
    this.updateSaveSetButton();
    this.updateBadges();
  },

  // ========================================
  // バッジ更新
  // ========================================
  updateBadges() {
    const fridgeCount = (this.state.fridge || []).length;
    const shoppingCount = this.getShoppingListCount();

    // 冷蔵庫バッジ（全画面共通）
    const fridgeBadges = [
      document.getElementById('badge-fridge-main'),
      document.getElementById('badge-fridge-recipes'),
      document.getElementById('badge-fridge-public'),
    ];
    fridgeBadges.forEach(badge => {
      if (badge) {
        badge.classList.toggle('visible', fridgeCount > 0);
      }
    });

    // 買い物リストバッジ（全画面共通）
    const shoppingBadges = [
      document.getElementById('badge-shopping-main'),
      document.getElementById('badge-shopping-recipes'),
      document.getElementById('badge-shopping-public'),
    ];
    shoppingBadges.forEach(badge => {
      if (badge) {
        badge.classList.toggle('visible', shoppingCount > 0);
      }
    });
  },

  getShoppingListCount() {
    if (!this.state.currentSet) return 0;

    const recipes = this.getRecipesFromSet(this.state.currentSet);
    const ingredientSet = new Set();

    recipes.forEach(recipe => {
      if (!recipe.ingredients) return;
      recipe.ingredients.forEach(ing => {
        ingredientSet.add(`${ing.name}-${ing.unit}`);
      });
    });

    return ingredientSet.size;
  },
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
