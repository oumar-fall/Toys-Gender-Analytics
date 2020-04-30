# Toys DataBase  <!-- omit in toc -->

By : ***Oumar Fall***  
Source : [***La Grande Récré***](https://www.lagranderecre.fr)

## Table of content:  <!-- omit in toc -->
- [A. Scraping Method](#a-scraping-method)
  - [1. Datas](#1-datas)
  - [2. Method](#2-method)
    - [Analysing html structure](#analysing-html-structure)
    - [Getting the different categories](#getting-the-different-categories)
    - [Modifying gender filter](#modifying-gender-filter)
    - [Navigate between pages](#navigate-between-pages)
    - [Summary](#summary)

<hr>

## A. Scraping Method

### 1. Datas
- **Source** : *www.lagranderecre.fr*
- **Begin** : *29/03/2020* at *01:23:56*  
- **End** : *29/03/2020* at *07:17:49*

### 2. Method
The idea was to browse the website in order to collect as much information as possible about each toy sold on this website. I decided to code the algorithm by myself in **javascript** using [**```puppeteer```**](https://pptr.dev/) library. This allowed me to open an headless browser to visit webpages programmatically.

[&nbsp;&nbsp;&nbsp;&nbsp;*<sub>Skip Details and go to summary</sub>*](#Summary)

#### Analysing html structure
First, I figured out that I had to analyse the **html structure** of the pages to determine how to access each field. I then realized that the fields weren't organized with a unique ID for each one like I thought. Thus I had to manage it using **XPath selectors**.

#### Getting the different categories
$\rightarrow$ *https://www.lagranderecre.fr/age/*

![](/medias/RM_AgeList.png)

Using an appropriate XPath selector, we can get the list of categories and corresponding urls:

```
const ageList = await page.$x(
    '//div[@class="items-container"]//div[@class="item"]//a'
  );
```

From this we can extract:

|Category name| Url 
|-------|------
| JOUETS BÉBÉ 0 À 12 MOIS  |https://www.lagranderecre.fr/1062584/jouets-be-be-0-a-12-mois.html 
| JOUETS ENFANT 1 À 3 ANS|https://www.lagranderecre.fr/1062589/jouets-enfant-1-a-3-ans.html
| JOUETS ENFANT 3 À 5 ANS|https://www.lagranderecre.fr/1062594/jouets-enfant-3-a-5-ans.html
| JOUETS ENFANT 6 À 8 ANS|https://www.lagranderecre.fr/1062599/jouets-enfant-6-a-8-ans.html
| JOUETS ENFANT 9 À 11 ANS|https://www.lagranderecre.fr/1062604/jouets-enfant-9-a-11-ans.html
| JOUETS 12 ANS ET PLUS|https://www.lagranderecre.fr/1062609/jouets-12-ans-et-plus.html

Then I could iter in each Category through those urls.

#### Modifying gender filter
First, I tried to filter gender using filter tab frow the website. With ```puppeteer```, I was able to simulate a click on an element.

![](/medias/RM_GenderFilter.png)

But after that, I realized that the delay between the click and the catalogue update was way too long and I started to collect data before this update. Then I used a little trick, I noticed that filters were displayed in clear in the url so I determined resulting url from the current one.

|Gender|url
|----|----
|Girl| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Girl </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1
|Boy| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Boy </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1
|mixed| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Mixte </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1

#### Navigate between pages


#### Summary
fefzefzefze
fzefz
