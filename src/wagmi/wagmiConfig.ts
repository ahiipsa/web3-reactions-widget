import {Chain, configureChains, createConfig} from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'
import {config} from "../config";

const chains: Chain[] = [config.chainParameters]
const chainConfig = configureChains(chains, [
  publicProvider(),
])

export const metamaskConnector = new MetaMaskConnector({ chains })
export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [metamaskConnector],
  publicClient: chainConfig.publicClient,
})
