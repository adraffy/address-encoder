import type { Subtract } from "ts-arithmetic";
import type * as formats from "./coins.js";
import type {
  coinNameToTypeMap,
  evmCoinNameToTypeMap,
  nonEvmCoinNameToTypeMap,
} from "./consts/coinNameToTypeMap.js";
import type { coinTypeToNameMap } from "./consts/coinTypeToNameMap.js";
import type { SLIP44_MSB } from "./utils/evm.js";

export type Formats = typeof formats;

export type CoinNameToTypeMap = typeof coinNameToTypeMap;
export type CoinTypeToNameMap = typeof coinTypeToNameMap;

export type CoinName = keyof CoinNameToTypeMap;
export type CoinType = CoinNameToTypeMap[CoinName];
type NonEvmCoinTypeToFormat = {
  [key in keyof Formats as Formats[key]["coinType"]]: Formats[key];
};
export type CoinTypeToFormatMap = {
  [key in CoinType]: key extends EvmCoinType
    ? Prettify<GetEvmCoin<CoinTypeToNameMap[`${key}`][0]>>
    : key extends keyof NonEvmCoinTypeToFormat
    ? NonEvmCoinTypeToFormat[key]
    : never;
};
export type CoinNameToFormatMap = {
  [key in CoinName]: CoinTypeToFormatMap[CoinNameToTypeMap[key]];
};

export type EvmCoinMap = typeof evmCoinNameToTypeMap;
export type EvmCoinName = keyof EvmCoinMap;
export type EvmCoinType = EvmCoinMap[EvmCoinName];
export type EvmChainId = Subtract<EvmCoinType, typeof SLIP44_MSB>;

export type GetEvmCoin<
  TEvmName extends EvmCoinName,
  TCoinType extends CoinNameToTypeMap[TEvmName] = CoinNameToTypeMap[TEvmName]
> = {
  name: TEvmName;
  coinType: TCoinType;
  evmChainId: Subtract<TCoinType, typeof SLIP44_MSB>;
  encode: EncoderFunction;
  decode: DecoderFunction;
};

export type EncoderFunction = (source: Uint8Array) => string;
export type DecoderFunction = (source: string) => Uint8Array;

export type CoinParameters = {
  name: string;
  coinType: number;
  evmChainId?: number;
};

export type CoinCoder = {
  encode: EncoderFunction;
  decode: DecoderFunction;
};

export type Coin = CoinParameters & CoinCoder;

export type CheckedCoin = {
  [key in keyof typeof nonEvmCoinNameToTypeMap]: {
    name: key;
    coinType: (typeof nonEvmCoinNameToTypeMap)[key];
  } & CoinCoder;
}[keyof typeof nonEvmCoinNameToTypeMap];

export type GetCoderByCoinName<TCoinName extends CoinName | string> =
  TCoinName extends CoinName ? CoinNameToFormatMap[TCoinName] : Coin;

export type GetCoderByCoinType<TCoinType extends CoinType | number> =
  TCoinType extends CoinType ? CoinTypeToFormatMap[TCoinType] : Coin;

export type ParseInt<T> = T extends `${infer N extends number}` ? N : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
