
# Automated Unit Test Generation

This application generates automatically unit tests. It's aim is to get 100% line coverage but not 100% test coverage.

Current version only works with functions which have basic if-else structure. Anything more complex will not work. This is a proof of concept level application.


## Setup, Running and Testing

Application is based on [Node.js](https://nodejs.org/). Install it before proceeding.

```bash
# Install
npm install

# Run
npm start target.js

# Example usage
npm start test/cases/pick-one.js
npm start test/cases/sum.js

# Test project
npm test
```


## The purpose of tests

[TDD saves resources](https://www.computer.org/csdl/mags/so/2007/03/s3024.pdf) and:

  1. Design aid: Writing tests first gives you a clearer perspective on the ideal API design.
  2. Feature documentation (for developers): Test descriptions enshrine in code every implemented feature requirement.
  3. Test your developer understanding: Does the developer understand the problem enough to articulate in code all critical component requirements?
  4. Quality Assurance: Manual QA is error prone. In my experience, it’s impossible for a developer to remember all features that need testing after making a change to refactor, add new features, or remove features.
  5. Continuous Delivery Aid: Automated QA affords the opportunity to automatically prevent broken builds from being deployed to production.

Source: [Why Bother with Test Discipline?](https://medium.com/javascript-scene/what-every-unit-test-needs-f6cd34d9836d)

## Design Decisions

These aspects greatly affect test generation performance and results:
  1. Scoring function which directs the evolution of the genomes.
  2. Meta nucleotide treshold.
  3. Time allocated to mutations.
  4. Gradien descent part for amplitude change of mutations over iterations and amount of genomes to choose from.

Speeding up factors
  * Befeficially precalculated starting set
  * Different agent programs for different type of modules

Terms
  * A genome is full set of genetic material and is formed by genes. Our genome set is all the possible test cases that could be generated.
  * A gene is a part of genome and defines a unit of heredity. For us a gene represents a test case.
  * A nucleotide is a building block of a gene. Our genes are comprised from numbers and a nucleotide is one of those numbers.

### Scoring

"As a general rule, it is bretter to design performance measures according to what one actually wants in the environment, rather than how one thinks the agent should behave." (Machine Learning - the Third Edition, Russel & Norvig 2010, page. 37)

In simple version it seems to be enought to follow the amount of lines getting covered. A good addition would be the amount of test cases required to get the current result. Less cases would increase the bonus. And the result would aim to get high line coverage with less test cases.

```js
// file: src/scoring.js

function score(stats) {
  return stats.visited.length * 10000;
}
```

### Meta Nucleotide

For a test case there are three kinds of nucleotides:

1. Is a gene active? If it is, print the related test case. If not, do not include the test in the test file. This is meta nucleotide.
2. Type of a parameter. Only basic types for now: uint, small int, int, double, string, bool and null.
3. The value of the previously described type.

The gene structure could be for a two parameter function:

```js
// The first is for activation.
// From the second to the last there are type and value pairs.
// All the values are in one array for the sake of performance and mutation handling.

[0.5, 0.1, 0.4, 0.2, 0.9]
```

There are double amount of possible genes than there are branches in the application. And activation value is for reducing the amount of resulting test cases to bare minimum.

```js
// file: src/data-adapter.js
// The treshold of gene activation.

const isActive = data[0] > 0.3;
```

### Amplitude change

```js
// file: src/case.js
// Per iteration step
amplitude -= 0.001;
if (amplitude < 0.1) amplitude = 0.3;
```
