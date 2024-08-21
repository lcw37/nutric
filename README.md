# <span style="color:rgb(5 150 105)">nutric</span>

Quick and easy calorie/macro estimates for your meals. 

<span style="color:rgb(5 150 105)">**nutric**</span> creates estimates from a description of a meal or the recipe url, then you can save to your daily log.

## Table of Contents

- [Site Structure](#structure)

## Site Structure

```
/                       calculator
/handler
|   /sign-up            sign up for an account
|   /sign-in            log in
|   /account-settings   account settings

(if logged in) 
/log                    daily logs
|   /edit/{id}          edit entry {id}   
```