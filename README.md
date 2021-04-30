
# Calories Counter App

## The App
The app is written in the JS framework VUE.JS and uses the material design framework [Vuetify](https://vuetifyjs.com/en/) for a clean app look. It uses [Firebase](https://firebase.google.com/) on the backend and it's included features for: OAuth login flow, the apps database, managing users and hosting the site. For retrieving nutritional data of food the app uses the [Edamam Food Database API](https://developer.edamam.com/).

The app is live at https://caloriescounter.web.app/.

 ## Welcome to Calorie Counter

This app is for
reaching your body weight goals. The first step when logging your
calorie intake should be determining your target body weight and the
 amount of calories you should be eating in day to reach that goal.
 
Using this online tool will help you determine the amount of
calories you should aim for:
[Calorie Calculator](https://www.calculator.net/calorie-calculator.html), of course everybody is different so you will need to monitor your
intake and body weight while you diet and make changes accordingly.
   
##  Entries
        
 The entries page is the interface for adding foods to the current
day or any other date, you have the options to add food to 4
different meals: Breakfast, Lunch, Dinner and Snacks. You can drag
foods between meals and make your own recipes. After you have
created a recipe you can add it to your meals or favorite it.

1. Searching for a food item\
![input](https://user-images.githubusercontent.com/59158929/116669461-e1041480-a99e-11eb-95f0-18a4b0af8098.png)
2. Input amount in grams\
![itemopen](https://user-images.githubusercontent.com/59158929/116669486-ecefd680-a99e-11eb-9f90-6ac3b9d18ecc.png)
3. You can drag items to other meals\
![dragging](https://user-images.githubusercontent.com/59158929/116669572-0c86ff00-a99f-11eb-9fc6-e7fc26499619.png)
4. You can reset a whole date's entry\
![resetbutton](https://user-images.githubusercontent.com/59158929/116669582-101a8600-a99f-11eb-8276-c3604279d6d5.png)

## Recipes

Adding recipes is meant to be used for [meal prepping food](https://sweetpeasandsaffron.com/how-to-meal-prep/)
or cooking larger meals multiple times a day which are split into
portions. For example making a meal with 1kg of chicken breast,
vegetables, 500 g of rice, olive oil, etc. and splitting it into 4
portions. This way you can control your portion size with the same
number of calories in every meal and prepare food in advance. It is
advisable to purchase a kitchen scale for best results with meal
prepping.

1. Click to create a new recipe\
![addrecipe](https://user-images.githubusercontent.com/59158929/116669499-f4af7b00-a99e-11eb-8486-c88c507c0bcd.png)
2. Recipe interface\
![recipemenu](https://user-images.githubusercontent.com/59158929/116669516-f8db9880-a99e-11eb-9e5f-511e990828ab.png)
3. Finished adding items, time to save recipe\
![savingrecipe](https://user-images.githubusercontent.com/59158929/116669522-fb3df280-a99e-11eb-8c49-7372e887b60d.png)
4. Favorited recipe, by clicking + you can add the recipe to your meals\
![addingportion](https://user-images.githubusercontent.com/59158929/116669544-02650080-a99f-11eb-902f-878c9df7a8b1.png)

## Calendar
The calendar page is the monthly overview of progress each day. By clicking on the date you get redirected to the Entries page where you can edit that date's added items.

![Calendar page](https://user-images.githubusercontent.com/59158929/116545942-50bbc600-a8f1-11eb-82a9-6d8dcfa96acd.png)

Thank you for trying Calorie Counter!


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
