import {CommandContext, Context} from "grammy";

/**
 * RequireParamDecorator
 *
 * A method decorator factory that validates the presence of a parameter in a command.
 * This decorator checks if the Telegram command context contains a match (parameter),
 * and if not present, replies to the user with a message requesting the parameter.
 *
 * This decorator is typically used with grammy bot command handlers to enforce
 * that certain commands receive required arguments/parameters.
 *
 * @param {string} paramName - The name of the parameter being required. This name is
 *                             used in the error message shown to the user when the
 *                             parameter is missing (e.g., "Preciso que você informe o [paramName]")
 *
 * @returns {Function} A decorator function that wraps the target method with parameter validation
 *
 * @example
 * // Usage in a grammy bot command handler:
 * @RequireParamDecorator('group name')
 * async handleGroupCommand(ctx: CommandContext<Context>) {
 *   // This method will only execute if ctx.match is present
 *   const groupName = ctx.match;
 *   // ... process the group name
 * }
 */
export function RequireParamDecorator(paramName: string): Function {
  return function (_: any, __: any, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const ctx: CommandContext<Context> = args[0];
      if (!ctx.match) {
        ctx.reply(`Preciso que você informe o ${paramName}`);
        return;
      }

      return originalMethod.apply(this, args);
    };
  }
}