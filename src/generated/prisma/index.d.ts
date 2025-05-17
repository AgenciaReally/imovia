
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TipoImovel
 * 
 */
export type TipoImovel = $Result.DefaultSelection<Prisma.$TipoImovelPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Construtora
 * 
 */
export type Construtora = $Result.DefaultSelection<Prisma.$ConstrutoraPayload>
/**
 * Model Imovel
 * 
 */
export type Imovel = $Result.DefaultSelection<Prisma.$ImovelPayload>
/**
 * Model Pergunta
 * 
 */
export type Pergunta = $Result.DefaultSelection<Prisma.$PerguntaPayload>
/**
 * Model Resposta
 * 
 */
export type Resposta = $Result.DefaultSelection<Prisma.$RespostaPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model Relatorio
 * 
 */
export type Relatorio = $Result.DefaultSelection<Prisma.$RelatorioPayload>
/**
 * Model Configuracao
 * 
 */
export type Configuracao = $Result.DefaultSelection<Prisma.$ConfiguracaoPayload>
/**
 * Model LogIntegracao
 * 
 */
export type LogIntegracao = $Result.DefaultSelection<Prisma.$LogIntegracaoPayload>
/**
 * Model ImovelMetadata
 * 
 */
export type ImovelMetadata = $Result.DefaultSelection<Prisma.$ImovelMetadataPayload>
/**
 * Model ImovelPergunta
 * 
 */
export type ImovelPergunta = $Result.DefaultSelection<Prisma.$ImovelPerguntaPayload>
/**
 * Model MensagemContato
 * 
 */
export type MensagemContato = $Result.DefaultSelection<Prisma.$MensagemContatoPayload>
/**
 * Model AIConversation
 * 
 */
export type AIConversation = $Result.DefaultSelection<Prisma.$AIConversationPayload>
/**
 * Model AIActionHistory
 * 
 */
export type AIActionHistory = $Result.DefaultSelection<Prisma.$AIActionHistoryPayload>
/**
 * Model AIConfig
 * 
 */
export type AIConfig = $Result.DefaultSelection<Prisma.$AIConfigPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  CONSTRUTORA: 'CONSTRUTORA',
  CLIENTE: 'CLIENTE'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TipoImovels
 * const tipoImovels = await prisma.tipoImovel.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TipoImovels
   * const tipoImovels = await prisma.tipoImovel.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tipoImovel`: Exposes CRUD operations for the **TipoImovel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TipoImovels
    * const tipoImovels = await prisma.tipoImovel.findMany()
    * ```
    */
  get tipoImovel(): Prisma.TipoImovelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.construtora`: Exposes CRUD operations for the **Construtora** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Construtoras
    * const construtoras = await prisma.construtora.findMany()
    * ```
    */
  get construtora(): Prisma.ConstrutoraDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imovel`: Exposes CRUD operations for the **Imovel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Imovels
    * const imovels = await prisma.imovel.findMany()
    * ```
    */
  get imovel(): Prisma.ImovelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pergunta`: Exposes CRUD operations for the **Pergunta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Perguntas
    * const perguntas = await prisma.pergunta.findMany()
    * ```
    */
  get pergunta(): Prisma.PerguntaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resposta`: Exposes CRUD operations for the **Resposta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Respostas
    * const respostas = await prisma.resposta.findMany()
    * ```
    */
  get resposta(): Prisma.RespostaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.relatorio`: Exposes CRUD operations for the **Relatorio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Relatorios
    * const relatorios = await prisma.relatorio.findMany()
    * ```
    */
  get relatorio(): Prisma.RelatorioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.configuracao`: Exposes CRUD operations for the **Configuracao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Configuracaos
    * const configuracaos = await prisma.configuracao.findMany()
    * ```
    */
  get configuracao(): Prisma.ConfiguracaoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.logIntegracao`: Exposes CRUD operations for the **LogIntegracao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LogIntegracaos
    * const logIntegracaos = await prisma.logIntegracao.findMany()
    * ```
    */
  get logIntegracao(): Prisma.LogIntegracaoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imovelMetadata`: Exposes CRUD operations for the **ImovelMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImovelMetadata
    * const imovelMetadata = await prisma.imovelMetadata.findMany()
    * ```
    */
  get imovelMetadata(): Prisma.ImovelMetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imovelPergunta`: Exposes CRUD operations for the **ImovelPergunta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImovelPerguntas
    * const imovelPerguntas = await prisma.imovelPergunta.findMany()
    * ```
    */
  get imovelPergunta(): Prisma.ImovelPerguntaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mensagemContato`: Exposes CRUD operations for the **MensagemContato** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MensagemContatoes
    * const mensagemContatoes = await prisma.mensagemContato.findMany()
    * ```
    */
  get mensagemContato(): Prisma.MensagemContatoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aIConversation`: Exposes CRUD operations for the **AIConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AIConversations
    * const aIConversations = await prisma.aIConversation.findMany()
    * ```
    */
  get aIConversation(): Prisma.AIConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aIActionHistory`: Exposes CRUD operations for the **AIActionHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AIActionHistories
    * const aIActionHistories = await prisma.aIActionHistory.findMany()
    * ```
    */
  get aIActionHistory(): Prisma.AIActionHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aIConfig`: Exposes CRUD operations for the **AIConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AIConfigs
    * const aIConfigs = await prisma.aIConfig.findMany()
    * ```
    */
  get aIConfig(): Prisma.AIConfigDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.0
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TipoImovel: 'TipoImovel',
    User: 'User',
    Construtora: 'Construtora',
    Imovel: 'Imovel',
    Pergunta: 'Pergunta',
    Resposta: 'Resposta',
    Match: 'Match',
    Relatorio: 'Relatorio',
    Configuracao: 'Configuracao',
    LogIntegracao: 'LogIntegracao',
    ImovelMetadata: 'ImovelMetadata',
    ImovelPergunta: 'ImovelPergunta',
    MensagemContato: 'MensagemContato',
    AIConversation: 'AIConversation',
    AIActionHistory: 'AIActionHistory',
    AIConfig: 'AIConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tipoImovel" | "user" | "construtora" | "imovel" | "pergunta" | "resposta" | "match" | "relatorio" | "configuracao" | "logIntegracao" | "imovelMetadata" | "imovelPergunta" | "mensagemContato" | "aIConversation" | "aIActionHistory" | "aIConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TipoImovel: {
        payload: Prisma.$TipoImovelPayload<ExtArgs>
        fields: Prisma.TipoImovelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TipoImovelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TipoImovelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>
          }
          findFirst: {
            args: Prisma.TipoImovelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TipoImovelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>
          }
          findMany: {
            args: Prisma.TipoImovelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>[]
          }
          create: {
            args: Prisma.TipoImovelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>
          }
          createMany: {
            args: Prisma.TipoImovelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TipoImovelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>[]
          }
          delete: {
            args: Prisma.TipoImovelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>
          }
          update: {
            args: Prisma.TipoImovelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>
          }
          deleteMany: {
            args: Prisma.TipoImovelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TipoImovelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TipoImovelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>[]
          }
          upsert: {
            args: Prisma.TipoImovelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoImovelPayload>
          }
          aggregate: {
            args: Prisma.TipoImovelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTipoImovel>
          }
          groupBy: {
            args: Prisma.TipoImovelGroupByArgs<ExtArgs>
            result: $Utils.Optional<TipoImovelGroupByOutputType>[]
          }
          count: {
            args: Prisma.TipoImovelCountArgs<ExtArgs>
            result: $Utils.Optional<TipoImovelCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Construtora: {
        payload: Prisma.$ConstrutoraPayload<ExtArgs>
        fields: Prisma.ConstrutoraFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConstrutoraFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConstrutoraFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>
          }
          findFirst: {
            args: Prisma.ConstrutoraFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConstrutoraFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>
          }
          findMany: {
            args: Prisma.ConstrutoraFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>[]
          }
          create: {
            args: Prisma.ConstrutoraCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>
          }
          createMany: {
            args: Prisma.ConstrutoraCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConstrutoraCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>[]
          }
          delete: {
            args: Prisma.ConstrutoraDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>
          }
          update: {
            args: Prisma.ConstrutoraUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>
          }
          deleteMany: {
            args: Prisma.ConstrutoraDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConstrutoraUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConstrutoraUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>[]
          }
          upsert: {
            args: Prisma.ConstrutoraUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConstrutoraPayload>
          }
          aggregate: {
            args: Prisma.ConstrutoraAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConstrutora>
          }
          groupBy: {
            args: Prisma.ConstrutoraGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConstrutoraGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConstrutoraCountArgs<ExtArgs>
            result: $Utils.Optional<ConstrutoraCountAggregateOutputType> | number
          }
        }
      }
      Imovel: {
        payload: Prisma.$ImovelPayload<ExtArgs>
        fields: Prisma.ImovelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImovelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImovelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>
          }
          findFirst: {
            args: Prisma.ImovelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImovelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>
          }
          findMany: {
            args: Prisma.ImovelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>[]
          }
          create: {
            args: Prisma.ImovelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>
          }
          createMany: {
            args: Prisma.ImovelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImovelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>[]
          }
          delete: {
            args: Prisma.ImovelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>
          }
          update: {
            args: Prisma.ImovelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>
          }
          deleteMany: {
            args: Prisma.ImovelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImovelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImovelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>[]
          }
          upsert: {
            args: Prisma.ImovelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPayload>
          }
          aggregate: {
            args: Prisma.ImovelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImovel>
          }
          groupBy: {
            args: Prisma.ImovelGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImovelGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImovelCountArgs<ExtArgs>
            result: $Utils.Optional<ImovelCountAggregateOutputType> | number
          }
        }
      }
      Pergunta: {
        payload: Prisma.$PerguntaPayload<ExtArgs>
        fields: Prisma.PerguntaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PerguntaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PerguntaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          findFirst: {
            args: Prisma.PerguntaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PerguntaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          findMany: {
            args: Prisma.PerguntaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>[]
          }
          create: {
            args: Prisma.PerguntaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          createMany: {
            args: Prisma.PerguntaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PerguntaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>[]
          }
          delete: {
            args: Prisma.PerguntaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          update: {
            args: Prisma.PerguntaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          deleteMany: {
            args: Prisma.PerguntaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PerguntaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PerguntaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>[]
          }
          upsert: {
            args: Prisma.PerguntaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          aggregate: {
            args: Prisma.PerguntaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePergunta>
          }
          groupBy: {
            args: Prisma.PerguntaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PerguntaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PerguntaCountArgs<ExtArgs>
            result: $Utils.Optional<PerguntaCountAggregateOutputType> | number
          }
        }
      }
      Resposta: {
        payload: Prisma.$RespostaPayload<ExtArgs>
        fields: Prisma.RespostaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RespostaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RespostaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          findFirst: {
            args: Prisma.RespostaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RespostaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          findMany: {
            args: Prisma.RespostaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          create: {
            args: Prisma.RespostaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          createMany: {
            args: Prisma.RespostaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RespostaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          delete: {
            args: Prisma.RespostaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          update: {
            args: Prisma.RespostaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          deleteMany: {
            args: Prisma.RespostaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RespostaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RespostaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          upsert: {
            args: Prisma.RespostaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          aggregate: {
            args: Prisma.RespostaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResposta>
          }
          groupBy: {
            args: Prisma.RespostaGroupByArgs<ExtArgs>
            result: $Utils.Optional<RespostaGroupByOutputType>[]
          }
          count: {
            args: Prisma.RespostaCountArgs<ExtArgs>
            result: $Utils.Optional<RespostaCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      Relatorio: {
        payload: Prisma.$RelatorioPayload<ExtArgs>
        fields: Prisma.RelatorioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RelatorioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RelatorioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>
          }
          findFirst: {
            args: Prisma.RelatorioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RelatorioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>
          }
          findMany: {
            args: Prisma.RelatorioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>[]
          }
          create: {
            args: Prisma.RelatorioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>
          }
          createMany: {
            args: Prisma.RelatorioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RelatorioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>[]
          }
          delete: {
            args: Prisma.RelatorioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>
          }
          update: {
            args: Prisma.RelatorioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>
          }
          deleteMany: {
            args: Prisma.RelatorioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RelatorioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RelatorioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>[]
          }
          upsert: {
            args: Prisma.RelatorioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelatorioPayload>
          }
          aggregate: {
            args: Prisma.RelatorioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelatorio>
          }
          groupBy: {
            args: Prisma.RelatorioGroupByArgs<ExtArgs>
            result: $Utils.Optional<RelatorioGroupByOutputType>[]
          }
          count: {
            args: Prisma.RelatorioCountArgs<ExtArgs>
            result: $Utils.Optional<RelatorioCountAggregateOutputType> | number
          }
        }
      }
      Configuracao: {
        payload: Prisma.$ConfiguracaoPayload<ExtArgs>
        fields: Prisma.ConfiguracaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfiguracaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfiguracaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>
          }
          findFirst: {
            args: Prisma.ConfiguracaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfiguracaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>
          }
          findMany: {
            args: Prisma.ConfiguracaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>[]
          }
          create: {
            args: Prisma.ConfiguracaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>
          }
          createMany: {
            args: Prisma.ConfiguracaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfiguracaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>[]
          }
          delete: {
            args: Prisma.ConfiguracaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>
          }
          update: {
            args: Prisma.ConfiguracaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>
          }
          deleteMany: {
            args: Prisma.ConfiguracaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfiguracaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfiguracaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>[]
          }
          upsert: {
            args: Prisma.ConfiguracaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoPayload>
          }
          aggregate: {
            args: Prisma.ConfiguracaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfiguracao>
          }
          groupBy: {
            args: Prisma.ConfiguracaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfiguracaoCountArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracaoCountAggregateOutputType> | number
          }
        }
      }
      LogIntegracao: {
        payload: Prisma.$LogIntegracaoPayload<ExtArgs>
        fields: Prisma.LogIntegracaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LogIntegracaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LogIntegracaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>
          }
          findFirst: {
            args: Prisma.LogIntegracaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LogIntegracaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>
          }
          findMany: {
            args: Prisma.LogIntegracaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>[]
          }
          create: {
            args: Prisma.LogIntegracaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>
          }
          createMany: {
            args: Prisma.LogIntegracaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LogIntegracaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>[]
          }
          delete: {
            args: Prisma.LogIntegracaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>
          }
          update: {
            args: Prisma.LogIntegracaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>
          }
          deleteMany: {
            args: Prisma.LogIntegracaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LogIntegracaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LogIntegracaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>[]
          }
          upsert: {
            args: Prisma.LogIntegracaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogIntegracaoPayload>
          }
          aggregate: {
            args: Prisma.LogIntegracaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLogIntegracao>
          }
          groupBy: {
            args: Prisma.LogIntegracaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<LogIntegracaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.LogIntegracaoCountArgs<ExtArgs>
            result: $Utils.Optional<LogIntegracaoCountAggregateOutputType> | number
          }
        }
      }
      ImovelMetadata: {
        payload: Prisma.$ImovelMetadataPayload<ExtArgs>
        fields: Prisma.ImovelMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImovelMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImovelMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>
          }
          findFirst: {
            args: Prisma.ImovelMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImovelMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>
          }
          findMany: {
            args: Prisma.ImovelMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>[]
          }
          create: {
            args: Prisma.ImovelMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>
          }
          createMany: {
            args: Prisma.ImovelMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImovelMetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>[]
          }
          delete: {
            args: Prisma.ImovelMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>
          }
          update: {
            args: Prisma.ImovelMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>
          }
          deleteMany: {
            args: Prisma.ImovelMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImovelMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImovelMetadataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>[]
          }
          upsert: {
            args: Prisma.ImovelMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelMetadataPayload>
          }
          aggregate: {
            args: Prisma.ImovelMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImovelMetadata>
          }
          groupBy: {
            args: Prisma.ImovelMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImovelMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImovelMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<ImovelMetadataCountAggregateOutputType> | number
          }
        }
      }
      ImovelPergunta: {
        payload: Prisma.$ImovelPerguntaPayload<ExtArgs>
        fields: Prisma.ImovelPerguntaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImovelPerguntaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImovelPerguntaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>
          }
          findFirst: {
            args: Prisma.ImovelPerguntaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImovelPerguntaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>
          }
          findMany: {
            args: Prisma.ImovelPerguntaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>[]
          }
          create: {
            args: Prisma.ImovelPerguntaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>
          }
          createMany: {
            args: Prisma.ImovelPerguntaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImovelPerguntaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>[]
          }
          delete: {
            args: Prisma.ImovelPerguntaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>
          }
          update: {
            args: Prisma.ImovelPerguntaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>
          }
          deleteMany: {
            args: Prisma.ImovelPerguntaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImovelPerguntaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImovelPerguntaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>[]
          }
          upsert: {
            args: Prisma.ImovelPerguntaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImovelPerguntaPayload>
          }
          aggregate: {
            args: Prisma.ImovelPerguntaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImovelPergunta>
          }
          groupBy: {
            args: Prisma.ImovelPerguntaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImovelPerguntaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImovelPerguntaCountArgs<ExtArgs>
            result: $Utils.Optional<ImovelPerguntaCountAggregateOutputType> | number
          }
        }
      }
      MensagemContato: {
        payload: Prisma.$MensagemContatoPayload<ExtArgs>
        fields: Prisma.MensagemContatoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MensagemContatoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MensagemContatoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>
          }
          findFirst: {
            args: Prisma.MensagemContatoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MensagemContatoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>
          }
          findMany: {
            args: Prisma.MensagemContatoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>[]
          }
          create: {
            args: Prisma.MensagemContatoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>
          }
          createMany: {
            args: Prisma.MensagemContatoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MensagemContatoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>[]
          }
          delete: {
            args: Prisma.MensagemContatoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>
          }
          update: {
            args: Prisma.MensagemContatoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>
          }
          deleteMany: {
            args: Prisma.MensagemContatoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MensagemContatoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MensagemContatoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>[]
          }
          upsert: {
            args: Prisma.MensagemContatoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MensagemContatoPayload>
          }
          aggregate: {
            args: Prisma.MensagemContatoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMensagemContato>
          }
          groupBy: {
            args: Prisma.MensagemContatoGroupByArgs<ExtArgs>
            result: $Utils.Optional<MensagemContatoGroupByOutputType>[]
          }
          count: {
            args: Prisma.MensagemContatoCountArgs<ExtArgs>
            result: $Utils.Optional<MensagemContatoCountAggregateOutputType> | number
          }
        }
      }
      AIConversation: {
        payload: Prisma.$AIConversationPayload<ExtArgs>
        fields: Prisma.AIConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AIConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AIConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>
          }
          findFirst: {
            args: Prisma.AIConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AIConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>
          }
          findMany: {
            args: Prisma.AIConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>[]
          }
          create: {
            args: Prisma.AIConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>
          }
          createMany: {
            args: Prisma.AIConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AIConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>[]
          }
          delete: {
            args: Prisma.AIConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>
          }
          update: {
            args: Prisma.AIConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>
          }
          deleteMany: {
            args: Prisma.AIConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AIConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AIConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>[]
          }
          upsert: {
            args: Prisma.AIConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConversationPayload>
          }
          aggregate: {
            args: Prisma.AIConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAIConversation>
          }
          groupBy: {
            args: Prisma.AIConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AIConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AIConversationCountArgs<ExtArgs>
            result: $Utils.Optional<AIConversationCountAggregateOutputType> | number
          }
        }
      }
      AIActionHistory: {
        payload: Prisma.$AIActionHistoryPayload<ExtArgs>
        fields: Prisma.AIActionHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AIActionHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AIActionHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>
          }
          findFirst: {
            args: Prisma.AIActionHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AIActionHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>
          }
          findMany: {
            args: Prisma.AIActionHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>[]
          }
          create: {
            args: Prisma.AIActionHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>
          }
          createMany: {
            args: Prisma.AIActionHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AIActionHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>[]
          }
          delete: {
            args: Prisma.AIActionHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>
          }
          update: {
            args: Prisma.AIActionHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>
          }
          deleteMany: {
            args: Prisma.AIActionHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AIActionHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AIActionHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>[]
          }
          upsert: {
            args: Prisma.AIActionHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIActionHistoryPayload>
          }
          aggregate: {
            args: Prisma.AIActionHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAIActionHistory>
          }
          groupBy: {
            args: Prisma.AIActionHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<AIActionHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.AIActionHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<AIActionHistoryCountAggregateOutputType> | number
          }
        }
      }
      AIConfig: {
        payload: Prisma.$AIConfigPayload<ExtArgs>
        fields: Prisma.AIConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AIConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AIConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>
          }
          findFirst: {
            args: Prisma.AIConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AIConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>
          }
          findMany: {
            args: Prisma.AIConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>[]
          }
          create: {
            args: Prisma.AIConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>
          }
          createMany: {
            args: Prisma.AIConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AIConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>[]
          }
          delete: {
            args: Prisma.AIConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>
          }
          update: {
            args: Prisma.AIConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>
          }
          deleteMany: {
            args: Prisma.AIConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AIConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AIConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>[]
          }
          upsert: {
            args: Prisma.AIConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIConfigPayload>
          }
          aggregate: {
            args: Prisma.AIConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAIConfig>
          }
          groupBy: {
            args: Prisma.AIConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<AIConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.AIConfigCountArgs<ExtArgs>
            result: $Utils.Optional<AIConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tipoImovel?: TipoImovelOmit
    user?: UserOmit
    construtora?: ConstrutoraOmit
    imovel?: ImovelOmit
    pergunta?: PerguntaOmit
    resposta?: RespostaOmit
    match?: MatchOmit
    relatorio?: RelatorioOmit
    configuracao?: ConfiguracaoOmit
    logIntegracao?: LogIntegracaoOmit
    imovelMetadata?: ImovelMetadataOmit
    imovelPergunta?: ImovelPerguntaOmit
    mensagemContato?: MensagemContatoOmit
    aIConversation?: AIConversationOmit
    aIActionHistory?: AIActionHistoryOmit
    aIConfig?: AIConfigOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TipoImovelCountOutputType
   */

  export type TipoImovelCountOutputType = {
    imoveis: number
  }

  export type TipoImovelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imoveis?: boolean | TipoImovelCountOutputTypeCountImoveisArgs
  }

  // Custom InputTypes
  /**
   * TipoImovelCountOutputType without action
   */
  export type TipoImovelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovelCountOutputType
     */
    select?: TipoImovelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TipoImovelCountOutputType without action
   */
  export type TipoImovelCountOutputTypeCountImoveisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    respostas: number
    relatorios: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respostas?: boolean | UserCountOutputTypeCountRespostasArgs
    relatorios?: boolean | UserCountOutputTypeCountRelatoriosArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRelatoriosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelatorioWhereInput
  }


  /**
   * Count Type ConstrutoraCountOutputType
   */

  export type ConstrutoraCountOutputType = {
    usuarios: number
    imoveis: number
    imoveisMetadata: number
  }

  export type ConstrutoraCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | ConstrutoraCountOutputTypeCountUsuariosArgs
    imoveis?: boolean | ConstrutoraCountOutputTypeCountImoveisArgs
    imoveisMetadata?: boolean | ConstrutoraCountOutputTypeCountImoveisMetadataArgs
  }

  // Custom InputTypes
  /**
   * ConstrutoraCountOutputType without action
   */
  export type ConstrutoraCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConstrutoraCountOutputType
     */
    select?: ConstrutoraCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConstrutoraCountOutputType without action
   */
  export type ConstrutoraCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * ConstrutoraCountOutputType without action
   */
  export type ConstrutoraCountOutputTypeCountImoveisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelWhereInput
  }

  /**
   * ConstrutoraCountOutputType without action
   */
  export type ConstrutoraCountOutputTypeCountImoveisMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelMetadataWhereInput
  }


  /**
   * Count Type ImovelCountOutputType
   */

  export type ImovelCountOutputType = {
    matches: number
    perguntas: number
  }

  export type ImovelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matches?: boolean | ImovelCountOutputTypeCountMatchesArgs
    perguntas?: boolean | ImovelCountOutputTypeCountPerguntasArgs
  }

  // Custom InputTypes
  /**
   * ImovelCountOutputType without action
   */
  export type ImovelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelCountOutputType
     */
    select?: ImovelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImovelCountOutputType without action
   */
  export type ImovelCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * ImovelCountOutputType without action
   */
  export type ImovelCountOutputTypeCountPerguntasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelPerguntaWhereInput
  }


  /**
   * Count Type PerguntaCountOutputType
   */

  export type PerguntaCountOutputType = {
    respostas: number
    imoveis: number
  }

  export type PerguntaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respostas?: boolean | PerguntaCountOutputTypeCountRespostasArgs
    imoveis?: boolean | PerguntaCountOutputTypeCountImoveisArgs
  }

  // Custom InputTypes
  /**
   * PerguntaCountOutputType without action
   */
  export type PerguntaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerguntaCountOutputType
     */
    select?: PerguntaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PerguntaCountOutputType without action
   */
  export type PerguntaCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
  }

  /**
   * PerguntaCountOutputType without action
   */
  export type PerguntaCountOutputTypeCountImoveisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelPerguntaWhereInput
  }


  /**
   * Count Type RelatorioCountOutputType
   */

  export type RelatorioCountOutputType = {
    matches: number
  }

  export type RelatorioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matches?: boolean | RelatorioCountOutputTypeCountMatchesArgs
  }

  // Custom InputTypes
  /**
   * RelatorioCountOutputType without action
   */
  export type RelatorioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelatorioCountOutputType
     */
    select?: RelatorioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RelatorioCountOutputType without action
   */
  export type RelatorioCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Models
   */

  /**
   * Model TipoImovel
   */

  export type AggregateTipoImovel = {
    _count: TipoImovelCountAggregateOutputType | null
    _min: TipoImovelMinAggregateOutputType | null
    _max: TipoImovelMaxAggregateOutputType | null
  }

  export type TipoImovelMinAggregateOutputType = {
    id: string | null
    nome: string | null
    slug: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TipoImovelMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    slug: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TipoImovelCountAggregateOutputType = {
    id: number
    nome: number
    slug: number
    descricao: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TipoImovelMinAggregateInputType = {
    id?: true
    nome?: true
    slug?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TipoImovelMaxAggregateInputType = {
    id?: true
    nome?: true
    slug?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TipoImovelCountAggregateInputType = {
    id?: true
    nome?: true
    slug?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TipoImovelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TipoImovel to aggregate.
     */
    where?: TipoImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoImovels to fetch.
     */
    orderBy?: TipoImovelOrderByWithRelationInput | TipoImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TipoImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoImovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoImovels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TipoImovels
    **/
    _count?: true | TipoImovelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TipoImovelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TipoImovelMaxAggregateInputType
  }

  export type GetTipoImovelAggregateType<T extends TipoImovelAggregateArgs> = {
        [P in keyof T & keyof AggregateTipoImovel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTipoImovel[P]>
      : GetScalarType<T[P], AggregateTipoImovel[P]>
  }




  export type TipoImovelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TipoImovelWhereInput
    orderBy?: TipoImovelOrderByWithAggregationInput | TipoImovelOrderByWithAggregationInput[]
    by: TipoImovelScalarFieldEnum[] | TipoImovelScalarFieldEnum
    having?: TipoImovelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TipoImovelCountAggregateInputType | true
    _min?: TipoImovelMinAggregateInputType
    _max?: TipoImovelMaxAggregateInputType
  }

  export type TipoImovelGroupByOutputType = {
    id: string
    nome: string
    slug: string
    descricao: string | null
    createdAt: Date
    updatedAt: Date
    _count: TipoImovelCountAggregateOutputType | null
    _min: TipoImovelMinAggregateOutputType | null
    _max: TipoImovelMaxAggregateOutputType | null
  }

  type GetTipoImovelGroupByPayload<T extends TipoImovelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TipoImovelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TipoImovelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TipoImovelGroupByOutputType[P]>
            : GetScalarType<T[P], TipoImovelGroupByOutputType[P]>
        }
      >
    >


  export type TipoImovelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    slug?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imoveis?: boolean | TipoImovel$imoveisArgs<ExtArgs>
    _count?: boolean | TipoImovelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tipoImovel"]>

  export type TipoImovelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    slug?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tipoImovel"]>

  export type TipoImovelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    slug?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tipoImovel"]>

  export type TipoImovelSelectScalar = {
    id?: boolean
    nome?: boolean
    slug?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TipoImovelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "slug" | "descricao" | "createdAt" | "updatedAt", ExtArgs["result"]["tipoImovel"]>
  export type TipoImovelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imoveis?: boolean | TipoImovel$imoveisArgs<ExtArgs>
    _count?: boolean | TipoImovelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TipoImovelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TipoImovelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TipoImovelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TipoImovel"
    objects: {
      imoveis: Prisma.$ImovelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      slug: string
      descricao: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tipoImovel"]>
    composites: {}
  }

  type TipoImovelGetPayload<S extends boolean | null | undefined | TipoImovelDefaultArgs> = $Result.GetResult<Prisma.$TipoImovelPayload, S>

  type TipoImovelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TipoImovelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TipoImovelCountAggregateInputType | true
    }

  export interface TipoImovelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TipoImovel'], meta: { name: 'TipoImovel' } }
    /**
     * Find zero or one TipoImovel that matches the filter.
     * @param {TipoImovelFindUniqueArgs} args - Arguments to find a TipoImovel
     * @example
     * // Get one TipoImovel
     * const tipoImovel = await prisma.tipoImovel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TipoImovelFindUniqueArgs>(args: SelectSubset<T, TipoImovelFindUniqueArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TipoImovel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TipoImovelFindUniqueOrThrowArgs} args - Arguments to find a TipoImovel
     * @example
     * // Get one TipoImovel
     * const tipoImovel = await prisma.tipoImovel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TipoImovelFindUniqueOrThrowArgs>(args: SelectSubset<T, TipoImovelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TipoImovel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelFindFirstArgs} args - Arguments to find a TipoImovel
     * @example
     * // Get one TipoImovel
     * const tipoImovel = await prisma.tipoImovel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TipoImovelFindFirstArgs>(args?: SelectSubset<T, TipoImovelFindFirstArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TipoImovel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelFindFirstOrThrowArgs} args - Arguments to find a TipoImovel
     * @example
     * // Get one TipoImovel
     * const tipoImovel = await prisma.tipoImovel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TipoImovelFindFirstOrThrowArgs>(args?: SelectSubset<T, TipoImovelFindFirstOrThrowArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TipoImovels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TipoImovels
     * const tipoImovels = await prisma.tipoImovel.findMany()
     * 
     * // Get first 10 TipoImovels
     * const tipoImovels = await prisma.tipoImovel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tipoImovelWithIdOnly = await prisma.tipoImovel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TipoImovelFindManyArgs>(args?: SelectSubset<T, TipoImovelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TipoImovel.
     * @param {TipoImovelCreateArgs} args - Arguments to create a TipoImovel.
     * @example
     * // Create one TipoImovel
     * const TipoImovel = await prisma.tipoImovel.create({
     *   data: {
     *     // ... data to create a TipoImovel
     *   }
     * })
     * 
     */
    create<T extends TipoImovelCreateArgs>(args: SelectSubset<T, TipoImovelCreateArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TipoImovels.
     * @param {TipoImovelCreateManyArgs} args - Arguments to create many TipoImovels.
     * @example
     * // Create many TipoImovels
     * const tipoImovel = await prisma.tipoImovel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TipoImovelCreateManyArgs>(args?: SelectSubset<T, TipoImovelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TipoImovels and returns the data saved in the database.
     * @param {TipoImovelCreateManyAndReturnArgs} args - Arguments to create many TipoImovels.
     * @example
     * // Create many TipoImovels
     * const tipoImovel = await prisma.tipoImovel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TipoImovels and only return the `id`
     * const tipoImovelWithIdOnly = await prisma.tipoImovel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TipoImovelCreateManyAndReturnArgs>(args?: SelectSubset<T, TipoImovelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TipoImovel.
     * @param {TipoImovelDeleteArgs} args - Arguments to delete one TipoImovel.
     * @example
     * // Delete one TipoImovel
     * const TipoImovel = await prisma.tipoImovel.delete({
     *   where: {
     *     // ... filter to delete one TipoImovel
     *   }
     * })
     * 
     */
    delete<T extends TipoImovelDeleteArgs>(args: SelectSubset<T, TipoImovelDeleteArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TipoImovel.
     * @param {TipoImovelUpdateArgs} args - Arguments to update one TipoImovel.
     * @example
     * // Update one TipoImovel
     * const tipoImovel = await prisma.tipoImovel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TipoImovelUpdateArgs>(args: SelectSubset<T, TipoImovelUpdateArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TipoImovels.
     * @param {TipoImovelDeleteManyArgs} args - Arguments to filter TipoImovels to delete.
     * @example
     * // Delete a few TipoImovels
     * const { count } = await prisma.tipoImovel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TipoImovelDeleteManyArgs>(args?: SelectSubset<T, TipoImovelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TipoImovels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TipoImovels
     * const tipoImovel = await prisma.tipoImovel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TipoImovelUpdateManyArgs>(args: SelectSubset<T, TipoImovelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TipoImovels and returns the data updated in the database.
     * @param {TipoImovelUpdateManyAndReturnArgs} args - Arguments to update many TipoImovels.
     * @example
     * // Update many TipoImovels
     * const tipoImovel = await prisma.tipoImovel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TipoImovels and only return the `id`
     * const tipoImovelWithIdOnly = await prisma.tipoImovel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TipoImovelUpdateManyAndReturnArgs>(args: SelectSubset<T, TipoImovelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TipoImovel.
     * @param {TipoImovelUpsertArgs} args - Arguments to update or create a TipoImovel.
     * @example
     * // Update or create a TipoImovel
     * const tipoImovel = await prisma.tipoImovel.upsert({
     *   create: {
     *     // ... data to create a TipoImovel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TipoImovel we want to update
     *   }
     * })
     */
    upsert<T extends TipoImovelUpsertArgs>(args: SelectSubset<T, TipoImovelUpsertArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TipoImovels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelCountArgs} args - Arguments to filter TipoImovels to count.
     * @example
     * // Count the number of TipoImovels
     * const count = await prisma.tipoImovel.count({
     *   where: {
     *     // ... the filter for the TipoImovels we want to count
     *   }
     * })
    **/
    count<T extends TipoImovelCountArgs>(
      args?: Subset<T, TipoImovelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TipoImovelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TipoImovel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TipoImovelAggregateArgs>(args: Subset<T, TipoImovelAggregateArgs>): Prisma.PrismaPromise<GetTipoImovelAggregateType<T>>

    /**
     * Group by TipoImovel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoImovelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TipoImovelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TipoImovelGroupByArgs['orderBy'] }
        : { orderBy?: TipoImovelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TipoImovelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTipoImovelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TipoImovel model
   */
  readonly fields: TipoImovelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TipoImovel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TipoImovelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    imoveis<T extends TipoImovel$imoveisArgs<ExtArgs> = {}>(args?: Subset<T, TipoImovel$imoveisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TipoImovel model
   */
  interface TipoImovelFieldRefs {
    readonly id: FieldRef<"TipoImovel", 'String'>
    readonly nome: FieldRef<"TipoImovel", 'String'>
    readonly slug: FieldRef<"TipoImovel", 'String'>
    readonly descricao: FieldRef<"TipoImovel", 'String'>
    readonly createdAt: FieldRef<"TipoImovel", 'DateTime'>
    readonly updatedAt: FieldRef<"TipoImovel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TipoImovel findUnique
   */
  export type TipoImovelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * Filter, which TipoImovel to fetch.
     */
    where: TipoImovelWhereUniqueInput
  }

  /**
   * TipoImovel findUniqueOrThrow
   */
  export type TipoImovelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * Filter, which TipoImovel to fetch.
     */
    where: TipoImovelWhereUniqueInput
  }

  /**
   * TipoImovel findFirst
   */
  export type TipoImovelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * Filter, which TipoImovel to fetch.
     */
    where?: TipoImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoImovels to fetch.
     */
    orderBy?: TipoImovelOrderByWithRelationInput | TipoImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TipoImovels.
     */
    cursor?: TipoImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoImovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoImovels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TipoImovels.
     */
    distinct?: TipoImovelScalarFieldEnum | TipoImovelScalarFieldEnum[]
  }

  /**
   * TipoImovel findFirstOrThrow
   */
  export type TipoImovelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * Filter, which TipoImovel to fetch.
     */
    where?: TipoImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoImovels to fetch.
     */
    orderBy?: TipoImovelOrderByWithRelationInput | TipoImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TipoImovels.
     */
    cursor?: TipoImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoImovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoImovels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TipoImovels.
     */
    distinct?: TipoImovelScalarFieldEnum | TipoImovelScalarFieldEnum[]
  }

  /**
   * TipoImovel findMany
   */
  export type TipoImovelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * Filter, which TipoImovels to fetch.
     */
    where?: TipoImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoImovels to fetch.
     */
    orderBy?: TipoImovelOrderByWithRelationInput | TipoImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TipoImovels.
     */
    cursor?: TipoImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoImovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoImovels.
     */
    skip?: number
    distinct?: TipoImovelScalarFieldEnum | TipoImovelScalarFieldEnum[]
  }

  /**
   * TipoImovel create
   */
  export type TipoImovelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * The data needed to create a TipoImovel.
     */
    data: XOR<TipoImovelCreateInput, TipoImovelUncheckedCreateInput>
  }

  /**
   * TipoImovel createMany
   */
  export type TipoImovelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TipoImovels.
     */
    data: TipoImovelCreateManyInput | TipoImovelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TipoImovel createManyAndReturn
   */
  export type TipoImovelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * The data used to create many TipoImovels.
     */
    data: TipoImovelCreateManyInput | TipoImovelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TipoImovel update
   */
  export type TipoImovelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * The data needed to update a TipoImovel.
     */
    data: XOR<TipoImovelUpdateInput, TipoImovelUncheckedUpdateInput>
    /**
     * Choose, which TipoImovel to update.
     */
    where: TipoImovelWhereUniqueInput
  }

  /**
   * TipoImovel updateMany
   */
  export type TipoImovelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TipoImovels.
     */
    data: XOR<TipoImovelUpdateManyMutationInput, TipoImovelUncheckedUpdateManyInput>
    /**
     * Filter which TipoImovels to update
     */
    where?: TipoImovelWhereInput
    /**
     * Limit how many TipoImovels to update.
     */
    limit?: number
  }

  /**
   * TipoImovel updateManyAndReturn
   */
  export type TipoImovelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * The data used to update TipoImovels.
     */
    data: XOR<TipoImovelUpdateManyMutationInput, TipoImovelUncheckedUpdateManyInput>
    /**
     * Filter which TipoImovels to update
     */
    where?: TipoImovelWhereInput
    /**
     * Limit how many TipoImovels to update.
     */
    limit?: number
  }

  /**
   * TipoImovel upsert
   */
  export type TipoImovelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * The filter to search for the TipoImovel to update in case it exists.
     */
    where: TipoImovelWhereUniqueInput
    /**
     * In case the TipoImovel found by the `where` argument doesn't exist, create a new TipoImovel with this data.
     */
    create: XOR<TipoImovelCreateInput, TipoImovelUncheckedCreateInput>
    /**
     * In case the TipoImovel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TipoImovelUpdateInput, TipoImovelUncheckedUpdateInput>
  }

  /**
   * TipoImovel delete
   */
  export type TipoImovelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    /**
     * Filter which TipoImovel to delete.
     */
    where: TipoImovelWhereUniqueInput
  }

  /**
   * TipoImovel deleteMany
   */
  export type TipoImovelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TipoImovels to delete
     */
    where?: TipoImovelWhereInput
    /**
     * Limit how many TipoImovels to delete.
     */
    limit?: number
  }

  /**
   * TipoImovel.imoveis
   */
  export type TipoImovel$imoveisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    where?: ImovelWhereInput
    orderBy?: ImovelOrderByWithRelationInput | ImovelOrderByWithRelationInput[]
    cursor?: ImovelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImovelScalarFieldEnum | ImovelScalarFieldEnum[]
  }

  /**
   * TipoImovel without action
   */
  export type TipoImovelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    telefone: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
    construtoraId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    telefone: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
    construtoraId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    telefone: number
    role: number
    createdAt: number
    updatedAt: number
    construtoraId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    telefone?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    construtoraId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    telefone?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    construtoraId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    telefone?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    construtoraId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    telefone: string | null
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    construtoraId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    telefone?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
    construtora?: boolean | User$construtoraArgs<ExtArgs>
    respostas?: boolean | User$respostasArgs<ExtArgs>
    relatorios?: boolean | User$relatoriosArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    telefone?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
    construtora?: boolean | User$construtoraArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    telefone?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
    construtora?: boolean | User$construtoraArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    telefone?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "telefone" | "role" | "createdAt" | "updatedAt" | "construtoraId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    construtora?: boolean | User$construtoraArgs<ExtArgs>
    respostas?: boolean | User$respostasArgs<ExtArgs>
    relatorios?: boolean | User$relatoriosArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    construtora?: boolean | User$construtoraArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    construtora?: boolean | User$construtoraArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      construtora: Prisma.$ConstrutoraPayload<ExtArgs> | null
      respostas: Prisma.$RespostaPayload<ExtArgs>[]
      relatorios: Prisma.$RelatorioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      telefone: string | null
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
      construtoraId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    construtora<T extends User$construtoraArgs<ExtArgs> = {}>(args?: Subset<T, User$construtoraArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    respostas<T extends User$respostasArgs<ExtArgs> = {}>(args?: Subset<T, User$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    relatorios<T extends User$relatoriosArgs<ExtArgs> = {}>(args?: Subset<T, User$relatoriosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly telefone: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly construtoraId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.construtora
   */
  export type User$construtoraArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    where?: ConstrutoraWhereInput
  }

  /**
   * User.respostas
   */
  export type User$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    cursor?: RespostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * User.relatorios
   */
  export type User$relatoriosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    where?: RelatorioWhereInput
    orderBy?: RelatorioOrderByWithRelationInput | RelatorioOrderByWithRelationInput[]
    cursor?: RelatorioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelatorioScalarFieldEnum | RelatorioScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Construtora
   */

  export type AggregateConstrutora = {
    _count: ConstrutoraCountAggregateOutputType | null
    _min: ConstrutoraMinAggregateOutputType | null
    _max: ConstrutoraMaxAggregateOutputType | null
  }

  export type ConstrutoraMinAggregateOutputType = {
    id: string | null
    nome: string | null
    cnpj: string | null
    telefone: string | null
    email: string | null
    endereco: string | null
    ativa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConstrutoraMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    cnpj: string | null
    telefone: string | null
    email: string | null
    endereco: string | null
    ativa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConstrutoraCountAggregateOutputType = {
    id: number
    nome: number
    cnpj: number
    telefone: number
    email: number
    endereco: number
    ativa: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConstrutoraMinAggregateInputType = {
    id?: true
    nome?: true
    cnpj?: true
    telefone?: true
    email?: true
    endereco?: true
    ativa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConstrutoraMaxAggregateInputType = {
    id?: true
    nome?: true
    cnpj?: true
    telefone?: true
    email?: true
    endereco?: true
    ativa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConstrutoraCountAggregateInputType = {
    id?: true
    nome?: true
    cnpj?: true
    telefone?: true
    email?: true
    endereco?: true
    ativa?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConstrutoraAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Construtora to aggregate.
     */
    where?: ConstrutoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Construtoras to fetch.
     */
    orderBy?: ConstrutoraOrderByWithRelationInput | ConstrutoraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConstrutoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Construtoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Construtoras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Construtoras
    **/
    _count?: true | ConstrutoraCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConstrutoraMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConstrutoraMaxAggregateInputType
  }

  export type GetConstrutoraAggregateType<T extends ConstrutoraAggregateArgs> = {
        [P in keyof T & keyof AggregateConstrutora]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConstrutora[P]>
      : GetScalarType<T[P], AggregateConstrutora[P]>
  }




  export type ConstrutoraGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConstrutoraWhereInput
    orderBy?: ConstrutoraOrderByWithAggregationInput | ConstrutoraOrderByWithAggregationInput[]
    by: ConstrutoraScalarFieldEnum[] | ConstrutoraScalarFieldEnum
    having?: ConstrutoraScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConstrutoraCountAggregateInputType | true
    _min?: ConstrutoraMinAggregateInputType
    _max?: ConstrutoraMaxAggregateInputType
  }

  export type ConstrutoraGroupByOutputType = {
    id: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa: boolean
    createdAt: Date
    updatedAt: Date
    _count: ConstrutoraCountAggregateOutputType | null
    _min: ConstrutoraMinAggregateOutputType | null
    _max: ConstrutoraMaxAggregateOutputType | null
  }

  type GetConstrutoraGroupByPayload<T extends ConstrutoraGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConstrutoraGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConstrutoraGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConstrutoraGroupByOutputType[P]>
            : GetScalarType<T[P], ConstrutoraGroupByOutputType[P]>
        }
      >
    >


  export type ConstrutoraSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    endereco?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarios?: boolean | Construtora$usuariosArgs<ExtArgs>
    imoveis?: boolean | Construtora$imoveisArgs<ExtArgs>
    imoveisMetadata?: boolean | Construtora$imoveisMetadataArgs<ExtArgs>
    _count?: boolean | ConstrutoraCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["construtora"]>

  export type ConstrutoraSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    endereco?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["construtora"]>

  export type ConstrutoraSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    endereco?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["construtora"]>

  export type ConstrutoraSelectScalar = {
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    endereco?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConstrutoraOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "cnpj" | "telefone" | "email" | "endereco" | "ativa" | "createdAt" | "updatedAt", ExtArgs["result"]["construtora"]>
  export type ConstrutoraInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | Construtora$usuariosArgs<ExtArgs>
    imoveis?: boolean | Construtora$imoveisArgs<ExtArgs>
    imoveisMetadata?: boolean | Construtora$imoveisMetadataArgs<ExtArgs>
    _count?: boolean | ConstrutoraCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConstrutoraIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ConstrutoraIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConstrutoraPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Construtora"
    objects: {
      usuarios: Prisma.$UserPayload<ExtArgs>[]
      imoveis: Prisma.$ImovelPayload<ExtArgs>[]
      imoveisMetadata: Prisma.$ImovelMetadataPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      cnpj: string
      telefone: string
      email: string
      endereco: string
      ativa: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["construtora"]>
    composites: {}
  }

  type ConstrutoraGetPayload<S extends boolean | null | undefined | ConstrutoraDefaultArgs> = $Result.GetResult<Prisma.$ConstrutoraPayload, S>

  type ConstrutoraCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConstrutoraFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConstrutoraCountAggregateInputType | true
    }

  export interface ConstrutoraDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Construtora'], meta: { name: 'Construtora' } }
    /**
     * Find zero or one Construtora that matches the filter.
     * @param {ConstrutoraFindUniqueArgs} args - Arguments to find a Construtora
     * @example
     * // Get one Construtora
     * const construtora = await prisma.construtora.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConstrutoraFindUniqueArgs>(args: SelectSubset<T, ConstrutoraFindUniqueArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Construtora that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConstrutoraFindUniqueOrThrowArgs} args - Arguments to find a Construtora
     * @example
     * // Get one Construtora
     * const construtora = await prisma.construtora.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConstrutoraFindUniqueOrThrowArgs>(args: SelectSubset<T, ConstrutoraFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Construtora that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraFindFirstArgs} args - Arguments to find a Construtora
     * @example
     * // Get one Construtora
     * const construtora = await prisma.construtora.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConstrutoraFindFirstArgs>(args?: SelectSubset<T, ConstrutoraFindFirstArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Construtora that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraFindFirstOrThrowArgs} args - Arguments to find a Construtora
     * @example
     * // Get one Construtora
     * const construtora = await prisma.construtora.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConstrutoraFindFirstOrThrowArgs>(args?: SelectSubset<T, ConstrutoraFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Construtoras that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Construtoras
     * const construtoras = await prisma.construtora.findMany()
     * 
     * // Get first 10 Construtoras
     * const construtoras = await prisma.construtora.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const construtoraWithIdOnly = await prisma.construtora.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConstrutoraFindManyArgs>(args?: SelectSubset<T, ConstrutoraFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Construtora.
     * @param {ConstrutoraCreateArgs} args - Arguments to create a Construtora.
     * @example
     * // Create one Construtora
     * const Construtora = await prisma.construtora.create({
     *   data: {
     *     // ... data to create a Construtora
     *   }
     * })
     * 
     */
    create<T extends ConstrutoraCreateArgs>(args: SelectSubset<T, ConstrutoraCreateArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Construtoras.
     * @param {ConstrutoraCreateManyArgs} args - Arguments to create many Construtoras.
     * @example
     * // Create many Construtoras
     * const construtora = await prisma.construtora.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConstrutoraCreateManyArgs>(args?: SelectSubset<T, ConstrutoraCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Construtoras and returns the data saved in the database.
     * @param {ConstrutoraCreateManyAndReturnArgs} args - Arguments to create many Construtoras.
     * @example
     * // Create many Construtoras
     * const construtora = await prisma.construtora.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Construtoras and only return the `id`
     * const construtoraWithIdOnly = await prisma.construtora.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConstrutoraCreateManyAndReturnArgs>(args?: SelectSubset<T, ConstrutoraCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Construtora.
     * @param {ConstrutoraDeleteArgs} args - Arguments to delete one Construtora.
     * @example
     * // Delete one Construtora
     * const Construtora = await prisma.construtora.delete({
     *   where: {
     *     // ... filter to delete one Construtora
     *   }
     * })
     * 
     */
    delete<T extends ConstrutoraDeleteArgs>(args: SelectSubset<T, ConstrutoraDeleteArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Construtora.
     * @param {ConstrutoraUpdateArgs} args - Arguments to update one Construtora.
     * @example
     * // Update one Construtora
     * const construtora = await prisma.construtora.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConstrutoraUpdateArgs>(args: SelectSubset<T, ConstrutoraUpdateArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Construtoras.
     * @param {ConstrutoraDeleteManyArgs} args - Arguments to filter Construtoras to delete.
     * @example
     * // Delete a few Construtoras
     * const { count } = await prisma.construtora.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConstrutoraDeleteManyArgs>(args?: SelectSubset<T, ConstrutoraDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Construtoras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Construtoras
     * const construtora = await prisma.construtora.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConstrutoraUpdateManyArgs>(args: SelectSubset<T, ConstrutoraUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Construtoras and returns the data updated in the database.
     * @param {ConstrutoraUpdateManyAndReturnArgs} args - Arguments to update many Construtoras.
     * @example
     * // Update many Construtoras
     * const construtora = await prisma.construtora.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Construtoras and only return the `id`
     * const construtoraWithIdOnly = await prisma.construtora.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConstrutoraUpdateManyAndReturnArgs>(args: SelectSubset<T, ConstrutoraUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Construtora.
     * @param {ConstrutoraUpsertArgs} args - Arguments to update or create a Construtora.
     * @example
     * // Update or create a Construtora
     * const construtora = await prisma.construtora.upsert({
     *   create: {
     *     // ... data to create a Construtora
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Construtora we want to update
     *   }
     * })
     */
    upsert<T extends ConstrutoraUpsertArgs>(args: SelectSubset<T, ConstrutoraUpsertArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Construtoras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraCountArgs} args - Arguments to filter Construtoras to count.
     * @example
     * // Count the number of Construtoras
     * const count = await prisma.construtora.count({
     *   where: {
     *     // ... the filter for the Construtoras we want to count
     *   }
     * })
    **/
    count<T extends ConstrutoraCountArgs>(
      args?: Subset<T, ConstrutoraCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConstrutoraCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Construtora.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConstrutoraAggregateArgs>(args: Subset<T, ConstrutoraAggregateArgs>): Prisma.PrismaPromise<GetConstrutoraAggregateType<T>>

    /**
     * Group by Construtora.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConstrutoraGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConstrutoraGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConstrutoraGroupByArgs['orderBy'] }
        : { orderBy?: ConstrutoraGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConstrutoraGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConstrutoraGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Construtora model
   */
  readonly fields: ConstrutoraFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Construtora.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConstrutoraClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends Construtora$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Construtora$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    imoveis<T extends Construtora$imoveisArgs<ExtArgs> = {}>(args?: Subset<T, Construtora$imoveisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    imoveisMetadata<T extends Construtora$imoveisMetadataArgs<ExtArgs> = {}>(args?: Subset<T, Construtora$imoveisMetadataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Construtora model
   */
  interface ConstrutoraFieldRefs {
    readonly id: FieldRef<"Construtora", 'String'>
    readonly nome: FieldRef<"Construtora", 'String'>
    readonly cnpj: FieldRef<"Construtora", 'String'>
    readonly telefone: FieldRef<"Construtora", 'String'>
    readonly email: FieldRef<"Construtora", 'String'>
    readonly endereco: FieldRef<"Construtora", 'String'>
    readonly ativa: FieldRef<"Construtora", 'Boolean'>
    readonly createdAt: FieldRef<"Construtora", 'DateTime'>
    readonly updatedAt: FieldRef<"Construtora", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Construtora findUnique
   */
  export type ConstrutoraFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * Filter, which Construtora to fetch.
     */
    where: ConstrutoraWhereUniqueInput
  }

  /**
   * Construtora findUniqueOrThrow
   */
  export type ConstrutoraFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * Filter, which Construtora to fetch.
     */
    where: ConstrutoraWhereUniqueInput
  }

  /**
   * Construtora findFirst
   */
  export type ConstrutoraFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * Filter, which Construtora to fetch.
     */
    where?: ConstrutoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Construtoras to fetch.
     */
    orderBy?: ConstrutoraOrderByWithRelationInput | ConstrutoraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Construtoras.
     */
    cursor?: ConstrutoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Construtoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Construtoras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Construtoras.
     */
    distinct?: ConstrutoraScalarFieldEnum | ConstrutoraScalarFieldEnum[]
  }

  /**
   * Construtora findFirstOrThrow
   */
  export type ConstrutoraFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * Filter, which Construtora to fetch.
     */
    where?: ConstrutoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Construtoras to fetch.
     */
    orderBy?: ConstrutoraOrderByWithRelationInput | ConstrutoraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Construtoras.
     */
    cursor?: ConstrutoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Construtoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Construtoras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Construtoras.
     */
    distinct?: ConstrutoraScalarFieldEnum | ConstrutoraScalarFieldEnum[]
  }

  /**
   * Construtora findMany
   */
  export type ConstrutoraFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * Filter, which Construtoras to fetch.
     */
    where?: ConstrutoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Construtoras to fetch.
     */
    orderBy?: ConstrutoraOrderByWithRelationInput | ConstrutoraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Construtoras.
     */
    cursor?: ConstrutoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Construtoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Construtoras.
     */
    skip?: number
    distinct?: ConstrutoraScalarFieldEnum | ConstrutoraScalarFieldEnum[]
  }

  /**
   * Construtora create
   */
  export type ConstrutoraCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * The data needed to create a Construtora.
     */
    data: XOR<ConstrutoraCreateInput, ConstrutoraUncheckedCreateInput>
  }

  /**
   * Construtora createMany
   */
  export type ConstrutoraCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Construtoras.
     */
    data: ConstrutoraCreateManyInput | ConstrutoraCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Construtora createManyAndReturn
   */
  export type ConstrutoraCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * The data used to create many Construtoras.
     */
    data: ConstrutoraCreateManyInput | ConstrutoraCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Construtora update
   */
  export type ConstrutoraUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * The data needed to update a Construtora.
     */
    data: XOR<ConstrutoraUpdateInput, ConstrutoraUncheckedUpdateInput>
    /**
     * Choose, which Construtora to update.
     */
    where: ConstrutoraWhereUniqueInput
  }

  /**
   * Construtora updateMany
   */
  export type ConstrutoraUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Construtoras.
     */
    data: XOR<ConstrutoraUpdateManyMutationInput, ConstrutoraUncheckedUpdateManyInput>
    /**
     * Filter which Construtoras to update
     */
    where?: ConstrutoraWhereInput
    /**
     * Limit how many Construtoras to update.
     */
    limit?: number
  }

  /**
   * Construtora updateManyAndReturn
   */
  export type ConstrutoraUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * The data used to update Construtoras.
     */
    data: XOR<ConstrutoraUpdateManyMutationInput, ConstrutoraUncheckedUpdateManyInput>
    /**
     * Filter which Construtoras to update
     */
    where?: ConstrutoraWhereInput
    /**
     * Limit how many Construtoras to update.
     */
    limit?: number
  }

  /**
   * Construtora upsert
   */
  export type ConstrutoraUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * The filter to search for the Construtora to update in case it exists.
     */
    where: ConstrutoraWhereUniqueInput
    /**
     * In case the Construtora found by the `where` argument doesn't exist, create a new Construtora with this data.
     */
    create: XOR<ConstrutoraCreateInput, ConstrutoraUncheckedCreateInput>
    /**
     * In case the Construtora was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConstrutoraUpdateInput, ConstrutoraUncheckedUpdateInput>
  }

  /**
   * Construtora delete
   */
  export type ConstrutoraDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    /**
     * Filter which Construtora to delete.
     */
    where: ConstrutoraWhereUniqueInput
  }

  /**
   * Construtora deleteMany
   */
  export type ConstrutoraDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Construtoras to delete
     */
    where?: ConstrutoraWhereInput
    /**
     * Limit how many Construtoras to delete.
     */
    limit?: number
  }

  /**
   * Construtora.usuarios
   */
  export type Construtora$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Construtora.imoveis
   */
  export type Construtora$imoveisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    where?: ImovelWhereInput
    orderBy?: ImovelOrderByWithRelationInput | ImovelOrderByWithRelationInput[]
    cursor?: ImovelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImovelScalarFieldEnum | ImovelScalarFieldEnum[]
  }

  /**
   * Construtora.imoveisMetadata
   */
  export type Construtora$imoveisMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    where?: ImovelMetadataWhereInput
    orderBy?: ImovelMetadataOrderByWithRelationInput | ImovelMetadataOrderByWithRelationInput[]
    cursor?: ImovelMetadataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImovelMetadataScalarFieldEnum | ImovelMetadataScalarFieldEnum[]
  }

  /**
   * Construtora without action
   */
  export type ConstrutoraDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
  }


  /**
   * Model Imovel
   */

  export type AggregateImovel = {
    _count: ImovelCountAggregateOutputType | null
    _avg: ImovelAvgAggregateOutputType | null
    _sum: ImovelSumAggregateOutputType | null
    _min: ImovelMinAggregateOutputType | null
    _max: ImovelMaxAggregateOutputType | null
  }

  export type ImovelAvgAggregateOutputType = {
    preco: number | null
    area: number | null
    quartos: number | null
    banheiros: number | null
    vagas: number | null
    latitude: number | null
    longitude: number | null
  }

  export type ImovelSumAggregateOutputType = {
    preco: number | null
    area: number | null
    quartos: number | null
    banheiros: number | null
    vagas: number | null
    latitude: number | null
    longitude: number | null
  }

  export type ImovelMinAggregateOutputType = {
    id: string | null
    idExternoAPI: string | null
    titulo: string | null
    descricao: string | null
    preco: number | null
    area: number | null
    quartos: number | null
    banheiros: number | null
    vagas: number | null
    latitude: number | null
    longitude: number | null
    telefoneContato: string | null
    endereco: string | null
    fotoPrincipal: string | null
    tipoImovelId: string | null
    tipoImovelNome: string | null
    status: string | null
    ativo: boolean | null
    destaque: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    construtoraId: string | null
  }

  export type ImovelMaxAggregateOutputType = {
    id: string | null
    idExternoAPI: string | null
    titulo: string | null
    descricao: string | null
    preco: number | null
    area: number | null
    quartos: number | null
    banheiros: number | null
    vagas: number | null
    latitude: number | null
    longitude: number | null
    telefoneContato: string | null
    endereco: string | null
    fotoPrincipal: string | null
    tipoImovelId: string | null
    tipoImovelNome: string | null
    status: string | null
    ativo: boolean | null
    destaque: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    construtoraId: string | null
  }

  export type ImovelCountAggregateOutputType = {
    id: number
    idExternoAPI: number
    titulo: number
    descricao: number
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato: number
    endereco: number
    fotoPrincipal: number
    galeriaFotos: number
    caracteristicas: number
    caracteristicasArray: number
    tipoImovelId: number
    tipoImovelNome: number
    status: number
    ativo: number
    destaque: number
    createdAt: number
    updatedAt: number
    construtoraId: number
    _all: number
  }


  export type ImovelAvgAggregateInputType = {
    preco?: true
    area?: true
    quartos?: true
    banheiros?: true
    vagas?: true
    latitude?: true
    longitude?: true
  }

  export type ImovelSumAggregateInputType = {
    preco?: true
    area?: true
    quartos?: true
    banheiros?: true
    vagas?: true
    latitude?: true
    longitude?: true
  }

  export type ImovelMinAggregateInputType = {
    id?: true
    idExternoAPI?: true
    titulo?: true
    descricao?: true
    preco?: true
    area?: true
    quartos?: true
    banheiros?: true
    vagas?: true
    latitude?: true
    longitude?: true
    telefoneContato?: true
    endereco?: true
    fotoPrincipal?: true
    tipoImovelId?: true
    tipoImovelNome?: true
    status?: true
    ativo?: true
    destaque?: true
    createdAt?: true
    updatedAt?: true
    construtoraId?: true
  }

  export type ImovelMaxAggregateInputType = {
    id?: true
    idExternoAPI?: true
    titulo?: true
    descricao?: true
    preco?: true
    area?: true
    quartos?: true
    banheiros?: true
    vagas?: true
    latitude?: true
    longitude?: true
    telefoneContato?: true
    endereco?: true
    fotoPrincipal?: true
    tipoImovelId?: true
    tipoImovelNome?: true
    status?: true
    ativo?: true
    destaque?: true
    createdAt?: true
    updatedAt?: true
    construtoraId?: true
  }

  export type ImovelCountAggregateInputType = {
    id?: true
    idExternoAPI?: true
    titulo?: true
    descricao?: true
    preco?: true
    area?: true
    quartos?: true
    banheiros?: true
    vagas?: true
    latitude?: true
    longitude?: true
    telefoneContato?: true
    endereco?: true
    fotoPrincipal?: true
    galeriaFotos?: true
    caracteristicas?: true
    caracteristicasArray?: true
    tipoImovelId?: true
    tipoImovelNome?: true
    status?: true
    ativo?: true
    destaque?: true
    createdAt?: true
    updatedAt?: true
    construtoraId?: true
    _all?: true
  }

  export type ImovelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Imovel to aggregate.
     */
    where?: ImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Imovels to fetch.
     */
    orderBy?: ImovelOrderByWithRelationInput | ImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Imovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Imovels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Imovels
    **/
    _count?: true | ImovelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImovelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImovelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImovelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImovelMaxAggregateInputType
  }

  export type GetImovelAggregateType<T extends ImovelAggregateArgs> = {
        [P in keyof T & keyof AggregateImovel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImovel[P]>
      : GetScalarType<T[P], AggregateImovel[P]>
  }




  export type ImovelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelWhereInput
    orderBy?: ImovelOrderByWithAggregationInput | ImovelOrderByWithAggregationInput[]
    by: ImovelScalarFieldEnum[] | ImovelScalarFieldEnum
    having?: ImovelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImovelCountAggregateInputType | true
    _avg?: ImovelAvgAggregateInputType
    _sum?: ImovelSumAggregateInputType
    _min?: ImovelMinAggregateInputType
    _max?: ImovelMaxAggregateInputType
  }

  export type ImovelGroupByOutputType = {
    id: string
    idExternoAPI: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato: string | null
    endereco: string
    fotoPrincipal: string | null
    galeriaFotos: string[]
    caracteristicas: JsonValue | null
    caracteristicasArray: string[]
    tipoImovelId: string | null
    tipoImovelNome: string | null
    status: string | null
    ativo: boolean
    destaque: boolean
    createdAt: Date
    updatedAt: Date
    construtoraId: string
    _count: ImovelCountAggregateOutputType | null
    _avg: ImovelAvgAggregateOutputType | null
    _sum: ImovelSumAggregateOutputType | null
    _min: ImovelMinAggregateOutputType | null
    _max: ImovelMaxAggregateOutputType | null
  }

  type GetImovelGroupByPayload<T extends ImovelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImovelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImovelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImovelGroupByOutputType[P]>
            : GetScalarType<T[P], ImovelGroupByOutputType[P]>
        }
      >
    >


  export type ImovelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idExternoAPI?: boolean
    titulo?: boolean
    descricao?: boolean
    preco?: boolean
    area?: boolean
    quartos?: boolean
    banheiros?: boolean
    vagas?: boolean
    latitude?: boolean
    longitude?: boolean
    telefoneContato?: boolean
    endereco?: boolean
    fotoPrincipal?: boolean
    galeriaFotos?: boolean
    caracteristicas?: boolean
    caracteristicasArray?: boolean
    tipoImovelId?: boolean
    tipoImovelNome?: boolean
    status?: boolean
    ativo?: boolean
    destaque?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
    tipoImovel?: boolean | Imovel$tipoImovelArgs<ExtArgs>
    construtora?: boolean | ConstrutoraDefaultArgs<ExtArgs>
    matches?: boolean | Imovel$matchesArgs<ExtArgs>
    perguntas?: boolean | Imovel$perguntasArgs<ExtArgs>
    _count?: boolean | ImovelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imovel"]>

  export type ImovelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idExternoAPI?: boolean
    titulo?: boolean
    descricao?: boolean
    preco?: boolean
    area?: boolean
    quartos?: boolean
    banheiros?: boolean
    vagas?: boolean
    latitude?: boolean
    longitude?: boolean
    telefoneContato?: boolean
    endereco?: boolean
    fotoPrincipal?: boolean
    galeriaFotos?: boolean
    caracteristicas?: boolean
    caracteristicasArray?: boolean
    tipoImovelId?: boolean
    tipoImovelNome?: boolean
    status?: boolean
    ativo?: boolean
    destaque?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
    tipoImovel?: boolean | Imovel$tipoImovelArgs<ExtArgs>
    construtora?: boolean | ConstrutoraDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imovel"]>

  export type ImovelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idExternoAPI?: boolean
    titulo?: boolean
    descricao?: boolean
    preco?: boolean
    area?: boolean
    quartos?: boolean
    banheiros?: boolean
    vagas?: boolean
    latitude?: boolean
    longitude?: boolean
    telefoneContato?: boolean
    endereco?: boolean
    fotoPrincipal?: boolean
    galeriaFotos?: boolean
    caracteristicas?: boolean
    caracteristicasArray?: boolean
    tipoImovelId?: boolean
    tipoImovelNome?: boolean
    status?: boolean
    ativo?: boolean
    destaque?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
    tipoImovel?: boolean | Imovel$tipoImovelArgs<ExtArgs>
    construtora?: boolean | ConstrutoraDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imovel"]>

  export type ImovelSelectScalar = {
    id?: boolean
    idExternoAPI?: boolean
    titulo?: boolean
    descricao?: boolean
    preco?: boolean
    area?: boolean
    quartos?: boolean
    banheiros?: boolean
    vagas?: boolean
    latitude?: boolean
    longitude?: boolean
    telefoneContato?: boolean
    endereco?: boolean
    fotoPrincipal?: boolean
    galeriaFotos?: boolean
    caracteristicas?: boolean
    caracteristicasArray?: boolean
    tipoImovelId?: boolean
    tipoImovelNome?: boolean
    status?: boolean
    ativo?: boolean
    destaque?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtoraId?: boolean
  }

  export type ImovelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "idExternoAPI" | "titulo" | "descricao" | "preco" | "area" | "quartos" | "banheiros" | "vagas" | "latitude" | "longitude" | "telefoneContato" | "endereco" | "fotoPrincipal" | "galeriaFotos" | "caracteristicas" | "caracteristicasArray" | "tipoImovelId" | "tipoImovelNome" | "status" | "ativo" | "destaque" | "createdAt" | "updatedAt" | "construtoraId", ExtArgs["result"]["imovel"]>
  export type ImovelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tipoImovel?: boolean | Imovel$tipoImovelArgs<ExtArgs>
    construtora?: boolean | ConstrutoraDefaultArgs<ExtArgs>
    matches?: boolean | Imovel$matchesArgs<ExtArgs>
    perguntas?: boolean | Imovel$perguntasArgs<ExtArgs>
    _count?: boolean | ImovelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImovelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tipoImovel?: boolean | Imovel$tipoImovelArgs<ExtArgs>
    construtora?: boolean | ConstrutoraDefaultArgs<ExtArgs>
  }
  export type ImovelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tipoImovel?: boolean | Imovel$tipoImovelArgs<ExtArgs>
    construtora?: boolean | ConstrutoraDefaultArgs<ExtArgs>
  }

  export type $ImovelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Imovel"
    objects: {
      tipoImovel: Prisma.$TipoImovelPayload<ExtArgs> | null
      construtora: Prisma.$ConstrutoraPayload<ExtArgs>
      matches: Prisma.$MatchPayload<ExtArgs>[]
      perguntas: Prisma.$ImovelPerguntaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      idExternoAPI: string | null
      titulo: string
      descricao: string
      preco: number
      area: number
      quartos: number
      banheiros: number
      vagas: number
      latitude: number
      longitude: number
      telefoneContato: string | null
      endereco: string
      fotoPrincipal: string | null
      galeriaFotos: string[]
      caracteristicas: Prisma.JsonValue | null
      caracteristicasArray: string[]
      tipoImovelId: string | null
      tipoImovelNome: string | null
      status: string | null
      ativo: boolean
      destaque: boolean
      createdAt: Date
      updatedAt: Date
      construtoraId: string
    }, ExtArgs["result"]["imovel"]>
    composites: {}
  }

  type ImovelGetPayload<S extends boolean | null | undefined | ImovelDefaultArgs> = $Result.GetResult<Prisma.$ImovelPayload, S>

  type ImovelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImovelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImovelCountAggregateInputType | true
    }

  export interface ImovelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Imovel'], meta: { name: 'Imovel' } }
    /**
     * Find zero or one Imovel that matches the filter.
     * @param {ImovelFindUniqueArgs} args - Arguments to find a Imovel
     * @example
     * // Get one Imovel
     * const imovel = await prisma.imovel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImovelFindUniqueArgs>(args: SelectSubset<T, ImovelFindUniqueArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Imovel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImovelFindUniqueOrThrowArgs} args - Arguments to find a Imovel
     * @example
     * // Get one Imovel
     * const imovel = await prisma.imovel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImovelFindUniqueOrThrowArgs>(args: SelectSubset<T, ImovelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Imovel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelFindFirstArgs} args - Arguments to find a Imovel
     * @example
     * // Get one Imovel
     * const imovel = await prisma.imovel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImovelFindFirstArgs>(args?: SelectSubset<T, ImovelFindFirstArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Imovel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelFindFirstOrThrowArgs} args - Arguments to find a Imovel
     * @example
     * // Get one Imovel
     * const imovel = await prisma.imovel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImovelFindFirstOrThrowArgs>(args?: SelectSubset<T, ImovelFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Imovels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Imovels
     * const imovels = await prisma.imovel.findMany()
     * 
     * // Get first 10 Imovels
     * const imovels = await prisma.imovel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imovelWithIdOnly = await prisma.imovel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImovelFindManyArgs>(args?: SelectSubset<T, ImovelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Imovel.
     * @param {ImovelCreateArgs} args - Arguments to create a Imovel.
     * @example
     * // Create one Imovel
     * const Imovel = await prisma.imovel.create({
     *   data: {
     *     // ... data to create a Imovel
     *   }
     * })
     * 
     */
    create<T extends ImovelCreateArgs>(args: SelectSubset<T, ImovelCreateArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Imovels.
     * @param {ImovelCreateManyArgs} args - Arguments to create many Imovels.
     * @example
     * // Create many Imovels
     * const imovel = await prisma.imovel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImovelCreateManyArgs>(args?: SelectSubset<T, ImovelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Imovels and returns the data saved in the database.
     * @param {ImovelCreateManyAndReturnArgs} args - Arguments to create many Imovels.
     * @example
     * // Create many Imovels
     * const imovel = await prisma.imovel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Imovels and only return the `id`
     * const imovelWithIdOnly = await prisma.imovel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImovelCreateManyAndReturnArgs>(args?: SelectSubset<T, ImovelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Imovel.
     * @param {ImovelDeleteArgs} args - Arguments to delete one Imovel.
     * @example
     * // Delete one Imovel
     * const Imovel = await prisma.imovel.delete({
     *   where: {
     *     // ... filter to delete one Imovel
     *   }
     * })
     * 
     */
    delete<T extends ImovelDeleteArgs>(args: SelectSubset<T, ImovelDeleteArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Imovel.
     * @param {ImovelUpdateArgs} args - Arguments to update one Imovel.
     * @example
     * // Update one Imovel
     * const imovel = await prisma.imovel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImovelUpdateArgs>(args: SelectSubset<T, ImovelUpdateArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Imovels.
     * @param {ImovelDeleteManyArgs} args - Arguments to filter Imovels to delete.
     * @example
     * // Delete a few Imovels
     * const { count } = await prisma.imovel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImovelDeleteManyArgs>(args?: SelectSubset<T, ImovelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Imovels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Imovels
     * const imovel = await prisma.imovel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImovelUpdateManyArgs>(args: SelectSubset<T, ImovelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Imovels and returns the data updated in the database.
     * @param {ImovelUpdateManyAndReturnArgs} args - Arguments to update many Imovels.
     * @example
     * // Update many Imovels
     * const imovel = await prisma.imovel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Imovels and only return the `id`
     * const imovelWithIdOnly = await prisma.imovel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImovelUpdateManyAndReturnArgs>(args: SelectSubset<T, ImovelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Imovel.
     * @param {ImovelUpsertArgs} args - Arguments to update or create a Imovel.
     * @example
     * // Update or create a Imovel
     * const imovel = await prisma.imovel.upsert({
     *   create: {
     *     // ... data to create a Imovel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Imovel we want to update
     *   }
     * })
     */
    upsert<T extends ImovelUpsertArgs>(args: SelectSubset<T, ImovelUpsertArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Imovels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelCountArgs} args - Arguments to filter Imovels to count.
     * @example
     * // Count the number of Imovels
     * const count = await prisma.imovel.count({
     *   where: {
     *     // ... the filter for the Imovels we want to count
     *   }
     * })
    **/
    count<T extends ImovelCountArgs>(
      args?: Subset<T, ImovelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImovelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Imovel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImovelAggregateArgs>(args: Subset<T, ImovelAggregateArgs>): Prisma.PrismaPromise<GetImovelAggregateType<T>>

    /**
     * Group by Imovel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImovelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImovelGroupByArgs['orderBy'] }
        : { orderBy?: ImovelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImovelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImovelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Imovel model
   */
  readonly fields: ImovelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Imovel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImovelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tipoImovel<T extends Imovel$tipoImovelArgs<ExtArgs> = {}>(args?: Subset<T, Imovel$tipoImovelArgs<ExtArgs>>): Prisma__TipoImovelClient<$Result.GetResult<Prisma.$TipoImovelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    construtora<T extends ConstrutoraDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConstrutoraDefaultArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    matches<T extends Imovel$matchesArgs<ExtArgs> = {}>(args?: Subset<T, Imovel$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    perguntas<T extends Imovel$perguntasArgs<ExtArgs> = {}>(args?: Subset<T, Imovel$perguntasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Imovel model
   */
  interface ImovelFieldRefs {
    readonly id: FieldRef<"Imovel", 'String'>
    readonly idExternoAPI: FieldRef<"Imovel", 'String'>
    readonly titulo: FieldRef<"Imovel", 'String'>
    readonly descricao: FieldRef<"Imovel", 'String'>
    readonly preco: FieldRef<"Imovel", 'Float'>
    readonly area: FieldRef<"Imovel", 'Float'>
    readonly quartos: FieldRef<"Imovel", 'Int'>
    readonly banheiros: FieldRef<"Imovel", 'Int'>
    readonly vagas: FieldRef<"Imovel", 'Int'>
    readonly latitude: FieldRef<"Imovel", 'Float'>
    readonly longitude: FieldRef<"Imovel", 'Float'>
    readonly telefoneContato: FieldRef<"Imovel", 'String'>
    readonly endereco: FieldRef<"Imovel", 'String'>
    readonly fotoPrincipal: FieldRef<"Imovel", 'String'>
    readonly galeriaFotos: FieldRef<"Imovel", 'String[]'>
    readonly caracteristicas: FieldRef<"Imovel", 'Json'>
    readonly caracteristicasArray: FieldRef<"Imovel", 'String[]'>
    readonly tipoImovelId: FieldRef<"Imovel", 'String'>
    readonly tipoImovelNome: FieldRef<"Imovel", 'String'>
    readonly status: FieldRef<"Imovel", 'String'>
    readonly ativo: FieldRef<"Imovel", 'Boolean'>
    readonly destaque: FieldRef<"Imovel", 'Boolean'>
    readonly createdAt: FieldRef<"Imovel", 'DateTime'>
    readonly updatedAt: FieldRef<"Imovel", 'DateTime'>
    readonly construtoraId: FieldRef<"Imovel", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Imovel findUnique
   */
  export type ImovelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * Filter, which Imovel to fetch.
     */
    where: ImovelWhereUniqueInput
  }

  /**
   * Imovel findUniqueOrThrow
   */
  export type ImovelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * Filter, which Imovel to fetch.
     */
    where: ImovelWhereUniqueInput
  }

  /**
   * Imovel findFirst
   */
  export type ImovelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * Filter, which Imovel to fetch.
     */
    where?: ImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Imovels to fetch.
     */
    orderBy?: ImovelOrderByWithRelationInput | ImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Imovels.
     */
    cursor?: ImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Imovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Imovels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Imovels.
     */
    distinct?: ImovelScalarFieldEnum | ImovelScalarFieldEnum[]
  }

  /**
   * Imovel findFirstOrThrow
   */
  export type ImovelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * Filter, which Imovel to fetch.
     */
    where?: ImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Imovels to fetch.
     */
    orderBy?: ImovelOrderByWithRelationInput | ImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Imovels.
     */
    cursor?: ImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Imovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Imovels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Imovels.
     */
    distinct?: ImovelScalarFieldEnum | ImovelScalarFieldEnum[]
  }

  /**
   * Imovel findMany
   */
  export type ImovelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * Filter, which Imovels to fetch.
     */
    where?: ImovelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Imovels to fetch.
     */
    orderBy?: ImovelOrderByWithRelationInput | ImovelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Imovels.
     */
    cursor?: ImovelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Imovels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Imovels.
     */
    skip?: number
    distinct?: ImovelScalarFieldEnum | ImovelScalarFieldEnum[]
  }

  /**
   * Imovel create
   */
  export type ImovelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * The data needed to create a Imovel.
     */
    data: XOR<ImovelCreateInput, ImovelUncheckedCreateInput>
  }

  /**
   * Imovel createMany
   */
  export type ImovelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Imovels.
     */
    data: ImovelCreateManyInput | ImovelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Imovel createManyAndReturn
   */
  export type ImovelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * The data used to create many Imovels.
     */
    data: ImovelCreateManyInput | ImovelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Imovel update
   */
  export type ImovelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * The data needed to update a Imovel.
     */
    data: XOR<ImovelUpdateInput, ImovelUncheckedUpdateInput>
    /**
     * Choose, which Imovel to update.
     */
    where: ImovelWhereUniqueInput
  }

  /**
   * Imovel updateMany
   */
  export type ImovelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Imovels.
     */
    data: XOR<ImovelUpdateManyMutationInput, ImovelUncheckedUpdateManyInput>
    /**
     * Filter which Imovels to update
     */
    where?: ImovelWhereInput
    /**
     * Limit how many Imovels to update.
     */
    limit?: number
  }

  /**
   * Imovel updateManyAndReturn
   */
  export type ImovelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * The data used to update Imovels.
     */
    data: XOR<ImovelUpdateManyMutationInput, ImovelUncheckedUpdateManyInput>
    /**
     * Filter which Imovels to update
     */
    where?: ImovelWhereInput
    /**
     * Limit how many Imovels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Imovel upsert
   */
  export type ImovelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * The filter to search for the Imovel to update in case it exists.
     */
    where: ImovelWhereUniqueInput
    /**
     * In case the Imovel found by the `where` argument doesn't exist, create a new Imovel with this data.
     */
    create: XOR<ImovelCreateInput, ImovelUncheckedCreateInput>
    /**
     * In case the Imovel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImovelUpdateInput, ImovelUncheckedUpdateInput>
  }

  /**
   * Imovel delete
   */
  export type ImovelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
    /**
     * Filter which Imovel to delete.
     */
    where: ImovelWhereUniqueInput
  }

  /**
   * Imovel deleteMany
   */
  export type ImovelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Imovels to delete
     */
    where?: ImovelWhereInput
    /**
     * Limit how many Imovels to delete.
     */
    limit?: number
  }

  /**
   * Imovel.tipoImovel
   */
  export type Imovel$tipoImovelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoImovel
     */
    select?: TipoImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoImovel
     */
    omit?: TipoImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoImovelInclude<ExtArgs> | null
    where?: TipoImovelWhereInput
  }

  /**
   * Imovel.matches
   */
  export type Imovel$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Imovel.perguntas
   */
  export type Imovel$perguntasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    where?: ImovelPerguntaWhereInput
    orderBy?: ImovelPerguntaOrderByWithRelationInput | ImovelPerguntaOrderByWithRelationInput[]
    cursor?: ImovelPerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImovelPerguntaScalarFieldEnum | ImovelPerguntaScalarFieldEnum[]
  }

  /**
   * Imovel without action
   */
  export type ImovelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Imovel
     */
    select?: ImovelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Imovel
     */
    omit?: ImovelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelInclude<ExtArgs> | null
  }


  /**
   * Model Pergunta
   */

  export type AggregatePergunta = {
    _count: PerguntaCountAggregateOutputType | null
    _avg: PerguntaAvgAggregateOutputType | null
    _sum: PerguntaSumAggregateOutputType | null
    _min: PerguntaMinAggregateOutputType | null
    _max: PerguntaMaxAggregateOutputType | null
  }

  export type PerguntaAvgAggregateOutputType = {
    ordem: number | null
    pontuacao: number | null
  }

  export type PerguntaSumAggregateOutputType = {
    ordem: number | null
    pontuacao: number | null
  }

  export type PerguntaMinAggregateOutputType = {
    id: string | null
    texto: string | null
    tipo: string | null
    ordem: number | null
    categoria: string | null
    fluxo: string | null
    pontuacao: number | null
    obrigatoria: boolean | null
    geradaPorIA: boolean | null
    ativa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PerguntaMaxAggregateOutputType = {
    id: string | null
    texto: string | null
    tipo: string | null
    ordem: number | null
    categoria: string | null
    fluxo: string | null
    pontuacao: number | null
    obrigatoria: boolean | null
    geradaPorIA: boolean | null
    ativa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PerguntaCountAggregateOutputType = {
    id: number
    texto: number
    tipo: number
    opcoes: number
    ordem: number
    categoria: number
    fluxo: number
    pontuacao: number
    obrigatoria: number
    condicional: number
    geradaPorIA: number
    ativa: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PerguntaAvgAggregateInputType = {
    ordem?: true
    pontuacao?: true
  }

  export type PerguntaSumAggregateInputType = {
    ordem?: true
    pontuacao?: true
  }

  export type PerguntaMinAggregateInputType = {
    id?: true
    texto?: true
    tipo?: true
    ordem?: true
    categoria?: true
    fluxo?: true
    pontuacao?: true
    obrigatoria?: true
    geradaPorIA?: true
    ativa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PerguntaMaxAggregateInputType = {
    id?: true
    texto?: true
    tipo?: true
    ordem?: true
    categoria?: true
    fluxo?: true
    pontuacao?: true
    obrigatoria?: true
    geradaPorIA?: true
    ativa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PerguntaCountAggregateInputType = {
    id?: true
    texto?: true
    tipo?: true
    opcoes?: true
    ordem?: true
    categoria?: true
    fluxo?: true
    pontuacao?: true
    obrigatoria?: true
    condicional?: true
    geradaPorIA?: true
    ativa?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PerguntaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pergunta to aggregate.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Perguntas
    **/
    _count?: true | PerguntaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PerguntaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PerguntaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PerguntaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PerguntaMaxAggregateInputType
  }

  export type GetPerguntaAggregateType<T extends PerguntaAggregateArgs> = {
        [P in keyof T & keyof AggregatePergunta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePergunta[P]>
      : GetScalarType<T[P], AggregatePergunta[P]>
  }




  export type PerguntaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerguntaWhereInput
    orderBy?: PerguntaOrderByWithAggregationInput | PerguntaOrderByWithAggregationInput[]
    by: PerguntaScalarFieldEnum[] | PerguntaScalarFieldEnum
    having?: PerguntaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PerguntaCountAggregateInputType | true
    _avg?: PerguntaAvgAggregateInputType
    _sum?: PerguntaSumAggregateInputType
    _min?: PerguntaMinAggregateInputType
    _max?: PerguntaMaxAggregateInputType
  }

  export type PerguntaGroupByOutputType = {
    id: string
    texto: string
    tipo: string
    opcoes: JsonValue | null
    ordem: number
    categoria: string
    fluxo: string
    pontuacao: number
    obrigatoria: boolean
    condicional: JsonValue | null
    geradaPorIA: boolean
    ativa: boolean
    createdAt: Date
    updatedAt: Date
    _count: PerguntaCountAggregateOutputType | null
    _avg: PerguntaAvgAggregateOutputType | null
    _sum: PerguntaSumAggregateOutputType | null
    _min: PerguntaMinAggregateOutputType | null
    _max: PerguntaMaxAggregateOutputType | null
  }

  type GetPerguntaGroupByPayload<T extends PerguntaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PerguntaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PerguntaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PerguntaGroupByOutputType[P]>
            : GetScalarType<T[P], PerguntaGroupByOutputType[P]>
        }
      >
    >


  export type PerguntaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    tipo?: boolean
    opcoes?: boolean
    ordem?: boolean
    categoria?: boolean
    fluxo?: boolean
    pontuacao?: boolean
    obrigatoria?: boolean
    condicional?: boolean
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    respostas?: boolean | Pergunta$respostasArgs<ExtArgs>
    imoveis?: boolean | Pergunta$imoveisArgs<ExtArgs>
    _count?: boolean | PerguntaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pergunta"]>

  export type PerguntaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    tipo?: boolean
    opcoes?: boolean
    ordem?: boolean
    categoria?: boolean
    fluxo?: boolean
    pontuacao?: boolean
    obrigatoria?: boolean
    condicional?: boolean
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pergunta"]>

  export type PerguntaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    tipo?: boolean
    opcoes?: boolean
    ordem?: boolean
    categoria?: boolean
    fluxo?: boolean
    pontuacao?: boolean
    obrigatoria?: boolean
    condicional?: boolean
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pergunta"]>

  export type PerguntaSelectScalar = {
    id?: boolean
    texto?: boolean
    tipo?: boolean
    opcoes?: boolean
    ordem?: boolean
    categoria?: boolean
    fluxo?: boolean
    pontuacao?: boolean
    obrigatoria?: boolean
    condicional?: boolean
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PerguntaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "texto" | "tipo" | "opcoes" | "ordem" | "categoria" | "fluxo" | "pontuacao" | "obrigatoria" | "condicional" | "geradaPorIA" | "ativa" | "createdAt" | "updatedAt", ExtArgs["result"]["pergunta"]>
  export type PerguntaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respostas?: boolean | Pergunta$respostasArgs<ExtArgs>
    imoveis?: boolean | Pergunta$imoveisArgs<ExtArgs>
    _count?: boolean | PerguntaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PerguntaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PerguntaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PerguntaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pergunta"
    objects: {
      respostas: Prisma.$RespostaPayload<ExtArgs>[]
      imoveis: Prisma.$ImovelPerguntaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      texto: string
      tipo: string
      opcoes: Prisma.JsonValue | null
      ordem: number
      categoria: string
      fluxo: string
      pontuacao: number
      obrigatoria: boolean
      condicional: Prisma.JsonValue | null
      geradaPorIA: boolean
      ativa: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pergunta"]>
    composites: {}
  }

  type PerguntaGetPayload<S extends boolean | null | undefined | PerguntaDefaultArgs> = $Result.GetResult<Prisma.$PerguntaPayload, S>

  type PerguntaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PerguntaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PerguntaCountAggregateInputType | true
    }

  export interface PerguntaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pergunta'], meta: { name: 'Pergunta' } }
    /**
     * Find zero or one Pergunta that matches the filter.
     * @param {PerguntaFindUniqueArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PerguntaFindUniqueArgs>(args: SelectSubset<T, PerguntaFindUniqueArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pergunta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PerguntaFindUniqueOrThrowArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PerguntaFindUniqueOrThrowArgs>(args: SelectSubset<T, PerguntaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pergunta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaFindFirstArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PerguntaFindFirstArgs>(args?: SelectSubset<T, PerguntaFindFirstArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pergunta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaFindFirstOrThrowArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PerguntaFindFirstOrThrowArgs>(args?: SelectSubset<T, PerguntaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Perguntas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Perguntas
     * const perguntas = await prisma.pergunta.findMany()
     * 
     * // Get first 10 Perguntas
     * const perguntas = await prisma.pergunta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const perguntaWithIdOnly = await prisma.pergunta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PerguntaFindManyArgs>(args?: SelectSubset<T, PerguntaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pergunta.
     * @param {PerguntaCreateArgs} args - Arguments to create a Pergunta.
     * @example
     * // Create one Pergunta
     * const Pergunta = await prisma.pergunta.create({
     *   data: {
     *     // ... data to create a Pergunta
     *   }
     * })
     * 
     */
    create<T extends PerguntaCreateArgs>(args: SelectSubset<T, PerguntaCreateArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Perguntas.
     * @param {PerguntaCreateManyArgs} args - Arguments to create many Perguntas.
     * @example
     * // Create many Perguntas
     * const pergunta = await prisma.pergunta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PerguntaCreateManyArgs>(args?: SelectSubset<T, PerguntaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Perguntas and returns the data saved in the database.
     * @param {PerguntaCreateManyAndReturnArgs} args - Arguments to create many Perguntas.
     * @example
     * // Create many Perguntas
     * const pergunta = await prisma.pergunta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Perguntas and only return the `id`
     * const perguntaWithIdOnly = await prisma.pergunta.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PerguntaCreateManyAndReturnArgs>(args?: SelectSubset<T, PerguntaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pergunta.
     * @param {PerguntaDeleteArgs} args - Arguments to delete one Pergunta.
     * @example
     * // Delete one Pergunta
     * const Pergunta = await prisma.pergunta.delete({
     *   where: {
     *     // ... filter to delete one Pergunta
     *   }
     * })
     * 
     */
    delete<T extends PerguntaDeleteArgs>(args: SelectSubset<T, PerguntaDeleteArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pergunta.
     * @param {PerguntaUpdateArgs} args - Arguments to update one Pergunta.
     * @example
     * // Update one Pergunta
     * const pergunta = await prisma.pergunta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PerguntaUpdateArgs>(args: SelectSubset<T, PerguntaUpdateArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Perguntas.
     * @param {PerguntaDeleteManyArgs} args - Arguments to filter Perguntas to delete.
     * @example
     * // Delete a few Perguntas
     * const { count } = await prisma.pergunta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PerguntaDeleteManyArgs>(args?: SelectSubset<T, PerguntaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Perguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Perguntas
     * const pergunta = await prisma.pergunta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PerguntaUpdateManyArgs>(args: SelectSubset<T, PerguntaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Perguntas and returns the data updated in the database.
     * @param {PerguntaUpdateManyAndReturnArgs} args - Arguments to update many Perguntas.
     * @example
     * // Update many Perguntas
     * const pergunta = await prisma.pergunta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Perguntas and only return the `id`
     * const perguntaWithIdOnly = await prisma.pergunta.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PerguntaUpdateManyAndReturnArgs>(args: SelectSubset<T, PerguntaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pergunta.
     * @param {PerguntaUpsertArgs} args - Arguments to update or create a Pergunta.
     * @example
     * // Update or create a Pergunta
     * const pergunta = await prisma.pergunta.upsert({
     *   create: {
     *     // ... data to create a Pergunta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pergunta we want to update
     *   }
     * })
     */
    upsert<T extends PerguntaUpsertArgs>(args: SelectSubset<T, PerguntaUpsertArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Perguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaCountArgs} args - Arguments to filter Perguntas to count.
     * @example
     * // Count the number of Perguntas
     * const count = await prisma.pergunta.count({
     *   where: {
     *     // ... the filter for the Perguntas we want to count
     *   }
     * })
    **/
    count<T extends PerguntaCountArgs>(
      args?: Subset<T, PerguntaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PerguntaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PerguntaAggregateArgs>(args: Subset<T, PerguntaAggregateArgs>): Prisma.PrismaPromise<GetPerguntaAggregateType<T>>

    /**
     * Group by Pergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PerguntaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PerguntaGroupByArgs['orderBy'] }
        : { orderBy?: PerguntaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PerguntaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPerguntaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pergunta model
   */
  readonly fields: PerguntaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pergunta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PerguntaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    respostas<T extends Pergunta$respostasArgs<ExtArgs> = {}>(args?: Subset<T, Pergunta$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    imoveis<T extends Pergunta$imoveisArgs<ExtArgs> = {}>(args?: Subset<T, Pergunta$imoveisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pergunta model
   */
  interface PerguntaFieldRefs {
    readonly id: FieldRef<"Pergunta", 'String'>
    readonly texto: FieldRef<"Pergunta", 'String'>
    readonly tipo: FieldRef<"Pergunta", 'String'>
    readonly opcoes: FieldRef<"Pergunta", 'Json'>
    readonly ordem: FieldRef<"Pergunta", 'Int'>
    readonly categoria: FieldRef<"Pergunta", 'String'>
    readonly fluxo: FieldRef<"Pergunta", 'String'>
    readonly pontuacao: FieldRef<"Pergunta", 'Int'>
    readonly obrigatoria: FieldRef<"Pergunta", 'Boolean'>
    readonly condicional: FieldRef<"Pergunta", 'Json'>
    readonly geradaPorIA: FieldRef<"Pergunta", 'Boolean'>
    readonly ativa: FieldRef<"Pergunta", 'Boolean'>
    readonly createdAt: FieldRef<"Pergunta", 'DateTime'>
    readonly updatedAt: FieldRef<"Pergunta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pergunta findUnique
   */
  export type PerguntaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta findUniqueOrThrow
   */
  export type PerguntaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta findFirst
   */
  export type PerguntaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Perguntas.
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Perguntas.
     */
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta findFirstOrThrow
   */
  export type PerguntaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Perguntas.
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Perguntas.
     */
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta findMany
   */
  export type PerguntaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Perguntas to fetch.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Perguntas.
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta create
   */
  export type PerguntaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * The data needed to create a Pergunta.
     */
    data: XOR<PerguntaCreateInput, PerguntaUncheckedCreateInput>
  }

  /**
   * Pergunta createMany
   */
  export type PerguntaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Perguntas.
     */
    data: PerguntaCreateManyInput | PerguntaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pergunta createManyAndReturn
   */
  export type PerguntaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * The data used to create many Perguntas.
     */
    data: PerguntaCreateManyInput | PerguntaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pergunta update
   */
  export type PerguntaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * The data needed to update a Pergunta.
     */
    data: XOR<PerguntaUpdateInput, PerguntaUncheckedUpdateInput>
    /**
     * Choose, which Pergunta to update.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta updateMany
   */
  export type PerguntaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Perguntas.
     */
    data: XOR<PerguntaUpdateManyMutationInput, PerguntaUncheckedUpdateManyInput>
    /**
     * Filter which Perguntas to update
     */
    where?: PerguntaWhereInput
    /**
     * Limit how many Perguntas to update.
     */
    limit?: number
  }

  /**
   * Pergunta updateManyAndReturn
   */
  export type PerguntaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * The data used to update Perguntas.
     */
    data: XOR<PerguntaUpdateManyMutationInput, PerguntaUncheckedUpdateManyInput>
    /**
     * Filter which Perguntas to update
     */
    where?: PerguntaWhereInput
    /**
     * Limit how many Perguntas to update.
     */
    limit?: number
  }

  /**
   * Pergunta upsert
   */
  export type PerguntaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * The filter to search for the Pergunta to update in case it exists.
     */
    where: PerguntaWhereUniqueInput
    /**
     * In case the Pergunta found by the `where` argument doesn't exist, create a new Pergunta with this data.
     */
    create: XOR<PerguntaCreateInput, PerguntaUncheckedCreateInput>
    /**
     * In case the Pergunta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PerguntaUpdateInput, PerguntaUncheckedUpdateInput>
  }

  /**
   * Pergunta delete
   */
  export type PerguntaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter which Pergunta to delete.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta deleteMany
   */
  export type PerguntaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Perguntas to delete
     */
    where?: PerguntaWhereInput
    /**
     * Limit how many Perguntas to delete.
     */
    limit?: number
  }

  /**
   * Pergunta.respostas
   */
  export type Pergunta$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    cursor?: RespostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Pergunta.imoveis
   */
  export type Pergunta$imoveisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    where?: ImovelPerguntaWhereInput
    orderBy?: ImovelPerguntaOrderByWithRelationInput | ImovelPerguntaOrderByWithRelationInput[]
    cursor?: ImovelPerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImovelPerguntaScalarFieldEnum | ImovelPerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta without action
   */
  export type PerguntaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
  }


  /**
   * Model Resposta
   */

  export type AggregateResposta = {
    _count: RespostaCountAggregateOutputType | null
    _min: RespostaMinAggregateOutputType | null
    _max: RespostaMaxAggregateOutputType | null
  }

  export type RespostaMinAggregateOutputType = {
    id: string | null
    valor: string | null
    createdAt: Date | null
    updatedAt: Date | null
    perguntaId: string | null
    userId: string | null
  }

  export type RespostaMaxAggregateOutputType = {
    id: string | null
    valor: string | null
    createdAt: Date | null
    updatedAt: Date | null
    perguntaId: string | null
    userId: string | null
  }

  export type RespostaCountAggregateOutputType = {
    id: number
    valor: number
    createdAt: number
    updatedAt: number
    perguntaId: number
    userId: number
    _all: number
  }


  export type RespostaMinAggregateInputType = {
    id?: true
    valor?: true
    createdAt?: true
    updatedAt?: true
    perguntaId?: true
    userId?: true
  }

  export type RespostaMaxAggregateInputType = {
    id?: true
    valor?: true
    createdAt?: true
    updatedAt?: true
    perguntaId?: true
    userId?: true
  }

  export type RespostaCountAggregateInputType = {
    id?: true
    valor?: true
    createdAt?: true
    updatedAt?: true
    perguntaId?: true
    userId?: true
    _all?: true
  }

  export type RespostaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resposta to aggregate.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Respostas
    **/
    _count?: true | RespostaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RespostaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RespostaMaxAggregateInputType
  }

  export type GetRespostaAggregateType<T extends RespostaAggregateArgs> = {
        [P in keyof T & keyof AggregateResposta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResposta[P]>
      : GetScalarType<T[P], AggregateResposta[P]>
  }




  export type RespostaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithAggregationInput | RespostaOrderByWithAggregationInput[]
    by: RespostaScalarFieldEnum[] | RespostaScalarFieldEnum
    having?: RespostaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RespostaCountAggregateInputType | true
    _min?: RespostaMinAggregateInputType
    _max?: RespostaMaxAggregateInputType
  }

  export type RespostaGroupByOutputType = {
    id: string
    valor: string
    createdAt: Date
    updatedAt: Date
    perguntaId: string
    userId: string
    _count: RespostaCountAggregateOutputType | null
    _min: RespostaMinAggregateOutputType | null
    _max: RespostaMaxAggregateOutputType | null
  }

  type GetRespostaGroupByPayload<T extends RespostaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RespostaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RespostaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RespostaGroupByOutputType[P]>
            : GetScalarType<T[P], RespostaGroupByOutputType[P]>
        }
      >
    >


  export type RespostaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    valor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    perguntaId?: boolean
    userId?: boolean
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>

  export type RespostaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    valor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    perguntaId?: boolean
    userId?: boolean
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>

  export type RespostaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    valor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    perguntaId?: boolean
    userId?: boolean
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>

  export type RespostaSelectScalar = {
    id?: boolean
    valor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    perguntaId?: boolean
    userId?: boolean
  }

  export type RespostaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "valor" | "createdAt" | "updatedAt" | "perguntaId" | "userId", ExtArgs["result"]["resposta"]>
  export type RespostaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RespostaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RespostaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RespostaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resposta"
    objects: {
      pergunta: Prisma.$PerguntaPayload<ExtArgs>
      usuario: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      valor: string
      createdAt: Date
      updatedAt: Date
      perguntaId: string
      userId: string
    }, ExtArgs["result"]["resposta"]>
    composites: {}
  }

  type RespostaGetPayload<S extends boolean | null | undefined | RespostaDefaultArgs> = $Result.GetResult<Prisma.$RespostaPayload, S>

  type RespostaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RespostaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RespostaCountAggregateInputType | true
    }

  export interface RespostaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resposta'], meta: { name: 'Resposta' } }
    /**
     * Find zero or one Resposta that matches the filter.
     * @param {RespostaFindUniqueArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RespostaFindUniqueArgs>(args: SelectSubset<T, RespostaFindUniqueArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resposta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RespostaFindUniqueOrThrowArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RespostaFindUniqueOrThrowArgs>(args: SelectSubset<T, RespostaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resposta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindFirstArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RespostaFindFirstArgs>(args?: SelectSubset<T, RespostaFindFirstArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resposta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindFirstOrThrowArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RespostaFindFirstOrThrowArgs>(args?: SelectSubset<T, RespostaFindFirstOrThrowArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Respostas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Respostas
     * const respostas = await prisma.resposta.findMany()
     * 
     * // Get first 10 Respostas
     * const respostas = await prisma.resposta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const respostaWithIdOnly = await prisma.resposta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RespostaFindManyArgs>(args?: SelectSubset<T, RespostaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resposta.
     * @param {RespostaCreateArgs} args - Arguments to create a Resposta.
     * @example
     * // Create one Resposta
     * const Resposta = await prisma.resposta.create({
     *   data: {
     *     // ... data to create a Resposta
     *   }
     * })
     * 
     */
    create<T extends RespostaCreateArgs>(args: SelectSubset<T, RespostaCreateArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Respostas.
     * @param {RespostaCreateManyArgs} args - Arguments to create many Respostas.
     * @example
     * // Create many Respostas
     * const resposta = await prisma.resposta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RespostaCreateManyArgs>(args?: SelectSubset<T, RespostaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Respostas and returns the data saved in the database.
     * @param {RespostaCreateManyAndReturnArgs} args - Arguments to create many Respostas.
     * @example
     * // Create many Respostas
     * const resposta = await prisma.resposta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Respostas and only return the `id`
     * const respostaWithIdOnly = await prisma.resposta.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RespostaCreateManyAndReturnArgs>(args?: SelectSubset<T, RespostaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resposta.
     * @param {RespostaDeleteArgs} args - Arguments to delete one Resposta.
     * @example
     * // Delete one Resposta
     * const Resposta = await prisma.resposta.delete({
     *   where: {
     *     // ... filter to delete one Resposta
     *   }
     * })
     * 
     */
    delete<T extends RespostaDeleteArgs>(args: SelectSubset<T, RespostaDeleteArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resposta.
     * @param {RespostaUpdateArgs} args - Arguments to update one Resposta.
     * @example
     * // Update one Resposta
     * const resposta = await prisma.resposta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RespostaUpdateArgs>(args: SelectSubset<T, RespostaUpdateArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Respostas.
     * @param {RespostaDeleteManyArgs} args - Arguments to filter Respostas to delete.
     * @example
     * // Delete a few Respostas
     * const { count } = await prisma.resposta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RespostaDeleteManyArgs>(args?: SelectSubset<T, RespostaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Respostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Respostas
     * const resposta = await prisma.resposta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RespostaUpdateManyArgs>(args: SelectSubset<T, RespostaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Respostas and returns the data updated in the database.
     * @param {RespostaUpdateManyAndReturnArgs} args - Arguments to update many Respostas.
     * @example
     * // Update many Respostas
     * const resposta = await prisma.resposta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Respostas and only return the `id`
     * const respostaWithIdOnly = await prisma.resposta.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RespostaUpdateManyAndReturnArgs>(args: SelectSubset<T, RespostaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resposta.
     * @param {RespostaUpsertArgs} args - Arguments to update or create a Resposta.
     * @example
     * // Update or create a Resposta
     * const resposta = await prisma.resposta.upsert({
     *   create: {
     *     // ... data to create a Resposta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resposta we want to update
     *   }
     * })
     */
    upsert<T extends RespostaUpsertArgs>(args: SelectSubset<T, RespostaUpsertArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Respostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaCountArgs} args - Arguments to filter Respostas to count.
     * @example
     * // Count the number of Respostas
     * const count = await prisma.resposta.count({
     *   where: {
     *     // ... the filter for the Respostas we want to count
     *   }
     * })
    **/
    count<T extends RespostaCountArgs>(
      args?: Subset<T, RespostaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RespostaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RespostaAggregateArgs>(args: Subset<T, RespostaAggregateArgs>): Prisma.PrismaPromise<GetRespostaAggregateType<T>>

    /**
     * Group by Resposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RespostaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RespostaGroupByArgs['orderBy'] }
        : { orderBy?: RespostaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RespostaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRespostaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resposta model
   */
  readonly fields: RespostaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resposta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RespostaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pergunta<T extends PerguntaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PerguntaDefaultArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usuario<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resposta model
   */
  interface RespostaFieldRefs {
    readonly id: FieldRef<"Resposta", 'String'>
    readonly valor: FieldRef<"Resposta", 'String'>
    readonly createdAt: FieldRef<"Resposta", 'DateTime'>
    readonly updatedAt: FieldRef<"Resposta", 'DateTime'>
    readonly perguntaId: FieldRef<"Resposta", 'String'>
    readonly userId: FieldRef<"Resposta", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Resposta findUnique
   */
  export type RespostaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta findUniqueOrThrow
   */
  export type RespostaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta findFirst
   */
  export type RespostaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respostas.
     */
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta findFirstOrThrow
   */
  export type RespostaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respostas.
     */
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta findMany
   */
  export type RespostaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Respostas to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta create
   */
  export type RespostaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The data needed to create a Resposta.
     */
    data: XOR<RespostaCreateInput, RespostaUncheckedCreateInput>
  }

  /**
   * Resposta createMany
   */
  export type RespostaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Respostas.
     */
    data: RespostaCreateManyInput | RespostaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resposta createManyAndReturn
   */
  export type RespostaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * The data used to create many Respostas.
     */
    data: RespostaCreateManyInput | RespostaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resposta update
   */
  export type RespostaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The data needed to update a Resposta.
     */
    data: XOR<RespostaUpdateInput, RespostaUncheckedUpdateInput>
    /**
     * Choose, which Resposta to update.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta updateMany
   */
  export type RespostaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Respostas.
     */
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyInput>
    /**
     * Filter which Respostas to update
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to update.
     */
    limit?: number
  }

  /**
   * Resposta updateManyAndReturn
   */
  export type RespostaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * The data used to update Respostas.
     */
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyInput>
    /**
     * Filter which Respostas to update
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resposta upsert
   */
  export type RespostaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The filter to search for the Resposta to update in case it exists.
     */
    where: RespostaWhereUniqueInput
    /**
     * In case the Resposta found by the `where` argument doesn't exist, create a new Resposta with this data.
     */
    create: XOR<RespostaCreateInput, RespostaUncheckedCreateInput>
    /**
     * In case the Resposta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RespostaUpdateInput, RespostaUncheckedUpdateInput>
  }

  /**
   * Resposta delete
   */
  export type RespostaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter which Resposta to delete.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta deleteMany
   */
  export type RespostaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Respostas to delete
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to delete.
     */
    limit?: number
  }

  /**
   * Resposta without action
   */
  export type RespostaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    porcentagem: number | null
    posicaoRanking: number | null
  }

  export type MatchSumAggregateOutputType = {
    porcentagem: number | null
    posicaoRanking: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    porcentagem: number | null
    posicaoRanking: number | null
    destaque: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    imovelId: string | null
    relatorioId: string | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    porcentagem: number | null
    posicaoRanking: number | null
    destaque: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    imovelId: string | null
    relatorioId: string | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    porcentagem: number
    posicaoRanking: number
    destaque: number
    criterios: number
    createdAt: number
    updatedAt: number
    imovelId: number
    relatorioId: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    porcentagem?: true
    posicaoRanking?: true
  }

  export type MatchSumAggregateInputType = {
    porcentagem?: true
    posicaoRanking?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    porcentagem?: true
    posicaoRanking?: true
    destaque?: true
    createdAt?: true
    updatedAt?: true
    imovelId?: true
    relatorioId?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    porcentagem?: true
    posicaoRanking?: true
    destaque?: true
    createdAt?: true
    updatedAt?: true
    imovelId?: true
    relatorioId?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    porcentagem?: true
    posicaoRanking?: true
    destaque?: true
    criterios?: true
    createdAt?: true
    updatedAt?: true
    imovelId?: true
    relatorioId?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    porcentagem: number
    posicaoRanking: number
    destaque: boolean
    criterios: JsonValue
    createdAt: Date
    updatedAt: Date
    imovelId: string
    relatorioId: string | null
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    porcentagem?: boolean
    posicaoRanking?: boolean
    destaque?: boolean
    criterios?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    relatorioId?: boolean
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    relatorio?: boolean | Match$relatorioArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    porcentagem?: boolean
    posicaoRanking?: boolean
    destaque?: boolean
    criterios?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    relatorioId?: boolean
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    relatorio?: boolean | Match$relatorioArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    porcentagem?: boolean
    posicaoRanking?: boolean
    destaque?: boolean
    criterios?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    relatorioId?: boolean
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    relatorio?: boolean | Match$relatorioArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    porcentagem?: boolean
    posicaoRanking?: boolean
    destaque?: boolean
    criterios?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    relatorioId?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "porcentagem" | "posicaoRanking" | "destaque" | "criterios" | "createdAt" | "updatedAt" | "imovelId" | "relatorioId", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    relatorio?: boolean | Match$relatorioArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    relatorio?: boolean | Match$relatorioArgs<ExtArgs>
  }
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    relatorio?: boolean | Match$relatorioArgs<ExtArgs>
  }

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      imovel: Prisma.$ImovelPayload<ExtArgs>
      relatorio: Prisma.$RelatorioPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      porcentagem: number
      posicaoRanking: number
      destaque: boolean
      criterios: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
      imovelId: string
      relatorioId: string | null
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    imovel<T extends ImovelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImovelDefaultArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    relatorio<T extends Match$relatorioArgs<ExtArgs> = {}>(args?: Subset<T, Match$relatorioArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly porcentagem: FieldRef<"Match", 'Float'>
    readonly posicaoRanking: FieldRef<"Match", 'Int'>
    readonly destaque: FieldRef<"Match", 'Boolean'>
    readonly criterios: FieldRef<"Match", 'Json'>
    readonly createdAt: FieldRef<"Match", 'DateTime'>
    readonly updatedAt: FieldRef<"Match", 'DateTime'>
    readonly imovelId: FieldRef<"Match", 'String'>
    readonly relatorioId: FieldRef<"Match", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.relatorio
   */
  export type Match$relatorioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    where?: RelatorioWhereInput
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model Relatorio
   */

  export type AggregateRelatorio = {
    _count: RelatorioCountAggregateOutputType | null
    _min: RelatorioMinAggregateOutputType | null
    _max: RelatorioMaxAggregateOutputType | null
  }

  export type RelatorioMinAggregateOutputType = {
    id: string | null
    resumo: string | null
    pdfUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type RelatorioMaxAggregateOutputType = {
    id: string | null
    resumo: string | null
    pdfUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type RelatorioCountAggregateOutputType = {
    id: number
    resumo: number
    pdfUrl: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type RelatorioMinAggregateInputType = {
    id?: true
    resumo?: true
    pdfUrl?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type RelatorioMaxAggregateInputType = {
    id?: true
    resumo?: true
    pdfUrl?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type RelatorioCountAggregateInputType = {
    id?: true
    resumo?: true
    pdfUrl?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type RelatorioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Relatorio to aggregate.
     */
    where?: RelatorioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relatorios to fetch.
     */
    orderBy?: RelatorioOrderByWithRelationInput | RelatorioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RelatorioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relatorios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relatorios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Relatorios
    **/
    _count?: true | RelatorioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RelatorioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RelatorioMaxAggregateInputType
  }

  export type GetRelatorioAggregateType<T extends RelatorioAggregateArgs> = {
        [P in keyof T & keyof AggregateRelatorio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelatorio[P]>
      : GetScalarType<T[P], AggregateRelatorio[P]>
  }




  export type RelatorioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelatorioWhereInput
    orderBy?: RelatorioOrderByWithAggregationInput | RelatorioOrderByWithAggregationInput[]
    by: RelatorioScalarFieldEnum[] | RelatorioScalarFieldEnum
    having?: RelatorioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RelatorioCountAggregateInputType | true
    _min?: RelatorioMinAggregateInputType
    _max?: RelatorioMaxAggregateInputType
  }

  export type RelatorioGroupByOutputType = {
    id: string
    resumo: string
    pdfUrl: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: RelatorioCountAggregateOutputType | null
    _min: RelatorioMinAggregateOutputType | null
    _max: RelatorioMaxAggregateOutputType | null
  }

  type GetRelatorioGroupByPayload<T extends RelatorioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RelatorioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RelatorioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RelatorioGroupByOutputType[P]>
            : GetScalarType<T[P], RelatorioGroupByOutputType[P]>
        }
      >
    >


  export type RelatorioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resumo?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    matches?: boolean | Relatorio$matchesArgs<ExtArgs>
    _count?: boolean | RelatorioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["relatorio"]>

  export type RelatorioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resumo?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["relatorio"]>

  export type RelatorioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resumo?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["relatorio"]>

  export type RelatorioSelectScalar = {
    id?: boolean
    resumo?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type RelatorioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "resumo" | "pdfUrl" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["relatorio"]>
  export type RelatorioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    matches?: boolean | Relatorio$matchesArgs<ExtArgs>
    _count?: boolean | RelatorioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RelatorioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RelatorioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RelatorioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Relatorio"
    objects: {
      usuario: Prisma.$UserPayload<ExtArgs>
      matches: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      resumo: string
      pdfUrl: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["relatorio"]>
    composites: {}
  }

  type RelatorioGetPayload<S extends boolean | null | undefined | RelatorioDefaultArgs> = $Result.GetResult<Prisma.$RelatorioPayload, S>

  type RelatorioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RelatorioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RelatorioCountAggregateInputType | true
    }

  export interface RelatorioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Relatorio'], meta: { name: 'Relatorio' } }
    /**
     * Find zero or one Relatorio that matches the filter.
     * @param {RelatorioFindUniqueArgs} args - Arguments to find a Relatorio
     * @example
     * // Get one Relatorio
     * const relatorio = await prisma.relatorio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RelatorioFindUniqueArgs>(args: SelectSubset<T, RelatorioFindUniqueArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Relatorio that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RelatorioFindUniqueOrThrowArgs} args - Arguments to find a Relatorio
     * @example
     * // Get one Relatorio
     * const relatorio = await prisma.relatorio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RelatorioFindUniqueOrThrowArgs>(args: SelectSubset<T, RelatorioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Relatorio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioFindFirstArgs} args - Arguments to find a Relatorio
     * @example
     * // Get one Relatorio
     * const relatorio = await prisma.relatorio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RelatorioFindFirstArgs>(args?: SelectSubset<T, RelatorioFindFirstArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Relatorio that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioFindFirstOrThrowArgs} args - Arguments to find a Relatorio
     * @example
     * // Get one Relatorio
     * const relatorio = await prisma.relatorio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RelatorioFindFirstOrThrowArgs>(args?: SelectSubset<T, RelatorioFindFirstOrThrowArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Relatorios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Relatorios
     * const relatorios = await prisma.relatorio.findMany()
     * 
     * // Get first 10 Relatorios
     * const relatorios = await prisma.relatorio.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const relatorioWithIdOnly = await prisma.relatorio.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RelatorioFindManyArgs>(args?: SelectSubset<T, RelatorioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Relatorio.
     * @param {RelatorioCreateArgs} args - Arguments to create a Relatorio.
     * @example
     * // Create one Relatorio
     * const Relatorio = await prisma.relatorio.create({
     *   data: {
     *     // ... data to create a Relatorio
     *   }
     * })
     * 
     */
    create<T extends RelatorioCreateArgs>(args: SelectSubset<T, RelatorioCreateArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Relatorios.
     * @param {RelatorioCreateManyArgs} args - Arguments to create many Relatorios.
     * @example
     * // Create many Relatorios
     * const relatorio = await prisma.relatorio.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RelatorioCreateManyArgs>(args?: SelectSubset<T, RelatorioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Relatorios and returns the data saved in the database.
     * @param {RelatorioCreateManyAndReturnArgs} args - Arguments to create many Relatorios.
     * @example
     * // Create many Relatorios
     * const relatorio = await prisma.relatorio.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Relatorios and only return the `id`
     * const relatorioWithIdOnly = await prisma.relatorio.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RelatorioCreateManyAndReturnArgs>(args?: SelectSubset<T, RelatorioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Relatorio.
     * @param {RelatorioDeleteArgs} args - Arguments to delete one Relatorio.
     * @example
     * // Delete one Relatorio
     * const Relatorio = await prisma.relatorio.delete({
     *   where: {
     *     // ... filter to delete one Relatorio
     *   }
     * })
     * 
     */
    delete<T extends RelatorioDeleteArgs>(args: SelectSubset<T, RelatorioDeleteArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Relatorio.
     * @param {RelatorioUpdateArgs} args - Arguments to update one Relatorio.
     * @example
     * // Update one Relatorio
     * const relatorio = await prisma.relatorio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RelatorioUpdateArgs>(args: SelectSubset<T, RelatorioUpdateArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Relatorios.
     * @param {RelatorioDeleteManyArgs} args - Arguments to filter Relatorios to delete.
     * @example
     * // Delete a few Relatorios
     * const { count } = await prisma.relatorio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RelatorioDeleteManyArgs>(args?: SelectSubset<T, RelatorioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Relatorios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Relatorios
     * const relatorio = await prisma.relatorio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RelatorioUpdateManyArgs>(args: SelectSubset<T, RelatorioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Relatorios and returns the data updated in the database.
     * @param {RelatorioUpdateManyAndReturnArgs} args - Arguments to update many Relatorios.
     * @example
     * // Update many Relatorios
     * const relatorio = await prisma.relatorio.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Relatorios and only return the `id`
     * const relatorioWithIdOnly = await prisma.relatorio.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RelatorioUpdateManyAndReturnArgs>(args: SelectSubset<T, RelatorioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Relatorio.
     * @param {RelatorioUpsertArgs} args - Arguments to update or create a Relatorio.
     * @example
     * // Update or create a Relatorio
     * const relatorio = await prisma.relatorio.upsert({
     *   create: {
     *     // ... data to create a Relatorio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Relatorio we want to update
     *   }
     * })
     */
    upsert<T extends RelatorioUpsertArgs>(args: SelectSubset<T, RelatorioUpsertArgs<ExtArgs>>): Prisma__RelatorioClient<$Result.GetResult<Prisma.$RelatorioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Relatorios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioCountArgs} args - Arguments to filter Relatorios to count.
     * @example
     * // Count the number of Relatorios
     * const count = await prisma.relatorio.count({
     *   where: {
     *     // ... the filter for the Relatorios we want to count
     *   }
     * })
    **/
    count<T extends RelatorioCountArgs>(
      args?: Subset<T, RelatorioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RelatorioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Relatorio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RelatorioAggregateArgs>(args: Subset<T, RelatorioAggregateArgs>): Prisma.PrismaPromise<GetRelatorioAggregateType<T>>

    /**
     * Group by Relatorio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelatorioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RelatorioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RelatorioGroupByArgs['orderBy'] }
        : { orderBy?: RelatorioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RelatorioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRelatorioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Relatorio model
   */
  readonly fields: RelatorioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Relatorio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RelatorioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    matches<T extends Relatorio$matchesArgs<ExtArgs> = {}>(args?: Subset<T, Relatorio$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Relatorio model
   */
  interface RelatorioFieldRefs {
    readonly id: FieldRef<"Relatorio", 'String'>
    readonly resumo: FieldRef<"Relatorio", 'String'>
    readonly pdfUrl: FieldRef<"Relatorio", 'String'>
    readonly createdAt: FieldRef<"Relatorio", 'DateTime'>
    readonly updatedAt: FieldRef<"Relatorio", 'DateTime'>
    readonly userId: FieldRef<"Relatorio", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Relatorio findUnique
   */
  export type RelatorioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * Filter, which Relatorio to fetch.
     */
    where: RelatorioWhereUniqueInput
  }

  /**
   * Relatorio findUniqueOrThrow
   */
  export type RelatorioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * Filter, which Relatorio to fetch.
     */
    where: RelatorioWhereUniqueInput
  }

  /**
   * Relatorio findFirst
   */
  export type RelatorioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * Filter, which Relatorio to fetch.
     */
    where?: RelatorioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relatorios to fetch.
     */
    orderBy?: RelatorioOrderByWithRelationInput | RelatorioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Relatorios.
     */
    cursor?: RelatorioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relatorios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relatorios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Relatorios.
     */
    distinct?: RelatorioScalarFieldEnum | RelatorioScalarFieldEnum[]
  }

  /**
   * Relatorio findFirstOrThrow
   */
  export type RelatorioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * Filter, which Relatorio to fetch.
     */
    where?: RelatorioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relatorios to fetch.
     */
    orderBy?: RelatorioOrderByWithRelationInput | RelatorioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Relatorios.
     */
    cursor?: RelatorioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relatorios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relatorios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Relatorios.
     */
    distinct?: RelatorioScalarFieldEnum | RelatorioScalarFieldEnum[]
  }

  /**
   * Relatorio findMany
   */
  export type RelatorioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * Filter, which Relatorios to fetch.
     */
    where?: RelatorioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relatorios to fetch.
     */
    orderBy?: RelatorioOrderByWithRelationInput | RelatorioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Relatorios.
     */
    cursor?: RelatorioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relatorios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relatorios.
     */
    skip?: number
    distinct?: RelatorioScalarFieldEnum | RelatorioScalarFieldEnum[]
  }

  /**
   * Relatorio create
   */
  export type RelatorioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * The data needed to create a Relatorio.
     */
    data: XOR<RelatorioCreateInput, RelatorioUncheckedCreateInput>
  }

  /**
   * Relatorio createMany
   */
  export type RelatorioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Relatorios.
     */
    data: RelatorioCreateManyInput | RelatorioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Relatorio createManyAndReturn
   */
  export type RelatorioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * The data used to create many Relatorios.
     */
    data: RelatorioCreateManyInput | RelatorioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Relatorio update
   */
  export type RelatorioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * The data needed to update a Relatorio.
     */
    data: XOR<RelatorioUpdateInput, RelatorioUncheckedUpdateInput>
    /**
     * Choose, which Relatorio to update.
     */
    where: RelatorioWhereUniqueInput
  }

  /**
   * Relatorio updateMany
   */
  export type RelatorioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Relatorios.
     */
    data: XOR<RelatorioUpdateManyMutationInput, RelatorioUncheckedUpdateManyInput>
    /**
     * Filter which Relatorios to update
     */
    where?: RelatorioWhereInput
    /**
     * Limit how many Relatorios to update.
     */
    limit?: number
  }

  /**
   * Relatorio updateManyAndReturn
   */
  export type RelatorioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * The data used to update Relatorios.
     */
    data: XOR<RelatorioUpdateManyMutationInput, RelatorioUncheckedUpdateManyInput>
    /**
     * Filter which Relatorios to update
     */
    where?: RelatorioWhereInput
    /**
     * Limit how many Relatorios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Relatorio upsert
   */
  export type RelatorioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * The filter to search for the Relatorio to update in case it exists.
     */
    where: RelatorioWhereUniqueInput
    /**
     * In case the Relatorio found by the `where` argument doesn't exist, create a new Relatorio with this data.
     */
    create: XOR<RelatorioCreateInput, RelatorioUncheckedCreateInput>
    /**
     * In case the Relatorio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RelatorioUpdateInput, RelatorioUncheckedUpdateInput>
  }

  /**
   * Relatorio delete
   */
  export type RelatorioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
    /**
     * Filter which Relatorio to delete.
     */
    where: RelatorioWhereUniqueInput
  }

  /**
   * Relatorio deleteMany
   */
  export type RelatorioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Relatorios to delete
     */
    where?: RelatorioWhereInput
    /**
     * Limit how many Relatorios to delete.
     */
    limit?: number
  }

  /**
   * Relatorio.matches
   */
  export type Relatorio$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Relatorio without action
   */
  export type RelatorioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relatorio
     */
    select?: RelatorioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relatorio
     */
    omit?: RelatorioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelatorioInclude<ExtArgs> | null
  }


  /**
   * Model Configuracao
   */

  export type AggregateConfiguracao = {
    _count: ConfiguracaoCountAggregateOutputType | null
    _min: ConfiguracaoMinAggregateOutputType | null
    _max: ConfiguracaoMaxAggregateOutputType | null
  }

  export type ConfiguracaoMinAggregateOutputType = {
    id: string | null
    chave: string | null
    valor: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConfiguracaoMaxAggregateOutputType = {
    id: string | null
    chave: string | null
    valor: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConfiguracaoCountAggregateOutputType = {
    id: number
    chave: number
    valor: number
    descricao: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConfiguracaoMinAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConfiguracaoMaxAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConfiguracaoCountAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConfiguracaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Configuracao to aggregate.
     */
    where?: ConfiguracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configuracaos to fetch.
     */
    orderBy?: ConfiguracaoOrderByWithRelationInput | ConfiguracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfiguracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configuracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configuracaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Configuracaos
    **/
    _count?: true | ConfiguracaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfiguracaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfiguracaoMaxAggregateInputType
  }

  export type GetConfiguracaoAggregateType<T extends ConfiguracaoAggregateArgs> = {
        [P in keyof T & keyof AggregateConfiguracao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfiguracao[P]>
      : GetScalarType<T[P], AggregateConfiguracao[P]>
  }




  export type ConfiguracaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfiguracaoWhereInput
    orderBy?: ConfiguracaoOrderByWithAggregationInput | ConfiguracaoOrderByWithAggregationInput[]
    by: ConfiguracaoScalarFieldEnum[] | ConfiguracaoScalarFieldEnum
    having?: ConfiguracaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfiguracaoCountAggregateInputType | true
    _min?: ConfiguracaoMinAggregateInputType
    _max?: ConfiguracaoMaxAggregateInputType
  }

  export type ConfiguracaoGroupByOutputType = {
    id: string
    chave: string
    valor: string
    descricao: string | null
    createdAt: Date
    updatedAt: Date
    _count: ConfiguracaoCountAggregateOutputType | null
    _min: ConfiguracaoMinAggregateOutputType | null
    _max: ConfiguracaoMaxAggregateOutputType | null
  }

  type GetConfiguracaoGroupByPayload<T extends ConfiguracaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfiguracaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfiguracaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfiguracaoGroupByOutputType[P]>
            : GetScalarType<T[P], ConfiguracaoGroupByOutputType[P]>
        }
      >
    >


  export type ConfiguracaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuracao"]>

  export type ConfiguracaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuracao"]>

  export type ConfiguracaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuracao"]>

  export type ConfiguracaoSelectScalar = {
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConfiguracaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chave" | "valor" | "descricao" | "createdAt" | "updatedAt", ExtArgs["result"]["configuracao"]>

  export type $ConfiguracaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Configuracao"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chave: string
      valor: string
      descricao: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["configuracao"]>
    composites: {}
  }

  type ConfiguracaoGetPayload<S extends boolean | null | undefined | ConfiguracaoDefaultArgs> = $Result.GetResult<Prisma.$ConfiguracaoPayload, S>

  type ConfiguracaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfiguracaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfiguracaoCountAggregateInputType | true
    }

  export interface ConfiguracaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Configuracao'], meta: { name: 'Configuracao' } }
    /**
     * Find zero or one Configuracao that matches the filter.
     * @param {ConfiguracaoFindUniqueArgs} args - Arguments to find a Configuracao
     * @example
     * // Get one Configuracao
     * const configuracao = await prisma.configuracao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfiguracaoFindUniqueArgs>(args: SelectSubset<T, ConfiguracaoFindUniqueArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Configuracao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfiguracaoFindUniqueOrThrowArgs} args - Arguments to find a Configuracao
     * @example
     * // Get one Configuracao
     * const configuracao = await prisma.configuracao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfiguracaoFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfiguracaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Configuracao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoFindFirstArgs} args - Arguments to find a Configuracao
     * @example
     * // Get one Configuracao
     * const configuracao = await prisma.configuracao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfiguracaoFindFirstArgs>(args?: SelectSubset<T, ConfiguracaoFindFirstArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Configuracao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoFindFirstOrThrowArgs} args - Arguments to find a Configuracao
     * @example
     * // Get one Configuracao
     * const configuracao = await prisma.configuracao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfiguracaoFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfiguracaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Configuracaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Configuracaos
     * const configuracaos = await prisma.configuracao.findMany()
     * 
     * // Get first 10 Configuracaos
     * const configuracaos = await prisma.configuracao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const configuracaoWithIdOnly = await prisma.configuracao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfiguracaoFindManyArgs>(args?: SelectSubset<T, ConfiguracaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Configuracao.
     * @param {ConfiguracaoCreateArgs} args - Arguments to create a Configuracao.
     * @example
     * // Create one Configuracao
     * const Configuracao = await prisma.configuracao.create({
     *   data: {
     *     // ... data to create a Configuracao
     *   }
     * })
     * 
     */
    create<T extends ConfiguracaoCreateArgs>(args: SelectSubset<T, ConfiguracaoCreateArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Configuracaos.
     * @param {ConfiguracaoCreateManyArgs} args - Arguments to create many Configuracaos.
     * @example
     * // Create many Configuracaos
     * const configuracao = await prisma.configuracao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfiguracaoCreateManyArgs>(args?: SelectSubset<T, ConfiguracaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Configuracaos and returns the data saved in the database.
     * @param {ConfiguracaoCreateManyAndReturnArgs} args - Arguments to create many Configuracaos.
     * @example
     * // Create many Configuracaos
     * const configuracao = await prisma.configuracao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Configuracaos and only return the `id`
     * const configuracaoWithIdOnly = await prisma.configuracao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfiguracaoCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfiguracaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Configuracao.
     * @param {ConfiguracaoDeleteArgs} args - Arguments to delete one Configuracao.
     * @example
     * // Delete one Configuracao
     * const Configuracao = await prisma.configuracao.delete({
     *   where: {
     *     // ... filter to delete one Configuracao
     *   }
     * })
     * 
     */
    delete<T extends ConfiguracaoDeleteArgs>(args: SelectSubset<T, ConfiguracaoDeleteArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Configuracao.
     * @param {ConfiguracaoUpdateArgs} args - Arguments to update one Configuracao.
     * @example
     * // Update one Configuracao
     * const configuracao = await prisma.configuracao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfiguracaoUpdateArgs>(args: SelectSubset<T, ConfiguracaoUpdateArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Configuracaos.
     * @param {ConfiguracaoDeleteManyArgs} args - Arguments to filter Configuracaos to delete.
     * @example
     * // Delete a few Configuracaos
     * const { count } = await prisma.configuracao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfiguracaoDeleteManyArgs>(args?: SelectSubset<T, ConfiguracaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Configuracaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Configuracaos
     * const configuracao = await prisma.configuracao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfiguracaoUpdateManyArgs>(args: SelectSubset<T, ConfiguracaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Configuracaos and returns the data updated in the database.
     * @param {ConfiguracaoUpdateManyAndReturnArgs} args - Arguments to update many Configuracaos.
     * @example
     * // Update many Configuracaos
     * const configuracao = await prisma.configuracao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Configuracaos and only return the `id`
     * const configuracaoWithIdOnly = await prisma.configuracao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConfiguracaoUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfiguracaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Configuracao.
     * @param {ConfiguracaoUpsertArgs} args - Arguments to update or create a Configuracao.
     * @example
     * // Update or create a Configuracao
     * const configuracao = await prisma.configuracao.upsert({
     *   create: {
     *     // ... data to create a Configuracao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Configuracao we want to update
     *   }
     * })
     */
    upsert<T extends ConfiguracaoUpsertArgs>(args: SelectSubset<T, ConfiguracaoUpsertArgs<ExtArgs>>): Prisma__ConfiguracaoClient<$Result.GetResult<Prisma.$ConfiguracaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Configuracaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCountArgs} args - Arguments to filter Configuracaos to count.
     * @example
     * // Count the number of Configuracaos
     * const count = await prisma.configuracao.count({
     *   where: {
     *     // ... the filter for the Configuracaos we want to count
     *   }
     * })
    **/
    count<T extends ConfiguracaoCountArgs>(
      args?: Subset<T, ConfiguracaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfiguracaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Configuracao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfiguracaoAggregateArgs>(args: Subset<T, ConfiguracaoAggregateArgs>): Prisma.PrismaPromise<GetConfiguracaoAggregateType<T>>

    /**
     * Group by Configuracao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfiguracaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfiguracaoGroupByArgs['orderBy'] }
        : { orderBy?: ConfiguracaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfiguracaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfiguracaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Configuracao model
   */
  readonly fields: ConfiguracaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Configuracao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfiguracaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Configuracao model
   */
  interface ConfiguracaoFieldRefs {
    readonly id: FieldRef<"Configuracao", 'String'>
    readonly chave: FieldRef<"Configuracao", 'String'>
    readonly valor: FieldRef<"Configuracao", 'String'>
    readonly descricao: FieldRef<"Configuracao", 'String'>
    readonly createdAt: FieldRef<"Configuracao", 'DateTime'>
    readonly updatedAt: FieldRef<"Configuracao", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Configuracao findUnique
   */
  export type ConfiguracaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * Filter, which Configuracao to fetch.
     */
    where: ConfiguracaoWhereUniqueInput
  }

  /**
   * Configuracao findUniqueOrThrow
   */
  export type ConfiguracaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * Filter, which Configuracao to fetch.
     */
    where: ConfiguracaoWhereUniqueInput
  }

  /**
   * Configuracao findFirst
   */
  export type ConfiguracaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * Filter, which Configuracao to fetch.
     */
    where?: ConfiguracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configuracaos to fetch.
     */
    orderBy?: ConfiguracaoOrderByWithRelationInput | ConfiguracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Configuracaos.
     */
    cursor?: ConfiguracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configuracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configuracaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Configuracaos.
     */
    distinct?: ConfiguracaoScalarFieldEnum | ConfiguracaoScalarFieldEnum[]
  }

  /**
   * Configuracao findFirstOrThrow
   */
  export type ConfiguracaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * Filter, which Configuracao to fetch.
     */
    where?: ConfiguracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configuracaos to fetch.
     */
    orderBy?: ConfiguracaoOrderByWithRelationInput | ConfiguracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Configuracaos.
     */
    cursor?: ConfiguracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configuracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configuracaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Configuracaos.
     */
    distinct?: ConfiguracaoScalarFieldEnum | ConfiguracaoScalarFieldEnum[]
  }

  /**
   * Configuracao findMany
   */
  export type ConfiguracaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * Filter, which Configuracaos to fetch.
     */
    where?: ConfiguracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configuracaos to fetch.
     */
    orderBy?: ConfiguracaoOrderByWithRelationInput | ConfiguracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Configuracaos.
     */
    cursor?: ConfiguracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configuracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configuracaos.
     */
    skip?: number
    distinct?: ConfiguracaoScalarFieldEnum | ConfiguracaoScalarFieldEnum[]
  }

  /**
   * Configuracao create
   */
  export type ConfiguracaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * The data needed to create a Configuracao.
     */
    data: XOR<ConfiguracaoCreateInput, ConfiguracaoUncheckedCreateInput>
  }

  /**
   * Configuracao createMany
   */
  export type ConfiguracaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Configuracaos.
     */
    data: ConfiguracaoCreateManyInput | ConfiguracaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Configuracao createManyAndReturn
   */
  export type ConfiguracaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * The data used to create many Configuracaos.
     */
    data: ConfiguracaoCreateManyInput | ConfiguracaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Configuracao update
   */
  export type ConfiguracaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * The data needed to update a Configuracao.
     */
    data: XOR<ConfiguracaoUpdateInput, ConfiguracaoUncheckedUpdateInput>
    /**
     * Choose, which Configuracao to update.
     */
    where: ConfiguracaoWhereUniqueInput
  }

  /**
   * Configuracao updateMany
   */
  export type ConfiguracaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Configuracaos.
     */
    data: XOR<ConfiguracaoUpdateManyMutationInput, ConfiguracaoUncheckedUpdateManyInput>
    /**
     * Filter which Configuracaos to update
     */
    where?: ConfiguracaoWhereInput
    /**
     * Limit how many Configuracaos to update.
     */
    limit?: number
  }

  /**
   * Configuracao updateManyAndReturn
   */
  export type ConfiguracaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * The data used to update Configuracaos.
     */
    data: XOR<ConfiguracaoUpdateManyMutationInput, ConfiguracaoUncheckedUpdateManyInput>
    /**
     * Filter which Configuracaos to update
     */
    where?: ConfiguracaoWhereInput
    /**
     * Limit how many Configuracaos to update.
     */
    limit?: number
  }

  /**
   * Configuracao upsert
   */
  export type ConfiguracaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * The filter to search for the Configuracao to update in case it exists.
     */
    where: ConfiguracaoWhereUniqueInput
    /**
     * In case the Configuracao found by the `where` argument doesn't exist, create a new Configuracao with this data.
     */
    create: XOR<ConfiguracaoCreateInput, ConfiguracaoUncheckedCreateInput>
    /**
     * In case the Configuracao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfiguracaoUpdateInput, ConfiguracaoUncheckedUpdateInput>
  }

  /**
   * Configuracao delete
   */
  export type ConfiguracaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
    /**
     * Filter which Configuracao to delete.
     */
    where: ConfiguracaoWhereUniqueInput
  }

  /**
   * Configuracao deleteMany
   */
  export type ConfiguracaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Configuracaos to delete
     */
    where?: ConfiguracaoWhereInput
    /**
     * Limit how many Configuracaos to delete.
     */
    limit?: number
  }

  /**
   * Configuracao without action
   */
  export type ConfiguracaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuracao
     */
    select?: ConfiguracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuracao
     */
    omit?: ConfiguracaoOmit<ExtArgs> | null
  }


  /**
   * Model LogIntegracao
   */

  export type AggregateLogIntegracao = {
    _count: LogIntegracaoCountAggregateOutputType | null
    _min: LogIntegracaoMinAggregateOutputType | null
    _max: LogIntegracaoMaxAggregateOutputType | null
  }

  export type LogIntegracaoMinAggregateOutputType = {
    id: string | null
    tipo: string | null
    status: string | null
    erro: string | null
    createdAt: Date | null
  }

  export type LogIntegracaoMaxAggregateOutputType = {
    id: string | null
    tipo: string | null
    status: string | null
    erro: string | null
    createdAt: Date | null
  }

  export type LogIntegracaoCountAggregateOutputType = {
    id: number
    tipo: number
    status: number
    request: number
    response: number
    erro: number
    createdAt: number
    _all: number
  }


  export type LogIntegracaoMinAggregateInputType = {
    id?: true
    tipo?: true
    status?: true
    erro?: true
    createdAt?: true
  }

  export type LogIntegracaoMaxAggregateInputType = {
    id?: true
    tipo?: true
    status?: true
    erro?: true
    createdAt?: true
  }

  export type LogIntegracaoCountAggregateInputType = {
    id?: true
    tipo?: true
    status?: true
    request?: true
    response?: true
    erro?: true
    createdAt?: true
    _all?: true
  }

  export type LogIntegracaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LogIntegracao to aggregate.
     */
    where?: LogIntegracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LogIntegracaos to fetch.
     */
    orderBy?: LogIntegracaoOrderByWithRelationInput | LogIntegracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LogIntegracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LogIntegracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LogIntegracaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LogIntegracaos
    **/
    _count?: true | LogIntegracaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LogIntegracaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LogIntegracaoMaxAggregateInputType
  }

  export type GetLogIntegracaoAggregateType<T extends LogIntegracaoAggregateArgs> = {
        [P in keyof T & keyof AggregateLogIntegracao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLogIntegracao[P]>
      : GetScalarType<T[P], AggregateLogIntegracao[P]>
  }




  export type LogIntegracaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LogIntegracaoWhereInput
    orderBy?: LogIntegracaoOrderByWithAggregationInput | LogIntegracaoOrderByWithAggregationInput[]
    by: LogIntegracaoScalarFieldEnum[] | LogIntegracaoScalarFieldEnum
    having?: LogIntegracaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LogIntegracaoCountAggregateInputType | true
    _min?: LogIntegracaoMinAggregateInputType
    _max?: LogIntegracaoMaxAggregateInputType
  }

  export type LogIntegracaoGroupByOutputType = {
    id: string
    tipo: string
    status: string
    request: JsonValue | null
    response: JsonValue | null
    erro: string | null
    createdAt: Date
    _count: LogIntegracaoCountAggregateOutputType | null
    _min: LogIntegracaoMinAggregateOutputType | null
    _max: LogIntegracaoMaxAggregateOutputType | null
  }

  type GetLogIntegracaoGroupByPayload<T extends LogIntegracaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LogIntegracaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LogIntegracaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LogIntegracaoGroupByOutputType[P]>
            : GetScalarType<T[P], LogIntegracaoGroupByOutputType[P]>
        }
      >
    >


  export type LogIntegracaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    status?: boolean
    request?: boolean
    response?: boolean
    erro?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["logIntegracao"]>

  export type LogIntegracaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    status?: boolean
    request?: boolean
    response?: boolean
    erro?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["logIntegracao"]>

  export type LogIntegracaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    status?: boolean
    request?: boolean
    response?: boolean
    erro?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["logIntegracao"]>

  export type LogIntegracaoSelectScalar = {
    id?: boolean
    tipo?: boolean
    status?: boolean
    request?: boolean
    response?: boolean
    erro?: boolean
    createdAt?: boolean
  }

  export type LogIntegracaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tipo" | "status" | "request" | "response" | "erro" | "createdAt", ExtArgs["result"]["logIntegracao"]>

  export type $LogIntegracaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LogIntegracao"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tipo: string
      status: string
      request: Prisma.JsonValue | null
      response: Prisma.JsonValue | null
      erro: string | null
      createdAt: Date
    }, ExtArgs["result"]["logIntegracao"]>
    composites: {}
  }

  type LogIntegracaoGetPayload<S extends boolean | null | undefined | LogIntegracaoDefaultArgs> = $Result.GetResult<Prisma.$LogIntegracaoPayload, S>

  type LogIntegracaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LogIntegracaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LogIntegracaoCountAggregateInputType | true
    }

  export interface LogIntegracaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LogIntegracao'], meta: { name: 'LogIntegracao' } }
    /**
     * Find zero or one LogIntegracao that matches the filter.
     * @param {LogIntegracaoFindUniqueArgs} args - Arguments to find a LogIntegracao
     * @example
     * // Get one LogIntegracao
     * const logIntegracao = await prisma.logIntegracao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LogIntegracaoFindUniqueArgs>(args: SelectSubset<T, LogIntegracaoFindUniqueArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LogIntegracao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LogIntegracaoFindUniqueOrThrowArgs} args - Arguments to find a LogIntegracao
     * @example
     * // Get one LogIntegracao
     * const logIntegracao = await prisma.logIntegracao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LogIntegracaoFindUniqueOrThrowArgs>(args: SelectSubset<T, LogIntegracaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LogIntegracao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoFindFirstArgs} args - Arguments to find a LogIntegracao
     * @example
     * // Get one LogIntegracao
     * const logIntegracao = await prisma.logIntegracao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LogIntegracaoFindFirstArgs>(args?: SelectSubset<T, LogIntegracaoFindFirstArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LogIntegracao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoFindFirstOrThrowArgs} args - Arguments to find a LogIntegracao
     * @example
     * // Get one LogIntegracao
     * const logIntegracao = await prisma.logIntegracao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LogIntegracaoFindFirstOrThrowArgs>(args?: SelectSubset<T, LogIntegracaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LogIntegracaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LogIntegracaos
     * const logIntegracaos = await prisma.logIntegracao.findMany()
     * 
     * // Get first 10 LogIntegracaos
     * const logIntegracaos = await prisma.logIntegracao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const logIntegracaoWithIdOnly = await prisma.logIntegracao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LogIntegracaoFindManyArgs>(args?: SelectSubset<T, LogIntegracaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LogIntegracao.
     * @param {LogIntegracaoCreateArgs} args - Arguments to create a LogIntegracao.
     * @example
     * // Create one LogIntegracao
     * const LogIntegracao = await prisma.logIntegracao.create({
     *   data: {
     *     // ... data to create a LogIntegracao
     *   }
     * })
     * 
     */
    create<T extends LogIntegracaoCreateArgs>(args: SelectSubset<T, LogIntegracaoCreateArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LogIntegracaos.
     * @param {LogIntegracaoCreateManyArgs} args - Arguments to create many LogIntegracaos.
     * @example
     * // Create many LogIntegracaos
     * const logIntegracao = await prisma.logIntegracao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LogIntegracaoCreateManyArgs>(args?: SelectSubset<T, LogIntegracaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LogIntegracaos and returns the data saved in the database.
     * @param {LogIntegracaoCreateManyAndReturnArgs} args - Arguments to create many LogIntegracaos.
     * @example
     * // Create many LogIntegracaos
     * const logIntegracao = await prisma.logIntegracao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LogIntegracaos and only return the `id`
     * const logIntegracaoWithIdOnly = await prisma.logIntegracao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LogIntegracaoCreateManyAndReturnArgs>(args?: SelectSubset<T, LogIntegracaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LogIntegracao.
     * @param {LogIntegracaoDeleteArgs} args - Arguments to delete one LogIntegracao.
     * @example
     * // Delete one LogIntegracao
     * const LogIntegracao = await prisma.logIntegracao.delete({
     *   where: {
     *     // ... filter to delete one LogIntegracao
     *   }
     * })
     * 
     */
    delete<T extends LogIntegracaoDeleteArgs>(args: SelectSubset<T, LogIntegracaoDeleteArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LogIntegracao.
     * @param {LogIntegracaoUpdateArgs} args - Arguments to update one LogIntegracao.
     * @example
     * // Update one LogIntegracao
     * const logIntegracao = await prisma.logIntegracao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LogIntegracaoUpdateArgs>(args: SelectSubset<T, LogIntegracaoUpdateArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LogIntegracaos.
     * @param {LogIntegracaoDeleteManyArgs} args - Arguments to filter LogIntegracaos to delete.
     * @example
     * // Delete a few LogIntegracaos
     * const { count } = await prisma.logIntegracao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LogIntegracaoDeleteManyArgs>(args?: SelectSubset<T, LogIntegracaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LogIntegracaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LogIntegracaos
     * const logIntegracao = await prisma.logIntegracao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LogIntegracaoUpdateManyArgs>(args: SelectSubset<T, LogIntegracaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LogIntegracaos and returns the data updated in the database.
     * @param {LogIntegracaoUpdateManyAndReturnArgs} args - Arguments to update many LogIntegracaos.
     * @example
     * // Update many LogIntegracaos
     * const logIntegracao = await prisma.logIntegracao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LogIntegracaos and only return the `id`
     * const logIntegracaoWithIdOnly = await prisma.logIntegracao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LogIntegracaoUpdateManyAndReturnArgs>(args: SelectSubset<T, LogIntegracaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LogIntegracao.
     * @param {LogIntegracaoUpsertArgs} args - Arguments to update or create a LogIntegracao.
     * @example
     * // Update or create a LogIntegracao
     * const logIntegracao = await prisma.logIntegracao.upsert({
     *   create: {
     *     // ... data to create a LogIntegracao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LogIntegracao we want to update
     *   }
     * })
     */
    upsert<T extends LogIntegracaoUpsertArgs>(args: SelectSubset<T, LogIntegracaoUpsertArgs<ExtArgs>>): Prisma__LogIntegracaoClient<$Result.GetResult<Prisma.$LogIntegracaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LogIntegracaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoCountArgs} args - Arguments to filter LogIntegracaos to count.
     * @example
     * // Count the number of LogIntegracaos
     * const count = await prisma.logIntegracao.count({
     *   where: {
     *     // ... the filter for the LogIntegracaos we want to count
     *   }
     * })
    **/
    count<T extends LogIntegracaoCountArgs>(
      args?: Subset<T, LogIntegracaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LogIntegracaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LogIntegracao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LogIntegracaoAggregateArgs>(args: Subset<T, LogIntegracaoAggregateArgs>): Prisma.PrismaPromise<GetLogIntegracaoAggregateType<T>>

    /**
     * Group by LogIntegracao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogIntegracaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LogIntegracaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LogIntegracaoGroupByArgs['orderBy'] }
        : { orderBy?: LogIntegracaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LogIntegracaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLogIntegracaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LogIntegracao model
   */
  readonly fields: LogIntegracaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LogIntegracao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LogIntegracaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LogIntegracao model
   */
  interface LogIntegracaoFieldRefs {
    readonly id: FieldRef<"LogIntegracao", 'String'>
    readonly tipo: FieldRef<"LogIntegracao", 'String'>
    readonly status: FieldRef<"LogIntegracao", 'String'>
    readonly request: FieldRef<"LogIntegracao", 'Json'>
    readonly response: FieldRef<"LogIntegracao", 'Json'>
    readonly erro: FieldRef<"LogIntegracao", 'String'>
    readonly createdAt: FieldRef<"LogIntegracao", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LogIntegracao findUnique
   */
  export type LogIntegracaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * Filter, which LogIntegracao to fetch.
     */
    where: LogIntegracaoWhereUniqueInput
  }

  /**
   * LogIntegracao findUniqueOrThrow
   */
  export type LogIntegracaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * Filter, which LogIntegracao to fetch.
     */
    where: LogIntegracaoWhereUniqueInput
  }

  /**
   * LogIntegracao findFirst
   */
  export type LogIntegracaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * Filter, which LogIntegracao to fetch.
     */
    where?: LogIntegracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LogIntegracaos to fetch.
     */
    orderBy?: LogIntegracaoOrderByWithRelationInput | LogIntegracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LogIntegracaos.
     */
    cursor?: LogIntegracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LogIntegracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LogIntegracaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LogIntegracaos.
     */
    distinct?: LogIntegracaoScalarFieldEnum | LogIntegracaoScalarFieldEnum[]
  }

  /**
   * LogIntegracao findFirstOrThrow
   */
  export type LogIntegracaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * Filter, which LogIntegracao to fetch.
     */
    where?: LogIntegracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LogIntegracaos to fetch.
     */
    orderBy?: LogIntegracaoOrderByWithRelationInput | LogIntegracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LogIntegracaos.
     */
    cursor?: LogIntegracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LogIntegracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LogIntegracaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LogIntegracaos.
     */
    distinct?: LogIntegracaoScalarFieldEnum | LogIntegracaoScalarFieldEnum[]
  }

  /**
   * LogIntegracao findMany
   */
  export type LogIntegracaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * Filter, which LogIntegracaos to fetch.
     */
    where?: LogIntegracaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LogIntegracaos to fetch.
     */
    orderBy?: LogIntegracaoOrderByWithRelationInput | LogIntegracaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LogIntegracaos.
     */
    cursor?: LogIntegracaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LogIntegracaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LogIntegracaos.
     */
    skip?: number
    distinct?: LogIntegracaoScalarFieldEnum | LogIntegracaoScalarFieldEnum[]
  }

  /**
   * LogIntegracao create
   */
  export type LogIntegracaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * The data needed to create a LogIntegracao.
     */
    data: XOR<LogIntegracaoCreateInput, LogIntegracaoUncheckedCreateInput>
  }

  /**
   * LogIntegracao createMany
   */
  export type LogIntegracaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LogIntegracaos.
     */
    data: LogIntegracaoCreateManyInput | LogIntegracaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LogIntegracao createManyAndReturn
   */
  export type LogIntegracaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * The data used to create many LogIntegracaos.
     */
    data: LogIntegracaoCreateManyInput | LogIntegracaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LogIntegracao update
   */
  export type LogIntegracaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * The data needed to update a LogIntegracao.
     */
    data: XOR<LogIntegracaoUpdateInput, LogIntegracaoUncheckedUpdateInput>
    /**
     * Choose, which LogIntegracao to update.
     */
    where: LogIntegracaoWhereUniqueInput
  }

  /**
   * LogIntegracao updateMany
   */
  export type LogIntegracaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LogIntegracaos.
     */
    data: XOR<LogIntegracaoUpdateManyMutationInput, LogIntegracaoUncheckedUpdateManyInput>
    /**
     * Filter which LogIntegracaos to update
     */
    where?: LogIntegracaoWhereInput
    /**
     * Limit how many LogIntegracaos to update.
     */
    limit?: number
  }

  /**
   * LogIntegracao updateManyAndReturn
   */
  export type LogIntegracaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * The data used to update LogIntegracaos.
     */
    data: XOR<LogIntegracaoUpdateManyMutationInput, LogIntegracaoUncheckedUpdateManyInput>
    /**
     * Filter which LogIntegracaos to update
     */
    where?: LogIntegracaoWhereInput
    /**
     * Limit how many LogIntegracaos to update.
     */
    limit?: number
  }

  /**
   * LogIntegracao upsert
   */
  export type LogIntegracaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * The filter to search for the LogIntegracao to update in case it exists.
     */
    where: LogIntegracaoWhereUniqueInput
    /**
     * In case the LogIntegracao found by the `where` argument doesn't exist, create a new LogIntegracao with this data.
     */
    create: XOR<LogIntegracaoCreateInput, LogIntegracaoUncheckedCreateInput>
    /**
     * In case the LogIntegracao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LogIntegracaoUpdateInput, LogIntegracaoUncheckedUpdateInput>
  }

  /**
   * LogIntegracao delete
   */
  export type LogIntegracaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
    /**
     * Filter which LogIntegracao to delete.
     */
    where: LogIntegracaoWhereUniqueInput
  }

  /**
   * LogIntegracao deleteMany
   */
  export type LogIntegracaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LogIntegracaos to delete
     */
    where?: LogIntegracaoWhereInput
    /**
     * Limit how many LogIntegracaos to delete.
     */
    limit?: number
  }

  /**
   * LogIntegracao without action
   */
  export type LogIntegracaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogIntegracao
     */
    select?: LogIntegracaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LogIntegracao
     */
    omit?: LogIntegracaoOmit<ExtArgs> | null
  }


  /**
   * Model ImovelMetadata
   */

  export type AggregateImovelMetadata = {
    _count: ImovelMetadataCountAggregateOutputType | null
    _min: ImovelMetadataMinAggregateOutputType | null
    _max: ImovelMetadataMaxAggregateOutputType | null
  }

  export type ImovelMetadataMinAggregateOutputType = {
    id: string | null
    imovelIdExterno: string | null
    telefone: string | null
    observacoes: string | null
    construtoraId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImovelMetadataMaxAggregateOutputType = {
    id: string | null
    imovelIdExterno: string | null
    telefone: string | null
    observacoes: string | null
    construtoraId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImovelMetadataCountAggregateOutputType = {
    id: number
    imovelIdExterno: number
    telefone: number
    observacoes: number
    construtoraId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImovelMetadataMinAggregateInputType = {
    id?: true
    imovelIdExterno?: true
    telefone?: true
    observacoes?: true
    construtoraId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImovelMetadataMaxAggregateInputType = {
    id?: true
    imovelIdExterno?: true
    telefone?: true
    observacoes?: true
    construtoraId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImovelMetadataCountAggregateInputType = {
    id?: true
    imovelIdExterno?: true
    telefone?: true
    observacoes?: true
    construtoraId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImovelMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImovelMetadata to aggregate.
     */
    where?: ImovelMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelMetadata to fetch.
     */
    orderBy?: ImovelMetadataOrderByWithRelationInput | ImovelMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImovelMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImovelMetadata
    **/
    _count?: true | ImovelMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImovelMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImovelMetadataMaxAggregateInputType
  }

  export type GetImovelMetadataAggregateType<T extends ImovelMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateImovelMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImovelMetadata[P]>
      : GetScalarType<T[P], AggregateImovelMetadata[P]>
  }




  export type ImovelMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelMetadataWhereInput
    orderBy?: ImovelMetadataOrderByWithAggregationInput | ImovelMetadataOrderByWithAggregationInput[]
    by: ImovelMetadataScalarFieldEnum[] | ImovelMetadataScalarFieldEnum
    having?: ImovelMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImovelMetadataCountAggregateInputType | true
    _min?: ImovelMetadataMinAggregateInputType
    _max?: ImovelMetadataMaxAggregateInputType
  }

  export type ImovelMetadataGroupByOutputType = {
    id: string
    imovelIdExterno: string
    telefone: string
    observacoes: string
    construtoraId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ImovelMetadataCountAggregateOutputType | null
    _min: ImovelMetadataMinAggregateOutputType | null
    _max: ImovelMetadataMaxAggregateOutputType | null
  }

  type GetImovelMetadataGroupByPayload<T extends ImovelMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImovelMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImovelMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImovelMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], ImovelMetadataGroupByOutputType[P]>
        }
      >
    >


  export type ImovelMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imovelIdExterno?: boolean
    telefone?: boolean
    observacoes?: boolean
    construtoraId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtora?: boolean | ImovelMetadata$construtoraArgs<ExtArgs>
  }, ExtArgs["result"]["imovelMetadata"]>

  export type ImovelMetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imovelIdExterno?: boolean
    telefone?: boolean
    observacoes?: boolean
    construtoraId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtora?: boolean | ImovelMetadata$construtoraArgs<ExtArgs>
  }, ExtArgs["result"]["imovelMetadata"]>

  export type ImovelMetadataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imovelIdExterno?: boolean
    telefone?: boolean
    observacoes?: boolean
    construtoraId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    construtora?: boolean | ImovelMetadata$construtoraArgs<ExtArgs>
  }, ExtArgs["result"]["imovelMetadata"]>

  export type ImovelMetadataSelectScalar = {
    id?: boolean
    imovelIdExterno?: boolean
    telefone?: boolean
    observacoes?: boolean
    construtoraId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImovelMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imovelIdExterno" | "telefone" | "observacoes" | "construtoraId" | "createdAt" | "updatedAt", ExtArgs["result"]["imovelMetadata"]>
  export type ImovelMetadataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    construtora?: boolean | ImovelMetadata$construtoraArgs<ExtArgs>
  }
  export type ImovelMetadataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    construtora?: boolean | ImovelMetadata$construtoraArgs<ExtArgs>
  }
  export type ImovelMetadataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    construtora?: boolean | ImovelMetadata$construtoraArgs<ExtArgs>
  }

  export type $ImovelMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImovelMetadata"
    objects: {
      construtora: Prisma.$ConstrutoraPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imovelIdExterno: string
      telefone: string
      observacoes: string
      construtoraId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["imovelMetadata"]>
    composites: {}
  }

  type ImovelMetadataGetPayload<S extends boolean | null | undefined | ImovelMetadataDefaultArgs> = $Result.GetResult<Prisma.$ImovelMetadataPayload, S>

  type ImovelMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImovelMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImovelMetadataCountAggregateInputType | true
    }

  export interface ImovelMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImovelMetadata'], meta: { name: 'ImovelMetadata' } }
    /**
     * Find zero or one ImovelMetadata that matches the filter.
     * @param {ImovelMetadataFindUniqueArgs} args - Arguments to find a ImovelMetadata
     * @example
     * // Get one ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImovelMetadataFindUniqueArgs>(args: SelectSubset<T, ImovelMetadataFindUniqueArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImovelMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImovelMetadataFindUniqueOrThrowArgs} args - Arguments to find a ImovelMetadata
     * @example
     * // Get one ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImovelMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, ImovelMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImovelMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataFindFirstArgs} args - Arguments to find a ImovelMetadata
     * @example
     * // Get one ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImovelMetadataFindFirstArgs>(args?: SelectSubset<T, ImovelMetadataFindFirstArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImovelMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataFindFirstOrThrowArgs} args - Arguments to find a ImovelMetadata
     * @example
     * // Get one ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImovelMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, ImovelMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImovelMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.findMany()
     * 
     * // Get first 10 ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imovelMetadataWithIdOnly = await prisma.imovelMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImovelMetadataFindManyArgs>(args?: SelectSubset<T, ImovelMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImovelMetadata.
     * @param {ImovelMetadataCreateArgs} args - Arguments to create a ImovelMetadata.
     * @example
     * // Create one ImovelMetadata
     * const ImovelMetadata = await prisma.imovelMetadata.create({
     *   data: {
     *     // ... data to create a ImovelMetadata
     *   }
     * })
     * 
     */
    create<T extends ImovelMetadataCreateArgs>(args: SelectSubset<T, ImovelMetadataCreateArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImovelMetadata.
     * @param {ImovelMetadataCreateManyArgs} args - Arguments to create many ImovelMetadata.
     * @example
     * // Create many ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImovelMetadataCreateManyArgs>(args?: SelectSubset<T, ImovelMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImovelMetadata and returns the data saved in the database.
     * @param {ImovelMetadataCreateManyAndReturnArgs} args - Arguments to create many ImovelMetadata.
     * @example
     * // Create many ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImovelMetadata and only return the `id`
     * const imovelMetadataWithIdOnly = await prisma.imovelMetadata.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImovelMetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, ImovelMetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImovelMetadata.
     * @param {ImovelMetadataDeleteArgs} args - Arguments to delete one ImovelMetadata.
     * @example
     * // Delete one ImovelMetadata
     * const ImovelMetadata = await prisma.imovelMetadata.delete({
     *   where: {
     *     // ... filter to delete one ImovelMetadata
     *   }
     * })
     * 
     */
    delete<T extends ImovelMetadataDeleteArgs>(args: SelectSubset<T, ImovelMetadataDeleteArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImovelMetadata.
     * @param {ImovelMetadataUpdateArgs} args - Arguments to update one ImovelMetadata.
     * @example
     * // Update one ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImovelMetadataUpdateArgs>(args: SelectSubset<T, ImovelMetadataUpdateArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImovelMetadata.
     * @param {ImovelMetadataDeleteManyArgs} args - Arguments to filter ImovelMetadata to delete.
     * @example
     * // Delete a few ImovelMetadata
     * const { count } = await prisma.imovelMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImovelMetadataDeleteManyArgs>(args?: SelectSubset<T, ImovelMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImovelMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImovelMetadataUpdateManyArgs>(args: SelectSubset<T, ImovelMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImovelMetadata and returns the data updated in the database.
     * @param {ImovelMetadataUpdateManyAndReturnArgs} args - Arguments to update many ImovelMetadata.
     * @example
     * // Update many ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImovelMetadata and only return the `id`
     * const imovelMetadataWithIdOnly = await prisma.imovelMetadata.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImovelMetadataUpdateManyAndReturnArgs>(args: SelectSubset<T, ImovelMetadataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImovelMetadata.
     * @param {ImovelMetadataUpsertArgs} args - Arguments to update or create a ImovelMetadata.
     * @example
     * // Update or create a ImovelMetadata
     * const imovelMetadata = await prisma.imovelMetadata.upsert({
     *   create: {
     *     // ... data to create a ImovelMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImovelMetadata we want to update
     *   }
     * })
     */
    upsert<T extends ImovelMetadataUpsertArgs>(args: SelectSubset<T, ImovelMetadataUpsertArgs<ExtArgs>>): Prisma__ImovelMetadataClient<$Result.GetResult<Prisma.$ImovelMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImovelMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataCountArgs} args - Arguments to filter ImovelMetadata to count.
     * @example
     * // Count the number of ImovelMetadata
     * const count = await prisma.imovelMetadata.count({
     *   where: {
     *     // ... the filter for the ImovelMetadata we want to count
     *   }
     * })
    **/
    count<T extends ImovelMetadataCountArgs>(
      args?: Subset<T, ImovelMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImovelMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImovelMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImovelMetadataAggregateArgs>(args: Subset<T, ImovelMetadataAggregateArgs>): Prisma.PrismaPromise<GetImovelMetadataAggregateType<T>>

    /**
     * Group by ImovelMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelMetadataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImovelMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImovelMetadataGroupByArgs['orderBy'] }
        : { orderBy?: ImovelMetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImovelMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImovelMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImovelMetadata model
   */
  readonly fields: ImovelMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImovelMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImovelMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    construtora<T extends ImovelMetadata$construtoraArgs<ExtArgs> = {}>(args?: Subset<T, ImovelMetadata$construtoraArgs<ExtArgs>>): Prisma__ConstrutoraClient<$Result.GetResult<Prisma.$ConstrutoraPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImovelMetadata model
   */
  interface ImovelMetadataFieldRefs {
    readonly id: FieldRef<"ImovelMetadata", 'String'>
    readonly imovelIdExterno: FieldRef<"ImovelMetadata", 'String'>
    readonly telefone: FieldRef<"ImovelMetadata", 'String'>
    readonly observacoes: FieldRef<"ImovelMetadata", 'String'>
    readonly construtoraId: FieldRef<"ImovelMetadata", 'String'>
    readonly createdAt: FieldRef<"ImovelMetadata", 'DateTime'>
    readonly updatedAt: FieldRef<"ImovelMetadata", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImovelMetadata findUnique
   */
  export type ImovelMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ImovelMetadata to fetch.
     */
    where: ImovelMetadataWhereUniqueInput
  }

  /**
   * ImovelMetadata findUniqueOrThrow
   */
  export type ImovelMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ImovelMetadata to fetch.
     */
    where: ImovelMetadataWhereUniqueInput
  }

  /**
   * ImovelMetadata findFirst
   */
  export type ImovelMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ImovelMetadata to fetch.
     */
    where?: ImovelMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelMetadata to fetch.
     */
    orderBy?: ImovelMetadataOrderByWithRelationInput | ImovelMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImovelMetadata.
     */
    cursor?: ImovelMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImovelMetadata.
     */
    distinct?: ImovelMetadataScalarFieldEnum | ImovelMetadataScalarFieldEnum[]
  }

  /**
   * ImovelMetadata findFirstOrThrow
   */
  export type ImovelMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ImovelMetadata to fetch.
     */
    where?: ImovelMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelMetadata to fetch.
     */
    orderBy?: ImovelMetadataOrderByWithRelationInput | ImovelMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImovelMetadata.
     */
    cursor?: ImovelMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImovelMetadata.
     */
    distinct?: ImovelMetadataScalarFieldEnum | ImovelMetadataScalarFieldEnum[]
  }

  /**
   * ImovelMetadata findMany
   */
  export type ImovelMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ImovelMetadata to fetch.
     */
    where?: ImovelMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelMetadata to fetch.
     */
    orderBy?: ImovelMetadataOrderByWithRelationInput | ImovelMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImovelMetadata.
     */
    cursor?: ImovelMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelMetadata.
     */
    skip?: number
    distinct?: ImovelMetadataScalarFieldEnum | ImovelMetadataScalarFieldEnum[]
  }

  /**
   * ImovelMetadata create
   */
  export type ImovelMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * The data needed to create a ImovelMetadata.
     */
    data: XOR<ImovelMetadataCreateInput, ImovelMetadataUncheckedCreateInput>
  }

  /**
   * ImovelMetadata createMany
   */
  export type ImovelMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImovelMetadata.
     */
    data: ImovelMetadataCreateManyInput | ImovelMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImovelMetadata createManyAndReturn
   */
  export type ImovelMetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * The data used to create many ImovelMetadata.
     */
    data: ImovelMetadataCreateManyInput | ImovelMetadataCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImovelMetadata update
   */
  export type ImovelMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * The data needed to update a ImovelMetadata.
     */
    data: XOR<ImovelMetadataUpdateInput, ImovelMetadataUncheckedUpdateInput>
    /**
     * Choose, which ImovelMetadata to update.
     */
    where: ImovelMetadataWhereUniqueInput
  }

  /**
   * ImovelMetadata updateMany
   */
  export type ImovelMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImovelMetadata.
     */
    data: XOR<ImovelMetadataUpdateManyMutationInput, ImovelMetadataUncheckedUpdateManyInput>
    /**
     * Filter which ImovelMetadata to update
     */
    where?: ImovelMetadataWhereInput
    /**
     * Limit how many ImovelMetadata to update.
     */
    limit?: number
  }

  /**
   * ImovelMetadata updateManyAndReturn
   */
  export type ImovelMetadataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * The data used to update ImovelMetadata.
     */
    data: XOR<ImovelMetadataUpdateManyMutationInput, ImovelMetadataUncheckedUpdateManyInput>
    /**
     * Filter which ImovelMetadata to update
     */
    where?: ImovelMetadataWhereInput
    /**
     * Limit how many ImovelMetadata to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImovelMetadata upsert
   */
  export type ImovelMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * The filter to search for the ImovelMetadata to update in case it exists.
     */
    where: ImovelMetadataWhereUniqueInput
    /**
     * In case the ImovelMetadata found by the `where` argument doesn't exist, create a new ImovelMetadata with this data.
     */
    create: XOR<ImovelMetadataCreateInput, ImovelMetadataUncheckedCreateInput>
    /**
     * In case the ImovelMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImovelMetadataUpdateInput, ImovelMetadataUncheckedUpdateInput>
  }

  /**
   * ImovelMetadata delete
   */
  export type ImovelMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
    /**
     * Filter which ImovelMetadata to delete.
     */
    where: ImovelMetadataWhereUniqueInput
  }

  /**
   * ImovelMetadata deleteMany
   */
  export type ImovelMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImovelMetadata to delete
     */
    where?: ImovelMetadataWhereInput
    /**
     * Limit how many ImovelMetadata to delete.
     */
    limit?: number
  }

  /**
   * ImovelMetadata.construtora
   */
  export type ImovelMetadata$construtoraArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Construtora
     */
    select?: ConstrutoraSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Construtora
     */
    omit?: ConstrutoraOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConstrutoraInclude<ExtArgs> | null
    where?: ConstrutoraWhereInput
  }

  /**
   * ImovelMetadata without action
   */
  export type ImovelMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelMetadata
     */
    select?: ImovelMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelMetadata
     */
    omit?: ImovelMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelMetadataInclude<ExtArgs> | null
  }


  /**
   * Model ImovelPergunta
   */

  export type AggregateImovelPergunta = {
    _count: ImovelPerguntaCountAggregateOutputType | null
    _min: ImovelPerguntaMinAggregateOutputType | null
    _max: ImovelPerguntaMaxAggregateOutputType | null
  }

  export type ImovelPerguntaMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    imovelId: string | null
    perguntaId: string | null
  }

  export type ImovelPerguntaMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    imovelId: string | null
    perguntaId: string | null
  }

  export type ImovelPerguntaCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    imovelId: number
    perguntaId: number
    _all: number
  }


  export type ImovelPerguntaMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    imovelId?: true
    perguntaId?: true
  }

  export type ImovelPerguntaMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    imovelId?: true
    perguntaId?: true
  }

  export type ImovelPerguntaCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    imovelId?: true
    perguntaId?: true
    _all?: true
  }

  export type ImovelPerguntaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImovelPergunta to aggregate.
     */
    where?: ImovelPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelPerguntas to fetch.
     */
    orderBy?: ImovelPerguntaOrderByWithRelationInput | ImovelPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImovelPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImovelPerguntas
    **/
    _count?: true | ImovelPerguntaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImovelPerguntaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImovelPerguntaMaxAggregateInputType
  }

  export type GetImovelPerguntaAggregateType<T extends ImovelPerguntaAggregateArgs> = {
        [P in keyof T & keyof AggregateImovelPergunta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImovelPergunta[P]>
      : GetScalarType<T[P], AggregateImovelPergunta[P]>
  }




  export type ImovelPerguntaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImovelPerguntaWhereInput
    orderBy?: ImovelPerguntaOrderByWithAggregationInput | ImovelPerguntaOrderByWithAggregationInput[]
    by: ImovelPerguntaScalarFieldEnum[] | ImovelPerguntaScalarFieldEnum
    having?: ImovelPerguntaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImovelPerguntaCountAggregateInputType | true
    _min?: ImovelPerguntaMinAggregateInputType
    _max?: ImovelPerguntaMaxAggregateInputType
  }

  export type ImovelPerguntaGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    imovelId: string
    perguntaId: string
    _count: ImovelPerguntaCountAggregateOutputType | null
    _min: ImovelPerguntaMinAggregateOutputType | null
    _max: ImovelPerguntaMaxAggregateOutputType | null
  }

  type GetImovelPerguntaGroupByPayload<T extends ImovelPerguntaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImovelPerguntaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImovelPerguntaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImovelPerguntaGroupByOutputType[P]>
            : GetScalarType<T[P], ImovelPerguntaGroupByOutputType[P]>
        }
      >
    >


  export type ImovelPerguntaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    perguntaId?: boolean
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imovelPergunta"]>

  export type ImovelPerguntaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    perguntaId?: boolean
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imovelPergunta"]>

  export type ImovelPerguntaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    perguntaId?: boolean
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imovelPergunta"]>

  export type ImovelPerguntaSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imovelId?: boolean
    perguntaId?: boolean
  }

  export type ImovelPerguntaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "imovelId" | "perguntaId", ExtArgs["result"]["imovelPergunta"]>
  export type ImovelPerguntaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
  }
  export type ImovelPerguntaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
  }
  export type ImovelPerguntaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imovel?: boolean | ImovelDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
  }

  export type $ImovelPerguntaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImovelPergunta"
    objects: {
      imovel: Prisma.$ImovelPayload<ExtArgs>
      pergunta: Prisma.$PerguntaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      imovelId: string
      perguntaId: string
    }, ExtArgs["result"]["imovelPergunta"]>
    composites: {}
  }

  type ImovelPerguntaGetPayload<S extends boolean | null | undefined | ImovelPerguntaDefaultArgs> = $Result.GetResult<Prisma.$ImovelPerguntaPayload, S>

  type ImovelPerguntaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImovelPerguntaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImovelPerguntaCountAggregateInputType | true
    }

  export interface ImovelPerguntaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImovelPergunta'], meta: { name: 'ImovelPergunta' } }
    /**
     * Find zero or one ImovelPergunta that matches the filter.
     * @param {ImovelPerguntaFindUniqueArgs} args - Arguments to find a ImovelPergunta
     * @example
     * // Get one ImovelPergunta
     * const imovelPergunta = await prisma.imovelPergunta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImovelPerguntaFindUniqueArgs>(args: SelectSubset<T, ImovelPerguntaFindUniqueArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImovelPergunta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImovelPerguntaFindUniqueOrThrowArgs} args - Arguments to find a ImovelPergunta
     * @example
     * // Get one ImovelPergunta
     * const imovelPergunta = await prisma.imovelPergunta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImovelPerguntaFindUniqueOrThrowArgs>(args: SelectSubset<T, ImovelPerguntaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImovelPergunta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaFindFirstArgs} args - Arguments to find a ImovelPergunta
     * @example
     * // Get one ImovelPergunta
     * const imovelPergunta = await prisma.imovelPergunta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImovelPerguntaFindFirstArgs>(args?: SelectSubset<T, ImovelPerguntaFindFirstArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImovelPergunta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaFindFirstOrThrowArgs} args - Arguments to find a ImovelPergunta
     * @example
     * // Get one ImovelPergunta
     * const imovelPergunta = await prisma.imovelPergunta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImovelPerguntaFindFirstOrThrowArgs>(args?: SelectSubset<T, ImovelPerguntaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImovelPerguntas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImovelPerguntas
     * const imovelPerguntas = await prisma.imovelPergunta.findMany()
     * 
     * // Get first 10 ImovelPerguntas
     * const imovelPerguntas = await prisma.imovelPergunta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imovelPerguntaWithIdOnly = await prisma.imovelPergunta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImovelPerguntaFindManyArgs>(args?: SelectSubset<T, ImovelPerguntaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImovelPergunta.
     * @param {ImovelPerguntaCreateArgs} args - Arguments to create a ImovelPergunta.
     * @example
     * // Create one ImovelPergunta
     * const ImovelPergunta = await prisma.imovelPergunta.create({
     *   data: {
     *     // ... data to create a ImovelPergunta
     *   }
     * })
     * 
     */
    create<T extends ImovelPerguntaCreateArgs>(args: SelectSubset<T, ImovelPerguntaCreateArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImovelPerguntas.
     * @param {ImovelPerguntaCreateManyArgs} args - Arguments to create many ImovelPerguntas.
     * @example
     * // Create many ImovelPerguntas
     * const imovelPergunta = await prisma.imovelPergunta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImovelPerguntaCreateManyArgs>(args?: SelectSubset<T, ImovelPerguntaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImovelPerguntas and returns the data saved in the database.
     * @param {ImovelPerguntaCreateManyAndReturnArgs} args - Arguments to create many ImovelPerguntas.
     * @example
     * // Create many ImovelPerguntas
     * const imovelPergunta = await prisma.imovelPergunta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImovelPerguntas and only return the `id`
     * const imovelPerguntaWithIdOnly = await prisma.imovelPergunta.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImovelPerguntaCreateManyAndReturnArgs>(args?: SelectSubset<T, ImovelPerguntaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImovelPergunta.
     * @param {ImovelPerguntaDeleteArgs} args - Arguments to delete one ImovelPergunta.
     * @example
     * // Delete one ImovelPergunta
     * const ImovelPergunta = await prisma.imovelPergunta.delete({
     *   where: {
     *     // ... filter to delete one ImovelPergunta
     *   }
     * })
     * 
     */
    delete<T extends ImovelPerguntaDeleteArgs>(args: SelectSubset<T, ImovelPerguntaDeleteArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImovelPergunta.
     * @param {ImovelPerguntaUpdateArgs} args - Arguments to update one ImovelPergunta.
     * @example
     * // Update one ImovelPergunta
     * const imovelPergunta = await prisma.imovelPergunta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImovelPerguntaUpdateArgs>(args: SelectSubset<T, ImovelPerguntaUpdateArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImovelPerguntas.
     * @param {ImovelPerguntaDeleteManyArgs} args - Arguments to filter ImovelPerguntas to delete.
     * @example
     * // Delete a few ImovelPerguntas
     * const { count } = await prisma.imovelPergunta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImovelPerguntaDeleteManyArgs>(args?: SelectSubset<T, ImovelPerguntaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImovelPerguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImovelPerguntas
     * const imovelPergunta = await prisma.imovelPergunta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImovelPerguntaUpdateManyArgs>(args: SelectSubset<T, ImovelPerguntaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImovelPerguntas and returns the data updated in the database.
     * @param {ImovelPerguntaUpdateManyAndReturnArgs} args - Arguments to update many ImovelPerguntas.
     * @example
     * // Update many ImovelPerguntas
     * const imovelPergunta = await prisma.imovelPergunta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImovelPerguntas and only return the `id`
     * const imovelPerguntaWithIdOnly = await prisma.imovelPergunta.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImovelPerguntaUpdateManyAndReturnArgs>(args: SelectSubset<T, ImovelPerguntaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImovelPergunta.
     * @param {ImovelPerguntaUpsertArgs} args - Arguments to update or create a ImovelPergunta.
     * @example
     * // Update or create a ImovelPergunta
     * const imovelPergunta = await prisma.imovelPergunta.upsert({
     *   create: {
     *     // ... data to create a ImovelPergunta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImovelPergunta we want to update
     *   }
     * })
     */
    upsert<T extends ImovelPerguntaUpsertArgs>(args: SelectSubset<T, ImovelPerguntaUpsertArgs<ExtArgs>>): Prisma__ImovelPerguntaClient<$Result.GetResult<Prisma.$ImovelPerguntaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImovelPerguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaCountArgs} args - Arguments to filter ImovelPerguntas to count.
     * @example
     * // Count the number of ImovelPerguntas
     * const count = await prisma.imovelPergunta.count({
     *   where: {
     *     // ... the filter for the ImovelPerguntas we want to count
     *   }
     * })
    **/
    count<T extends ImovelPerguntaCountArgs>(
      args?: Subset<T, ImovelPerguntaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImovelPerguntaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImovelPergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImovelPerguntaAggregateArgs>(args: Subset<T, ImovelPerguntaAggregateArgs>): Prisma.PrismaPromise<GetImovelPerguntaAggregateType<T>>

    /**
     * Group by ImovelPergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImovelPerguntaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImovelPerguntaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImovelPerguntaGroupByArgs['orderBy'] }
        : { orderBy?: ImovelPerguntaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImovelPerguntaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImovelPerguntaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImovelPergunta model
   */
  readonly fields: ImovelPerguntaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImovelPergunta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImovelPerguntaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    imovel<T extends ImovelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImovelDefaultArgs<ExtArgs>>): Prisma__ImovelClient<$Result.GetResult<Prisma.$ImovelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pergunta<T extends PerguntaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PerguntaDefaultArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImovelPergunta model
   */
  interface ImovelPerguntaFieldRefs {
    readonly id: FieldRef<"ImovelPergunta", 'String'>
    readonly createdAt: FieldRef<"ImovelPergunta", 'DateTime'>
    readonly updatedAt: FieldRef<"ImovelPergunta", 'DateTime'>
    readonly imovelId: FieldRef<"ImovelPergunta", 'String'>
    readonly perguntaId: FieldRef<"ImovelPergunta", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ImovelPergunta findUnique
   */
  export type ImovelPerguntaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which ImovelPergunta to fetch.
     */
    where: ImovelPerguntaWhereUniqueInput
  }

  /**
   * ImovelPergunta findUniqueOrThrow
   */
  export type ImovelPerguntaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which ImovelPergunta to fetch.
     */
    where: ImovelPerguntaWhereUniqueInput
  }

  /**
   * ImovelPergunta findFirst
   */
  export type ImovelPerguntaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which ImovelPergunta to fetch.
     */
    where?: ImovelPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelPerguntas to fetch.
     */
    orderBy?: ImovelPerguntaOrderByWithRelationInput | ImovelPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImovelPerguntas.
     */
    cursor?: ImovelPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImovelPerguntas.
     */
    distinct?: ImovelPerguntaScalarFieldEnum | ImovelPerguntaScalarFieldEnum[]
  }

  /**
   * ImovelPergunta findFirstOrThrow
   */
  export type ImovelPerguntaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which ImovelPergunta to fetch.
     */
    where?: ImovelPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelPerguntas to fetch.
     */
    orderBy?: ImovelPerguntaOrderByWithRelationInput | ImovelPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImovelPerguntas.
     */
    cursor?: ImovelPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImovelPerguntas.
     */
    distinct?: ImovelPerguntaScalarFieldEnum | ImovelPerguntaScalarFieldEnum[]
  }

  /**
   * ImovelPergunta findMany
   */
  export type ImovelPerguntaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which ImovelPerguntas to fetch.
     */
    where?: ImovelPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImovelPerguntas to fetch.
     */
    orderBy?: ImovelPerguntaOrderByWithRelationInput | ImovelPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImovelPerguntas.
     */
    cursor?: ImovelPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImovelPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImovelPerguntas.
     */
    skip?: number
    distinct?: ImovelPerguntaScalarFieldEnum | ImovelPerguntaScalarFieldEnum[]
  }

  /**
   * ImovelPergunta create
   */
  export type ImovelPerguntaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * The data needed to create a ImovelPergunta.
     */
    data: XOR<ImovelPerguntaCreateInput, ImovelPerguntaUncheckedCreateInput>
  }

  /**
   * ImovelPergunta createMany
   */
  export type ImovelPerguntaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImovelPerguntas.
     */
    data: ImovelPerguntaCreateManyInput | ImovelPerguntaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImovelPergunta createManyAndReturn
   */
  export type ImovelPerguntaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * The data used to create many ImovelPerguntas.
     */
    data: ImovelPerguntaCreateManyInput | ImovelPerguntaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImovelPergunta update
   */
  export type ImovelPerguntaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * The data needed to update a ImovelPergunta.
     */
    data: XOR<ImovelPerguntaUpdateInput, ImovelPerguntaUncheckedUpdateInput>
    /**
     * Choose, which ImovelPergunta to update.
     */
    where: ImovelPerguntaWhereUniqueInput
  }

  /**
   * ImovelPergunta updateMany
   */
  export type ImovelPerguntaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImovelPerguntas.
     */
    data: XOR<ImovelPerguntaUpdateManyMutationInput, ImovelPerguntaUncheckedUpdateManyInput>
    /**
     * Filter which ImovelPerguntas to update
     */
    where?: ImovelPerguntaWhereInput
    /**
     * Limit how many ImovelPerguntas to update.
     */
    limit?: number
  }

  /**
   * ImovelPergunta updateManyAndReturn
   */
  export type ImovelPerguntaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * The data used to update ImovelPerguntas.
     */
    data: XOR<ImovelPerguntaUpdateManyMutationInput, ImovelPerguntaUncheckedUpdateManyInput>
    /**
     * Filter which ImovelPerguntas to update
     */
    where?: ImovelPerguntaWhereInput
    /**
     * Limit how many ImovelPerguntas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImovelPergunta upsert
   */
  export type ImovelPerguntaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * The filter to search for the ImovelPergunta to update in case it exists.
     */
    where: ImovelPerguntaWhereUniqueInput
    /**
     * In case the ImovelPergunta found by the `where` argument doesn't exist, create a new ImovelPergunta with this data.
     */
    create: XOR<ImovelPerguntaCreateInput, ImovelPerguntaUncheckedCreateInput>
    /**
     * In case the ImovelPergunta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImovelPerguntaUpdateInput, ImovelPerguntaUncheckedUpdateInput>
  }

  /**
   * ImovelPergunta delete
   */
  export type ImovelPerguntaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
    /**
     * Filter which ImovelPergunta to delete.
     */
    where: ImovelPerguntaWhereUniqueInput
  }

  /**
   * ImovelPergunta deleteMany
   */
  export type ImovelPerguntaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImovelPerguntas to delete
     */
    where?: ImovelPerguntaWhereInput
    /**
     * Limit how many ImovelPerguntas to delete.
     */
    limit?: number
  }

  /**
   * ImovelPergunta without action
   */
  export type ImovelPerguntaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImovelPergunta
     */
    select?: ImovelPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImovelPergunta
     */
    omit?: ImovelPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImovelPerguntaInclude<ExtArgs> | null
  }


  /**
   * Model MensagemContato
   */

  export type AggregateMensagemContato = {
    _count: MensagemContatoCountAggregateOutputType | null
    _min: MensagemContatoMinAggregateOutputType | null
    _max: MensagemContatoMaxAggregateOutputType | null
  }

  export type MensagemContatoMinAggregateOutputType = {
    id: string | null
    texto: string | null
    resposta: string | null
    usuarioNome: string | null
    usuarioEmail: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MensagemContatoMaxAggregateOutputType = {
    id: string | null
    texto: string | null
    resposta: string | null
    usuarioNome: string | null
    usuarioEmail: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MensagemContatoCountAggregateOutputType = {
    id: number
    texto: number
    resposta: number
    usuarioNome: number
    usuarioEmail: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MensagemContatoMinAggregateInputType = {
    id?: true
    texto?: true
    resposta?: true
    usuarioNome?: true
    usuarioEmail?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MensagemContatoMaxAggregateInputType = {
    id?: true
    texto?: true
    resposta?: true
    usuarioNome?: true
    usuarioEmail?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MensagemContatoCountAggregateInputType = {
    id?: true
    texto?: true
    resposta?: true
    usuarioNome?: true
    usuarioEmail?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MensagemContatoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MensagemContato to aggregate.
     */
    where?: MensagemContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MensagemContatoes to fetch.
     */
    orderBy?: MensagemContatoOrderByWithRelationInput | MensagemContatoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MensagemContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MensagemContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MensagemContatoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MensagemContatoes
    **/
    _count?: true | MensagemContatoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MensagemContatoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MensagemContatoMaxAggregateInputType
  }

  export type GetMensagemContatoAggregateType<T extends MensagemContatoAggregateArgs> = {
        [P in keyof T & keyof AggregateMensagemContato]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMensagemContato[P]>
      : GetScalarType<T[P], AggregateMensagemContato[P]>
  }




  export type MensagemContatoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MensagemContatoWhereInput
    orderBy?: MensagemContatoOrderByWithAggregationInput | MensagemContatoOrderByWithAggregationInput[]
    by: MensagemContatoScalarFieldEnum[] | MensagemContatoScalarFieldEnum
    having?: MensagemContatoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MensagemContatoCountAggregateInputType | true
    _min?: MensagemContatoMinAggregateInputType
    _max?: MensagemContatoMaxAggregateInputType
  }

  export type MensagemContatoGroupByOutputType = {
    id: string
    texto: string
    resposta: string | null
    usuarioNome: string
    usuarioEmail: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: MensagemContatoCountAggregateOutputType | null
    _min: MensagemContatoMinAggregateOutputType | null
    _max: MensagemContatoMaxAggregateOutputType | null
  }

  type GetMensagemContatoGroupByPayload<T extends MensagemContatoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MensagemContatoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MensagemContatoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MensagemContatoGroupByOutputType[P]>
            : GetScalarType<T[P], MensagemContatoGroupByOutputType[P]>
        }
      >
    >


  export type MensagemContatoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    resposta?: boolean
    usuarioNome?: boolean
    usuarioEmail?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mensagemContato"]>

  export type MensagemContatoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    resposta?: boolean
    usuarioNome?: boolean
    usuarioEmail?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mensagemContato"]>

  export type MensagemContatoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    resposta?: boolean
    usuarioNome?: boolean
    usuarioEmail?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mensagemContato"]>

  export type MensagemContatoSelectScalar = {
    id?: boolean
    texto?: boolean
    resposta?: boolean
    usuarioNome?: boolean
    usuarioEmail?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MensagemContatoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "texto" | "resposta" | "usuarioNome" | "usuarioEmail" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["mensagemContato"]>

  export type $MensagemContatoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MensagemContato"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      texto: string
      resposta: string | null
      usuarioNome: string
      usuarioEmail: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mensagemContato"]>
    composites: {}
  }

  type MensagemContatoGetPayload<S extends boolean | null | undefined | MensagemContatoDefaultArgs> = $Result.GetResult<Prisma.$MensagemContatoPayload, S>

  type MensagemContatoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MensagemContatoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MensagemContatoCountAggregateInputType | true
    }

  export interface MensagemContatoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MensagemContato'], meta: { name: 'MensagemContato' } }
    /**
     * Find zero or one MensagemContato that matches the filter.
     * @param {MensagemContatoFindUniqueArgs} args - Arguments to find a MensagemContato
     * @example
     * // Get one MensagemContato
     * const mensagemContato = await prisma.mensagemContato.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MensagemContatoFindUniqueArgs>(args: SelectSubset<T, MensagemContatoFindUniqueArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MensagemContato that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MensagemContatoFindUniqueOrThrowArgs} args - Arguments to find a MensagemContato
     * @example
     * // Get one MensagemContato
     * const mensagemContato = await prisma.mensagemContato.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MensagemContatoFindUniqueOrThrowArgs>(args: SelectSubset<T, MensagemContatoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MensagemContato that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoFindFirstArgs} args - Arguments to find a MensagemContato
     * @example
     * // Get one MensagemContato
     * const mensagemContato = await prisma.mensagemContato.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MensagemContatoFindFirstArgs>(args?: SelectSubset<T, MensagemContatoFindFirstArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MensagemContato that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoFindFirstOrThrowArgs} args - Arguments to find a MensagemContato
     * @example
     * // Get one MensagemContato
     * const mensagemContato = await prisma.mensagemContato.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MensagemContatoFindFirstOrThrowArgs>(args?: SelectSubset<T, MensagemContatoFindFirstOrThrowArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MensagemContatoes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MensagemContatoes
     * const mensagemContatoes = await prisma.mensagemContato.findMany()
     * 
     * // Get first 10 MensagemContatoes
     * const mensagemContatoes = await prisma.mensagemContato.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mensagemContatoWithIdOnly = await prisma.mensagemContato.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MensagemContatoFindManyArgs>(args?: SelectSubset<T, MensagemContatoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MensagemContato.
     * @param {MensagemContatoCreateArgs} args - Arguments to create a MensagemContato.
     * @example
     * // Create one MensagemContato
     * const MensagemContato = await prisma.mensagemContato.create({
     *   data: {
     *     // ... data to create a MensagemContato
     *   }
     * })
     * 
     */
    create<T extends MensagemContatoCreateArgs>(args: SelectSubset<T, MensagemContatoCreateArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MensagemContatoes.
     * @param {MensagemContatoCreateManyArgs} args - Arguments to create many MensagemContatoes.
     * @example
     * // Create many MensagemContatoes
     * const mensagemContato = await prisma.mensagemContato.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MensagemContatoCreateManyArgs>(args?: SelectSubset<T, MensagemContatoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MensagemContatoes and returns the data saved in the database.
     * @param {MensagemContatoCreateManyAndReturnArgs} args - Arguments to create many MensagemContatoes.
     * @example
     * // Create many MensagemContatoes
     * const mensagemContato = await prisma.mensagemContato.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MensagemContatoes and only return the `id`
     * const mensagemContatoWithIdOnly = await prisma.mensagemContato.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MensagemContatoCreateManyAndReturnArgs>(args?: SelectSubset<T, MensagemContatoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MensagemContato.
     * @param {MensagemContatoDeleteArgs} args - Arguments to delete one MensagemContato.
     * @example
     * // Delete one MensagemContato
     * const MensagemContato = await prisma.mensagemContato.delete({
     *   where: {
     *     // ... filter to delete one MensagemContato
     *   }
     * })
     * 
     */
    delete<T extends MensagemContatoDeleteArgs>(args: SelectSubset<T, MensagemContatoDeleteArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MensagemContato.
     * @param {MensagemContatoUpdateArgs} args - Arguments to update one MensagemContato.
     * @example
     * // Update one MensagemContato
     * const mensagemContato = await prisma.mensagemContato.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MensagemContatoUpdateArgs>(args: SelectSubset<T, MensagemContatoUpdateArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MensagemContatoes.
     * @param {MensagemContatoDeleteManyArgs} args - Arguments to filter MensagemContatoes to delete.
     * @example
     * // Delete a few MensagemContatoes
     * const { count } = await prisma.mensagemContato.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MensagemContatoDeleteManyArgs>(args?: SelectSubset<T, MensagemContatoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MensagemContatoes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MensagemContatoes
     * const mensagemContato = await prisma.mensagemContato.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MensagemContatoUpdateManyArgs>(args: SelectSubset<T, MensagemContatoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MensagemContatoes and returns the data updated in the database.
     * @param {MensagemContatoUpdateManyAndReturnArgs} args - Arguments to update many MensagemContatoes.
     * @example
     * // Update many MensagemContatoes
     * const mensagemContato = await prisma.mensagemContato.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MensagemContatoes and only return the `id`
     * const mensagemContatoWithIdOnly = await prisma.mensagemContato.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MensagemContatoUpdateManyAndReturnArgs>(args: SelectSubset<T, MensagemContatoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MensagemContato.
     * @param {MensagemContatoUpsertArgs} args - Arguments to update or create a MensagemContato.
     * @example
     * // Update or create a MensagemContato
     * const mensagemContato = await prisma.mensagemContato.upsert({
     *   create: {
     *     // ... data to create a MensagemContato
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MensagemContato we want to update
     *   }
     * })
     */
    upsert<T extends MensagemContatoUpsertArgs>(args: SelectSubset<T, MensagemContatoUpsertArgs<ExtArgs>>): Prisma__MensagemContatoClient<$Result.GetResult<Prisma.$MensagemContatoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MensagemContatoes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoCountArgs} args - Arguments to filter MensagemContatoes to count.
     * @example
     * // Count the number of MensagemContatoes
     * const count = await prisma.mensagemContato.count({
     *   where: {
     *     // ... the filter for the MensagemContatoes we want to count
     *   }
     * })
    **/
    count<T extends MensagemContatoCountArgs>(
      args?: Subset<T, MensagemContatoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MensagemContatoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MensagemContato.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MensagemContatoAggregateArgs>(args: Subset<T, MensagemContatoAggregateArgs>): Prisma.PrismaPromise<GetMensagemContatoAggregateType<T>>

    /**
     * Group by MensagemContato.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MensagemContatoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MensagemContatoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MensagemContatoGroupByArgs['orderBy'] }
        : { orderBy?: MensagemContatoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MensagemContatoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMensagemContatoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MensagemContato model
   */
  readonly fields: MensagemContatoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MensagemContato.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MensagemContatoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MensagemContato model
   */
  interface MensagemContatoFieldRefs {
    readonly id: FieldRef<"MensagemContato", 'String'>
    readonly texto: FieldRef<"MensagemContato", 'String'>
    readonly resposta: FieldRef<"MensagemContato", 'String'>
    readonly usuarioNome: FieldRef<"MensagemContato", 'String'>
    readonly usuarioEmail: FieldRef<"MensagemContato", 'String'>
    readonly status: FieldRef<"MensagemContato", 'String'>
    readonly createdAt: FieldRef<"MensagemContato", 'DateTime'>
    readonly updatedAt: FieldRef<"MensagemContato", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MensagemContato findUnique
   */
  export type MensagemContatoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * Filter, which MensagemContato to fetch.
     */
    where: MensagemContatoWhereUniqueInput
  }

  /**
   * MensagemContato findUniqueOrThrow
   */
  export type MensagemContatoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * Filter, which MensagemContato to fetch.
     */
    where: MensagemContatoWhereUniqueInput
  }

  /**
   * MensagemContato findFirst
   */
  export type MensagemContatoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * Filter, which MensagemContato to fetch.
     */
    where?: MensagemContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MensagemContatoes to fetch.
     */
    orderBy?: MensagemContatoOrderByWithRelationInput | MensagemContatoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MensagemContatoes.
     */
    cursor?: MensagemContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MensagemContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MensagemContatoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MensagemContatoes.
     */
    distinct?: MensagemContatoScalarFieldEnum | MensagemContatoScalarFieldEnum[]
  }

  /**
   * MensagemContato findFirstOrThrow
   */
  export type MensagemContatoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * Filter, which MensagemContato to fetch.
     */
    where?: MensagemContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MensagemContatoes to fetch.
     */
    orderBy?: MensagemContatoOrderByWithRelationInput | MensagemContatoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MensagemContatoes.
     */
    cursor?: MensagemContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MensagemContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MensagemContatoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MensagemContatoes.
     */
    distinct?: MensagemContatoScalarFieldEnum | MensagemContatoScalarFieldEnum[]
  }

  /**
   * MensagemContato findMany
   */
  export type MensagemContatoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * Filter, which MensagemContatoes to fetch.
     */
    where?: MensagemContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MensagemContatoes to fetch.
     */
    orderBy?: MensagemContatoOrderByWithRelationInput | MensagemContatoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MensagemContatoes.
     */
    cursor?: MensagemContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MensagemContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MensagemContatoes.
     */
    skip?: number
    distinct?: MensagemContatoScalarFieldEnum | MensagemContatoScalarFieldEnum[]
  }

  /**
   * MensagemContato create
   */
  export type MensagemContatoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * The data needed to create a MensagemContato.
     */
    data: XOR<MensagemContatoCreateInput, MensagemContatoUncheckedCreateInput>
  }

  /**
   * MensagemContato createMany
   */
  export type MensagemContatoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MensagemContatoes.
     */
    data: MensagemContatoCreateManyInput | MensagemContatoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MensagemContato createManyAndReturn
   */
  export type MensagemContatoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * The data used to create many MensagemContatoes.
     */
    data: MensagemContatoCreateManyInput | MensagemContatoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MensagemContato update
   */
  export type MensagemContatoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * The data needed to update a MensagemContato.
     */
    data: XOR<MensagemContatoUpdateInput, MensagemContatoUncheckedUpdateInput>
    /**
     * Choose, which MensagemContato to update.
     */
    where: MensagemContatoWhereUniqueInput
  }

  /**
   * MensagemContato updateMany
   */
  export type MensagemContatoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MensagemContatoes.
     */
    data: XOR<MensagemContatoUpdateManyMutationInput, MensagemContatoUncheckedUpdateManyInput>
    /**
     * Filter which MensagemContatoes to update
     */
    where?: MensagemContatoWhereInput
    /**
     * Limit how many MensagemContatoes to update.
     */
    limit?: number
  }

  /**
   * MensagemContato updateManyAndReturn
   */
  export type MensagemContatoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * The data used to update MensagemContatoes.
     */
    data: XOR<MensagemContatoUpdateManyMutationInput, MensagemContatoUncheckedUpdateManyInput>
    /**
     * Filter which MensagemContatoes to update
     */
    where?: MensagemContatoWhereInput
    /**
     * Limit how many MensagemContatoes to update.
     */
    limit?: number
  }

  /**
   * MensagemContato upsert
   */
  export type MensagemContatoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * The filter to search for the MensagemContato to update in case it exists.
     */
    where: MensagemContatoWhereUniqueInput
    /**
     * In case the MensagemContato found by the `where` argument doesn't exist, create a new MensagemContato with this data.
     */
    create: XOR<MensagemContatoCreateInput, MensagemContatoUncheckedCreateInput>
    /**
     * In case the MensagemContato was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MensagemContatoUpdateInput, MensagemContatoUncheckedUpdateInput>
  }

  /**
   * MensagemContato delete
   */
  export type MensagemContatoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
    /**
     * Filter which MensagemContato to delete.
     */
    where: MensagemContatoWhereUniqueInput
  }

  /**
   * MensagemContato deleteMany
   */
  export type MensagemContatoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MensagemContatoes to delete
     */
    where?: MensagemContatoWhereInput
    /**
     * Limit how many MensagemContatoes to delete.
     */
    limit?: number
  }

  /**
   * MensagemContato without action
   */
  export type MensagemContatoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MensagemContato
     */
    select?: MensagemContatoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MensagemContato
     */
    omit?: MensagemContatoOmit<ExtArgs> | null
  }


  /**
   * Model AIConversation
   */

  export type AggregateAIConversation = {
    _count: AIConversationCountAggregateOutputType | null
    _min: AIConversationMinAggregateOutputType | null
    _max: AIConversationMaxAggregateOutputType | null
  }

  export type AIConversationMinAggregateOutputType = {
    id: string | null
    messages: string | null
    userId: string | null
    sessionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AIConversationMaxAggregateOutputType = {
    id: string | null
    messages: string | null
    userId: string | null
    sessionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AIConversationCountAggregateOutputType = {
    id: number
    messages: number
    userId: number
    sessionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AIConversationMinAggregateInputType = {
    id?: true
    messages?: true
    userId?: true
    sessionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AIConversationMaxAggregateInputType = {
    id?: true
    messages?: true
    userId?: true
    sessionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AIConversationCountAggregateInputType = {
    id?: true
    messages?: true
    userId?: true
    sessionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AIConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIConversation to aggregate.
     */
    where?: AIConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConversations to fetch.
     */
    orderBy?: AIConversationOrderByWithRelationInput | AIConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AIConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AIConversations
    **/
    _count?: true | AIConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AIConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AIConversationMaxAggregateInputType
  }

  export type GetAIConversationAggregateType<T extends AIConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateAIConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAIConversation[P]>
      : GetScalarType<T[P], AggregateAIConversation[P]>
  }




  export type AIConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AIConversationWhereInput
    orderBy?: AIConversationOrderByWithAggregationInput | AIConversationOrderByWithAggregationInput[]
    by: AIConversationScalarFieldEnum[] | AIConversationScalarFieldEnum
    having?: AIConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AIConversationCountAggregateInputType | true
    _min?: AIConversationMinAggregateInputType
    _max?: AIConversationMaxAggregateInputType
  }

  export type AIConversationGroupByOutputType = {
    id: string
    messages: string
    userId: string | null
    sessionId: string | null
    createdAt: Date
    updatedAt: Date
    _count: AIConversationCountAggregateOutputType | null
    _min: AIConversationMinAggregateOutputType | null
    _max: AIConversationMaxAggregateOutputType | null
  }

  type GetAIConversationGroupByPayload<T extends AIConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AIConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AIConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AIConversationGroupByOutputType[P]>
            : GetScalarType<T[P], AIConversationGroupByOutputType[P]>
        }
      >
    >


  export type AIConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messages?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aIConversation"]>

  export type AIConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messages?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aIConversation"]>

  export type AIConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messages?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aIConversation"]>

  export type AIConversationSelectScalar = {
    id?: boolean
    messages?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AIConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "messages" | "userId" | "sessionId" | "createdAt" | "updatedAt", ExtArgs["result"]["aIConversation"]>

  export type $AIConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AIConversation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      messages: string
      userId: string | null
      sessionId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aIConversation"]>
    composites: {}
  }

  type AIConversationGetPayload<S extends boolean | null | undefined | AIConversationDefaultArgs> = $Result.GetResult<Prisma.$AIConversationPayload, S>

  type AIConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AIConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AIConversationCountAggregateInputType | true
    }

  export interface AIConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AIConversation'], meta: { name: 'AIConversation' } }
    /**
     * Find zero or one AIConversation that matches the filter.
     * @param {AIConversationFindUniqueArgs} args - Arguments to find a AIConversation
     * @example
     * // Get one AIConversation
     * const aIConversation = await prisma.aIConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AIConversationFindUniqueArgs>(args: SelectSubset<T, AIConversationFindUniqueArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AIConversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AIConversationFindUniqueOrThrowArgs} args - Arguments to find a AIConversation
     * @example
     * // Get one AIConversation
     * const aIConversation = await prisma.aIConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AIConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, AIConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationFindFirstArgs} args - Arguments to find a AIConversation
     * @example
     * // Get one AIConversation
     * const aIConversation = await prisma.aIConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AIConversationFindFirstArgs>(args?: SelectSubset<T, AIConversationFindFirstArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationFindFirstOrThrowArgs} args - Arguments to find a AIConversation
     * @example
     * // Get one AIConversation
     * const aIConversation = await prisma.aIConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AIConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, AIConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AIConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AIConversations
     * const aIConversations = await prisma.aIConversation.findMany()
     * 
     * // Get first 10 AIConversations
     * const aIConversations = await prisma.aIConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aIConversationWithIdOnly = await prisma.aIConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AIConversationFindManyArgs>(args?: SelectSubset<T, AIConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AIConversation.
     * @param {AIConversationCreateArgs} args - Arguments to create a AIConversation.
     * @example
     * // Create one AIConversation
     * const AIConversation = await prisma.aIConversation.create({
     *   data: {
     *     // ... data to create a AIConversation
     *   }
     * })
     * 
     */
    create<T extends AIConversationCreateArgs>(args: SelectSubset<T, AIConversationCreateArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AIConversations.
     * @param {AIConversationCreateManyArgs} args - Arguments to create many AIConversations.
     * @example
     * // Create many AIConversations
     * const aIConversation = await prisma.aIConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AIConversationCreateManyArgs>(args?: SelectSubset<T, AIConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AIConversations and returns the data saved in the database.
     * @param {AIConversationCreateManyAndReturnArgs} args - Arguments to create many AIConversations.
     * @example
     * // Create many AIConversations
     * const aIConversation = await prisma.aIConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AIConversations and only return the `id`
     * const aIConversationWithIdOnly = await prisma.aIConversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AIConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, AIConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AIConversation.
     * @param {AIConversationDeleteArgs} args - Arguments to delete one AIConversation.
     * @example
     * // Delete one AIConversation
     * const AIConversation = await prisma.aIConversation.delete({
     *   where: {
     *     // ... filter to delete one AIConversation
     *   }
     * })
     * 
     */
    delete<T extends AIConversationDeleteArgs>(args: SelectSubset<T, AIConversationDeleteArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AIConversation.
     * @param {AIConversationUpdateArgs} args - Arguments to update one AIConversation.
     * @example
     * // Update one AIConversation
     * const aIConversation = await prisma.aIConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AIConversationUpdateArgs>(args: SelectSubset<T, AIConversationUpdateArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AIConversations.
     * @param {AIConversationDeleteManyArgs} args - Arguments to filter AIConversations to delete.
     * @example
     * // Delete a few AIConversations
     * const { count } = await prisma.aIConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AIConversationDeleteManyArgs>(args?: SelectSubset<T, AIConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AIConversations
     * const aIConversation = await prisma.aIConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AIConversationUpdateManyArgs>(args: SelectSubset<T, AIConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIConversations and returns the data updated in the database.
     * @param {AIConversationUpdateManyAndReturnArgs} args - Arguments to update many AIConversations.
     * @example
     * // Update many AIConversations
     * const aIConversation = await prisma.aIConversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AIConversations and only return the `id`
     * const aIConversationWithIdOnly = await prisma.aIConversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AIConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, AIConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AIConversation.
     * @param {AIConversationUpsertArgs} args - Arguments to update or create a AIConversation.
     * @example
     * // Update or create a AIConversation
     * const aIConversation = await prisma.aIConversation.upsert({
     *   create: {
     *     // ... data to create a AIConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AIConversation we want to update
     *   }
     * })
     */
    upsert<T extends AIConversationUpsertArgs>(args: SelectSubset<T, AIConversationUpsertArgs<ExtArgs>>): Prisma__AIConversationClient<$Result.GetResult<Prisma.$AIConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AIConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationCountArgs} args - Arguments to filter AIConversations to count.
     * @example
     * // Count the number of AIConversations
     * const count = await prisma.aIConversation.count({
     *   where: {
     *     // ... the filter for the AIConversations we want to count
     *   }
     * })
    **/
    count<T extends AIConversationCountArgs>(
      args?: Subset<T, AIConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AIConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AIConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AIConversationAggregateArgs>(args: Subset<T, AIConversationAggregateArgs>): Prisma.PrismaPromise<GetAIConversationAggregateType<T>>

    /**
     * Group by AIConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AIConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AIConversationGroupByArgs['orderBy'] }
        : { orderBy?: AIConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AIConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAIConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AIConversation model
   */
  readonly fields: AIConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AIConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AIConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AIConversation model
   */
  interface AIConversationFieldRefs {
    readonly id: FieldRef<"AIConversation", 'String'>
    readonly messages: FieldRef<"AIConversation", 'String'>
    readonly userId: FieldRef<"AIConversation", 'String'>
    readonly sessionId: FieldRef<"AIConversation", 'String'>
    readonly createdAt: FieldRef<"AIConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"AIConversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AIConversation findUnique
   */
  export type AIConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * Filter, which AIConversation to fetch.
     */
    where: AIConversationWhereUniqueInput
  }

  /**
   * AIConversation findUniqueOrThrow
   */
  export type AIConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * Filter, which AIConversation to fetch.
     */
    where: AIConversationWhereUniqueInput
  }

  /**
   * AIConversation findFirst
   */
  export type AIConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * Filter, which AIConversation to fetch.
     */
    where?: AIConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConversations to fetch.
     */
    orderBy?: AIConversationOrderByWithRelationInput | AIConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIConversations.
     */
    cursor?: AIConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIConversations.
     */
    distinct?: AIConversationScalarFieldEnum | AIConversationScalarFieldEnum[]
  }

  /**
   * AIConversation findFirstOrThrow
   */
  export type AIConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * Filter, which AIConversation to fetch.
     */
    where?: AIConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConversations to fetch.
     */
    orderBy?: AIConversationOrderByWithRelationInput | AIConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIConversations.
     */
    cursor?: AIConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIConversations.
     */
    distinct?: AIConversationScalarFieldEnum | AIConversationScalarFieldEnum[]
  }

  /**
   * AIConversation findMany
   */
  export type AIConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * Filter, which AIConversations to fetch.
     */
    where?: AIConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConversations to fetch.
     */
    orderBy?: AIConversationOrderByWithRelationInput | AIConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AIConversations.
     */
    cursor?: AIConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConversations.
     */
    skip?: number
    distinct?: AIConversationScalarFieldEnum | AIConversationScalarFieldEnum[]
  }

  /**
   * AIConversation create
   */
  export type AIConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * The data needed to create a AIConversation.
     */
    data: XOR<AIConversationCreateInput, AIConversationUncheckedCreateInput>
  }

  /**
   * AIConversation createMany
   */
  export type AIConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AIConversations.
     */
    data: AIConversationCreateManyInput | AIConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIConversation createManyAndReturn
   */
  export type AIConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * The data used to create many AIConversations.
     */
    data: AIConversationCreateManyInput | AIConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIConversation update
   */
  export type AIConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * The data needed to update a AIConversation.
     */
    data: XOR<AIConversationUpdateInput, AIConversationUncheckedUpdateInput>
    /**
     * Choose, which AIConversation to update.
     */
    where: AIConversationWhereUniqueInput
  }

  /**
   * AIConversation updateMany
   */
  export type AIConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AIConversations.
     */
    data: XOR<AIConversationUpdateManyMutationInput, AIConversationUncheckedUpdateManyInput>
    /**
     * Filter which AIConversations to update
     */
    where?: AIConversationWhereInput
    /**
     * Limit how many AIConversations to update.
     */
    limit?: number
  }

  /**
   * AIConversation updateManyAndReturn
   */
  export type AIConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * The data used to update AIConversations.
     */
    data: XOR<AIConversationUpdateManyMutationInput, AIConversationUncheckedUpdateManyInput>
    /**
     * Filter which AIConversations to update
     */
    where?: AIConversationWhereInput
    /**
     * Limit how many AIConversations to update.
     */
    limit?: number
  }

  /**
   * AIConversation upsert
   */
  export type AIConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * The filter to search for the AIConversation to update in case it exists.
     */
    where: AIConversationWhereUniqueInput
    /**
     * In case the AIConversation found by the `where` argument doesn't exist, create a new AIConversation with this data.
     */
    create: XOR<AIConversationCreateInput, AIConversationUncheckedCreateInput>
    /**
     * In case the AIConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AIConversationUpdateInput, AIConversationUncheckedUpdateInput>
  }

  /**
   * AIConversation delete
   */
  export type AIConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
    /**
     * Filter which AIConversation to delete.
     */
    where: AIConversationWhereUniqueInput
  }

  /**
   * AIConversation deleteMany
   */
  export type AIConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIConversations to delete
     */
    where?: AIConversationWhereInput
    /**
     * Limit how many AIConversations to delete.
     */
    limit?: number
  }

  /**
   * AIConversation without action
   */
  export type AIConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConversation
     */
    select?: AIConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConversation
     */
    omit?: AIConversationOmit<ExtArgs> | null
  }


  /**
   * Model AIActionHistory
   */

  export type AggregateAIActionHistory = {
    _count: AIActionHistoryCountAggregateOutputType | null
    _avg: AIActionHistoryAvgAggregateOutputType | null
    _sum: AIActionHistorySumAggregateOutputType | null
    _min: AIActionHistoryMinAggregateOutputType | null
    _max: AIActionHistoryMaxAggregateOutputType | null
  }

  export type AIActionHistoryAvgAggregateOutputType = {
    id: number | null
  }

  export type AIActionHistorySumAggregateOutputType = {
    id: number | null
  }

  export type AIActionHistoryMinAggregateOutputType = {
    id: number | null
    tipo: string | null
    acao: string | null
    entidade: string | null
    idEntidade: string | null
    timestamp: Date | null
    status: string | null
    detalhes: string | null
  }

  export type AIActionHistoryMaxAggregateOutputType = {
    id: number | null
    tipo: string | null
    acao: string | null
    entidade: string | null
    idEntidade: string | null
    timestamp: Date | null
    status: string | null
    detalhes: string | null
  }

  export type AIActionHistoryCountAggregateOutputType = {
    id: number
    tipo: number
    acao: number
    entidade: number
    idEntidade: number
    timestamp: number
    status: number
    detalhes: number
    _all: number
  }


  export type AIActionHistoryAvgAggregateInputType = {
    id?: true
  }

  export type AIActionHistorySumAggregateInputType = {
    id?: true
  }

  export type AIActionHistoryMinAggregateInputType = {
    id?: true
    tipo?: true
    acao?: true
    entidade?: true
    idEntidade?: true
    timestamp?: true
    status?: true
    detalhes?: true
  }

  export type AIActionHistoryMaxAggregateInputType = {
    id?: true
    tipo?: true
    acao?: true
    entidade?: true
    idEntidade?: true
    timestamp?: true
    status?: true
    detalhes?: true
  }

  export type AIActionHistoryCountAggregateInputType = {
    id?: true
    tipo?: true
    acao?: true
    entidade?: true
    idEntidade?: true
    timestamp?: true
    status?: true
    detalhes?: true
    _all?: true
  }

  export type AIActionHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIActionHistory to aggregate.
     */
    where?: AIActionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIActionHistories to fetch.
     */
    orderBy?: AIActionHistoryOrderByWithRelationInput | AIActionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AIActionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIActionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIActionHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AIActionHistories
    **/
    _count?: true | AIActionHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AIActionHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AIActionHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AIActionHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AIActionHistoryMaxAggregateInputType
  }

  export type GetAIActionHistoryAggregateType<T extends AIActionHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateAIActionHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAIActionHistory[P]>
      : GetScalarType<T[P], AggregateAIActionHistory[P]>
  }




  export type AIActionHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AIActionHistoryWhereInput
    orderBy?: AIActionHistoryOrderByWithAggregationInput | AIActionHistoryOrderByWithAggregationInput[]
    by: AIActionHistoryScalarFieldEnum[] | AIActionHistoryScalarFieldEnum
    having?: AIActionHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AIActionHistoryCountAggregateInputType | true
    _avg?: AIActionHistoryAvgAggregateInputType
    _sum?: AIActionHistorySumAggregateInputType
    _min?: AIActionHistoryMinAggregateInputType
    _max?: AIActionHistoryMaxAggregateInputType
  }

  export type AIActionHistoryGroupByOutputType = {
    id: number
    tipo: string
    acao: string
    entidade: string
    idEntidade: string | null
    timestamp: Date
    status: string
    detalhes: string | null
    _count: AIActionHistoryCountAggregateOutputType | null
    _avg: AIActionHistoryAvgAggregateOutputType | null
    _sum: AIActionHistorySumAggregateOutputType | null
    _min: AIActionHistoryMinAggregateOutputType | null
    _max: AIActionHistoryMaxAggregateOutputType | null
  }

  type GetAIActionHistoryGroupByPayload<T extends AIActionHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AIActionHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AIActionHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AIActionHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], AIActionHistoryGroupByOutputType[P]>
        }
      >
    >


  export type AIActionHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    acao?: boolean
    entidade?: boolean
    idEntidade?: boolean
    timestamp?: boolean
    status?: boolean
    detalhes?: boolean
  }, ExtArgs["result"]["aIActionHistory"]>

  export type AIActionHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    acao?: boolean
    entidade?: boolean
    idEntidade?: boolean
    timestamp?: boolean
    status?: boolean
    detalhes?: boolean
  }, ExtArgs["result"]["aIActionHistory"]>

  export type AIActionHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    acao?: boolean
    entidade?: boolean
    idEntidade?: boolean
    timestamp?: boolean
    status?: boolean
    detalhes?: boolean
  }, ExtArgs["result"]["aIActionHistory"]>

  export type AIActionHistorySelectScalar = {
    id?: boolean
    tipo?: boolean
    acao?: boolean
    entidade?: boolean
    idEntidade?: boolean
    timestamp?: boolean
    status?: boolean
    detalhes?: boolean
  }

  export type AIActionHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tipo" | "acao" | "entidade" | "idEntidade" | "timestamp" | "status" | "detalhes", ExtArgs["result"]["aIActionHistory"]>

  export type $AIActionHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AIActionHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tipo: string
      acao: string
      entidade: string
      idEntidade: string | null
      timestamp: Date
      status: string
      detalhes: string | null
    }, ExtArgs["result"]["aIActionHistory"]>
    composites: {}
  }

  type AIActionHistoryGetPayload<S extends boolean | null | undefined | AIActionHistoryDefaultArgs> = $Result.GetResult<Prisma.$AIActionHistoryPayload, S>

  type AIActionHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AIActionHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AIActionHistoryCountAggregateInputType | true
    }

  export interface AIActionHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AIActionHistory'], meta: { name: 'AIActionHistory' } }
    /**
     * Find zero or one AIActionHistory that matches the filter.
     * @param {AIActionHistoryFindUniqueArgs} args - Arguments to find a AIActionHistory
     * @example
     * // Get one AIActionHistory
     * const aIActionHistory = await prisma.aIActionHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AIActionHistoryFindUniqueArgs>(args: SelectSubset<T, AIActionHistoryFindUniqueArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AIActionHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AIActionHistoryFindUniqueOrThrowArgs} args - Arguments to find a AIActionHistory
     * @example
     * // Get one AIActionHistory
     * const aIActionHistory = await prisma.aIActionHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AIActionHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, AIActionHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIActionHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryFindFirstArgs} args - Arguments to find a AIActionHistory
     * @example
     * // Get one AIActionHistory
     * const aIActionHistory = await prisma.aIActionHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AIActionHistoryFindFirstArgs>(args?: SelectSubset<T, AIActionHistoryFindFirstArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIActionHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryFindFirstOrThrowArgs} args - Arguments to find a AIActionHistory
     * @example
     * // Get one AIActionHistory
     * const aIActionHistory = await prisma.aIActionHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AIActionHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, AIActionHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AIActionHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AIActionHistories
     * const aIActionHistories = await prisma.aIActionHistory.findMany()
     * 
     * // Get first 10 AIActionHistories
     * const aIActionHistories = await prisma.aIActionHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aIActionHistoryWithIdOnly = await prisma.aIActionHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AIActionHistoryFindManyArgs>(args?: SelectSubset<T, AIActionHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AIActionHistory.
     * @param {AIActionHistoryCreateArgs} args - Arguments to create a AIActionHistory.
     * @example
     * // Create one AIActionHistory
     * const AIActionHistory = await prisma.aIActionHistory.create({
     *   data: {
     *     // ... data to create a AIActionHistory
     *   }
     * })
     * 
     */
    create<T extends AIActionHistoryCreateArgs>(args: SelectSubset<T, AIActionHistoryCreateArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AIActionHistories.
     * @param {AIActionHistoryCreateManyArgs} args - Arguments to create many AIActionHistories.
     * @example
     * // Create many AIActionHistories
     * const aIActionHistory = await prisma.aIActionHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AIActionHistoryCreateManyArgs>(args?: SelectSubset<T, AIActionHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AIActionHistories and returns the data saved in the database.
     * @param {AIActionHistoryCreateManyAndReturnArgs} args - Arguments to create many AIActionHistories.
     * @example
     * // Create many AIActionHistories
     * const aIActionHistory = await prisma.aIActionHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AIActionHistories and only return the `id`
     * const aIActionHistoryWithIdOnly = await prisma.aIActionHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AIActionHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, AIActionHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AIActionHistory.
     * @param {AIActionHistoryDeleteArgs} args - Arguments to delete one AIActionHistory.
     * @example
     * // Delete one AIActionHistory
     * const AIActionHistory = await prisma.aIActionHistory.delete({
     *   where: {
     *     // ... filter to delete one AIActionHistory
     *   }
     * })
     * 
     */
    delete<T extends AIActionHistoryDeleteArgs>(args: SelectSubset<T, AIActionHistoryDeleteArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AIActionHistory.
     * @param {AIActionHistoryUpdateArgs} args - Arguments to update one AIActionHistory.
     * @example
     * // Update one AIActionHistory
     * const aIActionHistory = await prisma.aIActionHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AIActionHistoryUpdateArgs>(args: SelectSubset<T, AIActionHistoryUpdateArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AIActionHistories.
     * @param {AIActionHistoryDeleteManyArgs} args - Arguments to filter AIActionHistories to delete.
     * @example
     * // Delete a few AIActionHistories
     * const { count } = await prisma.aIActionHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AIActionHistoryDeleteManyArgs>(args?: SelectSubset<T, AIActionHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIActionHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AIActionHistories
     * const aIActionHistory = await prisma.aIActionHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AIActionHistoryUpdateManyArgs>(args: SelectSubset<T, AIActionHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIActionHistories and returns the data updated in the database.
     * @param {AIActionHistoryUpdateManyAndReturnArgs} args - Arguments to update many AIActionHistories.
     * @example
     * // Update many AIActionHistories
     * const aIActionHistory = await prisma.aIActionHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AIActionHistories and only return the `id`
     * const aIActionHistoryWithIdOnly = await prisma.aIActionHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AIActionHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, AIActionHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AIActionHistory.
     * @param {AIActionHistoryUpsertArgs} args - Arguments to update or create a AIActionHistory.
     * @example
     * // Update or create a AIActionHistory
     * const aIActionHistory = await prisma.aIActionHistory.upsert({
     *   create: {
     *     // ... data to create a AIActionHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AIActionHistory we want to update
     *   }
     * })
     */
    upsert<T extends AIActionHistoryUpsertArgs>(args: SelectSubset<T, AIActionHistoryUpsertArgs<ExtArgs>>): Prisma__AIActionHistoryClient<$Result.GetResult<Prisma.$AIActionHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AIActionHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryCountArgs} args - Arguments to filter AIActionHistories to count.
     * @example
     * // Count the number of AIActionHistories
     * const count = await prisma.aIActionHistory.count({
     *   where: {
     *     // ... the filter for the AIActionHistories we want to count
     *   }
     * })
    **/
    count<T extends AIActionHistoryCountArgs>(
      args?: Subset<T, AIActionHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AIActionHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AIActionHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AIActionHistoryAggregateArgs>(args: Subset<T, AIActionHistoryAggregateArgs>): Prisma.PrismaPromise<GetAIActionHistoryAggregateType<T>>

    /**
     * Group by AIActionHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIActionHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AIActionHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AIActionHistoryGroupByArgs['orderBy'] }
        : { orderBy?: AIActionHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AIActionHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAIActionHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AIActionHistory model
   */
  readonly fields: AIActionHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AIActionHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AIActionHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AIActionHistory model
   */
  interface AIActionHistoryFieldRefs {
    readonly id: FieldRef<"AIActionHistory", 'Int'>
    readonly tipo: FieldRef<"AIActionHistory", 'String'>
    readonly acao: FieldRef<"AIActionHistory", 'String'>
    readonly entidade: FieldRef<"AIActionHistory", 'String'>
    readonly idEntidade: FieldRef<"AIActionHistory", 'String'>
    readonly timestamp: FieldRef<"AIActionHistory", 'DateTime'>
    readonly status: FieldRef<"AIActionHistory", 'String'>
    readonly detalhes: FieldRef<"AIActionHistory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AIActionHistory findUnique
   */
  export type AIActionHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * Filter, which AIActionHistory to fetch.
     */
    where: AIActionHistoryWhereUniqueInput
  }

  /**
   * AIActionHistory findUniqueOrThrow
   */
  export type AIActionHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * Filter, which AIActionHistory to fetch.
     */
    where: AIActionHistoryWhereUniqueInput
  }

  /**
   * AIActionHistory findFirst
   */
  export type AIActionHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * Filter, which AIActionHistory to fetch.
     */
    where?: AIActionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIActionHistories to fetch.
     */
    orderBy?: AIActionHistoryOrderByWithRelationInput | AIActionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIActionHistories.
     */
    cursor?: AIActionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIActionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIActionHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIActionHistories.
     */
    distinct?: AIActionHistoryScalarFieldEnum | AIActionHistoryScalarFieldEnum[]
  }

  /**
   * AIActionHistory findFirstOrThrow
   */
  export type AIActionHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * Filter, which AIActionHistory to fetch.
     */
    where?: AIActionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIActionHistories to fetch.
     */
    orderBy?: AIActionHistoryOrderByWithRelationInput | AIActionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIActionHistories.
     */
    cursor?: AIActionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIActionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIActionHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIActionHistories.
     */
    distinct?: AIActionHistoryScalarFieldEnum | AIActionHistoryScalarFieldEnum[]
  }

  /**
   * AIActionHistory findMany
   */
  export type AIActionHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * Filter, which AIActionHistories to fetch.
     */
    where?: AIActionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIActionHistories to fetch.
     */
    orderBy?: AIActionHistoryOrderByWithRelationInput | AIActionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AIActionHistories.
     */
    cursor?: AIActionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIActionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIActionHistories.
     */
    skip?: number
    distinct?: AIActionHistoryScalarFieldEnum | AIActionHistoryScalarFieldEnum[]
  }

  /**
   * AIActionHistory create
   */
  export type AIActionHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a AIActionHistory.
     */
    data: XOR<AIActionHistoryCreateInput, AIActionHistoryUncheckedCreateInput>
  }

  /**
   * AIActionHistory createMany
   */
  export type AIActionHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AIActionHistories.
     */
    data: AIActionHistoryCreateManyInput | AIActionHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIActionHistory createManyAndReturn
   */
  export type AIActionHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many AIActionHistories.
     */
    data: AIActionHistoryCreateManyInput | AIActionHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIActionHistory update
   */
  export type AIActionHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a AIActionHistory.
     */
    data: XOR<AIActionHistoryUpdateInput, AIActionHistoryUncheckedUpdateInput>
    /**
     * Choose, which AIActionHistory to update.
     */
    where: AIActionHistoryWhereUniqueInput
  }

  /**
   * AIActionHistory updateMany
   */
  export type AIActionHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AIActionHistories.
     */
    data: XOR<AIActionHistoryUpdateManyMutationInput, AIActionHistoryUncheckedUpdateManyInput>
    /**
     * Filter which AIActionHistories to update
     */
    where?: AIActionHistoryWhereInput
    /**
     * Limit how many AIActionHistories to update.
     */
    limit?: number
  }

  /**
   * AIActionHistory updateManyAndReturn
   */
  export type AIActionHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * The data used to update AIActionHistories.
     */
    data: XOR<AIActionHistoryUpdateManyMutationInput, AIActionHistoryUncheckedUpdateManyInput>
    /**
     * Filter which AIActionHistories to update
     */
    where?: AIActionHistoryWhereInput
    /**
     * Limit how many AIActionHistories to update.
     */
    limit?: number
  }

  /**
   * AIActionHistory upsert
   */
  export type AIActionHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the AIActionHistory to update in case it exists.
     */
    where: AIActionHistoryWhereUniqueInput
    /**
     * In case the AIActionHistory found by the `where` argument doesn't exist, create a new AIActionHistory with this data.
     */
    create: XOR<AIActionHistoryCreateInput, AIActionHistoryUncheckedCreateInput>
    /**
     * In case the AIActionHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AIActionHistoryUpdateInput, AIActionHistoryUncheckedUpdateInput>
  }

  /**
   * AIActionHistory delete
   */
  export type AIActionHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
    /**
     * Filter which AIActionHistory to delete.
     */
    where: AIActionHistoryWhereUniqueInput
  }

  /**
   * AIActionHistory deleteMany
   */
  export type AIActionHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIActionHistories to delete
     */
    where?: AIActionHistoryWhereInput
    /**
     * Limit how many AIActionHistories to delete.
     */
    limit?: number
  }

  /**
   * AIActionHistory without action
   */
  export type AIActionHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIActionHistory
     */
    select?: AIActionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIActionHistory
     */
    omit?: AIActionHistoryOmit<ExtArgs> | null
  }


  /**
   * Model AIConfig
   */

  export type AggregateAIConfig = {
    _count: AIConfigCountAggregateOutputType | null
    _min: AIConfigMinAggregateOutputType | null
    _max: AIConfigMaxAggregateOutputType | null
  }

  export type AIConfigMinAggregateOutputType = {
    id: string | null
    chave: string | null
    valor: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AIConfigMaxAggregateOutputType = {
    id: string | null
    chave: string | null
    valor: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AIConfigCountAggregateOutputType = {
    id: number
    chave: number
    valor: number
    descricao: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AIConfigMinAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AIConfigMaxAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AIConfigCountAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AIConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIConfig to aggregate.
     */
    where?: AIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConfigs to fetch.
     */
    orderBy?: AIConfigOrderByWithRelationInput | AIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AIConfigs
    **/
    _count?: true | AIConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AIConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AIConfigMaxAggregateInputType
  }

  export type GetAIConfigAggregateType<T extends AIConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateAIConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAIConfig[P]>
      : GetScalarType<T[P], AggregateAIConfig[P]>
  }




  export type AIConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AIConfigWhereInput
    orderBy?: AIConfigOrderByWithAggregationInput | AIConfigOrderByWithAggregationInput[]
    by: AIConfigScalarFieldEnum[] | AIConfigScalarFieldEnum
    having?: AIConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AIConfigCountAggregateInputType | true
    _min?: AIConfigMinAggregateInputType
    _max?: AIConfigMaxAggregateInputType
  }

  export type AIConfigGroupByOutputType = {
    id: string
    chave: string
    valor: string
    descricao: string | null
    createdAt: Date
    updatedAt: Date
    _count: AIConfigCountAggregateOutputType | null
    _min: AIConfigMinAggregateOutputType | null
    _max: AIConfigMaxAggregateOutputType | null
  }

  type GetAIConfigGroupByPayload<T extends AIConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AIConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AIConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AIConfigGroupByOutputType[P]>
            : GetScalarType<T[P], AIConfigGroupByOutputType[P]>
        }
      >
    >


  export type AIConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aIConfig"]>

  export type AIConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aIConfig"]>

  export type AIConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aIConfig"]>

  export type AIConfigSelectScalar = {
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AIConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chave" | "valor" | "descricao" | "createdAt" | "updatedAt", ExtArgs["result"]["aIConfig"]>

  export type $AIConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AIConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chave: string
      valor: string
      descricao: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aIConfig"]>
    composites: {}
  }

  type AIConfigGetPayload<S extends boolean | null | undefined | AIConfigDefaultArgs> = $Result.GetResult<Prisma.$AIConfigPayload, S>

  type AIConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AIConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AIConfigCountAggregateInputType | true
    }

  export interface AIConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AIConfig'], meta: { name: 'AIConfig' } }
    /**
     * Find zero or one AIConfig that matches the filter.
     * @param {AIConfigFindUniqueArgs} args - Arguments to find a AIConfig
     * @example
     * // Get one AIConfig
     * const aIConfig = await prisma.aIConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AIConfigFindUniqueArgs>(args: SelectSubset<T, AIConfigFindUniqueArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AIConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AIConfigFindUniqueOrThrowArgs} args - Arguments to find a AIConfig
     * @example
     * // Get one AIConfig
     * const aIConfig = await prisma.aIConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AIConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, AIConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigFindFirstArgs} args - Arguments to find a AIConfig
     * @example
     * // Get one AIConfig
     * const aIConfig = await prisma.aIConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AIConfigFindFirstArgs>(args?: SelectSubset<T, AIConfigFindFirstArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigFindFirstOrThrowArgs} args - Arguments to find a AIConfig
     * @example
     * // Get one AIConfig
     * const aIConfig = await prisma.aIConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AIConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, AIConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AIConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AIConfigs
     * const aIConfigs = await prisma.aIConfig.findMany()
     * 
     * // Get first 10 AIConfigs
     * const aIConfigs = await prisma.aIConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aIConfigWithIdOnly = await prisma.aIConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AIConfigFindManyArgs>(args?: SelectSubset<T, AIConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AIConfig.
     * @param {AIConfigCreateArgs} args - Arguments to create a AIConfig.
     * @example
     * // Create one AIConfig
     * const AIConfig = await prisma.aIConfig.create({
     *   data: {
     *     // ... data to create a AIConfig
     *   }
     * })
     * 
     */
    create<T extends AIConfigCreateArgs>(args: SelectSubset<T, AIConfigCreateArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AIConfigs.
     * @param {AIConfigCreateManyArgs} args - Arguments to create many AIConfigs.
     * @example
     * // Create many AIConfigs
     * const aIConfig = await prisma.aIConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AIConfigCreateManyArgs>(args?: SelectSubset<T, AIConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AIConfigs and returns the data saved in the database.
     * @param {AIConfigCreateManyAndReturnArgs} args - Arguments to create many AIConfigs.
     * @example
     * // Create many AIConfigs
     * const aIConfig = await prisma.aIConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AIConfigs and only return the `id`
     * const aIConfigWithIdOnly = await prisma.aIConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AIConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, AIConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AIConfig.
     * @param {AIConfigDeleteArgs} args - Arguments to delete one AIConfig.
     * @example
     * // Delete one AIConfig
     * const AIConfig = await prisma.aIConfig.delete({
     *   where: {
     *     // ... filter to delete one AIConfig
     *   }
     * })
     * 
     */
    delete<T extends AIConfigDeleteArgs>(args: SelectSubset<T, AIConfigDeleteArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AIConfig.
     * @param {AIConfigUpdateArgs} args - Arguments to update one AIConfig.
     * @example
     * // Update one AIConfig
     * const aIConfig = await prisma.aIConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AIConfigUpdateArgs>(args: SelectSubset<T, AIConfigUpdateArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AIConfigs.
     * @param {AIConfigDeleteManyArgs} args - Arguments to filter AIConfigs to delete.
     * @example
     * // Delete a few AIConfigs
     * const { count } = await prisma.aIConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AIConfigDeleteManyArgs>(args?: SelectSubset<T, AIConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AIConfigs
     * const aIConfig = await prisma.aIConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AIConfigUpdateManyArgs>(args: SelectSubset<T, AIConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIConfigs and returns the data updated in the database.
     * @param {AIConfigUpdateManyAndReturnArgs} args - Arguments to update many AIConfigs.
     * @example
     * // Update many AIConfigs
     * const aIConfig = await prisma.aIConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AIConfigs and only return the `id`
     * const aIConfigWithIdOnly = await prisma.aIConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AIConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, AIConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AIConfig.
     * @param {AIConfigUpsertArgs} args - Arguments to update or create a AIConfig.
     * @example
     * // Update or create a AIConfig
     * const aIConfig = await prisma.aIConfig.upsert({
     *   create: {
     *     // ... data to create a AIConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AIConfig we want to update
     *   }
     * })
     */
    upsert<T extends AIConfigUpsertArgs>(args: SelectSubset<T, AIConfigUpsertArgs<ExtArgs>>): Prisma__AIConfigClient<$Result.GetResult<Prisma.$AIConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AIConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigCountArgs} args - Arguments to filter AIConfigs to count.
     * @example
     * // Count the number of AIConfigs
     * const count = await prisma.aIConfig.count({
     *   where: {
     *     // ... the filter for the AIConfigs we want to count
     *   }
     * })
    **/
    count<T extends AIConfigCountArgs>(
      args?: Subset<T, AIConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AIConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AIConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AIConfigAggregateArgs>(args: Subset<T, AIConfigAggregateArgs>): Prisma.PrismaPromise<GetAIConfigAggregateType<T>>

    /**
     * Group by AIConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AIConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AIConfigGroupByArgs['orderBy'] }
        : { orderBy?: AIConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AIConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAIConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AIConfig model
   */
  readonly fields: AIConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AIConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AIConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AIConfig model
   */
  interface AIConfigFieldRefs {
    readonly id: FieldRef<"AIConfig", 'String'>
    readonly chave: FieldRef<"AIConfig", 'String'>
    readonly valor: FieldRef<"AIConfig", 'String'>
    readonly descricao: FieldRef<"AIConfig", 'String'>
    readonly createdAt: FieldRef<"AIConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"AIConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AIConfig findUnique
   */
  export type AIConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * Filter, which AIConfig to fetch.
     */
    where: AIConfigWhereUniqueInput
  }

  /**
   * AIConfig findUniqueOrThrow
   */
  export type AIConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * Filter, which AIConfig to fetch.
     */
    where: AIConfigWhereUniqueInput
  }

  /**
   * AIConfig findFirst
   */
  export type AIConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * Filter, which AIConfig to fetch.
     */
    where?: AIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConfigs to fetch.
     */
    orderBy?: AIConfigOrderByWithRelationInput | AIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIConfigs.
     */
    cursor?: AIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIConfigs.
     */
    distinct?: AIConfigScalarFieldEnum | AIConfigScalarFieldEnum[]
  }

  /**
   * AIConfig findFirstOrThrow
   */
  export type AIConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * Filter, which AIConfig to fetch.
     */
    where?: AIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConfigs to fetch.
     */
    orderBy?: AIConfigOrderByWithRelationInput | AIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIConfigs.
     */
    cursor?: AIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIConfigs.
     */
    distinct?: AIConfigScalarFieldEnum | AIConfigScalarFieldEnum[]
  }

  /**
   * AIConfig findMany
   */
  export type AIConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * Filter, which AIConfigs to fetch.
     */
    where?: AIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIConfigs to fetch.
     */
    orderBy?: AIConfigOrderByWithRelationInput | AIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AIConfigs.
     */
    cursor?: AIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIConfigs.
     */
    skip?: number
    distinct?: AIConfigScalarFieldEnum | AIConfigScalarFieldEnum[]
  }

  /**
   * AIConfig create
   */
  export type AIConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a AIConfig.
     */
    data: XOR<AIConfigCreateInput, AIConfigUncheckedCreateInput>
  }

  /**
   * AIConfig createMany
   */
  export type AIConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AIConfigs.
     */
    data: AIConfigCreateManyInput | AIConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIConfig createManyAndReturn
   */
  export type AIConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * The data used to create many AIConfigs.
     */
    data: AIConfigCreateManyInput | AIConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIConfig update
   */
  export type AIConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a AIConfig.
     */
    data: XOR<AIConfigUpdateInput, AIConfigUncheckedUpdateInput>
    /**
     * Choose, which AIConfig to update.
     */
    where: AIConfigWhereUniqueInput
  }

  /**
   * AIConfig updateMany
   */
  export type AIConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AIConfigs.
     */
    data: XOR<AIConfigUpdateManyMutationInput, AIConfigUncheckedUpdateManyInput>
    /**
     * Filter which AIConfigs to update
     */
    where?: AIConfigWhereInput
    /**
     * Limit how many AIConfigs to update.
     */
    limit?: number
  }

  /**
   * AIConfig updateManyAndReturn
   */
  export type AIConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * The data used to update AIConfigs.
     */
    data: XOR<AIConfigUpdateManyMutationInput, AIConfigUncheckedUpdateManyInput>
    /**
     * Filter which AIConfigs to update
     */
    where?: AIConfigWhereInput
    /**
     * Limit how many AIConfigs to update.
     */
    limit?: number
  }

  /**
   * AIConfig upsert
   */
  export type AIConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the AIConfig to update in case it exists.
     */
    where: AIConfigWhereUniqueInput
    /**
     * In case the AIConfig found by the `where` argument doesn't exist, create a new AIConfig with this data.
     */
    create: XOR<AIConfigCreateInput, AIConfigUncheckedCreateInput>
    /**
     * In case the AIConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AIConfigUpdateInput, AIConfigUncheckedUpdateInput>
  }

  /**
   * AIConfig delete
   */
  export type AIConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
    /**
     * Filter which AIConfig to delete.
     */
    where: AIConfigWhereUniqueInput
  }

  /**
   * AIConfig deleteMany
   */
  export type AIConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIConfigs to delete
     */
    where?: AIConfigWhereInput
    /**
     * Limit how many AIConfigs to delete.
     */
    limit?: number
  }

  /**
   * AIConfig without action
   */
  export type AIConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIConfig
     */
    select?: AIConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIConfig
     */
    omit?: AIConfigOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TipoImovelScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    slug: 'slug',
    descricao: 'descricao',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TipoImovelScalarFieldEnum = (typeof TipoImovelScalarFieldEnum)[keyof typeof TipoImovelScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    telefone: 'telefone',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    construtoraId: 'construtoraId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ConstrutoraScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cnpj: 'cnpj',
    telefone: 'telefone',
    email: 'email',
    endereco: 'endereco',
    ativa: 'ativa',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConstrutoraScalarFieldEnum = (typeof ConstrutoraScalarFieldEnum)[keyof typeof ConstrutoraScalarFieldEnum]


  export const ImovelScalarFieldEnum: {
    id: 'id',
    idExternoAPI: 'idExternoAPI',
    titulo: 'titulo',
    descricao: 'descricao',
    preco: 'preco',
    area: 'area',
    quartos: 'quartos',
    banheiros: 'banheiros',
    vagas: 'vagas',
    latitude: 'latitude',
    longitude: 'longitude',
    telefoneContato: 'telefoneContato',
    endereco: 'endereco',
    fotoPrincipal: 'fotoPrincipal',
    galeriaFotos: 'galeriaFotos',
    caracteristicas: 'caracteristicas',
    caracteristicasArray: 'caracteristicasArray',
    tipoImovelId: 'tipoImovelId',
    tipoImovelNome: 'tipoImovelNome',
    status: 'status',
    ativo: 'ativo',
    destaque: 'destaque',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    construtoraId: 'construtoraId'
  };

  export type ImovelScalarFieldEnum = (typeof ImovelScalarFieldEnum)[keyof typeof ImovelScalarFieldEnum]


  export const PerguntaScalarFieldEnum: {
    id: 'id',
    texto: 'texto',
    tipo: 'tipo',
    opcoes: 'opcoes',
    ordem: 'ordem',
    categoria: 'categoria',
    fluxo: 'fluxo',
    pontuacao: 'pontuacao',
    obrigatoria: 'obrigatoria',
    condicional: 'condicional',
    geradaPorIA: 'geradaPorIA',
    ativa: 'ativa',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PerguntaScalarFieldEnum = (typeof PerguntaScalarFieldEnum)[keyof typeof PerguntaScalarFieldEnum]


  export const RespostaScalarFieldEnum: {
    id: 'id',
    valor: 'valor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    perguntaId: 'perguntaId',
    userId: 'userId'
  };

  export type RespostaScalarFieldEnum = (typeof RespostaScalarFieldEnum)[keyof typeof RespostaScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    porcentagem: 'porcentagem',
    posicaoRanking: 'posicaoRanking',
    destaque: 'destaque',
    criterios: 'criterios',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    imovelId: 'imovelId',
    relatorioId: 'relatorioId'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const RelatorioScalarFieldEnum: {
    id: 'id',
    resumo: 'resumo',
    pdfUrl: 'pdfUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type RelatorioScalarFieldEnum = (typeof RelatorioScalarFieldEnum)[keyof typeof RelatorioScalarFieldEnum]


  export const ConfiguracaoScalarFieldEnum: {
    id: 'id',
    chave: 'chave',
    valor: 'valor',
    descricao: 'descricao',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConfiguracaoScalarFieldEnum = (typeof ConfiguracaoScalarFieldEnum)[keyof typeof ConfiguracaoScalarFieldEnum]


  export const LogIntegracaoScalarFieldEnum: {
    id: 'id',
    tipo: 'tipo',
    status: 'status',
    request: 'request',
    response: 'response',
    erro: 'erro',
    createdAt: 'createdAt'
  };

  export type LogIntegracaoScalarFieldEnum = (typeof LogIntegracaoScalarFieldEnum)[keyof typeof LogIntegracaoScalarFieldEnum]


  export const ImovelMetadataScalarFieldEnum: {
    id: 'id',
    imovelIdExterno: 'imovelIdExterno',
    telefone: 'telefone',
    observacoes: 'observacoes',
    construtoraId: 'construtoraId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ImovelMetadataScalarFieldEnum = (typeof ImovelMetadataScalarFieldEnum)[keyof typeof ImovelMetadataScalarFieldEnum]


  export const ImovelPerguntaScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    imovelId: 'imovelId',
    perguntaId: 'perguntaId'
  };

  export type ImovelPerguntaScalarFieldEnum = (typeof ImovelPerguntaScalarFieldEnum)[keyof typeof ImovelPerguntaScalarFieldEnum]


  export const MensagemContatoScalarFieldEnum: {
    id: 'id',
    texto: 'texto',
    resposta: 'resposta',
    usuarioNome: 'usuarioNome',
    usuarioEmail: 'usuarioEmail',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MensagemContatoScalarFieldEnum = (typeof MensagemContatoScalarFieldEnum)[keyof typeof MensagemContatoScalarFieldEnum]


  export const AIConversationScalarFieldEnum: {
    id: 'id',
    messages: 'messages',
    userId: 'userId',
    sessionId: 'sessionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AIConversationScalarFieldEnum = (typeof AIConversationScalarFieldEnum)[keyof typeof AIConversationScalarFieldEnum]


  export const AIActionHistoryScalarFieldEnum: {
    id: 'id',
    tipo: 'tipo',
    acao: 'acao',
    entidade: 'entidade',
    idEntidade: 'idEntidade',
    timestamp: 'timestamp',
    status: 'status',
    detalhes: 'detalhes'
  };

  export type AIActionHistoryScalarFieldEnum = (typeof AIActionHistoryScalarFieldEnum)[keyof typeof AIActionHistoryScalarFieldEnum]


  export const AIConfigScalarFieldEnum: {
    id: 'id',
    chave: 'chave',
    valor: 'valor',
    descricao: 'descricao',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AIConfigScalarFieldEnum = (typeof AIConfigScalarFieldEnum)[keyof typeof AIConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type TipoImovelWhereInput = {
    AND?: TipoImovelWhereInput | TipoImovelWhereInput[]
    OR?: TipoImovelWhereInput[]
    NOT?: TipoImovelWhereInput | TipoImovelWhereInput[]
    id?: StringFilter<"TipoImovel"> | string
    nome?: StringFilter<"TipoImovel"> | string
    slug?: StringFilter<"TipoImovel"> | string
    descricao?: StringNullableFilter<"TipoImovel"> | string | null
    createdAt?: DateTimeFilter<"TipoImovel"> | Date | string
    updatedAt?: DateTimeFilter<"TipoImovel"> | Date | string
    imoveis?: ImovelListRelationFilter
  }

  export type TipoImovelOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imoveis?: ImovelOrderByRelationAggregateInput
  }

  export type TipoImovelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nome?: string
    slug?: string
    AND?: TipoImovelWhereInput | TipoImovelWhereInput[]
    OR?: TipoImovelWhereInput[]
    NOT?: TipoImovelWhereInput | TipoImovelWhereInput[]
    descricao?: StringNullableFilter<"TipoImovel"> | string | null
    createdAt?: DateTimeFilter<"TipoImovel"> | Date | string
    updatedAt?: DateTimeFilter<"TipoImovel"> | Date | string
    imoveis?: ImovelListRelationFilter
  }, "id" | "nome" | "slug">

  export type TipoImovelOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TipoImovelCountOrderByAggregateInput
    _max?: TipoImovelMaxOrderByAggregateInput
    _min?: TipoImovelMinOrderByAggregateInput
  }

  export type TipoImovelScalarWhereWithAggregatesInput = {
    AND?: TipoImovelScalarWhereWithAggregatesInput | TipoImovelScalarWhereWithAggregatesInput[]
    OR?: TipoImovelScalarWhereWithAggregatesInput[]
    NOT?: TipoImovelScalarWhereWithAggregatesInput | TipoImovelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TipoImovel"> | string
    nome?: StringWithAggregatesFilter<"TipoImovel"> | string
    slug?: StringWithAggregatesFilter<"TipoImovel"> | string
    descricao?: StringNullableWithAggregatesFilter<"TipoImovel"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TipoImovel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TipoImovel"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    telefone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    construtoraId?: StringNullableFilter<"User"> | string | null
    construtora?: XOR<ConstrutoraNullableScalarRelationFilter, ConstrutoraWhereInput> | null
    respostas?: RespostaListRelationFilter
    relatorios?: RelatorioListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    telefone?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrderInput | SortOrder
    construtora?: ConstrutoraOrderByWithRelationInput
    respostas?: RespostaOrderByRelationAggregateInput
    relatorios?: RelatorioOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    telefone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    construtoraId?: StringNullableFilter<"User"> | string | null
    construtora?: XOR<ConstrutoraNullableScalarRelationFilter, ConstrutoraWhereInput> | null
    respostas?: RespostaListRelationFilter
    relatorios?: RelatorioListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    telefone?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    telefone?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    construtoraId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type ConstrutoraWhereInput = {
    AND?: ConstrutoraWhereInput | ConstrutoraWhereInput[]
    OR?: ConstrutoraWhereInput[]
    NOT?: ConstrutoraWhereInput | ConstrutoraWhereInput[]
    id?: StringFilter<"Construtora"> | string
    nome?: StringFilter<"Construtora"> | string
    cnpj?: StringFilter<"Construtora"> | string
    telefone?: StringFilter<"Construtora"> | string
    email?: StringFilter<"Construtora"> | string
    endereco?: StringFilter<"Construtora"> | string
    ativa?: BoolFilter<"Construtora"> | boolean
    createdAt?: DateTimeFilter<"Construtora"> | Date | string
    updatedAt?: DateTimeFilter<"Construtora"> | Date | string
    usuarios?: UserListRelationFilter
    imoveis?: ImovelListRelationFilter
    imoveisMetadata?: ImovelMetadataListRelationFilter
  }

  export type ConstrutoraOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    endereco?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarios?: UserOrderByRelationAggregateInput
    imoveis?: ImovelOrderByRelationAggregateInput
    imoveisMetadata?: ImovelMetadataOrderByRelationAggregateInput
  }

  export type ConstrutoraWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cnpj?: string
    email?: string
    AND?: ConstrutoraWhereInput | ConstrutoraWhereInput[]
    OR?: ConstrutoraWhereInput[]
    NOT?: ConstrutoraWhereInput | ConstrutoraWhereInput[]
    nome?: StringFilter<"Construtora"> | string
    telefone?: StringFilter<"Construtora"> | string
    endereco?: StringFilter<"Construtora"> | string
    ativa?: BoolFilter<"Construtora"> | boolean
    createdAt?: DateTimeFilter<"Construtora"> | Date | string
    updatedAt?: DateTimeFilter<"Construtora"> | Date | string
    usuarios?: UserListRelationFilter
    imoveis?: ImovelListRelationFilter
    imoveisMetadata?: ImovelMetadataListRelationFilter
  }, "id" | "cnpj" | "email">

  export type ConstrutoraOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    endereco?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConstrutoraCountOrderByAggregateInput
    _max?: ConstrutoraMaxOrderByAggregateInput
    _min?: ConstrutoraMinOrderByAggregateInput
  }

  export type ConstrutoraScalarWhereWithAggregatesInput = {
    AND?: ConstrutoraScalarWhereWithAggregatesInput | ConstrutoraScalarWhereWithAggregatesInput[]
    OR?: ConstrutoraScalarWhereWithAggregatesInput[]
    NOT?: ConstrutoraScalarWhereWithAggregatesInput | ConstrutoraScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Construtora"> | string
    nome?: StringWithAggregatesFilter<"Construtora"> | string
    cnpj?: StringWithAggregatesFilter<"Construtora"> | string
    telefone?: StringWithAggregatesFilter<"Construtora"> | string
    email?: StringWithAggregatesFilter<"Construtora"> | string
    endereco?: StringWithAggregatesFilter<"Construtora"> | string
    ativa?: BoolWithAggregatesFilter<"Construtora"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Construtora"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Construtora"> | Date | string
  }

  export type ImovelWhereInput = {
    AND?: ImovelWhereInput | ImovelWhereInput[]
    OR?: ImovelWhereInput[]
    NOT?: ImovelWhereInput | ImovelWhereInput[]
    id?: StringFilter<"Imovel"> | string
    idExternoAPI?: StringNullableFilter<"Imovel"> | string | null
    titulo?: StringFilter<"Imovel"> | string
    descricao?: StringFilter<"Imovel"> | string
    preco?: FloatFilter<"Imovel"> | number
    area?: FloatFilter<"Imovel"> | number
    quartos?: IntFilter<"Imovel"> | number
    banheiros?: IntFilter<"Imovel"> | number
    vagas?: IntFilter<"Imovel"> | number
    latitude?: FloatFilter<"Imovel"> | number
    longitude?: FloatFilter<"Imovel"> | number
    telefoneContato?: StringNullableFilter<"Imovel"> | string | null
    endereco?: StringFilter<"Imovel"> | string
    fotoPrincipal?: StringNullableFilter<"Imovel"> | string | null
    galeriaFotos?: StringNullableListFilter<"Imovel">
    caracteristicas?: JsonNullableFilter<"Imovel">
    caracteristicasArray?: StringNullableListFilter<"Imovel">
    tipoImovelId?: StringNullableFilter<"Imovel"> | string | null
    tipoImovelNome?: StringNullableFilter<"Imovel"> | string | null
    status?: StringNullableFilter<"Imovel"> | string | null
    ativo?: BoolFilter<"Imovel"> | boolean
    destaque?: BoolFilter<"Imovel"> | boolean
    createdAt?: DateTimeFilter<"Imovel"> | Date | string
    updatedAt?: DateTimeFilter<"Imovel"> | Date | string
    construtoraId?: StringFilter<"Imovel"> | string
    tipoImovel?: XOR<TipoImovelNullableScalarRelationFilter, TipoImovelWhereInput> | null
    construtora?: XOR<ConstrutoraScalarRelationFilter, ConstrutoraWhereInput>
    matches?: MatchListRelationFilter
    perguntas?: ImovelPerguntaListRelationFilter
  }

  export type ImovelOrderByWithRelationInput = {
    id?: SortOrder
    idExternoAPI?: SortOrderInput | SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    telefoneContato?: SortOrderInput | SortOrder
    endereco?: SortOrder
    fotoPrincipal?: SortOrderInput | SortOrder
    galeriaFotos?: SortOrder
    caracteristicas?: SortOrderInput | SortOrder
    caracteristicasArray?: SortOrder
    tipoImovelId?: SortOrderInput | SortOrder
    tipoImovelNome?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    ativo?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
    tipoImovel?: TipoImovelOrderByWithRelationInput
    construtora?: ConstrutoraOrderByWithRelationInput
    matches?: MatchOrderByRelationAggregateInput
    perguntas?: ImovelPerguntaOrderByRelationAggregateInput
  }

  export type ImovelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idExternoAPI?: string
    AND?: ImovelWhereInput | ImovelWhereInput[]
    OR?: ImovelWhereInput[]
    NOT?: ImovelWhereInput | ImovelWhereInput[]
    titulo?: StringFilter<"Imovel"> | string
    descricao?: StringFilter<"Imovel"> | string
    preco?: FloatFilter<"Imovel"> | number
    area?: FloatFilter<"Imovel"> | number
    quartos?: IntFilter<"Imovel"> | number
    banheiros?: IntFilter<"Imovel"> | number
    vagas?: IntFilter<"Imovel"> | number
    latitude?: FloatFilter<"Imovel"> | number
    longitude?: FloatFilter<"Imovel"> | number
    telefoneContato?: StringNullableFilter<"Imovel"> | string | null
    endereco?: StringFilter<"Imovel"> | string
    fotoPrincipal?: StringNullableFilter<"Imovel"> | string | null
    galeriaFotos?: StringNullableListFilter<"Imovel">
    caracteristicas?: JsonNullableFilter<"Imovel">
    caracteristicasArray?: StringNullableListFilter<"Imovel">
    tipoImovelId?: StringNullableFilter<"Imovel"> | string | null
    tipoImovelNome?: StringNullableFilter<"Imovel"> | string | null
    status?: StringNullableFilter<"Imovel"> | string | null
    ativo?: BoolFilter<"Imovel"> | boolean
    destaque?: BoolFilter<"Imovel"> | boolean
    createdAt?: DateTimeFilter<"Imovel"> | Date | string
    updatedAt?: DateTimeFilter<"Imovel"> | Date | string
    construtoraId?: StringFilter<"Imovel"> | string
    tipoImovel?: XOR<TipoImovelNullableScalarRelationFilter, TipoImovelWhereInput> | null
    construtora?: XOR<ConstrutoraScalarRelationFilter, ConstrutoraWhereInput>
    matches?: MatchListRelationFilter
    perguntas?: ImovelPerguntaListRelationFilter
  }, "id" | "idExternoAPI">

  export type ImovelOrderByWithAggregationInput = {
    id?: SortOrder
    idExternoAPI?: SortOrderInput | SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    telefoneContato?: SortOrderInput | SortOrder
    endereco?: SortOrder
    fotoPrincipal?: SortOrderInput | SortOrder
    galeriaFotos?: SortOrder
    caracteristicas?: SortOrderInput | SortOrder
    caracteristicasArray?: SortOrder
    tipoImovelId?: SortOrderInput | SortOrder
    tipoImovelNome?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    ativo?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
    _count?: ImovelCountOrderByAggregateInput
    _avg?: ImovelAvgOrderByAggregateInput
    _max?: ImovelMaxOrderByAggregateInput
    _min?: ImovelMinOrderByAggregateInput
    _sum?: ImovelSumOrderByAggregateInput
  }

  export type ImovelScalarWhereWithAggregatesInput = {
    AND?: ImovelScalarWhereWithAggregatesInput | ImovelScalarWhereWithAggregatesInput[]
    OR?: ImovelScalarWhereWithAggregatesInput[]
    NOT?: ImovelScalarWhereWithAggregatesInput | ImovelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Imovel"> | string
    idExternoAPI?: StringNullableWithAggregatesFilter<"Imovel"> | string | null
    titulo?: StringWithAggregatesFilter<"Imovel"> | string
    descricao?: StringWithAggregatesFilter<"Imovel"> | string
    preco?: FloatWithAggregatesFilter<"Imovel"> | number
    area?: FloatWithAggregatesFilter<"Imovel"> | number
    quartos?: IntWithAggregatesFilter<"Imovel"> | number
    banheiros?: IntWithAggregatesFilter<"Imovel"> | number
    vagas?: IntWithAggregatesFilter<"Imovel"> | number
    latitude?: FloatWithAggregatesFilter<"Imovel"> | number
    longitude?: FloatWithAggregatesFilter<"Imovel"> | number
    telefoneContato?: StringNullableWithAggregatesFilter<"Imovel"> | string | null
    endereco?: StringWithAggregatesFilter<"Imovel"> | string
    fotoPrincipal?: StringNullableWithAggregatesFilter<"Imovel"> | string | null
    galeriaFotos?: StringNullableListFilter<"Imovel">
    caracteristicas?: JsonNullableWithAggregatesFilter<"Imovel">
    caracteristicasArray?: StringNullableListFilter<"Imovel">
    tipoImovelId?: StringNullableWithAggregatesFilter<"Imovel"> | string | null
    tipoImovelNome?: StringNullableWithAggregatesFilter<"Imovel"> | string | null
    status?: StringNullableWithAggregatesFilter<"Imovel"> | string | null
    ativo?: BoolWithAggregatesFilter<"Imovel"> | boolean
    destaque?: BoolWithAggregatesFilter<"Imovel"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Imovel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Imovel"> | Date | string
    construtoraId?: StringWithAggregatesFilter<"Imovel"> | string
  }

  export type PerguntaWhereInput = {
    AND?: PerguntaWhereInput | PerguntaWhereInput[]
    OR?: PerguntaWhereInput[]
    NOT?: PerguntaWhereInput | PerguntaWhereInput[]
    id?: StringFilter<"Pergunta"> | string
    texto?: StringFilter<"Pergunta"> | string
    tipo?: StringFilter<"Pergunta"> | string
    opcoes?: JsonNullableFilter<"Pergunta">
    ordem?: IntFilter<"Pergunta"> | number
    categoria?: StringFilter<"Pergunta"> | string
    fluxo?: StringFilter<"Pergunta"> | string
    pontuacao?: IntFilter<"Pergunta"> | number
    obrigatoria?: BoolFilter<"Pergunta"> | boolean
    condicional?: JsonNullableFilter<"Pergunta">
    geradaPorIA?: BoolFilter<"Pergunta"> | boolean
    ativa?: BoolFilter<"Pergunta"> | boolean
    createdAt?: DateTimeFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeFilter<"Pergunta"> | Date | string
    respostas?: RespostaListRelationFilter
    imoveis?: ImovelPerguntaListRelationFilter
  }

  export type PerguntaOrderByWithRelationInput = {
    id?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    opcoes?: SortOrderInput | SortOrder
    ordem?: SortOrder
    categoria?: SortOrder
    fluxo?: SortOrder
    pontuacao?: SortOrder
    obrigatoria?: SortOrder
    condicional?: SortOrderInput | SortOrder
    geradaPorIA?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    respostas?: RespostaOrderByRelationAggregateInput
    imoveis?: ImovelPerguntaOrderByRelationAggregateInput
  }

  export type PerguntaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PerguntaWhereInput | PerguntaWhereInput[]
    OR?: PerguntaWhereInput[]
    NOT?: PerguntaWhereInput | PerguntaWhereInput[]
    texto?: StringFilter<"Pergunta"> | string
    tipo?: StringFilter<"Pergunta"> | string
    opcoes?: JsonNullableFilter<"Pergunta">
    ordem?: IntFilter<"Pergunta"> | number
    categoria?: StringFilter<"Pergunta"> | string
    fluxo?: StringFilter<"Pergunta"> | string
    pontuacao?: IntFilter<"Pergunta"> | number
    obrigatoria?: BoolFilter<"Pergunta"> | boolean
    condicional?: JsonNullableFilter<"Pergunta">
    geradaPorIA?: BoolFilter<"Pergunta"> | boolean
    ativa?: BoolFilter<"Pergunta"> | boolean
    createdAt?: DateTimeFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeFilter<"Pergunta"> | Date | string
    respostas?: RespostaListRelationFilter
    imoveis?: ImovelPerguntaListRelationFilter
  }, "id">

  export type PerguntaOrderByWithAggregationInput = {
    id?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    opcoes?: SortOrderInput | SortOrder
    ordem?: SortOrder
    categoria?: SortOrder
    fluxo?: SortOrder
    pontuacao?: SortOrder
    obrigatoria?: SortOrder
    condicional?: SortOrderInput | SortOrder
    geradaPorIA?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PerguntaCountOrderByAggregateInput
    _avg?: PerguntaAvgOrderByAggregateInput
    _max?: PerguntaMaxOrderByAggregateInput
    _min?: PerguntaMinOrderByAggregateInput
    _sum?: PerguntaSumOrderByAggregateInput
  }

  export type PerguntaScalarWhereWithAggregatesInput = {
    AND?: PerguntaScalarWhereWithAggregatesInput | PerguntaScalarWhereWithAggregatesInput[]
    OR?: PerguntaScalarWhereWithAggregatesInput[]
    NOT?: PerguntaScalarWhereWithAggregatesInput | PerguntaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pergunta"> | string
    texto?: StringWithAggregatesFilter<"Pergunta"> | string
    tipo?: StringWithAggregatesFilter<"Pergunta"> | string
    opcoes?: JsonNullableWithAggregatesFilter<"Pergunta">
    ordem?: IntWithAggregatesFilter<"Pergunta"> | number
    categoria?: StringWithAggregatesFilter<"Pergunta"> | string
    fluxo?: StringWithAggregatesFilter<"Pergunta"> | string
    pontuacao?: IntWithAggregatesFilter<"Pergunta"> | number
    obrigatoria?: BoolWithAggregatesFilter<"Pergunta"> | boolean
    condicional?: JsonNullableWithAggregatesFilter<"Pergunta">
    geradaPorIA?: BoolWithAggregatesFilter<"Pergunta"> | boolean
    ativa?: BoolWithAggregatesFilter<"Pergunta"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pergunta"> | Date | string
  }

  export type RespostaWhereInput = {
    AND?: RespostaWhereInput | RespostaWhereInput[]
    OR?: RespostaWhereInput[]
    NOT?: RespostaWhereInput | RespostaWhereInput[]
    id?: StringFilter<"Resposta"> | string
    valor?: StringFilter<"Resposta"> | string
    createdAt?: DateTimeFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeFilter<"Resposta"> | Date | string
    perguntaId?: StringFilter<"Resposta"> | string
    userId?: StringFilter<"Resposta"> | string
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RespostaOrderByWithRelationInput = {
    id?: SortOrder
    valor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    perguntaId?: SortOrder
    userId?: SortOrder
    pergunta?: PerguntaOrderByWithRelationInput
    usuario?: UserOrderByWithRelationInput
  }

  export type RespostaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RespostaWhereInput | RespostaWhereInput[]
    OR?: RespostaWhereInput[]
    NOT?: RespostaWhereInput | RespostaWhereInput[]
    valor?: StringFilter<"Resposta"> | string
    createdAt?: DateTimeFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeFilter<"Resposta"> | Date | string
    perguntaId?: StringFilter<"Resposta"> | string
    userId?: StringFilter<"Resposta"> | string
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type RespostaOrderByWithAggregationInput = {
    id?: SortOrder
    valor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    perguntaId?: SortOrder
    userId?: SortOrder
    _count?: RespostaCountOrderByAggregateInput
    _max?: RespostaMaxOrderByAggregateInput
    _min?: RespostaMinOrderByAggregateInput
  }

  export type RespostaScalarWhereWithAggregatesInput = {
    AND?: RespostaScalarWhereWithAggregatesInput | RespostaScalarWhereWithAggregatesInput[]
    OR?: RespostaScalarWhereWithAggregatesInput[]
    NOT?: RespostaScalarWhereWithAggregatesInput | RespostaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resposta"> | string
    valor?: StringWithAggregatesFilter<"Resposta"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Resposta"> | Date | string
    perguntaId?: StringWithAggregatesFilter<"Resposta"> | string
    userId?: StringWithAggregatesFilter<"Resposta"> | string
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    porcentagem?: FloatFilter<"Match"> | number
    posicaoRanking?: IntFilter<"Match"> | number
    destaque?: BoolFilter<"Match"> | boolean
    criterios?: JsonFilter<"Match">
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    imovelId?: StringFilter<"Match"> | string
    relatorioId?: StringNullableFilter<"Match"> | string | null
    imovel?: XOR<ImovelScalarRelationFilter, ImovelWhereInput>
    relatorio?: XOR<RelatorioNullableScalarRelationFilter, RelatorioWhereInput> | null
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
    destaque?: SortOrder
    criterios?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    relatorioId?: SortOrderInput | SortOrder
    imovel?: ImovelOrderByWithRelationInput
    relatorio?: RelatorioOrderByWithRelationInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    porcentagem?: FloatFilter<"Match"> | number
    posicaoRanking?: IntFilter<"Match"> | number
    destaque?: BoolFilter<"Match"> | boolean
    criterios?: JsonFilter<"Match">
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    imovelId?: StringFilter<"Match"> | string
    relatorioId?: StringNullableFilter<"Match"> | string | null
    imovel?: XOR<ImovelScalarRelationFilter, ImovelWhereInput>
    relatorio?: XOR<RelatorioNullableScalarRelationFilter, RelatorioWhereInput> | null
  }, "id">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
    destaque?: SortOrder
    criterios?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    relatorioId?: SortOrderInput | SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    porcentagem?: FloatWithAggregatesFilter<"Match"> | number
    posicaoRanking?: IntWithAggregatesFilter<"Match"> | number
    destaque?: BoolWithAggregatesFilter<"Match"> | boolean
    criterios?: JsonWithAggregatesFilter<"Match">
    createdAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    imovelId?: StringWithAggregatesFilter<"Match"> | string
    relatorioId?: StringNullableWithAggregatesFilter<"Match"> | string | null
  }

  export type RelatorioWhereInput = {
    AND?: RelatorioWhereInput | RelatorioWhereInput[]
    OR?: RelatorioWhereInput[]
    NOT?: RelatorioWhereInput | RelatorioWhereInput[]
    id?: StringFilter<"Relatorio"> | string
    resumo?: StringFilter<"Relatorio"> | string
    pdfUrl?: StringNullableFilter<"Relatorio"> | string | null
    createdAt?: DateTimeFilter<"Relatorio"> | Date | string
    updatedAt?: DateTimeFilter<"Relatorio"> | Date | string
    userId?: StringFilter<"Relatorio"> | string
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
    matches?: MatchListRelationFilter
  }

  export type RelatorioOrderByWithRelationInput = {
    id?: SortOrder
    resumo?: SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    usuario?: UserOrderByWithRelationInput
    matches?: MatchOrderByRelationAggregateInput
  }

  export type RelatorioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RelatorioWhereInput | RelatorioWhereInput[]
    OR?: RelatorioWhereInput[]
    NOT?: RelatorioWhereInput | RelatorioWhereInput[]
    resumo?: StringFilter<"Relatorio"> | string
    pdfUrl?: StringNullableFilter<"Relatorio"> | string | null
    createdAt?: DateTimeFilter<"Relatorio"> | Date | string
    updatedAt?: DateTimeFilter<"Relatorio"> | Date | string
    userId?: StringFilter<"Relatorio"> | string
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
    matches?: MatchListRelationFilter
  }, "id">

  export type RelatorioOrderByWithAggregationInput = {
    id?: SortOrder
    resumo?: SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: RelatorioCountOrderByAggregateInput
    _max?: RelatorioMaxOrderByAggregateInput
    _min?: RelatorioMinOrderByAggregateInput
  }

  export type RelatorioScalarWhereWithAggregatesInput = {
    AND?: RelatorioScalarWhereWithAggregatesInput | RelatorioScalarWhereWithAggregatesInput[]
    OR?: RelatorioScalarWhereWithAggregatesInput[]
    NOT?: RelatorioScalarWhereWithAggregatesInput | RelatorioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Relatorio"> | string
    resumo?: StringWithAggregatesFilter<"Relatorio"> | string
    pdfUrl?: StringNullableWithAggregatesFilter<"Relatorio"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Relatorio"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Relatorio"> | Date | string
    userId?: StringWithAggregatesFilter<"Relatorio"> | string
  }

  export type ConfiguracaoWhereInput = {
    AND?: ConfiguracaoWhereInput | ConfiguracaoWhereInput[]
    OR?: ConfiguracaoWhereInput[]
    NOT?: ConfiguracaoWhereInput | ConfiguracaoWhereInput[]
    id?: StringFilter<"Configuracao"> | string
    chave?: StringFilter<"Configuracao"> | string
    valor?: StringFilter<"Configuracao"> | string
    descricao?: StringNullableFilter<"Configuracao"> | string | null
    createdAt?: DateTimeFilter<"Configuracao"> | Date | string
    updatedAt?: DateTimeFilter<"Configuracao"> | Date | string
  }

  export type ConfiguracaoOrderByWithRelationInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfiguracaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    chave?: string
    AND?: ConfiguracaoWhereInput | ConfiguracaoWhereInput[]
    OR?: ConfiguracaoWhereInput[]
    NOT?: ConfiguracaoWhereInput | ConfiguracaoWhereInput[]
    valor?: StringFilter<"Configuracao"> | string
    descricao?: StringNullableFilter<"Configuracao"> | string | null
    createdAt?: DateTimeFilter<"Configuracao"> | Date | string
    updatedAt?: DateTimeFilter<"Configuracao"> | Date | string
  }, "id" | "chave">

  export type ConfiguracaoOrderByWithAggregationInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConfiguracaoCountOrderByAggregateInput
    _max?: ConfiguracaoMaxOrderByAggregateInput
    _min?: ConfiguracaoMinOrderByAggregateInput
  }

  export type ConfiguracaoScalarWhereWithAggregatesInput = {
    AND?: ConfiguracaoScalarWhereWithAggregatesInput | ConfiguracaoScalarWhereWithAggregatesInput[]
    OR?: ConfiguracaoScalarWhereWithAggregatesInput[]
    NOT?: ConfiguracaoScalarWhereWithAggregatesInput | ConfiguracaoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Configuracao"> | string
    chave?: StringWithAggregatesFilter<"Configuracao"> | string
    valor?: StringWithAggregatesFilter<"Configuracao"> | string
    descricao?: StringNullableWithAggregatesFilter<"Configuracao"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Configuracao"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Configuracao"> | Date | string
  }

  export type LogIntegracaoWhereInput = {
    AND?: LogIntegracaoWhereInput | LogIntegracaoWhereInput[]
    OR?: LogIntegracaoWhereInput[]
    NOT?: LogIntegracaoWhereInput | LogIntegracaoWhereInput[]
    id?: StringFilter<"LogIntegracao"> | string
    tipo?: StringFilter<"LogIntegracao"> | string
    status?: StringFilter<"LogIntegracao"> | string
    request?: JsonNullableFilter<"LogIntegracao">
    response?: JsonNullableFilter<"LogIntegracao">
    erro?: StringNullableFilter<"LogIntegracao"> | string | null
    createdAt?: DateTimeFilter<"LogIntegracao"> | Date | string
  }

  export type LogIntegracaoOrderByWithRelationInput = {
    id?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    request?: SortOrderInput | SortOrder
    response?: SortOrderInput | SortOrder
    erro?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type LogIntegracaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LogIntegracaoWhereInput | LogIntegracaoWhereInput[]
    OR?: LogIntegracaoWhereInput[]
    NOT?: LogIntegracaoWhereInput | LogIntegracaoWhereInput[]
    tipo?: StringFilter<"LogIntegracao"> | string
    status?: StringFilter<"LogIntegracao"> | string
    request?: JsonNullableFilter<"LogIntegracao">
    response?: JsonNullableFilter<"LogIntegracao">
    erro?: StringNullableFilter<"LogIntegracao"> | string | null
    createdAt?: DateTimeFilter<"LogIntegracao"> | Date | string
  }, "id">

  export type LogIntegracaoOrderByWithAggregationInput = {
    id?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    request?: SortOrderInput | SortOrder
    response?: SortOrderInput | SortOrder
    erro?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LogIntegracaoCountOrderByAggregateInput
    _max?: LogIntegracaoMaxOrderByAggregateInput
    _min?: LogIntegracaoMinOrderByAggregateInput
  }

  export type LogIntegracaoScalarWhereWithAggregatesInput = {
    AND?: LogIntegracaoScalarWhereWithAggregatesInput | LogIntegracaoScalarWhereWithAggregatesInput[]
    OR?: LogIntegracaoScalarWhereWithAggregatesInput[]
    NOT?: LogIntegracaoScalarWhereWithAggregatesInput | LogIntegracaoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LogIntegracao"> | string
    tipo?: StringWithAggregatesFilter<"LogIntegracao"> | string
    status?: StringWithAggregatesFilter<"LogIntegracao"> | string
    request?: JsonNullableWithAggregatesFilter<"LogIntegracao">
    response?: JsonNullableWithAggregatesFilter<"LogIntegracao">
    erro?: StringNullableWithAggregatesFilter<"LogIntegracao"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LogIntegracao"> | Date | string
  }

  export type ImovelMetadataWhereInput = {
    AND?: ImovelMetadataWhereInput | ImovelMetadataWhereInput[]
    OR?: ImovelMetadataWhereInput[]
    NOT?: ImovelMetadataWhereInput | ImovelMetadataWhereInput[]
    id?: StringFilter<"ImovelMetadata"> | string
    imovelIdExterno?: StringFilter<"ImovelMetadata"> | string
    telefone?: StringFilter<"ImovelMetadata"> | string
    observacoes?: StringFilter<"ImovelMetadata"> | string
    construtoraId?: StringNullableFilter<"ImovelMetadata"> | string | null
    createdAt?: DateTimeFilter<"ImovelMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"ImovelMetadata"> | Date | string
    construtora?: XOR<ConstrutoraNullableScalarRelationFilter, ConstrutoraWhereInput> | null
  }

  export type ImovelMetadataOrderByWithRelationInput = {
    id?: SortOrder
    imovelIdExterno?: SortOrder
    telefone?: SortOrder
    observacoes?: SortOrder
    construtoraId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtora?: ConstrutoraOrderByWithRelationInput
  }

  export type ImovelMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    imovelIdExterno?: string
    AND?: ImovelMetadataWhereInput | ImovelMetadataWhereInput[]
    OR?: ImovelMetadataWhereInput[]
    NOT?: ImovelMetadataWhereInput | ImovelMetadataWhereInput[]
    telefone?: StringFilter<"ImovelMetadata"> | string
    observacoes?: StringFilter<"ImovelMetadata"> | string
    construtoraId?: StringNullableFilter<"ImovelMetadata"> | string | null
    createdAt?: DateTimeFilter<"ImovelMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"ImovelMetadata"> | Date | string
    construtora?: XOR<ConstrutoraNullableScalarRelationFilter, ConstrutoraWhereInput> | null
  }, "id" | "imovelIdExterno">

  export type ImovelMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    imovelIdExterno?: SortOrder
    telefone?: SortOrder
    observacoes?: SortOrder
    construtoraId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImovelMetadataCountOrderByAggregateInput
    _max?: ImovelMetadataMaxOrderByAggregateInput
    _min?: ImovelMetadataMinOrderByAggregateInput
  }

  export type ImovelMetadataScalarWhereWithAggregatesInput = {
    AND?: ImovelMetadataScalarWhereWithAggregatesInput | ImovelMetadataScalarWhereWithAggregatesInput[]
    OR?: ImovelMetadataScalarWhereWithAggregatesInput[]
    NOT?: ImovelMetadataScalarWhereWithAggregatesInput | ImovelMetadataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImovelMetadata"> | string
    imovelIdExterno?: StringWithAggregatesFilter<"ImovelMetadata"> | string
    telefone?: StringWithAggregatesFilter<"ImovelMetadata"> | string
    observacoes?: StringWithAggregatesFilter<"ImovelMetadata"> | string
    construtoraId?: StringNullableWithAggregatesFilter<"ImovelMetadata"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ImovelMetadata"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImovelMetadata"> | Date | string
  }

  export type ImovelPerguntaWhereInput = {
    AND?: ImovelPerguntaWhereInput | ImovelPerguntaWhereInput[]
    OR?: ImovelPerguntaWhereInput[]
    NOT?: ImovelPerguntaWhereInput | ImovelPerguntaWhereInput[]
    id?: StringFilter<"ImovelPergunta"> | string
    createdAt?: DateTimeFilter<"ImovelPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"ImovelPergunta"> | Date | string
    imovelId?: StringFilter<"ImovelPergunta"> | string
    perguntaId?: StringFilter<"ImovelPergunta"> | string
    imovel?: XOR<ImovelScalarRelationFilter, ImovelWhereInput>
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
  }

  export type ImovelPerguntaOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    perguntaId?: SortOrder
    imovel?: ImovelOrderByWithRelationInput
    pergunta?: PerguntaOrderByWithRelationInput
  }

  export type ImovelPerguntaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    imovelId_perguntaId?: ImovelPerguntaImovelIdPerguntaIdCompoundUniqueInput
    AND?: ImovelPerguntaWhereInput | ImovelPerguntaWhereInput[]
    OR?: ImovelPerguntaWhereInput[]
    NOT?: ImovelPerguntaWhereInput | ImovelPerguntaWhereInput[]
    createdAt?: DateTimeFilter<"ImovelPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"ImovelPergunta"> | Date | string
    imovelId?: StringFilter<"ImovelPergunta"> | string
    perguntaId?: StringFilter<"ImovelPergunta"> | string
    imovel?: XOR<ImovelScalarRelationFilter, ImovelWhereInput>
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
  }, "id" | "imovelId_perguntaId">

  export type ImovelPerguntaOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    perguntaId?: SortOrder
    _count?: ImovelPerguntaCountOrderByAggregateInput
    _max?: ImovelPerguntaMaxOrderByAggregateInput
    _min?: ImovelPerguntaMinOrderByAggregateInput
  }

  export type ImovelPerguntaScalarWhereWithAggregatesInput = {
    AND?: ImovelPerguntaScalarWhereWithAggregatesInput | ImovelPerguntaScalarWhereWithAggregatesInput[]
    OR?: ImovelPerguntaScalarWhereWithAggregatesInput[]
    NOT?: ImovelPerguntaScalarWhereWithAggregatesInput | ImovelPerguntaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImovelPergunta"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ImovelPergunta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImovelPergunta"> | Date | string
    imovelId?: StringWithAggregatesFilter<"ImovelPergunta"> | string
    perguntaId?: StringWithAggregatesFilter<"ImovelPergunta"> | string
  }

  export type MensagemContatoWhereInput = {
    AND?: MensagemContatoWhereInput | MensagemContatoWhereInput[]
    OR?: MensagemContatoWhereInput[]
    NOT?: MensagemContatoWhereInput | MensagemContatoWhereInput[]
    id?: StringFilter<"MensagemContato"> | string
    texto?: StringFilter<"MensagemContato"> | string
    resposta?: StringNullableFilter<"MensagemContato"> | string | null
    usuarioNome?: StringFilter<"MensagemContato"> | string
    usuarioEmail?: StringFilter<"MensagemContato"> | string
    status?: StringFilter<"MensagemContato"> | string
    createdAt?: DateTimeFilter<"MensagemContato"> | Date | string
    updatedAt?: DateTimeFilter<"MensagemContato"> | Date | string
  }

  export type MensagemContatoOrderByWithRelationInput = {
    id?: SortOrder
    texto?: SortOrder
    resposta?: SortOrderInput | SortOrder
    usuarioNome?: SortOrder
    usuarioEmail?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MensagemContatoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MensagemContatoWhereInput | MensagemContatoWhereInput[]
    OR?: MensagemContatoWhereInput[]
    NOT?: MensagemContatoWhereInput | MensagemContatoWhereInput[]
    texto?: StringFilter<"MensagemContato"> | string
    resposta?: StringNullableFilter<"MensagemContato"> | string | null
    usuarioNome?: StringFilter<"MensagemContato"> | string
    usuarioEmail?: StringFilter<"MensagemContato"> | string
    status?: StringFilter<"MensagemContato"> | string
    createdAt?: DateTimeFilter<"MensagemContato"> | Date | string
    updatedAt?: DateTimeFilter<"MensagemContato"> | Date | string
  }, "id">

  export type MensagemContatoOrderByWithAggregationInput = {
    id?: SortOrder
    texto?: SortOrder
    resposta?: SortOrderInput | SortOrder
    usuarioNome?: SortOrder
    usuarioEmail?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MensagemContatoCountOrderByAggregateInput
    _max?: MensagemContatoMaxOrderByAggregateInput
    _min?: MensagemContatoMinOrderByAggregateInput
  }

  export type MensagemContatoScalarWhereWithAggregatesInput = {
    AND?: MensagemContatoScalarWhereWithAggregatesInput | MensagemContatoScalarWhereWithAggregatesInput[]
    OR?: MensagemContatoScalarWhereWithAggregatesInput[]
    NOT?: MensagemContatoScalarWhereWithAggregatesInput | MensagemContatoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MensagemContato"> | string
    texto?: StringWithAggregatesFilter<"MensagemContato"> | string
    resposta?: StringNullableWithAggregatesFilter<"MensagemContato"> | string | null
    usuarioNome?: StringWithAggregatesFilter<"MensagemContato"> | string
    usuarioEmail?: StringWithAggregatesFilter<"MensagemContato"> | string
    status?: StringWithAggregatesFilter<"MensagemContato"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MensagemContato"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MensagemContato"> | Date | string
  }

  export type AIConversationWhereInput = {
    AND?: AIConversationWhereInput | AIConversationWhereInput[]
    OR?: AIConversationWhereInput[]
    NOT?: AIConversationWhereInput | AIConversationWhereInput[]
    id?: StringFilter<"AIConversation"> | string
    messages?: StringFilter<"AIConversation"> | string
    userId?: StringNullableFilter<"AIConversation"> | string | null
    sessionId?: StringNullableFilter<"AIConversation"> | string | null
    createdAt?: DateTimeFilter<"AIConversation"> | Date | string
    updatedAt?: DateTimeFilter<"AIConversation"> | Date | string
  }

  export type AIConversationOrderByWithRelationInput = {
    id?: SortOrder
    messages?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AIConversationWhereInput | AIConversationWhereInput[]
    OR?: AIConversationWhereInput[]
    NOT?: AIConversationWhereInput | AIConversationWhereInput[]
    messages?: StringFilter<"AIConversation"> | string
    userId?: StringNullableFilter<"AIConversation"> | string | null
    sessionId?: StringNullableFilter<"AIConversation"> | string | null
    createdAt?: DateTimeFilter<"AIConversation"> | Date | string
    updatedAt?: DateTimeFilter<"AIConversation"> | Date | string
  }, "id">

  export type AIConversationOrderByWithAggregationInput = {
    id?: SortOrder
    messages?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AIConversationCountOrderByAggregateInput
    _max?: AIConversationMaxOrderByAggregateInput
    _min?: AIConversationMinOrderByAggregateInput
  }

  export type AIConversationScalarWhereWithAggregatesInput = {
    AND?: AIConversationScalarWhereWithAggregatesInput | AIConversationScalarWhereWithAggregatesInput[]
    OR?: AIConversationScalarWhereWithAggregatesInput[]
    NOT?: AIConversationScalarWhereWithAggregatesInput | AIConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AIConversation"> | string
    messages?: StringWithAggregatesFilter<"AIConversation"> | string
    userId?: StringNullableWithAggregatesFilter<"AIConversation"> | string | null
    sessionId?: StringNullableWithAggregatesFilter<"AIConversation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AIConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AIConversation"> | Date | string
  }

  export type AIActionHistoryWhereInput = {
    AND?: AIActionHistoryWhereInput | AIActionHistoryWhereInput[]
    OR?: AIActionHistoryWhereInput[]
    NOT?: AIActionHistoryWhereInput | AIActionHistoryWhereInput[]
    id?: IntFilter<"AIActionHistory"> | number
    tipo?: StringFilter<"AIActionHistory"> | string
    acao?: StringFilter<"AIActionHistory"> | string
    entidade?: StringFilter<"AIActionHistory"> | string
    idEntidade?: StringNullableFilter<"AIActionHistory"> | string | null
    timestamp?: DateTimeFilter<"AIActionHistory"> | Date | string
    status?: StringFilter<"AIActionHistory"> | string
    detalhes?: StringNullableFilter<"AIActionHistory"> | string | null
  }

  export type AIActionHistoryOrderByWithRelationInput = {
    id?: SortOrder
    tipo?: SortOrder
    acao?: SortOrder
    entidade?: SortOrder
    idEntidade?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    detalhes?: SortOrderInput | SortOrder
  }

  export type AIActionHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AIActionHistoryWhereInput | AIActionHistoryWhereInput[]
    OR?: AIActionHistoryWhereInput[]
    NOT?: AIActionHistoryWhereInput | AIActionHistoryWhereInput[]
    tipo?: StringFilter<"AIActionHistory"> | string
    acao?: StringFilter<"AIActionHistory"> | string
    entidade?: StringFilter<"AIActionHistory"> | string
    idEntidade?: StringNullableFilter<"AIActionHistory"> | string | null
    timestamp?: DateTimeFilter<"AIActionHistory"> | Date | string
    status?: StringFilter<"AIActionHistory"> | string
    detalhes?: StringNullableFilter<"AIActionHistory"> | string | null
  }, "id">

  export type AIActionHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    tipo?: SortOrder
    acao?: SortOrder
    entidade?: SortOrder
    idEntidade?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    detalhes?: SortOrderInput | SortOrder
    _count?: AIActionHistoryCountOrderByAggregateInput
    _avg?: AIActionHistoryAvgOrderByAggregateInput
    _max?: AIActionHistoryMaxOrderByAggregateInput
    _min?: AIActionHistoryMinOrderByAggregateInput
    _sum?: AIActionHistorySumOrderByAggregateInput
  }

  export type AIActionHistoryScalarWhereWithAggregatesInput = {
    AND?: AIActionHistoryScalarWhereWithAggregatesInput | AIActionHistoryScalarWhereWithAggregatesInput[]
    OR?: AIActionHistoryScalarWhereWithAggregatesInput[]
    NOT?: AIActionHistoryScalarWhereWithAggregatesInput | AIActionHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AIActionHistory"> | number
    tipo?: StringWithAggregatesFilter<"AIActionHistory"> | string
    acao?: StringWithAggregatesFilter<"AIActionHistory"> | string
    entidade?: StringWithAggregatesFilter<"AIActionHistory"> | string
    idEntidade?: StringNullableWithAggregatesFilter<"AIActionHistory"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"AIActionHistory"> | Date | string
    status?: StringWithAggregatesFilter<"AIActionHistory"> | string
    detalhes?: StringNullableWithAggregatesFilter<"AIActionHistory"> | string | null
  }

  export type AIConfigWhereInput = {
    AND?: AIConfigWhereInput | AIConfigWhereInput[]
    OR?: AIConfigWhereInput[]
    NOT?: AIConfigWhereInput | AIConfigWhereInput[]
    id?: StringFilter<"AIConfig"> | string
    chave?: StringFilter<"AIConfig"> | string
    valor?: StringFilter<"AIConfig"> | string
    descricao?: StringNullableFilter<"AIConfig"> | string | null
    createdAt?: DateTimeFilter<"AIConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AIConfig"> | Date | string
  }

  export type AIConfigOrderByWithRelationInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    chave?: string
    AND?: AIConfigWhereInput | AIConfigWhereInput[]
    OR?: AIConfigWhereInput[]
    NOT?: AIConfigWhereInput | AIConfigWhereInput[]
    valor?: StringFilter<"AIConfig"> | string
    descricao?: StringNullableFilter<"AIConfig"> | string | null
    createdAt?: DateTimeFilter<"AIConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AIConfig"> | Date | string
  }, "id" | "chave">

  export type AIConfigOrderByWithAggregationInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AIConfigCountOrderByAggregateInput
    _max?: AIConfigMaxOrderByAggregateInput
    _min?: AIConfigMinOrderByAggregateInput
  }

  export type AIConfigScalarWhereWithAggregatesInput = {
    AND?: AIConfigScalarWhereWithAggregatesInput | AIConfigScalarWhereWithAggregatesInput[]
    OR?: AIConfigScalarWhereWithAggregatesInput[]
    NOT?: AIConfigScalarWhereWithAggregatesInput | AIConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AIConfig"> | string
    chave?: StringWithAggregatesFilter<"AIConfig"> | string
    valor?: StringWithAggregatesFilter<"AIConfig"> | string
    descricao?: StringNullableWithAggregatesFilter<"AIConfig"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AIConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AIConfig"> | Date | string
  }

  export type TipoImovelCreateInput = {
    id?: string
    nome: string
    slug: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    imoveis?: ImovelCreateNestedManyWithoutTipoImovelInput
  }

  export type TipoImovelUncheckedCreateInput = {
    id?: string
    nome: string
    slug: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    imoveis?: ImovelUncheckedCreateNestedManyWithoutTipoImovelInput
  }

  export type TipoImovelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imoveis?: ImovelUpdateManyWithoutTipoImovelNestedInput
  }

  export type TipoImovelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imoveis?: ImovelUncheckedUpdateManyWithoutTipoImovelNestedInput
  }

  export type TipoImovelCreateManyInput = {
    id?: string
    nome: string
    slug: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TipoImovelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TipoImovelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtora?: ConstrutoraCreateNestedOneWithoutUsuariosInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    relatorios?: RelatorioCreateNestedManyWithoutUsuarioInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId?: string | null
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    relatorios?: RelatorioUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtora?: ConstrutoraUpdateOneWithoutUsuariosNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    relatorios?: RelatorioUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: NullableStringFieldUpdateOperationsInput | string | null
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    relatorios?: RelatorioUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConstrutoraCreateInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutConstrutoraInput
    imoveis?: ImovelCreateNestedManyWithoutConstrutoraInput
    imoveisMetadata?: ImovelMetadataCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraUncheckedCreateInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutConstrutoraInput
    imoveis?: ImovelUncheckedCreateNestedManyWithoutConstrutoraInput
    imoveisMetadata?: ImovelMetadataUncheckedCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutConstrutoraNestedInput
    imoveis?: ImovelUpdateManyWithoutConstrutoraNestedInput
    imoveisMetadata?: ImovelMetadataUpdateManyWithoutConstrutoraNestedInput
  }

  export type ConstrutoraUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutConstrutoraNestedInput
    imoveis?: ImovelUncheckedUpdateManyWithoutConstrutoraNestedInput
    imoveisMetadata?: ImovelMetadataUncheckedUpdateManyWithoutConstrutoraNestedInput
  }

  export type ConstrutoraCreateManyInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConstrutoraUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConstrutoraUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelCreateInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tipoImovel?: TipoImovelCreateNestedOneWithoutImoveisInput
    construtora: ConstrutoraCreateNestedOneWithoutImoveisInput
    matches?: MatchCreateNestedManyWithoutImovelInput
    perguntas?: ImovelPerguntaCreateNestedManyWithoutImovelInput
  }

  export type ImovelUncheckedCreateInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelId?: string | null
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId: string
    matches?: MatchUncheckedCreateNestedManyWithoutImovelInput
    perguntas?: ImovelPerguntaUncheckedCreateNestedManyWithoutImovelInput
  }

  export type ImovelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoImovel?: TipoImovelUpdateOneWithoutImoveisNestedInput
    construtora?: ConstrutoraUpdateOneRequiredWithoutImoveisNestedInput
    matches?: MatchUpdateManyWithoutImovelNestedInput
    perguntas?: ImovelPerguntaUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: StringFieldUpdateOperationsInput | string
    matches?: MatchUncheckedUpdateManyWithoutImovelNestedInput
    perguntas?: ImovelPerguntaUncheckedUpdateManyWithoutImovelNestedInput
  }

  export type ImovelCreateManyInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelId?: string | null
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId: string
  }

  export type ImovelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: StringFieldUpdateOperationsInput | string
  }

  export type PerguntaCreateInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaCreateNestedManyWithoutPerguntaInput
    imoveis?: ImovelPerguntaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaUncheckedCreateNestedManyWithoutPerguntaInput
    imoveis?: ImovelPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUpdateManyWithoutPerguntaNestedInput
    imoveis?: ImovelPerguntaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUncheckedUpdateManyWithoutPerguntaNestedInput
    imoveis?: ImovelPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaCreateManyInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerguntaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerguntaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaCreateInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pergunta: PerguntaCreateNestedOneWithoutRespostasInput
    usuario: UserCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntaId: string
    userId: string
  }

  export type RespostaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pergunta?: PerguntaUpdateOneRequiredWithoutRespostasNestedInput
    usuario?: UserUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntaId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type RespostaCreateManyInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntaId: string
    userId: string
  }

  export type RespostaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntaId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type MatchCreateInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    imovel: ImovelCreateNestedOneWithoutMatchesInput
    relatorio?: RelatorioCreateNestedOneWithoutMatchesInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
    relatorioId?: string | null
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovel?: ImovelUpdateOneRequiredWithoutMatchesNestedInput
    relatorio?: RelatorioUpdateOneWithoutMatchesNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
    relatorioId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchCreateManyInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
    relatorioId?: string | null
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
    relatorioId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RelatorioCreateInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    usuario: UserCreateNestedOneWithoutRelatoriosInput
    matches?: MatchCreateNestedManyWithoutRelatorioInput
  }

  export type RelatorioUncheckedCreateInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    matches?: MatchUncheckedCreateNestedManyWithoutRelatorioInput
  }

  export type RelatorioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UserUpdateOneRequiredWithoutRelatoriosNestedInput
    matches?: MatchUpdateManyWithoutRelatorioNestedInput
  }

  export type RelatorioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    matches?: MatchUncheckedUpdateManyWithoutRelatorioNestedInput
  }

  export type RelatorioCreateManyInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type RelatorioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelatorioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ConfiguracaoCreateInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConfiguracaoUncheckedCreateInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConfiguracaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoCreateManyInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConfiguracaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogIntegracaoCreateInput = {
    id?: string
    tipo: string
    status: string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: string | null
    createdAt?: Date | string
  }

  export type LogIntegracaoUncheckedCreateInput = {
    id?: string
    tipo: string
    status: string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: string | null
    createdAt?: Date | string
  }

  export type LogIntegracaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogIntegracaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogIntegracaoCreateManyInput = {
    id?: string
    tipo: string
    status: string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: string | null
    createdAt?: Date | string
  }

  export type LogIntegracaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogIntegracaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    request?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    erro?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelMetadataCreateInput = {
    id?: string
    imovelIdExterno: string
    telefone?: string
    observacoes?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    construtora?: ConstrutoraCreateNestedOneWithoutImoveisMetadataInput
  }

  export type ImovelMetadataUncheckedCreateInput = {
    id?: string
    imovelIdExterno: string
    telefone?: string
    observacoes?: string
    construtoraId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImovelMetadataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtora?: ConstrutoraUpdateOneWithoutImoveisMetadataNestedInput
  }

  export type ImovelMetadataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    construtoraId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelMetadataCreateManyInput = {
    id?: string
    imovelIdExterno: string
    telefone?: string
    observacoes?: string
    construtoraId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImovelMetadataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelMetadataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    construtoraId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelPerguntaCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imovel: ImovelCreateNestedOneWithoutPerguntasInput
    pergunta: PerguntaCreateNestedOneWithoutImoveisInput
  }

  export type ImovelPerguntaUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
    perguntaId: string
  }

  export type ImovelPerguntaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovel?: ImovelUpdateOneRequiredWithoutPerguntasNestedInput
    pergunta?: PerguntaUpdateOneRequiredWithoutImoveisNestedInput
  }

  export type ImovelPerguntaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
    perguntaId?: StringFieldUpdateOperationsInput | string
  }

  export type ImovelPerguntaCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
    perguntaId: string
  }

  export type ImovelPerguntaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelPerguntaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
    perguntaId?: StringFieldUpdateOperationsInput | string
  }

  export type MensagemContatoCreateInput = {
    id?: string
    texto: string
    resposta?: string | null
    usuarioNome: string
    usuarioEmail: string
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MensagemContatoUncheckedCreateInput = {
    id?: string
    texto: string
    resposta?: string | null
    usuarioNome: string
    usuarioEmail: string
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MensagemContatoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    resposta?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioNome?: StringFieldUpdateOperationsInput | string
    usuarioEmail?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MensagemContatoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    resposta?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioNome?: StringFieldUpdateOperationsInput | string
    usuarioEmail?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MensagemContatoCreateManyInput = {
    id?: string
    texto: string
    resposta?: string | null
    usuarioNome: string
    usuarioEmail: string
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MensagemContatoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    resposta?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioNome?: StringFieldUpdateOperationsInput | string
    usuarioEmail?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MensagemContatoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    resposta?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioNome?: StringFieldUpdateOperationsInput | string
    usuarioEmail?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConversationCreateInput = {
    id?: string
    messages: string
    userId?: string | null
    sessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AIConversationUncheckedCreateInput = {
    id?: string
    messages: string
    userId?: string | null
    sessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AIConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messages?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messages?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConversationCreateManyInput = {
    id?: string
    messages: string
    userId?: string | null
    sessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AIConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    messages?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    messages?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIActionHistoryCreateInput = {
    tipo: string
    acao: string
    entidade: string
    idEntidade?: string | null
    timestamp?: Date | string
    status: string
    detalhes?: string | null
  }

  export type AIActionHistoryUncheckedCreateInput = {
    id?: number
    tipo: string
    acao: string
    entidade: string
    idEntidade?: string | null
    timestamp?: Date | string
    status: string
    detalhes?: string | null
  }

  export type AIActionHistoryUpdateInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    acao?: StringFieldUpdateOperationsInput | string
    entidade?: StringFieldUpdateOperationsInput | string
    idEntidade?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AIActionHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    acao?: StringFieldUpdateOperationsInput | string
    entidade?: StringFieldUpdateOperationsInput | string
    idEntidade?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AIActionHistoryCreateManyInput = {
    id?: number
    tipo: string
    acao: string
    entidade: string
    idEntidade?: string | null
    timestamp?: Date | string
    status: string
    detalhes?: string | null
  }

  export type AIActionHistoryUpdateManyMutationInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    acao?: StringFieldUpdateOperationsInput | string
    entidade?: StringFieldUpdateOperationsInput | string
    idEntidade?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AIActionHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    acao?: StringFieldUpdateOperationsInput | string
    entidade?: StringFieldUpdateOperationsInput | string
    idEntidade?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AIConfigCreateInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AIConfigUncheckedCreateInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AIConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConfigCreateManyInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AIConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ImovelListRelationFilter = {
    every?: ImovelWhereInput
    some?: ImovelWhereInput
    none?: ImovelWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ImovelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TipoImovelCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TipoImovelMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TipoImovelMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type ConstrutoraNullableScalarRelationFilter = {
    is?: ConstrutoraWhereInput | null
    isNot?: ConstrutoraWhereInput | null
  }

  export type RespostaListRelationFilter = {
    every?: RespostaWhereInput
    some?: RespostaWhereInput
    none?: RespostaWhereInput
  }

  export type RelatorioListRelationFilter = {
    every?: RelatorioWhereInput
    some?: RelatorioWhereInput
    none?: RelatorioWhereInput
  }

  export type RespostaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RelatorioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    telefone?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    telefone?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    telefone?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type ImovelMetadataListRelationFilter = {
    every?: ImovelMetadataWhereInput
    some?: ImovelMetadataWhereInput
    none?: ImovelMetadataWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImovelMetadataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConstrutoraCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    endereco?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConstrutoraMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    endereco?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConstrutoraMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    endereco?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TipoImovelNullableScalarRelationFilter = {
    is?: TipoImovelWhereInput | null
    isNot?: TipoImovelWhereInput | null
  }

  export type ConstrutoraScalarRelationFilter = {
    is?: ConstrutoraWhereInput
    isNot?: ConstrutoraWhereInput
  }

  export type MatchListRelationFilter = {
    every?: MatchWhereInput
    some?: MatchWhereInput
    none?: MatchWhereInput
  }

  export type ImovelPerguntaListRelationFilter = {
    every?: ImovelPerguntaWhereInput
    some?: ImovelPerguntaWhereInput
    none?: ImovelPerguntaWhereInput
  }

  export type MatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImovelPerguntaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImovelCountOrderByAggregateInput = {
    id?: SortOrder
    idExternoAPI?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    telefoneContato?: SortOrder
    endereco?: SortOrder
    fotoPrincipal?: SortOrder
    galeriaFotos?: SortOrder
    caracteristicas?: SortOrder
    caracteristicasArray?: SortOrder
    tipoImovelId?: SortOrder
    tipoImovelNome?: SortOrder
    status?: SortOrder
    ativo?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
  }

  export type ImovelAvgOrderByAggregateInput = {
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type ImovelMaxOrderByAggregateInput = {
    id?: SortOrder
    idExternoAPI?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    telefoneContato?: SortOrder
    endereco?: SortOrder
    fotoPrincipal?: SortOrder
    tipoImovelId?: SortOrder
    tipoImovelNome?: SortOrder
    status?: SortOrder
    ativo?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
  }

  export type ImovelMinOrderByAggregateInput = {
    id?: SortOrder
    idExternoAPI?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    telefoneContato?: SortOrder
    endereco?: SortOrder
    fotoPrincipal?: SortOrder
    tipoImovelId?: SortOrder
    tipoImovelNome?: SortOrder
    status?: SortOrder
    ativo?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    construtoraId?: SortOrder
  }

  export type ImovelSumOrderByAggregateInput = {
    preco?: SortOrder
    area?: SortOrder
    quartos?: SortOrder
    banheiros?: SortOrder
    vagas?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type PerguntaCountOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    opcoes?: SortOrder
    ordem?: SortOrder
    categoria?: SortOrder
    fluxo?: SortOrder
    pontuacao?: SortOrder
    obrigatoria?: SortOrder
    condicional?: SortOrder
    geradaPorIA?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerguntaAvgOrderByAggregateInput = {
    ordem?: SortOrder
    pontuacao?: SortOrder
  }

  export type PerguntaMaxOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    ordem?: SortOrder
    categoria?: SortOrder
    fluxo?: SortOrder
    pontuacao?: SortOrder
    obrigatoria?: SortOrder
    geradaPorIA?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerguntaMinOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    ordem?: SortOrder
    categoria?: SortOrder
    fluxo?: SortOrder
    pontuacao?: SortOrder
    obrigatoria?: SortOrder
    geradaPorIA?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerguntaSumOrderByAggregateInput = {
    ordem?: SortOrder
    pontuacao?: SortOrder
  }

  export type PerguntaScalarRelationFilter = {
    is?: PerguntaWhereInput
    isNot?: PerguntaWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RespostaCountOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    perguntaId?: SortOrder
    userId?: SortOrder
  }

  export type RespostaMaxOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    perguntaId?: SortOrder
    userId?: SortOrder
  }

  export type RespostaMinOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    perguntaId?: SortOrder
    userId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ImovelScalarRelationFilter = {
    is?: ImovelWhereInput
    isNot?: ImovelWhereInput
  }

  export type RelatorioNullableScalarRelationFilter = {
    is?: RelatorioWhereInput | null
    isNot?: RelatorioWhereInput | null
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
    destaque?: SortOrder
    criterios?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    relatorioId?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    relatorioId?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
    destaque?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    relatorioId?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    porcentagem?: SortOrder
    posicaoRanking?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type RelatorioCountOrderByAggregateInput = {
    id?: SortOrder
    resumo?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type RelatorioMaxOrderByAggregateInput = {
    id?: SortOrder
    resumo?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type RelatorioMinOrderByAggregateInput = {
    id?: SortOrder
    resumo?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ConfiguracaoCountOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfiguracaoMaxOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfiguracaoMinOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LogIntegracaoCountOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    request?: SortOrder
    response?: SortOrder
    erro?: SortOrder
    createdAt?: SortOrder
  }

  export type LogIntegracaoMaxOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    erro?: SortOrder
    createdAt?: SortOrder
  }

  export type LogIntegracaoMinOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    erro?: SortOrder
    createdAt?: SortOrder
  }

  export type ImovelMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    imovelIdExterno?: SortOrder
    telefone?: SortOrder
    observacoes?: SortOrder
    construtoraId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImovelMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    imovelIdExterno?: SortOrder
    telefone?: SortOrder
    observacoes?: SortOrder
    construtoraId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImovelMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    imovelIdExterno?: SortOrder
    telefone?: SortOrder
    observacoes?: SortOrder
    construtoraId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImovelPerguntaImovelIdPerguntaIdCompoundUniqueInput = {
    imovelId: string
    perguntaId: string
  }

  export type ImovelPerguntaCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    perguntaId?: SortOrder
  }

  export type ImovelPerguntaMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    perguntaId?: SortOrder
  }

  export type ImovelPerguntaMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imovelId?: SortOrder
    perguntaId?: SortOrder
  }

  export type MensagemContatoCountOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    resposta?: SortOrder
    usuarioNome?: SortOrder
    usuarioEmail?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MensagemContatoMaxOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    resposta?: SortOrder
    usuarioNome?: SortOrder
    usuarioEmail?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MensagemContatoMinOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    resposta?: SortOrder
    usuarioNome?: SortOrder
    usuarioEmail?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConversationCountOrderByAggregateInput = {
    id?: SortOrder
    messages?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    messages?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConversationMinOrderByAggregateInput = {
    id?: SortOrder
    messages?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIActionHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    acao?: SortOrder
    entidade?: SortOrder
    idEntidade?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    detalhes?: SortOrder
  }

  export type AIActionHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AIActionHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    acao?: SortOrder
    entidade?: SortOrder
    idEntidade?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    detalhes?: SortOrder
  }

  export type AIActionHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    acao?: SortOrder
    entidade?: SortOrder
    idEntidade?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    detalhes?: SortOrder
  }

  export type AIActionHistorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AIConfigCountOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AIConfigMinOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImovelCreateNestedManyWithoutTipoImovelInput = {
    create?: XOR<ImovelCreateWithoutTipoImovelInput, ImovelUncheckedCreateWithoutTipoImovelInput> | ImovelCreateWithoutTipoImovelInput[] | ImovelUncheckedCreateWithoutTipoImovelInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutTipoImovelInput | ImovelCreateOrConnectWithoutTipoImovelInput[]
    createMany?: ImovelCreateManyTipoImovelInputEnvelope
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
  }

  export type ImovelUncheckedCreateNestedManyWithoutTipoImovelInput = {
    create?: XOR<ImovelCreateWithoutTipoImovelInput, ImovelUncheckedCreateWithoutTipoImovelInput> | ImovelCreateWithoutTipoImovelInput[] | ImovelUncheckedCreateWithoutTipoImovelInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutTipoImovelInput | ImovelCreateOrConnectWithoutTipoImovelInput[]
    createMany?: ImovelCreateManyTipoImovelInputEnvelope
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ImovelUpdateManyWithoutTipoImovelNestedInput = {
    create?: XOR<ImovelCreateWithoutTipoImovelInput, ImovelUncheckedCreateWithoutTipoImovelInput> | ImovelCreateWithoutTipoImovelInput[] | ImovelUncheckedCreateWithoutTipoImovelInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutTipoImovelInput | ImovelCreateOrConnectWithoutTipoImovelInput[]
    upsert?: ImovelUpsertWithWhereUniqueWithoutTipoImovelInput | ImovelUpsertWithWhereUniqueWithoutTipoImovelInput[]
    createMany?: ImovelCreateManyTipoImovelInputEnvelope
    set?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    disconnect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    delete?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    update?: ImovelUpdateWithWhereUniqueWithoutTipoImovelInput | ImovelUpdateWithWhereUniqueWithoutTipoImovelInput[]
    updateMany?: ImovelUpdateManyWithWhereWithoutTipoImovelInput | ImovelUpdateManyWithWhereWithoutTipoImovelInput[]
    deleteMany?: ImovelScalarWhereInput | ImovelScalarWhereInput[]
  }

  export type ImovelUncheckedUpdateManyWithoutTipoImovelNestedInput = {
    create?: XOR<ImovelCreateWithoutTipoImovelInput, ImovelUncheckedCreateWithoutTipoImovelInput> | ImovelCreateWithoutTipoImovelInput[] | ImovelUncheckedCreateWithoutTipoImovelInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutTipoImovelInput | ImovelCreateOrConnectWithoutTipoImovelInput[]
    upsert?: ImovelUpsertWithWhereUniqueWithoutTipoImovelInput | ImovelUpsertWithWhereUniqueWithoutTipoImovelInput[]
    createMany?: ImovelCreateManyTipoImovelInputEnvelope
    set?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    disconnect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    delete?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    update?: ImovelUpdateWithWhereUniqueWithoutTipoImovelInput | ImovelUpdateWithWhereUniqueWithoutTipoImovelInput[]
    updateMany?: ImovelUpdateManyWithWhereWithoutTipoImovelInput | ImovelUpdateManyWithWhereWithoutTipoImovelInput[]
    deleteMany?: ImovelScalarWhereInput | ImovelScalarWhereInput[]
  }

  export type ConstrutoraCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<ConstrutoraCreateWithoutUsuariosInput, ConstrutoraUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: ConstrutoraCreateOrConnectWithoutUsuariosInput
    connect?: ConstrutoraWhereUniqueInput
  }

  export type RespostaCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type RelatorioCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<RelatorioCreateWithoutUsuarioInput, RelatorioUncheckedCreateWithoutUsuarioInput> | RelatorioCreateWithoutUsuarioInput[] | RelatorioUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RelatorioCreateOrConnectWithoutUsuarioInput | RelatorioCreateOrConnectWithoutUsuarioInput[]
    createMany?: RelatorioCreateManyUsuarioInputEnvelope
    connect?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
  }

  export type RespostaUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type RelatorioUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<RelatorioCreateWithoutUsuarioInput, RelatorioUncheckedCreateWithoutUsuarioInput> | RelatorioCreateWithoutUsuarioInput[] | RelatorioUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RelatorioCreateOrConnectWithoutUsuarioInput | RelatorioCreateOrConnectWithoutUsuarioInput[]
    createMany?: RelatorioCreateManyUsuarioInputEnvelope
    connect?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type ConstrutoraUpdateOneWithoutUsuariosNestedInput = {
    create?: XOR<ConstrutoraCreateWithoutUsuariosInput, ConstrutoraUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: ConstrutoraCreateOrConnectWithoutUsuariosInput
    upsert?: ConstrutoraUpsertWithoutUsuariosInput
    disconnect?: ConstrutoraWhereInput | boolean
    delete?: ConstrutoraWhereInput | boolean
    connect?: ConstrutoraWhereUniqueInput
    update?: XOR<XOR<ConstrutoraUpdateToOneWithWhereWithoutUsuariosInput, ConstrutoraUpdateWithoutUsuariosInput>, ConstrutoraUncheckedUpdateWithoutUsuariosInput>
  }

  export type RespostaUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutUsuarioInput | RespostaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutUsuarioInput | RespostaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutUsuarioInput | RespostaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type RelatorioUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<RelatorioCreateWithoutUsuarioInput, RelatorioUncheckedCreateWithoutUsuarioInput> | RelatorioCreateWithoutUsuarioInput[] | RelatorioUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RelatorioCreateOrConnectWithoutUsuarioInput | RelatorioCreateOrConnectWithoutUsuarioInput[]
    upsert?: RelatorioUpsertWithWhereUniqueWithoutUsuarioInput | RelatorioUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: RelatorioCreateManyUsuarioInputEnvelope
    set?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    disconnect?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    delete?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    connect?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    update?: RelatorioUpdateWithWhereUniqueWithoutUsuarioInput | RelatorioUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: RelatorioUpdateManyWithWhereWithoutUsuarioInput | RelatorioUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: RelatorioScalarWhereInput | RelatorioScalarWhereInput[]
  }

  export type RespostaUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutUsuarioInput | RespostaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutUsuarioInput | RespostaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutUsuarioInput | RespostaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type RelatorioUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<RelatorioCreateWithoutUsuarioInput, RelatorioUncheckedCreateWithoutUsuarioInput> | RelatorioCreateWithoutUsuarioInput[] | RelatorioUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RelatorioCreateOrConnectWithoutUsuarioInput | RelatorioCreateOrConnectWithoutUsuarioInput[]
    upsert?: RelatorioUpsertWithWhereUniqueWithoutUsuarioInput | RelatorioUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: RelatorioCreateManyUsuarioInputEnvelope
    set?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    disconnect?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    delete?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    connect?: RelatorioWhereUniqueInput | RelatorioWhereUniqueInput[]
    update?: RelatorioUpdateWithWhereUniqueWithoutUsuarioInput | RelatorioUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: RelatorioUpdateManyWithWhereWithoutUsuarioInput | RelatorioUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: RelatorioScalarWhereInput | RelatorioScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutConstrutoraInput = {
    create?: XOR<UserCreateWithoutConstrutoraInput, UserUncheckedCreateWithoutConstrutoraInput> | UserCreateWithoutConstrutoraInput[] | UserUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: UserCreateOrConnectWithoutConstrutoraInput | UserCreateOrConnectWithoutConstrutoraInput[]
    createMany?: UserCreateManyConstrutoraInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ImovelCreateNestedManyWithoutConstrutoraInput = {
    create?: XOR<ImovelCreateWithoutConstrutoraInput, ImovelUncheckedCreateWithoutConstrutoraInput> | ImovelCreateWithoutConstrutoraInput[] | ImovelUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutConstrutoraInput | ImovelCreateOrConnectWithoutConstrutoraInput[]
    createMany?: ImovelCreateManyConstrutoraInputEnvelope
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
  }

  export type ImovelMetadataCreateNestedManyWithoutConstrutoraInput = {
    create?: XOR<ImovelMetadataCreateWithoutConstrutoraInput, ImovelMetadataUncheckedCreateWithoutConstrutoraInput> | ImovelMetadataCreateWithoutConstrutoraInput[] | ImovelMetadataUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelMetadataCreateOrConnectWithoutConstrutoraInput | ImovelMetadataCreateOrConnectWithoutConstrutoraInput[]
    createMany?: ImovelMetadataCreateManyConstrutoraInputEnvelope
    connect?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutConstrutoraInput = {
    create?: XOR<UserCreateWithoutConstrutoraInput, UserUncheckedCreateWithoutConstrutoraInput> | UserCreateWithoutConstrutoraInput[] | UserUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: UserCreateOrConnectWithoutConstrutoraInput | UserCreateOrConnectWithoutConstrutoraInput[]
    createMany?: UserCreateManyConstrutoraInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ImovelUncheckedCreateNestedManyWithoutConstrutoraInput = {
    create?: XOR<ImovelCreateWithoutConstrutoraInput, ImovelUncheckedCreateWithoutConstrutoraInput> | ImovelCreateWithoutConstrutoraInput[] | ImovelUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutConstrutoraInput | ImovelCreateOrConnectWithoutConstrutoraInput[]
    createMany?: ImovelCreateManyConstrutoraInputEnvelope
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
  }

  export type ImovelMetadataUncheckedCreateNestedManyWithoutConstrutoraInput = {
    create?: XOR<ImovelMetadataCreateWithoutConstrutoraInput, ImovelMetadataUncheckedCreateWithoutConstrutoraInput> | ImovelMetadataCreateWithoutConstrutoraInput[] | ImovelMetadataUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelMetadataCreateOrConnectWithoutConstrutoraInput | ImovelMetadataCreateOrConnectWithoutConstrutoraInput[]
    createMany?: ImovelMetadataCreateManyConstrutoraInputEnvelope
    connect?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateManyWithoutConstrutoraNestedInput = {
    create?: XOR<UserCreateWithoutConstrutoraInput, UserUncheckedCreateWithoutConstrutoraInput> | UserCreateWithoutConstrutoraInput[] | UserUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: UserCreateOrConnectWithoutConstrutoraInput | UserCreateOrConnectWithoutConstrutoraInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutConstrutoraInput | UserUpsertWithWhereUniqueWithoutConstrutoraInput[]
    createMany?: UserCreateManyConstrutoraInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutConstrutoraInput | UserUpdateWithWhereUniqueWithoutConstrutoraInput[]
    updateMany?: UserUpdateManyWithWhereWithoutConstrutoraInput | UserUpdateManyWithWhereWithoutConstrutoraInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ImovelUpdateManyWithoutConstrutoraNestedInput = {
    create?: XOR<ImovelCreateWithoutConstrutoraInput, ImovelUncheckedCreateWithoutConstrutoraInput> | ImovelCreateWithoutConstrutoraInput[] | ImovelUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutConstrutoraInput | ImovelCreateOrConnectWithoutConstrutoraInput[]
    upsert?: ImovelUpsertWithWhereUniqueWithoutConstrutoraInput | ImovelUpsertWithWhereUniqueWithoutConstrutoraInput[]
    createMany?: ImovelCreateManyConstrutoraInputEnvelope
    set?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    disconnect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    delete?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    update?: ImovelUpdateWithWhereUniqueWithoutConstrutoraInput | ImovelUpdateWithWhereUniqueWithoutConstrutoraInput[]
    updateMany?: ImovelUpdateManyWithWhereWithoutConstrutoraInput | ImovelUpdateManyWithWhereWithoutConstrutoraInput[]
    deleteMany?: ImovelScalarWhereInput | ImovelScalarWhereInput[]
  }

  export type ImovelMetadataUpdateManyWithoutConstrutoraNestedInput = {
    create?: XOR<ImovelMetadataCreateWithoutConstrutoraInput, ImovelMetadataUncheckedCreateWithoutConstrutoraInput> | ImovelMetadataCreateWithoutConstrutoraInput[] | ImovelMetadataUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelMetadataCreateOrConnectWithoutConstrutoraInput | ImovelMetadataCreateOrConnectWithoutConstrutoraInput[]
    upsert?: ImovelMetadataUpsertWithWhereUniqueWithoutConstrutoraInput | ImovelMetadataUpsertWithWhereUniqueWithoutConstrutoraInput[]
    createMany?: ImovelMetadataCreateManyConstrutoraInputEnvelope
    set?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    disconnect?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    delete?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    connect?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    update?: ImovelMetadataUpdateWithWhereUniqueWithoutConstrutoraInput | ImovelMetadataUpdateWithWhereUniqueWithoutConstrutoraInput[]
    updateMany?: ImovelMetadataUpdateManyWithWhereWithoutConstrutoraInput | ImovelMetadataUpdateManyWithWhereWithoutConstrutoraInput[]
    deleteMany?: ImovelMetadataScalarWhereInput | ImovelMetadataScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutConstrutoraNestedInput = {
    create?: XOR<UserCreateWithoutConstrutoraInput, UserUncheckedCreateWithoutConstrutoraInput> | UserCreateWithoutConstrutoraInput[] | UserUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: UserCreateOrConnectWithoutConstrutoraInput | UserCreateOrConnectWithoutConstrutoraInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutConstrutoraInput | UserUpsertWithWhereUniqueWithoutConstrutoraInput[]
    createMany?: UserCreateManyConstrutoraInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutConstrutoraInput | UserUpdateWithWhereUniqueWithoutConstrutoraInput[]
    updateMany?: UserUpdateManyWithWhereWithoutConstrutoraInput | UserUpdateManyWithWhereWithoutConstrutoraInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ImovelUncheckedUpdateManyWithoutConstrutoraNestedInput = {
    create?: XOR<ImovelCreateWithoutConstrutoraInput, ImovelUncheckedCreateWithoutConstrutoraInput> | ImovelCreateWithoutConstrutoraInput[] | ImovelUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelCreateOrConnectWithoutConstrutoraInput | ImovelCreateOrConnectWithoutConstrutoraInput[]
    upsert?: ImovelUpsertWithWhereUniqueWithoutConstrutoraInput | ImovelUpsertWithWhereUniqueWithoutConstrutoraInput[]
    createMany?: ImovelCreateManyConstrutoraInputEnvelope
    set?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    disconnect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    delete?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    connect?: ImovelWhereUniqueInput | ImovelWhereUniqueInput[]
    update?: ImovelUpdateWithWhereUniqueWithoutConstrutoraInput | ImovelUpdateWithWhereUniqueWithoutConstrutoraInput[]
    updateMany?: ImovelUpdateManyWithWhereWithoutConstrutoraInput | ImovelUpdateManyWithWhereWithoutConstrutoraInput[]
    deleteMany?: ImovelScalarWhereInput | ImovelScalarWhereInput[]
  }

  export type ImovelMetadataUncheckedUpdateManyWithoutConstrutoraNestedInput = {
    create?: XOR<ImovelMetadataCreateWithoutConstrutoraInput, ImovelMetadataUncheckedCreateWithoutConstrutoraInput> | ImovelMetadataCreateWithoutConstrutoraInput[] | ImovelMetadataUncheckedCreateWithoutConstrutoraInput[]
    connectOrCreate?: ImovelMetadataCreateOrConnectWithoutConstrutoraInput | ImovelMetadataCreateOrConnectWithoutConstrutoraInput[]
    upsert?: ImovelMetadataUpsertWithWhereUniqueWithoutConstrutoraInput | ImovelMetadataUpsertWithWhereUniqueWithoutConstrutoraInput[]
    createMany?: ImovelMetadataCreateManyConstrutoraInputEnvelope
    set?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    disconnect?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    delete?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    connect?: ImovelMetadataWhereUniqueInput | ImovelMetadataWhereUniqueInput[]
    update?: ImovelMetadataUpdateWithWhereUniqueWithoutConstrutoraInput | ImovelMetadataUpdateWithWhereUniqueWithoutConstrutoraInput[]
    updateMany?: ImovelMetadataUpdateManyWithWhereWithoutConstrutoraInput | ImovelMetadataUpdateManyWithWhereWithoutConstrutoraInput[]
    deleteMany?: ImovelMetadataScalarWhereInput | ImovelMetadataScalarWhereInput[]
  }

  export type ImovelCreategaleriaFotosInput = {
    set: string[]
  }

  export type ImovelCreatecaracteristicasArrayInput = {
    set: string[]
  }

  export type TipoImovelCreateNestedOneWithoutImoveisInput = {
    create?: XOR<TipoImovelCreateWithoutImoveisInput, TipoImovelUncheckedCreateWithoutImoveisInput>
    connectOrCreate?: TipoImovelCreateOrConnectWithoutImoveisInput
    connect?: TipoImovelWhereUniqueInput
  }

  export type ConstrutoraCreateNestedOneWithoutImoveisInput = {
    create?: XOR<ConstrutoraCreateWithoutImoveisInput, ConstrutoraUncheckedCreateWithoutImoveisInput>
    connectOrCreate?: ConstrutoraCreateOrConnectWithoutImoveisInput
    connect?: ConstrutoraWhereUniqueInput
  }

  export type MatchCreateNestedManyWithoutImovelInput = {
    create?: XOR<MatchCreateWithoutImovelInput, MatchUncheckedCreateWithoutImovelInput> | MatchCreateWithoutImovelInput[] | MatchUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutImovelInput | MatchCreateOrConnectWithoutImovelInput[]
    createMany?: MatchCreateManyImovelInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type ImovelPerguntaCreateNestedManyWithoutImovelInput = {
    create?: XOR<ImovelPerguntaCreateWithoutImovelInput, ImovelPerguntaUncheckedCreateWithoutImovelInput> | ImovelPerguntaCreateWithoutImovelInput[] | ImovelPerguntaUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutImovelInput | ImovelPerguntaCreateOrConnectWithoutImovelInput[]
    createMany?: ImovelPerguntaCreateManyImovelInputEnvelope
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutImovelInput = {
    create?: XOR<MatchCreateWithoutImovelInput, MatchUncheckedCreateWithoutImovelInput> | MatchCreateWithoutImovelInput[] | MatchUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutImovelInput | MatchCreateOrConnectWithoutImovelInput[]
    createMany?: MatchCreateManyImovelInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type ImovelPerguntaUncheckedCreateNestedManyWithoutImovelInput = {
    create?: XOR<ImovelPerguntaCreateWithoutImovelInput, ImovelPerguntaUncheckedCreateWithoutImovelInput> | ImovelPerguntaCreateWithoutImovelInput[] | ImovelPerguntaUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutImovelInput | ImovelPerguntaCreateOrConnectWithoutImovelInput[]
    createMany?: ImovelPerguntaCreateManyImovelInputEnvelope
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ImovelUpdategaleriaFotosInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ImovelUpdatecaracteristicasArrayInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TipoImovelUpdateOneWithoutImoveisNestedInput = {
    create?: XOR<TipoImovelCreateWithoutImoveisInput, TipoImovelUncheckedCreateWithoutImoveisInput>
    connectOrCreate?: TipoImovelCreateOrConnectWithoutImoveisInput
    upsert?: TipoImovelUpsertWithoutImoveisInput
    disconnect?: TipoImovelWhereInput | boolean
    delete?: TipoImovelWhereInput | boolean
    connect?: TipoImovelWhereUniqueInput
    update?: XOR<XOR<TipoImovelUpdateToOneWithWhereWithoutImoveisInput, TipoImovelUpdateWithoutImoveisInput>, TipoImovelUncheckedUpdateWithoutImoveisInput>
  }

  export type ConstrutoraUpdateOneRequiredWithoutImoveisNestedInput = {
    create?: XOR<ConstrutoraCreateWithoutImoveisInput, ConstrutoraUncheckedCreateWithoutImoveisInput>
    connectOrCreate?: ConstrutoraCreateOrConnectWithoutImoveisInput
    upsert?: ConstrutoraUpsertWithoutImoveisInput
    connect?: ConstrutoraWhereUniqueInput
    update?: XOR<XOR<ConstrutoraUpdateToOneWithWhereWithoutImoveisInput, ConstrutoraUpdateWithoutImoveisInput>, ConstrutoraUncheckedUpdateWithoutImoveisInput>
  }

  export type MatchUpdateManyWithoutImovelNestedInput = {
    create?: XOR<MatchCreateWithoutImovelInput, MatchUncheckedCreateWithoutImovelInput> | MatchCreateWithoutImovelInput[] | MatchUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutImovelInput | MatchCreateOrConnectWithoutImovelInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutImovelInput | MatchUpsertWithWhereUniqueWithoutImovelInput[]
    createMany?: MatchCreateManyImovelInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutImovelInput | MatchUpdateWithWhereUniqueWithoutImovelInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutImovelInput | MatchUpdateManyWithWhereWithoutImovelInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type ImovelPerguntaUpdateManyWithoutImovelNestedInput = {
    create?: XOR<ImovelPerguntaCreateWithoutImovelInput, ImovelPerguntaUncheckedCreateWithoutImovelInput> | ImovelPerguntaCreateWithoutImovelInput[] | ImovelPerguntaUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutImovelInput | ImovelPerguntaCreateOrConnectWithoutImovelInput[]
    upsert?: ImovelPerguntaUpsertWithWhereUniqueWithoutImovelInput | ImovelPerguntaUpsertWithWhereUniqueWithoutImovelInput[]
    createMany?: ImovelPerguntaCreateManyImovelInputEnvelope
    set?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    disconnect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    delete?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    update?: ImovelPerguntaUpdateWithWhereUniqueWithoutImovelInput | ImovelPerguntaUpdateWithWhereUniqueWithoutImovelInput[]
    updateMany?: ImovelPerguntaUpdateManyWithWhereWithoutImovelInput | ImovelPerguntaUpdateManyWithWhereWithoutImovelInput[]
    deleteMany?: ImovelPerguntaScalarWhereInput | ImovelPerguntaScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutImovelNestedInput = {
    create?: XOR<MatchCreateWithoutImovelInput, MatchUncheckedCreateWithoutImovelInput> | MatchCreateWithoutImovelInput[] | MatchUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutImovelInput | MatchCreateOrConnectWithoutImovelInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutImovelInput | MatchUpsertWithWhereUniqueWithoutImovelInput[]
    createMany?: MatchCreateManyImovelInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutImovelInput | MatchUpdateWithWhereUniqueWithoutImovelInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutImovelInput | MatchUpdateManyWithWhereWithoutImovelInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type ImovelPerguntaUncheckedUpdateManyWithoutImovelNestedInput = {
    create?: XOR<ImovelPerguntaCreateWithoutImovelInput, ImovelPerguntaUncheckedCreateWithoutImovelInput> | ImovelPerguntaCreateWithoutImovelInput[] | ImovelPerguntaUncheckedCreateWithoutImovelInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutImovelInput | ImovelPerguntaCreateOrConnectWithoutImovelInput[]
    upsert?: ImovelPerguntaUpsertWithWhereUniqueWithoutImovelInput | ImovelPerguntaUpsertWithWhereUniqueWithoutImovelInput[]
    createMany?: ImovelPerguntaCreateManyImovelInputEnvelope
    set?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    disconnect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    delete?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    update?: ImovelPerguntaUpdateWithWhereUniqueWithoutImovelInput | ImovelPerguntaUpdateWithWhereUniqueWithoutImovelInput[]
    updateMany?: ImovelPerguntaUpdateManyWithWhereWithoutImovelInput | ImovelPerguntaUpdateManyWithWhereWithoutImovelInput[]
    deleteMany?: ImovelPerguntaScalarWhereInput | ImovelPerguntaScalarWhereInput[]
  }

  export type RespostaCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<RespostaCreateWithoutPerguntaInput, RespostaUncheckedCreateWithoutPerguntaInput> | RespostaCreateWithoutPerguntaInput[] | RespostaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPerguntaInput | RespostaCreateOrConnectWithoutPerguntaInput[]
    createMany?: RespostaCreateManyPerguntaInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type ImovelPerguntaCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<ImovelPerguntaCreateWithoutPerguntaInput, ImovelPerguntaUncheckedCreateWithoutPerguntaInput> | ImovelPerguntaCreateWithoutPerguntaInput[] | ImovelPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutPerguntaInput | ImovelPerguntaCreateOrConnectWithoutPerguntaInput[]
    createMany?: ImovelPerguntaCreateManyPerguntaInputEnvelope
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
  }

  export type RespostaUncheckedCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<RespostaCreateWithoutPerguntaInput, RespostaUncheckedCreateWithoutPerguntaInput> | RespostaCreateWithoutPerguntaInput[] | RespostaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPerguntaInput | RespostaCreateOrConnectWithoutPerguntaInput[]
    createMany?: RespostaCreateManyPerguntaInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type ImovelPerguntaUncheckedCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<ImovelPerguntaCreateWithoutPerguntaInput, ImovelPerguntaUncheckedCreateWithoutPerguntaInput> | ImovelPerguntaCreateWithoutPerguntaInput[] | ImovelPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutPerguntaInput | ImovelPerguntaCreateOrConnectWithoutPerguntaInput[]
    createMany?: ImovelPerguntaCreateManyPerguntaInputEnvelope
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
  }

  export type RespostaUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<RespostaCreateWithoutPerguntaInput, RespostaUncheckedCreateWithoutPerguntaInput> | RespostaCreateWithoutPerguntaInput[] | RespostaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPerguntaInput | RespostaCreateOrConnectWithoutPerguntaInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutPerguntaInput | RespostaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: RespostaCreateManyPerguntaInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutPerguntaInput | RespostaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutPerguntaInput | RespostaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type ImovelPerguntaUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<ImovelPerguntaCreateWithoutPerguntaInput, ImovelPerguntaUncheckedCreateWithoutPerguntaInput> | ImovelPerguntaCreateWithoutPerguntaInput[] | ImovelPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutPerguntaInput | ImovelPerguntaCreateOrConnectWithoutPerguntaInput[]
    upsert?: ImovelPerguntaUpsertWithWhereUniqueWithoutPerguntaInput | ImovelPerguntaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: ImovelPerguntaCreateManyPerguntaInputEnvelope
    set?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    disconnect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    delete?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    update?: ImovelPerguntaUpdateWithWhereUniqueWithoutPerguntaInput | ImovelPerguntaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: ImovelPerguntaUpdateManyWithWhereWithoutPerguntaInput | ImovelPerguntaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: ImovelPerguntaScalarWhereInput | ImovelPerguntaScalarWhereInput[]
  }

  export type RespostaUncheckedUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<RespostaCreateWithoutPerguntaInput, RespostaUncheckedCreateWithoutPerguntaInput> | RespostaCreateWithoutPerguntaInput[] | RespostaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPerguntaInput | RespostaCreateOrConnectWithoutPerguntaInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutPerguntaInput | RespostaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: RespostaCreateManyPerguntaInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutPerguntaInput | RespostaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutPerguntaInput | RespostaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type ImovelPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<ImovelPerguntaCreateWithoutPerguntaInput, ImovelPerguntaUncheckedCreateWithoutPerguntaInput> | ImovelPerguntaCreateWithoutPerguntaInput[] | ImovelPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: ImovelPerguntaCreateOrConnectWithoutPerguntaInput | ImovelPerguntaCreateOrConnectWithoutPerguntaInput[]
    upsert?: ImovelPerguntaUpsertWithWhereUniqueWithoutPerguntaInput | ImovelPerguntaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: ImovelPerguntaCreateManyPerguntaInputEnvelope
    set?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    disconnect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    delete?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    connect?: ImovelPerguntaWhereUniqueInput | ImovelPerguntaWhereUniqueInput[]
    update?: ImovelPerguntaUpdateWithWhereUniqueWithoutPerguntaInput | ImovelPerguntaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: ImovelPerguntaUpdateManyWithWhereWithoutPerguntaInput | ImovelPerguntaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: ImovelPerguntaScalarWhereInput | ImovelPerguntaScalarWhereInput[]
  }

  export type PerguntaCreateNestedOneWithoutRespostasInput = {
    create?: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutRespostasInput
    connect?: PerguntaWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutRespostasInput = {
    create?: XOR<UserCreateWithoutRespostasInput, UserUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: UserCreateOrConnectWithoutRespostasInput
    connect?: UserWhereUniqueInput
  }

  export type PerguntaUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutRespostasInput
    upsert?: PerguntaUpsertWithoutRespostasInput
    connect?: PerguntaWhereUniqueInput
    update?: XOR<XOR<PerguntaUpdateToOneWithWhereWithoutRespostasInput, PerguntaUpdateWithoutRespostasInput>, PerguntaUncheckedUpdateWithoutRespostasInput>
  }

  export type UserUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: XOR<UserCreateWithoutRespostasInput, UserUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: UserCreateOrConnectWithoutRespostasInput
    upsert?: UserUpsertWithoutRespostasInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRespostasInput, UserUpdateWithoutRespostasInput>, UserUncheckedUpdateWithoutRespostasInput>
  }

  export type ImovelCreateNestedOneWithoutMatchesInput = {
    create?: XOR<ImovelCreateWithoutMatchesInput, ImovelUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: ImovelCreateOrConnectWithoutMatchesInput
    connect?: ImovelWhereUniqueInput
  }

  export type RelatorioCreateNestedOneWithoutMatchesInput = {
    create?: XOR<RelatorioCreateWithoutMatchesInput, RelatorioUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: RelatorioCreateOrConnectWithoutMatchesInput
    connect?: RelatorioWhereUniqueInput
  }

  export type ImovelUpdateOneRequiredWithoutMatchesNestedInput = {
    create?: XOR<ImovelCreateWithoutMatchesInput, ImovelUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: ImovelCreateOrConnectWithoutMatchesInput
    upsert?: ImovelUpsertWithoutMatchesInput
    connect?: ImovelWhereUniqueInput
    update?: XOR<XOR<ImovelUpdateToOneWithWhereWithoutMatchesInput, ImovelUpdateWithoutMatchesInput>, ImovelUncheckedUpdateWithoutMatchesInput>
  }

  export type RelatorioUpdateOneWithoutMatchesNestedInput = {
    create?: XOR<RelatorioCreateWithoutMatchesInput, RelatorioUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: RelatorioCreateOrConnectWithoutMatchesInput
    upsert?: RelatorioUpsertWithoutMatchesInput
    disconnect?: RelatorioWhereInput | boolean
    delete?: RelatorioWhereInput | boolean
    connect?: RelatorioWhereUniqueInput
    update?: XOR<XOR<RelatorioUpdateToOneWithWhereWithoutMatchesInput, RelatorioUpdateWithoutMatchesInput>, RelatorioUncheckedUpdateWithoutMatchesInput>
  }

  export type UserCreateNestedOneWithoutRelatoriosInput = {
    create?: XOR<UserCreateWithoutRelatoriosInput, UserUncheckedCreateWithoutRelatoriosInput>
    connectOrCreate?: UserCreateOrConnectWithoutRelatoriosInput
    connect?: UserWhereUniqueInput
  }

  export type MatchCreateNestedManyWithoutRelatorioInput = {
    create?: XOR<MatchCreateWithoutRelatorioInput, MatchUncheckedCreateWithoutRelatorioInput> | MatchCreateWithoutRelatorioInput[] | MatchUncheckedCreateWithoutRelatorioInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutRelatorioInput | MatchCreateOrConnectWithoutRelatorioInput[]
    createMany?: MatchCreateManyRelatorioInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutRelatorioInput = {
    create?: XOR<MatchCreateWithoutRelatorioInput, MatchUncheckedCreateWithoutRelatorioInput> | MatchCreateWithoutRelatorioInput[] | MatchUncheckedCreateWithoutRelatorioInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutRelatorioInput | MatchCreateOrConnectWithoutRelatorioInput[]
    createMany?: MatchCreateManyRelatorioInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutRelatoriosNestedInput = {
    create?: XOR<UserCreateWithoutRelatoriosInput, UserUncheckedCreateWithoutRelatoriosInput>
    connectOrCreate?: UserCreateOrConnectWithoutRelatoriosInput
    upsert?: UserUpsertWithoutRelatoriosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRelatoriosInput, UserUpdateWithoutRelatoriosInput>, UserUncheckedUpdateWithoutRelatoriosInput>
  }

  export type MatchUpdateManyWithoutRelatorioNestedInput = {
    create?: XOR<MatchCreateWithoutRelatorioInput, MatchUncheckedCreateWithoutRelatorioInput> | MatchCreateWithoutRelatorioInput[] | MatchUncheckedCreateWithoutRelatorioInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutRelatorioInput | MatchCreateOrConnectWithoutRelatorioInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutRelatorioInput | MatchUpsertWithWhereUniqueWithoutRelatorioInput[]
    createMany?: MatchCreateManyRelatorioInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutRelatorioInput | MatchUpdateWithWhereUniqueWithoutRelatorioInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutRelatorioInput | MatchUpdateManyWithWhereWithoutRelatorioInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutRelatorioNestedInput = {
    create?: XOR<MatchCreateWithoutRelatorioInput, MatchUncheckedCreateWithoutRelatorioInput> | MatchCreateWithoutRelatorioInput[] | MatchUncheckedCreateWithoutRelatorioInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutRelatorioInput | MatchCreateOrConnectWithoutRelatorioInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutRelatorioInput | MatchUpsertWithWhereUniqueWithoutRelatorioInput[]
    createMany?: MatchCreateManyRelatorioInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutRelatorioInput | MatchUpdateWithWhereUniqueWithoutRelatorioInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutRelatorioInput | MatchUpdateManyWithWhereWithoutRelatorioInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type ConstrutoraCreateNestedOneWithoutImoveisMetadataInput = {
    create?: XOR<ConstrutoraCreateWithoutImoveisMetadataInput, ConstrutoraUncheckedCreateWithoutImoveisMetadataInput>
    connectOrCreate?: ConstrutoraCreateOrConnectWithoutImoveisMetadataInput
    connect?: ConstrutoraWhereUniqueInput
  }

  export type ConstrutoraUpdateOneWithoutImoveisMetadataNestedInput = {
    create?: XOR<ConstrutoraCreateWithoutImoveisMetadataInput, ConstrutoraUncheckedCreateWithoutImoveisMetadataInput>
    connectOrCreate?: ConstrutoraCreateOrConnectWithoutImoveisMetadataInput
    upsert?: ConstrutoraUpsertWithoutImoveisMetadataInput
    disconnect?: ConstrutoraWhereInput | boolean
    delete?: ConstrutoraWhereInput | boolean
    connect?: ConstrutoraWhereUniqueInput
    update?: XOR<XOR<ConstrutoraUpdateToOneWithWhereWithoutImoveisMetadataInput, ConstrutoraUpdateWithoutImoveisMetadataInput>, ConstrutoraUncheckedUpdateWithoutImoveisMetadataInput>
  }

  export type ImovelCreateNestedOneWithoutPerguntasInput = {
    create?: XOR<ImovelCreateWithoutPerguntasInput, ImovelUncheckedCreateWithoutPerguntasInput>
    connectOrCreate?: ImovelCreateOrConnectWithoutPerguntasInput
    connect?: ImovelWhereUniqueInput
  }

  export type PerguntaCreateNestedOneWithoutImoveisInput = {
    create?: XOR<PerguntaCreateWithoutImoveisInput, PerguntaUncheckedCreateWithoutImoveisInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutImoveisInput
    connect?: PerguntaWhereUniqueInput
  }

  export type ImovelUpdateOneRequiredWithoutPerguntasNestedInput = {
    create?: XOR<ImovelCreateWithoutPerguntasInput, ImovelUncheckedCreateWithoutPerguntasInput>
    connectOrCreate?: ImovelCreateOrConnectWithoutPerguntasInput
    upsert?: ImovelUpsertWithoutPerguntasInput
    connect?: ImovelWhereUniqueInput
    update?: XOR<XOR<ImovelUpdateToOneWithWhereWithoutPerguntasInput, ImovelUpdateWithoutPerguntasInput>, ImovelUncheckedUpdateWithoutPerguntasInput>
  }

  export type PerguntaUpdateOneRequiredWithoutImoveisNestedInput = {
    create?: XOR<PerguntaCreateWithoutImoveisInput, PerguntaUncheckedCreateWithoutImoveisInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutImoveisInput
    upsert?: PerguntaUpsertWithoutImoveisInput
    connect?: PerguntaWhereUniqueInput
    update?: XOR<XOR<PerguntaUpdateToOneWithWhereWithoutImoveisInput, PerguntaUpdateWithoutImoveisInput>, PerguntaUncheckedUpdateWithoutImoveisInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ImovelCreateWithoutTipoImovelInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtora: ConstrutoraCreateNestedOneWithoutImoveisInput
    matches?: MatchCreateNestedManyWithoutImovelInput
    perguntas?: ImovelPerguntaCreateNestedManyWithoutImovelInput
  }

  export type ImovelUncheckedCreateWithoutTipoImovelInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId: string
    matches?: MatchUncheckedCreateNestedManyWithoutImovelInput
    perguntas?: ImovelPerguntaUncheckedCreateNestedManyWithoutImovelInput
  }

  export type ImovelCreateOrConnectWithoutTipoImovelInput = {
    where: ImovelWhereUniqueInput
    create: XOR<ImovelCreateWithoutTipoImovelInput, ImovelUncheckedCreateWithoutTipoImovelInput>
  }

  export type ImovelCreateManyTipoImovelInputEnvelope = {
    data: ImovelCreateManyTipoImovelInput | ImovelCreateManyTipoImovelInput[]
    skipDuplicates?: boolean
  }

  export type ImovelUpsertWithWhereUniqueWithoutTipoImovelInput = {
    where: ImovelWhereUniqueInput
    update: XOR<ImovelUpdateWithoutTipoImovelInput, ImovelUncheckedUpdateWithoutTipoImovelInput>
    create: XOR<ImovelCreateWithoutTipoImovelInput, ImovelUncheckedCreateWithoutTipoImovelInput>
  }

  export type ImovelUpdateWithWhereUniqueWithoutTipoImovelInput = {
    where: ImovelWhereUniqueInput
    data: XOR<ImovelUpdateWithoutTipoImovelInput, ImovelUncheckedUpdateWithoutTipoImovelInput>
  }

  export type ImovelUpdateManyWithWhereWithoutTipoImovelInput = {
    where: ImovelScalarWhereInput
    data: XOR<ImovelUpdateManyMutationInput, ImovelUncheckedUpdateManyWithoutTipoImovelInput>
  }

  export type ImovelScalarWhereInput = {
    AND?: ImovelScalarWhereInput | ImovelScalarWhereInput[]
    OR?: ImovelScalarWhereInput[]
    NOT?: ImovelScalarWhereInput | ImovelScalarWhereInput[]
    id?: StringFilter<"Imovel"> | string
    idExternoAPI?: StringNullableFilter<"Imovel"> | string | null
    titulo?: StringFilter<"Imovel"> | string
    descricao?: StringFilter<"Imovel"> | string
    preco?: FloatFilter<"Imovel"> | number
    area?: FloatFilter<"Imovel"> | number
    quartos?: IntFilter<"Imovel"> | number
    banheiros?: IntFilter<"Imovel"> | number
    vagas?: IntFilter<"Imovel"> | number
    latitude?: FloatFilter<"Imovel"> | number
    longitude?: FloatFilter<"Imovel"> | number
    telefoneContato?: StringNullableFilter<"Imovel"> | string | null
    endereco?: StringFilter<"Imovel"> | string
    fotoPrincipal?: StringNullableFilter<"Imovel"> | string | null
    galeriaFotos?: StringNullableListFilter<"Imovel">
    caracteristicas?: JsonNullableFilter<"Imovel">
    caracteristicasArray?: StringNullableListFilter<"Imovel">
    tipoImovelId?: StringNullableFilter<"Imovel"> | string | null
    tipoImovelNome?: StringNullableFilter<"Imovel"> | string | null
    status?: StringNullableFilter<"Imovel"> | string | null
    ativo?: BoolFilter<"Imovel"> | boolean
    destaque?: BoolFilter<"Imovel"> | boolean
    createdAt?: DateTimeFilter<"Imovel"> | Date | string
    updatedAt?: DateTimeFilter<"Imovel"> | Date | string
    construtoraId?: StringFilter<"Imovel"> | string
  }

  export type ConstrutoraCreateWithoutUsuariosInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imoveis?: ImovelCreateNestedManyWithoutConstrutoraInput
    imoveisMetadata?: ImovelMetadataCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraUncheckedCreateWithoutUsuariosInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imoveis?: ImovelUncheckedCreateNestedManyWithoutConstrutoraInput
    imoveisMetadata?: ImovelMetadataUncheckedCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraCreateOrConnectWithoutUsuariosInput = {
    where: ConstrutoraWhereUniqueInput
    create: XOR<ConstrutoraCreateWithoutUsuariosInput, ConstrutoraUncheckedCreateWithoutUsuariosInput>
  }

  export type RespostaCreateWithoutUsuarioInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pergunta: PerguntaCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateWithoutUsuarioInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntaId: string
  }

  export type RespostaCreateOrConnectWithoutUsuarioInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput>
  }

  export type RespostaCreateManyUsuarioInputEnvelope = {
    data: RespostaCreateManyUsuarioInput | RespostaCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type RelatorioCreateWithoutUsuarioInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchCreateNestedManyWithoutRelatorioInput
  }

  export type RelatorioUncheckedCreateWithoutUsuarioInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchUncheckedCreateNestedManyWithoutRelatorioInput
  }

  export type RelatorioCreateOrConnectWithoutUsuarioInput = {
    where: RelatorioWhereUniqueInput
    create: XOR<RelatorioCreateWithoutUsuarioInput, RelatorioUncheckedCreateWithoutUsuarioInput>
  }

  export type RelatorioCreateManyUsuarioInputEnvelope = {
    data: RelatorioCreateManyUsuarioInput | RelatorioCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type ConstrutoraUpsertWithoutUsuariosInput = {
    update: XOR<ConstrutoraUpdateWithoutUsuariosInput, ConstrutoraUncheckedUpdateWithoutUsuariosInput>
    create: XOR<ConstrutoraCreateWithoutUsuariosInput, ConstrutoraUncheckedCreateWithoutUsuariosInput>
    where?: ConstrutoraWhereInput
  }

  export type ConstrutoraUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: ConstrutoraWhereInput
    data: XOR<ConstrutoraUpdateWithoutUsuariosInput, ConstrutoraUncheckedUpdateWithoutUsuariosInput>
  }

  export type ConstrutoraUpdateWithoutUsuariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imoveis?: ImovelUpdateManyWithoutConstrutoraNestedInput
    imoveisMetadata?: ImovelMetadataUpdateManyWithoutConstrutoraNestedInput
  }

  export type ConstrutoraUncheckedUpdateWithoutUsuariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imoveis?: ImovelUncheckedUpdateManyWithoutConstrutoraNestedInput
    imoveisMetadata?: ImovelMetadataUncheckedUpdateManyWithoutConstrutoraNestedInput
  }

  export type RespostaUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: RespostaWhereUniqueInput
    update: XOR<RespostaUpdateWithoutUsuarioInput, RespostaUncheckedUpdateWithoutUsuarioInput>
    create: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput>
  }

  export type RespostaUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: RespostaWhereUniqueInput
    data: XOR<RespostaUpdateWithoutUsuarioInput, RespostaUncheckedUpdateWithoutUsuarioInput>
  }

  export type RespostaUpdateManyWithWhereWithoutUsuarioInput = {
    where: RespostaScalarWhereInput
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type RespostaScalarWhereInput = {
    AND?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
    OR?: RespostaScalarWhereInput[]
    NOT?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
    id?: StringFilter<"Resposta"> | string
    valor?: StringFilter<"Resposta"> | string
    createdAt?: DateTimeFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeFilter<"Resposta"> | Date | string
    perguntaId?: StringFilter<"Resposta"> | string
    userId?: StringFilter<"Resposta"> | string
  }

  export type RelatorioUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: RelatorioWhereUniqueInput
    update: XOR<RelatorioUpdateWithoutUsuarioInput, RelatorioUncheckedUpdateWithoutUsuarioInput>
    create: XOR<RelatorioCreateWithoutUsuarioInput, RelatorioUncheckedCreateWithoutUsuarioInput>
  }

  export type RelatorioUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: RelatorioWhereUniqueInput
    data: XOR<RelatorioUpdateWithoutUsuarioInput, RelatorioUncheckedUpdateWithoutUsuarioInput>
  }

  export type RelatorioUpdateManyWithWhereWithoutUsuarioInput = {
    where: RelatorioScalarWhereInput
    data: XOR<RelatorioUpdateManyMutationInput, RelatorioUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type RelatorioScalarWhereInput = {
    AND?: RelatorioScalarWhereInput | RelatorioScalarWhereInput[]
    OR?: RelatorioScalarWhereInput[]
    NOT?: RelatorioScalarWhereInput | RelatorioScalarWhereInput[]
    id?: StringFilter<"Relatorio"> | string
    resumo?: StringFilter<"Relatorio"> | string
    pdfUrl?: StringNullableFilter<"Relatorio"> | string | null
    createdAt?: DateTimeFilter<"Relatorio"> | Date | string
    updatedAt?: DateTimeFilter<"Relatorio"> | Date | string
    userId?: StringFilter<"Relatorio"> | string
  }

  export type UserCreateWithoutConstrutoraInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    relatorios?: RelatorioCreateNestedManyWithoutUsuarioInput
  }

  export type UserUncheckedCreateWithoutConstrutoraInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    relatorios?: RelatorioUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UserCreateOrConnectWithoutConstrutoraInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutConstrutoraInput, UserUncheckedCreateWithoutConstrutoraInput>
  }

  export type UserCreateManyConstrutoraInputEnvelope = {
    data: UserCreateManyConstrutoraInput | UserCreateManyConstrutoraInput[]
    skipDuplicates?: boolean
  }

  export type ImovelCreateWithoutConstrutoraInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tipoImovel?: TipoImovelCreateNestedOneWithoutImoveisInput
    matches?: MatchCreateNestedManyWithoutImovelInput
    perguntas?: ImovelPerguntaCreateNestedManyWithoutImovelInput
  }

  export type ImovelUncheckedCreateWithoutConstrutoraInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelId?: string | null
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchUncheckedCreateNestedManyWithoutImovelInput
    perguntas?: ImovelPerguntaUncheckedCreateNestedManyWithoutImovelInput
  }

  export type ImovelCreateOrConnectWithoutConstrutoraInput = {
    where: ImovelWhereUniqueInput
    create: XOR<ImovelCreateWithoutConstrutoraInput, ImovelUncheckedCreateWithoutConstrutoraInput>
  }

  export type ImovelCreateManyConstrutoraInputEnvelope = {
    data: ImovelCreateManyConstrutoraInput | ImovelCreateManyConstrutoraInput[]
    skipDuplicates?: boolean
  }

  export type ImovelMetadataCreateWithoutConstrutoraInput = {
    id?: string
    imovelIdExterno: string
    telefone?: string
    observacoes?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImovelMetadataUncheckedCreateWithoutConstrutoraInput = {
    id?: string
    imovelIdExterno: string
    telefone?: string
    observacoes?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImovelMetadataCreateOrConnectWithoutConstrutoraInput = {
    where: ImovelMetadataWhereUniqueInput
    create: XOR<ImovelMetadataCreateWithoutConstrutoraInput, ImovelMetadataUncheckedCreateWithoutConstrutoraInput>
  }

  export type ImovelMetadataCreateManyConstrutoraInputEnvelope = {
    data: ImovelMetadataCreateManyConstrutoraInput | ImovelMetadataCreateManyConstrutoraInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutConstrutoraInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutConstrutoraInput, UserUncheckedUpdateWithoutConstrutoraInput>
    create: XOR<UserCreateWithoutConstrutoraInput, UserUncheckedCreateWithoutConstrutoraInput>
  }

  export type UserUpdateWithWhereUniqueWithoutConstrutoraInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutConstrutoraInput, UserUncheckedUpdateWithoutConstrutoraInput>
  }

  export type UserUpdateManyWithWhereWithoutConstrutoraInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutConstrutoraInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    telefone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    construtoraId?: StringNullableFilter<"User"> | string | null
  }

  export type ImovelUpsertWithWhereUniqueWithoutConstrutoraInput = {
    where: ImovelWhereUniqueInput
    update: XOR<ImovelUpdateWithoutConstrutoraInput, ImovelUncheckedUpdateWithoutConstrutoraInput>
    create: XOR<ImovelCreateWithoutConstrutoraInput, ImovelUncheckedCreateWithoutConstrutoraInput>
  }

  export type ImovelUpdateWithWhereUniqueWithoutConstrutoraInput = {
    where: ImovelWhereUniqueInput
    data: XOR<ImovelUpdateWithoutConstrutoraInput, ImovelUncheckedUpdateWithoutConstrutoraInput>
  }

  export type ImovelUpdateManyWithWhereWithoutConstrutoraInput = {
    where: ImovelScalarWhereInput
    data: XOR<ImovelUpdateManyMutationInput, ImovelUncheckedUpdateManyWithoutConstrutoraInput>
  }

  export type ImovelMetadataUpsertWithWhereUniqueWithoutConstrutoraInput = {
    where: ImovelMetadataWhereUniqueInput
    update: XOR<ImovelMetadataUpdateWithoutConstrutoraInput, ImovelMetadataUncheckedUpdateWithoutConstrutoraInput>
    create: XOR<ImovelMetadataCreateWithoutConstrutoraInput, ImovelMetadataUncheckedCreateWithoutConstrutoraInput>
  }

  export type ImovelMetadataUpdateWithWhereUniqueWithoutConstrutoraInput = {
    where: ImovelMetadataWhereUniqueInput
    data: XOR<ImovelMetadataUpdateWithoutConstrutoraInput, ImovelMetadataUncheckedUpdateWithoutConstrutoraInput>
  }

  export type ImovelMetadataUpdateManyWithWhereWithoutConstrutoraInput = {
    where: ImovelMetadataScalarWhereInput
    data: XOR<ImovelMetadataUpdateManyMutationInput, ImovelMetadataUncheckedUpdateManyWithoutConstrutoraInput>
  }

  export type ImovelMetadataScalarWhereInput = {
    AND?: ImovelMetadataScalarWhereInput | ImovelMetadataScalarWhereInput[]
    OR?: ImovelMetadataScalarWhereInput[]
    NOT?: ImovelMetadataScalarWhereInput | ImovelMetadataScalarWhereInput[]
    id?: StringFilter<"ImovelMetadata"> | string
    imovelIdExterno?: StringFilter<"ImovelMetadata"> | string
    telefone?: StringFilter<"ImovelMetadata"> | string
    observacoes?: StringFilter<"ImovelMetadata"> | string
    construtoraId?: StringNullableFilter<"ImovelMetadata"> | string | null
    createdAt?: DateTimeFilter<"ImovelMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"ImovelMetadata"> | Date | string
  }

  export type TipoImovelCreateWithoutImoveisInput = {
    id?: string
    nome: string
    slug: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TipoImovelUncheckedCreateWithoutImoveisInput = {
    id?: string
    nome: string
    slug: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TipoImovelCreateOrConnectWithoutImoveisInput = {
    where: TipoImovelWhereUniqueInput
    create: XOR<TipoImovelCreateWithoutImoveisInput, TipoImovelUncheckedCreateWithoutImoveisInput>
  }

  export type ConstrutoraCreateWithoutImoveisInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutConstrutoraInput
    imoveisMetadata?: ImovelMetadataCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraUncheckedCreateWithoutImoveisInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutConstrutoraInput
    imoveisMetadata?: ImovelMetadataUncheckedCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraCreateOrConnectWithoutImoveisInput = {
    where: ConstrutoraWhereUniqueInput
    create: XOR<ConstrutoraCreateWithoutImoveisInput, ConstrutoraUncheckedCreateWithoutImoveisInput>
  }

  export type MatchCreateWithoutImovelInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    relatorio?: RelatorioCreateNestedOneWithoutMatchesInput
  }

  export type MatchUncheckedCreateWithoutImovelInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    relatorioId?: string | null
  }

  export type MatchCreateOrConnectWithoutImovelInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutImovelInput, MatchUncheckedCreateWithoutImovelInput>
  }

  export type MatchCreateManyImovelInputEnvelope = {
    data: MatchCreateManyImovelInput | MatchCreateManyImovelInput[]
    skipDuplicates?: boolean
  }

  export type ImovelPerguntaCreateWithoutImovelInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pergunta: PerguntaCreateNestedOneWithoutImoveisInput
  }

  export type ImovelPerguntaUncheckedCreateWithoutImovelInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntaId: string
  }

  export type ImovelPerguntaCreateOrConnectWithoutImovelInput = {
    where: ImovelPerguntaWhereUniqueInput
    create: XOR<ImovelPerguntaCreateWithoutImovelInput, ImovelPerguntaUncheckedCreateWithoutImovelInput>
  }

  export type ImovelPerguntaCreateManyImovelInputEnvelope = {
    data: ImovelPerguntaCreateManyImovelInput | ImovelPerguntaCreateManyImovelInput[]
    skipDuplicates?: boolean
  }

  export type TipoImovelUpsertWithoutImoveisInput = {
    update: XOR<TipoImovelUpdateWithoutImoveisInput, TipoImovelUncheckedUpdateWithoutImoveisInput>
    create: XOR<TipoImovelCreateWithoutImoveisInput, TipoImovelUncheckedCreateWithoutImoveisInput>
    where?: TipoImovelWhereInput
  }

  export type TipoImovelUpdateToOneWithWhereWithoutImoveisInput = {
    where?: TipoImovelWhereInput
    data: XOR<TipoImovelUpdateWithoutImoveisInput, TipoImovelUncheckedUpdateWithoutImoveisInput>
  }

  export type TipoImovelUpdateWithoutImoveisInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TipoImovelUncheckedUpdateWithoutImoveisInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConstrutoraUpsertWithoutImoveisInput = {
    update: XOR<ConstrutoraUpdateWithoutImoveisInput, ConstrutoraUncheckedUpdateWithoutImoveisInput>
    create: XOR<ConstrutoraCreateWithoutImoveisInput, ConstrutoraUncheckedCreateWithoutImoveisInput>
    where?: ConstrutoraWhereInput
  }

  export type ConstrutoraUpdateToOneWithWhereWithoutImoveisInput = {
    where?: ConstrutoraWhereInput
    data: XOR<ConstrutoraUpdateWithoutImoveisInput, ConstrutoraUncheckedUpdateWithoutImoveisInput>
  }

  export type ConstrutoraUpdateWithoutImoveisInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutConstrutoraNestedInput
    imoveisMetadata?: ImovelMetadataUpdateManyWithoutConstrutoraNestedInput
  }

  export type ConstrutoraUncheckedUpdateWithoutImoveisInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutConstrutoraNestedInput
    imoveisMetadata?: ImovelMetadataUncheckedUpdateManyWithoutConstrutoraNestedInput
  }

  export type MatchUpsertWithWhereUniqueWithoutImovelInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutImovelInput, MatchUncheckedUpdateWithoutImovelInput>
    create: XOR<MatchCreateWithoutImovelInput, MatchUncheckedCreateWithoutImovelInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutImovelInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutImovelInput, MatchUncheckedUpdateWithoutImovelInput>
  }

  export type MatchUpdateManyWithWhereWithoutImovelInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutImovelInput>
  }

  export type MatchScalarWhereInput = {
    AND?: MatchScalarWhereInput | MatchScalarWhereInput[]
    OR?: MatchScalarWhereInput[]
    NOT?: MatchScalarWhereInput | MatchScalarWhereInput[]
    id?: StringFilter<"Match"> | string
    porcentagem?: FloatFilter<"Match"> | number
    posicaoRanking?: IntFilter<"Match"> | number
    destaque?: BoolFilter<"Match"> | boolean
    criterios?: JsonFilter<"Match">
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    imovelId?: StringFilter<"Match"> | string
    relatorioId?: StringNullableFilter<"Match"> | string | null
  }

  export type ImovelPerguntaUpsertWithWhereUniqueWithoutImovelInput = {
    where: ImovelPerguntaWhereUniqueInput
    update: XOR<ImovelPerguntaUpdateWithoutImovelInput, ImovelPerguntaUncheckedUpdateWithoutImovelInput>
    create: XOR<ImovelPerguntaCreateWithoutImovelInput, ImovelPerguntaUncheckedCreateWithoutImovelInput>
  }

  export type ImovelPerguntaUpdateWithWhereUniqueWithoutImovelInput = {
    where: ImovelPerguntaWhereUniqueInput
    data: XOR<ImovelPerguntaUpdateWithoutImovelInput, ImovelPerguntaUncheckedUpdateWithoutImovelInput>
  }

  export type ImovelPerguntaUpdateManyWithWhereWithoutImovelInput = {
    where: ImovelPerguntaScalarWhereInput
    data: XOR<ImovelPerguntaUpdateManyMutationInput, ImovelPerguntaUncheckedUpdateManyWithoutImovelInput>
  }

  export type ImovelPerguntaScalarWhereInput = {
    AND?: ImovelPerguntaScalarWhereInput | ImovelPerguntaScalarWhereInput[]
    OR?: ImovelPerguntaScalarWhereInput[]
    NOT?: ImovelPerguntaScalarWhereInput | ImovelPerguntaScalarWhereInput[]
    id?: StringFilter<"ImovelPergunta"> | string
    createdAt?: DateTimeFilter<"ImovelPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"ImovelPergunta"> | Date | string
    imovelId?: StringFilter<"ImovelPergunta"> | string
    perguntaId?: StringFilter<"ImovelPergunta"> | string
  }

  export type RespostaCreateWithoutPerguntaInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuario: UserCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateWithoutPerguntaInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type RespostaCreateOrConnectWithoutPerguntaInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutPerguntaInput, RespostaUncheckedCreateWithoutPerguntaInput>
  }

  export type RespostaCreateManyPerguntaInputEnvelope = {
    data: RespostaCreateManyPerguntaInput | RespostaCreateManyPerguntaInput[]
    skipDuplicates?: boolean
  }

  export type ImovelPerguntaCreateWithoutPerguntaInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imovel: ImovelCreateNestedOneWithoutPerguntasInput
  }

  export type ImovelPerguntaUncheckedCreateWithoutPerguntaInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
  }

  export type ImovelPerguntaCreateOrConnectWithoutPerguntaInput = {
    where: ImovelPerguntaWhereUniqueInput
    create: XOR<ImovelPerguntaCreateWithoutPerguntaInput, ImovelPerguntaUncheckedCreateWithoutPerguntaInput>
  }

  export type ImovelPerguntaCreateManyPerguntaInputEnvelope = {
    data: ImovelPerguntaCreateManyPerguntaInput | ImovelPerguntaCreateManyPerguntaInput[]
    skipDuplicates?: boolean
  }

  export type RespostaUpsertWithWhereUniqueWithoutPerguntaInput = {
    where: RespostaWhereUniqueInput
    update: XOR<RespostaUpdateWithoutPerguntaInput, RespostaUncheckedUpdateWithoutPerguntaInput>
    create: XOR<RespostaCreateWithoutPerguntaInput, RespostaUncheckedCreateWithoutPerguntaInput>
  }

  export type RespostaUpdateWithWhereUniqueWithoutPerguntaInput = {
    where: RespostaWhereUniqueInput
    data: XOR<RespostaUpdateWithoutPerguntaInput, RespostaUncheckedUpdateWithoutPerguntaInput>
  }

  export type RespostaUpdateManyWithWhereWithoutPerguntaInput = {
    where: RespostaScalarWhereInput
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyWithoutPerguntaInput>
  }

  export type ImovelPerguntaUpsertWithWhereUniqueWithoutPerguntaInput = {
    where: ImovelPerguntaWhereUniqueInput
    update: XOR<ImovelPerguntaUpdateWithoutPerguntaInput, ImovelPerguntaUncheckedUpdateWithoutPerguntaInput>
    create: XOR<ImovelPerguntaCreateWithoutPerguntaInput, ImovelPerguntaUncheckedCreateWithoutPerguntaInput>
  }

  export type ImovelPerguntaUpdateWithWhereUniqueWithoutPerguntaInput = {
    where: ImovelPerguntaWhereUniqueInput
    data: XOR<ImovelPerguntaUpdateWithoutPerguntaInput, ImovelPerguntaUncheckedUpdateWithoutPerguntaInput>
  }

  export type ImovelPerguntaUpdateManyWithWhereWithoutPerguntaInput = {
    where: ImovelPerguntaScalarWhereInput
    data: XOR<ImovelPerguntaUpdateManyMutationInput, ImovelPerguntaUncheckedUpdateManyWithoutPerguntaInput>
  }

  export type PerguntaCreateWithoutRespostasInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imoveis?: ImovelPerguntaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateWithoutRespostasInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imoveis?: ImovelPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaCreateOrConnectWithoutRespostasInput = {
    where: PerguntaWhereUniqueInput
    create: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
  }

  export type UserCreateWithoutRespostasInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtora?: ConstrutoraCreateNestedOneWithoutUsuariosInput
    relatorios?: RelatorioCreateNestedManyWithoutUsuarioInput
  }

  export type UserUncheckedCreateWithoutRespostasInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId?: string | null
    relatorios?: RelatorioUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UserCreateOrConnectWithoutRespostasInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRespostasInput, UserUncheckedCreateWithoutRespostasInput>
  }

  export type PerguntaUpsertWithoutRespostasInput = {
    update: XOR<PerguntaUpdateWithoutRespostasInput, PerguntaUncheckedUpdateWithoutRespostasInput>
    create: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
    where?: PerguntaWhereInput
  }

  export type PerguntaUpdateToOneWithWhereWithoutRespostasInput = {
    where?: PerguntaWhereInput
    data: XOR<PerguntaUpdateWithoutRespostasInput, PerguntaUncheckedUpdateWithoutRespostasInput>
  }

  export type PerguntaUpdateWithoutRespostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imoveis?: ImovelPerguntaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateWithoutRespostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imoveis?: ImovelPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type UserUpsertWithoutRespostasInput = {
    update: XOR<UserUpdateWithoutRespostasInput, UserUncheckedUpdateWithoutRespostasInput>
    create: XOR<UserCreateWithoutRespostasInput, UserUncheckedCreateWithoutRespostasInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRespostasInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRespostasInput, UserUncheckedUpdateWithoutRespostasInput>
  }

  export type UserUpdateWithoutRespostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtora?: ConstrutoraUpdateOneWithoutUsuariosNestedInput
    relatorios?: RelatorioUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateWithoutRespostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: NullableStringFieldUpdateOperationsInput | string | null
    relatorios?: RelatorioUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type ImovelCreateWithoutMatchesInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tipoImovel?: TipoImovelCreateNestedOneWithoutImoveisInput
    construtora: ConstrutoraCreateNestedOneWithoutImoveisInput
    perguntas?: ImovelPerguntaCreateNestedManyWithoutImovelInput
  }

  export type ImovelUncheckedCreateWithoutMatchesInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelId?: string | null
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId: string
    perguntas?: ImovelPerguntaUncheckedCreateNestedManyWithoutImovelInput
  }

  export type ImovelCreateOrConnectWithoutMatchesInput = {
    where: ImovelWhereUniqueInput
    create: XOR<ImovelCreateWithoutMatchesInput, ImovelUncheckedCreateWithoutMatchesInput>
  }

  export type RelatorioCreateWithoutMatchesInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    usuario: UserCreateNestedOneWithoutRelatoriosInput
  }

  export type RelatorioUncheckedCreateWithoutMatchesInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type RelatorioCreateOrConnectWithoutMatchesInput = {
    where: RelatorioWhereUniqueInput
    create: XOR<RelatorioCreateWithoutMatchesInput, RelatorioUncheckedCreateWithoutMatchesInput>
  }

  export type ImovelUpsertWithoutMatchesInput = {
    update: XOR<ImovelUpdateWithoutMatchesInput, ImovelUncheckedUpdateWithoutMatchesInput>
    create: XOR<ImovelCreateWithoutMatchesInput, ImovelUncheckedCreateWithoutMatchesInput>
    where?: ImovelWhereInput
  }

  export type ImovelUpdateToOneWithWhereWithoutMatchesInput = {
    where?: ImovelWhereInput
    data: XOR<ImovelUpdateWithoutMatchesInput, ImovelUncheckedUpdateWithoutMatchesInput>
  }

  export type ImovelUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoImovel?: TipoImovelUpdateOneWithoutImoveisNestedInput
    construtora?: ConstrutoraUpdateOneRequiredWithoutImoveisNestedInput
    perguntas?: ImovelPerguntaUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: StringFieldUpdateOperationsInput | string
    perguntas?: ImovelPerguntaUncheckedUpdateManyWithoutImovelNestedInput
  }

  export type RelatorioUpsertWithoutMatchesInput = {
    update: XOR<RelatorioUpdateWithoutMatchesInput, RelatorioUncheckedUpdateWithoutMatchesInput>
    create: XOR<RelatorioCreateWithoutMatchesInput, RelatorioUncheckedCreateWithoutMatchesInput>
    where?: RelatorioWhereInput
  }

  export type RelatorioUpdateToOneWithWhereWithoutMatchesInput = {
    where?: RelatorioWhereInput
    data: XOR<RelatorioUpdateWithoutMatchesInput, RelatorioUncheckedUpdateWithoutMatchesInput>
  }

  export type RelatorioUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UserUpdateOneRequiredWithoutRelatoriosNestedInput
  }

  export type RelatorioUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateWithoutRelatoriosInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtora?: ConstrutoraCreateNestedOneWithoutUsuariosInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
  }

  export type UserUncheckedCreateWithoutRelatoriosInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId?: string | null
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UserCreateOrConnectWithoutRelatoriosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRelatoriosInput, UserUncheckedCreateWithoutRelatoriosInput>
  }

  export type MatchCreateWithoutRelatorioInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    imovel: ImovelCreateNestedOneWithoutMatchesInput
  }

  export type MatchUncheckedCreateWithoutRelatorioInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
  }

  export type MatchCreateOrConnectWithoutRelatorioInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutRelatorioInput, MatchUncheckedCreateWithoutRelatorioInput>
  }

  export type MatchCreateManyRelatorioInputEnvelope = {
    data: MatchCreateManyRelatorioInput | MatchCreateManyRelatorioInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRelatoriosInput = {
    update: XOR<UserUpdateWithoutRelatoriosInput, UserUncheckedUpdateWithoutRelatoriosInput>
    create: XOR<UserCreateWithoutRelatoriosInput, UserUncheckedCreateWithoutRelatoriosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRelatoriosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRelatoriosInput, UserUncheckedUpdateWithoutRelatoriosInput>
  }

  export type UserUpdateWithoutRelatoriosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtora?: ConstrutoraUpdateOneWithoutUsuariosNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateWithoutRelatoriosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: NullableStringFieldUpdateOperationsInput | string | null
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type MatchUpsertWithWhereUniqueWithoutRelatorioInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutRelatorioInput, MatchUncheckedUpdateWithoutRelatorioInput>
    create: XOR<MatchCreateWithoutRelatorioInput, MatchUncheckedCreateWithoutRelatorioInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutRelatorioInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutRelatorioInput, MatchUncheckedUpdateWithoutRelatorioInput>
  }

  export type MatchUpdateManyWithWhereWithoutRelatorioInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutRelatorioInput>
  }

  export type ConstrutoraCreateWithoutImoveisMetadataInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutConstrutoraInput
    imoveis?: ImovelCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraUncheckedCreateWithoutImoveisMetadataInput = {
    id?: string
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: string
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutConstrutoraInput
    imoveis?: ImovelUncheckedCreateNestedManyWithoutConstrutoraInput
  }

  export type ConstrutoraCreateOrConnectWithoutImoveisMetadataInput = {
    where: ConstrutoraWhereUniqueInput
    create: XOR<ConstrutoraCreateWithoutImoveisMetadataInput, ConstrutoraUncheckedCreateWithoutImoveisMetadataInput>
  }

  export type ConstrutoraUpsertWithoutImoveisMetadataInput = {
    update: XOR<ConstrutoraUpdateWithoutImoveisMetadataInput, ConstrutoraUncheckedUpdateWithoutImoveisMetadataInput>
    create: XOR<ConstrutoraCreateWithoutImoveisMetadataInput, ConstrutoraUncheckedCreateWithoutImoveisMetadataInput>
    where?: ConstrutoraWhereInput
  }

  export type ConstrutoraUpdateToOneWithWhereWithoutImoveisMetadataInput = {
    where?: ConstrutoraWhereInput
    data: XOR<ConstrutoraUpdateWithoutImoveisMetadataInput, ConstrutoraUncheckedUpdateWithoutImoveisMetadataInput>
  }

  export type ConstrutoraUpdateWithoutImoveisMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutConstrutoraNestedInput
    imoveis?: ImovelUpdateManyWithoutConstrutoraNestedInput
  }

  export type ConstrutoraUncheckedUpdateWithoutImoveisMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    endereco?: StringFieldUpdateOperationsInput | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutConstrutoraNestedInput
    imoveis?: ImovelUncheckedUpdateManyWithoutConstrutoraNestedInput
  }

  export type ImovelCreateWithoutPerguntasInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tipoImovel?: TipoImovelCreateNestedOneWithoutImoveisInput
    construtora: ConstrutoraCreateNestedOneWithoutImoveisInput
    matches?: MatchCreateNestedManyWithoutImovelInput
  }

  export type ImovelUncheckedCreateWithoutPerguntasInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelId?: string | null
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId: string
    matches?: MatchUncheckedCreateNestedManyWithoutImovelInput
  }

  export type ImovelCreateOrConnectWithoutPerguntasInput = {
    where: ImovelWhereUniqueInput
    create: XOR<ImovelCreateWithoutPerguntasInput, ImovelUncheckedCreateWithoutPerguntasInput>
  }

  export type PerguntaCreateWithoutImoveisInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateWithoutImoveisInput = {
    id?: string
    texto: string
    tipo: string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem: number
    categoria: string
    fluxo: string
    pontuacao?: number
    obrigatoria?: boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: boolean
    ativa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaCreateOrConnectWithoutImoveisInput = {
    where: PerguntaWhereUniqueInput
    create: XOR<PerguntaCreateWithoutImoveisInput, PerguntaUncheckedCreateWithoutImoveisInput>
  }

  export type ImovelUpsertWithoutPerguntasInput = {
    update: XOR<ImovelUpdateWithoutPerguntasInput, ImovelUncheckedUpdateWithoutPerguntasInput>
    create: XOR<ImovelCreateWithoutPerguntasInput, ImovelUncheckedCreateWithoutPerguntasInput>
    where?: ImovelWhereInput
  }

  export type ImovelUpdateToOneWithWhereWithoutPerguntasInput = {
    where?: ImovelWhereInput
    data: XOR<ImovelUpdateWithoutPerguntasInput, ImovelUncheckedUpdateWithoutPerguntasInput>
  }

  export type ImovelUpdateWithoutPerguntasInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoImovel?: TipoImovelUpdateOneWithoutImoveisNestedInput
    construtora?: ConstrutoraUpdateOneRequiredWithoutImoveisNestedInput
    matches?: MatchUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateWithoutPerguntasInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: StringFieldUpdateOperationsInput | string
    matches?: MatchUncheckedUpdateManyWithoutImovelNestedInput
  }

  export type PerguntaUpsertWithoutImoveisInput = {
    update: XOR<PerguntaUpdateWithoutImoveisInput, PerguntaUncheckedUpdateWithoutImoveisInput>
    create: XOR<PerguntaCreateWithoutImoveisInput, PerguntaUncheckedCreateWithoutImoveisInput>
    where?: PerguntaWhereInput
  }

  export type PerguntaUpdateToOneWithWhereWithoutImoveisInput = {
    where?: PerguntaWhereInput
    data: XOR<PerguntaUpdateWithoutImoveisInput, PerguntaUncheckedUpdateWithoutImoveisInput>
  }

  export type PerguntaUpdateWithoutImoveisInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateWithoutImoveisInput = {
    id?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    opcoes?: NullableJsonNullValueInput | InputJsonValue
    ordem?: IntFieldUpdateOperationsInput | number
    categoria?: StringFieldUpdateOperationsInput | string
    fluxo?: StringFieldUpdateOperationsInput | string
    pontuacao?: IntFieldUpdateOperationsInput | number
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    condicional?: NullableJsonNullValueInput | InputJsonValue
    geradaPorIA?: BoolFieldUpdateOperationsInput | boolean
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type ImovelCreateManyTipoImovelInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    construtoraId: string
  }

  export type ImovelUpdateWithoutTipoImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtora?: ConstrutoraUpdateOneRequiredWithoutImoveisNestedInput
    matches?: MatchUpdateManyWithoutImovelNestedInput
    perguntas?: ImovelPerguntaUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateWithoutTipoImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: StringFieldUpdateOperationsInput | string
    matches?: MatchUncheckedUpdateManyWithoutImovelNestedInput
    perguntas?: ImovelPerguntaUncheckedUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateManyWithoutTipoImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    construtoraId?: StringFieldUpdateOperationsInput | string
  }

  export type RespostaCreateManyUsuarioInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntaId: string
  }

  export type RelatorioCreateManyUsuarioInput = {
    id?: string
    resumo: string
    pdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaUpdateWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pergunta?: PerguntaUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntaId?: StringFieldUpdateOperationsInput | string
  }

  export type RespostaUncheckedUpdateManyWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntaId?: StringFieldUpdateOperationsInput | string
  }

  export type RelatorioUpdateWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUpdateManyWithoutRelatorioNestedInput
  }

  export type RelatorioUncheckedUpdateWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUncheckedUpdateManyWithoutRelatorioNestedInput
  }

  export type RelatorioUncheckedUpdateManyWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumo?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyConstrutoraInput = {
    id?: string
    name: string
    email: string
    password: string
    telefone?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImovelCreateManyConstrutoraInput = {
    id?: string
    idExternoAPI?: string | null
    titulo: string
    descricao: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    vagas: number
    latitude: number
    longitude: number
    telefoneContato?: string | null
    endereco: string
    fotoPrincipal?: string | null
    galeriaFotos?: ImovelCreategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelCreatecaracteristicasArrayInput | string[]
    tipoImovelId?: string | null
    tipoImovelNome?: string | null
    status?: string | null
    ativo?: boolean
    destaque?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImovelMetadataCreateManyConstrutoraInput = {
    id?: string
    imovelIdExterno: string
    telefone?: string
    observacoes?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    relatorios?: RelatorioUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    relatorios?: RelatorioUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateManyWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelUpdateWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoImovel?: TipoImovelUpdateOneWithoutImoveisNestedInput
    matches?: MatchUpdateManyWithoutImovelNestedInput
    perguntas?: ImovelPerguntaUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchUncheckedUpdateManyWithoutImovelNestedInput
    perguntas?: ImovelPerguntaUncheckedUpdateManyWithoutImovelNestedInput
  }

  export type ImovelUncheckedUpdateManyWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    idExternoAPI?: NullableStringFieldUpdateOperationsInput | string | null
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    preco?: FloatFieldUpdateOperationsInput | number
    area?: FloatFieldUpdateOperationsInput | number
    quartos?: IntFieldUpdateOperationsInput | number
    banheiros?: IntFieldUpdateOperationsInput | number
    vagas?: IntFieldUpdateOperationsInput | number
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    telefoneContato?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: StringFieldUpdateOperationsInput | string
    fotoPrincipal?: NullableStringFieldUpdateOperationsInput | string | null
    galeriaFotos?: ImovelUpdategaleriaFotosInput | string[]
    caracteristicas?: NullableJsonNullValueInput | InputJsonValue
    caracteristicasArray?: ImovelUpdatecaracteristicasArrayInput | string[]
    tipoImovelId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoImovelNome?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    destaque?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelMetadataUpdateWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelMetadataUncheckedUpdateWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImovelMetadataUncheckedUpdateManyWithoutConstrutoraInput = {
    id?: StringFieldUpdateOperationsInput | string
    imovelIdExterno?: StringFieldUpdateOperationsInput | string
    telefone?: StringFieldUpdateOperationsInput | string
    observacoes?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateManyImovelInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    relatorioId?: string | null
  }

  export type ImovelPerguntaCreateManyImovelInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntaId: string
  }

  export type MatchUpdateWithoutImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relatorio?: RelatorioUpdateOneWithoutMatchesNestedInput
  }

  export type MatchUncheckedUpdateWithoutImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relatorioId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchUncheckedUpdateManyWithoutImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relatorioId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImovelPerguntaUpdateWithoutImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pergunta?: PerguntaUpdateOneRequiredWithoutImoveisNestedInput
  }

  export type ImovelPerguntaUncheckedUpdateWithoutImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntaId?: StringFieldUpdateOperationsInput | string
  }

  export type ImovelPerguntaUncheckedUpdateManyWithoutImovelInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntaId?: StringFieldUpdateOperationsInput | string
  }

  export type RespostaCreateManyPerguntaInput = {
    id?: string
    valor: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type ImovelPerguntaCreateManyPerguntaInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
  }

  export type RespostaUpdateWithoutPerguntaInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UserUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateWithoutPerguntaInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type RespostaUncheckedUpdateManyWithoutPerguntaInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type ImovelPerguntaUpdateWithoutPerguntaInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovel?: ImovelUpdateOneRequiredWithoutPerguntasNestedInput
  }

  export type ImovelPerguntaUncheckedUpdateWithoutPerguntaInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
  }

  export type ImovelPerguntaUncheckedUpdateManyWithoutPerguntaInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
  }

  export type MatchCreateManyRelatorioInput = {
    id?: string
    porcentagem: number
    posicaoRanking: number
    destaque?: boolean
    criterios: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    imovelId: string
  }

  export type MatchUpdateWithoutRelatorioInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovel?: ImovelUpdateOneRequiredWithoutMatchesNestedInput
  }

  export type MatchUncheckedUpdateWithoutRelatorioInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
  }

  export type MatchUncheckedUpdateManyWithoutRelatorioInput = {
    id?: StringFieldUpdateOperationsInput | string
    porcentagem?: FloatFieldUpdateOperationsInput | number
    posicaoRanking?: IntFieldUpdateOperationsInput | number
    destaque?: BoolFieldUpdateOperationsInput | boolean
    criterios?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imovelId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}