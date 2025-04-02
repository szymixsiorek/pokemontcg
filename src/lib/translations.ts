
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    "home": "Home",
    "sets": "Card Sets",
    "my_collection": "My Collection",
    "sign_in": "Sign In",
    "sign_up": "Sign Up",
    "sign_out": "Sign Out",
    "forgot_password": "Forgot Password?",

    // Home Page
    "welcome": "Welcome to Japanese Pokemon TCG Gallery",
    "welcome_subtitle": "Explore Japanese Pokemon card sets and track your collection",
    "explore_sets": "Explore Sets",
    "latest_sets": "Latest Sets",
    "popular_sets": "Popular Sets",
    "choose_theme": "Choose Theme",

    // Card Sets
    "all_sets": "All Card Sets",
    "cards_in_set": "cards in this set",
    "release_date": "Release Date",
    "view_set": "View Set",
    "search_sets": "Search sets...",
    "no_sets_found": "No sets found for your search",
    "clear_search": "Clear Search",
    "japanese_sets": "Japanese Sets",
    "english_sets": "English Sets",
    "back_to_sets": "Back to Sets",
    "set_not_found": "Set not found",
    "series": "Series",

    // Card Details
    "card_number": "Card Number",
    "card_rarity": "Rarity",
    "card_type": "Type",
    "add_to_collection": "Add to Collection",
    "remove_from_collection": "Remove from Collection",

    // Authentication
    "email": "Email",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "reset_password": "Reset Password",
    "create_account": "Create Account",
    "already_have_account": "Already have an account?",
    "no_account": "Don't have an account?",
    "reset_link_sent": "Password reset link sent!",

    // Collection
    "your_cards": "Your Cards",
    "collected": "Collected",
    "add_card": "Add Card",
    "remove_card": "Remove Card",
    "filter_collection": "Filter Collection",
    "sort_by": "Sort By",
    "cards_collected": "Cards Collected",
    "no_matching_cards": "No matching cards found",
    "no_cards_in_collection": "No cards in your collection",
    "browse_sets": "Browse Sets",
    "search_cards": "Search cards...",
    
    // Themes
    "theme_original": "Original Series",
    "theme_gold_silver": "Gold & Silver",
    "theme_ruby_sapphire": "Ruby & Sapphire",
    "theme_diamond_pearl": "Diamond & Pearl",
    "theme_black_white": "Black & White",
    "theme_xy": "X & Y",
    "theme_sun_moon": "Sun & Moon",
    "theme_sword_shield": "Sword & Shield",
    "theme_scarlet_violet": "Scarlet & Violet",

    // Misc
    "loading": "Loading...",
    "error": "An error occurred.",
    "try_again": "Try Again",
    "language": "Language",
  },
  ja: {
    // ナビゲーション
    "home": "ホーム",
    "sets": "カードセット",
    "my_collection": "マイコレクション",
    "sign_in": "ログイン",
    "sign_up": "登録",
    "sign_out": "ログアウト",
    "forgot_password": "パスワードをお忘れですか？",

    // ホームページ
    "welcome": "ポケモンカードゲーム日本語版ギャラリーへようこそ",
    "welcome_subtitle": "日本語版ポケモンカードセットを探索し、コレクションを管理しましょう",
    "explore_sets": "セットを探索",
    "latest_sets": "最新セット",
    "popular_sets": "人気セット",
    "choose_theme": "テーマを選ぶ",

    // カードセット
    "all_sets": "すべてのカードセット",
    "cards_in_set": "枚のカード",
    "release_date": "発売日",
    "view_set": "セットを見る",
    "search_sets": "セットを検索...",
    "no_sets_found": "検索に一致するセットがありません",
    "clear_search": "検索をクリア",
    "japanese_sets": "日本語版セット",
    "english_sets": "英語版セット",
    "back_to_sets": "セット一覧に戻る",
    "set_not_found": "セットが見つかりません",
    "series": "シリーズ",

    // カード詳細
    "card_number": "カード番号",
    "card_rarity": "レアリティ",
    "card_type": "タイプ",
    "add_to_collection": "コレクションに追加",
    "remove_from_collection": "コレクションから削除",

    // 認証
    "email": "メールアドレス",
    "password": "パスワード",
    "confirm_password": "パスワード（確認）",
    "reset_password": "パスワードをリセット",
    "create_account": "アカウントを作成",
    "already_have_account": "すでにアカウントをお持ちですか？",
    "no_account": "アカウントをお持ちではありませんか？",
    "reset_link_sent": "パスワードリセットリンクを送信しました！",

    // コレクション
    "your_cards": "あなたのカード",
    "collected": "収集済み",
    "add_card": "カードを追加",
    "remove_card": "カードを削除",
    "filter_collection": "コレクションをフィルター",
    "sort_by": "並び替え",
    "cards_collected": "収集したカード",
    "no_matching_cards": "一致するカードがありません",
    "no_cards_in_collection": "コレクションにカードがありません",
    "browse_sets": "セットを閲覧",
    "search_cards": "カードを検索...",
    
    // テーマ
    "theme_original": "初代",
    "theme_gold_silver": "金・銀",
    "theme_ruby_sapphire": "ルビー・サファイア",
    "theme_diamond_pearl": "ダイヤモンド・パール",
    "theme_black_white": "ブラック・ホワイト",
    "theme_xy": "X・Y",
    "theme_sun_moon": "サン・ムーン",
    "theme_sword_shield": "ソード・シールド",
    "theme_scarlet_violet": "スカーレット・バイオレット",

    // その他
    "loading": "読み込み中...",
    "error": "エラーが発生しました。",
    "try_again": "再試行",
    "language": "言語",
  }
};

export default translations;
