import {Contract, ethers, TransactionReceipt, TransactionResponse, parseEther, BaseContract} from "ethers";
import {config} from "../config";
import Reactions from "./Reactions.json"

export const defaultProvider = new ethers.JsonRpcProvider(
  config.defaultRPC
)

export interface CallbackProps {
  onTransactionHash?: (txHash: string) => void
  onFailed?: (error: Error, flag?: boolean) => void
  onSuccess?: (tx: TransactionReceipt) => void
}

export interface SendProps extends CallbackProps {
  amount?: string,
  methodName: string
  parameters: unknown[]
}

export type SendResult = {
  txReceipt: TransactionReceipt
  error: null
} | {
  txReceipt: null
  error: Error
}

export enum WidgetType {
  INLINE_REACT_SINGLE = 0,
  INLINE_REACT = 1,
}

interface CreateWidgetProps extends CallbackProps {
  widgetType: WidgetType
}

interface CreateReactionProps extends CallbackProps {
  widgetId: string,
  emojiId: number,
}

interface ChangeReactionProps extends CallbackProps {
  widgetId: string,
  emojiId: number,
}

interface RemoveReactionProps extends CallbackProps {
  widgetId: string,
}

export interface Widget {
  id: bigint;
  widgetType: number;
  ownerAddress: string;
}

export interface Reaction {
  emojiId: number;
  widgetId: number;
  ownerAddress: string;
}

export const createROClient = () => {
  const contractReadOnly = new Contract(
    config.contractAddress,
    Reactions,
    defaultProvider
  )

  return {
    loadWidget: async ({widgetId}: {widgetId: number}): Promise<unknown> => {
      return contractReadOnly.getWidget(widgetId)
    },

    loadReactions: async () => {
      const reactionList = await contractReadOnly.getWidgetReactions();
      console.log('### reactions', reactionList);
      return reactionList;
    },
  }
}

export const contractReadOnly = new Contract(
  config.contractAddress,
  Reactions,
  defaultProvider
)

export const createReactionClient = async ({provider, address}: {provider?: unknown, address?: `0x${string}`}) => {
  // @ts-ignore
  const browserProvider = new ethers.BrowserProvider(provider)

  // @ts-ignore
  const signer = await browserProvider.getSigner();
  const contract = contractReadOnly.connect(signer);

  return new ReactionClient({contract, contractReadOnly})
}

export class ReactionClient {
  contract: BaseContract;
  contractReadOnly: Contract

  constructor({contract, contractReadOnly}: { contract: BaseContract, contractReadOnly: Contract}) {
    this.contract = contract;
    this.contractReadOnly = contractReadOnly;
  }

  async send({
                  amount,
                  onFailed,
                  onTransactionHash = () => {},
                  onSuccess,
                  methodName,
                  parameters,
                }: SendProps): Promise<SendResult> {
    try {
      console.log('send', amount, parameters)
      // @ts-ignore
      const txResponse = (await this.contract[methodName](...parameters, {
        value: amount,
        // gasLimit: ethers.utils.hexlify(300000),
      })) as TransactionResponse
      onTransactionHash(txResponse.hash)

      const txReceipt = await txResponse.wait()

      if (!txReceipt) {
        throw Error('tx receipt is empty');
      }

      onSuccess && onSuccess(txReceipt)
      return { txReceipt: txReceipt, error: null }
    } catch (ex) {
      console.log('### ex', ex)
      onFailed && onFailed(ex as Error, true)
      return { txReceipt: null, error: ex as Error }
    }
  }

  async createWidget({ widgetType, onFailed, onTransactionHash, onSuccess}: CreateWidgetProps) {
    return this.send({
      onFailed,
      onSuccess,
      onTransactionHash,
      methodName: 'createWidget',
      parameters: [widgetType],
    })
  }

  async createReaction({ widgetId, emojiId, onFailed, onTransactionHash, onSuccess}: CreateReactionProps) {
    return this.send({
      onFailed,
      onSuccess,
      onTransactionHash,
      methodName: 'createReaction',
      amount: parseEther('0.1').toString(),
      parameters: [widgetId, emojiId],
    })
  }

  async changeReaction({ widgetId, emojiId, onFailed, onTransactionHash, onSuccess}: ChangeReactionProps) {
    return this.send({
      onFailed,
      onSuccess,
      onTransactionHash,
      amount: parseEther('0.1').toString(),
      methodName: 'changeReaction',
      parameters: [widgetId, emojiId],
    })
  }

  async removeReaction({ widgetId, onFailed, onTransactionHash, onSuccess}: RemoveReactionProps) {
    return this.send({
      onFailed,
      onSuccess,
      onTransactionHash,
      amount: parseEther('0.1').toString(),
      methodName: 'removeReaction',
      parameters: [widgetId],
    })
  }

  async loadMyWidgetList(): Promise<unknown> {
    // @ts-ignore
    const widgetList = await this.contract.getMyWidgets()
    return widgetList
  }

  async loadWidget({widgetId}: {widgetId: number}): Promise<unknown> {
    return this.contractReadOnly.getWidget(widgetId)
  }

  async loadReactions({widgetId}: {widgetId: number}) {
    const reactionList = await this.contractReadOnly.getWidgetReactions(widgetId);
    console.log('### reactions', reactionList);
    return reactionList;
  }
}