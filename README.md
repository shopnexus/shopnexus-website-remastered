# shopnexus-website-remastered

## Epic features

### 1. Epic features with Tanstack Query

Now tanstack query not only for:

- Fetch data
- Mutate data
- Infinite query
- Invalidate data (best 🤯🤯🤯)
- Optimistic update (best 🤯🤯🤯)

But also for:

- Server side rendering -> hide most of initial requests when first load the page

Note: Our server have each entity in different endpoints so it is best fit for invalidating data and doing optimistic update. 🤑🤑

## My code, my rules

### Domain model

- All domain model is on src/core/<entity>/...
- src/core/<entity>/<entity>.api.ts is the API calling function
- src/core/<entity>/<entity>.type.ts is the type of the API response (domain model type)
- src/core/<entity>/<entity>.query.ts is the query function (@tanstack/react-query)

### Ack

## Develop Timeline
