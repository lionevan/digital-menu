
/**
 * menu-data.js
 * מקור אמת יחיד לתפריט - משמש את order.html (מסך הזמנה למלצר) ו-kitchen.html (תצוגת מטבח)
 *
 * מבנה כל פריט:
 *   id       - מזהה ייחודי קבוע (לא לשנות אחרי שמתחילים לשמור הזמנות, כדי לא לשבור רקורד היסטורי)
 *   category - קטגוריית תפריט (לתצוגה למלצר, לפי סדר התפריט הציבורי)
 *   station  - עמדת מטבח: "cold" (מטבח קר) | "hot" (מטבח חם) | "bar" (בר)
 *   price    - מחיר יחיד באירו, או null אם יש variants
 *   variants - מערך אופציות מחיר (למשל כוסית/בקבוק, או רגיל/עם תוספת)
 *   name     - שם בשלוש שפות. שדות gr (יווני) הם טיוטה ראשונית - יש לאמת עם אבישג/הטבח
 *
 * הערה על היוונית: זהו תרגום ראשוני שנכתב בלי מקור קיים במסעדה.
 * שמות מנות בסיסיים (Greek salad, hummus וכו') הם תרגום סטנדרטי מקובל.
 * מומלץ לאמת עם אבישג/דובר יווני לפני שסומכים על זה במטבח באופן מלא.
 */

const MENU_DATA = {
  categories: [
    { id: "starters",     name: { he: "פתיחה",              en: "Starters",            gr: "Ορεκτικά" } },
    { id: "salads",       name: { he: "סלטים",              en: "Salads",              gr: "Σαλάτες" } },
    { id: "hummus",       name: { he: "חומוס",               en: "Hummus",              gr: "Χούμους" } },
    { id: "meat_chicken", name: { he: "בשר ועוף",            en: "Meat & Chicken",      gr: "Κρέας & Κοτόπουλο" } },
    { id: "fish",         name: { he: "דגים",                en: "Fish",                gr: "Ψάρια" } },
    { id: "vegan_veg",    name: { he: "טבעוני / צמחוני",     en: "Vegan / Vegetarian",  gr: "Vegan / Χορτοφαγικά" } },
    { id: "soft_drinks",  name: { he: "שתייה קלה",           en: "Soft Drinks",         gr: "Αναψυκτικά" } },
    { id: "beer",         name: { he: "בירה",                en: "Beer",                gr: "Μπύρα" } },
    { id: "cocktails",    name: { he: "קוקטיילים",           en: "Cocktails",           gr: "Κοκτέιλ" } },
    { id: "ouzo",         name: { he: "אוזו",                en: "Ouzo",                gr: "Ούζο" } },
    { id: "whiskey",      name: { he: "וויסקי",              en: "Whiskey",             gr: "Ουίσκι" } },
    { id: "vodka",        name: { he: "וודקה",               en: "Vodka",               gr: "Βότκα" } },
    { id: "nargilla",     name: { he: "נרגילה",              en: "Nargilla",            gr: "Ναργιλές" } },
    { id: "dessert",      name: { he: "קינוח",               en: "Dessert",             gr: "Επιδόρπιο" } }
  ],

  items: [
    // ---------- פתיחה / Starters ----------
    { id: "pita_olive",  category: "starters", station: "cold", price: 10,
      name: { he: "פיתה יוונית עם ממרח זיתים", en: "Greek pita with olive pâté", gr: "Πίτα με ελιόπαστα" } },
    { id: "edamame",     category: "starters", station: "cold", price: 10,
      name: { he: "אדממה", en: "Edamame", gr: "Εδαμάμε" } },
    { id: "fries",       category: "starters", station: "hot", price: 10,
      name: { he: "צ'יפס קריספי", en: "Crispy French fries", gr: "Τραγανές πατάτες" } },
    { id: "veg_plate",   category: "starters", station: "cold", price: 28,
      name: { he: "פלטת ירקות טריים", en: "Fresh vegetable plate", gr: "Πιάτο φρέσκα λαχανικά" } },
    { id: "rice_plate",  category: "starters", station: "hot", price: 10,
      name: { he: "צלחת אורז", en: "Rice plate", gr: "Πιάτο ρύζι" } },

    // ---------- סלטים / Salads ----------
    { id: "tahini_2pita", category: "salads", station: "cold", price: 10,
      name: { he: "טחינה בתוספת שתי פיתות", en: "Tahini with 2 pita breads", gr: "Ταχίνι με δύο πίτες" } },
    { id: "eggplant", category: "salads", station: "cold", price: null,
      variants: [
        { price: 10, label: { he: "חצילים", en: "Eggplant", gr: "Μελιτζάνα" } },
        { price: 13, label: { he: "חצילים עם טחינה בצד", en: "Eggplant with tahini", gr: "Μελιτζάνα με ταχίνι" } }
      ],
      name: { he: "חצילים / חצילים עם טחינה בצד", en: "Eggplant / Eggplant with tahini", gr: "Μελιτζάνα / με ταχίνι" } },
    { id: "hot_peppers", category: "salads", station: "hot", price: 7,
      name: { he: "פלפלים חריפים על האש", en: "Grilled hot peppers", gr: "Ψητές καυτερές πιπεριές" } },
    { id: "greek_olives", category: "salads", station: "cold", price: 10,
      name: { he: "זיתים יווניים", en: "Greek olives", gr: "Ελιές" } },
    { id: "chopped_veg_salad", category: "salads", station: "cold", price: 10,
      name: { he: "סלט ירקות קצוץ", en: "Chopped vegetable salad", gr: "Χωριάτικη σαλάτα λαχανικών" } },
    { id: "yasou_salad", category: "salads", station: "cold", price: 13,
      name: { he: "סלט יאסו", en: "Yasou salad", gr: "Σαλάτα Yasou" } },
    { id: "vegan_greek_salad", category: "salads", station: "cold", price: 28,
      name: { he: "סלט יווני טבעוני", en: "Vegan Greek Salad", gr: "Χωριάτικη σαλάτα vegan" } },
    { id: "extra_2pita", category: "salads", station: "cold", price: 3,
      name: { he: "תוספת 2 פיתות", en: "Extra two pita breads", gr: "2 επιπλέον πίτες" } },
    { id: "extra_tahini_zhug", category: "salads", station: "cold", price: 3,
      name: { he: "תוספת טחינה / חריף סחוג", en: "Extra tahini / Zhug hot sauce", gr: "Επιπλέον ταχίνι / πικάντικη σάλτσα" } },

    // ---------- חומוס / Hummus ----------
    { id: "hummus_plain", category: "hummus", station: "cold", price: 10,
      name: { he: "חומוס ביתי", en: "Home-made hummus", gr: "Σπιτικό χούμους" } },
    { id: "hummus_tahini", category: "hummus", station: "cold", price: 13,
      name: { he: "חומוס טחינה", en: "Hummus Tahini", gr: "Χούμους με ταχίνι" } },
    { id: "hummus_mushroom", category: "hummus", station: "cold", price: 15,
      name: { he: "חומוס פטריות", en: "Hummus with mushrooms", gr: "Χούμους με μανιτάρια" } },
    { id: "hummus_mini_schnitzel", category: "hummus", station: "hot", price: 20,
      name: { he: "חומוס שניצלונים", en: "Hummus with mini schnitzel", gr: "Χούμους με μίνι σνίτσελ" } },
    { id: "hummus_meat", category: "hummus", station: "hot", price: 20,
      name: { he: "חומוס בשר טחון", en: "Hummus with minced meat", gr: "Χούμους με κιμά" } },

    // ---------- בשר ועוף / Meat & Chicken ----------
    { id: "pargit", category: "meat_chicken", station: "hot", price: 28,
      name: { he: "פרגיות", en: "Pargit - chicken thighs", gr: "Κοτομπουτάκια" } },
    { id: "schnitzel", category: "meat_chicken", station: "hot", price: 28,
      name: { he: "שניצל", en: "Schnitzel", gr: "Σνίτσελ" } },
    { id: "mini_schnitzel", category: "meat_chicken", station: "hot", price: 28,
      name: { he: "שניצלונים", en: "Mini schnitzel", gr: "Μίνι σνίτσελ" } },
    { id: "grilled_chicken_breast", category: "meat_chicken", station: "hot", price: 28,
      name: { he: "חזה עוף על האש", en: "Grilled chicken breast", gr: "Ψητό στήθος κοτόπουλου" } },
    { id: "greek_kebab", category: "meat_chicken", station: "hot", price: 30,
      name: { he: "קבב יווני", en: "Greek kebab", gr: "Ελληνικό κεμπάπ" } },
    { id: "burger_pita", category: "meat_chicken", station: "hot", price: 30,
      name: { he: "המבורגר על פיתה יוונית", en: "Burger on Greek pita", gr: "Μπιφτέκι με πίτα" } },

    // ---------- דגים / Fish ----------
    { id: "sea_bream", category: "fish", station: "hot", price: 30,
      name: { he: "דניס / צ'יפורה", en: "Sea bream - Dorade", gr: "Τσιπούρα" } },
    { id: "sea_bass", category: "fish", station: "hot", price: 30,
      name: { he: "לברק", en: "Sea bass - Loup de mer", gr: "Λαβράκι" } },

    // ---------- טבעוני / צמחוני ----------
    { id: "omelette_salad", category: "vegan_veg", station: "hot", price: 15,
      name: { he: "חביתה + שתי פיתות + קערית סלט", en: "Omelette with salad & pita", gr: "Ομελέτα με σαλάτα & πίτα" } },
    { id: "omelette_onion_mushroom", category: "vegan_veg", station: "hot", price: 18,
      name: { he: "חביתה עם בצל או פטריות + פיתות + סלט", en: "Omelette with onion or mushrooms, salad & pita", gr: "Ομελέτα με κρεμμύδι ή μανιτάρια" } },
    { id: "vegan_greek_salad_cheese", category: "vegan_veg", station: "cold", price: 28,
      name: { he: "סלט יווני עם גבינה טבעונית + שתי פיתות", en: "Greek salad (vegan cheese) with two pita breads", gr: "Χωριάτικη με vegan τυρί" } },

    // ---------- שתייה קלה ----------
    { id: "water_soda", category: "soft_drinks", station: "bar", price: 4,
      name: { he: "מים / סודה", en: "Water / Soda", gr: "Νερό / Σόδα" } },
    { id: "cola_zero", category: "soft_drinks", station: "bar", price: 4,
      name: { he: "קולה / זירו", en: "Cola / Zero", gr: "Κόλα / Zero" } },
    { id: "sprite_zero", category: "soft_drinks", station: "bar", price: 4,
      name: { he: "ספרייט / זירו", en: "Sprite / Zero", gr: "Sprite / Zero" } },
    { id: "fanta_orange", category: "soft_drinks", station: "bar", price: 4,
      name: { he: "פנטה תפוזים", en: "Fanta Orange", gr: "Fanta πορτοκάλι" } },
    { id: "ice_tea_peach", category: "soft_drinks", station: "bar", price: 4,
      name: { he: "אייס תה אפרסק", en: "Ice Tea Peach", gr: "Παγωμένο τσάι ροδάκινο" } },
    { id: "juices", category: "soft_drinks", station: "bar", price: 4,
      name: { he: "מיצים: תפוזים / לימונדה / דובדבן", en: "Juices: Orange / Lemonade / Cherry", gr: "Χυμοί: πορτοκάλι / λεμονάδα / κεράσι" } },
    { id: "energy_drink", category: "soft_drinks", station: "bar", price: 8,
      name: { he: "משקה אנרגיה", en: "Energy drink", gr: "Ενεργειακό ποτό" } },

    // ---------- בירה ----------
    { id: "heineken", category: "beer", station: "bar", price: 10,
      name: { he: "הייניקן", en: "Heineken", gr: "Heineken" } },
    { id: "carlsberg", category: "beer", station: "bar", price: 12,
      name: { he: "קרלסברג", en: "Carlsberg", gr: "Carlsberg" } },
    { id: "corona", category: "beer", station: "bar", price: 13,
      name: { he: "קורונה", en: "Corona", gr: "Corona" } },

    // ---------- קוקטיילים ----------
    { id: "yasou_ouzo_cocktail", category: "cocktails", station: "bar", price: 15,
      name: { he: "יאסו קוקטייל אוזו", en: "Yasou Ouzo Cocktail", gr: "Κοκτέιλ Yasou Ούζο" } },
    { id: "fruit_mix_nonalc", category: "cocktails", station: "bar", price: 10,
      name: { he: "מיקס פירות ללא אלכוהול", en: "Non-alcoholic fruit mix", gr: "Μείγμα φρούτων χωρίς αλκοόλ" } },

    // ---------- אוזו ----------
    { id: "plomari", category: "ouzo", station: "bar", price: null,
      variants: [
        { price: 12, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 120, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "פלומרי", en: "Plomari", gr: "Πλωμάρι" } },
    { id: "ouzo_12", category: "ouzo", station: "bar", price: null,
      variants: [
        { price: 12, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 120, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "אוזו 12", en: "Ouzo 12", gr: "Ούζο 12" } },
    { id: "ouzo_200ml", category: "ouzo", station: "bar", price: 30,
      name: { he: "אוזו 200 מ\"ל", en: "Ouzo 200ml", gr: "Ούζο 200ml" } },

    // ---------- וויסקי ----------
    { id: "jameson", category: "whiskey", station: "bar", price: null,
      variants: [
        { price: 15, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 180, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "ג'יימסון", en: "Jameson", gr: "Jameson" } },
    { id: "jack_daniels", category: "whiskey", station: "bar", price: null,
      variants: [
        { price: 15, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 180, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "ג'ק דניאל", en: "Jack Daniel's", gr: "Jack Daniel's" } },
    { id: "chivas", category: "whiskey", station: "bar", price: null,
      variants: [
        { price: 13, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 150, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "שיבאס", en: "Chivas", gr: "Chivas" } },
    { id: "black_label", category: "whiskey", station: "bar", price: null,
      variants: [
        { price: 15, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 200, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "בלאק לייבל", en: "Black Label", gr: "Black Label" } },

    // ---------- וודקה ----------
    { id: "stoli", category: "vodka", station: "bar", price: null,
      variants: [
        { price: 13, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 130, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "סטולי", en: "Stoli", gr: "Stoli" } },
    { id: "finlandia", category: "vodka", station: "bar", price: null,
      variants: [
        { price: 13, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 130, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "פילנדיה", en: "Finlandia", gr: "Finlandia" } },
    { id: "grey_goose", category: "vodka", station: "bar", price: null,
      variants: [
        { price: 15, label: { he: "כוסית", en: "Glass", gr: "Ποτήρι" } },
        { price: 200, label: { he: "בקבוק", en: "Bottle", gr: "Μπουκάλι" } }
      ],
      name: { he: "גריי גוס", en: "Grey Goose", gr: "Grey Goose" } },

    // ---------- נרגילה ----------
    { id: "nargilla_flavor", category: "nargilla", station: "bar", price: 30,
      name: { he: "נרגילה: תפוח / אבטיח / נענע", en: "Nargilla: Apple / Watermelon / Mint", gr: "Ναργιλές: μήλο / καρπούζι / μέντα" } },
    { id: "nargilla_refill", category: "nargilla", station: "bar", price: 15,
      name: { he: "החלפת ראש + גחל חדש", en: "Refill head + new coal", gr: "Αλλαγή κεφαλής + κάρβουνο" } },

    // ---------- קינוח ----------
    { id: "dessert_of_day", category: "dessert", station: "cold", price: 10,
      name: { he: "שאל את המלצר על קינוח היום!", en: "Ask the waiter for the dessert of the day!", gr: "Ρωτήστε τον σερβιτόρο για το επιδόρπιο της ημέρας!" } }
  ]
};

// תמיכה גם ב-Node (לבדיקות/Apps Script בעתיד) וגם בטעינה ישירה בדפדפן
if (typeof module !== "undefined" && module.exports) {
  module.exports = MENU_DATA;
}
