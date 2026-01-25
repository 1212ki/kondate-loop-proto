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
    cookingLogs: [],       // 料理ログ [{id, recipeId, recipeName, recipeEmoji, cookedAt, note, photoDataUrl, setId, setName}]
    shoppingChecked: [],   // チェック済み買い物アイテム
    shoppingPurchased: [], // 購入済み買い物アイテム（name-unit）
    shoppingExtraItems: [], // 追加で買う食材 [{id, name, amount, unit, key}]
    fridge: [],            // 冷蔵庫の食材 [{name, amount, unit}]
    deletedFridgeItems: [], // 削除した食材履歴 [{name, amount, unit, deletedAt}]
    selectedRecipesForSet: [], // セット作成時の選択レシピ
    previousScreen: 'main',
    accountType: 'user',   // user / creator / paid
    profile: {
      name: 'あなた',
      avatar: '🙂',
    },
    creatorProfile: {
      displayName: '',
      bio: '',
      isPublic: false,
    },
    paymentMethod: null,   // {brand, last4}
    purchasedSets: [],     // 購入済みセットのID
    purchasedRecipeIds: [], // 購入済みレシピID
    purchasedPublicSetIds: [], // 購入済み公開セットID
    membershipCount: 0,    // メンバーシップ加入数（ユーザー向け）
    sampleDataSeeded: false,
    subscriptionStatus: 'inactive', // paidの場合の状態
    creatorStatus: 'not_started', // not_started / pending / approved
    diagnosis: null,       // {generatedAt, insights, topTags}
    lastCompletedSetId: null, // 直近で完了ガイドを表示したセットID
  },

  // UI状態（保存しない）
  currentMyTab: 'recipes',
  mySelectedTag: null,
  selectorTab: 'my', // レシピ選択モーダルのタブ（my / public）
  currentSetSelectTab: 'my',
  historyCalendarMonth: null,
  historySelectedDate: null,
  pendingCookingLogId: null,
  pendingCookingLogPhoto: '',

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
      intermediates: [
        {
          label: 'A',
          name: '合わせ調味料',
          ingredients: [
            { name: '醤油', amount: 2, unit: '大さじ' },
            { name: '酒', amount: 2, unit: '大さじ' },
            { name: 'みりん', amount: 1, unit: '大さじ' },
            { name: '生姜', amount: 1, unit: 'かけ' },
          ],
          steps: ['すべて混ぜておく'],
        },
      ],
      steps: [
        'A（合わせ調味料）を作る：醤油・酒・みりん・生姜を混ぜる',
        '玉ねぎを薄切りにする',
        'フライパンに油を熱し、豚肉を焼く',
        '玉ねぎを加えて炒める',
        'Aを加えて絡める',
      ],
    },
    {
      id: 'pub-002',
      name: '鶏の唐揚げ',
      emoji: '🍗',
      servings: 2,
      tags: ['和食', '定番', '鶏肉'],
      price: 100,
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
      price: 100,
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
      price: 100,
      membership: true,
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
      price: 100,
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
      price: 100,
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
    // スターターセット12個（REQ-003）
    // 既存のpub-001〜pub-008を使用（将来的にレシピ追加予定）
    {
      id: 'starter-001',
      name: '平日5日間の時短セット',
      recipeIds: ['pub-001', 'pub-004', 'pub-005', 'pub-006', 'pub-008'],
      tags: ['時短', '平日'],
    },
    {
      id: 'starter-002',
      name: '和食の基本セット',
      recipeIds: ['pub-001', 'pub-002', 'pub-003', 'pub-006', 'pub-007', 'pub-008', 'pub-004'],
      tags: ['和食', '定番'],
    },
    {
      id: 'starter-003',
      name: '洋食入門セット',
      recipeIds: ['pub-007', 'pub-002', 'pub-008', 'pub-004', 'pub-006'],
      tags: ['洋食', '簡単'],
    },
    {
      id: 'starter-004',
      name: 'ヘルシー週間セット',
      recipeIds: ['pub-003', 'pub-007', 'pub-008', 'pub-006', 'pub-004', 'pub-001', 'pub-002'],
      tags: ['野菜', 'ヘルシー'],
    },
    {
      id: 'starter-005',
      name: '節約レシピセット',
      recipeIds: ['pub-001', 'pub-003', 'pub-006', 'pub-004', 'pub-005'],
      tags: ['節約', '家計'],
    },
    {
      id: 'starter-006',
      name: '作り置きセット',
      recipeIds: ['pub-003', 'pub-002', 'pub-006', 'pub-001', 'pub-007'],
      tags: ['作り置き', '週末'],
    },
    {
      id: 'starter-007',
      name: '一人暮らし応援セット',
      recipeIds: ['pub-001', 'pub-004', 'pub-005', 'pub-006', 'pub-008', 'pub-002', 'pub-007'],
      tags: ['一人暮らし', '簡単'],
    },
    {
      id: 'starter-008',
      name: '麺づくしセット',
      recipeIds: ['pub-004', 'pub-005', 'pub-008', 'pub-001', 'pub-006'],
      tags: ['麺', 'ランチ'],
    },
    {
      id: 'starter-009',
      name: 'どんぶりセット',
      recipeIds: ['pub-001', 'pub-002', 'pub-005', 'pub-006', 'pub-004'],
      tags: ['丼', '簡単'],
    },
    {
      id: 'starter-010',
      name: '中華セット',
      recipeIds: ['pub-005', 'pub-004', 'pub-008', 'pub-001', 'pub-006'],
      tags: ['中華', '定番'],
    },
    {
      id: 'starter-011',
      name: '煮込み料理セット',
      recipeIds: ['pub-003', 'pub-002', 'pub-006', 'pub-001', 'pub-007', 'pub-008', 'pub-004'],
      tags: ['煮込み', 'じっくり'],
    },
    {
      id: 'starter-012',
      name: '初心者向けセット',
      recipeIds: ['pub-001', 'pub-004', 'pub-005', 'pub-006', 'pub-007', 'pub-008', 'pub-002'],
      tags: ['初心者', '基本'],
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
      price: 500,
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
      price: 500,
    },
  ],

  // 現在のタブ状態
  currentMyTab: 'recipes',
  currentPublicTab: 'recipes',
  currentSort: {
    my: 'おすすめ順',
    public: 'おすすめ順',
  },
  filterState: {
    my: { status: [], time: [], tag: [], rating: [] },
    public: { status: [], time: [], tag: [], rating: [] },
  },
  activeFilterContext: 'my',
  activeSortContext: 'my',

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
  // ユーティリティ
  // ========================================
  getRecipeById(recipeId) {
    // 公開レシピから検索
    let recipe = this.publicRecipes.find(r => r.id === recipeId);
    if (recipe) return recipe;

    // ユーザーのレシピから検索
    recipe = this.state.recipes.find(r => r.id === recipeId);
    return recipe || null;
  },

  formatPrice(price) {
    return `¥${price}`;
  },

  formatPurchaseDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  },

  isRecipeSaved(recipe) {
    return this.state.recipes.some(r => r.name === recipe.name);
  },

  getRecipeAccessInfo(recipe) {
    const price = Number(recipe.price || 0);
    const isMembership = !!recipe.membership;
    const isMember = this.state.membershipCount > 0;
    const purchased = this.state.purchasedRecipeIds.includes(recipe.id);
    const free = price <= 0;
    const accessible = free || purchased || (isMembership && isMember);
    let status = 'free';
    if (purchased) {
      status = 'purchased';
    } else if (isMembership && isMember) {
      status = 'membership';
    } else if (price > 0) {
      status = 'paid';
    }
    return {
      price,
      isMembership,
      isMember,
      purchased,
      free,
      accessible,
      status,
    };
  },

  getSetAccessInfo(set) {
    const price = Number(set.price || 0);
    const purchased = this.state.purchasedPublicSetIds.includes(set.id);
    const free = price <= 0;
    const accessible = free || purchased;
    let status = 'free';
    if (purchased) {
      status = 'purchased';
    } else if (price > 0) {
      status = 'paid';
    }
    return {
      price,
      purchased,
      free,
      accessible,
      status,
    };
  },

  buildAccessBadge(access) {
    if (access.status === 'purchased') {
      return '<span class="badge badge-owned">購入済み</span>';
    }
    if (access.status === 'membership') {
      return '<span class="badge badge-member">メンバーシップ</span>';
    }
    if (access.status === 'paid') {
      return `<span class="badge badge-paid">${this.formatPrice(access.price)}</span>`;
    }
    return '<span class="badge badge-free">フリー</span>';
  },

  buildMembershipBadge(access) {
    if (access.isMembership && access.status !== 'membership') {
      return '<span class="badge badge-member-sub">メンバーシップ</span>';
    }
    return '';
  },

  buildIntermediateSection(recipe) {
    const intermediates = Array.isArray(recipe.intermediates) ? recipe.intermediates : [];
    if (intermediates.length === 0) return '';

    const items = intermediates.map((item, index) => {
      const label = item.label ? `${item.label}` : `中間素材${index + 1}`;
      const name = item.name ? `：${item.name}` : '';
      const ingredientList = (item.ingredients || []).map(ing => `
        <li style="padding: 6px 0; border-bottom: 1px dashed var(--border);">
          ${ing.name} ${ing.amount}${ing.unit}
        </li>
      `).join('');
      const steps = Array.isArray(item.steps) && item.steps.length > 0
        ? `<div style="margin-top: 8px; font-size: 12px; color: var(--text-hint);">作り方：${item.steps.join(' / ')}</div>`
        : '';

      return `
        <div style="padding: 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-card); margin-bottom: 12px;">
          <div style="font-weight: 600; margin-bottom: 8px;">${label}${name}</div>
          <ul style="list-style: none;">
            ${ingredientList}
          </ul>
          ${steps}
        </div>
      `;
    }).join('');

    return `
      <h3 style="font-size: 14px; color: var(--text-sub); margin-bottom: 8px;">中間素材</h3>
      <div style="margin-bottom: 24px;">
        ${items}
      </div>
    `;
  },

  normalizeText(text) {
    return (text || '').toString().toLowerCase().replace(/\s+/g, '');
  },

  getSetIngredientNames(set) {
    const names = new Set();
    this.getRecipesFromSet(set).forEach(recipe => {
      const allIngredients = [
        ...(recipe.ingredients || []),
        ...((recipe.intermediates || []).flatMap(item => item.ingredients || [])),
      ];
      allIngredients.forEach(ing => {
        const name = (ing.name || '').trim();
        if (name) names.add(name);
      });
    });
    return Array.from(names);
  },

  getAllSetsWithSource() {
    return [
      ...this.sampleSets.map(set => ({ set, source: 'starter' })),
      ...this.state.sets.map(set => ({ set, source: 'user' })),
      ...this.publicSets.map(set => ({ set, source: 'public' })),
    ];
  },

  getSetSourceLabel(source) {
    if (source === 'starter') return 'スターター';
    if (source === 'user') return 'レシピ帳';
    return 'レシピカタログ';
  },

  matchFridgeItem(ingredientName, fridgeItems) {
    const ingredientKey = this.normalizeText(ingredientName);
    if (!ingredientKey || ingredientKey.length < 2) return null;
    return fridgeItems.find(item =>
      ingredientKey.includes(item.key) || item.key.includes(ingredientKey)
    ) || null;
  },

  getFridgeRecommendations(limit = 3) {
    const fridgeItems = (this.state.fridge || [])
      .map(item => ({
        name: item.name,
        key: this.normalizeText(item.name),
      }))
      .filter(item => item.key);

    if (fridgeItems.length === 0) return [];

    const candidates = [];
    this.getAllSetsWithSource().forEach(({ set, source }) => {
      const ingredientNames = this.getSetIngredientNames(set);
      if (ingredientNames.length === 0) return;

      const matchedIngredients = [];
      const matchedFridge = new Set();

      ingredientNames.forEach(name => {
        const match = this.matchFridgeItem(name, fridgeItems);
        if (match) {
          matchedIngredients.push(name);
          matchedFridge.add(match.name);
        }
      });

      if (matchedIngredients.length === 0) return;

      candidates.push({
        set,
        source,
        matchCount: matchedIngredients.length,
        totalCount: ingredientNames.length,
        matchedFridge: Array.from(matchedFridge),
      });
    });

    candidates.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return (b.matchCount / b.totalCount) - (a.matchCount / a.totalCount);
    });

    return candidates.slice(0, limit);
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
    if (!Array.isArray(this.state.recipes)) this.state.recipes = [];
    if (!Array.isArray(this.state.sets)) this.state.sets = [];
    if (!Array.isArray(this.state.setHistory)) this.state.setHistory = [];
    if (!Array.isArray(this.state.cookingLogs)) {
      this.state.cookingLogs = [];
      const history = Array.isArray(this.state.setHistory) ? this.state.setHistory : [];
      history.forEach((entry, entryIndex) => {
        const cookedIds = Array.isArray(entry.cookedRecipes) && entry.cookedRecipes.length > 0
          ? entry.cookedRecipes
          : (entry.set?.recipeIds || []);
        cookedIds.forEach((recipeId, recipeIndex) => {
          const recipe = this.getRecipeById(recipeId);
          this.state.cookingLogs.push({
            id: `legacy-${entryIndex}-${recipeIndex}-${recipeId}`,
            recipeId,
            recipeName: recipe?.name || '料理',
            recipeEmoji: recipe?.emoji || '🍽️',
            cookedAt: entry.endedAt || new Date().toISOString(),
            note: '',
            photoDataUrl: '',
            setId: entry.set?.id || '',
            setName: entry.set?.name || '',
          });
        });
      });
    }
    if (!Array.isArray(this.state.fridge)) this.state.fridge = [];
    if (!Array.isArray(this.state.deletedFridgeItems)) this.state.deletedFridgeItems = [];
    if (!Array.isArray(this.state.purchasedSets)) this.state.purchasedSets = [];
    if (!Array.isArray(this.state.purchasedRecipeIds)) this.state.purchasedRecipeIds = [];
    if (!Array.isArray(this.state.purchasedPublicSetIds)) this.state.purchasedPublicSetIds = [];
    if (!Array.isArray(this.state.shoppingExtraItems)) this.state.shoppingExtraItems = [];
    if (!Array.isArray(this.state.shoppingChecked)) this.state.shoppingChecked = [];
    if (!Array.isArray(this.state.shoppingPurchased)) this.state.shoppingPurchased = [];
    if (!this.state.lastCompletedSetId) this.state.lastCompletedSetId = null;
    this.state.shoppingExtraItems = this.state.shoppingExtraItems.map((item, index) => {
      const id = item.id || `extra-${Date.now()}-${index}`;
      return {
        id,
        name: item.name || '',
        amount: typeof item.amount === 'number' ? item.amount : 1,
        unit: item.unit || '',
        key: item.key || id,
      };
    }).filter(item => item.name);
    if (typeof this.state.membershipCount !== 'number') this.state.membershipCount = 0;
    if (!this.state.profile) {
      this.state.profile = { name: 'あなた', avatar: '🙂' };
    }
    if (!this.state.creatorProfile) {
      this.state.creatorProfile = {
        displayName: this.state.profile?.name || 'あなた',
        bio: '',
        isPublic: false,
      };
    } else {
      if (!this.state.creatorProfile.displayName) {
        this.state.creatorProfile.displayName = this.state.profile?.name || 'あなた';
      }
      if (this.state.creatorProfile.bio === undefined || this.state.creatorProfile.bio === null) {
        this.state.creatorProfile.bio = '';
      }
      if (typeof this.state.creatorProfile.isPublic !== 'boolean') {
        this.state.creatorProfile.isPublic = false;
      }
    }
    if (!this.state.accountType) this.state.accountType = 'user';
    if (!this.state.subscriptionStatus) this.state.subscriptionStatus = 'inactive';
    if (!this.state.creatorStatus) this.state.creatorStatus = 'not_started';
    if (!this.state.diagnosis) this.state.diagnosis = null;

    if (!this.state.sampleDataSeeded) {
      if (this.state.purchasedSets.length === 0) {
        this.state.purchasedSets = [
          { name: 'あったか和食7レシピ', purchasedAt: '2026/01/05' },
          { name: '週末作り置き7レシピ', purchasedAt: '2026/01/08' },
          { name: 'ヘルシー夜ごはん7レシピ', purchasedAt: '2026/01/11' },
          { name: '10分でできる7レシピ', purchasedAt: '2026/01/14' },
          { name: '野菜たっぷり7レシピ', purchasedAt: '2026/01/18' },
          { name: 'ごはんが進む7レシピ', purchasedAt: '2026/01/21' },
          { name: '冬のごちそう7レシピ', purchasedAt: '2026/01/24' },
        ];
      }
      if (this.state.purchasedRecipeIds.length === 0) {
        this.state.purchasedRecipeIds = ['pub-002'];
      }
      if (this.state.purchasedPublicSetIds.length === 0) {
        this.state.purchasedPublicSetIds = ['chef-003'];
      }
      if (this.state.accountType === 'user' && this.state.membershipCount === 0) {
        this.state.membershipCount = 1;
      }
      this.state.sampleDataSeeded = true;
    }
  },

  saveState() {
    localStorage.setItem('kondate-v2-state', JSON.stringify({
      recipes: this.state.recipes,
      sets: this.state.sets,
      currentSet: this.state.currentSet,
      nextSet: this.state.nextSet,
      setHistory: this.state.setHistory,
      cookedRecipes: this.state.cookedRecipes,
      cookingLogs: this.state.cookingLogs,
      shoppingChecked: this.state.shoppingChecked,
      shoppingPurchased: this.state.shoppingPurchased,
      fridge: this.state.fridge,
      deletedFridgeItems: this.state.deletedFridgeItems,
      accountType: this.state.accountType,
      profile: this.state.profile,
      creatorProfile: this.state.creatorProfile,
      paymentMethod: this.state.paymentMethod,
      purchasedSets: this.state.purchasedSets,
      purchasedRecipeIds: this.state.purchasedRecipeIds,
      purchasedPublicSetIds: this.state.purchasedPublicSetIds,
      membershipCount: this.state.membershipCount,
      sampleDataSeeded: this.state.sampleDataSeeded,
      subscriptionStatus: this.state.subscriptionStatus,
      creatorStatus: this.state.creatorStatus,
      diagnosis: this.state.diagnosis,
      lastCompletedSetId: this.state.lastCompletedSetId,
    }));
    // バッジを更新
    this.updateBadges();
  },

  // ========================================
  // 画面遷移
  // ========================================
  goBack(fallback = 'main') {
    const target = this.state.previousScreen || fallback;
    this.showScreen(target);
  },

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
      case 'mypage':
        this.renderMyPage();
        break;
      case 'archive':
        this.renderMyPageHistory();
        break;
      case 'diagnosis':
        this.renderDiagnosisSection();
        break;
      case 'purchases':
        this.renderPurchaseHistoryFull();
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
      const uncookedRecipes = recipes.filter(recipe => !this.state.cookedRecipes.includes(recipe.id));
      const cookedRecipes = recipes.filter(recipe => this.state.cookedRecipes.includes(recipe.id));
      const sortedRecipes = [...uncookedRecipes, ...cookedRecipes];

      poolCards.innerHTML = sortedRecipes.map(recipe => {
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

    // 冷蔵庫ショートカットを描画
    this.renderFridgeShortcut();

    // 買い物リストボタンを更新
    this.updateShoppingListButton();
  },

  renderMyPage() {
    this.renderMyPageProfile();
    this.renderMyPageSummary();
    this.renderMyPageArchiveSection();
    this.renderAccountSection();
    this.renderCreatorProfileSection();
    this.renderPaymentSection();
    this.renderPurchaseHistory();
    this.renderMyPageDiagnosisSummary();
    this.renderCreatorPanel();
  },

  renderMyPageProfile() {
    const avatar = document.getElementById('mypage-avatar');
    const name = document.getElementById('mypage-name');
    const label = document.getElementById('mypage-account-label');
    const recordNote = document.getElementById('mypage-record-note');

    if (avatar) avatar.textContent = this.state.profile?.avatar || '🙂';
    if (name) name.textContent = this.state.profile?.name || 'あなた';
    if (label) {
      let text = this.getAccountTypeLabel(this.state.accountType);
      if (this.state.accountType === 'creator' && this.state.creatorStatus === 'pending') {
        text += '（申請中）';
      }
      label.textContent = text;
    }

    if (recordNote) {
      const totalDays = this.getCookingLogDayCount();
      recordNote.textContent = totalDays > 0 ? `これまで ${totalDays} 日` : 'これから記録が増えていきます';
    }
  },

  renderMyPageSummary() {
    const recipeCount = this.state.recipes.length;
    const setCount = this.state.sets.length;
    const fridgeCount = (this.state.fridge || []).length;
    const historyCount = this.getCookingLogDayCount();

    const recipeEl = document.getElementById('mypage-recipe-count');
    const setEl = document.getElementById('mypage-set-count');
    const fridgeEl = document.getElementById('mypage-fridge-count');
    const historyEl = document.getElementById('mypage-history-total');

    if (recipeEl) recipeEl.textContent = recipeCount;
    if (setEl) setEl.textContent = setCount;
    if (fridgeEl) fridgeEl.textContent = fridgeCount;
    if (historyEl) historyEl.textContent = historyCount;

    this.renderMembershipSummary();
  },

  getCookingLogDayCount() {
    const logs = Array.isArray(this.state.cookingLogs) ? this.state.cookingLogs : [];
    const dayKeys = new Set();
    logs.forEach(log => {
      const date = new Date(log.cookedAt);
      if (!Number.isNaN(date.getTime())) {
        dayKeys.add(this.formatDateKey(date));
      }
    });
    return dayKeys.size;
  },

  renderMembershipSummary() {
    const row = document.getElementById('mypage-membership-row');
    const valueEl = document.getElementById('mypage-membership-count');
    if (!row || !valueEl) return;

    if (this.state.accountType === 'user') {
      row.classList.remove('hidden');
      const count = Number.isFinite(this.state.membershipCount) ? this.state.membershipCount : 0;
      valueEl.textContent = `${count}件`;
    } else {
      row.classList.add('hidden');
    }
  },

  getLatestCookingLogDate() {
    const logs = Array.isArray(this.state.cookingLogs) ? this.state.cookingLogs : [];
    let latest = null;
    let latestTime = 0;
    logs.forEach(log => {
      const date = new Date(log.cookedAt);
      const time = date.getTime();
      if (!Number.isNaN(time) && time > latestTime) {
        latestTime = time;
        latest = date;
      }
    });
    return latest;
  },

  renderMyPageArchiveSection() {
    const noteEl = document.getElementById('mypage-archive-note');
    if (!noteEl) return;

    const dayCount = this.getCookingLogDayCount();
    if (dayCount === 0) {
      noteEl.textContent = 'まだ記録がありません';
      return;
    }

    const latest = this.getLatestCookingLogDate();
    if (!latest) {
      noteEl.textContent = `${dayCount}日分の記録`;
      return;
    }

    const latestText = `${latest.getMonth() + 1}/${latest.getDate()} に作りました`;
    noteEl.textContent = `${dayCount}日分 / 最新 ${latestText}`;
  },

  renderMyPageDiagnosisSummary() {
    const summaryEl = document.getElementById('mypage-diagnosis-summary');
    if (!summaryEl) return;

    const diagnosis = this.state.diagnosis;
    if (!diagnosis || !diagnosis.generatedAt) {
      summaryEl.textContent = 'まだ診断がありません';
      return;
    }

    const date = new Date(diagnosis.generatedAt);
    if (Number.isNaN(date.getTime())) {
      summaryEl.textContent = '診断を保存済み';
      return;
    }
    summaryEl.textContent = `前回: ${date.getMonth() + 1}/${date.getDate()}`;
  },

  renderMyPageHistory() {
    const listEl = document.getElementById('mypage-history-list');
    const emptyEl = document.getElementById('mypage-history-empty');
    const countEl = document.getElementById('mypage-history-count');
    const calendarEl = document.getElementById('mypage-history-calendar');
    const gridEl = document.getElementById('history-calendar-grid');
    const monthLabel = document.getElementById('history-month-label');
    const dayWrap = document.getElementById('mypage-history-day');
    const dayLabel = document.getElementById('mypage-history-day-label');
    const dayCountEl = document.getElementById('mypage-history-day-count');

    if (!listEl || !emptyEl || !countEl || !calendarEl || !gridEl || !monthLabel || !dayWrap || !dayLabel || !dayCountEl) {
      return;
    }

    const logs = Array.isArray(this.state.cookingLogs) ? this.state.cookingLogs : [];
    if (logs.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      calendarEl.classList.add('hidden');
      dayWrap.classList.add('hidden');
      countEl.textContent = '';
      return;
    }

    emptyEl.classList.add('hidden');
    calendarEl.classList.remove('hidden');
    const historyMap = this.buildHistoryMap(logs);
    const dayCountValue = Object.keys(historyMap).length;
    countEl.textContent = `${dayCountValue}日`;
    const latestDate = this.getLatestHistoryDate(historyMap);

    if (!this.historyCalendarMonth) {
      this.historyCalendarMonth = latestDate ? new Date(latestDate) : new Date();
      this.historyCalendarMonth = new Date(this.historyCalendarMonth.getFullYear(), this.historyCalendarMonth.getMonth(), 1);
    }

    const monthDate = new Date(this.historyCalendarMonth);
    monthLabel.textContent = `${monthDate.getFullYear()}年 ${monthDate.getMonth() + 1}月`;
    this.renderHistoryCalendarGrid(monthDate, historyMap, gridEl);

    if (!this.historySelectedDate || !historyMap[this.historySelectedDate]) {
      this.historySelectedDate = latestDate;
    }

    this.renderHistoryDayDetail(historyMap, listEl, dayWrap, dayLabel, dayCountEl);
  },

  formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  buildHistoryMap(logs) {
    const map = {};
    logs.forEach(item => {
      if (!item || !item.cookedAt) return;
      const date = new Date(item.cookedAt);
      if (Number.isNaN(date.getTime())) return;
      const key = this.formatDateKey(date);
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  },

  getLatestHistoryDate(historyMap) {
    const keys = Object.keys(historyMap);
    if (keys.length === 0) return null;
    return keys.sort().slice(-1)[0];
  },

  shiftHistoryMonth(offset) {
    if (!this.historyCalendarMonth) {
      this.historyCalendarMonth = new Date();
    }
    const base = new Date(this.historyCalendarMonth);
    this.historyCalendarMonth = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    this.renderMyPageHistory();
  },

  selectHistoryDate(dateKey) {
    this.historySelectedDate = dateKey;
    this.renderMyPageHistory();
  },

  renderHistoryCalendarGrid(monthDate, historyMap, gridEl) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = this.formatDateKey(new Date());

    const cells = [];
    for (let i = 0; i < 42; i += 1) {
      const dayNum = i - firstDay + 1;
      if (dayNum < 1 || dayNum > daysInMonth) {
        cells.push('<div class="calendar-day is-outside"></div>');
        continue;
      }

      const date = new Date(year, month, dayNum);
      const key = this.formatDateKey(date);
      const items = historyMap[key] || [];
      const hasHistory = items.length > 0;
      const isSelected = key === this.historySelectedDate;
      const isToday = key === todayKey;
      const thumb = hasHistory ? this.getHistoryItemThumbnail(items[0]) : '';
      const extraCount = items.length > 1 ? `+${items.length - 1}` : '';

      cells.push(`
        <button class="calendar-day${hasHistory ? ' has-history' : ''}${isSelected ? ' selected' : ''}${isToday ? ' is-today' : ''}" ${hasHistory ? `onclick="App.selectHistoryDate('${key}')"` : ''}>
          <span class="calendar-day-number">${dayNum}</span>
          ${hasHistory ? `<span class="calendar-day-thumb">${thumb}</span>` : ''}
          ${extraCount ? `<span class="calendar-day-count">${extraCount}</span>` : ''}
        </button>
      `);
    }

    gridEl.innerHTML = cells.join('');
  },

  renderHistoryDayDetail(historyMap, listEl, dayWrap, dayLabel, dayCount) {
    const items = this.historySelectedDate ? (historyMap[this.historySelectedDate] || []) : [];
    if (!this.historySelectedDate || items.length === 0) {
      dayWrap.classList.add('hidden');
      listEl.innerHTML = '';
      return;
    }

    dayWrap.classList.remove('hidden');
    dayLabel.textContent = this.historySelectedDate.replace(/-/g, '/');
    dayCount.textContent = `${items.length}品`;

    const sortedItems = items.slice().sort((a, b) => {
      const aTime = new Date(a.cookedAt).getTime();
      const bTime = new Date(b.cookedAt).getTime();
      return aTime - bTime;
    });

    listEl.innerHTML = sortedItems.map(item => {
      const recipe = this.getRecipeById(item.recipeId);
      const name = item.recipeName || recipe?.name || '料理';
      const emoji = item.recipeEmoji || recipe?.emoji || '🍽️';
      const photoHtml = item.photoDataUrl
        ? `<img class="history-log-photo" src="${item.photoDataUrl}" alt="${name}">`
        : '';
      const noteHtml = item.note
        ? `<div class="history-log-note">${item.note}</div>`
        : `<div class="history-log-empty">写真やひとことを残せます</div>`;
      const setLabel = item.setName ? `セット: ${item.setName}` : 'セット: 単品';
      const setHtml = `<div class="history-log-meta">${setLabel}</div>`;
      return `
        <div class="history-story-card history-log-card">
          <div class="history-log-header">
            <div class="history-log-emoji">${emoji}</div>
            <div class="history-log-info">
              <div class="history-log-name">${name}</div>
              ${setHtml}
            </div>
          </div>
          ${photoHtml}
          ${noteHtml}
          <button class="btn-text-small" onclick="App.showCookingLogModal('${item.id}')">
            写真・ログを編集
          </button>
        </div>
      `;
    }).join('');
  },

  getHistoryItemThumbnail(item) {
    if (item.photoDataUrl) return '📷';
    if (item.recipeEmoji) return item.recipeEmoji;
    const recipe = this.getRecipeById(item.recipeId);
    return recipe?.emoji || '🍲';
  },

  setHistoryAsNextByDate(dateKey, setName) {
    const history = Array.isArray(this.state.setHistory) ? this.state.setHistory : [];
    const item = history.find(entry => {
      if (!entry || !entry.endedAt) return false;
      const key = this.formatDateKey(new Date(entry.endedAt));
      return key === dateKey && entry.set?.name === setName;
    });
    if (!item) return;
    this.state.nextSet = { ...item.set };
    this.saveState();
    this.showToast('次の献立に設定しました');
  },

  setHistoryAsNext(index) {
    const history = Array.isArray(this.state.setHistory) ? this.state.setHistory : [];
    const item = history[index];
    if (!item) return;

    this.state.nextSet = { ...item.set };
    this.saveState();
    this.showToast('次の献立に設定しました');
  },

  getAccountTypeLabel(type) {
    if (type === 'creator') return 'クリエイター';
    if (type === 'paid') return '有料クリエイター';
    return 'ユーザー';
  },

  getCreatorStatusLabel(status) {
    if (status === 'pending') return '申請中';
    if (status === 'approved') return '登録済み';
    return '未申請';
  },

  renderAccountSection() {
    const statusEl = document.getElementById('mypage-plan-status');
    const noteEl = document.getElementById('mypage-account-note');
    const actionsEl = document.getElementById('mypage-account-actions');

    const typeLabel = this.getAccountTypeLabel(this.state.accountType);
    if (statusEl) {
      if (this.state.accountType === 'paid') {
        const subscription = this.state.subscriptionStatus === 'active' ? 'サブスク中' : '停止中';
        statusEl.textContent = `いまのプラン: ${typeLabel} / ${subscription}`;
      } else {
        statusEl.textContent = `いまのプラン: ${typeLabel}`;
      }
    }

    if (noteEl) {
      const creatorStatusLabel = this.getCreatorStatusLabel(this.state.creatorStatus);
      noteEl.textContent = `公開の申請: ${creatorStatusLabel}`;
    }

    if (actionsEl) {
      actionsEl.innerHTML = `
        <button class="btn-secondary" onclick="App.showAccountTypeModal()">
          プランを変える
        </button>
      `;
    }
  },

  renderCreatorProfileSection() {
    const section = document.getElementById('mypage-creator-profile');
    if (!section) return;

    const isCreator = this.state.accountType === 'creator' || this.state.accountType === 'paid';
    section.classList.toggle('hidden', !isCreator);
    if (!isCreator) return;

    const profile = this.state.creatorProfile || {};
    const nameEl = document.getElementById('creator-profile-name');
    const bioEl = document.getElementById('creator-profile-bio');
    const statusEl = document.getElementById('creator-profile-status');
    const displayName = profile.displayName || this.state.profile?.name || '表示名を設定';
    const bioText = profile.bio || '得意な献立や雰囲気をひとこと';

    if (nameEl) nameEl.textContent = displayName;
    if (bioEl) bioEl.textContent = bioText;
    if (statusEl) {
      const visibility = profile.isPublic ? 'みんなに公開中' : 'まだ非公開';
      const creatorStatus = this.getCreatorStatusLabel(this.state.creatorStatus);
      statusEl.textContent = `${visibility} / 申請:${creatorStatus}`;
    }
  },

  showAccountTypeModal() {
    const modal = document.getElementById('modal-account-type');
    if (modal) modal.classList.remove('hidden');
  },

  applyAccountType(type) {
    const previous = this.state.accountType;
    this.setAccountType(type);
    this.closeModal();
    if (type !== previous && (type === 'creator' || type === 'paid')) {
      this.showPaymentModal();
    }
  },

  setAccountType(type) {
    if (!type) return;
    this.state.accountType = type;
    if (type === 'paid') {
      this.state.subscriptionStatus = this.state.subscriptionStatus || 'active';
      this.state.creatorStatus = 'approved';
    } else {
      this.state.subscriptionStatus = 'inactive';
      if (type === 'creator' && this.state.creatorStatus === 'not_started') {
        this.state.creatorStatus = 'approved';
      }
    }
    this.saveState();
    this.renderMyPage();
    this.showToast('使い方を変更しました');
  },

  startCreatorRegistration() {
    const modal = document.getElementById('modal-creator-registration');
    if (!modal) return;
    const profile = this.state.creatorProfile || {};
    document.getElementById('creator-display-name').value = profile.displayName || this.state.profile?.name || '';
    document.getElementById('creator-bio').value = profile.bio || '';
    modal.classList.remove('hidden');
  },

  submitCreatorRegistration() {
    const name = document.getElementById('creator-display-name').value.trim();
    const bio = document.getElementById('creator-bio').value.trim();
    if (!name) {
      this.showToast('表示名を入力してください');
      return;
    }
    this.state.profile = { ...this.state.profile, name };
    this.state.creatorProfile = {
      ...this.state.creatorProfile,
      displayName: name,
      bio,
      isPublic: false,
    };
    this.state.creatorStatus = 'pending';
    this.state.accountType = 'creator';
    this.saveState();
    this.renderMyPage();
    this.closeModal();
    this.showToast('公開の申請を送信しました');
  },

  showCreatorProfileModal() {
    const modal = document.getElementById('modal-creator-profile');
    if (!modal) return;
    const profile = this.state.creatorProfile || {};
    document.getElementById('creator-profile-display').value = profile.displayName || this.state.profile?.name || '';
    document.getElementById('creator-profile-bio-input').value = profile.bio || '';
    document.getElementById('creator-profile-public').value = profile.isPublic ? 'public' : 'private';
    modal.classList.remove('hidden');
  },

  saveCreatorProfile() {
    const displayName = document.getElementById('creator-profile-display').value.trim();
    const bio = document.getElementById('creator-profile-bio-input').value.trim();
    const visibility = document.getElementById('creator-profile-public').value;
    if (!displayName) {
      this.showToast('表示名を入力してください');
      return;
    }
    this.state.creatorProfile = {
      ...this.state.creatorProfile,
      displayName,
      bio,
      isPublic: visibility === 'public',
    };
    this.state.profile = { ...this.state.profile, name: displayName };
    this.saveState();
    this.renderMyPageProfile();
    this.renderCreatorProfileSection();
    this.closeModal();
    this.showToast('公開プロフィールを保存しました');
  },

  renderPaymentSection() {
    const label = document.getElementById('mypage-payment-label');
    const body = document.getElementById('mypage-payment-body');
    const deleteBtn = document.getElementById('btn-payment-delete');

    if (!label || !body) return;

    const payment = this.state.paymentMethod;
    if (payment && payment.last4) {
      label.textContent = '登録済み';
      body.innerHTML = `
        <div class="payment-card-info">
          <span class="payment-brand">${payment.brand || 'カード'}</span>
          <span class="payment-number">**** ${payment.last4}</span>
        </div>
        <div class="payment-note">表示は末尾4桁のみです</div>
      `;
      if (deleteBtn) deleteBtn.classList.remove('hidden');
    } else {
      label.textContent = '未登録';
      body.innerHTML = `
        <div class="payment-empty">
          お支払いは未登録です。購入時にも登録できます。
        </div>
      `;
      if (deleteBtn) deleteBtn.classList.add('hidden');
    }
  },

  showPaymentModal() {
    const modal = document.getElementById('modal-payment');
    if (!modal) return;
    document.getElementById('payment-brand').value = this.state.paymentMethod?.brand || '';
    document.getElementById('payment-last4').value = this.state.paymentMethod?.last4 || '';
    modal.classList.remove('hidden');
  },

  savePaymentMethod() {
    const brand = document.getElementById('payment-brand').value.trim();
    const last4 = document.getElementById('payment-last4').value.trim();
    if (!last4 || last4.length !== 4 || !/^\d{4}$/.test(last4)) {
      this.showToast('カード末尾4桁を入力してください');
      return;
    }
    this.state.paymentMethod = { brand, last4 };
    this.saveState();
    this.renderPaymentSection();
    this.closeModal();
    this.showToast('お支払い情報を保存しました');
  },

  clearPaymentMethod() {
    if (!this.state.paymentMethod) return;
    if (!confirm('お支払い情報を削除しますか？')) return;
    this.state.paymentMethod = null;
    this.saveState();
    this.renderPaymentSection();
    this.showToast('お支払い情報を削除しました');
  },

  renderPurchaseHistory() {
    const list = document.getElementById('mypage-purchase-cards');
    const empty = document.getElementById('mypage-purchase-empty');
    const count = document.getElementById('mypage-purchase-count');
    const moreBtn = document.getElementById('mypage-purchase-more');

    if (!list || !empty || !count) return;

    const purchases = Array.isArray(this.state.purchasedSets) ? this.state.purchasedSets : [];
    if (purchases.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      count.textContent = '';
      if (moreBtn) moreBtn.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    count.textContent = `${purchases.length}件`;

    const visibleItems = purchases.slice(0, 6);
    list.innerHTML = visibleItems.map(item => {
      const name = typeof item === 'string' ? item : item.name;
      const purchasedAt = typeof item === 'string' ? '' : (item.purchasedAt || '日付未設定');
      return `
        <div class="purchase-card">
          <div class="purchase-card-title">${name || '購入したセット'}</div>
          <div class="purchase-card-meta">${purchasedAt}</div>
        </div>
      `;
    }).join('');

    if (moreBtn) {
      moreBtn.classList.toggle('hidden', purchases.length <= 6);
    }
  },

  renderPurchaseHistoryFull() {
    const list = document.getElementById('purchase-list-full');
    const empty = document.getElementById('purchase-empty-full');
    if (!list || !empty) return;

    const purchases = Array.isArray(this.state.purchasedSets) ? this.state.purchasedSets : [];
    if (purchases.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = purchases.map(item => {
      const name = typeof item === 'string' ? item : item.name;
      const purchasedAt = typeof item === 'string' ? '' : (item.purchasedAt || '日付未設定');
      return `
        <div class="mypage-list-item">
          <div class="mypage-list-title">${name || '購入したセット'}</div>
          <div class="mypage-list-meta">${purchasedAt}</div>
        </div>
      `;
    }).join('');
  },

  renderCookingLog() {
    const list = document.getElementById('mypage-cooking-log');
    const empty = document.getElementById('mypage-cooking-empty');
    const count = document.getElementById('mypage-cooking-count');
    if (!list || !empty || !count) return;

    const logs = [];
    const history = Array.isArray(this.state.setHistory) ? this.state.setHistory : [];
    history.slice().reverse().forEach(item => {
      const cookedIds = Array.isArray(item.cookedRecipes) ? item.cookedRecipes : [];
      cookedIds.forEach(id => {
        const recipe = this.getRecipeById(id);
        if (!recipe) return;
        const date = new Date(item.endedAt);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        logs.push({ recipe, dateStr });
      });
    });

    if (this.state.currentSet && Array.isArray(this.state.cookedRecipes)) {
      this.state.cookedRecipes.forEach(id => {
        const recipe = this.getRecipeById(id);
        if (recipe) {
          logs.push({ recipe, dateStr: '今日' });
        }
      });
    }

    if (logs.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      count.textContent = '';
      return;
    }

    empty.classList.add('hidden');
    count.textContent = `${logs.length}件`;

    list.innerHTML = logs.slice(0, 6).map(log => `
      <div class="mypage-log-item">
        <div class="mypage-log-emoji">${log.recipe.emoji || '🍽️'}</div>
        <div class="mypage-log-info">
          <div class="mypage-log-name">${log.recipe.name}</div>
          <div class="mypage-log-date">${log.dateStr}</div>
        </div>
      </div>
    `).join('');
  },

  renderDiagnosisSection() {
    const note = document.getElementById('mypage-diagnosis-note');
    const insightsEl = document.getElementById('mypage-diagnosis-insights');
    const relatedEl = document.getElementById('mypage-diagnosis-related');
    const actionsEl = document.getElementById('mypage-diagnosis-actions');
    if (!insightsEl || !relatedEl || !note || !actionsEl) return;

    const recipes = this.collectHistoryRecipes();
    const diagnosis = this.state.diagnosis;
    const hasDiagnosis = diagnosis && diagnosis.generatedAt && diagnosis.insights?.length;

    actionsEl.innerHTML = `
      <button class="btn-secondary" onclick="App.generateDiagnosis()">
        ${hasDiagnosis ? '診断をつくり直す' : '診断をつくる'}
      </button>
    `;

    if (!hasDiagnosis) {
      note.textContent = '診断はまだありません';
      insightsEl.innerHTML = `
        <div class="diagnosis-empty">
          診断をつくると、今の好みが言葉で見えてきます。
        </div>
      `;
      relatedEl.innerHTML = '';
      return;
    }

    const generatedDate = new Date(diagnosis.generatedAt);
    const dateText = Number.isNaN(generatedDate.getTime())
      ? '診断をつくりました'
      : `${generatedDate.getMonth() + 1}/${generatedDate.getDate()}に診断をつくりました`;
    note.textContent = dateText;

    insightsEl.innerHTML = diagnosis.insights.map(text => `
      <div class="diagnosis-chip">${text}</div>
    `).join('');

    const relatedSets = this.getRelatedSetsByTags(diagnosis.topTags || [], 2);
    const relatedRecipes = this.getRelatedRecipesByTags(diagnosis.topTags || [], 2);

    relatedEl.innerHTML = `
      <div class="diagnosis-related-block">
        <div class="diagnosis-related-title">気分が近いセット</div>
        <div class="diagnosis-related-list">
          ${relatedSets.map(set => `
            <button class="diagnosis-related-card" onclick="App.showSetDetail('${set.id}')">
              <span class="card-title">${set.name}</span>
              <span class="card-meta">${set.sourceLabel}</span>
            </button>
          `).join('')}
          ${relatedSets.length === 0 ? '<div class="diagnosis-empty">まだ近いセットがありません</div>' : ''}
        </div>
      </div>
      <div class="diagnosis-related-block">
        <div class="diagnosis-related-title">気分が近いレシピ</div>
        <div class="diagnosis-related-list">
          ${relatedRecipes.map(recipe => `
            <button class="diagnosis-related-card" onclick="App.showRecipeDetail('${recipe.id}')">
              <span class="card-title">${recipe.emoji || '🍽️'} ${recipe.name}</span>
              <span class="card-meta">${(recipe.tags || []).slice(0, 2).join(' ')}</span>
            </button>
          `).join('')}
          ${relatedRecipes.length === 0 ? '<div class="diagnosis-empty">まだ近いレシピがありません</div>' : ''}
        </div>
      </div>
    `;
  },

  generateDiagnosis() {
    const recipes = this.collectHistoryRecipes();
    if (recipes.length === 0) {
      this.showToast('記録がもう少し増えてから診断をつくれます');
      return;
    }

    const analysis = this.buildDiagnosisInsights(recipes);
    this.state.diagnosis = {
      generatedAt: new Date().toISOString(),
      insights: analysis.insights,
      topTags: analysis.topTags,
    };
    this.saveState();
    this.renderDiagnosisSection();
    this.showToast('診断をつくりました');
  },

  collectHistoryRecipes() {
    const recipes = [];
    const logs = Array.isArray(this.state.cookingLogs) ? this.state.cookingLogs : [];
    if (logs.length > 0) {
      logs.forEach(item => {
        const recipe = this.getRecipeById(item.recipeId);
        if (recipe) recipes.push(recipe);
      });
    } else {
      const history = Array.isArray(this.state.setHistory) ? this.state.setHistory : [];
      history.forEach(item => {
        const cookedIds = Array.isArray(item.cookedRecipes) && item.cookedRecipes.length > 0
          ? item.cookedRecipes
          : (item.set.recipeIds || []);
        cookedIds.forEach(id => {
          const recipe = this.getRecipeById(id);
          if (recipe) recipes.push(recipe);
        });
      });

      if (this.state.currentSet && Array.isArray(this.state.cookedRecipes)) {
        this.state.cookedRecipes.forEach(id => {
          const recipe = this.getRecipeById(id);
          if (recipe) recipes.push(recipe);
        });
      }
    }

    return recipes;
  },

  buildDiagnosisInsights(recipes) {
    const tagCounts = new Map();
    const ingredientCounts = new Map();

    recipes.forEach(recipe => {
      (recipe.tags || []).forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
      (recipe.ingredients || []).forEach(ing => {
        const name = ing.name || '';
        if (name) {
          ingredientCounts.set(name, (ingredientCounts.get(name) || 0) + 1);
        }
      });
    });

    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 3);

    const topIngredients = Array.from(ingredientCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 3);

    const insights = [];

    const regionTags = ['和食', '洋食', '中華', '韓国', 'エスニック', 'イタリアン'];
    const region = topTags.find(tag => regionTags.includes(tag));
    insights.push(region ? `この頃は${region}寄り` : 'いろんなジャンルを気分で選んでいる');

    const warmTags = ['煮物', '煮込み', '鍋', 'スープ'];
    const hasWarm = topTags.some(tag => warmTags.includes(tag)) || topIngredients.some(name => name.includes('白菜'));
    insights.push(hasWarm ? 'あったかい料理が多め' : '季節はその時の気分で選ぶ');

    if (topIngredients.length > 0) {
      insights.push(`よく使う食材: ${topIngredients.slice(0, 2).join('・')}`);
    } else {
      insights.push('よく使う食材はこれから見えてきます');
    }

    if (tagCounts.has('時短')) {
      insights.push('作り方の気分: 手早く仕上げたい日が多い');
    } else if (tagCounts.has('作り置き')) {
      insights.push('作り方の気分: まとめて作る日が多い');
    } else {
      insights.push('作り方の気分: その日の気分で選ぶ');
    }

    if (tagCounts.has('時短')) {
      insights.push('生活リズム: 忙しい日は手早く済ませたい');
    } else if (tagCounts.has('作り置き')) {
      insights.push('生活リズム: まとめて整えておきたい');
    } else {
      insights.push('生活リズム: その日の余白で決めることが多い');
    }

    const setCount = Array.isArray(this.state.setHistory) ? this.state.setHistory.length : 0;
    if (setCount > 0) {
      insights.push(`献立の回し方: ${setCount}セット分を回している`);
    }

    return { insights, topTags };
  },

  getRelatedSetsByTags(tags, limit = 2) {
    if (!tags || tags.length === 0) return [];
    const candidates = this.getAllSetsWithSource().map(({ set, source }) => {
      const recipes = this.getRecipesFromSet(set);
      const hasTag = recipes.some(recipe =>
        (recipe.tags || []).some(tag => tags.includes(tag))
      );
      return hasTag ? { ...set, sourceLabel: this.getSetSourceLabel(source) } : null;
    }).filter(Boolean);
    return candidates.slice(0, limit);
  },

  getRelatedRecipesByTags(tags, limit = 2) {
    if (!tags || tags.length === 0) return [];
    const pool = [...this.publicRecipes, ...this.state.recipes];
    return pool.filter(recipe =>
      (recipe.tags || []).some(tag => tags.includes(tag))
    ).slice(0, limit);
  },

  renderCreatorPanel() {
    const panel = document.getElementById('mypage-creator-panel');
    if (!panel) return;

    if (this.state.accountType === 'creator' || this.state.accountType === 'paid') {
      panel.classList.remove('hidden');
      const publicCount = this.state.sets.length;
      const countEl = document.getElementById('creator-public-sets');
      const salesEl = document.getElementById('creator-sales-count');
      const amountEl = document.getElementById('creator-sales-amount');
      const membershipEl = document.getElementById('creator-membership-status');
      if (countEl) countEl.textContent = publicCount;
      if (salesEl) salesEl.textContent = '0';
      if (amountEl) amountEl.textContent = '¥0';
      if (membershipEl) {
        const isActive = this.state.accountType === 'paid' && this.state.subscriptionStatus === 'active';
        membershipEl.textContent = isActive ? '稼働中' : '未設定';
      }
    } else {
      panel.classList.add('hidden');
    }
  },

  renderFridgeShortcut() {
    // 冷蔵庫ショートカットは削除されたので何もしない
    // 冷蔵庫はヘッダーのボタンからアクセス（REQ-014）
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
      ${this.buildIntermediateSection(recipe)}
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

  addCookingLog(recipe, setContext) {
    if (!recipe) return;
    if (!Array.isArray(this.state.cookingLogs)) {
      this.state.cookingLogs = [];
    }
    const timestamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    this.state.cookingLogs.push({
      id: `log-${timestamp}-${rand}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      recipeEmoji: recipe.emoji || '🍽️',
      cookedAt: new Date().toISOString(),
      note: '',
      photoDataUrl: '',
      setId: setContext?.id || '',
      setName: setContext?.name || '',
    });
  },

  removeLatestCookingLog(recipeId) {
    const logs = Array.isArray(this.state.cookingLogs) ? this.state.cookingLogs : [];
    if (logs.length === 0) return;
    const setId = this.state.currentSet?.id || '';
    for (let i = logs.length - 1; i >= 0; i -= 1) {
      const log = logs[i];
      if (!log) continue;
      if (log.recipeId !== recipeId) continue;
      if (setId && log.setId && log.setId !== setId) continue;
      logs.splice(i, 1);
      break;
    }
  },

  showCookingLogModal(logId) {
    const log = (this.state.cookingLogs || []).find(item => item.id === logId);
    if (!log) return;

    this.pendingCookingLogId = logId;
    this.pendingCookingLogPhoto = log.photoDataUrl || '';

    const modal = document.getElementById('modal-cooking-log');
    const nameEl = document.getElementById('cooking-log-recipe-name');
    const dateEl = document.getElementById('cooking-log-date');
    const noteEl = document.getElementById('cooking-log-note-input');
    const photoWrap = document.getElementById('cooking-log-photo-preview');
    const photoInput = document.getElementById('cooking-log-photo-input');

    const cookedDate = new Date(log.cookedAt);
    const dateText = Number.isNaN(cookedDate.getTime())
      ? ''
      : `${cookedDate.getMonth() + 1}/${cookedDate.getDate()} に作った`;

    if (nameEl) nameEl.textContent = log.recipeName || '料理';
    if (dateEl) dateEl.textContent = dateText;
    if (noteEl) noteEl.value = log.note || '';
    if (photoInput) photoInput.value = '';
    if (photoWrap) {
      photoWrap.innerHTML = this.pendingCookingLogPhoto
        ? `<img src="${this.pendingCookingLogPhoto}" alt="料理の写真">`
        : '<div class="photo-empty">写真はまだありません</div>';
    }

    if (modal) modal.classList.remove('hidden');
  },

  handleCookingLogPhoto(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.showToast('2MB以下の写真を選んでください');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.pendingCookingLogPhoto = String(reader.result || '');
      const photoWrap = document.getElementById('cooking-log-photo-preview');
      if (photoWrap) {
        photoWrap.innerHTML = `<img src="${this.pendingCookingLogPhoto}" alt="料理の写真">`;
      }
    };
    reader.readAsDataURL(file);
  },

  clearCookingLogPhoto() {
    this.pendingCookingLogPhoto = '';
    const photoWrap = document.getElementById('cooking-log-photo-preview');
    if (photoWrap) {
      photoWrap.innerHTML = '<div class="photo-empty">写真はまだありません</div>';
    }
  },

  saveCookingLog() {
    const logId = this.pendingCookingLogId;
    if (!logId) return;
    const logs = Array.isArray(this.state.cookingLogs) ? this.state.cookingLogs : [];
    const log = logs.find(item => item.id === logId);
    if (!log) return;

    const note = document.getElementById('cooking-log-note-input')?.value?.trim() || '';
    log.note = note;
    log.photoDataUrl = this.pendingCookingLogPhoto || '';

    this.saveState();
    this.renderMyPageHistory();
    this.closeModal();
    this.showToast('料理のログを保存しました');
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
        this.addCookingLog(recipe, this.state.currentSet);
      }
      this.state.cookedRecipes.push(recipeId);
      this.saveState();
      this.closeModal();
      this.renderMainScreen();

      // 献立の全レシピを作り終えたかチェック
      if (this.state.currentSet) {
        const totalRecipes = this.state.currentSet.recipeIds.length;
        const cookedCount = this.state.cookedRecipes.length;

        if (cookedCount >= totalRecipes) {
          const currentSetId = this.state.currentSet.id;
          if (currentSetId && this.state.lastCompletedSetId !== currentSetId) {
            this.state.lastCompletedSetId = currentSetId;
            this.saveState();
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
        this.showToast('作った！');
      }
    } else {
      this.state.cookedRecipes.splice(index, 1);
      this.removeLatestCookingLog(recipeId);
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
      this.state.shoppingPurchased = [];
      this.state.lastCompletedSetId = null;
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
      this.state.shoppingPurchased = [];
      this.state.lastCompletedSetId = null;
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
  switchSetSelectTab(tab) {
    this.currentSetSelectTab = tab;
    this.renderSetSelectScreen();
  },

  renderSetSelectScreen() {
    const myList = document.getElementById('set-list-my');
    const publicList = document.getElementById('set-list-public');
    const myTab = document.getElementById('set-select-my');
    const publicTab = document.getElementById('set-select-public');

    const activeTab = this.currentSetSelectTab || 'my';
    document.querySelectorAll('#screen-set-select .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === `set-${activeTab}`);
    });
    if (myTab && publicTab) {
      myTab.classList.toggle('hidden', activeTab !== 'my');
      publicTab.classList.toggle('hidden', activeTab !== 'public');
    }

    this.renderFridgeRecommendations('fridge-recommend-select', { context: 'select' });

    // サンプルセット + ユーザーセット
    const mySets = [...this.sampleSets, ...this.state.sets];

    if (myList) {
      if (mySets.length === 0) {
        myList.innerHTML = '<p class="empty-hint">まだセットがないよ</p>';
      } else {
        myList.innerHTML = mySets.map(set => {
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
      }
    }

    // 公開セット
    if (publicList) {
      if (!this.publicSets || this.publicSets.length === 0) {
        publicList.innerHTML = '<p class="empty-hint">まだ公開セットがないよ</p>';
      } else {
        publicList.innerHTML = this.publicSets.map(set => {
          const recipes = this.getRecipesFromSet(set);
          const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
          const tags = (set.tags || []).join(' ');
          const access = this.getSetAccessInfo(set);
          const badges = this.buildAccessBadge(access);
          return `
            <div class="set-card" onclick="App.selectSet('${set.id}')">
              <div class="set-card-header">
                <span class="set-card-name">${set.name}</span>
                <span class="set-card-count">${recipes.length}品</span>
              </div>
              <div class="set-card-meta">
                <span class="material-icons-round">person</span>
                <span>${set.author || 'みんなの献立'}</span>
                ${tags ? `<span class="set-card-tags">${tags}</span>` : ''}
              </div>
              <div class="set-card-badges">${badges}</div>
              <div class="set-card-preview">
                <span class="set-card-preview-item">${previewNames}${recipes.length > 3 ? '...' : ''}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  },

  renderFridgeRecommendations(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const recommendations = this.getFridgeRecommendations(4);
    if (recommendations.length === 0) {
      container.classList.add('hidden');
      return;
    }

    const fridgeNames = (this.state.fridge || []).map(item => item.name);
    const fridgeSummary = fridgeNames.length > 0
      ? `冷蔵庫: ${fridgeNames.slice(0, 3).join('・')}${fridgeNames.length > 3 ? ' ほか' : ''}`
      : '';
    const isNextMode = options.context === 'select' && this.state.selectingFor === 'next';
    const title = isNextMode ? '次の献立におすすめ' : '冷蔵庫の食材で作れるセット';

    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="fridge-recommend-header">
        <div class="fridge-recommend-title">${title}</div>
        <div class="fridge-recommend-sub">${fridgeSummary}</div>
      </div>
      <div class="recommend-list">
        ${recommendations.map(rec => {
          const recipes = this.getRecipesFromSet(rec.set);
          const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
          const matched = rec.matchedFridge.slice(0, 3).join('・');
          const matchedText = matched ? `使える食材: ${matched}${rec.matchedFridge.length > 3 ? ' ほか' : ''}` : '冷蔵庫の食材が使えます';
          const sourceLabel = this.getSetSourceLabel(rec.source);
          const accessBadges = rec.source === 'public'
            ? this.buildAccessBadge(this.getSetAccessInfo(rec.set))
            : '';
          const cardAction = options.context === 'select'
            ? `onclick="App.selectSet('${rec.set.id}')"`
            : '';
          const cardClass = options.context === 'select'
            ? 'set-card fridge-set-card'
            : 'set-card fridge-set-card is-static';
          const actionButton = options.context === 'create'
            ? `
              <div class="set-card-actions">
                <button class="btn-secondary btn-recommend" onclick="App.applyRecommendationTemplate('${rec.set.id}', '${rec.source}')">
                  このセットを下書きにする
                </button>
              </div>
            `
            : '';
          return `
            <div class="${cardClass}" ${cardAction}>
              <div class="set-card-header">
                <span class="set-card-name">${rec.set.name}</span>
                <span class="set-card-count">${recipes.length}品</span>
              </div>
              <div class="set-card-meta">
                <span class="material-icons-round">kitchen</span>
                <span>使える食材 ${rec.matchCount}/${rec.totalCount}</span>
                <span class="set-card-tags">${sourceLabel}</span>
              </div>
              ${accessBadges ? `<div class="set-card-badges">${accessBadges}</div>` : ''}
              <div class="set-card-preview">
                <span class="set-card-preview-item">${previewNames}${recipes.length > 3 ? '...' : ''}</span>
              </div>
              <div class="set-card-fridge">${matchedText}</div>
              ${actionButton}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  selectSet(setId) {
    // サンプルセットから探す
    let set = this.sampleSets.find(s => s.id === setId);
    let isPublic = false;
    if (!set) {
      // ユーザーセットから探す
      set = this.state.sets.find(s => s.id === setId);
    }
    if (!set) {
      set = this.publicSets.find(s => s.id === setId);
      isPublic = !!set;
    }

    if (set) {
      if (isPublic) {
        const access = this.getSetAccessInfo(set);
        if (!access.accessible) {
          this.showToast('購入すると使えるよ');
          return;
        }
      }

      const selectedSet = isPublic
        ? { ...set, id: `temp-${set.id}` }
        : set;
      // 次の献立を選択中の場合
      if (this.state.selectingFor === 'next') {
        this.state.nextSet = selectedSet;
        this.state.selectingFor = null;
        this.saveState();
        this.showScreen('main');
        this.showToast('次の献立を設定しました');
      } else {
        // 通常の献立選択
        this.state.currentSet = selectedSet;
        this.state.cookedRecipes = [];
        this.state.shoppingChecked = [];
        this.state.shoppingPurchased = [];
        this.state.lastCompletedSetId = null;
        this.saveState();
        this.showScreen('main');

        // 買い物リストボタンを明示的に更新
        this.updateShoppingListButton();

        // オンボーディング: 初めてセットを選んだ
        if (!this.onboarding.setSelected) {
          this.onboarding.setSelected = true;
          this.saveOnboarding();
          setTimeout(() => this.showGuide('guideShopping'), 500);
        } else {
          this.showToast('献立表に登録しました');
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
    this.renderFridgeRecommendations('fridge-recommend-create', { context: 'create' });
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

  // ========================================
  // セットテンプレート選択（既存のセットから編集）
  // ========================================
  findSetBySource(setId, source) {
    if (source === 'user') {
      return this.state.sets.find(s => s.id === setId);
    }
    if (source === 'starter') {
      return this.sampleSets.find(s => s.id === setId);
    }
    if (source === 'public') {
      return this.publicSets.find(s => s.id === setId);
    }
    return (
      this.sampleSets.find(s => s.id === setId) ||
      this.state.sets.find(s => s.id === setId) ||
      this.publicSets.find(s => s.id === setId)
    );
  },

  loadSetIntoCreate(set, options = {}) {
    if (!set) return;

    const suffix = options.suffix ?? 'のコピー';
    const nameInput = document.getElementById('set-name-input');
    if (nameInput) {
      nameInput.value = `${set.name}${suffix}`;
    }

    this.state.selectedRecipesForSet = [];
    (set.recipeIds || []).forEach(recipeId => {
      const recipe = this.getRecipeById(recipeId);
      if (recipe) {
        this.state.selectedRecipesForSet.push(recipe);
      }
    });

    this.renderSelectedRecipes();
    this.updateSaveSetButton();

    if (options.showToast !== false) {
      this.showToast(options.toast || 'セットの内容を読み込みました');
    }
  },

  applyRecommendationTemplate(setId, source) {
    const set = this.findSetBySource(setId, source);
    if (!set) return;
    this.loadSetIntoCreate(set, { toast: 'おすすめセットを読み込みました' });
  },

  showSetTemplateSelector() {
    const modal = document.getElementById('modal-set-template');
    const list = document.getElementById('set-template-list');

    // 自分のセット + スターターセット + 公開セットを一覧表示
    const allSets = [
      ...this.state.sets.map(s => ({ ...s, source: 'user' })),
      ...this.sampleSets.map(s => ({ ...s, source: 'starter' })),
      ...this.publicSets.map(s => ({ ...s, source: 'public' })),
    ];

    list.innerHTML = allSets.map(set => {
      const recipes = this.getRecipesFromSet(set);
      const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
      const sourceLabel = this.getSetSourceLabel(set.source);
      const accessBadges = set.source === 'public'
        ? this.buildAccessBadge(this.getSetAccessInfo(set))
        : '';
      return `
        <div class="set-card" onclick="App.selectSetTemplate('${set.id}', '${set.source}')">
          <div class="set-card-header">
            <span class="set-card-name">${set.name}</span>
            <span class="set-card-count">${recipes.length}品</span>
          </div>
          <div class="set-card-meta">
            <span class="material-icons-round">folder</span>
            <span>${sourceLabel}</span>
          </div>
          ${accessBadges ? `<div class="set-card-badges">${accessBadges}</div>` : ''}
          <div class="set-card-preview">
            <span class="set-card-preview-item">${previewNames}${recipes.length > 3 ? '...' : ''}</span>
          </div>
        </div>
      `;
    }).join('');

    modal.classList.remove('hidden');
  },

  closeSetTemplateModal() {
    document.getElementById('modal-set-template').classList.add('hidden');
  },

  selectSetTemplate(setId, source) {
    // 選択されたセットを取得
    const set = this.findSetBySource(setId, source);
    if (!set) return;

    this.loadSetIntoCreate(set);

    // モーダルを閉じる
    this.closeSetTemplateModal();
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
    document.getElementById('steps-list').innerHTML = '';
    const intermediatesList = document.getElementById('intermediates-list');
    if (intermediatesList) {
      intermediatesList.innerHTML = '';
    }

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

    // 作り方の行を1つ追加
    this.addStepRow();

    // 中間素材を1つ追加（任意入力）
    this.addIntermediateGroup();
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

    // 手順
    if (data.steps && data.steps.length > 0) {
      const stepsList = document.getElementById('steps-list');
      stepsList.innerHTML = '';

      data.steps.forEach(step => {
        this.addStepRow();
        const rows = stepsList.querySelectorAll('.step-row');
        const lastRow = rows[rows.length - 1];
        lastRow.querySelector('.step-input').value = step;
      });
    }

    // 中間素材
    if (data.intermediates && data.intermediates.length > 0) {
      const intermediatesList = document.getElementById('intermediates-list');
      if (intermediatesList) {
        intermediatesList.innerHTML = '';
        data.intermediates.forEach(intermediate => {
          this.addIntermediateGroup(intermediate);
        });
      }
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

  addStepRow() {
    const list = document.getElementById('steps-list');
    const stepNum = list.querySelectorAll('.step-row').length + 1;
    const row = document.createElement('div');
    row.className = 'step-row';
    row.innerHTML = `
      <span class="step-number">${stepNum}</span>
      <input type="text" class="step-input" placeholder="手順を入力">
      <button class="btn-remove-ingredient" onclick="App.removeStepRow(this)">
        <span class="material-icons-round">close</span>
      </button>
    `;
    list.appendChild(row);
  },

  addIntermediateGroup(data = null) {
    const list = document.getElementById('intermediates-list');
    if (!list) return;

    const group = document.createElement('div');
    group.className = 'intermediate-group';
    group.innerHTML = `
      <div class="intermediate-header">
        <div class="intermediate-title">
          <input type="text" class="intermediate-label-input" placeholder="A">
          <input type="text" class="intermediate-name-input" placeholder="合わせ調味料">
        </div>
        <button class="btn-remove-ingredient" onclick="App.removeIntermediateGroup(this)">
          <span class="material-icons-round">close</span>
        </button>
      </div>
      <div class="intermediate-ingredients-list"></div>
      <button class="btn-add-ingredient" onclick="App.addIntermediateIngredientRow(this)">
        <span class="material-icons-round">add</span>
        材料を追加
      </button>
      <div class="intermediate-note">
        作り方メモ（任意）
      </div>
      <input type="text" class="form-input intermediate-note-input" placeholder="例: すべて混ぜておく">
    `;
    list.appendChild(group);

    if (data) {
      const labelInput = group.querySelector('.intermediate-label-input');
      const nameInput = group.querySelector('.intermediate-name-input');
      const noteInput = group.querySelector('.intermediate-note-input');
      if (labelInput) labelInput.value = data.label || '';
      if (nameInput) nameInput.value = data.name || '';
      if (noteInput && Array.isArray(data.steps)) {
        noteInput.value = data.steps.join(' / ');
      }
    }

    const ingredients = (data && Array.isArray(data.ingredients)) ? data.ingredients : [];
    if (ingredients.length > 0) {
      ingredients.forEach(ing => this.addIntermediateIngredientRow(group, ing));
    } else {
      this.addIntermediateIngredientRow(group);
    }
  },

  addIntermediateIngredientRow(target, data = null) {
    const group = target?.closest ? target.closest('.intermediate-group') : target;
    if (!group) return;
    const list = group.querySelector('.intermediate-ingredients-list');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'ingredient-row intermediate-ingredient-row';
    row.innerHTML = `
      <input type="text" class="ing-name" placeholder="材料名">
      <input type="text" class="ing-amount" placeholder="量">
      <input type="text" class="ing-unit" placeholder="単位">
      <button class="btn-remove-ingredient" onclick="this.parentElement.remove()">
        <span class="material-icons-round">close</span>
      </button>
    `;
    list.appendChild(row);

    if (data) {
      row.querySelector('.ing-name').value = data.name || '';
      row.querySelector('.ing-amount').value = data.amount || '';
      row.querySelector('.ing-unit').value = data.unit || '';
    }
  },

  removeIntermediateGroup(btn) {
    const group = btn?.closest ? btn.closest('.intermediate-group') : null;
    if (group) {
      group.remove();
    }
  },

  removeStepRow(btn) {
    btn.parentElement.remove();
    // 番号を振り直す
    const rows = document.querySelectorAll('.step-row');
    rows.forEach((row, i) => {
      row.querySelector('.step-number').textContent = i + 1;
    });
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

    // 作り方
    const steps = [];
    document.querySelectorAll('.step-row').forEach(row => {
      const stepText = row.querySelector('.step-input').value.trim();
      if (stepText) {
        steps.push(stepText);
      }
    });

    // 中間素材
    const intermediates = [];
    document.querySelectorAll('.intermediate-group').forEach(group => {
      const label = group.querySelector('.intermediate-label-input')?.value.trim() || '';
      const name = group.querySelector('.intermediate-name-input')?.value.trim() || '';
      const note = group.querySelector('.intermediate-note-input')?.value.trim() || '';
      const intermediateIngredients = [];

      group.querySelectorAll('.intermediate-ingredient-row').forEach(row => {
        const ingName = row.querySelector('.ing-name').value.trim();
        const ingAmount = row.querySelector('.ing-amount').value.trim();
        const ingUnit = row.querySelector('.ing-unit').value.trim();
        if (ingName) {
          intermediateIngredients.push({
            name: ingName,
            amount: parseFloat(ingAmount) || 0,
            unit: ingUnit || '',
          });
        }
      });

      if (label || name || intermediateIngredients.length > 0 || note) {
        intermediates.push({
          label,
          name,
          ingredients: intermediateIngredients,
          steps: note ? [note] : [],
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
      intermediates,
      steps,
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

    // スターターセットで使われているレシピIDを収集
    const starterRecipeIds = new Set();
    this.sampleSets.forEach(set => {
      (set.recipeIds || []).forEach(id => starterRecipeIds.add(id));
    });
    const starterRecipes = this.publicRecipes.filter(r => starterRecipeIds.has(r.id));

    // ユーザーのレシピ + スターターレシピから全タグを収集
    const allTags = new Set();
    this.state.recipes.forEach(recipe => {
      (recipe.tags || []).forEach(tag => allTags.add(tag));
    });
    starterRecipes.forEach(recipe => {
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

    // スターターセットで使われているレシピIDを収集
    const starterRecipeIds = new Set();
    this.sampleSets.forEach(set => {
      (set.recipeIds || []).forEach(id => starterRecipeIds.add(id));
    });

    // スターターレシピ（publicRecipesから取得）
    const starterRecipes = this.publicRecipes.filter(r => starterRecipeIds.has(r.id));

    // ユーザーレシピとスターターレシピを結合（重複除去）
    const userRecipeIds = new Set(this.state.recipes.map(r => r.id));
    const combinedRecipes = [
      ...this.state.recipes,
      ...starterRecipes.filter(r => !userRecipeIds.has(r.id))
    ];

    // タグでフィルタリング
    let recipes = combinedRecipes;
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

    // スターターセット + ユーザーセット
    const allSets = [...this.sampleSets, ...this.state.sets];

    if (allSets.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = allSets.map(set => {
      const recipes = this.getRecipesFromSet(set);
      const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
      const isStarter = set.id.startsWith('starter-');
      return `
        <div class="set-card" onclick="App.showSetDetail('${set.id}')">
          <div class="set-card-header">
            <span class="set-card-name">${set.name}</span>
            <span class="set-card-count">${recipes.length}品</span>
          </div>
          ${isStarter ? '<div class="set-card-meta"><span class="starter-badge">スターター</span></div>' : ''}
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
      <div style="margin-bottom: 16px;">
        <p style="color: var(--text-sub); font-size: 14px;">${recipes.length}品のレシピ</p>
      </div>
      <div class="set-detail-cards-wrapper">
        <div class="set-detail-cards-scroll">
          ${recipes.map((recipe, index) => `
            <div class="recipe-card set-detail-card" onclick="App.showRecipeDetailFromSet('${recipe.id}', '${setId}')">
              <div class="card-day-badge">${index + 1}日目</div>
              <div class="card-emoji">${recipe.emoji || '🍽️'}</div>
              <div class="card-name">${recipe.name}</div>
              <div class="card-tags">
                ${(recipe.tags || []).slice(0, 2).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="scroll-hint"></div>
      </div>
      <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
        <button class="btn-primary" style="width: 100%;" onclick="App.closeModal(); App.selectSet('${setId}');">
          <span class="material-icons-round">calendar_today</span>
          献立表に登録する
        </button>
        ${isUserSet ? `
          <button class="btn-secondary" style="width: 100%;" onclick="App.editSet('${setId}')">
            <span class="material-icons-round">edit</span>
            編集する
          </button>
          <button class="btn-text" style="color: red;" onclick="App.deleteSet('${setId}')">
            このセットを削除
          </button>
        ` : ''}
        ${!isUserSet && !isSampleSet ? `
          <button class="btn-secondary" style="width: 100%;" onclick="App.copySetToMy('${setId}')">
            <span class="material-icons-round">content_copy</span>
            わたしのセットに追加
          </button>
        ` : ''}
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
    const query = document.getElementById('recipe-search')?.value.toLowerCase() || '';
    const category = this.selectedMyCategory || 'all';

    if (this.currentMyTab === 'recipes') {
      const items = document.querySelectorAll('#recipe-list .recipe-list-item');
      items.forEach(item => {
        const name = item.querySelector('.recipe-list-name').textContent.toLowerCase();
        const tags = item.querySelector('.recipe-list-meta').textContent.toLowerCase();
        const matchesQuery = name.includes(query) || tags.includes(query);
        const matchesCategory = category === 'all' || tags.includes(category.toLowerCase());
        item.style.display = (matchesQuery && matchesCategory) ? '' : 'none';
      });
    } else {
      const items = document.querySelectorAll('#my-set-list .set-card');
      items.forEach(item => {
        const name = item.querySelector('.set-card-name').textContent.toLowerCase();
        const matchesQuery = name.includes(query);
        // セットにはカテゴリフィルタを適用しない（または別途タグを持たせる）
        item.style.display = matchesQuery ? '' : 'none';
      });
    }
  },

  filterRecipes() {
    this.filterMyItems();
  },

  getFilterStateByContext(context) {
    const key = context === 'public' ? 'public' : 'my';
    if (!this.filterState[key]) {
      this.filterState[key] = { status: [], time: [], tag: [], rating: [] };
    }
    return this.filterState[key];
  },

  showSortModal(context) {
    this.activeSortContext = context === 'public' ? 'public' : 'my';
    const label = this.activeSortContext === 'public' ? 'レシピカタログ' : 'レシピ帳';
    const contextEl = document.getElementById('sort-context-label');
    if (contextEl) contextEl.textContent = label;
    this.renderSortOptions();
    const modal = document.getElementById('modal-sort');
    if (modal) modal.classList.remove('hidden');
  },

  renderSortOptions() {
    const context = this.activeSortContext || 'my';
    const current = this.currentSort[context] || 'おすすめ順';
    document.querySelectorAll('#modal-sort .sort-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === current);
    });
  },

  selectSort(value) {
    const context = this.activeSortContext || 'my';
    this.currentSort[context] = value;
    this.updateFilterSummary(context);
    this.closeModal();
  },

  showFilterModal(context) {
    this.activeFilterContext = context === 'public' ? 'public' : 'my';
    const label = this.activeFilterContext === 'public' ? 'レシピカタログ' : 'レシピ帳';
    const contextEl = document.getElementById('filter-context-label');
    if (contextEl) contextEl.textContent = label;
    this.renderFilterOptions();
    const modal = document.getElementById('modal-filter');
    if (modal) modal.classList.remove('hidden');
  },

  renderFilterOptions() {
    const context = this.activeFilterContext || 'my';
    const state = this.getFilterStateByContext(context);
    document.querySelectorAll('#modal-filter .filter-chip').forEach(btn => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;
      const selected = (state[group] || []).includes(value);
      btn.classList.toggle('active', selected);
    });
  },

  toggleFilterChip(button) {
    const context = this.activeFilterContext || 'my';
    const state = this.getFilterStateByContext(context);
    const group = button.dataset.group;
    const value = button.dataset.value;
    if (!group || !value) return;

    if (state[group].includes(value)) {
      state[group] = state[group].filter(item => item !== value);
    } else {
      state[group].push(value);
    }
    button.classList.toggle('active');
    this.updateFilterSummary(context);
  },

  resetFilters() {
    const context = this.activeFilterContext || 'my';
    this.filterState[context] = { status: [], time: [], tag: [], rating: [] };
    this.renderFilterOptions();
    this.updateFilterSummary(context);
  },

  applyFilters() {
    const context = this.activeFilterContext || 'my';
    this.updateFilterSummary(context);
    this.closeModal();
  },

  updateFilterSummary(context) {
    const target = context === 'public' ? 'public' : 'my';
    const summary = document.getElementById(`${target}-filter-summary`);
    if (!summary) return;

    const sortLabel = this.currentSort[target] || 'おすすめ順';
    const state = this.getFilterStateByContext(target);
    const activeFilters = [
      ...state.status,
      ...state.time,
      ...state.tag,
      ...state.rating,
    ];

    summary.innerHTML = `
      <span class="summary-chip primary">並び替え: ${sortLabel}</span>
      ${activeFilters.map(label => `<span class="summary-chip">${label}</span>`).join('')}
    `;

    const filterBtn = document.getElementById(`${target}-filter-btn`);
    if (filterBtn) filterBtn.classList.toggle('active', activeFilters.length > 0);
    const sortBtn = document.getElementById(`${target}-sort-btn`);
    if (sortBtn) sortBtn.classList.toggle('active', sortLabel !== 'おすすめ順');
  },

  showRecipeDetail(recipeId) {
    let recipe = this.state.recipes.find(r => r.id === recipeId);
    if (!recipe) {
      recipe = this.publicRecipes.find(r => r.id === recipeId);
    }
    if (!recipe) return;

    const access = this.getRecipeAccessInfo(recipe);
    const showAccessBadges = recipe.id.startsWith('pub-');
    const badges = showAccessBadges
      ? `${this.buildAccessBadge(access)}${this.buildMembershipBadge(access)}`
      : '';
    const isSaved = this.isRecipeSaved(recipe);
    const modal = document.getElementById('modal-recipe-detail');
    document.getElementById('detail-recipe-name').textContent = recipe.name;

    const body = document.getElementById('detail-recipe-body');
    if (!access.accessible) {
      const membershipNote = access.isMembership ? 'メンバーシップでも見放題' : '';
      body.innerHTML = `
        <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
        ${showAccessBadges ? `<div class="detail-badges">${badges}</div>` : ''}
        <div style="margin-top: 16px; color: var(--text-sub);">
          購入するとレシピの中身が見られるよ
        </div>
        ${membershipNote ? `<p style="margin-top: 8px; font-size: 12px; color: var(--text-hint);">${membershipNote}</p>` : ''}
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px;">
          <button class="btn-primary" style="width: 100%;" onclick="App.purchasePublicRecipe('${recipe.id}')">
            購入する ${this.formatPrice(access.price)}
          </button>
          <p style="font-size: 12px; color: var(--text-hint); text-align: center;">購入後に「保存」でレシピ帳へ</p>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
        ${showAccessBadges ? `<div class="detail-badges">${badges}</div>` : ''}
        <div style="margin-top: 16px; margin-bottom: 16px;">
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
        ${this.buildIntermediateSection(recipe)}
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
        ${recipe.id.startsWith('pub-') ? `
          <div style="margin-top: 16px;">
            ${isSaved ? `
              <button class="btn-secondary" style="width: 100%;" disabled>保存済み</button>
            ` : `
              <button class="btn-secondary" style="width: 100%;" onclick="App.addPublicRecipeToMine('${recipe.id}')">
                レシピ帳に保存
              </button>
            `}
          </div>
        ` : ''}
        ${recipe.id.startsWith('recipe-') ? `
          <button class="btn-text" style="color: red; margin-top: 24px;" onclick="App.deleteRecipe('${recipe.id}')">
            このレシピを削除
          </button>
        ` : ''}
      `;
    }

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

    const access = this.getRecipeAccessInfo(recipe);
    const showAccessBadges = recipe.id.startsWith('pub-');
    const badges = showAccessBadges
      ? `${this.buildAccessBadge(access)}${this.buildMembershipBadge(access)}`
      : '';
    const isSaved = this.isRecipeSaved(recipe);

    // セット詳細モーダルを閉じる
    document.getElementById('modal-set-detail').classList.add('hidden');

    const modal = document.getElementById('modal-recipe-detail');
    document.getElementById('detail-recipe-name').textContent = recipe.name;

    const body = document.getElementById('detail-recipe-body');
    if (!access.accessible) {
      const membershipNote = access.isMembership ? 'メンバーシップでも見放題' : '';
      body.innerHTML = `
        <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
        ${showAccessBadges ? `<div class="detail-badges">${badges}</div>` : ''}
        <div style="margin-top: 16px; color: var(--text-sub);">
          購入するとレシピの中身が見られるよ
        </div>
        ${membershipNote ? `<p style="margin-top: 8px; font-size: 12px; color: var(--text-hint);">${membershipNote}</p>` : ''}
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px;">
          <button class="btn-primary" style="width: 100%;" onclick="App.purchasePublicRecipe('${recipe.id}')">
            購入する ${this.formatPrice(access.price)}
          </button>
        </div>
        <button class="btn-secondary" style="width: 100%; margin-top: 16px;" onclick="App.backToSetDetail()">
          <span class="material-icons-round">arrow_back</span>
          セット詳細に戻る
        </button>
      `;
    } else {
      body.innerHTML = `
        <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">${recipe.emoji || '🍽️'}</div>
        ${showAccessBadges ? `<div class="detail-badges">${badges}</div>` : ''}
        <div style="margin-top: 16px; margin-bottom: 16px;">
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
        ${this.buildIntermediateSection(recipe)}
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
        ${recipe.id.startsWith('pub-') ? `
          <div style="margin-top: 16px;">
            ${isSaved ? `
              <button class="btn-secondary" style="width: 100%;" disabled>保存済み</button>
            ` : `
              <button class="btn-secondary" style="width: 100%;" onclick="App.addPublicRecipeToMine('${recipe.id}')">
                レシピ帳に保存
              </button>
            `}
          </div>
        ` : ''}
        <button class="btn-secondary" style="width: 100%; margin-top: 16px;" onclick="App.backToSetDetail()">
          <span class="material-icons-round">arrow_back</span>
          セット詳細に戻る
        </button>
      `;
    }

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
  getAggregatedIngredients() {
    if (!this.state.currentSet) return [];

    const recipes = this.getRecipesFromSet(this.state.currentSet);
    const ingredientMap = new Map();

    recipes.forEach(recipe => {
      const allIngredients = [
        ...(recipe.ingredients || []),
        ...((recipe.intermediates || []).flatMap(item => item.ingredients || [])),
      ];
      if (allIngredients.length === 0) return;
      allIngredients.forEach(ing => {
        const key = `${ing.name}-${ing.unit}`;
        if (ingredientMap.has(key)) {
          ingredientMap.get(key).amount += ing.amount;
        } else {
          ingredientMap.set(key, { ...ing, key });
        }
      });
    });

    const fridgeMap = new Map();
    (this.state.fridge || []).forEach(item => {
      if (!item || !item.name) return;
      const key = `${item.name}-${item.unit || ''}`;
      const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0;
      if (fridgeMap.has(key)) {
        fridgeMap.get(key).amount += amount;
      } else {
        fridgeMap.set(key, { ...item, amount });
      }
    });

    return Array.from(ingredientMap.values()).reduce((acc, ing) => {
      const fridgeKey = `${ing.name}-${ing.unit || ''}`;
      const fridgeItem = fridgeMap.get(fridgeKey);
      const required = typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount) || 0;

      if (!fridgeItem) {
        acc.push(ing);
        return acc;
      }

      if (required > 0) {
        const missing = Math.max(required - fridgeItem.amount, 0);
        if (missing > 0) {
          acc.push({ ...ing, amount: missing });
        }
        return acc;
      }

      // 必要量が不明な場合は、冷蔵庫にあれば除外
      return acc;
    }, []);
  },

  getShoppingItems() {
    const baseItems = this.state.currentSet ? this.getAggregatedIngredients() : [];
    const extraItems = Array.isArray(this.state.shoppingExtraItems)
      ? this.state.shoppingExtraItems
      : [];
    return [
      ...baseItems.map(item => ({ ...item, isExtra: false })),
      ...extraItems.map(item => ({
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        key: item.key,
        isExtra: true,
      })),
    ];
  },

  addExtraShoppingItemFromInputs(nameId, amountId, unitId) {
    const nameInput = document.getElementById(nameId);
    const amountInput = document.getElementById(amountId);
    const unitInput = document.getElementById(unitId);
    if (!nameInput || !amountInput || !unitInput) return;

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value) || 1;
    const unit = unitInput.value.trim();

    if (!name) {
      this.showToast('食材名を入力してください');
      return;
    }

    const id = `extra-${Date.now()}`;
    this.state.shoppingExtraItems.push({
      id,
      key: id,
      name,
      amount,
      unit,
    });

    nameInput.value = '';
    amountInput.value = '1';
    unitInput.value = '';

    this.saveState();
    this.updateShoppingListButton();
    this.updateBadges();
  },

  addExtraShoppingItem() {
    this.addExtraShoppingItemFromInputs(
      'shopping-extra-name',
      'shopping-extra-amount',
      'shopping-extra-unit'
    );
    this.renderShoppingScreen();
    this.showToast('買い物リストに追加しました');
  },

  addExtraShoppingItemFromPopup() {
    this.shoppingPopupChecked = [];
    this.addExtraShoppingItemFromInputs(
      'shopping-extra-name-popup',
      'shopping-extra-amount-popup',
      'shopping-extra-unit-popup'
    );
    this.renderShoppingPopup();
    this.showToast('買い物リストに追加しました');
  },

  removeExtraShoppingItem(key) {
    if (!key) return;
    this.state.shoppingExtraItems = this.state.shoppingExtraItems.filter(item => item.key !== key);
    this.state.shoppingPurchased = (this.state.shoppingPurchased || []).filter(k => k !== key);
    this.state.shoppingChecked = (this.state.shoppingChecked || []).filter(k => k !== key);
    this.shoppingPopupChecked = [];
    this.saveState();
    this.renderShoppingScreen();
    this.renderShoppingPopup();
    this.updateShoppingListButton();
    this.updateBadges();
    this.showToast('追加した食材を削除しました');
  },

  renderShoppingScreen() {
    const list = document.getElementById('shopping-list');
    const empty = document.getElementById('shopping-empty');
    const actions = document.getElementById('shopping-actions');
    const emptyText = empty.querySelector('.empty-text');
    const emptySubtext = empty.querySelector('.empty-subtext');
    const setEmptyCopy = (text, subtext) => {
      if (emptyText) emptyText.textContent = text;
      if (emptySubtext) emptySubtext.textContent = subtext;
    };

    const allItems = this.getShoppingItems();
    const purchasedSet = new Set(this.state.shoppingPurchased || []);
    const rawChecked = Array.isArray(this.state.shoppingChecked) ? this.state.shoppingChecked : [];
    const checkedSet = new Set();
    let needsMigration = false;
    rawChecked.forEach(value => {
      if (typeof value === 'number') {
        const item = allItems[value];
        if (item && item.key) {
          checkedSet.add(item.key);
        }
        needsMigration = true;
      } else if (typeof value === 'string') {
        checkedSet.add(value);
      }
    });
    if (needsMigration) {
      this.state.shoppingChecked = Array.from(checkedSet);
      this.saveState();
    }

    const items = allItems.map((ing, index) => ({
      ing,
      index,
      checked: checkedSet.has(ing.key),
    })).filter(item => !purchasedSet.has(item.ing.key));

    if (allItems.length === 0) {
      if (this.state.currentSet) {
        setEmptyCopy('買うものはないよ', '材料がまだないよ');
      } else {
        setEmptyCopy('買うものはないよ', 'セットを選ぶと出てくるよ');
      }
      list.innerHTML = '';
      empty.classList.remove('hidden');
      actions.classList.add('hidden');
      return;
    }

    if (items.length === 0) {
      setEmptyCopy('買い物は完了', '買ったものは冷蔵庫へ移動したよ');
      list.innerHTML = '';
      empty.classList.remove('hidden');
      actions.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    actions.classList.remove('hidden');

    const sortedItems = items.sort((a, b) => {
      if (a.checked === b.checked) {
        return a.index - b.index;
      }
      return a.checked ? 1 : -1;
    });

    list.innerHTML = sortedItems.map(item => `
      <div class="shopping-item ${item.checked ? 'checked' : ''}" onclick="App.toggleShoppingItem('${item.ing.key}')">
        <div class="shopping-checkbox">
          <span class="material-icons-round">check</span>
        </div>
        <div class="shopping-info">
          <div class="shopping-line">
            <span class="shopping-name">${item.ing.name}</span>
            ${item.ing.isExtra ? '<span class="shopping-badge">追加</span>' : ''}
            <span class="shopping-amount">${item.ing.amount}${item.ing.unit}</span>
            ${item.ing.isExtra ? `
              <button class="shopping-remove" onclick="event.stopPropagation(); App.removeExtraShoppingItem('${item.ing.key}')">
                <span class="material-icons-round">close</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    const btnPurchase = document.getElementById('btn-purchase');
    if (btnPurchase) {
      const hasChecked = sortedItems.some(item => item.checked);
      btnPurchase.disabled = !hasChecked;
    }
  },

  toggleShoppingItem(key) {
    const list = Array.isArray(this.state.shoppingChecked) ? this.state.shoppingChecked : [];
    const idx = list.indexOf(key);
    if (idx === -1) {
      list.push(key);
    } else {
      list.splice(idx, 1);
    }
    this.state.shoppingChecked = list;
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

    list.innerHTML = this.publicRecipes.map(recipe => {
      const access = this.getRecipeAccessInfo(recipe);
      const badges = `${this.buildAccessBadge(access)}${this.buildMembershipBadge(access)}`;
      const isSaved = this.isRecipeSaved(recipe);
      let actionHtml = '';
      if (!access.accessible) {
        actionHtml = `
          <button class="btn-mini btn-mini-primary" onclick="event.stopPropagation(); App.purchasePublicRecipe('${recipe.id}')">
            購入 ${this.formatPrice(access.price)}
          </button>
        `;
      } else if (isSaved) {
        actionHtml = `
          <button class="btn-mini btn-mini-ghost" disabled>
            保存済み
          </button>
        `;
      } else {
        actionHtml = `
          <button class="btn-mini" onclick="event.stopPropagation(); App.addPublicRecipeToMine('${recipe.id}')">
            保存
          </button>
        `;
      }

      return `
        <div class="recipe-list-item" onclick="App.handlePublicRecipeClick('${recipe.id}')">
          <span class="recipe-list-emoji">${recipe.emoji || '🍽️'}</span>
          <div class="recipe-list-info">
            <div class="recipe-list-name">${recipe.name}</div>
            <div class="recipe-list-meta">${(recipe.tags || []).join(' ')}</div>
            <div class="recipe-list-badges">${badges}</div>
          </div>
          <div class="recipe-list-actions">
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');
  },

  renderPublicSets() {
    const list = document.getElementById('public-set-list');

    list.innerHTML = this.publicSets.map(set => {
      const recipes = this.getRecipesFromSet(set);
      const previewNames = recipes.slice(0, 3).map(r => r.name).join('、');
      const access = this.getSetAccessInfo(set);
      const badges = this.buildAccessBadge(access);
      const actionHtml = access.accessible
        ? `
          <button class="btn-use-set" onclick="event.stopPropagation(); App.usePublicSetAsKondate('${set.id}')">
            <span class="material-icons-round">add</span>
            登録
          </button>
          <button class="btn-save-set" onclick="event.stopPropagation(); App.savePublicSet('${set.id}')">
            <span class="material-icons-round">bookmark_border</span>
            保存
          </button>
        `
        : `
          <button class="btn-use-set" onclick="event.stopPropagation(); App.purchasePublicSet('${set.id}')">
            <span class="material-icons-round">shopping_bag</span>
            購入 ${this.formatPrice(access.price)}
          </button>
        `;
      return `
        <div class="public-set-card" onclick="App.showPublicSetDetail('${set.id}')">
          <div class="public-set-header">
            <span class="public-set-name">${set.name}</span>
            <span class="public-set-author">
              <span class="material-icons-round">person</span>
              ${set.author}
            </span>
          </div>
          <div class="public-set-badges">${badges}</div>
          <div class="public-set-preview">${previewNames}${recipes.length > 3 ? '...' : ''}</div>
          <div class="public-set-meta">
            <span class="public-set-count">${recipes.length}品</span>
            <div class="public-set-actions-inline">
              ${actionHtml}
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
    const query = document.getElementById('public-search')?.value.toLowerCase() || '';
    const category = this.selectedPublicCategory || 'all';

    if (this.currentPublicTab === 'recipes') {
      const items = document.querySelectorAll('#public-recipe-list .recipe-list-item');
      items.forEach(item => {
        const name = item.querySelector('.recipe-list-name').textContent.toLowerCase();
        const tags = item.querySelector('.recipe-list-meta').textContent.toLowerCase();
        const matchesQuery = name.includes(query) || tags.includes(query);
        const matchesCategory = category === 'all' || tags.includes(category.toLowerCase());
        item.style.display = (matchesQuery && matchesCategory) ? '' : 'none';
      });
    } else {
      const items = document.querySelectorAll('#public-set-list .public-set-card');
      items.forEach(item => {
        const name = item.querySelector('.public-set-name')?.textContent.toLowerCase() || '';
        const author = item.querySelector('.public-set-author')?.textContent.toLowerCase() || '';
        const matchesQuery = name.includes(query) || author.includes(query);
        item.style.display = matchesQuery ? '' : 'none';
      });
    }
  },

  filterPublicRecipes() {
    this.filterPublicItems();
  },

  handlePublicRecipeClick(recipeId) {
    const recipe = this.publicRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const access = this.getRecipeAccessInfo(recipe);
    if (!access.accessible) {
      this.showRecipeDetail(recipeId);
      return;
    }

    this.showRecipeDetail(recipeId);
  },

  purchasePublicRecipe(recipeId) {
    const recipe = this.publicRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const access = this.getRecipeAccessInfo(recipe);
    if (access.status === 'membership') {
      this.showToast('メンバーシップで見られるよ');
      return;
    }
    if (access.free) {
      this.showToast('フリーのレシピだよ');
      return;
    }

    if (!this.state.purchasedRecipeIds.includes(recipeId)) {
      this.state.purchasedRecipeIds.push(recipeId);
      this.saveState();
    }
    this.showToast('購入しました');
    this.renderPublicRecipes();
    const modal = document.getElementById('modal-recipe-detail');
    if (modal && !modal.classList.contains('hidden')) {
      this.showRecipeDetail(recipeId);
    }
  },

  purchasePublicSet(setId) {
    const set = this.publicSets.find(s => s.id === setId);
    if (!set) return;

    const access = this.getSetAccessInfo(set);
    if (access.free) {
      this.showToast('フリーのセットだよ');
      return;
    }

    if (!this.state.purchasedPublicSetIds.includes(setId)) {
      this.state.purchasedPublicSetIds.push(setId);
      this.state.purchasedSets.push({
        name: set.name,
        purchasedAt: this.formatPurchaseDate(),
      });
      this.saveState();
    }
    this.showToast('セットを購入しました');
    this.renderPublicSets();
    const modal = document.getElementById('modal-set-detail');
    if (modal && !modal.classList.contains('hidden')) {
      this.showPublicSetDetail(setId);
    }
  },

  addPublicRecipeToMine(recipeId) {
    const recipe = this.publicRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const access = this.getRecipeAccessInfo(recipe);
    if (!access.accessible) {
      this.showToast('購入すると保存できるよ');
      return;
    }

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
    this.renderPublicRecipes();
  },

  savePublicSet(setId) {
    const set = this.publicSets.find(s => s.id === setId);
    if (!set) return;

    const access = this.getSetAccessInfo(set);
    if (!access.accessible) {
      this.showToast('購入すると保存できるよ');
      return;
    }

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
    const access = this.getSetAccessInfo(set);
    const badges = this.buildAccessBadge(access);

    const modal = document.getElementById('modal-set-detail');
    document.getElementById('detail-set-name').textContent = set.name;

    const body = document.getElementById('detail-set-body');
    body.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: var(--text-sub);">
        <span class="material-icons-round" style="font-size: 18px;">person</span>
        ${set.author}
      </div>
      <div class="detail-badges" style="margin-bottom: 12px;">
        ${badges}
      </div>
      <div style="margin-bottom: 16px; color: var(--text-hint);">
        ${(set.tags || []).join(' ')}
      </div>
      <p style="color: var(--text-sub); font-size: 14px; margin-bottom: 8px;">${recipes.length}品のレシピ</p>
      <div class="set-detail-cards-wrapper">
        <div class="set-detail-cards-scroll">
          ${recipes.map((recipe, index) => `
            <div class="recipe-card set-detail-card" onclick="App.showRecipeDetailFromSet('${recipe.id}', '${setId}')">
              <div class="card-day-badge">${index + 1}日目</div>
              <div class="card-emoji">${recipe.emoji || '🍽️'}</div>
              <div class="card-name">${recipe.name}</div>
              <div class="card-tags">
                ${(recipe.tags || []).slice(0, 2).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="scroll-hint"></div>
      </div>
      <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
        ${access.accessible ? `
          <button class="btn-primary" style="width: 100%;" onclick="App.usePublicSetAsKondate('${set.id}')">
            <span class="material-icons-round">calendar_today</span>
            献立表に登録する
          </button>
          <button class="btn-secondary" style="width: 100%;" onclick="App.savePublicSet('${set.id}'); App.closeModal();">
            <span class="material-icons-round">bookmark_border</span>
            わたしのセットに保存
          </button>
        ` : `
          <button class="btn-primary" style="width: 100%;" onclick="App.purchasePublicSet('${set.id}')">
            <span class="material-icons-round">shopping_bag</span>
            購入して使う ${this.formatPrice(access.price)}
          </button>
          <p style="font-size: 12px; color: var(--text-hint); text-align: center;">購入すると献立表に登録できます</p>
        `}
      </div>
    `;

    modal.classList.remove('hidden');
  },

  usePublicSetAsKondate(setId) {
    // 公開セットを直接献立として使用
    const set = this.publicSets.find(s => s.id === setId);
    if (!set) return;

    const access = this.getSetAccessInfo(set);
    if (!access.accessible) {
      this.showToast('購入すると使えるよ');
      return;
    }

    // セットを現在の献立に設定
    this.state.currentSet = {
      ...set,
      id: `temp-${set.id}`, // 一時的なID（保存はしない）
    };
    this.state.cookedRecipes = [];
    this.state.shoppingChecked = [];
    this.state.shoppingPurchased = [];
    this.state.lastCompletedSetId = null;
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
    this.pendingCookingLogId = null;
    this.pendingCookingLogPhoto = '';
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
          <div class="fridge-empty-icon">🧊</div>
          <p class="fridge-empty-text">冷蔵庫は空です</p>
          <p class="fridge-empty-hint">
            下のボタンから食材を追加するか、<br>買い物リストから追加できます
          </p>
        </div>
      `;
    } else {
      // 食材をグリッドカード形式で表示
      body.innerHTML = `
        <div class="fridge-grid">
          ${fridge.map((item, index) => `
            <div class="fridge-card" onclick="App.confirmDeleteFridgeItem(${index})">
              <div class="fridge-card-icon">${this.getIngredientEmoji(item.name)}</div>
              <div class="fridge-card-name">${item.name}</div>
              <div class="fridge-card-amount">${item.amount}${item.unit}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    modal.classList.remove('hidden');
  },

  // 食材に応じた絵文字を返す
  getIngredientEmoji(name) {
    const emojiMap = {
      '豚': '🐷', '鶏': '🐔', '牛': '🐄', '肉': '🥩',
      '玉ねぎ': '🧅', '人参': '🥕', 'にんじん': '🥕', 'じゃがいも': '🥔',
      'キャベツ': '🥬', 'レタス': '🥬', '白菜': '🥬', 'もやし': '🌱',
      '卵': '🥚', '豆腐': '🧈', '魚': '🐟', '鮭': '🐟',
      'トマト': '🍅', 'ねぎ': '🧅', '長ねぎ': '🧅', 'にんにく': '🧄',
      '生姜': '🫚', 'パン': '🍞', 'バター': '🧈', 'レモン': '🍋',
    };
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (name.includes(key)) return emoji;
    }
    return '🥗'; // デフォルト
  },

  // 冷蔵庫の食材削除確認
  confirmDeleteFridgeItem(index) {
    const item = this.state.fridge[index];
    if (!item) return;

    this.pendingDeleteFridgeIndex = index;

    const modal = document.getElementById('modal-confirm-delete-fridge');
    document.getElementById('confirm-delete-fridge-name').textContent = item.name;
    modal.classList.remove('hidden');
  },

  // 冷蔵庫の食材を削除
  deleteFridgeItem() {
    const index = this.pendingDeleteFridgeIndex;
    if (index === undefined || index === null) return;

    const item = this.state.fridge[index];
    if (!item) return;

    // 削除履歴に追加（1週間分保持）
    if (!this.state.deletedFridgeItems) {
      this.state.deletedFridgeItems = [];
    }
    this.state.deletedFridgeItems.push({
      ...item,
      deletedAt: Date.now()
    });
    // 1週間より古いものを削除
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.state.deletedFridgeItems = this.state.deletedFridgeItems.filter(
      i => i.deletedAt > oneWeekAgo
    );

    // 食材を削除
    this.state.fridge.splice(index, 1);
    this.saveState();
    this.updateBadges();

    // モーダルを閉じて冷蔵庫を再表示
    document.getElementById('modal-confirm-delete-fridge').classList.add('hidden');
    this.pendingDeleteFridgeIndex = null;
    this.showFridge();
    this.showToast(`${item.name}を削除しました`);
  },

  // 削除キャンセル
  cancelDeleteFridgeItem() {
    document.getElementById('modal-confirm-delete-fridge').classList.add('hidden');
    this.pendingDeleteFridgeIndex = null;
  },

  // 削除履歴を表示
  showDeletedFridgeItems() {
    document.getElementById('modal-fridge').classList.add('hidden');
    const modal = document.getElementById('modal-deleted-fridge');
    const body = document.getElementById('deleted-fridge-body');

    const items = this.state.deletedFridgeItems || [];

    if (items.length === 0) {
      body.innerHTML = `
        <div class="fridge-empty">
          <p class="fridge-empty-text">履歴はありません</p>
          <p class="fridge-empty-hint">削除した食材は1週間保持されます</p>
        </div>
      `;
    } else {
      // 新しい順に並べる
      const sortedItems = [...items].sort((a, b) => b.deletedAt - a.deletedAt);
      body.innerHTML = `
        <div class="deleted-fridge-list">
          ${sortedItems.map((item, index) => {
            const date = new Date(item.deletedAt);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            return `
              <div class="deleted-fridge-item">
                <div class="deleted-fridge-info">
                  <span class="deleted-fridge-name">${item.name}</span>
                  <span class="deleted-fridge-amount">${item.amount}${item.unit}</span>
                  <span class="deleted-fridge-date">${dateStr}</span>
                </div>
                <button class="btn-restore" onclick="App.restoreFridgeItem(${items.indexOf(item)})">
                  <span class="material-icons-round">restore</span>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    modal.classList.remove('hidden');
  },

  // 削除履歴を閉じて冷蔵庫に戻る
  closeDeletedFridgeItems() {
    document.getElementById('modal-deleted-fridge').classList.add('hidden');
    document.getElementById('modal-fridge').classList.remove('hidden');
  },

  // 削除した食材を復元
  restoreFridgeItem(index) {
    const items = this.state.deletedFridgeItems || [];
    const item = items[index];
    if (!item) return;

    // 冷蔵庫に追加（同じ名前と単位があれば合算）
    if (!this.state.fridge) {
      this.state.fridge = [];
    }
    const existing = this.state.fridge.find(
      f => f.name === item.name && f.unit === item.unit
    );
    if (existing) {
      existing.amount += item.amount;
    } else {
      this.state.fridge.push({
        name: item.name,
        amount: item.amount,
        unit: item.unit
      });
    }

    // 履歴から削除
    this.state.deletedFridgeItems.splice(index, 1);
    this.saveState();
    this.updateBadges();

    this.showToast(`${item.name}を復元しました`);
    this.showDeletedFridgeItems(); // 履歴を再表示
  },

  // 食材追加モーダルを表示
  showAddFridgeItem() {
    document.getElementById('modal-fridge').classList.add('hidden');
    document.getElementById('modal-add-fridge').classList.remove('hidden');
    // フォームをリセット
    document.getElementById('fridge-item-name').value = '';
    document.getElementById('fridge-item-amount').value = '1';
    document.getElementById('fridge-item-unit').value = '個';
    // フォーカス
    setTimeout(() => {
      document.getElementById('fridge-item-name').focus();
    }, 100);
  },

  // 食材追加をキャンセル
  cancelAddFridgeItem() {
    document.getElementById('modal-add-fridge').classList.add('hidden');
    document.getElementById('modal-fridge').classList.remove('hidden');
  },

  // 食材を冷蔵庫に追加
  addFridgeItem() {
    const name = document.getElementById('fridge-item-name').value.trim();
    const amount = parseFloat(document.getElementById('fridge-item-amount').value) || 1;
    const unit = document.getElementById('fridge-item-unit').value;

    if (!name) {
      this.showToast('食材名を入力してください');
      return;
    }

    if (!this.state.fridge) {
      this.state.fridge = [];
    }

    // 同じ名前・単位の食材があれば量を追加
    const existing = this.state.fridge.find(f => f.name === name && f.unit === unit);
    if (existing) {
      existing.amount += amount;
    } else {
      this.state.fridge.push({ name, amount, unit });
    }

    this.saveState();
    this.updateBadges();

    // モーダルを切り替え
    document.getElementById('modal-add-fridge').classList.add('hidden');
    this.showFridge();
    this.showToast(`${name}を追加しました`);
  },

  purchaseAll() {
    const items = this.getShoppingItems();
    if (items.length === 0) {
      this.showToast('買うものがありません');
      return;
    }

    if (!this.state.fridge) {
      this.state.fridge = [];
    }

    items.forEach(ing => {
      const existing = this.state.fridge.find(
        f => f.name === ing.name && f.unit === ing.unit
      );
      if (existing) {
        existing.amount += ing.amount;
      } else {
        this.state.fridge.push({ name: ing.name, amount: ing.amount, unit: ing.unit });
      }
    });

    this.state.shoppingChecked = [];
    this.state.shoppingPurchased = items.map(ing => ing.key);
    this.state.shoppingExtraItems = this.state.shoppingExtraItems.filter(
      item => !this.state.shoppingPurchased.includes(item.key)
    );

    this.saveState();
    this.renderShoppingScreen();

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

    const items = this.getShoppingItems();
    const purchasedSet = new Set(this.state.shoppingPurchased || []);

    if (!this.state.fridge) {
      this.state.fridge = [];
    }

    const checkedKeys = new Set(this.state.shoppingChecked || []);
    items.forEach(ing => {
      if (!checkedKeys.has(ing.key)) return;
      if (!ing) return;

      const existing = this.state.fridge.find(
        f => f.name === ing.name && f.unit === ing.unit
      );
      if (existing) {
        existing.amount += ing.amount;
      } else {
        this.state.fridge.push({ name: ing.name, amount: ing.amount, unit: ing.unit });
      }

      purchasedSet.add(ing.key);
    });

    this.state.shoppingChecked = [];
    this.state.shoppingPurchased = Array.from(purchasedSet);
    this.state.shoppingExtraItems = this.state.shoppingExtraItems.filter(
      item => !purchasedSet.has(item.key)
    );

    this.saveState();
    this.renderShoppingScreen();

    // オンボーディング: 初めて購入した
    if (!this.onboarding.fridgeNotified) {
      this.onboarding.purchasePrompted = true;
      this.onboarding.fridgeNotified = true;
      this.saveOnboarding();
      setTimeout(() => this.showGuide('fridgeStocked'), 300);
    } else {
      this.showToast('買ったものを冷蔵庫に追加しました');
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
  // 買い物リストポップアップ（REQ-004）
  // ========================================
  shoppingPopupChecked: [], // ポップアップ内のチェック状態（一時的）

  showShoppingPopup() {
    this.shoppingPopupChecked = []; // チェック状態をリセット
    this.renderShoppingPopup();
    document.getElementById('modal-shopping').classList.remove('hidden');
  },

  renderShoppingPopup() {
    const body = document.getElementById('shopping-popup-body');
    const ingredients = this.getShoppingItems();
    const purchasedSet = new Set(this.state.shoppingPurchased || []);

    // 未購入のもののみ表示
    const unpurchased = ingredients.filter(ing => !purchasedSet.has(ing.key));
    const addCardHtml = `
      <div class="shopping-add-card compact">
        <div class="shopping-add-title">食材を追加</div>
        <div class="shopping-add-row">
          <input type="text" id="shopping-extra-name-popup" class="shopping-add-input" placeholder="追加する食材">
          <input type="number" id="shopping-extra-amount-popup" class="shopping-add-amount" value="1" min="0.1" step="0.1">
          <input type="text" id="shopping-extra-unit-popup" class="shopping-add-unit" placeholder="単位">
          <button class="btn-mini" onclick="App.addExtraShoppingItemFromPopup()">追加</button>
        </div>
      </div>
    `;

    if (unpurchased.length === 0) {
      body.innerHTML = `<div class="shopping-popup-empty">買うものはありません</div>${addCardHtml}`;
      document.getElementById('btn-reflect-fridge').disabled = true;
      return;
    }

    // チェック済みを下に、未チェックを上に並べる
    const uncheckedItems = unpurchased
      .map((ing, index) => ({ ing, index }))
      .filter(item => !this.shoppingPopupChecked.includes(item.index));
    const checkedItems = unpurchased
      .map((ing, index) => ({ ing, index }))
      .filter(item => this.shoppingPopupChecked.includes(item.index));
    const sortedItems = [...uncheckedItems, ...checkedItems];

    body.innerHTML = `
      <div class="shopping-popup-list">
        ${sortedItems.map(({ ing, index }) => `
          <div class="shopping-popup-item ${this.shoppingPopupChecked.includes(index) ? 'checked' : ''}" data-index="${index}" onclick="App.toggleShoppingPopupItem(${index})">
            <div class="checkbox-wrapper">
              <span class="material-icons-round checkbox-icon">
                ${this.shoppingPopupChecked.includes(index) ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </div>
            <span class="shopping-item-name">${ing.name}${ing.isExtra ? ' <span class="shopping-badge">追加</span>' : ''}</span>
            <span class="shopping-popup-amount">${ing.amount}${ing.unit}</span>
            ${ing.isExtra ? `
              <button class="shopping-remove" onclick="event.stopPropagation(); App.removeExtraShoppingItem('${ing.key}')">
                <span class="material-icons-round">close</span>
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ${addCardHtml}
    `;

    document.getElementById('btn-reflect-fridge').disabled = this.shoppingPopupChecked.length === 0;
  },

  toggleShoppingPopupItem(index) {
    const idx = this.shoppingPopupChecked.indexOf(index);
    const isChecking = idx < 0; // チェックを入れる場合

    // まずチェック状態を更新
    if (idx >= 0) {
      this.shoppingPopupChecked.splice(idx, 1);
    } else {
      this.shoppingPopupChecked.push(index);
    }

    // チェックボックスのアイコンを即座に更新（視覚的フィードバック）
    const item = document.querySelector(`.shopping-popup-item[data-index="${index}"]`);
    if (item) {
      const icon = item.querySelector('.checkbox-icon');
      if (icon) {
        icon.textContent = isChecking ? 'check_box' : 'check_box_outline_blank';
      }
      item.classList.toggle('checked', isChecking);
    }

    // チェックを入れた場合は少し待ってから並び替え（チェックしたのを確認できるように）
    if (isChecking) {
      setTimeout(() => {
        this.renderShoppingPopup();
      }, 400);
    } else {
      // チェックを外した場合は即座に並び替え
      this.renderShoppingPopup();
    }
  },

  reflectCheckedToFridge() {
    if (this.shoppingPopupChecked.length === 0) {
      this.showToast('チェックされた項目がありません');
      return;
    }

    const ingredients = this.getShoppingItems();
    const purchasedSet = new Set(this.state.shoppingPurchased || []);
    const unpurchased = ingredients.filter(ing => !purchasedSet.has(ing.key));

    if (!this.state.fridge) {
      this.state.fridge = [];
    }

    this.shoppingPopupChecked.forEach(index => {
      const ing = unpurchased[index];
      if (!ing) return;

      const existing = this.state.fridge.find(
        f => f.name === ing.name && f.unit === ing.unit
      );
      if (existing) {
        existing.amount += ing.amount;
      } else {
        this.state.fridge.push({ name: ing.name, amount: ing.amount, unit: ing.unit });
      }

      purchasedSet.add(ing.key);
    });

    this.state.shoppingPurchased = Array.from(purchasedSet);
    this.state.shoppingExtraItems = this.state.shoppingExtraItems.filter(
      item => !purchasedSet.has(item.key)
    );
    this.shoppingPopupChecked = [];

    this.saveState();
    this.closeModal();
    this.updateShoppingListButton();
    this.updateBadges();

    // オンボーディング
    if (!this.onboarding.fridgeNotified) {
      this.onboarding.purchasePrompted = true;
      this.onboarding.fridgeNotified = true;
      this.saveOnboarding();
      setTimeout(() => this.showGuide('fridgeStocked'), 300);
    } else {
      this.showToast('冷蔵庫に追加しました！');
    }
  },

  updateShoppingListButton() {
    const button = document.getElementById('shopping-list-button');
    const countEl = document.getElementById('shopping-count-main');
    if (!button) return;

    const ingredients = this.getShoppingItems();
    const purchasedSet = new Set(this.state.shoppingPurchased || []);
    const unpurchased = ingredients.filter(ing => !purchasedSet.has(ing.key));

    if (unpurchased.length > 0) {
      button.classList.remove('hidden');
      if (countEl) {
        countEl.textContent = unpurchased.length;
      }
    } else {
      button.classList.add('hidden');
    }
  },

  // ========================================
  // カテゴリ選択（左サイドバー）
  // ========================================
  selectedMyCategory: 'all',
  selectedPublicCategory: 'all',

  selectMyCategory(category) {
    this.selectedMyCategory = category;

    // UIを更新
    document.querySelectorAll('#my-category-sidebar .category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === category);
    });

    // フィルター適用
    this.filterMyItems();
  },

  selectPublicCategory(category) {
    this.selectedPublicCategory = category;

    // UIを更新
    document.querySelectorAll('#public-category-sidebar .category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === category);
    });

    // フィルター適用
    this.filterPublicItems();
  },

  // ========================================
  // FAB（Floating Action Button）
  // ========================================
  fabMenuOpen: false,

  showFabMenu() {
    this.fabMenuOpen = !this.fabMenuOpen;
    const menu = document.getElementById('fab-menu');
    const fab = document.getElementById('fab-my');

    if (this.fabMenuOpen) {
      menu.classList.remove('hidden');
      fab.style.transform = 'rotate(45deg)';
    } else {
      menu.classList.add('hidden');
      fab.style.transform = '';
    }
  },

  closeFabMenu() {
    this.fabMenuOpen = false;
    const menu = document.getElementById('fab-menu');
    const fab = document.getElementById('fab-my');
    if (menu) menu.classList.add('hidden');
    if (fab) fab.style.transform = '';
  },

  showSetSearch() {
    this.showToast('セット検索は準備中です');
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
    this.updateFilterSummary('my');
    this.updateFilterSummary('public');
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
    const ingredients = this.getShoppingItems();
    const purchasedSet = new Set(this.state.shoppingPurchased || []);

    return ingredients.filter(ing => !purchasedSet.has(ing.key)).length;
  },
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
