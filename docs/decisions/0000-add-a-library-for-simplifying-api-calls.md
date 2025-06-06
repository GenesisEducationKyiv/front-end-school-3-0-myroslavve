# ADR 0000: Add a Library for Simplifying API Calls

The project currently contains significant code duplication in its API call implementations. This redundancy impacts development velocity when implementing new features and complicates maintenance when modifying existing functionality. Additionally, the project requires advanced features like caching and optimistic updates. To address these concerns, we have decided to integrate a library that streamlines API call management.

## Decision

We will implement TanStack Query in the project.

## Rationale

Considerations:
* axios
* TanStack query
* useSWR
* Don't change (find a way to simplify without adding a dependency)

Decided to add a library, since the cost of implementing a custom solution would be higher than the cost of adding a dependency.

We decided to use TanStack Query due to its superior feature set compared to Axios, including advanced caching, stale-while-revalidate and optimistic updates. Another advantage of TanStack, is that it fits with existing infrastructure in this project, due to it allowing to pass a custom fetch function to the query client. Additionally, TanStack Query provides more granular control over cache revalidation compared to useSWR, allowing us to better optimize our application's performance and user experience.

## Status

Proposed

## Consequences

### Positive

* Improved maintainability of API calls
* Automatic caching, revalidation and error handling

### Negative

* Less control over API calls
* Bigger bundle size
* Coupling with TanStack Query (most of its features won't be necessary in this project, but we will still depend on those)