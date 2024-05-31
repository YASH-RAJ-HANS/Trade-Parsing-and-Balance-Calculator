# Trade Parsing and Balance Calculator

This is a server-side application built with Node.js and MongoDB that parses cryptocurrency trade data from a CSV file and stores it in a database. It also provides an API to retrieve asset-wise balances of the account at any given timestamp.

## Features

### 1. Trade Data Parsing and Storage

- **Description**: This feature implements an API that accepts a CSV file as input, parses the trade data present in it, and stores it in a MongoDB database.
- **Input**: A CSV file containing cryptocurrency trade details, with columns for UTC time, operation (buy/sell), market, buy/sell amount, and price.
- **Database Schema**: The trade data is stored in a MongoDB database with a well-designed schema to accommodate the necessary information.
- **Assumptions**: All trades belong to the same account.

### 2. Asset-wise Balance Retrieval

- **Description**: This feature implements an API that retrieves the asset-wise balance of the account at any given timestamp.
- **Input**: A JSON body containing the `timestamp` in the format `"YYYY-MM-DD HH:mm:ss"`.
- **Output**: A JSON object with asset names as keys and their corresponding balances as values, based on the trades that occurred before the given timestamp.
- **Example**:
 - Input: `{ "timestamp": "2022-09-28 12:00:00" }`
 - Output: `{ "BTC": 15, "MATIC": 100 }`


## Getting Started

1. Clone the repository: `https://github.com/sahilarora02/KoinX_Assignment`
2. Install dependencies: `npm install`
3. Set up the MongoDB connection (locally or with a hosted service).
4. Start the server: `npm start`

## Contact

If you have any questions or suggestions, feel free to reach out to [sahilaroraji2002@gmail.com].
