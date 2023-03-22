module.exports = {
  "root": true,
  "parserOptions": {
    "ecmaVersion": "latest",
  },
  "env": {
    "browser": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "max-len": [
      "warn",
      {
        "code": 80,
        "comments": 100,
        "ignoreComments": true,
        "ignoreTrailingComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }
    ],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-shadow': 'off',
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
  }
}
