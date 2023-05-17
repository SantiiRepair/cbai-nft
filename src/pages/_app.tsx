import Head from "next/head";
import { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Config, DAppProvider, Mainnet } from "@usedapp/core";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Fonts from "fonts";
import theme from "theme";
import { WalletProvider } from "../providers/WalletProvider";
import { Header } from "../modules/components/Header";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const config: Config = {
    readOnlyChainId: Number(process.env.MAINNET_CHAIN_ID!) || Number(process.env.SEPOLIA_CHAIN_ID!),
    readOnlyUrls: {
    [Mainnet.chainId]:  process.env.MAINNET_RPC! || process.env.SEPOLIA_RPC!,
    },
    autoConnect: true,
  };

  return (
    <ChakraProvider resetCSS theme={theme}>
      <DAppProvider config={config}>
        <WalletProvider>
          <Head>
            <title>CAI NFT</title>
            <link rel="shortcut icon" href="/img/logo.svg" />
            <link rel="apple-touch-icon" href="/img/logo.svg" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="description" content="CAI NFT" />
          </Head>

          <Fonts />

          <Flex direction={"column"}>
            <Header logo="/img/logo.svg" />
            <Component {...pageProps} />
          </Flex>
        </WalletProvider>
      </DAppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
