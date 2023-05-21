import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { cbai } from "../contracts/parsedAbi/cbai";
import { Toast } from "../modules/components/Toast";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";

interface MintProps {
  amount: number;
  isAdmin: boolean;
  isWhitelist: boolean;
}

export const useSmartContract = () => {
  const contractAddress = "0x2727206a77140749A950BD11Ab29EF207F249908";
  const toast = useToast();
  const { active, activateBrowserWallet } = useEthers();
  const [nftCost, setNftCost] = useState(0);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  let baseLink: string;
  let provider: ethers.providers.Web3Provider;
  let contract: ethers.Contract;
  let txhash: string;

  function getBlockExplorerUrl(chainId: number): string {
    switch (chainId) {
      case 1:
        return "https://etherscan.io";
      case 3:
        return "https://ropsten.etherscan.io";
      case 4:
        return "https://rinkeby.etherscan.io";
      case 5:
        return "https://goerli.etherscan.io";
      case 42:
        return "https://kovan.etherscan.io";
      case 56:
        return "https://bscscan.com";
      case 97:
        return "https://testnet.bscscan.com";
      case 11155111:
        return "https://sepolia.etherscan.io";
      default:
        return "";
    }
  }

  async function getParams() {
    try {
      if (active) {
        if (typeof globalThis.window?.ethereum != "undefined") {
          console.log({ active });
          provider = new ethers.providers.Web3Provider(
            globalThis.window?.ethereum as any
          );
          console.log({ provider });
          const signer = provider.getSigner();
          contract = new ethers.Contract(contractAddress, cbai, signer);
          console.log({ contract });
          const network = await provider.getNetwork();
          const chainId = network.chainId;
          const blockExplorerUrl = getBlockExplorerUrl(chainId);
          baseLink = blockExplorerUrl;
        }
        return;
      } else {
        activateBrowserWallet();
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  async function requestMint({ amount, isWhitelist }: MintProps) {
    await getParams();
    setIsLoadingTransaction(false);
    try {
      if (isWhitelist) {
        setIsLoadingTransaction(true);
        const whitelistMint = await contract!.whitelistMint(amount);
        await whitelistMint.wait().then((receipt: any) => {
          txhash = receipt.transactionHash;
          return receipt.transactionHash;
        });
      } else {
        setIsLoadingTransaction(true);
        const mint = await contract!.mint(amount);
        await mint.wait().then((receipt: any) => {
          txhash = receipt.transactionHash;
          return receipt.transactionHash;
        });
      }

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Transaction successful!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: `✅ Check out your transaction on Explorer: ${baseLink}/tx/${txhash}`,
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      console.error(error);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Transaction failed."}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
        return {
          success: false,
          status: `😥 Something went wrong, check error at Explorer: ${baseLink}/tx/${error.receipt.transactionHash}`,
        };
      }
    }
  }

  async function requestAddToWhitelist(address: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const singleAddToWhitelist = await contract!.singleAddToWhitelist(
        address
      );
      await singleAddToWhitelist.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully added address to whitelist!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully added address to whitelist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to add to whitelist!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: `Failed to add address to whitelist, check error at Explorer: ${baseLink}/tx/${error.receipt.transactionHash}`,
      };
    }
  }

  async function requestAddToBlacklist(address: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const singleAddToBlacklist = await contract!.singleAddToBlacklist(
        address
      );
      await singleAddToBlacklist.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully added address to blacklist!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully added address to blacklist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to add to blacklist!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: "Failed to add address to blacklist: " + error.message,
      };
    }
  }

  async function requestRemoveFromWhitelist(address: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const singleRemoveFromWhitelist =
        await contract!.singleRemoveFromWhitelist(address);
      await singleRemoveFromWhitelist.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully removed address from whitelist!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully removed address from whitelist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to remove address from whitelist!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: "Failed to remove address from whitelist: " + error.message,
      };
    }
  }

  async function requestRemoveFromBlacklist(address: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const singleRemoveFromBlacklist =
        await contract!.singleRemoveFromBlacklist(address);
      await singleRemoveFromBlacklist.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully removed address from blacklist!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully removed address from blacklist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to remove address from blacklist!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: "Failed to remove address from whitelist: " + error.message,
      };
    }
  }

  async function withdraw() {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const withdraw = await contract!.withdraw();
      await withdraw.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully withdrew from contract!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully withdrew from contract",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to withdrawn!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message:
          "An error ocurred while withdrawing from contract: " + error.message,
      };
    }
  }

  async function activatePublicSale(state: boolean) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const adminManageSaleState = await contract!.adminManageSaleState(state);
      await adminManageSaleState.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully managed public sale!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully managed public sale",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to manage whitelist sale!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message:
          "An error ocurred while managing whitelist sale: " + error.message,
      };
    }
  }

  async function activateWhitelist(state: boolean) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const adminManageWhitelistState =
        await contract!.adminManageWhitelistState(state);
      await adminManageWhitelistState.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully managed whitelist!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully managed whitelist sale ",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to manage whitelist state!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message:
          "An error ocurred while managing whitelist sale: " + error.message,
      };
    }
  }

  async function changeOwnership(ownerAddress: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const transferOwnership = await contract!.transferOwnership(ownerAddress);
      await transferOwnership.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed owner!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed owner",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to change owner!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing owner: " + error.message,
      };
    }
  }

  async function setBaseUri(baseUri: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const setBaseURI = await contract!.setBaseURI(baseUri);
      await setBaseURI.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed base URI!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed base URI",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to change base URI!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing base URI: " + error.message,
      };
    }
  }

  async function manageNFTCost(newCost: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const setNFTCost = await contract!.setNFTCost(newCost);
      await setNFTCost.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      const contractNftCost = await contract!.getNFTCost();
      setNftCost(contractNftCost);

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed NFT Cost!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed NFT Cost",
      };
    } catch (error: any) {
      console.log({ error });
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to change NFT Cost!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing NFT Cost: " + error.message,
      };
    }
  }

  async function manageSupply(newSupply: string) {
    await getParams();
    setIsLoadingTransaction(true);
    try {
      const adminIncreaseMaxSupply = await contract!.adminIncreaseMaxSupply(
        newSupply
      );
      await adminIncreaseMaxSupply.wait().then((receipt: any) => {
        txhash = receipt.transactionHash;
        return receipt.transactionHash;
      });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed supply!"}
            message={"Check out your transaction on Explorer:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed supply",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to manage supply!"}
              message={"😥 Something went wrong, check error at Explorer!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing supply: " + error.message,
      };
    }
  }

  async function currentSupplyValue(): Promise<number> {
    await getParams();
    try {
      const contractCurrentSupply = await contract!.getCurrentSupply();
      return contractCurrentSupply;
    } catch (error: any) {
      console.error(error);
      return 0;
    }
  }

  async function totalSupplyValue(): Promise<number> {
    await getParams();
    try {
      const contractTotalSupply = await contract!.getTotalSupply();
      return contractTotalSupply;
    } catch (error: any) {
      console.error(error);
      return 0;
    }
  }

  return {
    requestMint,
    isLoadingTransaction,
    totalSupplyValue,
    currentSupplyValue,
    requestAddToWhitelist,
    requestAddToBlacklist,
    requestRemoveFromWhitelist,
    requestRemoveFromBlacklist,
    withdraw,
    activatePublicSale,
    activateWhitelist,
    changeOwnership,
    setBaseUri,
    manageNFTCost,
    nftCost,
    manageSupply,
  };
};
