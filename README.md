# Bitcoin expenses calculator


## What is this? 

A simple proof of concept for an expense calculator as described (here)[https://gist.github.com/Dania02525/4e3e9516fb595008ac4ebd9d35db342e]

## What does it look like

You can see if for yourself at https://expensatron.gustavo.is

## How do I run this?

locally: 
  1. `yarn && yarn dev`

deploy the site from command line:
  1. From command line:
     1. install vercel cli `npm i -g vercel`
     2. deploy to production: `vercel --prod`
     3. deploy a stage: `vercel`
  2. Or simply commit to main (production) or a branch (staging)

This solution is mobile-ready and fully keyboard accessible ❤️

## Considerations

Thinking through the possible scenarios that Jeff could use this expense calculator for, I concentrated on the following ones:

1. Jeff needs help thinking through the way he spends money in order to make better spending decisions so he can manage his budget.
2. Jeff needs a tool that can help him track and report expenses that will be paid with future income (such as expense reporting to his company for example)

The distiction between these two scenarios is suble but fundamental. Either Jeff thinks of his expenses as coming ut of his next paycheck (as it would be in an expense report) or he thinks of his expenses as coming from his previous income (his current crypto wallet balance).

__This distiction is salient due to bitcoin price volatility__

On the first scenario, the spent amount is converted to bitcoin based on the **date of purchase**. On the second scenario, the expense should be converted to bitcoin at the **current market price**. 

Given that at this stage of development Jeff probably doesn't even know what he needs, my solutions covers both scenarios via the settings menu. This way he can feel out the best direction to take.

![alt text](https://user-images.githubusercontent.com/51838513/128639931-284c183a-a43d-464a-a2d0-76e9f378c77f.png)

### Scenario 1. Using bitcoin price at the time of purchase.

The requirement to provide a solution in this case is that we know when the given expense was incurred. I added an input for 'Date' for every expense.

When a user adds an expense, we look at the date of the expense and pull the closing price of bitcoin on that day from the free [coindesk api](https://api.coindesk.com/v1/bpi/historical/close.json?start=2020-08-07&end=2020-08-07). 

We calculate the btc total and save it as part of the expense. __this happens every time you add or edit an expense even when your settings use current market price__

### Scenario 2. Current market price.

For this, we use the provided blockchain.info api endpoint. We poll for the current price of **one bitcoin** at the interval requested by the user and save it as a context value available at any time. __this polling stops whenever the user's settings are set to time of purchase__

__Design consideration__: This allows us to calculate all the prices for all the expenses (and the total sum) by doing one request every 10, 30, or 60 seconds, otherwise we would have to make one request per expense.

## General discussion topics

1. Handling of amounts and risk of loss when converting currencies.
2. How we calculate the price of 1 bitcoin.
3. Robustness concerns due to server conditions and mitigating strategies. Currently if a server goes down, we use the last known price of bitcoin, but the second scenario is broken if we can't pull the historic price of bitcoin.
4. This proof of concept's persistent storage is simulated by saving data (unencrypted) in localstorage. For production we'd need to think through encryption options for local and server data, and keep as little as possible (if any) in localstorage
5. Scaling: ideally I'd like to add analytics to measure how many api calls we are making, this would help us realize any future scalability issues as we have multiple clients polling for bitcoin prices. 

## Possible improvements

1. Filtering system: a text input at the top of the list that filters the list as you type, updating the totals. (use case: I want to see how much I spent at amazon).
2. Sorting mechanism for expense list.
3. Better error reporting to the user (via a toast system)
4. User can add receipt images with the expense
5. Use OCR on the receipt image to prepopulate the add expense form.
6. user can print (or email) the expense list as an expense report.
7. user can track up or down % spent month-to-month (You've spent 30% more than last month.
8. Proper server/database backend.
9. in-app User feedback bug/reporting mechanism.
10. Log in/user accounts.
11. Trend Graphs!
12. Manual btc price entry (for an offline mode)

## Goals as this moves closer to production

1. Unit, integration and e2e tests. Following this principle)[https://kentcdodds.com/blog/write-tests]
2. CI/CD
3. Error reporting via Sentry or similar API
4. Make this fully accessible by adding full screen reader support. (add accessibilty checks via CI/CD)

## Screenshots

![alt text](https://user-images.githubusercontent.com/51838513/128644879-6754f2ef-6c68-45d0-9d72-eace5e0e5086.png)
