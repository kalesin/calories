
# Calories Counter App

## The App
It is written in the JS framework VUEJS and uses the material design framework [Vuetify](https://vuetifyjs.com/en/) for a clean app look. It uses [Firebase](https://firebase.google.com/) on the backend and it's included features for: OAuth login flow, the apps database, managing users and hosting the site. For retrieving food nutritional data the app uses the [Edamam Food Database API](https://developer.edamam.com/).

The app is live at https://caloriescounter.web.app/.

 ## Welcome to Calorie Counter!

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

![Entries Page](https://user-images.githubusercontent.com/59158929/116547803-a4c7aa00-a8f3-11eb-9e33-27ea0c4fad38.png)


Adding recipes is meant to be used for [meal prepping food](https://sweetpeasandsaffron.com/how-to-meal-prep/)
or cooking larger meals multiple times a day which are split into
portions. For example making a meal with 1kg of chicken breast,
vegetables, 500 g of rice, olive oil, etc. and splitting it into 4
portions. This way you can control your portion size with the same
number of calories in every meal and prepare food in advance. It is
advisable to purchase a kitchen scale for best results with meal
prepping.

![Recipes page](https://user-images.githubusercontent.com/59158929/116545822-2c5fe980-a8f1-11eb-8e6c-f3fb8207cc9a.png)

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
