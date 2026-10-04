/* =========================================================
   DK's Oven — business data. Edit prices / items here.
   ========================================================= */
window.DK = {
  phone: "923029384268",          // WhatsApp + calls (0302-9384268)
  complaints: "0311-6900087",
  instagram: "https://www.instagram.com/", // TODO: put DK's Oven Instagram profile link here

  sizes: {
    small:   { label: "Small",   key: 0 },
    regular: { label: "Regular", key: 1 },
    large:   { label: "Large",   key: 2 },
    xl:      { label: "X-Large", key: 3 },
  },

  // [Small, Regular, Large, X-Large] (from the printed menu)
  // NOTE: X-Large price was cut off in the menu image; confirm 2700.
  pizzas: [
    { name: "Grilled Chicken",  ing: ["Pizza Sauce", "Cheese", "Grill Chicken", "Olive"], top: ["grill", "olive"], tag: "Bestseller", price: [700, 1450, 2000, 2700] },
    { name: "Supreme",          ing: ["Pizza Sauce", "Cheese", "Onion", "Capsicum", "Jalapeño", "Tikka Chicken", "Olive"], top: ["tikka", "capsicum", "onion", "olive", "jalapeno"], tag: "Loaded", price: [700, 1450, 2000, 2700] },
    { name: "Mughlai",          ing: ["Pizza Sauce", "Cheese", "Onion", "Capsicum", "Tikka Chicken", "Mushroom"], top: ["tikka", "mushroom", "capsicum", "onion"], price: [700, 1450, 2000, 2700] },
    { name: "B.B.Q Tikka",      ing: ["Pizza Sauce", "Cheese", "Onion", "Tikka Chicken", "Olive"], top: ["tikka", "onion", "olive"], tag: "Smoky", price: [700, 1450, 2000, 2700] },
    { name: "Fajita",           ing: ["Pizza Sauce", "Cheese", "Onion", "Fajita Chicken", "Capsicum"], top: ["grill", "capsicum", "onion"], price: [700, 1450, 2000, 2700] },
    { name: "Hot & Spicy",      ing: ["Hot Sauce", "Cheese", "Onion", "Fajita Chicken", "Jalapeño", "Olive"], top: ["grill", "jalapeno", "onion", "olive"], tag: "Spicy 🌶", price: [700, 1450, 2000, 2700] },
    { name: "Cheese Lover",     ing: ["Pizza Sauce", "Extra Cheese"], top: [], tag: "Cheesy", price: [700, 1450, 2000, 2700] },
    { name: "Beef Pepperoni",   ing: ["Pizza Sauce", "Cheese", "Beef Pepperoni"], top: ["pepperoni"], price: [700, 1450, 2000, 2700] },
    { name: "Sausages",         ing: ["Pizza Sauce", "Cheese", "Onion", "Capsicum", "Chicken Sausages", "Black Olive"], top: ["sausage", "capsicum", "olive"], price: [700, 1450, 2000, 2700] },
    { name: "Four Square",      ing: ["Pizza Sauce", "Cheese", "4 Flavours in 1"], top: ["tikka", "pepperoni", "capsicum", "olive"], tag: "4-in-1", price: [700, 1450, 2000, 2700] },
    { name: "Smoke Chicken",    ing: ["Pizza Sauce", "Cheese", "Smoked Chicken", "Onion", "Olive"], top: ["grill", "onion", "olive"], price: [700, 1450, 2000, 2700] },
    { name: "Very Vegi",        ing: ["Pizza Sauce", "Cheese", "Onion", "Capsicum", "Sweet Corn", "Olive", "Mushroom"], top: ["capsicum", "corn", "mushroom", "olive", "onion"], tag: "Veg", price: [700, 1450, 2000, 2700] },
    { name: "Tandoori Chicken", ing: ["Pizza Sauce", "Cheese", "Tandoori Chicken", "Onion", "Olive", "Mushroom"], top: ["tikka", "onion", "olive", "mushroom"], tag: "Desi Twist", price: [700, 1450, 2000, 2700] },
  ],

  // Specialty pizzas: prices not legible in the menu photo, so they are confirmed on WhatsApp.
  specials: [
    { name: "DK's Special",       desc: "The house signature. Danish's own favourite combo, fully loaded.", img: "assets/img/supreme.jpg", badge: "House Special" },
    { name: "Crown Crust",        desc: "A royal crown of cheesy, stuffed bites all around the edge.",       img: "assets/img/sharing.jpg",  badge: "Party Pick" },
    { name: "Stuffed Crust",      desc: "Melted cheese hiding inside a golden, pull-apart crust.",           img: "assets/img/cheese-pull.jpg", badge: "Cheese Inside" },
    { name: "Seekh Kebab Crust",  desc: "Desi seekh kebab rolled into the crust. Pakistan's favourite twist.", img: "assets/img/tandoori.jpg", badge: "Desi Fusion" },
  ],

  drinks: [
    { name: "Coca-Cola", color: "#d0021b" },
    { name: "Sprite",    color: "#1b9e4b" },
  ],

  zones: ["Wah Cantt", "New City", "Taxila", "Hassan Abdal"],

  /* ---------------- Google Reviews ----------------
     googleReviewsUrl : link to the Google Maps / Business profile reviews
     googleWriteReviewUrl : the "Ask for reviews" link from Google Business Profile
                            (looks like https://g.page/r/XXXX/review)
     googleRating / googleReviewCount : copy from Google, e.g. 4.8 and 120 (leave null to hide)
     reviews : paste REAL reviews from Google here, e.g.
       { name: "Customer name", rating: 5, text: "Review text…", date: "2 weeks ago" },
  */
  googleReviewsUrl: "",
  googleWriteReviewUrl: "",
  googleRating: null,
  googleReviewCount: null,
  reviews: [],
};
