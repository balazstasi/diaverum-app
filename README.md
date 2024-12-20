# Diaverum Lab Results Parser

This is a task for my Senior Software Engineer position at Diaverum.

## Task

Attached you can find a flat file with lab results, one test result in each line. The first line is a header with the names of the data fields. The pipe character (‘|’) is used as delimiter.

In a programming language/environment of your choice, write a parser that takes a string with the flat file text input and populates a data object that wraps the data fields and values. You can then store the data in a database and/or display it in a webpage.

## Installation

```bash
bun install
bun dev
```

## Usage

1. Upload a .txt file with the lab results (can be found in the `./inputs` folder)
2. See the results in the UI
   Note: The first is a correct input with correct entries, the rest is edge case / error behaviour testing
