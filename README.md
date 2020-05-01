# Toys DataBase  <!-- omit in toc -->

By : ***Oumar Fall***  
Source : [***La Grande Récré***](https://www.lagranderecre.fr)

> ## Table of content:  <!-- omit in toc -->
- [A. Scraping Method](#a-scraping-method)
  - [1. Properties](#1-properties)
  - [2. Method](#2-method)
    - [Analysing html structure](#analysing-html-structure)
    - [Getting the different categories](#getting-the-different-categories)
    - [Modifying gender filter](#modifying-gender-filter)
    - [Navigate between pages](#navigate-between-pages)
    - [Browsing pages](#browsing-pages)
    - [Data scrapping](#data-scrapping)
    - [Summary](#summary)
- [B. Database](#b-database)
  - [1. Properties](#1-properties-1)
  - [2. Datas](#2-datas)
  - [3. Structure](#3-structure)

<hr>

>## A. Scraping Method

>### 1. Properties
- **Source** : *www.lagranderecre.fr*
- **Begin** : *29/03/2020* at *01:23:56*  
- **End** : *29/03/2020* at *07:17:49*

>### 2. Method
The idea was to browse the website in order to collect as much information as possible about each toy sold on this website. I decided to code the algorithm by myself in **javascript** using [**```puppeteer```**](https://pptr.dev/) library. This allowed me to open an headless browser to visit webpages programmatically.

[&nbsp;&nbsp;&nbsp;&nbsp;*<sub>Skip Details and go to summary</sub>*](#Summary)

>#### Analysing html structure
First, I figured out that I had to analyse the **html structure** of the pages to determine how to access each field. I then realized that the fields weren't organized with a unique ID for each one like I thought. Thus I had to manage it using **XPath selectors**.

>#### Getting the different categories
--> *https://www.lagranderecre.fr/age/*

![](/medias/RM_AgeList.png)

Using an appropriate XPath selector, we can get the list of categories and corresponding urls:


|Field                 |XPath selector|
|----------------------|--------------|
|*Links*                |```$x('//div[@class="items-container"]//div[@class="item"]//a')```|


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

>#### Modifying gender filter
First, I tried to filter gender using filter tab frow the website. With ```puppeteer```, I was able to simulate a click on an element.

![](/medias/RM_GenderFilter.png)

But after that, I realized that the delay between the click and the catalogue update was way too long and I started to collect data before this update. Then I used a little trick, I noticed that filters were displayed in clear in the url so I determined resulting url from the current one.

|Gender|url
|----|----
|Girl| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Girl </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1
|Boy| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Boy </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1
|mixed| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Mixte </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1

>#### Navigate between pages

Once again, I first tried to navigate between pages by clicking on the next button at the nottom of the page.

![](/medias/RM_NextPage.png)

But I got the same issue about charging time so I used the same trick looking for page number in the url. To do so, I had to know the total number of available pages. Inspecting the html code, I discovered that, at the bottom of each page, there was an hidden ``` <span> ``` that I could use to get this value:

```html
<li class="page-count">
  <span> Page 1 sur 43 </span>
</li>
```

From there I could build the specific url for each page by adding "*&pageNumber-23=**[pageNumber]**#top-23*" at its end.

>#### Browsing pages

Now that I got all of the pages' url, the next step was to browse those pages to isolate each toy-specific informations such as names and prices. Once again I inspected html code in order to determine the corresponding XPath selector.

![](/medias/RM_ToySection.png)

|Field                 |XPath selector|
|----------------------|--------------|
|*Product names*                |```$x('//div[contains(@class, "thumbnail-product")]//a[@class = "product-name"]')```|
|*Prices*                 |```$x('//div[contains(@class, "thumbnail-product")]//li[contains(@class, "price-with-taxes")]//span[@class = "price-value"]')```|

Then, for each toy, I extracted the url of the page contained in the html ```<a>``` tags of the names and open this page in a new tab of my browser.

```html
<a class="product-name" ... href="https://www.lagranderecre.fr/3-mini-vehicules-city-a-friction.html"> 3 MINI VÉHICULES CITY À FRICTION </a>
```

>#### Data scrapping

I identified the fields I wanted to extract and determined the corresponding XPath selectors.

![](/medias/RM_ProductPage.png)

|Field                 |XPath selector|
|----------------------|--------------|
|*Images*                |```$x('//img[@class = "media-visuals-main-img"]')```|
|*Brand*                 |```$x('//div[@class = "product-brand"]//a')```|
|*Description*           |```$x("//div[@class = 'description-container']//h4[contains(text(), 'RACONTE MOI UNE HISTOIRE')]/following-sibling::*")```|
|*Security Instructions* |```$x('//div[@class = "description-container"]//h4[contains(text(), "SÉCURITÉ")]/following-sibling::*')```|
|*Internal code*         |```$x('//*[*[contains(text(), "CODE INTERNE")]]')```|
|*EAN code*             |```$x('//*[*[contains(text(), "CODE EAN")]]')```|
|*Manufacturer reference*|```$x('//*[*[contains(text(), "RÉFÉRENCE FABRICANT")]]')```|
|*Min age*               |```$x('//i[contains(@class, "icon-cake")]/following-sibling::p')```|
|*Dimensions*           |```$x('//i[contains(@class, "icon-size")]/following-sibling::p')```|
|*Weight*                |```$x('//i[contains(@class, "icon-weight")]/following-sibling::p')```|

I then collected all of this information and downloaded all of the images.

>#### Summary

All of the above steps can be summarized in the following diagram.

![](/medias/RM_ScrapingTree.png)

>## B. Database

>### 1. Properties

**Total size = 1.9Go**  
**41.907 elements** including **41.899 images**

The resulting Database is stored in the ./LaGrandeRecre/ folder with following architecture :

```
.
└── LaGrandeRecre/
    ├── Boy/
    │   └── Boy0_0.jpg
    ├── Girl/
    │   └── Girl0_0.jpg
    ├── Mixte/
    │   └── Mixte0_0.jpg
    ├── logs/
    │   └── log_29032020_012356.txt
    ├── DB.csv
    ├── categories.csv
    ├── marques.csv
    └── DB.json
```

|Element|Description|
|-------|-----------|
|LaGrandeRecre/|Root **Folder**|
|Boy/|**Folder** containing all images of toys for Boys|
|Girl/|**Folder** containing all images of toys for Girls|
|Mixte/|**Folder** containing all images of toys for Both|
|logs/|**Folder** containing the log files|
|DB.csv|**File** containing the database in csv format|
|categories.csv|*see [Structure](#3-Structure)*|
|marques.csv|*see [Structure](#3-Structure)*|
|DB.json|**File** containing the database in json format *(useful to convert it in a javascript object to apply some changes)*|

* Log files are named with following structure : *```log_[date]_[time].txt```*
* Image files are named with following structure : *```[Toy id]_[Image indice].jpg```*

>### 2.Reorganization

At the end of the scraping, I had to reorganize the database for it to be clearer and to get coherence between datas.

I did it in *modifyCSV.js*.

>### 3. Structure


Database is structure in 3 parts :

* **Images folders** *(see [Properties](#1-Properties-1))*
* **Categories table** : *categories.csv*

| categorie_id | categorie_short_name |       categorie_name       |
|:------------:|:--------------------:|:--------------------------:|
| 0            |"0_1"                 | "JOUETS BÉBÉ 0 À 12 MOIS"  |
| 1            |"1_3"                 | "JOUETS ENFANT 1 À 3 ANS"  |
| 2            |"3_5"                 | "JOUETS ENFANT 3 À 5 ANS"  |
| 3            |"6_8"                 | "JOUETS ENFANT 6 À 8 ANS"  |
| 4            |"9_11"                | "JOUETS ENFANT 9 À 11 ANS" |
| 5            |"12_plus"             | "JOUETS 12 ANS ET PLUS"    |

* **Marques table** : *marques.csv*

| marque_id    | marque_name |
|:------------:|:-----------:|
|0             |"ABY SMILE"  |
|1             |"ABYSSE CORP"|
|2             |"AMSCAN"     |
|3             |"ASMODÉE"    |
|...           |...          |
|101           |"None"       |
|...           |...          |

* **Database table**

|| id | nom | genre | prix *(€)* | description | securite | codeInterne | codeEAN | referenceFabricant 
|-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|**type**| *string* | *string* | *string* | *float* | *string* | *string* | *int* | *string* | *string* |

<br>
<br>


|| ageMin *(années)*| categorie_id | longueur *(cm)* | largeur *(cm)* | hauteur *(cm)* | poids *(kg)* | marque_id |
|-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|**type**| *float* | *int* | *float* | *float* | *float* | *float* | *int* |

**id** is created by concatenating the ***gender*** of the product and its ***indice*** among all product of this gender.  
*e.g.* ```Boy217```
