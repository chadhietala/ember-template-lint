'use strict';

/*
 Disallows unused block params

  Good:

  ```
  {{#each users as |user|}}
    {{user.name}}
  {{/each}}
  ```

  Good:

  ```
  {{#each users as |user index|}}
    {{index}} {{user.name}}
  {{/each}}
  ```

  Good:

  ```
  {{#each users as |user index|}}
    {{index}}
  {{/each}}
  ```

  Bad:

  ```
  {{#each users as |user index|}}
    {{user.name}}
  {{/each}}
  ```

  The following values are valid configuration:

    * boolean -- `true` for enabled / `false` for disabled
*/

const Rule = require('./base');

module.exports = class NoUnusedBlockParams extends Rule {
  visitor() {
    return {
      Block: {
        exit(node) {
          let unusedLocal = this.scope.frameHasUnusedBlockParams();
          if (unusedLocal) {
            this.log({
              message: `'${unusedLocal}' is defined but never used`,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        },
      },

      ElementNode: {
        keys: {
          children: {
            exit(node) {
              let unusedLocal = this.scope.frameHasUnusedBlockParams();
              if (unusedLocal) {
                this.log({
                  message: `'${unusedLocal}' is defined but never used`,
                  line: node.loc && node.loc.start.line,
                  column: node.loc && node.loc.start.column,
                  source: this.sourceForNode(node),
                });
              }
            },
          },
        },
      },

      MustacheStatement(node) {
        if (node.path.original === 'partial') {
          this.scope.usePartial();
        }
      },
    };
  }
};
