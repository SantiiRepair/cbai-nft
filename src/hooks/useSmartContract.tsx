import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { cbai } from "../contracts/parsedAbi/cbai";
// import { useWallet } from "../providers/WalletProvider";
import { Toast } from "../modules/components/Toast";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";

// const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESS;

interface MintProps {
  amount: number;
  isAdmin: boolean;
  isWhitelist: boolean;
}

export const useSmartContract = () => {
  const toast = useToast();
  const { active, activateBrowserWallet } = useEthers();
  // const { conn } = useWallet();
  const [currentSupplyValue, setCurrentSupplyValue] = useState(null);
  const [totalSupplyValue, setTotalSupplyValue] = useState(null);
  const [nftCost, setNftCost] = useState(0);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  const baseLink =
    process.env.NEXT_PUBLIC_CHAIN_ID === "5"
      ? "https://goerli.etherscan.io"
      : "https://etherscan.io";

  let provider: ethers.providers.Web3Provider | undefined;
  let contract: ethers.Contract | undefined;
  let txhash: string;

  /* async function initializeEngine() {
 
     if (contract && conn && !currentSupplyValue && !totalSupplyValue) {
       const contractCurrentSupply = await contract!.getCurrentSupply()
 
       setCurrentSupplyValue(contractCurrentSupply);
 
       const contractTotalSupply = await contract!.getTotalSupply()
       setTotalSupplyValue(contractTotalSupply);
 
       const contractNftCost = await contract!.getNFTCost();
       setNftCost(contractNftCost);
     }
   } */

  async function initState() {
    try {
      if (active) {
        if (typeof globalThis.window?.ethereum != "undefined") {
          provider = new ethers.providers.Web3Provider(
            globalThis.window?.ethereum as any
          );
          console.log({ provider });
          const signer = provider.getSigner();
          contract = new ethers.Contract(
            cbai.toString(),
            contractAddress!,
            signer
          );
          console.log({ contract });
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
    await initState();
    setIsLoadingTransaction(false);

    let txHash: string;
    try {
      if (isWhitelist) {
        setIsLoadingTransaction(true);
        const whitelistMint = await contract?.whitelistMint(amount);
        await whitelistMint.wait().then((receipt: any) => {
          txhash = receipt.transactionHash;
          return receipt.transactionHash;
        });
      } else {
        setIsLoadingTransaction(true);
        const mint = await contract?.mint(amount);
        await mint.wait().then((receipt: any) => {
          txhash = receipt.transactionHash;
          return receipt.transactionHash;
        });
      }

      const contractCurrentSupply = await contract!.getCurrentSupply();

      setCurrentSupplyValue(contractCurrentSupply);
      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Transaction successful!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txHash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/${txHash!}`,
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
          status: `😥 Something went wrong, check error at Etherscan: https://etherscan.io/tx/${error.receipt.transactionHash}`,
        };
      }
    }
  }

  async function requestAddToWhitelist(address: string) {
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
        status: `Failed to add address to whitelist, check error at Ethercan: https://etherscan.io/tx/${error.receipt.transactionHash}`,
      };
    }
  }

  async function requestAddToBlacklist(address: string) {
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
      const contractTotalSupply = await contract!.getTotalSupply();
      setTotalSupplyValue(contractTotalSupply);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed supply!"}
            message={"Check out your transaction on Etherscan:"}
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
              message={"😥 Something went wrong, check error at Etherscan!"}
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
