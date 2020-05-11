# Toys DataBase  <!-- omit in toc -->

By : ***Oumar Fall***  
Source : [***La Grande Récré***](https://www.lagranderecre.fr)  
Database : [*Download (7.9Go)*](https://drive.google.com/open?id=1i_q4RZ_1FFNXxMFa9GEUovXstCq9KEFg)

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
  - [3. Limitations](#3-limitations)
    - [Observations](#observations)
    - [Tests](#tests)
    - [Solutions](#solutions)
- [B. Database](#b-database)
  - [1. Properties](#1-properties-1)
  - [2. Reorganization](#2-reorganization)
  - [3. Structure](#3-structure)

<hr>

>## A. Scraping Method

>### 1. Properties
- **Source** : *www.lagranderecre.fr*
- **Begin** : *10/04/2020* at *00:01:32*  
- **End** : *11/04/2020* at *02:56:12*
- **Code** : [scrap_LGR.js](./scrap_LGR.js)

>### 2. Method
The idea was to browse the website in order to collect as much information as possible about each toy sold on this website. I decided to code the algorithm by myself in **javascript** using [**```puppeteer```**](https://pptr.dev/) library. This allowed me to open an headless browser to visit webpages programmatically.

[&nbsp;&nbsp;&nbsp;&nbsp;*<sub>Skip Details and go to summary</sub>*](#Summary)

>#### Analysing html structure
First, I figured out that I had to analyse the **html structure** of the pages to determine how to access each field. I then realized that the fields weren't organized with a unique ID for each one like I thought. Thus I had to manage it using **XPath selectors**.

>#### Getting the different categories
--> *https://www.lagranderecre.fr/age/*

![RM_AgeList](/medias/RM_AgeList.png)

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

![RM_GenderFilter](/medias/RM_GenderFilter.png)

But after that, I realized that the delay between the click and the catalogue update was way too long and I started to collect data before this update. Then I used a little trick, I noticed that filters were displayed in clear in the url so I determined resulting url from the current one.

|Gender|url
|----|----
|Girl| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Girl </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1
|Boy| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Boy </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1
|mixed| <span style="color:lightblue;">[current url]</span>?facetFilters%5Bf_973192%5D%5B <strong style="color:red;"> Mixte </strong>%5D=1&storeStockFilter=0&webStoreStockFilter=1

Then I change the value of *webStoreStockFilter* to **0** (*see [Limitations](#3-limitations)*)

>#### Navigate between pages

Once again, I first tried to navigate between pages by clicking on the next button at the nottom of the page.

![RM_NextPage](/medias/RM_NextPage.png)

But I got the same issue about charging time so I used the same trick looking for page number in the url. To do so, I had to know the total number of available pages. Inspecting the html code, I discovered that, at the bottom of each page, there was an hidden ``` <span> ``` that I could use to get this value:

```html
<li class="page-count">
  <span> Page 1 sur 43 </span>
</li>
```

From there I could build the specific url for each page by adding "*&pageNumber-23=**[pageNumber]**#top-23*" at its end.

I also added "*&sortBy-23=title.asc*" before "*#top-23*" (*see [Limitations](#3-limitations)*)



>#### Browsing pages

Now that I got all of the pages' url, the next step was to browse those pages to isolate each toy-specific informations such as names and prices. Once again I inspected html code in order to determine the corresponding XPath selector.

![RM_ToySection](/medias/RM_ToySection.png)

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

![RM_ProductPage](/medias/RM_ProductPage.png)

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

![RM_ScrapingTree](/medias/RM_ScrapingTree.png)

>### 3. Limitations
However, I assume that this method may have some defaults.
>#### Observations
* In fact, when checking briefly the *DB.csv* file, I noticed that some entries appeared 2, 3 or even 4 times. And what's even more intriguing is that there are some sequences of entries that are repeating themselves. From there, I began to think about the possible reasons for that. 
  * First, it could be the structure of the internal database of the website that's containing several times the same entries. In this case I can't do anything but taking them in consideration or filtering them using their internal reference.
  * The second reason is much less pleasant because it would be due to a problem in my scraping method. In fact, because I'm navigating between pages using only their urls, there could be issues with the order objects are given. If this order isn't fixed, it is possible that it changes between each page and this would explain why I've got several times the same entries or sequences. In this case, A much more important issue is that I'm probably missing some entries.
* Another thing that I noticed is that I was only focusing on available toys. Therefore, I was missing a huge part of the database.




>#### Tests
In order to verify my assumptions, I decided to build a quite simply test. The idea was to scrap the website a second time (without images for memory reasons) and to compare both databases to see if the entries were the same.

Unfortunately, I saw quite quickly that the two resulting databases were different. This could be due to my problem but it also could be due to a database update in between (a week passed between both and like I mentioned before, I was only focusing on availbale toys) but it's more likely to be due to my problem.

>#### Solutions
Therefore I searched some solutions in order to solve this issue and the first one that came to me is to force the ordering of the entries in an alphabetic order for instance (add ***sortBy-23=title.asc*** in the url). What's more, I found how to get all of the toys and not only the available ones (I had to change the *webStoreStockFilter* value to **0** in the url). Therefore I decided to scrap the website again applying this modification.

With this modifications, both problems mentioned above seemed to disapear!
>## B. Database

>### 1. Properties

**Total size = 8.3Go**  
**178,872 elements** including **178,860 images**

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
    │   └── log_11042020_013234.txt
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

>### 2. Reorganization

At the end of the scraping, I had to reorganize the database for it to be clearer and to get coherence between datas.

I did it in [*modifyCSV_LGR.js*](./modifyCSV_LGR.js).
*(I also used some find/replace manipulations to solve some interpretation issues due to some particular values in the csv file)*


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
|0             |"AB LUDIS"   |
|1             |"ABY SMILE"  |
|2             |"ABY STYLE"  |
|...           |...          |
|177           |"None"       |
|...           |...          |

* **Database table**

|        |    id    |   nom    |  genre   | prix *(€)* | description | securite | codeInterne | codeEAN  | referenceFabricant | ageMin *(années)*| categorie_id | longueur *(cm)* | largeur *(cm)* | hauteur *(cm)* | poids *(kg)* | marque_id |
|:------:|:--------:|:--------:|:--------:|:----------:|:-----------:|:--------:|:-----------:|:--------:|:------------------:|:----------------:|:------------:|:---------------:|:--------------:|:--------------:|:------------:|:---------:|
|**type**| *string* | *string* | *string* |  *float*   |  *string*   | *string* |    *int*    | *string* |     *string*       |     *float*      |    *int*     |     *float*     |    *float*     |    *float*     |   *float*    |   *int*   |
 

**id** is created by concatenating the ***gender*** of the product and its ***indice*** among all product of this gender.  
*e.g.* ```Boy217```
